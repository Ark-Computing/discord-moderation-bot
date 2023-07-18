const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const Sequelize = require("sequelize");

const Warns = require("../../models/warns");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
    logging: false,
});

const Warnings = Warns(sequelize, Sequelize.DataTypes);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription(
            "Warn a user for breaking the rules. Usage: /warn @user"
        )
        .addMentionableOption((option) =>
            option
                .setName("user")
                .setDescription("The user to warn")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("The reason for warning the user")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const user = interaction.options.getMentionable("user");
        const reason = interaction.options.getString("reason");
        const member = interaction.guild.members.cache.get(user.id);
        const author = interaction.member;

        if (!member) {
            await interaction.reply("That user is not in this server.");
            return;
        } else if (member.id === author.id) {
            await interaction.reply("You cannot warn yourself.");
            return;
        } else if (
            member.roles.highest.position >= author.roles.highest.position
        ) {
            await interaction.reply(
                "You cannot warn someone with a higher or equal role."
            );
            return;
        } else if (!member.manageable) {
            await interaction.reply("I cannot warn this user.");
            return;
        }

        // eslint-disable-next-line no-unused-vars
        const warn = await Warnings.create({
            userId: member.id,
            moderatorId: author.id,
            reason: reason,
        });

        await member.send({
            embeds: [
                {
                    title: "You have been warned!",
                    description: `You have been warned in ${interaction.guild.name} for ${reason}.`,
                },
            ],
        });

        const logChannel = interaction.guild.channels.cache.find(
            (channel) => channel.name === "logs"
        );

        await interaction.reply({
            embeds: [
                {
                    title: "User warned",
                    description: `${member} was warned by ${author} for ${reason}.`,
                },
            ],
        });

        if (logChannel) {
            await logChannel.send({
                embeds: [
                    {
                        title: "User warned",
                        description: `${member} was warned by ${author} for ${reason}.`,
                    },
                ],
            });
        } else {
            await interaction.guild.owner.send({
                embeds: [{
                    title: "Please create a channel called \`logs\` and allow me access."
                }]
            });
        }
    },
};

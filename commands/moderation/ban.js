const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a user. Usage: /ban @user reason")
        .addMentionableOption((option) =>
            option
                .setName("user")
                .setDescription("The user to ban")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("The reason for banning the user")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getMentionable("user");
        const reason = interaction.options.getString("reason");

        if (user) {
            const options = {
                reason: reason,
            };
            try {
                await interaction.guild.members.ban(user, options);
                interaction.reply({
                    embeds: [
                        {
                            title: `Banned ${user} for ${reason}`,
                        },
                    ],
                });
            } catch (error) {
                console.error(error);
                interaction.reply({
                    embeds: [
                        {
                            title: "An error occurred while trying to ban the user.",
                        },
                    ],
                    ephemeral: true,
                });
            }
        } else {
            interaction.reply({
                embeds: [
                    {
                        title: "That user isn't in this guild!",
                    },
              ],
              ephemeral: true
            });
        }
    },
};

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription(
            "Times out a user. Usage: /timeout @user duration(int minutes) reason"
        )
        .addMentionableOption((option) =>
            option
                .setName("user")
                .setDescription("The user to timeout")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("duration")
                .setDescription("The duration of the timeout in minutes")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("The reason for the timeout")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

    async execute(interaction) {
        const user = interaction.options.getMentionable("user");
        const reason = interaction.options.getString("reason");
        const duration = interaction.options.getInteger("duration");
        const formattedTime = ms(duration);
        if (user) {
            if (reason) {
                await user.timeout(formattedTime, reason);
                interaction.reply({
                    embeds: [
                        {
                            title: `Timed out ${user} for ${duration} for ${reason}`,
                        },
                    ],
                });
            } else {
                await user.timeout(formattedTime);
                interaction.reply({
                    embeds: [
                        {
                            title: `Timed out ${user} for ${duration}`,
                        },
                    ],
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

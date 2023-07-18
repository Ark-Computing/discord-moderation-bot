const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Untimes out a user. Usage: /unmute @user")
        .addMentionableOption((option) =>
            option
                .setName("user")
                .setDescription("The user to unmute")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

    async execute(interaction) {
        const user = interaction.options.getMentionable("user");

        if (user) {
            try {
                user.timeout(null);
                interaction.reply({
                    embeds: [
                        {
                            title: `Unmuted ${user}`,
                        },
                    ],
                });
            } catch {
                interaction.reply({
                    embeds: [
                        {
                            title: "The user is not muted.",
                        },
                    ],
                    ephemeral: true,
                });
            }
        } else {
            interaction.reply({
                embeds: [
                    {
                        title: "That user isn't in this guild",
                    },
                ],
                ephemeral: true,
            });
        }
    },
};

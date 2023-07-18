const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unbans a user. Usage: /unban @user")
        .addMentionableOption((option) =>
            option
                .setName("user")
                .setDescription("User's ID")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getMentionable("user");

        if (user) {
            try {
                await interaction.guild.members.unban(user);
                interaction.reply({
                    embeds: [
                        {
                            title: `Unbanned ${user}`,
                        },
                    ],
                });
            } catch (error) {
                console.error(error);
                interaction.reply({
                    embeds: [
                        {
                            title: "An error occurred while trying to unban the user.",
                        },
                    ],
                    ephemeral: true
                });
            }
        } else {
            interaction.reply({
                embeds: [
                    {
                        title: 'That user isn"t banned!',
                    },
                ],
                ephemeral: true
            });
        }
    },
};

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("adduser")
        .setDescription("Add a user to a ticket")
        .addMentionableOption((option) =>
            option
                .setName("user")
                .setDescription("The user to add")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        try {
            const user = interaction.options.getMentionable("user");
            const currentChannel = interaction.channel;

            if (currentChannel) {
                if (
                    !interaction.channel.name.includes("support") &&
                    !interaction.channel.name.includes("application")
                ) {
                    interaction.reply({
                        embeds: [
                            {
                                title: "This command can only be used in a ticket channel.",
                            },
                        ],
                        ephemeral: true,
                    });
                    return;
                }
                const member = await interaction.guild.members.fetch(user.id);
                await interaction.channel.permissionOverwrites.edit(member, {
                    ViewChannel: true,
                });
                interaction.reply({
                    embeds: [
                        {
                            title: `Added ${user} to the ticket.`,
                        },
                    ],
                });
            } else {
                interaction.reply({
                    embeds: [
                        {
                            title: "This channel is not a ticket.",
                        },
                    ],
                    ephemeral: true,
                });
            }
        } catch (error) {
            console.log(error);
            interaction.reply({
                embeds: [
                    {
                        title: "Error adding user to ticket.",
                    },
                ],
                ephemeral: true,
            });
        }
    },
};

const Discord = require("discord.js")
const louritydb = require("croxydb");
const { messageLink } = require("discord.js");
// Lourity Code + Ayarlamalı + Slash Botlist Botu - PAYLAŞILMASI KESİNLİKLE YASAKTIR!!
module.exports = {
    name: "botlist-ayarla",
    description: "Botlist sistemini ayarlarsınız!",
    type: 1,
    options: [
        {
            name: "botlist-log",
            description: "Botlist log kanalını ayarlarsınız!",
            type: 7,
            required: true,
            channel_types: [0]
        },

        {
            name: "bot-rolü",
            description: "Botlara verilecek rolü ayarlarsınız!",
            type: 8,
            required: true
        },

        {
            name: "developer-rolü",
            description: "Botunu ekleyen kişilere verilecek rolü ayarlarsınız!",
            type: 8,
            required: true
        },

        {
            name: "yetkili-rolü",
            description: "Sunucunuza bot ekleyecek yetkili rolünü ayarlarsınız!",
            type: 8,
            required: true,
        },

        {
            name: "onay-kanalı",
            description: "Botlist log kanalını ayarlarsınız!",
            type: 7,
            required: true,
            channel_types: [0]
        },

        {
            name: "botekle-kanalı",
            description: "Botların eklenebileceği kanalı ayarlarsınız!",
            type: 7,
            required: true,
            channel_types: [0]
        },

        {
            name: "ayrıldı-log",
            description: "Sunucu sahipleri çıktığında atılacak mesajın log kanalını ayarlarsınız!",
            type: 7,
            required: true,
            channel_types: [0]
        }

    ],
    run: async (client, interaction) => {

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setTitle("Yetersiz Yetki!")
            .setDescription("> Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")
            .setFooter({ text: "Lourity Tester" })

        if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        const row1 = new Discord.ActionRowBuilder()

            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("⚙️")
                    .setLabel("Ayarlar")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setCustomId("ayarlar")
            )

            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("🗑️")
                    .setLabel("Sistemi Sıfırla")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("kapat")
            )

        const basarili = new Discord.EmbedBuilder()
            .setColor("Green")
            .setTitle("Başarıyla Ayarlandı!")
            .setDescription("Botlist sistemi başarıyla ayarlandı!")
            .setFooter({ text: "Lourity Tester" })
        interaction.reply({ embeds: [basarili], components: [row1] })

        const log = interaction.options.getChannel('botlist-log')
        const botRol = interaction.options.getRole('bot-rolü')
        const devRol = interaction.options.getRole('developer-rolü')
        const adminRol = interaction.options.getRole('yetkili-rolü')
        const onay = interaction.options.getChannel('onay-kanalı')
        const botekle = interaction.options.getChannel('botekle-kanalı')
        const ayrildiLog = interaction.options.getChannel('ayrıldı-log')

        louritydb.set(`log_${interaction.guild.id}`, log.id)
        louritydb.set(`botRol_${interaction.guild.id}`, botRol.id)
        louritydb.set(`devRol_${interaction.guild.id}`, devRol.id)
        louritydb.set(`adminRol_${interaction.guild.id}`, adminRol.id)
        louritydb.set(`onay_${interaction.guild.id}`, onay.id)
        louritydb.set(`botekle_${interaction.guild.id}`, botekle.id)
        louritydb.set(`ayrildiLog_${interaction.guild.id}`, ayrildiLog.id)
    }
}
// Lourity Code + Ayarlamalı + Slash Botlist Botu - PAYLAŞILMASI KESİNLİKLE YASAKTIR!!
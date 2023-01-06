const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const Discord = require("discord.js")
const louritydb = require("croxydb")
const client = new Client({
    intents: INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});

// Lourity Code + Ayarlamalı + Slash Botlist Botu - PAYLAŞILMASI KESİNLİKLE YASAKTIR!!

global.client = client;
client.commands = (global.commands = []);

const { readdirSync } = require("fs")
const { TOKEN } = require("./config.json");
const botlist = require("./commands/botlist");
const { Modal } = require("discord-modals");
readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: props.dm_permission,
        type: 1
    });

    console.log(`[COMMAND] ${props.name} komutu yüklendi.`)

});
readdirSync('./events').forEach(e => {

    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(`[EVENT] ${name} eventi yüklendi.`)
});


client.login(TOKEN)


const lourityModal = new ModalBuilder()
    .setCustomId('form')
    .setTitle('Botlist Başvuru Formu')
const a1 = new TextInputBuilder()
    .setCustomId('id')
    .setLabel('Bot ID Yazınız')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(15)
    .setMaxLength(25)
    .setPlaceholder('Botunun ID (Kimliği) nedir?')
    .setRequired(true)
const a2 = new TextInputBuilder()
    .setCustomId('prefix')
    .setLabel('Bot Prefixini Yazınız')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(1)
    .setMaxLength(4)
    .setPlaceholder('Botunun Prefixi (Ön Ek) nedir?')
    .setRequired(true)

const row = new ActionRowBuilder().addComponents(a1);
const row3 = new ActionRowBuilder().addComponents(a2);
lourityModal.addComponents(row, row3);


client.on('interactionCreate', async (interaction) => {


    if (interaction.commandName === "bot-ekle") {

        const zatenEklenmis = new EmbedBuilder()
            .setTitle("Başarısız!")
            .setDescription("Zaten eklenmiş olan bir botun var!")
            .setColor("Red")
        let varmi = louritydb.get(`ekledi_${interaction.user.id}`)
        if (varmi) return interaction.reply({ embeds: [zatenEklenmis], ephemeral: true })
    }
})

client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'form') {

        let onay = louritydb.get(`onay_${interaction.guild.id}`)
        let logg = louritydb.get(`log_${interaction.guild.id}`)
        let botRol = louritydb.get(`botRol_${interaction.guild.id}`)
        let devRol = louritydb.get(`devRol_${interaction.guild.id}`)
        let botekle = louritydb.get(`botekle_${interaction.guild.id}`)
        let ayrildiLog = louritydb.get(`ayrildiLog_${interaction.guild.id}`)
        let adminRol = louritydb.get(`adminRol_${interaction.guild.id}`)

        if (!onay) return interaction.reply({ content: "Botlist sistemi ayarlanmamış!", ephemeral: true })
        if (!logg) return interaction.reply({ content: "Botlist sistemi ayarlanmamış!", ephemeral: true })
        if (!botRol) return interaction.reply({ content: "Botlist sistemi ayarlanmamış!", ephemeral: true })
        if (!devRol) return interaction.reply({ content: "Botlist sistemi ayarlanmamış!", ephemeral: true })
        if (!adminRol) return interaction.reply({ content: "Botlist sistemi ayarlanmamış!", ephemeral: true })
        if (!botekle) return interaction.reply({ content: "Botlist sistemi ayarlanmamış!", ephemeral: true })
        if (!ayrildiLog) return interaction.reply({ content: "Botlist sistemi ayarlanmamış!", ephemeral: true })

        const Discord = require("discord.js")
        const id = interaction.fields.getTextInputValue("id")
        const prefix = interaction.fields.getTextInputValue('prefix')
        const sahip = (`<@${interaction.user.id}>`)

        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Botu Ekle")
                    .setStyle(Discord.ButtonStyle.Link)
                    .setURL("https://discord.com/oauth2/authorize?client_id=" + id + "&scope=bot&permissions=0"),
                new Discord.ButtonBuilder()
                    .setLabel("Onayla")
                    .setStyle(Discord.ButtonStyle.Success)
                    .setCustomId("onayla"),
                new Discord.ButtonBuilder()
                    .setLabel("Reddet")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("reddet")
            )

        adminRol = louritydb.get(`adminRol_${interaction.guild.id}`)
        let a = await client.users.fetch(id);
        let avatar = a.avatar
        let link = "https://cdn.discordapp.com/avatars/" + id + "/" + avatar + ".png?size=1024"

        const gonderildi = new EmbedBuilder()
            .setTitle("Başarılı!")
            .setDescription("Bot başvurun başarıyla yetkililere gönderildi!")
            .setColor("Green")

        const embed = new EmbedBuilder()
            .setTitle("Sıraya Yeni Bot Eklendi!")
            .setDescription("Bot Sahibi: " + sahip + "\n\n**İD:** ```" + id + "``` **Prefix:** ```" + prefix + "```")
            .setColor("Yellow")
            .setThumbnail(link)
        let log = louritydb.get(`onay_${interaction.guild.id}`)

        client.channels.cache.get(log).send({ content: "<@&" + adminRol + ">", embeds: [embed], components: [row] }).then((mesaj) => {
            interaction.reply({ embeds: [gonderildi], ephemeral: true })
            louritydb.set(`bot_${mesaj.id}`, { user: interaction.user.id, bot: id })
            louritydb.set(`ekledi_${interaction.user.id}`, id)
        })
    }
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "reddet") {

        let message = await interaction.channel.messages.fetch(interaction.message.id)
        let log = louritydb.get(`log_${interaction.guild.id}`)
        var data = louritydb.fetch(`bot_${interaction.message.id}`)
        var uye = data.user
        var bot = data.bot

        let admin = louritydb.get(`adminRol_${interaction.guild.id}`)

        if (!interaction.member.roles.cache.has(admin)) return interaction.reply({ content: "Bu işlemi gerçekleştirmek için <@&" + admin + "> rolüne sahip olmalısın!", ephemeral: true })

        let a = await client.users.fetch(bot);
        let avatar = a.avatar
        let link = "https://cdn.discordapp.com/avatars/" + bot + "/" + avatar + ".png?size=1024"

        const embed = new EmbedBuilder()
            .setTitle("Bot Reddedildi!")
            .setDescription("<@" + data.bot + "> adlı botun başvurusu maalesef reddedildi!")
            .setThumbnail(link)
            .setColor("Red")

        client.channels.cache.get(log).send({ content: "<@" + uye + ">", embeds: [embed] })
        message.delete()
    }

    if (interaction.customId === "onayla") {

        let admin = louritydb.get(`adminRol_${interaction.guild.id}`)

        if (!interaction.member.roles.cache.has(admin)) return interaction.reply({ content: "Bu işlemi gerçekleştirmek için <@&" + admin + "> rolüne sahip olmalısın!", ephemeral: true })

        let message = await interaction.channel.messages.fetch(interaction.message.id)
        let log = louritydb.get(`log_${interaction.guild.id}`)
        let dev = louritydb.get(`devRol_${interaction.guild.id}`)
        let botrol = louritydb.get(`botRol_${interaction.guild.id}`)
        var data = louritydb.fetch(`bot_${interaction.message.id}`)
        var uye = data.user
        var bot = data.bot
        let a = await client.users.fetch(bot);
        let avatar = a.avatar
        let link = "https://cdn.discordapp.com/avatars/" + bot + "/" + avatar + ".png?size=1024"

        let eklendimi = interaction.guild.members.cache.get(bot)
        const hata = new EmbedBuilder()
            .setTitle("Başarısız!")
            .setDescription("Önce botu sunucuya eklemelisin!")
            .setColor("Red")
        if (!eklendimi) return interaction.reply({ embeds: [hata], ephemeral: true })

        const embed = new EmbedBuilder()
            .setTitle("Bot Onaylandı!")
            .setDescription("<@" + data.bot + "> adlı botun başvurusu kabul edildi!")
            .setThumbnail(link)
            .setColor("Green")
        client.channels.cache.get(log).send({ content: "<@" + uye + ">", embeds: [embed] })
        interaction.guild.members.cache.get(uye).roles.add(dev).catch(err => { })
        interaction.guild.members.cache.get(bot).roles.add(botrol).catch(err => { })
        message.delete()
    }
})

client.on('interactionCreate', async interaction => {
    if (interaction.commandName === "botlist-ayarla") {

        if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return;

        let botekle = louritydb.get(`botekle_${interaction.guild.id}`)

        const menu = new Discord.EmbedBuilder()
            .setColor("000000")
            .setTitle("Botumu Nasıl Eklerim?")
            .setDescription("> Aşağıdaki **Bot Ekle** butonuna basarak botunu ekleyebilirsin!")
            .setFooter({ text: "Lourity Tester" })

        const row1 = new Discord.ActionRowBuilder()

            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("🤖")
                    .setLabel("Bot Ekle")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setCustomId("bot-ekle")
            )

        client.channels.cache.get(botekle).send({ embeds: [menu], components: [row1] }).catch(() => { })
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.customId === "bot-ekle") {
        await interaction.showModal(lourityModal);
    }
})

// Sistemi Sıfırla - Button
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "kapat") {
        const yetkii = new Discord.EmbedBuilder()
            .setTitle("Yetersiz Yetki!")
            .setDescription("> Bu komutu kullanabilmek için `Yönetici` yetkisine ihtiyacın var!")
            .setFooter({ text: "Lourity Bot" })
            .setColor("Red")

        const embed1 = new Discord.EmbedBuilder()
            .setTitle("Başarıyla Sıfırlandı!")
            .setDescription("> Botlist sistemi başarıyla **sıfırlandı**!")
            .setColor("Green")

        if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [yetkii], ephemeral: true })

        louritydb.delete(`log_${interaction.guild.id}`)
        louritydb.delete(`botRol_${interaction.guild.id}`)
        louritydb.delete(`devRol_${interaction.guild.id}`)
        louritydb.delete(`adminRol_${interaction.guild.id}`)
        louritydb.delete(`onay_${interaction.guild.id}`)
        louritydb.delete(`botekle_${interaction.guild.id}`)
        louritydb.delete(`ayrildiLog_${interaction.guild.id}`)
        return interaction.reply({ embeds: [embed1], ephemeral: true }).catch(() => { })
    }
})

const unban = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.ButtonBuilder()
            .setEmoji("🔓")
            .setLabel("Banı Kaldır")
            .setStyle(Discord.ButtonStyle.Danger)
            .setCustomId("unban")
    )

client.on('guildMemberRemove', async member => {

    let ayrildiLog = louritydb.get(`ayrildiLog_${member.guild.id}`)

    var data = louritydb.fetch(`ekledi_${member.id}`)
    if (!data) return;

    let lourityData = data

    const lourityBanEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Banlandı!")
        .setDescription("<@" + member.id + ">, sunucudan ayrıldığı için **botunu** sunucudan banladım!")

    member.guild.members.ban(lourityData).catch(() => { })
    member.guild.channels.cache.get(ayrildiLog).send({ embeds: [lourityBanEmbed], components: [unban] }).then(mesaj => {
        louritydb.set(`user_${mesaj.id}`, member.id)
    })
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "unban") {
        let message = await interaction.channel.messages.fetch(interaction.message.id)
        var user = louritydb.fetch(`user_${interaction.message.id}`)
        var data = louritydb.fetch(`ekledi_${user}`)

        let lourityData = data

        const yetkiii = new Discord.EmbedBuilder()
            .setTitle("Yetersiz Yetki!")
            .setDescription("> Bu komutu kullanabilmek için `Yönetici` yetkisine ihtiyacın var!")
            .setFooter({ text: "Lourity Bot" })
            .setColor("Red")

        const embed1 = new Discord.EmbedBuilder()
            .setTitle("Başarılı!")
            .setDescription("> Botun banı başarıyla **kaldırıldı**!")
            .setColor("Green")

        if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [yetkiii], ephemeral: true });

        if (!lourityData) return interaction.reply({ content: "Bu botun banı zaten kaldırılmış!", ephemeral: true })

        interaction.guild.members.unban(lourityData).catch(() => { })
        message.delete()
        return interaction.reply({ embeds: [embed1], ephemeral: true }).catch(() => { })
    }

})

// Ayarlar Button 
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "ayarlar") {
        let log = louritydb.get(`log_${interaction.guild.id}`)
        let onayKanal = louritydb.get(`onay_${interaction.guild.id}`)
        let botEkle = louritydb.get(`botekle_${interaction.guild.id}`)
        let ayrildiLog = louritydb.get(`ayrildiLog_${interaction.guild.id}`)
        let botRol = louritydb.get(`botRol_${interaction.guild.id}`)
        let devRol = louritydb.get(`devRol_${interaction.guild.id}`)
        let adminRol = louritydb.get(`adminRol_${interaction.guild.id}`)

        const mesaj = new Discord.EmbedBuilder()
            .setTitle("Botlist Sistem Ayarları")
            .addFields(
                { name: "**💾 Log Kanalı**", value: `<#${log || "Ayarlanmamış!"}>`, inline: true },
                { name: "**👍 Onay Kanalı**", value: `<#${onayKanal || "Ayarlanmamış!"}>`, inline: true },
                { name: "**🎈 Bot Ekle Kanalı**", value: `<#${botEkle || "Ayarlanmamış!"}>`, inline: true },
                { name: "**📤 Ayrıldı Log Kanalı**", value: `<#${ayrildiLog || "Ayarlanmamış!"}>`, inline: true },
                { name: "**🤖 Bot Rolü**", value: `<@&${botRol || "Ayarlanmamış!"}>`, inline: true },
                { name: "**👨‍💻 Developer Rolü**", value: `<@&${devRol || "Ayarlanmamış!"}>`, inline: true },
                { name: "**🔨 Yetkili Rolü**", value: `<@&${adminRol || "Ayarlanmamış!"}>` }
            )
            .setColor("Yellow")

        const yetki = new Discord.EmbedBuilder()
            .setTitle("Yetersiz Yetki!")
            .setDescription("> Bu komutu kullanabilmek için `Yönetici` yetkisine ihtiyacın var!")
            .setFooter({ text: "Lourity Bot" })
            .setColor("Red")
        if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [yetki], ephemeral: true });

        interaction.reply({ embeds: [mesaj], ephemeral: true }).catch(() => { })
    }
})

// Lourity Code + Ayarlamalı + Slash Botlist Botu - PAYLAŞILMASI KESİNLİKLE YASAKTIR!!

// Bir Hata Oluştu
process.on("unhandledRejection", async (error) => {
    return console.log("Bir hata oluştu! " + error)
})

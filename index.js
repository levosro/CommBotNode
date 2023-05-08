require('dotenv').config();
const Discord = require('discord.js');
const keepAlive = require('./server');

const translate = require('@apteryxxyz/html-translator');

let citateInit = import('./citate/citate.mjs');

let citate = []

citateInit.then((res) => {
    // console.log(res)
    res.default.forEach(element => {
        // console.log(element)
        citate.push(element)
    });
})

const client = new Discord.Client({ intents: ["Guilds", "GuildMessages", "MessageContent"] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const prefix = '!'

function generateText(cit) {
    cit.text = cit.text.filter(item => !item.includes('<table'))
    let i = Math.floor(Math.random() * (cit.text.length));
    let res = ''
    let res2 = cit.text[i]
    while (res2.length < 1000 && i < cit.text.length) {
        res = res + cit.text[i]
        res2 = res2 + cit.text[i + 1]
        i += 1
    }

    let find = '<blockquote>'
    let re = new RegExp(find, 'g')
    res = res.replace(re, '<blockquote> > ')
    find = '<p>\xa0</p>'
    re = new RegExp(find, 'g')
    res = res.replace(re, '')
    find = '<br/>'
    re = new RegExp(find, 'g')
    res = res.replace(re, '</p><p>')
    find = '<p[^>]*>'
    re = new RegExp(find, 'g')
    res = res.replace(re, '<p> > ')
    if (res.length < 500) {
        return ''
    }
    const result = citText.match(/"(p\d+)"/);
    res = res.replace(/<a.+<\/a>/, '')
    res = res + addInfo(cit, result[1])
    return res
}

function generateCit(cit) {
    res = cit.text

    let find = '<blockquote>'
    let re = new RegExp(find, 'g')
    res = res.replace(re, '<blockquote> > ')
    find = '<p>\xa0</p>'
    re = new RegExp(find, 'g')
    res = res.replace(re, '')
    find = '<br/>'
    re = new RegExp(find, 'g')
    res = res.replace(re, '</p><p>')
    find = '<p[^>]*>'
    re = new RegExp(find, 'g')
    res = res.replace(re, '<p> > ')
    if (res == '') {
        return ''
    }
    res = res.replace(/<a.+<\/a>/, '')
    res = res + addInfo(cit)
    return res
}

function addInfo(cit, place) {
    // console.log('\n*' + cit.autor + ' - ' + cit.titlu + '*\n' + cit.link)
    return '<p><b>' + cit.autor + ' — ' + cit.titlu.replace('<br/>', ' ') + '</b></p><p>https://levosro.github.io' + cit.link.substring(1, cit.link.indexOf('#')) + `#${place}</p>`
}

function generate(citate) {
    let number = Math.floor(Math.random() * citate.length);
    let cit = citate[number]
    let res = ''
    if (cit.isText) {
        while (res == '' || res.length > 2000) { res = generateText(cit) }
    }
    else {
        while (res == '') { res = generateCit(cit) }

        while (res.length > 2000) {
            let number = Math.floor(Math.random() * citate.length);
            cit = citate[number]
            let res = ''
            if (cit.isText) {
                while (res == '' || res.length > 2000) { res = generateText(cit) }
            }
            else {
                while (res == '') { res = generateCit(cit) }
            }
        }

    }

    let { markdown, images } = translate(res);
    return markdown;
}

client.on('messageCreate', function (msg) {
    if (msg.author.bot) return;
    console.log(msg.content)
    if (!msg.content.startsWith(prefix)) return;
    const commandBody = msg.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    if (command == 'cit') {

        // console.log(markdown)
        msg.reply(generate(citate))
    }
    else if (command == 'autor') {
        let autori = []
        for (i in citate) {
            let cit = citate[i]
            if (!autori.includes(cit.autor)){
                autori.push(cit.autor)
            }
        }
        res = ''
        for (a in autori) {
            citLen = citate.filter(item => item.autor == autori[a]).length
            res = res + `${autori[a]} (${citLen} citate)` + '\n'
        }
        msg.reply(res)
    }
    else {
        citateFiltered = citate.filter(item => item.autor.toLowerCase().includes(command) || item.img.toLowerCase().includes(command))
        if (citateFiltered.length == 0) {
            msg.reply('Nu avem texte de la autorul cerut.')
        }
        else { msg.reply(generate(citateFiltered)) }
    }
});

//make sure this line is the last line
keepAlive()
client.login(process.env['TOKEN']);

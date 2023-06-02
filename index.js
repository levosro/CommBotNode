require("dotenv").config();
const Discord = require("discord.js");
const keepAlive = require("./server");

const translate = require("@apteryxxyz/html-translator");

let booksInit = import("./books.mjs");

let citate = [];
let books = [];

async function getTexts(book) {
  const { default: fetch } = await import("node-fetch");
  const response = await fetch(
    `https://levosro.herokuapp.com/assets/content/${book.link}/texts.json`
  );
  return await response.json();
}

async function getChapters(book) {
  const { default: fetch } = await import("node-fetch");
  const response = await fetch(
    `https://levosro.herokuapp.com/assets/content/${book.link}/chapters.json`
  );
  return await response.json();
}

async function getParts(book) {
  const { default: fetch } = await import("node-fetch");
  const response = await fetch(
    `https://levosro.herokuapp.com/assets/content/${book.link}/parts.json`
  );
  return await response.json();
}

async function getNotes(book) {
  const { default: fetch } = await import("node-fetch");
  const response = await fetch(
    `https://levosro.herokuapp.com/assets/content/${book.link}/notes.json`
  );
  return await response.json();
}

async function getCitate(book) {
  const { default: fetch } = await import("node-fetch");
  const response = await fetch(
    `https://levosro.herokuapp.com/assets/content/${book.link}/citate.json`
  );
  return await response.json();
}

async function initializeBooks(books) {
  const newBooks = books;

  await Promise.all(
    books.map(async (item) => {
      const texts = await getTexts(item);
      const citate = await getCitate(item);
      const chapters = await getChapters(item);
      const parts = await getParts(item);
      const notes = await getNotes(item);

      item.texts = texts;
      const updatedCitate = citate.map((citat, index) => {
        // Create a copy of the chapter object to avoid modifying the original object
        const updatedCitat = { ...citat };

        // Assign a growing ID to the updatedChapter object
        updatedCitat.id = index + 1;

        return updatedCitat;
      });
      item.citate = updatedCitate;
      item.chapters = chapters;
      item.parts =
        parts.length === 0 ? [{ idPt: "1", title: item.title }] : parts;
      item.notes = notes;

      const title = item.title;
      const book = newBooks.filter((item) => item.title == title)[0];
      const index = newBooks.indexOf(book);
      newBooks[index] = item;
    })
  );

  return newBooks;
}

function getAllCits() {
  let d = 0;

  const resCit = [];
  books.forEach((book) => {
    if (book.language !== "en") {
      if (!book.title.includes("Citate din scrierile lui")) {
        book.texts.forEach((item) => {
          d += 1;
          resCit.push({
            link: `${book.link}?id=T${item.idChr}#${item.idChr}`,
            autor: item.author ?? book.author,
            titlu: item.title
              ? `${item.title}<br/>(${item.sourceBook ?? book.title})`
              : `${item.sourceBook}<br/>(${book.title})`,
            isItText: true,
            text: item.content,
            an: item.year ?? book.year,
            img: item.image ?? book.img,
            linkBook: book.link,
            titluBook: book.title,
            id: d,
            idNota: 0,
          });
        });
      }
      book.citate.forEach((item) => {
        d += 1;
        resCit.push({
          ...item,
          id: d,
          idNota: item.id,
          isItText: false,
          linkBook: book.link,
          titluBook: book.title,
          titlu: item.titlu.replace(/<[^>]*>/g, ""),
          link: `citate?cit=${d}`,
        });
      });
    }
  });
  d = 0;
  return resCit;
}

const client = new Discord.Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const prefix = "!";

function generateText(cit) {
  cit.text = cit.text.filter((item) => !item.includes("<table"));
  let i = Math.floor(Math.random() * cit.text.length);
  let res = "";
  let res2 = cit.text[i];
  while (res2.length < 1000 && i < cit.text.length) {
    res = res + cit.text[i];
    res2 = res2 + cit.text[i + 1];
    i += 1;
  }

  let find = "<blockquote>";
  let re = new RegExp(find, "g");
  res = res.replace(re, "<blockquote> > ");
  find = "<p>\xa0</p>";
  re = new RegExp(find, "g");
  res = res.replace(re, "");
  find = "<br/>";
  re = new RegExp(find, "g");
  res = res.replace(re, "</p><p>");
  find = "<p[^>]*>";
  re = new RegExp(find, "g");
  res = res.replace(re, "<p> > ");
  if (res.length < 500) {
    return "";
  }
  const result = res.match(/"(p\d+)"/);
  res = res.replace(/<a[^<]+<\/a>/g, "");
  res = res + addInfo(cit, result[1]);
  return res;
}

function generateCit(cit) {
  res = cit.text;

  let find = "<blockquote>";
  let re = new RegExp(find, "g");
  res = res.replace(re, "<blockquote> > ");
  find = "<p>\xa0</p>";
  re = new RegExp(find, "g");
  res = res.replace(re, "");
  find = "<br/>";
  re = new RegExp(find, "g");
  res = res.replace(re, "</p><p>");
  find = "<p[^>]*>";
  re = new RegExp(find, "g");
  res = res.replace(re, "<p> > ");
  if (res == "") {
    return "";
  }
  res = res.replace(/<a.+<\/a>/, "");
  res = res + addInfo(cit);
  return res;
}

function addInfo(cit, place) {
  if (cit.isItText) {
    return (
      "<p><b>" +
      cit.autor +
      " — " +
      cit.titlu.replace("<br/>", " ") +
      "</b></p><p>https://levosro.herokuapp.com/" +
      cit.link.substring(0, cit.link.indexOf("#")) +
      `#${place}</p>`
    );
  } else {
    return (
      "<p><b>" +
      cit.autor +
      " — " +
      cit.titlu.replace("<br/>", " ") +
      "</b></p><p>https://levosro.herokuapp.com/" +
      cit.link +
      `</p>`
    );
  }
}

function generate(citate) {
  let number = Math.floor(Math.random() * citate.length);
  let cit = citate[number];
  let res = "";
  console.log(number);
  if (cit.isItText) {
    while (res == "" || res.length > 2000) {
      res = generateText(cit);
    }
  } else {
    while (res == "") {
      res = generateCit(cit);
    }

    while (res.length > 2000) {
      let number = Math.floor(Math.random() * citate.length);
      cit = citate[number];
      let res = "";
      if (cit.isItText) {
        while (res == "" || res.length > 2000) {
          res = generateText(cit);
        }
      } else {
        while (res == "") {
          res = generateCit(cit);
        }
      }
    }
  }

  let { markdown, images } = translate(res);
  return markdown;
}

client.on("messageCreate", function (msg) {
  if (msg.author.bot) return;
  console.log(msg.content);
  if (!msg.content.startsWith(prefix)) return;
  const commandBody = msg.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();
  if (command == "cit") {
    // console.log(markdown)
    msg.reply(generate(citate));
  } else if (command == "autor") {
    let autori = [];
    for (i in citate) {
      let cit = citate[i];
      if (!autori.includes(cit.autor)) {
        autori.push(cit.autor);
      }
    }
    res = "";
    for (a in autori) {
      citLen = citate.filter((item) => item.autor == autori[a]).length;
      res = res + `${autori[a]} (${citLen} citate)` + "\n";
    }
    msg.reply(res);
  } else {
    citateFiltered = citate.filter(
      (item) =>
        item.autor.toLowerCase().includes(command) ||
        item.img.toLowerCase().includes(command)
    );
    if (citateFiltered.length == 0) {
      msg.reply("Nu avem texte de la autorul cerut.");
    } else {
      msg.reply(generate(citateFiltered));
    }
  }
});

//make sure this line is the last line
booksInit.then((res) => {
  // console.log(res)
  res.default.forEach((element) => {
    // console.log(element)
    books.push(element);
  });
  initializeBooks(books).then((data) => {
    citate = getAllCits(data);
    // console.log(citate);
    keepAlive();
    client.login(process.env["TOKEN"]);
  });
});

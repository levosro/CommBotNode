import citate from './citate.mjs';
import chapters from '../msj/chapters.mjs';
import texts from '../msj/texts.mjs';
// import parts from '../msj/parts.mjs';
import notes from '../msj/notes.mjs'
import html2canvas from './html2canvas.esm.js';
const section = document.querySelector('.container');

let idChr = ''


let currentItem = Math.floor(Math.random() * citate.length);

document.addEventListener('copy', (event) => {
  if (event == null) {
    return;
  }
  let selection = document.getSelection();
  if (selection.toString() != '') {
    event.clipboardData.setData('text/plain', `${selection.toString()}\n\n${window.location.href}`);
    event.preventDefault();
  }
})

window.addEventListener("DOMContentLoaded", function () {
  let x = location.search.split('cit=')[1];
  if (x != undefined) {
    document.querySelector('header').innerHTML = '<form id="form1" action="javascript:"></form>'


    section.innerHTML = `<div class="title"> <h2>Citate din scrierile<br/>lui Mao Ţze-dun</h2> <div class="underline"> </div> </div> <div class="review"> <div class="img-container"> </div> <h4 id="author"></h4> <p id="titlu"></p> <p id="an"></p> <p id="info"></p> <div class="button-container"> <button class="prev-btn"> <i class="fas fa-chevron-left"></i> </button> <button class="save"> <i class="fas fa-save"></i> </button> <button class="next-btn"> <i class="fas fa-chevron-right"></i> </button> </div> <button class="random-btn"><i class="fa fa-random"></i> Surprinde-mă</button> <div></div> <button class="expand-btn" id="book"><i class="fa fa-book"></i> Citate din scrierile lui Mao Ţze-dun</button> <div></div> <button class="expand-btn" id="home"><i class="fa fa-home"></i> Levos Homepage</button>`;

    // const antologia = document.getElementById('antologia');

    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const saveBtn = document.querySelector('.save');
    const randomBtn = document.querySelector('.random-btn');
    const home = document.getElementById('home');
    const book = document.getElementById('book');

    book.addEventListener('click', function () {
      window.location.href = './index.html'
    })

    home.addEventListener('click', function () {
      window.location.href = '../index.html'
    })
    if (parseInt(x) > citate.length - 1 || parseInt(x) < 0) {
      let citat = citate[currentItem]
      window.location.href = `./citate.html?cit=${citat.id}`;
    }
    try {
      let citat = citate.filter(item => item.id == parseInt(x))[0]
      currentItem = citat.id;
      findCit(currentItem);
      // console.log(idChr)
      changePerson(currentItem);
      generateTOC();
    } catch (TypeError) {
      let citat = citate[currentItem]
      window.location.href = `./citate.html?cit=${citat.id}`;
    }

    // antologia.addEventListener("click", function () {
    //   window.location.href = './index.html';
    // })
    prevBtn.addEventListener('click', function () {
      if (currentItem == 0) {
        currentItem = citate.length - 1;
      }
      else {
        currentItem--;
      }
      let citat = citate[currentItem]
      window.location.href = `./citate.html?cit=${citat.id}`;
    });

    nextBtn.addEventListener('click', function () {
      if (currentItem == citate.length - 1) {
        currentItem = 0;
      }
      else {
        currentItem++;
      }
      let citat = citate[currentItem]
      window.location.href = `./citate.html?cit=${citat.id}`;
    });

    saveBtn.addEventListener('click', function () {
      let res = document.querySelector("section.container").innerHTML;
      document.getElementById('save-zone').innerHTML = res;
      let node1 = document.getElementById('save-zone')
      node1.removeChild(node1.querySelector('div.title'))
      let node = node1.querySelector('div.review')
      let n1 = node.querySelector('div.button-container')
      let n2 = node.querySelector('button.random-btn')
      let n3 = node.querySelector('#book')
      let n4 = node.querySelector('#home')
      node.removeChild(n1)
      node.removeChild(n2)
      node.removeChild(n3)
      node.removeChild(n4)
      if (node.querySelector('a') != null) { node.querySelector('a').style.textDecoration = 'none' }
      html2canvas(node1, innerWidth = 500).then(async function (canvas) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
          let a = document.createElement('a');
          a.href = window.URL.createObjectURL(xhr.response);
          a.download = 'MAOcit' + window.location.href.split('cit=')[1] + '.png';
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          a.remove();
        };
        xhr.open('GET', canvas.toDataURL('image/png'));
        xhr.send();

      });
      node1.innerHTML = '';
    })

    randomBtn.addEventListener('click', function () {
      let x = currentItem;
      while (currentItem == x) { currentItem = Math.floor(Math.random() * citate.length); }
      let citat = citate[currentItem]
      window.location.href = `./citate.html?cit=${citat.id}`;
    });
  }
  else {
    let citat = citate[currentItem]
    window.location.href = `./citate.html?cit=${citat.id}`;
  }
});



function changePerson(person) {
  const img = document.querySelector('.img-container');
  const author = document.getElementById('author');
  const titlu = document.getElementById('titlu');
  const info = document.getElementById('info');
  const an = document.getElementById('an');

  const item = citate[person];
  img.innerHTML = `<img src="./citate/profiles/${item.img}.svg" id="person-img" alt="" > </img>`;
  // console.log(img.innerHTML)
  author.innerHTML = item.autor;
  titlu.innerHTML = `<a href=./index.html?id=T${idChr}#cit${item.id}>${item.titlu}</a>`;
  info.innerHTML = item.text.replace(/(<a)(.)+(<\/a>)/g, '');
  an.innerHTML = item.an;
}

function Search2() {
  const input = document.getElementById('textInput');
  input.addEventListener("keyup", function () {
    const search = document.getElementById("search");
    let filter = input.value.toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    if (filter != '') {
      let toc = document.getElementById("toc");
      // console.log(toc)
      toc.style.display = "none";
    }
    else {
      let toc = document.getElementById("toc");
      toc.style.display = "";
    }
    const textList = search.getElementsByTagName("menuitem");
    // let x = textList.shift();
    for (let i = 0; i < textList.length; i++) {
      const aX = textList[i].getElementsByTagName("a")[0]
      // console.log(textList)
      let a = aX.getAttribute("id");
      let content = ''
      if (a.includes('CHR')) {
        a = a.substring(3)
        // console.log(a)
        let text = texts.filter(element => element.idChr == a)[0];
        // console.log(text);
        let contentList = text.content.filter(element => !element.includes('<h'));
        content = contentList.join(" ").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/<[^>]*>/g, '');
        let notesListX = [...text.content.join(" ").matchAll(/\>\[[\d]+\]\</g)];
        let notesList = []
        notesListX.forEach(function (item) {
          item = item[0];
          item = parseInt(item.substring(2, item.length - 2));
          // console.log(item);
          notesList.push(notes[item - 1])
        })
        notesList.forEach(function (note) {
          content = content + note.content.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/<[^>]*>/g, '');
        })
      }
      else {
        let x = parseInt(a.substring(3))
        let citat = citate.filter(item => item.id == x)[0]
        content = content + citat.text.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/<[^>]*>/g, '');
      }
      if (filter != '') {
        if (content.toUpperCase().indexOf(filter) > -1) {
          textList[i].style.display = "";
          const aX = textList[i].getElementsByTagName("a")[0]
          let a = aX.getAttribute("id");
          if (content.toUpperCase().indexOf(filter) >= 0) {
            let j = content.toUpperCase().indexOf(filter);
            let res = ''
            if (j > 20) { res = '<i>„...' + content.substring(j - 20, j) + `<b><u>${content.substring(j, j + filter.length)}</b></u>` + content.substring(j + filter.length, j + filter.length + 20) + '...“</i>'; }
            else if (j == 0) { res = '<i>„' + `<b><u>${content.substring(j, j + filter.length)}</b></u>` + content.substring(j + filter.length, j + filter.length + 25) + '...“</i>'; }
            else { res = '<i>„' + content.substring(0, j) + `<b><u>${content.substring(j, j + filter.length)}</b></u>` + content.substring(j + filter.length, j + filter.length + 20) + '...“</i>'; }
            if (a.includes('CHR')) {
              let text = texts.filter(element => element.idChr == a.substring(3))[0];
              const div = document.getElementById(`chr${text.idChr}`);
              div.innerHTML = res;
              div.innerHTML = res;
            } else {
              let citat = citate.filter(element => element.id == parseInt(a.substring(3)))[0];
              const div = document.getElementById(`cit${citat.id}`);
              div.innerHTML = res;
            }
          }

        } else {
          textList[i].style.display = "none";
          const aX = textList[i].getElementsByTagName("a")[0]
          let a = aX.getAttribute("id");
          if (a.includes('CHR')) {
            let text = texts.filter(element => element.idChr == a.substring(3))[0];
            const div = document.getElementById(`chr${text.idChr}`);
            div.innerHTML = '';
            div.innerHTML = '';
          } else {
            let citat = citate.filter(element => element.id == parseInt(a.substring(3)))[0];
            const div = document.getElementById(`cit${citat.id}`);
            div.innerHTML = '';
          }
        }
      }
      else {
        textList[i].style.display = "none";
      }
    }

  })
}



function generateTOC() {
  const form1 = document.getElementById("form1");
  // form2 = document.getElementById("form2");
  let res = ''
  res = res + '<input id="left-menu" type="checkbox"> <input id="left-menu-reset" type="reset"> <nav class="left-navigation"> <main> <label class="menu-toggle" for="left-menu"><span>&nbsp;</span></label> <label class="menu-close" for="left-menu-reset"><span>&nbsp;</span></label> <menu>';
  res = res + '<div id="search">';
  res = res + '<div id="searchTextInput"><input type="text" id="textInput" placeholder="Search"><i class="fa-solid fa-magnifying-glass"></i></div>';

  for (let p = 0; p < texts.length; p++) {
    let text = texts[p];
    res = res + `<menuitem> <span><a href="./index.html?id=T${text.idChr}#${text.idChr}" id="CHR${text.idChr}">${text.title}</a><hr style="width:30%;"/><div id="chr${text.idChr}"></div></span> </menuitem>`;

  }
  res = res + '</div>'

  // res = res + '<nav class="left-navigation"> <main>'
  // res = res + '<menu><main><nav>'
  res = res + '<div id="toc">'
  res = res + '<menuitem><menuitem> <span class="heading"><a href="./index.html" id="A0.0"><i class="fa fa-book"></i> Citate din scrierile lui Mao Ţze-dun</a></span> </menuitem>';
  for (let j = 0; j < texts.length; j++) {
    let text = texts[j];
    res = res + `<menuitem> <span><a href="./index.html?id=T${text.idChr}#${text.idChr}" id="aCh${text.idChr}">${text.title}</a></span> </menuitem>`;
  }
  res = res + '</menu></main></nav></menuitem>';

  if (window.innerWidth > 350) {
    form1.innerHTML = res;
    const search = document.getElementById("search");

    let textList = search.getElementsByTagName("menuitem");
    for (let i = 0; i < textList.length; i++) {
      textList[i].style.display = "none";
    }
    Search2();
  }
}

function findCit(id) {
  let cit = citate[id]
  texts.forEach(element => {
    let res = ""
    element.content.forEach(elm => {
      if (elm.includes('<div')) {
        if (res.replace(/<[^>]*>/g, '').includes(cit.text.replace(/<[^>]*>/g, ''))) {
          idChr = element.idChr;
        }
      }
      else {
        res = res + elm;
      }
    })
  });
}
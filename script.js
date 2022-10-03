// editable info

const linkSpreedsheet =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTeJUjhwSWfk2_QboKMVmxto743dSeCRNvimLmNKXJtOo6-3ecmdwVZdJRLl6ZdoBYYItKLX6HnMoM/pub?output=csv"; // change this to your own URL
const linkContrib =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTeJUjhwSWfk2_QboKMVmxto743dSeCRNvimLmNKXJtOo6-3ecmdwVZdJRLl6ZdoBYYItKLX6HnMoM/pub?gid=2186560&single=true&output=csv";

const mainCategory = ["Général", "Game Design", "Graph", "Programmation", "Ergonomie", "Son", "Gestion de projet"];
const GID = {
  "Général": "0",
  "Game Design": "2025772732",
  "Graph": "1210408407",
  "Programmation": "1107242009",
  "Ergonomie": "1093215284",
  "Son": "1633866315",
  "Gestion de projet": "209494005"
}

var currentCategorie = "Général"

const checked = "x";

const categoryStartNum = 3; // let the program know where the categoy begins on the spreadsheet column. Default value is 3.
const punctuation = ": "; // this changes the punctuation between the title and the description. In most cases you'd want to use "," or "-" or ":"

const mdConverter = new showdown.Converter();

var dataTable = {  
  "Général": [],
  "Game Design": [],
  "Graph": [],
  "Programmation": [],
  "Ergonomie": [],
  "Son": [],
  "Gestion de projet": []
};
var tagsTable = {
  "Général": [],
  "Game Design": [],
  "Graph": [],
  "Programmation": [],
  "Ergonomie": [],
  "Son": [],
  "Gestion de projet": []
}

var activeButtons = [];

// tableTop.js script
function init() {
  mainCategory.forEach(category => {
    Papa.parse(`${linkSpreedsheet}&gid=${GID[category]}&single=true`, {
      download: true,
      header: true,
      complete: function (results) {
        var data = results.data;

        grabData(data, category);

        if (category === currentCategorie) {
          placeButton(category)
          drawLinks();
        }

      },
    });
  })

  Papa.parse(linkContrib, {
    download: true,
    header: true,
    complete: function (results) {
      var data = results.data;
      showContrib(data);
    },
  });
}

function grabData(data, category) {
  dataTable[category] = data;
  tagsTable[category] = Object.keys(data[0]).slice(categoryStartNum)
}

function placeButton(category) {
  let buttonContainer = document.getElementById("btnContainer")

  buttonContainer.innerHTML = "";

  let tousButton = document.createElement("button");
  tousButton.classList.add("btn")
  tousButton.classList.add("active")
  tousButton.id = "tousButton"
  tousButton.innerHTML = "Tous"
  tousButton.addEventListener("click", tousButtonCallback);

  buttonContainer.appendChild(tousButton)

  tagsTable[category].forEach(tag => {
    let btn = document.createElement("button")

    btn.classList.add("btn")
    btn.innerHTML = tag
    btn.addEventListener("click", normalButtonCallback);

    buttonContainer.appendChild(btn)
  })
}

function tousButtonCallback(e) {
  let btns = document.querySelectorAll(".btn");

  activeButtons = []

  for (const btn of btns) {
    btn.classList.remove("active");
  }

  document.getElementById("tousButton").classList.add("active");

  drawLinks()
}

function normalButtonCallback(e) {
  let btn = e.target;

  if (btn.classList.contains("active")) {
    btn.classList.remove("active");
    activeButtons = activeButtons.filter(bt => bt !== btn.innerHTML);
  } else {
    btn.classList.add("active");
    activeButtons.push(btn.innerHTML);
  }

  if (activeButtons.length === 0) { 
    document.getElementById("tousButton").classList.add("active");
  } else {
    document.getElementById("tousButton").classList.remove("active");
  }

  drawLinks()
}

function drawLinks() {
  let data = dataTable[currentCategorie];
  let container = document.getElementById("container")

  container.innerHTML = "";

  if (activeButtons.length > 0) {
    data = data.filter(d => {
      let inside = false;
      let elementTags = []
  
      Object.keys(d).forEach(tag => {
  
  
        if (d[tag] !== "") {
          elementTags.push(tag)
        }
      })
  
      activeButtons.forEach(act => {
        if (elementTags.includes(act)) {
          inside = true;
        } else {
          inside = false;
        }
      })
  
  
      return inside;
    })
  
  }

  console.log(data)

  data.forEach(d => {
    let title = d["Link Title"];
    let url = d["Link"];
    let description = d["Description"];
    //element[3].splice(element[3].indexOf("All"), 1);
  
    let para = document.createElement("p");

    let link = document.createElement("a");
    let linkContent = document.createTextNode(title);
    link.appendChild(linkContent);
    link.title = title;
    link.href = url;
    link.target = "_blank";
    link.className = "itemLink";

    para.className = "itemPara";
    para.appendChild(link); // put <a> into <p>
    para.innerHTML +=
      " " +
      punctuation +
      description 

    container.appendChild(para);
  })

  let currentlyShowing = document.getElementById("currentlyShowing");
  currentlyShowing.innerHTML =
    "<strong>Montre actuellement: </strong> " +
    data.length +
    " outils avec <strong>tous</strong> les attributs suivants - ";

  for (let u = 0; u < activeButtons.length; u++) {
    currentlyShowing.innerHTML += "[<strong>" + activeButtons[u] + "</strong>]";
    if (u + 1 == activeButtons.length) {
      currentlyShowing.innerHTML += ".";
    } else {
      currentlyShowing.innerHTML += ", ";
    }
  }

  if (activeButtons.length == 0) {
    currentlyShowing.innerHTML +=
      "Aucun. Cliquez sur un attribut pour commencer! ";
  } else {
    currentlyShowing.innerHTML +=
      ' <a onclick=removeAllFilters() class="removeFilter">Retirer tous les filtres.</a>';
  }
}

function changeSection(section) {
  let links = document.getElementsByClassName("mainCategory")

  for (const link of links) {
    link.classList.remove("current");
  }

  currentCategorie = section
  placeButton(section)
  drawLinks();

  document.getElementById("link-" + section).classList.add("current")
}

function showContrib(data) {
  // Ajout des contributeurs
  let contribP = document.getElementById("contrib");

  data.forEach((c) => {
    let a = document.createElement("a");
    a.innerHTML = c.Username;
    a.href = c.Link;
    a.target = "_blank";
    contribP.appendChild(a);
    contribP.innerHTML = contribP.innerHTML + " ";
  });
}

window.addEventListener("DOMContentLoaded", init);
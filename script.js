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

// function showLink(data, categorie) {
//     var columnArray = Object.keys(data[0]);

//   document.getElementById("btnContainer-" + categorie).innerHTML = "";
//   // create sorting buttons
//   for (let j = categoryStartNum; j < columnArray.length; j++) {
//     addButton(columnArray[j], categorie);
//   }

//   //makes the data table used later
//   for (let j = 0; j < data.length; j++) {
//     dataTable[categorie][j] = [
//       data[j][columnArray[0]],
//       data[j][columnArray[1]],
//       data[j][columnArray[2]],
//       [],
//     ];
//     //console.log(dataTable[j])
//     for (let i = categoryStartNum; i < columnArray.length; i++) {
//       if (data[j][columnArray[i]] == checked) {
//         dataTable[categorie][j][3].push(columnArray[i]);
//       }
//     }
//   }

//   let allButton = document.getElementById("Tous-" + categorie);
//   allButton.classList.add("active");
//   activeButtons.push("Tous");
//   filterSelection();
// }

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

// function addButton(columnName, categorie) {
//   const newButton = document.createElement("BUTTON");
//   const newButtonContent = document.createTextNode(columnName);

//   newButton.appendChild(newButtonContent);
//   newButton.name = columnName;
//   newButton.className = "btn";
//   newButton.addEventListener("click", function () {
//     var allButton = document.getElementsByName("Tous")[0];
//     if (newButton.name == "Tous") {
//       removeAllFilters();
//     }
//     if (newButton.classList.contains("active")) {
//       newButton.classList.remove("active");
//       activeButtons.splice(activeButtons.indexOf(newButton.name), 1);
//     } else {
//       allButton.classList.remove("active"); //turn off all
//       if (activeButtons.indexOf("Tous") != -1) {
//         activeButtons.splice(activeButtons.indexOf("Tous"), 1);
//       }
//       newButton.classList.add("active"); // turn this button on
//       activeButtons.push(newButton.name);
//     }
//     filterSelection();
//   });
//   document.getElementById("btnContainer-" + categorie).appendChild(newButton);
// }

// function addElement(element, divToAppend) {
//   let title = element[0];
//   let url = element[1];
//   let description = element[2];
//   //element[3].splice(element[3].indexOf("All"), 1);
//   let tags = element[3].toString().replace(/,/g, " -- ");

//   let para = document.createElement("p");
//   // place individual link inside individual paragraph
//   for (let i = 0; i < 1; i++) {
//     let link = document.createElement("a");
//     let linkContent = document.createTextNode(title);
//     link.appendChild(linkContent);
//     link.title = title;
//     link.href = url;
//     link.target = "_blank";
//     link.className = "itemLink";

//     para.className = "itemPara";
//     para.appendChild(link); // put <a> into <p>
//     para.innerHTML +=
//       " " +
//       punctuation +
//       "<dfn data-info='" +
//       tags +
//       "'>" +
//       description +
//       "</dfn>";
//   }
//   divToAppend.appendChild(para);
// }

// function removeAllFilters() {
//   activeButtons = [];
//   var activeButtonElements = document.getElementsByClassName("active").length;

//   for (let l = 0; l < activeButtonElements; l++) {
//     document.getElementsByClassName("active")[0].classList.remove("active");
//   }

//   filterSelection();
// }

// function randomizeSearch() {
//   removeAllFilters();
//   var buttonList = document.getElementById("btnContainer").children;
//   for (let l = 0; l < 2; l++) {
//     var pickedButton =
//       buttonList[Math.floor(Math.random() * buttonList.length)];
//     //make it not repeat
//     if (activeButtons.indexOf(pickedButton.name) == 1) {
//       pickedButton = buttonList[Math.floor(Math.random() * buttonList.length)];
//     }
//     pickedButton.classList.add("active"); // turn this button on
//     activeButtons.push(pickedButton.name);
//   }
//   //activeButtons = [];
//   //var activeButtonElements = document.getElementsByClassName("active").length;

//   filterSelection();
// }

// filter script
// function filterSelection() {
//   let containerDiv = document.getElementById("container");
//   containerDiv.innerHTML = "";

//   var toolCount = 0;

//   for (let r = 0; r < dataTable[currentCategorie].length; r++) {
//     if (activeButtons.length > 0 && isTrue(activeButtons, dataTable[currentCategorie][r][3])) {
//       addElement(dataTable[currentCategorie][r], containerDiv);
//       toolCount++;
//     }
//   }

//   let currentlyShowing = document.getElementById("currentlyShowing-" + currentCategorie);
//   currentlyShowing.innerHTML =
//     "<strong>Montre actuellement: </strong> " +
//     toolCount +
//     " outils avec <strong>tous</strong> les attributs suivants - ";

//   for (let u = 0; u < activeButtons.length; u++) {
//     currentlyShowing.innerHTML += "[<strong>" + activeButtons[u] + "</strong>]";
//     if (u + 1 == activeButtons.length) {
//       currentlyShowing.innerHTML += ".";
//     } else {
//       currentlyShowing.innerHTML += ", ";
//     }
//   }

//   if (activeButtons.length == 0) {
//     currentlyShowing.innerHTML +=
//       "Aucun. Cliquez sur un attribut pour commencer! ";
//   } else {
//     currentlyShowing.innerHTML +=
//       ' <a onclick=removeAllFilters() class="removeFilter">Retirer tous les filtres.</a>';
//   }

//   //add a function to switch to ANY of the tags?

//   function isTrue(arr, arr2) {
//     return arr.every((i) => arr2.includes(i));
//   }
// }

window.addEventListener("DOMContentLoaded", init);
let albumList = [];

function showContent(e) {
  var currentActive = document.querySelector(".active-album");

  if (currentActive) {
    currentActive.classList.remove("active-album");
  }

  var x = e.classList.add("active-album");
}

function spanify(text) {
  const maxLength = 21;
  let result = "";
  for (let i = 0; i < Math.min(text.length, maxLength); i++) {
    text[i] === " " ?
      (result += `<span>&nbsp</span>`) :
      (result += `<span>${text[i]}</span>`);
  }
  if (text.length > maxLength) {
    for (let j = 0; j < 3; j++) {
      result += `<span>.</span>`;
    }
  }

  return result;
}

let zindex = 1;
let windows = 0;

async function generateNewCatalog() {
  albumList = await fetch('https://raw.githubusercontent.com/The-People-s-Coalition-of-Tandy/PCoTandy/main/catalog/catalogData.json')
  .then((response) => response.json())
  .then((json) => {return json});

  var output = "";
  var item = "";
  albumList.forEach((album, i) => {
    // const releaseNumber = `${'0'.repeat(3-(Math.log10((i ^ (i >> 31)) - (i >> 31)) | 0))}${i.toString}`;
    item = "";
    item += `           
    <div class="release" onclick="addWindow(this)">
      <div class="qube-perspective spin">
        <ul class="qube faces no-shading cube10">
            <!-- Source order implies the faces here! -->
            <li><img src="${album.cover}"></li>
            <li><img src="${album.cover}"></li>
            <li><img src="${album.cover}"></li>
            <li><img src="${album.cover}"></li>
            <li><img src="${album.cover}"></li>
            <li><img src="${album.cover}"></li>
        </ul>
      </div>
      <div class="release-name">
        <p>${album.title}</p>
      </div>
    </div>
`;
    output = item + output;
  });

  document.getElementById("catalog-list").innerHTML = output;
}

function addWindow(release) {
  var output = "";

  const releaseName = release.children[1].children[0].innerText;
  let releaseNumber;

  const windowDiv = document.createElement("div");
  windowDiv.classList.add("window");

  for (let i = 0; i < albumList.length; i++) {
    if (albumList[i].title === releaseName) {
      releaseNumber = `PCoT ${"0".repeat(
        3 - (Math.log10(((i + 1) ^ ((i + 1) >> 31)) - ((i + 1) >> 31)) | 0)
      )}${(i + 1).toString()}`;

      windowDiv.id = releaseNumber.replace(" ", "");
      output += `           
        <header>${releaseNumber} <div class="close ${releaseNumber.replace(
        " ",
        ""
      )}" onclick="closeWindow(this)">X</div></header>
        <div class="release-info">
        <img width="30%" src="${albumList[i].cover}">
          <h2>${albumList[i].title}</h2>
          <h3>${albumList[i].artists}</h3>
          <p>${albumList[i].description}</p>
          <p class="credits">`;

      albumList[i].credits.forEach((credit) => {
        output += `<strong>${credit.name}</strong> - ${credit.contribution}<br>`;
      });
      output += `</p>
        </div>
        <div class="links">`;
      albumList[i].links.forEach((link) => {
        output += `<a target='_blank' style="color:${link.font}; background-color:${link.background}" href='${link.link}'>${link.label}</a>`;
      });
      output += "</div>";
      break;
    }
  }

  const existingWindow = document.getElementById(
    releaseNumber.replace(" ", "")
  );
  if (existingWindow) {
    existingWindow.remove();
  }

  windowDiv.innerHTML = output;
  windowDiv.style.zIndex = zindex;
  windowDiv.style.transform = `translate(calc(-50% + ${25 * windows
    }px),calc(-50% + ${25 * windows}px))`;
  zindex++;
  windows++;
  document.getElementById("main").appendChild(windowDiv);

  dragElement(document.getElementById(releaseNumber.replace(" ", "")));
}

function closeWindow(window) {
  document.getElementById(`${window.classList[1]}`).remove();
  windows--;
}

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id).children[0]) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id).children[0].onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.zIndex = zindex + 1;
    zindex++;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
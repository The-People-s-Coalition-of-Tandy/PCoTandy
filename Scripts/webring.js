const DATA_FOR_WEBRING = `https://raw.githubusercontent.com/The-People-s-Coalition-of-Tandy/Tandy-Webring/main/webring.json`;

const template = document.createElement("template");
template.innerHTML = `
<style>
.webring {
  text-align: center;
  font: 100% system-ui, sans-serif;
}

.logo {
    height: 50px;
}

#navigator {
    display: flex;
    justify-content: center;
    gap: 8px;
}
</style>

<div class="webring">
    <div id="navigator">
    </div>
    <div id="copy">
  </div>
</div>`;

class WebRing extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const thisSite = this.getAttribute("site");

    fetch(DATA_FOR_WEBRING)
      .then((response) => response.json())
      .then((sites) => {
        // Find the current site in the data
        const matchedSiteIndex = sites.findIndex(
          (site) => site.url === thisSite
        );
        const matchedSite = sites[matchedSiteIndex];

        let prevSiteIndex = matchedSiteIndex - 1;
        if (prevSiteIndex === -1) prevSiteIndex = sites.length - 1;

        let nextSiteIndex = matchedSiteIndex + 1;
        if (nextSiteIndex > sites.length) nextSiteIndex = 0;

        const randomSiteIndex = this.getRandomInt(0, sites.length - 1);
        const navigator = `
            <p>
                <a href="${sites[prevSiteIndex].url}">[Prev]</a>
            </p>
                <img class="logo" src="https://raw.githubusercontent.com/The-People-s-Coalition-of-Tandy/Tandy-Webring/main/TandyLogo.png"></img>
            <p>
                <a href="${sites[nextSiteIndex].url}">[Next]</a>
            </p>
            `;

        const random = `
          <strong>The Tandy Webring</strong>          
          <p>
            <a href="${sites[randomSiteIndex].url}">[Random]</a>
          </p>
        `;
        const copy = `
        <strong>The Tandy Webring</strong>          
      `;

        this.shadowRoot
          .querySelector("#navigator")
          .insertAdjacentHTML("afterbegin", navigator);
          
        this.shadowRoot
          .querySelector("#copy")
          .insertAdjacentHTML("afterbegin", copy);
      });
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

window.customElements.define("webring-css", WebRing);
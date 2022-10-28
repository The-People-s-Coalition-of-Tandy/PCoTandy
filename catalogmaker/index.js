function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    const credits = document.querySelectorAll(".credit");
    const links = document.querySelectorAll(".link");

    value.credits = serializeDiv(credits);
    value.links = serializeDiv(links);
    value.description = document.querySelector('#description').value;

    const jsonContainer = document.querySelector("#json");
    jsonContainer.classList.add('visible');
    jsonContainer.querySelector('code').innerHTML = JSON.stringify(value);
}

function serialize() {
    var elements = document.querySelectorAll('form input');

    var data = {};
    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        console.log(el.value);
        var val = el.value;
        if (!val) val = "";
        var fullName = el.getAttribute("name");
        if (!fullName) continue;
        var fullNameParts = fullName.split('.');
        var prefix = '';
        var stack = data;
        for (var k = 0; k < fullNameParts.length - 1; k++) {
            prefix = fullNameParts[k];
            if (!stack[prefix]) {
                stack[prefix] = {};
            }
            stack = stack[prefix];
        }
        prefix = fullNameParts[fullNameParts.length - 1];
        if (stack[prefix]) {

            var newVal = stack[prefix] + ',' + val;
            stack[prefix] += newVal;
        } else {
            stack[prefix] = val;
        }
    }
    let textNode = document.createTextNode(JSON.stringify(data));
    document.body.appendChild(textNode);
}

function addCredit() {
    const credit = `<div class="credit">
    <label for="credit-name">Name</label>
    <br>
    <input type="text" name="name" id="name" />
    <br>
    <label for="contribution">Contribution</label>
    <br>
    <input type="text" name="contribution" id="contribution" />
    <button class="close" onclick="removeSelf(this)">X</button>
</div>`
    var div = document.createElement('div');
    div.innerHTML = credit.trim();
    const creditsContainer = document.querySelector('#credits-container');
    creditsContainer.append(...div.childNodes);
}

function addLink() {
    const credit = `<div class="link">
    <label for="label">Name</label>
    <br>
    <input type="text" name="label" id="label" />
    <br>
    <label for="link">URL</label>
    <br>
    <input type="text" name="link" id="link" />
    <br>
    <label for="background">Background Color</label>
    <br>
    <input type="color" name="background" id="background" />
    <br>
    <label for="font">Font Color</label>
    <br>
    <input type="color" name="font" id="font" />
    <button class="close" onclick="removeSelf(this)">X</button>
</div>
`
    var div = document.createElement('div');
    div.innerHTML = credit.trim();
    const linksContainer = document.querySelector('#links-container');
    linksContainer.append(...div.childNodes);
}

function serializeDiv(divs) {
    let output = []
    let data = {};
    for (let i = 0; i < divs.length; i++) {
        const inputs = divs[i].querySelectorAll("input");
        data = {};
        for (let j = 0; j < inputs.length; j++) {
            data[inputs[j].name] = inputs[j].value;
        }
        output.push(data);
    }
    return output;
}

function removeSelf(e) {
    e.parentElement.remove();
}
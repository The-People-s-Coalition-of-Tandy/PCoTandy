var rect = document.getElementById("main").getBoundingClientRect();

function update(e) {
  var x = e.clientX - rect.left; //x position within the element.
  var y = e.clientY - rect.top; //y position within the element.

  document.documentElement.style.setProperty("--cursorX", x + "px");
  document.documentElement.style.setProperty(
    "--cursorY",
    y + window.scrollY + "px"
  );
}

function remove(e) {
  document.documentElement.style.setProperty("--cursorX", "0px");
  document.documentElement.style.setProperty("--cursorY", "0px");
}

var main = document.getElementById("main");

main.addEventListener("mousemove", update);
main.addEventListener("mouseout", remove);
main.addEventListener("touchmove", update);

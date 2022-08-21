function animateScene(e){
    const mainScene = document.getElementById("mainScene");
    const mainCube = document.getElementById("mainCube");
    const tinyContainer = document.getElementById("tinyContainer");
    const root = document.querySelector(':root');

    const song = document.getElementById("song");

    song.play();
    mainScene.classList.remove("hidden");
    mainScene.classList.add("fadeIn");
    mainCube.classList.add("hover");

    setTimeout(() => {
        mainCube.classList.remove("hover");
        mainCube.classList.add("spinning");
    }, 14800);

    setTimeout(() => {
        mainScene.classList.add("squiggle");
    }, 28100);

    setTimeout(() => {
        tinyContainer.classList.remove("hidden");
        tinyContainer.classList.add("fadeIn");
    }, 34800);

    setTimeout(() => {
        mainScene.classList.add("squiggleHard");
        mainScene.classList.remove("squiggle");
        tinyContainer.classList.add("rotate");
        tinyContainer.classList.add("squiggle");
    }, 47800);

    setTimeout(() => {
        mainScene.classList.remove("fadeIn");
        mainScene.classList.add("fadeOut");
        tinyContainer.classList.remove("rotate");
        tinyContainer.classList.remove("squiggle");
    }, 72500);

    setTimeout(() => {
        tinyContainer.classList.add("everyOtherSquiggle");
    }, 81000);

    setTimeout(() => {
        tinyContainer.classList.remove("everyOtherSquiggle");
        tinyContainer.classList.add("everyOther");
    }, 81000);

    setTimeout(() => {
        mainScene.classList.remove("fadeOut");
        mainScene.classList.remove("squiggleHard");
        mainScene.classList.add("fadeIn");
        tinyContainer.classList.remove("everyOther");
    }, 87500);

    setTimeout(() => {
        tinyContainer.classList.remove("fadeIn");
        tinyContainer.classList.add("fadeOut");
    }, 96000);

    setTimeout(() => {
        root.style.setProperty('--depth', '350px');
    }, 101000);

    setTimeout(() => {
        mainScene.classList.add("squiggle");
        mainScene.classList.add("rainbow");
    }, 107700);

    setTimeout(() => {
        mainScene.classList.remove("squiggle");
        root.style.setProperty('--depth', '30px');
        tinyContainer.classList.remove("fadeOut");
        tinyContainer.classList.add("squiggle");
        tinyContainer.classList.add("fadeIn");
    }, 119000);

    setTimeout(() => {
        mainScene.classList.remove("squiggle");
        mainScene.classList.remove("rainbow");
    }, 120600);

    setTimeout(() => {
        mainScene.classList.add("dashed");
        tinyContainer.classList.add("dashed");
    }, 134000);

    setTimeout(() => {
        tinyContainer.classList.add("everyOther");
        mainScene.classList.add("squiggleHard");
        tinyContainer.classList.add("fadeIn");
        root.style.setProperty('--depth', '350px');
    }, 147000);

    setTimeout(() => {
        tinyContainer.classList.add("rotate");
    }, 160500);

    setTimeout(() => {
        root.style.setProperty('--depth', '30px');
        mainScene.classList.remove("squiggleHard");
        mainScene.classList.remove("dashed");
        tinyContainer.classList.remove("dashed");
        tinyContainer.classList.add("rainbow");
    }, 175000);

    setTimeout(() => {
        tinyContainer.classList.remove("fadeIn");
        tinyContainer.classList.add("fadeOut");
        mainScene.classList.add("squiggle");
    }, 201000);

    setTimeout(() => {
        mainScene.classList.remove("squiggle");
    }, 215000);

    setTimeout(() => {
        mainScene.classList.remove("fadeIn");
        tinyContainer.classList.remove("fadeIn");
        mainScene.classList.add("fadeOut");
        tinyContainer.classList.add("fadeOut");
    }, 230000);

    setTimeout(() => {
        mainScene.classList.add("hidden");
        tinyContainer.classList.add("hidden");
        e.classList.remove("hidden");
    }, 234000);
}

function buttonClick() {
    var audio = document.getElementById("click");
    audio.play();
  }

  function buttonReturn(e) {
    var audio = document.getElementById("clack");
    audio.play();
    e.classList.add("hidden");

    setTimeout(() => {
        animateScene(e)
    }, 1000);


  }
import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.128.0/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "https://unpkg.com/three@0.128.0/examples/jsm/loaders/RGBELoader.js";

let camera, scene, renderer;
let logoMixer, singerOneMixer, singerTwoMixer, singerThreeMixer;
let startSinging = false;
let clock = new THREE.Clock();
var raycaster, mouse;
let bits = 30;

init();
render();

function init() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.25,
    1000
  );
  camera.position.set(0, 0, 10);

  scene = new THREE.Scene();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  // scene.background = new THREE.Color(0xffffff);

  // model

  new RGBELoader()
    .setPath("./assets/")
    .load("royal_esplanade_1k.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.environment = texture;

      const loader = new GLTFLoader().setPath("./assets/");
      loader.load("BoomBox.glb", function (gltf) {
        gltf.scene.scale.set(120, 120, 120);
        // gltf.scene.scale.set(160, 600, 160) // weird tall boombox
        gltf.scene.position.set(0, -2, 0);
        scene.add(gltf.scene);

        render();
      });

      loader.load("tandyLogoSpin.glb", function (gltf) {
        gltf.scene.scale.set(0.15, 0.15, 0.15);
        gltf.scene.position.set(-0.3, 2.5, 0);
        logoMixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
          logoMixer.clipAction(clip).play();
        });

        gltf.scene.remove(gltf.scene.children[0]);
        scene.add(gltf.scene);

        render(scene, camera);
      });

      loader.load("16untimed.glb", function (gltf) {
        gltf.scene.scale.set(1.3, 1.3, 1.3);
        gltf.scene.position.set(6.5, 0.4, 1);
        singerOneMixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
          singerOneMixer.clipAction(clip).play();
        });
        scene.add(gltf.scene);

        render(scene, camera);
      });

      loader.load("16untimed.glb", function (gltf) {
        gltf.scene.scale.set(1.3, 1.3, 1.3);
        gltf.scene.position.set(1.5, 0.4, -7);
        gltf.scene.rotation.set(0, 1.57, 0);
        singerTwoMixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
          singerTwoMixer.clipAction(clip).play();
        });
        scene.add(gltf.scene);

        render(scene, camera);
      });

      loader.load("16untimed.glb", function (gltf) {
        gltf.scene.scale.set(1.3, 1.3, 1.3);
        gltf.scene.position.set(1.75, 0.8, 2.5);
        gltf.scene.rotation.set(-0.5, -0.3, -0.5);
        singerThreeMixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
          singerThreeMixer.clipAction(clip).play();
        });
        scene.add(gltf.scene);

        render(scene, camera);
      });
    });

  var light = new THREE.DirectionalLight(0xfdfdfd, 0.5);
  light.position.set(2, 2, 1).normalize();
  var ambientLight = new THREE.AmbientLight(0x000022);
  scene.add(light);
  scene.add(ambientLight);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector("#bg"),
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth / bits, window.innerHeight / bits, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 5;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.addEventListener('change', render); // use if there is no animation loop
  // controls.minDistance = 2;
  // controls.maxDistance = 10;
  controls.target.set(0, 0, -0.2);
  controls.update();

  window.addEventListener("resize", onWindowResize);
  renderer.domElement.addEventListener("click", onClick, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick() {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children, true);

  if ((intersects.length > 0) & (intersects[0].object.name === "BoomBox")) {
    startSong();
  }
}

function startSong() {
  if (!startSinging) {
    document.getElementById("EV1").play();
    setTimeout(() => {
      startSinging = true;
    }, 13500);
  }
}

function render() {
  var delta = clock.getDelta();
  logoMixer.update(delta);
  if (startSinging) {
    singerOneMixer.update(delta);
    singerTwoMixer.update(delta);
    singerThreeMixer.update(delta);
  }

  requestAnimationFrame(render);
  renderer.setSize(window.innerWidth / bits, window.innerHeight / bits, false);
  if (bits > 1) {
    if (bits > 15) {
      bits -= 0.1;
    } else {
      bits -= 0.2;
    }
  }
  renderer.render(scene, camera);
}

import * as THREE from 'three';
import {
    OrbitControls
} from "https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js";
import {
    GLTFLoader
} from "https://unpkg.com/three@0.128.0/examples/jsm/loaders/GLTFLoader.js";
import {
    RGBELoader
} from "https://unpkg.com/three@0.128.0/examples/jsm/loaders/RGBELoader.js";

let camera, scene, renderer;
let logoMixer, singerOneMixer, singerTwoMixer;
let startSinging = false;
let clock = new THREE.Clock();

setTimeout(() => {
    startSinging = true;
}, 14000);

init();
render();

function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.set(0, 4, 20);

    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff);

    // model

    new RGBELoader()
        .setPath('./assets/')
        .load('royal_esplanade_1k.hdr', function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;

            scene.environment = texture;

            const loader = new GLTFLoader().setPath('./assets/');
            loader.load('BoomBox.glb', function (gltf) {
                gltf.scene.scale.set(180, 180, 180)

                scene.add(gltf.scene);

                render();

            });

            loader.load('tandyLogoSpin.glb', function (gltf) {
                gltf.scene.scale.set(.2, .2, .2);
                gltf.scene.position.set(-.5, 2, 0);
                logoMixer = new THREE.AnimationMixer(gltf.scene);
                gltf.animations.forEach((clip) => {
                    logoMixer.clipAction(clip).play();
                });

                gltf.scene.remove(gltf.scene.children[0]);
                scene.add(gltf.scene);

                render(scene, camera);

            });

            loader.load('16untimed.glb', function (gltf) {
                gltf.scene.scale.set(1, 1, 1);
                gltf.scene.position.set(8, 0, 2);
                singerOneMixer = new THREE.AnimationMixer(gltf.scene);
                gltf.animations.forEach((clip) => {
                    singerOneMixer.clipAction(clip).play();
                });
                scene.add(gltf.scene);

                render(scene, camera);
            });

            loader.load('16untimed.glb', function (gltf) {
                gltf.scene.scale.set(1, 1, 1);
                gltf.scene.position.set(2, 0, 2);
                singerTwoMixer = new THREE.AnimationMixer(gltf.scene);
                gltf.animations.forEach((clip) => {
                    singerTwoMixer.clipAction(clip).play();
                });
                scene.add(gltf.scene);

                render(scene, camera);
            });

        });


    var light = new THREE.DirectionalLight(0xfdfdfd, .5);
    light.position.set(2, 2, 1).normalize();
    var ambientLight = new THREE.AmbientLight(0x000022);
    scene.add(light);
    scene.add(ambientLight);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector('#bg'),
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setSize(window.innerWidth / 4, window.innerHeight / 4, false); 
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 5;
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0, -0.2);
    controls.update();

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2, false);
}

function render() {

    var delta = clock.getDelta();
    logoMixer.update(delta)
    if (startSinging) {
        singerOneMixer.update(delta)
        singerTwoMixer.update(delta)
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
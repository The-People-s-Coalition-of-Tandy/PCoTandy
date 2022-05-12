import * as THREE from 'three';
import  {OrbitControls} from "https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js";
import  {GLTFLoader} from "https://unpkg.com/three@0.128.0/examples/jsm/loaders/GLTFLoader.js";

let camera, scene, renderer;

init();
render();

function init() {
// The three main things! Scene, camera, render
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 2);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg')}); // {alpha:true} for transparency
// renderer.setClearColorHex( 0xffffff, 1 ); // assumes black background
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setSize(window.innerWidth/2, window.innerHeight/2, false); //makes it low res!

document.body.appendChild(renderer.domElement); // This is a <canvas> element


// NOTE: for low res, which is not used to my knowledge yet !!
// If you wish to keep the size of your app but render it at a lower resolution, 
// you can do so by calling setSize with false as updateStyle (the third argument). 
// For example, setSize(window.innerWidth/2, window.innerHeight/2, false) 
// will render your app at half resolution, given that your <canvas> has 100% width and height.

const loader = new GLTFLoader().setPath( './assets/' );
						loader.load( 'BoomBox.glb', function ( gltf ) {
                            gltf.scene.scale.set(40,40,40);
							scene.add( gltf.scene );

							render(scene, camera);

						} );

                        loader.load( 'tandyLogoSpin.glb', function ( gltf ) {
                            gltf.scene.scale.set(.08,.08,.08);
							scene.add( gltf.scene );

							render(scene, camera);

						} );
						const controls = new OrbitControls( camera, renderer.domElement );
				// controls.addEventListener( 'change', renderer.render ); // use if there is no animation loop
				controls.minDistance = 2;
				controls.maxDistance = 10;
				controls.target.set( 0, 0, - 0.2 );
				controls.update();
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

function render() {

	renderer.render( scene, camera );

}
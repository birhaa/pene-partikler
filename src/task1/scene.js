import * as THREE from 'three';


let camera, scene, renderer;


let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;


function initScene() {

  //Init camera
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 1000;

  //Init scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );

  //Init rendere
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );

  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshNormalMaterial();
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  animate()
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
  console.log("heia")
  renderer.render( scene, camera );

}

export default {
  initScene : initScene
}

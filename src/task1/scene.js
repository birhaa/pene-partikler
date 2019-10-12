import * as THREE from "three";

let camera, scene, renderer, cube;

const onWindowResize = function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const initScene = function(element) {
  //Init camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.z = 5;

  //Init scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0008);

  //Init rendere
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  element.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize, false);
};

const initParticles = function() {
  /**
   * Task1: Init a cube

   https://threejs.org/docs/#api/en/geometries/BoxGeometry

   Set rotation on the cube:

   cube.rotateY(0.5);
   cube.rotateX(0.5);

   **/
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshNormalMaterial();
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  /**
   * Task 3: Make multiple cubes.

   Maybe give them an initial position, rotation, material with different colors
   **/
};

function animate() {
  requestAnimationFrame(animate);
  /**
   * Task2: Make cube rotate

   Use .rotateX, .rotateY, .rotateZ with a radian and see the effects
   Note: this happens as many times as the frame rate. If the frame rate is 60,
   then this will happens 60 times in one second
   **/

  /**
    * Task 4: Move the cubes

    Try to give the cubes some movements by translating, rotating and scaling
    **/
  renderer.render(scene, camera);
}

export default {
  init: function(element) {
    initScene(element);
    initParticles();
    animate();
  }
};

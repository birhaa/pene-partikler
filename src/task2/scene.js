import * as THREE from "three";
import { bendPlaneGeometry } from "./geometryUtils";

import leaf1Img from "./images/leaf1.png";
import leaf2Img from "./images/leaf2.png";
import backgroundImg from "./images/background.jpg";

let camera, scene, renderer, mouse, raycaster, particles;
let sprite1, sprite2;
let leaves = [];

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
  camera.position.z = 10;

  //Init scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0008);
  var textureLoader = new THREE.TextureLoader();
  scene.background = textureLoader.load(backgroundImg);

  //Init render
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  element.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize, false);
};

const initTextures = function() {
  var textureLoader = new THREE.TextureLoader();
  sprite1 = textureLoader.load(leaf1Img);
  sprite2 = textureLoader.load(leaf2Img);
};

const initParticles = function() {
  for (let i = 0; i < 1000; i++) {
    let texture = i % 5 == 0 ? sprite2 : sprite1;
    let material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
      side: THREE.DoubleSide,
      depthTest: true,
      transparent: true
    });

    var geometry = new THREE.PlaneGeometry(20, 20, 20);
    geometry = bendPlaneGeometry(geometry, Math.random() * 5);
    let plane = new THREE.Mesh(geometry, material);
    plane.translateX(Math.random() * 1000 - 500);
    plane.translateY(Math.random() * 1000 - 500);
    plane.translateZ(Math.random() * 500 - 250);
    plane.rotateX(-1.0);
    plane.rotateZ(Math.random() * 2 * 3.14);
    let leaf = {
      plane: plane,
      velocity: -0.5
    };
    leaves.push(leaf);

    scene.add(plane);
  }
};

const updateParticles = function() {
  for (let i = 0; i < leaves.length; i++) {
    let leaf = leaves[i];
    leaf.plane.position.y = leaf.plane.position.y + leaf.velocity;
    leaf.plane.position.x = leaf.plane.position.x + 0.1;
    leaf.plane.rotateX(Math.random() * 0.01);
    leaf.plane.rotateY(Math.random() * 0.01);
    if (leaf.plane.position.y < -500) {
      leaf.plane.position.y = 500;
      leaf.plane.position.x = Math.random() * 1000 - 500;
    }
  }
};

const animate = function() {
  requestAnimationFrame(animate);
  updateParticles();
  renderer.render(scene, camera);
};

export default {
  init: function(element) {
    initScene(element);
    initTextures();
    initParticles();
    animate();
  }
};

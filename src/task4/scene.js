import * as THREE from "three";
import { getSphere, getPlane, getPlaneUVs } from "./geometryUtil.js";

import vertexShader from "./shaders/vertexshader.glsl";
import fragmentShader from "./shaders/fragmentshader.glsl";
import simulationVertexShader from "./shaders/simulation_vs.glsl";
import simulationFragmentShader from "./shaders/simulation_fs.glsl";

const pixelRatio = window.devicePixelRatio || 1;

const nofParticles = 0;

let timeStart, camera, renderer, scene;
let orthoCamera, simulationScene, rtt, simulationShader;

let animationStart = 0;
let animationInProgress = false;

let particles_num = 512;

const uniforms = {
  time: { value: 0.0 },
  pixelRatio: { value: pixelRatio },
  animationTime: { value: 0.0 },
  nofParticles: { value: nofParticles },
  texturePositions: { value: rtt }
};

const onWindowResize = function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const initRenderTarget = function() {
  let width = particles_num;
  let height = particles_num;
  let options = {
    minFilter: THREE.NearestFilter, //important as we want to sample square pixels
    magFilter: THREE.NearestFilter, //
    format: THREE.RGBAFormat, //180407 changed to RGBAFormat
    type: THREE.FloatType //important as we need precise coordinates (not ints)
  };
  rtt = new THREE.WebGLRenderTarget(width, height, options);
};

const initAnimation = function() {
  timeStart = new Date().getTime();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
  renderer.setPixelRatio(pixelRatio);
  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize);

  //camera
  const ratio =
    renderer.getContext().drawingBufferWidth /
    renderer.getContext().drawingBufferHeight;
  camera = new THREE.PerspectiveCamera(60, ratio, 0.1, 10000);
  camera.position.set(-75, 40, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.updateProjectionMatrix();

  //orthoCamera for simulation
  //https://threejs.org/docs/#api/en/cameras/OrthographicCamera
  orthoCamera = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    1 / Math.pow(2, 53),
    1
  );

  //scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1416);
  //simulation scene
  simulationScene = new THREE.Scene();
};

const initParticles = function() {
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false
  });

  const geometry = new THREE.BufferGeometry();
  const points = new THREE.Points(geometry, material);

  const nofParticles = Math.pow(particles_num, 2);
  uniforms.nofParticles.value = nofParticles;

  const positions = new Float32Array(nofParticles * 3);
  let vertexIndecies = new Float32Array(nofParticles);
  vertexIndecies = vertexIndecies.map((element, i) => i);

  geometry.addAttribute(
    "vertexIndex",
    new THREE.BufferAttribute(vertexIndecies, 1)
  );
  geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

  scene.add(points);
};

const initSimulation = function() {
  let width = particles_num;
  let height = particles_num;

  let data = getSphere(width, height);
  let texture = new THREE.DataTexture(
    data,
    width,
    height,
    THREE.RGBFormat,
    THREE.FloatType,
    THREE.UVMapping,
    THREE.ClampToEdgeWrapping,
    THREE.ClampToEdgeWrapping
  );
  texture.needsUpdate = true;

  simulationShader = new THREE.ShaderMaterial({
    uniforms: {
      texture: { type: "t", value: texture },
      timer: { type: "f", value: 0 },
      frequency: { type: "f", value: 0.01 },
      amplitude: { type: "f", value: 59 },
      maxDistance: { type: "f", value: 48 }
    },
    vertexShader: simulationVertexShader,
    fragmentShader: simulationFragmentShader
  });

  //create a bi-unit quadrilateral and uses the simulation material to update the Float Texture
  var geom = new THREE.BufferGeometry();
  geom.addAttribute("position", new THREE.BufferAttribute(getPlane(), 3));
  geom.addAttribute("uv", new THREE.BufferAttribute(getPlaneUVs(), 2));
  simulationScene.add(new THREE.Mesh(geom, simulationShader));
};

const updateSimulation = function() {
  renderer.setRenderTarget(rtt);
  renderer.render(simulationScene, orthoCamera);

  simulationShader.uniforms.timer.value += 0.01;
  uniforms.texturePositions.value = rtt.texture;
};

const render = function() {
  renderer.setRenderTarget(null);
  renderer.clear();
  renderer.render(scene, camera);
};

const animate = function() {
  requestAnimationFrame(animate);

  const now = new Date().getTime();
  uniforms.time.value = (now - timeStart) / 1000;

  updateSimulation();
  render();
};

export default {
  initScene: function() {
    initRenderTarget();
    initAnimation();
    initSimulation();
    initParticles();
    animate();
  }
};

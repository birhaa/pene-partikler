
/*From https://github.com/bekk/3d-visualisering-kursserie/tree/master/dag2/oppgave-6-particle-system */
import * as THREE from 'three';
import fragmentShader from './shaders/fragmentShader.glsl'
import vertexShader from './shaders/vertexShader.glsl'

const pixelRatio = window.devicePixelRatio || 1;

const nofParticles = Math.pow(125, 2);

let timeStart, camera, renderer, scene;

const uniforms = {
    time: {value: 0.0},
    pixelRatio: {value: pixelRatio},
    nofParticles: {value: nofParticles}
};

const initScene = function(element) {
    timeStart = new Date().getTime();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x1D1D1D);
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    renderer.setPixelRatio(pixelRatio);

    const ratio = renderer.getContext().drawingBufferWidth / renderer.getContext().drawingBufferHeight;

    camera = new THREE.PerspectiveCamera(60, ratio, 0.1, 10000);
    camera.position.set(-120, 40, 0)
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();

    element.appendChild(renderer.domElement);
    scene = new THREE.Scene();
}

const initParticles = function(){
  /**
  * This is where we initialize
  **/
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true
  });

  const nofParticles = Math.pow(125, 2);
  const positions = new Float32Array(nofParticles * 3);

  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

  let vertexIndecies = new Float32Array(nofParticles);
  vertexIndecies = vertexIndecies.map((element, i) => i);
  geometry.addAttribute(
    "vertexIndex",
    new THREE.BufferAttribute(vertexIndecies, 1)
  );

  const points = new THREE.Points(geometry, material);
  scene.add(points);
}

const animate = function() {
    requestAnimationFrame(animate);

    const now = new Date().getTime();
    uniforms.time.value = (now - timeStart) / 1000;

    renderer.render(scene, camera);
}

export default {
  init : function(element){
    initScene(element)
    initParticles()
    animate()
  }
}

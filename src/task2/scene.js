import * as THREE from 'three';


import leaf1Img from './images/leaf1.png'
import leaf2Img from './images/leaf2.png'
import backgroundImg from './images/background.jpg'


let camera, scene, renderer, particles;
let sprite1, sprite2;
let leaves = []


let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;


function initScene() {

  //Init camera
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 10;

  //Init scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );
  var textureLoader = new THREE.TextureLoader();
  scene.background = textureLoader.load( backgroundImg);

  //Init rendere
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );

  initTextures()
  initParticles()
  animate()
}

function initTextures(){
  var textureLoader = new THREE.TextureLoader();
  sprite1 = textureLoader.load( leaf1Img);
  sprite2 = textureLoader.load( leaf2Img);
}

function initParticles(){


  for (let i = 0; i < 1000; i++){
    let texture = i % 5 == 0 ? sprite2 : sprite1
    let material = new THREE.MeshBasicMaterial( {  map: texture, color: 0xffffff, side: THREE.DoubleSide, depthTest: true, transparent: true} );

   var geometry = new THREE.PlaneGeometry( 20, 20, 20 );
    geometry = bendPlaneGeometry(geometry, Math.random()*5)
    let plane = new THREE.Mesh( geometry, material );
    plane.translateX(Math.random() * 1000 - 500)
    plane.translateY(Math.random() * 1000 - 500)
    plane.translateZ(Math.random() * 500 - 250)
    plane.rotateX(-1.0)
  //  plane.rotateX(Math.random())
    plane.rotateZ(Math.random()*2*3.14)
    //plane.rotateY(Math.random())
    let leaf= {
      plane : plane,
      velocity : 0.0
    }
    leaves.push(leaf)

    scene.add( plane );
  }
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

  var time = Date.now() * 0.00005;

  for(let i = 0; i < leaves.length; i++){
    let leaf = leaves[i]
    let g = -9.81;
  //  if(leaf.plane.position.y > -50){
      let v = leaf.velocity+g*0.05
      // leaf.plane.translateY(-0.2)
      //console.log(THREE.Math.radToDeg(leaf.plane.rotation.y ) % 360)
      leaf.plane.position.y = leaf.plane.position.y + v;
      leaf.plane.position.x = leaf.plane.position.x+ 0.1;
      leaf.plane.rotateX(Math.random()*0.01)
      leaf.plane.rotateY(Math.random()*0.01)
  //  }
  if(leaf.plane.position.y < -500){
      leaf.plane.position.y = 500;
      leaf.plane.position.x = Math.random() * 1000 - 500;
  }


  }


  renderer.render( scene, camera );
}


function bendPlaneGeometry(planeGeometry, centerBendZ)
{
  var curve = new THREE.CubicBezierCurve3(
		planeGeometry.vertices[0],
		new THREE.Vector3(planeGeometry.parameters.width/2, 0, centerBendZ ),
		new THREE.Vector3(planeGeometry.parameters.width/2, 0, centerBendZ ),
		planeGeometry.vertices[(planeGeometry.vertices.length/2) - 1]
	);

	var planePoints = curve.getPoints(Math.abs(planeGeometry.vertices.length/2)-1);

	for(var edgeI = 1; edgeI < 3; edgeI++){
		for(var pointI = 0; pointI < planePoints.length; pointI++){
			planeGeometry.vertices[(edgeI === 2) ? planePoints.length + pointI : pointI].z = planePoints[pointI].z;
		}
	}

	planeGeometry.computeFaceNormals();
	planeGeometry.computeVertexNormals();

	return planeGeometry;
}

export default {
  initScene : initScene
}

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import vertexShader from './shaders/vertexshader.glsl'
import fragmentShader from './shaders/fragmentshader.glsl'
import simulationVertexShader from './shaders/simulation_vs.glsl'
import simulationFragmentShader from './shaders/simulation_fs.glsl'


const pixelRatio = window.devicePixelRatio || 1;

const nofParticles = 0;

let timeStart, camera, renderer, scene, composer, afterimagePass;
let orthoCamera, simulationScene, rtt, simulationShader;

let animationStart = 0;
let animationInProgress = false;

let particles_num  = 512;


const uniforms = {
    time: {value: 0.0},
    pixelRatio: {value: pixelRatio},
    animationTime: {value: 0.0},
    nofParticles: {value: nofParticles},
    texturePositions : {value: rtt}
};


const initRenderTarget = function(){
    let width  = particles_num;
    let height = particles_num;
    let options = {
        minFilter: THREE.NearestFilter,//important as we want to sample square pixels
        magFilter: THREE.NearestFilter,//
        format: THREE.RGBAFormat,//180407 changed to RGBAFormat
        type:THREE.FloatType//important as we need precise coordinates (not ints)
    };
    rtt = new THREE.WebGLRenderTarget( width,height, options);
}

const initAnimation = function() {
    timeStart = new Date().getTime();

    renderer = new THREE.WebGLRenderer({
       // logarithmicDepthBuffer: true

       //preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    renderer.setPixelRatio(pixelRatio);
    /*renderer.autoClear = false;
    renderer.info.autoReset = false;
    renderer.autoClearColor = false;
    renderer.autoClearDepth = false;
    renderer.autoClearStencil = false;
    renderer.autoReset = false;*/
    document.body.appendChild(renderer.domElement);
    window.addEventListener( 'resize', onWindowResize );



    //camera
    const ratio = renderer.getContext().drawingBufferWidth / renderer.getContext().drawingBufferHeight;
    camera = new THREE.PerspectiveCamera(60, ratio, 0.1, 10000);
  //  new OrbitControls(camera);
    camera.position.set(-75, 40, 0)
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();

    //scene
    scene = new THREE.Scene();
    //scene.background = new THREE.Color( 0xfff5e8 );
   // scene.background = new THREE.Color(0x110000);
   scene.background = new THREE.Color(0x0b1416);

    //debug cube
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 1 ).normalize();
    scene.add(light);

    var cgeometry = new THREE.BoxGeometry(10, 10, 10);
    var cmaterial = new THREE.MeshLambertMaterial({map: rtt.texture});
    var cube = new THREE.Mesh(cgeometry, cmaterial);

}

const initParticles = function(){
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
      });
    const points = new THREE.Points(geometry, material);
    const nofParticles = Math.pow(particles_num, 2);
    uniforms.nofParticles.value = nofParticles;
    const positions = new Float32Array(nofParticles * 3);

    let vertexIndecies = new Float32Array(nofParticles);
    vertexIndecies = vertexIndecies.map((element, i) => i);

    geometry.addAttribute( "vertexIndex", new THREE.BufferAttribute(vertexIndecies, 1));
    geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

    let color = new Float32Array(nofParticles * 3);
    color = color.map(Math.random);
    geometry.addAttribute("color", new THREE.BufferAttribute(color, 3));

    scene.add(points)
}

const initSimulation = function( ){

    let width  = particles_num;
    let height = particles_num;

    let data = getSphere2( width , height );
    let texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat, THREE.FloatType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping );
    //let texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat );
    texture.needsUpdate = true;

    simulationShader = new THREE.ShaderMaterial({
        uniforms: {
            texture: { type: "t", value: texture },
            texture2 : {typer :"t", value: texture},
            timer: { type: "f", value: 0},
            frequency: { type: "f", value: 0.01 },
            amplitude: { type: "f", value: 59 },
            maxDistance: { type: "f", value: 48 }
        },
        vertexShader: simulationVertexShader,
        fragmentShader:  simulationFragmentShader
    });

    //3 rtt setup
    simulationScene = new THREE.Scene();
    orthoCamera = new THREE.OrthographicCamera(-1,1,1,-1,1/Math.pow( 2, 53 ),1 );

    //5 the simulation:
    //create a bi-unit quadrilateral and uses the simulation material to update the Float Texture
    var geom = new THREE.BufferGeometry();
    geom.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([   -1,-1,0, 1,-1,0, 1,1,0, -1,-1, 0, 1, 1, 0, -1,1,0 ]), 3 ) );
    geom.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array([   0,1, 1,1, 1,0,     0,1, 1,0, 0,0 ]), 2 ) );
    simulationScene.add( new THREE.Mesh( geom, simulationShader ) );

}

function updateAnimationTime() {
    if (animationInProgress) {
        const animationLength = 2.5;
        const now = new Date().getTime();
        let animationTime = (now - animationStart) / 1000 / animationLength;

        if (animationTime > 1) {
            animationInProgress = false;
            animationTime = 0;
        }

        uniforms.animationTime.value = animationTime;
    } else {
        uniforms.animationTime.value = 0;
    }

    //console.log(uniforms.animationTime.value);
}

function updateSimulation(){

    //1 update the simulation and render the result in a target texture
    renderer.setRenderTarget(rtt);
    renderer.render( simulationScene, orthoCamera);
   // console.log(rtt.texture);

    simulationShader.uniforms.timer.value += 0.01;
    simulationShader.uniforms.texture2.value = rtt.texture.value;
    //console.log(simulationShader.uniforms.timer.value);

    //2 use the result of the swap as the new position for the particles' renderer
    uniforms.texturePositions.value = rtt.texture;

};

const animate = function() {
    requestAnimationFrame(animate);

    const now = new Date().getTime();
    uniforms.time.value = (now - timeStart) / 1000;

    updateSimulation();
    updateAnimationTime();

    renderer.setRenderTarget(null)
    renderer.clear()
    renderer.render(scene, camera);
    //composer.render()
}


function onWindowResize() {
    var width = window.innerWidth
    var height = window.innerHeight;

    camera.aspect = width/ height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );

  }




Math.cbrt = Math.cbrt || function(x) {
    var y = Math.pow(Math.abs(x), 1/3);
    return x < 0 ? -y : y;
};
function getPoint(v,size)
{
    //the 'discard' method, not the most efficient
    v.x = Math.random() * 2 - 1 ;
    v.y = Math.random() * 2 - 1 ;
    v.z = Math.random() * 2 - 1 ;
    if(v.length()>1)return getPoint(v,size);
    return v.normalize().multiplyScalar(size);
}


//returns a Float32Array buffer of spherical 3D points
function getSphere( count, size ){

    var len = count * 3;
    var data = new Float32Array( len );
    var p = new THREE.Vector3();
    for( var i = 0; i < len; i+=3 )
    {
        getPoint( p, size );
        data[ i     ] = p.x;
        data[ i + 1 ] = p.y;
        data[ i + 2 ] = p.z;
    }
    return data;
}


function getSphere2(xlen, ylen){
    var count = 0;
    var pi = 3.14;
    var data = new Float32Array( xlen*ylen*3 );
    for( var xv = 0; xv < xlen; xv+=1 )
    {
        for(var yv = 0; yv < ylen; yv+=1 ){

            var angle1 =-3.14*xv*2.0/xlen;
            var angle2 = pi*yv/ylen - pi/2.0;

            var x = 60.0 * Math.cos(angle2) * Math.cos(angle1);
            var y = 60.0 * Math.cos(angle2) * Math.sin(angle1);
            var z = 60.0 * Math.sin(angle2);


            data[ count++ ] = x;
            data[ count++ ] = y;
            data[ count++ ] = z;
        }

    }
  //  console.log(xlen,ylen);
  //  console.log(data);
    return data;
}

export default {
  initScene : function(){
    initRenderTarget();
    initAnimation();
    initSimulation();
    initParticles();
    animate();
  }
}

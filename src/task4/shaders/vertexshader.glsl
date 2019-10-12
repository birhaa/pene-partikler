#define PI 3.14159265358979323844
uniform sampler2D texturePositions;


uniform float time;
uniform float pixelRatio;
uniform float nofParticles;

attribute float vertexIndex;

varying float zPosition;
varying float yPosition;
varying float size;

float particleSize = 300.0;

vec2 makeGrid(){
  float w = floor(sqrt(nofParticles));
  float xGrid = mod(vertexIndex, w);
  float yGrid = floor(vertexIndex / w);

  return vec2(xGrid, yGrid);
}

vec3 makeSphere(){
  float w = floor(sqrt(nofParticles));
  vec2 grid = makeGrid();

  float angle1 =-3.14*grid.x*2.0/w;
  float angle2 = PI*grid.y/w - PI/2.0;

  float radius = 15.0;
  float x = 15.0*cos(angle2) * cos(angle1);
  float y = 15.0*cos(angle2) * sin(angle1);
  float z = 15.0*sin(angle2);

  return vec3(x, z, y);
}

vec3 editPos(vec3 pos){

  float waveSpeed = 3.0;
  float waveLength = 10.0;
  float amplitude = 3.0;

  float x1 = pos.x/waveLength + time * waveSpeed;

  pos.y += amplitude * sin(x1);
  //pos.z +=  cos(x1) * (1.0-tan(pos.x));
   //pos.z = time * sin(pos.z) * sin(pos.x) * sin(pos.y);
  return pos;
}

vec3 posFromSimulation(){
  float w = floor(sqrt(nofParticles));
  vec2 grid = makeGrid();
  float xGrid = clamp(grid.x /w,0.0,1.0);
  float yGrid = clamp(grid.y/w,0.0,1.0);

  return texture2D( texturePositions, vec2(xGrid, yGrid)).xyz*0.2;
}

void main() {

    vec3 pos = makeSphere();

    pos = posFromSimulation();
    //pos = editPos(pos);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    gl_PointSize = particleSize * pixelRatio / gl_Position.z;

    //Send variables to fragmentShader
    zPosition = gl_Position.z;
    yPosition = gl_Position.y;

}

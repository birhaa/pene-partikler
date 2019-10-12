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
  vec2 grid = makeGrid();

  float w = floor(sqrt(nofParticles));

  float angle1 =-3.14*grid.x*2.0/w;
  float angle2 = PI*grid.y/w - PI/2.0;

  float radius = 15.0;
  float x = radius*cos(angle2) * cos(angle1);
  float y = radius*cos(angle2) * sin(angle1);
  float z = radius*sin(angle2);

  return vec3(x, z, y);
}

vec3 editPos(vec3 pos){

  /**
  * Task 3 : Make the spehere wobbely by making waves

  Use:
  float waveSpeed = 3.0;
  float waveLength = 10.0;
  float amplitude = 3.0;

  float x1 = pos.x/waveLength + time * waveSpeed;
  pos.y += amplitude * sin(x1);

  Addional:
  Try different sin, cos, tan funcions
  Example:
  pos.z +=  cos(x1) * (1.0-tan(pos.x));

  **/
  return pos;
}

vec3 posFromSimulation(){
  /**
  * Task 4: Use simulation data from texture2

  1. Make the grid
  float w = floor(sqrt(nofParticles));
  vec2 grid = makeGrid();

  2. Use the grid to caluclate texture coordinates, uvs
  We do that bytaking the grid pos and diving by the width.
  clamp makes sure the number is between 0 and 1 if it goes outside that range.
  float xGrid = clamp(grid.x /w,0.0,1.0);
  float yGrid = clamp(grid.y/w,0.0,1.0);

  3. Then we look up the value in the texture cooresponding to the texture coordinates
  and return the pos saved in the texture
  return texture2D( texturePositions, vec2(xGrid, yGrid)).xyz*0.2;

  Nb: use this function in main instead of makeSphere and editPos
  **/
  return makeSphere();
}

void main() {

    vec3 pos = makeSphere();
    pos  = editPos(pos);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    gl_PointSize = particleSize * pixelRatio / gl_Position.z;

    //Send variables to fragmentShader
    zPosition = gl_Position.z;
    yPosition = gl_Position.y;

}

#define PI 3.14159265358979323844

//uniform is variables that are the same for every vertex
uniform float time;
uniform float pixelRatio;
uniform float nofParticles;

//attribute are varibales unique per vertex. This is used to calcuate the vertex position
//This is the attribute calculated in task
attribute float vertexIndex;

vec3 gridPosition() {

  /**
  * Task last -3 Make a particle grid

  1. Calculate the with of the grid which is the square root of numbe of particles
  Floor gets closest integer
  float w = floor(sqrt(nofParticles));

  2. Calculate the x and y position based ong the vertex index.
  Mod is the maticmatical modulo. Ex. index = 14, w= 10, mod(14,10) = 4
  float x = mod(vertexIndex, w);
  float y = floor(vertexIndex / w);
  return vec3(x, 0.0, y);

  3. Center the particles around origio by subtracting half the width
  return vec3(x - w/2.0, 0.0, y - w/2.0);
  **/

  return vec3(0.0,0.0,0.0);
}

void main() {
  vec3 newPosition = gridPosition();


  /**
  * Task last -1 Make waves. Use the x coordinate to set the height (y)

  1. Make waves by using a sine function based on the coordinate x
  float x = newPosition.x;
  newPosition.y += sin(x);

  2. Make the wave move with waveSpeed and time which is calculated in the animate function
  float waveSpeed = 3.0;
  x = x + time * waveSpeed;

  3. Make longer waves by divide x on waveLength
  float waveLength = 10.0;
  x = x / waveLength + time * waveSpeed;

  4. Make the waves higher by multiply with an amplitude
  float amplitude = 3.0;
  newPosition.y += amplitude * sin(x);
  **/


  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  /**
  * Task last -2. Make particles bigger and adjust for depth

  It is natural for particles far behind looks smaller then particles closer to the camera.
  gl_Position.z is the position of the particle in the camera cooridate system, which equals the depth. (x and y is the screen coordinate)
  By dividing the particle size on the z-coordinate, the size wil vary with the depth of the particle.
  We will also make the particles bigger since the depth is a pretty high number.
  You can try to adjust the particleSize to get a size that you like.

  Use:
  float particleSize = 300.0;
  gl_PointSize = particleSize * pixelRatio/gl_Position.z;
  **/
  float particleSize = 3.0;
  gl_PointSize = particleSize * pixelRatio;

}

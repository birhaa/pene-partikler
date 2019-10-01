#define PI 3.14159265358979323844

uniform float time;
uniform float pixelRatio;
uniform float nofParticles;

attribute float vertexIndex;

vec3 gridPosition() {
  float w = floor(sqrt(nofParticles));

  float x = mod(vertexIndex, w);
  float y = floor(vertexIndex / w);

  return vec3(x - w/2.0, 0.0, y - w/2.0);
}

void main() {
  vec3 newPosition = gridPosition();

  float x = newPosition.x;
  float waveSpeed = 3.0;
  float waveLength = 10.0;
  x = x / waveLength + time * waveSpeed;
  float amplitude = 3.0;
  newPosition.y += amplitude * sin(x);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  float particleSize = 300.0;
  gl_PointSize = particleSize * pixelRatio/gl_Position.z;

}

#define PI 3.14159265358979323844
uniform sampler2D texturePositions;


uniform float time;
uniform float pixelRatio;
uniform float nofParticles;
uniform float animationTime;

attribute float vertexIndex;
attribute vec3 color;

varying vec3 colorForFragshader;
varying float zPosition;
varying float yPosition;
varying float size;
varying float vi;

float particleSize = 300.0;

vec3 gridPosition() {
  //float w = floor(sqrt(nofParticles));
  //float x = mod(vertexIndex, w)/2.0;
  //float y = floor(vertexIndex / w)/2.0;
  //return vec3(x - w/2.0, 0.0, y - w/2.0);

  float w = floor(sqrt(nofParticles));
  float xGrid = mod(vertexIndex, w);
  float yGrid = floor(vertexIndex / w);

  float pi = 3.14;
  //pi =2.0;
  float angle1 =-3.14*xGrid*2.0/w;
  float angle2 = pi*yGrid/w - pi/2.0;



  //cylinder
  //  float z = 10.0 * cos(angle2);
  ///float x = 10.0 * sin(angle1);
  //float y = 10.0  *cos(angle1);

  //circle
  //float x = 10.0 * sin(angle2);
  //float y = 10.0 * cos(angle2);

 //sphere
 float x = 5.0*cos(angle2) * cos(angle1);
 float y = 5.0*cos(angle2) * sin(angle1);
 float z = 5.0*sin(angle2);

  //float u = xGrid/w;
 // float v = yGrid/w;

 //z = 5.0;


 // x = -u + (2 * wsqr * cosh(aa * u) * sinh(aa * u) / denom)
 // y = 2 * w * cosh(aa * u) * (-(w * cos(v) * cos(w * v)) - (sin(v) * sin(w * v))) / denom
 // z = 2 * w * cosh(aa * u) * (-(w * sin(v) * cos(w * v)) + (cos(v) * sin(w * v))) / denom

//Texture pos
 // vec3 pos = texture2D( texturePositions, vec2(xGrid/w,yGrid/w) ).xyz/5.0;
 // x += pos.x;
  //y += pos.y;
 // z += pos.z;

  return vec3(x, z, y);
}

// Hvis t er mellom 0 og 1:
float easeInOutCubic(float t) {
  if (t < 0.5)
    return 4.0*t*t*t;
  else
    return (t-1.0)*(2.0*t-2.0)*(2.0*t-2.0)+1.0;
}

void main() {
  float waveSpeed = 3.0;
  float waveLength = 10.0;
  float amplitude = 3.0;

  vec3 newPosition = gridPosition();

  colorForFragshader = color;

  float x = newPosition.x;
  float y = newPosition.y;
  float z = newPosition.z;


  float x1 = x/waveLength + time * waveSpeed;


  //newPosition.y += amplitude * sin(x1);
 //newPosition.z +=   cos(x1) * (1.0-tan(newPosition.x));//* sin(newPosition.z));
 //newPosition.x += 0.1 * tan(newPosition.y * time);

 //newPosition.z +=  sin(z);
 //newPosition.y +=  tan(z);
  //newPosition.z += sin(x) + cos(y);


  //newPosition.z = time * sin(z) * sin(x) * sin(y);



  bool isGreen = color.g > color.r && color.g > color.b;

  if (isGreen) {
    float targetHeight = 20.0;
    float movement = -abs(animationTime * 2.0 - 1.0) + 1.0;
    movement = easeInOutCubic(movement);
    newPosition.y = mix(newPosition.y, targetHeight, movement);
  }

 float w = floor(sqrt(nofParticles));
  float xGrid = clamp(mod(vertexIndex, w) /w,0.0,1.0);
  float yGrid = clamp(floor(vertexIndex / w)/w,0.0,1.0);

    vec3 pos = texture2D( texturePositions, vec2(xGrid, yGrid)).xyz*0.2;

    //pos now contains the position of a point in space taht can be transformed
    vec4 test  =projectionMatrix * modelViewMatrix * vec4( pos.x, pos.y, pos.z, 1.0 );
   gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    //gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0) + test * time*0.1;

    zPosition = gl_Position.z;
    yPosition = gl_Position.y;
    vi = x;

    //sizeed
   //size = max( 1., ( step( 1. - ( 1. / 512. ), position.x ) ) * 1.0 );
    //gl_PointSize = size;
    gl_PointSize = particleSize * pixelRatio / gl_Position.z;

}
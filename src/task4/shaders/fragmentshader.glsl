uniform sampler2D texturePositions;

varying vec3 colorForFragshader;
varying float zPosition;
varying float yPosition;
varying float vi;


void main() {
  float s = clamp((600.0-zPosition)/600.0,1.0,0.0);
  float strength = s*4.5;//*0.09;

  float radius = 2.0 * length(gl_PointCoord - vec2(0.5));

  //Beige background
  //vec3 color = vec3(0.15, 0.2,0.12);

 // vec3 color = vec3(yPosition/20.0*0.5, (1.0-yPosition/40.0)*0.1 ,zPosition/55.0*0.5);
  //vec3 color = vec3(0.1,0.2,0.0);
  //if(zPosition < 40.0)
    //color = vec3(0.0,0.2,0.5); 

  float t =  vi/2.0;
  float red = (yPosition/40.0)*0.5;
  /*float blue = (yPosition/40.0)*0.5;
  float green = (1.0-yPosition/40.0)*0.005;
  vec3 color = vec3(red, green ,blue); */

  vec3 color =   vec3(0.05,0.1 + 0.2*vi ,0.3*vi);
  
  float alpha = 1.0;
  alpha = (1.0 - radius)/4.0;

  alpha *= strength;

  gl_FragColor = vec4(color, alpha);
}
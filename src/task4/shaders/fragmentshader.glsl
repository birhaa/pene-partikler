uniform sampler2D texturePositions;

varying float zPosition;
varying float yPosition;

void main() {
  float strength = 0.25;

  vec3 color = vec3(yPosition/20.0*0.5, (1.0-yPosition/20.0)*0.5 ,zPosition/55.0*0.5);
  color = color * strength;

  float radius = 2.0 * length(gl_PointCoord - vec2(0.5));
  float alpha = 1.0;
  alpha = (1.0 - radius)/4.0;
  alpha *= strength;

  gl_FragColor = vec4(color, alpha);
}

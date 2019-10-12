


void main() {
  vec3 color = vec3(1.0);
  float alpha = 1.0;
  /**
  *Task 5: make circles

  1. Set alpha to the point radius:
  float radius = length(gl_PointCoord);
  alpha = radius;

  2. Subtract 0.5 to move center to the center of the particle:
  float radius = length(gl_PointCoord - vec2(0.5));

  3. Now the radius is between 0, 0.5. Multiply with 2 to make it between 0,1
  float radius = 2.0 * length(gl_PointCoord - vec2(0.5));

  4. We need to invert the alpha, to make it colorful in thee middle and transparent in the edges:
  alpha = 1.0 - radius;

  5. Last, make the seem particles bigger by strengthing the alpha value
  float strength = 5.0;
  alpha *= strength;
  **/

  /**
  * Bonus: Make the particles another color than white
  **/

  gl_FragColor = vec4(color, alpha);
}

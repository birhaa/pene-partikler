export function getSphere(xlen, ylen) {
  var count = 0;
  var pi = 3.14;
  var data = new Float32Array(xlen * ylen * 3);
  for (var xv = 0; xv < xlen; xv += 1) {
    for (var yv = 0; yv < ylen; yv += 1) {
      var angle1 = (-3.14 * xv * 2.0) / xlen;
      var angle2 = (pi * yv) / ylen - pi / 2.0;

      var x = 60.0 * Math.cos(angle2) * Math.cos(angle1);
      var y = 60.0 * Math.cos(angle2) * Math.sin(angle1);
      var z = 60.0 * Math.sin(angle2);

      data[count++] = x;
      data[count++] = y;
      data[count++] = z;
    }
  }
  return data;
}

export function getPlane() {
  return new Float32Array([
    -1,
    -1,
    0,
    1,
    -1,
    0,
    1,
    1,
    0,
    -1,
    -1,
    0,
    1,
    1,
    0,
    -1,
    1,
    0
  ]);
}

export function getPlaneUVs() {
  return new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);
}

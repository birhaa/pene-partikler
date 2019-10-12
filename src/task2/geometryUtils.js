import * as THREE from "three";

//This is taken from somewhere on the internet...

export function bendPlaneGeometry(planeGeometry, centerBendZ) {
  var curve = new THREE.CubicBezierCurve3(
    planeGeometry.vertices[0],
    new THREE.Vector3(planeGeometry.parameters.width / 2, 0, centerBendZ),
    new THREE.Vector3(planeGeometry.parameters.width / 2, 0, centerBendZ),
    planeGeometry.vertices[planeGeometry.vertices.length / 2 - 1]
  );

  var planePoints = curve.getPoints(
    Math.abs(planeGeometry.vertices.length / 2) - 1
  );

  for (var edgeI = 1; edgeI < 3; edgeI++) {
    for (var pointI = 0; pointI < planePoints.length; pointI++) {
      planeGeometry.vertices[
        edgeI === 2 ? planePoints.length + pointI : pointI
      ].z = planePoints[pointI].z;
    }
  }

  planeGeometry.computeFaceNormals();
  planeGeometry.computeVertexNormals();

  return planeGeometry;
}

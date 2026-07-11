/**
 * Landmass helpers for the particle globe. Converts world-atlas TopoJSON
 * (110m resolution, ~55KB) into a spherical point-in-polygon test and
 * coastline line segments. Imported only from the lazy three.js chunk, so
 * none of this ships to mobile.
 */
import { feature, mesh } from 'topojson-client';
import { geoContains } from 'd3-geo';
import landTopo from 'world-atlas/land-110m.json';

/* eslint-disable @typescript-eslint/no-explicit-any */
const topology = landTopo as any;
const landFeature = feature(topology, topology.objects.land) as any;
const coastlines = mesh(topology, topology.objects.land) as any;
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Matches the classic three.js lat/lon → sphere mapping. */
export function latLonToVec3(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

/** Inverse of latLonToVec3 for unit-sphere points. */
export function vec3ToLatLon(x: number, y: number, z: number): [number, number] {
  const r = Math.sqrt(x * x + y * y + z * z) || 1;
  const phi = Math.acos(Math.min(1, Math.max(-1, y / r)));
  const theta = Math.atan2(z, -x);
  const lat = 90 - (phi * 180) / Math.PI;
  let lon = (theta * 180) / Math.PI - 180;
  if (lon < -180) lon += 360;
  if (lon > 180) lon -= 360;
  return [lat, lon];
}

/** True when the lat/lon falls on land (spherical point-in-polygon). */
export function isLand(lat: number, lon: number): boolean {
  return geoContains(landFeature, [lon, lat]);
}

/**
 * Coastline outlines as flat segment positions [x1,y1,z1, x2,y2,z2, ...]
 * for LineSegmentsGeometry.setPositions, projected slightly above the
 * particle radius so lines sit on top of the dots.
 */
export function coastlineSegments(radius = 1.004): Float32Array {
  const positions: number[] = [];
  const lines: number[][][] =
    coastlines.type === 'MultiLineString' ? coastlines.coordinates : [coastlines.coordinates];
  for (const line of lines) {
    for (let i = 0; i < line.length - 1; i++) {
      const [lon1, lat1] = line[i];
      const [lon2, lat2] = line[i + 1];
      positions.push(...latLonToVec3(lat1, lon1, radius), ...latLonToVec3(lat2, lon2, radius));
    }
  }
  return new Float32Array(positions);
}

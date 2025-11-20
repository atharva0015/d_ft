import { Vector3 } from 'three';

export const distance = (a: Vector3, b: Vector3): number => {
  return a.distanceTo(b);
};

export const normalize = (v: Vector3): Vector3 => {
  return v.clone().normalize();
};

export const lerp = (a: Vector3, b: Vector3, t: number): Vector3 => {
  return new Vector3(
    a.x + (b.x - a.x) * t,
    a.y + (b.y - a.y) * t,
    a.z + (b.z - a.z) * t
  );
};

export const randomInSphere = (radius: number): Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;

  return new Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

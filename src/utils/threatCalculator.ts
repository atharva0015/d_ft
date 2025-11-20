import { Drone } from '../types/drone.types';
import { Asset } from '../types/asset.types';
import { ThreatScore } from '../types/drone.types';
import { Vector3 } from 'three';

export interface WeightConfig {
  w1: number; // Type priority
  w2: number; // Proximity priority
  w3: number; // Cost
}

export const calculateThreatScore = (
  drone: Drone,
  assets: Asset[],
  friendlyDrones: Drone[],
  weights: WeightConfig
): ThreatScore => {
  // Find nearest asset
  let nearestAsset = assets[0];
  let minDistance = Infinity;

  assets.forEach(asset => {
    const dist = drone.position.distanceTo(asset.position);
    if (dist < minDistance) {
      minDistance = dist;
      nearestAsset = asset;
    }
  });

  // Calculate Ptype (Type Priority)
  let Ptype = 0;
  if (drone.type === 'hostile-ground') {
    Ptype = 100; // Highest priority for ground-attack drones
  } else if (drone.type === 'hostile-air') {
    Ptype = 50; // Medium priority for air-to-air drones
  }

  // Calculate Pprox (Proximity Priority)
  // Exponential decay: closer = higher priority
  const maxRange = nearestAsset.threatRadius * 2;
  const normalizedDistance = Math.min(minDistance / maxRange, 1);
  const Pprox = 100 * (1 - normalizedDistance) ** 2; // Quadratic decay

  // Calculate Ccost (Cost to engage)
  // Based on distance to friendly drones
  let minFriendlyDistance = Infinity;
  friendlyDrones.forEach(friendly => {
    const dist = drone.position.distanceTo(friendly.position);
    if (dist < minFriendlyDistance) {
      minFriendlyDistance = dist;
    }
  });

  // Normalize cost: closer friendly = lower cost
  const Ccost = Math.min((minFriendlyDistance / 1000) * 100, 100);

  // Calculate ST
  const ST = Math.max(
    0,
    Math.min(
      100,
      weights.w1 * Ptype + weights.w2 * Pprox - weights.w3 * Ccost
    )
  );

  return {
    ST,
    Ptype,
    Pprox,
    Ccost,
    breakdown: {
      typeContribution: weights.w1 * Ptype,
      proximityContribution: weights.w2 * Pprox,
      costContribution: weights.w3 * Ccost,
    },
    targetAssetId: nearestAsset.id,
    distance: minDistance,
  };
};

export const calculateWinProbability = (
  friendlyDrones: Drone[],
  hostileDrones: Drone[],
  assets: Asset[]
): {
  overall: number;
  factors: {
    forceRatio: number;
    healthStatus: number;
    assetProtection: number;
    threatLevel: number;
  };
} => {
  // Factor 1: Force Ratio (30% weight)
  const friendlyCount = friendlyDrones.length;
  const hostileCount = hostileDrones.length;
  const forceRatio = hostileCount === 0 ? 100 : 
    Math.min(100, (friendlyCount / hostileCount) * 50);

  // Factor 2: Health Status (25% weight)
  const avgFriendlyHealth = friendlyDrones.length === 0 ? 0 :
    friendlyDrones.reduce((sum, d) => sum + (d.health / d.maxHealth), 0) / friendlyDrones.length * 100;

  // Factor 3: Asset Protection (30% weight)
  const protectedAssets = assets.filter(a => a.health > 0).length;
  const assetProtection = assets.length === 0 ? 100 :
    (protectedAssets / assets.length) * 100;

  // Factor 4: Threat Level (15% weight)
  const avgThreatScore = hostileDrones.length === 0 ? 0 :
    hostileDrones.reduce((sum, d) => sum + (d.threatScore || 0), 0) / hostileDrones.length;
  const threatLevel = 100 - avgThreatScore; // Invert: lower threat = higher probability

  // Weighted average
  const overall = (
    forceRatio * 0.3 +
    avgFriendlyHealth * 0.25 +
    assetProtection * 0.3 +
    threatLevel * 0.15
  );

  return {
    overall: Math.round(overall),
    factors: {
      forceRatio: Math.round(forceRatio),
      healthStatus: Math.round(avgFriendlyHealth),
      assetProtection: Math.round(assetProtection),
      threatLevel: Math.round(threatLevel),
    },
  };
};

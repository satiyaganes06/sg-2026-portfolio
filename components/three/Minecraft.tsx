"use client";

import React, { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Group } from "three";
import { ThreeElements } from "@react-three/fiber";
import { MINECRAFT_MODELS, type MinecraftKind } from "./constants";

export { MINECRAFT_MODELS, type MinecraftKind }; // Re-export for compatibility if needed, though we should update consumers

function urlFor(kind: MinecraftKind) {
  switch (kind) {
    case "creeper":
      return "/minecraft_-_creeper/scene.gltf";
    case "zombie":
      return "/minecraft_-_zombie/scene.gltf";
    case "steve":
      return "/minecraft_-_steve/scene.gltf";
    case "enderman":
      return "/minecraft_-_enderman/scene.gltf";
  }
}

export const MinecraftCharacter = forwardRef<Group, ThreeElements["group"] & { kind: MinecraftKind }>(function MinecraftCharacter({ kind, ...props }, ref) {
  const gltf = useGLTF(urlFor(kind));
  return (
    <group ref={ref} {...props}>
      <primitive object={gltf.scene} />
    </group>
  );
});

// Preload all to reduce selection lag
for (const k of MINECRAFT_MODELS) {
  useGLTF.preload(urlFor(k));
}
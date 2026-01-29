"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MinecraftCharacter } from "@/components/three/Minecraft";
import { MINECRAFT_MODELS, type MinecraftKind } from "@/components/three/constants";
import * as THREE from "three";
import { generateUUID } from "@/lib/utils";

// Single-active summon coordination so only the latest stays active
let activeSummonId: string | null = null;
const activeListeners = new Set<(id: string | null) => void>();
function setActiveSummon(id: string | null) {
  activeSummonId = id;
  activeListeners.forEach((fn) => fn(id));
}

// Follow-the-mouse character (tracking defaults ON). Keys: q stops, f toggles.
function CharacterFollow({ kind, active }: { kind: MinecraftKind; active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [tracking, setTracking] = useState<boolean>(true);
  const mouse = useRef({ x: 0, y: 0 });
  const effectiveTracking = tracking && active;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!effectiveTracking) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.current.x = x;
      mouse.current.y = y;
    };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "q") setTracking(false);
      if (k === "f") setTracking((v) => !v);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [effectiveTracking]);

  useFrame(() => {
    if (!groupRef.current || !effectiveTracking) return;
    const targetYaw = mouse.current.x * Math.PI * 0.3;
    // Invert pitch so moving mouse up tilts model up
    const targetPitch = mouse.current.y * Math.PI * 0.15;
    groupRef.current.rotation.y += (targetYaw - groupRef.current.rotation.y) * 0.1;
    groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.1;
  });

  const s = 0.075; // slightly smaller for better fit
  return (
    <group ref={groupRef} scale={[-s, s, s]}>
      <MinecraftCharacter kind={kind} position={[0, -0.95, 0]} />
    </group>
  );
}

export default function MinecraftSpawn({ forcedKind }: { forcedKind?: MinecraftKind | null }) {
  const [kind, setKind] = useState<MinecraftKind | null>(forcedKind ?? null);
  const [id] = useState<string>(() => generateUUID());
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    // Pick specific kind if forced, else select random
    if (forcedKind) {
      setKind(forcedKind);
      return;
    }
    const list = [...MINECRAFT_MODELS];
    const idx = Math.floor(Math.random() * list.length);
    setKind(list[idx]);
  }, [forcedKind]);

  useEffect(() => {
    const onActive = (activeId: string | null) => setIsActive(activeId === id);
    activeListeners.add(onActive);
    // become active on mount
    setActiveSummon(id);
    return () => {
      activeListeners.delete(onActive);
      if (activeSummonId === id) setActiveSummon(null);
    };
  }, [id]);

  // Choose camera based on model
  const cam = (() => {
    if (kind === 'enderman') return { position: [0, 1.6, 11.5] as [number, number, number], fov: 26 };
    if (kind === 'steve') return { position: [0, 1.2, 10.0] as [number, number, number], fov: 28 };
    return { position: [0, 1.0, 5.5] as [number, number, number], fov: 35 };
  })();

  return (
    <div className="mt-2 mb-4 block rounded border border-zinc-700/70 bg-black/40" style={{ width: 260, height: 260, display: isActive ? 'block' : 'none', overflow: 'hidden' }}>
      <Canvas camera={cam}>
        {/* Base lights */}
        <ambientLight intensity={1.0} />
        <hemisphereLight intensity={0.7} args={[0xffffff, 0x444444]} />
        <directionalLight intensity={1.2} position={[2, 3, 2]} />
        {/* Extra lighting for Enderman (very dark) */}
        {kind === 'enderman' && (
          <>
            {/* Strong front fill */}
            <directionalLight intensity={3.0} position={[0, 3, 6]} />
            <pointLight intensity={1.8} position={[0, 2.2, 2.5]} />
            {/* Overhead spotlight to brighten full body */}
            <spotLight intensity={2.4} position={[0, 6, 3]} angle={0.6} penumbra={0.5} />
            {/* Rim/back light for silhouette separation */}
            <directionalLight intensity={1.2} position={[-2, 3.5, -3]} />
            {/* Slight ambient boost */}
            <ambientLight intensity={0.5} />
          </>
        )}
        {kind && <CharacterFollow kind={kind} active={isActive} />}
      </Canvas>
      <div className="text-[10px] text-zinc-400 p-1 px-2">{kind ? `${kind} spawned. (f: toggle follow, q: stop)` : "Loading..."}</div>
    </div>
  );
}

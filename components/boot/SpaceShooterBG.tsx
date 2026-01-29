"use client";

import { useEffect, useRef } from "react";

// Lightweight retro space shooter background animation for the GRUB menu.
// No input, purely ambient. Uses a single canvas and requestAnimationFrame.
export default function SpaceShooterBG({ opacity = 0.9 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    // No external image dependency - using fallback triangle

    let width = 0, height = 0;
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    type Star = { x: number; y: number; s: number; a: number; };
    type Ship = { x: number; y: number; vx: number; vy: number; hue: number; t: number; enemy?: boolean };
    type Laser = { x: number; y: number; vx: number; vy: number; hue: number };

    const stars: Star[] = [];
    const player: Ship = { x: width / 2, y: height - 40, vx: 0, vy: 1.2, hue: 145, t: 0 };
    const enemies: Ship[] = [];
    const lasers: Laser[] = [];
    let initialized = false;

    for (let i = 0; i < 120; i++) {
      stars.push({ x: Math.random() * width, y: Math.random() * height, s: Math.random() * 1.2 + 0.3, a: Math.random() * 0.5 + 0.2 });
    }

    let lastSpawn = 0;
    let t0 = performance.now();

// Simple cadence with jitter
    let nextShotAt = t0 + 220;

    // Player drift movement
    let nextDriftAt = t0 + 1500;

    const drawTri = (x: number, y: number, size: number, angle: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(-size * 0.7, size * 0.8);
      ctx.lineTo(size * 0.7, size * 0.8);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    const draw = (now: number) => {
      Math.min(32, now - t0);
      t0 = now;

      // Background fade
      ctx.fillStyle = `rgba(0, 0, 10, ${Math.min(1, 0.25)})`;
      ctx.fillRect(0, 0, width, height);

      // Initialize player position once (left side center)
      if (!initialized && width > 0 && height > 0) {
        player.x = Math.max(30, Math.min(width * 0.18, width - 30));
        player.y = height * 0.5;
        player.vx = 0;
        player.vy = 1.2;
        initialized = true;
      }

      // Starfield (leftward)
      for (const st of stars) {
        st.x -= st.s * 0.9;
        if (st.x < 0) { st.x = width; st.y = Math.random() * height; }
        ctx.globalAlpha = st.a * 0.8;
        ctx.fillStyle = "#a3d9ff";
        ctx.fillRect(st.x, st.y, 1.2, 1.2);
      }
      ctx.globalAlpha = 1;

// Player drift updates
      const rand = (a: number, b: number) => a + Math.random() * (b - a);
      if (now > nextDriftAt) {
        // Only vertical movement; randomize speed and direction modestly
        player.vy = rand(-1.4, 1.4);
        if (Math.abs(player.vy) < 0.4) player.vy = player.vy < 0 ? -0.6 : 0.6;
        nextDriftAt = now + 1200 + Math.random() * 1200;
      }

      // Move player on Y axis only and bounce on edges
      player.y += player.vy;
      const margin = 20;
      if (player.y < margin) { player.y = margin; player.vy *= -1; }
      if (player.y > height - margin) { player.y = height - margin; player.vy *= -1; }

      // Simple steady fire to the right with slight jitter in timing
      if (now >= nextShotAt) {
        lasers.push({ x: player.x + 10, y: player.y, vx: 5, vy: 0, hue: 140 });
        nextShotAt = now + 220 + Math.random() * 180;
      }

      // Spawn enemies (from right, moving left)
      if (now - lastSpawn > 450) {
        enemies.push({ x: width + 10, y: Math.random() * height, vx: -(0.9 + Math.random() * 0.6), vy: (Math.random() - 0.5) * 0.6, hue: 0, t: 0, enemy: true });
        lastSpawn = now;
      }

      // Update lasers (directional)
      for (let i = lasers.length - 1; i >= 0; i--) {
        const L = lasers[i];
        L.x += L.vx; L.y += L.vy;
        if (L.x < -30 || L.x > width + 30 || L.y < -30 || L.y > height + 30) {
          lasers.splice(i, 1);
        }
      }

      // Update enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const E = enemies[i];
        E.x += E.vx; E.y += E.vy;
        if (E.x < -40) enemies.splice(i, 1);
      }

// Collisions (cheap): remove enemy and laser; ignore player collisions for infinite loop
      for (let i = enemies.length - 1; i >= 0; i--) {
        const E = enemies[i];
        for (let j = lasers.length - 1; j >= 0; j--) {
          const L = lasers[j];
          if (Math.abs(L.x - E.x) < 12 && Math.abs(L.y - E.y) < 12) {
            enemies.splice(i, 1);
            lasers.splice(j, 1);
            break;
          }
        }
      }

// Draw player ship (triangle, pointing right)
      const tilt = Math.max(-0.25, Math.min(0.25, player.vy * 0.08));
      drawTri(player.x, player.y, 10, Math.PI / 2 + tilt, "#9efcc7");

      // Draw enemies (pointing left)
      for (const E of enemies) drawTri(E.x, E.y, 8, -Math.PI / 2, "#ff6b6b");

// Draw lasers (simple retro lines)
      ctx.save();
      ctx.strokeStyle = "#9efcc7";
      ctx.lineWidth = 2;
      for (const L of lasers) {
        ctx.beginPath();
        ctx.moveTo(L.x, L.y);
        ctx.lineTo(L.x + 12, L.y);
        ctx.stroke();
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
    />
  );
}
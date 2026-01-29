"use client";

import { useEffect, useRef, useState, useCallback } from "react";


type GameState = "playing" | "gameover";
type EnemyType = "normal" | "yellow" | "purple" | "blue" | "boss";

type Enemy = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: EnemyType;
  hp?: number; // For boss enemies
  bossLevel?: number; // Scaling factor for boss
};

type BossLaser = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export default function StarBladeGame({ onExit }: { onExit?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [mounted, setMounted] = useState(false);
  const keysRef = useRef<Set<string>>(new Set());
  const shootingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExit = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    onExit?.();
  }, [onExit]);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    let width = 0, height = 0;
    
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Initial size
    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    
    resizeObserver.observe(containerRef.current);

    type Star = { x: number; y: number; s: number; a: number; };
    type Ship = { x: number; y: number; vx: number; vy: number; };
    type Laser = { x: number; y: number; vx: number; vy: number; spawnX: number; maxDistance: number; };

    const stars: Star[] = [];
    const player: Ship = { x: 80, y: height / 2, vx: 0, vy: 0 };
    const enemies: Enemy[] = [];
    const lasers: Laser[] = [];
    const bossLasers: BossLaser[] = [];
    let currentScore = 0;
    let currentLives = 5;
    let currentGameState: GameState = "playing";
    let invulnerable = false;
    let invulnerableUntil = 0;
    let lastBossScore = 0; // Track when last boss was spawned
    let bossShootTimer = 0; // Track boss shooting waves
    let bossSpawnCount = 0; // Track how many bosses have appeared
    
    // Power-ups with limits
    let fireRateBoost = 0; // Number of fire rate boosts (blue enemies killed) - MAX 5
    let blasterCount = 1; // Number of blasters (purple enemies killed) - MAX 3
    const MAX_FIRE_RATE_BOOST = 5;
    const MAX_BLASTERS = 3;
    
    // Power mode (yellow/golden enemy - rarest)
    let powerModeActive = false;
    let powerModeUntil = 0;
    const POWER_MODE_DURATION = 10000; // 10 seconds

    for (let i = 0; i < 150; i++) {
      stars.push({ 
        x: Math.random() * width, 
        y: Math.random() * height, 
        s: Math.random() * 1.5 + 0.4, 
        a: Math.random() * 0.6 + 0.3 
      });
    }

    let lastSpawn = 0;
    let t0 = performance.now();
    let nextShotAt = 0;
    
    // Bullet distance - randomized per bullet between 40-70% of screen width
    const getRandomBulletDistance = () => {
      const minPercent = 0.4;
      const maxPercent = 0.7;
      return width * (minPercent + Math.random() * (maxPercent - minPercent));
    };

    // Initialize SVG Paths
    const shipPrimaryPaths = [
      // Rects converted to rect calls in draw function or Path2D if complex. Path2D is easiest for reuse.
      // However, simple rects are faster to just drawRect. But for consistency let's use Path2D for complex shapes and drawRect for simple keys.
      // Actually, all can be path2d.
      new Path2D("M298.79 362.008C315.532 370.54 315.532 394.46 298.79 402.992L250.944 427.377C235.641 435.175 217.5 424.06 217.5 406.885V358.116C217.5 340.94 235.641 329.825 250.944 337.623L298.79 362.008Z"),
      new Path2D("M298.79 55.0078C315.532 63.54 315.532 87.46 298.79 95.9922L250.944 120.377C235.641 128.175 217.5 117.06 217.5 99.8845V51.1155C217.5 33.9405 235.641 22.8246 250.944 30.6233L298.79 55.0078Z"),
      new Path2D("M223.393 363.974C232.467 375.035 232.467 390.965 223.393 402.026L203.151 426.702C195.553 435.965 183.173 439.819 171.66 436.506L134.072 425.689C121.22 421.99 112.369 410.232 112.369 396.859V369.141C112.369 355.768 121.22 344.01 134.072 340.311L171.66 329.494C183.173 326.181 195.553 330.035 203.151 339.298L223.393 363.974Z"),
      new Path2D("M223.393 57.9736C232.467 69.0352 232.467 84.9648 223.393 96.0264L203.151 120.702C195.553 129.965 183.173 133.819 171.66 130.506L134.072 119.689C121.22 115.99 112.369 104.232 112.369 90.8587V63.1414C112.369 49.7682 121.22 38.0099 134.072 34.3114L171.66 23.4942C183.173 20.1809 195.553 24.035 203.151 33.2977L223.393 57.9736Z")
    ];

    const shipSecondaryPaths = [
      new Path2D("M70.5 139L131.555 182V268L70.5 311L9.44521 268V182L70.5 139Z")
    ];

    // Boss Paths
    const bossPaths = [
        new Path2D("M86.3543 293.49C58.8865 284.428 58.8866 245.572 86.3545 236.51L616.851 61.492C636.26 55.0887 656.25 69.5437 656.25 89.9816V440.018C656.25 460.456 636.26 474.911 616.851 468.508L86.3543 293.49Z"),
        new Path2D("M86.3543 663.49C58.8865 654.428 58.8866 615.572 86.3545 606.51L616.851 431.492C636.26 425.089 656.25 439.544 656.25 459.982V810.018C656.25 830.456 636.26 844.911 616.851 838.508L86.3543 663.49Z")
    ];
    // Additional Boss Details (Rect)
    // <rect x="329" y="307" width="52" height="285" fill="#D9D9D9"/>

    // Generic ship drawer using SVG logic with Gradients
    const drawShipFromSVG = (x: number, y: number, rotation: number, scale: number, primaryColors: string[], secondaryColors: string[], mirror: boolean = false) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      const outputScale = scale * 0.12; 
      ctx.scale(outputScale, mirror ? -outputScale : outputScale);
      ctx.translate(-241.5, -227); 

      // Primary Gradient (Fuselage/Central Body)
      const gradBody = ctx.createLinearGradient(144, 0, 244, 450);
      gradBody.addColorStop(0, primaryColors[0]);
      gradBody.addColorStop(1, primaryColors[1]);

      // Wings Gradient (Outer parts) - derived from secondary or darker primary
      const gradWings = ctx.createLinearGradient(0, 0, 483, 454);
      gradWings.addColorStop(0, secondaryColors[0]);
      gradWings.addColorStop(1, secondaryColors[1]);

      // Draw Wings (Paths) - distinct color - BEHIND EVERYTHING
      ctx.fillStyle = gradWings;
      for (const p of shipPrimaryPaths) ctx.fill(p);

      // Draw Fuselage (Vertical Rect) - MIDDLE
      ctx.fillStyle = gradBody;
      ctx.beginPath();
      ctx.roundRect(144, 0, 100, 450, 40);
      ctx.fill();
      
      // Small Details (Rects) - lighter accent - On Vertical
      ctx.fillStyle = primaryColors[0]; 
      ctx.beginPath();
      ctx.roundRect(194, 444, 91, 10, 5);
      ctx.roundRect(194, 4, 91, 10, 5);
      ctx.fill();

      // Draw Secondary Body Group (Horizontal Rect) - ON TOP
      // Use a third style or mix
      ctx.fillStyle = secondaryColors[0];
      ctx.beginPath();
      ctx.roundRect(70, 155, 377, 140, 40);
      ctx.fill();
      
      // Secondary Details - With Horizontal
      ctx.fillStyle = secondaryColors[1];
      for (const p of shipSecondaryPaths) ctx.fill(p);
      
      // Engine/Cockpit Glow (Ellipse)
      ctx.fillStyle = secondaryColors[2] || "#ffffff"; 
      ctx.shadowColor = secondaryColors[2] || "#ffffff";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.ellipse(405.5, 224.5, 77.5, 47.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      ctx.restore();
    };

    const drawSpaceship = (x: number, y: number, flashing = false) => {
      // Premium Green Palette for Player
      // Primary: Emerald to Green-500
      const primary = flashing ? ["#ffffff", "#e0e0e0"] : ["#34d399", "#10b981"]; 
      // Secondary: Dark Green to Teal, plus Cyan Glow
      const secondary = flashing ? ["#d1d5db", "#9ca3af", "#ffffff"] : ["#065f46", "#047857", "#6ee7b7"]; 
      
      // Player faces Right (SVG native orientation is Right = 0 deg)
      drawShipFromSVG(x, y, 0, 1.0, primary, secondary, false);
    };

    // SVG-style enemy ship drawing function with type colors
    const drawEnemy = (x: number, y: number, type: EnemyType) => {
      // Color based on type (Gradients)
      let primary = ["#f87171", "#ef4444"]; // Red start
      let secondary = ["#991b1b", "#7f1d1d", "#fca5a5"]; // Dark red details + pink glow
      
      if (type === "yellow") {
        // Golden / Yellow (Speed)
        primary = ["#facc15", "#eab308"]; 
        secondary = ["#854d0e", "#713f12", "#fef08a"]; // Dark Gold + Bright Yellow Glow
      } else if (type === "purple") {
        // Purple (Blaster)
        primary = ["#c084fc", "#a855f7"];
        secondary = ["#6b21a8", "#581c87", "#d8b4fe"]; // Deep Purple + Lavender Glow
      } else if (type === "blue") {
        // Blue (Fire Rate)
        primary = ["#60a5fa", "#3b82f6"];
        secondary = ["#1e40af", "#1e3a8a", "#93c5fd"]; // Dark Blue + Light Blue Glow
      }

      // Enemies face Left (180 deg)
      drawShipFromSVG(x, y, Math.PI, 0.9, primary, secondary, false);
    };

    // Draw Boss using new SVG (Silver/Red core)
    const drawBoss = (x: number, y: number, hp: number, maxHp: number, level: number = 0) => {
      ctx.save();
      ctx.translate(x, y);
      
      // Scale: Boss 2.0x larger -> 0.12 (was 0.15 for 2.5x)
      const scale = 0.12;
      ctx.scale(scale, scale);
      
      // Center SVG: roughly at 627, 450
      ctx.translate(-627, -450);

      // Main Body: Dark Steel (Menacing)
      const gradBody = ctx.createLinearGradient(0, 0, 1200, 900);
      gradBody.addColorStop(0, "#9ca3af"); // Gray-400 (Highlight)
      gradBody.addColorStop(0.5, "#4b5563"); // Gray-600
      gradBody.addColorStop(1, "#1f2937"); // Gray-800 (Shadow)
      
      // Appendages (Wings) - Void Armor
      const gradWings = ctx.createLinearGradient(0, 0, 800, 900);
      gradWings.addColorStop(0, "#4b5563"); // Gray-600
      gradWings.addColorStop(1, "#111827"); // Gray-900
      
      ctx.fillStyle = gradWings;
      for (const p of bossPaths) ctx.fill(p);

      // Main Body Circles - Dark Steel
      ctx.fillStyle = gradBody;
      ctx.beginPath();
      ctx.arc(805, 450, 450, 0, Math.PI * 2);
      ctx.fill();
      
      // Central connector rect
      ctx.fillStyle = "#374151"; // Gray-700
      ctx.beginPath();
      ctx.rect(329, 307, 52, 285);
      ctx.fill();

      // Inner Core Mechanism
      ctx.fillStyle = "#000000"; 
      ctx.beginPath();
      ctx.arc(805, 450, 350, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Red Core (Intensified)
      const gradCore = ctx.createRadialGradient(805, 450, 20, 805, 450, 150);
      gradCore.addColorStop(0, "#ffe4e6"); // Rose-100 (Hot Center)
      gradCore.addColorStop(0.4, "#ef4444"); // Red-500
      gradCore.addColorStop(1, "#7f1d1d"); // Red-900
      
      ctx.fillStyle = gradCore;
      ctx.shadowColor = "#f87171"; // Red Glow
      ctx.shadowBlur = 60; 
      ctx.beginPath();
      ctx.arc(805, 450, 150, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Lines / Details (Stroke) - Red/Orange Energy Lines
      ctx.strokeStyle = "#b91c1c"; // Red-700
      ctx.lineWidth = 15;
      ctx.beginPath();
      // Only adding a few key lines for detail to avoid clutter
      ctx.moveTo(802.5, 300); ctx.lineTo(802.5, 100);
      ctx.moveTo(802.5, 800); ctx.lineTo(802.5, 600);
      ctx.moveTo(953, 435.5); ctx.lineTo(1153, 435.5);
      ctx.moveTo(455, 435.5); ctx.lineTo(655, 435.5);
      ctx.stroke();

      ctx.restore();
      
      // Draw Hits Remaining Text instead of Bar
      // Position above boss
      ctx.save();
      ctx.textAlign = "center";
      
      // Label "BOSS LVL X"
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = "#9ca3af";
      ctx.fillText(`TITAN LVL ${level + 1}`, x, y - 80);
      
      // The Number (Hits Remaining)
      ctx.font = "bold 24px monospace";
      // Color shifts from Green -> Yellow -> Red based on HP
      if (hp > 25) ctx.fillStyle = "#4ade80"; // Green > 50%
      else if (hp > 10) ctx.fillStyle = "#facc15"; // Yellow > 20%
      else ctx.fillStyle = "#ef4444"; // Red (Danger)
      
      ctx.fillText(`${Math.ceil(hp)}`, x, y - 55);
      ctx.restore();
    };  // HP bar border


    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Prevent ALL default behaviors during game
      e.preventDefault();
      e.stopPropagation();
      
      // Q to exit
      if (key === "q") {
        handleExit();
        return;
      }

      // R to restart when game over
      if (key === "r" && currentGameState === "gameover") {
        currentGameState = "playing";
        currentScore = 0;
        currentLives = 5;
        fireRateBoost = 0;
        blasterCount = 1;
        powerModeActive = false;
        powerModeUntil = 0;
        lastBossScore = 0;
        bossShootTimer = 0;
        bossSpawnCount = 0;
        setGameState("playing");
        setScore(0);
        setLives(5);
        player.x = 80;
        player.y = height / 2;
        enemies.length = 0;
        lasers.length = 0;
        bossLasers.length = 0;
        invulnerable = false;
        return;
      }

      // Track shooting state
      if (key === "enter" || key === "d") {
        shootingRef.current = true;
      }

      keysRef.current.add(key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const key = e.key.toLowerCase();
      
      if (key === "enter" || key === "d") {
        shootingRef.current = false;
      }
      
      keysRef.current.delete(key);
    };

    // Capture events at the window level with high priority
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);

    const draw = (now: number) => {
      const dt = Math.min(32, now - t0);
      t0 = now;

      // Background
      ctx.fillStyle = "rgba(0, 0, 10, 0.3)";
      ctx.fillRect(0, 0, width, height);

      // Starfield
      for (const st of stars) {
        st.x -= st.s * 1.2;
        if (st.x < 0) { st.x = width; st.y = Math.random() * height; }
        ctx.globalAlpha = st.a;
        ctx.fillStyle = "#a3d9ff";
        ctx.fillRect(st.x, st.y, 1.5, 1.5);
      }
      ctx.globalAlpha = 1;

      if (currentGameState === "playing") {
        // Player movement (only vertical)
        const speed = 4.5;
        const keys = keysRef.current;
        
        if (keys.has("arrowup") || keys.has("w")) player.y -= speed;
        if (keys.has("arrowdown") || keys.has("s")) player.y += speed;

        // Constrain player
        const margin = 20;
        player.y = Math.max(margin, Math.min(height - margin, player.y));
        
        // Check power mode timer
        if (powerModeActive && now > powerModeUntil) {
          powerModeActive = false;
        }

        // Shooting with fire rate boost (capped at MAX_FIRE_RATE_BOOST)
        // In power mode: use max fire rate
        const baseFireRate = 150;
        const effectiveFireRateBoost = powerModeActive ? MAX_FIRE_RATE_BOOST : Math.min(fireRateBoost, MAX_FIRE_RATE_BOOST);
        const fireRate = Math.max(50, baseFireRate - (effectiveFireRateBoost * 20));
        
        // In power mode: use 4 blasters (special bonus!)
        const POWER_MODE_BLASTERS = 4;
        const effectiveBlasterCount = powerModeActive ? POWER_MODE_BLASTERS : blasterCount;
        
        if (shootingRef.current && now >= nextShotAt) {
          // Calculate blaster positions based on count
          const blasterOffsets: number[] = [];
          
          if (effectiveBlasterCount === 1) {
            blasterOffsets.push(0); // Center
          } else if (effectiveBlasterCount === 2) {
            blasterOffsets.push(-6, 6); // Top and bottom
          } else if (effectiveBlasterCount === 3) {
            blasterOffsets.push(-8, 0, 8); // Top, center, bottom
          } else if (effectiveBlasterCount >= 4) {
            blasterOffsets.push(-10, -3, 3, 10); // Four blasters
          }
          
          // Fire from each blaster position
          for (const offset of blasterOffsets) {
            lasers.push({ 
              x: player.x + 15, 
              y: player.y + offset, 
              vx: 8, 
              vy: 0,
              spawnX: player.x + 15,
              maxDistance: powerModeActive ? width * 0.9 : getRandomBulletDistance()
            });
          }
          
          nextShotAt = now + fireRate;
        }

        // Spawn mini-boss every 500 points
        if (currentScore >= lastBossScore + 500 && currentScore > 0) {
          enemies.push({
            x: width + 50,
            y: height / 2,
            vx: -1.5,
            vy: 0,

            type: "boss",
            hp: 30 + (bossSpawnCount * 5), // Boss HP +5 per spawn
            bossLevel: bossSpawnCount
          });
          lastBossScore = currentScore;
          bossSpawnCount++;
        }

        // Progressive difficulty: spawn rate and speed increase with score
        const difficultyMultiplier = 1 + Math.floor(currentScore / 100) * 0.1; // Increases every 100 points
        const spawnRate = Math.max(300, 700 - Math.floor(currentScore / 50) * 20); // Faster spawning as score increases
        const baseSpeed = 2 + Math.floor(currentScore / 100) * 0.3; // Faster enemies as score increases
        
        // Spawn enemies with rare special types
        if (now - lastSpawn > spawnRate) {
          const rand = Math.random();
          let enemyType: EnemyType = "normal";
          
          // 1% chance for yellow/golden (speed boost - RAREST)
          if (rand < 0.01) {
            enemyType = "yellow";
          }
          // 2% chance for purple (extra blasters - RARE)
          else if (rand < 0.03) {
            enemyType = "purple";
          }
          // 4% chance for blue (fire rate boost - UNCOMMON)
          else if (rand < 0.07) {
            enemyType = "blue";
          }
          
          // Special enemies move faster (50% speed boost)
          const speedMultiplier = enemyType !== "normal" ? 1.5 : 1;
          
          enemies.push({ 
            x: width + 20, 
            y: Math.random() * (height - 40) + 20, 
            vx: -(baseSpeed + Math.random() * 1.5) * speedMultiplier, 
            vy: (Math.random() - 0.5) * 1.2 * speedMultiplier,
            type: enemyType
          });
          lastSpawn = now;
        }

        // Update lasers with distance limit
        for (let i = lasers.length - 1; i >= 0; i--) {
          const L = lasers[i];
          L.x += L.vx;
          
          // Remove if out of bounds or exceeded max distance (per bullet)
          const distanceTraveled = L.x - L.spawnX;
          if (L.x > width + 30 || distanceTraveled > L.maxDistance) {
            lasers.splice(i, 1);
          }
        }

        // Update enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
          const E = enemies[i];
          E.x += E.vx;
          E.y += E.vy;
          
          // Boss behavior: move in a wave pattern and shoot
          if (E.type === "boss") {
            // Wave movement - more aggressive
            E.vy = Math.sin(now / 400) * 3;
            
            const level = E.bossLevel || 0;
            // Scale interval: 1000ms reduced by 10% per level (down to min 300ms)
            const fireInterval = Math.max(300, 1000 * Math.pow(0.9, level));
            
            // Boss shooting in waves
            if (now - bossShootTimer > fireInterval) {
              // Shoot lasers (speed increases by 10% per level)
              const bulletSpeed = 7 * Math.pow(1.1, level);
              
              const angles = [-0.5, -0.25, 0, 0.25, 0.5]; // Wider spread with more lasers
              for (const angle of angles) {
                bossLasers.push({
                  x: E.x - 30,
                  y: E.y,
                  vx: -bulletSpeed * Math.cos(angle), 
                  vy: -bulletSpeed * Math.sin(angle)
                });
              }
              bossShootTimer = now;
            }
          } else {
            // Bounce normal enemies off top/bottom
            if (E.y < 20 || E.y > height - 20) {
              E.vy *= -1;
            }
          }
          
          if (E.x < -40) enemies.splice(i, 1);
        }

        // Update boss lasers
        for (let i = bossLasers.length - 1; i >= 0; i--) {
          const BL = bossLasers[i];
          BL.x += BL.vx;
          BL.y += BL.vy;
          
          // Remove if out of bounds
          if (BL.x < -30 || BL.y < -30 || BL.y > height + 30) {
            bossLasers.splice(i, 1);
          }
        }

        // Collisions - laser hits enemy
        for (let i = enemies.length - 1; i >= 0; i--) {
          const E = enemies[i];
          for (let j = lasers.length - 1; j >= 0; j--) {
            const L = lasers[j];
            const hitRadius = E.type === "boss" ? 70 : 22; // Adjusted for 2.0x scale
            const hitRadiusY = E.type === "boss" ? 60 : 18;
            
            if (Math.abs(L.x - E.x) < hitRadius && Math.abs(L.y - E.y) < hitRadiusY) {
              const enemyType = E.type;
              lasers.splice(j, 1);
              
              // Boss takes damage instead of dying immediately
              if (enemyType === "boss") {
                E.hp = (E.hp || 100) - 1;
                if (E.hp <= 0) {
                  enemies.splice(i, 1);
                  currentScore += 150; // Big score for killing boss
                  setScore(currentScore);
                  
                  // Reward 2 hearts on boss defeat
                  currentLives += 2;
                  setLives(currentLives);
                }
              } else {
                enemies.splice(i, 1);
                currentScore += enemyType === "normal" ? 10 : 25;
                setScore(currentScore);
                
                // Apply power-ups with limits
                if (enemyType === "blue" && fireRateBoost < MAX_FIRE_RATE_BOOST) {
                  // Blue = fire rate boost
                  fireRateBoost++;
                } else if (enemyType === "purple" && blasterCount < MAX_BLASTERS) {
                  // Purple = extra blasters (up to 3)
                  blasterCount++;
                } else if (enemyType === "yellow") {
                  // Yellow/Golden = Power mode (10 seconds, 4 boosters, max fire rate)
                  powerModeActive = true;
                  powerModeUntil = now + POWER_MODE_DURATION;
                }
              }
              
              break;
            }
          }
        }

        // Check invulnerability timer
        if (invulnerable && now > invulnerableUntil) {
          invulnerable = false;
        }

        // Collisions - enemy hits player (LOSE 1 LIFE)
        if (!invulnerable) {
          for (let i = enemies.length - 1; i >= 0; i--) {
            const E = enemies[i];
            const hitRadius = E.type === "boss" ? 70 : 25; // Adjusted for 2.0x scale
            const hitRadiusY = E.type === "boss" ? 60 : 20;
            
            if (Math.abs(player.x - E.x) < hitRadius && Math.abs(player.y - E.y) < hitRadiusY) {
              // Don't remove boss on collision, just damage player
              if (E.type !== "boss") {
                enemies.splice(i, 1);
              }
              currentLives--;
              setLives(currentLives);
              invulnerable = true;
              invulnerableUntil = now + 2000; // 2 seconds invulnerability
              
              if (currentLives <= 0) {
                currentGameState = "gameover";
                setGameState("gameover");
              }
              break;
            }
          }
          
          // Boss laser hits player
          for (let i = bossLasers.length - 1; i >= 0; i--) {
            const BL = bossLasers[i];
            if (Math.abs(player.x - BL.x) < 15 && Math.abs(player.y - BL.y) < 15) {
              bossLasers.splice(i, 1);
              currentLives--;
              setLives(currentLives);
              invulnerable = true;
              invulnerableUntil = now + 2000;
              
              if (currentLives <= 0) {
                currentGameState = "gameover";
                setGameState("gameover");
              }
              break;
            }
          }
        }
      }

      // Draw player (with invulnerability flashing)
      if (currentGameState !== "gameover") {
        const isFlashing = invulnerable && Math.floor(now / 100) % 2 === 0;
        drawSpaceship(player.x, player.y, isFlashing);
      }

      // Draw enemies and bosses
      for (const E of enemies) {
        if (E.type === "boss") {
          drawBoss(E.x, E.y, E.hp || 30, 30 + (E.bossLevel || 0) * 5, E.bossLevel || 0);
        } else {
          drawEnemy(E.x, E.y, E.type);
        }
      }

      // Draw lasers (glowing projectiles)
      ctx.save();
      for (const L of lasers) {
        // Glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#4ade80";
        ctx.fillStyle = "#4ade80";
        ctx.beginPath();
        ctx.arc(L.x, L.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#86efac";
        ctx.beginPath();
        ctx.arc(L.x, L.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Draw boss lasers (red glowing projectiles)
      ctx.save();
      for (const BL of bossLasers) {
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ef4444";
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(BL.x, BL.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fca5a5";
        ctx.beginPath();
        ctx.arc(BL.x, BL.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Draw UI overlay
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 16px monospace";
      ctx.fillText(`SCORE: ${currentScore}`, 15, 30);
      
      // Draw lives as hearts
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 20px monospace";
      const hearts = "♥".repeat(currentLives) + "♡".repeat(Math.max(0, 5 - currentLives));
      ctx.fillText(`LIVES: ${hearts}`, 15, 55);
      
      // Power-up indicators
      ctx.font = "12px monospace";
      let powerUpY = 80;
      
      // Power mode indicator (most important, show first)
      if (powerModeActive) {
        const timeLeft = Math.ceil((powerModeUntil - now) / 1000);
        ctx.fillStyle = "#3b82f6";
        ctx.font = "bold 14px monospace";
        ctx.fillText(`🔥 POWER MODE: ${timeLeft}s`, 15, powerUpY);
        powerUpY += 22;
        ctx.font = "12px monospace";
      }
      
      if (fireRateBoost > 0) {
        ctx.fillStyle = "#eab308";
        const boostText = fireRateBoost >= MAX_FIRE_RATE_BOOST ? "MAX" : `+${fireRateBoost}`;
        ctx.fillText(`⚡ Fire Rate: ${boostText}`, 15, powerUpY);
        powerUpY += 20;
      }
      
      if (blasterCount > 1) {
        ctx.fillStyle = "#a855f7";
        const blasterText = blasterCount >= MAX_BLASTERS ? "MAX" : `x${blasterCount}`;
        ctx.fillText(`⚔ Blasters: ${blasterText}`, 15, powerUpY);
        powerUpY += 20;
      }
      
      // Controls hint
      ctx.font = "12px monospace";
      ctx.fillStyle = "#6b7280";
      ctx.fillText("W/S: Move | Enter/D: Shoot | Q: Quit | R: Restart", 15, height - 15);
      
      // Invulnerability indicator
      if (invulnerable) {
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 14px monospace";
        ctx.fillText("INVULNERABLE!", 15, powerUpY);
      }
      
      if (currentGameState === "gameover") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 48px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", width / 2, height / 2 - 30);
        
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 24px monospace";
        ctx.fillText(`FINAL SCORE: ${currentScore}`, width / 2, height / 2 + 20);
        
        ctx.font = "16px monospace";
        ctx.fillStyle = "#9ca3af";
        ctx.fillText("Press R to restart or Q to quit", width / 2, height / 2 + 60);
      }

      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [mounted, onExit]);

  if (!mounted) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}


'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';

export default function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle ResizeObserver to update canvas size dynamically
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        
        // Debounce or directly apply with devicePixelRatio to avoid blurriness
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
        
        sizeRef.current = { width, height };
      }
    });

    resizeObserver.observe(container);

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          active: true,
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseLeave);

    // Animation variables
    let animationFrameId: number;
    const gridSpacing = 64;
    const pullRadius = 240;
    const maxPullForce = 0.22; // Gravity factor

    // Store interpolated coordinates for fluid organic motion
    // Kept inside animation loop to compute dynamic warped grid lines
    const animate = () => {
      const width = sizeRef.current.width;
      const height = sizeRef.current.height;

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mActive = mouseRef.current.active;

      // Draw grid lines
      // Calculate start and end indices to fully cover the viewport
      const cols = Math.ceil(width / gridSpacing) + 2;
      const rows = Math.ceil(height / gridSpacing) + 2;

      // To render distorted lines, we can sample the warp function for points along horizontal and vertical spans
      // We will map points of the grid [col][row] to their actual (possibly warped) screen coordinates
      const points: { x: number; y: number; opacity: number }[][] = [];

      for (let c = 0; c < cols; c++) {
        points[c] = [];
        for (let r = 0; r < rows; r++) {
          const origX = c * gridSpacing;
          const origY = r * gridSpacing;

          let targetX = origX;
          let targetY = origY;
          let opacity = 0.08; // Base dot/mesh opacity

          if (mActive) {
            const dx = mx - origX;
            const dy = my - origY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < pullRadius) {
              const force = (pullRadius - dist) / pullRadius; // 1 at center, 0 at outer edge
              const pull = force * force * maxPullForce; // Quadratic dropoff for natural curve
              targetX = origX + dx * pull;
              targetY = origY + dy * pull;
              opacity = 0.08 + force * 0.16; // Highlight intersection dots near cursor
            }
          }

          points[c][r] = { x: targetX, y: targetY, opacity };
        }
      }

      // Draw horizontal distorted connections
      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.06)'; // slate-900/6
        for (let c = 0; c < cols; c++) {
          const pt = points[c][r];
          if (c === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
      }

      // Draw vertical distorted connections
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.06)';
        for (let r = 0; r < rows; r++) {
          const pt = points[c][r];
          if (r === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
      }

      // Draw glowing intersection points
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const pt = points[c][r];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.opacity * 10, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(15, 23, 42, ${pt.opacity * 0.4})`; // Charcoal glowing dots
          ctx.fill();

          // Core pixel dot
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = pt.opacity > 0.15 ? 'rgba(0, 0, 0, 0.7)' : 'rgba(100, 116, 139, 0.3)';
          ctx.fill();
        }
      }

      // Draw subtle mouse cursor glow circle overlay
      if (mActive) {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, pullRadius);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0.02)');
        grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.005)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.arc(mx, my, pullRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full opacity-65 mix-blend-multiply"
      />
      {/* High contrast radial vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#fcfcfc_98%)] opacity-85" />
    </div>
  );
}

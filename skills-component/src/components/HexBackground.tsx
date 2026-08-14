import React, { useEffect, useRef } from 'react';

export default function HexBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const r = 35; // Hexagon radius
    const h = r * Math.sin(Math.PI / 3); // Vertical column offset height
    const w = r * 1.5; // Horizontal column spacing width
    
    let driftX = 0;
    let driftY = 0;
    const speedX = 0.05; // Slow ambient drifting speed
    const speedY = 0.03;

    let animationFrameId: number;

    function drawHex(x: number, y: number, radius: number) {
      if (!ctx) return;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + radius * Math.cos(angle);
        const hy = y + radius * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(hx, hy);
        } else {
          ctx.lineTo(hx, hy);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }

    function renderHexes() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Render Deep Background Base color
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Apply Drift movement coordinates
      driftX = (driftX + speedX) % (w * 2);
      driftY = (driftY + speedY) % (h * 2);

      ctx.strokeStyle = 'rgba(113, 121, 126, 0.04)'; // Subtle faint Steel Grey borders
      ctx.lineWidth = 1;

      // Buffer coordinates to ensure complete screen coverage during animations
      const startX = -w * 2 + driftX;
      const endX = width + w * 2;
      const startY = -h * 2 + driftY;
      const endY = height + h * 2;

      let col = 0;
      for (let x = startX; x < endX; x += w) {
        const isEven = col % 2 === 0;
        const offsetOffset = isEven ? 0 : h;
        
        for (let y = startY + offsetOffset; y < endY; y += h * 2) {
          drawHex(x, y, r);

          // Inject subtle glowing active cells on specific coordinates
          if ((Math.floor(x / w) + Math.floor(y / h)) % 19 === 0) {
            ctx.fillStyle = 'rgba(197, 160, 89, 0.015)';
            ctx.fill();
          }
        }
        col++;
      }

      animationFrameId = requestAnimationFrame(renderHexes);
    }

    animationFrameId = requestAnimationFrame(renderHexes);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} id="hex-canvas" className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />;
}

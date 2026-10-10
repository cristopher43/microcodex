import { useEffect, useRef } from "react";

// ClickSpark adapted from React Bits by David Haz.
// https://github.com/DavidHDev/react-bits/tree/main/src/content/Animations/ClickSpark
export default function ClickSpark({
  children,
  className = "",
  sparkColor = "#fff2a8",
  sparkSize = 8,
  sparkRadius = 20,
  sparkCount = 9,
  duration = 420,
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const frameRef = useRef(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!root || !canvas || !context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = reducedMotion.matches;
    const updateMotionPreference = () => {
      reducedMotionRef.current = reducedMotion.matches;
      if (reducedMotion.matches) {
        sparksRef.current = [];
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
        context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      }
    };
    reducedMotion.addEventListener?.("change", updateMotionPreference);

    const resizeCanvas = () => {
      const { width, height } = root.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(root);
    resizeCanvas();

    const draw = (timestamp) => {
      const { width, height } = root.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      const activas = [];

      for (const chispa of sparksRef.current) {
        const transcurrido = timestamp - chispa.inicio;
        if (transcurrido >= duration) continue;

        const avance = Math.min(1, transcurrido / duration);
        const salida = avance * (2 - avance);
        const distancia = salida * sparkRadius;
        const largo = sparkSize * (1 - salida);
        const coseno = Math.cos(chispa.angulo);
        const seno = Math.sin(chispa.angulo);
        context.beginPath();
        context.moveTo(chispa.x + distancia * coseno, chispa.y + distancia * seno);
        context.lineTo(chispa.x + (distancia + largo) * coseno, chispa.y + (distancia + largo) * seno);
        context.strokeStyle = sparkColor;
        context.lineWidth = 2;
        context.lineCap = "round";
        context.stroke();
        activas.push(chispa);
      }

      sparksRef.current = activas;
      frameRef.current = activas.length ? requestAnimationFrame(draw) : 0;
    };

    const onClick = (event) => {
      if (reducedMotionRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const inicio = performance.now();
      sparksRef.current.push(
        ...Array.from({ length: sparkCount }, (_, indice) => ({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          angulo: (Math.PI * 2 * indice) / sparkCount,
          inicio,
        })),
      );
      if (!frameRef.current) frameRef.current = requestAnimationFrame(draw);
    };

    root.addEventListener("click", onClick);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener?.("change", updateMotionPreference);
      root.removeEventListener("click", onClick);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [duration, sparkColor, sparkCount, sparkRadius, sparkSize]);

  return (
    <div ref={rootRef} className={`click-spark ${className}`.trim()}>
      <canvas ref={canvasRef} className="click-spark-canvas" aria-hidden="true" />
      {children}
    </div>
  );
}

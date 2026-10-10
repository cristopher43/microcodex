import { useEffect, useRef } from "react";

const PALETAS = {
  normal: ["#ef4444", "#f97316", "#facc15", "#60a5fa", "#f4f4f5"],
  dorado: ["#fbbf24", "#fef3c7", "#d97706", "#fff7cc"],
};

export default function Confeti({ cantidad = 70, duracion = 2400, tipo = "normal", continuo = false, onFinish }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      onFinish?.();
      return undefined;
    }

    const canvas = canvasRef.current;
    const contexto = canvas?.getContext("2d");
    if (!canvas || !contexto) return undefined;

    let marco = 0;
    let inicio = 0;
    let terminado = false;
    const particulas = [];
    const total = Math.min(120, Math.max(1, cantidad));
    const colores = PALETAS[tipo] ?? PALETAS.normal;

    const ajustar = () => {
      const escala = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * escala);
      canvas.height = Math.floor(window.innerHeight * escala);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      contexto.setTransform(escala, 0, 0, escala, 0, 0);
    };

    ajustar();
    window.addEventListener("resize", ajustar);

    for (let indice = 0; indice < total; indice += 1) {
      particulas.push({
        x: Math.random() * window.innerWidth,
        y: -Math.random() * window.innerHeight * 0.7,
        vx: (Math.random() - 0.5) * 3.6,
        vy: Math.random() * 2.2 + 1.2,
        giro: Math.random() * Math.PI,
        velocidadGiro: (Math.random() - 0.5) * 0.18,
        ancho: Math.random() * 7 + 4,
        alto: Math.random() * 10 + 5,
        color: colores[Math.floor(Math.random() * colores.length)],
      });
    }

    const dibujar = (tiempo) => {
      if (!inicio) inicio = tiempo;
      const transcurrido = tiempo - inicio;
      contexto.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const particula of particulas) {
        particula.x += particula.vx;
        particula.y += particula.vy;
        particula.vy += 0.035;
        particula.giro += particula.velocidadGiro;

        if (continuo && particula.y > window.innerHeight + 20) {
          particula.x = Math.random() * window.innerWidth;
          particula.y = -Math.random() * 140 - 10;
          particula.vy = Math.random() * 2.2 + 1.2;
        }

        contexto.save();
        contexto.translate(particula.x, particula.y);
        contexto.rotate(particula.giro);
        contexto.fillStyle = particula.color;
        contexto.fillRect(-particula.ancho / 2, -particula.alto / 2, particula.ancho, particula.alto);
        contexto.restore();
      }

      if (continuo || transcurrido < duracion) {
        marco = window.requestAnimationFrame(dibujar);
      } else {
        terminado = true;
        contexto.clearRect(0, 0, window.innerWidth, window.innerHeight);
        window.removeEventListener("resize", ajustar);
        onFinish?.();
      }
    };

    marco = window.requestAnimationFrame(dibujar);

    return () => {
      window.cancelAnimationFrame(marco);
      window.removeEventListener("resize", ajustar);
      if (!terminado) contexto.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
  }, [cantidad, duracion, tipo, continuo, onFinish]);

  return <canvas ref={canvasRef} className="confeti-canvas" aria-hidden="true" />;
}

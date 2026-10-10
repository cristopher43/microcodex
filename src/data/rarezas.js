export const RAREZAS = {
  Común: {
    nombre: "Común",
    color: "#a1a1aa",
    borde: "border-zinc-400",
    brillo: "shadow-zinc-400/20",
    etiqueta: "Común",
    clase: "rareza-comun",
  },
  Rara: {
    nombre: "Rara",
    color: "#60a5fa",
    borde: "border-blue-400",
    brillo: "shadow-blue-500/30",
    etiqueta: "Rara",
    clase: "rareza-rara",
  },
  Épica: {
    nombre: "Épica",
    color: "#c084fc",
    borde: "border-purple-400",
    brillo: "shadow-purple-500/30",
    etiqueta: "Épica",
    clase: "rareza-epica",
  },
  Legendaria: {
    nombre: "Legendaria",
    color: "#fbbf24",
    borde: "border-amber-300",
    brillo: "shadow-amber-400/40",
    etiqueta: "Legendaria",
    clase: "rareza-legendaria",
  },
};

export const rarezaSegura = (nombre) => RAREZAS[nombre] ?? RAREZAS.Común;

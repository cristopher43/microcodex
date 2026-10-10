import { distanciaMetros } from "../utils/distancia.js";

const existeTipo = (tipo) => (capturas, buses) =>
  capturas.some((captura) => buses.find((bus) => bus.id === captura.busId)?.tipo === tipo);

const existeRareza = (rareza) => (capturas, buses) =>
  capturas.some((captura) => buses.find((bus) => bus.id === captura.busId)?.rareza === rareza);

const cantidadTipo = (tipo, cantidad) => (capturas, buses) =>
  capturas.filter((captura) => buses.find((bus) => bus.id === captura.busId)?.tipo === tipo).length >= cantidad;

const lugaresSeparados = (capturas) => {
  const puntos = capturas
    .filter((captura) => Number.isFinite(captura.coordenadas?.lat) && Number.isFinite(captura.coordenadas?.lng))
    .map((captura) => captura.coordenadas);

  for (let primero = 0; primero < puntos.length; primero += 1) {
    for (let segundo = primero + 1; segundo < puntos.length; segundo += 1) {
      if (distanciaMetros(puntos[primero], puntos[segundo]) <= 300) continue;
      for (let tercero = segundo + 1; tercero < puntos.length; tercero += 1) {
        if (
          distanciaMetros(puntos[primero], puntos[tercero]) > 300 &&
          distanciaMetros(puntos[segundo], puntos[tercero]) > 300
        ) {
          return true;
        }
      }
    }
  }

  return false;
};

const tresEnUnDia = (capturas) => {
  const porDia = new Map();
  for (const captura of capturas) {
    const fecha = new Date(captura.fecha);
    if (Number.isNaN(fecha.getTime())) continue;
    const clave = fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate();
    porDia.set(clave, (porDia.get(clave) ?? 0) + 1);
    if (porDia.get(clave) >= 3) return true;
  }
  return false;
};

const hito = (cantidad) => (capturas, buses) =>
  buses.length >= cantidad && capturas.length >= cantidad;

export const LOGROS = [
  {
    id: "primera-captura",
    nombre: "Primera captura",
    descripcion: "Captura tu primera micro.",
    icono: "micro",
    cumple: (capturas) => capturas.length >= 1,
  },
  {
    id: "cazador-electrico",
    nombre: "Cazador eléctrico",
    descripcion: "Captura 5 micros eléctricas.",
    icono: "electricidad",
    cumple: cantidadTipo("Eléctrico", 5),
  },
  {
    id: "domador-oruga",
    nombre: "Domador de la oruga",
    descripcion: "Captura una micro articulada.",
    icono: "articulada",
    cumple: existeTipo("Articulado"),
  },
  {
    id: "veterano-diesel",
    nombre: "Veterano del diésel",
    descripcion: "Captura una micro diésel.",
    icono: "combustible",
    cumple: existeTipo("Diésel"),
  },
  {
    id: "ojo-aguila",
    nombre: "Ojo de águila",
    descripcion: "Captura una micro Rara.",
    icono: "rara",
    cumple: existeRareza("Rara"),
  },
  {
    id: "cazador-epico",
    nombre: "Cazador épico",
    descripcion: "Captura una micro Épica.",
    icono: "epica",
    cumple: existeRareza("Épica"),
  },
  {
    id: "leyenda-urbana",
    nombre: "Leyenda urbana",
    descripcion: "Captura una micro Legendaria.",
    icono: "corona",
    cumple: existeRareza("Legendaria"),
  },
  {
    id: "porteno-corazon",
    nombre: "Porteño de corazón",
    descripcion: "Captura un trolebús de Valparaíso.",
    icono: "tranvia",
    cumple: (capturas, buses) =>
      capturas.some((captura) => {
        const bus = buses.find((item) => item.id === captura.busId);
        return bus?.tipo === "Trolebús" && bus?.zona === "Valparaíso";
      }),
  },
  {
    id: "cazador-historia",
    nombre: "Cazador de historia",
    descripcion: "Captura una micro de zona Histórica.",
    icono: "historia",
    cumple: (capturas, buses) =>
      capturas.some((captura) => buses.find((bus) => bus.id === captura.busId)?.zona === "Histórica"),
  },
  {
    id: "viajero",
    nombre: "Viajero",
    descripcion: "Captura un bus Interurbano.",
    icono: "ruta",
    cumple: existeTipo("Interurbano"),
  },
  {
    id: "tres-zonas",
    nombre: "Tres zonas",
    descripcion: "Captura micros de Santiago, Valparaíso y Regiones.",
    icono: "mundo",
    cumple: (capturas, buses) => {
      const zonas = new Set(capturas.map((captura) => buses.find((bus) => bus.id === captura.busId)?.zona));
      return ["Santiago", "Valparaíso", "Regiones"].every((zona) => zonas.has(zona));
    },
  },
  {
    id: "madrugador",
    nombre: "Madrugador",
    descripcion: "Captura una micro antes de las 8:00.",
    icono: "amanecer",
    cumple: (capturas) =>
      capturas.some((captura) => {
        const fecha = new Date(captura.fecha);
        return !Number.isNaN(fecha.getTime()) && fecha.getHours() < 8;
      }),
  },
  {
    id: "buho-nocturno",
    nombre: "Búho nocturno",
    descripcion: "Captura una micro después de las 20:00.",
    icono: "noche",
    cumple: (capturas) =>
      capturas.some((captura) => {
        const fecha = new Date(captura.fecha);
        return !Number.isNaN(fecha.getTime()) && fecha.getHours() >= 20;
      }),
  },
  {
    id: "explorador",
    nombre: "Explorador",
    descripcion: "Captura micros en 3 lugares separados por más de 300 metros.",
    icono: "mapa",
    cumple: lugaresSeparados,
  },
  {
    id: "rafaga",
    nombre: "Ráfaga",
    descripcion: "Captura 3 micros el mismo día.",
    icono: "fuego",
    cumple: tresEnUnDia,
  },
  {
    id: "coleccionista-10",
    nombre: "Coleccionista: 10",
    descripcion: "Captura 10 micros distintas.",
    icono: "medalla",
    cumple: hito(10),
  },
  {
    id: "coleccionista-20",
    nombre: "Coleccionista: 20",
    descripcion: "Captura 20 micros distintas.",
    icono: "premio",
    cumple: hito(20),
  },
  {
    id: "coleccionista-30",
    nombre: "Coleccionista: 30",
    descripcion: "Captura 30 micros distintas.",
    icono: "insignia",
    cumple: hito(30),
  },
  {
    id: "coleccion-completa",
    nombre: "Colección completa",
    descripcion: "Captura todas las micros de la lista.",
    icono: "trofeo",
    cumple: (capturas, buses) => buses.length > 0 && capturas.length >= buses.length,
  },
];

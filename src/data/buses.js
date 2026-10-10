export const TIPOS_BUS = [
  "Eléctrico",
  "Diésel",
  "Articulado",
  "Trolebús",
  "Interurbano",
  "Minibús",
];

export const ZONAS_BUS = ["Santiago", "Valparaíso", "Regiones", "Histórica"];

const crearBus = (id, nombre, tipo, zona, rareza, verificar) => ({
  id,
  nombre,
  tipo,
  zona,
  rareza,
  ficha: {},
  verificar,
});

export const BUSES = [
  crearBus("foton-ebus-u12", "Foton eBus U12", "Eléctrico", "Santiago", "Común", false),
  crearBus("zhongtong-electrico", "Zhongtong eléctrico", "Eléctrico", "Santiago", "Común", true),
  crearBus("byd-k9fe", "BYD K9FE", "Eléctrico", "Santiago", "Rara", false),
  crearBus("yutong-e12", "Yutong E12", "Eléctrico", "Santiago", "Rara", true),
  crearBus("foton-ebus-u9", "Foton eBus U9 (9 metros)", "Eléctrico", "Santiago", "Rara", true),
  crearBus("king-long-electrico", "King Long eléctrico", "Eléctrico", "Santiago", "Épica", true),

  crearBus("caio-mondego-ii", "Caio Mondego II", "Diésel", "Santiago", "Rara", false),
  crearBus("marcopolo-torino", "Marcopolo Torino", "Diésel", "Santiago", "Rara", false),
  crearBus("mercedes-o500-u", "Mercedes-Benz O-500 U", "Diésel", "Santiago", "Rara", true),
  crearBus("volvo-b7r", "Volvo B7R", "Diésel", "Santiago", "Rara", true),
  crearBus("volvo-b290r", "Volvo B290R", "Diésel", "Santiago", "Rara", true),
  crearBus("volkswagen-17230-od", "Volkswagen 17.230 OD", "Diésel", "Santiago", "Rara", true),
  crearBus("scania-k320", "Scania K320", "Diésel", "Santiago", "Rara", true),
  crearBus("busscar-urbanuss-pluss", "Busscar Urbanuss Pluss", "Diésel", "Santiago", "Épica", true),
  crearBus("inrecar-geminis", "Inrecar Géminis", "Diésel", "Santiago", "Épica", true),
  crearBus("metalpar-tronador", "Metalpar Tronador", "Diésel", "Santiago", "Épica", true),

  crearBus("marcopolo-gran-viale", "Marcopolo Gran Viale", "Articulado", "Santiago", "Épica", true),
  crearBus("mercedes-o500-ua", "Mercedes-Benz O-500 UA", "Articulado", "Santiago", "Épica", true),
  crearBus("volvo-b9salf", "Volvo B9SALF", "Articulado", "Santiago", "Épica", true),

  crearBus("micro-amarilla-clasica", "Micro amarilla clásica (antes del Transantiago)", "Diésel", "Histórica", "Legendaria", true),
  crearBus("trolebus-pullman-standard", "Trolebús Pullman-Standard de Valparaíso (retirado en 2023)", "Trolebús", "Histórica", "Legendaria", false),

  crearBus("trolebus-valparaiso", 'Trolebús de Valparaíso (los "troles")', "Trolebús", "Valparaíso", "Legendaria", true),
  crearBus("bus-electrico-valparaiso", "Bus eléctrico de Valparaíso con colores de trole (servicios E01 a E04)", "Eléctrico", "Valparaíso", "Épica", true),
  crearBus("micro-portena", "Micro porteña (Transporte Metropolitano de Valparaíso)", "Diésel", "Valparaíso", "Común", true),

  crearBus("marcopolo-paradiso-g7-1200", "Marcopolo Paradiso G7 1200", "Interurbano", "Regiones", "Común", true),
  crearBus("marcopolo-paradiso-g7-1800-dd", "Marcopolo Paradiso G7 1800 DD (dos pisos)", "Interurbano", "Regiones", "Rara", true),
  crearBus("irizar-i6", "Irizar i6", "Interurbano", "Regiones", "Rara", true),
  crearBus("busscar-vissta-buss", "Busscar Vissta Buss", "Interurbano", "Regiones", "Rara", true),
  crearBus("neoplan-cityliner-skyliner", "Neoplan (Cityliner o Skyliner)", "Interurbano", "Regiones", "Épica", true),

  crearBus("mercedes-sprinter", "Mercedes-Benz Sprinter", "Minibús", "Regiones", "Común", true),
  crearBus("hyundai-county", "Hyundai County", "Minibús", "Regiones", "Común", true),
  crearBus("toyota-coaster", "Toyota Coaster", "Minibús", "Regiones", "Rara", true),
];

export const BUS_POR_ID = Object.fromEntries(BUSES.map((bus) => [bus.id, bus]));

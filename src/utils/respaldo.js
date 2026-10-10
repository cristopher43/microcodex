export const VERSION_RESPALDO = 1;

export function crearRespaldo(capturas, logros) {
  return {
    aplicacion: "MicroDex",
    version: VERSION_RESPALDO,
    exportadoEn: new Date().toISOString(),
    capturas,
    logros,
  };
}

export function validarRespaldo(datos) {
  if (!datos || typeof datos !== "object" || datos.aplicacion !== "MicroDex") {
    return { valido: false, mensaje: "El archivo no corresponde a un respaldo de MicroDex." };
  }

  if (
    datos.version !== VERSION_RESPALDO ||
    !Array.isArray(datos.capturas) ||
    !datos.logros ||
    typeof datos.logros !== "object" ||
    Array.isArray(datos.logros)
  ) {
    return { valido: false, mensaje: "El respaldo tiene un formato o versión no compatible." };
  }

  const busesVistos = new Set();
  const capturasValidas = datos.capturas.every((captura) => {
    if (
      !captura ||
      typeof captura.busId !== "string" ||
      busesVistos.has(captura.busId) ||
      typeof captura.foto !== "string" ||
      !captura.foto.startsWith("data:image/") ||
      typeof captura.fecha !== "string" ||
      Number.isNaN(new Date(captura.fecha).getTime()) ||
      (captura.coordenadas !== null &&
        captura.coordenadas !== undefined &&
        (!Number.isFinite(captura.coordenadas.lat) || !Number.isFinite(captura.coordenadas.lng)))
    ) {
      return false;
    }
    busesVistos.add(captura.busId);
    return true;
  });

  const logrosValidos = Object.entries(datos.logros).every(
    ([id, fecha]) =>
      typeof id === "string" &&
      fecha &&
      typeof fecha.fecha === "string" &&
      !Number.isNaN(new Date(fecha.fecha).getTime()),
  );

  if (!capturasValidas || !logrosValidos) {
    return { valido: false, mensaje: "El archivo contiene datos incompletos o dañados." };
  }

  return {
    valido: true,
    datos: { capturas: datos.capturas, logros: datos.logros },
  };
}

export function descargarRespaldo(capturas, logros) {
  const respaldo = crearRespaldo(capturas, logros);
  const archivo = new Blob([JSON.stringify(respaldo, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = "microdex-respaldo-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

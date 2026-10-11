import { useCallback, useEffect, useRef, useState } from "react";
import { RECORRIDOS } from "../data/recorridos.js";

const NOMBRE_BD = "microdex-recorridos-v1";
const NOMBRE_TABLA = "capturas";
const IDS_VALIDOS = new Set(RECORRIDOS.map((recorrido) => recorrido.id));

function abrirBaseDatos() {
  if (!("indexedDB" in window)) {
    return Promise.reject(new Error("Este navegador no permite guardar las fotos de recorridos."));
  }

  return new Promise((resolve, reject) => {
    const solicitud = window.indexedDB.open(NOMBRE_BD, 1);
    solicitud.onupgradeneeded = () => {
      const baseDatos = solicitud.result;
      if (!baseDatos.objectStoreNames.contains(NOMBRE_TABLA)) {
        baseDatos.createObjectStore(NOMBRE_TABLA, { keyPath: "recorridoId" });
      }
    };
    solicitud.onsuccess = () => resolve(solicitud.result);
    solicitud.onerror = () => reject(solicitud.error || new Error("No se pudo abrir el almacenamiento de recorridos."));
    solicitud.onblocked = () => reject(new Error("Cierra otras pestañas de MicroDex y vuelve a intentarlo."));
  });
}

async function leerTodasLasCapturas() {
  const baseDatos = await abrirBaseDatos();
  return new Promise((resolve, reject) => {
    const transaccion = baseDatos.transaction(NOMBRE_TABLA, "readonly");
    const solicitud = transaccion.objectStore(NOMBRE_TABLA).getAll();
    let resultado = [];
    solicitud.onsuccess = () => { resultado = solicitud.result || []; };
    transaccion.oncomplete = () => { baseDatos.close(); resolve(resultado); };
    transaccion.onerror = () => { baseDatos.close(); reject(transaccion.error || new Error("No se pudieron leer las fotos guardadas.")); };
    transaccion.onabort = () => { baseDatos.close(); reject(transaccion.error || new Error("Se interrumpió la lectura de las fotos.")); };
  });
}

async function guardarFila(fila) {
  const baseDatos = await abrirBaseDatos();
  return new Promise((resolve, reject) => {
    const transaccion = baseDatos.transaction(NOMBRE_TABLA, "readwrite");
    transaccion.objectStore(NOMBRE_TABLA).put(fila);
    transaccion.oncomplete = () => { baseDatos.close(); resolve(true); };
    transaccion.onerror = () => { baseDatos.close(); reject(transaccion.error || new Error("No se pudo guardar la foto del recorrido.")); };
    transaccion.onabort = () => { baseDatos.close(); reject(transaccion.error || new Error("Se interrumpió el guardado de la foto.")); };
  });
}

async function actualizarFilaCoordenadas(recorridoId, fecha, coordenadas) {
  const baseDatos = await abrirBaseDatos();
  return new Promise((resolve, reject) => {
    const transaccion = baseDatos.transaction(NOMBRE_TABLA, "readwrite");
    const tabla = transaccion.objectStore(NOMBRE_TABLA);
    const solicitud = tabla.get(recorridoId);
    let actualizada = false;
    solicitud.onsuccess = () => {
      const fila = solicitud.result;
      if (!fila || fila.fecha !== fecha || fila.coordenadas) return;
      tabla.put({ ...fila, coordenadas });
      actualizada = true;
    };
    transaccion.oncomplete = () => { baseDatos.close(); resolve(actualizada); };
    transaccion.onerror = () => { baseDatos.close(); reject(transaccion.error || new Error("No se pudo añadir la ubicación.")); };
    transaccion.onabort = () => { baseDatos.close(); reject(transaccion.error || new Error("Se interrumpió la actualización de ubicación.")); };
  });
}

async function limpiarBaseDatos() {
  const baseDatos = await abrirBaseDatos();
  return new Promise((resolve, reject) => {
    const transaccion = baseDatos.transaction(NOMBRE_TABLA, "readwrite");
    transaccion.objectStore(NOMBRE_TABLA).clear();
    transaccion.oncomplete = () => { baseDatos.close(); resolve(true); };
    transaccion.onerror = () => { baseDatos.close(); reject(transaccion.error || new Error("No se pudieron borrar las fotos de recorridos.")); };
    transaccion.onabort = () => { baseDatos.close(); reject(transaccion.error || new Error("Se interrumpió el borrado de las fotos.")); };
  });
}

export function useCapturasRecorridos() {
  const [capturasRecorridos, setCapturasRecorridos] = useState([]);
  const [cargandoRecorridos, setCargandoRecorridos] = useState(true);
  const [errorRecorridos, setErrorRecorridos] = useState("");
  const urlPorRecorrido = useRef(new Map());

  useEffect(() => {
    let activo = true;
    leerTodasLasCapturas()
      .then((filas) => {
        if (!activo) return;
        const validas = filas.filter((fila) => IDS_VALIDOS.has(fila.recorridoId) && fila.foto instanceof Blob);
        const capturas = validas.map((fila) => {
          const fotoUrl = URL.createObjectURL(fila.foto);
          urlPorRecorrido.current.set(fila.recorridoId, fotoUrl);
          return { recorridoId: fila.recorridoId, fecha: fila.fecha, coordenadas: fila.coordenadas || null, fotoUrl };
        });
        setCapturasRecorridos(capturas);
        setErrorRecorridos("");
      })
      .catch((error) => {
        if (activo) setErrorRecorridos(error?.message || "No se pudieron cargar las fotos de recorridos.");
      })
      .finally(() => {
        if (activo) setCargandoRecorridos(false);
      });

    return () => {
      activo = false;
      for (const url of urlPorRecorrido.current.values()) URL.revokeObjectURL(url);
      urlPorRecorrido.current.clear();
    };
  }, []);

  const registrarCapturaRecorrido = useCallback(async (recorridoId, fotoDataUrl, fecha, coordenadas = null) => {
    try {
      if (!IDS_VALIDOS.has(recorridoId)) throw new Error("Ese recorrido no está en la Pokédex vigente.");
      const blob = await (await fetch(fotoDataUrl)).blob();
      if (!blob.type.startsWith("image/")) throw new Error("La imagen no tiene un formato válido.");
      await guardarFila({ recorridoId, fecha, coordenadas, foto: blob });
      try {
        await navigator.storage?.persist?.();
      } catch {
        // El permiso de almacenamiento persistente es una mejora; IndexedDB ya guardó la foto.
      }

      const fotoUrl = URL.createObjectURL(blob);
      const anterior = urlPorRecorrido.current.get(recorridoId);
      if (anterior) URL.revokeObjectURL(anterior);
      urlPorRecorrido.current.set(recorridoId, fotoUrl);
      const captura = { recorridoId, fecha, coordenadas, fotoUrl };
      setCapturasRecorridos((actuales) => [
        ...actuales.filter((item) => item.recorridoId !== recorridoId),
        captura,
      ]);
      setErrorRecorridos("");
      return true;
    } catch (error) {
      setErrorRecorridos(error?.message || "No se pudo guardar la foto. Revisa el espacio disponible del dispositivo.");
      return false;
    }
  }, []);

  const importarCapturasMicros = useCallback(async (capturasMicros = []) => {
    try {
      const guardadas = await leerTodasLasCapturas();
      const idsGuardados = new Set(guardadas.map((fila) => fila.recorridoId));
      const rutasPorCodigo = new Map(RECORRIDOS.map((ruta) => [ruta.codigo.toLocaleUpperCase("es-CL"), ruta]));
      const rutasImportadas = new Set();

      for (const micro of capturasMicros) {
        if (!micro?.recorrido || typeof micro.foto !== "string" || !micro.foto.startsWith("data:image/")) continue;
        const codigo = micro.recorrido.split(" · ", 1)[0].trim().toLocaleUpperCase("es-CL");
        const ruta = rutasPorCodigo.get(codigo);
        if (!ruta || idsGuardados.has(ruta.id) || rutasImportadas.has(ruta.id)) continue;
        const importada = await registrarCapturaRecorrido(ruta.id, micro.foto, micro.fecha, micro.coordenadas || null);
        if (importada) rutasImportadas.add(ruta.id);
      }
    } catch {
      // La importación de datos antiguos es complementaria; la app conserva las capturas originales.
    }
  }, [registrarCapturaRecorrido]);

  const actualizarCoordenadasRecorrido = useCallback(async (recorridoId, fecha, coordenadas) => {
    try {
      const actualizada = await actualizarFilaCoordenadas(recorridoId, fecha, coordenadas);
      if (!actualizada) return false;
      setCapturasRecorridos((actuales) => actuales.map((captura) =>
        captura.recorridoId === recorridoId && captura.fecha === fecha
          ? { ...captura, coordenadas }
          : captura,
      ));
      return true;
    } catch {
      return false;
    }
  }, []);

  const borrarCapturasRecorridos = useCallback(async () => {
    try {
      await limpiarBaseDatos();
      for (const url of urlPorRecorrido.current.values()) URL.revokeObjectURL(url);
      urlPorRecorrido.current.clear();
      setCapturasRecorridos([]);
      setErrorRecorridos("");
      return true;
    } catch (error) {
      setErrorRecorridos(error?.message || "No se pudieron borrar las fotos de recorridos.");
      return false;
    }
  }, []);

  return {
    capturasRecorridos,
    cargandoRecorridos,
    errorRecorridos,
    registrarCapturaRecorrido,
    importarCapturasMicros,
    actualizarCoordenadasRecorrido,
    borrarCapturasRecorridos,
  };
}

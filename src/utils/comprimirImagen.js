export function comprimirImagen(archivo, anchoMaximo = 600, calidad = 0.6) {
  return new Promise((resolve, reject) => {
    if (!(archivo instanceof Blob) || !archivo.type.startsWith("image/")) {
      reject(new Error("El archivo seleccionado no es una imagen."));
      return;
    }

    const imagen = new Image();
    const url = URL.createObjectURL(archivo);

    imagen.onload = () => {
      try {
        const escala = Math.min(1, anchoMaximo / imagen.width);
        const ancho = Math.max(1, Math.round(imagen.width * escala));
        const alto = Math.max(1, Math.round(imagen.height * escala));
        const canvas = document.createElement("canvas");
        canvas.width = ancho;
        canvas.height = alto;

        const contexto = canvas.getContext("2d", { alpha: false });
        if (!contexto) throw new Error("No se pudo preparar la imagen.");

        contexto.drawImage(imagen, 0, 0, ancho, alto);
        resolve(canvas.toDataURL("image/jpeg", calidad));
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    imagen.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la fotografía."));
    };

    imagen.src = url;
  });
}

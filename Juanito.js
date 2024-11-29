class Juanito {
  constructor(x, y, img, minY, maxY) {
    this.x = x; // Posición horizontal
    this.y = y; // Posición vertical
    this.img = img; // Imagen
    this.minY = 0; // Posición vertical mínima
    this.maxY = windowHeight+img.height; // Posición vertical máxima
    this.size = img.width; // Tamaño inicial de Juanito basado en la imagen
  }

  // Dibuja a Juanito en su posición actual
  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.size, this.size);
  }

  // Actualiza la posición horizontal de Juanito para que coincida con noseX
  moveWithNose(noseX) {
    const margin = 0.05 * width; // Margen del 5% del ancho del canvas para evitar oscilaciones
    if (Math.abs(this.x - noseX) > margin) {
      this.x = constrain(noseX, 0 + this.size / 2, width - this.size / 2); // Limita la posición dentro del canvas
    }
  }

  // Mueve a Juanito verticalmente según el ancho de los hombros
  moveWithShoulders(shoulderDistance) {
    // Validar la distancia entre hombros
    if (shoulderDistance < 100 || shoulderDistance > 800) {
      console.warn("Distancia entre hombros fuera de rango:", shoulderDistance);
      return; // No actualizar si la distancia no es válida
    }

    // Mapea la distancia entre hombros directamente a la posición vertical
    const mappedY = map(
      shoulderDistance,
      150, // Valor mínimo esperado de distancia entre hombros
      650, // Valor máximo esperado de distancia entre hombros
      this.maxY, // Posición más baja en la pantalla
      this.minY // Posición más alta en la pantalla
    );

    // Limita la posición vertical mapeada dentro de los límites del canvas
    this.y = constrain(mappedY, this.minY, this.maxY);

    // Actualiza el tamaño de Juanito basado en la posición vertical
    this.updateSize();

    console.log(
      "Posición Y de Juanito:", this.y,
      "Tamaño de Juanito:", this.size,
      "Distancia entre hombros:", shoulderDistance
    );
  }

  // Actualiza el tamaño de Juanito basado en la posición vertical
  updateSize() {
    const calculatedSize = map(
      this.y,
      this.minY,
      this.maxY,
      this.img.width * 0.1, // Tamaño mínimo de Juanito
      this.img.width * 2 // Tamaño máximo de Juanito
    );

    // Asegura un tamaño mínimo razonable
    this.size = Math.max(
      calculatedSize,
      46 / (this.img.height / this.img.width)
    );
  }

  // Restringe a Juanito dentro de los límites del canvas
  constrain(canvasWidth, canvasHeight) {
    this.x = constrain(this.x, 0 + this.size / 2, canvasWidth - this.size / 2);
    this.y = constrain(this.y, 0 + this.size / 2, canvasHeight - this.size / 2);
  }
}

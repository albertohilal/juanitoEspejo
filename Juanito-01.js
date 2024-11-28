class Juanito {
  constructor(x, y, img) {
    this.x = x; // Posición horizontal
    this.y = y; // Posición vertical
    this.img = img; // Imagen
    this.previousShoulderDistance = null; // Inicializa con null
    this.movingDirection = "none"; // Dirección inicial
    this.size = img.width / 3; // Tamaño inicial de Juanito
    this.minY = 0; // Límite superior de la posición vertical
    this.maxY = windowHeight; // Límite inferior de la posición vertical
  }

  // Dibuja a Juanito en su posición actual con el tamaño actualizado
  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.size, this.size * (this.img.height / this.img.width));
  }

  // Actualiza la posición horizontal de Juanito para que coincida con noseX, con un margen del 5%
  moveWithNose(noseX) {
    const margin = 0.05 * this.x; // Define un margen dinámico del 5%
    if (Math.abs(this.x - noseX) > margin) { // Solo mueve si el cambio excede el margen
      console.log(`Movimiento detectado: noseX=${noseX}, posición actual x=${this.x}`);
      this.x = noseX; // Actualiza la posición horizontal
    } else {
      console.log("Dentro del margen de oscilación, posición X no cambia.");
    }
  }

  // Mueve a Juanito verticalmente según los cambios en la distancia entre los hombros
  moveWithShoulders(shoulderDistance) {
    if (this.previousShoulderDistance !== null) {
      const margin = 0.05 * this.previousShoulderDistance; // Margen del 5%
      console.log("Diferencia entre hombros:", this.previousShoulderDistance - shoulderDistance);

      // Si la dirección actual es "up", continúa moviéndose hacia arriba hasta que se detecte un cambio significativo hacia "down"
      if (this.movingDirection === "up") {
        this.y -= 20; // Continúa subiendo
        if (shoulderDistance < this.previousShoulderDistance - margin) {
          this.movingDirection = "down"; // Cambia dirección a "down"
          console.log("Cambio de dirección a: down");
        }
      }

      // Si la dirección actual es "down", continúa moviéndose hacia abajo hasta que se detecte un cambio significativo hacia "up"
      else if (this.movingDirection === "down") {
        this.y += 20; // Continúa bajando
        if (shoulderDistance > this.previousShoulderDistance + margin) {
          this.movingDirection = "up"; // Cambia dirección a "up"
          console.log("Cambio de dirección a: up");
        }
      }

      // Si no hay una dirección definida, evalúa si iniciar movimiento hacia arriba o abajo
      else {
        if (shoulderDistance > this.previousShoulderDistance + margin) {
          this.movingDirection = "up"; // Inicia movimiento hacia arriba
          console.log("Inicia movimiento hacia: up");
        } else if (shoulderDistance < this.previousShoulderDistance - margin) {
          this.movingDirection = "down"; // Inicia movimiento hacia abajo
          console.log("Inicia movimiento hacia: down");
        } else {
          console.log("Dentro del margen de oscilación, posición Y no cambia.");
        }
      }
    }

    // Actualiza la distancia anterior con la distancia actual
    this.previousShoulderDistance = shoulderDistance;
    console.log("Posición Y de Juanito:", this.y, "Dirección:", this.movingDirection);

    // Actualiza el tamaño de Juanito basado en su posición vertical
    this.updateSize();
  }

  // Actualiza el tamaño de Juanito basado en su posición vertical
  updateSize() {
    this.size = map(
      this.y,
      this.minY,
      this.maxY,
      this.img.width * 0.5, // Tamaño mínimo
      this.img.width * 2 // Tamaño máximo
    );

    // Garantiza un tamaño mínimo
    this.size = Math.max(this.size, 50);
    console.log("Tamaño de Juanito:", this.size);
  }

  // Restringe a Juanito dentro de los límites del canvas
  constrain(canvasWidth, canvasHeight) {
    this.x = constrain(this.x, 0 + this.size / 2, canvasWidth - this.size / 2);
    this.y = constrain(this.y, 0 + this.size / 2, canvasHeight - this.size / 2);
  }
}

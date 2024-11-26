class Juanito {
  constructor(x, y, img) {
    this.x = x; // Posición horizontal
    this.y = y; // Posición vertical
    this.img = img; // Imagen
    this.previousShoulderDistance = null; // Inicializa con null
    this.movingDirection = "none"; // Dirección inicial
  }

  // Dibuja a Juanito en su posición actual
  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y);
  }

  // Actualiza la posición horizontal de Juanito para que coincida con noseX
  moveWithNose(noseX) {
    if (Math.abs(this.x - noseX) > 5) { // Solo mueve si el cambio es mayor a 5 px
      this.x = noseX;
    }
  }

  // Mueve a Juanito verticalmente según los cambios en la distancia entre los hombros
  moveWithShoulders(shoulderDistance) {
    if (this.previousShoulderDistance !== null) {
      const margin = 0.1 * this.previousShoulderDistance; // Margen del 10%
      console.log("Diferencia entre hombros:", this.previousShoulderDistance - shoulderDistance);

      // Si la dirección actual es "up", continúa moviéndose hacia arriba hasta que se detecte un cambio significativo hacia "down"
      if (this.movingDirection === "up") {
        this.y -= 50; // Continúa subiendo
        if (shoulderDistance < this.previousShoulderDistance - margin) {
          this.movingDirection = "down"; // Cambia dirección a "down"
          console.log("Cambio de dirección a: down");
        }
      }

      // Si la dirección actual es "down", continúa moviéndose hacia abajo hasta que se detecte un cambio significativo hacia "up"
      else if (this.movingDirection === "down") {
        this.y += 50; // Continúa bajando
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
  }

  // Restringe a Juanito dentro de los límites del canvas
  constrain(canvasWidth, canvasHeight) {
    this.x = constrain(this.x, 0 + this.img.width / 2, canvasWidth - this.img.width / 2);
    this.y = constrain(this.y, 0 + this.img.height / 2, canvasHeight - this.img.height / 2);
  }
}

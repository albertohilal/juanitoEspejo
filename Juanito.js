class Juanito {
  constructor(x, y, img) {
    this.x = x; // Posición horizontal
    this.y = y; // Posición vertical
    this.img = img; // Imagen
    this.previousShoulderDistance = null; // Inicializa con null
    this.movingDirection = null; // Dirección actual del movimiento ("up" o "down")
  }

  // Dibuja a Juanito en su posición actual
  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y);
  }

  // Actualiza la posición horizontal de Juanito si noseX ha variado al menos 5px
  moveWithNose(noseX) {
    if (abs(this.x - noseX) > 5) {
      this.x = noseX;
    }
  }

  // Mueve a Juanito verticalmente según los cambios en la distancia entre los hombros
  moveWithShoulders(shoulderDistance) {
    console.log("Diferencia entre hombros:", this.previousShoulderDistance - shoulderDistance);

    if (this.previousShoulderDistance !== null) {
      if (shoulderDistance > this.previousShoulderDistance) {
        this.movingDirection = "up"; // Cambia dirección a "up"
      } else if (shoulderDistance < this.previousShoulderDistance ) {
        this.movingDirection = "down"; // Cambia dirección a "down"
      }

      // Continúa moviendo en la dirección actual
      if (this.movingDirection === "up") {
        this.y -= 50; // Reduce this.y mientras shoulderDistance aumenta
        if (shoulderDistance < this.previousShoulderDistance) {
          this.movingDirection = null; // Detén el movimiento hacia arriba
        }
      } else if (this.movingDirection === "down") {
        this.y += 50; // Incrementa this.y mientras shoulderDistance disminuye
        if (shoulderDistance > this.previousShoulderDistance) {
          this.movingDirection = null; // Detén el movimiento hacia abajo
        }
      }
    }

    // Actualiza la distancia anterior con la actual
    this.previousShoulderDistance = shoulderDistance;
    console.log("Posición Y de Juanito:", this.y);
  }

  // Restringe a Juanito dentro de los límites del canvas
  constrain(canvasWidth, canvasHeight) {
    this.x = constrain(this.x, 0 + this.img.width / 2, canvasWidth - this.img.width / 2);
    this.y = constrain(this.y, 0, canvasHeight);
  }
}

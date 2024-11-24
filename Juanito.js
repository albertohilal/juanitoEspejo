class Juanito {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.speedY = 30; // Velocidad solo para el movimiento vertical
  }

  // Dibuja a Juanito en su posición actual
  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y);
  }

  // Actualiza la posición horizontal de Juanito para que coincida con noseX
  moveWithNose(noseX) {
    this.x = noseX; // La posición x de Juanito se iguala a noseX
  }

  // Mueve a Juanito verticalmente según la distancia entre los hombros
  moveWithShoulders(shoulderDistance, maxDist, minDist) {
    if (shoulderDistance > maxDist) {
      // Si la distancia es mayor a maxDist, Juanito sube
      this.y -= map(shoulderDistance, maxDist, maxDist * 1.5, 1, this.speedY);
    } else if (shoulderDistance < minDist) {
      // Si la distancia es menor a minDist, Juanito baja
      this.y += map(shoulderDistance, minDist, maxDist, this.speedY, 1);
    }
  }

  // Restringe a Juanito dentro de los límites del canvas
  constrain(canvasWidth, canvasHeight) {
    this.x = constrain(this.x, 0 + this.img.width / 2, canvasWidth - this.img.width / 2);
    this.y = constrain(this.y, 0 + this.img.height / 2, canvasHeight - this.img.height / 2);
  }
}

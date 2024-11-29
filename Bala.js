class Bala {
  constructor(x, y, speed) {
    this.x = x; // Posición horizontal de la bala, alineada con el avión
    this.y = y; // Posición vertical de la bala
    this.speed = speed; // Velocidad de la bala
  }

  // Dibuja la bala en su posición actual
  draw() {
    fill(0); // Color negro
    noStroke(); // Sin contorno
    circle(this.x, this.y, 6); // Dibuja un círculo representando la bala
  }

  // Actualiza la posición de la bala según su velocidad
  update() {
    this.y += this.speed; // Incrementa la posición vertical según la velocidad
  }
}

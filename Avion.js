class Avion {
  constructor(imgPath) {
    this.img = loadImage(imgPath); // Carga de la imagen del avión
    this.x = 0; // Posición horizontal del avión
    this.y = 0; // Posición vertical del avión
    this.size = 0; // Tamaño del avión (porcentaje)
    this.maxSize = 100; // Tamaño máximo del avión (porcentaje)
    this.targetY = -120; // Altura objetivo para el avión
    this.balas = []; // Array para almacenar las balas disparadas
  }

  // Inicializa la posición del avión
  init() {
    this.x = width / 2; // Centra el avión horizontalmente
    this.y = height * 0.4; // Coloca el avión a cierta altura inicial
  }

  // Dibuja el avión en su posición actual
  draw() {
    // Calcula el ancho y alto escalados del avión
    const scaledWidth = (this.size / 100) * this.img.width;
    const scaledHeight = (this.size / 100) * this.img.height;

    // Dibuja la imagen del avión centrada en `this.x` y `this.y`
    imageMode(CENTER);
    image(this.img, this.x, this.y, scaledWidth, scaledHeight);

    // Dibuja todas las balas disparadas
    for (let bala of this.balas) {
      bala.draw();
    }
  }

  // Actualiza la posición y el tamaño del avión, y controla las balas
  update() {
    // Escala el tamaño del avión basado en su posición vertical
    this.size = map(this.y, height, this.targetY, 0, this.maxSize);

    // Mueve el avión hacia la altura objetivo
    if (this.y > this.targetY) {
      this.y -= 2;
    } else {
      this.init(); // Reinicia la posición si alcanza el objetivo
    }

    // Genera nuevas balas en intervalos de tiempo
    if (frameCount % 20 === 0 && this.y > 0) {
      const scaledHeight = (this.size / 100) * this.img.height;
      this.balas.push(
        new Bala(
          this.x, // Centra las balas en la posición X del avión
          this.y + scaledHeight / 2, // Posición Y de la bala en la base del avión
          5 // Velocidad de la bala
        )
      );
    }

    // Actualiza la posición de cada bala y elimina las que salen de la pantalla
    for (let i = this.balas.length - 1; i >= 0; i--) {
      this.balas[i].update();
      if (this.balas[i].y > height) {
        this.balas.splice(i, 1); // Elimina la bala si sale de la pantalla
      }
    }
  }
}

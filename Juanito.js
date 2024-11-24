class Juanito {
  constructor(x, y, img) {
    this.x = x; // Posición horizontal
    this.y = y; // Posición vertical
    this.img = img; // Imagen
    this.previousShoulderDistance = 0; // Inicializa con un valor por defecto
  }

  // Dibuja a Juanito en su posición actual
  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y);
  }

  // Actualiza la posición horizontal de Juanito para que coincida con noseX
  moveWithNose(noseX) {
    this.x = noseX; // La posición x de Juanito se iguala a noseX
    console.log("Posición X de Juanito:", this.x); // Verifica la posición X
  }

    moveWithShoulders(shoulderDistance) {
      console.log("Diiferencia entre hombros:", this.previousShoulderDistance-shoulderDistance);
     // console.log("Distancia previa:", this.previousShoulderDistance);
    
      if (shoulderDistance > this.previousShoulderDistance) {
        this.y = this.y -150; // Reduce this.y si shoulderDistance aumenta
      } else if (shoulderDistance < this.previousShoulderDistance) {
        this.y = this.y + 150; // Incrementa this.y si shoulderDistance disminuye
      } else {
        console.log("Distancia constante, posición Y no cambia.");
      }
    
      // Solo actualizamos `this.previousShoulderDistance` si hubo un cambio
      this.previousShoulderDistance = shoulderDistance;
      console.log("Posición Y de Juanito:", this.y);
    }
    
  // Restringe a Juanito dentro de los límites del canvas
  constrain(canvasWidth, canvasHeight) {
    this.x = constrain(this.x, 0 , canvasWidth);
    this.y = constrain(this.y, 0 , canvasHeight - this.img.height / 2);
    console.log("Posición Y restringida de Juanito:", this.y); // Verifica la posición Y después de restringir
  }
}

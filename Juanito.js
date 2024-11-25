class Juanito {
  constructor(x, y, img) {
    this.x = x; // Posición horizontal inicial
    this.y = y; // Posición vertical inicial
    this.img = img; // Imagen de Juanito
    this.previousShoulderDistance = 0; // Inicializa la distancia anterior de los hombros
  }

  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y);
  }

  updatePosition(noseX, shoulderDistance) {
    this.moveWithNose(noseX);
    this.moveWithShoulders(shoulderDistance);
  }

  moveWithNose(noseX) {
    this.x = noseX; // Actualiza la posición x
    console.log("Posición X de Juanito actualizada:", this.x);
  }

  // Actualiza la posición vertical de Juanito basado en la distancia entre hombros
  moveWithShoulders(shoulderDistance) {
    this.y = windowHeight -(shoulderDistance * windowWidth / windowHeight) ;// Calcula la nueva posición y de Juanito basada en la relación de aspecto
    console.log("Posición Y de Juanito actualizada:", this.y);
  }

  constrain(canvasWidth, canvasHeight) {
    this.x = constrain(this.x, 0, canvasWidth);
    this.y = constrain(this.y, 0, canvasHeight - this.img.height / 2);
    console.log("Posición restringida de Juanito:", this.x, this.y);
  }
}

let video; // Captura de video
let poseNet; // Modelo PoseNet de ml5.js
let poses = []; // Arreglo para guardar las poses detectadas
let juanito; // Imagen de Juanito
let juanitoY; // Posición vertical de Juanito

function preload() {
  // Carga la imagen del cuerpo de Juanito
  juanito = loadImage("images/body.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Pantalla completa del dispositivo

  // Configuración de la captura de video
  video = createCapture(VIDEO); // Inicia la captura de video
  video.size(width, height); // Ajusta el tamaño del video al canvas
  video.hide(); // Oculta el video para que no se vea directamente en la pantalla

  // Carga el modelo PoseNet con el video como fuente
  poseNet = ml5.poseNet(video, modelReady);

  // Evento para capturar las poses detectadas
  poseNet.on("pose", gotPoses);

  // Inicializa a Juanito en el centro de la pantalla
  juanitoY = height / 2;
}

function draw() {
  background(220); // Fondo gris claro

  // Dibuja el video (opcional, para ver el video capturado)
  image(video, 0, 0, width, height);

  // Dibuja la imagen de Juanito en la posición actual
  imageMode(CENTER);
  image(juanito, width / 2, juanitoY);

  // Procesa las poses detectadas
  if (poses.length > 0) {
    let pose = poses[0].pose; // Primera pose detectada

    // Dibuja los keypoints de nariz, ojos y hombros
    drawKeypoint(pose.keypoints[0], "Nariz"); // Nariz
    drawKeypoint(pose.keypoints[1], "Ojo Izq"); // Ojo izquierdo
    drawKeypoint(pose.keypoints[2], "Ojo Der"); // Ojo derecho
    drawKeypoint(pose.keypoints[5], "Hombro Izq"); // Hombro izquierdo
    drawKeypoint(pose.keypoints[6], "Hombro Der"); // Hombro derecho

    // Obtén la posición promedio del cuerpo (nariz y hombros)
    let noseY = pose.keypoints[0].position.y; // Nariz
    let rightShoulderY = pose.keypoints[6].position.y; // Hombro derecho
    let leftShoulderY = pose.keypoints[5].position.y; // Hombro izquierdo
    let shoulderY = (rightShoulderY + leftShoulderY) / 2; // Promedio de hombros

    // Determina la proximidad del cuerpo al borde superior
    let proximity = min(noseY, shoulderY);

    // Mueve a Juanito hacia arriba si el cuerpo está cerca del borde superior
    if (proximity < height / 3) {
      juanitoY -= map(proximity, 0, height / 3, 5, 1); // Velocidad proporcional
    }

    // Mueve a Juanito hacia abajo si el cuerpo está más lejos del borde superior
    if (proximity > height / 2) {
      juanitoY += map(proximity, height / 2, height, 1, 5);
    }

    // Limita la posición de Juanito dentro de la pantalla
    juanitoY = constrain(
      juanitoY,
      0 + juanito.height / 2,
      height - juanito.height / 2
    );
  }
}

// Dibuja un keypoint y su etiqueta en pantalla
function drawKeypoint(keypoint, label) {
  if (keypoint.score > 0.5) {
    // Verifica que el punto tiene una detección confiable
    fill(255, 0, 0);
    noStroke();
    ellipse(keypoint.position.x, keypoint.position.y, 10, 10); // Dibuja el punto
    fill(0);
    textSize(14);
    text(label, keypoint.position.x + 10, keypoint.position.y); // Dibuja la etiqueta
  }
}

function modelReady() {
  console.log("PoseNet model loaded");
}

function gotPoses(results) {
  // Almacena las poses detectadas
  poses = results;
}

function windowResized() {
  // Ajusta el canvas cuando el tamaño de la ventana cambia
  resizeCanvas(windowWidth, windowHeight);
}

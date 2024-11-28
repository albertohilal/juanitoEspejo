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

  // Configuración de la captura de video utilizando DroidCam
  video = createCapture({
    video: {
      mandatory: {
        minWidth: 640,
        minHeight: 480,
        maxWidth: 1280,
        maxHeight: 720,
      },
    },
    audio: false, // DroidCam no transmite audio aquí
  });
  video.size(width, height); // Ajusta el tamaño del video al canvas
  video.hide(); // Oculta el video para que no se vea directamente en la pantalla

  // Carga el modelo PoseNet con configuraciones para mejorar el rendimiento
  poseNet = ml5.poseNet(
    video,
    {
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.5,
    },
    modelReady
  );

  // Evento para capturar las poses detectadas
  poseNet.on("pose", gotPoses);

  // Inicializa a Juanito en el centro de la pantalla
  juanitoY = height / 2;
}

function draw() {
  background(220); // Fondo gris claro

  if (poses.length > 0) {
    let pose = poses[0].pose; // Primera pose detectada
    displayPose(pose);
  }
}

function displayPose(pose) {
  drawImageAndShoulders(pose);
  adjustJuanitoPositionBasedOnShoulders(pose);
}

function drawImageAndShoulders(pose) {
  imageMode(CENTER);
  image(juanito, width / 2, juanitoY);

  drawKeypoint(pose.keypoints[5], "Hombro Izq");
  drawKeypoint(pose.keypoints[6], "Hombro Der");

  drawLineWithStyle(pose.keypoints[5], pose.keypoints[6], 10, color(255, 0, 0));
}

function adjustJuanitoPositionBasedOnShoulders(pose) {
  let shoulderDistance = calculateShoulderDistance(pose);

  if (shoulderDistance > width / 4) {
    juanitoY -= 2; // Simplifica la actualización de la posición
  } else if (shoulderDistance < width / 6) {
    juanitoY += 2;
  }
  juanitoY = constrain(
    juanitoY,
    juanito.height / 2,
    height - juanito.height / 2
  );
}

function calculateShoulderDistance(pose) {
  let leftShoulderX = pose.keypoints[5].position.x;
  let rightShoulderX = pose.keypoints[6].position.x;
  return Math.abs(rightShoulderX - leftShoulderX);
}

function drawKeypoint(keypoint, label) {
  if (keypoint.score > 0.5) {
    fill(255, 0, 0);
    noStroke();
    ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    fill(0);
    textSize(14);
    text(label, keypoint.position.x + 10, keypoint.position.y);
  }
}

function drawLineWithStyle(keypoint1, keypoint2, weight, col) {
  if (keypoint1.score > 0.5 && keypoint2.score > 0.5) {
    stroke(col);
    strokeWeight(weight);
    line(
      keypoint1.position.x,
      keypoint1.position.y,
      keypoint2.position.x,
      keypoint2.position.y
    );
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

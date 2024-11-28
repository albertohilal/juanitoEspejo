let video; // Captura de video
let poseProcessor; // Procesador de poses
let juanito; // Instancia del objeto Juanito
let juanitoImg; // Imagen de Juanito
let poseNet; // Modelo PoseNet de ml5.js

function preload() {
  // Carga la imagen del cuerpo de Juanito
  juanitoImg = loadImage("images/body.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Pantalla completa del dispositivo

  // Configuración de la captura de video con resolución ajustada
  video = createCapture({
    video: {
      mandatory: {
        minWidth: 320, // Ancho mínimo reducido para mejor rendimiento
        minHeight: 240, // Altura mínima
        maxWidth: 640, // Ancho máximo
        maxHeight: 480, // Altura máxima
      },
    },
    audio: false, // DroidCam no transmite audio aquí
  });

  video.size(windowWidth, windowHeight); // Ajusta la resolución del video capturado
  video.hide(); // Oculta el video para que no se vea directamente en la pantalla

  // Crea una instancia de Juanito
  juanito = new Juanito(width / 2, height / 2, juanitoImg);

  // Inicializa PoseProcessor
  poseNet = ml5.poseNet(video, modelReady);
  poseProcessor = new PoseProcessor(video, poseNet);
  poseProcessor.initializePoseDetection();

  frameRate(30); // Configura un frame rate más bajo para optimizar el rendimiento
}

function draw() {
  background(220); // Fondo gris claro

  // Voltea el video horizontalmente para que coincida con el movimiento del usuario
  push();
  translate(width, 0);
  scale(-1, 1);
  imageMode(CORNER);
  //image(video, 0, 0, width, height); // Dibuja el video en el canvas
  pop();

  if (poseProcessor.poses.length > 0) {
    let pose = poseProcessor.poses[0].pose; // Primera pose detectada

    // Dibuja los keypoints relevantes
    poseProcessor.drawKeypoints(pose);

    // Movimiento horizontal basado en la nariz
    let nose = poseProcessor.getKeypoint(pose, "Nariz");
    if (nose) juanito.moveWithNose(width - nose.position.x);

    // Movimiento vertical basado en los hombros
    let leftShoulder = poseProcessor.getKeypoint(pose, "Hombro Izq");
    let rightShoulder = poseProcessor.getKeypoint(pose, "Hombro Der");
    if (leftShoulder && rightShoulder) {
      let shoulderDistance = poseProcessor.getDistance(
        leftShoulder,
        rightShoulder
      );
      juanito.moveWithShoulders(shoulderDistance);
    }
  }

  // Restringe y dibuja a Juanito
  juanito.constrain(width, height);
  juanito.draw();
}

function modelReady() {
  console.log("PoseNet model loaded");
}

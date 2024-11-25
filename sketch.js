let video; // Variable para la captura de video
let poseProcessor; // Procesador de poses
let juanito; // Instancia del objeto Juanito
let juanitoImg; // Imagen para el objeto Juanito
let poseNet; // Modelo PoseNet de ml5.js

function preload() {
  // Carga la imagen de Juanito antes de iniciar el programa
  juanitoImg = loadImage("images/body.png");
}

function setup() {
  // Crea un canvas del tamaño de la ventana
  createCanvas(windowWidth, windowHeight);

  // Configura la captura de video
  video = createCapture({
    video: {
      mandatory: {
        minWidth: 640,
        minHeight: 480,
        maxWidth: 1280,
        maxHeight: 720,
      },
    },
    audio: false // DroidCam no transmite audio aquí
  });
  video.size(width, height); // Ajusta el tamaño del video al tamaño del canvas
  video.hide(); // Oculta la visualización directa del video

  // Instancia el objeto Juanito
  juanito = new Juanito(width / 2, height / 2, juanitoImg);

  // Inicializa PoseNet con el video
  poseNet = ml5.poseNet(video, modelReady);
  poseProcessor = new PoseProcessor(video, poseNet);
  poseProcessor.initializePoseDetection();
}

function draw() {
  background(220); // Fija el color de fondo del canvas

  // Voltea el video horizontalmente para que coincida con el movimiento del usuario
  push();
  translate(width, 0);
  scale(-1, 1);
  pop();

  // Verifica si hay poses detectadas
  if (poseProcessor.poses.length > 0) {
    let pose = poseProcessor.poses[0].pose; // Obtiene la primera pose detectada

    // Calcula la posición y movimientos de Juanito basados en la pose
    let nose = poseProcessor.getKeypoint(pose, "Nariz");
    let leftShoulder = poseProcessor.getKeypoint(pose, "Hombro Izq");
    let rightShoulder = poseProcessor.getKeypoint(pose, "Hombro Der");
    if (nose && leftShoulder && rightShoulder) {
      let shoulderDistance = poseProcessor.getDistance(leftShoulder, rightShoulder);
      juanito.updatePosition(width - nose.position.x, shoulderDistance);
    }
  }

  // Restringe y dibuja a Juanito dentro de los límites del canvas
  juanito.constrain(width, height);
  juanito.draw();
}

function modelReady() {
  console.log("PoseNet model loaded"); // Confirma que PoseNet está listo
}

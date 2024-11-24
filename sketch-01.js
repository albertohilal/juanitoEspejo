
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

  // Crea una instancia de Juanito
  juanito = new Juanito(width / 2, height / 2, juanitoImg);

  // Inicializa PoseProcessor

  poseNet = ml5.poseNet(video, modelReady);
  poseProcessor = new PoseProcessor(video, poseNet);
  poseProcessor.initializePoseDetection();
}

function draw() {
  background(220); // Fondo gris claro

  // Dibuja el video capturado (opcional)
  // image(video, 0, 0, width, height);

  if (poseProcessor.poses.length > 0) {
    let pose = poseProcessor.poses[0].pose; // Primera pose detectada

    // Dibuja los keypoints
    poseProcessor.drawKeypoints(pose);

    // Movimiento horizontal basado en la nariz
    let nose = poseProcessor.getKeypoint(pose, "Nariz");
    if (nose) juanito.moveWithNose(nose.position.x, width / 2);

    // Movimiento vertical basado en los hombros
    let leftShoulder = poseProcessor.getKeypoint(pose, "Hombro Izq");
    let rightShoulder = poseProcessor.getKeypoint(pose, "Hombro Der");
    if (leftShoulder && rightShoulder) {
      let shoulderDistance = poseProcessor.getDistance(leftShoulder, rightShoulder);
      juanito.moveWithShoulders(shoulderDistance, width / 4, width / 6);
    }
  }

  // Restringe y dibuja a Juanito
  juanito.constrain(width, height);
  juanito.draw();
}

function modelReady() {
  console.log("PoseNet model loaded");
}

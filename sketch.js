let video; // Captura de video
let poseProcessor; // Procesador de poses
let juanito; // Instancia del objeto Juanito
let juanitoImg; // Imagen de Juanito
let avion; // Instancia del avión
let poseNet; // Modelo PoseNet de ml5.js
let cielo, PlazaMayo, canvas;

function preload() {
  // Carga la imagen del cuerpo de Juanito
  juanitoImg = loadImage("images/body.png");
  cielo = loadImage(
    windowWidth <= 1000 ? "images/cieloMovil.webp" : "images/cielo.png"
  );
  PlazaMayo = loadImage(
    windowWidth <= 1000 ? "images/PlazaMayoMovil.webp" : "images/PlazaMayo.webp"
  );
  avion = new Avion("images/avion.png"); // Carga la clase Avion con su imagen
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Pantalla completa del dispositivo

  // Configuración de la captura de video
  video = createCapture({
    video: {
      mandatory: {
        minWidth: 320,
        minHeight: 240,
        maxWidth: 640,
        maxHeight: 480,
      },
    },
    audio: false,
  });
  video.size(windowWidth, windowHeight); // Ajusta la resolución del video capturado
  video.hide(); // Oculta el video para que no se vea directamente en la pantalla

  // Crea una instancia de Juanito
  juanito = new Juanito(width / 2, height / 2, juanitoImg);

  // Inicializa la posición del avión
  avion.init(width / 2, height * 0.4);

  // Inicializa PoseProcessor
  poseNet = ml5.poseNet(video, modelReady);
  poseProcessor = new PoseProcessor(video, poseNet);
  poseProcessor.initializePoseDetection();

  frameRate(30); // Configura un frame rate más bajo para optimizar el rendimiento
}

function draw() {
  background(220); // Fondo gris claro

  // Dibuja el avión
  avion.update(frameCount, height); // Llama a update del avión
  avion.draw(); // Llama a draw del avión

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

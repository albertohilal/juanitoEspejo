let video; // Captura de video
let poseProcessor; // Procesador de poses
let juanito; // Instancia del objeto Juanito
let juanitoImg; // Imagen de Juanito
let avion; // Instancia del avión
let poseNet; // Modelo PoseNet de ml5.js
//let cielo;
let PlazaMayo;
let canvas;
let randomBalas = []; // Array para almacenar balas aleatorias
let balaInterval = 60; // Intervalo de tiempo para generar balas
let balaCounter = 0; // Contador de balas generadas

function preload() {
  // Carga la imagen del cuerpo de Juanito
  juanitoImg = loadImage("images/body.png");
  //cielo = loadImage("images/cielo.webp");
  PlazaMayo = loadImage("images/PlazaMayo.webp");
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
  juanito = new Juanito(width / 2, height, juanitoImg);

  // Inicializa la posición del avión
  avion.init(width * 0.45, height * 0.4);

  // Inicializa PoseProcessor
  poseNet = ml5.poseNet(video, modelReady);
  poseProcessor = new PoseProcessor(video, poseNet);
  poseProcessor.initializePoseDetection();

  frameRate(60); // Configura un frame rate más bajo para optimizar el rendimiento
}

function draw() {
  background(129, 173, 222); // Fondo gris claro
  /*
  // Mostrar dimensiones de la pantalla en la parte superior izquierda
  fill(255,255,0); // Color negro para el texto
  textSize(60); // Tamaño de texto
  text(`width: ${width}px`, 100, 100); // Muestra el ancho
  text(`windowWidth: ${windowWidth}px`, 100, 180); // Muestra el ancho
  text(`Alto: ${height}px`, 100, 260); // Muestra el alto
  */
  //image(cielo, 0, 0, width, height);
  image(
    PlazaMayo,
    windowWidth / 2,
    windowHeight / 2,
    windowWidth,
    windowHeight
  );

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
  juanito.constrain(width / 2, windowHeight + 200);
  juanito.draw();

  // Generación de balas aleatorias
  if (frameCount % balaInterval === 0 && balaCounter < 300) {
    let randomX = random(200, 1500); // Genera una posición aleatoria en X
    randomBalas.push(new Bala(randomX, 0, 5)); // Crea una nueva bala en posición aleatoria
    balaCounter++; // Incrementa el contador de balas
  }

  // Dibuja y actualiza las balas aleatorias
  for (let i = randomBalas.length - 1; i >= 0; i--) {
    randomBalas[i].draw();
    randomBalas[i].update();

    // Elimina las balas que salen de la pantalla
    if (randomBalas[i].y > height) {
      randomBalas.splice(i, 1);
    }
  }
}

function modelReady() {
  console.log("PoseNet model loaded");
}

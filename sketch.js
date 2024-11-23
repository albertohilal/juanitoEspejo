let video; // Captura de video
let poseNet; // Modelo PoseNet de ml5.js
let poses = []; // Arreglo para guardar las poses detectadas
let juanito; // Imagen de Juanito
let juanitoX; // Posición horizontal de Juanito
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

  // Carga el modelo PoseNet con el video como fuente
  poseNet = ml5.poseNet(video, modelReady);

  // Evento para capturar las poses detectadas
  poseNet.on("pose", gotPoses);

  // Inicializa a Juanito en el centro de la pantalla
  juanitoX = width / 2;
  juanitoY = height / 2;
}

function draw() {
  background(220); // Fondo gris claro

  // Dibuja el video capturado (opcional)
  // image(video, 0, 0, width, height);

  // Dibuja la imagen de Juanito en la posición actual
  imageMode(CENTER);
  image(juanito, juanitoX, juanitoY);

  // Procesa las poses detectadas
  if (poses.length > 0) {
    let pose = poses[0].pose; // Primera pose detectada

    // Dibuja los keypoints de interés
    drawKeypoint(pose.keypoints[0], "Nariz"); // Dibuja el keypoint de la nariz
    drawKeypoint(pose.keypoints[5], "Hombro Izq"); // Hombro izquierdo
    drawKeypoint(pose.keypoints[6], "Hombro Der"); // Hombro derecho

    // Dibuja la línea entre los hombros con ancho 10px y color rojo
    /*
    drawLineWithStyle(
      pose.keypoints[5],
      pose.keypoints[6],
      10,
      color(255, 0, 0)
    );
    */

    // Obtén la posición de la nariz
    let noseX = pose.keypoints[0].position.x;

    // Movimiento horizontal inverso según la nariz
    if (noseX < width / 2 - 50) {
      // Si la nariz está a la izquierda del centro
      juanitoX += 15; // Juanito se mueve hacia la derecha
    } else if (noseX > width / 2 + 50) {
      // Si la nariz está a la derecha del centro
      juanitoX -= 15; // Juanito se mueve hacia la izquierda
    }

    // Calcula la distancia entre los hombros
    let leftShoulderX = pose.keypoints[5].position.x; // Coordenada X del hombro izquierdo
    let rightShoulderX = pose.keypoints[6].position.x; // Coordenada X del hombro derecho
    let shoulderDistance = dist(leftShoulderX, 0, rightShoulderX, 0); // Distancia en X entre los hombros

    // Determina la proximidad de Juanito al borde superior o inferior
    if (shoulderDistance > width / 4) {
      // Si la distancia es mayor, Juanito se aproxima al borde superior
      juanitoY -= map(shoulderDistance, width / 4, width / 2, 1, 15); // Velocidad proporcional
    } else if (shoulderDistance < width / 6) {
      // Si la distancia es menor, Juanito se aproxima al borde inferior
      juanitoY += map(shoulderDistance, width / 6, width / 4, 15, 1); // Velocidad proporcional
    }

    // Limita la posición de Juanito dentro de la pantalla
    juanitoX = constrain(juanitoX, 0 + juanito.width / 2, width - juanito.width / 2);
    juanitoY = constrain(juanitoY, 0 + juanito.height / 2, height - juanito.height / 2);
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

// Dibuja una línea entre dos keypoints con estilo personalizado
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

class PoseProcessor {
  constructor(video, poseNet) {
    this.video = video; // Referencia al video
    this.poseNet = poseNet; // Modelo PoseNet
    this.poses = []; // Array para almacenar las poses detectadas
  }

  // Inicializa la detección de poses
  initializePoseDetection() {
    this.poseNet.on("pose", (results) => {
      this.poses = results;
    });
  }

  // Dibuja los keypoints seleccionados
  drawKeypoints(pose) {
    // Define los keypoints que queremos dibujar
    const keypointsToDraw = ["Nariz", "Ojo Izq", "Ojo Der", "Hombro Izq", "Hombro Der"];

    keypointsToDraw.forEach((label) => {
      const keypoint = this.getKeypoint(pose, label);
      if (keypoint && keypoint.score > 0.5) {
        fill(255, 0, 0); // Color rojo
        noStroke();
        // Dibuja reflejando la posición horizontal (x) para coincidir con el video
        const reflectedX = width - keypoint.position.x;
      //  ellipse(reflectedX, keypoint.position.y, 20, 20); // Dibuja el punto
      }
    });

    // Dibuja una línea entre el hombro izquierdo y el derecho
    const leftShoulder = this.getKeypoint(pose, "Hombro Izq");
    const rightShoulder = this.getKeypoint(pose, "Hombro Der");

    if (leftShoulder && rightShoulder) {
      stroke(255, 0, 0); // Color rojo para la línea
      strokeWeight(10); // Grosor de la línea
   /*
      line(
        width - leftShoulder.position.x, leftShoulder.position.y,
        width - rightShoulder.position.x, rightShoulder.position.y
      );*/
    }
  }

  // Obtiene un keypoint específico por su etiqueta
  getKeypoint(pose, label) {
    const keypointsMap = {
      "Nariz": 0,
      "Ojo Izq": 1,
      "Ojo Der": 2,
      "Hombro Izq": 5,
      "Hombro Der": 6,
    };
    const index = keypointsMap[label];
    return pose.keypoints[index] || null;
  }

  // Calcula la distancia entre dos keypoints
  getDistance(keypoint1, keypoint2) {
    return dist(
      keypoint1.position.x,
      keypoint1.position.y,
      keypoint2.position.x,
      keypoint2.position.y
    );
  }
}
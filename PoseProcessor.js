class PoseProcessor {
  constructor(video, poseNet) {
    this.video = video;
    this.poseNet = poseNet;
    this.poses = [];
  }

  initializePoseDetection() {
    this.poseNet.on("pose", (results) => {
      this.poses = results;
      console.log(results); // Muestra los resultados en la consola
    });
    
  }
    

  drawKeypoints(pose) {
    // Dibuja los keypoints individuales
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.5) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 20, 20);
      }
    });

    // Dibuja una línea entre "Hombro Izq" y "Hombro Der"
    const leftShoulder = this.getKeypoint(pose, "Hombro Izq");
    const rightShoulder = this.getKeypoint(pose, "Hombro Der");


      stroke(255, 0, 0); // Color rojo
      strokeWeight(5); // Grosor de la línea
      line(
        leftShoulder.position.x,
        leftShoulder.position.y,
        rightShoulder.position.x,
        rightShoulder.position.y
      );
    
  }


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

  getDistance(keypoint1, keypoint2) {
    return dist(
      keypoint1.position.x,
      keypoint1.position.y,
      keypoint2.position.x,
      keypoint2.position.y
    );
  }
}

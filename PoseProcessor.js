class PoseProcessor {
    constructor(video, poseNet) {
      this.video = video;
      this.poseNet = poseNet;
      this.poses = [];
    }
  
    initializePoseDetection() {
      this.poseNet.on("pose", (results) => {
        this.poses = results;
      });
    }
  
    drawKeypoints(pose) {
      pose.keypoints.forEach((keypoint) => {
        if (keypoint.score > 0.5) {
          fill(255, 0, 0);
          noStroke();
          ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        }
      });
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
  
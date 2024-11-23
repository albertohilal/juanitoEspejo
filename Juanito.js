class Juanito {
    constructor(x, y, img) {
      this.x = x;
      this.y = y;
      this.img = img;
      this.speedX = 15;
      this.speedY = 15;
    }
  
    draw() {
      imageMode(CENTER);
      image(this.img, this.x, this.y);
    }
  
    moveWithNose(noseX, centerX) {
      if (noseX < centerX - 50) {
        this.x += this.speedX;
      } else if (noseX > centerX + 50) {
        this.x -= this.speedX;
      }
    }
  
    moveWithShoulders(shoulderDistance, maxDist, minDist) {
      if (shoulderDistance > maxDist) {
        this.y -= map(shoulderDistance, maxDist, maxDist * 1.5, 1, this.speedY);
      } else if (shoulderDistance < minDist) {
        this.y += map(shoulderDistance, minDist, maxDist, this.speedY, 1);
      }
    }
  
    constrain(canvasWidth, canvasHeight) {
      this.x = constrain(this.x, 0 + this.img.width / 2, canvasWidth - this.img.width / 2);
      this.y = constrain(this.y, 0 + this.img.height / 2, canvasHeight - this.img.height / 2);
    }
  }
  
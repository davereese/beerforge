import Sketch from 'sketch-js';

const sketch = Sketch.create({
  autopause: false,
  fullscreen: false,
  width: document.body.clientWidth,
  height: 2000,
});
const particles = [];
const particleCount = 100;
sketch.strokeStyle = 'rgba(233, 102, 44, 0)';
sketch.globalCompositeOperation = 'lighter';

// Particle Constructor
export const Particle = function() {
  // eslint-disable-next-line no-undef
  this.x = random( window.innerWidth );
  // eslint-disable-next-line no-undef
  this.y = random( window.innerHeight, window.innerHeight * 2 );
  this.vx = 0;
  // eslint-disable-next-line no-undef
  this.vy = -random( 1, 10 ) / 5;
  // eslint-disable-next-line no-undef
  this.radius = (this.baseRadius = random(1, 2.5));
  this.maxRadius = 2.5;
  this.threshold = 300;
  // eslint-disable-next-line no-undef
  return this.hue = random( 180, 240 );
};

// Particle Prototype
Particle.prototype = {
  update() {
    // Adjust Velocity
    // eslint-disable-next-line no-undef
    this.vx += ( random( -5, 5 ) ) / 1000;
    // eslint-disable-next-line no-undef
    this.vy -= random( 1, 20 ) / 10000;

    // Apply Velocity
    this.x += this.vx;
    this.y += this.vy;

    // Check Bounds
    if ((this.x < - this.maxRadius) || (this.x > (window.innerWidth + this.maxRadius)) || (this.y < - this.maxRadius)) {
      // eslint-disable-next-line no-undef
      this.x = random( window.innerWidth );
      // eslint-disable-next-line no-undef
      this.y = random( sketch.height + this.maxRadius, sketch.height * 2 );
      this.vx = 0;
      // eslint-disable-next-line no-undef
      return this.vy = -random( 1, 10 ) / 5;
    }
  },
  render() {
    sketch.beginPath();
    sketch.arc( this.x, this.y, this.radius, 0, 2 * Math.PI );
    sketch.closePath();
    sketch.fillStyle = 'rgba(233, 102, 44, 0.7)';
    return sketch.fill();
    //  sketch.stroke();
  }
};

// Create Particles
let z = particleCount;
while (z--) {
  particles.push( new Particle() );
}

// Sketch Clear
sketch.clear = () => sketch.clearRect( 0, 0, window.innerWidth, sketch.height );

// Sketch Update
sketch.update = function() {
  let i = particles.length;
  return (() => {
    const result = [];
    while (i--) {
      result.push(particles[ i ].update());
    }
    return result;
  })();
};

// Sketch Draw
sketch.draw = function() {
  let i = particles.length;
  return (() => {
    const result = [];
    while (i--) {
      result.push(particles[ i ].render());
    }
    return result;
  })();
};

export default sketch;
/* ============================================================
   particles.js
   Carles: sistema de partículas basado en el patrón del capítulo 4
   "Particle Systems" de The Nature of Code de Daniel Shiffman
   (https://natureofcode.com/particles/). La idea es un array de
   objetos con position, velocity, acceleration y lifespan, que se
   actualizan cada frame y se descartan al morir.
   He adaptado tres variantes para los niveles de apertura de boca:
     - LEVEL_LOW: chispa de calabaza (apertura breve)
     - LEVEL_MID: murciélago/espuma (apertura mantenida)
     - LEVEL_HIGH: anillo de calabazas (apertura prolongada)
   ============================================================ */

export const LEVEL_LOW  = 'low';
export const LEVEL_MID  = 'mid';
export const LEVEL_HIGH = 'high';

// Carles: limito el número de partículas para evitar que la app se bloquee.
// Lo probé con 500 y bajaban los FPS; con 300 va fluido en portátiles medios.
const MAX_PARTICLES = 300;

// Paleta Halloween coherente con el CSS.
const PALETTE = {
  orange:  [255, 117, 24],
  pumpkin: [255, 177, 96],
  purple:  [142, 68, 255],
  slime:   [57, 255, 20],
  ghost:   [243, 234, 253],
};

export class ParticleSystem {
  constructor(p5instance) {
    this.p = p5instance;
    this.particles = [];
    this.ringAngle = 0; // para el efecto "anillo de calabazas"
  }

  // Lanza partículas desde (x,y) según el nivel actual.
  // scale es un multiplicador de tamaño (p.ej. basado en el ancho de la boca).
  emit(x, y, level, scale = 1) {
    if (this.particles.length >= MAX_PARTICLES) return;

    switch (level) {
      case LEVEL_LOW:  this.emitSparks(x, y, 2, scale); break;
      case LEVEL_MID:  this.emitSparks(x, y, 4, scale);
                       this.emitBats(x, y, scale); break;
      case LEVEL_HIGH: this.emitSparks(x, y, 6, scale);
                       this.emitBats(x, y, scale);
                       this.emitRing(x, y, scale); break;
    }
  }

  emitSparks(x, y, count, scale) {
    const p = this.p;
    for (let i = 0; i < count; i++) {
      // Carles: random2D() da un vector unitario aleatorio.
      // random(1,4) le da velocidad distinta a cada partícula.
      const vel = p.createVector(
        p.random(-1, 1),
        p.random(-3, -1) // ligero sesgo hacia arriba (como chispas)
      );
      this.particles.push(new Particle(p, {
        x, y,
        vx: vel.x,
        vy: vel.y,
        size: p.random(6, 14) * scale,
        color: p.random() < 0.5 ? PALETTE.orange : PALETTE.pumpkin,
        lifespan: 60,
        shape: 'spark',
        gravity: 0.08,
      }));
    }
  }

  emitBats(x, y, scale) {
    const p = this.p;
    if (p.random() < 0.3) { // no en cada frame, para no saturar
      this.particles.push(new Particle(p, {
        x, y,
        vx: p.random(-2, 2),
        vy: p.random(-4, -2),
        size: p.random(20, 30) * scale,
        color: PALETTE.purple,
        lifespan: 90,
        shape: 'bat',
        gravity: 0.02,
      }));
    }
  }

  // El anillo gira constantemente alrededor del centro cuando se mantiene la boca.
  emitRing(x, y, scale) {
    const p = this.p;
    this.ringAngle += 0.08;
    const r = 80 * scale;
    for (let k = 0; k < 2; k++) {
      const a = this.ringAngle + k * Math.PI;
      this.particles.push(new Particle(p, {
        x: x + Math.cos(a) * r,
        y: y + Math.sin(a) * r,
        vx: Math.cos(a) * 0.5,
        vy: Math.sin(a) * 0.5,
        size: p.random(16, 24) * scale,
        color: PALETTE.slime,
        lifespan: 40,
        shape: 'pumpkin',
        gravity: 0,
      }));
    }
  }

  update() {
    // Recorro al revés para poder borrar sin romper el índice.
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isDead()) this.particles.splice(i, 1);
    }
  }

  draw() {
    for (const particle of this.particles) particle.draw();
  }

  clear() {
    this.particles.length = 0;
  }

  get count() { return this.particles.length; }
}

// Carles: una partícula individual. Guardo p5 por referencia para no depender
// de que las funciones sean globales (que en p5 2.x en modo instancia no lo son).
class Particle {
  constructor(p5instance, opts) {
    this.p = p5instance;
    this.pos = p5instance.createVector(opts.x, opts.y);
    this.vel = p5instance.createVector(opts.vx, opts.vy);
    this.acc = p5instance.createVector(0, opts.gravity);
    this.size = opts.size;
    this.color = opts.color;
    this.lifespan = opts.lifespan;
    this.maxLife = opts.lifespan;
    this.shape = opts.shape;
    this.rotation = p5instance.random(this.p.TWO_PI);
    this.rotSpeed = p5instance.random(-0.1, 0.1);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.rotation += this.rotSpeed;
    this.lifespan -= 1;
  }

  isDead() { return this.lifespan <= 0; }

  draw() {
    const p = this.p;
    const alpha = p.map(this.lifespan, 0, this.maxLife, 0, 255);
    p.push();
    p.translate(this.pos.x, this.pos.y);
    p.rotate(this.rotation);
    p.noStroke();
    p.fill(this.color[0], this.color[1], this.color[2], alpha);

    switch (this.shape) {
      case 'spark':   this.drawSpark(p); break;
      case 'bat':     this.drawBat(p); break;
      case 'pumpkin': this.drawPumpkin(p); break;
    }
    p.pop();
  }

  drawSpark(p) {
    // Chispa en forma de estrella de 4 puntas.
    p.beginShape();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? this.size : this.size * 0.4;
      const a = (p.TWO_PI / 8) * i;
      p.vertex(Math.cos(a) * r, Math.sin(a) * r);
    }
    p.endShape(p.CLOSE);
  }

  drawBat(p) {
    // Silueta sencilla de murciélago (cuerpo + 2 alas triangulares).
    const s = this.size;
    p.ellipse(0, 0, s * 0.5, s * 0.4);
    p.triangle(-s * 0.1, 0, -s, -s * 0.3, -s * 0.3, s * 0.1);
    p.triangle( s * 0.1, 0,  s, -s * 0.3,  s * 0.3, s * 0.1);
  }

  drawPumpkin(p) {
    // Calabaza esquemática: 3 elipses + rabito.
    const s = this.size;
    p.fill(this.color[0], this.color[1], this.color[2], p.map(this.lifespan, 0, this.maxLife, 0, 220));
    p.ellipse(-s * 0.25, 0, s * 0.6, s * 0.9);
    p.ellipse( s * 0.25, 0, s * 0.6, s * 0.9);
    p.ellipse(0, 0, s * 0.8, s);
    p.fill(80, 40, 0, p.map(this.lifespan, 0, this.maxLife, 0, 220));
    p.rect(-s * 0.08, -s * 0.55, s * 0.16, s * 0.2);
  }
}

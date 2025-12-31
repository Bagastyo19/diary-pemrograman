const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const colors = ['#a020f0', '#ffd700', '#ff0000', '#00ff00']; // ungu, emas, merah, hijau

class Firework {
    constructor(x, y, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.color = color;
        this.speed = 5;
        this.exploded = false;
        this.particles = [];
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.exploded = true;
                this.explode();
            }
        } else {
            this.particles.forEach(p => p.update());
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        } else {
            this.particles.forEach(p => p.draw());
        }
    }

  explode() {
    const total = 100;
    for (let i = 0; i < total; i++) {
        const angle = (Math.PI * 2) * (i / total); // Sudut terdistribusi merata
        const speed = Math.random() * 3 + 2;
        this.particles.push(new Particle(this.x, this.y, this.color, angle, speed));
    }
}

    isDone() {
        return this.exploded && this.particles.every(p => p.alpha <= 0);
    }
}

class Particle {
    constructor(x, y, color, angle, speed) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.angle = angle;
        this.speed = speed;
        this.friction = 0.95;
        this.gravity = 0.05;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.003;
        this.color = color;
    }

    update() {
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

const fireworks = [];

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.05) {
        const x = Math.random() * canvas.width;
        const targetY = Math.random() * canvas.height / 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        fireworks.push(new Firework(x, canvas.height, targetY, color));
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        if (fireworks[i].isDone()) {
            fireworks.splice(i, 1);
        }
    }
}

animate();

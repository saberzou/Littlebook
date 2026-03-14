'use strict';

class GravityClock {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.bodies = [];
        this.animId = null;
        this.lastSecondCheck = -1;
        this.nextDrop = 1; // next number to drop (1-60)
        this.dpr = window.devicePixelRatio || 1;

        // Responsive sizing
        this.resize();
        this._resizeHandler = () => this.resize();
        window.addEventListener('resize', this._resizeHandler);
    }

    resize() {
        const isMobile = window.innerWidth <= 480;
        const cssSize = isMobile ? 280 : 360;
        this.canvas.style.width = cssSize + 'px';
        this.canvas.style.height = cssSize + 'px';
        this.canvas.width = cssSize * this.dpr;
        this.canvas.height = cssSize * this.dpr;
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

        this.size = cssSize;
        this.cx = cssSize / 2;
        this.cy = cssSize / 2;
        this.clockRadius = isMobile ? 130 : 168;
        this.pillRadius = isMobile ? 10 : 12;
    }

    get isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    get colors() {
        return this.isDark ? {
            face: '#2A2721',
            border: 'none',
            pill: null, // use random from pillColors
            pillText: '#FFFFFF',
            hourHand: '#E0D8CC',
            minuteHand: '#E0D8CC',
            secondHand: '#D9A48B',
            center: '#D9A48B',
            tick: '#5A5347',
        } : {
            face: '#FFFFFF',
            border: 'none',
            pill: null, // use random from pillColors
            pillText: '#FFFFFF',
            hourHand: '#5C4F3D',
            minuteHand: '#5C4F3D',
            secondHand: '#D9A48B',
            center: '#D9A48B',
            tick: '#C4B9A8',
        };
    }

    init() {
        this.bodies = [];
        const now = new Date();
        const currentSecond = now.getSeconds(); // 0-59

        // Pre-spawn pills 1..currentSecond at random positions in lower half (already fell)
        for (let i = 1; i <= currentSecond; i++) {
            const body = this._makeBody(i);
            // Random position in lower half of clock
            const angle = Math.random() * Math.PI; // 0 to PI = lower semicircle
            const maxR = this.clockRadius - this.pillRadius - 5;
            const dist = Math.random() * maxR * 0.7;
            body.x = this.cx + (Math.random() - 0.5) * maxR * 0.8;
            body.y = this.cy + Math.abs(dist) * 0.4 + this.clockRadius * 0.15;
            body.vx = 0;
            body.vy = 0;
            body.angularVel = 0;
            body.rotation = (Math.random() - 0.5) * 0.5;
            this.bodies.push(body);
        }

        this.nextDrop = currentSecond + 1; // next one to drop
        this.lastSecondCheck = currentSecond;
        this.start();
    }

    // Quote card palette colors for pills
    static PILL_COLORS = ['#D9A48B', '#CC7F4E', '#B8A0B0', '#7BC4D9', '#8B8B6E', '#D4C9A1'];

    _makeBody(number) {
        const color = GravityClock.PILL_COLORS[Math.floor(Math.random() * GravityClock.PILL_COLORS.length)];
        return {
            number,
            radius: this.pillRadius,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            rotation: 0,
            angularVel: 0,
            color,
        };
    }

    dropNumber(number) {
        const body = this._makeBody(number);
        body.x = this.cx + (Math.random() - 0.5) * 30;
        body.y = this.cy - this.clockRadius + this.pillRadius + 5;
        body.vx = (Math.random() - 0.5) * 3;
        body.vy = 1;
        body.angularVel = (Math.random() - 0.5) * 0.15;
        this.bodies.push(body);
    }

    resetCycle() {
        this.bodies = [];
        this.nextDrop = 1;
    }

    start() {
        if (this.animId) return;
        const loop = () => {
            this.update();
            this.draw();
            this.animId = requestAnimationFrame(loop);
        };
        this.animId = requestAnimationFrame(loop);
    }

    stop() {
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
        window.removeEventListener('resize', this._resizeHandler);
    }

    update() {
        const now = new Date();
        const currentSecond = now.getSeconds(); // 0-59

        if (currentSecond !== this.lastSecondCheck) {
            if (currentSecond === 0) {
                // New minute — reset
                this.resetCycle();
            } else if (currentSecond >= this.nextDrop) {
                // Drop all numbers from nextDrop to currentSecond
                for (let s = this.nextDrop; s <= currentSecond; s++) {
                    if (s <= 60) this.dropNumber(s);
                }
                this.nextDrop = currentSecond + 1;
            }
            this.lastSecondCheck = currentSecond;
        }

        const gravity = 0.15;
        const restitution = 0.3;
        const velDamp = 0.98;
        const angDamp = 0.95;
        const boundary = this.clockRadius - 3;

        for (const b of this.bodies) {
            b.vy += gravity;
            b.vx *= velDamp;
            b.vy *= velDamp;
            b.angularVel *= angDamp;

            b.x += b.vx;
            b.y += b.vy;
            b.rotation += b.angularVel;

            // Circular boundary
            const dx = b.x - this.cx;
            const dy = b.y - this.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = boundary - b.radius;

            if (dist > maxDist) {
                const nx = dx / dist;
                const ny = dy / dist;
                b.x = this.cx + nx * maxDist;
                b.y = this.cy + ny * maxDist;

                const dot = b.vx * nx + b.vy * ny;
                b.vx -= (1 + restitution) * dot * nx;
                b.vy -= (1 + restitution) * dot * ny;

                const tangentSpeed = -b.vx * ny + b.vy * nx;
                b.angularVel += tangentSpeed * 0.01;
            }
        }

        // Circle-circle collisions
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                const a = this.bodies[i];
                const b = this.bodies[j];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = a.radius + b.radius;

                if (dist < minDist && dist > 0.01) {
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const overlap = minDist - dist;

                    a.x -= nx * overlap * 0.5;
                    a.y -= ny * overlap * 0.5;
                    b.x += nx * overlap * 0.5;
                    b.y += ny * overlap * 0.5;

                    const dvx = a.vx - b.vx;
                    const dvy = a.vy - b.vy;
                    const dvn = dvx * nx + dvy * ny;

                    if (dvn > 0) {
                        const impulse = dvn * (1 + restitution) * 0.5;
                        a.vx -= impulse * nx;
                        a.vy -= impulse * ny;
                        b.vx += impulse * nx;
                        b.vy += impulse * ny;

                        const tangent = -dvx * ny + dvy * nx;
                        a.angularVel -= tangent * 0.005;
                        b.angularVel += tangent * 0.005;
                    }
                }
            }
        }
    }

    draw() {
        const ctx = this.ctx;
        const c = this.colors;

        ctx.clearRect(0, 0, this.size, this.size);

        // Clock face
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.clockRadius, 0, Math.PI * 2);
        ctx.fillStyle = c.face;
        ctx.fill();

        // Hour tick marks
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const inner = this.clockRadius - 12;
            const outer = this.clockRadius - 5;
            ctx.beginPath();
            ctx.moveTo(this.cx + Math.cos(angle) * inner, this.cy + Math.sin(angle) * inner);
            ctx.lineTo(this.cx + Math.cos(angle) * outer, this.cy + Math.sin(angle) * outer);
            ctx.strokeStyle = c.tick;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw bodies
        for (const body of this.bodies) {
            this.drawBody(body);
        }

        // Clock hands on top
        this.drawClockHands();
    }

    drawBody(body) {
        const ctx = this.ctx;
        const c = this.colors;

        ctx.save();
        ctx.translate(body.x, body.y);
        ctx.rotate(body.rotation);

        // Shadow
        ctx.shadowColor = 'rgba(0,0,0,0.12)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;

        // Pill circle
        ctx.beginPath();
        ctx.arc(0, 0, body.radius, 0, Math.PI * 2);
        ctx.fillStyle = body.color;
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Number text
        ctx.fillStyle = c.pillText;
        ctx.font = `bold 10px 'Geist', system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(body.number, 0, 1);

        ctx.restore();
    }

    drawClockHands() {
        const ctx = this.ctx;
        const c = this.colors;
        const now = new Date();
        const h = now.getHours() % 12;
        const m = now.getMinutes();
        const s = now.getSeconds();
        const ms = now.getMilliseconds();

        const smoothS = s + ms / 1000;
        const smoothM = m + smoothS / 60;
        const smoothH = h + smoothM / 60;

        // Hour hand
        const hourAngle = (smoothH / 12) * Math.PI * 2 - Math.PI / 2;
        const hourLen = this.clockRadius * 0.5;
        this.drawHand(hourAngle, hourLen, 5, c.hourHand);

        // Minute hand
        const minAngle = (smoothM / 60) * Math.PI * 2 - Math.PI / 2;
        const minLen = this.clockRadius * 0.7;
        this.drawHand(minAngle, minLen, 3, c.minuteHand);

        // Second hand
        const secAngle = (smoothS / 60) * Math.PI * 2 - Math.PI / 2;
        const secLen = this.clockRadius * 0.78;
        this.drawHand(secAngle, secLen, 1.5, c.secondHand);

        // Center dot
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, 5, 0, Math.PI * 2);
        ctx.fillStyle = c.center;
        ctx.fill();
    }

    drawHand(angle, length, width, color) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(this.cx, this.cy);
        ctx.lineTo(
            this.cx + Math.cos(angle) * length,
            this.cy + Math.sin(angle) * length
        );
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}

'use strict';

class GravityClock {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.bodies = [];
        this.animId = null;
        this.lastHourCheck = -1;
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
        this.pillRadius = isMobile ? 14 : 18;
    }

    get isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    get colors() {
        return this.isDark ? {
            face: '#2A2721',
            border: '#5A5347',
            pill: '#3A352D',
            pillText: '#E0D8CC',
            hourHand: '#E0D8CC',
            minuteHand: '#E0D8CC',
            secondHand: '#D9A48B',
            center: '#D9A48B',
            tick: '#5A5347',
        } : {
            face: '#E8EDE9',
            border: '#8B7D6B',
            pill: '#FFFFFF',
            pillText: '#5C4F3D',
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
        const currentHour = now.getHours(); // 0-23

        for (let i = 1; i <= 24; i++) {
            const dropped = i <= currentHour;
            const body = {
                number: i,
                radius: this.pillRadius,
                rotation: 0,
                angularVel: 0,
                dropped: dropped,
                settled: false,
            };

            if (dropped) {
                // Random position inside clock, biased toward bottom
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * (this.clockRadius - this.pillRadius * 3);
                body.x = this.cx + Math.cos(angle) * dist * 0.5;
                body.y = this.cy + Math.abs(Math.sin(angle)) * dist * 0.3 + this.clockRadius * 0.2;
                body.vx = (Math.random() - 0.5) * 2;
                body.vy = (Math.random() - 0.5) * 2;
                body.angularVel = (Math.random() - 0.5) * 0.1;
            } else {
                // Queued at top — arranged in an arc
                const queueIdx = i - currentHour - 1;
                const total = 24 - currentHour;
                const spread = Math.min(total, 12);
                const angleStep = Math.PI * 0.6 / Math.max(spread, 1);
                const startAngle = -Math.PI / 2 - (spread - 1) * angleStep / 2;
                const a = startAngle + queueIdx * angleStep;
                const r = this.clockRadius - this.pillRadius - 4;
                body.x = this.cx + Math.cos(a) * r;
                body.y = this.cy + Math.sin(a) * r;
                body.vx = 0;
                body.vy = 0;
            }

            this.bodies.push(body);
        }

        this.lastHourCheck = currentHour;
        this.start();
    }

    dropNumber(body) {
        body.dropped = true;
        body.x = this.cx + (Math.random() - 0.5) * 30;
        body.y = this.cy - this.clockRadius + this.pillRadius + 5;
        body.vx = (Math.random() - 0.5) * 3;
        body.vy = 1;
        body.angularVel = (Math.random() - 0.5) * 0.15;
        body.settled = false;
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
        // Check for new hour
        const now = new Date();
        const currentHour = now.getHours();
        if (currentHour !== this.lastHourCheck) {
            // Drop newly passed hours
            for (let h = this.lastHourCheck + 1; h <= currentHour; h++) {
                const body = this.bodies.find(b => b.number === h);
                if (body && !body.dropped) {
                    this.dropNumber(body);
                }
            }
            this.lastHourCheck = currentHour;
        }

        const gravity = 0.15;
        const restitution = 0.3;
        const velDamp = 0.98;
        const angDamp = 0.95;
        const boundary = this.clockRadius - 3; // inner boundary

        const dropped = this.bodies.filter(b => b.dropped);

        for (const b of dropped) {
            // Gravity
            b.vy += gravity;

            // Damping
            b.vx *= velDamp;
            b.vy *= velDamp;
            b.angularVel *= angDamp;

            // Move
            b.x += b.vx;
            b.y += b.vy;
            b.rotation += b.angularVel;

            // Circular boundary collision
            const dx = b.x - this.cx;
            const dy = b.y - this.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = boundary - b.radius;

            if (dist > maxDist) {
                // Push back inside
                const nx = dx / dist;
                const ny = dy / dist;
                b.x = this.cx + nx * maxDist;
                b.y = this.cy + ny * maxDist;

                // Reflect velocity
                const dot = b.vx * nx + b.vy * ny;
                b.vx -= (1 + restitution) * dot * nx;
                b.vy -= (1 + restitution) * dot * ny;

                // Angular from friction
                const tangentSpeed = -b.vx * ny + b.vy * nx;
                b.angularVel += tangentSpeed * 0.01;
            }
        }

        // Circle-circle collisions
        for (let i = 0; i < dropped.length; i++) {
            for (let j = i + 1; j < dropped.length; j++) {
                const a = dropped[i];
                const b = dropped[j];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = a.radius + b.radius;

                if (dist < minDist && dist > 0.01) {
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const overlap = minDist - dist;

                    // Separate
                    a.x -= nx * overlap * 0.5;
                    a.y -= ny * overlap * 0.5;
                    b.x += nx * overlap * 0.5;
                    b.y += ny * overlap * 0.5;

                    // Relative velocity along normal
                    const dvx = a.vx - b.vx;
                    const dvy = a.vy - b.vy;
                    const dvn = dvx * nx + dvy * ny;

                    if (dvn > 0) {
                        const impulse = dvn * (1 + restitution) * 0.5;
                        a.vx -= impulse * nx;
                        a.vy -= impulse * ny;
                        b.vx += impulse * nx;
                        b.vy += impulse * ny;

                        // Angular transfer
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
        ctx.lineWidth = 3;
        ctx.strokeStyle = c.border;
        ctx.stroke();

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

        // Draw queued (non-dropped) bodies first (behind hands)
        for (const body of this.bodies) {
            if (!body.dropped) this.drawBody(body);
        }

        // Draw dropped bodies
        for (const body of this.bodies) {
            if (body.dropped) this.drawBody(body);
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
        ctx.fillStyle = body.dropped ? c.pill : (this.isDark ? '#3A352D' : '#F5F5F0');
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Number text
        ctx.fillStyle = c.pillText;
        ctx.font = `bold ${body.radius * 0.85}px 'Geist', system-ui, sans-serif`;
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

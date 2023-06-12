const MAX_SPEED = 8.2;
const MIN_SPEED = 0.8;

const SCALE_BIG = 0.807;
const SCALE_SMALL = 0.704;

const SCALE_BIG_MIN = 0.878;
const SCALE_SMALL_MIN = 0.926;

function rotateZ(x, y, angle, originX, originY) {
    x -= originX;
    y -= originY;
    let X = x * Math.cos(angle) - y * Math.sin(angle);
    let Y = y * Math.cos(angle) + x * Math.sin(angle);
    x = X + originX;
    y = Y + originY;
    return [x, y];
}

class BlobDrawable {
    constructor(n) {
        this.maxRadius = 10;
        this.minRadius = 0;

        this.cubicBezierK = 1.0;
        this.N = n;
        this.L = (4.0 / 3.0) * Math.tan(Math.PI / (2 * this.N));
        this.radius = new Array(n);
        this.angle = new Array(n);

        this.radiusNext = new Array(n);
        this.angleNext = new Array(n);
        this.progress = new Array(n);
        this.speed = new Array(n);

        this.pointStart = new Array(4);
        this.pointEnd = new Array(4);

        for (let i = 0; i < this.N; i++) {
            this.generateBlob(this.radius, this.angle, i);
            this.generateBlob(this.radiusNext, this.angleNext, i);
            this.progress[i] = 0;
        }
    }

    generateBlob(radius, angle, i) {
        const { maxRadius, minRadius, speed, N } = this;

        const angleDif = 2 * Math.PI / N * 0.05;
        const radDif = maxRadius - minRadius;
        radius[i] = minRadius + Math.random() * radDif;
        angle[i] = 2 * Math.PI / N * i + Math.random() * angleDif;
        speed[i] = 0.017 + 0.003 * Math.random();
    }

    update(amplitude, speedScale) {
        const { N, progress, speed, radius, radiusNext, angle, angleNext } = this;
        for (let i = 0; i < N; i++) {
            progress[i] += (speed[i] * MIN_SPEED) + amplitude * speed[i] * MAX_SPEED * speedScale;
            if (progress[i] >= 1.0) {
                progress[i] = 0.0;
                radius[i] = radiusNext[i];
                angle[i] = angleNext[i];
                this.generateBlob(radiusNext, angleNext, i);
            }
        }
    }

    draw(cX, cY, ctx, paint) {
        if (ctx) {
            ctx.beginPath();
            const { radius, radiusNext, angle, angleNext, N, L, cubicBezierK, pointStart, pointEnd } = this;
            for (let i = 0; i < N; i++) {
                const progress = this.progress[i];
                const nextIndex = i + 1 < N ? i + 1 : 0;
                const progressNext = this.progress[nextIndex];
                const r1 = radius[i] * (1.0 - progress) + radiusNext[i] * progress;
                const r2 = radius[nextIndex] * (1.0 - progressNext) + radiusNext[nextIndex] * progressNext;
                const angle1 = angle[i] * (1.0 - progress) + angleNext[i] * progress;
                const angle2 = angle[nextIndex] * (1.0 - progressNext) + angleNext[nextIndex] * progressNext;
                const l = L * (Math.min(r1, r2) + (Math.max(r1, r2) - Math.min(r1, r2)) / 2) * cubicBezierK;
                pointStart[0] = cX;
                pointStart[1] = cY - r1;
                pointStart[2] = cX + l;
                pointStart[3] = cY - r1;
                this.mapPoints(pointStart, cX, cY, angle1);
                pointEnd[0] = cX;
                pointEnd[1] = cY - r2;
                pointEnd[2] = cX - l;
                pointEnd[3] = cY - r2;
                this.mapPoints(pointEnd, cX, cY, angle2);
                if (i === 0) {
                    ctx.moveTo(pointStart[0], pointStart[1]);
                }
                ctx.bezierCurveTo(
                    pointStart[2], pointStart[3],
                    pointEnd[2], pointEnd[3],
                    pointEnd[0], pointEnd[1]
                );
            }
            ctx.fillStyle = paint;
            ctx.fill();
            ctx.closePath();
        }
    }

    mapPoints(points, cX, cY, angle) {
        const result1 = rotateZ(points[0], points[1], angle, cX, cY);
        const result2 = rotateZ(points[2], points[3], angle, cX, cY);
        points[0] = result1[0];
        points[1] = result1[1];
        points[2] = result2[0];
        points[3] = result2[1];
    }

    generateInitBlob() {
        const { radius, radiusNext, angle, angleNext, progress, N } = this;
        for (let i = 0; i < N; i++) {
            this.generateBlob(radius, angle, i);
            this.generateBlob(radiusNext, angleNext, i);
            progress[i] = 0;
        }
    }
}

class OvershootInterpolator {
    constructor(tension) {
        this.mTension = tension;
    }

    getInterpolation(t) {
        t -= 1.0;
        return t * t * ((this.mTension + 1) * t + this.mTension) + 1.0;
    }
}
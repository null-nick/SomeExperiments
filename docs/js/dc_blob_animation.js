class BlobAnimation extends HTMLElement {
    constructor() {
        super();
        this.colorKey1 = this.innerHTML;
        this.innerHTML = "";
        this.style.display = "block"
        this.canvasElement = document.createElement("CANVAS");
        this.canvasElement.style.width = "100%";
        this.canvasElement.style.height = "100%";
        this.canvasElement.width = 100;
        this.canvasElement.height = 100;
        this.appendChild(this.canvasElement);
        this.overshootInterpolator = new OvershootInterpolator(1.5);
        this.tinyWaveDrawable = new BlobDrawable(9);
        this.bigWaveDrawable = new BlobDrawable(12);
        this.isInitiated = false;
        this.draw();
    }

    draw = () => {
        let canvas = this.canvasElement.getContext("2d");
        canvas.imageSmoothingEnabled = true;
        let measuredWidth = canvas.canvas.width;
        let measuredHeight = canvas.canvas.height;
        canvas.clearRect(0, 0, measuredWidth, measuredHeight);
        canvas.resetTransform();
        let showWavesProgressInterpolated = this.overshootInterpolator.getInterpolation(1);
        showWavesProgressInterpolated = 0.4 + 0.6 * showWavesProgressInterpolated;
        let amplitude = 0;
        let s1 = Math.round(((measuredWidth >> 1) * 90) / 100);
        let s2 = Math.round((s1 * 86.11) / 100);
        let sl1 = Math.round((s1 * 85) / 100);
        let sl2 = Math.round((sl1 * 86.11) / 100);
        let sC = Math.round((sl2 * 88) / 100);
        if (!this.isInitiated) {
            this.isInitiated = true;
            this.tinyWaveDrawable.minRadius = sl2;
            this.tinyWaveDrawable.maxRadius = sl1;
            this.tinyWaveDrawable.generateInitBlob();

            this.bigWaveDrawable.minRadius = s2;
            this.bigWaveDrawable.maxRadius = s1;
            this.bigWaveDrawable.generateInitBlob();
        }

        this.bigWaveDrawable.update(amplitude, 1);
        this.tinyWaveDrawable.update(amplitude, 1);

        for (let i = 0; i < 2; i++) {
            let cx = measuredWidth >> 1;
            let cy = measuredHeight >> 1;
            let w = Math.round((measuredWidth * 75) / 100);
            const paint = canvas.createRadialGradient(w, w, 0, w, w, w);
            paint.addColorStop(0, this.colorKey1 + '4a');
            paint.addColorStop(1, this.colorKey1 + '4a');

            if (i === 1) {
                canvas.rect(0,0, canvas.canvas.width, canvas.canvas.width);
                canvas.fillStyle = this.getRadialPaint(canvas);
                canvas.fill();
                canvas.rect(0,0, canvas.canvas.width, canvas.canvas.width);
                canvas.fillStyle = this.getRadialPaint(canvas);
                canvas.fill();
            }

            canvas.save();
            let scale = SCALE_BIG_MIN + SCALE_BIG * amplitude * showWavesProgressInterpolated;
            canvas.scale(scale, scale);
            canvas.translate(cx - ((measuredWidth * scale) >> 1), cy - ((measuredHeight * scale) >> 1));
            this.bigWaveDrawable.draw(cx, cy, canvas, paint);
            canvas.restore();

            canvas.save();
            scale = SCALE_SMALL_MIN + SCALE_SMALL * amplitude * showWavesProgressInterpolated;
            canvas.scale(scale, scale);
            canvas.translate(cx - ((measuredWidth * scale) >> 1), cy - ((measuredHeight * scale) >> 1));
            this.tinyWaveDrawable.draw(cx, cy, canvas, paint);
            canvas.restore();

            canvas.beginPath();
            canvas.arc(cx, cy, sC, 0, 2 * Math.PI);
            canvas.fillStyle = this.colorKey1;
            canvas.fill();
            canvas.closePath();
        }
        requestAnimationFrame(() => this.draw());
    }

    getRadialPaint(canvas) {
        let w = canvas.canvas.width >> 1;
        const gradient = canvas.createRadialGradient(w, w, 0, w, w, w);
        gradient.addColorStop(0, this.colorKey1 + '30');
        gradient.addColorStop(1, this.colorKey1 + '00');
        return gradient;
    }
}
customElements.define('blob-animation', BlobAnimation);
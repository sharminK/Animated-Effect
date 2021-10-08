let canvas;
let ctx;
let folwField;
let folwFieldAnimation;

window.onload = function () {
    canvas = document.getElementById('canvas1');
    ctx = canvas.getContext('2d'); //canvas 2d drawing api
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    folwField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    folwField.animate(0);
    console.log('loaded');
}

window.addEventListener('reset', function () {
    this.cancelAnimationFrame(folwFieldAnimation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    folwField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    folwField.animate();
});

const mouse = {
    x: 0,
    y: 0,
}
window.addEventListener('mousemove', function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
})

class FlowFieldEffect {
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#ctx.lineWidth = 1;
        this.#width = width;
        this.#height = height;
        this.lastTime = 0;
        this.interval = 1000 / 60;
        this.timer = 0; //counter
        this.cellSize = 15;
        this.gradient;
        this.#createGradient();
        this.#ctx.strokeStyle = this.gradient;
        this.radius = 2;
        this.vr = 0.03; //valocity radius
    }
    #createGradient() {
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
        this.gradient.addColorStop("0.9", "#ff5c33");
        this.gradient.addColorStop("0.2", "#ff66b3");
        this.gradient.addColorStop("0.4", "#ccccff");
        this.gradient.addColorStop("0.6", "#b3ffff");
        this.gradient.addColorStop("0.8", "#80ff80");
        this.gradient.addColorStop("0.9", "#ffff33");
    }
    #drawLine(angle, x, y) {
        let positionX = x;
        let positionY = y;
        let dx = mouse.x - positionX;
        let dy = mouse.y - positionY;
        let distance = dx * dx + dy * dy;
        if (distance > 600000) distance = 600000;
        else if (distance < 50000) distance = 50000;
        let length = distance / 10000;
        //its build in method; start to drawing a new shape; if drawing shape before this one, beginPath() close the prev shape and start new one
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length); //complex shape
        this.#ctx.stroke(); //draw the actual shape which mapped
    }
    animate(timeStamp) {
        const deltaTime = timeStamp - this.lastTime; //calculate delta time by taking current timeStamp - prev timeStamp
        this.lastTime = timeStamp;
        if (this.timer > this.interval) {
            this.#ctx.clearRect(0, 0, this.#width, this.#height);
            this.radius += this.vr;
            if (this.radius > 5 || this.radius < -5) this.vr *= -1;

            for (let y = 0; y < this.#height; y += this.cellSize) {
                for (let x = 0; x < this.#width; x += this.cellSize) {
                    const angle = (Math.cos(x * 0.01) + Math.sin(y * 0.01)) * this.radius;
                    this.#drawLine(angle, x, y);
                }
            }
            this.timer = 0;
        }
        else {
            this.timer += deltaTime;
        }
        // console.log(deltaTime);
        folwFieldAnimation = requestAnimationFrame(this.animate.bind(this)); //infinit animate() loop
    }
}

//perlin noise or simplex noise
// const angle = (Math.cos(mouse.x * x * 0.00001) + Math.sin(mouse.y * y * 0.00001)) * this.radius;
let note, velocity, statusByte;

test = []

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

function draw() {
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight

    ctx.fillStyle = 'rgba(0,0,0,0.0)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    test.forEach(noteTest => {
        noteTest.newPos(ctx)
        noteTest.update(ctx)
    });

    window.requestAnimationFrame(draw)
}

draw()
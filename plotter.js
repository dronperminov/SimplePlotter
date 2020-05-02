const WIDTH = 1900
const HEIGHT = 910
const CELL_SIZE_X = 90
const CELL_SIZE_Y = 180

const CELLS_X = (WIDTH / (CELL_SIZE_X * 2))
const CELLS_Y = (HEIGHT / (CELL_SIZE_Y * 2))

const X0 = Math.floor(WIDTH / 2)
const Y0 = Math.floor(HEIGHT / 2)

const GRID_COLOR = '#ccc'
const AXIS_COLOR = '#000'

canvas = document.getElementById("canvas")
ctx = canvas.getContext('2d')

canvas.width = WIDTH
canvas.height = HEIGHT

function DrawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

function DrawGrid(ctx) {
    ctx.strokeStyle = GRID_COLOR

    for (let i = 1; i <= CELLS_Y; i++) {
        DrawLine(ctx, 0, Y0 + i * CELL_SIZE_Y, WIDTH, Y0 + i * CELL_SIZE_Y)
        DrawLine(ctx, 0, Y0 - i * CELL_SIZE_Y, WIDTH, Y0 - i * CELL_SIZE_Y)
    }

    for (let i = 1; i <= CELLS_X; i++) {
        DrawLine(ctx, X0 + i * CELL_SIZE_X, 0, X0 + i * CELL_SIZE_X, HEIGHT)
        DrawLine(ctx, X0 - i * CELL_SIZE_X, 0, X0 - i * CELL_SIZE_X, HEIGHT)
    }
}

function DrawAxis(ctx) {
    ctx.strokeStyle = AXIS_COLOR
    ctx.fillStyle = AXIS_COLOR
    ctx.font = "14px arial";

    DrawLine(ctx, X0, 0, X0, HEIGHT)
    DrawLine(ctx, 0, Y0, WIDTH, Y0)

    ctx.textBaseline = "top";
    ctx.textAlign = "center";

    for (let i = 1; i < CELLS_X; i++) {
        DrawLine(ctx, X0 + i * CELL_SIZE_X, Y0 - 4, X0 + i * CELL_SIZE_X, Y0 + 4)
        DrawLine(ctx, X0 - i * CELL_SIZE_X, Y0 - 4, X0 - i * CELL_SIZE_X, Y0 + 4)

        ctx.fillText(i, X0 + i * CELL_SIZE_X, Y0 + 7)
        ctx.fillText(-i, X0 - i * CELL_SIZE_X, Y0 + 7)
    }
    
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    for (let i = 1; i < CELLS_Y; i++) {
        DrawLine(ctx, X0 - 4, Y0 + i * CELL_SIZE_Y, X0 + 4, Y0 + i * CELL_SIZE_Y)
        DrawLine(ctx, X0 - 4, Y0 - i * CELL_SIZE_Y, X0 + 4, Y0 - i * CELL_SIZE_Y)

        ctx.fillText(-i, X0 + 7, Y0 + i * CELL_SIZE_Y)
        ctx.fillText(' ' + i, X0 + 7, Y0 - i * CELL_SIZE_Y)
    }
}

function f1(x) {
    return Math.sin(x)
}

function f2(x) {
    return Math.cos(x)
}

function Map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function PlotFunction(ctx, f, xmin, xmax, step, color) {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(Map(xmin, -CELLS_X, CELLS_X, 0, WIDTH), Map(f(xmin), -CELLS_Y, CELLS_Y, HEIGHT - 1, 0))

    for (let x = xmin; x <= xmax; x += step) {
        let y = f(x)
        let ix = Map(x, -CELLS_X, CELLS_X, 0, WIDTH)
        let iy = Map(y, -CELLS_Y, CELLS_Y, HEIGHT - 1, 0)

        ctx.lineTo(ix, iy)
    }

    ctx.stroke()
}

DrawGrid(ctx)
DrawAxis(ctx)
PlotFunction(ctx, f1, -Math.PI * 4, Math.PI * 4, 0.01, '#f00')
PlotFunction(ctx, f2, -Math.PI * 4, Math.PI * 4, 0.01, '#00f')
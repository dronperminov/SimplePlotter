function Plotter(width, height, cell_size_x, cell_size_y, grid_color, axis_color) {
    this.width = width
    this.height = height
    this.cell_size_x = cell_size_x
    this.cell_size_y = cell_size_y

    this.cells_x = width / (cell_size_x * 2)
    this.cells_y = height / (cell_size_y * 2)

    this.x0 = width / 2
    this.y0 = height / 2

    this.grid_color = grid_color
    this.axis_color = axis_color
}

Plotter.prototype.DrawLine = function(ctx, x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

Plotter.prototype.DrawGrid = function(ctx) {
    ctx.strokeStyle = this.grid_color

    for (let i = 1; i <= this.cells_y; i++) {
        this.DrawLine(ctx, 0, this.y0 + i * this.cell_size_y, this.width, this.y0 + i * this.cell_size_y)
        this.DrawLine(ctx, 0, this.y0 - i * this.cell_size_y, this.width, this.y0 - i * this.cell_size_y)
    }

    for (let i = 1; i <= this.cells_x; i++) {
        this.DrawLine(ctx, this.x0 + i * this.cell_size_x, 0, this.x0 + i * this.cell_size_x, this.height)
        this.DrawLine(ctx, this.x0 - i * this.cell_size_x, 0, this.x0 - i * this.cell_size_x, this.height)
    }
}

Plotter.prototype.DrawAxis = function(ctx) {
    ctx.strokeStyle = this.axis_color
    ctx.fillStyle = this.axis_color
    ctx.font = "14px arial";

    this.DrawLine(ctx, this.x0, 0, this.x0, this.height)
    this.DrawLine(ctx, 0, this.y0, this.width, this.y0)

    ctx.textBaseline = "top";
    ctx.textAlign = "center";

    for (let i = 1; i < this.cells_x; i++) {
        this.DrawLine(ctx, this.x0 + i * this.cell_size_x, this.y0 - 4, this.x0 + i * this.cell_size_x, this.y0 + 4)
        this.DrawLine(ctx, this.x0 - i * this.cell_size_x, this.y0 - 4, this.x0 - i * this.cell_size_x, this.y0 + 4)

        ctx.fillText(i, this.x0 + i * this.cell_size_x, this.y0 + 7)
        ctx.fillText(-i, this.x0 - i * this.cell_size_x, this.y0 + 7)
    }
    
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    for (let i = 1; i < this.cells_y; i++) {
        this.DrawLine(ctx, this.x0 - 4, this.y0 + i * this.cell_size_y, this.x0 + 4, this.y0 + i * this.cell_size_y)
        this.DrawLine(ctx, this.x0 - 4, this.y0 - i * this.cell_size_y, this.x0 + 4, this.y0 - i * this.cell_size_y)

        ctx.fillText(-i, this.x0 + 7, this.y0 + i * this.cell_size_y)
        ctx.fillText(' ' + i, this.x0 + 7, this.y0 - i * this.cell_size_y)
    }
}

Plotter.prototype.Map = function(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

Plotter.prototype.XtoW = function(x) {
    return this.Map(x, -this.cells_x, this.cells_x, 0, this.width - 1)
}

Plotter.prototype.YtoH = function(y) {
    return this.Map(y, -this.cells_y, this.cells_y, this.height - 1, 0)
}

Plotter.prototype.PlotFunction = function(ctx, f, xmin, xmax, step, color) {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    ctx.moveTo(this.XtoW(xmin), this.YtoH(f(xmin)))

    for (let x = xmin; x <= xmax; x += step)
        ctx.lineTo(this.XtoW(x), this.YtoH(f(x)))

    ctx.stroke()
}
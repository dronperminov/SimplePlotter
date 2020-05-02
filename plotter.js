function Plotter(width, height, cell_size_x, cell_size_y, x0, y0, grid_color, axis_color) {
    this.width = width
    this.height = height
    this.cell_size_x = cell_size_x
    this.cell_size_y = cell_size_y

    this.cells_x = width / (cell_size_x * 2)
    this.cells_y = height / (cell_size_y * 2)

    this.x0 = width / 2 - x0 * this.cell_size_x
    this.y0 = height / 2 + y0 * this.cell_size_y

    this.xmin = x0 - this.cells_x
    this.xmax = x0 + this.cells_x
    this.ymin = y0 - this.cells_y
    this.ymax = y0 + this.cells_y

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

    let top = Math.floor(this.y0 / this.cell_size_y)
    let bottom = Math.floor((this.height - this.y0) / this.cell_size_y)

    let left = Math.floor(this.x0 / this.cell_size_x)
    let right = Math.floor((this.width - this.x0) / this.cell_size_x)

    for (let i = 1; i <= top; i++)
        this.DrawLine(ctx, 0, this.y0 - i * this.cell_size_y, this.width, this.y0 - i * this.cell_size_y)

    for (let i = 1; i <= bottom; i++)
        this.DrawLine(ctx, 0, this.y0 + i * this.cell_size_y, this.width, this.y0 + i * this.cell_size_y)

    for (let i = 1; i <= right; i++)
        this.DrawLine(ctx, this.x0 + i * this.cell_size_x, 0, this.x0 + i * this.cell_size_x, this.height)

    for (let i = 1; i <= left; i++)
        this.DrawLine(ctx, this.x0 - i * this.cell_size_x, 0, this.x0 - i * this.cell_size_x, this.height) 
}

Plotter.prototype.DrawAxis = function(ctx) {
    ctx.strokeStyle = this.axis_color
    ctx.fillStyle = this.axis_color
    ctx.font = "14px arial";

    let x0 = Math.max(0, Math.min(this.width, this.x0))
    let y0 = Math.max(0, Math.min(this.height, this.y0))

    this.DrawLine(ctx, x0, 0, x0, this.height)
    this.DrawLine(ctx, 0, y0, this.width, y0)

    this.DrawHorizontalValues(ctx, x0, y0)
    this.DrawVerticalValues(ctx, x0, y0)
}

Plotter.prototype.DrawHorizontalValues = function(ctx, x0, y0) {
    ctx.textBaseline = "top";
    ctx.textAlign = "center";

    let left = Math.floor(this.x0 / this.cell_size_x)
    let right = Math.floor((this.width - this.x0) / this.cell_size_x)
    let position = Math.max(7, Math.min(this.height - 14, y0 + 7))

    for (let i = 1; i <= left; i++) {
        this.DrawLine(ctx, this.x0 - i * this.cell_size_x, y0 - 4, this.x0 - i * this.cell_size_x, y0 + 4)
        ctx.fillText(this.WtoX(this.x0 - i * this.cell_size_x), this.x0 - i * this.cell_size_x, position)
    }

    for (let i = 1; i <= right; i++) {
        this.DrawLine(ctx, this.x0 + i * this.cell_size_x, y0 - 4, this.x0 + i * this.cell_size_x, y0 + 4)
        ctx.fillText(this.WtoX(this.x0 + i * this.cell_size_x), this.x0 + i * this.cell_size_x, position)
    }
}

Plotter.prototype.DrawVerticalValues = function(ctx, x0, y0) {
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    let top = Math.floor(this.y0 / this.cell_size_y)
    let bottom = Math.floor((this.height - this.y0) / this.cell_size_y)
    let position = Math.max(7, Math.min(this.width - 14, x0 + 7))

    for (let i = 1; i <= top; i++) {
        this.DrawLine(ctx, x0 - 4, this.y0 - i * this.cell_size_y, x0 + 4, this.y0 - i * this.cell_size_y)
        ctx.fillText(this.HtoY(this.y0 - i * this.cell_size_y), position, this.y0 - i * this.cell_size_y)
    }

    for (let i = 1; i <= bottom; i++) {
        this.DrawLine(ctx, x0 - 4, this.y0 + i * this.cell_size_y, x0 + 4, this.y0 + i * this.cell_size_y)
        ctx.fillText(this.HtoY(this.y0 + i * this.cell_size_y), position, this.y0 + i * this.cell_size_y)
    }
}

Plotter.prototype.Map = function(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

Plotter.prototype.WtoX = function(w) {
    return Math.round(this.Map(w, 0, this.width, this.xmin, this.xmax) * 1000) / 1000
}

Plotter.prototype.HtoY = function(h) {
    return Math.round(this.Map(h, this.height, 0, this.ymin, this.ymax) * 1000) / 1000
}

Plotter.prototype.XtoW = function(x) {
    return this.Map(x, this.xmin, this.xmax, 0, this.width)
}

Plotter.prototype.YtoH = function(y) {
    return this.Map(y, this.ymin, this.ymax, this.height, 0)
}

Plotter.prototype.PlotFunction = function(ctx, f, step, color) {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    ctx.moveTo(this.XtoW(this.xmin), this.YtoH(f(this.xmin)))

    for (let x = this.xmin; x <= this.xmax; x += step)
        ctx.lineTo(this.XtoW(x), this.YtoH(f(x)))

    ctx.stroke()
}
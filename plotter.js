function Plotter(width, height, cell_size_x, cell_size_y, x0, y0, scale, grid_color, axis_color, draw) {
    this.width = width
    this.height = height

    this.scale = scale
    this.scales = [ 2, 2, 2.5 ]
    this.scaleIndex = 0

    this.cell_size_x = cell_size_x
    this.cell_size_y = cell_size_y

    this.cells_x = width / (cell_size_x * 2)
    this.cells_y = height / (cell_size_y * 2)

    this.CalculatePoints(x0, y0)

    this.grid_color = grid_color
    this.axis_color = axis_color

    this.draw = draw
    draw(this)

    let plotter = this
    document.addEventListener('mousewheel', function(e) { plotter.mouseWheel(e) })
}

Plotter.prototype.CalculatePoints = function(x0, y0) {
    this.x0 = this.width / 2 - x0 * this.scale * this.cell_size_x
    this.y0 = this.height / 2 + y0 * this.scale * this.cell_size_y

    this.xmin = x0 * this.scale - this.cells_x
    this.xmax = x0 * this.scale + this.cells_x
    this.ymin = y0 * this.scale - this.cells_y
    this.ymax = y0 * this.scale + this.cells_y
}

Plotter.prototype.DrawLine = function(ctx, x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

Plotter.prototype.DrawGrid = function(ctx) {
    ctx.strokeStyle = this.grid_color
    ctx.lineWidth = 1

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
    return Math.round(this.Map(w, 0, this.width, this.xmin / this.scale, this.xmax / this.scale) * 1000) / 1000
}

Plotter.prototype.HtoY = function(h) {
    return Math.round(this.Map(h, this.height, 0, this.ymin / this.scale, this.ymax / this.scale) * 1000) / 1000
}

Plotter.prototype.XtoW = function(x) {
    return this.Map(x, this.xmin / this.scale, this.xmax / this.scale, 0, this.width)
}

Plotter.prototype.YtoH = function(y) {
    return this.Map(y, this.ymin / this.scale, this.ymax / this.scale, this.height, 0)
}

Plotter.prototype.PlotFunction = function(ctx, f, color) {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    let step = (this.xmax - this.xmin) / this.scale / this.width
    ctx.moveTo(this.XtoW(this.xmin / this.scale), this.YtoH(f(this.xmin / this.scale)))

    for (let x = this.xmin / this.scale; x <= this.xmax / this.scale; x += step)
        ctx.lineTo(this.XtoW(x), this.YtoH(f(x)))

    ctx.stroke()
}

Plotter.prototype.mouseWheel = function(e) {
    let x0 = (this.width / 2 - this.x0) / this.cell_size_x / this.scale
    let y0 = (this.y0 - this.height / 2) / this.cell_size_y / this.scale

    let x = this.WtoX(e.offsetX)
    let y = this.HtoY(e.offsetY)

    let dx = x0 - x
    let dy = y0 - y
    let scale

    if (e.deltaY > 0) {
        this.scaleIndex = (this.scaleIndex + this.scales.length - 1) % this.scales.length
        scale = 1 / this.scales[this.scaleIndex]
    }
    else {
        scale = this.scales[this.scaleIndex]
        this.scaleIndex = (this.scaleIndex + 1) % this.scales.length
    }

    this.scale *= scale
    this.CalculatePoints(dx / scale + x, dy / scale + y)

    this.draw(this)
}
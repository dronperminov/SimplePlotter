function Plotter(ctx, width, height, cell_size_x, cell_size_y, x0, y0, scale, grid_color, axis_color) {
    this.ctx = ctx
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

    this.functions = []

    let plotter = this
    document.addEventListener('mousewheel', function(e) { plotter.MouseWheel(e) })
    document.addEventListener('mousemove', function(e) { plotter.MouseMove(e) })
}

Plotter.prototype.CalculatePoints = function(x0, y0) {
    this.x0 = this.width / 2 - x0 * this.scale * this.cell_size_x
    this.y0 = this.height / 2 + y0 * this.scale * this.cell_size_y

    this.xmin = x0 * this.scale - this.cells_x
    this.xmax = x0 * this.scale + this.cells_x
    this.ymin = y0 * this.scale - this.cells_y
    this.ymax = y0 * this.scale + this.cells_y
}

Plotter.prototype.DrawLine = function(x1, y1, x2, y2) {
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
}

Plotter.prototype.DrawGrid = function() {
    this.ctx.strokeStyle = this.grid_color
    this.ctx.lineWidth = 1

    let top = Math.floor(this.y0 / this.cell_size_y)
    let bottom = Math.floor((this.height - this.y0) / this.cell_size_y)

    let left = Math.floor(this.x0 / this.cell_size_x)
    let right = Math.floor((this.width - this.x0) / this.cell_size_x)

    for (let i = 1; i <= top; i++)
        this.DrawLine(0, this.y0 - i * this.cell_size_y, this.width, this.y0 - i * this.cell_size_y)

    for (let i = 1; i <= bottom; i++)
        this.DrawLine(0, this.y0 + i * this.cell_size_y, this.width, this.y0 + i * this.cell_size_y)

    for (let i = 1; i <= right; i++)
        this.DrawLine(this.x0 + i * this.cell_size_x, 0, this.x0 + i * this.cell_size_x, this.height)

    for (let i = 1; i <= left; i++)
        this.DrawLine(this.x0 - i * this.cell_size_x, 0, this.x0 - i * this.cell_size_x, this.height) 
}

Plotter.prototype.DrawAxis = function() {
    this.ctx.strokeStyle = this.axis_color
    this.ctx.fillStyle = this.axis_color
    this.ctx.font = "14px arial";

    let x0 = Math.max(0, Math.min(this.width, this.x0))
    let y0 = Math.max(0, Math.min(this.height, this.y0))

    this.DrawLine(x0, 0, x0, this.height)
    this.DrawLine(0, y0, this.width, y0)

    this.DrawHorizontalValues(x0, y0)
    this.DrawVerticalValues(x0, y0)
}

Plotter.prototype.DrawHorizontalValues = function(x0, y0) {
    this.ctx.textBaseline = "top";
    this.ctx.textAlign = "center";

    let left = Math.floor(this.x0 / this.cell_size_x)
    let right = Math.floor((this.width - this.x0) / this.cell_size_x)
    let position = Math.max(7, Math.min(this.height - 14, y0 + 7))

    for (let i = 1; i <= left; i++) {
        this.DrawLine(this.x0 - i * this.cell_size_x, y0 - 4, this.x0 - i * this.cell_size_x, y0 + 4)
        this.ctx.fillText(this.WtoX(this.x0 - i * this.cell_size_x), this.x0 - i * this.cell_size_x, position)
    }

    for (let i = 1; i <= right; i++) {
        this.DrawLine(this.x0 + i * this.cell_size_x, y0 - 4, this.x0 + i * this.cell_size_x, y0 + 4)
        this.ctx.fillText(this.WtoX(this.x0 + i * this.cell_size_x), this.x0 + i * this.cell_size_x, position)
    }
}

Plotter.prototype.DrawVerticalValues = function(x0, y0) {
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "left";

    let top = Math.floor(this.y0 / this.cell_size_y)
    let bottom = Math.floor((this.height - this.y0) / this.cell_size_y)
    let position = Math.max(7, Math.min(this.width - 14, x0 + 7))

    for (let i = 1; i <= top; i++) {
        this.DrawLine(x0 - 4, this.y0 - i * this.cell_size_y, x0 + 4, this.y0 - i * this.cell_size_y)
        this.ctx.fillText(this.HtoY(this.y0 - i * this.cell_size_y), position, this.y0 - i * this.cell_size_y)
    }

    for (let i = 1; i <= bottom; i++) {
        this.DrawLine(x0 - 4, this.y0 + i * this.cell_size_y, x0 + 4, this.y0 + i * this.cell_size_y)
        this.ctx.fillText(this.HtoY(this.y0 + i * this.cell_size_y), position, this.y0 + i * this.cell_size_y)
    }
}

Plotter.prototype.Map = function(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

Plotter.prototype.WtoX = function(w) {
    return Math.round(this.Map(w, 0, this.width, this.xmin / this.scale, this.xmax / this.scale) * 10000) / 10000
}

Plotter.prototype.HtoY = function(h) {
    return Math.round(this.Map(h, this.height, 0, this.ymin / this.scale, this.ymax / this.scale) * 10000) / 10000
}

Plotter.prototype.XtoW = function(x) {
    return this.Map(x, this.xmin / this.scale, this.xmax / this.scale, 0, this.width)
}

Plotter.prototype.YtoH = function(y) {
    return this.Map(y, this.ymin / this.scale, this.ymax / this.scale, this.height, 0)
}

Plotter.prototype.PlotFunction = function(f, color) {
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = 2

    let step = (this.xmax - this.xmin) / this.scale / this.width

    this.ctx.beginPath()
    this.ctx.moveTo(this.XtoW(this.xmin / this.scale), this.YtoH(f(this.xmin / this.scale)))

    for (let x = this.xmin / this.scale; x <= this.xmax / this.scale; x += step)
        this.ctx.lineTo(this.XtoW(x), this.YtoH(f(x)))

    this.ctx.stroke()
}

Plotter.prototype.AddFunction = function(f, color) {
    this.functions.push({ f: f, color: color })
}

Plotter.prototype.Plot = function() {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
    this.DrawGrid()
    this.DrawAxis()

    for (let i = 0; i < this.functions.length; i++)
        this.PlotFunction(this.functions[i].f, this.functions[i].color)
}

Plotter.prototype.ShowValues = function(mx, my, x, y) {
    this.ctx.textBaseline = 'bottom'
    this.ctx.textAlign = 'left'

    this.ctx.fillStyle = this.axis_color
    this.ctx.fillText(x + ', ' + y, mx, my)

    this.ctx.beginPath()
    this.ctx.arc(mx, my, 5, 0, Math.PI * 2)
    this.ctx.fill()

    for (let i = 0; i < this.functions.length; i++) {
        let fy = Math.round(this.functions[i].f(x) * 10000) / 10000
        let iy = this.YtoH(fy)

        this.ctx.fillStyle = this.functions[i].color
        this.ctx.fillText(x + ', ' + fy, mx, iy)

        this.ctx.beginPath()
        this.ctx.arc(mx, iy, 5, 0, Math.PI * 2)
        this.ctx.fill()
    }
}

Plotter.prototype.MouseWheel = function(e) {
    let x0 = (this.width / 2 - this.x0) / this.cell_size_x / this.scale
    let y0 = (this.y0 - this.height / 2) / this.cell_size_y / this.scale

    let x = this.WtoX(e.offsetX)
    let y = this.HtoY(e.offsetY)

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
    this.CalculatePoints((x0 - x) / scale + x, (y0 - y) / scale + y)
    this.Plot()
    this.ShowValues(e.offsetX, e.offsetY, x, y)
}

Plotter.prototype.MouseMove = function(e) {
    let x = this.WtoX(e.offsetX)
    let y = this.HtoY(e.offsetY)

    this.Plot()
    this.ShowValues(e.offsetX, e.offsetY, x, y)
}
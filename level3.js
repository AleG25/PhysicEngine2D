const canvas = document.getElementById("display")
const ctx = canvas.getContext("2d")


let elasticity = 1
let friction = 0
let acceleration = 0.1

let maxGrab = 300

const gravitationalConstant = 6.6743*10**(-11)

function drawLabel(text, color, p1, p2, alignment, padding ){
    if (!alignment) alignment = 'center';
    if (!padding) padding = 0;
    
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var len = Math.sqrt(dx*dx+dy*dy);
    var avail = len - 2*padding;
    
    var textToDraw = text;
    if (ctx.measureText && ctx.measureText(textToDraw).width > avail){
        while (textToDraw && ctx.measureText(textToDraw+"…").width > avail) textToDraw = textToDraw.slice(0,-1);
        textToDraw += "";
    }

    // Keep text upright
    var angle = Math.atan2(dy,dx);
    if (angle < -Math.PI/2 || angle > Math.PI/2){
        var p = p1;
        p1 = p2;
        p2 = p;
        dx *= -1;
        dy *= -1;
        angle -= Math.PI;
    }
    
    var p, pad;
    if (alignment=='center'){
        p = p1;
        pad = 1/2;
    } else {
        var left = alignment=='left';
        p = left ? p1 : p2;
        pad = padding / len * (left ? 1 : -1);
    }
    ctx.save();
    ctx.textAlign = alignment;
    ctx.font = "bold italic 20px Code2001"
    ctx.fillStyle = color
    ctx.textBaseline = "bottom"
    ctx.translate(p.x+dx*pad,p.y+dy*pad);
    ctx.rotate(angle);
    ctx.fillText(textToDraw,0,0);
    ctx.restore();
}
let UP, DOWN, RIGHT, LEFT;
let x = 100
let y = 200

const Objects = []


class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        return new Vector(vec.x + this.x, vec.y + this.y);
    }

    sub(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y);
    }

    mult(n) {
        return new Vector(this.x * n, this.y * n)
    }

    magnitude() {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    normal() {
        return new Vector(-this.y, this.x).unit()
    }

    static dot(v1, v2) {
        return v1.x*v2.x + v1.y*v2.y;
    }

    unit() {
        if(this.magnitude() == 0) return new Vector(0, 0)
        return new Vector(this.x/this.magnitude(), this.y/this.magnitude())
    }


    drawVector(fromx, fromy, n, color, vectorName) {
        let lenX = this.x
        let lenY = this.y
        var headlen = 10;
        let tox = fromx + lenX * n;
        let toy = fromy + lenY * n;
        const span = 10;
        var dx = tox - fromx;
        var dy = toy - fromy;
        const limitX = 100
        const limitY = 100
        var angle = Math.atan2(dy, dx);
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.strokeStyle = color
        ctx.lineCap = "round"
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.moveTo(tox, toy)
        if(this.magnitude() < 0.01){
            return
        }
        ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke()
        if(this.magnitude() >= 0.1) {
            drawLabel(vectorName, color, new Vector(fromx, fromy), new Vector(tox, toy), "center", span)
        }
    }
}

class Ball {
    constructor(x, y, r, mass = 0, planet = true, color = "red", player = false) {
        //position
        this.pos = new Vector(x, y)
        this.r = r

        //acceleration and velocity
        this.vel = new Vector(0, 0)
        this.acc = new Vector(0, 0)
        this.playerAcc = new Vector(0, 0)

        //mass in kg
        this.mass = mass
        if(this.mass === 0) this.inv_m = 0
        else this.inv_m = 1/this.mass

        //others
        this.player = player
        this.color = color
        this.planet = planet
        Objects.push(this)
    }

    drawBody() {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        ctx.strokeStyle = "black"
        ctx.lineWidth = 4
        ctx.fillStyle = this.color
        ctx.stroke()
        ctx.fill()
        ctx.lineWidth = 1
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = "bold 13px Arial"

        ctx.fillText(this.mass.toString() + " kg", this.pos.x, this.pos.y)
    }

    calcPos() {
        const frictionAcc = friction * 9.8 // m/s
        this.vel = this.vel.add(this.acc)
        this.vel = this.vel.add(this.playerAcc)
        if(friction > 0) {
            if(this.vel.magnitude() <= frictionAcc) this.vel = this.vel.sub(this.vel)
            else this.vel = this.vel.sub(this.vel.unit().mult(frictionAcc))
        }
        this.pos = this.pos.add(this.vel.mult(0.01))
    }

    displayVectors() {
        if (velVec.checked) this.vel.drawVector(this.pos.x, this.pos.y, 0.6, "blue", '\u{20D7}v')
        if (accVec.checked) this.acc.drawVector(this.pos.x, this.pos.y, 15, "green", "\u{20D7}a")
        if (ffvec.checked) this.vel.unit().mult(-friction*this.mass*9.8).drawVector(this.pos.x, this.pos.y, 10, "black", "\u{20D7}F")
    }
    
}

canvas.addEventListener("keydown", (e) => {
    if(e.key == "a") LEFT = true;
    if(e.key == "d") RIGHT = true;
    if(e.key == "w") UP = true;
    if(e.key == "s") DOWN = true;
})

canvas.addEventListener("keyup", (e) => {
    if(e.key == "a") LEFT = false;
    if(e.key == "d") RIGHT = false;
    if(e.key == "w") UP = false;
    if(e.key == "s") DOWN = false;
})

function moveBody(b) {
    if(UP) b.playerAcc.y = -acceleration;
    if(DOWN) b.playerAcc.y = acceleration;
    if(RIGHT) b.playerAcc.x = acceleration;
    if(LEFT) b.playerAcc.x = -acceleration;

    

    if(!UP && !DOWN) b.playerAcc.y = 0
    if(!RIGHT && !LEFT) b.playerAcc.x = 0
    b.playerAcc = b.playerAcc.unit().mult(acceleration)
}

function detectCollisonB(b1, b2) {
    return ((b1.r + b2.r) >= b1.pos.sub(b2.pos).magnitude())
}


function penetrationResponseB(b1, b2) {
    const distance = b1.pos.sub(b2.pos)
    const depth = (b1.r + b2.r) - distance.magnitude()
    const response = distance.unit().mult(depth/2)

    
    if(!b1.planet) b1.pos = b1.pos.add(response)
    b1.acc = new Vector(0, 0)
    b1.vel = new Vector(0, 0)


    if(!b2.planet) b2.pos = b2.pos.add(response.mult(-1))
    b2.vel = new Vector(0, 0)
    b2.acc = new Vector(0, 0)
    
}

//OBJECTS
let PB = new Ball(20, 20, 20, 20, false, "grey", true)
let PB2 = new Ball(canvas.clientWidth/2, canvas.clientHeight/2, 60, 5.972*(10**24))

const isHover = e => e.parentElement.querySelector(':hover') === e;
let isHovered = false;



// MAIN LOOP
function mainLoop() {
    ctx.clearRect(-maxGrab, -maxGrab, canvas.clientWidth + maxGrab*2, canvas.clientHeight + maxGrab*2)
    Objects.forEach((b, index) => {
        b.drawBody()
        if (b.player) {
            moveBody(b)
        }

        let totalGravityForce = new Vector(0, 0)

        for(i = 0; i<Objects.length; i++) {
            if(i == index) continue
            const body = Objects[i]
            if(detectCollisonB(b, body)) {
                penetrationResponseB(b, body)
            }

            //APPLY GRAVITY
            const distance = b.pos.sub(body.pos)
            const gravityForce = gravitationalConstant * b.mass * body.mass / distance.mult(10**5).magnitude()**2
            const gravityForceVector = distance.unit().mult(-1).mult(gravityForce)

            if(ffvec.checked) gravityForceVector.drawVector(b.pos.x, b.pos.y, 40/b.r, "purple", "Fa")
            
            
            totalGravityForce = totalGravityForce.add(gravityForceVector)
        }
        
        const accelerationGravity = totalGravityForce.unit().mult(totalGravityForce.magnitude() / b.mass)
        
        b.acc = accelerationGravity
        
        b.calcPos()
        b.displayVectors()
    })
    if(isHovered && !isHover(canvas)) {
        isHovered = false
        grabbing = false
        canvas.style.cursor = "grab"
    }
    else if(!isHovered && isHover(canvas)) {
        isHovered = true
    }
    requestAnimationFrame(mainLoop)
}
requestAnimationFrame(mainLoop)

//MAIN LOOP


let grabbing = false;
let grabEnd = {x: 0, y: 0}
let grabStart = {x:0, y: 0}
let totalGrab = {x:0, y: 0}
const grabbingSensitivity = 0.2


function getMousePos() {
    var rect = canvas.getBoundingClientRect();
    return {
        x: startMouseX - rect.left,
        y: startMouseY - rect.top
    }
}

canvas.addEventListener("mousedown", (e) => {
    grabbing = true;
    canvas.style.cursor = "grabbing"
    grabStart = {
        x: e.pageX - canvas.offsetLeft,
        y: e.pageY - canvas.offsetTop
    }
})

canvas.addEventListener("mousemove", (e) => {
    if(grabbing) {
        grabEnd = {
            x: e.pageX - canvas.offsetLeft,
            y: e.pageY - canvas.offsetTop
        }
        let diffX = grabEnd.x - grabStart.x
        let diffY = grabEnd.y - grabStart.y
        totalGrab.x += diffX
        totalGrab.y += diffY
        console.log(totalGrab)
        if(totalGrab.x >= maxGrab-5 || totalGrab.x <= -maxGrab+5) {
            totalGrab.x -= diffX
            diffX = 0
        }
        if(totalGrab.y >= maxGrab-5 || totalGrab.y <= -maxGrab+5) {
            totalGrab.y -= diffY
            diffY = 0
        }
        canvas.style.backgroundPosition = totalGrab.x * grabbingSensitivity + "px " + totalGrab.y * grabbingSensitivity + "px" 
        ctx.translate(diffX, diffY)
        grabStart = grabEnd
    }
})

canvas.addEventListener("mouseup", (e) => {
    grabbing = false
    canvas.style.cursor = "grab"
})


function normalizeValue(n, dec) {
    // 56.3 56
    const rounded = (Math.round(n*10**dec)/(10**dec))
    const splitted = rounded.toString().split(".")
    const splitNum = splitted.length > 1 ? splitted[1].length : 0
    if(splitNum < dec) splitted[1] = (splitted[1] ?? "") + "0".repeat(dec - splitNum)
    return splitted.join(".")
}


//handle inputs
const enableCollisions = document.getElementById("enable_collisions")
const velVec = document.getElementById("vvector")
const accVec = document.getElementById("avector")
const ffvec = document.getElementById("ffvector")

const frictionInput = document.getElementById("range-attrito")
const accelerationInput = document.getElementById("range-accelerazione")

const frictionLabel = document.getElementById("friction-value")
const accelerationLabel = document.getElementById("acceleration-value")


function updateAcceleration() {
    accelerationInput.value = acceleration
    accelerationLabel.innerText = normalizeValue(acceleration,2)
}

updateAcceleration()


accelerationInput.addEventListener("input", (e) => {
    acceleration = e.target.value
    updateAcceleration()
})

document.getElementById("btn-reset-opt").onclick = () => {
    
    acceleration = 0.1
    updateAcceleration()
    

    
    velVec.checked = false
    ffvec.checked = false
    accVec.checked = false
}
let firstLoad = true
document.getElementById("btn-reset-sim").onclick = () => {
    location.reload()
}
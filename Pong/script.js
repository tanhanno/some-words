const INITIAL_VELOCITY = .025
const VELOCITY_INCREASE = .00001
const SPEED = .02

class Ball {
    constructor(ball) {
        this.ball = ball;
        this.reset()
    }

    get x() {
        return parseFloat(getComputedStyle(this.ball).getPropertyValue('--x'))
    }
    set x(value) {
        this.ball.style.setProperty('--x', value)
    }
    get y() {
        return parseFloat(getComputedStyle(this.ball).getPropertyValue('--y'))
    }
    set y(value) {
        this.ball.style.setProperty('--y', value)
    }

    rect() {
        return this.ball.getBoundingClientRect()
    }

    reset() {
        this.x = 50
        this.y = 50
        this.direction = { x: 0 }
        while (Math.abs(this.direction.x) <= .2 || Math.abs(this.direction.x) >= .9) {
            const heading = randomNumberBetween(0, 2 * Math.PI)
            this.direction = { x: Math.cos(heading), y: Math.sin(heading) }
        }
        this.velocity = INITIAL_VELOCITY
    }

    update(delta, paddleRects) {
        this.x += this.direction.x * this.velocity * delta
        this.y += this.direction.y * this.velocity * delta
        this.velocity += VELOCITY_INCREASE * delta
        const rect = this.rect()

        if (rect.bottom >= window.innerHeight ||rect.top <= 0) {
            this.direction.y *= -1
        }
        if (paddleRects.some(r => isCollision(r, rect))) {
            this.direction.x *= -1
        }
    }
}

class Paddle {
    constructor(paddle) {
        this.paddle = paddle
        this.reset()
    }

    get position() {
        return parseFloat(getComputedStyle(this.paddle).getPropertyValue('--position'))
    }
    set position(value) {
        this.paddle.style.setProperty('--position', value)
    }

    rect() {
        return this.paddle.getBoundingClientRect()
    }

    reset() {
        this.position = 50
    }

    update(delta, ballHeight) {
        this.position += SPEED * delta * (ballHeight - this.position)
    }
}

function randomNumberBetween(min, max) {
    return Math.random() * (max -min) + min
}

function isCollision(rect1, rect2) {
    return (
    rect1.left <= rect2.right && 
    rect1.right >= rect2.left && 
    rect1.top <= rect2.bottom && 
    rect1.bottom >= rect2.top
    )
}

const ball = new Ball(document.getElementById('ball'));
const playerPaddle = new Paddle(document.getElementById('player-paddle'));
const computerPaddle = new Paddle(document.getElementById('computer-paddle'));
const playerScore = document.getElementById('player-score')
const computerScore = document.getElementById('computer-score')

let lastTime

function update(time) {
    if (lastTime != null) {
        const delta = time -lastTime
        ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()])
        computerPaddle.update(delta, ball.y)

        if (isLose()) handleLose()
    }
    lastTime = time
    window.requestAnimationFrame(update);
}

function isLose() {
    const rect = ball.rect()
    return (rect.right >= window.innerWidth || rect.left <= 0) 
}

function handleLose() {
    const rect = ball.rect()
    if (rect.right >= window.innerWidth) {
        playerScore.textContent = parseInt(playerScore.textContent) +1
    } else {
        computerScore.textContent = parseInt(computerScore.textContent) +1
    }
    ball.reset()
    computerPaddle.reset()
}

document.addEventListener('mousemove', e => {
    playerPaddle.position = (e.y / window.innerHeight) * 100
})

window.requestAnimationFrame(update);
const TIME_LEN = 100
//========================================================
const time = document.querySelector('#time')
const title = document.querySelector('title')
const endSound = new Audio('audio/bell.mp3')
let titleName = 'Work'

//========================================================
class Timer {
  constructor(minutes, seconds) {
    this.startSeconds = seconds;
    this.startMinutes = minutes;
    this.curSeconds = seconds;
    this.curMinutes = minutes;
    this.running = false;
    this.interval
  }

  reset() {
    if (this.running) {
      this.stop()
      this.curSeconds = this.startSeconds;
      this.curMinutes = this.startMinutes;
      drawTime(this, time)
      startButton.innerHTML = 'Start'
    }
  }

  run() {
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      if (this.curMinutes == 0 && this.curSeconds == 0) {
        this.reset()
        switchTimer()
        endSound.play().catch(err => { console.log('error while playing audio') })
      }
      if (!this.running) {
        clearInterval(this.interval)
        return
      }
      if (this.curSeconds == 0) {
        this.curMinutes--;
        this.curSeconds = 59;
      }
      else this.curSeconds--;
      drawTime(this, time)
    }, TIME_LEN)
  }

  start() {
    this.running = true;
    this.run()
  }

  stop() {
    this.running = false;
  }

  toggle(button) {
    if (this.running) {
      this.stop()
      button.innerHTML = 'Start'
    }
    else {
      this.start()
      button.innerHTML = 'Stop'
    }
  }

  setMinutes(minutes) {
    console.log(minutes)
    this.startMinutes = minutes;
    this.curMinutes = minutes;
    this.reset()
    drawTime(timer, time)
  }

  setSeconds(seconds) {
    this.startSeconds = seconds;
    this.curSeconds = seconds;
    this.reset()
    drawTime(timer, time)
  }

}

function drawTime(timer, time) {
  time.innerHTML = draw(timer.curMinutes) + ':' +
    draw(timer.curSeconds);
  title.innerHTML = titleName + ': ' + draw(timer.curMinutes) + ':' +
    draw(timer.curSeconds);
}

function draw(n) {
  if (n >= 10) return n;
  return '0' + n
}

function switchTimer() {
  timer.reset()
  if (timer == workTimer) {
    timer = breakTimer
    titleName = 'Break'
  } else {
    timer = workTimer
    titleName = 'Work'
  }

  drawTime(timer, time)
  updateInputs()
  toggleButtons()
}

function toggleButtons() {
  pomodoroButton.classList.toggle('toggled')
  breakButton.classList.toggle('toggled')
}

function updateInputs(){
  document.getElementById('minutesInput').value = timer.curMinutes
  document.getElementById('secondsInput').value = timer.curSeconds
}
//========================================================//



const startButton = document.querySelector('#start-button')
// const stopButton = document.querySelector('#stop-button')
const resetButton = document.querySelector('#reset-button')

const pomodoroButton = document.querySelector('#pmdr-button')
const breakButton = document.querySelector('#break-button')

const minutesInput = document.querySelector('#minutesInput')
const secondsInput = document.querySelector('#secondsInput')

pomodoroButton.addEventListener('click', () => {
  if (timer == workTimer) return;
  switchTimer()
})
breakButton.addEventListener('click', () => {
  if (timer == breakTimer) return;
  switchTimer()
})


const workTimer = new Timer(25, 0);
const breakTimer = new Timer(1, 0);
let timer = workTimer;
drawTime(timer, time)


startButton.addEventListener('click', () => { timer.toggle(startButton) })
resetButton.addEventListener('click', () => { timer.reset() })

updateInputs()

minutesInput.addEventListener('change', () => {
  const minutes = document.getElementById('minutesInput').value
  if (minutes >= 90 || minutes <= 0) return
  timer.setMinutes(minutes)
})

secondsInput.addEventListener('change', () => {
  const seconds = document.getElementById('secondsInput').value
  if (seconds >= 60 || seconds < 0) return
  timer.setSeconds(seconds)
})
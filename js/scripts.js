const TIME_LEN = 100
const HISTORY_FILE = 'history.json'

// const fs = require('fs')
//========================================================
// const endSound = new Audio('audio/bell.mp3')
const jobsDoneSound = new Audio('audio/jobs_done.mp3')
const workAgainSound = new Audio('audio/bell.mp3')

const time = document.querySelector('#time')
const title = document.querySelector('title')

const startButton = document.querySelector('#start-button')
const resetButton = document.querySelector('#reset-button')
const yesConfirmButton = document.querySelector('#yes-confirm')
const noConfirmButton = document.querySelector('#no-confirm')

const pomodoroButton = document.querySelector('#pmdr-button')
const breakButton = document.querySelector('#break-button')

const minutesInput = document.querySelector('#minutesInput')
const secondsInput = document.querySelector('#secondsInput')

const workStatsElement = document.querySelector('#work-stats')
const breakStatsElement = document.querySelector('#break-stats')

const historyElement = document.querySelector('#history-grid')
let statsCnt = 1

//========================================================
class Timer {
  constructor(minutes, seconds, titleName, stats, endSound) {
    this.startSeconds = seconds;
    this.startMinutes = minutes;
    this.curSeconds = seconds;
    this.curMinutes = minutes;
    this.titleName = titleName;
    this.stats = stats;
    this.endSound = endSound;
    this.running = false;
    this.interval;
  }

  reset() {
    this.stop()
    this.curSeconds = this.startSeconds;
    this.curMinutes = this.startMinutes;
    this.draw(time)
    startButton.innerHTML = 'Start'
  }

  run() {
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      if (this.curMinutes == 0 && this.curSeconds == 0)
        this.end()
      if (!this.running) {
        clearInterval(this.interval)
        return
      }
      if (this.curSeconds == 0) {
        this.curMinutes--;
        this.curSeconds = 59;
      }
      else this.curSeconds--;
      this.draw(time)
    }, TIME_LEN)
  }

  end() {
    this.reset()
    this.stats.addMinutes(this.startMinutes)
    switchTimer()
    this.endSound.play().catch(err => { console.log('error while playing audio') })
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
    this.startMinutes = minutes;
    this.curMinutes = minutes;
    this.reset()
    this.draw(time)
  }

  setSeconds(seconds) {
    this.startSeconds = seconds;
    this.curSeconds = seconds;
    this.reset()
    this.draw(time)
  }

  stopped() {
    if (this.curMinutes == this.startMinutes && 
        this.curSeconds == this.startSeconds)
      return false;
    return true;
  }

  draw(time) {
    time.innerHTML = drawNumber(this.curMinutes) + ':' +
      drawNumber(this.curSeconds);
    title.innerHTML = this.titleName + ': ' + drawNumber(this.curMinutes) + ':' +
      drawNumber(this.curSeconds);
  }

}

function drawNumber(n) {
  if (n >= 10) return n;
  return '0' + n
}

function switchTimer() {
  timer.reset()
  timer = timer == workTimer ? breakTimer : workTimer

  timer.draw(time)
  updateInputs()
  toggleButtons()
}

function toggleButtons() {
  pomodoroButton.classList.toggle('toggled')
  breakButton.classList.toggle('toggled')
}

function updateInputs() {
  document.getElementById('minutesInput').value = timer.curMinutes
  document.getElementById('secondsInput').value = timer.curSeconds
}
//========================================================//
function historyTag(type, minutes) {
  return "<div class=\"row history-tag \">" +
    '<div class=\"col">' +
    type + ': ' + minutes + ' min</div>' +
    '<div class=\"col-1 float-right\">' +
    '<strong>#' + statsCnt++ + '</strong>' +
    '</div>'
}

class Stats {
  constructor(type, element) {
    this.type = type
    this.minutes = 0
    this.hours = 0
    this.element = element
  }

  draw() {
    this.element.innerHTML = this.type + ': ' + this.hours + 'h ' +
      this.minutes + 'min'
  }

  addMinutes(minutes) {
    this.minutes += minutes
    while (this.minutes >= 60) {
      this.minutes -= 60
      this.hours++
    }
    this.draw()
    historyElement.innerHTML += historyTag(this.type, minutes)
  }

}
//=========================================================
// class HistoryManager {
//   constructor(historyFile) {
//     this.historyFile = historyFile
//     this.todayDate = new Date(Date.now()).toLocaleDateString()
//     this.history = []
//     this.read_history()
//   }

//   read_history() {
//     fs.readFile(this.historyFile, (err, data) => {
//       return
//       // if (err) return;

//       // const str = data.toString()
//       // const history = JSON.parse(str).history
//       // if (history.length == 0) return
//       // if (history[history.length-1] != this.todayDate) return

//     })

//   }

//   // add break or work entry to history file
//   add_history(type, minutes) {

//   }
// }
//==============================================================

pomodoroButton.addEventListener('click', () => {
  if (timer == workTimer) return;
  if (timer.running || timer.stopped()) return;
  switchTimer()
})
breakButton.addEventListener('click', () => {
  if (timer == breakTimer) return;
  if (timer.running || timer.stopped()) return;
  switchTimer()
})

var modal = document.getElementById('reset-confirm');
var shade = document.getElementById('shade');

const workStats = new Stats('Work', workStatsElement);
const breakStats = new Stats('Break', breakStatsElement);
const workTimer = new Timer(50, 0, 'Work', workStats, jobsDoneSound);
const breakTimer = new Timer(10, 0, 'Break', breakStats, workAgainSound);
// const historyManager = new HistoryManager(HISTORY_FILE);
let timer = workTimer;
timer.draw(time)

//yes -> reset timer
yesConfirmButton.addEventListener('click', () => {
  timer.reset()
  modal.style.display = shade.style.display = 'none';
});
//no -> start timer again
noConfirmButton.addEventListener('click', () => {
  timer.start()
  modal.style.display = shade.style.display = 'none';
});
// ask user if he wants to reset timer; stop timer
startButton.addEventListener('click', () => { timer.toggle(startButton) })
resetButton.addEventListener('click', () => { 
  if (!timer.stopped()) return;
  modal.style.display = shade.style.display = 'block';
  timer.stop()
})

updateInputs()

minutesInput.addEventListener('change', () => {
  const minutes = Number(document.getElementById('minutesInput').value)
  if (minutes >= 90 || minutes <= 0) return
  timer.setMinutes(minutes)
})

secondsInput.addEventListener('change', () => {
  const seconds = Number(document.getElementById('secondsInput').value)
  if (seconds >= 60 || seconds < 0) return
  timer.setSeconds(seconds)
})

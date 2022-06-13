const TIME_LEN = 1000
const HISTORY_FILE = 'history.json'
const startState = 'Start'
const stopState = 'Stop'
//========================================================
//AUDIO
const jobsDoneSound = new Audio('audio/jobs_done.mp3')
const workAgainSound = new Audio('audio/bell.mp3')
//
const time = document.querySelector('#time')
const title = document.querySelector('title')
//MAIN BUTTONS-------------------------------------------
const startButton = document.querySelector('#start-button')
let startButtonState = startState 
const resetButton = document.querySelector('#reset-button')
//CONFIRMATION WINDOW------------------------------------
const yesConfirmButton = document.querySelector('#yes-confirm')
const noConfirmButton = document.querySelector('#no-confirm')
const modal = document.getElementById('reset-confirm');
const shade = document.getElementById('shade');
//SWITCH BUTTONS
const pomodoroButton = document.querySelector('#pmdr-button')
const breakButton = document.querySelector('#break-button')
//CHANGE TIMER SETTINGS
const minutesInput = document.querySelector('#minutesInput')
const secondsInput = document.querySelector('#secondsInput')
//STATISTICS
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
  }

  /*
   * every second -> decrement timer; draw timer 
   */
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

  /*
   * timer finfished
   */
  end() {
    this.reset()
    toggleStartButton()
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

  //start or stop timer
  toggle(button) {
    if (this.running) {
      this.stop()
      toggleStartButton()
    }
    else {
      this.start()
      toggleStartButton()
    }
  }
  //set minutes in settings
  setMinutes(minutes) {
    this.startMinutes = minutes;
    this.curMinutes = minutes;
    this.reset()
    this.draw(time)
  }
  //set seconds in settings
  setSeconds(seconds) {
    this.startSeconds = seconds;
    this.curSeconds = seconds;
    this.reset()
    this.draw(time)
  }
  //return if timer is stopped
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
  /*
   * 1. stop current timer
   * 2. change timer variable
   * 3. draw new timer
   * ?4. change inputs
   * 5. toggle button that shows what timer runs now 
   */
  timer.stop()
  timer.curSeconds = timer.startSeconds;
  timer.curMinutes = timer.startMinutes;
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
  minutesInput.value = timer.startMinutes
  secondsInput.value = timer.startSeconds
  // document.getElementById('minutesInput').value = timer.curMinutes
  // document.getElementById('secondsInput').value = timer.curSeconds
}
//
function toggleStartButton(){
  startButtonState = startButtonState == startState ? stopState : startState 
  startButton.innerHTML = startButtonState
  
  startButton.classList.toggle('btn-pressed')
}

function changeStartButton(state){
  startButtonState = state 
  startButton.innerHTML = startButtonState 
  
  if (state == startState)
    startButton.classList.remove('btn-pressed')
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


const workStats = new Stats('Work', workStatsElement);
const breakStats = new Stats('Break', breakStatsElement);
const workTimer = new Timer(50, 0, 'Work', workStats, jobsDoneSound);
const breakTimer = new Timer(10, 0, 'Break', breakStats, workAgainSound);
// const historyManager = new HistoryManager(HISTORY_FILE);
let timer = workTimer;

//EVENT_HANLDERS
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
startButton.addEventListener('click', () => { timer.toggle(startButton) })
// ask user if he wants to reset timer
resetButton.addEventListener('click', () => { 
  if (!timer.stopped()) return;
  modal.style.display = shade.style.display = 'block';
})
//yes -> reset timer
yesConfirmButton.addEventListener('click', () => {
  timer.reset()
  changeStartButton(startState)
  modal.style.display = shade.style.display = 'none';
});
//no -> start timer again
noConfirmButton.addEventListener('click', () => {
  modal.style.display = shade.style.display = 'none';
});
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

//INIT
updateInputs()
timer.draw(time)


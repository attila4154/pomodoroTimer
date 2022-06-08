
class Timer {
  constructor(minutes, seconds) {
    this.startSeconds = seconds;
    this.startMinutes = minutes;
    this.curSeconds = seconds;
    this.curMinutes = minutes;
    // this.restMinutes = 10;
    this.running = false;
    this.interval
    drawTime(this, time)
  }

  reset() {
    this.stop()
    this.curSeconds = this.startSeconds;
    this.curMinutes = this.startMinutes;
    drawTime(this, time)
  }

  run() {
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      if (!this.running) {
        clearInterval(this.interval)
        return
      }
      if (this.curSeconds == 0) {
        this.curMinutes--;
        this.curSeconds = 59;
      }
      else this.curSeconds--;
      console.log('here ', this.curMinutes, this.curSeconds)
      drawTime(this, time)
    }, 100)
  }

  start() {
    this.running = true;
    console.log('start')
    this.run()
  }

  stop() {
    this.running = false;
    console.log('stop')
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

}

export default Timer;
$(document).ready(function() {
    var timer = new Timer(25 * 60 * 1000);

    document.onkeypress = function(evt){
      keyShortcuts(evt, timer);
    }

    $("#start").on("click", function() {
      startTimer(timer);
    });

    $("#stop").on("click", function() {
        timer.stop();
    });

    $("#reset").on("click", function() {
        timer.reset();
    });

    $("#breakSub").on("click", function() {
        var isBreak = ($("#break-text").css("visibility") == "visible")
        if (isBreak) {
            timer.reset();
        }
        setNewTime($("#breakTime"), -1,isBreak);
    });
    $("#breakAdd").on("click", function() {
        var isBreak = ($("#break-text").css("visibility") == "visible")
        if (isBreak) {
            timer.reset();
        }
        setNewTime($("#breakTime"), 1,isBreak);
    });
    $("#totSub").on("click", function() {
        var isBreak = ($("#break-text").css("visibility") == "visible")
        if (!isBreak) {
            timer.reset();
        }
        setNewTime($("#totTime"), -1, isBreak);
    });
    $("#totAdd").on("click", function() {
        var isBreak = ($("#break-text").css("visibility") == "visible")
        if (!isBreak) {
            timer.reset();
        }
        setNewTime($("#totTime"), 1, isBreak);

    });

});

function setNewTime(element, diff ,isBreak) {
    var newTime = parseInt(element.text()) + diff;
    if (newTime < 1) {
        newTime = 1;
    } else if (newTime > 60) {
        newTime = 60;
    }
    element.text(newTime);

    if (!(element.hasClass('break')) && !isBreak) {
        $("#time-display").text(newTime + ":00");
    }
    if (element.hasClass('break') && isBreak){
      $("#time-display").text(newTime + ":00");
    }
}

function startAnimation() {
    var leftBall = document.getElementById("leftBall");
    leftBall.className += " leftMove";

    var rightBall = document.getElementById("rightBall");
    rightBall.className += " rightMove";
}

function stopAnimation() {
    var leftBall = document.getElementById("leftBall");
    leftBall.className = "cord";

    var rightBall = document.getElementById("rightBall");
    rightBall.className = "cord";
}

function degToRad(degrees) {
    var factor = Math.PI / 180;
    return degrees * factor;
}

function Timer(duration) {
    this.previousTime;
    this.paused = true;
    this.elapsed = 0;
    this.duration = duration + 300;
    this.updateRate = 100;
    this.onTimeUp = function() {
        this.stop();
        stopAnimation();
        changePhase(this);
    };
    this.onTimeUpdate = function() {
        var timeLeft = this.duration - this.elapsed;
        this.displayTime();
    }
}

Timer.prototype.start = function() {
    playNotification();
    this.paused = false;
    this.previousTime = new Date().getTime();
    this.keepCounting();
    startAnimation();
}

Timer.prototype.displayTime = function() {
    var timeLeft = this.duration - this.elapsed;
    var minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    var seconds = Math.floor((timeLeft / 1000) % 60);
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var formattedTime = minutes + ":" + seconds;
    $("#time-display").text(formattedTime);
}

Timer.prototype.keepCounting = function() {
    if (this.paused) {
        return true;
    }

    var now = new Date().getTime();
    var diff = (now - this.previousTime);
    this.elapsed = this.elapsed + diff;
    this.previousTime = now;
    this.onTimeUpdate();
    if (this.elapsed >= this.duration) {
        this.stop();
        this.onTimeUp();
        return true;
    }
    var that = this;
    setTimeout(function() {
        that.keepCounting();
    }, this.updateRate);
};

Timer.prototype.stop = function() {
    this.paused = true;
    stopAnimation();
}

Timer.prototype.reset = function() {
    this.stop();
    this.elapsed = 0;
    this.displayTime();
}

Timer.prototype.setDuration = function(duration) {
    this.duration = duration + 300;
}

function changePhase(timer) {
    var isBreak = ($("#break-text").css("visibility") == "visible")
    if (isBreak) {
        timer.setDuration($("#totTime").text() * 60 * 1000);
        $("#break-text").css("visibility", "hidden");
    } else {
        timer.setDuration($("#breakTime").text() * 60 * 1000);
        $("#break-text").css("visibility", "visible");
    }
    timer.reset();
    timer.start();
    playNotification();
}

function playNotification(){
  document.getElementById("notify").play();
}

function keyShortcuts(evt,timer){
  evt.preventDefault();
  var evt = (evt) ? evt : ((event) ? event : null);
  var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
  console.log(node.type);
  if (node.type == "submit" || node.type == "button"){
    evt.preventDefault();
    return false;
  }
  var keyCode = evt.keyCode;
  if (keyCode == 32){
    if (timer.paused){
      startTimer(timer);
    }
    else{
      timer.stop();
    }
  }
  if (keyCode == 174){
    timer.reset();
    return;
  }

  if (keyCode == 960){
    timer.reset();
    timer.setDuration(25*60*1000);
    $("#breakTime").text(5);
    $("#totTime").text(25);
    $("#time-display").text("25:00");
    return;
  }
}
function startTimer(timer){
  var isBreak = ($("#break-text").css("visibility") == "visible");
  if (isBreak) {
      timer.setDuration($("#breakTime").text() * 60 * 1000);
  } else {
      timer.setDuration($("#totTime").text() * 60 * 1000);
  }
  timer.start();
}

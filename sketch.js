var red = 0;
var green = 0;
var blue = 0;

var t_red = 0;
var t_green = 0;
var t_blue = 0;

var x_dim = 10;
var y_dim = 10;

var tracking = 0;
var sustain = 0.5;
var delay = 200;

var matrix = [];
var rate = 8;

//var notes = [440, 523.25, 783.99];
var pulses = [];

var ready = [];

function setup() {
  createCanvas(1440, 800); 

  btn_width = height / x_dim;
  btn_height = height / y_dim;

  for (var i = 0; i < x_dim; i++) {
    matrix.push([]);
    ready.push(0);
    for (var j = 0; j < y_dim; j++) {
      stroke(255);
      fill(0);
      rect(i * btn_width, j * btn_height, btn_width, btn_height);
      matrix[i].push(0);
    }


    // create sounds
    var pulse = new p5.Pulse();
    pulse.amp(0);
    pulse.freq(220 + (i * 80));
    pulse.width(0.5);
    pulse.start();
    pulses.push(pulse);
  }
}

function draw() {
  c = map(mouseX, 0, width, 0, 255);
  c2 = map(mouseY, 0, width, 0, 255);
    
  if (tracking > (btn_width * x_dim)) {
    tracking = 0;
    for (var i = 0; i < ready.length; i++) {
      ready[i] = 0;
    }
  }

  tracking += rate;
  var column = lookup(tracking);

  if(!ready[column]) {
    ready[column] = 1;
    for (var z = 0; z < x_dim; z += 1) {
      if (matrix[z][column]) {
        console.log("Playing notes " + column + " on " + z);
        
        var note = pulses[z];
        note.amp(1);

        setTimeout((function(n) {
          return function () {
            n.amp(0, sustain);
          }
        })(note), delay);
      }
    }
  }
  //background(c + c2, c2 * c/ (c + 1), 1500);
}

function mouseClicked() {
  var row = lookup(mouseY);
  var column = lookup(mouseX);
  console.log(" " + mouseX + " " + mouseY);
  console.log("clicked row: " + row + " column: " + column);

  if (matrix[row][column]) {
    fill(0);
    matrix[row][column] = 0;
  } else {
    fill(c + c2, c2 * c/ (c + 1), 1500);
    matrix[row][column] = 1;
  }

  rect(column * btn_width, row * btn_height, btn_width, btn_height);
}

function lookup(x) {
  return ceil(x / btn_width) - 1;
}
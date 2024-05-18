import * as THREE from 'three';

const MxT_Values = [];
const MxValues  = [];
const MzT_Values = [];
const MzValues  = [];
var T1 = document.getElementById("T1_slider").value;
var T2 = document.getElementById("T2_slider").value;
var Tmax = T1*2;
const numSteps = 1000;
var deltaT = Tmax/numSteps;
const w = 1.0;
generateMxData(0, Tmax, MxT_Values, MxValues, deltaT);
generateMzData(0, Tmax, MzT_Values, MzValues, deltaT);
var clock = new THREE.Clock();
var t = clock.getElapsedTime();

    
let xChart = new Chart("XMagnitude", {
  type: "line",
  data: {
    labels: MxT_Values,
    datasets: [{
      fill: false,
      pointRadius: 2,
      borderColor: "rgba(0,0,255,0.5)",
      data: MxValues
    }]
  },    
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Mx vs Time",
      fontSize: 16
    },
    tooltips: {enabled: false},
    hover: {mode: null},
    
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Time"
        },
        ticks: {
          callback: function(value, index, values) {
            return value.toFixed(2);
          }
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Mx"
        }
      }]
    },
    annotation: {
      annotations: [{
        type: 'line',
        mode: 'vertical',
        scaleID: 'x-axis-0',
        value: t, // elapsed time
        borderColor: 'red',
        borderWidth: 2,
      }]
    }
  }
});
     
let zChart = new Chart("ZMagnitude", {
  type: "line",
  data: {
    labels: MzT_Values,
    datasets: [{
      fill: false,
      pointRadius: 2,
      borderColor: "rgba(0,0,255,0.5)",
      data: MzValues
    }]
  },    
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Mz vs Time",
      fontSize: 16
    },
    tooltips: {enabled: false},
    hover: {mode: null},
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Time"
        },
        ticks: {
          callback: function(value, index, values) {
            return value.toFixed(2);
          }
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Percent M0 Recovered"
        }
      }]
    },
    annotation: {
      annotations: [{
        type: 'line',
        mode: 'vertical',
        scaleID: 'x-axis-0',
        value: 0, // elapsed time
        borderColor: 'red',
        borderWidth: 2,
        drawTime: 'afterDatasetsDraw'
      }]
    }
  }
});

      
function generateMxData(i1, i2, xValues, yValues, step = 1) {
  xValues.length  = 0;
  yValues.length  = 0;
  for (let x = i1; x <= i2; x += step) {
    yValues.push(Math.exp(-x/T2)*Math.cos(-w*x));
    xValues.push(x);
  }
}
  
function generateMzData(i1, i2, xValues, yValues, step = 1) {
  xValues.length  = 0;
  yValues.length  = 0;
  for (let x = i1; x <= i2; x += step) {
    yValues.push(1 - Math.exp(-x/T1));
    xValues.push(x);
  }
}

function generateVertData(xValues, yValues) {
  xValues.length = 0;
  yValues.length = 0;
  xValues.push(clock.getElapsedTime());
  xValues.push(clock.getElapsedTime());
  yValues.push(Math.min(MzValues));
  yValues.push(Math.max(MzValues));
}


var T1_slider = document.getElementById("T1_slider");
var T2_slider = document.getElementById("T2_slider");
T1_slider.onchange = function() {
  T1 = this.value;
  Tmax = T1*2;
  deltaT = Tmax/numSteps;
  generateMxData(0, Tmax, MxT_Values, MxValues, deltaT);
  generateMzData(0, Tmax, MzT_Values, MzValues, deltaT);

  t = clock.getElapsedTime();
  var x = t/deltaT;
  xChart.options.annotation.annotations[0].value = x;
  zChart.options.annotation.annotations[0].value = x;

  xChart.update();
  zChart.update();
}

T2_slider.onchange = function() {
  T2 = this.value;
  generateMxData(0, Tmax, MxT_Values, MxValues, deltaT);
  xChart.update();
}

var then = 0;
function animate() {  
  requestAnimationFrame( animate );
  t = clock.getElapsedTime();
  if (t - then > .2) { //5fps
    then = t;
    //ugh have to accommodate for the fact that the chart is not updating
    var x = t/deltaT;

    xChart.options.annotation.annotations[0].value = x;
    zChart.options.annotation.annotations[0].value = x;
    xChart.update();
    zChart.update();
  }

}
animate();
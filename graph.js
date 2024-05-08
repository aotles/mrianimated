const MxT_Values = [];
const MxValues  = [];
const MzT_Values = [];
const MzValues  = [];
var T1 = document.getElementById("T1_slider").value;
var T2 = document.getElementById("T2_slider").value;
var Tmax = T1*2;
var deltaT = Tmax/50;
const w = 1.0;
generateData("Math.exp(-x/T2)*Math.cos(-w*x)", 0, Tmax, MxT_Values, MxValues, deltaT);
generateData("1 - Math.exp(-x/T1)", 0, Tmax, MzT_Values, MzValues, deltaT);
    
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
      }]
    }
  }
});
   
function generateData(value, i1, i2, xValues, yValues, step = 1) {
  xValues.length  = 0;
  yValues.length  = 0;
  for (let x = i1; x <= i2; x += step) {
    yValues.push(eval(value));
    xValues.push(x);
  }
}

//update chart in real time as user changes T1 and T2 values
document.getElementById("T1_slider").addEventListener("input", function() {
  T1 = document.getElementById("T1_slider").value;
  Tmax = T1*2;
  deltaT = Tmax/50;
  generateData("Math.exp(-x/T2)*Math.cos(-w*x)", 0, Tmax, MxT_Values, MxValues, deltaT);
  xChart.update();
  generateData("1 - Math.exp(-x/T1)", 0, Tmax, MzT_Values, MzValues, deltaT);
  zChart.update();
});

document.getElementById("T2_slider").addEventListener("input", function() {
  T2 = document.getElementById("T2_slider").value;
  generateData("Math.exp(-x/T2)*Math.cos(-w*x)", 0, Tmax, MxT_Values, MxValues, deltaT);
  xChart.update();
  generateData("1 - Math.exp(-x/T1)", 0, Tmax, MzT_Values, MzValues, deltaT);
  zChart.update();
});
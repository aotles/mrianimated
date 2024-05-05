const MxT_Values = [];
const MxValues  = [];
const MzT_Values = [];
const MzValues  = [];
const T1 = 20.0;
const T2 = 20.0;
const w = 1.0;
generateData("Math.exp(-x/T2)*Math.cos(-w*x)", 0, 20, MxT_Values, MxValues, 0.5);
generateData("1 - Math.exp(-x/T1)", 0, 20, MzT_Values, MzValues, 0.5);
    
new Chart("XMagnitude", {
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
    }
  }
});
     
new Chart("ZMagnitude", {
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
    }
  }
});
   
function generateData(value, i1, i2, xValues, yValues, step = 1) {
  for (let x = i1; x <= i2; x += step) {
    yValues.push(eval(value));
    xValues.push(x);
  }
}
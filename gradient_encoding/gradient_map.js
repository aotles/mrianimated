main();

var freqMag = 0;
var startTime = Date.now() / 1000;
document.getElementById("freqMag").addEventListener("input", function(evt) {
  freqMag = (this.value / 180) * Math.PI;
  startTime = Date.now() / 1000;
});
var phaseMag = 0;
document.getElementById("phaseMag").addEventListener("input", function(evt) {
  phaseMag = (this.value / 180) * Math.PI;
  startTime = Date.now() / 1000;
});

function main() {
  const canvas = document.querySelector("#gradient_map");
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it.",
    );
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;

    void main(void) {
      gl_Position = aVertexPosition;
    }
  `;
  const fsSource = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform float freqGradMag;
  uniform float phaseOffsetMag;
  void main( void )
  {
      // Normalized pixel coordinates (from 0 to 1)
      vec2 uv = gl_FragCoord.xy/iResolution.xy;
      float w = 1.0;
      float phaseOffset = 0.;
      
      float time = iTime;
      float mask = 1.0;
      
      if (iTime > 3.) {
        phaseOffset = (uv.y -.5)*2.*phaseOffsetMag;
      }
      
      if (iTime > 6.) {
        w = 1.0 +(uv.x-.5)*freqGradMag;
      } 
      float redChannel = cos(time*w+phaseOffset);
      float greenChannel = cos(time*w + 3.14+phaseOffset);
  
      // Time varying pixel color w/ phase of signal
      vec3 col = vec3((redChannel),(greenChannel),0);
  
      // Output to screen
      gl_FragColor = vec4(col ,1.0);
  }
  `;

  const fsSource2 = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  void main( void ) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy;

    // Time varying pixel color
    vec3 col = vec3(0, 2.*cos(iTime), 0);

    // Output to screen
    gl_FragColor = vec4(col,1.0);
    }
  `;

  //compile vertex shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);
  console.log(gl.getShaderInfoLog(fragmentShader));

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    -2, -2,
     4, -2,
    -2, 4,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, "aVertexPosition");
  const resolutionLocation = gl.getUniformLocation(program, "iResolution");
  const timeLocation = gl.getUniformLocation(program, "iTime");
  const freqMagLocation = gl.getUniformLocation(program, "freqGradMag");
  const phaseMagLocation = gl.getUniformLocation(program, "phaseOffsetMag");
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  setInterval(() => {
    const t = Date.now() / 1000 - startTime;
    gl.uniform1f(timeLocation, t)
    gl.uniform1f(freqMagLocation, freqMag);
    gl.uniform1f(phaseMagLocation, phaseMag);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, 1000 / 60);



}


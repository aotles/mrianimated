main();

var startTime = Date.now() / 1000;
document.getElementById("teslas").addEventListener("input", function(evt) {
  teslas = this.value;
});

function main() {
  const canvas = document.querySelector("#shader_canvas");
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
  uniform float teslas;

  void main( void )
  {
    //each pixel is 100 protons if one of the protons 
    float diffInSpins = teslas*3./10000.; //percent out of 100
    
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy/iResolution.xy;
    float rand = fract(sin(dot(vec2(uv.x *iTime, uv.y*iTime) ,vec2(12.9898,78.233))) * 43758.5453);
    
    // Time varying pixel color
    vec3 col = vec3(0,2,4);
    float mask = 0.;
    mask = rand >= (1. - diffInSpins) ? 1. : 0.;

    // Output to screen
    gl_FragColor = vec4(col*mask,1.0);
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
  const teslasLocation = gl.getUniformLocation(program, "teslas");
  //const randLocation = gl.getUniformLocation(program, "rand");
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  setInterval(() => {
    const t = Date.now() / 1000 - startTime;
    gl.uniform1f(timeLocation, t)
    gl.uniform1f(teslasLocation, teslas);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, 1000 / 60);



}


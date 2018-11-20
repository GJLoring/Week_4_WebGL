const canvas = document.querySelector("canvas"),
      gl = canvas.getContext("webgl", {
        antialias: true,
        transparent: false
      });

function translate2(vertices, x, y) {
  for (let index = 0; index < vertices.length; index += 2) {
    vertices[(index + 0)] += x;
    vertices[(index + 1)] += y;
  }
  return vertices;
}

function concat2(...buffers) {
  const count = buffers.reduce((count,buffer) => {
    return count + buffer.length;
  }, 0);
  
  const vertices = new Float32Array(count);
  for (let index = 0; index < buffers.length; index++) {
    for (let subindex = 0; subindex < buffers[index].length; subindex++) {
      vertices[(index * buffers[index].length) + subindex] = buffers[index][subindex];
    }
  }
  return vertices;
}

function createStar(count = 5, inner = 0.20, outer = 0.75, phase = 0.0) {
  const scount = count * 2;
  const vertices = new Float32Array(scount * 2);
  for (let index = 0; index < scount; index++) {
    const a = ((index / scount) * Math.PI * 2);
    if (index % 2 === 0) {
      vertices[(index * 2) + 0] = Math.cos(a + phase) * outer;
      vertices[(index * 2) + 1] = Math.sin(a + phase) * outer;
    } else {
      vertices[(index * 2) + 0] = Math.cos(a + phase) * inner;
      vertices[(index * 2) + 1] = Math.sin(a + phase) * inner;
    }
  }
  return vertices;
}

function createPolygon(count = 72, radius = 0.75, phase = 0.0) {
  const vertices = new Float32Array(count * 2);
  for (let index = 0; index < count; index++) {
    const a = ((index / count) * Math.PI * 2);
    vertices[(index * 2) + 0] = Math.cos(a + phase) * radius;
    vertices[(index * 2) + 1] = Math.sin(a + phase) * radius;
  }
  return vertices;
}

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec2 position;

void main(void) {
  gl_Position = vec4(position.x, position.y, 0.0, 1.0);
}`);
gl.compileShader(vertexShader);

const vertexStatus = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
if (!vertexStatus) {
  const vertexError = gl.getShaderInfoLog(vertexShader);
  console.warn("Error in shader:" + vertexError);
  
  gl.deleteShader(vertexShader);
}

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision highp float;

void main(void) {
  gl_FragColor = vec4(0.0,0.75,1.0,1.0);
}`);
gl.compileShader(fragmentShader);

const fragmentStatus = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
if (!fragmentStatus) {
  const fragmentError = gl.getShaderInfoLog(fragmentShader);
  console.warn("Error in shader:" + fragmentError);
  
  gl.deleteShader(fragmentShader);
}

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
if (!linked) {
  const lastError = gl.getProgramInfoLog(program);
  console.warn("Error in program linking:" + lastError);

  gl.deleteProgram(program);
}

const COUNT = 6;

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, createPolygon(COUNT, 0.15), gl.STATIC_DRAW);

const attribPosition = gl.getAttribLocation(program, "position");
gl.vertexAttribPointer(attribPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(attribPosition);

gl.viewport(0,0,480,480);

gl.useProgram(program);

gl.clearColor(0.0,0.0,0.0,1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.lineWidth(1.5);

gl.drawArrays(gl.LINE_LOOP, 0, COUNT);

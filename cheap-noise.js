import GUI from 'lil-gui'

const WIDTH = 3584
const HEIGHT = 960

// ─── Params ───
const params = {
  scale: 0.4,
  ax: 5, ay: 7, az: 9, aw: 13,
  bx: 1, by: 1,
  color1: '#ffffff',
  color2: '#ffafaf',
  color3: '#0099ff',
  color4: '#aaffff',
  timeSpeed: 1.0,
}

// ─── WebGL Setup ───
const canvas = document.createElement('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT

const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
if (!gl) throw new Error('WebGL not supported')

// ─── Shaders ───
const VERT = `
  precision highp float;
  attribute vec4 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = position;
  }
`

const FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform float time;
  uniform float scale;
  uniform vec2 resolution;
  uniform vec3 color1, color2, color3, color4;
  uniform float ax, ay, az, aw;
  uniform float bx, by;

  float cheapNoise(vec3 stp) {
    vec3 p = vec3(stp.st, stp.p);
    vec4 a = vec4(ax, ay, az, aw);
    return mix(
      sin(p.z + p.x * a.x + cos(p.x * a.x - p.z)) *
      cos(p.z + p.y * a.y + cos(p.y * a.x + p.z)),
      sin(1. + p.x * a.z + p.z + cos(p.y * a.w - p.z)) *
      cos(1. + p.y * a.w + p.z + cos(p.x * a.x + p.z)),
      .436
    );
  }

  void main() {
    vec2 aR = vec2(resolution.x / resolution.y, 1.);
    vec2 st = vUv * aR * scale;
    float S = sin(time * .005);
    float C = cos(time * .005);
    vec2 v1 = vec2(cheapNoise(vec3(st, 2.)), cheapNoise(vec3(st, 1.)));
    vec2 v2 = vec2(
      cheapNoise(vec3(st + bx * v1 + vec2(C * 1.7, S * 9.2), 0.15 * time)),
      cheapNoise(vec3(st + by * v1 + vec2(S * 8.3, C * 2.8), 0.126 * time))
    );
    float n = .5 + .5 * cheapNoise(vec3(st + v2, 0.));

    vec3 color = mix(color1, color2, clamp((n * n) * 8., 0.0, 1.0));
    color = mix(color, color3, clamp(length(v1), 0.0, 1.0));
    color = mix(color, color4, clamp(length(v2.x), 0.0, 1.0));
    color /= n * n + n * 7.;
    gl_FragColor = vec4(color, 1.);
  }
`

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

const vs = compileShader(gl, gl.VERTEX_SHADER, VERT)
const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
const program = gl.createProgram()
gl.attachShader(program, vs)
gl.attachShader(program, fs)
gl.linkProgram(program)
gl.useProgram(program)

// ─── Geometry (fullscreen quad) ───
const posBuf = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, -1,
]), gl.STATIC_DRAW)
const posLoc = gl.getAttribLocation(program, 'position')
gl.enableVertexAttribArray(posLoc)
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

const uvBuf = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,
]), gl.STATIC_DRAW)
const uvLoc = gl.getAttribLocation(program, 'uv')
gl.enableVertexAttribArray(uvLoc)
gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0)

// ─── Uniform locations ───
const loc = {
  time: gl.getUniformLocation(program, 'time'),
  scale: gl.getUniformLocation(program, 'scale'),
  resolution: gl.getUniformLocation(program, 'resolution'),
  color1: gl.getUniformLocation(program, 'color1'),
  color2: gl.getUniformLocation(program, 'color2'),
  color3: gl.getUniformLocation(program, 'color3'),
  color4: gl.getUniformLocation(program, 'color4'),
  ax: gl.getUniformLocation(program, 'ax'),
  ay: gl.getUniformLocation(program, 'ay'),
  az: gl.getUniformLocation(program, 'az'),
  aw: gl.getUniformLocation(program, 'aw'),
  bx: gl.getUniformLocation(program, 'bx'),
  by: gl.getUniformLocation(program, 'by'),
}

function hexToRGB(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

// ─── GUI ───
const gui = new GUI({ title: 'Cheap Noise — LED' })
gui.add(params, 'scale', 0.1, 4, 0.01)
gui.add(params, 'timeSpeed', 0.1, 3, 0.01).name('time speed')

const colFolder = gui.addFolder('Colors')
colFolder.addColor(params, 'color1')
colFolder.addColor(params, 'color2')
colFolder.addColor(params, 'color3')
colFolder.addColor(params, 'color4')

const noiseFolder = gui.addFolder('Noise')
noiseFolder.add(params, 'ax', 1, 15, 0.01)
noiseFolder.add(params, 'ay', 1, 15, 0.01)
noiseFolder.add(params, 'az', 1, 15, 0.01)
noiseFolder.add(params, 'aw', 1, 15, 0.01)
noiseFolder.add(params, 'bx', -1, 1, 0.01)
noiseFolder.add(params, 'by', -1, 1, 0.01)

// ─── Render ───
let startTime = performance.now()
let animId = null
let active = false

function render() {
  if (!active) return
  const elapsed = (performance.now() - startTime) * params.timeSpeed

  gl.viewport(0, 0, WIDTH, HEIGHT)
  gl.uniform1f(loc.time, elapsed * 0.001)
  gl.uniform1f(loc.scale, params.scale)
  gl.uniform2f(loc.resolution, WIDTH, HEIGHT)
  gl.uniform3fv(loc.color1, hexToRGB(params.color1))
  gl.uniform3fv(loc.color2, hexToRGB(params.color2))
  gl.uniform3fv(loc.color3, hexToRGB(params.color3))
  gl.uniform3fv(loc.color4, hexToRGB(params.color4))
  gl.uniform1f(loc.ax, params.ax)
  gl.uniform1f(loc.ay, params.ay)
  gl.uniform1f(loc.az, params.az)
  gl.uniform1f(loc.aw, params.aw)
  gl.uniform1f(loc.bx, params.bx)
  gl.uniform1f(loc.by, params.by)

  gl.drawArrays(gl.TRIANGLES, 0, 6)
  animId = requestAnimationFrame(render)
}

function start() {
  active = true
  startTime = performance.now()
  gui.show()
  render()
}

function stop() {
  active = false
  gui.hide()
  if (animId) cancelAnimationFrame(animId)
}

// Start hidden
gui.hide()

export { canvas, start, stop, params, gui }

import GUI from 'lil-gui'

const WIDTH = 3584
const HEIGHT = 960

const params = {
  timeSpeed: 0.02,
  freqA: 50.0,
  freqB: 20.0,
  freqC: 30.0,
  freqD: 10.0,
  yFreq: 10.0,
  innerFreq: 50.0,
  innerTimeScale: 2.0,
}

const canvas = document.createElement('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT

const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })

const VERT = `
  attribute vec4 position;
  void main() { gl_Position = position; }
`

const FRAG = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float freqA, freqB, freqC, freqD;
  uniform float yFreq, innerFreq, innerTimeScale;

  void main(){
    vec2 coord = gl_FragCoord.xy / u_resolution.xy;
    float color = 0.0;
    color += sin(coord.x * freqA + cos(u_time + coord.y * yFreq + sin(coord.x * innerFreq + u_time * innerTimeScale))) * 2.0;
    color += cos(coord.x * freqB + sin(u_time + coord.y * yFreq + cos(coord.x * innerFreq + u_time * innerTimeScale))) * 2.0;
    color += sin(coord.x * freqC + cos(u_time + coord.y * yFreq + sin(coord.x * innerFreq + u_time * innerTimeScale))) * 2.0;
    color += cos(coord.x * freqD + sin(u_time + coord.y * yFreq + cos(coord.x * innerFreq + u_time * innerTimeScale))) * 2.0;
    gl_FragColor = vec4(vec3(color + coord.y, color + coord.x, color + coord.x + coord.y), 1.0);
  }
`

function compileShader(type, source) {
  const s = gl.createShader(type)
  gl.shaderSource(s, source)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s))
  return s
}

const program = gl.createProgram()
gl.attachShader(program, compileShader(gl.VERTEX_SHADER, VERT))
gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, FRAG))
gl.linkProgram(program)
gl.useProgram(program)

// Fullscreen quad
const buf = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buf)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, -1,1, 1,1, 1,1, 1,-1, -1,-1]), gl.STATIC_DRAW)
const posLoc = gl.getAttribLocation(program, 'position')
gl.enableVertexAttribArray(posLoc)
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

// Uniform locations
const loc = {
  u_time: gl.getUniformLocation(program, 'u_time'),
  u_resolution: gl.getUniformLocation(program, 'u_resolution'),
  freqA: gl.getUniformLocation(program, 'freqA'),
  freqB: gl.getUniformLocation(program, 'freqB'),
  freqC: gl.getUniformLocation(program, 'freqC'),
  freqD: gl.getUniformLocation(program, 'freqD'),
  yFreq: gl.getUniformLocation(program, 'yFreq'),
  innerFreq: gl.getUniformLocation(program, 'innerFreq'),
  innerTimeScale: gl.getUniformLocation(program, 'innerTimeScale'),
}

// GUI
const gui = new GUI({ title: 'Color Waves — LED' })
gui.add(params, 'timeSpeed', 0.001, 0.1, 0.001).name('time speed')

const freqFolder = gui.addFolder('Frequencies')
freqFolder.add(params, 'freqA', 1, 100, 0.1)
freqFolder.add(params, 'freqB', 1, 100, 0.1)
freqFolder.add(params, 'freqC', 1, 100, 0.1)
freqFolder.add(params, 'freqD', 1, 100, 0.1)
freqFolder.add(params, 'yFreq', 1, 50, 0.1).name('Y freq')
freqFolder.add(params, 'innerFreq', 1, 100, 0.1).name('inner freq')
freqFolder.add(params, 'innerTimeScale', 0.1, 5, 0.1).name('inner time scale')

let uTime = 0
let active = false
let animId = null

function render() {
  if (!active) return
  uTime += params.timeSpeed

  gl.viewport(0, 0, WIDTH, HEIGHT)
  gl.uniform1f(loc.u_time, uTime)
  gl.uniform2f(loc.u_resolution, WIDTH, HEIGHT)
  gl.uniform1f(loc.freqA, params.freqA)
  gl.uniform1f(loc.freqB, params.freqB)
  gl.uniform1f(loc.freqC, params.freqC)
  gl.uniform1f(loc.freqD, params.freqD)
  gl.uniform1f(loc.yFreq, params.yFreq)
  gl.uniform1f(loc.innerFreq, params.innerFreq)
  gl.uniform1f(loc.innerTimeScale, params.innerTimeScale)

  gl.drawArrays(gl.TRIANGLES, 0, 6)
  animId = requestAnimationFrame(render)
}

function start() {
  active = true
  gui.show()
  render()
}

function stop() {
  active = false
  gui.hide()
  if (animId) cancelAnimationFrame(animId)
}

gui.hide()

export { canvas, start, stop, params, gui }

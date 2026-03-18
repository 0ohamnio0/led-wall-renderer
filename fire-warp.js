import GUI from 'lil-gui'

const WIDTH = 3584
const HEIGHT = 960

const params = {
  timeSpeed: 1.0,
  scale: 1.0,
  warpDepth: 3, // how many fbm layers in pattern()
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
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;
  uniform float scale;

  float colormap_red(float x) {
    if (x < 0.0) return 54.0 / 255.0;
    else if (x < 20049.0 / 82979.0) return (829.79 * x + 54.51) / 255.0;
    else return 1.0;
  }

  float colormap_green(float x) {
    if (x < 20049.0 / 82979.0) return 0.0;
    else if (x < 327013.0 / 810990.0) return (8546482679670.0 / 10875673217.0 * x - 2064961390770.0 / 10875673217.0) / 255.0;
    else if (x <= 1.0) return (103806720.0 / 483977.0 * x + 19607415.0 / 483977.0) / 255.0;
    else return 1.0;
  }

  float colormap_blue(float x) {
    if (x < 0.0) return 54.0 / 255.0;
    else if (x < 7249.0 / 82979.0) return (829.79 * x + 54.51) / 255.0;
    else if (x < 20049.0 / 82979.0) return 127.0 / 255.0;
    else if (x < 327013.0 / 810990.0) return (792.02249341361393720147485376583 * x - 64.364790735602331034989206222672) / 255.0;
    else return 1.0;
  }

  vec4 colormap(float x) {
    return vec4(colormap_red(x), colormap_green(x), colormap_blue(x), 1.0);
  }

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res * res;
  }

  mat2 mtx = mat2(0.80, 0.60, -0.60, 0.80);

  float fbm(vec2 p) {
    float f = 0.0;
    f += 0.500000 * noise(p + iTime); p = mtx * p * 2.02;
    f += 0.031250 * noise(p);         p = mtx * p * 2.01;
    f += 0.250000 * noise(p);         p = mtx * p * 2.03;
    f += 0.125000 * noise(p);         p = mtx * p * 2.01;
    f += 0.062500 * noise(p);         p = mtx * p * 2.04;
    f += 0.015625 * noise(p + sin(iTime));
    return f / 0.96875;
  }

  float pattern(vec2 p) {
    return fbm(p + fbm(p + fbm(p)));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.x * scale;
    float shade = pattern(uv);
    gl_FragColor = vec4(colormap(shade).rgb, shade);
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

const buf = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buf)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, -1,1, 1,1, 1,1, 1,-1, -1,-1]), gl.STATIC_DRAW)
const posLoc = gl.getAttribLocation(program, 'position')
gl.enableVertexAttribArray(posLoc)
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

const loc = {
  iTime: gl.getUniformLocation(program, 'iTime'),
  iResolution: gl.getUniformLocation(program, 'iResolution'),
  scale: gl.getUniformLocation(program, 'scale'),
}

// GUI
const gui = new GUI({ title: 'Fire Warp fBM — LED' })
gui.add(params, 'timeSpeed', 0.1, 3, 0.01).name('time speed')
gui.add(params, 'scale', 0.1, 5, 0.01).name('scale')

let startTime = performance.now()
let active = false
let animId = null

function render() {
  if (!active) return
  const elapsed = (performance.now() - startTime) * 0.001 * params.timeSpeed

  gl.viewport(0, 0, WIDTH, HEIGHT)
  gl.uniform1f(loc.iTime, elapsed)
  gl.uniform2f(loc.iResolution, WIDTH, HEIGHT)
  gl.uniform1f(loc.scale, params.scale)

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

gui.hide()

export { canvas, start, stop, params, gui }

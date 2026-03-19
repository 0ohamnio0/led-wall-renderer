import GUI from "lil-gui";

// ═══════════════════════════════════════════
//  LED Wall Resolution (7층 기준)
//  Left: 256px × 960px | Door: 768px × 128px (top) + black | Right: 2560px × 960px
//  Total: 3584 × 960
// ═══════════════════════════════════════════
const WIDTH = 3584;
const HEIGHT = 960;

// Door black box region (middle section, below 128px strip)
// x: 256 ~ 1024, y: 0 ~ 832 (WebGL bottom-up coords)
const DOOR_X = 256;
const DOOR_W = 768;
const DOOR_Y = 0;
const DOOR_H = 832; // 960 - 128

const canvas = document.getElementById("c");
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Fit canvas to viewport while preserving aspect ratio
function fitCanvas() {
  const aspect = WIDTH / HEIGHT;
  const maxW = window.innerWidth - 40;
  const maxH = window.innerHeight - 100;
  let w = maxW;
  let h = w / aspect;
  if (h > maxH) { h = maxH; w = h * aspect; }
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
}
window.addEventListener("resize", fitCanvas);
fitCanvas();

const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true });
if (!gl) alert("WebGL2 not supported");

// --- Tunable parameters ---
const params = {
  baseColorR: 0.97,
  baseColorG: 2.0,
  baseColorB: 0.71,
  wispColorR: 2.91,
  wispColorG: 2.79,
  wispColorB: 2.54,
  caveSpeed: 1.0,
  twistAmount: 2.5,
  gyroidScale1: 6.0,
  gyroidScale2: 15.0,
  glowIntensity: 0.71,
  wispSize: 1.5,
  wispPulseSpeed: 0.79,
  reflectionDim: 0.34,
  exposure: 67000,
  maxSteps: 69,
  epsilon: 0.0037,
  saturation: 0.0,
  viewX: -0.45,
  viewY: 0.0,
};

// --- GUI ---
const gui = new GUI({ title: "Tunnelwisp" });

const fColor = gui.addFolder("Base Color");
fColor.add(params, "baseColorR", 0, 3, 0.01).name("R");
fColor.add(params, "baseColorG", 0, 3, 0.01).name("G");
fColor.add(params, "baseColorB", 0, 3, 0.01).name("B");

const fWisp = gui.addFolder("Wisp Color");
fWisp.add(params, "wispColorR", 0, 5, 0.01).name("R");
fWisp.add(params, "wispColorG", 0, 5, 0.01).name("G");
fWisp.add(params, "wispColorB", 0, 5, 0.01).name("B");

const fCave = gui.addFolder("Cave");
fCave.add(params, "caveSpeed", 0, 3, 0.01).name("Speed");
fCave.add(params, "twistAmount", 0, 6, 0.1).name("Twist");
fCave.add(params, "gyroidScale1", 1, 20, 0.5).name("Gyroid Scale 1");
fCave.add(params, "gyroidScale2", 1, 50, 0.5).name("Gyroid Scale 2");

const fView = gui.addFolder("View Offset");
fView.add(params, "viewX", -1, 1, 0.01).name("X");
fView.add(params, "viewY", -1, 1, 0.01).name("Y");

const fGlow = gui.addFolder("Glow");
fGlow.add(params, "glowIntensity", 0, 3, 0.01).name("Intensity");
fGlow.add(params, "wispSize", 0.1, 5, 0.1).name("Wisp Size");
fGlow.add(params, "wispPulseSpeed", 0, 3, 0.01).name("Pulse Speed");
fGlow.add(params, "reflectionDim", 0.01, 1, 0.01).name("Reflection Dim");

const fTone = gui.addFolder("Tone Mapping");
fTone.add(params, "exposure", 1e3, 1e6, 1e3).name("Exposure");
fTone.add(params, "maxSteps", 20, 150, 1).name("Max Steps");
fTone.add(params, "epsilon", 0, 0.01, 0.0001).name("Epsilon");
fTone.add(params, "saturation", 0, 1, 0.01).name("Saturation");

// --- Shaders ---
const vertSrc = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0, 1); }
`;

const fragSrc = `#version 300 es
precision highp float;
out vec4 O;

uniform vec2 iResolution;
uniform float iTime;

uniform vec3 u_baseColor;
uniform vec3 u_wispColor;
uniform float u_caveSpeed;
uniform float u_twistAmount;
uniform float u_gyroidScale1;
uniform float u_gyroidScale2;
uniform float u_glowIntensity;
uniform float u_wispSize;
uniform float u_wispPulseSpeed;
uniform float u_reflectionDim;
uniform float u_exposure;
uniform float u_maxSteps;
uniform float u_epsilon;
uniform float u_saturation;
uniform vec2 u_viewOffset;

// Door black box mask
uniform vec4 u_doorRect; // x, y, w, h in pixels

float g(vec4 p, float s) {
  return abs(dot(sin(p *= s), cos(p.zxwy)) - 1.) / s;
}

void main() {
  vec2 C = gl_FragCoord.xy;

  // Black box: door area
  if (C.x >= u_doorRect.x && C.x < u_doorRect.x + u_doorRect.z &&
      C.y >= u_doorRect.y && C.y < u_doorRect.y + u_doorRect.w) {
    O = vec4(0, 0, 0, 1);
    return;
  }

  float i, d, z, s, T = iTime;
  vec4 o = vec4(0), q, p;
  vec4 U = vec4(2, 1, 0, 3);
  vec2 r = iResolution.xy;

  for (
    i = 0.;
    ++i < u_maxSteps;
    z += d + u_epsilon,
    q = vec4(normalize(vec3(C - .5 * r + u_viewOffset * r.y, r.y)) * z, .2),
    q.z += T / (3e1 / u_caveSpeed),
    s = q.y + .1,
    q.y = abs(s),
    p = q,
    p.y -= .11,
    p.xy *= mat2(cos(11. * vec4(0, 1, 3, 0) + u_twistAmount * p.z)),
    p.y -= .2,
    d = abs(g(p, u_gyroidScale1) - g(p, u_gyroidScale2)) / 4.,
    p = 1. + cos(.7 * U + 5. * q.z)
  )
    o += u_glowIntensity * (s > 0. ? 1. : u_reflectionDim) * p.w * p / max(s > 0. ? d : d * d * d, 5e-4);

  float pulse = 1.4 + sin(T * u_wispPulseSpeed) * sin(1.7 * T * u_wispPulseSpeed) * sin(2.3 * T * u_wispPulseSpeed);
  o += pulse * 1e3 * vec4(u_wispColor, 1) / (length(q.xy) / u_wispSize);

  o.rgb *= u_baseColor;

  // Desaturation: luminance-based B&W mix
  vec4 mapped = tanh(o / u_exposure);
  float lum = dot(mapped.rgb, vec3(0.2126, 0.7152, 0.0722));
  mapped.rgb = mix(vec3(lum), mapped.rgb, u_saturation);

  O = mapped;
}
`;

// --- WebGL setup ---
function createShader(type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

const vs = createShader(gl.VERTEX_SHADER, vertSrc);
const fs = createShader(gl.FRAGMENT_SHADER, fragSrc);
const prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(prog));
}
gl.useProgram(prog);

// Fullscreen quad
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
const aPos = gl.getAttribLocation(prog, "a_pos");
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

// Uniform locations
const loc = {};
for (const name of [
  "iResolution", "iTime",
  "u_baseColor", "u_wispColor",
  "u_caveSpeed", "u_twistAmount", "u_gyroidScale1", "u_gyroidScale2",
  "u_glowIntensity", "u_wispSize", "u_wispPulseSpeed", "u_reflectionDim",
  "u_exposure", "u_maxSteps", "u_epsilon", "u_saturation", "u_viewOffset", "u_doorRect",
]) {
  loc[name] = gl.getUniformLocation(prog, name);
}

gl.viewport(0, 0, WIDTH, HEIGHT);

const start = performance.now();

function render() {
  const t = (performance.now() - start) / 1000;

  gl.uniform2f(loc.iResolution, WIDTH, HEIGHT);
  gl.uniform1f(loc.iTime, t);
  gl.uniform4f(loc.u_doorRect, DOOR_X, DOOR_Y, DOOR_W, DOOR_H);

  gl.uniform3f(loc.u_baseColor, params.baseColorR, params.baseColorG, params.baseColorB);
  gl.uniform3f(loc.u_wispColor, params.wispColorR, params.wispColorG, params.wispColorB);
  gl.uniform1f(loc.u_caveSpeed, params.caveSpeed);
  gl.uniform1f(loc.u_twistAmount, params.twistAmount);
  gl.uniform1f(loc.u_gyroidScale1, params.gyroidScale1);
  gl.uniform1f(loc.u_gyroidScale2, params.gyroidScale2);
  gl.uniform1f(loc.u_glowIntensity, params.glowIntensity);
  gl.uniform1f(loc.u_wispSize, params.wispSize);
  gl.uniform1f(loc.u_wispPulseSpeed, params.wispPulseSpeed);
  gl.uniform1f(loc.u_reflectionDim, params.reflectionDim);
  gl.uniform1f(loc.u_exposure, params.exposure);
  gl.uniform1f(loc.u_maxSteps, params.maxSteps);
  gl.uniform1f(loc.u_epsilon, params.epsilon);
  gl.uniform1f(loc.u_saturation, params.saturation);
  gl.uniform2f(loc.u_viewOffset, params.viewX, params.viewY);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  if (isRecording) tickRecording();
  requestAnimationFrame(render);
}

// ═══════════════════════════════════════════
//  Recording — WebM (1 min)
// ═══════════════════════════════════════════
const FPS = 30;
const DURATION = 60;
const TOTAL_FRAMES = FPS * DURATION;

let isRecording = false;
let recordedChunks = [];
let mediaRecorder = null;
let frameCount = 0;

const btnRecord = document.getElementById("btn-record");
const statusEl = document.getElementById("status");

btnRecord.addEventListener("click", () => {
  if (isRecording) stopRecording();
  else startRecording();
});

function startRecording() {
  const stream = canvas.captureStream(FPS);
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm;codecs=vp9",
    videoBitsPerSecond: 50_000_000,
  });
  recordedChunks = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };
  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tunnelwisp-${WIDTH}x${HEIGHT}-${DURATION}s.webm`;
    a.click();
    URL.revokeObjectURL(url);
    statusEl.textContent = "Done — file downloaded";
  };
  mediaRecorder.start(1000);
  isRecording = true;
  frameCount = 0;
  btnRecord.textContent = "■ STOP";
  btnRecord.classList.add("recording");
  statusEl.textContent = "Recording...";
  setTimeout(() => { if (isRecording) stopRecording(); }, DURATION * 1000);
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
  isRecording = false;
  btnRecord.textContent = "● REC (1 min)";
  btnRecord.classList.remove("recording");
}

function tickRecording() {
  frameCount++;
  const elapsed = frameCount / FPS;
  const mins = Math.floor(elapsed / 60);
  const secs = Math.floor(elapsed % 60);
  statusEl.textContent = `Recording ${mins}:${secs.toString().padStart(2, "0")} / 1:00  (${frameCount}/${TOTAL_FRAMES} frames)`;
}

render();

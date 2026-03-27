import GUI from "lil-gui";

// ═══════════════════════════════════════════
//  LED Wall Resolution (7층 기준)
//  Left: 256px × 960px | Door: 768px × 128px (top) + black | Right: 2560px × 960px
//  Total: 3584 × 960
// ═══════════════════════════════════════════
const WIDTH = 3584;
const HEIGHT = 960;

// Door black box region
const DOOR_X = 256;
const DOOR_W = 768;
const DOOR_Y = 0;
const DOOR_H = 832;

const canvas = document.getElementById("c");
canvas.width = WIDTH;
canvas.height = HEIGHT;

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

const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true, alpha: false });
if (!gl) alert("WebGL2 not supported");

// ═══════════════════════════════════════════
//  Scene Parameters
// ═══════════════════════════════════════════

const transition = {
  duration: 8.0,       // seconds per scene
  blendTime: 3.0,      // crossfade duration
  currentScene: 0,
  paused: true,
};

// Tunnelwisp params
const twParams = {
  baseColorR: 1.04, baseColorG: 0.96, baseColorB: 1.19,
  wispColorR: 2.91, wispColorG: 2.79, wispColorB: 2.54,
  caveSpeed: 1.0, twistAmount: 2.5,
  gyroidScale1: 6.0, gyroidScale2: 15.0,
  glowIntensity: 1.04,
  wispSize: 4.5, wispPulseSpeed: 0.49,
  reflectionDim: 0.39,
  exposure: 85000,
  maxSteps: 69, epsilon: 0.0037,
  saturation: 0.14,
  viewX: -0.45, viewY: 0.0,
  ambientLight: 0.04,
  fogDensity: 0.17,
  fogColorR: 0.28, fogColorG: 0.285, fogColorB: 0.29,
  shadowLift: 0.17,
  scatterAmount: 0.0008,
  ambientAccum: 0.007,
  shadowGamma: 4.2,
};

// Cheap Noise params
const cnParams = {
  scale: 0.35,
  ax: 4.36, ay: 5.86, az: 5.29, aw: 11.5,
  bx: 0.8, by: 0.8,
  color1R: 0.93, color1G: 0.93, color1B: 1.71,
  color2R: 1.4, color2G: 1.32, color2B: 1.2,
  color3R: 0.64, color3G: 0.8, color3B: 0.95,
  color4R: 0.9, color4G: 1.05, color4B: 1.19,
  timeSpeed: 2.0,
  brightness: 1.29,
  contrast: 0.54,
  saturation: 1.0,
  offsetX: -0.33, offsetY: 0.0,
  autoMove: true,
  autoAngle: 0.0,
  autoSpeed: 0.69,
};

// Fire Warp params
const fwParams = {
  timeSpeed: 0.54,
  scale: 5.0,
  brightness: 1.22,
  contrast: 0.83,
  saturation: 0.0,
  tintR: 1.08, tintG: 1.01, tintB: 0.56,
  colorShift: 0.0,
  hueRotate: 0.8,
  offsetX: 3.12, offsetY: 0.0,
  autoMove: true,
  autoAngle: 41.0,
  autoSpeed: 5.0,
};

// ═══════════════════════════════════════════
//  Shared Vertex Shader
// ═══════════════════════════════════════════
const vertSrc = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0, 1); }
`;

// ═══════════════════════════════════════════
//  Fragment Shaders
// ═══════════════════════════════════════════

// --- Tunnelwisp ---
const fragTunnelwisp = `#version 300 es
precision highp float;
out vec4 O;

uniform vec2 iResolution;
uniform float iTime;
uniform vec3 u_baseColor;
uniform vec3 u_wispColor;
uniform float u_caveSpeed, u_twistAmount;
uniform float u_gyroidScale1, u_gyroidScale2;
uniform float u_glowIntensity, u_wispSize, u_wispPulseSpeed;
uniform float u_reflectionDim, u_exposure;
uniform float u_maxSteps, u_epsilon, u_saturation;
uniform vec2 u_viewOffset;
uniform float u_ambientLight;
uniform float u_fogDensity;
uniform vec3 u_fogColor;
uniform float u_shadowLift;
uniform float u_scatterAmount;
uniform float u_ambientAccum;
uniform float u_shadowGamma;

float g(vec4 p, float s) {
  return abs(dot(sin(p *= s), cos(p.zxwy)) - 1.) / s;
}

void main() {
  vec2 C = gl_FragCoord.xy;
  float i, d, z, s, T = iTime;
  vec4 o = vec4(0), q, p;
  vec4 U = vec4(2, 1, 0, 3);
  vec2 r = iResolution.xy;
  float scatter = 0.0;

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
  ) {
    o += u_glowIntensity * (s > 0. ? 1. : u_reflectionDim) * p.w * p / max(s > 0. ? d : d * d * d, 5e-4);
    // Constant per-step ambient — fills voids regardless of surface distance
    o += u_ambientAccum * p;
    // Volumetric scatter
    scatter += u_scatterAmount * (1.0 + 0.5 * sin(q.z * 3.0 + T));
  }

  float pulse = 1.4 + sin(T * u_wispPulseSpeed) * sin(1.7 * T * u_wispPulseSpeed) * sin(2.3 * T * u_wispPulseSpeed);
  o += pulse * 1e3 * vec4(u_wispColor, 1) / (length(q.xy) / u_wispSize);

  o.rgb *= u_baseColor;

  // Add volumetric scatter
  o.rgb += scatter * u_fogColor * 8.0;

  // Tone mapping
  vec4 mapped = tanh(o / u_exposure);

  // Depth-based fog: blend toward fog color based on ray depth
  float fogFactor = 1.0 - exp(-u_fogDensity * z * 0.3);
  mapped.rgb = mix(mapped.rgb, u_fogColor, fogFactor);

  // Shadow gamma: apply gamma to dark regions only (< 0.5 threshold)
  // pow(x, 1/gamma) lifts darks; blend smoothly so brights stay untouched
  vec3 lifted = pow(max(mapped.rgb, vec3(0.001)), vec3(1.0 / u_shadowGamma));
  float brightness = max(mapped.r, max(mapped.g, mapped.b));
  float shadowMask = smoothstep(0.3, 0.0, brightness); // 1 in darks, 0 in brights
  mapped.rgb = mix(mapped.rgb, lifted, shadowMask);

  // Shadow lift
  mapped.rgb = mapped.rgb + u_shadowLift * (1.0 - mapped.rgb);

  // Ambient floor
  mapped.rgb = max(mapped.rgb, vec3(u_ambientLight));

  float lum = dot(mapped.rgb, vec3(0.2126, 0.7152, 0.0722));
  mapped.rgb = mix(vec3(lum), mapped.rgb, u_saturation);

  O = mapped;
}
`;

// --- Cheap Noise ---
const fragCheapNoise = `#version 300 es
precision highp float;
out vec4 O;

uniform vec2 iResolution;
uniform float iTime;
uniform float u_scale;
uniform float u_ax, u_ay, u_az, u_aw;
uniform float u_bx, u_by;
uniform vec2 u_offset;
uniform vec3 u_color1, u_color2, u_color3, u_color4;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;

float cheapNoise(vec3 stp) {
  vec3 p = stp;
  vec4 a = vec4(u_ax, u_ay, u_az, u_aw);
  return mix(
    sin(p.z + p.x * a.x + cos(p.x * a.x - p.z)) *
    cos(p.z + p.y * a.y + cos(p.y * a.x + p.z)),
    sin(1. + p.x * a.z + p.z + cos(p.y * a.w - p.z)) *
    cos(1. + p.y * a.w + p.z + cos(p.x * a.x + p.z)),
    .436
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 aR = vec2(iResolution.x / iResolution.y, 1.);
  vec2 st = (uv + u_offset) * aR * u_scale;
  float S = sin(iTime * .005);
  float C = cos(iTime * .005);
  vec2 v1 = vec2(cheapNoise(vec3(st, 2.)), cheapNoise(vec3(st, 1.)));
  vec2 v2 = vec2(
    cheapNoise(vec3(st + u_bx * v1 + vec2(C * 1.7, S * 9.2), 0.15 * iTime)),
    cheapNoise(vec3(st + u_by * v1 + vec2(S * 8.3, C * 2.8), 0.126 * iTime))
  );
  float n = .5 + .5 * cheapNoise(vec3(st + v2, 0.));

  vec3 color = mix(u_color1, u_color2, clamp((n * n) * 8., 0.0, 1.0));
  color = mix(color, u_color3, clamp(length(v1), 0.0, 1.0));
  color = mix(color, u_color4, clamp(length(v2.x), 0.0, 1.0));
  color /= n * n + n * 7.;
  // Brightness & contrast
  color = (color - 0.5) * u_contrast + 0.5;
  color *= u_brightness;
  float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(lum), color, u_saturation);
  O = vec4(max(color, vec3(0.0)), 1.);
}
`;

// --- Fire Warp ---
const fragFireWarp = `#version 300 es
precision highp float;
out vec4 O;

uniform vec2 iResolution;
uniform float iTime;
uniform float u_scale;
uniform float u_brightness;
uniform float u_contrast;
uniform vec3 u_tint;
uniform float u_colorShift;
uniform float u_saturation;
uniform float u_hueRotate;
uniform vec2 u_offset;

vec3 rgb2hsl(vec3 c) {
  float mx = max(c.r, max(c.g, c.b));
  float mn = min(c.r, min(c.g, c.b));
  float l = (mx + mn) * 0.5;
  if (mx == mn) return vec3(0.0, 0.0, l);
  float d = mx - mn;
  float s = l > 0.5 ? d / (2.0 - mx - mn) : d / (mx + mn);
  float h;
  if (mx == c.r) h = (c.g - c.b) / d + (c.g < c.b ? 6.0 : 0.0);
  else if (mx == c.g) h = (c.b - c.r) / d + 2.0;
  else h = (c.r - c.g) / d + 4.0;
  return vec3(h / 6.0, s, l);
}

float hue2rgb(float p, float q, float t) {
  if (t < 0.0) t += 1.0;
  if (t > 1.0) t -= 1.0;
  if (t < 1.0/6.0) return p + (q - p) * 6.0 * t;
  if (t < 1.0/2.0) return q;
  if (t < 2.0/3.0) return p + (q - p) * (2.0/3.0 - t) * 6.0;
  return p;
}

vec3 hsl2rgb(vec3 c) {
  if (c.y == 0.0) return vec3(c.z);
  float q = c.z < 0.5 ? c.z * (1.0 + c.y) : c.z + c.y - c.z * c.y;
  float p = 2.0 * c.z - q;
  return vec3(
    hue2rgb(p, q, c.x + 1.0/3.0),
    hue2rgb(p, q, c.x),
    hue2rgb(p, q, c.x - 1.0/3.0)
  );
}

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

float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);
  return mix(
    mix(rand(ip), rand(ip + vec2(1,0)), u.x),
    mix(rand(ip + vec2(0,1)), rand(ip + vec2(1,1)), u.x), u.y);
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

float pattern(vec2 p) { return fbm(p + fbm(p + fbm(p))); }

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.x * u_scale + u_offset;
  float shade = pattern(uv);
  // Apply color shift to colormap input
  float shifted = fract(shade + u_colorShift);
  vec3 color = colormap(shifted).rgb;
  // Hue rotation
  if (u_hueRotate != 0.0) {
    vec3 hsl = rgb2hsl(color);
    hsl.x = fract(hsl.x + u_hueRotate);
    color = hsl2rgb(hsl);
  }
  // Brightness, contrast, tint
  color = (color - 0.5) * u_contrast + 0.5;
  color *= u_brightness * u_tint;
  // Saturation
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luma), color, u_saturation);
  O = vec4(max(color, vec3(0.0)), 1.0);
}
`;

// --- Composite (blend two scenes + door mask) ---
const fragComposite = `#version 300 es
precision highp float;
out vec4 O;

uniform sampler2D u_texA;
uniform sampler2D u_texB;
uniform float u_blend;  // 0 = full A, 1 = full B
uniform vec2 iResolution;
uniform vec4 u_doorRect;

void main() {
  vec2 C = gl_FragCoord.xy;

  vec2 uv = C / iResolution;
  vec4 a = texture(u_texA, uv);
  vec4 b = texture(u_texB, uv);
  O = mix(a, b, u_blend);
}
`;

// ═══════════════════════════════════════════
//  WebGL Helpers
// ═══════════════════════════════════════════

function createShader(type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

function createProgram(fragSrc) {
  const vs = createShader(gl.VERTEX_SHADER, vertSrc);
  const fs = createShader(gl.FRAGMENT_SHADER, fragSrc);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(prog));
  }
  return prog;
}

function getUniforms(prog, names) {
  const locs = {};
  for (const n of names) locs[n] = gl.getUniformLocation(prog, n);
  return locs;
}

function createFBO() {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { fbo, tex };
}

// ═══════════════════════════════════════════
//  Build Programs & FBOs
// ═══════════════════════════════════════════

const progTW = createProgram(fragTunnelwisp);
const locTW = getUniforms(progTW, [
  "iResolution", "iTime", "u_baseColor", "u_wispColor",
  "u_caveSpeed", "u_twistAmount", "u_gyroidScale1", "u_gyroidScale2",
  "u_glowIntensity", "u_wispSize", "u_wispPulseSpeed", "u_reflectionDim",
  "u_exposure", "u_maxSteps", "u_epsilon", "u_saturation", "u_viewOffset",
  "u_ambientLight", "u_fogDensity", "u_fogColor", "u_shadowLift", "u_scatterAmount",
  "u_ambientAccum", "u_shadowGamma",
]);

const progCN = createProgram(fragCheapNoise);
const locCN = getUniforms(progCN, [
  "iResolution", "iTime", "u_scale",
  "u_ax", "u_ay", "u_az", "u_aw", "u_bx", "u_by",
  "u_color1", "u_color2", "u_color3", "u_color4",
  "u_brightness", "u_contrast", "u_saturation", "u_offset",
]);

const progFW = createProgram(fragFireWarp);
const locFW = getUniforms(progFW, [
  "iResolution", "iTime", "u_scale",
  "u_brightness", "u_contrast", "u_tint", "u_colorShift",
  "u_hueRotate", "u_saturation", "u_offset",
]);

const progComp = createProgram(fragComposite);
const locComp = getUniforms(progComp, [
  "u_texA", "u_texB", "u_blend", "iResolution", "u_doorRect",
]);

// FBOs for each scene
const fboA = createFBO();
const fboB = createFBO();

// Fullscreen quad
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

function bindQuad(prog) {
  const aPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
}

// ═══════════════════════════════════════════
//  Scene Render Functions
// ═══════════════════════════════════════════

const scenes = ["tunnelwisp", "cheapnoise", "firewarp"];
const sceneNames = ["Tunnelwisp", "Cheap Noise", "Fire Warp"];

function renderTunnelwisp(t) {
  gl.useProgram(progTW);
  bindQuad(progTW);
  gl.uniform2f(locTW.iResolution, WIDTH, HEIGHT);
  gl.uniform1f(locTW.iTime, t);
  gl.uniform3f(locTW.u_baseColor, twParams.baseColorR, twParams.baseColorG, twParams.baseColorB);
  gl.uniform3f(locTW.u_wispColor, twParams.wispColorR, twParams.wispColorG, twParams.wispColorB);
  gl.uniform1f(locTW.u_caveSpeed, twParams.caveSpeed);
  gl.uniform1f(locTW.u_twistAmount, twParams.twistAmount);
  gl.uniform1f(locTW.u_gyroidScale1, twParams.gyroidScale1);
  gl.uniform1f(locTW.u_gyroidScale2, twParams.gyroidScale2);
  gl.uniform1f(locTW.u_glowIntensity, twParams.glowIntensity);
  gl.uniform1f(locTW.u_wispSize, twParams.wispSize);
  gl.uniform1f(locTW.u_wispPulseSpeed, twParams.wispPulseSpeed);
  gl.uniform1f(locTW.u_reflectionDim, twParams.reflectionDim);
  gl.uniform1f(locTW.u_exposure, twParams.exposure);
  gl.uniform1f(locTW.u_maxSteps, twParams.maxSteps);
  gl.uniform1f(locTW.u_epsilon, twParams.epsilon);
  gl.uniform1f(locTW.u_saturation, twParams.saturation);
  gl.uniform2f(locTW.u_viewOffset, twParams.viewX, twParams.viewY);
  gl.uniform1f(locTW.u_ambientLight, twParams.ambientLight);
  gl.uniform1f(locTW.u_fogDensity, twParams.fogDensity);
  gl.uniform3f(locTW.u_fogColor, twParams.fogColorR, twParams.fogColorG, twParams.fogColorB);
  gl.uniform1f(locTW.u_shadowLift, twParams.shadowLift);
  gl.uniform1f(locTW.u_scatterAmount, twParams.scatterAmount);
  gl.uniform1f(locTW.u_ambientAccum, twParams.ambientAccum);
  gl.uniform1f(locTW.u_shadowGamma, twParams.shadowGamma);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function renderCheapNoise(t) {
  gl.useProgram(progCN);
  bindQuad(progCN);
  gl.uniform2f(locCN.iResolution, WIDTH, HEIGHT);
  gl.uniform1f(locCN.iTime, t * cnParams.timeSpeed);
  gl.uniform1f(locCN.u_scale, cnParams.scale);
  gl.uniform1f(locCN.u_ax, cnParams.ax);
  gl.uniform1f(locCN.u_ay, cnParams.ay);
  gl.uniform1f(locCN.u_az, cnParams.az);
  gl.uniform1f(locCN.u_aw, cnParams.aw);
  gl.uniform1f(locCN.u_bx, cnParams.bx);
  gl.uniform1f(locCN.u_by, cnParams.by);
  gl.uniform3f(locCN.u_color1, cnParams.color1R, cnParams.color1G, cnParams.color1B);
  gl.uniform3f(locCN.u_color2, cnParams.color2R, cnParams.color2G, cnParams.color2B);
  gl.uniform3f(locCN.u_color3, cnParams.color3R, cnParams.color3G, cnParams.color3B);
  gl.uniform3f(locCN.u_color4, cnParams.color4R, cnParams.color4G, cnParams.color4B);
  gl.uniform1f(locCN.u_brightness, cnParams.brightness);
  gl.uniform1f(locCN.u_contrast, cnParams.contrast);
  gl.uniform1f(locCN.u_saturation, cnParams.saturation);
  // Auto move: accumulate offset over time
  if (cnParams.autoMove) {
    const rad = cnParams.autoAngle * Math.PI / 180;
    cnParams.offsetX += Math.cos(rad) * cnParams.autoSpeed * 0.001;
    cnParams.offsetY += Math.sin(rad) * cnParams.autoSpeed * 0.001;
  }
  gl.uniform2f(locCN.u_offset, cnParams.offsetX, cnParams.offsetY);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function renderFireWarp(t) {
  gl.useProgram(progFW);
  bindQuad(progFW);
  gl.uniform2f(locFW.iResolution, WIDTH, HEIGHT);
  gl.uniform1f(locFW.iTime, t * fwParams.timeSpeed);
  gl.uniform1f(locFW.u_scale, fwParams.scale);
  gl.uniform1f(locFW.u_brightness, fwParams.brightness);
  gl.uniform1f(locFW.u_contrast, fwParams.contrast);
  gl.uniform3f(locFW.u_tint, fwParams.tintR, fwParams.tintG, fwParams.tintB);
  gl.uniform1f(locFW.u_colorShift, fwParams.colorShift);
  gl.uniform1f(locFW.u_hueRotate, fwParams.hueRotate);
  gl.uniform1f(locFW.u_saturation, fwParams.saturation);
  if (fwParams.autoMove) {
    const rad = fwParams.autoAngle * Math.PI / 180;
    fwParams.offsetX += Math.cos(rad) * fwParams.autoSpeed * 0.001;
    fwParams.offsetY += Math.sin(rad) * fwParams.autoSpeed * 0.001;
  }
  gl.uniform2f(locFW.u_offset, fwParams.offsetX, fwParams.offsetY);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

const renderFns = [renderTunnelwisp, renderCheapNoise, renderFireWarp];

// ═══════════════════════════════════════════
//  GUI
// ═══════════════════════════════════════════

const gui = new GUI({ title: "LED Wall Renderer" });

const fTrans = gui.addFolder("Transition");
fTrans.add(transition, "duration", 3, 60, 0.5).name("Scene Duration (s)");
fTrans.add(transition, "blendTime", 1, 10, 0.5).name("Blend Time (s)");
fTrans.add(transition, "paused").name("Pause Transition");
fTrans.add({ prev() { manualSwitch(-1); }, }, "prev").name("◀ Prev");
fTrans.add({ next() { manualSwitch(1); }, }, "next").name("Next ▶");

const fTW = gui.addFolder("Tunnelwisp");
const fTWColor = fTW.addFolder("Base Color");
fTWColor.add(twParams, "baseColorR", 0, 3, 0.01).name("R");
fTWColor.add(twParams, "baseColorG", 0, 3, 0.01).name("G");
fTWColor.add(twParams, "baseColorB", 0, 3, 0.01).name("B");
const fTWWisp = fTW.addFolder("Wisp");
fTWWisp.add(twParams, "wispColorR", 0, 5, 0.01).name("R");
fTWWisp.add(twParams, "wispColorG", 0, 5, 0.01).name("G");
fTWWisp.add(twParams, "wispColorB", 0, 5, 0.01).name("B");
fTWWisp.add(twParams, "wispSize", 0.1, 5, 0.1).name("Size");
fTWWisp.add(twParams, "wispPulseSpeed", 0, 3, 0.01).name("Pulse Speed");
const fTWCave = fTW.addFolder("Cave");
fTWCave.add(twParams, "caveSpeed", 0, 3, 0.01).name("Speed");
fTWCave.add(twParams, "twistAmount", 0, 6, 0.1).name("Twist");
fTWCave.add(twParams, "gyroidScale1", 1, 20, 0.5).name("Gyroid 1");
fTWCave.add(twParams, "gyroidScale2", 1, 50, 0.5).name("Gyroid 2");
const fTWTone = fTW.addFolder("Tone");
fTWTone.add(twParams, "glowIntensity", 0, 3, 0.01).name("Glow");
fTWTone.add(twParams, "reflectionDim", 0.01, 1, 0.01).name("Reflection");
fTWTone.add(twParams, "exposure", 1e3, 1e6, 1e3).name("Exposure");
fTWTone.add(twParams, "ambientLight", 0, 0.2, 0.005).name("Ambient Floor");
fTWTone.add(twParams, "saturation", 0, 1, 0.01).name("Saturation");
fTWTone.add(twParams, "maxSteps", 20, 150, 1).name("Max Steps");
const fTWFog = fTW.addFolder("Fog & Scatter");
fTWFog.add(twParams, "fogDensity", 0, 1.5, 0.01).name("Fog Density");
fTWFog.add(twParams, "fogColorR", 0, 0.5, 0.005).name("Fog R");
fTWFog.add(twParams, "fogColorG", 0, 0.5, 0.005).name("Fog G");
fTWFog.add(twParams, "fogColorB", 0, 0.5, 0.005).name("Fog B");
fTWFog.add(twParams, "shadowLift", 0, 0.2, 0.005).name("Shadow Lift");
fTWFog.add(twParams, "scatterAmount", 0, 0.005, 0.0001).name("Scatter");
fTWFog.add(twParams, "ambientAccum", 0, 0.05, 0.001).name("Ambient Accum");
fTWFog.add(twParams, "shadowGamma", 1, 5, 0.1).name("Shadow Gamma");
fTW.close();

const fCN = gui.addFolder("Cheap Noise");
fCN.add(cnParams, "scale", 0.1, 4, 0.01).name("Scale");
fCN.add(cnParams, "timeSpeed", 0.1, 3, 0.01).name("Speed");
fCN.add(cnParams, "brightness", 0.1, 3, 0.01).name("Brightness");
fCN.add(cnParams, "contrast", 0.1, 3, 0.01).name("Contrast");
fCN.add(cnParams, "saturation", 0, 3, 0.01).name("Saturation");
fCN.add(cnParams, "offsetX", -10, 10, 0.01).name("Offset X");
fCN.add(cnParams, "offsetY", -10, 10, 0.01).name("Offset Y");
fCN.add(cnParams, "autoMove").name("Auto Move");
fCN.add(cnParams, "autoAngle", 0, 360, 1).name("Move Angle");
fCN.add(cnParams, "autoSpeed", 0.01, 5, 0.01).name("Move Speed");
const fCNNoise = fCN.addFolder("Noise");
fCNNoise.add(cnParams, "ax", 1, 15, 0.01).name("ax");
fCNNoise.add(cnParams, "ay", 1, 15, 0.01).name("ay");
fCNNoise.add(cnParams, "az", 1, 15, 0.01).name("az");
fCNNoise.add(cnParams, "aw", 1, 15, 0.01).name("aw");
fCNNoise.add(cnParams, "bx", -1, 1, 0.01).name("bx");
fCNNoise.add(cnParams, "by", -1, 1, 0.01).name("by");
const fCNCol1 = fCN.addFolder("Color 1");
fCNCol1.add(cnParams, "color1R", 0, 2, 0.01).name("R");
fCNCol1.add(cnParams, "color1G", 0, 2, 0.01).name("G");
fCNCol1.add(cnParams, "color1B", 0, 2, 0.01).name("B");
const fCNCol2 = fCN.addFolder("Color 2");
fCNCol2.add(cnParams, "color2R", 0, 2, 0.01).name("R");
fCNCol2.add(cnParams, "color2G", 0, 2, 0.01).name("G");
fCNCol2.add(cnParams, "color2B", 0, 2, 0.01).name("B");
const fCNCol3 = fCN.addFolder("Color 3");
fCNCol3.add(cnParams, "color3R", 0, 2, 0.01).name("R");
fCNCol3.add(cnParams, "color3G", 0, 2, 0.01).name("G");
fCNCol3.add(cnParams, "color3B", 0, 2, 0.01).name("B");
const fCNCol4 = fCN.addFolder("Color 4");
fCNCol4.add(cnParams, "color4R", 0, 2, 0.01).name("R");
fCNCol4.add(cnParams, "color4G", 0, 2, 0.01).name("G");
fCNCol4.add(cnParams, "color4B", 0, 2, 0.01).name("B");
fCN.close();

const fFW = gui.addFolder("Fire Warp");
fFW.add(fwParams, "scale", 0.1, 5, 0.01).name("Scale");
fFW.add(fwParams, "timeSpeed", 0.1, 3, 0.01).name("Speed");
fFW.add(fwParams, "brightness", 0.1, 3, 0.01).name("Brightness");
fFW.add(fwParams, "contrast", 0.1, 3, 0.01).name("Contrast");
fFW.add(fwParams, "saturation", 0, 3, 0.01).name("Saturation");
fFW.add(fwParams, "colorShift", 0, 1, 0.01).name("Color Shift");
fFW.add(fwParams, "hueRotate", 0, 1, 0.01).name("Hue Rotate");
fFW.add(fwParams, "offsetX", -10, 10, 0.01).name("Offset X");
fFW.add(fwParams, "offsetY", -10, 10, 0.01).name("Offset Y");
fFW.add(fwParams, "autoMove").name("Auto Move");
fFW.add(fwParams, "autoAngle", 0, 360, 1).name("Move Angle");
fFW.add(fwParams, "autoSpeed", 0.01, 5, 0.01).name("Move Speed");
const fFWTint = fFW.addFolder("Tint");
fFWTint.add(fwParams, "tintR", 0, 2, 0.01).name("R");
fFWTint.add(fwParams, "tintG", 0, 2, 0.01).name("G");
fFWTint.add(fwParams, "tintB", 0, 2, 0.01).name("B");
fFW.close();

// ═══════════════════════════════════════════
//  Transition Logic
// ═══════════════════════════════════════════

let transitionTime = 0;
let sceneIndex = 0;

function manualSwitch(dir) {
  sceneIndex = (sceneIndex + dir + scenes.length) % scenes.length;
  transitionTime = 0;
  transition.currentScene = sceneIndex;
}

function getBlendState(t) {
  const totalCycle = transition.duration + transition.blendTime;

  if (transition.paused) {
    return { idxA: sceneIndex, idxB: sceneIndex, blend: 0 };
  }

  const cycleTime = t % (totalCycle * scenes.length);
  const currentCycleIndex = Math.floor(cycleTime / totalCycle);
  const timeInCycle = cycleTime - currentCycleIndex * totalCycle;

  const idxA = currentCycleIndex % scenes.length;
  const idxB = (currentCycleIndex + 1) % scenes.length;

  if (timeInCycle < transition.duration) {
    // Holding scene A
    sceneIndex = idxA;
    return { idxA, idxB: idxA, blend: 0 };
  } else {
    // Blending A → B
    const blendProgress = (timeInCycle - transition.duration) / transition.blendTime;
    // Smooth ease in-out
    const blend = blendProgress * blendProgress * (3 - 2 * blendProgress);
    sceneIndex = idxA;
    return { idxA, idxB, blend };
  }
}

// ═══════════════════════════════════════════
//  Render Loop
// ═══════════════════════════════════════════

gl.viewport(0, 0, WIDTH, HEIGHT);
const start = performance.now();
let recFrame = 0;  // fixed-timestep frame counter for recording

function render() {
  // When recording, use fixed timestep (1/30s per frame) for smooth playback
  // When previewing, use real time
  const t = isRecording
    ? recFrame / FPS
    : (performance.now() - start) / 1000;
  const state = getBlendState(t);

  if (state.blend === 0 && state.idxA === state.idxB) {
    // No blend needed — render directly to screen with door mask via composite
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboA.fbo);
    gl.viewport(0, 0, WIDTH, HEIGHT);
    renderFns[state.idxA](t);

    // Composite pass (applies door mask)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, WIDTH, HEIGHT);
    gl.useProgram(progComp);
    bindQuad(progComp);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fboA.tex);
    gl.uniform1i(locComp.u_texA, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, fboA.tex);
    gl.uniform1i(locComp.u_texB, 1);
    gl.uniform1f(locComp.u_blend, 0);
    gl.uniform2f(locComp.iResolution, WIDTH, HEIGHT);
    gl.uniform4f(locComp.u_doorRect, DOOR_X, DOOR_Y, DOOR_W, DOOR_H);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  } else {
    // Render scene A to FBO A
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboA.fbo);
    gl.viewport(0, 0, WIDTH, HEIGHT);
    renderFns[state.idxA](t);

    // Render scene B to FBO B
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboB.fbo);
    gl.viewport(0, 0, WIDTH, HEIGHT);
    renderFns[state.idxB](t);

    // Composite blend + door mask
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, WIDTH, HEIGHT);
    gl.useProgram(progComp);
    bindQuad(progComp);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fboA.tex);
    gl.uniform1i(locComp.u_texA, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, fboB.tex);
    gl.uniform1i(locComp.u_texB, 1);
    gl.uniform1f(locComp.u_blend, state.blend);
    gl.uniform2f(locComp.iResolution, WIDTH, HEIGHT);
    gl.uniform4f(locComp.u_doorRect, DOOR_X, DOOR_Y, DOOR_W, DOOR_H);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // Update status with current scene info
  if (!isRecording) {
    const { idxA, idxB, blend } = state;
    if (blend > 0) {
      statusEl.textContent = `${sceneNames[idxA]} → ${sceneNames[idxB]} (${Math.round(blend * 100)}%)`;
    } else {
      statusEl.textContent = `${sceneNames[idxA]} — 3584×960 LED`;
    }
  }

  if (isRecording) {
    captureFrame();
    recFrame++;
  }
  requestAnimationFrame(render);
}

// ═══════════════════════════════════════════
//  Recording — WebP Image Sequence
//  Writes frames directly to disk via File System Access API
// ═══════════════════════════════════════════

const FPS = 30;
const DURATION = 240;
const TOTAL_FRAMES = FPS * DURATION;
const WEBP_QUALITY = 0.92;

let isRecording = false;
let frameCount = 0;
let dirHandle = null;
let writeQueue = [];
let isWriting = false;
let pendingWrites = 0;

const btnRecord = document.getElementById("btn-record");
const statusEl = document.getElementById("status");

btnRecord.addEventListener("click", () => {
  if (isRecording) stopRecording();
  else startRecording();
});

async function startRecording() {
  try {
    dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
  } catch (e) {
    statusEl.textContent = "Cancelled — no folder selected";
    return;
  }

  isRecording = true;
  frameCount = 0;
  recFrame = 0;
  pendingWrites = 0;
  writeQueue = [];
  btnRecord.textContent = "■ STOP";
  btnRecord.classList.add("recording");
  statusEl.textContent = "Recording...";
}

async function stopRecording() {
  isRecording = false;
  btnRecord.textContent = "...";

  // Flush remaining writes
  if (writeQueue.length > 0 || pendingWrites > 0) {
    statusEl.textContent = `Flushing ${writeQueue.length + pendingWrites} remaining frames...`;
    await processQueue();
    // Wait for all pending writes
    while (pendingWrites > 0) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  btnRecord.textContent = "● REC (4 min)";
  btnRecord.classList.remove("recording");
  statusEl.textContent = `Done — ${frameCount} WebP frames saved to folder`;
  dirHandle = null;
}

function captureFrame() {
  const num = frameCount;
  canvas.toBlob((blob) => {
    if (!blob) return;
    writeQueue.push({ name: `frame_${num.toString().padStart(5, "0")}.webp`, blob });
    processQueue();
  }, "image/webp", WEBP_QUALITY);

  frameCount++;
  const elapsed = frameCount / FPS;
  const mins = Math.floor(elapsed / 60);
  const secs = Math.floor(elapsed % 60);
  const queued = writeQueue.length + pendingWrites;
  statusEl.textContent = `Recording ${mins}:${secs.toString().padStart(2, "0")} / 4:00  (${frameCount}/${TOTAL_FRAMES} frames${queued > 0 ? `, ${queued} writing` : ""})`;

  if (frameCount >= TOTAL_FRAMES) stopRecording();
}

async function processQueue() {
  if (isWriting) return;
  isWriting = true;
  while (writeQueue.length > 0) {
    const { name, blob } = writeQueue.shift();
    pendingWrites++;
    try {
      const fh = await dirHandle.getFileHandle(name, { create: true });
      const writable = await fh.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (e) {
      console.error("Write error:", name, e);
    }
    pendingWrites--;
  }
  isWriting = false;
}

render();

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
  duration: 60.0,      // seconds per scene (1 min each)
  blendTime: 7.0,      // crossfade duration
  currentScene: 0,
  paused: true,
};

// Tunnelwisp params
const twParams = {
  baseColorR: 0.92, baseColorG: 0.88, baseColorB: 0.84,
  wispColorR: 2.25, wispColorG: 3.76, wispColorB: 4.15,
  caveSpeed: 1.0, twistAmount: 2.5,
  gyroidScale1: 6.5, gyroidScale2: 15.0,
  glowIntensity: 1.12,
  wispSize: 2.0, wispPulseSpeed: 0.49,
  reflectionDim: 0.51,
  exposure: 216000,
  maxSteps: 69, epsilon: 0.0037,
  saturation: 0.18,
  viewX: -0.45, viewY: 0.0,
  ambientLight: 0.04,
  fogDensity: 0.17,
  fogColorR: 0.24, fogColorG: 0.23, fogColorB: 0.22,
  shadowLift: 0.17,
  scatterAmount: 0.0008,
  ambientAccum: 0.007,
  shadowGamma: 4.2,
};

// Cheap Noise params
const cnParams = {
  scale: 0.26,
  ax: 4.74, ay: 6.2, az: 3.09, aw: 10.6,
  bx: 2.5, by: 2.5,
  color1R: 1.42, color1G: 1.08, color1B: 0.69,
  color2R: 1.1, color2G: 0.69, color2B: 0.98,
  color3R: 0.87, color3G: 1.42, color3B: 1.56,
  color4R: 1.66, color4G: 0.46, color4B: 0.91,
  timeSpeed: 1.16,
  brightness: 0.97,
  contrast: 0.54,
  saturation: 0.15,
  offsetX: -1.55, offsetY: -0.57,
  autoMove: true,
  autoAngle: 33.0,
  autoSpeed: 0.7,
  waveAmp: 0.08,
  waveFreq: 1.2,
  waveSpeed: 0.26,
  zoomAnim: true,
  zoomMax: 1.2,
  zoomCycle: 8.0,
};

// Domain Warp params
const fwParams = {
  timeSpeed: 0.1,
  scale: 1.08,
  zoom: 1.21,
  aspect: 0.68,
  brightness: 0.9,
  contrast: 0.4,
  saturation: 0.16,
  tintR: 1.29, tintG: 1.16, tintB: 1.03,
  offsetX: -0.33, offsetY: -0.33,
  autoMove: true,
  autoAngle: 72.0,
  autoSpeed: 2.0,
};


// Bloom Corridor params
const bcParams = {
  timeSpeed: 0.23,
  cameraSpeed: 0.155,
  cameraDepth: 0.86,
  pathAmpX: 0.25,
  pathAmpY: 0.01,
  pathFreqX: 2.2,
  pathFreqY: 1.2,
  pathPhaseY: 1.57,
  rayTwistSpeed: 0.58,
  maxSteps: 29,
  maxDist: 30.0,
  epsilon: 0.0005,
  twistX: 6.05,
  twistY: 7.0,
  twistBands: 1.75,
  planesDistance: 0.74,
  smoothMin: 0.6,
  wallWarpAmp: 0.35,
  wallWarpZFreq: 3.0,
  wallWarpYFreq: 5.0,
  columnsRepX: 0.75,
  columnsRepY: 1.0,
  columnsRepZ: 0.5,
  columnsDriftSpeed: 0.01,
  columnsDriftFreq: 0.5,
  columnsDriftAmount: 1.0,
  columnsYOffset: 0.25,
  columnRadius: 0.035,
  columnScaleAmp: 0.15,
  columnScaleYFreq: 20.0,
  columnScaleZFreq: 1.0,
  columnScaleTimeSpeed: 5.0,
  columnScaleTravelFreq: 1.0,
  columnPulseTimeSpeed: 1.0,
  columnPulseZFreq: 4.0,
  heightStrength: 0.0,
  heightScale: 2.1,
  heightScrollX: 0.023,
  heightScrollY: 0.01,
  heightDistInfluence: -0.012,
  heightMaskInfluence: -0.006,
  heightColorStart: -0.32,
  heightColorEnd: 1.8,
  bump1Strength: 4.0,
  bump1Scale: 7.0,
  bump1ScrollX: 0.02,
  bump1ScrollY: -0.01,
  bump2Strength: 3.0,
  bump2Scale: 1.0,
  bump2ScrollX: -0.061,
  bump2ScrollY: -0.046,
  bumpFactor: 3.0,
  blendMin: 0.84,
  blendMax: 0.19,
  blendPulseAmp: 0.21,
  blendPulseSpeed: 2.69,
  fogDensity: 0.38,
  fogDistance: 0.7,
  heightFogAmount: -0.28,
  ambientR: 0.1,
  ambientG: 0.59,
  ambientB: 0.0,
  lightR: 1.19,
  lightG: 1.24,
  lightB: 0.53,
  rimR: 0.59,
  rimG: 0.94,
  rimB: 0.89,
  ground1R: 0.37,
  ground1G: 1.0,
  ground1B: 1.0,
  ground2R: 0.4,
  ground2G: 1.48,
  ground2B: 1.57,
  columnR: 0.51,
  columnG: 0.48,
  columnB: 0.86,
  fogR: 0.83,
  fogG: 0.81,
  fogB: 0.43,
  lightOffsetZ: 1.3,
  lightAtten: 3.0,
  lightDiffuse: 2.0,
  specPower: 33.5,
  specIntensity: 3.2,
  rimMixScale: 0.13,
  rimMixOffset: 0.51,
  blurNear: 2.4,
  blurFar: 2.4,
  vignetteScale: 2.1,
  bloomMix: 0.64,
  bloomAdd: 0.13,
  brightness: 1.0,
  contrast: 1.0,
  saturation: 0.0,
  offsetX: 0.0,
  offsetY: 0.0,
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
uniform float u_zoom;
uniform float u_waveAmp;
uniform float u_waveFreq;
uniform float u_waveSpeed;

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
  // Center-based zoom
  vec2 centered = uv - 0.5;
  centered /= u_zoom;
  uv = centered + 0.5;
  vec2 aR = vec2(iResolution.x / iResolution.y, 1.);
  vec2 st = (uv + u_offset) * aR * u_scale;
  // Wave displacement — undulate contours like rolling waves
  st.y += u_waveAmp * sin(st.x * u_waveFreq + iTime * u_waveSpeed);
  st.x += u_waveAmp * 0.3 * cos(st.y * u_waveFreq * 0.7 + iTime * u_waveSpeed * 0.8);
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

// --- Domain Warp (based on Inigo Quilez's warp technique) ---
const fragFireWarp = `#version 300 es
precision highp float;
out vec4 O;

uniform vec2 iResolution;
uniform float iTime;
uniform float u_scale;
uniform float u_brightness;
uniform float u_contrast;
uniform vec3 u_tint;
uniform float u_saturation;
uniform float u_zoom;
uniform float u_aspect;
uniform vec2 u_offset;

float hash21(vec2 p) {
  p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
  return fract(p.x * p.y * (p.x + p.y));
}

vec2 hash22(vec2 p) {
  return vec2(hash21(p.xy + vec2(0.0, 0.0)),
              hash21(p.yx + vec2(0.7, 0.5)));
}

float noise(vec2 x) {
  vec2 i = floor(x);
  vec2 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i + vec2(0, 0));
  float b = hash21(i + vec2(1, 0));
  float c = hash21(i + vec2(0, 1));
  float d = hash21(i + vec2(1, 1));
  return -1.0 + 2.0 * mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float voronoi(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float d = 10.0;
  for (int n = -1; n <= 1; n++)
  for (int m = -1; m <= 1; m++) {
    vec2 b = vec2(m, n);
    vec2 r = b - f + hash22(i + b);
    d = min(d, dot(r, r));
  }
  return d;
}

float fbmNoise(vec2 p, int oct) {
  const mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
  float f = 0.0;
  float s = 0.5;
  float t = 0.0;
  for (int i = 0; i < 10; i++) {
    if (i >= oct) break;
    f += s * noise(p);
    t += s;
    p = m * p * 2.01;
    s *= 0.5;
  }
  return f / t;
}

float fbmVoronoi(vec2 p) {
  float f = 1.0;
  float s = 1.0;
  for (int i = 0; i < 8; i++) {
    float v = voronoi(p);
    f = min(f, v * s);
    p *= 2.0;
    s *= 1.4;
  }
  return 3.0 * f;
}

vec2 fbm2Noise(vec2 p, int o) {
  return vec2(fbmNoise(p.xy + vec2(0.0, 0.0), o),
              fbmNoise(p.yx + vec2(0.7, 1.3), o));
}

vec2 dis(vec2 p, float t) {
  t += 0.3 * sin(t);
  p.x -= 0.2 * t;
  const float a = 0.7;
  p += a * 0.5000 * sin(p.yx * 1.4 + 0.0 + t);
  p += a * 0.2500 * sin(p.yx * 2.3 + 1.0 + t);
  p += a * 0.1250 * sin(p.yx * 4.2 + 2.0 + t);
  p += a * 0.0625 * sin(p.yx * 8.1 + 3.0 + t);
  p += 0.4 * fbm2Noise(0.5 * p - t * vec2(0.9, 0.18), 2);
  return p;
}

void main() {
  vec2 screenP = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
  screenP.x *= u_aspect;
  vec2 p = screenP * u_scale / u_zoom + u_offset;

  const float dt = 0.01;
  vec2 q = dis(p, iTime);
  vec2 pq = dis(p, iTime - dt);
  float vel = length(q - pq) / dt;

  float f = q.y - 0.5 * sin(1.57 * q.x);
  f -= 0.5 * vel * vel * (0.5 - fbmVoronoi(0.5 * q));

  f = 0.5 + 1.5 * fbmNoise(vec2(2.5 * f, 0.0), 10);
  vec3 col = mix(vec3(0.0, 0.25, 0.6), vec3(1.0), f);

  col *= 1.0 - 0.1 * dot(screenP, screenP);

  // Brightness, contrast, tint
  col = (col - 0.5) * u_contrast + 0.5;
  col *= u_brightness * u_tint;
  // Saturation
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, u_saturation);
  O = vec4(max(col, vec3(0.0)), 1.0);
}
`;

// --- Bloom Corridor (multi-pass Shadertoy port) ---
const fragBloomCorridorA = `#version 300 es
precision highp float;
out vec4 O;

uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;

uniform float u_cameraSpeed;
uniform float u_cameraDepth;
uniform vec2 u_pathAmp;
uniform vec2 u_pathFreq;
uniform float u_pathPhaseY;
uniform float u_rayTwistSpeed;
uniform float u_maxSteps;
uniform float u_maxDist;
uniform float u_epsilon;
uniform vec2 u_twist;
uniform float u_twistBands;
uniform float u_planesDistance;
uniform float u_smoothMin;
uniform float u_wallWarpAmp;
uniform float u_wallWarpZFreq;
uniform float u_wallWarpYFreq;
uniform vec3 u_columnsRep;
uniform float u_columnsDriftSpeed;
uniform float u_columnsDriftFreq;
uniform float u_columnsDriftAmount;
uniform float u_columnsYOffset;
uniform float u_columnRadius;
uniform float u_columnScaleAmp;
uniform float u_columnScaleYFreq;
uniform float u_columnScaleZFreq;
uniform float u_columnScaleTimeSpeed;
uniform float u_columnScaleTravelFreq;
uniform float u_columnPulseTimeSpeed;
uniform float u_columnPulseZFreq;
uniform float u_heightStrength;
uniform float u_heightScale;
uniform vec2 u_heightScroll;
uniform float u_heightDistInfluence;
uniform float u_heightMaskInfluence;
uniform vec2 u_heightColorRange;
uniform float u_bump1Strength;
uniform float u_bump1Scale;
uniform vec2 u_bump1Scroll;
uniform float u_bump2Strength;
uniform float u_bump2Scale;
uniform vec2 u_bump2Scroll;
uniform float u_bumpFactor;
uniform vec2 u_surfaceBlendRange;
uniform float u_surfacePulseAmp;
uniform float u_surfacePulseSpeed;
uniform float u_fogDensity;
uniform float u_fogDistance;
uniform float u_heightFogAmount;
uniform vec3 u_groundColor1;
uniform vec3 u_groundColor2;
uniform vec3 u_columnColor;
uniform vec3 u_ambientColor;
uniform vec3 u_lightColor;
uniform vec3 u_fogColor;
uniform vec3 u_rimColor;
uniform float u_lightOffsetZ;
uniform float u_lightAtten;
uniform float u_lightDiffuse;
uniform float u_specPower;
uniform float u_specIntensity;
uniform float u_rimMixScale;
uniform float u_rimMixOffset;

float pi = 3.14159265359;

mat2 rot(float a) {
  vec2 s = sin(vec2(a, a + pi / 2.0));
  return mat2(s.y, s.x, -s.x, s.y);
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float sphere(vec3 pos, float radius, vec3 scale) {
  return length(pos * scale) - radius;
}

float heightmap(vec2 uv) {
  return u_heightStrength * texture(iChannel0, (uv + iTime * u_heightScroll) * u_heightScale).x;
}

float bumpmap(vec2 uv) {
  float b1 = u_bump1Strength * (1.0 - texture(iChannel0, (uv + iTime * u_bump1Scroll) * u_bump1Scale).x);
  float b2 = u_bump2Strength * (1.0 - texture(iChannel0, (uv + iTime * u_bump2Scroll) * u_bump2Scale).x);
  return b1 + b2;
}

float distfunc(vec3 pos) {
  vec3 p2 = pos;
  p2.x += sin(p2.z * u_wallWarpZFreq + p2.y * u_wallWarpYFreq) * u_wallWarpAmp;
  p2.xy *= rot(floor(p2.z * u_twistBands) * u_twist.y);
  pos.xy *= rot(pos.z * u_twist.x);

  float h = heightmap(pos.xz) * u_heightDistInfluence;

  vec3 reppos = mod(p2 + vec3(iTime * u_columnsDriftSpeed + sin(pos.z * u_columnsDriftFreq) * u_columnsDriftAmount, 0.0, 0.0), u_columnsRep) - 0.5 * u_columnsRep;

  float columnsScaleX = 1.0 + sin(p2.y * u_columnScaleYFreq * sin(p2.z * u_columnScaleZFreq) + iTime * u_columnScaleTimeSpeed + pos.z * u_columnScaleTravelFreq) * u_columnScaleAmp;
  float columnsScaleY = sin(iTime * u_columnPulseTimeSpeed + pos.z * u_columnPulseZFreq) * 0.5 + 0.5;

  float columns = sphere(vec3(reppos.x, pos.y + u_columnsYOffset, reppos.z), u_columnRadius, vec3(columnsScaleX, columnsScaleY, columnsScaleX));
  float corridor = u_planesDistance - abs(pos.y) + h;
  return smin(corridor, columns, u_smoothMin);
}

float rayMarch(vec3 rayDir, vec3 cameraOrigin) {
  const int MAX_ITER = 80;

  float totalDist = 0.0;
  vec3 pos = cameraOrigin;

  for (int j = 0; j < MAX_ITER; j++) {
    if (float(j) >= u_maxSteps) {
      break;
    }
    float dist = distfunc(pos);
    totalDist += dist;
    pos += dist * rayDir;

    if (dist < u_epsilon || totalDist > u_maxDist) {
      break;
    }
  }

  return totalDist;
}

mat3 setCamera(in vec3 ro, in vec3 ta, float cr) {
  vec3 cw = normalize(ta - ro);
  vec3 cp = vec3(sin(cr), cos(cr), 0.0);
  vec3 cu = normalize(cross(cw, cp));
  vec3 cv = normalize(cross(cu, cw));
  return mat3(cu, cv, cw);
}

vec3 calculateNormals(vec3 pos) {
  vec2 eps = vec2(0.0, u_epsilon);
  return normalize(vec3(
    distfunc(pos + eps.yxx) - distfunc(pos - eps.yxx),
    distfunc(pos + eps.xyx) - distfunc(pos - eps.xyx),
    distfunc(pos + eps.xxy) - distfunc(pos - eps.xxy)
  ));
}

vec3 doBumpMap(vec2 uv, vec3 nor, float bumpfactor) {
  const float eps = 0.001;
  float ref = bumpmap(uv);
  vec3 grad = vec3(
    bumpmap(vec2(uv.x - eps, uv.y)) - ref,
    0.0,
    bumpmap(vec2(uv.x, uv.y - eps)) - ref
  );

  grad -= nor * dot(nor, grad);
  return normalize(nor + grad * bumpfactor);
}

void main() {
  float camZ = iTime * -u_cameraSpeed;
  float pathX = sin(camZ * u_pathFreq.x) * u_pathAmp.x;
  float pathY = sin(camZ * u_pathFreq.y + u_pathPhaseY) * u_pathAmp.y;
  vec3 cameraOrigin = vec3(pathX, pathY, camZ);
  // tangent direction (derivative of path)
  float dz = 1.0;
  float dx = cos(camZ * u_pathFreq.x) * u_pathAmp.x * (-u_pathFreq.x);
  float dy = cos(camZ * u_pathFreq.y + u_pathPhaseY) * u_pathAmp.y * (-u_pathFreq.y);
  vec3 cameraTarget = cameraOrigin + normalize(vec3(dx, dy, -dz));

  vec2 screenPos = (gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0;
  screenPos.x *= iResolution.x / iResolution.y;

  mat3 cam = setCamera(cameraOrigin, cameraTarget, 0.0);
  vec3 rayDir = cam * normalize(vec3(screenPos.xy, u_cameraDepth));
  rayDir.xy *= rot(iTime * u_rayTwistSpeed);
  float dist = rayMarch(rayDir, cameraOrigin);

  vec3 pos = cameraOrigin + dist * rayDir;
  vec2 uv = pos.xy * rot(pos.z * u_twist.x);
  float h = heightmap(vec2(uv.x, pos.z));
  vec3 n = calculateNormals(pos);
  vec3 bump = doBumpMap(vec2(uv.x, pos.z), n, u_bumpFactor);
  float m = smoothstep(u_surfaceBlendRange.x, u_surfaceBlendRange.y, u_planesDistance - abs(uv.y) + h * u_heightMaskInfluence + sin(iTime * u_surfacePulseSpeed) * u_surfacePulseAmp);
  vec3 color = mix(mix(u_groundColor1, u_groundColor2, smoothstep(u_heightColorRange.x, u_heightColorRange.y, h)), u_columnColor, m);
  float fog = dist * u_fogDensity - u_fogDistance;
  float heightfog = pos.y;
  float rim = 1.0 - max(0.0, dot(-normalize(rayDir), bump));
  vec3 lightPos = pos - (cameraOrigin + vec3(0.0, 0.0, u_lightOffsetZ));
  vec3 lightDir = -normalize(lightPos);
  float lightdist = length(lightPos);
  float atten = 1.0 / (1.0 + lightdist * lightdist * u_lightAtten);
  float light = max(0.0, dot(lightDir, bump));
  vec3 r = reflect(normalize(rayDir), bump);
  float spec = clamp(dot(r, lightDir), 0.0, 1.0);
  float specpow = pow(spec, u_specPower);
  vec3 c = color * (u_ambientColor + mix(rim * rim * rim, rim * u_rimMixScale + u_rimMixOffset, m) * u_rimColor + u_lightColor * (light * atten * u_lightDiffuse + specpow * u_specIntensity));
  O = mix(vec4(c, rim), vec4(u_fogColor, 1.0), clamp(fog + heightfog * u_heightFogAmount, 0.0, 1.0));
}
`;

const fragBloomCorridorBlur = `#version 300 es
precision highp float;
out vec4 O;

uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform vec2 u_sampleDist;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec4 tex = vec4(0.0);
  vec2 dist = u_sampleDist / iResolution.xy;

  for (int x = -2; x <= 2; x++) {
    for (int y = -2; y <= 2; y++) {
      tex += texture(iChannel0, uv + vec2(float(x), float(y)) * dist);
    }
  }

  O = tex / 25.0;
}
`;

const fragBloomCorridorImage = `#version 300 es
precision highp float;
out vec4 O;

uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform float u_vignetteScale;
uniform float u_bloomMix;
uniform float u_bloomAdd;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform vec2 u_offset;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy + u_offset;
  vec4 tex = texture(iChannel1, uv);
  vec4 texBlurred = texture(iChannel0, uv);
  float vignet = length(uv - vec2(0.5)) * u_vignetteScale;
  vec3 col = (mix(tex, texBlurred * texBlurred, vignet * u_bloomMix) + texBlurred * texBlurred * u_bloomAdd).rgb;
  col = (col - 0.5) * u_contrast + 0.5;
  col *= u_brightness;
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, u_saturation);
  O = vec4(col, 1.0);
}
`;

// --- Global Color Grading params ---
// Target palette from reference: mean RGB(220,212,203)/255 ≈ (0.863,0.831,0.796)
// Warm cream/beige, very low saturation, high-key, narrow tonal range
const gradeParams = {
  brightness: 0.83,
  saturation: 1.0,
  contrast: 1.13,
  liftR: 0.55, liftG: 0.53, liftB: 0.50,
  gainR: 1.28, gainG: 1.29, gainB: 1.29,
  tintR: 1.15, tintG: 1.06, tintB: 1.04,
  tintStrength: 0.68,
};

// --- Composite (blend two scenes + door mask + color grading) ---
const fragComposite = `#version 300 es
precision highp float;
out vec4 O;

uniform sampler2D u_texA;
uniform sampler2D u_texB;
uniform float u_blend;
uniform vec2 iResolution;
uniform vec4 u_doorRect;

// color grading uniforms
uniform float u_brightness;
uniform float u_saturation;
uniform float u_contrast;
uniform vec3 u_lift;
uniform vec3 u_gain;
uniform vec3 u_tint;
uniform float u_tintStrength;
uniform float u_gradeStrength; // 0 = bypass grading, 1 = full grading

void main() {
  vec2 C = gl_FragCoord.xy;
  vec2 uv = C / iResolution;
  vec4 a = texture(u_texA, uv);
  vec4 b = texture(u_texB, uv);
  vec3 raw = mix(a, b, u_blend).rgb;
  vec3 col = raw;

  // 1. Lift-Gain-Gamma (shadows → warm taupe, highlights → cream)
  col = u_lift * (1.0 - col) + col * u_gain;

  // 2. Contrast compression (pivot at mid-gray)
  col = mix(vec3(0.5), col, u_contrast);

  // 3. Desaturation
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(lum), col, u_saturation);

  // 4. Warm tint blend
  col = mix(col, col * u_tint, u_tintStrength);

  // 5. Brightness
  col *= u_brightness;

  // Blend between raw and graded (for scenes that need full color range)
  col = mix(raw, col, u_gradeStrength);

  O = vec4(clamp(col, 0.0, 1.0), 1.0);
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

function createNoiseTexture(size = 256) {
  function hash2D(x, y) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return s - Math.floor(s);
  }

  function smoothstep01(t) {
    return t * t * (3 - 2 * t);
  }

  function valueNoise(x, y) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;
    const tx = smoothstep01(x - x0);
    const ty = smoothstep01(y - y0);

    const a = hash2D(x0, y0);
    const b = hash2D(x1, y0);
    const c = hash2D(x0, y1);
    const d = hash2D(x1, y1);

    const ab = a + (b - a) * tx;
    const cd = c + (d - c) * tx;
    return ab + (cd - ab) * ty;
  }

  function fbm(x, y) {
    let sum = 0;
    let amp = 0.5;
    let freq = 1.0;
    let norm = 0;

    for (let i = 0; i < 5; i++) {
      sum += valueNoise(x * freq, y * freq) * amp;
      norm += amp;
      freq *= 2.0;
      amp *= 0.5;
    }

    return sum / norm;
  }

  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const x = pixelIndex % size;
    const y = Math.floor(pixelIndex / size);
    const nx = x / size;
    const ny = y / size;

    // Cloud-like low-frequency noise works better for height/bump sources than white noise.
    let n = fbm(nx * 5.0, ny * 5.0);
    n = 0.7 * n + 0.3 * fbm(nx * 12.0 + 17.3, ny * 12.0 - 9.1);
    n = smoothstep01(Math.min(Math.max(n, 0), 1));

    const value = Math.floor(n * 255);
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = 255;
  }

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
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
  "u_brightness", "u_contrast", "u_saturation", "u_offset", "u_zoom",
  "u_waveAmp", "u_waveFreq", "u_waveSpeed",
]);

const progFW = createProgram(fragFireWarp);
const locFW = getUniforms(progFW, [
  "iResolution", "iTime", "u_scale", "u_zoom", "u_aspect",
  "u_brightness", "u_contrast", "u_tint",
  "u_saturation", "u_offset",
]);


const progBCA = createProgram(fragBloomCorridorA);
const locBCA = getUniforms(progBCA, [
  "iResolution", "iTime", "iChannel0",
  "u_cameraSpeed", "u_cameraDepth", "u_pathAmp", "u_pathFreq", "u_pathPhaseY", "u_rayTwistSpeed",
  "u_maxSteps", "u_maxDist", "u_epsilon",
  "u_twist", "u_twistBands", "u_planesDistance", "u_smoothMin",
  "u_wallWarpAmp", "u_wallWarpZFreq", "u_wallWarpYFreq",
  "u_columnsRep", "u_columnsDriftSpeed", "u_columnsDriftFreq", "u_columnsDriftAmount",
  "u_columnsYOffset", "u_columnRadius", "u_columnScaleAmp", "u_columnScaleYFreq",
  "u_columnScaleZFreq", "u_columnScaleTimeSpeed", "u_columnScaleTravelFreq",
  "u_columnPulseTimeSpeed", "u_columnPulseZFreq",
  "u_heightStrength", "u_heightScale", "u_heightScroll", "u_heightDistInfluence",
  "u_heightMaskInfluence", "u_heightColorRange",
  "u_bump1Strength", "u_bump1Scale", "u_bump1Scroll",
  "u_bump2Strength", "u_bump2Scale", "u_bump2Scroll", "u_bumpFactor",
  "u_surfaceBlendRange", "u_surfacePulseAmp", "u_surfacePulseSpeed",
  "u_fogDensity", "u_fogDistance", "u_heightFogAmount",
  "u_groundColor1", "u_groundColor2", "u_columnColor",
  "u_ambientColor", "u_lightColor", "u_fogColor", "u_rimColor",
  "u_lightOffsetZ", "u_lightAtten", "u_lightDiffuse",
  "u_specPower", "u_specIntensity", "u_rimMixScale", "u_rimMixOffset",
]);

const progBCBlur = createProgram(fragBloomCorridorBlur);
const locBCBlur = getUniforms(progBCBlur, ["iResolution", "iChannel0", "u_sampleDist"]);

const progBCImage = createProgram(fragBloomCorridorImage);
const locBCImage = getUniforms(progBCImage, [
  "iResolution", "iChannel0", "iChannel1",
  "u_vignetteScale", "u_bloomMix", "u_bloomAdd",
  "u_brightness", "u_contrast", "u_saturation", "u_offset",
]);

const progComp = createProgram(fragComposite);
const locComp = getUniforms(progComp, [
  "u_texA", "u_texB", "u_blend", "iResolution", "u_doorRect",
  "u_brightness", "u_saturation", "u_contrast", "u_lift", "u_gain", "u_tint", "u_tintStrength",
  "u_gradeStrength",
]);

// Per-scene grade strength: 1.0 = full global grading, 0.0 = raw output
const sceneGradeStrength = [1.0, 1.0, 1.0, 1.0];

// FBOs for each scene
const fboA = createFBO();
const fboB = createFBO();
const bloomCorridorSceneFbo = createFBO();
const bloomCorridorBlurFboA = createFBO();
const bloomCorridorBlurFboB = createFBO();
const bloomCorridorNoiseTex = createNoiseTexture();

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

const scenes = ["tunnelwisp", "cheapnoise", "domainwarp", "bloomcorridor"];
const sceneNames = ["Tunnelwisp", "Cheap Noise", "Domain Warp", "Bloom Corridor"];

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
  // Heartbeat zoom: smooth ease-in-out via smoothstep ping-pong
  let zoom = 1.0;
  if (cnParams.zoomAnim) {
    const cycle = cnParams.zoomCycle;
    const half = cycle * 0.5;
    const phase = t % cycle;
    // 0→half: zoom in, half→cycle: zoom out
    const linear = phase < half ? phase / half : 1.0 - (phase - half) / half;
    // smoothstep for organic ease (apply twice for extra cushion)
    const s = linear * linear * (3 - 2 * linear);
    const ss = s * s * (3 - 2 * s);
    zoom = 1.0 + ss * (cnParams.zoomMax - 1.0);
  }
  gl.uniform1f(locCN.u_zoom, zoom);
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
  gl.uniform1f(locCN.u_waveAmp, cnParams.waveAmp);
  gl.uniform1f(locCN.u_waveFreq, cnParams.waveFreq);
  gl.uniform1f(locCN.u_waveSpeed, cnParams.waveSpeed);
  gl.uniform2f(locCN.u_offset, cnParams.offsetX, cnParams.offsetY);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function renderFireWarp(t) {
  gl.useProgram(progFW);
  bindQuad(progFW);
  gl.uniform2f(locFW.iResolution, WIDTH, HEIGHT);
  gl.uniform1f(locFW.iTime, t * fwParams.timeSpeed);
  gl.uniform1f(locFW.u_scale, fwParams.scale);
  gl.uniform1f(locFW.u_zoom, fwParams.zoom);
  gl.uniform1f(locFW.u_aspect, fwParams.aspect);
  gl.uniform1f(locFW.u_brightness, fwParams.brightness);
  gl.uniform1f(locFW.u_contrast, fwParams.contrast);
  gl.uniform3f(locFW.u_tint, fwParams.tintR, fwParams.tintG, fwParams.tintB);
  gl.uniform1f(locFW.u_saturation, fwParams.saturation);
  if (fwParams.autoMove) {
    const rad = fwParams.autoAngle * Math.PI / 180;
    fwParams.offsetX += Math.cos(rad) * fwParams.autoSpeed * 0.001;
    fwParams.offsetY += Math.sin(rad) * fwParams.autoSpeed * 0.001;
  }
  gl.uniform2f(locFW.u_offset, fwParams.offsetX, fwParams.offsetY);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


function renderBloomCorridor(t) {
  const targetFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING);
  const sceneTime = t * bcParams.timeSpeed;

  gl.bindFramebuffer(gl.FRAMEBUFFER, bloomCorridorSceneFbo.fbo);
  gl.useProgram(progBCA);
  bindQuad(progBCA);
  gl.uniform2f(locBCA.iResolution, WIDTH, HEIGHT);
  gl.uniform1f(locBCA.iTime, sceneTime);
  gl.uniform1f(locBCA.u_cameraSpeed, bcParams.cameraSpeed);
  gl.uniform1f(locBCA.u_cameraDepth, bcParams.cameraDepth);
  gl.uniform2f(locBCA.u_pathAmp, bcParams.pathAmpX, bcParams.pathAmpY);
  gl.uniform2f(locBCA.u_pathFreq, bcParams.pathFreqX, bcParams.pathFreqY);
  gl.uniform1f(locBCA.u_pathPhaseY, bcParams.pathPhaseY);
  gl.uniform1f(locBCA.u_rayTwistSpeed, bcParams.rayTwistSpeed);
  gl.uniform1f(locBCA.u_maxSteps, bcParams.maxSteps);
  gl.uniform1f(locBCA.u_maxDist, bcParams.maxDist);
  gl.uniform1f(locBCA.u_epsilon, bcParams.epsilon);
  gl.uniform2f(locBCA.u_twist, bcParams.twistX, bcParams.twistY);
  gl.uniform1f(locBCA.u_twistBands, bcParams.twistBands);
  gl.uniform1f(locBCA.u_planesDistance, bcParams.planesDistance);
  gl.uniform1f(locBCA.u_smoothMin, bcParams.smoothMin);
  gl.uniform1f(locBCA.u_wallWarpAmp, bcParams.wallWarpAmp);
  gl.uniform1f(locBCA.u_wallWarpZFreq, bcParams.wallWarpZFreq);
  gl.uniform1f(locBCA.u_wallWarpYFreq, bcParams.wallWarpYFreq);
  gl.uniform3f(locBCA.u_columnsRep, bcParams.columnsRepX, bcParams.columnsRepY, bcParams.columnsRepZ);
  gl.uniform1f(locBCA.u_columnsDriftSpeed, bcParams.columnsDriftSpeed);
  gl.uniform1f(locBCA.u_columnsDriftFreq, bcParams.columnsDriftFreq);
  gl.uniform1f(locBCA.u_columnsDriftAmount, bcParams.columnsDriftAmount);
  gl.uniform1f(locBCA.u_columnsYOffset, bcParams.columnsYOffset);
  gl.uniform1f(locBCA.u_columnRadius, bcParams.columnRadius);
  gl.uniform1f(locBCA.u_columnScaleAmp, bcParams.columnScaleAmp);
  gl.uniform1f(locBCA.u_columnScaleYFreq, bcParams.columnScaleYFreq);
  gl.uniform1f(locBCA.u_columnScaleZFreq, bcParams.columnScaleZFreq);
  gl.uniform1f(locBCA.u_columnScaleTimeSpeed, bcParams.columnScaleTimeSpeed);
  gl.uniform1f(locBCA.u_columnScaleTravelFreq, bcParams.columnScaleTravelFreq);
  gl.uniform1f(locBCA.u_columnPulseTimeSpeed, bcParams.columnPulseTimeSpeed);
  gl.uniform1f(locBCA.u_columnPulseZFreq, bcParams.columnPulseZFreq);
  gl.uniform1f(locBCA.u_heightStrength, bcParams.heightStrength);
  gl.uniform1f(locBCA.u_heightScale, bcParams.heightScale);
  gl.uniform2f(locBCA.u_heightScroll, bcParams.heightScrollX, bcParams.heightScrollY);
  gl.uniform1f(locBCA.u_heightDistInfluence, bcParams.heightDistInfluence);
  gl.uniform1f(locBCA.u_heightMaskInfluence, bcParams.heightMaskInfluence);
  gl.uniform2f(locBCA.u_heightColorRange, bcParams.heightColorStart, bcParams.heightColorEnd);
  gl.uniform1f(locBCA.u_bump1Strength, bcParams.bump1Strength);
  gl.uniform1f(locBCA.u_bump1Scale, bcParams.bump1Scale);
  gl.uniform2f(locBCA.u_bump1Scroll, bcParams.bump1ScrollX, bcParams.bump1ScrollY);
  gl.uniform1f(locBCA.u_bump2Strength, bcParams.bump2Strength);
  gl.uniform1f(locBCA.u_bump2Scale, bcParams.bump2Scale);
  gl.uniform2f(locBCA.u_bump2Scroll, bcParams.bump2ScrollX, bcParams.bump2ScrollY);
  gl.uniform1f(locBCA.u_bumpFactor, bcParams.bumpFactor);
  gl.uniform2f(locBCA.u_surfaceBlendRange, bcParams.blendMin, bcParams.blendMax);
  gl.uniform1f(locBCA.u_surfacePulseAmp, bcParams.blendPulseAmp);
  gl.uniform1f(locBCA.u_surfacePulseSpeed, bcParams.blendPulseSpeed);
  gl.uniform1f(locBCA.u_fogDensity, bcParams.fogDensity);
  gl.uniform1f(locBCA.u_fogDistance, bcParams.fogDistance);
  gl.uniform1f(locBCA.u_heightFogAmount, bcParams.heightFogAmount);
  gl.uniform3f(locBCA.u_groundColor1, bcParams.ground1R, bcParams.ground1G, bcParams.ground1B);
  gl.uniform3f(locBCA.u_groundColor2, bcParams.ground2R, bcParams.ground2G, bcParams.ground2B);
  gl.uniform3f(locBCA.u_columnColor, bcParams.columnR, bcParams.columnG, bcParams.columnB);
  gl.uniform3f(locBCA.u_ambientColor, bcParams.ambientR, bcParams.ambientG, bcParams.ambientB);
  gl.uniform3f(locBCA.u_lightColor, bcParams.lightR, bcParams.lightG, bcParams.lightB);
  gl.uniform3f(locBCA.u_fogColor, bcParams.fogR, bcParams.fogG, bcParams.fogB);
  gl.uniform3f(locBCA.u_rimColor, bcParams.rimR, bcParams.rimG, bcParams.rimB);
  gl.uniform1f(locBCA.u_lightOffsetZ, bcParams.lightOffsetZ);
  gl.uniform1f(locBCA.u_lightAtten, bcParams.lightAtten);
  gl.uniform1f(locBCA.u_lightDiffuse, bcParams.lightDiffuse);
  gl.uniform1f(locBCA.u_specPower, bcParams.specPower);
  gl.uniform1f(locBCA.u_specIntensity, bcParams.specIntensity);
  gl.uniform1f(locBCA.u_rimMixScale, bcParams.rimMixScale);
  gl.uniform1f(locBCA.u_rimMixOffset, bcParams.rimMixOffset);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, bloomCorridorNoiseTex);
  gl.uniform1i(locBCA.iChannel0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.bindFramebuffer(gl.FRAMEBUFFER, bloomCorridorBlurFboA.fbo);
  gl.useProgram(progBCBlur);
  bindQuad(progBCBlur);
  gl.uniform2f(locBCBlur.iResolution, WIDTH, HEIGHT);
  gl.uniform2f(locBCBlur.u_sampleDist, bcParams.blurNear, bcParams.blurNear);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, bloomCorridorSceneFbo.tex);
  gl.uniform1i(locBCBlur.iChannel0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.bindFramebuffer(gl.FRAMEBUFFER, bloomCorridorBlurFboB.fbo);
  gl.uniform2f(locBCBlur.u_sampleDist, bcParams.blurNear, bcParams.blurNear);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, bloomCorridorBlurFboA.tex);
  gl.uniform1i(locBCBlur.iChannel0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.bindFramebuffer(gl.FRAMEBUFFER, bloomCorridorBlurFboA.fbo);
  gl.uniform2f(locBCBlur.u_sampleDist, bcParams.blurFar, bcParams.blurFar);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, bloomCorridorBlurFboB.tex);
  gl.uniform1i(locBCBlur.iChannel0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.bindFramebuffer(gl.FRAMEBUFFER, targetFbo);
  gl.useProgram(progBCImage);
  bindQuad(progBCImage);
  gl.uniform2f(locBCImage.iResolution, WIDTH, HEIGHT);
  gl.uniform1f(locBCImage.u_vignetteScale, bcParams.vignetteScale);
  gl.uniform1f(locBCImage.u_bloomMix, bcParams.bloomMix);
  gl.uniform1f(locBCImage.u_bloomAdd, bcParams.bloomAdd);
  gl.uniform1f(locBCImage.u_brightness, bcParams.brightness);
  gl.uniform1f(locBCImage.u_contrast, bcParams.contrast);
  gl.uniform1f(locBCImage.u_saturation, bcParams.saturation);
  gl.uniform2f(locBCImage.u_offset, bcParams.offsetX, bcParams.offsetY);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, bloomCorridorBlurFboA.tex);
  gl.uniform1i(locBCImage.iChannel0, 0);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, bloomCorridorSceneFbo.tex);
  gl.uniform1i(locBCImage.iChannel1, 1);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

const renderFns = [renderTunnelwisp, renderCheapNoise, renderFireWarp, renderBloomCorridor];

// ═══════════════════════════════════════════
//  GUI
// ═══════════════════════════════════════════

const gui = new GUI({ title: "LED Wall Renderer" });

const fGrade = gui.addFolder("Color Grading");
fGrade.add(gradeParams, "brightness", 0.1, 3, 0.01).name("Brightness");
fGrade.add(gradeParams, "saturation", 0, 1, 0.01).name("Saturation");
fGrade.add(gradeParams, "contrast", 0.3, 2.0, 0.01).name("Contrast");
fGrade.add(gradeParams, "liftR", 0, 0.5, 0.01).name("Lift R");
fGrade.add(gradeParams, "liftG", 0, 0.5, 0.01).name("Lift G");
fGrade.add(gradeParams, "liftB", 0, 0.5, 0.01).name("Lift B");
fGrade.add(gradeParams, "gainR", 0.5, 1.5, 0.01).name("Gain R");
fGrade.add(gradeParams, "gainG", 0.5, 1.5, 0.01).name("Gain G");
fGrade.add(gradeParams, "gainB", 0.5, 1.5, 0.01).name("Gain B");
fGrade.add(gradeParams, "tintR", 0.5, 1.2, 0.01).name("Tint R");
fGrade.add(gradeParams, "tintG", 0.5, 1.2, 0.01).name("Tint G");
fGrade.add(gradeParams, "tintB", 0.5, 1.2, 0.01).name("Tint B");
fGrade.add(gradeParams, "tintStrength", 0, 1, 0.01).name("Tint Strength");
fGrade.close();

const fTrans = gui.addFolder("Transition");
fTrans.add(transition, "duration", 3, 60, 0.5).name("Scene Duration (s)").onChange(updateRecordButtonLabel);
fTrans.add(transition, "blendTime", 1, 10, 0.5).name("Blend Time (s)").onChange(updateRecordButtonLabel);
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
const fCNWave = fCN.addFolder("Wave");
fCNWave.add(cnParams, "waveAmp", 0, 1, 0.01).name("Amplitude");
fCNWave.add(cnParams, "waveFreq", 0.1, 10, 0.1).name("Frequency");
fCNWave.add(cnParams, "waveSpeed", 0.01, 3, 0.01).name("Speed");
fCN.add(cnParams, "zoomAnim").name("Zoom Anim");
fCN.add(cnParams, "zoomMax", 1.0, 2.0, 0.01).name("Zoom Max");
fCN.add(cnParams, "zoomCycle", 5, 120, 1).name("Zoom Cycle(s)");
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

const fFW = gui.addFolder("Domain Warp");
fFW.add(fwParams, "scale", 0.1, 5, 0.01).name("Scale");
fFW.add(fwParams, "zoom", 0.1, 5, 0.01).name("Zoom");
fFW.add(fwParams, "aspect", 0.1, 3, 0.01).name("Aspect");
fFW.add(fwParams, "timeSpeed", 0.1, 3, 0.01).name("Speed");
fFW.add(fwParams, "brightness", 0.1, 3, 0.01).name("Brightness");
fFW.add(fwParams, "contrast", 0.1, 3, 0.01).name("Contrast");
fFW.add(fwParams, "saturation", 0, 3, 0.01).name("Saturation");
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

const fBC = gui.addFolder("Bloom Corridor");
fBC.add(bcParams, "timeSpeed", 0.1, 3, 0.01).name("Time Speed");
const fBCMotion = fBC.addFolder("Motion");
fBCMotion.add(bcParams, "cameraSpeed", 0.01, 0.5, 0.005).name("Camera Speed");
fBCMotion.add(bcParams, "cameraDepth", 0.5, 4, 0.01).name("Camera Depth");
fBCMotion.add(bcParams, "pathAmpX", 0, 1.0, 0.01).name("Path Amp X");
fBCMotion.add(bcParams, "pathAmpY", 0, 1.0, 0.01).name("Path Amp Y");
fBCMotion.add(bcParams, "pathFreqX", 0.1, 4.0, 0.05).name("Path Freq X");
fBCMotion.add(bcParams, "pathFreqY", 0.1, 4.0, 0.05).name("Path Freq Y");
fBCMotion.add(bcParams, "pathPhaseY", 0, 6.28, 0.01).name("Path Phase Y");
fBCMotion.add(bcParams, "rayTwistSpeed", 0, 1, 0.01).name("Ray Twist");
fBCMotion.add(bcParams, "twistX", 0, 8, 0.05).name("Twist X");
fBCMotion.add(bcParams, "twistY", 0, 12, 0.05).name("Twist Y");
fBCMotion.add(bcParams, "twistBands", 0, 6, 0.05).name("Twist Bands");
const fBCStructure = fBC.addFolder("Structure");
fBCStructure.add(bcParams, "planesDistance", 0.05, 1.0, 0.01).name("Plane Distance");
fBCStructure.add(bcParams, "smoothMin", 0.01, 0.8, 0.01).name("Smooth Min");
fBCStructure.add(bcParams, "wallWarpAmp", 0, 0.5, 0.005).name("Wall Warp Amp");
fBCStructure.add(bcParams, "wallWarpZFreq", 0, 10, 0.1).name("Wall Warp Z");
fBCStructure.add(bcParams, "wallWarpYFreq", 0, 10, 0.1).name("Wall Warp Y");
fBCStructure.add(bcParams, "columnsRepX", 0.1, 2, 0.01).name("Columns Rep X");
fBCStructure.add(bcParams, "columnsRepY", 0.1, 2, 0.01).name("Columns Rep Y");
fBCStructure.add(bcParams, "columnsRepZ", 0.1, 2, 0.01).name("Columns Rep Z");
fBCStructure.add(bcParams, "columnsDriftSpeed", -0.1, 0.1, 0.001).name("Columns Drift");
fBCStructure.add(bcParams, "columnsDriftFreq", 0, 4, 0.01).name("Drift Freq");
fBCStructure.add(bcParams, "columnsDriftAmount", 0, 3, 0.01).name("Drift Amount");
fBCStructure.add(bcParams, "columnsYOffset", -1, 1, 0.01).name("Columns Y");
fBCStructure.add(bcParams, "columnRadius", 0.005, 0.2, 0.001).name("Column Radius");
const fBCColumns = fBC.addFolder("Column Motion");
fBCColumns.add(bcParams, "columnScaleAmp", 0, 1, 0.01).name("Scale Amp");
fBCColumns.add(bcParams, "columnScaleYFreq", 0, 40, 0.1).name("Scale Y Freq");
fBCColumns.add(bcParams, "columnScaleZFreq", 0, 6, 0.01).name("Scale Z Freq");
fBCColumns.add(bcParams, "columnScaleTimeSpeed", 0, 12, 0.05).name("Scale Time");
fBCColumns.add(bcParams, "columnScaleTravelFreq", 0, 6, 0.01).name("Scale Travel");
fBCColumns.add(bcParams, "columnPulseTimeSpeed", 0, 6, 0.01).name("Pulse Time");
fBCColumns.add(bcParams, "columnPulseZFreq", 0, 12, 0.05).name("Pulse Z");
const fBCMaps = fBC.addFolder("Maps");
fBCMaps.add(bcParams, "heightStrength", 0, 8, 0.05).name("Height Strength");
fBCMaps.add(bcParams, "heightScale", 0.1, 8, 0.05).name("Height Scale");
fBCMaps.add(bcParams, "heightScrollX", -0.2, 0.2, 0.001).name("Height Scroll X");
fBCMaps.add(bcParams, "heightScrollY", -0.2, 0.2, 0.001).name("Height Scroll Y");
fBCMaps.add(bcParams, "heightDistInfluence", -0.2, 0.2, 0.001).name("Height Dist");
fBCMaps.add(bcParams, "heightMaskInfluence", -0.2, 0.2, 0.001).name("Height Mask");
fBCMaps.add(bcParams, "heightColorStart", -2, 4, 0.01).name("Color Start");
fBCMaps.add(bcParams, "heightColorEnd", -2, 4, 0.01).name("Color End");
const fBCBump1 = fBC.addFolder("Bump 1");
fBCBump1.add(bcParams, "bump1Strength", 0, 8, 0.05).name("Strength");
fBCBump1.add(bcParams, "bump1Scale", 0.1, 12, 0.05).name("Scale");
fBCBump1.add(bcParams, "bump1ScrollX", -0.2, 0.2, 0.001).name("Scroll X");
fBCBump1.add(bcParams, "bump1ScrollY", -0.2, 0.2, 0.001).name("Scroll Y");
const fBCBump2 = fBC.addFolder("Bump 2");
fBCBump2.add(bcParams, "bump2Strength", 0, 8, 0.05).name("Strength");
fBCBump2.add(bcParams, "bump2Scale", 0.1, 12, 0.05).name("Scale");
fBCBump2.add(bcParams, "bump2ScrollX", -0.2, 0.2, 0.001).name("Scroll X");
fBCBump2.add(bcParams, "bump2ScrollY", -0.2, 0.2, 0.001).name("Scroll Y");
fBCBump2.add(bcParams, "bumpFactor", 0, 8, 0.05).name("Bump Factor");
const fBCSurface = fBC.addFolder("Surface Mix");
fBCSurface.add(bcParams, "blendMin", -1, 1, 0.01).name("Blend Min");
fBCSurface.add(bcParams, "blendMax", -1, 1, 0.01).name("Blend Max");
fBCSurface.add(bcParams, "blendPulseAmp", 0, 0.5, 0.005).name("Pulse Amp");
fBCSurface.add(bcParams, "blendPulseSpeed", 0, 5, 0.01).name("Pulse Speed");
const fBCLighting = fBC.addFolder("Lighting");
fBCLighting.add(bcParams, "lightOffsetZ", 0.1, 4, 0.01).name("Light Offset");
fBCLighting.add(bcParams, "lightAtten", 0.1, 10, 0.05).name("Attenuation");
fBCLighting.add(bcParams, "lightDiffuse", 0, 6, 0.05).name("Diffuse");
fBCLighting.add(bcParams, "specPower", 1, 60, 0.5).name("Spec Power");
fBCLighting.add(bcParams, "specIntensity", 0, 4, 0.05).name("Spec Intensity");
fBCLighting.add(bcParams, "rimMixScale", 0, 2, 0.01).name("Rim Scale");
fBCLighting.add(bcParams, "rimMixOffset", 0, 2, 0.01).name("Rim Offset");
const fBCFog = fBC.addFolder("Fog");
fBCFog.add(bcParams, "fogDensity", 0, 1, 0.01).name("Fog Density");
fBCFog.add(bcParams, "fogDistance", -1, 2, 0.01).name("Fog Distance");
fBCFog.add(bcParams, "heightFogAmount", -2, 2, 0.01).name("Height Fog");
const fBCAmbient = fBC.addFolder("Ambient");
fBCAmbient.add(bcParams, "ambientR", 0, 2, 0.01).name("R");
fBCAmbient.add(bcParams, "ambientG", 0, 2, 0.01).name("G");
fBCAmbient.add(bcParams, "ambientB", 0, 2, 0.01).name("B");
const fBCLightColor = fBC.addFolder("Light Color");
fBCLightColor.add(bcParams, "lightR", 0, 2, 0.01).name("R");
fBCLightColor.add(bcParams, "lightG", 0, 2, 0.01).name("G");
fBCLightColor.add(bcParams, "lightB", 0, 2, 0.01).name("B");
const fBCRimColor = fBC.addFolder("Rim Color");
fBCRimColor.add(bcParams, "rimR", 0, 2, 0.01).name("R");
fBCRimColor.add(bcParams, "rimG", 0, 2, 0.01).name("G");
fBCRimColor.add(bcParams, "rimB", 0, 2, 0.01).name("B");
const fBCGround1 = fBC.addFolder("Ground Color 1");
fBCGround1.add(bcParams, "ground1R", 0, 2, 0.01).name("R");
fBCGround1.add(bcParams, "ground1G", 0, 2, 0.01).name("G");
fBCGround1.add(bcParams, "ground1B", 0, 2, 0.01).name("B");
const fBCGround2 = fBC.addFolder("Ground Color 2");
fBCGround2.add(bcParams, "ground2R", 0, 2, 0.01).name("R");
fBCGround2.add(bcParams, "ground2G", 0, 2, 0.01).name("G");
fBCGround2.add(bcParams, "ground2B", 0, 2, 0.01).name("B");
const fBCColumnColor = fBC.addFolder("Column Color");
fBCColumnColor.add(bcParams, "columnR", 0, 2, 0.01).name("R");
fBCColumnColor.add(bcParams, "columnG", 0, 2, 0.01).name("G");
fBCColumnColor.add(bcParams, "columnB", 0, 2, 0.01).name("B");
const fBCFogColor = fBC.addFolder("Fog Color");
fBCFogColor.add(bcParams, "fogR", 0, 2, 0.01).name("R");
fBCFogColor.add(bcParams, "fogG", 0, 2, 0.01).name("G");
fBCFogColor.add(bcParams, "fogB", 0, 2, 0.01).name("B");
const fBCBloom = fBC.addFolder("Bloom");
fBCBloom.add(bcParams, "blurNear", 0.5, 6, 0.1).name("Near Blur");
fBCBloom.add(bcParams, "blurFar", 1, 16, 0.1).name("Far Blur");
fBCBloom.add(bcParams, "vignetteScale", 0, 4, 0.01).name("Vignette");
fBCBloom.add(bcParams, "bloomMix", 0, 2, 0.01).name("Bloom Mix");
fBCBloom.add(bcParams, "bloomAdd", 0, 2, 0.01).name("Bloom Add");
const fBCPost = fBC.addFolder("Post");
fBCPost.add(bcParams, "brightness", 0, 3, 0.01).name("Brightness");
fBCPost.add(bcParams, "contrast", 0, 3, 0.01).name("Contrast");
fBCPost.add(bcParams, "saturation", 0, 3, 0.01).name("Saturation");
fBCPost.add(bcParams, "offsetX", -1, 1, 0.001).name("Offset X");
fBCPost.add(bcParams, "offsetY", -1, 1, 0.001).name("Offset Y");
const fBCDebug = fBC.addFolder("Raymarch");
fBCDebug.add(bcParams, "maxSteps", 1, 80, 1).name("Max Steps");
fBCDebug.add(bcParams, "maxDist", 1, 80, 0.5).name("Max Dist");
fBCDebug.add(bcParams, "epsilon", 0.0005, 0.01, 0.0001).name("Epsilon");
fBC.close();

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
    gl.uniform1f(locComp.u_brightness, gradeParams.brightness);
    gl.uniform1f(locComp.u_saturation, gradeParams.saturation);
    gl.uniform1f(locComp.u_contrast, gradeParams.contrast);
    gl.uniform3f(locComp.u_lift, gradeParams.liftR, gradeParams.liftG, gradeParams.liftB);
    gl.uniform3f(locComp.u_gain, gradeParams.gainR, gradeParams.gainG, gradeParams.gainB);
    gl.uniform3f(locComp.u_tint, gradeParams.tintR, gradeParams.tintG, gradeParams.tintB);
    gl.uniform1f(locComp.u_tintStrength, gradeParams.tintStrength);
    gl.uniform1f(locComp.u_gradeStrength, sceneGradeStrength[state.idxA]);
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
    gl.uniform1f(locComp.u_brightness, gradeParams.brightness);
    gl.uniform1f(locComp.u_saturation, gradeParams.saturation);
    gl.uniform1f(locComp.u_contrast, gradeParams.contrast);
    gl.uniform3f(locComp.u_lift, gradeParams.liftR, gradeParams.liftG, gradeParams.liftB);
    gl.uniform3f(locComp.u_gain, gradeParams.gainR, gradeParams.gainG, gradeParams.gainB);
    gl.uniform3f(locComp.u_tint, gradeParams.tintR, gradeParams.tintG, gradeParams.tintB);
    gl.uniform1f(locComp.u_tintStrength, gradeParams.tintStrength);
    const gs = sceneGradeStrength[state.idxA] * (1 - state.blend) + sceneGradeStrength[state.idxB] * state.blend;
    gl.uniform1f(locComp.u_gradeStrength, gs);
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
const WEBP_QUALITY = 0.92;

let isRecording = false;
let frameCount = 0;
let dirHandle = null;
let writeQueue = [];
let isWriting = false;
let pendingWrites = 0;

const btnRecord = document.getElementById("btn-record");
const statusEl = document.getElementById("status");

function getRecordingDurationSeconds() {
  return scenes.length * (transition.duration + transition.blendTime);
}

function formatClock(totalSeconds) {
  const rounded = Math.round(totalSeconds);
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getTotalFrames() {
  return Math.round(FPS * getRecordingDurationSeconds());
}

function updateRecordButtonLabel() {
  if (!isRecording) {
    btnRecord.textContent = `● REC WebP (${formatClock(getRecordingDurationSeconds())})`;
  }
}

updateRecordButtonLabel();

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

  updateRecordButtonLabel();
  btnRecord.classList.remove("recording");
  statusEl.textContent = `Done — ${frameCount} WebP frames saved to folder`;
  dirHandle = null;
}

function captureFrame() {
  const num = frameCount;
  const totalFrames = getTotalFrames();
  const totalDuration = formatClock(getRecordingDurationSeconds());
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
  statusEl.textContent = `Recording ${mins}:${secs.toString().padStart(2, "0")} / ${totalDuration}  (${frameCount}/${totalFrames} frames${queued > 0 ? `, ${queued} writing` : ""})`;

  if (frameCount >= totalFrames) stopRecording();
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

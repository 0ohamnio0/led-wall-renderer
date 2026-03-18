import * as THREE from 'three/webgpu'
import {
  float, mx_noise_float, Loop, color, positionLocal,
  sin, vec2, vec3, mul, time, uniform, Fn, transformNormalToView,
} from 'three/tsl'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import * as cheapNoise from './cheap-noise.js'
import * as fluidSim from './fluid-sim.js'
import * as colorWaves from './color-waves.js'
import * as fireWarp from './fire-warp.js'

// ═══════════════════════════════════════════
//  Tab system
// ═══════════════════════════════════════════
let activeTab = 'raging-sea'
const containers = {
  'raging-sea': document.getElementById('scene-raging-sea'),
  'cheap-noise': document.getElementById('scene-cheap-noise'),
  'fluid-sim': document.getElementById('scene-fluid-sim'),
  'color-waves': document.getElementById('scene-color-waves'),
  'fire-warp': document.getElementById('scene-fire-warp'),
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab
    if (tab === activeTab) return
    switchTab(tab)
  })
})

function switchTab(tab) {
  // Deactivate current
  if (activeTab === 'raging-sea') {
    seaGui.hide()
  } else if (activeTab === 'cheap-noise') {
    cheapNoise.stop()
  } else if (activeTab === 'fluid-sim') {
    fluidSim.stop()
  } else if (activeTab === 'color-waves') {
    colorWaves.stop()
  } else if (activeTab === 'fire-warp') {
    fireWarp.stop()
  }

  // Toggle visibility
  containers[activeTab].classList.add('hidden')
  containers[tab].classList.remove('hidden')

  // Activate new
  if (tab === 'raging-sea') {
    seaGui.show()
    renderer.setAnimationLoop(animateSea)
  } else if (tab === 'cheap-noise') {
    renderer.setAnimationLoop(null)
    cheapNoise.start()
  } else if (tab === 'fluid-sim') {
    renderer.setAnimationLoop(null)
    fluidSim.start()
  } else if (tab === 'color-waves') {
    renderer.setAnimationLoop(null)
    colorWaves.start()
  } else if (tab === 'fire-warp') {
    renderer.setAnimationLoop(null)
    fireWarp.start()
  }

  activeTab = tab
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab)
  })
}

// ═══════════════════════════════════════════
//  Tab 1: Raging Sea (WebGPU + TSL)
// ═══════════════════════════════════════════
const WIDTH = 3584
const HEIGHT = 960

const scene = new THREE.Scene()
scene.background = new THREE.Color('#000000')

const camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 100)
camera.position.set(1.25, 1.25, 1.25)

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(-4, 2, 0)
scene.add(directionalLight)

const material = new THREE.MeshStandardNodeMaterial({
  color: '#271442',
  roughness: 0.15,
})

const seaParams = {
  color: '#271442',
  roughness: 0.15,
  emissiveColor: '#000000',
  emissiveLow: -0.32,
  emissiveHigh: 1,
  emissivePower: 3,
  largeWavesFreqX: 1.41,
  largeWavesFreqY: 4.56,
  largeWavesSpeed: 1.13,
  largeWavesMultiplier: 0.2,
  smallWavesIterations: 2,
  smallWavesFrequency: 2.97,
  smallWavesSpeed: 0.17,
  smallWavesMultiplier: 0.12,
  normalComputeShift: 0.0279,
  cameraX: 1.25, cameraY: 1.25, cameraZ: 1.25,
  lookAtX: 0, lookAtY: -0.25, lookAtZ: 0,
  bgColor: '#000000',
}

// TSL uniforms
const emissiveColorU = uniform(color(seaParams.emissiveColor))
const emissiveLowU = uniform(seaParams.emissiveLow)
const emissiveHighU = uniform(seaParams.emissiveHigh)
const emissivePowerU = uniform(seaParams.emissivePower)
const largeWavesFrequency = uniform(vec2(seaParams.largeWavesFreqX, seaParams.largeWavesFreqY))
const largeWavesSpeed = uniform(seaParams.largeWavesSpeed)
const largeWavesMultiplier = uniform(seaParams.largeWavesMultiplier)
const smallWavesIterations = uniform(seaParams.smallWavesIterations)
const smallWavesFrequency = uniform(seaParams.smallWavesFrequency)
const smallWavesSpeed = uniform(seaParams.smallWavesSpeed)
const smallWavesMultiplier = uniform(seaParams.smallWavesMultiplier)
const normalComputeShift = uniform(seaParams.normalComputeShift)

const wavesElevation = Fn(([position]) => {
  const elevation = mul(
    sin(position.x.mul(largeWavesFrequency.x).add(time.mul(largeWavesSpeed))),
    sin(position.z.mul(largeWavesFrequency.y).add(time.mul(largeWavesSpeed))),
    largeWavesMultiplier,
  ).toVar()
  Loop({ start: float(1), end: smallWavesIterations.add(1) }, ({ i }) => {
    const noiseInput = vec3(
      position.xz.add(2).mul(smallWavesFrequency).mul(i),
      time.mul(smallWavesSpeed),
    )
    const wave = mx_noise_float(noiseInput, 1, 0)
      .mul(smallWavesMultiplier).div(i).abs()
    elevation.subAssign(wave)
  })
  return elevation
})

const elevation = wavesElevation(positionLocal)
const position = positionLocal.add(vec3(0, elevation, 0))
material.positionNode = position

let positionA = positionLocal.add(vec3(normalComputeShift, 0, 0))
let positionB = positionLocal.add(vec3(0, 0, normalComputeShift.negate()))
positionA = positionA.add(vec3(0, wavesElevation(positionA), 0))
positionB = positionB.add(vec3(0, wavesElevation(positionB), 0))
const toA = positionA.sub(position).normalize()
const toB = positionB.sub(position).normalize()
material.normalNode = transformNormalToView(toA.cross(toB))

const emissive = elevation.remap(emissiveHighU, emissiveLowU).pow(emissivePowerU)
material.emissiveNode = emissiveColorU.mul(emissive)

const geometry = new THREE.PlaneGeometry(2, 2, 256, 256)
geometry.rotateX(-Math.PI * 0.5)
scene.add(new THREE.Mesh(geometry, material))

const renderer = new THREE.WebGPURenderer({ antialias: true })
renderer.setPixelRatio(1)
renderer.setSize(WIDTH, HEIGHT)
renderer.setAnimationLoop(animateSea)
containers['raging-sea'].appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(seaParams.lookAtX, seaParams.lookAtY, seaParams.lookAtZ)
controls.enableDamping = true

// Sea GUI
const seaGui = new GUI({ title: 'Raging Sea — LED' })

const matF = seaGui.addFolder('Material')
matF.addColor(seaParams, 'color').onChange(v => material.color.set(v))
matF.add(seaParams, 'roughness', 0, 1, 0.001).onChange(v => { material.roughness = v })

const emF = seaGui.addFolder('Emissive')
emF.addColor(seaParams, 'emissiveColor').onChange(v => emissiveColorU.value.set(v))
emF.add(seaParams, 'emissiveLow', -1, 0, 0.001).onChange(v => { emissiveLowU.value = v })
emF.add(seaParams, 'emissiveHigh', 0, 1, 0.001).onChange(v => { emissiveHighU.value = v })
emF.add(seaParams, 'emissivePower', 1, 10, 1).onChange(v => { emissivePowerU.value = v })

const lwF = seaGui.addFolder('Large Waves')
lwF.add(seaParams, 'largeWavesSpeed', 0, 5).onChange(v => { largeWavesSpeed.value = v })
lwF.add(seaParams, 'largeWavesMultiplier', 0, 1).onChange(v => { largeWavesMultiplier.value = v })
lwF.add(seaParams, 'largeWavesFreqX', 0, 10).onChange(v => { largeWavesFrequency.value.x = v })
lwF.add(seaParams, 'largeWavesFreqY', 0, 10).onChange(v => { largeWavesFrequency.value.y = v })

const swF = seaGui.addFolder('Small Waves')
swF.add(seaParams, 'smallWavesIterations', 0, 5, 1).onChange(v => { smallWavesIterations.value = v })
swF.add(seaParams, 'smallWavesFrequency', 0, 10).onChange(v => { smallWavesFrequency.value = v })
swF.add(seaParams, 'smallWavesSpeed', 0, 1).onChange(v => { smallWavesSpeed.value = v })
swF.add(seaParams, 'smallWavesMultiplier', 0, 1).onChange(v => { smallWavesMultiplier.value = v })
swF.add(seaParams, 'normalComputeShift', 0, 0.1, 0.0001).onChange(v => { normalComputeShift.value = v })

const camF = seaGui.addFolder('Camera')
camF.add(seaParams, 'cameraX', -5, 5, 0.01).onChange(v => { camera.position.x = v })
camF.add(seaParams, 'cameraY', 0, 5, 0.01).onChange(v => { camera.position.y = v })
camF.add(seaParams, 'cameraZ', -5, 5, 0.01).onChange(v => { camera.position.z = v })
camF.add(seaParams, 'lookAtX', -3, 3, 0.01).onChange(v => { controls.target.x = v })
camF.add(seaParams, 'lookAtY', -3, 3, 0.01).onChange(v => { controls.target.y = v })
camF.add(seaParams, 'lookAtZ', -3, 3, 0.01).onChange(v => { controls.target.z = v })

const bgF = seaGui.addFolder('Background')
bgF.addColor(seaParams, 'bgColor').onChange(v => scene.background.set(v))

function animateSea() {
  controls.update()
  renderer.render(scene, camera)
  if (isRecording) tickRecording()
}

// ═══════════════════════════════════════════
//  Tab 2: Cheap Noise (WebGL)
// ═══════════════════════════════════════════
containers['cheap-noise'].appendChild(cheapNoise.canvas)
containers['fluid-sim'].appendChild(fluidSim.canvas)
containers['color-waves'].appendChild(colorWaves.canvas)
containers['fire-warp'].appendChild(fireWarp.canvas)

// ═══════════════════════════════════════════
//  Recording — WebM (MediaRecorder)
// ═══════════════════════════════════════════
const FPS = 30
const DURATION = 180
const TOTAL_FRAMES = FPS * DURATION

let isRecording = false
let recordedChunks = []
let mediaRecorder = null
let frameCount = 0

const btnRecord = document.getElementById('btn-record')
const statusEl = document.getElementById('status')

btnRecord.addEventListener('click', () => {
  if (isRecording) stopRecording()
  else startRecording()
})

function getActiveCanvas() {
  if (activeTab === 'raging-sea') return renderer.domElement
  if (activeTab === 'cheap-noise') return cheapNoise.canvas
  if (activeTab === 'fluid-sim') return fluidSim.canvas
  if (activeTab === 'color-waves') return colorWaves.canvas
  return fireWarp.canvas
}

function startRecording() {
  const stream = getActiveCanvas().captureStream(FPS)
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 50_000_000,
  })
  recordedChunks = []
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.push(e.data)
  }
  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}-${WIDTH}x${HEIGHT}-${DURATION}s.webm`
    a.click()
    URL.revokeObjectURL(url)
    statusEl.textContent = 'Done — file downloaded'
  }
  mediaRecorder.start(1000)
  isRecording = true
  frameCount = 0
  btnRecord.textContent = '■ STOP'
  btnRecord.classList.add('recording')
  statusEl.textContent = 'Recording...'
  setTimeout(() => { if (isRecording) stopRecording() }, DURATION * 1000)
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop()
  isRecording = false
  btnRecord.textContent = '● REC (3 min)'
  btnRecord.classList.remove('recording')
}

function tickRecording() {
  frameCount++
  const elapsed = frameCount / FPS
  const mins = Math.floor(elapsed / 60)
  const secs = Math.floor(elapsed % 60)
  statusEl.textContent = `Recording ${mins}:${secs.toString().padStart(2, '0')} / 3:00  (${frameCount}/${TOTAL_FRAMES} frames)`
}

// Patch rAF so cheap-noise tab also captures frames
;(function () {
  const _raf = window.requestAnimationFrame
  window.requestAnimationFrame = function (cb) {
    return _raf(function (t) {
      cb(t)
      if (isRecording && activeTab !== 'raging-sea') tickRecording()
    })
  }
})()

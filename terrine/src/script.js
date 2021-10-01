import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


// Texture Loader
const loader = new THREE.TextureLoader()
const height = loader.load('./cloud.png')
const texture01 = loader.load('./texture01.jpg')
const alpha = loader.load('./alpha.png')
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects

const geromatery = new THREE.PlaneBufferGeometry(3, 3, 64, 64)

// Materials
const materials = new THREE.MeshStandardMaterial({
    color: 'gray',
    map: texture01,
    displacementMap: height,
    displacementScale: .6,
    alphaMap: alpha,
    transparent: true,
    depthTest: false
})

// Mesh

const plan = new THREE.Mesh(geromatery, materials)
scene.add(plan)
plan.rotation.x = 181
gui.add(plan.rotation, 'x').min(0).max(600)

// Lights

const pointLight = new THREE.PointLight('#00b3ff', 3)
pointLight.position.x = 0.8
pointLight.position.y = 3.7
pointLight.position.z = -1
scene.add(pointLight)
gui.add(pointLight.position, 'x')
gui.add(pointLight.position, 'y')
gui.add(pointLight.position, 'z')
const color = {color: '#00b3ff'}
gui.addColor(color, 'color').onChange(() => {
    pointLight.color.set(color.color)
})
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth * .5,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', animate)

let mouseY = 0
function animate(event) {
    mouseY = event.clientY
}

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    plan.rotation.z = .5 * elapsedTime 
    plan.material.displacementScale = .3 + mouseY * .0005
    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
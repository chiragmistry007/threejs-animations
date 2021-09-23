let camera
let scene
let render
let house
let container
function init() {
    container = document.querySelector('.scene')

    scene = new THREE.Scene()
    const fov = 30
    const aspect = container.clientWidth / container.clientHeight
    const near = .7
    const far = 200

    camera = new THREE.PerspectiveCamera(fov, aspect, far, near)
    camera.position.set(-8, 0, 20)
    const ambient = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambient)

    const light = new THREE.DirectionalLight(0xFFFFFF, 2.1)
    light.position.set(40, 8, 50)
    scene.add(light)

    render = new THREE.WebGLRenderer({antialias: true, alpha: true})
    render.setSize(container.clientWidth, container.clientHeight)
    render.setPixelRatio(window.devicePixel)
    container.appendChild(render.domElement)
    let loader = new THREE.GLTFLoader()
    loader.load('./3d/rockate/rockate.glb', function (gltf) {
        scene.add(gltf.scene)
        house = gltf.scene.children[0]
        house.position.y = 0
        house.rotation.x = 0
        console.log(house)
        render.render(scene, camera)
        animate()
    })

    // const controls = new THREE.OrbitControls( camera, render.domElement );
    // controls.enableZoom = true;
}
function animate() {
    window.requestAnimationFrame(animate)
    house.rotation.y += .020
    render.render(scene, camera)
}

document.addEventListener('mousemove', (e) => {
    // house.rotation.y = .8 * (e.clientX / window.innerWidth)
    house.rotation.x = .5 * (e.clientX / window.innerHeight)
    
    house.position.y = (e.clientX / window.innerWidth) * 1.5

    house.position.x = (e.clientX / window.innerHeight) * -.5
    
    house.scale.x = 1 * (e.clientX / window.innerHeight)
    house.scale.y = 1 * (e.clientX / window.innerHeight)
    house.scale.z = 1 * (e.clientX / window.innerHeight)
})
init()
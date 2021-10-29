let camera
let scene
let render
let car_model
let container
let grid;
function init() {
    container = document.querySelector('.scene')

    scene = new THREE.Scene()
    const fov = 40
    const aspect = window.innerWidth / window.innerHeight
    const near = .1
    const far = 200

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set( 4.25, 1.4, - 4.5 );
    const ambient = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambient)

    grid = new THREE.GridHelper( 100, 40, 0x000000, 0x000000 );
    grid.material.opacity = 0.1;
    grid.material.depthWrite = false;
    grid.material.transparent = true;
    scene.add( grid );

    const light = new THREE.DirectionalLight(0xFFFFFF, 2.1)
    light.position.set(40, 8, 50)
    scene.add(light)

    render = new THREE.WebGLRenderer({antialias: true, alpha: true})
    render.setSize(container.clientWidth, container.clientHeight)
    render.setPixelRatio(window.devicePixelRatio)
    render.setAnimationLoop( render );
    container.appendChild(render.domElement)
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( 'js/draco/gltf/' );
    let loader = new THREE.GLTFLoader()
    loader.setDRACOLoader( dracoLoader );
    const shadow = new THREE.TextureLoader().load( '3d/car/ferrari_ao.png' );
    loader.load('./3d/ferrari0.glb', function (gltf) {
        car_model = gltf.scene.children[0]
        console.log(car_model.getObjectByName( 'body' ))
        car_model.scale.set(.1, .1, .1)
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry( 0.655 * 4, 1.3 * 4 ),
            new THREE.MeshBasicMaterial( {
                map: shadow, blending: THREE.MultiplyBlending, toneMapped: false, transparent: false
            } )
        );
        mesh.rotation.x = - Math.PI / 2;
        mesh.renderOrder = 2;
        car_model.add( mesh );
        scene.add( car_model );
        render.render(scene, camera)
        animate()
    })

    const controls = new THREE.OrbitControls( camera, render.domElement );
    
    // controls = new OrbitControls( camera, container );
    controls.target.set( 0, 0.5, 0 );
    controls.enableZoom = true;
    controls.update();
}
function animate() {
    window.requestAnimationFrame(animate)
    car_model.rotation.y += .020
    render.render(scene, camera)
}

document.addEventListener('mousemove', (e) => {
    // house.rotation.y = .8 * (e.clientX / window.innerWidth)
    // house.rotation.x = .5 * (e.clientX / window.innerHeight)
    
    // house.position.y = (e.clientX / window.innerWidth) * 1.5

    // house.position.x = (e.clientX / window.innerHeight) * -.5
})
init()
let camera
let scene
let render
let car_model
let container
let grid;
const wheels = [];
function init() {
    container = document.querySelector('.scene')
    console.log(container.offsetWidth)

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

    const bodyMaterial = new THREE.MeshPhysicalMaterial( {
        color: 0xff0000, metalness: 0.6, roughness: 0.4, clearcoat: 0.05, clearcoatRoughness: 0.05
    } );

    const detailsMaterial = new THREE.MeshStandardMaterial( {
        color: 0xffffff, metalness: 1.0, roughness: 0.5
    } );

    const glassMaterial = new THREE.MeshPhysicalMaterial( {
        color: 0xffffff, metalness: 0, roughness: 0.1, transmission: 0.5, transparent: true
    } );

    const bodyColorInput = document.getElementById( 'body-color' );
    bodyColorInput.addEventListener( 'input', function () {

        bodyMaterial.color.set( this.value );

    } );

    const detailsColorInput = document.getElementById( 'details-color' );
    detailsColorInput.addEventListener( 'input', function () {

        detailsMaterial.color.set( this.value );

    } );

    const glassColorInput = document.getElementById( 'glass-color' );
    glassColorInput.addEventListener( 'input', function () {

        glassMaterial.color.set( this.value );

    } );


    render = new THREE.WebGLRenderer({antialias: true, alpha: true})
    render.setSize(container.clientWidth, container.clientHeight)
    render.setPixelRatio(window.devicePixelRatio)
    render.setAnimationLoop( render );
    container.appendChild(render.domElement)

    const pmremGenerator = new THREE.PMREMGenerator( render );
    scene.environment = pmremGenerator.fromScene( new THREE.RoomEnvironment() ).texture;


    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( 'js/draco/gltf/' );
    let loader = new THREE.GLTFLoader()
    loader.setDRACOLoader( dracoLoader );
    const shadow = new THREE.TextureLoader().load( '3d/car/ferrari_ao.png' );
    loader.load('./3d/ferrari.glb', function (gltf) {
        car_model = gltf.scene.children[0]
        console.log(car_model.getObjectByName( 'body' ))
        // car_model.scale.set(.1, .1, .1)
        car_model.getObjectByName( 'body' ).material = bodyMaterial;

        car_model.getObjectByName( 'rim_fl' ).material = detailsMaterial;
        car_model.getObjectByName( 'rim_fr' ).material = detailsMaterial;
        car_model.getObjectByName( 'rim_rr' ).material = detailsMaterial;
        car_model.getObjectByName( 'rim_rl' ).material = detailsMaterial;
        car_model.getObjectByName( 'trim' ).material = detailsMaterial;

        car_model.getObjectByName( 'glass' ).material = glassMaterial;

        wheels.push(
            car_model.getObjectByName( 'wheel_fl' ),
            car_model.getObjectByName( 'wheel_fr' ),
            car_model.getObjectByName( 'wheel_rl' ),
            car_model.getObjectByName( 'wheel_rr' )
        );
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
    car_model.rotation.y += .010
    render.render(scene, camera)
}
init()
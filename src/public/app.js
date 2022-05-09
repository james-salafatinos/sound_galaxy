//External Libraries
import * as THREE from '/modules/three.module.js';
import Stats from '/modules/stats.module.js';
import { CSS3DRenderer, CSS3DObject } from "/modules/CSS3DRenderer.js";
//Internal Libraries
import { NoClipControls } from '/utils/NoClipControls.js'
import { PhysicsObject } from '/utils/PhysicsObject.js'
import { TerrainGenerator } from '/utils/TerrainGenerator.js'
import { SoundStation } from '/utils/SoundStation.js'
//import { AudioListener } from '/utils/AudioListener.js'
import { Collisions } from '/utils/Collisions.js'
import { ParticleSystem } from '/utils/ParticleSystem.js'
//THREE JS
let camera, scene, renderer, composer, controls
let stats;
//Required for NOCLIPCONTROLS
let prevTime = performance.now();
let physicsObjects = []
let frameIndex = 0
let labelRenderer;
let iFrame
let cameraLookDir;
let updatePositionForCamera;
let collisions;
let arrow;
// let SS;
let SS_Array = [];
let AL;
let PS;
let SKYDOME;
let label_meshes = []

let MAP = new THREE.TextureLoader()
init();
animate();

function init() {
    scene = new THREE.Scene();
    var loader = new THREE.TextureLoader(),
        texture = loader.load("/static/nightsky2.jpg");
    scene.background = texture
    scene.fog = new THREE.Fog(0xffffff, 750, 10000);


    //Create three.js stats
    stats = new Stats();
    container.appendChild(stats.dom);

    //Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    labelRenderer = new CSS3DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);


    // LIGHTS
    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // const pointLight = new THREE.PointLight(0xee23ff, 0xfe1188, 70);
    // pointLight.position.set(0, 50, 0);
    // pointLight.lookAt(0,0,0)

    // scene.add(pointLight);
    // const lightHelper = new THREE.PointLightHelper(pointLight)
    // scene.add(lightHelper)

    let dirLight = new THREE.DirectionalLight(0xffffff, .5);
    dirLight.position.set(0, 50, 0);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    dirLight.shadow.camera.top = 70;
    dirLight.shadow.camera.left = -70;
    dirLight.shadow.camera.right = 70;
    dirLight.shadow.camera.bottom = -70;

    scene.add(dirLight)

    // const helper = new THREE.DirectionalLightHelper(dirLight, 10);
    // scene.add(helper)



    //Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 60;
    camera.position.z = 120;
    camera.position.x = 0;

    //NO CLIP CONTROLS
    controls = new NoClipControls(scene, window, camera, document);

    cameraLookDir = function (camera) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.rotation.order);
        return vector;
    }

    let createCube = function (x = 0, y = 0, z = -10) {
        let mat = new THREE.MeshBasicMaterial({
            wireframe: true,
            transparent: false,
            depthTest: false,
            side: THREE.DoubleSide,
            color: new THREE.Color(0xffffff)
        });
        let geo = new THREE.BoxGeometry(5, 5, 5)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = x
        mesh.position.y = y
        mesh.position.z = z
        scene.add(mesh)
    }

    // let createFrame = function (increment, _x, _y, _z) {
    //     let mat = new THREE.MeshBasicMaterial({
    //         transparent: true,
    //         opacity: 0
    //     });
    //     let geo = new THREE.BoxGeometry(.5, .5, .5)
    //     let mesh = new THREE.Mesh(geo, mat)
    //     mesh.position.x = _x
    //     mesh.position.y = _y
    //     mesh.position.z = _z



    //     var html = [

    //         '<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1235918551&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/firesurgery" title="Fire Surgery" target="_blank" style="color: #cccccc; text-decoration: none;">Fire Surgery</a> · <a href="https://soundcloud.com/firesurgery/kiss-and-love-and-fck" title="Kiss &amp; Love &amp; F*ck" target="_blank" style="color: #cccccc; text-decoration: none;">Kiss &amp; Love &amp; F*ck</a></div>',
    //         '<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1085210068&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/firesurgery" title="Fire Surgery" target="_blank" style="color: #cccccc; text-decoration: none;">Fire Surgery</a> · <a href="https://soundcloud.com/firesurgery/better-off-as-asteroids" title="Better off as asteroids" target="_blank" style="color: #cccccc; text-decoration: none;">Better off as asteroids</a></div>'
    //     ]


    //     let frameScale = new THREE.Vector3(.01, .01, .01)

    //     const frameDiv = document.createElement('div');
    //     frameDiv.className = 'label';
    //     frameDiv.innerHTML = html[increment];
    //     frameDiv.style.marginTop = '-1em';
    //     const frameLabel = new CSS3DObject(frameDiv);
    //     frameLabel.scale.set(frameScale.x, frameScale.y, frameScale.z)
    //     console.log('frameLabel', frameLabel)
    //     frameLabel.position.set(_x, _y, _z);
    //     frameLabel.position.x = -1
    //     frameLabel.position.y = 17
    //     frameLabel.position.z = -4

    //     mesh.add(frameLabel);
    //     mesh.lookAt(camera.position)
    //     label_meshes.push(mesh)

    //     scene.add(mesh)
    //     // labels.push(frameLabel)
    //     return mesh

    // }



    // iFrame = createFrame('Sunshine_policy', 15, 105, 0)
    // console.log(iFrame)

    let createPlane = function () {
        let mat = new THREE.MeshStandardMaterial({
            wireframe: false,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            color: new THREE.Color(0x6a7699),
            opacity: .7,

        });
        let geo = new THREE.PlaneBufferGeometry(600, 600)
        let mesh = new THREE.Mesh(geo, mat)

        mesh.position.x = 0
        mesh.position.y = -20
        mesh.position.z = 0
        mesh.rotation.x = Math.PI / 2

        mesh.receiveShadow = true;
        scene.add(mesh)
    }
    // createPlane()

    let createWall = function (_x, _y, _z, _rotation) {
        let mat = new THREE.MeshPhongMaterial({
            wireframe: false,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            color: new THREE.Color(0x6a7699),
            opacity: .8
        });
        let geo = new THREE.PlaneBufferGeometry(200, 100)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = _x
        mesh.position.y = _y
        mesh.position.z = _z
        mesh.rotation.y = _rotation
        scene.add(mesh)
    }
    // createWall(150, 50, -150, -Math.PI / 4)
    // createWall(-150, 50, -150, Math.PI / 4)
    // createWall(-150, 50, 150, -Math.PI / 4)
    // createWall(150, 50, 150, Math.PI / 4)



    let createStars = function () {
        let M = 32
        let N = 32
        let scaler = 10;
        let vertices = [];
        let spacing_scale = 50
        for (let x = -M; x <= M; x += 1) {
            for (let z = -N; z <= N; z += 1) {
                // vertices.push(x / scaler, 0 / scaler, z / scaler)

                let rx = THREE.MathUtils.randFloatSpread(2000)
                let ry = THREE.MathUtils.randFloatSpread(2000) + 1100
                let rz = THREE.MathUtils.randFloatSpread(2000)
                vertices.push(
                    rx,
                    ry,
                    rz)
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        let material = new THREE.PointsMaterial({ size: .7, sizeAttenuation: true, alphaTest: 0.2, transparent: true });
        material.color.setHSL(.6, 0.8, 0.9);
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }
    createStars()

    // MAP.load(`/static/sky.jpg`, function (texture) {
    //     var material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
    //     var sprite = new THREE.Sprite(material);
    //     sprite.geometry.scale(50, 50)
    //     sprite.position.x = 200
    //     sprite.position.y = 100
    //     sprite.position.z = 0

    //     console.log(sprite)
    //     scene.add(sprite);

    // });
    let loadImage = function (url, x, y, z, r) {

        var texture = MAP.load(`/static/${url}`)
        var material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff, depthWrite:true, depthTest:true, });
        var sprite = new THREE.Sprite(material);
        sprite.geometry.scale(r, r)
        sprite.position.x = x
        sprite.position.y = y
        sprite.position.z = z

        console.log(sprite)
        scene.add(sprite);

    }



    loadImage('texture1.png', 0, 60, 0, 50)

    let terrain = new TerrainGenerator(scene)
    terrain.create()
    console.log(terrain)

    // //points of interest
    // AL = new AudioListener(scene, camera)
    // AL.addSound()

    PS = new ParticleSystem(scene)
    PS.createParticles()



    let M = 3
    let N = 3
    let scaler = 10;
    let vertices = [];
    let spacing_scale = 50
    let increment = 0
    for (let x = -M; x <= M; x += 1) {
        for (let z = -N; z <= N; z += 1) {
            // vertices.push(x / scaler, 0 / scaler, z / scaler)
            let choose = function(){
                if (Math.random()>.5){
                    return "POC1"
                }else{
                    return "POC2"
                }
            }
            let ss = new SoundStation(scene, choose(), label_meshes)
            let ssx = THREE.MathUtils.randFloatSpread(2000)
            let ssy = 105 + THREE.MathUtils.randFloatSpread(5)
            let ssz = THREE.MathUtils.randFloatSpread(2000)
            ss.createCylinder(ssx, ssy, ssz, 0)
  
    
            // if (increment < 3){
            //     iFrame = createFrame(increment, ssx, ssy + 10, ssz)
            //     console.log(iFrame)
            // }


            // loadImage(10,Math.random()*200, ssz,50)

            SS_Array.push(ss)

        }
        increment++;
    }


    //Large Star


    collisions = new Collisions(scene, camera, SS_Array, PS)
    console.log('Checking collision!')



    
    let createSphere = function (_x, _y, _z, _rotation) {
        let mat = new THREE.MeshPhongMaterial({
            wireframe: false,
            transparent: true,

            color: new THREE.Color(0x201a40),
            opacity: .8,

        });
        let geo = new THREE.IcosahedronGeometry(50  , 8)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = _x
        mesh.position.y = _y
        mesh.position.z = _z
        mesh.rotation.y = _rotation

        SKYDOME = mesh
        scene.add(SKYDOME)
    }
  

    //Large Star
    let p0 = new PhysicsObject(10000, 0, 250, 0, 0, 0, 0, 0, 1)
    p0.isStationary = true
    p0.density = 1000000
    physicsObjects.push(p0)
    scene.add(p0.Sphere())

    createSphere(0, 250, 0, 0)

    // //Large Star
    // let p1 = new PhysicsObject(10000, 0, 0, 50, 0, 0, 0, 0, 1)
    // p1.isStationary = true
    // p1.density = 10000

    // physicsObjects.push(p1)
    // scene.add(p1.Sphere())



    updatePositionForCamera = function (camera, myObject3D) {
        // fixed distance from camera to the object
        var dist = 100;
        var cwd = new THREE.Vector3();

        camera.getWorldDirection(cwd);

        cwd.multiplyScalar(dist);
        cwd.add(camera.position);

        myObject3D.position.set(cwd.x, cwd.y, cwd.z);
        myObject3D.setRotationFromQuaternion(camera.quaternion);
    }

    //Object creation loop
    for (let i = 0; i < 10; i++) {
        let radius = 50
        let x_offset = 190
        let y_offset = 250
        let z_offset = 15
        let px = x_offset + (2 * Math.random() - 1) * radius
        let py = y_offset + (2 * Math.random() - 1) * radius / 2
        let pz = z_offset + (2 * Math.random() - 1) * radius
        let physicsObject = new PhysicsObject(1, px, py, pz, 0, 0, 0, .05, 1)


        physicsObjects.push(physicsObject)
        scene.add(physicsObject.Sphere())

    }

    console.log(physicsObjects)
}

function animate() {
    //Frame Start up
    requestAnimationFrame(animate);

    //Force Application
    if (frameIndex % 1 == 0) {

        for (let i = 0; i < physicsObjects.length; i++) {
            for (let j = 0; j < physicsObjects.length; j++) {
                if (i !== j) {
                    let f = physicsObjects[i].attract(physicsObjects[j])
                    physicsObjects[i].applyForce(f)
                    physicsObjects[i].updatePhysics()
                    physicsObjects[i].updateGeometry()

                }
            }
        }
        for (let i = 0; i < SS_Array.length; i++) {
            SS_Array[i].update()
            // console.log(SS_Array)
        }


    }



    const time = performance.now();
    // SS.update()
    // updatePositionForCamera(camera, SKYDOME)


    if (frameIndex % 5 == 0) {
        collisions.checkCollisions()
      
    }
    
    PS.updateParticles()

    if (frameIndex % 500 == 0) {

        for (let i = 0; i < label_meshes.length; i++) {
            label_meshes[i].lookAt(camera.position)
        }
    }

    // SKYDOME.position.x += 1
    // SKYDOME.position.z += 1
    // SKYDOME.position.y -= 1

    controls.update(time, prevTime)
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera)
    stats.update()

    //Frame Shut Down
    prevTime = time;
    frameIndex++;
}
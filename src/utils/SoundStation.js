import * as THREE from '/modules/three.module.js';

import { CSS3DRenderer, CSS3DObject } from "/modules/CSS3DRenderer.js";
class SoundStation {
    constructor(scene, name) {
        this.scene = scene
        this.mesh = null
        this.name = name
        this.isPlaying = false;

    }
    createCylinder(_x, _y, _z, _rotation) {
        let mat = new THREE.MeshPhongMaterial({
            wireframe: true,
            transparent: false,
            depthWrite: true,
            side: THREE.DoubleSide,
            color: new THREE.Color(0xFFE778),
            emissive: new THREE.Color(0xC3A72A),
            emissiveIntensity: .2,
            opacity: 1,
        });
        let geo = new THREE.SphereGeometry(2, 2, 2, 1)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = _x
        mesh.position.y = _y
        mesh.position.z = _z
        mesh.rotation.y = _rotation


        // let light = new THREE.DirectionalLight( 0x989F1F, 1)
        // light.position.set(_x, _y, _z);
        // // mesh.add(light)
        this.mesh = mesh
        this.scene.add(mesh)
        //     this.scene.add(light)
        // }
    }


    update() {
        this.mesh.rotation.x += .015 + Math.random() / 100
        this.mesh.rotation.y += 0 + Math.random() / 10

    }

}





export { SoundStation }
import * as THREE from '/modules/three.module.js';

import { CSS3DRenderer, CSS3DObject } from "/modules/CSS3DRenderer.js";
class SoundStation {
    constructor(scene, name, label_meshes) {
        this.scene = scene
        this.mesh = null
        this.name = name
        this.isPlaying = false;
        this.label_meshes = label_meshes
        
        

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

    createFrame(htmlIdx, _x, _y, _z) {
        console.log("creating frame")
        let mat = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0
        });
        let geo = new THREE.BoxGeometry(.5, .5, .5)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = _x
        mesh.position.y = _y
        mesh.position.z = _z




        var html = [

            '<iframe width="600" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1235918551&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/firesurgery" title="Fire Surgery" target="_blank" style="color: #cccccc; text-decoration: none;">Fire Surgery</a> · <a href="https://soundcloud.com/firesurgery/kiss-and-love-and-fck" title="Kiss &amp; Love &amp; F*ck" target="_blank" style="color: #cccccc; text-decoration: none;">Kiss &amp; Love &amp; F*ck</a></div>',
            '<iframe width="600" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1085210068&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/firesurgery" title="Fire Surgery" target="_blank" style="color: #cccccc; text-decoration: none;">Fire Surgery</a> · <a href="https://soundcloud.com/firesurgery/better-off-as-asteroids" title="Better off as asteroids" target="_blank" style="color: #cccccc; text-decoration: none;">Better off as asteroids</a></div>'
        ]


        let frameScale = new THREE.Vector3(.1, .1, .1)

        const frameDiv = document.createElement('div');
        // frameDiv.className = 'label';
        frameDiv.innerHTML = html[htmlIdx];
        // frameDiv.style.marginTop = '-1em';
        const frameLabel = new CSS3DObject(frameDiv);
        frameLabel.scale.set(frameScale.x, frameScale.y, frameScale.z)
        // console.log('frameLabel', frameLabel)
        frameLabel.position.set(_x, _y, _z);
        frameLabel.position.x = -1
        frameLabel.position.y = 17
        frameLabel.position.z = -4

        mesh.add(frameLabel);
        this.label_meshes.push(mesh)

        this.scene.add(mesh)
        // labels.push(frameLabel)

        this.isPlaying = true;
        return mesh
    }
    update() {
        this.mesh.rotation.x += .015 + Math.random() / 100
        this.mesh.rotation.y += 0 + Math.random() / 10

    }

}





export { SoundStation }
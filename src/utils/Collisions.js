import * as THREE from '/modules/three.module.js';

class Collisions {
    constructor(scene, camera, SS_Array, AL) {
        this.scene = scene
        this.camera = camera
        this.SS_Array = SS_Array
        this.entered = false;
        this.AL = AL




    }

    checkCollisions() {


        for (let i = 0; i < this.SS_Array.length; i++) {
            // console.log(this.camera.position,this.SS_Array[i].mesh.position)
            let distance_vec = this.camera.position.clone().sub(this.SS_Array[i].mesh.position.clone())
            let distance_mag = distance_vec.length()
            //  console.log(distance_mag)
           

            if (distance_mag < 50) {
                this.AL.sound.play()

                this.entered = true
            }
        }
        console.log(this.entered)





    }
}





export { Collisions }
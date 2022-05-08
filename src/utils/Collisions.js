import * as THREE from '/modules/three.module.js';

class Collisions {
    constructor(scene, camera, SS_Array, AL) {
        this.scene = scene
        this.camera = camera
        this.SS_Array = SS_Array
        this.entered = false;
        this.AL = AL
        this.createdFrame = false;



    }

    checkCollisions() {


        //Camera near SoundStation
        for (let i = 0; i < this.SS_Array.length; i++) {
            // console.log(this.camera.position,this.SS_Array[i].mesh.position)
            let distance_vec = this.camera.position.clone().sub(this.SS_Array[i].mesh.position.clone())
            let distance_mag = distance_vec.length()
            //  console.log(distance_mag)
           

            if (distance_mag < 50) {
                console.log("Near SoundStation!")
                //But which sound to play?
                let ss = this.SS_Array[i]
                console.log(ss.name)


                if (this.SS_Array[i].isPlaying){
                    console.log("Already Created")
                } else{
                    ss.createFrame(Math.random() > .5 ? 1 : 0, ss.mesh.position.x,ss.mesh.position.y,ss.mesh.position.z)
               
                }
            
                // this.AL.sound.play()

                this.entered = true
            }

       


        }
        console.log(this.entered)





    }
}





export { Collisions }
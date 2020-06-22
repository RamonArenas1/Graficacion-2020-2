import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";

/**
 * Clase que representa una cámara 3D, donde se puede mover la vista con el mouse
 * El movimiento se realiza como si la cámara estuviera situada sobre una esfera de radio igual a la distancia entre el centro de interés y la posición de la cámara; y se utilizan coordenadas polares para determinar la posición de la cámara
 */
export default class Camera {
    /**
     * 
     * @param {Vector3} pos es la posición de la cámara
     * @param {Vector3} coi es el centro de interés hacía donde observa la cámara
     * @param {Vector3} up es el vector hacia arriba
     */
    constructor(pos, coi, up, canvas) {
        this.setPos(pos);
        this.setCOI(coi);
        this.setUp(up);

        this.m = new Matrix4().identity();

        //variables para movimiento con el teclado
        this.front = Vector3.subtract(this.coi, this.pos).normalize();
        this.front = new Vector3(this.front.x, 0, this.front.z).normalize();
        this.speed = 1;

        //variables para movimiento de la camara
        this.lastx = canvas.width/2;
        this.lasty = canvas.height/2;

        this.yaw = -90;
        this.pitch = 0;
    }

    /**
     * Función que permite cambiar la posición de la cámara
     * @param {Vector3} pos es la nueva posición de la cámara
     */
    setPos(pos) {
        this.pos = pos || new Vector3(0, 0, 1);

        this.needUpdate = true;
    }

    /**
     * Función que permite cambiar el centro de interés de la cámara
     * @param {Number[]} coi es el nuevo centro de interés de la cámara
     */
    setCOI(coi) {
        this.coi = coi || new Vector3(0, 0, 0);

        this.needUpdate = true;
    }

    /**
     * Función que permite cambiar el vector hacia arriba de la cámara
     * @param {Number[]} up es el nuevo vector hacia arriba de la cámara
     */
    setUp(up) {
        this.up = up || new Vector3(0, 1, 0);

        this.needUpdate = true;
    }

    /**
     * Función que devuelve la matriz asociada con la cámara
     */
    getMatrix() {
        // solo si hubo un cambio en la posición de la cámara, el centro de interés o el vector hacía arriba, entonces se actualiza la matriz asociada
        if (this.needUpdate) {
            this.needUpdate = false;
            this.m = Matrix4.lookAt(this.pos, this.coi, this.up);
        }
        return this.m;
    }


    /**
     * Función permite mover la camara recaculando todos los vectores involucrados para
     * su correcto funcionamiento
     * @param String direction, identificador de hacia donde es el movimiento
     */
    move(direction) {

        let movement;
        let new_pos;
        let new_coi;

        switch (direction) {
            case ("front"):
                {
                    movement = this.front.scalar(this.speed);
                    new_pos = Vector3.add(this.pos, movement);
                    new_coi = Vector3.add(movement, this.coi)
                    break;
                }
            case ("back"):
                {
                    movement = this.front.scalar(this.speed);
                    new_pos = Vector3.subtract(this.pos, movement);
                    new_coi = Vector3.subtract(this.coi, movement)
                    break;
                }
            case ("right"):
                {
                    movement = Vector3.cross(this.front, this.up).scalar(this.speed);
                    new_pos = Vector3.add(this.pos, movement);
                    new_coi = Vector3.add(movement, this.coi)
                    break;
                }
            case ("left"):
                {
                    movement = Vector3.cross(this.front, this.up).scalar(this.speed);
                    new_pos = Vector3.subtract(this.pos, movement);
                    new_coi = Vector3.subtract(this.coi, movement)
                    break;
                }
        }

        if (!(new_pos.x > 6.5 || new_pos.x < -6.5 || new_pos.z > 21 || new_pos.z < -90)) {
            this.setPos(new_pos);
            this.setCOI(new_coi);
        }else if ( Math.abs(new_pos.z - 0) < 1 || Math.abs(new_pos.z - (-20)) < 1 || Math.abs(new_pos.z - (-40)) < 1 || Math.abs(new_pos.z - (-60))< 1 || Math.abs(new_pos.z - (-80)) < 1 ) {
            if (!(new_pos.x > 8.5 || new_pos.x < -8.5)) {
                this.setPos(new_pos);
                this.setCOI(new_coi);
            }
        }

    }

    /*Función se llama para asignar los valores al vector frontal de la cámara*/
    updateCamera() {
        let direction = new Vector3(
            Math.cos(degrees_to_radians(this.yaw)) * Math.cos(degrees_to_radians(this.pitch)),
            Math.sin(degrees_to_radians(this.pitch)),
            Math.sin(degrees_to_radians(this.yaw)) * Math.cos(degrees_to_radians(this.pitch))
        );

        this.front.set(direction.x, 0, direction.z);
        this.front = this.front.normalize();

        let new_coi = Vector3.add(direction.normalize(), this.pos);
        this.setCOI(new_coi);
    }

    /**
     * Función permite mover el coi de la camara todos los vectores involucrados para
     * su correcto funcionamiento
     * @param number offsetx, indica la diferencia de x entre esta y una llamada anterior
     * @param number offsetx, indica la diferencia de y entre esta y una llamada anterior
     */
    moveCamera(offsetx, offsety) {

        this.lastx = offsetx + this.lastx;;
        this.lasty = offsety + this.lasty;;

        const sensibilidad = 1; // valor de que tanto queremos que avance el ratón
        let offsetx2 = sensibilidad * offsetx;
        let offsety2 = sensibilidad * offsety;

        this.yaw += this.speed * offsetx2;
        this.pitch += this.speed * offsety2;

        if (this.pitch > 89.0)
            this.pitch = 89.0;
        if (this.pitch < -89.0)
            this.pitch = -89.0;

        /*
         * Teniendo los nuevos angulos de Euler actualizamos la cámara
         */
        this.updateCamera();
    }

}

/*
 * Cambia de grados a radianes.
 * */
function degrees_to_radians(degrees) {
    let pi = Math.PI;
    return degrees * (pi / 180);
}
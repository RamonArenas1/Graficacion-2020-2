import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";

/**
 * Clase que representa una cámara 3D, donde se puede mover la vista con el mouse
 * El movimiento se realiza como si la cámara estuviera situada sobre una esfera de radio igual a la distancia entre el centro de interés y la posición de la cámara; y se utilizan coordenadas polares para determinar la posición de la cámara
 */
export default class TrackballCamera {
    /**
     * 
     * @param {Vector3} pos es la posición de la cámara
     * @param {Vector3} coi es el centro de interés hacía donde observa la cámara
     * @param {Vector3} up es el vector hacia arriba
     */
    constructor(pos, coi, up) {
        this.setPos(pos);
        this.setCOI(coi);
        this.setUp(up);

        this.m = new Matrix4().identity();

        this.radius = Vector3.distance(this.pos, this.coi);
        let direction = Vector3.subtract(this.pos, this.coi);
        this.theta = Math.atan2(direction.z, direction.x);
        this.phi = Math.atan2(direction.y, direction.x);
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
     * Función que asigna los ángulos finales a la cámara, una vez que se termino de mover el mouse, esta función se debe ejecutar en el evento mouseup
     * @param {Object} init_mouse es un objeto que contiene las coordenadas del mouse cuando se dio clic en el canvas
     * @param {Object} current_mouse es un objeto que contiene las coordenadas actuales del mouse 
     */
    finishMove(x, y, current_mouse_x, current_mouse_y) {
        // se obtiene el ángulo phi y theta considerando como se ha movido el mouse desde el primer clic hasta la última posición
        //let angles = this.getAngles(init_mouse, current_mouse);

        let theta = this.getAnglesTheta(x, current_mouse_x);
        let phi = this.getAnglesPhi(y, current_mouse_y);

        this.theta = theta;
        this.phi = phi;
    }

    /**
     * Función que rota la cámara con la información de movimiento del mouse
     * @param {Object} init_mouse es un objeto que contiene las coordenadas del mouse cuando se dio clic en el canvas
     * @param {Object} current_mouse es un objeto que contiene las coordenadas actuales del mouse 
     */
    rotate(x, y, current_mouse_x, current_mouse_y) {
        // se obtiene el ángulo phi y theta considerando como se ha movido el mouse desde el primer clic hasta la última posición
        //let angles = this.getAngles(x, y, current_mouse);

        let theta = this.getAnglesTheta(x, current_mouse_x);
        let phi = this.getAnglesPhi(y, current_mouse_y);

        // se cambia la posición de la cámara utilizando los ángulos anteriores para determinar las coordenadas polares
        this.setPos(new Vector3(
            this.radius * Math.cos(phi) * Math.cos(theta),
            this.radius * Math.sin(phi),
            this.radius * Math.cos(phi) * Math.sin(theta)
        ));
    }

    /**
     * Función que calcula los ángulos theta y phi sobre la esfera, para determinar la posición de la cámara
     * @param {Object} init_mouse es un objeto que contiene las coordenadas del mouse cuando se dio clic en el canvas
     * @param {Object} current_mouse es un objeto que contiene las coordenadas actuales del mouse 
     */
    getAngles(x, y, current_mouse) {
        // es la restricción del ángulo de movimiento de la cámara, esto es útil para que la cámara no rote completamente y se desoriente
        let rest = Math.PI / 2 - 0.1;

        // theta es el ángulo determinado por la proyección de la cámara en el plano XZ; y está controlado por el movimiento en el eje X del mouse
        let theta = this.theta + (current_mouse.x - x) / 100;

        // phi es el ángulo determinado por la proyección de la cámara en el plano XY; y está controlado por el movimiento en el eje Y del mouse
        let phi = Math.min(
            Math.max(
                this.phi + (current_mouse.y - y) / 100, -1 * rest
            ),
            rest
        );

        return {
            theta: theta,
            phi: phi
        };
    }

    getAnglesTheta(x, current_mouse) {
        // theta es el ángulo determinado por la proyección de la cámara en el plano XZ; y está controlado por el movimiento en el eje X del mouse
        let theta = this.theta + (current_mouse - x) / 100;

        return theta;
    }

    getAnglesPhi(y, current_mouse) {
        // es la restricción del ángulo de movimiento de la cámara, esto es útil para que la cámara no rote completamente y se desoriente
        let rest = Math.PI / 2 - 0.1;

        // phi es el ángulo determinado por la proyección de la cámara en el plano XY; y está controlado por el movimiento en el eje Y del mouse
        let phi = Math.min(
            Math.max(
                this.phi + (current_mouse - y) / 100, -1 * rest
            ),
            rest
        );

        return phi;
    }
}
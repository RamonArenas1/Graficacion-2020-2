export default class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = arguments[0];
        this.y = arguments[1];
        this.z = arguments[2];
    }

    /**
     * Funcion que realiza suma de Vectores
     * @param {Vector3} u
     * @param {Vector3} v
     * @return {Vector3}
     */
    static add(u, v) {
        return new Vector3(u.x + v.x, u.y + v.y, u.z + v.z);
    }

    /**
     * ​Función que devuelve un objeto el cual contiene los mismos valores que el objeto desde
     * el cual se invocó la función
     * @return {Vector3}
     */
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * Función que devuelve el producto cruz de sus argumentos.
     * @param {Vector3} u
     * @param {Vector3} v
     * @return {Vector3}
     */
    static cross(u, v) {
        return new Vector3((u.y * v.z - u.z * v.y), -(u.x * v.z - u.z * v.x), (u.x * v.y - u.y - v.x));
    }

    /**
     * Función que devuelve la distancia euclidiana que hay entre sus argumentos.
     * @param {Vector3} u
     * @param {Vector3} v
     * @return {Number}
     */
    static distance(u, v) {
        return Math.sqrt(Vector3.squaredDistance(u, v));
    }

    /**
     * Función que devuelve el producto punto de sus argumentos.
     * @param {Vector3} u
     * @param {Vector3} v
     * @return {Number}
     */
    static dot(u, v) {
        return ((u.x * v.x) + (u.y * v.y) + (u.z * v.z));
    }

    /**
     * ​Función que devuelve verdadero en caso de que sus argumentos sean
     * aproximadamente iguales (con una ​ ε = ​ 0.000001​ ), y falso en caso contrario.
     * @param {Vector3} u
     * @param {Vector3} v
     * @return {Boolean}
     */
    static equals(u, v) {
        var epsilon = 0.000001;
        return (Math.abs(u.x - v.x) <= epsilon && Math.abs(u.y - v.y) <= epsilon && Math.abs(u.z - v.z) <= epsilon);
    }

    /**
     * Función que devuelve verdadero en caso de que sus argumentos sean
     * exactamente iguales y falso en caso contrario.
     * @param {Vector3} u
     * @param {Vector3} v
     * @return {Boolean}
     */
    static exactEquals(u, v) {
        return ((u.x - v.x) == 0 && (u.y - v.y) == 0 && (u.z - v.z) == 0)
    }

    /**
     * Función que devuelve el vector resultado de la normalización del vector que invoca la función.
     * @return {Vector3}
     */
    normalize() {
        return this.scalar(1 / this.length());
    }

    /**
     * Función que asigna nuevos valores a los componentes del vector con que se llama.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Función que devuelve la distancia euclidiana al cuadrado que hay entre sus argumentos.
     * @param {Vector3} u
     * @param {Vector3} v
     * @return {Number}
     */
    static squaredDistance(u, v) {
        return (Math.pow(u.x - v.x, 2) + Math.pow(u.y - v.y, 2) + Math.pow(u.z - v.z, 2));
    }

    /**
     * Función zero, les da el valor de cero a cada una de las componentes del
     * vector que invoca la función.
     */
    zero() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    //////////  AUXILIARES //////////

    /**
     * Función length, calcula el tamaño que tiene el vector que invoca la funión.
     * @return {Number}
     */
    length() {
        return Math.sqrt(this.squaredLength());
    }

    /**
     * Función scalar, dado un número escalar dado, nos regresa el vector resultante
     * de multiplicar ese número por cada una de las componentes del vector
     * que invoca la función.
     * @param {Number} a
     * @return {Vector3}
     */
    scalar(a) {
        return new Vector3(a * this.x, a * this.y, a * this.z);
    }
}
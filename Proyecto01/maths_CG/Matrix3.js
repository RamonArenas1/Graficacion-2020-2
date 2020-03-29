import Vector3 from "./Vector3.js";

export default class Matrix3 {
    /** 
     * Constructor de para la clase:
     * @param {Matrix3}
     * que construye una matriz 3x3 para graficacion 2d
     */
    constructor(a00 = 1, a01 = 0, a02 = 0, a10 = 0, a11 = 1, a12 = 0, a20 = 0, a21 = 0, a22 = 1) {
        this.a00 = arguments[0];
        this.a01 = arguments[1];
        this.a02 = arguments[2];
        this.a10 = arguments[3];
        this.a11 = arguments[4];
        this.a12 = arguments[5];
        this.a20 = arguments[6];
        this.a21 = arguments[7];
        this.a22 = arguments[8];
    }

    /**
     * Función que realiza la suma de 2 matrices que son los parametros que recibe
     * @param {Matrix3} m1
     * @param {Matrix3} m2
     * @return {Matrix3}
     */
    static add(m1, m2) {
        return new Matrix3(m1.a00 + m2.a00, m1.a01 + m2.a01, m1.a02 + m2.a02, m1.a10 + m2.a10, m1.a11 + m2.a11, m1.a12 + m2.a12, m1.a20 + m2.a20, m1.a21 + m2.a21, m1.a22 + m2.a22);
    }

    /**
     * Función que devuelve la matriz adjunta (o matriz de cofactores), de la matriz con que
     * se invoca la función.
     * @return {Matrix3}
     */
    adjoint() {
        return new Matrix3(this.adjoint00(), this.adjoint01(), this.adjoint02(), this.adjoint10(), this.adjoint11(), this.adjoint12(), this.adjoint20(), this.adjoint21(), this.adjoint22());
    }

    /**
     * Funcíon que asigna los valores al objeto al que se le aplica la funcion.
     * @return {Matrix3}
     */
    clone() {
        return new Matrix3(this.a00, this.a01, this.a02, this.a10, this.a11, this.a12, this.a20, this.a21, this.a22);
    }

    /**
     * Función que devuelve el valor determinante de una matriz.
     * @return {Number}
     */
    determinant() {
        return (this.a11 * this.a22 - this.a21 * this.a12) * this.a00 - (this.a10 * this.a22 - this.a20 * this.a12) * this.a01 + (this.a10 * this.a21 - this.a20 * this.a11) * this.a02;
    }

    /**
     * Función que devuelve verdadero en caso de que sus argumentos sean
     * aproximadamente iguales (con una ​ ε = ​ 0.000001​ ) y falso en caso contrario.
     * @param {Matrix3} m1
     * @param {Matrix3} m2
     * @return {Boolean}
     */
    static equals(m1, m2) {
        var epsilon = 0.000001;
        return (Math.abs(m1.a00 - m2.a00) <= epsilon) && (Math.abs(m1.a01 - m2.a01) <= epsilon) && (Math.abs(m1.a02 - m2.a02) <= epsilon) && (Math.abs(m1.a10 - m2.a10) <= epsilon) && (Math.abs(m1.a11 - m2.a11) <= epsilon) && (Math.abs(m1.a12 - m2.a12) <= epsilon) && (Math.abs(m1.a20 - m2.a20) <= epsilon) && (Math.abs(m1.a21 - m2.a21) <= epsilon) && (Math.abs(m1.a22 - m2.a22) <= epsilon);
    }

    /**
     * Función que devuelve verdadero en caso de que sus argumentos sean
     * exactamente iguales, y falso en caso contrario.
     * @param {Matrix3} m1
     * @param {Matrix3} m2
     * @return {Boolean}
     */
    static exactEquals(m1, m2) {
        return (Math.abs(m1.a00 - m2.a00) == 0) && (Math.abs(m1.a01 - m2.a01) == 0) && (Math.abs(m1.a02 - m2.a02) == 0) && (Math.abs(m1.a10 - m2.a10) == 0) && (Math.abs(m1.a11 - m2.a11) == 0) && (Math.abs(m1.a12 - m2.a12) == 0) && (Math.abs(m1.a20 - m2.a20) == 0) && (Math.abs(m1.a21 - m2.a21) == 0) && (Math.abs(m1.a22 - m2.a22) == 0);
    }

    /**
     * Función que asigna valores de una matriz identidad a la matriz a la que
     * se le aplique esta función
     */
    identity() {
        this.a00 = 1;
        this.a01 = 0;
        this.a02 = 0;
        this.a10 = 0;
        this.a11 = 1;
        this.a12 = 0;
        this.a20 = 0;
        this.a21 = 0;
        this.a22 = 1;
    }

    /**
     * Función que devuelve la matriz inversa de la matriz con la que se invocó la función.
     * @return {Matrix3}
     */
    invert() {
        return Matrix3.multiplyScalar(this.adjoint().transpose(), 1 / this.determinant());
    }

    /**
     * Función que realiza la multiplicación de matrices a los parametros recibidos.
     * @param {Matrix3} m1
     * @param {Matrix3} m2
     * @return {Matrix3}
     */
    static multiply(m1, m2) {
        return new Matrix3(m1.a00 * m2.a00 + m1.a01 * m2.a10 + m1.a02 * m2.a20, m1.a00 * m2.a01 + m1.a01 * m2.a11 + m1.a02 * m2.a21, m1.a00 * m2.a02 + m1.a01 * m2.a12 + m1.a02 * m2.a22, m1.a10 * m2.a00 + m1.a11 * m2.a10 + m1.a12 * m2.a20, m1.a10 * m2.a01 + m1.a11 * m2.a11 + m1.a12 * m2.a21, m1.a10 * m2.a02 + m1.a11 * m2.a12 + m1.a12 * m2.a22, m1.a20 * m2.a00 + m1.a21 * m2.a10 + m1.a22 * m2.a20, m1.a20 * m2.a01 + m1.a21 * m2.a11 + m1.a22 * m2.a21, m1.a20 * m2.a02 + m1.a21 * m2.a12 + m1.a22 * m2.a22);
    }

    /**
     * Función que realiza la multiplicación escalar a los parametros recibidos.
     * @param {Matrix3} m1
     * @param {Number} c
     * @return {Matrix3}
     */
    static multiplyScalar(m1, c) {
        return new Matrix3(c * m1.a00, c * m1.a01, c * m1.a02, c * m1.a10, c * m1.a11, c * m1.a12, c * m1.a20, c * m1.a21, c * m1.a22);
    }

    /**
     * Función que devuelve el vector resultado de multiplicar el vector ​ v por la
     * matriz con que se llama la función. Esta función es la que nos va a permitir realizar las
     * transformaciones.
     * @param {Vector3} v
     * @return {Vector3}
     */
    multiplyVector(v) {
        return new Vector3((v.x * this.a00) + (v.y * this.a10) + (v.z * this.a20), (v.x * this.a01) + (v.y * this.a11) + (v.z * this.a21), (v.x * this.a02) + (v.y * this.a12) + (v.z * this.a22));
    }

    /**
     * Función que devuelve una matriz de ​ 3 × 3 que representa una transformación de
     * rotación en ​ theta​ radianes.
     * @param {Number} theta
     * @return {Matrix3}
     */
    static rotate(theta) {
        let g = Math.PI / 180;
        return new Matrix3(Math.cos(theta * g), Math.sin(theta * g), 0, (-1) * Math.sin(theta * g), Math.cos(theta * g), 0, 0, 0, 1);
    }

    /**
     * Función que devuelve una matriz de ​ 3 × 3 que representa una transformación de
     * escalamiento, con el factor ​ sx​ como escalamiento en x ​ ​ y ​ sy​ como escalamiento en ​ y. ​
     * @param {Number} sx
     * @param {Number} sy
     * @return {Matrix3}
     */
    static scale(sx, sy) {
        return new Matrix3(sx, 0, 0,
            0, sy, 0,
            0, 0, 1);
    }

    /**
     * Función que asigna nuevos valores a los componentes de la matriz con que se llama.
     * @param {Number} a00
     * @param {Number} a01
     * @param {Number} a02
     * @param {Number} a10
     * @param {Number} a11
     * @param {Number} a12
     * @param {Number} a20
     * @param {Number} a21
     * @param {Number} a22
     */
    set(a00, a01, a02, a10, a11, a12, a20, a21, a22) {
        this.a00 = a00;
        this.a01 = a01;
        this.a02 = a02;
        this.a10 = a10;
        this.a11 = a11;
        this.a12 = a12;
        this.a20 = a20;
        this.a21 = a21;
        this.a22 = a22;
    }

    /**
     * Función que sustrae componente a componente la matriz ​ m2​ de la matriz ​ m1​
     * @param {Matrix3} m1
     * @param {Matrix3} m2
     * @return {Matrix3}
     */
    static subtract(m1, m2) {
        return Matrix3.add(m1, Matrix3.multiplyScalar(m2, -1));
    }

    /**
     * unción que devuelve una matriz de ​ 3 × 3 que representa una transformación de
     * traslación, con ​ tx​ como la traslación en ​ x ​ y ​ ty​ como la traslación en ​ y. ​
     * @param {Number} tx
     * @param {Number} ty
     * @return {Matrix3}
     */
    static translate(tx, ty) {
        return new Matrix3(
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1);
    }

    /**
     * Función que devuelve la matriz transpuesta de la matriz desde donde se invocó la función.
     * @return {Matrix3}
     */
    transpose() {
        return new Matrix3(this.a00, this.a10, this.a20, this.a01, this.a11, this.a21, this.a02, this.a12, this.a22);
    }


    //////////  AUXILIARES //////////

    /**
     * Función adjoint{i}{j}, Calcula el determinate de la matriz que invoca  la función
     * en el caso de que se eliminara la fila i y la columna j, y después eso lo multiplica
     * por (-1)^(i+j) y nos regresa el valor obtenido
     * @return {Number}
     */

    adjoint00() {
        let aij = new Matrix3(1, 0, 0, this.a10, this.a11, this.a12, this.a20, this.a21, this.a22);
        return Math.pow(-1, 0) * aij.determinant();
    }
    adjoint01() {
        let aij = new Matrix3(0, -1, 0, this.a10, this.a11, this.a12, this.a20, this.a21, this.a22);
        return Math.pow(-1, 1) * aij.determinant();
    }
    adjoint02() {
        let aij = new Matrix3(0, 0, 1, this.a10, this.a11, this.a12, this.a20, this.a21, this.a22);
        return Math.pow(-1, 2) * aij.determinant();
    }

    adjoint10() {
        let aij = new Matrix3(1, 0, 0, this.a00, this.a01, this.a02, this.a20, this.a21, this.a22);
        return Math.pow(-1, 1) * aij.determinant();
    }
    adjoint11() {
        let aij = new Matrix3(0, -1, 0, this.a00, this.a01, this.a02, this.a20, this.a21, this.a22);
        return Math.pow(-1, 2) * aij.determinant();
    }
    adjoint12() {
        let aij = new Matrix3(0, 0, 1, this.a00, this.a01, this.a02, this.a20, this.a21, this.a22);
        return Math.pow(-1, 3) * aij.determinant();
    }

    adjoint20() {
        let aij = new Matrix3(1, 0, 0, this.a00, this.a01, this.a02, this.a10, this.a11, this.a12);
        return Math.pow(-1, 2) * aij.determinant();
    }
    adjoint21() {
        let aij = new Matrix3(0, -1, 0, this.a00, this.a01, this.a02, this.a10, this.a11, this.a12);
        return Math.pow(-1, 3) * aij.determinant();
    }
    adjoint22() {
        let aij = new Matrix3(0, 0, 1, this.a00, this.a01, this.a02, this.a10, this.a11, this.a12);
        return Math.pow(-1, 4) * aij.determinant();
    }
}
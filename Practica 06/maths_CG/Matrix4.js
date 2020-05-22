/*
 *Autores : Millan Pimentel Oscar Fernando
 *          Arenas Ayala Ramón
 */

import Vector4 from "./Vector4.js";
import Vector3 from "./Vector3.js";
import Matrix3 from "./Matrix3.js";

export default class Matrix4 {
    constructor(a00 = 1, a01 = 0, a02 = 0, a03 = 0, a10 = 0, a11 = 1, a12 = 0, a13 = 0, a20 = 0, a21 = 0, a22 = 1, a23 = 0, a30 = 1, a31 = 0, a32 = 0, a33 = 0) {
        this.a00 = arguments[0];
        this.a01 = arguments[1];
        this.a02 = arguments[2];
        this.a03 = arguments[3];
        this.a10 = arguments[4];
        this.a11 = arguments[5];
        this.a12 = arguments[6];
        this.a13 = arguments[7];
        this.a20 = arguments[8];
        this.a21 = arguments[9];
        this.a22 = arguments[10];
        this.a23 = arguments[11];
        this.a30 = arguments[12];
        this.a31 = arguments[13];
        this.a32 = arguments[14];
        this.a33 = arguments[15];
    }

    /** 
     *                          FUNCIONES DE LA CLASE
     */

    /**
     * Función set, cambia ls valores de la matriz que llama la función.
     * @param {Number} a00
     * @param {Number} a01
     * @param {Number} a02
     * @param {Number} a03
     * @param {Number} a10
     * @param {Number} a11
     * @param {Number} a12
     * @param {Number} a13
     * @param {Number} a20
     * @param {Number} a21
     * @param {Number} a22
     * @param {Number} a23
     * @param {Number} a30
     * @param {Number} a31
     * @param {Number} a32
     * @param {Number} a33
     */
    set(a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33) {
        this.a00 = a00;
        this.a01 = a01;
        this.a02 = a02;
        this.a03 = a03;
        this.a10 = a10;
        this.a11 = a11;
        this.a12 = a12;
        this.a13 = a13;
        this.a20 = a20;
        this.a21 = a21;
        this.a22 = a22;
        this.a23 = a23;
        this.a30 = a30;
        this.a31 = a31;
        this.a32 = a32;
        this.a33 = a33;
    }

    /**
     * Función clone, regresa una matriz exactamente igual a la que llama la función.
     * @return {Matrix4}
     */
    clone() {
        return new Matrix4(this.a00, this.a01, this.a02, this.a03, this.a10, this.a11, this.a12, this.a13, this.a20, this.a21, this.a22, this.a23, this.a30, this.a31, this.a32, this.a33);
    }

    /**
     * Función identity, asigna los valores de la matriz identidad a la matriz que
     * invoca la función.
     */
    identity() {
        this.a00 = 1;
        this.a01 = 0;
        this.a02 = 0;
        this.a03 = 0;
        this.a10 = 0;
        this.a11 = 1;
        this.a12 = 0;
        this.a13 = 0;
        this.a20 = 0;
        this.a21 = 0;
        this.a22 = 1;
        this.a23 = 0;
        this.a30 = 0;
        this.a31 = 0;
        this.a32 = 0;
        this.a33 = 1;
    }

    /** 
     *                          OPERACIONES DE MATRICES
     */

    /**
     * Función add, realiza la suma de dos matrices y regresa la matriz resultante.
     * @param {Matrix4} m1
     * @param {Matrix4} m2
     * @return {Matrix4}
     */
    static add(m1, m2) {
        return new Matrix4(m1.a00 + m2.a00, m1.a01 + m2.a01, m1.a02 + m2.a02, m1.a03 + m2.a03, m1.a10 + m2.a10, m1.a11 + m2.a11, m1.a12 + m2.a12, m1.a13 + m2.a13, m1.a20 + m2.a20, m1.a21 + m2.a21, m1.a22 + m2.a22, m1.a23 + m2.a23, m1.a30 + m2.a30, m1.a31 + m2.a31, m1.a32 + m2.a32, m1.a33 + m2.a33);
    }

    /**
     * Función multiply, nos regresa la matriz resultante de multiplicar dos matrices.
     * @param {Matrix4} m1
     * @param {Matrix4} m2
     * @return {Matrix4}
     */
    static multiply(m1, m2) {
        return new Matrix4(m1.a00 * m2.a00 + m1.a01 * m2.a10 + m1.a02 * m2.a20 + m1.a03 * m2.a30, m1.a00 * m2.a01 + m1.a01 * m2.a11 + m1.a02 * m2.a21 + m1.a03 * m2.a31, m1.a00 * m2.a02 + m1.a01 * m2.a12 + m1.a02 * m2.a22 + m1.a03 * m2.a32, m1.a00 * m2.a03 + m1.a01 * m2.a13 + m1.a02 * m2.a23 + m1.a03 * m2.a33, m1.a10 * m2.a00 + m1.a11 * m2.a10 + m1.a12 * m2.a20 + m1.a13 * m2.a30, m1.a10 * m2.a01 + m1.a11 * m2.a11 + m1.a12 * m2.a21 + m1.a13 * m2.a31, m1.a10 * m2.a02 + m1.a11 * m2.a12 + m1.a12 * m2.a22 + m1.a13 * m2.a32, m1.a10 * m2.a03 + m1.a11 * m2.a13 + m1.a12 * m2.a23 + m1.a13 * m2.a33, m1.a20 * m2.a00 + m1.a21 * m2.a10 + m1.a22 * m2.a20 + m1.a23 * m2.a30, m1.a20 * m2.a01 + m1.a21 * m2.a11 + m1.a22 * m2.a21 + m1.a23 * m2.a31, m1.a20 * m2.a02 + m1.a21 * m2.a12 + m1.a22 * m2.a22 + m1.a23 * m2.a32, m1.a20 * m2.a03 + m1.a21 * m2.a13 + m1.a22 * m2.a23 + m1.a23 * m2.a33, m1.a30 * m2.a00 + m1.a31 * m2.a10 + m1.a32 * m2.a20 + m1.a33 * m2.a30, m1.a30 * m2.a01 + m1.a31 * m2.a11 + m1.a32 * m2.a21 + m1.a33 * m2.a31, m1.a30 * m2.a02 + m1.a31 * m2.a12 + m1.a32 * m2.a22 + m1.a33 * m2.a32, m1.a30 * m2.a03 + m1.a31 * m2.a13 + m1.a32 * m2.a23 + m1.a33 * m2.a33);
    }

    /**
     * Función multiplyScalar, dado una matriz y un número escalar, ns regresa la matriz
     * resultante de multiplicar ese número por cada una de las componentes de la matriz.
     * @param {Matrix4} m1
     * @param {Number} c
     * @return {Matrix4}
     */
    static multiplyScalar(m1, c) {
        return new Matrix4(c * m1.a00, c * m1.a01, c * m1.a02, c * m1.a03,
            c * m1.a10, c * m1.a11, c * m1.a12, c * m1.a13,
            c * m1.a20, c * m1.a21, c * m1.a22, c * m1.a23,
            c * m1.a30, c * m1.a31, c * m1.a32, c * m1.a33);
    }

    /**
     * multiplyVector, devuelve el resultado de multiplicar el vector v por la Matrix4
     * desde la cual se invoca la función.
     * @param {Vector4} v
     * @return {Vector4}
     */
    multiplyVector(v) {
        return new Vector4((v.x * this.a00) + (v.y * this.a01) + (v.z * this.a02) + (v.w * this.a03), (v.x * this.a10) + (v.y * this.a11) + (v.z * this.a12) + (v.w * this.a13), (v.x * this.a20) + (v.y * this.a21) + (v.z * this.a22) + (v.w * this.a23), (v.x * this.a30) + (v.y * this.a31) + (v.z * this.a32) + (v.w * this.a33));
    }

    /**
     * Función subtract, dado dos matricez nos regresa la matriz resultante de substraer
     * la segunda matriz de la primera.
     * @param {Matrix4} m1
     * @param {Matrix4} m2
     * @return {Matrix4}
     */
    static subtract(m1, m2) {
        return Matrix4.add(m1, Matrix4.multiplyScalar(m2, -1));
    }

    /** 
     *                          TRANSFORMACIONES DE LA MATRIZ
     */

    /**
     * Función transpose, nos regresa la matriz transpuesta de la matriz que llama
     * a la función.
     * @return {Matrix4}
     */
    transpose() {
        return new Matrix4(
            this.a00, this.a10, this.a20, this.a30,
            this.a01, this.a11, this.a21, this.a31,
            this.a02, this.a12, this.a22, this.a32,
            this.a03, this.a13, this.a23, this.a33);
    }

    /**
     * Función adjoint, regresa la matriz adjunta de la matriz que llama a la función.
     * @return {Matrix4}
     */
    adjoint() {
        return new Matrix4(this.adjoint00(), this.adjoint01(), this.adjoint02(), this.adjoint03(), this.adjoint10(), this.adjoint11(), this.adjoint12(), this.adjoint13(), this.adjoint20(), this.adjoint21(), this.adjoint22(), this.adjoint23(), this.adjoint30(), this.adjoint31(), this.adjoint32(), this.adjoint33());
    }

    /**
     * Función determinant, calcula el determinate de la matriz que llama la función
     * y nos regresa su valor.
     * @return {Number}
     */
    determinant() {
        let m00 = new Matrix3(this.a11, this.a12, this.a13, this.a21, this.a22, this.a23, this.a31, this.a32, this.a33);

        let m10 = new Matrix3(this.a01, this.a02, this.a03, this.a21, this.a22, this.a23, this.a31, this.a32, this.a33);

        let m20 = new Matrix3(this.a01, this.a02, this.a03, this.a11, this.a12, this.a13, this.a31, this.a32, this.a33);

        let m30 = new Matrix3(this.a01, this.a02, this.a03, this.a11, this.a12, this.a13, this.a21, this.a22, this.a23);

        return (this.a00 * m00.determinant() - this.a10 * m10.determinant() + this.a20 * m20.determinant() - this.a30 * m30.determinant());
    }

    /**
     * Función invert, regresa la matriz inversa de la matriz que llama la función.
     * @return {Matrix4}
     */
    invert() {
        return Matrix4.multiplyScalar(this.adjoint().transpose(), 1 / this.determinant());
    }



    /**
     * Función equals, dado una e = 0.000001 nos dice si cada una de las componentes
     * de dos matrices son distintas entre sí a lo mas en e.
     * @param {Matrix4} m1
     * @param {Matrix4} m2
     * @return {Boolean}
     */
    static equals(m1, m2) {
        var epsilon = 0.000001;
        return (Math.abs(m1.a00 - m2.a00) <= epsilon) && (Math.abs(m1.a01 - m2.a01) <= epsilon) && (Math.abs(m1.a02 - m2.a02) <= epsilon) && (Math.abs(m1.a03 - m2.a03) <= epsilon) && (Math.abs(m1.a10 - m2.a10) <= epsilon) && (Math.abs(m1.a11 - m2.a11) <= epsilon) && (Math.abs(m1.a12 - m2.a12) <= epsilon) && (Math.abs(m1.a13 - m2.a13) <= epsilon) && (Math.abs(m1.a20 - m2.a20) <= epsilon) && (Math.abs(m1.a21 - m2.a21) <= epsilon) && (Math.abs(m1.a22 - m2.a22) <= epsilon) && (Math.abs(m1.a23 - m2.a23) <= epsilon) && (Math.abs(m1.a30 - m2.a30) <= epsilon) && (Math.abs(m1.a31 - m2.a31) <= epsilon) && (Math.abs(m1.a32 - m2.a32) <= epsilon) && (Math.abs(m1.a33 - m2.a33) <= epsilon);
    }

    /**
     * Función exactEquals, nos dice si cada una de las componentes de dos matrices son
     * exactamente iguales entre sí
     * @param {Matrix4} m1
     * @param {Matrix4} m2
     * @return {Boolean}
     */
    static exactEquals(m1, m2) {
        return (Math.abs(m1.a00 - m2.a00) == 0) && (Math.abs(m1.a01 - m2.a01) == 0) && (Math.abs(m1.a02 - m2.a02) == 0) && (Math.abs(m1.a03 - m2.a03) == 0) && (Math.abs(m1.a10 - m2.a10) == 0) && (Math.abs(m1.a11 - m2.a11) == 0) && (Math.abs(m1.a12 - m2.a12) == 0) && (Math.abs(m1.a13 - m2.a13) == 0) && (Math.abs(m1.a20 - m2.a20) == 0) && (Math.abs(m1.a21 - m2.a21) == 0) && (Math.abs(m1.a22 - m2.a22) == 0) && (Math.abs(m1.a23 - m2.a23) == 0) && (Math.abs(m1.a30 - m2.a30) == 0) && (Math.abs(m1.a31 - m2.a31) == 0) && (Math.abs(m1.a32 - m2.a32) == 0) && (Math.abs(m1.a33 - m2.a33) == 0);
    }

    /** 
     *                          COORDENADAS DEL MUNDO
     */

    /**
     * rotateX, devuelve una matriz de rotación en 3D sobre el eje X con el ángulo
     * (en radianes) dado por rad.
     * @param {Number} rad
     * @return {Matrix4}
     */
    static rotateX(theta) {
        let g = Math.PI / 180;
        let m = new Matrix4(1, 0, 0, 0,
            0, Math.cos(theta * g), Math.sin(theta * g) * (-1), 0,
            0, Math.sin(theta * g), Math.cos(theta * g), 0,
            0, 0, 0, 1);
        return m.transpose();
    }

    /**
     * rotateY, devuelve una matriz de rotación en 3D sobre el eje Y con el ángulo
     * (en radianes) dado por rad.
     * @param {Number} rad
     * @return {Matrix4}
     */
    static rotateY(theta) {
        let g = Math.PI / 180;
        let m = new Matrix4(Math.cos(theta * g), 0, Math.sin(theta * g), 0,
            0, 1, 0, 0,
            Math.sin(theta * g) * (-1), 0, Math.cos(theta * g), 0,
            0, 0, 0, 1);
        return m.transpose();
    }

    /**
     * rotateZ, devuelve una matriz de rotación en 3D sobre el eje Z con el ángulo
     * (en radianes) dado por rad.
     * @param {Number} rad
     * @return {Matrix4}
     */
    static rotateZ(theta) {
        let g = Math.PI / 180;
        let m = new Matrix4(Math.cos(theta * g), Math.sin(theta * g) * (-1), 0, 0,
            Math.sin(theta * g), Math.cos(theta * g), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);
        return m.transpose();
    }

    /**
     * scale, devuelve una matriz de escalamiento en 3D con los factores de escala
     * determinados por las componentes del vector v.
     * @param {Vector3} v
     * @return {Matrix4}
     */
    static scale(v) {
        return new Matrix4(
            v.x, 0, 0, 0,
            0, v.y, 0, 0,
            0, 0, v.z, 0,
            0, 0, 0, 1);
    }

    /**
     * translate, devuelve una matriz de traslación en 3D con los factores de desplazamiento
     * dados por las componentes del vector v.
     * @param {Vector3} v
     * @return {Matrix4}
     */
    static translate(v) {
        let m = new Matrix4(
            1, 0, 0, v.x,
            0, 1, 0, v.y,
            0, 0, 1, v.z,
            0, 0, 0, 1);
        return m;
    }

    /** 
     *                          COORDENADAS DE LA CAMARA
     */

    /**
     * lookAt, devuelve la matriz de vista a partir de la posición del ojo (eye) el centro
     * de interés (center) y el vector hacia arriba (up).
     * @param {Vector3} eye
     * @param {Vector3} center
     * @param {Vector3} up
     * @return {Matrix4}
     */
    static lookAt(eye, center, up) {

        let w = Vector3.subtract(eye, center).normalize();
        let u = Vector3.cross(up, w).normalize();
        let v = Vector3.cross(w, u).normalize();

        let m1 = new Matrix4(
            u.x, u.y, u.z, 0,
            v.x, v.y, v.z, 0,
            w.x, w.y, w.z, 0,
            0, 0, 0, 1);

        let m2 = new Matrix4(
            1, 0, 0, eye.x * (-1),
            0, 1, 0, eye.y * (-1),
            0, 0, 1, eye.z * (-1),
            0, 0, 0, 1);

        let m = Matrix4.multiply(m1, m2);

        return m;
    }

    /**
     * @return {Array}
     */
    toArray() {
        return [
            this.a00, this.a10, this.a20, this.a30,
            this.a01, this.a11, this.a21, this.a31,
            this.a02, this.a12, this.a22, this.a32,
            this.a03, this.a13, this.a23, this.a33
        ];
    }

    /** 
     *                          PROYECCIONES
     */

    /**
     * frustum, construye una matriz que representa la pirámide truncada (view frustum),
     * determinada por los planos dados por los parámetros left, right, bottom, top, near y far.
     * @param {Number} left
     * @param {Number} right
     * @param {Number} bottom
     * @param {Number} top
     * @param {Number} near
     * @param {Number} far
     * @return {Matrix4}
     */
    static frustum(left, right, bottom, top, near, far) {
        let m = new Matrix4(
            ((2 * near) / (right - left)), 0, ((right + left) / (right - left)), 0,
            0, ((2 * near) / (top - bottom)), ((top + bottom) / (top - bottom)), 0,
            0, 0, ((-1) * ((far + near) / (far - near))), ((-1) * ((2 * far * near) / (far - near))),
            0, 0, -1, 0);
        return m;
    }

    /**
     * ortho, devuelve una matriz que corresponde a una proyección ortogonal, determinada
     * por los planos dados por los parámetros left, right, bottom, top, near y far.
     * @param {Number} left
     * @param {Number} right
     * @param {Number} bottom
     * @param {Number} top
     * @param {Number} near
     * @param {Number} far
     * @return {Matrix4}
     */
    static ortho(left, right, bottom, top, near, far) {
        let m1 = new Matrix4((2 / (right - left)), 0, 0, (-1) * ((right + left) / (right - left)),
            0, (2 / (top - bottom)), 0, (-1) * ((top + bottom) / (top - bottom)),
            0, 0, (2 / (near - far)), (-1) * ((near + far) / (near - far)),
            0, 0, 0, 1);

        let m2 = new Matrix4(near, 0, 0, 0,
            0, near, 0, 0,
            0, 0, near + far, (-1) * far * near,
            0, 0, 1, 0)

        /**let m = new Matrix4 ( ((2*near)/(right-left))              , 0                                  , 0                              , 0,
                              0                                  , ((2*near)/(top-bottom))              , 0                              , 0,
                              (-1)*((right+left)/(right - left)) , (-1)*((top+bottom)/(top - bottom)) , ((near+far)/(near - far))      , 1,
                              0                                  , 0                                  , (-1)*((2*near*far)/(near-far)) , 0);
        return m.transpose();*/

        let m = this.multiply(m1, m2);
        return m1;
    }

    /**
     * perspective, devuelve una matriz que corresponde a una proyección en perspectiva.
     * El parámetro fovy corresponde al campo de visión vertical (field of view), el parámetro
     * aspect corresponde a la relación de aspecto, near es la distancia del plano más cercano y far es
     * la distancia del plano más lejano.
     * @param {Number} fovy
     * @param {Number} aspect
     * @param {Number} near
     * @param {Number} far
     * @return {Matrix4}
     */
    static perspective(fovy, aspect, near, far) {
        let ftan = 1 / Math.tan(fovy / 2);

        let m = new Matrix4(
            ftan / aspect, 0, 0, 0,
            0, ftan, 0, 0,
            0, 0, (near + far) / (near - far), (2 * far * near) / (near - far),
            0, 0, -1, 0);
        return m;
    }

    ///////// Auxiliares //////////

    //////////////////////////////// Funciones adjointij ////////////////////////////////

    /**
     * Función adjointij, Calcula el determinate de la matriz que invoca  la función
     * en el caso de que se eliminara la fila i y la columna j, y después eso lo multiplica
     * por (-1)^(i+j) y nos regresa el valor obtenido
     * @return {Number}
     */

    adjoint00() {
        let aij = new Matrix4(1, this.a01, this.a02, this.a03, 0, this.a11, this.a12, this.a13, 0, this.a21, this.a22, this.a23, 0, this.a31, this.a32, this.a33);
        return Math.pow(-1, 0) * aij.determinant();
    }

    adjoint10() {
        let aij = new Matrix4(0, this.a01, this.a02, this.a03, -1, this.a11, this.a12, this.a13, 0, this.a21, this.a22, this.a23, 0, this.a31, this.a32, this.a33);
        return Math.pow(-1, 1) * aij.determinant();
    }

    adjoint20() {
        let aij = new Matrix4(0, this.a01, this.a02, this.a03, 0, this.a11, this.a12, this.a13, 1, this.a21, this.a22, this.a23, 0, this.a31, this.a32, this.a33);
        return Math.pow(-1, 2) * aij.determinant();
    }

    adjoint30() {
        let aij = new Matrix4(0, this.a01, this.a02, this.a03, 0, this.a11, this.a12, this.a13, 0, this.a21, this.a22, this.a23, -1, this.a31, this.a32, this.a33);
        return Math.pow(-1, 3) * aij.determinant();
    }

    adjoint01() {
        let aij = new Matrix4(1, this.a00, this.a02, this.a03, 0, this.a10, this.a12, this.a13, 0, this.a20, this.a22, this.a23, 0, this.a30, this.a32, this.a33);
        return Math.pow(-1, 1) * aij.determinant();
    }

    adjoint11() {
        let aij = new Matrix4(0, this.a00, this.a02, this.a03, -1, this.a10, this.a12, this.a13, 0, this.a20, this.a22, this.a23, 0, this.a30, this.a32, this.a33);
        return Math.pow(-1, 2) * aij.determinant();
    }

    adjoint21() {
        let aij = new Matrix4(0, this.a00, this.a02, this.a03, 0, this.a10, this.a12, this.a13, 1, this.a20, this.a22, this.a23, 0, this.a30, this.a32, this.a33);
        return Math.pow(-1, 3) * aij.determinant();
    }

    adjoint31() {
        let aij = new Matrix4(0, this.a00, this.a02, this.a03, 0, this.a10, this.a12, this.a13, 0, this.a20, this.a22, this.a23, -1, this.a30, this.a32, this.a33);
        return Math.pow(-1, 4) * aij.determinant();
    }

    adjoint02() {
        let aij = new Matrix4(1, this.a00, this.a01, this.a03, 0, this.a10, this.a11, this.a13, 0, this.a20, this.a21, this.a23, 0, this.a30, this.a31, this.a33);
        return Math.pow(-1, 2) * aij.determinant();
    }

    adjoint12() {
        let aij = new Matrix4(0, this.a00, this.a01, this.a03, -1, this.a10, this.a11, this.a13, 0, this.a20, this.a21, this.a23, 0, this.a30, this.a31, this.a33);
        return Math.pow(-1, 3) * aij.determinant();
    }

    adjoint22() {
        let aij = new Matrix4(0, this.a00, this.a01, this.a03, 0, this.a10, this.a11, this.a13, 1, this.a20, this.a21, this.a23, 0, this.a30, this.a31, this.a33);
        return Math.pow(-1, 4) * aij.determinant();
    }

    adjoint32() {
        let aij = new Matrix4(0, this.a00, this.a01, this.a03, 0, this.a10, this.a11, this.a13, 0, this.a20, this.a21, this.a23, -1, this.a30, this.a31, this.a33);
        return Math.pow(-1, 5) * aij.determinant();
    }

    adjoint03() {
        let aij = new Matrix4(1, this.a00, this.a01, this.a02, 0, this.a10, this.a11, this.a12, 0, this.a20, this.a21, this.a22, 0, this.a30, this.a31, this.a32);
        return Math.pow(-1, 3) * aij.determinant();
    }

    adjoint13() {
        let aij = new Matrix4(0, this.a00, this.a01, this.a02, -1, this.a10, this.a11, this.a12, 0, this.a20, this.a21, this.a22, 0, this.a30, this.a31, this.a32);
        return Math.pow(-1, 4) * aij.determinant();
    }

    adjoint23() {
        let aij = new Matrix4(0, this.a00, this.a01, this.a02, 0, this.a10, this.a11, this.a12, 1, this.a20, this.a21, this.a22, 0, this.a30, this.a31, this.a32);
        return Math.pow(-1, 5) * aij.determinant();
    }

    adjoint33() {
        let aij = new Matrix4(0, this.a00, this.a01, this.a02, 0, this.a10, this.a11, this.a12, 0, this.a20, this.a21, this.a22, -1, this.a30, this.a31, this.a32);
        return Math.pow(-1, 6) * aij.determinant();
    }

    /**
     * printm, muestra en consola la matriz que la llama
     */
    printm() {
        console.log("| " + this.a00 + " " + this.a01 + " " + this.a02 + " " + this.a03 + " |");
        console.log("| " + this.a10 + " " + this.a11 + " " + this.a12 + " " + this.a13 + " |");
        console.log("| " + this.a20 + " " + this.a21 + " " + this.a22 + " " + this.a23 + " |");
        console.log("| " + this.a30 + " " + this.a31 + " " + this.a32 + " " + this.a33 + " |");
    }

}
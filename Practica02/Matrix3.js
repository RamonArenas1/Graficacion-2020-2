var CG = (function(CG) {

    /**
     * Clase Matrix3, representa las matrices 3x3
     */
    class Matrix3 {

        /**
         * Constructor de la clase Matrix3.
         * En caso de no rcibir 9 o mas elementos asigna los valores para hacer a la
         * matriz identidad.
         */
        constructor() {
            if (arguments.length >= 9) {
                this.a00 = arguments[0];
                this.a01 = arguments[1];
                this.a02 = arguments[2];
                this.a10 = arguments[3];
                this.a11 = arguments[4];
                this.a12 = arguments[5];
                this.a20 = arguments[6];
                this.a21 = arguments[7];
                this.a22 = arguments[8];
            } else {
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
        }

        /**
         * Función add, realiza la suma de dos matrices y regresa la matriz resultante.
         * @param {Matrix3} m1
         * @param {Matrix3} m2
         * @return {Matrix3}
         */
        static add(m1, m2) {
            return new Matrix3(m1.a00 + m2.a00, m1.a01 + m2.a01, m1.a02 + m2.a02, m1.a10 + m2.a10, m1.a11 + m2.a11, m1.a12 + m2.a12, m1.a20 + m2.a20, m1.a21 + m2.a21, m1.a22 + m2.a22);
        }

        /**
         * Función adjoint, regresa la matriz adjunta de la matriz que llama a la función.
         * @return {Matrix3}
         */
        adjoint() {
            return new Matrix3(this.adjoint00(), this.adjoint01(), this.adjoint02(), this.adjoint10(), this.adjoint11(), this.adjoint12(), this.adjoint20(), this.adjoint21(), this.adjoint22());
        }

        /**
         * Función clone, regresa una matriz exactamente igual a la que llama la función.
         * @return {Matrix3}
         */
        clone() {
            return new Matrix3(this.a00, this.a01, this.a02, this.a10, this.a11, this.a12, this.a20, this.a21, this.a22);
        }

        /**
         * Función determinant, calcula el determinate de la matriz que llama la función
         * y nos regresa su valor.
         * @return {Number}
         */
        determinant() {
            return (this.a11 * this.a22 - this.a21 * this.a12) * this.a00 - (this.a10 * this.a22 - this.a20 * this.a12) * this.a01 + (this.a10 * this.a21 - this.a20 * this.a11) * this.a02;
        }

        /**
         * Función equals, dado una e = 0.000001 nos dice si cada una de las componentes
         * de dos matrices son distintas entre sí a lo mas en e.
         * @param {Matrix3} m1
         * @param {Matrix3} m2
         * @return {Boolean}
         */
        static equals(m1, m2) {
            var e = 0.000001;
            return (Math.abs(m1.a00 - m2.a00) <= e) && (Math.abs(m1.a01 - m2.a01) <= e) && (Math.abs(m1.a02 - m2.a02) <= e) && (Math.abs(m1.a10 - m2.a10) <= e) && (Math.abs(m1.a11 - m2.a11) <= e) && (Math.abs(m1.a12 - m2.a12) <= e) && (Math.abs(m1.a20 - m2.a20) <= e) && (Math.abs(m1.a21 - m2.a21) <= e) && (Math.abs(m1.a22 - m2.a22) <= e);
        }

        /**
         * Función exactEquals, nos dice si cada una de las componentes de dos matrices son
         * exactamente iguales entre sí
         * @param {Matrix3} m1
         * @param {Matrix3} m2
         * @return {Boolean}
         */
        static exactEquals(m1, m2) {
            return (Math.abs(m1.a00 - m2.a00) == 0) && (Math.abs(m1.a01 - m2.a01) == 0) && (Math.abs(m1.a02 - m2.a02) == 0) && (Math.abs(m1.a10 - m2.a10) == 0) && (Math.abs(m1.a11 - m2.a11) == 0) && (Math.abs(m1.a12 - m2.a12) == 0) && (Math.abs(m1.a20 - m2.a20) == 0) && (Math.abs(m1.a21 - m2.a21) == 0) && (Math.abs(m1.a22 - m2.a22) == 0);
        }

        /**
         * Función identity, asigna los valores de la matriz identidad a la matriz que
         * invoca la función.
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
         * Función invert, regresa la matriz inversa de la matriz que llama la función.
         * @return {Matrix3}
         */
        invert() {
            return Matrix3.multiplyScalar(this.adjoint().transpose(), 1 / this.determinant());
        }

        /**
         * Función multiply, nos regresa la matriz resultante de multiplicar dos matrices.
         * @param {Matrix3} m1
         * @param {Matrix3} m2
         * @return {Matrix3}
         */
        static multiply(m1, m2) {
            return new Matrix3(m1.a00 * m2.a00 + m1.a01 * m2.a10 + m1.a02 * m2.a20, m1.a00 * m2.a01 + m1.a01 * m2.a11 + m1.a02 * m2.a21, m1.a00 * m2.a02 + m1.a01 * m2.a12 + m1.a02 * m2.a22, m1.a10 * m2.a00 + m1.a11 * m2.a10 + m1.a12 * m2.a20, m1.a10 * m2.a01 + m1.a11 * m2.a11 + m1.a12 * m2.a21, m1.a10 * m2.a02 + m1.a11 * m2.a12 + m1.a12 * m2.a22, m1.a20 * m2.a00 + m1.a21 * m2.a10 + m1.a22 * m2.a20, m1.a20 * m2.a01 + m1.a21 * m2.a11 + m1.a22 * m2.a21, m1.a20 * m2.a02 + m1.a21 * m2.a12 + m1.a22 * m2.a22);
        }

        /**
         * Función multiplyScalar, dado una matriz y un número escalar, ns regresa la matriz
         * resultante de multiplicar ese número por cada una de las componentes de la matriz.
         * @param {Matrix3} m1
         * @param {Number} c
         * @return {Matrix3}
         */
        static multiplyScalar(m1, c) {
            return new Matrix3(c * m1.a00, c * m1.a01, c * m1.a02, c * m1.a10, c * m1.a11, c * m1.a12, c * m1.a20, c * m1.a21, c * m1.a22);
        }

        /**
         * Función set, cambia ls valores de la matriz que llama la función.
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
         * Función subtract, dado dos matricez nos regresa la matriz resultante de substraer
         * la segunda matriz de la primera.
         * @param {Matrix3} m1
         * @param {Matrix3} m2
         * @return {Matrix3}
         */
        static subtract(m1, m2) {
            return Matrix3.add(m1, Matrix3.multiplyScalar(m2, -1));
        }

        /**
         * Función transpose, nos regresa la matriz transpuesta de la matriz que llama
         * a la función.
         * @return {Matrix3}
         */
        transpose() {
            return new Matrix3(this.a00, this.a10, this.a20, this.a01, this.a11, this.a21, this.a02, this.a12, this.a22);
        }

        //////////////////////////////// Funciones adjointij ////////////////////////////////

        /**
         * Función adjointij, Calcula el determinate de la matriz que invoca  la función
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

        /**
         * multiplyVector, devuelve el resultado de multiplicar el vector v por la Matrix3
         * desde la cual se invoca la función.
         * @param {Vector3} v
         * @return {Vector3}
         */
        multiplyVector(v) {
            return new CG.Vector3((v.x * this.a00) + (v.y * this.a10) + (v.z * this.a20),
                (v.x * this.a01) + (v.y * this.a11) + (v.z * this.a21),
                (v.x * this.a02) + (v.y * this.a12) + (v.z * this.a22));
        }

        /*
         * rotate, devuelve una matriz de rotación en 2D con el ángulo (en radianes)
         * determinado por rad.
         * @param {Number} rad
         * @return {Matrix3}
         */
        static rotate(rad) {
            let g = Math.PI / 180;
            return new Matrix3(Math.cos(rad * g), Math.sin(rad * g), 0,
                (-1) * Math.sin(rad * g), Math.cos(rad * g), 0,
                0, 0, 1);
        }

        /**
         * scale, devuelve una matriz de escalamiento en 2D con los factores de escala
         * sx y sy, como escalamiento en x y y respectivamente.
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
         * translate, devuelve una matriz de traslación en 2D con tx y ty como el
         * desplazamiento en x y y, respectivamente.
         * @param {Number} tx
         * @param {Number} ty
         * @return {Matrix3}
         */
        static translate(tx, ty) {
            return new Matrix3(1, 0, 0,
                0, 1, 0,
                tx, ty, 1);
        }

        /**
         * Función print, nos muestra en console la matriz que llama a la función en formato 3x3
         */
        print() {
            console.log("| " + this.a00 + " " + this.a01 + " " + this.a02 + " |");
            console.log("| " + this.a10 + " " + this.a11 + " " + this.a12 + " |");
            console.log("| " + this.a20 + " " + this.a21 + " " + this.a22 + " |");
        }
    }
    CG.Matrix3 = Matrix3;
    return CG;
})(CG || {});
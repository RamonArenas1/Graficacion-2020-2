import Vector3 from "./Vector3.js";
import Matrix4 from "./Matrix4.js";

export default class Octaedro {

    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * @param {Number} width
     * @param {Number} height
     * @param {Number} length
     * @param {Matrix4} initial_transform
     */
    constructor(gl, color, width, initial_transform) {

        this.w = (width || 1);

        let matrixAux = new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        //let m = matrixAux.identity();

        this.initial_transform = initial_transform || matrixAux.identity();
        //m.printm();
        this.positionBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        let vertices = this.getVertices();

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.color = color;

        this.indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        let faces = this.getFaces();

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);

        this.num_elements = faces.length;

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

    }

    /**
     * @param {WebGLRenderingContext} gl
     * @param {GLint} positionAttributeLocation
     * @param {WebGLUniformLocation} colorUniformLocation
     * @param {WebGLUniformLocation} PVM_matrixLocation
     * @param {Matrix4} projectionViewMatrix
     */
    draw(gl, positionAttributeLocation, colorUniformLocation, PVM_matrixLocation, projectionViewMatrix) {

        gl.enableVertexAttribArray(positionAttributeLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        gl.uniform4fv(colorUniformLocation, this.color);

        let projectionViewModelMatrix = Matrix4.multiply(projectionViewMatrix, this.initial_transform);

        gl.uniformMatrix4fv(PVM_matrixLocation, false, projectionViewModelMatrix.toArray());

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, this.num_elements, gl.UNSIGNED_SHORT, 0);

        //projectionViewModelMatrixAux.printm();
        //projectionViewModelMatrix.printm();
    }

    /**
     * Función que devuelve los vértices que definen un cubo
     */
    getVertices() {
        var goldenRatio = 1.6180339887;
        let width_m_goldenRatio = this.w * goldenRatio;

        return [
            0, 0, this.w,
            this.w, 0, 0, //
            -this.w, 0, 0,
            0, this.w, 0,
            0, -this.w, 0,
            0, 0, -this.w
        ];
    }

    /**
     * Función que devuelve los indices de los vértices que forman las caras del cubo
     */
    getFaces() {
        return [
            3, 1, 0,
            2, 3, 0,
            1, 4, 0,
            4, 2, 0,
            1, 3, 5,
            3, 2, 5,
            4, 1, 5,
            2, 4, 5
        ]
    }
}
/** Así esta la funcion toArray de Matrix4
 * 
     * @return {Array}
     *
    toArray() {
        return [
            this.a00, this.a01, this.a02, this.a03,
            this.a10, this.a11, this.a12, this.a13,
            this.a20, this.a21, this.a22, this.a23,
            this.a30, this.a31, this.a32, this.a33
        ];
    }
 */
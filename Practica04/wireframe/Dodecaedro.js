import Matrix4 from "../maths_CG/Matrix4.js";

export default class Dodecaedro {

    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * @param {Number} width
     * @param {Number} height
     * @param {Number} length
     * @param {Matrix4} initial_transform
     */
    constructor(gl, color, width, initial_transform) {

        this.w = (width || 1) / Math.PI;

        let matrixAux = new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

        this.initial_transform = initial_transform || matrixAux.identity();
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

        gl.drawElements(gl.LINE_LOOP, this.num_elements, gl.UNSIGNED_SHORT, 0);

    }

    /**
     * Función que devuelve los vértices que definen un dodecaedro
     */
    getVertices() {

        var goldenRatio = 1.6180339887;

        let width_d_goldenRatio = this.w / goldenRatio;
        let width_m_goldenRatio = this.w * goldenRatio;

        return [
            this.w, this.w, this.w, //
            this.w, this.w, -this.w, //
            this.w, -this.w, this.w, //
            this.w, -this.w, -this.w, //
            -this.w, this.w, this.w, //
            -this.w, this.w, -this.w, //
            -this.w, -this.w, this.w, //
            -this.w, -this.w, -this.w, //
            0, width_d_goldenRatio, width_m_goldenRatio, //
            0, width_d_goldenRatio, -width_m_goldenRatio, //
            0, -width_d_goldenRatio, width_m_goldenRatio, //
            0, -width_d_goldenRatio, -width_m_goldenRatio, //
            width_d_goldenRatio, width_m_goldenRatio, 0, //
            width_d_goldenRatio, -width_m_goldenRatio, 0, //
            -width_d_goldenRatio, width_m_goldenRatio, 0, //
            -width_d_goldenRatio, -width_m_goldenRatio, 0, //
            width_m_goldenRatio, 0, width_d_goldenRatio, //
            width_m_goldenRatio, 0, -width_d_goldenRatio, //
            -width_m_goldenRatio, 0, width_d_goldenRatio, //
            -width_m_goldenRatio, 0, -width_d_goldenRatio
        ];
    }

    /**
     * Función que devuelve los indices de los vértices que forman las caras del Dodecaedro
     */
    getFaces() {
        return [
            0, 16, 2, 10, 8,
            12, 1, 17, 16, 0,
            8, 4, 14, 12, 0,
            2, 16, 17, 3, 13,
            13, 15, 6, 10, 2,
            6, 18, 4, 8, 10,
            3, 17, 1, 9, 11,
            13, 3, 11, 7, 15,
            1, 12, 14, 5, 9,
            11, 9, 5, 19, 7,
            5, 14, 4, 18, 19,
            6, 15, 7, 19, 18
        ]
    }
}
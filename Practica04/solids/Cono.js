import Matrix4 from "../maths_CG/Matrix4.js";

export default class Cono {

    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * @param {Number} width
     * @param {Number} height
     * @param {Number} length
     * @param {Matrix4} initial_transform
     */
    constructor(gl, color, radius, height, Nu, Nv, initial_transform) {

        this.radius = (radius || 1);
        this.height = (height || 1);
        this.Nu = Nu || 2;
        this.Nv = Nv || 2;

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

        gl.drawElements(gl.TRIANGLE_FAN, this.num_elements, gl.UNSIGNED_SHORT, 0);

    }

    /**
     * Función que devuelve los vértices que definen un Cono
     */
    getVertices() {

        let vertices = [];

        for (let i = 1; i < this.Nv + 1; i++) {
            for (let j = 1; j < this.Nu + 1; j++) {
                vertices.push(this.radius * (this.Nv - i) / this.Nv * Math.cos(j * 2 * Math.PI / this.Nu));
                vertices.push(-this.height + i * 2 * this.height / this.Nv);
                vertices.push(this.radius * (this.Nv - i) / this.Nv * Math.sin(j * 2 * Math.PI / this.Nu));
            }
        }
        vertices.push(0);
        vertices.push(this.height);
        vertices.push(0);

        return vertices;
    }

    /**
     * Función que devuelve los indices de los vértices que forman las caras del Cono
     */
    getFaces() {

        let faces = [];

        for (let i = 0; i < this.Nv - 1; i++) {
            for (let j = 0; j < this.Nu; j++) {
                faces.push(j + i * this.Nu);
                faces.push((j + 1) % this.Nu + i * this.Nu);
                faces.push((j + 1) % this.Nu + (i + 1) * this.Nu);
                faces.push(j + (i + 1) * this.Nu);
            }
        }

        return faces;
    }
}
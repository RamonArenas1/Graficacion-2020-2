import Matrix4 from "../maths_CG/Matrix4.js";

export default class Toro {

    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * @param {Number} width
     * @param {Number} height
     * @param {Number} length
     * @param {Matrix4} initial_transform
     */
    constructor(gl, color, major_radius, minor_radius, Nu, Nv, initial_transform) {

        let Ra = (major_radius || 1) / 2;
        let ra = (minor_radius || 1) / 2;

        this.r = ra;
        this.R = Ra;
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

        gl.drawElements(gl.TRIANGLE_STRIP, this.num_elements, gl.UNSIGNED_SHORT, 0);
    }

    /**
     * Función que devuelve los vértices que definen un Toro
     */
    getVertices() {

        let vertices = [];

        for (let i = 0; i < this.Nv + 1; i++) {
            for (let j = 0; j < this.Nu; j++) {
                vertices.push(-(this.R + this.r * Math.sin(2 * Math.PI * j / this.Nu)) * Math.sin(2 * Math.PI * i / this.Nv));
                vertices.push(this.r * Math.cos(2 * Math.PI * j / this.Nu));
                vertices.push((this.R + this.r * Math.sin(2 * Math.PI * j / this.Nu)) * Math.cos(2 * Math.PI * i / this.Nv));
            }
        }

        return vertices;
    }

    /**
     * Función que devuelve los indices de los vértices que forman las caras del Toro
     */
    getFaces() {

        let faces = [];

        // se generan los cuadriláteros correspondientes a las caras que forman el toro
        for (let i = 0; i < this.Nv; i++) {
            for (let j = 0; j < this.Nu; j++) {
                faces.push(j + i * this.Nu);
                faces.push(j + (i + 1) * this.Nu);
            }
        }

        for (let i = 0; i < this.Nv; i++) {
            for (let j = 0; j < this.Nu; j++) {
                faces.push((j + 1) % this.Nu + (i + 1) * this.Nu);
                faces.push((j + 1) % this.Nu + i * this.Nu);
            }
        }

        return faces;
    }
}
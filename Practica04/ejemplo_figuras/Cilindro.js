import Vector3 from "./Vector3.js";
import Matrix4 from "./Matrix4.js";

export default class Cilindro {

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

        gl.drawElements(gl.TRIANGLE_FAN, this.num_elements, gl.UNSIGNED_SHORT, 0);

        //projectionViewModelMatrixAux.printm();
        //projectionViewModelMatrix.printm();
    }

    /**
     * Función que devuelve los vértices que definen un cubo
     */
    getVertices() {

        let vertices = [];
        let verticesAux = [];

        // los vértices se construyen de abajo a arriba en Y
        for (let i = 0; i < this.Nv + 1; i++) {
            for (let j = 0; j < this.Nu; j++) {
                vertices.push(this.radius * Math.cos(j * 2 * Math.PI / this.Nu));
                vertices.push(-this.height + i * 2 * this.height / this.Nv);
                vertices.push(this.radius * Math.sin(j * 2 * Math.PI / this.Nu));
            }
        }

        for (let i = 0; i < this.Nv + 1; i++) {
            for (let j = 0; j < this.Nu; j++) {
                verticesAux.push([
                    this.radius * Math.cos(j * 2 * Math.PI / this.Nu), //
                    -this.height + i * 2 * this.height / this.Nv,
                    this.radius * Math.sin(j * 2 * Math.PI / this.Nu),
                ]);
            }
        }

        //console.log(vertices, "verticesAux", verticesAux)
        return vertices;
    }

    /**
     * Función que devuelve los indices de los vértices que forman las caras del cubo
     */
    getFaces() {
        let faces = [];
        let facesAux = [];

        // se generan los cuadriláteros que unen las caras del cilindro
        for (let i = 0; i < this.Nv - 1; i++) {
            for (let j = 0; j < this.Nu; j++) {
                faces.push(j + i * this.Nu);
                faces.push((j + 1) % this.Nu + i * this.Nu);
                faces.push((j + 1) % this.Nu + (i + 1) * this.Nu);
                faces.push(j + (i + 1) * this.Nu);
            }
        }

        for (let i = 0; i < this.Nv - 1; i++) {
            for (let j = 0; j < this.Nu; j++) {
                facesAux.push([
                    j + i * this.Nu,
                    (j + 1) % this.Nu + i * this.Nu,
                    (j + 1) % this.Nu + (i + 1) * this.Nu,
                    j + (i + 1) * this.Nu
                ]);
            }
        }

        //console.log(faces, "facesAux", facesAux);
        return faces;
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
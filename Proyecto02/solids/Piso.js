import ImageLoader from "../imageloader/ImageLoader.js";
import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";
import Vector4 from "../maths_CG/Vector4.js";

export default class Piso {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Matrix4} initial_transform
     */
    constructor(gl, initial_transform) {

        let matrixAux = new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

        this.initial_transform = initial_transform || matrixAux.identity();

        let vertices = this.getVertices();

        let faces = this.getFaces();

        for (let i = 0; i < faces.length; i++) {
            faces[i]--;
        }

        let flat_vertices = [];
        for (let i = 0; i < faces.length; i++) {
            flat_vertices.push(
                vertices[faces[i] * 3],
                vertices[faces[i] * 3 + 1],
                vertices[faces[i] * 3 + 2]
            );
        }

        this.positionBuffer = gl.createBuffer();
        this.vertices = flat_vertices;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ImageLoader.getImage("./texturas/Piso.jpg"));
        gl.generateMipmap(gl.TEXTURE_2D);

        this.uv = this.getUV(this.vertices);
        this.UVBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.STATIC_DRAW);

        let normals = this.getNormals(this.vertices);
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        this.num_elements = this.vertices.length / 3;
    }

    /**
     * @param {WebGLRenderingContext} gl
     * @param {WebGLUniformLocation} shader_locations
     * @param {Vector4} lightPos
     * @param {Matrix4} viewMatrix
     * @param {Matrix4} projectionMatrix
     */
    draw(gl, shader_locations, lightPos, viewMatrix, projectionMatrix) {

        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.enableVertexAttribArray(shader_locations.positionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader_locations.positionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(shader_locations.texcoordAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
        gl.vertexAttribPointer(shader_locations.texcoordAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(shader_locations.normalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(shader_locations.normalAttribute, 3, gl.FLOAT, false, 0, 0);

        let viewModelMatrix = Matrix4.multiply(viewMatrix, this.initial_transform);
        gl.uniformMatrix4fv(shader_locations.VM_matrix, false, viewModelMatrix.toArray());

        let lightPosView = viewMatrix.multiplyVector(new Vector4(lightPos[0], lightPos[1], lightPos[2], lightPos[3]));
        gl.uniform3f(shader_locations.lightPosition, lightPosView.x, lightPosView.y, lightPosView.z);

        /* for (let i = 0; i < lightPos.length; i++) {
            gl.uniform3fv(shader_locations.lightPosition[i], [lightPos[i][0], lightPos[i][1], lightPos[i][2]]);
        } */

        let projectionViewModelMatrix = Matrix4.multiply(projectionMatrix, viewModelMatrix);
        gl.uniformMatrix4fv(shader_locations.PVM_matrix, false, projectionViewModelMatrix.toArray());

        gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);
    }



    getVertices() {
        return [ //
            -7.500000, 0.000000, 10.000000, //
            7.500000, 0.000000, 10.000000, //
            -7.500000, 0.000000, -90.000000, //
            7.500000, 0.000000, -90.000000
        ]
    }

    getFaces() {
        return [
            1, 4, 3,
            1, 2, 4,
        ];
    }

    getNormals(vertices) {

        let normals = [];

        let v1, v2, v3, n;

        for (let i = 0; i < vertices.length; i += 9) {

            v1 = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
            v2 = new Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
            v3 = new Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);

            n = Vector3.cross(
                Vector3.subtract(v1, v2),
                Vector3.subtract(v2, v3)
            ).normalize();

            normals.push(
                n.x, n.y, n.z,
                n.x, n.y, n.z,
                n.x, n.y, n.z
            );
        }

        return normals;
    }

    getUV(vertices) {
        return [


            0.000000,
            2.000000,

            12.000000,
            0.000000,

            12.000000,
            2.000000,

            0.000000,
            2.000000,

            0.000000,
            0.000000,

            12.000000,
            0.000000,

        ]
    }
}
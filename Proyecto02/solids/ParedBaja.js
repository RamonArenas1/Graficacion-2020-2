import ImageLoader from "../imageloader/ImageLoader.js";
import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";
import Vector4 from "../maths_CG/Vector4.js";

export default class ParedBaja {
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
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ImageLoader.getImage("./texturas/Pared Baja.png"));
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
            -0.100000, -1.750000, 4.000000, //
            -0.100000, 1.750000, 4.000000, //
            -0.100000, -1.750000, -4.000000, //
            -0.100000, 1.750000, -4.000000, //
            0.100000, -1.750000, 4.000000, //
            0.100000, 1.750000, 4.000000, //
            0.100000, -1.750000, -4.000000, //
            0.100000, 1.750000, -4.000000, //
            0.050000, -1.750000, -4.000000, //
            0.050000, 1.750000, -4.000000, //
            0.050000, -1.750000, 4.000000, //
            0.050000, 1.750000, 4.000000, //
            -0.100000, 1.800000, 4.000000, //
            -0.100000, 1.800000, -4.000000, //
            0.050000, 1.800000, 4.000000, //
            0.050000, 1.800000, -4.000000, //
            0.000000, -1.750000, -4.000000, //
            0.000000, 1.750000, 4.000000, //
            0.000000, 1.750000, -4.000000, //
            0.000000, -1.750000, 4.000000, //
            0.000000, 1.800000, 4.000000, //
            0.000000, 1.800000, -4.000000, //
            -0.100000, 1.850000, 4.000000, //
            -0.100000, 1.850000, -4.000000, //
            0.000000, 1.850000, 4.000000, //
            0.000000, 1.850000, -4.000000, //
            -0.050000, -1.750000, -4.000000, //
            -0.050000, 1.750000, 4.000000, //
            -0.050000, 1.800000, 4.000000, //
            -0.050000, 1.750000, -4.000000, //
            -0.050000, -1.750000, 4.000000, //
            -0.050000, 1.800000, -4.000000, //
            -0.050000, 1.850000, 4.000000, //
            -0.050000, 1.850000, -4.000000, //
            -0.100000, 1.900000, 4.000000, //
            -0.100000, 1.900000, -4.000000, //
            -0.050000, 1.900000, 4.000000, //
            -0.050000, 1.900000, -4.000000, //

        ]
    }

    getFaces() {
        return [
            7, 6, 5, //
            12, 16, 15, //
            8, 12, 6, //
            27, 17, 20, //
            21, 26, 25, //
            18, 15, 21, //
            10, 22, 16, //
            16, 21, 15, //
            13, 28, 29, //
            26, 33, 25, //
            23, 36, 24, //
            34, 32, 14, //
            21, 33, 29, //
            38, 35, 37, //
            22, 19, 30, //
            33, 38, 37, //
            12, 18, 20, //
            30, 19, 17, //
            7, 8, 6, //
            12, 10, 16, //
            8, 10, 12, //
            17, 9, 20, //
            9, 7, 11, //
            20, 9, 11, //
            7, 5, 11, //
            20, 31, 27, //
            31, 1, 3, //
            3, 27, 31, //
            21, 22, 26, //
            18, 12, 15, //
            10, 19, 22, //
            16, 22, 21, //
            29, 33, 13, //
            33, 37, 23, //
            13, 33, 23, //
            37, 35, 23, //
            13, 2, 28, //
            26, 34, 33, //
            3, 1, 2, //
            13, 23, 24, //
            23, 35, 36, //
            3, 2, 4, //
            2, 13, 4, //
            24, 14, 13, //
            14, 4, 13, //
            32, 30, 4, //
            14, 24, 34, //
            24, 36, 34, //
            32, 4, 14, //
            36, 38, 34, //
            29, 28, 18, //
            21, 25, 33, //
            29, 18, 21, //
            38, 36, 35, //
            30, 32, 22, //
            32, 34, 22, //
            34, 26, 22, //
            33, 34, 38, //
            18, 28, 20, //
            28, 2, 31, //
            20, 28, 31, //
            2, 1, 31, //
            20, 11, 12, //
            11, 5, 6, //
            6, 12, 11, //
            19, 10, 17, //
            10, 8, 9, //
            17, 10, 9, //
            8, 7, 9, //
            17, 27, 30, //
            27, 3, 4, //
            4, 30, 27, //

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
        // se calculan las coordenadas UV sobre la esfera
        let uv = [];
        let PI2 = 2 * Math.PI
        let d1, d2, d3;
        let u1, v1, u2, v2, u3, v3;

        for (let i = 0; i < vertices.length / 3; i += 3) {
            d1 = new Vector3(
                vertices[i * 3],
                vertices[i * 3 + 1],
                vertices[i * 3 + 2]
            );

            d1 = d1.normalize();

            u1 = 0.5 + (Math.atan2(d1.x, d1.z)) / PI2;
            v1 = 0.5 - (Math.asin(d1.y)) / Math.PI;

            d2 = new Vector3(
                vertices[(i + 1) * 3],
                vertices[(i + 1) * 3 + 1],
                vertices[(i + 1) * 3 + 2]
            );

            d2 = d2.normalize();

            u2 = 0.5 + (Math.atan2(d2.x, d2.z)) / PI2;
            v2 = 0.5 - (Math.asin(d2.y)) / Math.PI;

            d3 = new Vector3(
                vertices[(i + 2) * 3],
                vertices[(i + 2) * 3 + 1],
                vertices[(i + 2) * 3 + 2]
            );

            d3 = d3.normalize();

            u3 = 0.5 + (Math.atan2(d3.x, d3.z)) / PI2;
            v3 = 0.5 - (Math.asin(d3.y)) / Math.PI;

            if (Math.abs(u1 - u2) > 0.5) {
                if (u1 > u2) {
                    u2 = 1 + u2;
                } else {
                    u1 = 1 + u1;
                }
            }
            if (Math.abs(u1 - u3) > 0.5) {
                if (u1 > u3) {
                    u3 = 1 + u3;
                } else {
                    u1 = 1 + u1;
                }
            }
            if (Math.abs(u2 - u3) > 0.5) {
                if (u2 > u3) {
                    u3 = 1 + u3;
                } else {
                    u2 = 1 + u2;
                }
            }

            uv.push(u1, v1, u2, v2, u3, v3);
        }

        return uv;
    }
}
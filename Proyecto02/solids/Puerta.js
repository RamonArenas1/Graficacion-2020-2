import ImageLoader from "../imageloader/ImageLoader.js";
import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";
import Vector4 from "../maths_CG/Vector4.js";

export default class Puerta {
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

        console.log(faces);
        /* let vertices = [];

        for (let i = 0; i < ver.length; i += 3) {
            vertices[i] = ver[i + 2];
            vertices[i + 1] = ver[i + 1];
            vertices[i + 2] = ver[i + 0];
        } */

        console.log(vertices);

        let flat_vertices = [];
        for (let i = 0; i < faces.length; i++) {
            flat_vertices.push(
                vertices[faces[i] * 3],
                vertices[faces[i] * 3 + 1],
                vertices[faces[i] * 3 + 2]
            );
        }

        console.log(flat_vertices);

        this.positionBuffer = gl.createBuffer();
        this.vertices = flat_vertices;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ImageLoader.getImage("./texturas/Puerta.png"));
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

        let projectionViewModelMatrix = Matrix4.multiply(projectionMatrix, viewModelMatrix);
        gl.uniformMatrix4fv(shader_locations.PVM_matrix, false, projectionViewModelMatrix.toArray());

        gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);
    }



    getVertices() {
        return [ //
            -7.670000, 0.000000, 1.615000, //
            -7.330000, 0.000000, 1.615000, //
            -7.330000, 0.000000, -1.615000, //
            -7.670000, 0.000000, -1.615000, //
            -7.330000, 7.626490, 1.615000, //
            -7.670000, 7.626490, 1.615000, //
            -7.330000, 7.626490, -1.615000, //
            -7.670000, 7.626490, -1.615000, //
            -7.330000, 6.901192, 1.615000, //
            -7.330000, 3.463245, 1.615000, //
            -7.330000, 2.700596, 1.615000, //
            -7.330000, 0.725298, 1.615000, //
            -7.330000, 6.901192, -1.615000, //
            -7.330000, 3.463245, -1.615000, //
            -7.330000, 2.700596, -1.615000, //
            -7.330000, 0.725298, -1.615000, //
            -7.330000, 6.901192, -1.162800, //
            -7.330000, 3.463245, -1.162800, //
            -7.330000, 2.700596, -1.162800, //
            -7.330000, 0.725298, -1.162800, //
            -7.330000, 6.901192, -0.323000, //
            -7.330000, 3.463245, -0.323000, //
            -7.330000, 2.700596, -0.323000, //
            -7.330000, 0.725298, -0.323000, //
            -7.330000, 6.901192, 0.323000, //
            -7.330000, 3.463245, 0.323000, //
            -7.330000, 2.700596, 0.323000, //
            -7.330000, 0.725298, 0.323000, //
            -7.330000, 6.901192, 1.162800, //
            -7.330000, 3.463245, 1.162800, //
            -7.330000, 2.700596, 1.162800, //
            -7.330000, 0.725298, 1.162800, //
            -7.405000, 2.700596, -1.162800, //
            -7.405000, 0.725298, -1.162800, //
            -7.405000, 2.700596, -0.323000, ///
            -7.405000, 0.725298, -0.323000, //
            -7.405000, 2.700596, 0.323000, //
            -7.405000, 0.725298, 0.323000, //
            -7.405000, 2.700596, 1.162800, //
            -7.405000, 0.725298, 1.162800, //
            -7.330000, 2.557387, -1.049346, //
            -7.330000, 0.868507, -1.049346, //
            -7.330000, 2.557387, -0.420304, //
            -7.330000, 0.868507, -0.420304, //
            -7.330000, 2.557387, 0.420304, //
            -7.330000, 0.868507, 0.420304, //
            -7.330000, 2.557387, 1.049346, //
            -7.330000, 0.868507, 1.049346, //
            -7.405000, 6.901192, -1.162800, //
            -7.405000, 3.463245, -1.162800, //
            -7.405000, 6.901192, -0.323000, //
            -7.405000, 3.463245, -0.323000, //
            -7.405000, 6.901192, 0.323000, //
            -7.405000, 3.463245, 0.323000, //
            -7.405000, 6.901192, 1.162800, //
            -7.405000, 3.463245, 1.162800, //
            -7.330000, 6.733592, -1.049346, //
            -7.330000, 3.630845, -1.049346, //
            -7.330000, 6.733592, -0.420304, //
            -7.330000, 3.630845, -0.420304, //
            -7.330000, 6.733592, 0.420304, //
            -7.330000, 3.630845, 0.420304, //
            -7.330000, 6.733592, 1.049346, //
            -7.330000, 3.630845, 1.049346, //      
        ]
    }

    getFaces() {
        return [
            2, 4, 3,
            32, 2, 20,
            24, 27, 28,
            22, 25, 26,
            8, 1, 6,
            16, 19, 20,
            21, 17, 7,
            14, 17, 18,
            15, 16, 4,
            7, 6, 5,
            32, 11, 12,
            30, 9, 10,
            20, 33, 34,
            27, 39, 37,
            23, 36, 35,
            28, 37, 38,
            19, 35, 33,
            31, 40, 39,
            32, 38, 40,
            24, 34, 36,
            39, 48, 47,
            40, 46, 48,
            46, 47, 48,
            42, 43, 44,
            33, 43, 41,
            38, 45, 46,
            35, 44, 43,
            37, 47, 45,
            34, 41, 42,
            36, 42, 44,
            21, 52, 51,
            25, 55, 53,
            26, 53, 54,
            29, 56, 55,
            17, 51, 49,
            30, 54, 56,
            18, 49, 50,
            22, 50, 52,
            53, 63, 61,
            54, 61, 62,
            62, 63, 64,
            58, 59, 60,
            51, 60, 59,
            52, 58, 60,
            50, 57, 58,
            56, 62, 64,
            49, 59, 57,
            55, 64, 63,
            23, 15, 22,
            5, 1, 11,
            2, 1, 4,
            24, 28, 32,
            32, 12, 2,
            2, 3, 16,
            20, 24, 32,
            2, 16, 20,
            24, 23, 27,
            22, 21, 25,
            8, 4, 1,
            16, 15, 19,
            7, 5, 9,
            29, 25, 21,
            7, 9, 29,
            17, 13, 7,
            7, 29, 21,
            14, 13, 17,
            4, 8, 7,
            13, 14, 15,
            4, 7, 13,
            16, 3, 4,
            4, 13, 15,
            7, 8, 6,
            32, 31, 11,
            30, 29, 9,
            20, 19, 33,
            27, 31, 39,
            23, 24, 36,
            28, 27, 37,
            19, 23, 35,
            31, 32, 40,
            32, 28, 38,
            24, 20, 34,
            39, 40, 48,
            40, 38, 46,
            46, 45, 47,
            42, 41, 43,
            33, 35, 43,
            38, 37, 45,
            35, 36, 44,
            37, 39, 47,
            34, 33, 41,
            36, 34, 42,
            21, 22, 52,
            25, 29, 55,
            26, 25, 53,
            29, 30, 56,
            17, 21, 51,
            30, 26, 54,
            18, 17, 49,
            22, 18, 50,
            53, 55, 63,
            54, 53, 61,
            62, 61, 63,
            58, 57, 59,
            51, 52, 60,
            52, 50, 58,
            50, 49, 57,
            56, 54, 62,
            49, 51, 59,
            55, 56, 64,
            22, 26, 30,
            30, 10, 11,
            31, 27, 23,
            30, 11, 31,
            14, 18, 22,
            22, 30, 31,
            23, 19, 15,
            22, 31, 23,
            15, 14, 22,
            10, 9, 5,
            5, 6, 1,
            1, 2, 12,
            11, 10, 5,
            1, 12, 11,
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
import ImageLoader from "../imageloader/ImageLoader.js";
import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";
import Vector4 from "../maths_CG/Vector4.js";

export default class CuartoD {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Matrix4} initial_transform
     */
    constructor(gl, initial_transform) {

        let matrixAux = new Vector3(0, 0, 0);

        this.initial_transform = initial_transform || matrixAux;

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
        gl.activeTexture(gl.TEXTURE7);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ImageLoader.getImage("./texturas/CuartoDentro.jpg"));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

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

        //gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.uniform1i(shader_locations.u_texture, 7);

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

        //let lightPosView = viewMatrix.multiplyVector(new Vector4(lightPos[0], lightPos[1], lightPos[2], lightPos[3]));
        //gl.uniform3f(shader_locations.lightPosition, lightPosView.x, lightPosView.y, lightPosView.z);

        for (let i = 0; i < lightPos.length; i++) {
            let lightPosView = viewMatrix.multiplyVector(new Vector4(lightPos[i][0], lightPos[i][1], lightPos[i][2], lightPos[i][3]));
            gl.uniform3f(shader_locations.lightPosition[i], lightPosView.x, lightPosView.y, lightPosView.z);
            //gl.uniform3fv(shader_locations.lightPosition[i], [lightPos[i][0], lightPos[i][1], lightPos[i][2]]);
        }

        let projectionViewModelMatrix = Matrix4.multiply(projectionMatrix, viewModelMatrix);
        gl.uniformMatrix4fv(shader_locations.PVM_matrix, false, projectionViewModelMatrix.toArray());

        gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);
    }



    getVertices() {
        return [ //
            10.244663, -4.90714, 9.780595, //
            10.244658, -4.90714, -9.770406, //
            10.244658, 4.89286, -9.770406, //
            10.244663, 4.89286, 9.780595, //
            -9.755337, -4.90714, 9.780602, //
            -9.755337, 4.89286, 9.780602, //
            -9.755342, -4.90714, -9.770399, //
            -9.755342, 4.89286, -9.770399, //
            10.244658, 4.89286, -8.746853, //
            10.244658, 4.89286, -5.077303, //
            10.244661, 4.89286, 2.076635, //
            10.244662, 4.89286, 5.729348, //
            9.758576, 4.89286, -9.235003, //
            9.775408, 4.89286, -7.248734, //
            8.849604, 4.89286, -7.955712, //
            8.681276, 4.89286, -6.861578, //
            7.351482, 4.89286, -6.053603, //
            8.378283, 4.89286, -4.572317, //
            8.243621, 4.89286, -5.262463, //
            9.27042, 4.89286, -6.491257, //
            9.085261, 4.89286, -3.848508, //
            9.017934, 4.89286, -3.006868, //
            9.893235, 4.89286, -2.316724, //
            9.573413, 4.89286, -1.475084, //
            8.950603, 4.89286, -2.417722, //
            8.125793, 4.89286, -0.700776, //
            9.539746, 4.89286, 2.430121, //
            9.405085, 4.89286, 4.046068, //
            7.553478, 4.89286, 2.935106, //
            7.183157, 4.89286, 4.079735, //
            8.529789, 4.89286, 7.17697, //
            10.199492, 4.89286, -9.770405, //
            10.244663, -4.90714, 7.938241, //
            10.244662, -4.90714, 6.334679, //
            10.244659, -4.90714, -3.352415, //
            9.129112, -4.90714, 8.897751, //
            8.62964, -4.90714, 8.122256, //
            7.472975, -4.90714, 6.952446, //
            9.023959, -4.90714, 6.518696, //
            8.47191, -4.90714, 7.215325, //
            7.801573, -4.90714, 5.322597, //
            8.616497, -4.90714, 4.941422, //
            9.668017, -4.90714, 3.548162, //
            9.194835, -4.90714, 3.07498, //
            9.194835, -4.90714, 1.655434, //
            9.510289, -4.90714, 2.44407, //
            10.101768, -4.90714, 1.510849, //
            9.299984, -4.90714, 0.735357, //
            9.08968, -4.90714, -1.025933, //
            9.746878, -4.90714, -0.355592, //
            9.838886, -4.90714, -1.209948, //
            8.879375, -4.90714, -2.195745, //
            9.155396, -4.90714, -3.036958, //
            9.286841, -4.90714, -2.406048, //
            9.852029, -4.90714, -1.932866, //
            8.826798, -4.90714, -3.970179, //
            8.195885, -4.90714, -6.112643, //
            9.865166, -4.90714, -7.16416, //
            8.498189, -4.90714, -7.335029, //
            8.603342, -4.90714, -8.531129, //
            9.431409, -4.90714, -8.531129, //
            9.431408, -4.90714, -9.043743, //
            7.998719, -4.90714, -9.16204, //
        ]
    }

    getFaces() {
        return [ //
            8, 2, 7, //
            4, 5, 1,
            48, 47, 45,
            25, 22, 18,
            2, 32, 3,
            8, 32, 2,
            4, 6, 5,
            7, 2, 63,
            63, 62, 60,
            62, 61, 60,
            5, 7, 38,
            7, 63, 57,
            36, 1, 5,
            37, 33, 36,
            38, 37, 36,
            7, 57, 41,
            63, 60, 59,
            59, 58, 57,
            63, 59, 57,
            38, 36, 5,
            34, 40, 39,
            39, 38, 41,
            41, 38, 7,
            56, 35, 53,
            35, 55, 54,
            53, 35, 54,
            57, 56, 52,
            41, 57, 52,
            41, 34, 39,
            52, 51, 49,
            51, 50, 49,
            56, 53, 52,
            43, 42, 44,
            42, 41, 44,
            52, 49, 41,
            49, 48, 45,
            41, 49, 45,
            45, 44, 41,
            47, 46, 45,
            14, 9, 13,
            13, 3, 32,
            32, 8, 13,
            8, 6, 30,
            13, 8, 15,
            6, 4, 31,
            31, 12, 30,
            29, 28, 27,
            6, 31, 30,
            29, 27, 26,
            27, 11, 26,
            30, 29, 17,
            17, 8, 30,
            15, 14, 13,
            17, 16, 15,
            20, 19, 18,
            17, 15, 8,
            10, 20, 21,
            20, 18, 21,
            18, 17, 26,
            17, 29, 26,
            22, 21, 18,
            24, 23, 25,
            23, 22, 25,
            26, 25, 18,
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
                Vector3.subtract(v2, v1),
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
import ImageLoader from "../imageloader/ImageLoader.js";
import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";
import Vector4 from "../maths_CG/Vector4.js";

export default class Cuarto {
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
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ImageLoader.getImage("./texturas/Cuarto.png"));
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

        gl.uniform1i(shader_locations.u_texture, 4);

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
            -10.244661, -5.007140, 9.969901, //
            -10.244661, 4.992860, 9.969901, //
            -10.244661, -5.007140, -9.980099, //
            -10.244661, 4.992860, -9.980099, //
            9.755340, -5.007140, 9.969901, //
            9.755340, 4.992860, 9.969901, //
            9.755340, -5.007140, -9.980099, //
            9.755340, 4.992860, -9.980099, //
            -10.244660, -4.907140, -9.780599, //
            -10.244660, -4.907140, 9.770402, //
            -10.244660, 4.892860, 9.770402, //
            -10.244660, 4.892860, -9.780599, //
            9.755340, -4.907140, -9.780599, //
            9.755340, 4.892860, -9.780599, //
            9.755340, -4.907140, 9.770402, //
            9.755340, 4.892860, 9.770402, //
            -10.244661, 4.992860, 8.742513, //
            -10.244661, 4.992860, 5.082389, //
            -10.244661, 4.992860, -2.043940, //
            -10.244661, 4.992860, -5.704062, //
            -8.544197, 4.992860, -7.182653, //
            -7.211044, 4.992860, -4.104274, //
            -7.550391, 4.992860, -2.916551, //
            -9.392572, 4.992860, -4.128513, //
            -9.538006, 4.992860, -2.431768, //
            -8.132133, 4.992860, 0.670853, //
            -8.956262, 4.992860, 2.416076, //
            -9.586485, 4.992860, 1.398029, //
            -9.950073, 4.992860, 2.294881, //
            -9.028979, 4.992860, 3.046296, //
            -9.077461, 4.992860, 3.821952, //
            -9.319854, 4.992860, 6.536746, //
            -8.229084, 4.992860, 5.252065, //
            -8.423004, 4.992860, 4.500649, //
            -7.356472, 4.992860, 6.051959, //
            -8.689632, 4.992860, 6.851853, //
            -8.859304, 4.992860, 7.942618, //
            -9.756158, 4.992860, 7.191204, //
            -9.780395, 4.992860, 9.203058, //
            -10.244660, 4.892860, 8.746849, //
            -10.244660, 4.892860, 5.077300, //
            -10.244660, 4.892860, -2.076638, //
            -10.244660, 4.892860, -5.729352, //
            -9.758579, 4.892860, 9.235000, //
            -9.775410, 4.892860, 7.248731, //
            -8.849607, 4.892860, 7.955709, //
            -8.681278, 4.892860, 6.861575, //
            -7.351484, 4.892860, 6.053600, //
            -8.378284, 4.892860, 4.572314, //
            -8.243623, 4.892860, 5.262460, //
            -9.270422, 4.892860, 6.491254, //
            -9.085262, 4.892860, 3.848505, //
            -9.017935, 4.892860, 3.006865, //
            -9.893236, 4.892860, 2.316721, //
            -9.573414, 4.892860, 1.475081, //
            -8.950603, 4.892860, 2.417719, //
            -8.125793, 4.892860, 0.700773, //
            -9.539745, 4.892860, -2.430124, //
            -9.405084, 4.892860, -4.046071, //
            -7.553477, 4.892860, -2.935109, //
            -7.183156, 4.892860, -4.079737, //
            -8.529787, 4.892860, -7.176972, //
            -10.244660, -4.907140, -7.938244, //
            -10.244660, -4.907140, -6.334682, //
            -10.244660, -4.907140, 3.352411, //
            -9.129109, -4.907140, -8.897754, //
            -8.629637, -4.907140, -8.122259, //
            -7.472973, -4.907140, -6.952448, //
            -9.023957, -4.907140, -6.518699, //
            -8.471909, -4.907140, -7.215328, //
            -7.801571, -4.907140, -5.322599, //
            -8.616495, -4.907140, -4.941425, //
            -9.668016, -4.907140, -3.548165, //
            -9.194834, -4.907140, -3.074983, //
            -9.194834, -4.907140, -1.655437, //
            -9.510288, -4.907140, -2.444073, //
            -10.101767, -4.907140, -1.510852, //
            -9.299984, -4.907140, -0.735360, //
            -9.089680, -4.907140, 1.025930, //
            -9.746878, -4.907140, 0.355589, //
            -9.838886, -4.907140, 1.209945, //
            -8.879375, -4.907140, 2.195742, //
            -9.155397, -4.907140, 3.036954, //
            -9.286842, -4.907140, 2.406045, //
            -9.852030, -4.907140, 1.932863, //
            -8.826799, -4.907140, 3.970176, //
            -8.195887, -4.907140, 6.112640, //
            -9.865168, -4.907140, 7.164156, //
            -8.498192, -4.907140, 7.335026, //
            -8.603345, -4.907140, 8.531126, //
            -9.431412, -4.907140, 8.531126, //
            -9.431411, -4.907140, 9.043740, //
            -7.998722, -4.907140, 9.162037, //
            -10.244661, -5.007140, -7.899659, //
            -10.244661, -5.007140, -6.317515, //
            -10.244661, -5.007140, 3.357899, //
            -10.244661, -5.007140, 9.770319, //
            -7.997427, -5.007140, 9.184441, //
            -9.419832, -5.007140, 9.047525, //
            -9.435043, -5.007140, 8.537892, //
            -8.613548, -5.007140, 8.553105, //
            -8.529873, -5.007140, 7.381711, //
            -9.830578, -5.007140, 7.161124, //
            -8.195190, -5.007140, 6.096220, //
            -8.811316, -5.007140, 3.966413, //
            -9.845791, -5.007140, 1.943095, //
            -9.260094, -5.007140, 2.452728, //
            -9.146002, -5.007140, 3.007999, //
            -8.864560, -5.007140, 2.201715, //
            -9.822971, -5.007140, 1.228089, //
            -9.739302, -5.007140, 0.376165, //
            -9.092751, -5.007140, 1.015107, //
            -9.298124, -5.007140, -0.772410, //
            -10.081594, -5.007140, -1.495023, //
            -9.526320, -5.007140, -2.423011, //
            -9.191637, -5.007140, -1.639546, //
            -9.184031, -5.007140, -3.077167, //
            -9.670847, -5.007140, -3.541160, //
            -8.666792, -5.007140, -4.902716, //
            -7.814865, -5.007140, -5.313464, //
            -8.491838, -5.007140, -7.199864, //
            -8.978653, -5.007140, -6.500069, //
            -7.464967, -5.007140, -6.941245, //
            -8.621149, -5.007140, -8.112641, //
            -9.100359, -5.007140, -8.850467, //

        ]
    }

    getFaces() {
        return [
            27, 26, 34, //
            113, 112, 116,
            5, 13, 7,
            2, 5, 1,
            8, 3, 7,
            6, 15, 5,
            7, 14, 8,
            8, 16, 6,
            3, 12, 9,
            2, 10, 11,
            97, 93, 10,
            12, 21, 62,
            21, 43, 62,
            20, 61, 43,
            22, 60, 61,
            23, 59, 60,
            24, 58, 59,
            25, 42, 58,
            19, 57, 42,
            26, 56, 57,
            27, 55, 56,
            28, 54, 55,
            29, 53, 54,
            30, 52, 53,
            31, 41, 52,
            51, 18, 32,
            51, 33, 50,
            34, 48, 49,
            35, 47, 48,
            36, 46, 47,
            37, 45, 46,
            38, 40, 45,
            17, 44, 40,
            11, 39, 2,
            3, 66, 125,
            66, 94, 125,
            63, 124, 94,
            67, 123, 124,
            68, 122, 123,
            69, 121, 122,
            70, 95, 121,
            120, 64, 71,
            120, 72, 119,
            72, 118, 119,
            73, 117, 118,
            75, 115, 116,
            74, 116, 117,
            76, 114, 115,
            77, 113, 114,
            78, 112, 113,
            79, 111, 112,
            80, 110, 111,
            81, 109, 110,
            82, 108, 109,
            83, 107, 108,
            84, 106, 107,
            85, 96, 106,
            65, 105, 96,
            86, 104, 105,
            87, 103, 104,
            88, 102, 103,
            89, 101, 102,
            90, 100, 101,
            91, 99, 100,
            92, 98, 99,
            1, 97, 10,
            8, 6, 22,
            6, 2, 37,
            37, 2, 39,
            39, 17, 38,
            35, 6, 37,
            21, 4, 8,
            22, 20, 21,
            25, 24, 23,
            22, 21, 8,
            19, 25, 26,
            25, 23, 26,
            23, 22, 35,
            35, 22, 6,
            39, 38, 37,
            37, 36, 35,
            34, 33, 32,
            34, 32, 31,
            32, 18, 31,
            35, 34, 26,
            23, 35, 26,
            34, 31, 30,
            30, 29, 27,
            29, 28, 27,
            30, 27, 34,
            97, 1, 98,
            1, 5, 98,
            7, 3, 125,
            125, 94, 124,
            125, 124, 123,
            5, 7, 123,
            7, 125, 123,
            100, 99, 101,
            99, 98, 101,
            122, 121, 95,
            5, 123, 120,
            123, 122, 120,
            101, 98, 102,
            98, 5, 104,
            102, 98, 104,
            104, 103, 102,
            122, 95, 120,
            120, 119, 117,
            119, 118, 117,
            106, 96, 107,
            96, 105, 108,
            105, 104, 109,
            104, 5, 120,
            109, 104, 120,
            120, 117, 116,
            116, 115, 114,
            120, 116, 112,
            109, 120, 112,
            108, 107, 96,
            111, 110, 112,
            110, 109, 112,
            109, 108, 105,
            116, 114, 113,
            5, 15, 13,
            2, 6, 5,
            8, 4, 3,
            6, 16, 15,
            7, 13, 14,
            8, 14, 16,
            3, 4, 12,
            2, 1, 10,
            97, 98, 93,
            12, 4, 21,
            21, 20, 43,
            20, 22, 61,
            22, 23, 60,
            23, 24, 59,
            24, 25, 58,
            25, 19, 42,
            19, 26, 57,
            26, 27, 56,
            27, 28, 55,
            28, 29, 54,
            29, 30, 53,
            30, 31, 52,
            31, 18, 41,
            51, 41, 18,
            51, 32, 33,
            34, 35, 48,
            35, 36, 47,
            36, 37, 46,
            37, 38, 45,
            38, 17, 40,
            17, 39, 44,
            11, 44, 39,
            3, 9, 66,
            66, 63, 94,
            63, 67, 124,
            67, 68, 123,
            68, 69, 122,
            69, 70, 121,
            70, 64, 95,
            120, 95, 64,
            120, 71, 72,
            72, 73, 118,
            73, 74, 117,
            75, 76, 115,
            74, 75, 116,
            76, 77, 114,
            77, 78, 113,
            78, 79, 112,
            79, 80, 111,
            80, 81, 110,
            81, 82, 109,
            82, 83, 108,
            83, 84, 107,
            84, 85, 106,
            85, 65, 96,
            65, 86, 105,
            86, 87, 104,
            87, 88, 103,
            88, 89, 102,
            89, 90, 101,
            90, 91, 100,
            91, 92, 99,
            92, 93, 98,
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
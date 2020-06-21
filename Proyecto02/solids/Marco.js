import ImageLoader from "../imageloader/ImageLoader.js";
import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";
import Vector4 from "../maths_CG/Vector4.js";

export default class Marco {
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
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ImageLoader.getImage("./texturas/Puerta.png"));
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

        gl.uniform1i(shader_locations.u_texture, 3);

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
            0.250000, 4.000000, -2.000000, //
            0.250000, -4.000000, -2.000000, //
            0.250000, 4.000000, 2.000000, //
            0.250000, -4.000000, 2.000000, //
            -0.250000, 4.000000, -2.000000, //
            -0.250000, -4.000000, -2.000000, //
            -0.250000, 4.000000, 2.000000, //
            -0.250000, -4.000000, 2.000000, //
            -0.250000, -4.000000, 1.700000, //
            0.250000, 4.000000, 1.700000, //
            -0.250000, 4.000000, 1.700000, //
            0.250000, -4.000000, 1.700000, //
            -0.250000, 4.000000, -1.700000, //
            0.250000, -4.000000, -1.700000, //
            -0.250000, -4.000000, -1.700000, //
            0.250000, 4.000000, -1.700000, //
            0.250000, 3.700000, 1.700000, //
            -0.250000, 3.700000, 1.700000, //
            0.250000, 3.700000, -1.700000, //
            -0.250000, 3.700000, -1.700000, //
            0.275000, 3.967400, 1.730000, //
            0.275000, 3.967400, 1.955000, //
            0.275000, -3.952600, 1.955000, //
            0.275000, -3.952600, 1.730000, //
            0.275000, 3.962500, -1.657500, //
            0.275000, 3.962500, 1.657500, //
            0.275000, 3.737500, 1.657500, //
            0.275000, 3.737500, -1.657500, //
            0.275000, -3.952600, -1.730000, //
            0.275000, -3.952600, -1.955000, //
            0.275000, 3.967400, -1.955000, //
            0.275000, 3.967400, -1.730000, //
            0.250000, 3.661500, 1.657500, //
            0.250000, -3.961500, 1.657500, //
            -0.250000, -3.961500, 1.657500, //
            -0.250000, 3.661500, 1.657500, //
            0.250000, -3.961500, -1.657500, //
            -0.250000, -3.961500, -1.657500, //
            0.250000, 3.661500, -1.657500, //
            -0.250000, 3.661500, -1.657500, //
            0.225000, 3.623385, 1.616063, //
            0.225000, -3.923385, 1.616063, //
            -0.225000, -3.923385, 1.616063, //
            -0.225000, 3.623385, 1.616063, //
            0.225000, -3.923385, -1.616063, //
            -0.225000, -3.923385, -1.616063, //
            0.225000, 3.623385, -1.616063, //
            -0.225000, 3.623385, -1.616063
        ]
    }

    getFaces() {
        return [
            10, 7, 3, //
            18, 9, 8, //
            6, 1, 2, //
            9, 4, 8, //
            2, 31, 30, //
            17, 28, 27, //
            16, 11, 10, //
            1, 13, 16, //
            6, 14, 15, //
            4, 7, 8, //
            18, 13, 20, //
            12, 35, 34, //
            14, 39, 37, //
            19, 33, 39, //
            10, 22, 21, //
            6, 20, 5, //
            24, 22, 23, //
            4, 24, 23, //
            32, 19, 29, //
            3, 23, 22, //
            28, 26, 27, //
            16, 26, 25, //
            19, 25, 28, //
            10, 27, 26, //
            30, 32, 29, //
            14, 30, 29, //
            1, 32, 31, //
            24, 17, 21, //
            38, 45, 46, //
            40, 46, 48, //
            39, 41, 47, //
            20, 38, 40, //
            18, 40, 36, //
            15, 37, 38, //
            9, 36, 35, //
            17, 34, 33, //
            44, 47, 41, //
            45, 48, 46, //
            44, 42, 43, //
            34, 43, 42, //
            36, 48, 44, //
            37, 47, 45, //
            35, 44, 43, //
            33, 42, 41, //
            10, 11, 7, //
            8, 7, 18, //
            7, 11, 18, //
            6, 5, 1, //
            9, 12, 4, //
            2, 1, 31, //
            17, 19, 28, //
            16, 13, 11, //
            1, 5, 13, //
            6, 2, 14, //
            4, 3, 7, //
            18, 11, 13, //
            12, 9, 35, //
            14, 19, 39, //
            19, 17, 33, //
            10, 3, 22, //
            15, 20, 6, //
            20, 13, 5, //
            24, 21, 22, //
            4, 12, 24, //
            16, 19, 32, //
            19, 14, 29, //
            3, 4, 23, //
            28, 25, 26, //
            16, 10, 26, //
            19, 16, 25, //
            10, 17, 27, //
            30, 31, 32, //
            14, 2, 30, //
            1, 16, 32, //
            12, 17, 24, //
            17, 10, 21, //
            38, 37, 45, //
            40, 38, 46, //
            39, 33, 41, //
            20, 15, 38, //
            18, 20, 40, //
            15, 14, 37, //
            9, 18, 36, //
            17, 12, 34, //
            44, 48, 47, //
            45, 47, 48, //
            44, 41, 42, //
            34, 35, 43, //
            36, 40, 48, //
            37, 39, 47, //
            35, 36, 44, //
            33, 34, 42
        ]
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

    getTangents(vertices, uv, normals) {
        let v0, v1, v2;
        let uv0, uv1, uv2;
        let delta_pos_1, delta_pos_2;
        let delta_uv_1, delta_uv_2;
        let r, div;
        let tangent, bitangent;
        let tangents = [];
        let bitangents = [];
        // se va a iterar sobre grupos de tres vertices, ya que estos forman un triángulo
        for (let i = 0; i < vertices.length / 3; i += 3) {
            // se construye el primer vertices de la cara
            v0 = new Vector3(
                vertices[i * 3],
                vertices[i * 3 + 1],
                vertices[i * 3 + 2]
            );
            // se construye el segundo vertices de la cara
            v1 = new Vector3(
                vertices[(i + 1) * 3],
                vertices[(i + 1) * 3 + 1],
                vertices[(i + 1) * 3 + 2]
            );
            // se construye el tercer vertices de la cara
            v2 = new Vector3(
                vertices[(i + 2) * 3],
                vertices[(i + 2) * 3 + 1],
                vertices[(i + 2) * 3 + 2]
            );

            // se construyen vectores que contienen la posición de las coordenadas uv
            uv0 = new Vector3(uv[i * 2], uv[i * 2 + 1], 0);
            uv1 = new Vector3(uv[(i + 1) * 2], uv[(i + 1) * 2 + 1], 0);
            uv2 = new Vector3(uv[(i + 2) * 2], uv[(i + 2) * 2 + 1], 0);

            // se calculan dos vectores de dirección que se encuentran sobre el plano definido por la cara
            delta_pos_1 = Vector3.subtract(v1, v0);
            delta_pos_2 = Vector3.subtract(v2, v0);

            // se calculan dos vectores de dirección que se encuentran sobre el plano uv
            delta_uv_1 = Vector3.subtract(uv1, uv0);
            delta_uv_2 = Vector3.subtract(uv2, uv0);

            // se calcula el vector tangente como:
            // T = (delta_pos_1 * delta_uv_2.y - delta_pos_2 * delta_uv_1.y) / (delta_uv_1.x * delta_uv_2.y - delta_uv_2.x * delta_uv_1.y);
            // y el vector bitangente como:
            // B = (delta_pos_2 * delta_uv_1.x - delta_pos_1 * delta_uv_2.x) / (delta_uv_1.x * delta_uv_2.y - delta_uv_2.x * delta_uv_1.y);
            div = (delta_uv_1.x * delta_uv_2.y - delta_uv_2.x * delta_uv_1.y);
            r = (div <= 0.000001) ? 1 : (1 / div);

            tangent = Vector3.subtract(
                delta_pos_1.scalar(delta_uv_2.y),
                delta_pos_2.scalar(delta_uv_1.y),
            );
            tangent = tangent.scalar(r).normalize();

            bitangent = Vector3.subtract(
                delta_pos_2.scalar(delta_uv_1.x),
                delta_pos_1.scalar(delta_uv_2.x),
            );
            bitangent = bitangent.scalar(r).normalize();

            // se almacenan los valores de los vectores tangente y bitangente
            tangents.push(
                tangent.x, tangent.y, tangent.z,
                tangent.x, tangent.y, tangent.z,
                tangent.x, tangent.y, tangent.z,
            );
            bitangents.push(
                bitangent.x, bitangent.y, bitangent.z,
                bitangent.x, bitangent.y, bitangent.z,
                bitangent.x, bitangent.y, bitangent.z,
            );
        }

        let tmp, tmp_T, tmp_N;
        for (let i = 0, l = tangents.length / 3; i < l; i++) {
            tmp_T = new Vector3(
                tangents[i * 3],
                tangents[i * 3 + 1],
                tangents[i * 3 + 2]
            );
            tmp_N = new Vector3(
                normals[i * 3],
                normals[i * 3 + 1],
                normals[i * 3 + 2]
            );

            tmp = Vector3.subtract(
                tmp_T,
                tmp_N.scalar(
                    Vector3.dot(tmp_N, tmp_T)
                )
            ).normalize();

            tangents[i * 3] = tmp.x;
            tangents[i * 3 + 1] = tmp.y;
            tangents[i * 3 + 2] = tmp.z;
        }

        return {
            tangentes: tangents,
            bitangentes: bitangents
        }
    }
}
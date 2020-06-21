import ImageLoader from "../imageloader/ImageLoader.js";
import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";
import Vector4 from "../maths_CG/Vector4.js";

export default class Piso {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Matrix4} initial_transform
     */
    constructor(gl, initial_transform, program) {

        //this.program = program

        let matrixAux = new Vector3(0, 0, 0);

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
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        // se utiliza el image loader para leer la textura
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ImageLoader.getImage("./texturas/Piso.jpg"));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.generateMipmap(gl.TEXTURE_2D);

        // se crea la textura de normales, para modificar las normales del modelo
        this.normal_texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.normal_texture);
        // se utiliza el image loader para leer la textura
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ImageLoader.getImage("./texturas/Piso_normal.jpg"));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.generateMipmap(gl.TEXTURE_2D);

        this.uv = this.getUV(this.vertices);
        this.UVBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.STATIC_DRAW);

        this.normals = this.getNormals(this.vertices);
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

        // buffer de tangentes
        this.tangents = this.getTangents(this.vertices, this.uv, this.normals).tangentes;
        this.tangentBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangents), gl.STATIC_DRAW);

        // buffer de bitangentes
        this.bitangents = this.getTangents(this.vertices, this.uv, this.normals).bitangentes;
        this.bitangentBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bitangentBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bitangents), gl.STATIC_DRAW);

        this.num_elements = this.vertices.length / 3;
    }

    /**
     * @param {WebGLRenderingContext} gl
     * @param {WebGLUniformLocation} shader_locations
     * @param {Vector4} lightPos
     * @param {Matrix4} viewMatrix
     * @param {Matrix4} projectionMatrix
     */
    draw(gl, shader_locations, lightPos, viewMatrix, projectionMatrix, camera) {
        //gl.useProgram(this.program);

        //gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shader_locations.u_texture, 0);
        gl.uniform1i(shader_locations.u_texture_normal, 1);

        gl.enableVertexAttribArray(shader_locations.positionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader_locations.positionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(shader_locations.texcoordAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
        gl.vertexAttribPointer(shader_locations.texcoordAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(shader_locations.normalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(shader_locations.normalAttribute, 3, gl.FLOAT, false, 0, 0);

        // los vectores tangentes asociados a los vértices
        gl.enableVertexAttribArray(shader_locations.a_tangent);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
        gl.vertexAttribPointer(shader_locations.a_tangent, 3, gl.FLOAT, false, 0, 0);

        // los vectores bitangentes asociados a los vértices
        gl.enableVertexAttribArray(shader_locations.a_bitangent);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bitangentBuffer);
        gl.vertexAttribPointer(shader_locations.a_bitangent, 3, gl.FLOAT, false, 0, 0);

        let viewModelMatrix = Matrix4.multiply(viewMatrix, this.initial_transform);
        gl.uniformMatrix4fv(shader_locations.u_M_matrix, false, this.initial_transform.toArray());

        let projectionViewModelMatrix = Matrix4.multiply(projectionMatrix, viewModelMatrix);
        gl.uniformMatrix4fv(shader_locations.PVM_matrix, false, projectionViewModelMatrix.toArray());

        let lightPosView = viewMatrix.multiplyVector(new Vector4(lightPos[0], lightPos[1], lightPos[2], lightPos[3]));
        gl.uniform3f(shader_locations.lightPosition, lightPosView.x, lightPosView.y, lightPosView.z);

        /* for (let i = 0; i < lightPos.length; i++) {
            gl.uniform3fv(shader_locations.lightPosition[i], [lightPos[i].x, lightPos[i].y, lightPos[i].z]);
        } */
        // la posición de la cámara
        //gl.uniform3fv(shader_locations.u_camera_position, camera.pos.toArray());

        gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);
    }

    getVertices() {
        return [ //
            -7.500000, 0.000000, 5.00000, //
            7.500000, 0.000000, 5.00000, //
            -7.500000, 0.000000, -10.00000, //
            7.500000, 0.000000, -10.00000
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
            0.000000,

            1.000000,
            1.000000,

            1.000000,
            0.000000,

            0.000000,
            0.000000,

            0.000000,
            1.000000,

            1.000000,
            1.000000,

        ]
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
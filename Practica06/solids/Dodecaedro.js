import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";
import Vector4 from "../maths_CG/Vector4.js";

export default class Dodecaedro {

    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * @param {Number} width
     * @param {Number} height
     * @param {Number} length
     * @param {Matrix4} initial_transform
     */
    constructor(gl, color, width, initial_transform) {

        this.w = (width || 1) / Math.PI;

        let matrixAux = new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

        this.initial_transform = initial_transform || matrixAux.identity();

        // se crea un buffer de vertices para dar posiciones en el espacio de dibujo
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        let vertices = this.getVertices();
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // se construye el buffer de coordenads uv
        this.uv = this.getUV(vertices);
        this.UVBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.STATIC_DRAW);

        // se crea un buffer de normales, las cuales son necesarias para el calculo del modelos de iluminación
        let normals = this.getNormals(vertices);
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        // se crea un buffer de color, necesario para pintar las caras de la figura
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        let colors = [];

        // instruccion que asigna el color al arreglo endonde si no se recibe un color se asigna uno al azar
        if (!color) {
            color = [Math.random(), Math.random(), Math.random(), 1];
        }
        for (let i = 0; i < vertices.length / 3; i++) {
            colors = colors.concat(color);
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        this.num_elements = vertices.length / 3;

    }

    /**
     * @param {WebGLRenderingContext} gl
     * @param {WebGLUniformLocation} shader_locations
     * @param {Vector4} lightPos
     * @param {Matrix4} viewMatrix
     * @param {Matrix4} projectionMatrix
     */
    draw(gl, shader_locations, lightPos, texture, viewMatrix, projectionMatrix) {
        // se activa la textura con la que se va a dibujar
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // se activa y se envía la información sobre la posicion del objeto geométrico
        gl.enableVertexAttribArray(shader_locations.positionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader_locations.positionAttribute, 3, gl.FLOAT, false, 0, 0);

        // se envía la información de las coordenadas de textura
        gl.enableVertexAttribArray(shader_locations.texcoordAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
        gl.vertexAttribPointer(shader_locations.texcoordAttribute, 2, gl.FLOAT, false, 0, 0);

        // se activa y se envía la información sobre las normales del objeto geométrico
        gl.enableVertexAttribArray(shader_locations.normalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(shader_locations.normalAttribute, 3, gl.FLOAT, false, 0, 0);

        // se activa y se envía la información sobre el color del objeto geométrico
        gl.enableVertexAttribArray(shader_locations.colorAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(shader_locations.colorAttribute, 4, gl.FLOAT, false, 0, 0);

        // se activa y se envía la información de la matriz de vista
        let viewModelMatrix = Matrix4.multiply(viewMatrix, this.initial_transform);
        gl.uniformMatrix4fv(shader_locations.VM_matrix, false, viewModelMatrix.toArray());

        // se activa y se envía la información del vector de posicion de la luz
        let lightPosView = viewMatrix.multiplyVector(new Vector4(lightPos[0], lightPos[1], lightPos[2], lightPos[3]));
        gl.uniform3f(shader_locations.lightPosition, lightPosView.x, lightPosView.y, lightPosView.z);

        // se activa y se envía la información de la matriz de proyeccion de la vista
        let projectionViewModelMatrix = Matrix4.multiply(projectionMatrix, viewModelMatrix);
        gl.uniformMatrix4fv(shader_locations.PVM_matrix, false, projectionViewModelMatrix.toArray());

        // instruccion que dibuja el arreglo recibido al gl 
        gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);
    }

    /**
     * Función que devuelve los vértices que definen un dodecaedro
     */
    getVertices() {

        var goldenRatio = 1.6180339887;

        let width_d_goldenRatio = this.w / goldenRatio;
        let width_m_goldenRatio = this.w * goldenRatio;

        let pos = [
            this.w, this.w, this.w, //
            this.w, this.w, -this.w, //
            this.w, -this.w, this.w, //
            this.w, -this.w, -this.w, //
            -this.w, this.w, this.w, //
            -this.w, this.w, -this.w, //
            -this.w, -this.w, this.w, //
            -this.w, -this.w, -this.w, //
            0, width_d_goldenRatio, width_m_goldenRatio, //
            0, width_d_goldenRatio, -width_m_goldenRatio, //
            0, -width_d_goldenRatio, width_m_goldenRatio, //
            0, -width_d_goldenRatio, -width_m_goldenRatio, //
            width_d_goldenRatio, width_m_goldenRatio, 0, //
            width_d_goldenRatio, -width_m_goldenRatio, 0, //
            -width_d_goldenRatio, width_m_goldenRatio, 0, //
            -width_d_goldenRatio, -width_m_goldenRatio, 0, //
            width_m_goldenRatio, 0, width_d_goldenRatio, //
            width_m_goldenRatio, 0, -width_d_goldenRatio, //
            -width_m_goldenRatio, 0, width_d_goldenRatio, //
            -width_m_goldenRatio, 0, -width_d_goldenRatio
        ];

        let faces = this.getFaces();
        let vertices = [];

        for (let i = 0; i < faces.length; i++) {
            vertices.push(pos[faces[i] * 3 + 0], pos[faces[i] * 3 + 1], pos[faces[i] * 3 + 2]);
        }

        return vertices;
    }

    /**
     * Función que devuelve los indices de los vértices que forman las caras del Dodecaedro
     */
    getFaces() {
        return [
            0, 8, 10,
            16, 0, 10,
            2, 16, 10,

            8, 0, 12,
            4, 8, 12,
            14, 4, 12,

            4, 18, 6,
            8, 4, 6,
            10, 8, 6,

            5, 19, 18,
            14, 5, 18,
            4, 14, 18,

            1, 17, 3,
            9, 1, 3,
            11, 9, 3,

            15, 13, 3,
            7, 15, 3,
            11, 7, 3,

            9, 5, 14,
            1, 9, 14,
            12, 1, 14,

            9, 11, 7,
            5, 9, 7,
            19, 5, 7,

            1, 12, 0,
            17, 1, 0,
            16, 17, 0,

            17, 16, 2,
            3, 17, 2,
            13, 3, 2,

            13, 2, 10,
            15, 13, 10,
            6, 15, 10,

            7, 15, 6,
            19, 7, 6,
            18, 19, 6,

            /* 
            10, 8, 0, 16, 2,
            8, 4, 14, 12, 0,
            6, 18, 4, 8, 10, //
            18, 19, 5, 14, 4, //

            3, 17, 1, 9, 11, //
            15, 13, 3, 11, 7,
            14, 5, 9, 1, 12, //
            7, 11, 9, 5, 19, //

            0, 12, 1, 17, 16, //
            2, 16, 17, 3, 13, //
            10, 2, 13, 15, 6, //
            6, 15, 7, 19, 18, // 
            */

        ]
    }

    /**
     * Función que devuelve las normales de los vertices de la figura
     */
    getNormals(vertices) {

        let normals = [];

        let v1, v2, v3, v4, v5, n;
        let s1, s2, s3, s4;

        for (let i = 0; i < vertices.length; i += 9) {

            v1 = new Vector3(vertices[i + 0], vertices[i + 1], vertices[i + 2]);
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
        // https://en.wikipedia.org/wiki/UV_mapping
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

            if (Math.abs(u1 - u2) > 0.75) {
                if (u1 > u2) {
                    u2 = 1 + u2;
                } else {
                    u1 = 1 + u1;
                }
            }
            if (Math.abs(u1 - u3) > 0.75) {
                if (u1 > u3) {
                    u3 = 1 + u3;
                } else {
                    u1 = 1 + u1;
                }
            }
            if (Math.abs(u2 - u3) > 0.75) {
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
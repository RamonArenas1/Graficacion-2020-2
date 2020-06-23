import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";
import Vector4 from "../maths_CG/Vector4.js";

export default class Icosaedro {

    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * @param {Number} width
     * @param {Number} height
     * @param {Number} length
     * @param {Matrix4} initial_transform
     */
    constructor(gl, color, width, initial_transform) {

        this.w = (width || 1) / 2;

        let matrixAux = new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

        this.initial_transform = initial_transform || matrixAux.identity();

        // se crea un buffer de vertices para dar posiciones en el espacio de dibujo
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        let vertices = this.getVertices();
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // se construye el buffer de coordenads uv
        this.uv = this.getUV();
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
     * @param {GLint} positionAttributeLocation
     * @param {WebGLUniformLocation} colorUniformLocation
     * @param {WebGLUniformLocation} PVM_matrixLocation
     * @param {Matrix4} projectionViewMatrix
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
     * Función que devuelve los vértices que definen un icosaedro
     */
    getVertices() {
        var goldenRatio = 1.6180339887;
        let width_m_goldenRatio = this.w * goldenRatio;

        let pos = [
            0, this.w, width_m_goldenRatio,
            0, this.w, -width_m_goldenRatio,
            0, -this.w, width_m_goldenRatio,
            0, -this.w, -width_m_goldenRatio,
            this.w, width_m_goldenRatio, 0,
            this.w, -width_m_goldenRatio, 0, //
            -this.w, width_m_goldenRatio, 0, //
            -this.w, -width_m_goldenRatio, 0,
            width_m_goldenRatio, 0, this.w,
            width_m_goldenRatio, 0, -this.w, //
            -width_m_goldenRatio, 0, this.w, //
            -width_m_goldenRatio, 0, -this.w,
        ];

        let faces = this.getFaces();
        let vertices = [];

        for (let i = 0; i < faces.length; i++) {
            vertices.push(pos[faces[i] * 3], pos[faces[i] * 3 + 1], pos[faces[i] * 3 + 2]);
        }

        return vertices;
    }

    /**
     * Función que devuelve los indices de los vértices que forman las caras del icosaedro
     */
    getFaces() {
        return [
            10, 0, 2, //
            0, 8, 2, //
            8, 5, 2, //

            5, 7, 2, //
            7, 10, 2, //
            6, 0, 10, //

            11, 6, 10, //
            7, 11, 10, //
            7, 3, 11, //

            5, 3, 7, //
            9, 3, 5, //
            8, 9, 5, //

            4, 9, 8, //
            0, 4, 8, //
            6, 4, 0, //

            11, 3, 1, //
            6, 11, 1, //
            4, 6, 1, //

            9, 4, 1, //
            3, 9, 1
        ]
    }

    /**
     * Función que devuelve las normales de los vertices de la figura
     */
    getNormals(vertices) {

        let normals = [];

        let v1, v2, v3, n;

        for (let i = 0; i < vertices.length; i += 9) {

            v1 = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
            v2 = new Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
            v3 = new Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);

            n = Vector3.cross(
                Vector3.subtract(v1, v2),
                Vector3.subtract(v3, v2)
            ).normalize();

            normals.push(
                n.x, n.y, n.z,
                n.x, n.y, n.z,
                n.x, n.y, n.z
            );
        }

        return normals;
    }

    getUV() {
        return [

            0, 0.4,
            0.2, 0.8,
            0.4, 0.4,

            0.2, 0,
            0, 0.4,
            0.4, 0.4,

            0.4, 0.8,
            0.2, 0.4,
            0.6, 0.4,

            0.2, 0.4,
            0.4, 0,
            0.6, 0.4,

            0.8, 0.8,
            1, 0.4,
            0.6, 0.4,

            1, 0.4,
            0.8, 0,
            0.6, 0.4,

            0.6, 0.8,
            0.4, 0.4,
            0.8, 0.4,

            0, 0.6,
            0.6, 0.8,
            0.8, 0.4,

            0.6, 0.8,
            0.4, 0.4,
            0.8, 0.4,

            0, 0.6,
            0.6, 0.8,
            0.8, 0.4,

            0, 0.4,
            0.2, 0.8,
            0.4, 0.4,

            0.2, 0,
            0, 0.4,
            0.4, 0.4,

            0.4, 0.8,
            0.2, 0.4,
            0.6, 0.4,

            0.2, 0.4,
            0.4, 0,
            0.6, 0.4,

            0.8, 0.8,
            1, 0.4,
            0.6, 0.4,

            1, 0.4,
            0.8, 0,
            0.6, 0.4,

            0.6, 0.8,
            0.4, 0.4,
            0.8, 0.4,

            0, 0.6,
            0.6, 0.8,
            0.8, 0.4,

            0.6, 0.8,
            0.4, 0.4,
            0.8, 0.4,

            0, 0.6,
            0.6, 0.8,
            0.8, 0.4,

        ]
    }
}
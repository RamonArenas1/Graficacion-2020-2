import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";
import Vector4 from "../maths_CG/Vector4.js";

export default class PrismaRectangular {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * @param {Number} width
     * @param {Number} height
     * @param {Number} length
     * @param {Matrix4} initial_transform
     */
    constructor(gl, color, width, height, length, initial_transform) {

        this.w = (width || 1) / 2;
        this.h = (height || 1) / 2;
        this.l = (length || 1) / 2;

        let matrixAux = new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

        this.spec = false;

        this.initial_transform = initial_transform || matrixAux.identity();

        // se crea un buffer de vertices para dar posiciones en el espacio de dibujo
        this.positionBuffer = gl.createBuffer();
        this.vertices = this.getVertices();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        // se construye el buffer de coordenads uv
        this.uv = this.getUV();
        this.UVBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.STATIC_DRAW);

        // se crea un buffer de normales, las cuales son necesarias para el calculo del modelos de iluminación
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
    draw(gl, shader_locations, lightPos, texture, viewMatrix, projectionMatrix) {
        // se activa la textura con la que se va a dibujar
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // se envía la información de la posición de los vértices
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
     * Función que devuelve los vértices que definen un Prisma rectangular
     */
    getVertices() {
        let pos = [
            this.w, this.h, this.l,
            this.w, -this.h, this.l,

            this.w, this.h, -this.l,
            this.w, -this.h, -this.l,

            -this.w, this.h, this.l, //
            -this.w, -this.h, this.l,

            -this.w, this.h, -this.l, //
            -this.w, -this.h, -this.l
        ];

        let faces = this.getFaces();
        let vertices = [];

        for (let i = 0; i < faces.length; i++) {
            vertices.push(pos[faces[i] * 3], pos[faces[i] * 3 + 1], pos[faces[i] * 3 + 2]);
        }

        return vertices;
    }


    /**
     * Función que devuelve los indices de los vértices que forman las caras del Prisma rectangular
     */
    getFaces() {
        return [
            0, 1, 3,
            0, 3, 2,

            1, 4, 5,
            1, 0, 4,

            5, 6, 7,
            5, 4, 6,

            2, 3, 7,
            2, 7, 6,

            6, 0, 2,
            6, 4, 0,

            3, 5, 7,
            3, 1, 5,
        ];
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

    getUV() {
        return [
            // derecha
            0.25, 0.5,
            0.25, 0.75,
            0.75, 0.75,

            0.25, 0.5,
            0.75, 0.75,
            0.75, 0.5,

            // abajo
            0.25, 0.5,
            0, 0.25,
            0.25, 0.25,
            0.25, 0.5,
            0, 0.5,
            0, 0.25,

            // izquierda
            0.25, 0,
            0.75, 0.25,
            0.75, 0,
            0.25, 0,
            0.25, 0.25,
            0.75, 0.25,

            // arriba
            1, 0.5,
            0.75, 0.5,
            0.75, 0.25,
            1, 0.5,
            0.75, 0.25,
            1, 0.25,

            //frente
            0.25, 0.75,
            0.75, 1,
            0.25, 1,
            0.25, 0.75,
            0.75, 0.75,
            0.75, 1,


            // atras
            0.25, 0.25,
            0.75, 0.5,
            0.25, 0.5,
            0.25, 0.25,
            0.75, 0.25,
            0.75, 0.5,

        ]
    }
}
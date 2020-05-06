import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";
import Vector4 from "../maths_CG/Vector4.js";

export default class Esfera {

    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * @param {Number} width
     * @param {Number} height
     * @param {Number} length
     * @param {Matrix4} initial_transform
     */
    constructor(gl, color, radius, Nu, Nv, initial_transform) {

        this.radius = radius || 1;
        this.Nu = Nu || 2;
        this.Nv = Nv || 2;

        let matrixAux = new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        //let m = matrixAux.identity();

        this.initial_transform = initial_transform || matrixAux.identity();

        // se crea un buffer de vertices para dar posiciones en el espacio de dibujo
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        let vertices = this.getVertices();
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

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
    draw(gl, shader_locations, lightPos, viewMatrix, projectionMatrix) {

        // se activa y se envía la información sobre la posicion del objeto geométrico
        gl.enableVertexAttribArray(shader_locations.positionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader_locations.positionAttribute, 3, gl.FLOAT, false, 0, 0);

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
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.num_elements);
    }

    /**
     * Función que devuelve los vértices que definen un esfera
     */
    getVertices() {

        let pos = [];
        let phi;
        let theta;
        let x, y, z;

        pos.push(0);
        pos.push(this.radius);
        pos.push(0);

        for (let i = 1; i < this.Nu + 1; i++) {
            phi = (i * Math.PI) / this.Nu;

            for (let j = 0; j < this.Nv; j++) {
                theta = (j * 2 * Math.PI) / this.Nv;

                x = this.radius * Math.sin(phi) * Math.cos(theta);
                y = this.radius * Math.cos(phi);
                z = this.radius * Math.sin(phi) * Math.sin(theta);

                pos.push(x);
                pos.push(y);
                pos.push(z);
            }
        }

        pos.push(0);
        pos.push(-this.radius);
        pos.push(0);

        let faces = this.getFaces();
        let vertices = [];

        for (let i = 0; i < faces.length; i++) {
            vertices.push(pos[faces[i] * 3], pos[faces[i] * 3 + 1], pos[faces[i] * 3 + 2]);
        }

        return vertices;
    }

    /**
     * Función que devuelve los indices de los vértices que forman las caras del esfera
     */
    getFaces() {
        let faces = [];

        for (let i = 0; i < this.Nv; i++) {
            faces.push(
                0,
                ((i + 1) % this.Nv) + 1,
                (i % this.Nv) + 1
            );
        }



        // se generan los cuadriláteros correspondientes a las caras restantes
        for (let i = 0; i < this.Nv - 1; i++) {
            for (let j = 0; j < this.Nu; j++) {
                faces.push((j + 1) % this.Nv + i * this.Nv); //2
                faces.push((j + 1) % this.Nv + (i + 1) * this.Nv); //3
                faces.push(j + (i + 1) * this.Nv); //4
                faces.push(j + i * this.Nv); //1


            }
        }

        return faces;
    }

    getNormals(vertices) {

        let normals = [];

        let v1, v2, v3, v4, n, s1, s2;

        for (let i = 0; i < vertices.length; i += 12) {

            v1 = new Vector3(vertices[i + 0], vertices[i + 1], vertices[i + 2]);
            v2 = new Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
            v3 = new Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);
            v4 = new Vector3(vertices[i + 9], vertices[i + 10], vertices[i + 11]);

            s1 = Vector3.cross(
                Vector3.subtract(v2, v1),
                Vector3.subtract(v3, v2)
            ).normalize();

            s2 = Vector3.cross(
                Vector3.subtract(v3, v2),
                Vector3.subtract(v4, v3)
            ).normalize();

            normals.push(
                (s1.x + s2.x) / 2, (s1.y + s2.x) / 2, (s1.z + s2.x) / 2,
                (s1.x + s2.x) / 2, (s1.y + s2.x) / 2, (s1.z + s2.x) / 2,
                (s1.x + s2.x) / 2, (s1.y + s2.x) / 2, (s1.z + s2.x) / 2,
                (s1.x + s2.x) / 2, (s1.y + s2.x) / 2, (s1.z + s2.x) / 2
            );
        }

        return normals;
    }
}
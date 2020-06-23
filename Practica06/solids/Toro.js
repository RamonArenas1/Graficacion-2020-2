import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";
import Vector4 from "../maths_CG/Vector4.js";

export default class Toro {

    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * @param {Number} width
     * @param {Number} height
     * @param {Number} length
     * @param {Matrix4} initial_transform
     */
    constructor(gl, color, major_radius, minor_radius, Nu, Nv, initial_transform) {

        let Ra = (major_radius || 1) / 2;
        let ra = (minor_radius || 1) / 2;

        this.r = ra;
        this.R = Ra;
        this.Nu = Nu || 2;
        this.Nv = Nv || 2;

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

        /* // se activa y se envía la información sobre el color del objeto geométrico
        gl.enableVertexAttribArray(shader_locations.colorAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(shader_locations.colorAttribute, 4, gl.FLOAT, false, 0, 0); */

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
     * Función que devuelve los vértices que definen un Toro
     */
    getVertices() {

        let pos = [];

        for (let i = 0; i < this.Nv + 1; i++) {
            for (let j = 0; j < this.Nu; j++) {
                pos.push(-(this.R + this.r * Math.sin(2 * Math.PI * j / this.Nu)) * Math.sin(2 * Math.PI * i / this.Nv));
                pos.push(this.r * Math.cos(2 * Math.PI * j / this.Nu));
                pos.push((this.R + this.r * Math.sin(2 * Math.PI * j / this.Nu)) * Math.cos(2 * Math.PI * i / this.Nv));
            }
        }

        let faces = this.getFaces();
        let vertices = [];

        for (let i = 0; i < faces.length; i++) {
            vertices.push(pos[faces[i] * 3], pos[faces[i] * 3 + 1], pos[faces[i] * 3 + 2]);
        }

        return vertices;
    }

    /**
     * Función que devuelve los indices de los vértices que forman las caras del Toro
     */
    getFaces() {

        let faces = [];

        // se generan los cuadriláteros correspondientes a las caras que forman el toro

        for (let i = 0; i < this.Nv; i++) {
            for (let j = 0; j < this.Nu; j++) {
                faces.push(
                    j + i * this.Nu,
                    //j + (i + 1) * this.Nu,
                    (j + 1) % this.Nu + (i + 1) * this.Nu,
                    (j + 1) % this.Nu + i * this.Nu
                );

                faces.push(
                    j + i * this.Nu,
                    j + (i + 1) * this.Nu,
                    (j + 1) % this.Nu + (i + 1) * this.Nu,
                    //(j + 1) % this.Nu + i * this.Nu 
                );
            }
        }

        /* for (let i = 0; i < this.Nv; i++) {
            for (let j = 0; j < this.Nu; j++) {
                faces.push(j + i * this.Nu);
            }
        }

        for (let i = 0; i < this.Nv; i++) {
            for (let j = 0; j < this.Nu; j++) {
                faces.push((j + 1) % this.Nu + i * this.Nu);
                faces.push((j + 1) % this.Nu + (i + 1) * this.Nu);

            }
        }

        for (let i = 0; i < this.Nv; i++) {
            for (let j = 0; j < this.Nu; j++) {
                faces.push(j + (i + 1) * this.Nu);
            }
        } */

        return faces;
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
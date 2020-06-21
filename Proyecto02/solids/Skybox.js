import ImageLoader from "../imageloader/ImageLoader.js";
import Vector3 from "../maths_CG/Vector3.js";
import Matrix4 from "../maths_CG/Matrix4.js";

export default class Skybox {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Matrix4} initial_transform
     */
    constructor(gl, initial_transform) {
        let matrixAux = new Vector3(0, 0, 0);

        this.initial_transform = initial_transform || matrixAux.identity();

        // el skybox tiene su propio programa
        this.program =
            this.createProgram(
                gl,
                this.createShaders(
                    gl,
                    gl.VERTEX_SHADER,
                    `attribute vec4 a_position;
                    attribute vec2 a_texcoord;
                    uniform mat4 u_PVM_matrix;
                    varying vec2 v_texcoord;
                    void main() {
                    gl_Position = u_PVM_matrix * a_position;
                    v_texcoord = a_texcoord;
                    }`
                ),
                this.createShaders(
                    gl,
                    gl.FRAGMENT_SHADER,
                    `precision mediump float;
                    varying vec2 v_texcoord;
                    uniform sampler2D u_texture;
                    void main() {
                    gl_FragColor = texture2D(u_texture, v_texcoord);
                    }`
                )
            );

        // el skybox tiene su propias referencias a las variables de los shaders
        this.shader_locations = {
            positionAttribute: gl.getAttribLocation(this.program, "a_position"),
            texcoordAttribute: gl.getAttribLocation(this.program, "a_texcoord"),
            PVM_matrix: gl.getUniformLocation(this.program, "u_PVM_matrix"),
            u_texture: gl.getUniformLocation(this.program, "u_texture"),
        }


        /* this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        // se utiliza el image loader para leer la textura
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ImageLoader.getImage("./texturas/Skybox.png"));
        gl.generateMipmap(gl.TEXTURE_2D); */

        this.texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        // se utiliza el image loader para leer la textura
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ImageLoader.getImage("./texturas/Skybox.png"));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


        // se construye el buffer de vértices
        this.vertices = this.getVertices();
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        // se construye el buffer de coordenadas uv
        this.uv = this.getUV(this.vertices);
        this.UVBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.STATIC_DRAW);

        this.num_elements = this.vertices.length / 3;
    }

    /**
     * @param {WebGLRenderingContext} gl
     * @param {Matrix4} projectionViewMatrix
     */
    draw(gl, projectionViewMatrix) {
        gl.useProgram(this.program);
        // se activa la textura con la que se va a dibujar
        //gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.uniform1i(this.shader_locations.u_texture, 2);

        // se envía la información de la posición de los vértices
        gl.enableVertexAttribArray(this.shader_locations.positionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.shader_locations.positionAttribute, 3, gl.FLOAT, false, 0, 0);

        // se envía la información de las coordenadas de textura
        gl.enableVertexAttribArray(this.shader_locations.texcoordAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
        gl.vertexAttribPointer(this.shader_locations.texcoordAttribute, 2, gl.FLOAT, false, 0, 0);

        // se envía la matriz de transformación modelo, vista, proyección
        let projectionViewModelMatrix = Matrix4.multiply(projectionViewMatrix, this.initial_transform).toArray();
        gl.uniformMatrix4fv(this.shader_locations.PVM_matrix, false, projectionViewModelMatrix);

        // se dibuja la geometría
        gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);
    }

    getVertices() {
        // La geometría es ahora una esfera
        return [
            0.5, -0.707107, -0.5, 0.382683, -0.92388, 0, 0.270598, -0.92388, -0.270598, 0.653281, -0.382684, -0.653281, 1, 0, 0, 0.923879, -0.382684, 0, 0.653281, 0.382683, -0.653281, 0.707107, 0.707107, 0, 0.923879, 0.382683, 0, 0.270598, 0.92388, -0.270598, 0, 1, 0, 0.382683, 0.92388, 0, 0, -1, 0, 0.270598, -0.92388, -0.270598, 0.382683, -0.92388, 0, 0.653281, -0.382684, -0.653281, 0.707107, -0.707107, 0, 0.5, -0.707107, -0.5, 0.653281, 0.382683, -0.653281, 1, 0, 0, 0.707107, 0, -0.707107, 0.5, 0.707107, -0.5, 0.382683, 0.92388, 0, 0.707107, 0.707107, 0, 0.707107, 0.707107, 0, 0.653281, 0.382683, 0.653281, 0.923879, 0.382683, 0, 0.382683, 0.92388, 0, 0, 1, 0, 0.270598, 0.92388, 0.270598, 0, -1, 0, 0.382683, -0.92388, 0, 0.270598, -0.92388, 0.270598, 0.923879, -0.382684, 0, 0.5, -0.707107, 0.5, 0.707107, -0.707107, 0, 0.923879, 0.382683, 0, 0.707107, 0, 0.707106, 1, 0, 0, 0.382683, 0.92388, 0, 0.5, 0.707107, 0.5, 0.707107, 0.707107, 0, 0.382683, -0.92388, 0, 0.5, -0.707107, 0.5, 0.270598, -0.92388, 0.270598, 1, 0, 0, 0.653281, -0.382684, 0.653281, 0.923879, -0.382684, 0, 0, -1, 0, 0.270598, -0.92388, 0.270598, 0, -0.92388, 0.382683, 0.653281, -0.382684, 0.653281, 0, -0.707107, 0.707106, 0.5, -0.707107, 0.5, 0.653281, 0.382683, 0.653281, 0, 0, 1, 0.707107, 0, 0.707106, 0.270598, 0.92388, 0.270598, 0, 0.707107, 0.707106, 0.5, 0.707107, 0.5, 0.5, -0.707107, 0.5, 0, -0.92388, 0.382683, 0.270598, -0.92388, 0.270598, 0.707107, 0, 0.707106, 0, -0.382684, 0.923879, 0.653281, -0.382684, 0.653281, 0.5, 0.707107, 0.5, 0, 0.382683, 0.923879, 0.653281, 0.382683, 0.653281, 0.270598, 0.92388, 0.270598, 0, 1, 0, 0, 0.92388, 0.382683, 0, 0.92388, 0.382683, -0.5, 0.707107, 0.5, 0, 0.707107, 0.707106, 0, -0.707107, 0.707106, -0.270598, -0.92388, 0.270598, 0, -0.92388, 0.382683, 0, 0, 1, -0.653281, -0.382684, 0.653281, 0, -0.382684, 0.923879, 0, 0.707107, 0.707106, -0.653281, 0.382683, 0.653281, 0, 0.382683, 0.923879, 0, 0.92388, 0.382683, 0, 1, 0, -0.270598, 0.92388, 0.270598, 0, -1, 0, 0, -0.92388, 0.382683, -0.270598, -0.92388, 0.270598, 0, -0.707107, 0.707106, -0.653281, -0.382684, 0.653281, -0.5, -0.707107, 0.5, 0, 0.382683, 0.923879, -0.707107, 0, 0.707106, 0, 0, 1, -0.5, -0.707107, 0.5, -0.382683, -0.92388, 0, -0.270598, -0.92388, 0.270598, -0.707107, 0, 0.707106, -0.923879, -0.382684, 0, -0.653281, -0.382684, 0.653281, -0.5, 0.707107, 0.5, -0.923879, 0.382683, 0, -0.653281, 0.382683, 0.653281, -0.270598, 0.92388, 0.270598, 0, 1, 0, -0.382683, 0.92388, 0, 0, -1, 0, -0.270598, -0.92388, 0.270598, -0.382683, -0.92388, 0, -0.5, -0.707107, 0.5, -0.923879, -0.382684, 0, -0.707106, -0.707107, 0, -0.707107, 0, 0.707106, -0.923879, 0.382683, 0, -1, 0, 0, -0.5, 0.707107, 0.5, -0.382683, 0.92388, 0, -0.707106, 0.707107, 0, -0.382683, 0.92388, 0, 0, 1, 0, -0.270598, 0.92388, -0.270598, 0, -1, 0, -0.382683, -0.92388, 0, -0.270598, -0.92388, -0.270598, -0.923879, -0.382684, 0, -0.5, -0.707107, -0.5, -0.707106, -0.707107, 0, -1, 0, 0, -0.653281, 0.382683, -0.653281, -0.707107, 0, -0.707107, -0.382683, 0.92388, 0, -0.5, 0.707107, -0.5, -0.707106, 0.707107, 0, -0.707106, -0.707107, 0, -0.270598, -0.92388, -0.270598, -0.382683, -0.92388, 0, -1, 0, 0, -0.653281, -0.382684, -0.653281, -0.923879, -0.382684, 0, -0.707106, 0.707107, 0, -0.653281, 0.382683, -0.653281, -0.923879, 0.382683, 0, -0.5, -0.707107, -0.5, 0, -0.382684, -0.923879, 0, -0.707107, -0.707107, -0.707107, 0, -0.707107, 0, 0.382683, -0.923879, 0, 0, -1, -0.270598, 0.92388, -0.270598, 0, 0.707107, -0.707107, -0.5, 0.707107, -0.5, -0.270598, -0.92388, -0.270598, 0, -0.707107, -0.707107, 0, -0.92388, -0.382683, -0.707107, 0, -0.707107, 0, -0.382684, -0.923879, -0.653281, -0.382684, -0.653281, -0.5, 0.707107, -0.5, 0, 0.382683, -0.923879, -0.653281, 0.382683, -0.653281, -0.270598, 0.92388, -0.270598, 0, 1, 0, 0, 0.92388, -0.382683, 0, -1, 0, -0.270598, -0.92388, -0.270598, 0, -0.92388, -0.382683, 0, -0.707107, -0.707107, 0.270598, -0.92388, -0.270598, 0, -0.92388, -0.382683, 0, 0, -1, 0.653281, -0.382684, -0.653281, 0, -0.382684, -0.923879, 0, 0.707107, -0.707107, 0.653281, 0.382683, -0.653281, 0, 0.382683, -0.923879, 0, 0.92388, -0.382683, 0, 1, 0, 0.270598, 0.92388, -0.270598, 0, -1, 0, 0, -0.92388, -0.382683, 0.270598, -0.92388, -0.270598, 0, -0.382684, -0.923879, 0.5, -0.707107, -0.5, 0, -0.707107, -0.707107, 0, 0.382683, -0.923879, 0.707107, 0, -0.707107, 0, 0, -1, 0, 0.92388, -0.382683, 0.5, 0.707107, -0.5, 0, 0.707107, -0.707107, 0.5, -0.707107, -0.5, 0.707107, -0.707107, 0, 0.382683, -0.92388, 0, 0.653281, -0.382684, -0.653281, 0.707107, 0, -0.707107, 1, 0, 0, 0.653281, 0.382683, -0.653281, 0.5, 0.707107, -0.5, 0.707107, 0.707107, 0, 0.653281, -0.382684, -0.653281, 0.923879, -0.382684, 0, 0.707107, -0.707107, 0, 0.653281, 0.382683, -0.653281, 0.923879, 0.382683, 0, 1, 0, 0, 0.5, 0.707107, -0.5, 0.270598, 0.92388, -0.270598, 0.382683, 0.92388, 0, 0.707107, 0.707107, 0, 0.5, 0.707107, 0.5, 0.653281, 0.382683, 0.653281, 0.923879, -0.382684, 0, 0.653281, -0.382684, 0.653281, 0.5, -0.707107, 0.5, 0.923879, 0.382683, 0, 0.653281, 0.382683, 0.653281, 0.707107, 0, 0.707106, 0.382683, 0.92388, 0, 0.270598, 0.92388, 0.270598, 0.5, 0.707107, 0.5, 0.382683, -0.92388, 0, 0.707107, -0.707107, 0, 0.5, -0.707107, 0.5, 1, 0, 0, 0.707107, 0, 0.707106, 0.653281, -0.382684, 0.653281, 0.653281, -0.382684, 0.653281, 0, -0.382684, 0.923879, 0, -0.707107, 0.707106, 0.653281, 0.382683, 0.653281, 0, 0.382683, 0.923879, 0, 0, 1, 0.270598, 0.92388, 0.270598, 0, 0.92388, 0.382683, 0, 0.707107, 0.707106, 0.5, -0.707107, 0.5, 0, -0.707107, 0.707106, 0, -0.92388, 0.382683, 0.707107, 0, 0.707106, 0, 0, 1, 0, -0.382684, 0.923879, 0.5, 0.707107, 0.5, 0, 0.707107, 0.707106, 0, 0.382683, 0.923879, 0, 0.92388, 0.382683, -0.270598, 0.92388, 0.270598, -0.5, 0.707107, 0.5, 0, -0.707107, 0.707106, -0.5, -0.707107, 0.5, -0.270598, -0.92388, 0.270598, 0, 0, 1, -0.707107, 0, 0.707106, -0.653281, -0.382684, 0.653281, 0, 0.707107, 0.707106, -0.5, 0.707107, 0.5, -0.653281, 0.382683, 0.653281, 0, -0.707107, 0.707106, 0, -0.382684, 0.923879, -0.653281, -0.382684, 0.653281, 0, 0.382683, 0.923879, -0.653281, 0.382683, 0.653281, -0.707107, 0, 0.707106, -0.5, -0.707107, 0.5, -0.707106, -0.707107, 0, -0.382683, -0.92388, 0, -0.707107, 0, 0.707106, -1, 0, 0, -0.923879, -0.382684, 0, -0.5, 0.707107, 0.5, -0.707106, 0.707107, 0, -0.923879, 0.382683, 0, -0.5, -0.707107, 0.5, -0.653281, -0.382684, 0.653281, -0.923879, -0.382684, 0, -0.707107, 0, 0.707106, -0.653281, 0.382683, 0.653281, -0.923879, 0.382683, 0, -0.5, 0.707107, 0.5, -0.270598, 0.92388, 0.270598, -0.382683, 0.92388, 0, -0.923879, -0.382684, 0, -0.653281, -0.382684, -0.653281, -0.5, -0.707107, -0.5, -1, 0, 0, -0.923879, 0.382683, 0, -0.653281, 0.382683, -0.653281, -0.382683, 0.92388, 0, -0.270598, 0.92388, -0.270598, -0.5, 0.707107, -0.5, -0.707106, -0.707107, 0, -0.5, -0.707107, -0.5, -0.270598, -0.92388, -0.270598, -1, 0, 0, -0.707107, 0, -0.707107, -0.653281, -0.382684, -0.653281, -0.707106, 0.707107, 0, -0.5, 0.707107, -0.5, -0.653281, 0.382683, -0.653281, -0.5, -0.707107, -0.5, -0.653281, -0.382684, -0.653281, 0, -0.382684, -0.923879, -0.707107, 0, -0.707107, -0.653281, 0.382683, -0.653281, 0, 0.382683, -0.923879, -0.270598, 0.92388, -0.270598, 0, 0.92388, -0.382683, 0, 0.707107, -0.707107, -0.270598, -0.92388, -0.270598, -0.5, -0.707107, -0.5, 0, -0.707107, -0.707107, -0.707107, 0, -0.707107, 0, 0, -1, 0, -0.382684, -0.923879, -0.5, 0.707107, -0.5, 0, 0.707107, -0.707107, 0, 0.382683, -0.923879, 0, -0.707107, -0.707107, 0.5, -0.707107, -0.5, 0.270598, -0.92388, -0.270598, 0, 0, -1, 0.707107, 0, -0.707107, 0.653281, -0.382684, -0.653281, 0, 0.707107, -0.707107, 0.5, 0.707107, -0.5, 0.653281, 0.382683, -0.653281, 0, -0.382684, -0.923879, 0.653281, -0.382684, -0.653281, 0.5, -0.707107, -0.5, 0, 0.382683, -0.923879, 0.653281, 0.382683, -0.653281, 0.707107, 0, -0.707107, 0, 0.92388, -0.382683, 0.270598, 0.92388, -0.270598, 0.5, 0.707107, -0.5
        ];
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

    /**
     *
     */
    createShaders(gl, type, source) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    /**
     *
     */
    createProgram(gl, vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        let success = gl.getProgramParameter(program, gl.LINK_STATUS);

        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}
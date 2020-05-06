// Se importan las clases a utilizar
import Vector3 from "./maths_CG/Vector3.js";
import Matrix4 from "./maths_CG/Matrix4.js";

import Cilindro from "./solids/Cilindro.js";
import Cono from "./solids/Cono.js";
import Dodecaedro from "./solids/Dodecaedro.js";
import Esfera from "./solids/Esfera.js";
import Icosaedro from "./solids/Icosaedro.js";
import Octaedro from "./solids/Octaedro.js";
import PrismaRectangular from "./solids/PrismaRectangular.js";
import Tetraedro from "./solids/Tetraedro.js";
import Toro from "./solids/Toro.js";


window.addEventListener("load", function(evt) {
    // se obtiene una referencia al canvas
    let canvas = document.getElementById("the_canvas");

    // se obtiene una referencia al contexto de render de WebGL
    const gl = canvas.getContext("webgl");

    let draw_light = document.getElementById("draw_light");

    // si el navegador no soporta WebGL la variable gl no está definida
    if (!gl) throw "WebGL no soportado";

    // se obtiene una referencia al elemento con id="2d-vertex-shader" que se encuentra en el archivo index.html
    let vertexShaderSource = document.getElementById("2d-vertex-shader").text;
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

    //Referencia al script que representa el shader de fragmentos con iluminacion difusa
    let fragmentShaderSource = document.getElementById("2d-fragment-shader").text;
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    //Referencia al script que representa el shader de vertices con iluminacion especular
    let vertexShaderSourceSpec = document.getElementById("2d-vertex-shader-spec").text;
    let vertexShaderSpec = createShader(gl, gl.VERTEX_SHADER, vertexShaderSourceSpec);

    //Referencia al script que representa el shader de fragmentos con iluminacion especular
    let fragmentShaderSourceSpec = document.getElementById("2d-fragment-shader-spec").text;
    let fragmentShaderSpec = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceSpec);

    //Variable que guarda la referencia a la checkbox con etiqueta especular
    let shaderCB = this.document.getElementById("spec_ckbx");

    //Instruccion que ejecutará la funcion change view cada vez que se active o desactive la checkbox
    shaderCB.addEventListener("change", changeView, false);

    // se crea el programa que se enviara a la tarjeta de video, el cual está compuesto por los dos shader que se crearon anteriormente
    let program = createProgram(gl, vertexShader, fragmentShader);
    let programSpec = createProgram(gl, vertexShaderSpec, fragmentShaderSpec);

    // se construye una referencia a los attributos definidos en el shader de iluminacion difusa
    let shader_locations = {
        positionAttribute: gl.getAttribLocation(program, "a_position"),
        colorAttribute: gl.getAttribLocation(program, "a_color"),
        normalAttribute: gl.getAttribLocation(program, "a_normal"),

        lightPosition: gl.getUniformLocation(program, "u_light_position"),
        PVM_matrix: gl.getUniformLocation(program, "u_PVM_matrix"),
        VM_matrix: gl.getUniformLocation(program, "u_VM_matrix")
    }

    // se construye una referencia a los attributos definidos en el shader de iluminacion especular
    let shader_locations_spec = {
        positionAttribute: gl.getAttribLocation(programSpec, "a_position"),
        colorAttribute: gl.getAttribLocation(programSpec, "a_color"),
        normalAttribute: gl.getAttribLocation(programSpec, "a_normal"),

        ambientColor: gl.getUniformLocation(programSpec, "u_ambient_color"),
        lightPosition: gl.getUniformLocation(programSpec, "u_light_position"),
        lightColor: gl.getUniformLocation(programSpec, "u_light_color"),
        shininess: gl.getUniformLocation(programSpec, "u_shininess"),

        PVM_matrix: gl.getUniformLocation(programSpec, "u_PVM_matrix"),
        VM_matrix: gl.getUniformLocation(programSpec, "u_VM_matrix")
    }

    // se crean y posicionan los modelos geométricos, uno de cada tipo
    let geometry = [

        new Cilindro(
            gl, [1, 0, 0, 1],
            2, 2, 16, 16,
            Matrix4.translate(new Vector3(-5, 0, -5))
        ),
        new Cono(
            gl, [0, 1, 0, 1],
            2, 2, 16, 16,
            Matrix4.translate(new Vector3(0, 0, -5))
        ),
        new Dodecaedro(
            gl, [0, 0, 1, 1],
            2,
            Matrix4.translate(new Vector3(5, 0, -5))
        ),
        new Esfera(
            gl, [0, 1, 1, 1],
            2, 16, 16,
            Matrix4.translate(new Vector3(-5, 0, 0))
        ),
        new Icosaedro(gl, [1, 0, 1, 1],
            2,
            Matrix4.translate(new Vector3(0, 0, 0))
        ),
        new Octaedro(
            gl, [1, 1, 0, 1],
            2,
            Matrix4.translate(new Vector3(5, 0, 0))
        ),
        new PrismaRectangular(
            gl, [1, 0.2, 0.3, 1],
            2, 3, 4,
            Matrix4.translate(new Vector3(-5, 0, 5))
        ),
        new Tetraedro(
            gl, [0.5, 0.5, 0.5, 1],
            2,
            Matrix4.translate(new Vector3(0, 0, 5))
        ),
        new Toro(
            gl, [0.25, 0.25, 0.25, 1],
            4, 1, 16, 16,
            Matrix4.translate(new Vector3(5, 0, 5))
        ),
    ];

    // se define la posición de la cámara (o el observador o el ojo)
    let camera = new Vector3(0, 11, 7);
    // se define la posición del centro de interés, hacia donde observa la cámara
    let coi = new Vector3(0, 0, 0);
    // se crea una matriz de cámara (o vista)
    let viewMatrix = Matrix4.lookAt(camera, coi, new Vector3(0, 1, 0));

    // se construye la matriz de proyección en perspectiva
    let projectionMatrix = Matrix4.perspective(75 * Math.PI / 180, canvas.width / canvas.height, 1, 2000);

    // Se define el arreglo que contiene la posicion de la luz
    let lightPos = [0, 3, 0, 0.5];

    // Se definen las instrucciones para generar la luz en le canvas
    let lightPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lightPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lightPos), gl.STATIC_DRAW);

    // se le indica a WebGL cual es el tamaño de la ventana donde se despliegan los gráficos
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // se limpia la pantalla con un color negro transparente
    gl.clearColor(0, 0, 0, 0);
    // se limpian tanto el buffer de color, como el buffer de profundidad

    // se activa la prueba de profundidad, esto hace que se utilice el buffer de profundidad para determinar que píxeles se dibujan y cuales se descartan
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // se le indica a WebGL que programa debe utilizar
    // recordando, un programa en este contexto es una pareja compuesta por un shader de vértices y uno de fragmentos
    //gl.useProgram(program);

    // instruccion que revisa si la checkbox esta activa o no
    if (shaderCB.checked) {

        // se genera una instancia del programa del shader
        gl.useProgram(programSpec);

        // se definen los valores de los atributos del shader de iluminacion especular
        gl.uniform3fv(shader_locations_spec.ambientColor, [0.2, 0.2, 0.2]);
        gl.uniform3fv(shader_locations_spec.lightColor, [1, 1, 1]);
        gl.uniform1f(shader_locations_spec.shininess, 10);

        // ciclo que dibujara las figuras almacenadas en el arreglo geometry
        for (let i = 0; i < geometry.length; i++) {
            // se dibuja la geometría
            geometry[i].draw(
                gl, shader_locations_spec, lightPos, viewMatrix, projectionMatrix
            );
        }

        // impresion en consola de la palabra Specular
        console.log("Specular");
    } else {

        // se genera una instancia del programa del shader
        gl.useProgram(program);

        // ciclo que dibujara las figuras almacenadas en el arreglo geometry
        for (let i = 0; i < geometry.length; i++) {
            // se dibuja la geometría
            geometry[i].draw(
                gl, shader_locations, lightPos, viewMatrix, projectionMatrix
            );
        }
        // impresion en consola de la palabra Difusa
        console.log("Difusa");
    }

    function changeView() {
        if (shaderCB.checked) {

            // se genera una instancia del programa del shader
            gl.useProgram(programSpec);

            // se definen los valores de los atributos del shader de iluminacion especular
            gl.uniform3fv(shader_locations_spec.ambientColor, [0.2, 0.2, 0.2]);
            gl.uniform3fv(shader_locations_spec.lightColor, [1, 1, 1]);
            gl.uniform1f(shader_locations_spec.shininess, 10);

            // ciclo que dibujara las figuras almacenadas en el arreglo geometry
            for (let i = 0; i < geometry.length; i++) {
                // se dibuja la geometría
                geometry[i].draw(
                    gl, shader_locations_spec, lightPos, viewMatrix, projectionMatrix
                );
            }

            // impresion en consola de la palabra Specular
            console.log("Specular");
        } else {

            // se genera una instancia del programa del shader
            gl.useProgram(program);

            // ciclo que dibujara las figuras almacenadas en el arreglo geometry
            for (let i = 0; i < geometry.length; i++) {
                // se dibuja la geometría
                geometry[i].draw(
                    gl, shader_locations, lightPos, viewMatrix, projectionMatrix
                );
            }

            // impresion en consola de la palabra Difusa
            console.log("Difusa");
        }
    }
});


//////////////////////////////////////////////////////////
// Funciones de utilería para la construcción de shaders
//////////////////////////////////////////////////////////
/**
 * Función que crear un shader, dado un contexto de render, un tipo y el código fuente
 */
function createShader(gl, type, source) {
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
 * Función que toma un shader de vértices con uno de fragmentos y construye un programa
 */

function createProgram(gl, vertexShader, fragmentShader) {
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
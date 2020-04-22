// Se importan las clases a utilizar
import Vector3 from "./maths_CG/Vector3.js";
import Matrix4 from "./maths_CG/Matrix4.js";

import Cilindro from "./ejemplo_figuras/Cilindro.js";
import Cono from "./ejemplo_figuras/Cono.js";
/*import Dodecaedro from "./Dodecaedro.js";*/
import Esfera from "./ejemplo_figuras/Esfera.js";
import Icosaedro from "./ejemplo_figuras/Icosaedro.js";
import Octaedro from "./ejemplo_figuras/Octaedro.js";
import PrismaRectangular from "./ejemplo_figuras/PrismaRectangular.js";
import Tetraedro from "./ejemplo_figuras/Tetraedro.js";
/*import Toro from "./Toro.js";*/

window.addEventListener("load", function(evt) {
    // se obtiene una referencia al canvas
    let canvas = document.getElementById("the_canvas");

    // se obtiene una referencia al contexto de render de WebGL
    const gl = canvas.getContext("webgl");

    // si el navegador no soporta WebGL la variable gl no está definida
    if (!gl) throw "WebGL no soportado";

    // se obtiene una referencia al elemento con id="2d-vertex-shader" que se encuentra en el archivo index.html
    let vertexShaderSource = document.getElementById("2d-vertex-shader").text;
    // con el contenido leído, se crea un shader utilizando la función de utilería "createShader"
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

    // se obtiene una referencia al elemento con id="2d-fragment-shader" que se encuentra en el archivo index.html
    let fragmentShaderSource = document.getElementById("2d-fragment-shader").text;
    // con el contenido leído, se crea un shader utilizando la función de utilería "createShader"
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // se crea el programa que se enviara a la tarjeta de video, el cual está compuesto por los dos shader que se crearon anteriormente
    let program = createProgram(gl, vertexShader, fragmentShader);

    // se construye una referencia al attribute "a_position" definido en el shader
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let colorUniformLocation = gl.getUniformLocation(program, "u_color");
    let PVM_matrixLocation = gl.getUniformLocation(program, "u_PVM_matrix");

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
        /*
                                new Dodecaedro(
                                    gl, [0, 0, 1, 1],
                                    2,
                                    Matrix4.translate(new Vector3(5, 0, -5))
                                ),*/
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
        /*
                                        new Toro(
                                            gl, [0.25, 0.25, 0.25, 1],
                                            4, 1, 16, 16,
                                            Matrix4.translate(new Vector3(5, 0, 5))
                                        ),*/
    ];

    // se activa la prueba de profundidad, esto hace que se utilice el buffer de profundidad para determinar que píxeles se dibujan y cuales se descartan
    gl.enable(gl.DEPTH_TEST);

    // se define la posición de la cámara (o el observador o el ojo)
    let camera = new Vector3(0, 11, 7);
    // se define la posición del centro de interés, hacia donde observa la cámara
    let coi = new Vector3(0, 0, 0);
    // se crea una matriz de cámara (o vista)
    let viewMatrix = Matrix4.lookAt(camera, coi, new Vector3(0, 1, 0));

    // se construye la matriz de proyección en perspectiva
    let projectionMatrix = Matrix4.perspective(75 * Math.PI / 180, canvas.width / canvas.height, 1, 2000);

    // se define una matriz que combina las transformaciones de la vista y de proyección
    let viewProjectionMatrix = Matrix4.multiply(projectionMatrix, viewMatrix);


    // se le indica a WebGL cual es el tamaño de la ventana donde se despliegan los gráficos
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // se limpia la pantalla con un color negro transparente
    gl.clearColor(0, 0, 0, 0);
    // se limpian tanto el buffer de color, como el buffer de profundidad
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // se le indica a WebGL que programa debe utilizar
    // recordando, un programa en este contexto es una pareja compuesta por un shader de vértices y uno de fragmentos
    gl.useProgram(program);

    // se itera sobre cada objeto geométrico definido
    for (let i = 0; i < geometry.length; i++) {
        // se dibuja la geometría
        geometry[i].draw(
            gl, // referencia al contexto de render de WebGL
            positionAttributeLocation, // referencia a attribute vec4 a_position;
            colorUniformLocation, // referencia a uniform vec4 u_color;
            PVM_matrixLocation, // referencia a uniform mat4 u_PVM_matrix;
            viewProjectionMatrix // la matriz de transformación de la vista y proyección
        );
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
}
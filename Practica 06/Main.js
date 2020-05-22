// Se importan las clases a utilizar
import Vector3 from "./maths_CG/Vector3.js";
import Matrix4 from "./maths_CG/Matrix4.js";

import Camara from "./camara/TrackballCamera.js";
import ImageLoader from "./imageloader/ImageLoader.js";

import Cilindro from "./solids/Cilindro.js";
import Cono from "./solids/Cono.js";
import Dodecaedro from "./solids/Dodecaedro.js";
import Esfera from "./solids/Esfera.js";
import Icosaedro from "./solids/Icosaedro.js";
import Octaedro from "./solids/Octaedro.js";
import PrismaRectangular from "./solids/PrismaRectangular.js";
import Tetraedro from "./solids/Tetraedro.js";
import Toro from "./solids/Toro.js";


window.addEventListener("load", function() {
    //let shaderCB = this.document.getElementById("spec_ckbx");
    ImageLoader.load(
        [
            "./texturas/Cono.png",
            "./texturas/Dodecaedro.png",
            "./texturas/Esfera.png",
            "./texturas/Icosaedro.png",
            "./texturas/Octaedro.png",
            "./texturas/Prisma Rectangular.png",
            "./texturas/Tetaedro.png",
            "./texturas/Toro.png",
            "./texturas/Cilindro.png",
        ],
        function() {
            // se obtiene una referencia al canvas
            let canvas = document.getElementById("the_canvas");

            // se obtiene una referencia al contexto de render de WebGL
            const gl = canvas.getContext("webgl");

            // si el navegador no soporta WebGL la variable gl no está definida
            if (!gl) throw "WebGL no soportado";

            // se obtiene una referencia al elemento con id="2d-vertex-shader" que se encuentra en el archivo index.html
            let vertexShaderSource = document.getElementById("2d-vertex-shader").text;
            let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

            //Referencia al script que representa el shader de fragmentos con iluminacion difusa
            let fragmentShaderSource = document.getElementById("2d-fragment-shader").text;
            let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

            //Variable que guarda la referencia a la checkbox con etiqueta especular
            //let shaderCB = this.document.getElementById("spec_ckbx");

            //Instruccion que ejecutará la funcion change view cada vez que se active o desactive la checkbox
            //shaderCB.addEventListener("change", changeView, false);

            // se crea el programa que se enviara a la tarjeta de video, el cual está compuesto por los dos shader que se crearon anteriormente
            let program = createProgram(gl, vertexShader, fragmentShader);


            // se construye una referencia a los attributos definidos en el shader de iluminacion difusa
            let shader_locations = {
                positionAttribute: gl.getAttribLocation(program, "a_position"),
                colorAttribute: gl.getAttribLocation(program, "a_color"),
                normalAttribute: gl.getAttribLocation(program, "a_normal"),

                texcoordAttribute: gl.getAttribLocation(program, "a_texcoord"),

                lightPosition: gl.getUniformLocation(program, "u_light_position"),
                PVM_matrix: gl.getUniformLocation(program, "u_PVM_matrix"),
                VM_matrix: gl.getUniformLocation(program, "u_VM_matrix"),


            }

            // se crean y posicionan los modelos geométricos, uno de cada tipo
            let geometry = [

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
                new Cilindro(
                    gl, [1, 0, 0, 1],
                    2, 2, 16, 16,
                    Matrix4.translate(new Vector3(-5, 0, -5))
                ),
            ];

            /* let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                ImageLoader.getImage("./texturas/Prisma Rectangular.png")
            );
            gl.generateMipmap(gl.TEXTURE_2D); */

            // se limpia la pantalla con un color negro transparente
            gl.clearColor(0, 0, 0, 0);

            // se activa la prueba de profundidad, esto hace que se utilice el buffer de profundidad para determinar que píxeles se dibujan y cuales se descartan
            gl.enable(gl.DEPTH_TEST);

            // se define la posición de la cámara (o el observador o el ojo)
            //let camera = new Vector3(0, 11, 7);

            let camera = new Camara(new Vector3(0, 11, 7), new Vector3(0, 0, 0), new Vector3(0, 1, 0));
            // se define la posición del centro de interés, hacia donde observa la cámara
            //let coi = new Vector3(0, 0, 0);
            // se crea una matriz de cámara (o vista)
            let viewMatrix = camera.getMatrix();

            // se construye la matriz de proyección en perspectiva
            let projectionMatrix = Matrix4.perspective(75 * Math.PI / 180, canvas.width / canvas.height, 1, 2000);

            // Se define el arreglo que contiene la posicion de la luz
            let lightPos = [0, 5, 0, 2];

            // Se definen las instrucciones para generar la luz en le canvas
            let lightPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, lightPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lightPos), gl.STATIC_DRAW);

            // se limpia la pantalla con un color negro transparente
            gl.clearColor(0, 0, 0, 0);

            // se activa la prueba de profundidad, esto hace que se utilice el buffer de profundidad para determinar que píxeles se dibujan y cuales se descartan
            gl.enable(gl.DEPTH_TEST);


            // se le indica a WebGL que programa debe utilizar
            // recordando, un programa en este contexto es una pareja compuesta por un shader de vértices y uno de fragmentos
            //gl.useProgram(program);

            // instruccion que revisa si la checkbox esta activa o no
            function draw() {
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                // se genera una instancia del programa del shader
                gl.useProgram(program);

                viewMatrix = camera.getMatrix();

                // ciclo que dibujara las figuras almacenadas en el arreglo geometry
                for (let i = 0; i < geometry.length; i++) {
                    let texture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.texImage2D(
                        gl.TEXTURE_2D,
                        0,
                        gl.RGBA,
                        gl.RGBA,
                        gl.UNSIGNED_BYTE,
                        ImageLoader.getImage(ImageLoader.imagelist[i])
                    );
                    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                    gl.generateMipmap(gl.TEXTURE_2D);


                    // se dibuja la geometría
                    geometry[i].draw(
                        gl, shader_locations, lightPos, texture, viewMatrix, projectionMatrix
                    );
                }

            }

            draw();


            let x = 0;
            let y = 0;

            /**
             * Manejador de eventos para cuando se presiona el botón del mouse dentro del canvas
             */
            canvas.addEventListener("mousedown", (evt) => {
                // se guarda la posición inicial del mouse
                //initial_mouse_position = getMousePositionInCanvas(evt);

                x = getMousePositionInCanvasX(evt);
                y = getMousePositionInCanvasY(evt);
                // se agrega un manejador del evento de movimiento del mouse al canvas 
                canvas.addEventListener("mousemove", mousemove);
            });

            /**
             * Manejador de eventos para cuando se libera el botón del mouse en cualquier parte de la ventana (window)
             */
            window.addEventListener("mouseup", (evt) => {
                // como se termina el movimiento del mouse, se actualizan los ángulos y la posición de la cámara
                camera.finishMove(x, y, getMousePositionInCanvasX(evt), getMousePositionInCanvasY(evt));
                // como se termina el movimiento del mouse, se elimina el manejador del evento de movimiento del mouse del canvas
                canvas.removeEventListener("mousemove", mousemove);
                //initial_mouse_position = null;
                x = null;
                y = null;
            });

            /**
             * Función que se encarga de llamar la función de rotación de la cámara, y redibuja la escena
             */
            function mousemove(evt) {
                camera.rotate(x, y, getMousePositionInCanvasX(evt), getMousePositionInCanvasY(evt));
                draw();
            }

            /**
             * Función que obtiene las coordenadas del mouse
             */
            /* function getMousePositionInCanvas(evt) {
                // la función getBoundingClientRect permite obtener un objeto que tiene la posición y dimensiones del elemento desde el cual se llamo; esto es necesario para considerar la posición en la que se puede encontrar el canvas, ya que no siempre esta en el origen de la pantalla
                const rect = canvas.getBoundingClientRect();

                // las variables clientX y clientY tiene la posición del mouse respecto al origen de la pantalla, y para obtener las coordenadas dentro del canvas se debe restar la posición del elemento
                const x = evt.clientX - rect.left;
                const y = evt.clientY - rect.top;
                return { x: x, y: y };
            } */

            function getMousePositionInCanvasX(evt) {
                // la función getBoundingClientRect permite obtener un objeto que tiene la posición y dimensiones del elemento desde el cual se llamo; esto es necesario para considerar la posición en la que se puede encontrar el canvas, ya que no siempre esta en el origen de la pantalla
                const rect = canvas.getBoundingClientRect();

                // las variables clientX tiene la posición del mouse respecto al origen de la pantalla, y para obtener las coordenadas dentro del canvas se debe restar la posición del elemento
                const x = evt.clientX - rect.left;

                return x;
            }

            function getMousePositionInCanvasY(evt) {
                // la función getBoundingClientRect permite obtener un objeto que tiene la posición y dimensiones del elemento desde el cual se llamo; esto es necesario para considerar la posición en la que se puede encontrar el canvas, ya que no siempre esta en el origen de la pantalla
                const rect = canvas.getBoundingClientRect();

                // las variables clientY tiene la posición del mouse respecto al origen de la pantalla, y para obtener las coordenadas dentro del canvas se debe restar la posición del elemento
                const y = evt.clientY - rect.top;
                return y;
            }
        }
    )
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
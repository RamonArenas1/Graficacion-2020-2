// Se importan las clases a utilizar
import Vector3 from "./maths_CG/Vector3.js";
import Matrix4 from "./maths_CG/Matrix4.js";

import Camara from "./camara/Camera.js";
import ImageLoader from "./imageloader/ImageLoader.js";

import Puerta from "./solids/Puerta.js";
import Perilla from "./solids/Perilla.js";
import Cuarto from "./solids/Cuarto.js";
import Marco from "./solids/Marco.js";
import ParedBaja from "./solids/ParedBaja.js";
import Pared from "./solids/Pared.js";
import ParedAlta from "./solids/ParedAlta.js";
import Piso from "./solids/Piso.js";

/**
 * Varibales que controlan el tiempo para realizar el render de la escena
 * */
var last_frame = 0.0;
var delta_time = 0.0;

window.addEventListener("load", function() {
    ImageLoader.load(
        [
            "./texturas/Puerta.png",
            "./texturas/Perilla.png",
            "./texturas/Cuarto.png",
            "./texturas/Marco.png",
            "./texturas/Pared Baja.png",
            "./texturas/Piso.jpg",
        ],
        function() {
            // se obtiene una referencia al canvas
            let canvas = document.getElementById("the_canvas");

            //canvas.width  = window.innerWidth;
            //canvas.height = window.innerHeight;

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
            let cuartos = [
                /******  Cuarto Completo 1 ******/
                //Puertas
                new Puerta(
                    gl, Matrix4.translate(new Vector3(-7.5, 3.8132, 0))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.translate(new Vector3(-7.018, 3.125, -1.2722))
                ),
                // Cuartos
                new Cuarto(
                    gl, Matrix4.translate(new Vector3(-19.102, 5, 0))
                ),
                // Marcos de Puertas
                new Marco(
                    gl, Matrix4.translate(new Vector3(-7.5, 4, 0))
                ),
                // Paredes Bajas
                new ParedBaja(
                    gl, Matrix4.translate(new Vector3(-7.4, 1.75, 6))
                ),
                new ParedBaja(
                    gl, Matrix4.translate(new Vector3(-7.4, 1.75, -6))
                ),
                // Paredes
                new Pared(
                    gl, Matrix4.translate(new Vector3(-7.5, 6.8, 6))
                ),
                new Pared(
                    gl, Matrix4.translate(new Vector3(-7.5, 6.8, -6))
                ),
                // Paredes Altas
                new ParedAlta(
                    gl, Matrix4.translate(new Vector3(-7.5, 9, 0))
                ),



                /******  Cuarto Completo 2 ******/
                //Puertas
                new Puerta(
                    gl, Matrix4.translate(new Vector3(-7.5, 3.8132, -20))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.translate(new Vector3(-7.018, 3.125, -21.2722))
                ),
                // Cuartos
                new Cuarto(
                    gl, Matrix4.translate(new Vector3(-19.102, 5, -20))
                ),
                // Marcos de Puertas
                new Marco(
                    gl, Matrix4.translate(new Vector3(-7.5, 4, -20))
                ),
                // Paredes Bajas
                new ParedBaja(
                    gl, Matrix4.translate(new Vector3(-7.4, 1.75, -26))
                ),
                new ParedBaja(
                    gl, Matrix4.translate(new Vector3(-7.4, 1.75, -14))
                ),
                // Paredes
                new Pared(
                    gl, Matrix4.translate(new Vector3(-7.5, 6.8, -26))
                ),
                new Pared(
                    gl, Matrix4.translate(new Vector3(-7.5, 6.8, -14))
                ),
                // Paredes Altas
                new ParedAlta(
                    gl, Matrix4.translate(new Vector3(-7.5, 9, -20))
                ),


                /******  Cuarto Completo 3 ******/
                //Puertas
                new Puerta(
                    gl, Matrix4.translate(new Vector3(-7.5, 3.8132, -40))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.translate(new Vector3(-7.018, 3.125, -41.2722))
                ),
                // Cuartos
                new Cuarto(
                    gl, Matrix4.translate(new Vector3(-19.102, 5, -40))
                ),
                // Marcos de Puertas
                new Marco(
                    gl, Matrix4.translate(new Vector3(-7.5, 4, -40))
                ),
                // Paredes Bajas
                new ParedBaja(
                    gl, Matrix4.translate(new Vector3(-7.4, 1.75, -46))
                ),
                new ParedBaja(
                    gl, Matrix4.translate(new Vector3(-7.4, 1.75, -34))
                ),
                // Paredes
                new Pared(
                    gl, Matrix4.translate(new Vector3(-7.5, 6.8, -46))
                ),
                new Pared(
                    gl, Matrix4.translate(new Vector3(-7.5, 6.8, -34))
                ),
                // Paredes Altas
                new ParedAlta(
                    gl, Matrix4.translate(new Vector3(-7.5, 9, -40))
                ),


                /******  Cuarto Completo 4 ******/
                //Puertas
                new Puerta(
                    gl, Matrix4.translate(new Vector3(-7.5, 3.8132, -60))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.translate(new Vector3(-7.018, 3.125, -61.2722))
                ),
                // Cuartos
                new Cuarto(
                    gl, Matrix4.translate(new Vector3(-19.102, 5, -60))
                ),
                // Marcos de Puertas
                new Marco(
                    gl, Matrix4.translate(new Vector3(-7.5, 4, -60))
                ),
                // Paredes Bajas
                new ParedBaja(
                    gl, Matrix4.translate(new Vector3(-7.4, 1.75, -66))
                ),
                new ParedBaja(
                    gl, Matrix4.translate(new Vector3(-7.4, 1.75, -54))
                ),
                // Paredes
                new Pared(
                    gl, Matrix4.translate(new Vector3(-7.5, 6.8, -66))
                ),
                new Pared(
                    gl, Matrix4.translate(new Vector3(-7.5, 6.8, -54))
                ),
                // Paredes Altas
                new ParedAlta(
                    gl, Matrix4.translate(new Vector3(-7.5, 9, -60))
                ),


                /******  Cuarto Completo 5 ******/
                //Puertas
                new Puerta(
                    gl, Matrix4.translate(new Vector3(-7.5, 3.8132, -80))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.translate(new Vector3(-7.018, 3.125, -81.2722))
                ),
                // Cuartos
                new Cuarto(
                    gl, Matrix4.translate(new Vector3(-19.102, 5, -80))
                ),
                // Marcos de Puertas
                new Marco(
                    gl, Matrix4.translate(new Vector3(-7.5, 4, -80))
                ),
                // Paredes Bajas
                new ParedBaja(
                    gl, Matrix4.translate(new Vector3(-7.4, 1.75, -86))
                ),
                new ParedBaja(
                    gl, Matrix4.translate(new Vector3(-7.4, 1.75, -74))
                ),
                // Paredes
                new Pared(
                    gl, Matrix4.translate(new Vector3(-7.5, 6.8, -86))
                ),
                new Pared(
                    gl, Matrix4.translate(new Vector3(-7.5, 6.8, -74))
                ),
                // Paredes Altas
                new ParedAlta(
                    gl, Matrix4.translate(new Vector3(-7.5, 9, -80))
                ),
            ];

            let cuartosInv = [
                /******  Cuarto Completo 1 ******/
                //Puertas
                new Puerta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 3.8132, 0)))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.018, 3.125, -1.2722)))
                ),
                // Cuartos
                new Cuarto(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-19.102, 5, 0)))
                ),
                // Marcos de Puertas
                new Marco(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 4, 0)))
                ),
                // Paredes Bajas
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.4, 1.75, 6)))
                ),
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.4, 1.75, -6)))
                ),
                // Paredes
                new Pared(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 6.8, 6)))
                ),
                new Pared(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 6.8, -6)))
                ),
                // Paredes Altas
                new ParedAlta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 9, 0)))
                ),



                /******  Cuarto Completo 2 ******/
                //Puertas
                new Puerta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 3.8132, 20)))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.018, 3.125, 21.2722)))
                ),
                // Cuartos
                new Cuarto(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-19.102, 5, 20)))
                ),
                // Marcos de Puertas
                new Marco(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 4, 20)))
                ),
                // Paredes Bajas
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.4, 1.75, 26)))
                ),
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.4, 1.75, 14)))
                ),
                // Paredes
                new Pared(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 6.8, 26)))
                ),
                new Pared(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 6.8, 14)))
                ),
                // Paredes Altas
                new ParedAlta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 9, 20)))
                ),


                /******  Cuarto Completo 3 ******/
                //Puertas
                new Puerta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 3.8132, 40)))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.018, 3.125, 41.2722)))
                ),
                // Cuartos
                new Cuarto(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-19.102, 5, 40)))
                ),
                // Marcos de Puertas
                new Marco(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 4, 40)))
                ),
                // Paredes Bajas
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.4, 1.75, 46)))
                ),
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.4, 1.75, 34)))
                ),
                // Paredes
                new Pared(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 6.8, 46)))
                ),
                new Pared(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 6.8, 34)))
                ),
                // Paredes Altas
                new ParedAlta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 9, 40)))
                ),

                /******  Cuarto Completo 4 ******/
                //Puertas
                new Puerta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 3.8132, 60)))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.018, 3.125, 61.2722)))
                ),
                // Cuartos
                new Cuarto(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-19.102, 5, 60)))
                ),
                // Marcos de Puertas
                new Marco(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 4, 60)))
                ),
                // Paredes Bajas
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.4, 1.75, 66)))
                ),
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.4, 1.75, 54)))
                ),
                // Paredes
                new Pared(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 6.8, 66)))
                ),
                new Pared(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 6.8, 54)))
                ),
                // Paredes Altas
                new ParedAlta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 9, 60)))
                ),



                /******  Cuarto Completo 5 ******/
                //Puertas
                new Puerta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 3.8132, 80)))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.018, 3.125, 81.2722)))
                ),
                // Cuartos
                new Cuarto(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-19.102, 5, 80)))
                ),
                // Marcos de Puertas
                new Marco(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 4, 80)))
                ),
                // Paredes Bajas
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.4, 1.75, 86)))
                ),
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.4, 1.75, 74)))
                ),
                // Paredes
                new Pared(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 6.8, 86)))
                ),
                new Pared(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 6.8, 74)))
                ),
                // Paredes Altas
                new ParedAlta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 9, 80)))
                ),
            ];

            let cuartoFinal = [
                /******** Cuarto Final **********/
                // Puerta
                new Puerta(
                    gl, Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-90, 3.8132, 0)))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-89.5222, 3.125, -1.1)))
                ),
                // Cuarto
                new Cuarto(
                    gl, Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-100.8, 5, 0)))
                ),
                // Marcos de Puertas
                new Marco(
                    gl, Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-90, 4, 0)))
                ),
                // Piso
                new Piso(
                    gl, Matrix4.translate(new Vector3(0, 0, 0))
                ),
                // Paredes Bajas
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-90, 1.75, -4.75))), Matrix4.scale(new Vector3(1, 1, .675)))
                ),
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-90, 1.75, 4.75))), Matrix4.scale(new Vector3(1, 1, .675)))
                ),
                // Paredes Altas
                new ParedAlta(
                    gl, Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-90, 9, 0)))
                ),
                // Paredes
                new Pared(
                    gl, Matrix4.multiply(Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-90, 6.8, -4.75))), Matrix4.scale(new Vector3(1, 1, .7125)))
                ),
                new Pared(
                    gl, Matrix4.multiply(Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-90, 6.8, 4.75))), Matrix4.scale(new Vector3(1, 1, .7125)))
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
            let camera = new Camara(new Vector3(0, 5, 15), new Vector3(0, 5, 5), new Vector3(0, 1, 0));

            // se crea una matriz de cámara (o vista)
            let viewMatrix = camera.getMatrix();

            // se construye la matriz de proyección en perspectiva
            let projectionMatrix = Matrix4.perspective(75 * Math.PI / 180, canvas.width / canvas.height, 1, 2000);

            // Se define el arreglo que contiene la posicion de la luz
            let lightPos = [0, 9.9, 0, .5];

            // Se definen las instrucciones para generar la luz en le canvas
            /* let lightPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, lightPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lightPos), gl.STATIC_DRAW); */

            // se limpia la pantalla con un color negro transparente
            gl.clearColor(0, 0, 0, 0);

            // se activa la prueba de profundidad, esto hace que se utilice el buffer de profundidad para determinar que píxeles se dibujan y cuales se descartan
            gl.enable(gl.DEPTH_TEST);


            // se le indica a WebGL que programa debe utilizar
            // recordando, un programa en este contexto es una pareja compuesta por un shader de vértices y uno de fragmentos
            //gl.useProgram(program);

            // instruccion que revisa si la checkbox esta activa o no
            function draw(current_frame) {
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                // se genera una instancia del programa del shader
                gl.useProgram(program);

                delta_time = current_frame - last_frame;
                last_frame = delta_time;

                //camera.speed = 0.00005* delta_time;

                viewMatrix = camera.getMatrix();

                // ciclo que dibujara las figuras almacenadas en el arreglo cuartos
                for (let i = 0; i < cuartos.length; i++) {
                    // se dibuja la geometría
                    cuartos[i].draw(
                        gl, shader_locations, lightPos, viewMatrix, projectionMatrix
                    );
                }
                for (let i = 0; i < cuartosInv.length; i++) {
                    // se dibuja la geometría
                    cuartosInv[i].draw(
                        gl, shader_locations, lightPos, viewMatrix, projectionMatrix
                    );
                }
                for (let i = 0; i < cuartoFinal.length; i++) {
                    // se dibuja la geometría
                    cuartoFinal[i].draw(
                        gl, shader_locations, lightPos, viewMatrix, projectionMatrix
                    );
                }
                console.log(camera.speed);
                requestAnimationFrame(draw); 
            }

            requestAnimationFrame(draw);

            let x = 0;
            let y = 0;


            window.onkeydown = function(ev){
                switch(ev.key){
                    case "w": {                    
                        camera.move("front");
                        break;
                    }
                    case "s": {                    
                        camera.move("back");
                        break;
                    }
                    case "d": {                    
                        camera.move("right");
                        break;
                    }
                    case "a": {                    
                        camera.move("left");
                        break;
                    }
                    case "g": {

                        camera.setPos(new Vector3 (0,5,15));
                        break;
                    }
                    case "p": {                    
                        camera.pause_mov = !camera.pause_mov;
                        break;
                    }
                }    
            }

            canvas.onmousemove = function(ev){

                let posx = ev.clientX;
                let posy = canvas.height-ev.clientY;
                camera.moveCamera(ev,posx,posy);

                var x = ev.clientX;
                var y = ev.clientY;
                var coor = "Coordinates: (" + x + "," + y + ")";
                document.getElementById("demo").innerHTML = coor;
            }


            canvas.onmouseout = function(ev) {
                document.getElementById("demo").innerHTML = "";
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



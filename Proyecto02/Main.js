// Se importan las clases a utilizar
import Vector3 from "./maths_CG/Vector3.js";
import Vector4 from "./maths_CG/Vector4.js";
import Matrix4 from "./maths_CG/Matrix4.js";

import Camara from "./camara/Camera.js";
import ImageLoader from "./imageloader/ImageLoader.js";

import Puerta from "./solids/Puerta.js";
import Perilla from "./solids/Perilla.js";
import Cuarto from "./solids/Cuarto.js";
import CuartoD from "./solids/CuartoD.js";
import CuartoInicio from "./solids/CuartoInicio.js";
import Marco from "./solids/Marco.js";
import ParedBaja from "./solids/ParedBaja.js";
import Pared from "./solids/Pared.js";
import ParedAlta from "./solids/ParedAlta.js";
import Frente from "./solids/Frente.js";
import Meteoro from "./solids/Meteoro.js";

import Piso from "./solids/Piso.js";

import Foco from "./solids/Foco.js";

import Skybox from "./solids/Skybox.js";
import Imagenes from "./solids/Imagenes.js";

/**
 * Varibales que controlan el tiempo para realizar el render de la escena
 * */
var last_frame = 0.0;
var delta_time = 0.0;

//Variables para cambiar de camara y de proyeccion
var actual_camera = true;
var actual_projection = true;

//Variables para activar la camara tour
var camera_in_tour = false;
var fase = 0;
var degrees_count = 0;
var first_door = false

//variables para la apertura de puertas
var doors_in_move = false;
var open = -1;
var doors_count = 0;

// variable para pausar el movimiento
var pause_mov = false;

// variables para el manejo de movimientos en curvas de bezier
//Inicializamos la variable del tiempo t para calcular las posiciones 
//con t in [0,1] 
var t = 0;
var c = 0; //Contador auxiliar 

let lastTime = Date.now();
let current = 0;
let elapsed = 0;
let max_elapsed_wait = 30 / 1000;
let time_step = 0.1;
let counter_time = 10000;


window.addEventListener("load", function() {
    ImageLoader.load(
        [
            "./texturas/Puerta.png",
            "./texturas/Perilla.jpg",
            "./texturas/Pared Baja.png",
            "./texturas/Cuarto.png",
            "./texturas/CuartoDentro.jpg",
            "./texturas/Piso_normal.jpg",
            "./texturas/Piso.jpg",
            "./texturas/skybox.png",
            "./texturas/Meteoro.png",

            "./texturas/imagen0.png",
            "./texturas/imagen1.png",
            "./texturas/imagen2.png",
            "./texturas/imagen3.png",
            "./texturas/imagen4.png",
            "./texturas/imagen5.png",
            "./texturas/imagen6.png",
            "./texturas/imagen7.png",
            "./texturas/imagen8.png",
            "./texturas/imagen9.png",
            "./texturas/imagen10.png",
        ],
        function() {
            // se obtiene una referencia al canvas y al contexto de webgl
            let canvas = document.getElementById("the_canvas");
            const gl = canvas.getContext("webgl");
            if (!gl) throw "WebGL no soportado";

            var raze = document.getElementById("ulti");

            // se obtiene una referencia al elemento con id="2d-vertex-shader" que se encuentra en el archivo index.html
            let vertexShaderSourceNM = document.getElementById("2d-vertex-shader-nm").text;
            let vertexShaderNM = createShader(gl, gl.VERTEX_SHADER, vertexShaderSourceNM);

            //Referencia al script que representa el shader de fragmentos con iluminacion difusa
            let fragmentShaderSourceNM = document.getElementById("2d-fragment-shader-nm").text;
            let fragmentShaderNM = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceNM);

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

            //Referencia al script que representa el shader de vertices con iluminacion especular
            let vertexShaderSourceReflect = document.getElementById("2d-vertex-shader-reflect").text;
            let vertexShaderReflect = createShader(gl, gl.VERTEX_SHADER, vertexShaderSourceReflect);

            //Referencia al script que representa el shader de fragmentos con iluminacion especular
            let fragmentShaderSourceReflect = document.getElementById("2d-fragment-shader-reflect").text;
            let fragmentShaderReflect = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceReflect);

            // se crea el programa que se enviara a la tarjeta de video, el cual está compuesto por los dos shader que se crearon anteriormente
            let programNM = createProgram(gl, vertexShaderNM, fragmentShaderNM);
            let program = createProgram(gl, vertexShader, fragmentShader);
            let programSpec = createProgram(gl, vertexShaderSpec, fragmentShaderSpec);
            let programReflect = createProgram(gl, vertexShaderReflect, fragmentShaderReflect);


            // Se limpia la pantalla con un color negro transparente y se activa l buffer de profundidad
            gl.clearColor(0, 0, 0, 0);
            gl.enable(gl.DEPTH_TEST);

            // se construye una referencia a los attributos definidos en el shader de iluminacion difusa
            let shader_locationsNM = {
                positionAttribute: gl.getAttribLocation(programNM, "a_position"), //
                texcoordAttribute: gl.getAttribLocation(programNM, "a_texcoord"), //
                normalAttribute: gl.getAttribLocation(programNM, "a_normal"), //

                // el vector tangente en cada vértice
                a_tangent: gl.getAttribLocation(programNM, "a_tangent"), //
                // el vector bitangente en cada vértice
                a_bitangent: gl.getAttribLocation(programNM, "a_bitangent"), //

                // la textura de color
                u_texture: gl.getUniformLocation(programNM, "u_texture"),
                // la textura de normales
                u_texture_normal: gl.getUniformLocation(programNM, "u_texture_normal"),

                // para poder enviar información a un arreglo, es necesario tener referencias a cada entrada del arreglo, consideren que en GLSL los arreglos tienen dimensiones fijas no como en JavaScript
                lightPosition: gl.getUniformLocation(programNM, "u_light_position"),

                // la posición de la cámara
                //u_camera_position: gl.getUniformLocation(programNM, "u_camera_position"),

                PVM_matrix: gl.getUniformLocation(programNM, "u_PVM_matrix"), //
                u_M_matrix: gl.getUniformLocation(programNM, "u_M_matrix"), //
            }

            let shader_locations = {
                positionAttribute: gl.getAttribLocation(program, "a_position"),
                colorAttribute: gl.getAttribLocation(program, "a_color"),
                normalAttribute: gl.getAttribLocation(program, "a_normal"),
                u_texture: gl.getUniformLocation(program, "u_texture"),

                ambient: gl.getUniformLocation(program, "u_ambient"),

                texcoordAttribute: gl.getAttribLocation(program, "a_texcoord"),

                lightPosition: gl.getUniformLocation(program, "u_light_position"),
                lightPosition: [
                    gl.getUniformLocation(program, "u_light_position[0]"),
                    gl.getUniformLocation(program, "u_light_position[1]"),
                    gl.getUniformLocation(program, "u_light_position[2]")
                ],
                PVM_matrix: gl.getUniformLocation(program, "u_PVM_matrix"),
                VM_matrix: gl.getUniformLocation(program, "u_VM_matrix"),

            }
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

            let shader_locations_reflect = {
                    positionAttribute: gl.getAttribLocation(programReflect, "a_position"),
                    colorAttribute: gl.getAttribLocation(programReflect, "a_color"),
                    normalAttribute: gl.getAttribLocation(programReflect, "a_normal"),
                    texcoordAttribute: gl.getAttribLocation(programReflect, "a_texcoord"),
                    u_texture: gl.getUniformLocation(programReflect, "u_texture"),

                    // la posición y la dirección de la luz
                    lightPosition: gl.getUniformLocation(programReflect, "u_light_position"),
                    lightDirection: gl.getUniformLocation(programReflect, "u_light_direction"),

                    PVM_matrix: gl.getUniformLocation(programReflect, "u_PVM_matrix"),
                    VM_matrix: gl.getUniformLocation(programReflect, "u_VM_matrix"),
                }
                // se crean y posicionan los modelos geométricos, uno de cada tipo
            let entradas = [
                /******  Cuarto Completo 1 ******/
                //Puertas 0
                new Puerta(
                    gl, Matrix4.translate(new Vector3(-7.5, 3.8132, 0))
                ),

                //Perillas 1
                new Perilla(
                    gl, Matrix4.translate(new Vector3(-7.018, 3.125, -1.2722))
                ),
                // entradas 2
                new Cuarto(
                    gl, Matrix4.translate(new Vector3(-17.3053, 5.0071, -0.030099))
                ),
                // 3
                new CuartoD(
                    gl, Matrix4.multiply(Matrix4.translate(new Vector3(-17.3053, 5.0071, -0.030099)), Matrix4.rotateY(180))
                ),
                // Marcos de Puertas 4
                new Marco(
                    gl, Matrix4.translate(new Vector3(-7.5, 4, 0))
                ),
                // Paredes Bajas 5
                new ParedBaja(
                    gl, Matrix4.translate(new Vector3(-7.4, 1.75, 6))
                ),
                // 6
                new ParedBaja(
                    gl, Matrix4.translate(new Vector3(-7.4, 1.75, -6))
                ),
                // Paredes 7
                new Pared(
                    gl, Matrix4.translate(new Vector3(-7.5, 6.8, 6))
                ),
                // 8
                new Pared(
                    gl, Matrix4.translate(new Vector3(-7.5, 6.8, -6))
                ),
                // Paredes Altas 9
                new ParedAlta(
                    gl, Matrix4.translate(new Vector3(-7.5, 9, 0))
                ),



                ///// ******  Cuarto Completo 2 ****** ////
                //Puertas 10 
                new Puerta(
                    gl, Matrix4.translate(new Vector3(-7.5, 3.8132, -20))
                ),
                //Perillas 11 
                new Perilla(
                    gl, Matrix4.translate(new Vector3(-7.018, 3.125, -21.2722))
                ),
                // entradas
                new Cuarto(
                    gl, Matrix4.translate(new Vector3(-17.3053, 5.0071, -20.030099))
                ),
                new CuartoD(
                    gl, Matrix4.multiply(Matrix4.translate(new Vector3(-17.3053, 5.0071, -20.030099)), Matrix4.rotateY(180))
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


                //// ******  Cuarto Completo 3 ****** ////
                //Puertas
                new Puerta(
                    gl, Matrix4.translate(new Vector3(-7.5, 3.8132, -40))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.translate(new Vector3(-7.018, 3.125, -41.2722))
                ),
                // entradas
                new Cuarto(
                    gl, Matrix4.translate(new Vector3(-17.3053, 5.0071, -40.030099))
                ),
                new CuartoD(
                    gl, Matrix4.multiply(Matrix4.translate(new Vector3(-17.3053, 5.0071, -40.030099)), Matrix4.rotateY(180))
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


                ////  ******  Cuarto Completo 4 ****** ////
                //Puertas
                new Puerta(
                    gl, Matrix4.translate(new Vector3(-7.5, 3.8132, -60))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.translate(new Vector3(-7.018, 3.125, -61.2722))
                ),
                // entradas
                new Cuarto(
                    gl, Matrix4.translate(new Vector3(-17.3053, 5.0071, -60.030099))
                ),
                new CuartoD(
                    gl, Matrix4.multiply(Matrix4.translate(new Vector3(-17.3053, 5.0071, -60.030099)), Matrix4.rotateY(180))
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


                //// ******  Cuarto Completo 5 ****** ////
                //Puertas
                new Puerta(
                    gl, Matrix4.translate(new Vector3(-7.5, 3.8132, -80))
                ),
                //Perillas
                new Perilla(
                    gl, Matrix4.translate(new Vector3(-7.018, 3.125, -81.2722))
                ),
                // entradas
                new Cuarto(
                    gl, Matrix4.translate(new Vector3(-17.3053, 5.0071, -80.030099))
                ),
                new CuartoD(
                    gl, Matrix4.multiply(Matrix4.translate(new Vector3(-17.3053, 5.0071, -80.030099)), Matrix4.rotateY(180))
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

            let entradasInv = [
                ////******  Cuarto Completo 1 ****** / ///
                //Puertas
                new Puerta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 3.8132, 0)))
                ),

                //Perillas
                new Perilla(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.018, 3.125, -1.2722)))
                ),
                // entradas
                new Cuarto(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-17.3053, 5.0071, -0.030099)))
                ),
                new CuartoD(
                    gl, Matrix4.multiply(Matrix4.rotateY(0), Matrix4.translate(new Vector3(17.3053, 5.0071, -0.030099)))
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



                //// ******  Cuarto Completo 2 ****** ////
                /// Puertas
                new Puerta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 3.8132, 20)))
                ),

                //Perillas
                new Perilla(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.018, 3.125, 21.2722)))
                ),
                // entradas
                new Cuarto(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-17.3053, 5.0071, 20 - 0.030099)))
                ),
                new CuartoD(
                    gl, Matrix4.multiply(Matrix4.rotateY(0), Matrix4.translate(new Vector3(17.3053, 5.0071, -20 - 0.030099)))
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


                //// ******  Cuarto Completo 3 ****** ////
                //Puertas
                new Puerta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 3.8132, 40)))
                ),

                //Perillas
                new Perilla(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.018, 3.125, 41.2722)))
                ),
                // entradas
                new Cuarto(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-17.3053, 5.0071, 40 - 0.030099)))
                ),
                new CuartoD(
                    gl, Matrix4.multiply(Matrix4.rotateY(0), Matrix4.translate(new Vector3(17.3053, 5.0071, -40 - 0.030099)))
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

                //// ******  Cuarto Completo 4 ****** ////
                //Puertas
                new Puerta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 3.8132, 60)))
                ),

                //Perillas
                new Perilla(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.018, 3.125, 61.2722)))
                ),
                // entradas
                new Cuarto(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-17.3053, 5.0071, 60 - 0.030099)))
                ),
                new CuartoD(
                    gl, Matrix4.multiply(Matrix4.rotateY(0), Matrix4.translate(new Vector3(17.3053, 5.0071, -60 - 0.030099)))
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



                //// ******  Cuarto Completo 5 ****** ////
                //Puertas
                new Puerta(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.5, 3.8132, 80)))
                ),

                //Perillas
                new Perilla(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-7.018, 3.125, 81.2722)))
                ),
                // entradas
                new Cuarto(
                    gl, Matrix4.multiply(Matrix4.rotateY(180), Matrix4.translate(new Vector3(-17.3053, 5.0071, 80 - 0.030099)))
                ),
                new CuartoD(
                    gl, Matrix4.multiply(Matrix4.rotateY(0), Matrix4.translate(new Vector3(17.3053, 5.0071, -80 - 0.030099)))
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

            let salida = [
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
                    gl, Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-99.8, 5.0071, 0)))
                ),
                new CuartoD(
                    gl, Matrix4.multiply(Matrix4.rotateY(-90), Matrix4.translate(new Vector3(99.8, 5.0071, 0)))
                ),
                // Marcos de Puertas
                new Marco(
                    gl, Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-90, 4, 0)))
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

            let pisos = [
                // Piso
                new Piso(
                    gl, Matrix4.translate(new Vector3(0, 0, 5))
                ),
                // Piso
                new Piso(
                    gl, Matrix4.translate(new Vector3(0, 0, -10))
                ),
                // Piso
                new Piso(
                    gl, Matrix4.translate(new Vector3(0, 0, -25))
                ),
                // Piso
                new Piso(
                    gl, Matrix4.translate(new Vector3(0, 0, -40))
                ),
                // Piso
                new Piso(
                    gl, Matrix4.translate(new Vector3(0, 0, -55))
                ),
                // Piso
                new Piso(
                    gl, Matrix4.translate(new Vector3(0, 0, -70))
                ),
                // Piso
                new Piso(
                    gl, Matrix4.translate(new Vector3(0, 0, -85))
                ),
            ];

            let focos = [
                // Focos
                new Foco(
                    gl, [0.956862, 0.968627, 0.035294, 1], Matrix4.multiply(Matrix4.translate(new Vector3(0, 9.65, 0)), Matrix4.scale(new Vector3(0.25, 0.25, 0.25)))
                ),
                new Foco(
                    gl, [0.956862, 0.968627, 0.335294, 1], Matrix4.multiply(Matrix4.translate(new Vector3(0, 9.65, -20)), Matrix4.scale(new Vector3(0.25, 0.25, 0.25)))
                ),
                new Foco(
                    gl, [0.956862, 0.968627, 0.535294, 1], Matrix4.multiply(Matrix4.translate(new Vector3(0, 9.65, -40)), Matrix4.scale(new Vector3(0.25, 0.25, 0.25)))
                ),
                new Foco(
                    gl, [0.956862, 0.968627, 0.735294, 1], Matrix4.multiply(Matrix4.translate(new Vector3(0, 9.65, -60)), Matrix4.scale(new Vector3(0.25, 0.25, 0.25)))
                ),
                new Foco(
                    gl, [0.956862, 0.968627, 0.935294, 1], Matrix4.multiply(Matrix4.translate(new Vector3(0, 9.65, -80)), Matrix4.scale(new Vector3(0.25, 0.25, 0.25)))
                ),
            ];

            let inicio = [
                new CuartoInicio(
                    gl, Matrix4.multiply(Matrix4.rotateY(0), Matrix4.translate(new Vector3(0, 5, 20.7)))
                ),
                new Frente(
                    gl, Matrix4.translate(new Vector3(0, 0, 10.2))
                ),
                // Marcos de Puertas
                new Marco(
                    gl, Matrix4.multiply(Matrix4.rotateY(-90), Matrix4.translate(new Vector3(-10, 4, 0)))
                ),
                // Paredes Bajas
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.multiply(Matrix4.rotateY(-90), Matrix4.translate(new Vector3(-10, 1.75, -4.75))), Matrix4.scale(new Vector3(1, 1, .675)))
                ),
                new ParedBaja(
                    gl, Matrix4.multiply(Matrix4.multiply(Matrix4.rotateY(-90), Matrix4.translate(new Vector3(-10, 1.75, 4.75))), Matrix4.scale(new Vector3(1, 1, .675)))
                ),
                // Paredes Altas
                new ParedAlta(
                    gl, Matrix4.multiply(Matrix4.rotateY(-90), Matrix4.translate(new Vector3(-10, 9, 0)))
                ),
                // Paredes
                new Pared(
                    gl, Matrix4.multiply(Matrix4.multiply(Matrix4.rotateY(-90), Matrix4.translate(new Vector3(-10, 6.8, -4.75))), Matrix4.scale(new Vector3(1, 1, .7125)))
                ),
                new Pared(
                    gl, Matrix4.multiply(Matrix4.multiply(Matrix4.rotateY(-90), Matrix4.translate(new Vector3(-10, 6.8, 4.75))), Matrix4.scale(new Vector3(1, 1, .7125)))
                ),

            ];

            let meteoro_cp1 = [
                new Vector3(10, 20, 5),
                new Vector3(0, 15, -10),
                new Vector3(-11, 10, -15)
            ];

            let meteoro_cp2 = [
                new Vector3(-10, 20, -20),
                new Vector3(0, 15, -35),
                new Vector3(11, 10, -40)
            ];

            let meteoro_cp3 = [
                new Vector3(10, 20, -60),
                new Vector3(0, 15, -120),
                new Vector3(-11, 10, -20)
            ];

            let meteoros = [
                new Meteoro(
                    gl, Matrix4.scale(new Vector3(2, 2, 2)), meteoro_cp1),

                new Meteoro(
                    gl, Matrix4.scale(new Vector3(2, 2, 2)), meteoro_cp2),

                new Meteoro(
                    gl, Matrix4.scale(new Vector3(2, 2, 2)), meteoro_cp3),
            ];

            let images = [
                // Imagenes Izq
                new Imagenes(
                    gl, Matrix4.multiply(Matrix4.rotateY(-90), Matrix4.translate(new Vector3(0, 0, -25))), "./texturas/imagen0.png", gl.activeTexture(gl.TEXTURE9)
                ),
                new Imagenes(
                    gl, Matrix4.multiply(Matrix4.rotateY(-90), Matrix4.translate(new Vector3(20, 0, -25))), "./texturas/imagen1.png", gl.activeTexture(gl.TEXTURE10)
                ),
                new Imagenes(
                    gl, Matrix4.multiply(Matrix4.rotateY(-90), Matrix4.translate(new Vector3(40, 0, -25))), "./texturas/imagen2.png", gl.activeTexture(gl.TEXTURE11)
                ),
                new Imagenes(
                    gl, Matrix4.multiply(Matrix4.rotateY(-90), Matrix4.translate(new Vector3(60, 0, -25))), "./texturas/imagen3.png", gl.activeTexture(gl.TEXTURE12)
                ),
                new Imagenes(
                    gl, Matrix4.multiply(Matrix4.rotateY(-90), Matrix4.translate(new Vector3(80, 0, -25))), "./texturas/imagen4.png", gl.activeTexture(gl.TEXTURE13)
                ),

                // Imagenes Der
                new Imagenes(
                    gl, Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(0, 0, -25))), "./texturas/imagen5.png", gl.activeTexture(gl.TEXTURE14)
                ),
                new Imagenes(
                    gl, Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-20, 0, -25))), "./texturas/imagen6.png", gl.activeTexture(gl.TEXTURE15)
                ),
                new Imagenes(
                    gl, Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-40, 0, -25))), "./texturas/imagen7.png", gl.activeTexture(gl.TEXTURE16)
                ),
                new Imagenes(
                    gl, Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-60, 0, -25))), "./texturas/imagen8.png", gl.activeTexture(gl.TEXTURE17)
                ),
                new Imagenes(
                    gl, Matrix4.multiply(Matrix4.rotateY(90), Matrix4.translate(new Vector3(-80, 0, -25))), "./texturas/imagen9.png", gl.activeTexture(gl.TEXTURE18)
                ),

                // Imagene Final
                new Imagenes(
                    gl, Matrix4.multiply(Matrix4.rotateY(0), Matrix4.translate(new Vector3(0, 0, -105))), "./texturas/imagen10.png", gl.activeTexture(gl.TEXTURE19)
                ),
            ];
            // Se crean tanto la camara principal como la camara de seguirdad secundaria
            let security_camera = new Camara(new Vector3(5, 9, -85), new Vector3(0, 5, 5), new Vector3(0, 1, 0));
            let camera = new Camara(new Vector3(0, 5, 20), new Vector3(0, 5, 0), new Vector3(0, 1, 0));

            let skybox = new Skybox(gl, Matrix4.multiply(Matrix4.scale(new Vector3(500, 500, 500)), Matrix4.rotateX(90)));

            // se crea una matriz de cámara (o vista)
            let viewMatrix = camera.getMatrix();

            // se construye la matriz de proyección en perspectiva
            let projectionPersMatrix = Matrix4.perspective(75 * Math.PI / 180, canvas.width / canvas.height, 1, 2000);
            let projectionOrtMatrix = Matrix4.ortho(-10, 10, -10, 10, 0.1, 2000, canvas.width / canvas.height);

            //let projectionMatrix = projectionOrtMatrix;
            let projectionMatrix = projectionPersMatrix;


            // Se define el arreglo que contiene la posicion de la luz
            let lightPos = [0, 9.5, 0, 1];

            let lightPos1 = [
                [0, 9, 0, 1],
                [0, 9, -20, 1],
                [0, 9, -40, 1],
            ];

            let lightPosR = [0, 9.5, 20, 1];


            let ambient = [0.5, 0.5, 0.0];

            // Se definen las instrucciones para generar la luz en le canvas
            let u_ambien_ = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, u_ambien_);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ambient), gl.STATIC_DRAW);

            // Función draw
            function draw(current_frame) {
                let lightDir = [0, -9, 15, 1];

                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                delta_time = current_frame - last_frame;
                last_frame = delta_time;

                current = Date.now();
                elapsed = (current - lastTime) / 2700;
                if (elapsed > max_elapsed_wait) {
                    elapsed = max_elapsed_wait;
                }

                if (counter_time > time_step) {
                    if (lightDir[3] == 0) {
                        lightDir = [0, 0, 0, 1];
                    }
                    if (lightDir[3] == 1) {
                        lightDir = [0, 0, 0, 0];
                    }
                    //draw();
                    counter_time = 0;
                }
                counter_time += elapsed;

                lastTime = current;


                if (actual_camera) {
                    viewMatrix = camera.getMatrix();
                } else {
                    viewMatrix = security_camera.getMatrix();
                }


                let projectionViewMatrix = Matrix4.multiply(projectionMatrix, viewMatrix);

                if (camera_in_tour) {

                    camera_tour(fase);
                    console.log(degrees_count);

                    if (fase == 1) {
                        if (basic_equals(camera.pos.z, 0) || basic_equals(camera.pos.z, -20) || basic_equals(camera.pos.z, -40) || basic_equals(camera.pos.z, -60) || basic_equals(camera.pos.z, -80)) {
                            degrees_count = 0;
                            fase = 2;
                        }
                    }
                    if (fase == 2) {
                        let f = (!basic_equals(camera.pos.z, -80)) && (!basic_equals(camera.pos.z, 0))
                        if (basic_equals(degrees_count, 360) && (f || first_door)) {
                            first_door = false;
                            fase = 1;
                        } else if (basic_equals(degrees_count, 540)) {
                            fase = 1;
                        }
                    }
                }

                if (doors_in_move) {
                    open_doors();
                    if (basic_equals(doors_count, 90)) {
                        doors_count = 0;
                        open *= (-1);
                        doors_in_move = false;
                    }
                }

                skybox.draw(gl, projectionViewMatrix);

                gl.useProgram(programNM);
                // se genera una instancia del programa del shader
                for (let i = 0; i < pisos.length; i++) {
                    // se dibuja la geometría
                    pisos[i].draw(
                        gl, shader_locationsNM, lightPos, viewMatrix, projectionMatrix
                    );
                }

                gl.useProgram(program);

                // ciclo que dibujara las figuras almacenadas en el arreglo entradas
                for (let i = 0; i < entradas.length; i++) {
                    // se dibuja la geometría
                    entradas[i].draw(
                        gl, shader_locations, lightPos1, viewMatrix, projectionMatrix
                    );
                }
                for (let i = 0; i < entradasInv.length; i++) {
                    // se dibuja la geometría
                    entradasInv[i].draw(
                        gl, shader_locations, lightPos1, viewMatrix, projectionMatrix
                    );
                }
                for (let i = 0; i < salida.length; i++) {
                    // se dibuja la geometría
                    salida[i].draw(
                        gl, shader_locations, lightPos1, viewMatrix, projectionMatrix
                    );
                }
                for (let i = 2; i < inicio.length; i++) {
                    // se dibuja la geometría
                    inicio[i].draw(
                        gl, shader_locations, lightPos1, viewMatrix, projectionMatrix
                    );
                }

                for (let i = 0; i < meteoros.length; i++) {
                    meteoros[i].draw(
                        gl, shader_locations, lightPos1, viewMatrix, projectionMatrix, t
                    );
                }

                for (let i = 0; i < images.length; i++) {
                    // se dibuja la geometría
                    images[i].draw(
                        gl, shader_locations, lightPos1, viewMatrix, projectionMatrix, i + 9
                    );
                }


                gl.useProgram(programReflect);

                inicio[0].draw(
                    gl, shader_locations_reflect, lightPosR, lightDir, viewMatrix, projectionMatrix
                );
                inicio[1].draw(
                    gl, shader_locations_reflect, lightPosR, lightDir, viewMatrix, projectionMatrix
                );

                gl.useProgram(programSpec);

                for (let i = 0; i < focos.length; i++) {
                    // se dibuja la geometría
                    let newluz = i * (-20);
                    focos[i].draw(
                        gl, shader_locations_spec, [lightPos[0], lightPos[1], newluz, lightPos[3]], viewMatrix, projectionMatrix
                    );
                }

                //Actualizamos t 
                c = (c + 1) % 1001; // Cálculo con enteros para evitar problemas de precisión con decimales de js 
                t = c / 500;

                requestAnimationFrame(draw);
            }

            requestAnimationFrame(draw);

            window.onkeydown = function(ev) {
                switch (ev.which) {
                    case 87:
                        {
                            if (!pause_mov) {
                                camera.move("front");
                            }
                            break;
                        }
                    case 83:
                        {
                            if (!pause_mov) {
                                camera.move("back");
                            }
                            break;
                        }
                    case 68:
                        {
                            if (!pause_mov) {
                                camera.move("right");
                            }
                            break;
                        }
                    case 88:
                        {
                            raze.play();
                        }
                    case 65:
                        {
                            if (!pause_mov) {
                                camera.move("left");
                            }
                            break;
                        }
                    case 71:
                        {
                            if (actual_camera) {
                                ///Poniendo un estado a la camara
                                camera.setPos(new Vector3(0, 5, 2));
                                camera.setCOI(new Vector3(0, 5, -11));
                                camera.front = new Vector3(0, 0, -1);
                                camera.yaw = -90;
                                camera.pitch = 0;

                                pause_mov = !pause_mov;

                                camera_in_tour = !camera_in_tour;

                                if (!camera_in_tour) {
                                    fase = 0;
                                } else {
                                    fase = 1;
                                    first_door = true;
                                }
                            }
                            break;
                        }
                    case 27:
                        {
                            pause_mov = !pause_mov;
                            break;
                        }
                    case 67:
                        {
                            camera.pause_mov = !camera.pause_mov;
                            actual_camera = !actual_camera;
                            break;
                        }
                    case 80:
                        {
                            actual_projection = !actual_projection;
                            if (actual_projection) {
                                projectionMatrix = projectionPersMatrix;
                            } else {
                                projectionMatrix = projectionOrtMatrix;
                            }
                            break;
                        }
                    case 79:
                        {
                            if (!doors_in_move) {
                                doors_in_move = true;
                            }
                        }
                }
            }

            canvas.onmousemove = function(ev) {

                let posx = ev.clientX;
                let posy = canvas.height - ev.clientY;
                let offsetx = posx - camera.lastx;
                let offsety = posy - camera.lasty;

                if (!pause_mov) {
                    camera.moveCamera(offsetx, offsety);
                }

                var coor = "Coordinates: (" + posx + "," + posy + ")";
                document.getElementById("demo").innerHTML = coor;
            }


            canvas.onmouseout = function(ev) {
                document.getElementById("demo").innerHTML = "";
            }

            function camera_tour(fase) {

                switch (fase) {
                    case 1:
                        {
                            camera.move("front");
                            break;
                        }
                    case 2:
                        {
                            camera.moveCamera(.4, 0);
                            degrees_count += .4;
                            break;
                        }
                    case 0:
                        {
                            break;
                        }

                }

            }

            function open_doors() {
                let indices = [0, 1, 10, 11, 20, 21, 30, 31, 40, 41]
                for (let i = 0; i < indices.length; i++) {
                    entradas[indices[i]].open_door(open);
                    entradasInv[indices[i]].open_door(open);
                }
                salida[0].open_door(open);
                salida[1].open_door(open);
                doors_count++;
                console.log(doors_count);
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

function basic_equals(a, b) {
    return Math.abs(a - b) < .5
}
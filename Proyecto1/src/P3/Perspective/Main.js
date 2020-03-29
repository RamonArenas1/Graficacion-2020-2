// Se importan las clases a utilizar
import Vector3 from "./Vector3.js";
import Vector4 from "./Vector4.js";
import Matrix4 from "./Matrix4.js";

window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  // se definen los vertices del cubo utilizando vectores de 4 dimensiones
  let vertices = [
    new Vector4( 1,  1,  1, 1),
    new Vector4( 1, -1,  1, 1),
    new Vector4(-1, -1,  1, 1),
    new Vector4(-1,  1,  1, 1),
    new Vector4( 1,  1, -1, 1),
    new Vector4( 1, -1, -1, 1),
    new Vector4(-1, -1, -1, 1),
    new Vector4(-1,  1, -1, 1),
  ];
  
  // las caras se definen igual que antes, utilizando indices
  let faces = [
    [0, 1, 2], [3, 0, 2], // top
    [4, 5, 6], [7, 4, 6], // bottom
    [0, 5, 1], [4, 5, 0], // right
    [7, 6, 2], [7, 2, 3], // left
    [7, 4, 0], [7, 0, 3], // front
    [6, 5, 1], [6, 1, 2], // back
  ];

  // se define la posición de la cámara (o el observador o el ojo)
  let camera = new Vector3(3, 2, 4);
  // se define la posición del centro de interés, hacia donde observa la cámara
  let coi = new Vector3(0, 0, 0);
  // se crea una matriz de cámara (o vista)
  let viewMatrix = Matrix4.lookAt(camera, coi, new Vector3(0, 1, 0));
  
  // se crea una matriz de proyección de perspectiva con un campo de visión (fov) de 75 grados, una distancia cercana de 0.1 y una lejana de 2000 (unidades)
  let projectionMatrix = Matrix4.perspective(75*Math.PI/180, canvas.width/canvas.height, 0.1, 2000);

  // se crea una matrix que conjunta las transformaciones de la cámara y de la proyección
  // hay que recordar que primero se realiza la transformación de la cámara y luego la de la perspectiva
  let projectionViewMatrix = Matrix4.multiply(projectionMatrix, viewMatrix);

  /**
   * Esta función en necesaria ya que estamos usando 2D para dibujar los objetos 3D
   * Cuando veamos WebGL esta transformación desaparece, ya que WebGL realiza la transformación automáticamente
   */
  function imageTransform(w, h, v) {
    // hay que notar que las coordenadas de los puntos se dividen entre su componente w, lo que es necesario para aplicar de forma completa la transformación de proyección
    return {
      x: (v.x/v.w)*w/2 + w/2,
      y: (-v.y/v.w)*h/2 + h/2,
      z: (v.z)/v.w
    };
  }

  let vertex;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // se ordenan las caras, para dibujar de mejor forma los polígonos
  let new_faces = faces.sort(function(a, b) {
    let tmp_a = (vertices[a[0]].z + vertices[a[1]].z + vertices[a[2]].z)/3;
    let tmp_b = (vertices[b[0]].z + vertices[b[1]].z + vertices[b[2]].z)/3;
    return tmp_a - tmp_b;
  });

  // se itera sobre cada una de las caras
  new_faces.forEach((face) => {
    // se define un color aleatorio para cada triángulo que se va a dibujar
    context.fillStyle = `rgb(${parseInt(256*Math.random())}, ${parseInt(256*Math.random())}, ${parseInt(256*Math.random())})`;

    context.beginPath();
    face.forEach((vertex_index, index) => {
      // transformamos los vértices con la matriz de vista y proyección, realizando simplemente una multiplicación
      vertex = projectionViewMatrix.multiplyVector(vertices[vertex_index]);
      
      // transformamos los vértices a coordenadas de pantalla para dibujarlos
      vertex = imageTransform(canvas.width, canvas.height, vertex);

      if (index === 0) {
        context.moveTo(vertex.x, vertex.y);
      }
      else {
        context.lineTo(vertex.x, vertex.y);
      }
    });
    context.closePath();
    context.fill();
  });
});
window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

/**
  * Cámara por default inicializada en (0,3,3), punto de interes en el origen
  * y un ángulo de apertura de 60°
  */
  let camera = new CG.Vector3(0,3,3);
  let coi = new CG.Vector3(0,0,0); // center of interest
  let up = new CG.Vector3(0,1,0);
  let angle = 60*Math.PI/180;

  let vertex;

  // Arreglo de vértices del objeto
  let vertices = [];
  // Arreglo con las caras del objeto
  let faces = [];
  // Arreglo auxiliar para el dibujado
  let new_vertices = [];

 /**
  * Función viewTransform, se encarga de hacer la transformación de la cámara a
  * uun vertice usando la matriz correspondiente
  * @param{Vector4} vertex
  * @return{Vector4}
  */
  function viewTransform(vertex) {
    let m = CG.Matrix4.lookAt(camera,coi,up);
    return m.multiplyVector(vertex);
  }

 /**
  * Función perspective, se encarga de hacer la transformación de perspectiva a un
  * vertice, utilizando la matriz ccorrespondiente.
  * @param{Number} fov
  * @param{Number} aspect
  * @param{Number} near
  * @param{Number} far
  * @param{Vector4} v
  * @return{Vector4}
  */
  function perspective(fov, aspect, near, far, v) {
    let m = CG.Matrix4.perspective(fov,aspect,near,far);
    return m.multiplyVector(v).divide();
  }

 /**
  * Función imagenTransform, se encarga de colocar un vértice en el canvas, considerando
  * el centro del canvas como el origen
  * @param{Number} w
  * @param{Number} h
  * @param{Vector4} v
  * @return{Vector4}
  */
  function imagenTransform(w, h, v) {
    return new CG.Vector4(
      v.x*w/2 + w/2,
      -v.y*h/2 + h/2,
      v.z,
      1
    );
  }

 /**
  * Función draw, encargada de tomar todo el conjunto de vértices y caras definidas
  * y dibujarlos en el canvas, aplicando las tranformaciones correspondientes para
  * dibujarlo de manera correcta.
  */
  function draw() {
    // Se aplica la tranformación de la cámara a todos los vértices.
    vertices.forEach((vertex, index) => {
      new_vertices[index] = viewTransform(vertex);
    });

    //Proceso de dibujado
    context.clearRect(0, 0, canvas.width, canvas.height);
    faces.forEach((face) => {
      context.beginPath();
      face.forEach((vertex_index, index) => {
        //tranformación de perspectiva
        vertex = perspective(angle, canvas.width/canvas.height, 0.1, 2000, new_vertices[vertex_index]);
        //coloación en el canvas
        vertex = imagenTransform(canvas.width, canvas.height, vertex);

        if (index === 0) {
          context.moveTo(vertex.x, vertex.y);
        }
        else {
          context.lineTo(vertex.x, vertex.y);
        }
      });
      context.closePath();
      context.stroke();
    });
  }

  // Variables para referenciar los inputs para cambiar las coordenadas de la cámara
  var xc = document.getElementById("cameraX");
  var yc = document.getElementById("cameraY");
  var zc = document.getElementById("cameraZ");

  // Se define que hacer al haber un cambió en las coordenadas de la cámara.
  xc.addEventListener("input",function(evt){
    camera.set(this.value,camera.y,camera.z);
    draw();
  });
  yc.addEventListener("input",function(evt){
    camera.set(camera.x,this.value,camera.z);
    draw();
  });
  zc.addEventListener("input",function(evt){
    camera.set(camera.x,camera.y,this.value);
    draw();
  });

  // Variable que referencia al input donde se selecciona un archivo obj
  var selectorObj = document.getElementById("selector");

  // Al seleccionarse un archivo, se verifica que el navergador soporte la API y se realiza el parseo
  selectorObj.addEventListener("change",function(evt){
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      var file = evt.target.files[0];
      vertices = []
      faces = []
      parser(file);

    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
  });

 /**
  * Función parser, lee el contenido del archivo, separando cada vez que hay un salto
  * de línea y procesa cada línea por separado para después realizar el dibujo.
  * @param{File} file
  */
  function parser(file){
    let reader = new FileReader();
    reader.onload = function () {
      const lines = reader.result.split('\n');
      for(var i = 0; i < lines.length ; i++){
        procesar(lines[i]);
      }
      console.log(vertices);
      console.log(faces);
      draw();
    };
    reader.readAsText(file);
  }

  /**
  * Función procesar, analiza una línea de texto y realiza alguna de las siguientes acciones.
  * Si la cadena empieza con "v" corresponde a un vértice, crea un Vertex4 con los datos correspondientes
  * y lo agrega a la lista de vértices por dibujar
  * Si la cadena empieza con "f" crea a un arreglo de 3 elementos con los datos correspo y la agrega
  * al arreglo faces
  * @param{String} linea
  */
  function procesar(linea){
    s_linea = linea.split(' ');
    if(s_linea[0] == "v"){
      let vertex = new CG.Vector4(parseFloat(s_linea[1]),parseFloat(s_linea[2]),parseFloat(s_linea[3]),1);
      vertices.push(vertex);
    }else if (s_linea[0] == "f"){
      let face = [parseFloat(s_linea[1].split('//')[0])-1,parseFloat(s_linea[2].split('//')[0])-1,parseFloat(s_linea[3].split('//')[0])-1];
      faces.push(face);
    }
  }

});

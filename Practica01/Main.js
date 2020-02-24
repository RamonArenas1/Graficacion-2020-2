window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  function dibujarLinea(pi,p1,p2,pe){

    context.lineWidth = 5;
    context.setLineDash([]);
    context.strokeStyle = "rgba(63,123,191,0.5)";	
    Draw.curva(context,pi.x,pi.y,p1.x,p1.y,p2.x,p2.y,pe.x,pe.y);
  }

  ///////LINEA 1/////////////////
  let init_point1 = { x: 150, y: 120 };
  let control_point_11 = { x: 60, y: 160 };
  let control_point_12 = { x: 80, y: 340 };
  let end_point1 = { x: 200, y: 318 };

  dibujarLinea(init_point1,control_point_11,control_point_12,end_point1);

  ///////LINEA 2////////////////////////////
  let init_point2 = { x: 150, y: 120 };
  let control_point_21 = { x: 153, y: 120 };
  let control_point_22 = { x: 156, y: 119 };
  let end_point2 = { x: 160, y: 118 };
  dibujarLinea(init_point2,control_point_21,control_point_22,end_point2);

  //////LINEA 3/////////////////////////////
  let init_point3 = { x: 160, y: 118 };
  let control_point_31 = { x: 290, y: 120 };
  let control_point_32 = { x: 285, y: 305 };
  let end_point3 = { x: 200, y: 318 };

  dibujarLinea(init_point3,control_point_31,control_point_32,end_point3);

  //////LINEA 4/////////////////////////////
  let init_point4 = { x: 185, y: 320 };
  let control_point_41 = { x: 250, y: 340 };
  let control_point_42 = { x: 300, y: 370 };
  let end_point4 = { x: 400, y: 360 };

  dibujarLinea(init_point4,control_point_41,control_point_42,end_point4);

  //////LINEA 5/////////////////////////////
  let init_point5 = { x: 225, y: 310 };
  let control_point_51 = { x: 210, y: 340 };
  let control_point_52 = { x: 398, y: 370 };
  let end_point5 = { x: 400, y: 356 };

  dibujarLinea(init_point5,control_point_51,control_point_52,end_point5);

  //////LINEA 6/////////////////////////////
  let init_point6 = { x: 155, y: 320 };
  let control_point_61 = { x: 150, y: 340 };
  let control_point_62 = { x: 160, y: 388  };
  let end_point6 = { x: 185, y: 390 };

  dibujarLinea(init_point6,control_point_61,control_point_62,end_point6);

  //////LINEA 7/////////////////////////////
  let init_point7 = { x: 175, y: 320 };
  let control_point_71 = { x: 190, y: 340 };
  let control_point_72 = { x: 220, y: 380  };
  let end_point7 = { x: 185, y: 390 };

  dibujarLinea(init_point7,control_point_71,control_point_72,end_point7);

  //////LINEA 8/////////////////////////////
  let init_point8 = { x: 268, y: 275 };
  let control_point_81 = { x: 310, y: 290 };
  let control_point_82 = { x: 320, y: 320  };
  let end_point8 = { x: 305, y: 330 };

  dibujarLinea(init_point8,control_point_81,control_point_82,end_point8);

  //////LINEA 9/////////////////////////////
  let init_point9 = { x: 258, y: 292 };
  let control_point_91 = { x: 250, y: 290 };
  let control_point_92 = { x: 280, y: 340  };
  let end_point9 = { x: 305, y: 330 };

  dibujarLinea(init_point9,control_point_91,control_point_92,end_point9);


  //////LINEA 10/////////////////////////////
  let init_point10 = { x: 240, y: 330 };
  let control_point_101 = { x: 250, y: 334 };
  let control_point_102 = { x: 265, y: 334  };
  let end_point10 = { x: 285, y: 325 };

  dibujarLinea(init_point10,control_point_101,control_point_102,end_point10);

  //////LINEA 11/////////////////////////////
  let init_point11 = { x: 312, y: 315 };
  let control_point_111 = { x: 350, y: 304 };
  let control_point_112 = { x: 435, y: 300  };
  let end_point11 = { x: 435, y: 355 };

  dibujarLinea(init_point11,control_point_111,control_point_112,end_point11);

  //////LINEA 12/////////////////////////////
  let init_point12 = { x: 230, y: 340 };
  let control_point_121 = { x: 240, y: 350 };
  let control_point_122 = { x: 410, y: 464  };
  let end_point12 = { x: 435, y: 355 };

  dibujarLinea(init_point12,control_point_121,control_point_122,end_point12);

  //////LINEA 13/////////////////////////////
  let init_point13 = { x: 110, y: 160 };
  let control_point_131 = { x: 115, y: 145 };
  let control_point_132 = { x: 155, y: 120  };
  let end_point13 = { x: 150, y: 160 };

  dibujarLinea(init_point13,control_point_131,control_point_132,end_point13);

  //////LINEA 14/////////////////////////////
  let init_point14 = { x: 110, y: 160 };
  let control_point_141 = { x: 100, y: 190 };
  let control_point_142 = { x: 145, y: 190  };
  let end_point14 = { x: 150, y: 160 };

  dibujarLinea(init_point14,control_point_141,control_point_142,end_point14);

  //////LINEA 15/////////////////////////////
  let init_point15 = { x: 195, y: 155 };
  let control_point_151 = { x: 185, y: 120 };
  let control_point_152 = { x: 240, y: 141  };
  let end_point15 = { x: 235, y: 155 };

  dibujarLinea(init_point15,control_point_151,control_point_152,end_point15);

  //////LINEA 16/////////////////////////////
  let init_point16 = { x: 195, y: 155 };
  let control_point_161 = { x: 200, y: 170 };
  let control_point_162 = { x: 235, y: 180  };
  let end_point16 = { x: 235, y: 155 };

  dibujarLinea(init_point16,control_point_161,control_point_162,end_point16);

  //////LINEA 17/////////////////////////////
  let init_point17 = { x: 150, y: 190 };
  let control_point_171 = { x: 150, y: 170 };
  let control_point_172 = { x: 200, y: 160  };
  let end_point17 = { x: 200, y: 180 };

  dibujarLinea(init_point17,control_point_171,control_point_172,end_point17);

  //////LINEA 18/////////////////////////////
  let init_point18 = { x: 150, y: 190 };
  let control_point_181 = { x: 150, y: 210 };
  let control_point_182 = { x: 200, y: 200  };
  let end_point18 = { x: 200, y: 180 };

  dibujarLinea(init_point18,control_point_181,control_point_182,end_point18);

  //////LINEA 19/////////////////////////////
  let init_point19 = { x: 170, y: 187 };
  let control_point_191 = { x: 170, y: 180 };
  let control_point_192 = { x: 180, y: 176  };
  let end_point19 = { x: 180, y: 183 };

  dibujarLinea(init_point19,control_point_191,control_point_192,end_point19);

  //////LINEA 20/////////////////////////////
  let init_point20 = { x: 155, y: 195 };
  let control_point_201 = { x: 125, y: 230 };
  let control_point_202 = { x: 135, y: 300  };
  let end_point20 = { x: 190, y: 300 };

  dibujarLinea(init_point20,control_point_201,control_point_202,end_point20);

  //////LINEA 21/////////////////////////////
  let init_point21 = { x: 200, y: 180 };
  let control_point_211 = { x: 260, y: 200 };
  let control_point_212 = { x: 270, y: 250  };
  let end_point21 = { x: 250, y: 280 };

  dibujarLinea(init_point21,control_point_211,control_point_212,end_point21);

  ////////LINEA 22///////////////////////////////

  let init_point22 = { x: 190, y: 300 };
  let control_point_221 = { x: 220, y: 300 };
  let control_point_222 = { x: 240, y: 290  };
  let end_point22 = { x: 250, y: 280 };


  dibujarLinea(init_point22,control_point_221,control_point_222,end_point22);


});
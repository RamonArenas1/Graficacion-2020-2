window.addEventListener("load",function(evt) {
    let canvas = document.getElementById("the_canvas");
    let context = canvas.getContext("2d");

    Draw.epicicloide(context,10,20);

    context.setLineDash([6,7]);
    context.strokeStyle = "black"
    
    context.beginPath();

    context.moveTo(400,0);
    context.lineTo(400,600);

    context.moveTo(0,300);
    context.lineTo(800,300);

    context.stroke();


});
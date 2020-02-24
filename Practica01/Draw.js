class Draw{

    static curva(ctx,p1_x,p1_y,p2_x,p2_y,p3_x,p3_y,p4_x,p4_y){
        let p1 = {x:p1_x,y:p1_y};
        let p2 = {x:p2_x,y:p2_y};
        let p3 = {x:p3_x,y:p3_y};
        let p4 = {x:p4_x,y:p4_y};
        this.curva_aux(ctx,p1,p2,p3,p4);
    }

    static curva_aux(ctx,p1,p2,p3,p4){
        ctx.beginPath();
        let stack = [];
        ctx.moveTo(p1.x,p1.y);
        

        stack.push(p3);
        stack.push(p4);
        p4 = this.punto_medio(p2,p3);

        while(p1 != undefined, p2 != undefined && p3 != undefined && p4 != undefined){    
            
            if(this.distancia(p1,p4) > (2 * Math.sqrt(2))){
                p3 = this.punto_medio(p2,p4);
                p2 = this.punto_medio(p2,p1);

                stack.push(p3);
                stack.push(p4);
                p4 = this.punto_medio(p2,p3);
            }else{
                ctx.lineTo(p4.x,p4.y);                

                p1 = p4;
                p4 = stack.pop();
                p2 = stack.pop();        
            }
            
        }
        ctx.stroke();
    }

    static punto_medio(p1,p2){
        return {x:(p1.x + p2.x)/2 , y:(p1.y + p2.y)/2};
    }

    static distancia(p1,p2){
        return Math.sqrt(Math.pow((p1.x) - (p2.x),2) + Math.pow((p1.y)-(p2.y),2));
    }

    static epicicloide_aux(ctx,k,r,w,h){
        let coi = {x:w/2, y:h/2};
        ctx.beginPath();
        let x = this.param_x(k,r,0)+coi.x;
        let y = this.param_y(k,r,0)+coi.y;

        ctx.moveTo(x,y);
        let i = 0;
        for(let j = 1; j < 360; j++){
            i = j * Math.PI/180;
            x = this.param_x(k,r,i)+coi.x;
            y = this.param_y(k,r,i)+coi.y;
            ctx.lineTo(x,y);
            ctx.moveTo(x,y);
        }
        ctx.stroke();
    }

    static epicicloide(ctx,k,r){
        this.epicicloide_aux(ctx,k,r,800,600);
    }

    static param_x(k,r,theta){
        return r*(k+1)*Math.cos(theta)-r*Math.cos((k+1)*theta);
    }

    static param_y(k,r,theta){
        return r*(k+1)*Math.sin(theta)-r*Math.sin((k+1)*theta);
    }
}
var CG = (function(CG) {

 /**
  * Clase Vector4, es la representación de los vectores de 4 componentes que estan
  * en R4
  */
  class Vector4{

 /**
  * Constructor de la clase Vector4.
  * En caso de recibir mens de 4 elementos asigna el valor de 0 a las componentes faltantes
  */
	constructor(){
      if (arguments.length>3){
        this.x=arguments[0];
        this.y=arguments[1];
        this.z=arguments[2];
        this.w=arguments[3];
      }else if (arguments.length>2) {
				this.x=arguments[0];
				this.y=arguments[1];
				this.z=arguments[2];
        this.w=0;
			}else if (arguments.length>1){
				this.x=arguments[0];
				this.y=arguments[1];
				this.z=0;
        this.w=0;
			}else if (arguments.length>0){
				this.x=arguments[0];
				this.y=0;
				this.z=0;
        this.w=0;
			}else{
				this.x=0;
				this.y=0;
				this.z=0;
        this.w=0;
			}
		}

    print(){
      console.log(this.x+"  " +this.y+ "  " +this.z+"  " +this.w);
    }

	 /**
    * Función add, regresa el vector cuyas componentes son la suma de las componentes
    * de los dos vectores dados.
		* @param {Vector4} u
		* @param {Vector4} v
		* @return {Vector4}
		*/
		static add(u, v){
			return new Vector4(u.x+v.x , u.y+v.y , u.z+v.z , u.w+v.w);
		}

	 /**
    * Función clone, regresa un vector que es exactamente igual al vector que llama
    * a la función.
		* @return {Vector4}
		*/
		clone(){
			return new Vector4(this.x,this.y,this.z,this.w);
		}

	 /**
    * Función distance, regresa la distancia euclideana que hay entre dos vectores dados.
		* @param {Vector4} u
		* @param {Vector4} v
		* @return {Number}
		*/
		static distance(u, v){
			return Math.sqrt(Vector4.squaredDistance(u,v));
		}

	 /**
    * Función dot, regresa el producto punto de dos vectores.
		* @param {Vector4} u
		* @param {Vector4} v
		* @return {Number}
		*/
		static dot(u, v){
			return ((u.x*v.x)+(u.y*v.y)+(u.z*v.z)+(u.w*v.w));
		}

	 /**
    * Función equals, dado una e = 0.000001 nos dice si cada una de las componentes
    * de dos vectores son distintas entre sí a lo mas en e.
		* @param {Vector4} u
		* @param {Vector4} v
		* @return {Boolean}
		*/
		static equals(u, v){
			var e = 0.000001;
			return(Math.abs(u.x-v.x) <= e && Math.abs(u.y-v.y)<=e && Math.abs(u.z-v.z)<=e && Math.abs(u.w-v.w)<=e);
		}

	 /**
    * Función exactEquals, nos dice si cada una de las componentes de dos vectores son
    * exactamente iguales entre sí
		* @param {Vector4} u
		* @param {Vector4} v
		* @return {Boolean}
		*/
		static exactEquals(u, v){
			return ((u.x-v.x) == 0 && (u.y-v.y) == 0 && (u.z-v.z) == 0 && (u.w-v.w) == 0);
		}

	 /**
    * Función length, calcula el tamaño que tiene el vector que invoca la funión.
		* @return {Number}
		*/
		length(){
			return Math.sqrt(this.squaredLength());
		}

	 /**
    * Función normalize, nos regresa un vector que es la normalizaxción del
    * vector que invoca a la función.
		* @return {Vector4}
		*/
		normalize(){
			return this.cardinal(1/this.length());
		}

   /**
    * Función set, dado los argumentos dados, cambia los valores de las componentes
    * del vector que invoca la función.
		* @param {Number} x
		* @param {Number} y
		* @param {Number} z
    * @param {Number} w
		*/
		set(x, y, z, w){
			this.x=x;
			this.y=y;
			this.z=z;
      this.w=w;
		}

   /**
    * Función squaredDistance, nos regresa el cuadrado de la distancia entre dos vectores.
		* @param {Vector4} u
		* @param {Vector4} v
		* @return {Number}
		*/
		static squaredDistance(u, v){
			return (Math.pow(u.x-v.x,2)+Math.pow(u.y-v.y,2)+Math.pow(u.z-v.z,2)+Math.pow(u.w-v.w,2));
		}

	 /**
    * Función squaredLength, nos regresa el cuadrado del tamaño del vector que invoca
    * la función.
		* @return {Number}
		*/
		squaredLength(){
			return Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2) + Math.pow(this.w,2);
		}

	 /**
    * Función zero, les da el valor de cero a cada una de las componentes del
    * vector que invoca la función.
		*/
		zero(){
			this.x=0;
			this.y=0;
			this.z=0;
      this.w=0;
		}

   /**
    * Función scalar, dado un número escalar dado, nos regresa el vector resultante
    * de multiplicar ese número por cada una de las componentes del vector
    * que invoca la función.
    * @param {Number} a
    * @return {Vector4}
    */
		cardinal(a){
			return new Vector4(a*this.x,a*this.y,a*this.z,a*this.w);
		}

    divide(){
      return this.cardinal(1/this.w);
    }
  }

CG.Vector4 = Vector4;
return CG;
})(CG || {});

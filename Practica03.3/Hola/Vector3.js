export default class Vector3 {
    
    constructor(x = 0, y = 0, z = 0) {
        this.x = arguments[0];
        this.y = arguments[1];
        this.z = arguments[2];
    }


	 /**
    * Función add, se encarga de realizar la suma de las componentes de dos vectores.
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Vector3}
		*/
		static add(u, v){
			return new Vector3(u.x + v.x , u.y + v.y , u.z + v.z);
		}

    /**
     * Función subtract, se encarga de realizar la resta de las componentes de dos vectores.
 		* @param {Vector3} u
 		* @param {Vector3} v
 		* @return {Vector3}
 		*/
 		static subtract(u, v){
 			return new Vector3(u.x - v.x , u.y - v.y , u.z - v.z);
 		}

	 /**
    * Función angle, calcula el ángulo que existe entre dos vectores respecto al origen.
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Number}
		*/
		static angle(u, v){
		return Math.acos(Vector3.dot(u,v)/(u.length()*v.length()));
		}

	 /**
    * Función clone, crea un nuevo Vector3 identico a un Vector3 dado.
		* @return {Vector3}
		*/
		clone(){
			return new Vector3(this.x,this.y,this.z);
		}

	 /**
    * Función cross, realiza el producto cruz de dos vectores
    * El vector resultante es ortogonal a los dos vectores dados.
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Vector3}
		*/
		static cross(u, v){
      return new Vector3(
        u.y*v.z - u.z*v.y,
        u.z*v.x - u.x*v.z,
        u.x*v.y - u.y*v.x
      );
		}

	 /**
    * Función distance, calcula la distancia euclidiana que hay entre dos vectores.
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Number}
		*/
		static distance(u, v){
			return Math.sqrt(Vector3.squaredDistance(u,v));
		}

	 /**
    * Función dot, calcula el producto punto de dos vectores.
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Number}
		*/
		static dot(u, v){
			return ((u.x*v.x) + (u.y*v.y) + (u.z*v.z));
		}

	 /**
    * Función equals, dado una e = 0.000001 nos dice si cada una de las componentes
    * de dos vectores son distintas entre sí a lo mas en e.
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Boolean}
		*/
		static equals(u, v){
			var e = 0.000001;
			return(Math.abs(u.x-v.x) <= e && Math.abs(u.y-v.y)<=e && Math.abs(u.z-v.z)<=e);
		}

	 /**
    * Función exactEquals, nos dice si cada una de las componentes de dos vectores son
    * exactamente iguales entre sí
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Boolean}
		*/
		static exactEquals(u, v){
			return ((u.x-v.x) == 0 && (u.y-v.y) == 0 && (u.z-v.z) == 0);
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
		* @return {Vector3}
		*/
		normalize(){
			return this.scalar(1/this.length());
		}

   /**
    * Función set, dado los argumentos dados, cambia los valores de las componentes
    * del vector que invoca la función.
		* @param {Number} x
		* @param {Number} y
		* @param {Number} z
		*/
		set(x, y, z){
			this.x=x;
			this.y=y;
			this.z=z;
		}

   /**
    * Función squaredDistance, nos regresa el cuadrado de la distancia entre dos vectores.
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Number}
		*/
		static squaredDistance(u, v){
			return ((u.x-v.x,2)**2 + (u.y-v.y,2)**2 + (u.z-v.z,2)**2);
		}

	 /**
    * Función squaredLength, nos regresa el cuadrado del tamaño del vector que invoca
    * la función.
		* @return {Number}
		*/
		squaredLength(){
			return (this.x**2 + this.y**2 + this.z**2);
		}

	 /**
    * Función zero, les da el valor de cero a cada una de las componentes del
    * vector que invoca la función.
		*/
		zero(){
			this.x=0;
			this.y=0;
			this.z=0;
		}

   /**
    * Función scalar, dado un número escalar dado, nos regresa el vector resultante
    * de multiplicar ese número por cada una de las componentes del vector
    * que invoca la función.
    * @param {Number} a
    * @return {Vector3}
    */
		scalar(a){
			return new Vector3(a*this.x,a*this.y,a*this.z);
		}

    print(){
      console.log(this.x+ "  "+this.y+"  "+this.z)
    }
}
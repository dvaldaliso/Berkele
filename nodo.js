
// ....................................................
// este cliente envía de golpe todos los mensajes al servidor
// (no debería hacerse así)
// ....................................................

import NodoController from "./controller/nodoController.js";
function main(){
	let nombre = process.argv[2] !=null ? process.argv[2]: "noname"
	let tiempo = process.argv[3] !=null ? process.argv[3]: "12:00"
	new NodoController("tcp://localhost", "5555", nombre, tiempo)

	
}
main()





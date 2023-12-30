
// ....................................................
// este cliente envía de golpe todos los mensajes al servidor
// (no debería hacerse así)
// ....................................................

import ClientController from "./controller/clientController.js";
function main(){
	let tiempo = process.argv[2] !=null ? process.argv[2]: "12:00"
	new ClientController("tcp://localhost","5555","david",tiempo)
}
main()





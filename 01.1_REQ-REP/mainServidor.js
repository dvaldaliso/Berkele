
import ServerController from "./controller/serverController.js"
function main() {
    let nombre = process.argv[2] !=null ? process.argv[2]: "noname"
	let tiempo = process.argv[3] !=null ? process.argv[3]: "12:00"
    new ServerController("tcp://*", "5555", nombre, tiempo)
} 
main() 


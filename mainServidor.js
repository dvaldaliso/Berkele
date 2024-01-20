
import ServerController from "./controller/serverController.js"
function main() {
	let tiempo = process.argv[3] !=null ? process.argv[3]: "12:00"
    let servidor =new ServerController("tcp://*", "5555", tiempo)
   
} 
main() 

  



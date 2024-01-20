
import CoordinadorController from "./controller/coordinadorController.js"
function main() {
	let tiempo = process.argv[3] !=null ? process.argv[3]: "12:00"
    let servidor =new CoordinadorController("tcp://*", "5555", tiempo)
   
} 
main() 

  



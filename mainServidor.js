
import ServerController from "./controller/serverController.js"
function main() {
	let tiempo = process.argv[3] !=null ? process.argv[3]: "12:00"
    let servidor =new ServerController("tcp://*", "5555", tiempo)
  // Configurar la ejecución de la función cada 1000 milisegundos (1 segundo)
  setInterval(function(){
    if(servidor.volverAPedirHoras){
        //servidor.dameHora()
        console.log("dame hora de nuevo")
    }
  }, 30000);
   
} 
main() 

  



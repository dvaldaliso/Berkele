import * as zmq from "zeromq"
import Mensaje from "../model/mensaje.js";
import { actualizarHora, diferenciaEntreHoras } from "../util/claculo.js";

export default class NodoController {
    
    constructor(url, port, nombre, tiempo) {
        console.log("Connecting to hello world server..."+nombre+" tiempo "+tiempo)
        this.socketDealer = zmq.socket('dealer') // Type Request
        this.N=6
        this.cont=0
        this.tiempo=0
        this.nombre=nombre
        this.#connect(url+":"+port)
        this.enviarRegistro()
        this.#recibirHora()
        this.#checkSalida()
    }

    #connect(url){
        this.socketDealer.connect(url)
    }

    #recibirHora(){
        this.socketDealer.on("message", function(data) {
            
            let message = JSON.parse(data);
            if(message.message=="dame_diferencia"){
                this.diferenciaEs(message)
            }

            if(message.message=="ajuste"){
                this.nuevaHora(message)
            }
            this.cont++
          

            if(this.cont===this.N){
                console.log("termino")
                this.socketDealer.close()
                process.exit(0)
            }
        }.bind(this))
    }

    enviarRegistro(){
        console.log("envio registro")
        let message = {message:"connected"}
        const messageString = JSON.stringify(message);
        this.socketDealer.send(messageString)
    }

    nuevaHora(){
        console.log("actualizar hora")
    }

    diferenciaEs(message){
        console.log("envio de diferencias")
        let diferencia= Math.abs(new Date() - new Date(message.tiempo));
        let resp ={message:"diferencia", value:diferencia}
        const messageString = JSON.stringify(resp);
        this.socketDealer.send(messageString)
    }

    
    

    #checkSalida(){
        process.on('SIGINT', function() {
            console.log (" hasta luego "+this.nombre)
            console.log ( " ** SIGINT capturada: cerrando !! ** ")
            this.socketDealer.close()
            process.exit(0)
        }.bind(this))
    }
}
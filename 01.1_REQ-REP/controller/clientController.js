import * as zmq from "zeromq"
import Mensaje from "../model/mensaje.js";

export default class ClientController {
    
    constructor(url, port, nombre, tiempo) {
        console.log("Connecting to hello world server... tiempo"+tiempo)
        this.socketParaPedir = zmq.socket('req')
        this.N=3
        this.cont=0
        this.tiempo=tiempo
        this.nombre=nombre
        this.#connect(url+":"+port)
        this.#recibirRespuesta()
        this.#enviarMensaje(new Mensaje(0, nombre, tiempo))
        this.#checkSalida()
    }

    #connect(url){
        this.socketParaPedir.connect(url)
    }

    #recibirRespuesta(){
        this.socketParaPedir.on("message", function(respuesta) {
            this.cont++
            console.log("client " +this.nombre+ " recibo respuesta ", this.cont, ": [", respuesta.toString(), ']')
          
            let messaje = JSON.parse(respuesta.toString());
            
            this.#enviarMensaje (new Mensaje(messaje.id+1, this.nombre, this.tiempo))

            if(this.cont===this.N){
                console.log("termino")
                this.socketParaPedir.close()
                process.exit(0)
            }
        }.bind(this))
    }

    // ....................................................
    //
    // envío 10 mensajes (función recursiva)
    // seguidos cada 0.8 segundos (sin esperar respuesta. 
    // Atención: no debería ser así. Debería esperar respuesta.
    // Sin embargo, la biblioteca para JS parece que lo tolera
    //
    #enviarMensaje(message){
        if(message.id<this.N){
                console.log("enviando petición ", message.id, '...')
                const messageString = JSON.stringify(message);
                this.socketParaPedir.send(messageString)
        }
    }

    #checkSalida(){
        process.on('SIGINT', function() {
            console.log ( " ** SIGINT capturada: cerrando !! ** ")
            this.socketParaPedir.close()
        }.bind(this))
    }
}
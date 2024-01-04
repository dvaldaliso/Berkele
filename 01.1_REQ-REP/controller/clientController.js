import * as zmq from "zeromq"
import Mensaje from "../model/mensaje.js";

export default class ClientController {
    
    constructor(url, port, nombre, tiempo) {
        console.log("Connecting to hello world server..."+nombre+" tiempo "+tiempo)
        this.socketParaPedir = zmq.socket('req') // Type Request
        this.N=6
        this.cont=0
        this.tiempo=tiempo
        this.nombre=nombre
        this.#connect(url+":"+port)
        this.#dameHora(new Mensaje(1,"dame hora",tiempo))
        this.#recibirHora()
        this.#checkSalida()
    }

    #connect(url){
        this.socketParaPedir.connect(url)
    }

    #recibirHora(){
        this.socketParaPedir.on("message", function(respuesta) {
            this.cont++
            console.log("client " +this.nombre+ " recibo respuesta ", this.cont, ": [", respuesta.toString(), ']')
          
            let messaje = JSON.parse(respuesta);
            messaje.id=this.cont
            this.#dameHora(messaje)

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
    #dameHora(message){
        setTimeout(function(){
            if(this.socketParaPedir){
                    console.log("enviando petición ", message.id, '...')
                    message.contenido="dame hora from "+this.nombre
                    message.tiempo=this.tiempo
                    const messageString = JSON.stringify(message);
                    this.socketParaPedir.send(messageString)
            }
        }.bind(this,message),6000)
    }

    #checkSalida(){
        process.on('SIGINT', function() {
            console.log (" hasta luego "+this.nombre)
            console.log ( " ** SIGINT capturada: cerrando !! ** ")
            this.socketParaPedir.close()
        }.bind(this))
    }
}
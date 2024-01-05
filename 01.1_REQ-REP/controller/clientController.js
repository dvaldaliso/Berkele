import * as zmq from "zeromq"
import Mensaje from "../model/mensaje.js";
import { actualizarHora, diferenciaEntreHoras } from "../util/claculo.js";

export default class ClientController {
    
    constructor(url, port, nombre, tiempo) {
        console.log("Connecting to hello world server..."+nombre+" tiempo "+tiempo)
        this.socketParaPedir = zmq.socket('req') // Type Request
        this.N=6
        this.cont=0
        this.tiempo=tiempo
        this.nombre=nombre
        this.#connect(url+":"+port)
        this.#dameHora(new Mensaje(1, nombre,"dame hora",tiempo))
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
          
            this.#actulizarHora(respuesta)

            if(this.cont===this.N){
                console.log("termino")
                this.socketParaPedir.close()
                process.exit(0)
            }
        }.bind(this))
    }
    #actulizarHora(respuesta){
        let message = JSON.parse(respuesta);
        message.cont=this.cont
        message.contenido="dame hora from "+this.nombre
        if(message.from=="master"){
            message.diferencia= diferenciaEntreHoras(message.tiempo,this.tiempo)
            this.tiempo=actualizarHora(this.tiempo,message.diferencia)
            
            console.log("enviando petición ", message.cont, '...', "tiempo actual ",this.tiempo)
        }
        message.from=this.nombre
        this.#dameHora(message)

    }
    
    #dameHora(message){
        setTimeout(function(){
            if(this.socketParaPedir){
                    
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
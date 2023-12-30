import * as zmq from "zeromq"
export default class ClientController {
    
    constructor(url, port, nombre, tiempo) {
        console.log("Connecting to hello world server... tiempo"+tiempo)
        this.socketParaPedir = zmq.socket('req')
        this.N=10
        this.cont=0
        this.tiempo=tiempo
        this.nombre=nombre
        this.#connect(url+":"+port)
        this.#recibirRespuesta()
        this.#enviarMensaje(1)
        this.#checkSalida()
    }

    #connect(url){
        this.socketParaPedir.connect(url)
    }

    #recibirRespuesta(){
        this.socketParaPedir.on("message", function(respuesta) {
            this.cont++
            console.log("client " +this.nombre+ " recibo respuesta ", this.cont, ": [", respuesta.toString(), ']')

            if(this.cont===this.N){
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
    #enviarMensaje(n){
        if(n<this.N){
            setTimeout(function() {
                console.log("enviando petición ", n, '...')
                this.socketParaPedir.send("Hello " + n + " desde " + this.nombre)
                
                this.#enviarMensaje (n+1, this.nombre)
            }.bind(this), 800)
        }
    }

    #checkSalida(){
        process.on('SIGINT', function() {
            console.log ( " ** SIGINT capturada: cerrando !! ** ")
            this.socketParaPedir.close()
        }.bind(this))
    }
}
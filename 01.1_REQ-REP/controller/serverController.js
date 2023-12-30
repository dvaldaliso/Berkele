import * as zmq from "zeromq"
import { tiempoPromedio } from "../util/claculo.js";
 export default class ServerController{

    constructor(url, port){
        console.log("Connecting to hello world server...")
        // creo un socket (de la biblioteca zeromq)
        this.socketParaResponder = zmq.socket('rep') //// de tipo REP (reply)
        this.cont=0;
        this.vincularSocker(url,port)
        this.recibirMensaje()
        this.checkSalida()
    }
    //
	// bind = vincular numero con socket = anuncio que mi
	// socket está disponible
	// en el puerto (al cuál se puede conectar cualquiera
	// por tcp)
	//
	// Se le da también un callback para que cuando
	// efectivamente el bind()  haya ocurrido
	// se ejecuta la función
	//
    vincularSocker(url, port){

        this.socketParaResponder.bind(url+":"+port, function(err) {
            if(err)
                console.log(err)
            else
                console.log("Listening on "+port+"...")
        })
    }

 

    //
	// doy la función que debe ejecutarse cuando
	// llegue un mensaje al socket
	//
    recibirMensaje(){

        this.socketParaResponder.on('message', function(peticionQueRecibo) {
        this.cont++;
            // informo por pantalla
		console.log("servidor recibo petición: " +this.cont + " [", peticionQueRecibo.toString(), "]")
        // hago algo de "trabajo": esperar algunos segundos
		// y entonces ejecutar el callback, en el cuál respondemos
		// 
        let miArr=["12:05","12:00", "12:10", "12:02", "12:04","12:03"]
        let promedio = tiempoPromedio(miArr)    
        //this.responder(peticionQueRecibo)
       
            
        }.bind(this))
    }

    responder(peticionQueRecibo){
        // setTimeout = encargar algo para dentro de un tiempo
        setTimeout(function(){
            //respondemos
            console.log("servidor respondo petición: " + this.cont )
            if(this.socketParaResponder){
                let messaje = JSON.parse(peticionQueRecibo.toString());
                messaje.contenido= " respuesta desde servidor, " + " echo de "
                this.socketParaResponder.send(JSON.stringify(messaje))
            }
        }.bind(this),1000)
    }

    checkSalida(){
        process.on('SIGINT', function() {
            console.log (" sigint capturada ! ")
            console.log (" hasta luego Lucas! ")
            this.socketParaResponder.close()
            // socketParaResponder = null
        }.bind(this))
    }
 }
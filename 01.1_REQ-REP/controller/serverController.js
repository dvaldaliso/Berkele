import * as zmq from "zeromq"
import { tiempoPromedio } from "../util/claculo.js";
import Mensaje from "../model/mensaje.js";
 export default class ServerController{
    constructor(url, port, nombre, tiempo){
        console.log("Connecting to hello world server..."+nombre+" tiempo "+tiempo)
        // creo un socket (de la biblioteca zeromq)
        this.socketParaResponder = zmq.socket('req') //// de tipo REP (reply)
        this.cont=0;
        this.nombre=nombre
        this.tiempo=tiempo
        this.timeClient=[tiempo]
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
    async vincularSocker(url, port){

       this.socketParaResponder.bind(url+":"+port, function(err) {
            if(err)
                console.log(err)
            else{
                console.log("Listening on "+port+"...")
                this.dameHora(new Mensaje(0,"dame hora","12:00"))
            }
                

        }.bind(this))
    }



    //
	// doy la función que debe ejecutarse cuando
	// llegue un mensaje al socket
	//
    recibirMensaje(){

        this.socketParaResponder.on('message', function(peticionQueRecibo) {``
        this.cont++;
            // informo por pantalla
		console.log("servidor recibo petición: " +this.cont + " [", peticionQueRecibo.toString(), "]")
        // hago algo de "trabajo": esperar algunos segundos
		// y entonces ejecutar el callback, en el cuál respondemos
		// 
        let message = JSON.parse(peticionQueRecibo);
        this.timeClient.push(message.tiempo)
        let promedio = tiempoPromedio(this.timeClient)   
        console.log("promedio: "+promedio) 
        //this.responder(peticionQueRecibo)
        
        this.dameHora(message)
            
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
    dameHora(message){
        console.log("dame hora: ")
        setTimeout(function(){
            if(this.socketParaResponder){
                message.contenido= " dame hora from "+this.nombre
                message.tiempo= this.tiempo
                const messageString = JSON.stringify(message);
                this.socketParaResponder.send(messageString)
            }
        }.bind(this,message),6000)
        
    }
    checkSalida(){
        process.on('SIGINT', function() {
            console.log (" sigint capturada ! ")
            console.log (" hasta luego "+this.nombre)
            this.socketParaResponder.close()
            // socketParaResponder = null
        }.bind(this))
    }
 }
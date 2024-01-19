import * as zmq from "zeromq"
import { tiempoPromedio } from "../util/claculo.js";
import Mensaje from "../model/mensaje.js";
 export default class ServerController{
    /**
     * 
     * @param {*} url 
     * @param {*} port 
     * @param {*} tiempo 
     */
    constructor(url, port, tiempo){
        console.log("Connecting to hello world server... master tiempo "+tiempo)
        // creo un socket (de la biblioteca zeromq)
        this.socketParaPedir = zmq.socket('req') //// de tipo RE (reply)
        this.cont=0;
        this.nombre="master"
        this.tiempo=tiempo
        this.timeClient=[]
        // Este indice lo uso para saber que recibido, de todos.
        // Todos los hijos responden con un indice de respuesta,
        // cuando este cambia, es que es otra respuesta de todos.
        this.indiceCalculo=1;
        this.vincularSocker(url,port)
        this.#dameHora(new Mensaje(1, this.nombre,"dame hora",tiempo))
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

       this.socketParaPedir.bind(url+":"+port, function(err) {
            if(err)
                console.log(err)
            else{
                console.log("Listening on "+port+"...")
                
            }

        }.bind(this))
    }
    //
	// doy la función que debe ejecutarse cuando
	// llegue un mensaje al socket
	//
    recibirMensaje(){

        this.socketParaPedir.on('message', function(peticionQueRecibo) {
        this.cont++;
            // informo por pantalla
		console.log("servidor recibo petición: " +this.cont + " [", peticionQueRecibo.toString(), "]")
        // hago algo de "trabajo": esperar algunos segundos
		// y entonces ejecutar el callback, en el cuál respondemos
		// 
        let message = JSON.parse(peticionQueRecibo);
        
        // Si cambia el indice es que ya tengo todas las respuestas

        if (this.indiceCalculo!=message.cont){
            this.#calcularHora(message)
        }
        this.timeClient[message.from]=message.tiempo;
        
        
        this.#dameHora(message)
            
        }.bind(this))
    }

    #calcularHora(message){
        
        let promedio = tiempoPromedio(this.timeClient)   
        console.log("promedio: "+promedio)
        return promedio 
    }


   

    #dameHora(message){
        setTimeout(function(){
            console.log("dame hora")
            if(this.socketParaPedir){
                    
                    const messageString = JSON.stringify(message);
                    this.socketParaPedir.send(messageString)
            }
        }.bind(this,message),6000)
    }



    checkSalida(){
        process.on('SIGINT', function() {
            console.log (" sigint capturada ! ")
            console.log (" hasta luego "+this.nombre)
            this.socketParaPedir.close()
            // socketParaPedir = null
        }.bind(this))
    }
 }
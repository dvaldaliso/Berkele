import * as zmq from "zeromq"
import { tiempoPromedio } from "../util/claculo.js";
import Mensaje from "../model/mensaje.js";
 export default class CoordinadorController{
    /**
     * 
     * @param {*} url 
     * @param {*} port 
     * @param {*} tiempo 
     */
    constructor(url, port, tiempo){
        console.log("Connecting to hello world server... master tiempo "+tiempo)
        // creo un socket (de la biblioteca zeromq)
        this.socketRouter = zmq.socket('router') 
        this.cont=0;
        this.nombre="master"
        this.tiempo=0
        this.client=[]
        this.cantidadNodosPermitidos=2
        this.vincularSocker(url,port)
        this.recibirMensaje()
        this.checkSalida()
        this.volverAPedirHoras=false;
    }
   
    vincularSocker(url, port){

       this.socketRouter.bind(url+":"+port, function(err) {
            if(err)
                console.log(err)
            else{
                console.log("Listening on "+port+"...")
                
            }

        }.bind(this))
    }
   
    recibirMensaje(){

        this.socketRouter.on('message', function(identity, respuesta) {
        this.cont++;
        respuesta = JSON.parse(respuesta.toString());
        
        //registrarCliente method 
        if( respuesta.message=="connected"){
		    console.log("connected cliente: "+identity )

            this.client.push({id:identity})
         }
         
         if(respuesta.message=="connected" && 
            this.client.length==this.cantidadNodosPermitidos){
            this.dameHora()
            this.client=[]

         }

         if(respuesta.message=="diferencia"){
            console.log("recibe diferencias")
            this.client.push({id:identity,diff:respuesta.value})
            if(this.client.length==this.cantidadNodosPermitidos){
                this.ajusteHora()
            }
         }
      
        }.bind(this))
    }



    ajusteHora(){
        console.log("ajuste de hora")
        let sumAjust=0
        this.client.forEach(element => {
            let diferencia= Math.abs(new Date() - this.tiempo);
            let ajuste = element.diff - (diferencia/2);
            element.ajuste=ajuste;
            sumAjust+=ajuste
        });

       let ajuste = sumAjust/(this.cantidadNodosPermitidos+1)

       this.client.forEach(client => {
            let ajusteClient = ajuste - client.ajuste
            let messageSend={message:"ajuste", valor:ajusteClient}
            const messageString = JSON.stringify(messageSend);
            this.socketRouter.send([client.id,messageString])
       });
       this.volverAPedirHoras=true

    }

   

    dameHora(){
        this.volverAPedirHoras=false
            if(this.socketRouter){
                console.log("request for diference")
                this.tiempo=new Date()
                let message={message:"dame_diferencia",tiempo:this.tiempo}        
                const messageString = JSON.stringify(message);
                 this.client.forEach(client => {
                    this.socketRouter.send([client.id,messageString])
                });     
                   
            }
    }



    checkSalida(){
        process.on('SIGINT', function() {
            console.log (" sigint capturada ! ")
            console.log (" hasta luego "+this.nombre)
            this.socketRouter.close()
            process.exit(0)
            // socketParaPedir = null
        }.bind(this))
    }
 }
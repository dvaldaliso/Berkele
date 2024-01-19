export default class Mensaje {
    constructor(cont, from, contenido, tiempo) {
        this.from=from
        this.cont=cont
        this.contenido = "Hello " + cont + " desde " + contenido
        this.tiempo = tiempo
        this.diferencia=0       
        
    }
}
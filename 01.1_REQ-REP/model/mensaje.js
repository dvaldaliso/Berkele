export default class Mensaje {
    constructor(id, contenido, tiempo) {
        this.id=id
        this.contenido = "Hello " + id + " desde " + contenido
        this.tiempo = tiempo       
        
    }
}
/**
 * 
 * @param {*} listTiempo 
 * @returns 
 */
export function tiempoPromedio(listTiempo){
    const size=listTiempo.length
    if(size==0){
      return 0
    }
    let sum1 = 0
    for (var key in listTiempo)
  {
    //sumar horas
    sum1+=parseInt( listTiempo[key].split(":")[0] )*60
    //suma minutos
    sum1+=parseInt( listTiempo[key].split(":")[1] )
    //console.log(key , listTiempo[key])
  }
    
    const promedioEnMinutos = (sum1)/size
    const horasPromedio = (Math.floor(promedioEnMinutos / 60))
    const minutosPromedio = (Math.floor(promedioEnMinutos % 60))
    var resultado = horasPromedio.toString().padStart(2, '0') + ":" + minutosPromedio.toString().padStart(2, '0');
    return resultado
}
/**
 * 
 * @param {*} tiempo1 
 * @param {*} tiempo2 
 * @returns 
 */
export function diferenciaEntreHoras(tiempo1, tiempo2){
    const tiempo1EnMinutos = parseInt(tiempo1.split(":")[0])*60 + parseInt(tiempo1.split(":")[1])
    const tiempo2EnMinutos = parseInt(tiempo2.split(":")[0])*60 + parseInt(tiempo2.split(":")[1])
    return tiempo1EnMinutos - tiempo2EnMinutos
}
/**
 * 
 * @param {*} tiempo 
 * @param {*} min 
 * @returns 
 */
export function actualizarHora(tiempo, min){
  
  const tiempoEnMinutos = parseInt(tiempo.split(":")[0])*60 + parseInt(tiempo.split(":")[1])
  const timeActual=tiempoEnMinutos + min;
  const horas = (Math.floor(timeActual / 60))
  const minutos = (Math.floor(timeActual % 60))
  var resultado = horas.toString().padStart(2, '0') + ":" + minutos.toString().padStart(2, '0');
  return resultado
}

export function eliminarElementoFromArray(arrayDeObjetos,objeto){

// Encontrar el índice del objeto que deseas eliminar (por ejemplo, con el id 2)
let indiceAEliminar = arrayDeObjetos.findIndex(objeto => objeto.id === objeto.id);

// Verificar si el objeto existe en el array antes de intentar eliminarlo
if (indiceAEliminar !== -1) {
  // Utilizar splice para eliminar el objeto en el índice encontrado
  arrayDeObjetos.splice(indiceAEliminar, 1);
} else {
  console.log("El objeto no existe en el array.");
}
return arrayDeObjetos
}
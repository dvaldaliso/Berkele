export function tiempoPromedio(listTiempo){
    const size=listTiempo.length
    if(size==0){
      return 0
    }
    let sum1 = 0
    let sum2 = 0;
    for (let i = 0; i< size-1; i+=2) {
      //sumar horas
      sum1+=parseInt( listTiempo[i].split(":")[0] )*60
      sum2+=parseInt( listTiempo[i].split(":")[0] )*60       
      //suma minutos
      sum1+=parseInt( listTiempo[i].split(":")[1] )
      sum2+=parseInt( listTiempo[i+1].split(":")[1] )
    }
    const promedioEnMinutos = (sum1+sum2)/size
    const horasPromedio = (Math.floor(promedioEnMinutos / 60))
    const minutosPromedio = (Math.floor(promedioEnMinutos % 60))
    var resultado = horasPromedio.toString().padStart(2, '0') + ":" + minutosPromedio.toString().padStart(2, '0');
    return resultado
}



class Animal {
    constructor (situacion,tipoAnimal,raza,descripcion,nombre,fecha,latitud,longitud) {
        this.situacion = situacion;
        this.tipoAnimal = tipoAnimal;
        this.raza = raza;
        this.nombre = nombre ?? "";
        this.descripcion = descripcion ?? "";
        this.fecha = fecha ?? "";;
        this.latitud = latitud ?? "";;
        this.longitud = longitud ?? "";;
    }

}
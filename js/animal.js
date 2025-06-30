
class Animal {
    constructor (situacion,tipoAnimal,raza,descripcion,nombre) {
        this.situacion = situacion;
        this.tipoAnimal = tipoAnimal;
        this.raza = raza;
        this.descripcion = descripcion;
        this.nombre = nombre ?? "";
    }

}
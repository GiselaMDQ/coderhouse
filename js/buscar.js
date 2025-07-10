let listaAnimales;

//     document.getElementById("botonBuscar").addEventListener("click", function() {
//     console.log("Se ejecuta el boton buscar")
//     buscar(listaAnimales);
        
//  });


document.getElementById("formularioBuscar").addEventListener("submit", function (e) {
    let situacion = document.querySelector('input[name="opcionesBuscar"]:checked');
    let errorDiv = document.getElementById("errorTipoBuscar");
    
    if (!situacion) {
        errorDiv.style.display = "block";
        e.preventDefault(); 
    }

    else {
        let selectTipoAnimal = document.querySelector("#tipoAnimalBuscado");
        let tipoAnimal = selectTipoAnimal.value;
        let raza = document.querySelector('#razaBuscado');
        let errorDiv = document.getElementById("errorTipoBuscar");

        let animalBuscado = new Animal (situacion.value,tipoAnimal,raza.value.toUpperCase(),"","","","","");

        sessionStorage.setItem ("animalBuscado",JSON.stringify(animalBuscado));


        document.getElementById("formularioBuscar").reset();
        errorDiv.style.display = "none";
        sinReportados.style.display = "none";
    }

});


var puntuacio = function(){
    var jugador = {
        nom: "Ferran",
        puntuacio: 0
    };

    var listJugadors = [jugador];

    var load = function(){
        var json = localStorage.getItem("score")||"[]"; //Si no hi ha dades crea una llista buida
        listJugadors = JSON.parse(json);
    };
    var save = function(){
        localStorage.setItem("score", JSON.stringify(listJugadors));
    };
    load();
}
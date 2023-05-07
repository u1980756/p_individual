"use strict";
const back = "../resources/back.png";
const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
"../resources/so.png","../resources/tb.png","../resources/to.png"];
const itemsName = ["cb", "co", "sb", "so", "tb","to"];
const itemsName2 = ["cb", "cb", "co", "co", "sb", "sb", "so", "so", "tb", "tb","to","to"];

var options_data2 = {
    cards:2, 
    dificulty:"hard", 
    startlevel: 1, 
    mode:"mode2",
    score: 100
};

function Poscicio(x,y,ocupat, ordre){
    this.x=x;
    this.y=y;
    this.ocupat = ocupat;
    this.ordre = ordre;
}

//max 12
var Posicions = [new Poscicio(250,100,false,0), new Poscicio(350,100,false,1), new Poscicio(450,100,false,2), new Poscicio(550,100,false,3),
                    new Poscicio(250,232,false,4), new Poscicio(350,232,false,5), new Poscicio(450,232,false,6), new Poscicio(550,232,false,7), 
                    new Poscicio(250,364,false,8), new Poscicio(350,364,false,9), new Poscicio(450,364,false,10), new Poscicio(550,364,false,11), 
];

/*
level 1:
	2000 segons cartes
	2 cartes
	fallo per click 1
*/
function Nivell(s,c,f){
    this.s = s;
    this.c = c;
    this.f = f;
}

var Nivells = [new Nivell(0,0,0), new Nivell(2000,2,1), new Nivell(1500,2,2), new Nivell(1000,2,3), new Nivell(500,2,4), new Nivell(0,2,5),
     new Nivell(2000,3,10), new Nivell(1500,3,15), new Nivell(1000,3,20), new Nivell(500,3,25), new Nivell(0,3,30), 
     new Nivell(2000,4,35), new Nivell(0,4,40), new Nivell(1500,4,45), new Nivell(0,4,50), new Nivell(1000,4,55), 
     new Nivell(750,4,100), ]

class GameScene extends Phaser.Scene{
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
        this.bad_clicks = 0;
        
        this.name="";
        this.nCards = 2;
        this.startlevel= 1;
        this.mode = "mode1";
        this.dificulty = "easy";

        this.time = 200;
        this.factorDificulty = 20;
        this.canClik = true;
    }

    /*Recuperar la informació de options i preparar el joc*/
    preload(){
        /*RECUPERAR CARTES I DIFICULTAT*/
        var json = localStorage.getItem("config") || '{"username":"user", "cards":2, "startlevel":1, "mode":"mode1", "dificulty":"easy", "score":100}';
        var options_data = JSON.parse(json);
        options_data2 = options_data;

        console.log(options_data);
        this.nCards = options_data.cards; console.log("Cards: " + this.nCards);
        this.mode = options_data.mode; console.log("Mode: " + this.mode);
        this.startlevel = options_data.startlevel; console.log("starlevel: " + this.startlevel);
        this.dificulty = options_data.dificulty; console.log("Dificulty: " + this.dificulty);
        this.name = options_data.name; console.log("Name: " + this.name);

        //Cargar les imatges
        for(let n = 0; n<items.length; n++){
            this.load.image(itemsName[n],items[n]);
        }
        this.load.image('back', '../resources/back.png');

        if(this.mode=="mode1"){
            this.score = 100;
                //Segons la dificultat ajusta el temps i el multiplicado de clicks fallats
            if(this.dificulty == "hard"){
                this.factorDificulty = 30;
                this.time = 500;
            }else if(this.dificulty == "normal"){
                this.factorDificulty = 25;
                this.time = 1000;
            }
            else{
                this.factorDificulty = 20;
                this.time = 2000;
            }
            this.score = 100;
            
        }else{
            if(this.startlevel == 1){
                this.score = 100;
            }else{
                this.score = options_data.score;
            }
           
            if(this.startlevel < 16){ //El 16 es el "ultim nivell" mapejat, a partid d'aqui tots els nivells seran com el 16
                this.factorDificulty = Nivells[this.startlevel].f;
                this.time = Nivells[this.startlevel].s;
                this.nCards = Nivells[this.startlevel].c;
            }else{
                this.factorDificulty = Nivells[16].f;
                this.time = Nivells[16].s;
                this.nCards = Nivells[16].c;
            }
            
        }
        console.log("El multiplicador de diff és: " + this.factorDificulty);
        console.log("El temps d'espera és: " + this.time);
        console.log("El nombre de cartes és: " + this.nCards)
    }
    
    create(){
        

        if(this.mode == "mode1"){
            this.cameras.main.setBackgroundColor(0xBFFCFF);
            //Crear posicions random
            console.log("--------------> Crear posicions random")
            let arraycards = [];
            var max = this.nCards * 2;
            var n = 0;
            while(n<max){
                const nRandom = Math.floor(Math.random() * max);
                if(!Posicions[nRandom].ocupat){
                    Posicions[nRandom].ocupat = true;
                    arraycards[nRandom] = itemsName2[n];
                    console.log(nRandom);
                    n++;
                }
            }

            //Posar cartes i Mostrar Cartes
            for(n = 0; n<max;n++){
                this.add.image(Posicions[n].x, Posicions[n].y, arraycards[n]);
            }
            
            //Amagar Cartes i Jugar
            setTimeout(() => {
                this.cards = this.physics.add.staticGroup();
                for(n = 0; n<max;n++){
                    this.cards.create(Posicions[n].x, Posicions[n].y, 'back');
                }
                let i = 0;
                this.canClik = true;
                this.cards.children.iterate((card)=>{
                    card.card_id = arraycards[i];
                    i++;
                    card.setInteractive();
                    card.on('pointerup', () => {
                            if(this.canClik){
                                card.disableBody(true,true);
                                if (this.firstClick){
                                    if (this.firstClick.card_id !== card.card_id){
                                        this.score -= this.factorDificulty;
                                        this.firstClick.enableBody(false, 0, 0, true, true);
                                        this.canClik = false;
                                        setTimeout(()=>{//Afegir que al fer un error la segona carta es mostri durant un temps 
                                                card.enableBody(false, 0, 0, true, true);
                                                this.canClik = true;
                                            },this.time)
                                        if (this.score <= 0){
                                            alert("Game Over");
                                            loadpage("../");
                                        }
                                    }
                                    else{
                                        this.correct++;
                                        console.log(this.correct);
                                        if (this.correct >= this.nCards){
                                            alert("You Win with " + this.score + " points.");
                                            loadpage("../");
                                        }
                                    }
                                    this.firstClick = null;
                                }
                                else{
                                    this.firstClick = card;
                                }
                            }
                    }, card);
                        
                });
            }, this.time);
        }
        else{//<-----------------------------------Mode2-------------------------------------->
            this.cameras.main.setBackgroundColor(0xFF3D3D);
            let liveText = this.add.text(25, 50, 'Live: ' + this.score);
            this.add.text(25, 25, 'Nivell ' + this.startlevel);
            //Crear posicions random
            console.log("--------------> Crear posicions random")
            let arraycards = [];
            var max = this.nCards * 2;
            var n = 0;
            while(n<max){
                const nRandom = Math.floor(Math.random() * max);
                if(!Posicions[nRandom].ocupat){
                    Posicions[nRandom].ocupat = true;
                    arraycards[nRandom] = itemsName2[n];
                    console.log(nRandom);
                    n++;
                }
            }

            //Posar cartes i Mostrar Cartes
            for(n = 0; n<max;n++){
                this.add.image(Posicions[n].x, Posicions[n].y, arraycards[n]);
            }
            
            //Amagar Cartes i Jugar
            setTimeout(() => {
                this.cards = this.physics.add.staticGroup();
                for(n = 0; n<max;n++){
                    this.cards.create(Posicions[n].x, Posicions[n].y, 'back');
                }
                let i = 0;
                this.canClik = true;
                this.cards.children.iterate((card)=>{
                    card.card_id = arraycards[i];
                    i++;
                    card.setInteractive();
                    card.on('pointerup', () => {
                            if(this.canClik){
                                card.disableBody(true,true);
                                if (this.firstClick){
                                    if (this.firstClick.card_id !== card.card_id){
                                        this.score -= this.factorDificulty;
                                        this.firstClick.enableBody(false, 0, 0, true, true);
                                        this.canClik = false;
                                        setTimeout(()=>{//Afegir que al fer un error la segona carta es mostri durant un temps 
                                                card.enableBody(false, 0, 0, true, true);
                                                this.canClik = true;
                                            },this.time)
                                        if (this.score <= 0){
                                            this.score = this.startlevel*100 + this.correct;

                                            ///
                                            function Persona(score, nom){
                                                this.score = score;
                                                this.nom = nom;
                                            }
                                            options_data2.startlevel = 1;
                                            var p = new Persona(this.score, this.name);
                                            console.log("Score: " + this.score + " Name: " + this.name)

                                            if (!Array.isArray(options_data2.records)) {
                                                options_data2.records = [p];
                                                localStorage.setItem("config", JSON.stringify(options_data2));
                                            }else{
                                                options_data2.records.push(p);
                                                options_data2.records.sort((a, b) => b.score - a.score);
                                                localStorage.setItem("config", JSON.stringify(options_data2));
                                            }
                                            ///

                                            alert("Game Over, you make: " + this.score + "points");
                                            loadpage("../");
                                        }
                                    }
                                    else{
                                        this.correct++;
                                        console.log(this.correct);
                                        if (this.correct >= this.nCards){
                                            ////
                                            options_data2.mode="mode2";
                                            options_data2.score=this.score;
                                            options_data2.startlevel= this.startlevel +1;
                                            localStorage.setItem("config", JSON.stringify(options_data2));
                                            /////
                                            loadpage("./phasergame.html");
                                        }
                                    }
                                    this.firstClick = null;
                                }
                                else{
                                    this.firstClick = card;
                                }
                            }
                            liveText.setText('Vida '+ this.score);
                    }, card);
                        
                });
            }, this.time);
        }
    }
    update() {
    }
}
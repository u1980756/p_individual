const back = "../resources/back.png";
const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
"../resources/so.png","../resources/tb.png","../resources/to.png"];

var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		num_cards: 2,
		bad_clicks: 0,
		isStart: false,
		time: 2000
	},
	created: function(){
		/*RECUPERAR CARTES I DIFICULTAT*/
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
		options_data = JSON.parse(json);
		console.log(options_data.cards);
		this.num_cards = options_data.cards;
		console.log(this.num_cards);
		/*---------------------------*/

		//Segons la dificultat ajusta el temps i el multiplicado de clicks fallats
		if(options_data.dificulty == "hard"){
			options_data.dificulty = 30;
			time = 500;
		}else if(options_data.dificulty == "normal"){
			options_data.dificulty = 25;
			time = 1000;
		}
		else{
			options_data.dificulty = 20;
			time = 2000;
		}

		console.log("El multiplicador de diff és: " + options_data.dificulty)
		console.log("El temps d'espera és: " + this.time)
		
		

		this.username = sessionStorage.getItem("username","unknown");
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		for (var i = 0; i < this.items.length; i++){
			this.current_card.push({done: false, texture: back});
		}

		//Aqui mostrem les cartes
		for(var i = 0; i < this.items.length; i++){
			console.log(i + " Girada");
			Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}

		//Quan passi 1 segon amagara les cartes
		setTimeout(() => {
			console.log("Delay 1 second");
			
			for(var i = 0; i < this.items.length; i++){
				console.log(i + " Girada");
				Vue.set(this.current_card, i, {done: false, texture: back});
			}
			game.isStart = true;
			
		}, time);

	},
	methods: {
		clickCard: function(i){
			if (!this.current_card[i].done && this.current_card[i].texture === back)
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}
	},
	watch: {
		current_card: function(value){
			if(!game.isStart) return;
			if (value.texture === back) return;
			var front = null;
			var i_front = -1;
			for (var i = 0; i < this.current_card.length; i++){
				if (!this.current_card[i].done && this.current_card[i].texture !== back){
					if (front){
						if (front.texture === this.current_card[i].texture){
							front.done = this.current_card[i].done = true;
							this.num_cards--;
						}
						else{
							Vue.set(this.current_card, i, {done: false, texture: back});
							Vue.set(this.current_card, i_front, {done: false, texture: back});
							this.bad_clicks++;
							break;
						}
					}
					else{
						front = this.current_card[i];
						i_front = i;
					}
				}
			}			
		}
	},
	computed: {
		score_text: function(){
			return 100 - this.bad_clicks * options_data.dificulty;
		}
	}
});






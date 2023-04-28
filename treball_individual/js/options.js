var options = function(){
	// Aquí dins hi ha la part privada de l'objecte
	var options_data = {
		cards:2, 
		dificulty:"hard", 
		startlevel: 1, 
		mode:"mode1"
	};
	var load = function(){
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard","startlevel":1,"mode":"mode1"}';
		options_data = JSON.parse(json);
	};
	var save = function(){
		localStorage.setItem("config", JSON.stringify(options_data));
	};
	load();

	var vue_instance = new Vue({
		el: "#options_id",
		data: {
			num: 2,
			dificulty: "hard",
			firstlevel: 1,
			mode: "mode1"
		},
		created: function(){
			this.num = options_data.cards;
			this.dificulty = options_data.dificulty;
			this.firstlevel = options_data.startlevel;
			this.mode = options_data.mode;
		},
		watch: {
			num: function(value){ /*S'encarregara que el nombre de cartes estigui dintre del interval [2,4]*/
				if (value < 2)
					this.num = 2;
				else if (value > 4)
					this.num = 4;
			},
			firstlevel: function(value){ /*S'encarregara de comprobar que el nivell de començament mai sigui inferior a 1*/
				if(value < 1)
					this.firstlevel = 1;
			}
			
		},
		methods: { 
			discard: function(){
				this.num = options_data.cards;
				this.dificulty = options_data.dificulty;
				this.firstlevel = options_data.startlevel;
				this.mode = options_data.mode;
			},
			save: function(){
				options_data.cards = this.num;
				options_data.dificulty = this.dificulty;
				options_data.startlevel = this.firstlevel;
				options_data.mode = this.mode;
				save();
				loadpage("../");
			}
		}
	});
	return {
		// Aquí dins hi ha la part pública de l'objecte
		getOptionsString: function (){
			return JSON.stringify(options_data);
		},
		getNumOfCards: function (){
			return options_data.cards;
		},
		getDificulty: function (){
			return options_data.dificulty;
		},
		getStartLevel: function(){
			return options_data.startlevel;
		},
		getMode: function(){
			return options_data.mode;
		}
	}; 
}();

console.log(options.getOptionsString());
console.log("NumOfCards: " + options.getNumOfCards());
console.log("Difficulty: " + options.getDificulty());
console.log("StartLevel: " + options.getStartLevel());
console.log("Mode: " + options.getMode());





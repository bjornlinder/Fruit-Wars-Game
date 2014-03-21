// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
	// A 2D array to keep track of all occupied tiles
	this.occupied = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		this.occupied[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			this.occupied[i][y] = false;
		}
	}
 
	// Player character, placed at 5, 5 on our grid
	this.player = Crafty.e('PC').at(10, 5);
	this.occupied[this.player.at().x][this.player.at().y] = true;
 
	// Place a tree at every edge square on our grid of 16x16 tiles
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
			if (at_edge) {
				// Place a tree entity at the current tile
				Crafty.e('Tree').at(x, y)
				this.occupied[x][y] = true;
			} 
		}
	}
  
  // Scoreboard
	scoreboard = Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 15 }).text('Look at me!! Score: ' + score)
	   .textColor('#ffffff', 1.6);
     https://groups.google.com/forum/#!topic/craftyjs/wO-0cYN8Dy4
     // bind to death events
     //Score boards
     // Crafty.e("LeftPoints, DOM, 2D, Text")
     //   .attr({ x: 20, y: 20, w: 100, h: 20, points: 0 })
     //   .text("0 Points");
     
 	//CREATE PATH FOR MINONS OF DARKNESS
  // for (var x = 0; x < Game.map_grid.width; x++) {
  //   this.occupied[x][3] = true;
  // }
	
	creep_count = 14;
	spawn_interval = 800;
	
  // Crafty.c('HellishPortal', {
  //   init: function() {
  //     this.requires('Delay');
  //   },
  // });
  
	//Spawn the army of darkness
	Crafty.e("Delay").delay(function() {
		Crafty.e("Creep").at(3,3);
	},	spawn_interval, creep_count - 1	//will need to update the creep count/clean method.
	);
	
	// Generate five villages on the map in random locations
	var max_villages = 5;
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (Math.random() < 0.03) {
				if (Crafty('Village').length < max_villages && !this.occupied[x][y]) {
					Crafty.e('Village').at(x, y);
				}
			}
			else if (Math.random() < 0.09 && !this.occupied[x][y]) {
				// Place a bush entity at the current tile
				var bush_or_rock = (Math.random() > 0.3) ? 'Bush' : 'Rock'
				Crafty.e(bush_or_rock).at(x, y)
				this.occupied[x][y] = true;
			}
		}
	}
 
	// Play a ringing sound to indicate the start of the journey
	Crafty.audio.play('ring');
 
	// Show the victory screen once all villages are visisted
  // this.show_victory = this.bind('VillageVisited', function() {
  //   if (!Crafty('Village').length) {
  //     Crafty.scene('Victory');
  //   }
  // });
  
	this.show_result = this.bind('Death', function() {
//    debugger
		if (!Crafty('PC').length) {
			Crafty.scene('Failure');
		}
		else if (!Crafty('Creep').length) {
			Crafty.scene('Victory');
		}
	});
  
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('VillageVisited', this.show_result);
});
 
 
// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
	// Display some text in celebration of the victory
	Crafty.e('2D, DOM, Text')
		.text('You Make a Fruit Smoothie.')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.textFont($text_css);
 
	// Give'em a round of applause!
//	Crafty.audio.play('applause');
 
	// After a short delay, watch for the player to press a key, then restart
	// the game when a key is pressed
	var delay = true;
	setTimeout(function() { delay = false; }, 5000);
	this.restart_game = function() {
		if (!delay) {
			Crafty.scene('Game');
		}
	};
	Crafty.bind('KeyDown', this.restart_game);
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('KeyDown', this.restart_game);
});

Crafty.scene('Failure', function() {
	// Display some text in celebration of the victory
	Crafty.e('2D, DOM, Text')
		.text('Your Hero Has Been Slain By Rotten Fruit!')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.textFont($text_css);

	// After a short delay, watch for the player to press a key, then restart
	// the game when a key is pressed
	var delay = true;
	setTimeout(function() { delay = false; }, 5000);
	this.restart_game = function() {
		if (!delay) {
			Crafty.scene('Game');
		}
	};
	Crafty.bind('KeyDown', this.restart_game);
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('KeyDown', this.restart_game);
});

 
// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
	// Draw some text for the player to see in case the file
	//  takes a noticeable amount of time to load
	Crafty.e('2D, DOM, Text')
		.text('Loading; please wait...')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.textFont($text_css);
 
	// Load our sprite map image
	Crafty.load([
		'assets/fruit.png',
		'assets/16x16_forest_2.gif',
		'assets/hunter.png',
		'assets/door_knock_3x.mp3',
		'assets/door_knock_3x.ogg',
		'assets/door_knock_3x.aac',
		'assets/board_room_applause.mp3',
		'assets/board_room_applause.ogg',
		'assets/board_room_applause.aac',
		'assets/candy_dish_lid.mp3',
		'assets/candy_dish_lid.ogg',
		'assets/candy_dish_lid.aac'
		], function(){
		// Once the images are loaded...
 
		// Define the individual sprites in the image
		// Each one (spr_tree, etc.) becomes a component
		// These components' names are prefixed with "spr_"
		//  to remind us that they simply cause the entity
		//  to be drawn with a certain sprite
		Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
			spr_tree:    [0, 0],
			spr_bush:    [1, 0],
			spr_village: [0, 1],
			spr_rock:    [1, 1]
		});
 
		// Define the PC's sprite to be the first sprite in the third row of the
		//  animation sprite map
		Crafty.sprite(16, 'assets/hunter.png', {
			spr_player:  [0, 2],
		}, 0, 2);
		
		Crafty.sprite(28, 'assets/fruit.png', {
			spr_cherry:  [3, 1],
			spr_apple:  [0, 0],
			spr_banana:  [5, 3],
		});
 
		// Define our sounds for later use
		Crafty.audio.add({
			knock:    ['assets/door_knock_3x.mp3', 'assets/door_knock_3x.ogg', 'assets/door_knock_3x.aac'],
			applause: ['assets/board_room_applause.mp3', 'assets/board_room_applause.ogg', 'assets/board_room_applause.aac'],
			ring:     ['assets/candy_dish_lid.mp3', 'assets/candy_dish_lid.ogg', 'assets/candy_dish_lid.aac']
		});
 
 
    score = 0;
    // levels = 2;//next make this infinite
		//wave count incrementing
    // Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 }).text('Look at me!! Score: ' + score)
    //    .textColor('#FF0000', 0.6);
 
		// Now that our sprites are ready to draw, start the game
		Crafty.scene('Game');
	});
});
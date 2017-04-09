// CONSTANT
const KEY_LEFT = 37 , KEY_UP = 38 , KEY_RIGHT = 39 , KEY_DOWN = 40, KEY_TURNL = 219, KEY_TURNR = 221;
var countT, countS, countX, countI, countL;

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(10, 10);	

	


let player = {
	matrix: createPiece(piece),
	pos: {x: 5, y: -1}
}


function draw (){
	context.fillStyle = "#ccfff2";
	context.fillRect(0, 0, canvas.width, canvas.height);
	drawMatrix(player.matrix, player.pos);
	drawMatrix(arena, {x:0, y:0});
}

let frame = 0;
let arena = createMatrix(20, 35);


function drawMatrix(matrix, offset){
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
				if(value !== 0){
					context.fillStyle = "#ff0000";
					context.fillRect(x + offset.x , y + offset.y , 1, 1);

				}
			})
	})
};

function createMatrix(w, h){
	var matrix = [];
	for( var i = 0; i < h; i ++){
		matrix.push([]);
		for(var y = 0; y < w; y ++){
			matrix[i].push(0);
		}
	}
	return matrix
}

var piece = function randomPiece(){
	let i = Math.floor(Math.random()*10);
	switch(i ){ 
		case 1:
			piece = "T";
			break;
		case 2:
			piece = "O";
			break;
		case 3:
			piece = "Z";
			break;
		case 4:
			piece = "L";
			break;
		case 5:
			piece = "S";
			break;
		case 6:
			piece = "J";
			break;
		case 7:
			piece = "I";
			break;
	};
	return piece;
}

function createPiece(piece){
	if( piece === "T"){
		return 	[
					[0, 0, 0],
					[1, 1, 1],
					[0, 1, 0]
				]
	} else if (piece === "O"){
		return	[
					[1, 1],
					[1, 1],
				]
	} else if (piece === "I"){
		return	[
					[0, 1, 0, 0],
					[0, 1, 0, 0],
					[0, 1, 0, 0],
					[0, 1, 0, 0]
				]
	} else if (piece === "S"){
		return 	[
					[0, 1, 1],
					[1, 1, 0],
					[0, 0, 0]
				]
	} else if (piece === "L"){
		return 	[
					[0, 1, 0],
					[0, 1, 0],
					[0, 1, 1]
				]
	} else if (piece === "J"){
		return 	[
					[0, 1, 0],
					[0, 1, 0],
					[1, 1, 0]
				]
	} else if (piece === "Z"){
		return 	[
					[1, 1, 0],
					[0, 1, 1],
					[0, 0, 0]
				]
	}
}

function collide(arena, player){
	let m = player.matrix;
	let o = player.pos;
	for( let y = 0; y < m.length; y ++){
		for( let x = 0; x < m[y].length; x ++){
			if(m[y][x] !== 0 &&
				(arena[y + o.y]  &&	
				arena[y +o.y][x + o.x]) !== 0){
				return true;
			}
		}
	}
	return false;
}

function merge(arena, player){
	player.matrix.forEach(
		(row, y) => {
			row.forEach((value, x) =>{
				if(value !== 0){ arena[y + player.pos.y][x + player.pos.x] = value };
			});
		});
}

function playerDrive(dir){
	player.pos.x += dir;
	if(collide(arena, player)){
		player.pos.x -= dir;
	}
}

function playerDrop(){
	player.pos.y ++;
	if(collide(arena, player)){
		player.pos.y --;
		merge(arena, player);
		player.pos.y = 0;
	}
}

function rotate(matrix, dir) {
	for( let y = 0; y < matrix.length; y ++) {
		for (var x = 0; x < y; x ++) {
			[
				matrix[y][x],
				matrix[x][y]
			] = [
				matrix[x][y],
				matrix[y][x]
			]
		}
	}
	if(dir > 0){
		matrix.forEach(row => row.reverse());
	} else {
		matrix;
	}
}

function playerRotate(dir){
	rotate(player.matrix, dir);
	let offset = 1;
	while(collide(arena, player)){
		player.pos.x += offset;
		offset = -(offset + ( offset > 0 ? 1 : -1));
		
	}
}

	function check(){
		for(let i = 0; i < arena.length; i ++){
			let count = 0;
			for (let y = 0; y < arena[0].length; y ++){
				if( arena[i][y] === 1){ count ++};
			}
			if(count === arena[0].length-1){
				return true;
			}
			return false;
		}
	}
	

function update(){
	frame ++;
	if(frame%60 === 0){
		playerDrop();
	}

	draw();
	requestAnimationFrame(update);
	check();
}

document.addEventListener("keydown", kev => {
	if(kev.keyCode === KEY_LEFT){ playerDrive(-1) };
	if(kev.keyCode === KEY_RIGHT){ playerDrive(1) };
	if(kev.keyCode === KEY_DOWN){ playerDrop()};
	if(kev.keyCode === KEY_TURNL){ playerRotate( 1)};
	if(kev.keyCode === KEY_TURNR){ playerRotate( -1)};
})

update();
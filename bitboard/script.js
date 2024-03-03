const board_element = document.querySelector("#chessboard");
const number_element = document.querySelector("#number-input");

number_element.addEventListener("input", (event) => {
	number_changed(event);
});

const file_to_col = { a: 0,  b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
const col_to_file = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];

const options = {
	single_bitboard: Symbol("single bitboard"),
	chessboard: Symbol("single bitboard"),
	zero: "a1" // "endianness" i.e. a1 is zero or a8 is zero"
}

function get_row_col_from_id(id)
{
	let row = parseInt(id[1]);
	let col = file_to_col[id[0]];

	return [row, col];
}

function get_cell_from_row_col(row, col)
{
	let id = col_to_file[col] + row;
	
	return document.getElementById(id);
}

function createBoard() {
	for(let row=0; row<8; row++) {
		for(let col=0; col<8; col++) {
			let id = col_to_file[col] + (row + 1);

			// Create square
			let square = document.createElement("div");
			square.classList.add("square");
			square.id = id;
			square.tabIndex = 0;
			if(row % 2 === 0)
				square.classList.add(col % 2 === 0 ? "dark-square" : "light-square");
			else
				square.classList.add(col % 2 === 0 ? "light-square" : "dark-square");
			square.setAttribute("index", row*8+col);
			board_element.append(square);

			square.addEventListener("click", (event) => {
				square_click(event);
			});
		}
	}
}
/*
function square_mouse_enter(event) {
	let id = event.target.id;
	let overlay = document.getElementById(id+"-overlay");
	overlay.style.visibility = "visible";
}

function square_mouse_leave(event) {
	let id = event.target.id;

	let overlay = document.getElementById(id+"-overlay");
	overlay.style.visibility = "hidden";
}
*/
function update_number() {
	let matrix = ""
	let number = BigInt("0");
	for(let row=0; row<8; row++) {
		for(let col=0; col<8; col++) {
			let index = row * 8 + col;
			let rank = row + 1;
			if(options.zero == "a8")
				rank = 8 - row;
			let file = col_to_file[col];
			let id = file + rank;
			let square = document.getElementById(id);
			if(square.textContent == "X") {
				number += 1n << BigInt(index);
				matrix += "1 "
			}
			else
				matrix += "0 "
		}
		matrix = matrix.slice(0, -1);
		matrix += "\n";
	}
	let str = number.toString(16);
	//str = str.padStart(16, '0');
	str = str.toUpperCase();
	//str += "\n\n0b" + number.toString(2) ;
	number_element.value = str;
}

function update_board(number) {
	for(let row=0; row<8; row++) {
		for(let col=0; col<8; col++) {
			let index = row * 8 + col;
			let rank = row + 1;
			if(options.zero == "a8")
				rank = 8 - row;
			let file = col_to_file[col];
			let id = file + rank;
			let square = document.getElementById(id);
			if((number >> BigInt(index)) & 1n)
				square.textContent = "X";
			else
				square.textContent = "";
		}
	}
}

function square_click(event) {
	if(event.target.textContent == "")
		event.target.textContent = "X"
	else
		event.target.textContent = "";

	update_number();
}

function isBigInt(value) {
	let x = 0;
	try {
		x = BigInt(parseInt(value, 16));
	}
	catch(e) {
		console.log("Invalid");
		return false;
	}

	return true;
}

function clean_hex_str(str) {
	let ret = "0x";

	for(const char of str) {
		if((char >= 'a' && char <= 'f') ||
			(char >= 'A' && char <= 'F') ||
			(char >= '0' && char <= '9')) {
			ret += char;
		}	
	}

	console.log(ret);

	return ret;
}

function number_changed(event) {
	let str = number_element.value;
	//if(!str.toLowerCase().startsWith("0x")) {
	//	str = "0x" + str;
	//}
	//if(isBigInt(str)) {
	str = clean_hex_str(str);
	update_board(BigInt(str));
	//}
		//console.log(number_element.value + " " + BigInt(str));
}

document.addEventListener("DOMContentLoaded", (event) => {
	createBoard();
	//update_number();

	update_board(BigInt("0x0"));

	update_number();
	
	//renderPieces();
});

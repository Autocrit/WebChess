import * as chess from './chess.js'

let chessboard = new chess.Board();
let legal_moves = [];

const chessboard_element = document.querySelector("#chessboard");
const playerDisplayElement = document.querySelector("#player");
const infoDisplayElement = document.querySelector("#info-display");
let square_elements = [];

function create_board() {
	for(let i=0; i<64; i++) {
		let square = document.createElement("div");
		square.classList.add("square");
		square.id = chess.Square.to_str(i);

		let square_class = "white-square";
		if(chess.Square.row(i) % 2 === 0)
			square_class = (chess.Square.col(i) % 2 === 0 ? "white-square" : "black-square");
		else
			square_class = (chess.Square.col(i) % 2 === 0 ? "black-square" : "white-square");

		square.classList.add(square_class);
		chessboard_element.append(square);

		square.addEventListener("dragstart", dragStart);
		square.addEventListener("dragover", dragOver);
		square.addEventListener("drop", dragDrop);

		square_elements[i] = square;
	}
}

function render_pieces() {
	for(let i=0; i<64; i++) {
		let square = square_elements[i];

		// Remove any existing child elements
		while(square.firstChild != null)
			square.removeChild(square.firstChild);

		if(chessboard.color[i] != chess.Color.none) {
			let piece = document.createElement("div");
			piece.classList.add("piece");
			//piece.innerHTML = chess.piece_svg[chessboard.piece[i]];
			piece.innerHTML = chess.Piece.get_svg(chessboard.piece[i]);
			piece.firstChild.classList = chessboard.color[i] === chess.Color.white ? "white-piece" : "black-piece";
			piece.setAttribute("draggable", "true");
			square.append(piece);
		}
	}
}

let from_sq = undefined;
let dragged_element = undefined;

function dragStart(e) {
	from_sq = chess.Square.from_str(this.id);
	dragged_element = e.target;

	// Get legal moves from this square
	let moves = legal_moves.filter(move => move.from === from_sq);
	for(let i=0; i<moves.length; i++) {
		let id = chess.Square.to_str(moves[i].to);
		let square_element = document.getElementById(id);

		square_element.style.border = '#f00 solid 1px';
	}
}

function dragOver(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = 'move';
}

function dragDrop(e) {
	//e.stopPropagation();
	e.preventDefault();

	let to_sq = chess.Square.from_str(this.id);

	// Is the move in legal_moves?
	let result = legal_moves.find(move => move.from === from_sq && move.to === to_sq);
	if(result != undefined) {
		if(chessboard.makemove(result)) {
			render_pieces();
			chessboard.reset_ply();
			legal_moves = chessboard.gen_legal();
		}
	}
	else {
		console.log("Illegal move");
	}

	// Remove highlights
	for(let i=0; i<64; i++) {
		square_elements[i].style.border = "";
	}
}

function perft() {
	let depth = 5;
	let nodes = chessboard.perft(depth);

	console.log("perft d" + depth + ": " + nodes)
}

document.addEventListener("DOMContentLoaded", (event) => {
	create_board();

	chessboard.set_from_fen("r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10");

	render_pieces();

	legal_moves = chessboard.gen_legal();
});

import * as chess from './chess.js'

let chessboard = new chess.Board();
let legal_moves = [];

const chessboard_element = document.querySelector("#chessboard");
const fen_input = document.querySelector("#fen");
const fen_button = document.querySelector("#fen-button");

fen_button.addEventListener("click", set_from_fen);

let square_elements = [];
let overlay_elements = [];

const col_to_file = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];

function create_board() {
	// file labels
	let tr = chessboard_element.insertRow();
	tr.append(document.createElement("th"));
	for(let x=0; x<8; x++) {
		let th = document.createElement("th");
		tr.append(th);
		th.textContent = col_to_file[x];
	}
	tr.append(document.createElement("th"));

	for(let y=7; y>=0; y--) {
		let tr = chessboard_element.insertRow();

		let th = document.createElement("th");
		tr.append(th);
		th.textContent = y + 1;

		for(let x=0; x<8; x++) {
			let td = tr.insertCell();
			tr.append(td);
			td.id = col_to_file[x] + (y + 1);

			let i = (7 - y) * 8 + x;

			let overlay = document.createElement("div");
			overlay.classList.add("overlay");
			td.append(overlay);
			overlay_elements[i] = overlay;
	
			td.addEventListener("dragstart", drag_start);
			td.addEventListener("dragover", drag_over);
			td.addEventListener("drop", drag_drop);

			square_elements[i] = td;
		}

		th = document.createElement("th");
		tr.append(th);
		th.textContent = y + 1;
	}

	// file labels
	tr = chessboard_element.insertRow();
	tr.append(document.createElement("th"));
	for(let x=0; x<8; x++) {
		let th = document.createElement("th");
		tr.append(th);
		th.textContent = col_to_file[x];
	}
	tr.append(document.createElement("th"));

/*
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

		let overlay = document.createElement("div");
		overlay.classList.add("overlay");
		square.append(overlay);
		overlay_elements[i] = overlay;

		square.addEventListener("dragstart", dragStart);
		square.addEventListener("dragover", dragOver);
		square.addEventListener("drop", dragDrop);

		square_elements[i] = square;
	}
*/
}

function render_pieces() {
	for(let i=0; i<64; i++) {
		let square = square_elements[i];

		// Remove any existing child elements
		for(let j=0; j<square.children; j++) {
			if(square.child[j].classList.contains("piece")) {
				square.removeChild(square.child[j]);
			}
		}

		for(const child of square.children) {
			if(child.classList.contains("piece")) {
				square.removeChild(child);
			}
		}

		if(chessboard.color[i] != chess.Color.none) {
			let piece = document.createElement("div");
			piece.classList.add("piece");

			// SVG
			//piece.innerHTML = chess.Piece.get_svg(chessboard.piece[i]);

			// PNG
			let png = chess.Piece.get_png(chessboard.color[i], chessboard.piece[i]);
			let image = document.createElement("img");
			image.src = png;
			image.classList.add("piece-img");
			piece.append(image);

			// Unicode
			//let span = document.createElement("span");
			//piece.append(span);
			//span.textContent = chess.Piece.unicode(chessboard.color[i], chessboard.piece[i]);

			piece.setAttribute("draggable", "true");
			square.append(piece);
		}
	}
}

let from_sq = undefined;

function drag_start(e) {
	from_sq = chess.Square.from_str(this.id);

	// Get legal moves from this square
	let moves = legal_moves.filter(move => move.from === from_sq);
	for(let i=0; i<moves.length; i++) {
		overlay_elements[moves[i].to].style.background = "var(--move)";

		if(moves[i].bits & chess.Board.move_type_capture) {
			overlay_elements[moves[i].to].style.background = "var(--capture-move)";
		}
		if(moves[i].bits & chess.Board.move_type_castle) {
			overlay_elements[moves[i].to].style.background = "var(--castle-move)";
		}
		if(moves[i].bits & chess.Board.move_type_ep) {
			overlay_elements[moves[i].to].style.background = "var(--ep-move)";
		}
		if(moves[i].bits & chess.Board.move_type_promote) {
			overlay_elements[moves[i].to].style.background = "var(--promote-move)";
		}

		overlay_elements[moves[i].to].style.display = "block";
	}
}

function drag_over(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = "move";
}

function drag_drop(e) {
	//e.stopPropagation();
	e.preventDefault();

	let to_sq = chess.Square.from_str(this.id);
	
	// Remove highlights
	for(let i=0; i<64; i++) {
		overlay_elements[i].style.display = "none";
	}

	// Is the move in legal_moves?
	let move = legal_moves.find(move => move.from === from_sq && move.to === to_sq);
	if(move != undefined) {
		if(chessboard.makemove(move)) {
			render_pieces();
			chessboard.reset_ply();
			legal_moves = chessboard.gen_legal();
		}
	}
	else {
		//console.log("Illegal move");
	}

}

function set_from_fen(e) {
	let fen = fen_input.value;

	chessboard.set_from_fen(fen);

	render_pieces();

	legal_moves = chessboard.gen_legal();

	let moves = chessboard.gen_pseudolegal();

	let move_strings = [];
	for(const move of moves) {
		move_strings.push(chessboard.move_to_str(move));
	}

	move_strings.sort(function(a, b) {
		if(a < b) return -1;
		if(a > b) return 1;

		return 0;
	});

	console.log("****************");
	for(const str of move_strings) {
		console.log(str);
	}
	console.log("****************");
}

function perft() {
	let depth = 5;
	let nodes = chessboard.perft(depth);

	console.log("perft d" + depth + ": " + nodes)
}

document.addEventListener("DOMContentLoaded", (event) => {
	create_board();

	fen_input.value = chess.Board.start_fen;

	set_from_fen();

	//let fen1 = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
	//let fen2 = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R b KQkq - 0 1";
	//let ep_fen = "4k3/8/8/8/2p5/8/3P4/5K2 w" // ep

});

import * as chess from './chess.js'

let chessboard = new chess.Board();
let legal_moves = [];

const chessboard_element = document.querySelector("#chessboard");
const playerDisplayElement = document.querySelector("#player");
const infoDisplayElement = document.querySelector("#info-display");
let square_elements = [];
let overlay_elements = [];

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

		let overlay = document.createElement("div");
		overlay.classList.add("overlay");
		square.append(overlay);
		overlay_elements[i] = overlay;

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
			//piece.innerHTML = chess.Piece.get_svg(chessboard.piece[i]);
			//let png = chess.Piece.get_png(chessboard.color[i], chessboard.piece[i]);
			//let image = document.createElement("img");
			//image.src = png;
			//image.classList.add("piece-img");
			//piece.append(image);
			//piece.firstChild.classList = chessboard.color[i] === chess.Color.white ? "white-piece" : "black-piece";

			let span = document.createElement("span");
			piece.append(span);
			span.textContent = chess.Piece.unicode(chessboard.color[i], chessboard.piece[i]);

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

function dragOver(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = "move";
}

function dragDrop(e) {
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
		console.log("Illegal move");
	}

}

function perft() {
	let depth = 5;
	let nodes = chessboard.perft(depth);

	console.log("perft d" + depth + ": " + nodes)
}

document.addEventListener("DOMContentLoaded", (event) => {
	create_board();

	let fen1 = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
	let fen2 = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R b KQkq - 0 1";
	let ep_fen = "4k3/8/8/8/2p5/8/3P4/5K2 w" // ep

	chessboard.set_from_fen(fen1);

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

	for(const str of move_strings) {
		console.log(str);
	}
});

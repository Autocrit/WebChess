// Chess ppieces by JohnPablok
// https://opengameart.org/content/chess-pieces-and-board-squares

const debug_moves = true;

class Color {
	static invert(c) {
		if(c == this.black)
			return this.white;
		if(c == this.white)
			return this.black;
	}

	static white = 0;
	static black = 1;
	static none = 6;
};

const mailbox = [
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1,  0,  1,  2,  3,  4,  5,  6,  7, -1,
	-1,  8,  9, 10, 11, 12, 13, 14, 15, -1,
	-1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
	-1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
	-1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
	-1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
	-1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
	-1, 56, 57, 58, 59, 60, 61, 62, 63, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1
];

const mailbox64 = [
   21, 22, 23, 24, 25, 26, 27, 28,
   31, 32, 33, 34, 35, 36, 37, 38,
   41, 42, 43, 44, 45, 46, 47, 48,
   51, 52, 53, 54, 55, 56, 57, 58,
   61, 62, 63, 64, 65, 66, 67, 68,
   71, 72, 73, 74, 75, 76, 77, 78,
   81, 82, 83, 84, 85, 86, 87, 88,
   91, 92, 93, 94, 95, 96, 97, 98
];

const slide = [
	false, false, true, true, true, false
];

const offsets = [
	0, 8, 4, 4, 8, 8
];

const offset = [
	[ 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ -21, -19, -12, -8, 8, 12, 19, 21 ],
	[ -11, -9, 9, 11, 0, 0, 0, 0 ],
	[ -10, -1, 1, 10, 0, 0, 0, 0 ],
	[ -11, -10, -9, -1, 1, 9, 10, 11 ],
	[ -11, -10, -9, -1, 1, 9, 10, 11 ]
];

const castle_mask = [
	7, 15, 15, 15,  3, 15, 15, 11,
   15, 15, 15, 15, 15, 15, 15, 15,
   15, 15, 15, 15, 15, 15, 15, 15,
   15, 15, 15, 15, 15, 15, 15, 15,
   15, 15, 15, 15, 15, 15, 15, 15,
   15, 15, 15, 15, 15, 15, 15, 15,
   15, 15, 15, 15, 15, 15, 15, 15,
   13, 15, 15, 15, 12, 15, 15, 14
];

const init_color = [
	1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0
];

const init_piece = [
	3, 1, 2, 4, 5, 2, 1, 3,
	0, 0, 0, 0, 0, 0, 0, 0,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	0, 0, 0, 0, 0, 0, 0, 0,
	3, 1, 2, 4, 5, 2, 1, 3
];

const A1 = 56;
const B1 = 57;
const C1 = 58;
const D1 = 59;
const E1 = 60;
const F1 = 61;
const G1 = 62;
const H1 = 63;
const A8 = 0;
const B8 = 1;
const C8 = 2;
const D8 = 3;
const E8 = 4;
const F8 = 5;
const G8 = 6;
const H8 = 7;

class Square {
	static row(sq) {
		return sq >> 3
	}
	static col(sq) {
		return sq & 7
	}
	static from_str(str) {
		let col = str.charCodeAt(0) - 97;
		let row = str.charCodeAt(1) - 49;

		return (7 - row) * 8 + col;
	}
	static to_str(sq) {
		const sq_str = [
			"a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
			"a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
			"a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
			"a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
			"a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
			"a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
			"a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
			"a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
		];

		return sq_str[sq];
	}
};

/*
 Move object:
{
	from
	to
	promote
	bits
	score
}
*/

class PieceType {
	static unicode(color, type) {
		const unicode_pieces = [
			[ '♙', '♘', '♗', '♖', '♕', '♔' ],
			[ '♟', '♞', '♝', '♜', '♛', '♚' ]
		];

		return unicode_pieces[color][type];
	}
	
	static pawn = 0;
	static knight = 1;
	static bishop = 2;
	static rook = 3;
	static queen = 4;
	static king = 5;
	static none = 6;
};

const gen_stack = 1120;
const hist_stack = 400;

class Board {
	constructor() {
		this.set_from_fen(Board.start_fen);
	}

	static start_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

	// Move type flags
	static move_type_capture = 1;
	static move_type_castle = 2;
	static move_type_ep = 4;
	static move_type_p2sq = 8;
	static move_type_pawn = 16;
	static move_type_promote = 32;

	clear() {
		this.color = [];
		this.piece = [];

		for(let i=0; i<64; i++) {
			this.color[i] = Color.none;
			this.piece[i] = PieceType.none;
		}

		this.castle = 0;
		this.ep = -1;
		this.fifty = 0;
		this.first_move = [];
		this.first_move[0] = 0;
		this.hply = 0;
		this.ply = 0;
		this.side = Color.white;
		this.xside = Color.black;

		this.gen_dat = [];
		this.hist_dat = [];

		// Init history
		this.history = [];
		for(let i=0; i<64; i++) {
			this.history[i] = [];
			for(let j=0; j<64; j++) {
				this.history[i][j] = 0;
			}
		}
	}

	reset() {
		this.color = [];
		this.piece = [];

		for(let i=0; i<64; i++) {
			this.color[i] = init_color[i];
			this.piece[i] = init_piece[i];
		}

		// Init gen_dat
		this.gen_dat = [];
		/*
		for(let i=0; i<gen_stack; i++) {
			this.gen_dat[i] = {};
			this.gen_dat[i].from = 0;
			this.gen_dat[i].to = 0;
			this.gen_dat[i].promote = 0;
			this.gen_dat[i].bits = 0;
			this.gen_dat[i].score = 0;
		}
		*/
		// Init hist_dat
		this.hist_dat = [];
		/*
		for(let i=0; i<hist_stack; i++) {
			this.hist_dat[i] = {};
			this.hist_dat[i].from = 0;
			this.hist_dat[i].to = 0;
			this.hist_dat[i].promote = 0;
			this.hist_dat[i].bits = 0;
			this.hist_dat[i].capture = 0;
			this.hist_dat[i].castle = 0;
			this.hist_dat[i].ep = 0;
			this.hist_dat[i].fifty = 0;
			//hist_dat[i].hash = 0;
		}
		*/

		// Init history
		this.history = [];
		for(let i=0; i<64; i++) {
			this.history[i] = [];
			for(let j=0; j<64; j++) {
				this.history[i][j] = 0;
			}
		}

		this.castle = 15;
		this.ep = -1;
		this.fifty = 0;
		this.first_move = [];
		this.first_move[0] = 0;
		this.hply = 0;
		this.ply = 0;
		this.side = Color.white;
		this.xside = Color.black;
	}

	set_from_fen(fen) {
		this.clear();

		fen = fen.trimStart();

		let params = fen.split(' ');

		if(params.length < 1) {
			console.log("Error in fen string (empty): " + fen);
			return false;
		}

		// Parse position
		let position = params[0];
		let sq = 0, row = 0;
		for(let i=0; i<position.length; i++) {
			let token = fen.charAt(i);
			
			if(token == '/') {
				row++;
				sq = row * 8;
			}
			else if(token >= '1' && token <= '8') {
				sq += token - '1' + 1;
			}
			else {
				switch(token) {
					case 'p': this.piece[sq] = PieceType.pawn; this.color[sq] = Color.black; break;
					case 'n': this.piece[sq] = PieceType.knight; this.color[sq] = Color.black; break;
					case 'b': this.piece[sq] = PieceType.bishop; this.color[sq] = Color.black; break;
					case 'r': this.piece[sq] = PieceType.rook; this.color[sq] = Color.black; break;
					case 'q': this.piece[sq] = PieceType.queen; this.color[sq] = Color.black; break;
					case 'k': this.piece[sq] = PieceType.king; this.color[sq] = Color.black; break;
					case 'P': this.piece[sq] = PieceType.pawn; this.color[sq] = Color.white; break;
					case 'N': this.piece[sq] = PieceType.knight; this.color[sq] = Color.white; break;
					case 'B': this.piece[sq] = PieceType.bishop; this.color[sq] = Color.white; break;
					case 'R': this.piece[sq] = PieceType.rook; this.color[sq] = Color.white; break;
					case 'Q': this.piece[sq] = PieceType.queen; this.color[sq] = Color.white; break;
					case 'K': this.piece[sq] = PieceType.king; this.color[sq] = Color.white; break;
					default:
						console.log("Error in fen string (unexpected character): " + fen);
						return false;
						break;
				}
				sq++;
			}
		}
			  
		// Parse side to move
		if(params.length > 1) {
			let side = params[1];
			if(side == "w" || side == "W")
				this.side = Color.white;
			else if(side == "b" || side == "B")
				this.side = Color.black;
			else {
				console.log("Error in fen string: (side to move): " + fen);
				return false;
			}
		}
		this.xside = Color.invert(this.side);
			  
		// Parse castling rights
		if(params.length > 2) {
			let castle = params[2];
			if(castle != "-") {
				for(let i=0; i<castle.length; i++) {
					let token = castle.charAt(i);
					switch(token) {
						case 'K': this.castle |= 1; break;
						case 'Q': this.castle |= 2; break;
						case 'k': this.castle |= 4; break;
						case 'q': this.castle |= 8; break;
						default: break;
					}
				}
			}
		}

		// Parse enpassant square
		if(params.length > 3) {
			let ep = params[3];
			if(ep != '-') {
				this.ep = Square.from_str(ep);
			}
		}

		// Parse 50 rule move counter
		if(params.length > 4) {
			let fifty = params[4];
			this.fifty = parseInt(fifty);
		}
		  
		// Parse full move counter
		if(params.length > 5) {
			let full_move = params[5];
		}
	}

	in_check(s) {
		for(let i=0; i<64; i++) {
			if(this.piece[i] == PieceType.king && this.color[i] == s)
				return this.attack(i, Color.invert(s));
		}
		
		return true;
	}

	attack(sq, s) {
		for(let i=0; i<64; ++i) {
			if(this.color[i] == s) {
				if(this.piece[i] == PieceType.pawn) {
					if(s == Color.white) {
						if(Square.col(i) != 0 && i - 9 == sq)
							return true;
						if(Square.col(i) != 7 && i - 7 == sq)
							return true;
					}
					else {
						if(Square.col(i) != 0 && i + 7 == sq)
							return true;
						if(Square.col(i) != 7 && i + 9 == sq)
							return true;
					}
				}
				else {
					for(let j=0; j<offsets[this.piece[i]]; ++j) {
						for(let n = i;;) {
							n = mailbox[mailbox64[n] + offset[this.piece[i]][j]];
							if(n == -1)
								break;
							if(n == sq)
								return true;
							if(this.color[n] != Color.none)
								break;
							if(!slide[this.piece[i]])
								break;
						}
					}
				}
			}
		}
		return false;
	}

	gen() {
		/* so far, we have no moves for the current ply */
		this.first_move[this.ply + 1] = this.first_move[this.ply];

		for(let i=0; i<64; ++i) {
			if(this.color[i] == this.side) {
				if(this.piece[i] == PieceType.pawn) {
					if(this.side == Color.white) {
						if(Square.col(i) != 0 && this.color[i - 9] == Color.black)
							this.gen_push(i, i - 9, 17);
						if(Square.col(i) != 7 && this.color[i - 7] == Color.black)
							this.gen_push(i, i - 7, 17);
						if(this.color[i - 8] == Color.none) {
							this.gen_push(i, i - 8, 16);
							if(i >= 48 && this.color[i - 16] == Color.none)
								this.gen_push(i, i - 16, 24);
						}
					}
					else {
						if(Square.col(i) != 0 && this.color[i + 7] == Color.white)
							this.gen_push(i, i + 7, 17);
						if(Square.col(i) != 7 && this.color[i + 9] == Color.white)
							this.gen_push(i, i + 9, 17);
						if(this.color[i + 8] == Color.none) {
							this.gen_push(i, i + 8, 16);
							if(i <= 15 && this.color[i + 16] == Color.none)
								this.gen_push(i, i + 16, 24);
						}
					}
				}
				else {
					for(let j=0; j<offsets[this.piece[i]]; ++j) {
						for(let n = i;;) {
							n = mailbox[mailbox64[n] + offset[this.piece[i]][j]];
							if(n == -1)
								break;
							if(this.color[n] != Color.none) {
								if(this.color[n] == this.xside)
									this.gen_push(i, n, 1);
								break;
							}
							this.gen_push(i, n, 0);
							if(!slide[this.piece[i]])
								break;
						}
					}
				}
			}
		}

		/* generate castle moves */
		if(this.side == Color.white) {
			if(this.castle & 1)
				this.gen_push(E1, G1, 2);
			if(this.castle & 2)
				this.gen_push(E1, C1, 2);
		}
		else {
			if(this.castle & 4)
				this.gen_push(E8, G8, 2);
			if(this.castle & 8)
				this.gen_push(E8, C8, 2);
		}
		
		/* generate en passant moves */
		if(this.ep != -1) {
			if(this.side == Color.white) {
				if(Square.col(this.ep) != 0 && this.color[this.ep + 7] == Color.white && this.piece[this.ep + 7] == PieceType.pawn)
					this.gen_push(this.ep + 7, this.ep, 21);
				if(Square.col(this.ep) != 7 && this.color[this.ep + 9] == Color.white && this.piece[this.ep + 9] == PieceType.pawn)
					this.gen_push(this.ep + 9, this.ep, 21);
			}
			else {
				if(Square.col(this.ep) != 0 && this.color[this.ep - 9] == Color.black && this.piece[this.ep - 9] == PieceType.pawn)
					this.gen_push(this.ep - 9, this.ep, 21);
				if(Square.col(this.ep) != 7 && this.color[this.ep - 7] == Color.black && this.piece[this.ep - 7] == PieceType.pawn)
					this.gen_push(this.ep - 7, this.ep, 21);
			}
		}
/*
		if(debug_moves != undefined) {
			if(debug_moves) {
				for(let i=this.first_move[this.ply]; i<this.first_move[this.ply+1]; ++i) {
					this.print_move(this.gen_dat[i]);
				}
			}
		}
*/
	}

	gen_push(from, to, bits) {
		if(bits & 16) {
			if(this.side == Color.white) {
				if(to <= H8) {
					this.gen_promote(from, to, bits);
					return;
				}
			}
			else {
				if(to >= A1) {
					this.gen_promote(from, to, bits);
					return;
				}
			}
		}

		let index = this.first_move[this.ply + 1]++;

		this.gen_dat[index] = {};

		this.gen_dat[index].from = from;
		this.gen_dat[index].to = to;
		this.gen_dat[index].promote = 0;
		this.gen_dat[index].bits = bits;
		if(this.color[to] != Color.none)
			this.gen_dat[index].score = 1000000 + (this.piece[to] * 10) - this.piece[from];
		else
		this.gen_dat[index].score = this.history[from][to];
	}

	gen_promote(from, to, bits) {
		for(let i=PieceType.knight; i<=PieceType.queen; ++i) {
			let index = this.first_move[this.ply + 1]++;
			
			this.gen_dat[index] = {};

			this.gen_dat[index].from = from;
			this.gen_dat[index].to = to;
			this.gen_dat[index].promote = i;
			this.gen_dat[index].bits = bits | 32;
			this.gen_dat[index].score = 1000000 + (i * 10);
		}
	}

	makemove(m) {
		/* test to see if a this.castle move is legal and move the rook
		   (the king is moved with the usual move code later) */
		if(m.bits & 2) {
			let from, to;
	
			if(this.in_check(this.side))
				return false;
			switch(m.to) {
				case 62:
					if(this.color[F1] != Color.none || this.color[G1] != Color.none ||
						this.attack(F1, this.xside) || this.attack(G1, this.xside))
						return false;
					from = H1;
					to = F1;
					break;
				case 58:
					if(this.color[B1] != Color.none || this.color[C1] != Color.none || this.color[D1] != Color.none ||
						this.attack(C1, this.xside) || this.attack(D1, this.xside))
						return false;
					from = A1;
					to = D1;
					break;
				case 6:
					if(this.color[F8] != Color.none || this.color[G8] != Color.none ||
						this.attack(F8, this.xside) || this.attack(G8, this.xside))
						return false;
					from = H8;
					to = F8;
					break;
				case 2:
					if(this.color[B8] != Color.none || this.color[C8] != Color.none || this.color[D8] != Color.none ||
						this.attack(C8, this.xside) || this.attack(D8, this.xside))
						return false;
					from = A8;
					to = D8;
					break;
				default:  /* shouldn't get here */
					from = -1;
					to = -1;
					break;
			}
			this.color[to] = this.color[from];
			this.piece[to] = this.piece[from];
			this.color[from] = Color.none;
			this.piece[from] = PieceType.none;
		}
	
		/* back up information so we can take the move back later. */
		this.hist_dat[this.hply] = {};
		this.hist_dat[this.hply].from = m.from;
		this.hist_dat[this.hply].to = m.to;
		this.hist_dat[this.hply].promote = m.promote;
		this.hist_dat[this.hply].bits = m.bits;
		this.hist_dat[this.hply].capture = this.piece[m.to];
		this.hist_dat[this.hply].castle = this.castle;
		this.hist_dat[this.hply].ep = this.ep;
		this.hist_dat[this.hply].fifty = this.fifty;
		//this.hist_dat[hply].hash = hash;
		++this.ply;
		++this.hply;
	
		/* update the castle, en passant, and
		   fifty-move-draw variables */
		this.castle &= castle_mask[m.from] & castle_mask[m.to];
		if(m.bits & 8) {
			if(this.side == Color.white)
				this.ep = m.to + 8;
			else
				this.ep = m.to - 8;
		}
		else
			this.ep = -1;
		if(m.bits & 17)
			this.fifty = 0;
		else
			++this.fifty;
	
		/* move the piece */
		this.color[m.to] = this.side;
		if(m.bits & 32)
			this.piece[m.to] = m.promote;
		else
			this.piece[m.to] = this.piece[m.from];
		this.color[m.from] = Color.none;
		this.piece[m.from] = PieceType.none;
	
		/* erase the pawn if this is an en passant move */
		if(m.bits & 4) {
			if(this.side == Color.white) {
				this.color[m.to + 8] = Color.none;
				this.piece[m.to + 8] = PieceType.none;
			}
			else {
				this.color[m.to - 8] = Color.none;
				this.piece[m.to - 8] = PieceType.none;
			}
		}
	
		/* switch sides and test for legality (if we can capture
		   the other guy's king, it's an illegal position and
		   we need to take the move back) */
		this.side = Color.invert(this.side);
		this.xside = Color.invert(this.xside);
		if(this.in_check(this.xside)) {
			this.takeback();
			return false;
		}
		//set_hash();
		return true;
	}
		
	takeback()
	{
		this.side = Color.invert(this.side);
		this.xside = Color.invert(this.xside);
		--this.ply;
		--this.hply;
		let m = this.hist_dat[this.hply];
		this.castle = this.hist_dat[this.hply].castle;
		this.ep = this.hist_dat[this.hply].ep;
		this.fifty = this.hist_dat[this.hply].fifty;
		//this.hash = hist_dat[hply].hash;
		this.color[m.from] = this.side;
		if(m.bits & 32)
			this.piece[m.from] = PieceType.pawn;
		else
			this.piece[m.from] = this.piece[m.to];
		if(this.hist_dat[this.hply].capture == PieceType.none) {
			this.color[m.to] = Color.none;
			this.piece[m.to] = PieceType.none;
		}
		else {
			this.color[m.to] = this.xside;
			this.piece[m.to] = this.hist_dat[this.hply].capture;
		}
		if(m.bits & 2) {
			let from, to;

			switch(m.to) {
				case 62:
					from = F1;
					to = H1;
					break;
				case 58:
					from = D1;
					to = A1;
					break;
				case 6:
					from = F8;
					to = H8;
					break;
				case 2:
					from = D8;
					to = A8;
					break;
				default:  /* shouldn't get here */
					from = -1;
					to = -1;
					break;
			}
			this.color[to] = this.side;
			this.piece[to] = PieceType.rook;
			this.color[from] = Color.none;
			this.piece[from] = PieceType.none;
		}
		if(m.bits & 4) {
			if(this.side == Color.white) {
				this.color[m.to + 8] = this.xside;
				this.piece[m.to + 8] = PieceType.pawn;
			}
			else {
				this.color[m.to - 8] = this.xside;
				this.piece[m.to - 8] = PieceType.pawn;
			}
		}
	}

	move_to_str(m) {
		let move_type = "";

		if(m.bits & 1) {
			move_type += " cap";
		}
		if(m.bits & 2) {
			move_type += " csl";
		}
		if(m.bits & 4) {
			move_type += " ep";
		}
		if(m.bits & 8) {
			move_type += " pwn2";
		}
		if(m.bits & 16) {
			move_type += " pwn";
		}
		if(m.bits & 32) {
			move_type += " pro";
			switch(m.promote) {
				case PieceType.knight: move_type += " n"; break;
				case PieceType.bishop: move_type += " b"; break;
				case PieceType.rook: move_type += " r"; break;
				default: move_type += " q"; break;
			}
		}
		return Square.to_str(m.from) + Square.to_str(m.to) + move_type;
	}

	perft(depth) {
		if(depth == 0)
			return 1;
		
		this.gen();
	
		let nodes = 0;
		
		for(let i=this.first_move[this.ply]; i<this.first_move[this.ply+1]; ++i) {
			if(this.makemove(this.gen_dat[i])) {
				nodes += this.perft(depth - 1);
/*
				if(debug_moves != undefined) {
					if(debug_moves) {
						this.print_move(this.gen_dat[i]);
					}
				}
*/
				this.takeback();
			}
		}
	
		return nodes;
	}

	gen_legal() {
		let moves = [];

		this.gen();

		for(let i=this.first_move[this.ply]; i<this.first_move[this.ply+1]; ++i) {
			if(this.makemove(this.gen_dat[i])) {
				moves.push(this.gen_dat[i]);
				this.takeback();
			}
		}

		return moves;
	}

	gen_pseudolegal() {
		let moves = [];

		this.gen();

		for(let i=this.first_move[this.ply]; i<this.first_move[this.ply+1]; ++i) {
			moves.push(this.gen_dat[i]);
		}

		return moves;
	}

	reset_ply() {
		this.ply = 0;
	}
};

export { Board, Color, PieceType as Piece, Square };
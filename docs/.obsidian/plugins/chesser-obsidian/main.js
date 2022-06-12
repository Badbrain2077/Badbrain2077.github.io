'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const ORIENTATIONS = ["white", "black"];
const PIECE_STYLES = ["alpha", "california", "cardinal", "cburnett", "chess7", "chessnut", "companion", "dubrovny", "fantasy", "fresca", "gioco", "governor", "horsey", "icpieces", "kosal", "leipzig", "letter", "libra", "maestro", "merida", "pirouetti", "pixel", "reillycraig", "riohacha", "shapes", "spatial", "staunty", "tatiana"];
const BOARD_STYLES = ["blue", "brown", "green", "ic", "purple"];
function parse_user_config(settings, content) {
    var _a, _b, _c, _d, _e, _f, _g;
    let default_chesser_config = Object.assign(Object.assign({}, settings), { fen: "" });
    // Kinda ugly way of parsing the user config, but I couldn't find something better
    const user_config = {
        fen: (_a = parse_field(content, "fen")) !== null && _a !== void 0 ? _a : default_chesser_config.fen,
        orientation: (_b = check_valid_value(parse_field(content, "orientation"), ORIENTATIONS)) !== null && _b !== void 0 ? _b : default_chesser_config.orientation,
        viewOnly: (_c = convert_boolean(parse_field(content, "viewOnly"))) !== null && _c !== void 0 ? _c : default_chesser_config.viewOnly,
        drawable: (_d = convert_boolean(parse_field(content, "drawable"))) !== null && _d !== void 0 ? _d : default_chesser_config.drawable,
        free: (_e = convert_boolean(parse_field(content, "free"))) !== null && _e !== void 0 ? _e : default_chesser_config.free,
        pieceStyle: (_f = check_valid_value(parse_field(content, "pieceStyle"), PIECE_STYLES)) !== null && _f !== void 0 ? _f : default_chesser_config.pieceStyle,
        boardStyle: (_g = check_valid_value(parse_field(content, "boardStyle"), BOARD_STYLES)) !== null && _g !== void 0 ? _g : default_chesser_config.boardStyle,
    };
    return user_config;
}
function parse_field(content, field_name) {
    let regex = new RegExp(`${field_name}:(.*)`);
    let matches = regex.exec(content);
    if (!matches) {
        return null;
    }
    return matches[1].trim();
}
function check_valid_value(v, values) {
    if (values.contains(v)) {
        return v;
    }
    return null;
}
function convert_boolean(v) {
    if (!v) {
        return null;
    }
    switch (v.toLowerCase()) {
        case "true":
            return true;
        case "false":
            return false;
        default:
            return null;
    }
}

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var chess = createCommonjsModule(function (module, exports) {
/*
 * Copyright (c) 2020, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

var Chess = function(fen) {
  var BLACK = 'b';
  var WHITE = 'w';

  var EMPTY = -1;

  var PAWN = 'p';
  var KNIGHT = 'n';
  var BISHOP = 'b';
  var ROOK = 'r';
  var QUEEN = 'q';
  var KING = 'k';

  var SYMBOLS = 'pnbrqkPNBRQK';

  var DEFAULT_POSITION =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'];

  var PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15]
  };

  var PIECE_OFFSETS = {
    n: [-18, -33, -31, -14, 18, 33, 31, 14],
    b: [-17, -15, 17, 15],
    r: [-16, 1, 16, -1],
    q: [-17, -16, -15, 1, 17, 16, 15, -1],
    k: [-17, -16, -15, 1, 17, 16, 15, -1]
  };

  // prettier-ignore
  var ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
  ];

  // prettier-ignore
  var RAYS = [
     17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
      0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
      0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
      0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
      0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
      1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
      0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
      0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
      0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
      0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
    -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
  ];

  var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };

  var FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q'
  };

  var BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64
  };

  var RANK_1 = 7;
  var RANK_2 = 6;
  var RANK_7 = 1;
  var RANK_8 = 0;

  // prettier-ignore
  var SQUARES = {
    a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
    a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
    a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
    a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
    a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
    a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
    a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
  };

  var ROOKS = {
    w: [
      { square: SQUARES.a1, flag: BITS.QSIDE_CASTLE },
      { square: SQUARES.h1, flag: BITS.KSIDE_CASTLE }
    ],
    b: [
      { square: SQUARES.a8, flag: BITS.QSIDE_CASTLE },
      { square: SQUARES.h8, flag: BITS.KSIDE_CASTLE }
    ]
  };

  var board = new Array(128);
  var kings = { w: EMPTY, b: EMPTY };
  var turn = WHITE;
  var castling = { w: 0, b: 0 };
  var ep_square = EMPTY;
  var half_moves = 0;
  var move_number = 1;
  var history = [];
  var header = {};
  var comments = {};

  /* if the user passes in a fen string, load it, else default to
   * starting position
   */
  if (typeof fen === 'undefined') {
    load(DEFAULT_POSITION);
  } else {
    load(fen);
  }

  function clear(keep_headers) {
    if (typeof keep_headers === 'undefined') {
      keep_headers = false;
    }

    board = new Array(128);
    kings = { w: EMPTY, b: EMPTY };
    turn = WHITE;
    castling = { w: 0, b: 0 };
    ep_square = EMPTY;
    half_moves = 0;
    move_number = 1;
    history = [];
    if (!keep_headers) header = {};
    comments = {};
    update_setup(generate_fen());
  }

  function prune_comments() {
    var reversed_history = [];
    var current_comments = {};
    var copy_comment = function(fen) {
      if (fen in comments) {
        current_comments[fen] = comments[fen];
      }
    };
    while (history.length > 0) {
      reversed_history.push(undo_move());
    }
    copy_comment(generate_fen());
    while (reversed_history.length > 0) {
      make_move(reversed_history.pop());
      copy_comment(generate_fen());
    }
    comments = current_comments;
  }

  function reset() {
    load(DEFAULT_POSITION);
  }

  function load(fen, keep_headers) {
    if (typeof keep_headers === 'undefined') {
      keep_headers = false;
    }

    var tokens = fen.split(/\s+/);
    var position = tokens[0];
    var square = 0;

    if (!validate_fen(fen).valid) {
      return false
    }

    clear(keep_headers);

    for (var i = 0; i < position.length; i++) {
      var piece = position.charAt(i);

      if (piece === '/') {
        square += 8;
      } else if (is_digit(piece)) {
        square += parseInt(piece, 10);
      } else {
        var color = piece < 'a' ? WHITE : BLACK;
        put({ type: piece.toLowerCase(), color: color }, algebraic(square));
        square++;
      }
    }

    turn = tokens[1];

    if (tokens[2].indexOf('K') > -1) {
      castling.w |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('Q') > -1) {
      castling.w |= BITS.QSIDE_CASTLE;
    }
    if (tokens[2].indexOf('k') > -1) {
      castling.b |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('q') > -1) {
      castling.b |= BITS.QSIDE_CASTLE;
    }

    ep_square = tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]];
    half_moves = parseInt(tokens[4], 10);
    move_number = parseInt(tokens[5], 10);

    update_setup(generate_fen());

    return true
  }

  /* TODO: this function is pretty much crap - it validates structure but
   * completely ignores content (e.g. doesn't verify that each side has a king)
   * ... we should rewrite this, and ditch the silly error_number field while
   * we're at it
   */
  function validate_fen(fen) {
    var errors = {
      0: 'No errors.',
      1: 'FEN string must contain six space-delimited fields.',
      2: '6th field (move number) must be a positive integer.',
      3: '5th field (half move counter) must be a non-negative integer.',
      4: '4th field (en-passant square) is invalid.',
      5: '3rd field (castling availability) is invalid.',
      6: '2nd field (side to move) is invalid.',
      7: "1st field (piece positions) does not contain 8 '/'-delimited rows.",
      8: '1st field (piece positions) is invalid [consecutive numbers].',
      9: '1st field (piece positions) is invalid [invalid piece].',
      10: '1st field (piece positions) is invalid [row too large].',
      11: 'Illegal en-passant square'
    };

    /* 1st criterion: 6 space-seperated fields? */
    var tokens = fen.split(/\s+/);
    if (tokens.length !== 6) {
      return { valid: false, error_number: 1, error: errors[1] }
    }

    /* 2nd criterion: move number field is a integer value > 0? */
    if (isNaN(tokens[5]) || parseInt(tokens[5], 10) <= 0) {
      return { valid: false, error_number: 2, error: errors[2] }
    }

    /* 3rd criterion: half move counter is an integer >= 0? */
    if (isNaN(tokens[4]) || parseInt(tokens[4], 10) < 0) {
      return { valid: false, error_number: 3, error: errors[3] }
    }

    /* 4th criterion: 4th field is a valid e.p.-string? */
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
      return { valid: false, error_number: 4, error: errors[4] }
    }

    /* 5th criterion: 3th field is a valid castle-string? */
    if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
      return { valid: false, error_number: 5, error: errors[5] }
    }

    /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
    if (!/^(w|b)$/.test(tokens[1])) {
      return { valid: false, error_number: 6, error: errors[6] }
    }

    /* 7th criterion: 1st field contains 8 rows? */
    var rows = tokens[0].split('/');
    if (rows.length !== 8) {
      return { valid: false, error_number: 7, error: errors[7] }
    }

    /* 8th criterion: every row is valid? */
    for (var i = 0; i < rows.length; i++) {
      /* check for right sum of fields AND not two numbers in succession */
      var sum_fields = 0;
      var previous_was_number = false;

      for (var k = 0; k < rows[i].length; k++) {
        if (!isNaN(rows[i][k])) {
          if (previous_was_number) {
            return { valid: false, error_number: 8, error: errors[8] }
          }
          sum_fields += parseInt(rows[i][k], 10);
          previous_was_number = true;
        } else {
          if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
            return { valid: false, error_number: 9, error: errors[9] }
          }
          sum_fields += 1;
          previous_was_number = false;
        }
      }
      if (sum_fields !== 8) {
        return { valid: false, error_number: 10, error: errors[10] }
      }
    }

    if (
      (tokens[3][1] == '3' && tokens[1] == 'w') ||
      (tokens[3][1] == '6' && tokens[1] == 'b')
    ) {
      return { valid: false, error_number: 11, error: errors[11] }
    }

    /* everything's okay! */
    return { valid: true, error_number: 0, error: errors[0] }
  }

  function generate_fen() {
    var empty = 0;
    var fen = '';

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (board[i] == null) {
        empty++;
      } else {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        var color = board[i].color;
        var piece = board[i].type;

        fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
      }

      if ((i + 1) & 0x88) {
        if (empty > 0) {
          fen += empty;
        }

        if (i !== SQUARES.h1) {
          fen += '/';
        }

        empty = 0;
        i += 8;
      }
    }

    var cflags = '';
    if (castling[WHITE] & BITS.KSIDE_CASTLE) {
      cflags += 'K';
    }
    if (castling[WHITE] & BITS.QSIDE_CASTLE) {
      cflags += 'Q';
    }
    if (castling[BLACK] & BITS.KSIDE_CASTLE) {
      cflags += 'k';
    }
    if (castling[BLACK] & BITS.QSIDE_CASTLE) {
      cflags += 'q';
    }

    /* do we have an empty castling flag? */
    cflags = cflags || '-';
    var epflags = ep_square === EMPTY ? '-' : algebraic(ep_square);

    return [fen, turn, cflags, epflags, half_moves, move_number].join(' ')
  }

  function set_header(args) {
    for (var i = 0; i < args.length; i += 2) {
      if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
        header[args[i]] = args[i + 1];
      }
    }
    return header
  }

  /* called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object.  if the FEN is
   * equal to the default position, the SetUp and FEN are deleted
   * the setup is only updated if history.length is zero, ie moves haven't been
   * made.
   */
  function update_setup(fen) {
    if (history.length > 0) return

    if (fen !== DEFAULT_POSITION) {
      header['SetUp'] = '1';
      header['FEN'] = fen;
    } else {
      delete header['SetUp'];
      delete header['FEN'];
    }
  }

  function get(square) {
    var piece = board[SQUARES[square]];
    return piece ? { type: piece.type, color: piece.color } : null
  }

  function put(piece, square) {
    /* check for valid piece object */
    if (!('type' in piece && 'color' in piece)) {
      return false
    }

    /* check for piece */
    if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
      return false
    }

    /* check for valid square */
    if (!(square in SQUARES)) {
      return false
    }

    var sq = SQUARES[square];

    /* don't let the user place more than one king */
    if (
      piece.type == KING &&
      !(kings[piece.color] == EMPTY || kings[piece.color] == sq)
    ) {
      return false
    }

    board[sq] = { type: piece.type, color: piece.color };
    if (piece.type === KING) {
      kings[piece.color] = sq;
    }

    update_setup(generate_fen());

    return true
  }

  function remove(square) {
    var piece = get(square);
    board[SQUARES[square]] = null;
    if (piece && piece.type === KING) {
      kings[piece.color] = EMPTY;
    }

    update_setup(generate_fen());

    return piece
  }

  function build_move(board, from, to, flags, promotion) {
    var move = {
      color: turn,
      from: from,
      to: to,
      flags: flags,
      piece: board[from].type
    };

    if (promotion) {
      move.flags |= BITS.PROMOTION;
      move.promotion = promotion;
    }

    if (board[to]) {
      move.captured = board[to].type;
    } else if (flags & BITS.EP_CAPTURE) {
      move.captured = PAWN;
    }
    return move
  }

  function generate_moves(options) {
    function add_move(board, moves, from, to, flags) {
      /* if pawn promotion */
      if (
        board[from].type === PAWN &&
        (rank(to) === RANK_8 || rank(to) === RANK_1)
      ) {
        var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
        for (var i = 0, len = pieces.length; i < len; i++) {
          moves.push(build_move(board, from, to, flags, pieces[i]));
        }
      } else {
        moves.push(build_move(board, from, to, flags));
      }
    }

    var moves = [];
    var us = turn;
    var them = swap_color(us);
    var second_rank = { b: RANK_7, w: RANK_2 };

    var first_sq = SQUARES.a8;
    var last_sq = SQUARES.h1;
    var single_square = false;

    /* do we want legal moves? */
    var legal =
      typeof options !== 'undefined' && 'legal' in options
        ? options.legal
        : true;

    /* are we generating moves for a single square? */
    if (typeof options !== 'undefined' && 'square' in options) {
      if (options.square in SQUARES) {
        first_sq = last_sq = SQUARES[options.square];
        single_square = true;
      } else {
        /* invalid square */
        return []
      }
    }

    for (var i = first_sq; i <= last_sq; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) {
        i += 7;
        continue
      }

      var piece = board[i];
      if (piece == null || piece.color !== us) {
        continue
      }

      if (piece.type === PAWN) {
        /* single square, non-capturing */
        var square = i + PAWN_OFFSETS[us][0];
        if (board[square] == null) {
          add_move(board, moves, i, square, BITS.NORMAL);

          /* double square */
          var square = i + PAWN_OFFSETS[us][1];
          if (second_rank[us] === rank(i) && board[square] == null) {
            add_move(board, moves, i, square, BITS.BIG_PAWN);
          }
        }

        /* pawn captures */
        for (j = 2; j < 4; j++) {
          var square = i + PAWN_OFFSETS[us][j];
          if (square & 0x88) continue

          if (board[square] != null && board[square].color === them) {
            add_move(board, moves, i, square, BITS.CAPTURE);
          } else if (square === ep_square) {
            add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
          }
        }
      } else {
        for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[piece.type][j];
          var square = i;

          while (true) {
            square += offset;
            if (square & 0x88) break

            if (board[square] == null) {
              add_move(board, moves, i, square, BITS.NORMAL);
            } else {
              if (board[square].color === us) break
              add_move(board, moves, i, square, BITS.CAPTURE);
              break
            }

            /* break, if knight or king */
            if (piece.type === 'n' || piece.type === 'k') break
          }
        }
      }
    }

    /* check for castling if: a) we're generating all moves, or b) we're doing
     * single square move generation on the king's square
     */
    if (!single_square || last_sq === kings[us]) {
      /* king-side castling */
      if (castling[us] & BITS.KSIDE_CASTLE) {
        var castling_from = kings[us];
        var castling_to = castling_from + 2;

        if (
          board[castling_from + 1] == null &&
          board[castling_to] == null &&
          !attacked(them, kings[us]) &&
          !attacked(them, castling_from + 1) &&
          !attacked(them, castling_to)
        ) {
          add_move(board, moves, kings[us], castling_to, BITS.KSIDE_CASTLE);
        }
      }

      /* queen-side castling */
      if (castling[us] & BITS.QSIDE_CASTLE) {
        var castling_from = kings[us];
        var castling_to = castling_from - 2;

        if (
          board[castling_from - 1] == null &&
          board[castling_from - 2] == null &&
          board[castling_from - 3] == null &&
          !attacked(them, kings[us]) &&
          !attacked(them, castling_from - 1) &&
          !attacked(them, castling_to)
        ) {
          add_move(board, moves, kings[us], castling_to, BITS.QSIDE_CASTLE);
        }
      }
    }

    /* return all pseudo-legal moves (this includes moves that allow the king
     * to be captured)
     */
    if (!legal) {
      return moves
    }

    /* filter out illegal moves */
    var legal_moves = [];
    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i]);
      if (!king_attacked(us)) {
        legal_moves.push(moves[i]);
      }
      undo_move();
    }

    return legal_moves
  }

  /* convert a move from 0x88 coordinates to Standard Algebraic Notation
   * (SAN)
   *
   * @param {boolean} sloppy Use the sloppy SAN generator to work around over
   * disambiguation bugs in Fritz and Chessbase.  See below:
   *
   * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
   * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
   * 4. ... Ne7 is technically the valid SAN
   */
  function move_to_san(move, sloppy) {
    var output = '';

    if (move.flags & BITS.KSIDE_CASTLE) {
      output = 'O-O';
    } else if (move.flags & BITS.QSIDE_CASTLE) {
      output = 'O-O-O';
    } else {
      var disambiguator = get_disambiguator(move, sloppy);

      if (move.piece !== PAWN) {
        output += move.piece.toUpperCase() + disambiguator;
      }

      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        if (move.piece === PAWN) {
          output += algebraic(move.from)[0];
        }
        output += 'x';
      }

      output += algebraic(move.to);

      if (move.flags & BITS.PROMOTION) {
        output += '=' + move.promotion.toUpperCase();
      }
    }

    make_move(move);
    if (in_check()) {
      if (in_checkmate()) {
        output += '#';
      } else {
        output += '+';
      }
    }
    undo_move();

    return output
  }

  // parses all of the decorators out of a SAN string
  function stripped_san(move) {
    return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '')
  }

  function attacked(color, square) {
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) {
        i += 7;
        continue
      }

      /* if empty square or wrong color */
      if (board[i] == null || board[i].color !== color) continue

      var piece = board[i];
      var difference = i - square;
      var index = difference + 119;

      if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
        if (piece.type === PAWN) {
          if (difference > 0) {
            if (piece.color === WHITE) return true
          } else {
            if (piece.color === BLACK) return true
          }
          continue
        }

        /* if the piece is a knight or a king */
        if (piece.type === 'n' || piece.type === 'k') return true

        var offset = RAYS[index];
        var j = i + offset;

        var blocked = false;
        while (j !== square) {
          if (board[j] != null) {
            blocked = true;
            break
          }
          j += offset;
        }

        if (!blocked) return true
      }
    }

    return false
  }

  function king_attacked(color) {
    return attacked(swap_color(color), kings[color])
  }

  function in_check() {
    return king_attacked(turn)
  }

  function in_checkmate() {
    return in_check() && generate_moves().length === 0
  }

  function in_stalemate() {
    return !in_check() && generate_moves().length === 0
  }

  function insufficient_material() {
    var pieces = {};
    var bishops = [];
    var num_pieces = 0;
    var sq_color = 0;

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      sq_color = (sq_color + 1) % 2;
      if (i & 0x88) {
        i += 7;
        continue
      }

      var piece = board[i];
      if (piece) {
        pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
        if (piece.type === BISHOP) {
          bishops.push(sq_color);
        }
        num_pieces++;
      }
    }

    /* k vs. k */
    if (num_pieces === 2) {
      return true
    } else if (
      /* k vs. kn .... or .... k vs. kb */
      num_pieces === 3 &&
      (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)
    ) {
      return true
    } else if (num_pieces === pieces[BISHOP] + 2) {
      /* kb vs. kb where any number of bishops are all on the same color */
      var sum = 0;
      var len = bishops.length;
      for (var i = 0; i < len; i++) {
        sum += bishops[i];
      }
      if (sum === 0 || sum === len) {
        return true
      }
    }

    return false
  }

  function in_threefold_repetition() {
    /* TODO: while this function is fine for casual use, a better
     * implementation would use a Zobrist key (instead of FEN). the
     * Zobrist key would be maintained in the make_move/undo_move functions,
     * avoiding the costly that we do below.
     */
    var moves = [];
    var positions = {};
    var repetition = false;

    while (true) {
      var move = undo_move();
      if (!move) break
      moves.push(move);
    }

    while (true) {
      /* remove the last two fields in the FEN string, they're not needed
       * when checking for draw by rep */
      var fen = generate_fen()
        .split(' ')
        .slice(0, 4)
        .join(' ');

      /* has the position occurred three or move times */
      positions[fen] = fen in positions ? positions[fen] + 1 : 1;
      if (positions[fen] >= 3) {
        repetition = true;
      }

      if (!moves.length) {
        break
      }
      make_move(moves.pop());
    }

    return repetition
  }

  function push(move) {
    history.push({
      move: move,
      kings: { b: kings.b, w: kings.w },
      turn: turn,
      castling: { b: castling.b, w: castling.w },
      ep_square: ep_square,
      half_moves: half_moves,
      move_number: move_number
    });
  }

  function make_move(move) {
    var us = turn;
    var them = swap_color(us);
    push(move);

    board[move.to] = board[move.from];
    board[move.from] = null;

    /* if ep capture, remove the captured pawn */
    if (move.flags & BITS.EP_CAPTURE) {
      if (turn === BLACK) {
        board[move.to - 16] = null;
      } else {
        board[move.to + 16] = null;
      }
    }

    /* if pawn promotion, replace with new piece */
    if (move.flags & BITS.PROMOTION) {
      board[move.to] = { type: move.promotion, color: us };
    }

    /* if we moved the king */
    if (board[move.to].type === KING) {
      kings[board[move.to].color] = move.to;

      /* if we castled, move the rook next to the king */
      if (move.flags & BITS.KSIDE_CASTLE) {
        var castling_to = move.to - 1;
        var castling_from = move.to + 1;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        var castling_to = move.to + 1;
        var castling_from = move.to - 2;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      }

      /* turn off castling */
      castling[us] = '';
    }

    /* turn off castling if we move a rook */
    if (castling[us]) {
      for (var i = 0, len = ROOKS[us].length; i < len; i++) {
        if (
          move.from === ROOKS[us][i].square &&
          castling[us] & ROOKS[us][i].flag
        ) {
          castling[us] ^= ROOKS[us][i].flag;
          break
        }
      }
    }

    /* turn off castling if we capture a rook */
    if (castling[them]) {
      for (var i = 0, len = ROOKS[them].length; i < len; i++) {
        if (
          move.to === ROOKS[them][i].square &&
          castling[them] & ROOKS[them][i].flag
        ) {
          castling[them] ^= ROOKS[them][i].flag;
          break
        }
      }
    }

    /* if big pawn move, update the en passant square */
    if (move.flags & BITS.BIG_PAWN) {
      if (turn === 'b') {
        ep_square = move.to - 16;
      } else {
        ep_square = move.to + 16;
      }
    } else {
      ep_square = EMPTY;
    }

    /* reset the 50 move counter if a pawn is moved or a piece is captured */
    if (move.piece === PAWN) {
      half_moves = 0;
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      half_moves = 0;
    } else {
      half_moves++;
    }

    if (turn === BLACK) {
      move_number++;
    }
    turn = swap_color(turn);
  }

  function undo_move() {
    var old = history.pop();
    if (old == null) {
      return null
    }

    var move = old.move;
    kings = old.kings;
    turn = old.turn;
    castling = old.castling;
    ep_square = old.ep_square;
    half_moves = old.half_moves;
    move_number = old.move_number;

    var us = turn;
    var them = swap_color(turn);

    board[move.from] = board[move.to];
    board[move.from].type = move.piece; // to undo any promotions
    board[move.to] = null;

    if (move.flags & BITS.CAPTURE) {
      board[move.to] = { type: move.captured, color: them };
    } else if (move.flags & BITS.EP_CAPTURE) {
      var index;
      if (us === BLACK) {
        index = move.to - 16;
      } else {
        index = move.to + 16;
      }
      board[index] = { type: PAWN, color: them };
    }

    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      var castling_to, castling_from;
      if (move.flags & BITS.KSIDE_CASTLE) {
        castling_to = move.to + 1;
        castling_from = move.to - 1;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        castling_to = move.to - 2;
        castling_from = move.to + 1;
      }

      board[castling_to] = board[castling_from];
      board[castling_from] = null;
    }

    return move
  }

  /* this function is used to uniquely identify ambiguous moves */
  function get_disambiguator(move, sloppy) {
    var moves = generate_moves({ legal: !sloppy });

    var from = move.from;
    var to = move.to;
    var piece = move.piece;

    var ambiguities = 0;
    var same_rank = 0;
    var same_file = 0;

    for (var i = 0, len = moves.length; i < len; i++) {
      var ambig_from = moves[i].from;
      var ambig_to = moves[i].to;
      var ambig_piece = moves[i].piece;

      /* if a move of the same piece type ends on the same to square, we'll
       * need to add a disambiguator to the algebraic notation
       */
      if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
        ambiguities++;

        if (rank(from) === rank(ambig_from)) {
          same_rank++;
        }

        if (file(from) === file(ambig_from)) {
          same_file++;
        }
      }
    }

    if (ambiguities > 0) {
      /* if there exists a similar moving piece on the same rank and file as
       * the move in question, use the square as the disambiguator
       */
      if (same_rank > 0 && same_file > 0) {
        return algebraic(from)
      } else if (same_file > 0) {
        /* if the moving piece rests on the same file, use the rank symbol as the
         * disambiguator
         */
        return algebraic(from).charAt(1)
      } else {
        /* else use the file symbol */
        return algebraic(from).charAt(0)
      }
    }

    return ''
  }

  function ascii() {
    var s = '   +------------------------+\n';
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* display the rank */
      if (file(i) === 0) {
        s += ' ' + '87654321'[rank(i)] + ' |';
      }

      /* empty piece */
      if (board[i] == null) {
        s += ' . ';
      } else {
        var piece = board[i].type;
        var color = board[i].color;
        var symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
        s += ' ' + symbol + ' ';
      }

      if ((i + 1) & 0x88) {
        s += '|\n';
        i += 8;
      }
    }
    s += '   +------------------------+\n';
    s += '     a  b  c  d  e  f  g  h\n';

    return s
  }

  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  function move_from_san(move, sloppy) {
    // strip off any move decorations: e.g Nf3+?!
    var clean_move = stripped_san(move);

    // if we're using the sloppy parser run a regex to grab piece, to, and from
    // this should parse invalid SAN like: Pe2-e4, Rc1c4, Qf3xf7
    if (sloppy) {
      var matches = clean_move.match(
        /([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/
      );
      if (matches) {
        var piece = matches[1];
        var from = matches[2];
        var to = matches[3];
        var promotion = matches[4];
      }
    }

    var moves = generate_moves();
    for (var i = 0, len = moves.length; i < len; i++) {
      // try the strict parser first, then the sloppy parser if requested
      // by the user
      if (
        clean_move === stripped_san(move_to_san(moves[i])) ||
        (sloppy && clean_move === stripped_san(move_to_san(moves[i], true)))
      ) {
        return moves[i]
      } else {
        if (
          matches &&
          (!piece || piece.toLowerCase() == moves[i].piece) &&
          SQUARES[from] == moves[i].from &&
          SQUARES[to] == moves[i].to &&
          (!promotion || promotion.toLowerCase() == moves[i].promotion)
        ) {
          return moves[i]
        }
      }
    }

    return null
  }

  /*****************************************************************************
   * UTILITY FUNCTIONS
   ****************************************************************************/
  function rank(i) {
    return i >> 4
  }

  function file(i) {
    return i & 15
  }

  function algebraic(i) {
    var f = file(i),
      r = rank(i);
    return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1)
  }

  function swap_color(c) {
    return c === WHITE ? BLACK : WHITE
  }

  function is_digit(c) {
    return '0123456789'.indexOf(c) !== -1
  }

  /* pretty = external move object */
  function make_pretty(ugly_move) {
    var move = clone(ugly_move);
    move.san = move_to_san(move, false);
    move.to = algebraic(move.to);
    move.from = algebraic(move.from);

    var flags = '';

    for (var flag in BITS) {
      if (BITS[flag] & move.flags) {
        flags += FLAGS[flag];
      }
    }
    move.flags = flags;

    return move
  }

  function clone(obj) {
    var dupe = obj instanceof Array ? [] : {};

    for (var property in obj) {
      if (typeof property === 'object') {
        dupe[property] = clone(obj[property]);
      } else {
        dupe[property] = obj[property];
      }
    }

    return dupe
  }

  function trim(str) {
    return str.replace(/^\s+|\s+$/g, '')
  }

  /*****************************************************************************
   * DEBUGGING UTILITIES
   ****************************************************************************/
  function perft(depth) {
    var moves = generate_moves({ legal: false });
    var nodes = 0;
    var color = turn;

    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i]);
      if (!king_attacked(color)) {
        if (depth - 1 > 0) {
          var child_nodes = perft(depth - 1);
          nodes += child_nodes;
        } else {
          nodes++;
        }
      }
      undo_move();
    }

    return nodes
  }

  return {
    /***************************************************************************
     * PUBLIC CONSTANTS (is there a better way to do this?)
     **************************************************************************/
    WHITE: WHITE,
    BLACK: BLACK,
    PAWN: PAWN,
    KNIGHT: KNIGHT,
    BISHOP: BISHOP,
    ROOK: ROOK,
    QUEEN: QUEEN,
    KING: KING,
    SQUARES: (function() {
      /* from the ECMA-262 spec (section 12.6.4):
       * "The mechanics of enumerating the properties ... is
       * implementation dependent"
       * so: for (var sq in SQUARES) { keys.push(sq); } might not be
       * ordered correctly
       */
      var keys = [];
      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        if (i & 0x88) {
          i += 7;
          continue
        }
        keys.push(algebraic(i));
      }
      return keys
    })(),
    FLAGS: FLAGS,

    /***************************************************************************
     * PUBLIC API
     **************************************************************************/
    load: function(fen) {
      return load(fen)
    },

    reset: function() {
      return reset()
    },

    moves: function(options) {
      /* The internal representation of a chess move is in 0x88 format, and
       * not meant to be human-readable.  The code below converts the 0x88
       * square coordinates to algebraic coordinates.  It also prunes an
       * unnecessary move keys resulting from a verbose call.
       */

      var ugly_moves = generate_moves(options);
      var moves = [];

      for (var i = 0, len = ugly_moves.length; i < len; i++) {
        /* does the user want a full move object (most likely not), or just
         * SAN
         */
        if (
          typeof options !== 'undefined' &&
          'verbose' in options &&
          options.verbose
        ) {
          moves.push(make_pretty(ugly_moves[i]));
        } else {
          moves.push(move_to_san(ugly_moves[i], false));
        }
      }

      return moves
    },

    in_check: function() {
      return in_check()
    },

    in_checkmate: function() {
      return in_checkmate()
    },

    in_stalemate: function() {
      return in_stalemate()
    },

    in_draw: function() {
      return (
        half_moves >= 100 ||
        in_stalemate() ||
        insufficient_material() ||
        in_threefold_repetition()
      )
    },

    insufficient_material: function() {
      return insufficient_material()
    },

    in_threefold_repetition: function() {
      return in_threefold_repetition()
    },

    game_over: function() {
      return (
        half_moves >= 100 ||
        in_checkmate() ||
        in_stalemate() ||
        insufficient_material() ||
        in_threefold_repetition()
      )
    },

    validate_fen: function(fen) {
      return validate_fen(fen)
    },

    fen: function() {
      return generate_fen()
    },

    board: function() {
      var output = [],
        row = [];

      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        if (board[i] == null) {
          row.push(null);
        } else {
          row.push({ type: board[i].type, color: board[i].color });
        }
        if ((i + 1) & 0x88) {
          output.push(row);
          row = [];
          i += 8;
        }
      }

      return output
    },

    pgn: function(options) {
      /* using the specification from http://www.chessclub.com/help/PGN-spec
       * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
       */
      var newline =
        typeof options === 'object' && typeof options.newline_char === 'string'
          ? options.newline_char
          : '\n';
      var max_width =
        typeof options === 'object' && typeof options.max_width === 'number'
          ? options.max_width
          : 0;
      var result = [];
      var header_exists = false;

      /* add the PGN header headerrmation */
      for (var i in header) {
        /* TODO: order of enumerated properties in header object is not
         * guaranteed, see ECMA-262 spec (section 12.6.4)
         */
        result.push('[' + i + ' "' + header[i] + '"]' + newline);
        header_exists = true;
      }

      if (header_exists && history.length) {
        result.push(newline);
      }

      var append_comment = function(move_string) {
        var comment = comments[generate_fen()];
        if (typeof comment !== 'undefined') {
          var delimiter = move_string.length > 0 ? ' ' : '';
          move_string = `${move_string}${delimiter}{${comment}}`;
        }
        return move_string
      };

      /* pop all of history onto reversed_history */
      var reversed_history = [];
      while (history.length > 0) {
        reversed_history.push(undo_move());
      }

      var moves = [];
      var move_string = '';

      /* special case of a commented starting position with no moves */
      if (reversed_history.length === 0) {
        moves.push(append_comment(''));
      }

      /* build the list of moves.  a move_string looks like: "3. e3 e6" */
      while (reversed_history.length > 0) {
        move_string = append_comment(move_string);
        var move = reversed_history.pop();

        /* if the position started with black to move, start PGN with 1. ... */
        if (!history.length && move.color === 'b') {
          move_string = move_number + '. ...';
        } else if (move.color === 'w') {
          /* store the previous generated move_string if we have one */
          if (move_string.length) {
            moves.push(move_string);
          }
          move_string = move_number + '.';
        }

        move_string = move_string + ' ' + move_to_san(move, false);
        make_move(move);
      }

      /* are there any other leftover moves? */
      if (move_string.length) {
        moves.push(append_comment(move_string));
      }

      /* is there a result? */
      if (typeof header.Result !== 'undefined') {
        moves.push(header.Result);
      }

      /* history should be back to what it was before we started generating PGN,
       * so join together moves
       */
      if (max_width === 0) {
        return result.join('') + moves.join(' ')
      }

      var strip = function() {
        if (result.length > 0 && result[result.length - 1] === ' ') {
          result.pop();
          return true;
        }
        return false;
      };

      /* NB: this does not preserve comment whitespace. */
      var wrap_comment = function(width, move) {
        for (var token of move.split(' ')) {
          if (!token) {
            continue;
          }
          if (width + token.length > max_width) {
            while (strip()) {
              width--;
            }
            result.push(newline);
            width = 0;
          }
          result.push(token);
          width += token.length;
          result.push(' ');
          width++;
        }
        if (strip()) {
          width--;
        }
        return width;
      };

      /* wrap the PGN output at max_width */
      var current_width = 0;
      for (var i = 0; i < moves.length; i++) {
        if (current_width + moves[i].length > max_width) {
          if (moves[i].includes('{')) {
            current_width = wrap_comment(current_width, moves[i]);
            continue;
          }
        }
        /* if the current move will push past max_width */
        if (current_width + moves[i].length > max_width && i !== 0) {
          /* don't end the line with whitespace */
          if (result[result.length - 1] === ' ') {
            result.pop();
          }

          result.push(newline);
          current_width = 0;
        } else if (i !== 0) {
          result.push(' ');
          current_width++;
        }
        result.push(moves[i]);
        current_width += moves[i].length;
      }

      return result.join('')
    },

    load_pgn: function(pgn, options) {
      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      var sloppy =
        typeof options !== 'undefined' && 'sloppy' in options
          ? options.sloppy
          : false;

      function mask(str) {
        return str.replace(/\\/g, '\\')
      }

      function has_keys(object) {
        for (var key in object) {
          return true
        }
        return false
      }

      function parse_pgn_header(header, options) {
        var newline_char =
          typeof options === 'object' &&
          typeof options.newline_char === 'string'
            ? options.newline_char
            : '\r?\n';
        var header_obj = {};
        var headers = header.split(new RegExp(mask(newline_char)));
        var key = '';
        var value = '';

        for (var i = 0; i < headers.length; i++) {
          key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1');
          value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\ *\]$/, '$1');
          if (trim(key).length > 0) {
            header_obj[key] = value;
          }
        }

        return header_obj
      }

      var newline_char =
        typeof options === 'object' && typeof options.newline_char === 'string'
          ? options.newline_char
          : '\r?\n';

      // RegExp to split header. Takes advantage of the fact that header and movetext
      // will always have a blank line between them (ie, two newline_char's).
      // With default newline_char, will equal: /^(\[((?:\r?\n)|.)*\])(?:\r?\n){2}/
      var header_regex = new RegExp(
        '^(\\[((?:' +
          mask(newline_char) +
          ')|.)*\\])' +
          '(?:' +
          mask(newline_char) +
          '){2}'
      );

      // If no header given, begin with moves.
      var header_string = header_regex.test(pgn)
        ? header_regex.exec(pgn)[1]
        : '';

      // Put the board in the starting position
      reset();

      /* parse PGN header */
      var headers = parse_pgn_header(header_string, options);
      for (var key in headers) {
        set_header([key, headers[key]]);
      }

      /* load the starting position indicated by [Setup '1'] and
       * [FEN position] */
      if (headers['SetUp'] === '1') {
        if (!('FEN' in headers && load(headers['FEN'], true))) {
          // second argument to load: don't clear the headers
          return false
        }
      }

      /* NB: the regexes below that delete move numbers, recursive
       * annotations, and numeric annotation glyphs may also match
       * text in comments. To prevent this, we transform comments
       * by hex-encoding them in place and decoding them again after
       * the other tokens have been deleted.
       *
       * While the spec states that PGN files should be ASCII encoded,
       * we use {en,de}codeURIComponent here to support arbitrary UTF8
       * as a convenience for modern users */

      var to_hex = function(string) {
        return Array
          .from(string)
          .map(function(c) {
            /* encodeURI doesn't transform most ASCII characters,
             * so we handle these ourselves */
            return c.charCodeAt(0) < 128
              ? c.charCodeAt(0).toString(16)
              : encodeURIComponent(c).replace(/\%/g, '').toLowerCase()
          })
          .join('')
      };

      var from_hex = function(string) {
        return string.length == 0
          ? ''
          : decodeURIComponent('%' + string.match(/.{1,2}/g).join('%'))
      };

      var encode_comment = function(string) {
        string = string.replace(new RegExp(mask(newline_char), 'g'), ' ');
        return `{${to_hex(string.slice(1, string.length - 1))}}`
      };

      var decode_comment = function(string) {
        if (string.startsWith('{') && string.endsWith('}')) {
          return from_hex(string.slice(1, string.length - 1))
        }
      };

      /* delete header to get the moves */
      var ms = pgn
        .replace(header_string, '')
        .replace(
          /* encode comments so they don't get deleted below */
          new RegExp(`(\{[^}]*\})+?|;([^${mask(newline_char)}]*)`, 'g'),
          function(match, bracket, semicolon) {
            return bracket !== undefined
              ? encode_comment(bracket)
              : ' ' + encode_comment(`{${semicolon.slice(1)}}`)
          }
        )
        .replace(new RegExp(mask(newline_char), 'g'), ' ');

      /* delete recursive annotation variations */
      var rav_regex = /(\([^\(\)]+\))+?/g;
      while (rav_regex.test(ms)) {
        ms = ms.replace(rav_regex, '');
      }

      /* delete move numbers */
      ms = ms.replace(/\d+\.(\.\.)?/g, '');

      /* delete ... indicating black to move */
      ms = ms.replace(/\.\.\./g, '');

      /* delete numeric annotation glyphs */
      ms = ms.replace(/\$\d+/g, '');

      /* trim and get array of moves */
      var moves = trim(ms).split(new RegExp(/\s+/));

      /* delete empty entries */
      moves = moves
        .join(',')
        .replace(/,,+/g, ',')
        .split(',');
      var move = '';

      for (var half_move = 0; half_move < moves.length - 1; half_move++) {
        var comment = decode_comment(moves[half_move]);
        if (comment !== undefined) {
          comments[generate_fen()] = comment;
          continue
        }
        move = move_from_san(moves[half_move], sloppy);

        /* move not possible! (don't clear the board to examine to show the
         * latest valid position)
         */
        if (move == null) {
          return false
        } else {
          make_move(move);
        }
      }

      comment = decode_comment(moves[moves.length - 1]);
      if (comment !== undefined) {
        comments[generate_fen()] = comment;
        moves.pop();
      }

      /* examine last move */
      move = moves[moves.length - 1];
      if (POSSIBLE_RESULTS.indexOf(move) > -1) {
        if (has_keys(header) && typeof header.Result === 'undefined') {
          set_header(['Result', move]);
        }
      } else {
        move = move_from_san(move, sloppy);
        if (move == null) {
          return false
        } else {
          make_move(move);
        }
      }
      return true
    },

    header: function() {
      return set_header(arguments)
    },

    ascii: function() {
      return ascii()
    },

    turn: function() {
      return turn
    },

    move: function(move, options) {
      /* The move function can be called with in the following parameters:
       *
       * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
       *
       * .move({ from: 'h7', <- where the 'move' is a move object (additional
       *         to :'h8',      fields are ignored)
       *         promotion: 'q',
       *      })
       */

      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      var sloppy =
        typeof options !== 'undefined' && 'sloppy' in options
          ? options.sloppy
          : false;

      var move_obj = null;

      if (typeof move === 'string') {
        move_obj = move_from_san(move, sloppy);
      } else if (typeof move === 'object') {
        var moves = generate_moves();

        /* convert the pretty move object to an ugly move object */
        for (var i = 0, len = moves.length; i < len; i++) {
          if (
            move.from === algebraic(moves[i].from) &&
            move.to === algebraic(moves[i].to) &&
            (!('promotion' in moves[i]) ||
              move.promotion === moves[i].promotion)
          ) {
            move_obj = moves[i];
            break
          }
        }
      }

      /* failed to find move */
      if (!move_obj) {
        return null
      }

      /* need to make a copy of move because we can't generate SAN after the
       * move is made
       */
      var pretty_move = make_pretty(move_obj);

      make_move(move_obj);

      return pretty_move
    },

    undo: function() {
      var move = undo_move();
      return move ? make_pretty(move) : null
    },

    clear: function() {
      return clear()
    },

    put: function(piece, square) {
      return put(piece, square)
    },

    get: function(square) {
      return get(square)
    },

    remove: function(square) {
      return remove(square)
    },

    perft: function(depth) {
      return perft(depth)
    },

    square_color: function(square) {
      if (square in SQUARES) {
        var sq_0x88 = SQUARES[square];
        return (rank(sq_0x88) + file(sq_0x88)) % 2 === 0 ? 'light' : 'dark'
      }

      return null
    },

    history: function(options) {
      var reversed_history = [];
      var move_history = [];
      var verbose =
        typeof options !== 'undefined' &&
        'verbose' in options &&
        options.verbose;

      while (history.length > 0) {
        reversed_history.push(undo_move());
      }

      while (reversed_history.length > 0) {
        var move = reversed_history.pop();
        if (verbose) {
          move_history.push(make_pretty(move));
        } else {
          move_history.push(move_to_san(move));
        }
        make_move(move);
      }

      return move_history
    },

    get_comment: function() {
      return comments[generate_fen()];
    },

    set_comment: function(comment) {
      comments[generate_fen()] = comment.replace('{', '[').replace('}', ']');
    },

    delete_comment: function() {
      var comment = comments[generate_fen()];
      delete comments[generate_fen()];
      return comment;
    },

    get_comments: function() {
      prune_comments();
      return Object.keys(comments).map(function(fen) {
        return {fen: fen, comment: comments[fen]};
      });
    },

    delete_comments: function() {
      prune_comments();
      return Object.keys(comments)
        .map(function(fen) {
          var comment = comments[fen];
          delete comments[fen];
          return {fen: fen, comment: comment};
        });
    }
  }
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
exports.Chess = Chess;
});

var types = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.ranks = exports.files = exports.colors = void 0;
exports.colors = ['white', 'black'];
exports.files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
exports.ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

});

var util = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeSquareCenter = exports.createEl = exports.isRightButton = exports.eventPosition = exports.setVisible = exports.translateRel = exports.translateAbs = exports.posToTranslateRel = exports.posToTranslateAbs = exports.samePiece = exports.distanceSq = exports.opposite = exports.timer = exports.memo = exports.allPos = exports.key2pos = exports.pos2key = exports.allKeys = exports.invRanks = void 0;

exports.invRanks = [...types.ranks].reverse();
exports.allKeys = Array.prototype.concat(...types.files.map(c => types.ranks.map(r => c + r)));
const pos2key = (pos) => exports.allKeys[8 * pos[0] + pos[1]];
exports.pos2key = pos2key;
const key2pos = (k) => [k.charCodeAt(0) - 97, k.charCodeAt(1) - 49];
exports.key2pos = key2pos;
exports.allPos = exports.allKeys.map(exports.key2pos);
function memo(f) {
    let v;
    const ret = () => {
        if (v === undefined)
            v = f();
        return v;
    };
    ret.clear = () => {
        v = undefined;
    };
    return ret;
}
exports.memo = memo;
const timer = () => {
    let startAt;
    return {
        start() {
            startAt = performance.now();
        },
        cancel() {
            startAt = undefined;
        },
        stop() {
            if (!startAt)
                return 0;
            const time = performance.now() - startAt;
            startAt = undefined;
            return time;
        },
    };
};
exports.timer = timer;
const opposite = (c) => (c === 'white' ? 'black' : 'white');
exports.opposite = opposite;
const distanceSq = (pos1, pos2) => {
    const dx = pos1[0] - pos2[0], dy = pos1[1] - pos2[1];
    return dx * dx + dy * dy;
};
exports.distanceSq = distanceSq;
const samePiece = (p1, p2) => p1.role === p2.role && p1.color === p2.color;
exports.samePiece = samePiece;
const posToTranslateBase = (pos, asWhite, xFactor, yFactor) => [
    (asWhite ? pos[0] : 7 - pos[0]) * xFactor,
    (asWhite ? 7 - pos[1] : pos[1]) * yFactor,
];
const posToTranslateAbs = (bounds) => {
    const xFactor = bounds.width / 8, yFactor = bounds.height / 8;
    return (pos, asWhite) => posToTranslateBase(pos, asWhite, xFactor, yFactor);
};
exports.posToTranslateAbs = posToTranslateAbs;
const posToTranslateRel = (pos, asWhite) => posToTranslateBase(pos, asWhite, 100, 100);
exports.posToTranslateRel = posToTranslateRel;
const translateAbs = (el, pos) => {
    el.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
};
exports.translateAbs = translateAbs;
const translateRel = (el, percents) => {
    el.style.transform = `translate(${percents[0]}%,${percents[1]}%)`;
};
exports.translateRel = translateRel;
const setVisible = (el, v) => {
    el.style.visibility = v ? 'visible' : 'hidden';
};
exports.setVisible = setVisible;
const eventPosition = (e) => {
    var _a;
    if (e.clientX || e.clientX === 0)
        return [e.clientX, e.clientY];
    if ((_a = e.targetTouches) === null || _a === void 0 ? void 0 : _a[0])
        return [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
    return;
};
exports.eventPosition = eventPosition;
const isRightButton = (e) => e.buttons === 2 || e.button === 2;
exports.isRightButton = isRightButton;
const createEl = (tagName, className) => {
    const el = document.createElement(tagName);
    if (className)
        el.className = className;
    return el;
};
exports.createEl = createEl;
function computeSquareCenter(key, asWhite, bounds) {
    const pos = exports.key2pos(key);
    if (!asWhite) {
        pos[0] = 7 - pos[0];
        pos[1] = 7 - pos[1];
    }
    return [
        bounds.left + (bounds.width * pos[0]) / 8 + bounds.width / 16,
        bounds.top + (bounds.height * (7 - pos[1])) / 8 + bounds.height / 16,
    ];
}
exports.computeSquareCenter = computeSquareCenter;

});

var premove_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.premove = exports.queen = exports.knight = void 0;

function diff(a, b) {
    return Math.abs(a - b);
}
function pawn(color) {
    return (x1, y1, x2, y2) => diff(x1, x2) < 2 &&
        (color === 'white'
            ?
                y2 === y1 + 1 || (y1 <= 1 && y2 === y1 + 2 && x1 === x2)
            : y2 === y1 - 1 || (y1 >= 6 && y2 === y1 - 2 && x1 === x2));
}
const knight = (x1, y1, x2, y2) => {
    const xd = diff(x1, x2);
    const yd = diff(y1, y2);
    return (xd === 1 && yd === 2) || (xd === 2 && yd === 1);
};
exports.knight = knight;
const bishop = (x1, y1, x2, y2) => {
    return diff(x1, x2) === diff(y1, y2);
};
const rook = (x1, y1, x2, y2) => {
    return x1 === x2 || y1 === y2;
};
const queen = (x1, y1, x2, y2) => {
    return bishop(x1, y1, x2, y2) || rook(x1, y1, x2, y2);
};
exports.queen = queen;
function king(color, rookFiles, canCastle) {
    return (x1, y1, x2, y2) => (diff(x1, x2) < 2 && diff(y1, y2) < 2) ||
        (canCastle &&
            y1 === y2 &&
            y1 === (color === 'white' ? 0 : 7) &&
            ((x1 === 4 && ((x2 === 2 && rookFiles.includes(0)) || (x2 === 6 && rookFiles.includes(7)))) ||
                rookFiles.includes(x2)));
}
function rookFilesOf(pieces, color) {
    const backrank = color === 'white' ? '1' : '8';
    const files = [];
    for (const [key, piece] of pieces) {
        if (key[1] === backrank && piece.color === color && piece.role === 'rook') {
            files.push(util.key2pos(key)[0]);
        }
    }
    return files;
}
function premove(pieces, key, canCastle) {
    const piece = pieces.get(key);
    if (!piece)
        return [];
    const pos = util.key2pos(key), r = piece.role, mobility = r === 'pawn'
        ? pawn(piece.color)
        : r === 'knight'
            ? exports.knight
            : r === 'bishop'
                ? bishop
                : r === 'rook'
                    ? rook
                    : r === 'queen'
                        ? exports.queen
                        : king(piece.color, rookFilesOf(pieces, piece.color), canCastle);
    return util.allPos
        .filter(pos2 => (pos[0] !== pos2[0] || pos[1] !== pos2[1]) && mobility(pos[0], pos[1], pos2[0], pos2[1]))
        .map(util.pos2key);
}
exports.premove = premove;

});

var board = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.whitePov = exports.getSnappedKeyAtDomPos = exports.getKeyAtDomPos = exports.stop = exports.cancelMove = exports.playPredrop = exports.playPremove = exports.isDraggable = exports.canMove = exports.unselect = exports.setSelected = exports.selectSquare = exports.dropNewPiece = exports.userMove = exports.baseNewPiece = exports.baseMove = exports.unsetPredrop = exports.unsetPremove = exports.setCheck = exports.setPieces = exports.reset = exports.toggleOrientation = exports.callUserFunction = void 0;


function callUserFunction(f, ...args) {
    if (f)
        setTimeout(() => f(...args), 1);
}
exports.callUserFunction = callUserFunction;
function toggleOrientation(state) {
    state.orientation = util.opposite(state.orientation);
    state.animation.current = state.draggable.current = state.selected = undefined;
}
exports.toggleOrientation = toggleOrientation;
function reset(state) {
    state.lastMove = undefined;
    unselect(state);
    unsetPremove(state);
    unsetPredrop(state);
}
exports.reset = reset;
function setPieces(state, pieces) {
    for (const [key, piece] of pieces) {
        if (piece)
            state.pieces.set(key, piece);
        else
            state.pieces.delete(key);
    }
}
exports.setPieces = setPieces;
function setCheck(state, color) {
    state.check = undefined;
    if (color === true)
        color = state.turnColor;
    if (color)
        for (const [k, p] of state.pieces) {
            if (p.role === 'king' && p.color === color) {
                state.check = k;
            }
        }
}
exports.setCheck = setCheck;
function setPremove(state, orig, dest, meta) {
    unsetPredrop(state);
    state.premovable.current = [orig, dest];
    callUserFunction(state.premovable.events.set, orig, dest, meta);
}
function unsetPremove(state) {
    if (state.premovable.current) {
        state.premovable.current = undefined;
        callUserFunction(state.premovable.events.unset);
    }
}
exports.unsetPremove = unsetPremove;
function setPredrop(state, role, key) {
    unsetPremove(state);
    state.predroppable.current = { role, key };
    callUserFunction(state.predroppable.events.set, role, key);
}
function unsetPredrop(state) {
    const pd = state.predroppable;
    if (pd.current) {
        pd.current = undefined;
        callUserFunction(pd.events.unset);
    }
}
exports.unsetPredrop = unsetPredrop;
function tryAutoCastle(state, orig, dest) {
    if (!state.autoCastle)
        return false;
    const king = state.pieces.get(orig);
    if (!king || king.role !== 'king')
        return false;
    const origPos = util.key2pos(orig);
    const destPos = util.key2pos(dest);
    if ((origPos[1] !== 0 && origPos[1] !== 7) || origPos[1] !== destPos[1])
        return false;
    if (origPos[0] === 4 && !state.pieces.has(dest)) {
        if (destPos[0] === 6)
            dest = util.pos2key([7, destPos[1]]);
        else if (destPos[0] === 2)
            dest = util.pos2key([0, destPos[1]]);
    }
    const rook = state.pieces.get(dest);
    if (!rook || rook.color !== king.color || rook.role !== 'rook')
        return false;
    state.pieces.delete(orig);
    state.pieces.delete(dest);
    if (origPos[0] < destPos[0]) {
        state.pieces.set(util.pos2key([6, destPos[1]]), king);
        state.pieces.set(util.pos2key([5, destPos[1]]), rook);
    }
    else {
        state.pieces.set(util.pos2key([2, destPos[1]]), king);
        state.pieces.set(util.pos2key([3, destPos[1]]), rook);
    }
    return true;
}
function baseMove(state, orig, dest) {
    const origPiece = state.pieces.get(orig), destPiece = state.pieces.get(dest);
    if (orig === dest || !origPiece)
        return false;
    const captured = destPiece && destPiece.color !== origPiece.color ? destPiece : undefined;
    if (dest === state.selected)
        unselect(state);
    callUserFunction(state.events.move, orig, dest, captured);
    if (!tryAutoCastle(state, orig, dest)) {
        state.pieces.set(dest, origPiece);
        state.pieces.delete(orig);
    }
    state.lastMove = [orig, dest];
    state.check = undefined;
    callUserFunction(state.events.change);
    return captured || true;
}
exports.baseMove = baseMove;
function baseNewPiece(state, piece, key, force) {
    if (state.pieces.has(key)) {
        if (force)
            state.pieces.delete(key);
        else
            return false;
    }
    callUserFunction(state.events.dropNewPiece, piece, key);
    state.pieces.set(key, piece);
    state.lastMove = [key];
    state.check = undefined;
    callUserFunction(state.events.change);
    state.movable.dests = undefined;
    state.turnColor = util.opposite(state.turnColor);
    return true;
}
exports.baseNewPiece = baseNewPiece;
function baseUserMove(state, orig, dest) {
    const result = baseMove(state, orig, dest);
    if (result) {
        state.movable.dests = undefined;
        state.turnColor = util.opposite(state.turnColor);
        state.animation.current = undefined;
    }
    return result;
}
function userMove(state, orig, dest) {
    if (canMove(state, orig, dest)) {
        const result = baseUserMove(state, orig, dest);
        if (result) {
            const holdTime = state.hold.stop();
            unselect(state);
            const metadata = {
                premove: false,
                ctrlKey: state.stats.ctrlKey,
                holdTime,
            };
            if (result !== true)
                metadata.captured = result;
            callUserFunction(state.movable.events.after, orig, dest, metadata);
            return true;
        }
    }
    else if (canPremove(state, orig, dest)) {
        setPremove(state, orig, dest, {
            ctrlKey: state.stats.ctrlKey,
        });
        unselect(state);
        return true;
    }
    unselect(state);
    return false;
}
exports.userMove = userMove;
function dropNewPiece(state, orig, dest, force) {
    const piece = state.pieces.get(orig);
    if (piece && (canDrop(state, orig, dest) || force)) {
        state.pieces.delete(orig);
        baseNewPiece(state, piece, dest, force);
        callUserFunction(state.movable.events.afterNewPiece, piece.role, dest, {
            premove: false,
            predrop: false,
        });
    }
    else if (piece && canPredrop(state, orig, dest)) {
        setPredrop(state, piece.role, dest);
    }
    else {
        unsetPremove(state);
        unsetPredrop(state);
    }
    state.pieces.delete(orig);
    unselect(state);
}
exports.dropNewPiece = dropNewPiece;
function selectSquare(state, key, force) {
    callUserFunction(state.events.select, key);
    if (state.selected) {
        if (state.selected === key && !state.draggable.enabled) {
            unselect(state);
            state.hold.cancel();
            return;
        }
        else if ((state.selectable.enabled || force) && state.selected !== key) {
            if (userMove(state, state.selected, key)) {
                state.stats.dragged = false;
                return;
            }
        }
    }
    if (isMovable(state, key) || isPremovable(state, key)) {
        setSelected(state, key);
        state.hold.start();
    }
}
exports.selectSquare = selectSquare;
function setSelected(state, key) {
    state.selected = key;
    if (isPremovable(state, key)) {
        state.premovable.dests = premove_1.premove(state.pieces, key, state.premovable.castle);
    }
    else
        state.premovable.dests = undefined;
}
exports.setSelected = setSelected;
function unselect(state) {
    state.selected = undefined;
    state.premovable.dests = undefined;
    state.hold.cancel();
}
exports.unselect = unselect;
function isMovable(state, orig) {
    const piece = state.pieces.get(orig);
    return (!!piece &&
        (state.movable.color === 'both' || (state.movable.color === piece.color && state.turnColor === piece.color)));
}
function canMove(state, orig, dest) {
    var _a, _b;
    return (orig !== dest && isMovable(state, orig) && (state.movable.free || !!((_b = (_a = state.movable.dests) === null || _a === void 0 ? void 0 : _a.get(orig)) === null || _b === void 0 ? void 0 : _b.includes(dest))));
}
exports.canMove = canMove;
function canDrop(state, orig, dest) {
    const piece = state.pieces.get(orig);
    return (!!piece &&
        (orig === dest || !state.pieces.has(dest)) &&
        (state.movable.color === 'both' || (state.movable.color === piece.color && state.turnColor === piece.color)));
}
function isPremovable(state, orig) {
    const piece = state.pieces.get(orig);
    return !!piece && state.premovable.enabled && state.movable.color === piece.color && state.turnColor !== piece.color;
}
function canPremove(state, orig, dest) {
    return (orig !== dest && isPremovable(state, orig) && premove_1.premove(state.pieces, orig, state.premovable.castle).includes(dest));
}
function canPredrop(state, orig, dest) {
    const piece = state.pieces.get(orig);
    const destPiece = state.pieces.get(dest);
    return (!!piece &&
        (!destPiece || destPiece.color !== state.movable.color) &&
        state.predroppable.enabled &&
        (piece.role !== 'pawn' || (dest[1] !== '1' && dest[1] !== '8')) &&
        state.movable.color === piece.color &&
        state.turnColor !== piece.color);
}
function isDraggable(state, orig) {
    const piece = state.pieces.get(orig);
    return (!!piece &&
        state.draggable.enabled &&
        (state.movable.color === 'both' ||
            (state.movable.color === piece.color && (state.turnColor === piece.color || state.premovable.enabled))));
}
exports.isDraggable = isDraggable;
function playPremove(state) {
    const move = state.premovable.current;
    if (!move)
        return false;
    const orig = move[0], dest = move[1];
    let success = false;
    if (canMove(state, orig, dest)) {
        const result = baseUserMove(state, orig, dest);
        if (result) {
            const metadata = { premove: true };
            if (result !== true)
                metadata.captured = result;
            callUserFunction(state.movable.events.after, orig, dest, metadata);
            success = true;
        }
    }
    unsetPremove(state);
    return success;
}
exports.playPremove = playPremove;
function playPredrop(state, validate) {
    const drop = state.predroppable.current;
    let success = false;
    if (!drop)
        return false;
    if (validate(drop)) {
        const piece = {
            role: drop.role,
            color: state.movable.color,
        };
        if (baseNewPiece(state, piece, drop.key)) {
            callUserFunction(state.movable.events.afterNewPiece, drop.role, drop.key, {
                premove: false,
                predrop: true,
            });
            success = true;
        }
    }
    unsetPredrop(state);
    return success;
}
exports.playPredrop = playPredrop;
function cancelMove(state) {
    unsetPremove(state);
    unsetPredrop(state);
    unselect(state);
}
exports.cancelMove = cancelMove;
function stop(state) {
    state.movable.color = state.movable.dests = state.animation.current = undefined;
    cancelMove(state);
}
exports.stop = stop;
function getKeyAtDomPos(pos, asWhite, bounds) {
    let file = Math.floor((8 * (pos[0] - bounds.left)) / bounds.width);
    if (!asWhite)
        file = 7 - file;
    let rank = 7 - Math.floor((8 * (pos[1] - bounds.top)) / bounds.height);
    if (!asWhite)
        rank = 7 - rank;
    return file >= 0 && file < 8 && rank >= 0 && rank < 8 ? util.pos2key([file, rank]) : undefined;
}
exports.getKeyAtDomPos = getKeyAtDomPos;
function getSnappedKeyAtDomPos(orig, pos, asWhite, bounds) {
    const origPos = util.key2pos(orig);
    const validSnapPos = util.allPos.filter(pos2 => {
        return premove_1.queen(origPos[0], origPos[1], pos2[0], pos2[1]) || premove_1.knight(origPos[0], origPos[1], pos2[0], pos2[1]);
    });
    const validSnapCenters = validSnapPos.map(pos2 => util.computeSquareCenter(util.pos2key(pos2), asWhite, bounds));
    const validSnapDistances = validSnapCenters.map(pos2 => util.distanceSq(pos, pos2));
    const [, closestSnapIndex] = validSnapDistances.reduce((a, b, index) => (a[0] < b ? a : [b, index]), [
        validSnapDistances[0],
        0,
    ]);
    return util.pos2key(validSnapPos[closestSnapIndex]);
}
exports.getSnappedKeyAtDomPos = getSnappedKeyAtDomPos;
function whitePov(s) {
    return s.orientation === 'white';
}
exports.whitePov = whitePov;

});

var fen = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = exports.read = exports.initial = void 0;


exports.initial = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
const roles = {
    p: 'pawn',
    r: 'rook',
    n: 'knight',
    b: 'bishop',
    q: 'queen',
    k: 'king',
};
const letters = {
    pawn: 'p',
    rook: 'r',
    knight: 'n',
    bishop: 'b',
    queen: 'q',
    king: 'k',
};
function read(fen) {
    if (fen === 'start')
        fen = exports.initial;
    const pieces = new Map();
    let row = 7, col = 0;
    for (const c of fen) {
        switch (c) {
            case ' ':
                return pieces;
            case '/':
                --row;
                if (row < 0)
                    return pieces;
                col = 0;
                break;
            case '~':
                const piece = pieces.get(util.pos2key([col, row]));
                if (piece)
                    piece.promoted = true;
                break;
            default:
                const nb = c.charCodeAt(0);
                if (nb < 57)
                    col += nb - 48;
                else {
                    const role = c.toLowerCase();
                    pieces.set(util.pos2key([col, row]), {
                        role: roles[role],
                        color: c === role ? 'black' : 'white',
                    });
                    ++col;
                }
        }
    }
    return pieces;
}
exports.read = read;
function write(pieces) {
    return util.invRanks
        .map(y => types.files
        .map(x => {
        const piece = pieces.get((x + y));
        if (piece) {
            const letter = letters[piece.role];
            return piece.color === 'white' ? letter.toUpperCase() : letter;
        }
        else
            return '1';
    })
        .join(''))
        .join('/')
        .replace(/1{2,}/g, s => s.length.toString());
}
exports.write = write;

});

var config = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.configure = void 0;


function configure(state, config) {
    var _a;
    if ((_a = config.movable) === null || _a === void 0 ? void 0 : _a.dests)
        state.movable.dests = undefined;
    merge(state, config);
    if (config.fen) {
        state.pieces = fen.read(config.fen);
        state.drawable.shapes = [];
    }
    if (config.hasOwnProperty('check'))
        board.setCheck(state, config.check || false);
    if (config.hasOwnProperty('lastMove') && !config.lastMove)
        state.lastMove = undefined;
    else if (config.lastMove)
        state.lastMove = config.lastMove;
    if (state.selected)
        board.setSelected(state, state.selected);
    if (!state.animation.duration || state.animation.duration < 100)
        state.animation.enabled = false;
    if (!state.movable.rookCastle && state.movable.dests) {
        const rank = state.movable.color === 'white' ? '1' : '8', kingStartPos = ('e' + rank), dests = state.movable.dests.get(kingStartPos), king = state.pieces.get(kingStartPos);
        if (!dests || !king || king.role !== 'king')
            return;
        state.movable.dests.set(kingStartPos, dests.filter(d => !(d === 'a' + rank && dests.includes(('c' + rank))) &&
            !(d === 'h' + rank && dests.includes(('g' + rank)))));
    }
}
exports.configure = configure;
function merge(base, extend) {
    for (const key in extend) {
        if (isObject(base[key]) && isObject(extend[key]))
            merge(base[key], extend[key]);
        else
            base[key] = extend[key];
    }
}
function isObject(o) {
    return typeof o === 'object';
}

});

var anim_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.anim = void 0;

function anim(mutation, state) {
    return state.animation.enabled ? animate(mutation, state) : render(mutation, state);
}
exports.anim = anim;
function render(mutation, state) {
    const result = mutation(state);
    state.dom.redraw();
    return result;
}
exports.render = render;
function makePiece(key, piece) {
    return {
        key: key,
        pos: util.key2pos(key),
        piece: piece,
    };
}
function closer(piece, pieces) {
    return pieces.sort((p1, p2) => {
        return util.distanceSq(piece.pos, p1.pos) - util.distanceSq(piece.pos, p2.pos);
    })[0];
}
function computePlan(prevPieces, current) {
    const anims = new Map(), animedOrigs = [], fadings = new Map(), missings = [], news = [], prePieces = new Map();
    let curP, preP, vector;
    for (const [k, p] of prevPieces) {
        prePieces.set(k, makePiece(k, p));
    }
    for (const key of util.allKeys) {
        curP = current.pieces.get(key);
        preP = prePieces.get(key);
        if (curP) {
            if (preP) {
                if (!util.samePiece(curP, preP.piece)) {
                    missings.push(preP);
                    news.push(makePiece(key, curP));
                }
            }
            else
                news.push(makePiece(key, curP));
        }
        else if (preP)
            missings.push(preP);
    }
    for (const newP of news) {
        preP = closer(newP, missings.filter(p => util.samePiece(newP.piece, p.piece)));
        if (preP) {
            vector = [preP.pos[0] - newP.pos[0], preP.pos[1] - newP.pos[1]];
            anims.set(newP.key, vector.concat(vector));
            animedOrigs.push(preP.key);
        }
    }
    for (const p of missings) {
        if (!animedOrigs.includes(p.key))
            fadings.set(p.key, p.piece);
    }
    return {
        anims: anims,
        fadings: fadings,
    };
}
function step(state, now) {
    const cur = state.animation.current;
    if (cur === undefined) {
        if (!state.dom.destroyed)
            state.dom.redrawNow();
        return;
    }
    const rest = 1 - (now - cur.start) * cur.frequency;
    if (rest <= 0) {
        state.animation.current = undefined;
        state.dom.redrawNow();
    }
    else {
        const ease = easing(rest);
        for (const cfg of cur.plan.anims.values()) {
            cfg[2] = cfg[0] * ease;
            cfg[3] = cfg[1] * ease;
        }
        state.dom.redrawNow(true);
        requestAnimationFrame((now = performance.now()) => step(state, now));
    }
}
function animate(mutation, state) {
    const prevPieces = new Map(state.pieces);
    const result = mutation(state);
    const plan = computePlan(prevPieces, state);
    if (plan.anims.size || plan.fadings.size) {
        const alreadyRunning = state.animation.current && state.animation.current.start;
        state.animation.current = {
            start: performance.now(),
            frequency: 1 / state.animation.duration,
            plan: plan,
        };
        if (!alreadyRunning)
            step(state, performance.now());
    }
    else {
        state.dom.redraw();
    }
    return result;
}
function easing(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

});

var draw = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.cancel = exports.end = exports.move = exports.processDraw = exports.start = void 0;


const brushes = ['green', 'red', 'blue', 'yellow'];
function start(state, e) {
    if (e.touches && e.touches.length > 1)
        return;
    e.stopPropagation();
    e.preventDefault();
    e.ctrlKey ? board.unselect(state) : board.cancelMove(state);
    const pos = util.eventPosition(e), orig = board.getKeyAtDomPos(pos, board.whitePov(state), state.dom.bounds());
    if (!orig)
        return;
    state.drawable.current = {
        orig,
        pos,
        brush: eventBrush(e),
        snapToValidMove: state.drawable.defaultSnapToValidMove,
    };
    processDraw(state);
}
exports.start = start;
function processDraw(state) {
    requestAnimationFrame(() => {
        const cur = state.drawable.current;
        if (cur) {
            const keyAtDomPos = board.getKeyAtDomPos(cur.pos, board.whitePov(state), state.dom.bounds());
            if (!keyAtDomPos) {
                cur.snapToValidMove = false;
            }
            const mouseSq = cur.snapToValidMove
                ? board.getSnappedKeyAtDomPos(cur.orig, cur.pos, board.whitePov(state), state.dom.bounds())
                : keyAtDomPos;
            if (mouseSq !== cur.mouseSq) {
                cur.mouseSq = mouseSq;
                cur.dest = mouseSq !== cur.orig ? mouseSq : undefined;
                state.dom.redrawNow();
            }
            processDraw(state);
        }
    });
}
exports.processDraw = processDraw;
function move(state, e) {
    if (state.drawable.current)
        state.drawable.current.pos = util.eventPosition(e);
}
exports.move = move;
function end(state) {
    const cur = state.drawable.current;
    if (cur) {
        if (cur.mouseSq)
            addShape(state.drawable, cur);
        cancel(state);
    }
}
exports.end = end;
function cancel(state) {
    if (state.drawable.current) {
        state.drawable.current = undefined;
        state.dom.redraw();
    }
}
exports.cancel = cancel;
function clear(state) {
    if (state.drawable.shapes.length) {
        state.drawable.shapes = [];
        state.dom.redraw();
        onChange(state.drawable);
    }
}
exports.clear = clear;
function eventBrush(e) {
    var _a;
    const modA = (e.shiftKey || e.ctrlKey) && util.isRightButton(e);
    const modB = e.altKey || e.metaKey || ((_a = e.getModifierState) === null || _a === void 0 ? void 0 : _a.call(e, 'AltGraph'));
    return brushes[(modA ? 1 : 0) + (modB ? 2 : 0)];
}
function addShape(drawable, cur) {
    const sameShape = (s) => s.orig === cur.orig && s.dest === cur.dest;
    const similar = drawable.shapes.find(sameShape);
    if (similar)
        drawable.shapes = drawable.shapes.filter(s => !sameShape(s));
    if (!similar || similar.brush !== cur.brush)
        drawable.shapes.push(cur);
    onChange(drawable);
}
function onChange(drawable) {
    if (drawable.onChange)
        drawable.onChange(drawable.shapes);
}

});

var drag = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancel = exports.end = exports.move = exports.dragNewPiece = exports.start = void 0;




function start(s, e) {
    if (!e.isTrusted || (e.button !== undefined && e.button !== 0))
        return;
    if (e.touches && e.touches.length > 1)
        return;
    const bounds = s.dom.bounds(), position = util.eventPosition(e), orig = board.getKeyAtDomPos(position, board.whitePov(s), bounds);
    if (!orig)
        return;
    const piece = s.pieces.get(orig);
    const previouslySelected = s.selected;
    if (!previouslySelected && s.drawable.enabled && (s.drawable.eraseOnClick || !piece || piece.color !== s.turnColor))
        draw.clear(s);
    if (e.cancelable !== false &&
        (!e.touches || !s.movable.color || piece || previouslySelected || pieceCloseTo(s, position)))
        e.preventDefault();
    const hadPremove = !!s.premovable.current;
    const hadPredrop = !!s.predroppable.current;
    s.stats.ctrlKey = e.ctrlKey;
    if (s.selected && board.canMove(s, s.selected, orig)) {
        anim_1.anim(state => board.selectSquare(state, orig), s);
    }
    else {
        board.selectSquare(s, orig);
    }
    const stillSelected = s.selected === orig;
    const element = pieceElementByKey(s, orig);
    if (piece && element && stillSelected && board.isDraggable(s, orig)) {
        s.draggable.current = {
            orig,
            piece,
            origPos: position,
            pos: position,
            started: s.draggable.autoDistance && s.stats.dragged,
            element,
            previouslySelected,
            originTarget: e.target,
        };
        element.cgDragging = true;
        element.classList.add('dragging');
        const ghost = s.dom.elements.ghost;
        if (ghost) {
            ghost.className = `ghost ${piece.color} ${piece.role}`;
            util.translateAbs(ghost, util.posToTranslateAbs(bounds)(util.key2pos(orig), board.whitePov(s)));
            util.setVisible(ghost, true);
        }
        processDrag(s);
    }
    else {
        if (hadPremove)
            board.unsetPremove(s);
        if (hadPredrop)
            board.unsetPredrop(s);
    }
    s.dom.redraw();
}
exports.start = start;
function pieceCloseTo(s, pos) {
    const asWhite = board.whitePov(s), bounds = s.dom.bounds(), radiusSq = Math.pow(bounds.width / 8, 2);
    for (const key in s.pieces) {
        const center = util.computeSquareCenter(key, asWhite, bounds);
        if (util.distanceSq(center, pos) <= radiusSq)
            return true;
    }
    return false;
}
function dragNewPiece(s, piece, e, force) {
    const key = 'a0';
    s.pieces.set(key, piece);
    s.dom.redraw();
    const position = util.eventPosition(e);
    s.draggable.current = {
        orig: key,
        piece,
        origPos: position,
        pos: position,
        started: true,
        element: () => pieceElementByKey(s, key),
        originTarget: e.target,
        newPiece: true,
        force: !!force,
    };
    processDrag(s);
}
exports.dragNewPiece = dragNewPiece;
function processDrag(s) {
    requestAnimationFrame(() => {
        var _a;
        const cur = s.draggable.current;
        if (!cur)
            return;
        if ((_a = s.animation.current) === null || _a === void 0 ? void 0 : _a.plan.anims.has(cur.orig))
            s.animation.current = undefined;
        const origPiece = s.pieces.get(cur.orig);
        if (!origPiece || !util.samePiece(origPiece, cur.piece))
            cancel(s);
        else {
            if (!cur.started && util.distanceSq(cur.pos, cur.origPos) >= Math.pow(s.draggable.distance, 2))
                cur.started = true;
            if (cur.started) {
                if (typeof cur.element === 'function') {
                    const found = cur.element();
                    if (!found)
                        return;
                    found.cgDragging = true;
                    found.classList.add('dragging');
                    cur.element = found;
                }
                const bounds = s.dom.bounds();
                util.translateAbs(cur.element, [
                    cur.pos[0] - bounds.left - bounds.width / 16,
                    cur.pos[1] - bounds.top - bounds.height / 16,
                ]);
            }
        }
        processDrag(s);
    });
}
function move(s, e) {
    if (s.draggable.current && (!e.touches || e.touches.length < 2)) {
        s.draggable.current.pos = util.eventPosition(e);
    }
}
exports.move = move;
function end(s, e) {
    const cur = s.draggable.current;
    if (!cur)
        return;
    if (e.type === 'touchend' && e.cancelable !== false)
        e.preventDefault();
    if (e.type === 'touchend' && cur.originTarget !== e.target && !cur.newPiece) {
        s.draggable.current = undefined;
        return;
    }
    board.unsetPremove(s);
    board.unsetPredrop(s);
    const eventPos = util.eventPosition(e) || cur.pos;
    const dest = board.getKeyAtDomPos(eventPos, board.whitePov(s), s.dom.bounds());
    if (dest && cur.started && cur.orig !== dest) {
        if (cur.newPiece)
            board.dropNewPiece(s, cur.orig, dest, cur.force);
        else {
            s.stats.ctrlKey = e.ctrlKey;
            if (board.userMove(s, cur.orig, dest))
                s.stats.dragged = true;
        }
    }
    else if (cur.newPiece) {
        s.pieces.delete(cur.orig);
    }
    else if (s.draggable.deleteOnDropOff && !dest) {
        s.pieces.delete(cur.orig);
        board.callUserFunction(s.events.change);
    }
    if (cur.orig === cur.previouslySelected && (cur.orig === dest || !dest))
        board.unselect(s);
    else if (!s.selectable.enabled)
        board.unselect(s);
    removeDragElements(s);
    s.draggable.current = undefined;
    s.dom.redraw();
}
exports.end = end;
function cancel(s) {
    const cur = s.draggable.current;
    if (cur) {
        if (cur.newPiece)
            s.pieces.delete(cur.orig);
        s.draggable.current = undefined;
        board.unselect(s);
        removeDragElements(s);
        s.dom.redraw();
    }
}
exports.cancel = cancel;
function removeDragElements(s) {
    const e = s.dom.elements;
    if (e.ghost)
        util.setVisible(e.ghost, false);
}
function pieceElementByKey(s, key) {
    let el = s.dom.elements.board.firstChild;
    while (el) {
        if (el.cgKey === key && el.tagName === 'PIECE')
            return el;
        el = el.nextSibling;
    }
    return;
}

});

var explosion_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.explosion = void 0;
function explosion(state, keys) {
    state.exploding = { stage: 1, keys };
    state.dom.redraw();
    setTimeout(() => {
        setStage(state, 2);
        setTimeout(() => setStage(state, undefined), 120);
    }, 120);
}
exports.explosion = explosion;
function setStage(state, stage) {
    if (state.exploding) {
        if (stage)
            state.exploding.stage = stage;
        else
            state.exploding = undefined;
        state.dom.redraw();
    }
}

});

var api = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;






function start(state, redrawAll) {
    function toggleOrientation() {
        board.toggleOrientation(state);
        redrawAll();
    }
    return {
        set(config$1) {
            if (config$1.orientation && config$1.orientation !== state.orientation)
                toggleOrientation();
            (config$1.fen ? anim_1.anim : anim_1.render)(state => config.configure(state, config$1), state);
        },
        state,
        getFen: () => fen.write(state.pieces),
        toggleOrientation,
        setPieces(pieces) {
            anim_1.anim(state => board.setPieces(state, pieces), state);
        },
        selectSquare(key, force) {
            if (key)
                anim_1.anim(state => board.selectSquare(state, key, force), state);
            else if (state.selected) {
                board.unselect(state);
                state.dom.redraw();
            }
        },
        move(orig, dest) {
            anim_1.anim(state => board.baseMove(state, orig, dest), state);
        },
        newPiece(piece, key) {
            anim_1.anim(state => board.baseNewPiece(state, piece, key), state);
        },
        playPremove() {
            if (state.premovable.current) {
                if (anim_1.anim(board.playPremove, state))
                    return true;
                state.dom.redraw();
            }
            return false;
        },
        playPredrop(validate) {
            if (state.predroppable.current) {
                const result = board.playPredrop(state, validate);
                state.dom.redraw();
                return result;
            }
            return false;
        },
        cancelPremove() {
            anim_1.render(board.unsetPremove, state);
        },
        cancelPredrop() {
            anim_1.render(board.unsetPredrop, state);
        },
        cancelMove() {
            anim_1.render(state => {
                board.cancelMove(state);
                drag.cancel(state);
            }, state);
        },
        stop() {
            anim_1.render(state => {
                board.stop(state);
                drag.cancel(state);
            }, state);
        },
        explode(keys) {
            explosion_1.explosion(state, keys);
        },
        setAutoShapes(shapes) {
            anim_1.render(state => (state.drawable.autoShapes = shapes), state);
        },
        setShapes(shapes) {
            anim_1.render(state => (state.drawable.shapes = shapes), state);
        },
        getKeyAtDomPos(pos) {
            return board.getKeyAtDomPos(pos, board.whitePov(state), state.dom.bounds());
        },
        redrawAll,
        dragNewPiece(piece, event, force) {
            drag.dragNewPiece(state, piece, event, force);
        },
        destroy() {
            board.stop(state);
            state.dom.unbind && state.dom.unbind();
            state.dom.destroyed = true;
        },
    };
}
exports.start = start;

});

var state = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = void 0;


function defaults() {
    return {
        pieces: fen.read(fen.initial),
        orientation: 'white',
        turnColor: 'white',
        coordinates: true,
        autoCastle: true,
        viewOnly: false,
        disableContextMenu: false,
        resizable: true,
        addPieceZIndex: false,
        pieceKey: false,
        highlight: {
            lastMove: true,
            check: true,
        },
        animation: {
            enabled: true,
            duration: 200,
        },
        movable: {
            free: true,
            color: 'both',
            showDests: true,
            events: {},
            rookCastle: true,
        },
        premovable: {
            enabled: true,
            showDests: true,
            castle: true,
            events: {},
        },
        predroppable: {
            enabled: false,
            events: {},
        },
        draggable: {
            enabled: true,
            distance: 3,
            autoDistance: true,
            showGhost: true,
            deleteOnDropOff: false,
        },
        dropmode: {
            active: false,
        },
        selectable: {
            enabled: true,
        },
        stats: {
            dragged: !('ontouchstart' in window),
        },
        events: {},
        drawable: {
            enabled: true,
            visible: true,
            defaultSnapToValidMove: true,
            eraseOnClick: true,
            shapes: [],
            autoShapes: [],
            brushes: {
                green: { key: 'g', color: '#15781B', opacity: 1, lineWidth: 10 },
                red: { key: 'r', color: '#882020', opacity: 1, lineWidth: 10 },
                blue: { key: 'b', color: '#003088', opacity: 1, lineWidth: 10 },
                yellow: { key: 'y', color: '#e68f00', opacity: 1, lineWidth: 10 },
                paleBlue: { key: 'pb', color: '#003088', opacity: 0.4, lineWidth: 15 },
                paleGreen: { key: 'pg', color: '#15781B', opacity: 0.4, lineWidth: 15 },
                paleRed: { key: 'pr', color: '#882020', opacity: 0.4, lineWidth: 15 },
                paleGrey: {
                    key: 'pgr',
                    color: '#4a4a4a',
                    opacity: 0.35,
                    lineWidth: 15,
                },
            },
            pieces: {
                baseUrl: 'https://lichess1.org/assets/piece/cburnett/',
            },
            prevSvgHash: '',
        },
        hold: util.timer(),
    };
}
exports.defaults = defaults;

});

var svg = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAttributes = exports.renderSvg = exports.createElement = void 0;

function createElement(tagName) {
    return document.createElementNS('http://www.w3.org/2000/svg', tagName);
}
exports.createElement = createElement;
function renderSvg(state, svg, customSvg) {
    const d = state.drawable, curD = d.current, cur = curD && curD.mouseSq ? curD : undefined, arrowDests = new Map(), bounds = state.dom.bounds();
    for (const s of d.shapes.concat(d.autoShapes).concat(cur ? [cur] : [])) {
        if (s.dest)
            arrowDests.set(s.dest, (arrowDests.get(s.dest) || 0) + 1);
    }
    const shapes = d.shapes.concat(d.autoShapes).map((s) => {
        return {
            shape: s,
            current: false,
            hash: shapeHash(s, arrowDests, false, bounds),
        };
    });
    if (cur)
        shapes.push({
            shape: cur,
            current: true,
            hash: shapeHash(cur, arrowDests, true, bounds),
        });
    const fullHash = shapes.map(sc => sc.hash).join(';');
    if (fullHash === state.drawable.prevSvgHash)
        return;
    state.drawable.prevSvgHash = fullHash;
    const defsEl = svg.querySelector('defs');
    const shapesEl = svg.querySelector('g');
    const customSvgsEl = customSvg.querySelector('g');
    syncDefs(d, shapes, defsEl);
    syncShapes(state, shapes.filter(s => !s.shape.customSvg), d.brushes, arrowDests, shapesEl);
    syncShapes(state, shapes.filter(s => s.shape.customSvg), d.brushes, arrowDests, customSvgsEl);
}
exports.renderSvg = renderSvg;
function syncDefs(d, shapes, defsEl) {
    const brushes = new Map();
    let brush;
    for (const s of shapes) {
        if (s.shape.dest) {
            brush = d.brushes[s.shape.brush];
            if (s.shape.modifiers)
                brush = makeCustomBrush(brush, s.shape.modifiers);
            brushes.set(brush.key, brush);
        }
    }
    const keysInDom = new Set();
    let el = defsEl.firstChild;
    while (el) {
        keysInDom.add(el.getAttribute('cgKey'));
        el = el.nextSibling;
    }
    for (const [key, brush] of brushes.entries()) {
        if (!keysInDom.has(key))
            defsEl.appendChild(renderMarker(brush));
    }
}
function syncShapes(state, shapes, brushes, arrowDests, root) {
    const bounds = state.dom.bounds(), hashesInDom = new Map(), toRemove = [];
    for (const sc of shapes)
        hashesInDom.set(sc.hash, false);
    let el = root.firstChild, elHash;
    while (el) {
        elHash = el.getAttribute('cgHash');
        if (hashesInDom.has(elHash))
            hashesInDom.set(elHash, true);
        else
            toRemove.push(el);
        el = el.nextSibling;
    }
    for (const el of toRemove)
        root.removeChild(el);
    for (const sc of shapes) {
        if (!hashesInDom.get(sc.hash))
            root.appendChild(renderShape(state, sc, brushes, arrowDests, bounds));
    }
}
function shapeHash({ orig, dest, brush, piece, modifiers, customSvg }, arrowDests, current, bounds) {
    return [
        bounds.width,
        bounds.height,
        current,
        orig,
        dest,
        brush,
        dest && (arrowDests.get(dest) || 0) > 1,
        piece && pieceHash(piece),
        modifiers && modifiersHash(modifiers),
        customSvg && customSvgHash(customSvg),
    ]
        .filter(x => x)
        .join(',');
}
function pieceHash(piece) {
    return [piece.color, piece.role, piece.scale].filter(x => x).join(',');
}
function modifiersHash(m) {
    return '' + (m.lineWidth || '');
}
function customSvgHash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (((h << 5) - h) + s.charCodeAt(i)) >>> 0;
    }
    return 'custom-' + h.toString();
}
function renderShape(state, { shape, current, hash }, brushes, arrowDests, bounds) {
    let el;
    if (shape.customSvg) {
        const orig = orient(util.key2pos(shape.orig), state.orientation);
        el = renderCustomSvg(shape.customSvg, orig, bounds);
    }
    else if (shape.piece)
        el = renderPiece(state.drawable.pieces.baseUrl, orient(util.key2pos(shape.orig), state.orientation), shape.piece, bounds);
    else {
        const orig = orient(util.key2pos(shape.orig), state.orientation);
        if (shape.dest) {
            let brush = brushes[shape.brush];
            if (shape.modifiers)
                brush = makeCustomBrush(brush, shape.modifiers);
            el = renderArrow(brush, orig, orient(util.key2pos(shape.dest), state.orientation), current, (arrowDests.get(shape.dest) || 0) > 1, bounds);
        }
        else
            el = renderCircle(brushes[shape.brush], orig, current, bounds);
    }
    el.setAttribute('cgHash', hash);
    return el;
}
function renderCustomSvg(customSvg, pos, bounds) {
    const { width, height } = bounds;
    const w = width / 8;
    const h = height / 8;
    const x = pos[0] * w;
    const y = (7 - pos[1]) * h;
    const g = setAttributes(createElement('g'), { transform: `translate(${x},${y})` });
    const svg = setAttributes(createElement('svg'), { width: w, height: h, viewBox: '0 0 100 100' });
    g.appendChild(svg);
    svg.innerHTML = customSvg;
    return g;
}
function renderCircle(brush, pos, current, bounds) {
    const o = pos2px(pos, bounds), widths = circleWidth(bounds), radius = (bounds.width + bounds.height) / 32;
    return setAttributes(createElement('circle'), {
        stroke: brush.color,
        'stroke-width': widths[current ? 0 : 1],
        fill: 'none',
        opacity: opacity(brush, current),
        cx: o[0],
        cy: o[1],
        r: radius - widths[1] / 2,
    });
}
function renderArrow(brush, orig, dest, current, shorten, bounds) {
    const m = arrowMargin(bounds, shorten && !current), a = pos2px(orig, bounds), b = pos2px(dest, bounds), dx = b[0] - a[0], dy = b[1] - a[1], angle = Math.atan2(dy, dx), xo = Math.cos(angle) * m, yo = Math.sin(angle) * m;
    return setAttributes(createElement('line'), {
        stroke: brush.color,
        'stroke-width': lineWidth(brush, current, bounds),
        'stroke-linecap': 'round',
        'marker-end': 'url(#arrowhead-' + brush.key + ')',
        opacity: opacity(brush, current),
        x1: a[0],
        y1: a[1],
        x2: b[0] - xo,
        y2: b[1] - yo,
    });
}
function renderPiece(baseUrl, pos, piece, bounds) {
    const o = pos2px(pos, bounds), size = (bounds.width / 8) * (piece.scale || 1), name = piece.color[0] + (piece.role === 'knight' ? 'n' : piece.role[0]).toUpperCase();
    return setAttributes(createElement('image'), {
        className: `${piece.role} ${piece.color}`,
        x: o[0] - size / 2,
        y: o[1] - size / 2,
        width: size,
        height: size,
        href: baseUrl + name + '.svg',
    });
}
function renderMarker(brush) {
    const marker = setAttributes(createElement('marker'), {
        id: 'arrowhead-' + brush.key,
        orient: 'auto',
        markerWidth: 4,
        markerHeight: 8,
        refX: 2.05,
        refY: 2.01,
    });
    marker.appendChild(setAttributes(createElement('path'), {
        d: 'M0,0 V4 L3,2 Z',
        fill: brush.color,
    }));
    marker.setAttribute('cgKey', brush.key);
    return marker;
}
function setAttributes(el, attrs) {
    for (const key in attrs)
        el.setAttribute(key, attrs[key]);
    return el;
}
exports.setAttributes = setAttributes;
function orient(pos, color) {
    return color === 'white' ? pos : [7 - pos[0], 7 - pos[1]];
}
function makeCustomBrush(base, modifiers) {
    return {
        color: base.color,
        opacity: Math.round(base.opacity * 10) / 10,
        lineWidth: Math.round(modifiers.lineWidth || base.lineWidth),
        key: [base.key, modifiers.lineWidth].filter(x => x).join(''),
    };
}
function circleWidth(bounds) {
    const base = bounds.width / 512;
    return [3 * base, 4 * base];
}
function lineWidth(brush, current, bounds) {
    return (((brush.lineWidth || 10) * (current ? 0.85 : 1)) / 512) * bounds.width;
}
function opacity(brush, current) {
    return (brush.opacity || 1) * (current ? 0.9 : 1);
}
function arrowMargin(bounds, shorten) {
    return ((shorten ? 20 : 10) / 512) * bounds.width;
}
function pos2px(pos, bounds) {
    return [((pos[0] + 0.5) * bounds.width) / 8, ((7.5 - pos[1]) * bounds.height) / 8];
}

});

var wrap = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderWrap = void 0;



function renderWrap(element, s, relative) {
    element.innerHTML = '';
    element.classList.add('cg-wrap');
    for (const c of types.colors)
        element.classList.toggle('orientation-' + c, s.orientation === c);
    element.classList.toggle('manipulable', !s.viewOnly);
    const helper = util.createEl('cg-helper');
    element.appendChild(helper);
    const container = util.createEl('cg-container');
    helper.appendChild(container);
    const board = util.createEl('cg-board');
    container.appendChild(board);
    let svg$1;
    let customSvg;
    if (s.drawable.visible && !relative) {
        svg$1 = svg.setAttributes(svg.createElement('svg'), { 'class': 'cg-shapes' });
        svg$1.appendChild(svg.createElement('defs'));
        svg$1.appendChild(svg.createElement('g'));
        customSvg = svg.setAttributes(svg.createElement('svg'), { 'class': 'cg-custom-svgs' });
        customSvg.appendChild(svg.createElement('g'));
        container.appendChild(svg$1);
        container.appendChild(customSvg);
    }
    if (s.coordinates) {
        const orientClass = s.orientation === 'black' ? ' black' : '';
        container.appendChild(renderCoords(types.ranks, 'ranks' + orientClass));
        container.appendChild(renderCoords(types.files, 'files' + orientClass));
    }
    let ghost;
    if (s.draggable.showGhost && !relative) {
        ghost = util.createEl('piece', 'ghost');
        util.setVisible(ghost, false);
        container.appendChild(ghost);
    }
    return {
        board,
        container,
        ghost,
        svg: svg$1,
        customSvg,
    };
}
exports.renderWrap = renderWrap;
function renderCoords(elems, className) {
    const el = util.createEl('coords', className);
    let f;
    for (const elem of elems) {
        f = util.createEl('coord');
        f.textContent = elem;
        el.appendChild(f);
    }
    return el;
}

});

var drop_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.drop = exports.cancelDropMode = exports.setDropMode = void 0;



function setDropMode(s, piece) {
    s.dropmode = {
        active: true,
        piece,
    };
    drag.cancel(s);
}
exports.setDropMode = setDropMode;
function cancelDropMode(s) {
    s.dropmode = {
        active: false,
    };
}
exports.cancelDropMode = cancelDropMode;
function drop(s, e) {
    if (!s.dropmode.active)
        return;
    board.unsetPremove(s);
    board.unsetPredrop(s);
    const piece = s.dropmode.piece;
    if (piece) {
        s.pieces.set('a0', piece);
        const position = util.eventPosition(e);
        const dest = position && board.getKeyAtDomPos(position, board.whitePov(s), s.dom.bounds());
        if (dest)
            board.dropNewPiece(s, 'a0', dest);
    }
    s.dom.redraw();
}
exports.drop = drop;

});

var events = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindDocument = exports.bindBoard = void 0;




function bindBoard(s, boundsUpdated) {
    const boardEl = s.dom.elements.board;
    if (!s.dom.relative && s.resizable && 'ResizeObserver' in window) {
        const observer = new window['ResizeObserver'](boundsUpdated);
        observer.observe(boardEl);
    }
    if (s.viewOnly)
        return;
    const onStart = startDragOrDraw(s);
    boardEl.addEventListener('touchstart', onStart, {
        passive: false,
    });
    boardEl.addEventListener('mousedown', onStart, {
        passive: false,
    });
    if (s.disableContextMenu || s.drawable.enabled) {
        boardEl.addEventListener('contextmenu', e => e.preventDefault());
    }
}
exports.bindBoard = bindBoard;
function bindDocument(s, boundsUpdated) {
    const unbinds = [];
    if (!s.dom.relative && s.resizable && !('ResizeObserver' in window)) {
        unbinds.push(unbindable(document.body, 'chessground.resize', boundsUpdated));
    }
    if (!s.viewOnly) {
        const onmove = dragOrDraw(s, drag.move, draw.move);
        const onend = dragOrDraw(s, drag.end, draw.end);
        for (const ev of ['touchmove', 'mousemove'])
            unbinds.push(unbindable(document, ev, onmove));
        for (const ev of ['touchend', 'mouseup'])
            unbinds.push(unbindable(document, ev, onend));
        const onScroll = () => s.dom.bounds.clear();
        unbinds.push(unbindable(document, 'scroll', onScroll, { capture: true, passive: true }));
        unbinds.push(unbindable(window, 'resize', onScroll, { passive: true }));
    }
    return () => unbinds.forEach(f => f());
}
exports.bindDocument = bindDocument;
function unbindable(el, eventName, callback, options) {
    el.addEventListener(eventName, callback, options);
    return () => el.removeEventListener(eventName, callback, options);
}
function startDragOrDraw(s) {
    return e => {
        if (s.draggable.current)
            drag.cancel(s);
        else if (s.drawable.current)
            draw.cancel(s);
        else if (e.shiftKey || util.isRightButton(e)) {
            if (s.drawable.enabled)
                draw.start(s, e);
        }
        else if (!s.viewOnly) {
            if (s.dropmode.active)
                drop_1.drop(s, e);
            else
                drag.start(s, e);
        }
    };
}
function dragOrDraw(s, withDrag, withDraw) {
    return e => {
        if (s.drawable.current) {
            if (s.drawable.enabled)
                withDraw(s, e);
        }
        else if (!s.viewOnly)
            withDrag(s, e);
    };
}

});

var render_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBounds = exports.render = void 0;


const util$1 = util;
function render(s) {
    const asWhite = board.whitePov(s), posToTranslate = s.dom.relative ? util$1.posToTranslateRel : util$1.posToTranslateAbs(s.dom.bounds()), translate = s.dom.relative ? util$1.translateRel : util$1.translateAbs, boardEl = s.dom.elements.board, pieces = s.pieces, curAnim = s.animation.current, anims = curAnim ? curAnim.plan.anims : new Map(), fadings = curAnim ? curAnim.plan.fadings : new Map(), curDrag = s.draggable.current, squares = computeSquareClasses(s), samePieces = new Set(), sameSquares = new Set(), movedPieces = new Map(), movedSquares = new Map();
    let k, el, pieceAtKey, elPieceName, anim, fading, pMvdset, pMvd, sMvdset, sMvd;
    el = boardEl.firstChild;
    while (el) {
        k = el.cgKey;
        if (isPieceNode(el)) {
            pieceAtKey = pieces.get(k);
            anim = anims.get(k);
            fading = fadings.get(k);
            elPieceName = el.cgPiece;
            if (el.cgDragging && (!curDrag || curDrag.orig !== k)) {
                el.classList.remove('dragging');
                translate(el, posToTranslate(util.key2pos(k), asWhite));
                el.cgDragging = false;
            }
            if (!fading && el.cgFading) {
                el.cgFading = false;
                el.classList.remove('fading');
            }
            if (pieceAtKey) {
                if (anim && el.cgAnimating && elPieceName === pieceNameOf(pieceAtKey)) {
                    const pos = util.key2pos(k);
                    pos[0] += anim[2];
                    pos[1] += anim[3];
                    el.classList.add('anim');
                    translate(el, posToTranslate(pos, asWhite));
                }
                else if (el.cgAnimating) {
                    el.cgAnimating = false;
                    el.classList.remove('anim');
                    translate(el, posToTranslate(util.key2pos(k), asWhite));
                    if (s.addPieceZIndex)
                        el.style.zIndex = posZIndex(util.key2pos(k), asWhite);
                }
                if (elPieceName === pieceNameOf(pieceAtKey) && (!fading || !el.cgFading)) {
                    samePieces.add(k);
                }
                else {
                    if (fading && elPieceName === pieceNameOf(fading)) {
                        el.classList.add('fading');
                        el.cgFading = true;
                    }
                    else {
                        appendValue(movedPieces, elPieceName, el);
                    }
                }
            }
            else {
                appendValue(movedPieces, elPieceName, el);
            }
        }
        else if (isSquareNode(el)) {
            const cn = el.className;
            if (squares.get(k) === cn)
                sameSquares.add(k);
            else
                appendValue(movedSquares, cn, el);
        }
        el = el.nextSibling;
    }
    for (const [sk, className] of squares) {
        if (!sameSquares.has(sk)) {
            sMvdset = movedSquares.get(className);
            sMvd = sMvdset && sMvdset.pop();
            const translation = posToTranslate(util.key2pos(sk), asWhite);
            if (sMvd) {
                sMvd.cgKey = sk;
                translate(sMvd, translation);
            }
            else {
                const squareNode = util.createEl('square', className);
                squareNode.cgKey = sk;
                translate(squareNode, translation);
                boardEl.insertBefore(squareNode, boardEl.firstChild);
            }
        }
    }
    for (const [k, p] of pieces) {
        anim = anims.get(k);
        if (!samePieces.has(k)) {
            pMvdset = movedPieces.get(pieceNameOf(p));
            pMvd = pMvdset && pMvdset.pop();
            if (pMvd) {
                pMvd.cgKey = k;
                if (pMvd.cgFading) {
                    pMvd.classList.remove('fading');
                    pMvd.cgFading = false;
                }
                const pos = util.key2pos(k);
                if (s.addPieceZIndex)
                    pMvd.style.zIndex = posZIndex(pos, asWhite);
                if (anim) {
                    pMvd.cgAnimating = true;
                    pMvd.classList.add('anim');
                    pos[0] += anim[2];
                    pos[1] += anim[3];
                }
                translate(pMvd, posToTranslate(pos, asWhite));
            }
            else {
                const pieceName = pieceNameOf(p), pieceNode = util.createEl('piece', pieceName), pos = util.key2pos(k);
                pieceNode.cgPiece = pieceName;
                pieceNode.cgKey = k;
                if (anim) {
                    pieceNode.cgAnimating = true;
                    pos[0] += anim[2];
                    pos[1] += anim[3];
                }
                translate(pieceNode, posToTranslate(pos, asWhite));
                if (s.addPieceZIndex)
                    pieceNode.style.zIndex = posZIndex(pos, asWhite);
                boardEl.appendChild(pieceNode);
            }
        }
    }
    for (const nodes of movedPieces.values())
        removeNodes(s, nodes);
    for (const nodes of movedSquares.values())
        removeNodes(s, nodes);
}
exports.render = render;
function updateBounds(s) {
    if (s.dom.relative)
        return;
    const asWhite = board.whitePov(s), posToTranslate = util$1.posToTranslateAbs(s.dom.bounds());
    let el = s.dom.elements.board.firstChild;
    while (el) {
        if ((isPieceNode(el) && !el.cgAnimating) || isSquareNode(el)) {
            util$1.translateAbs(el, posToTranslate(util.key2pos(el.cgKey), asWhite));
        }
        el = el.nextSibling;
    }
}
exports.updateBounds = updateBounds;
function isPieceNode(el) {
    return el.tagName === 'PIECE';
}
function isSquareNode(el) {
    return el.tagName === 'SQUARE';
}
function removeNodes(s, nodes) {
    for (const node of nodes)
        s.dom.elements.board.removeChild(node);
}
function posZIndex(pos, asWhite) {
    let z = 2 + pos[1] * 8 + (7 - pos[0]);
    if (asWhite)
        z = 67 - z;
    return z + '';
}
function pieceNameOf(piece) {
    return `${piece.color} ${piece.role}`;
}
function computeSquareClasses(s) {
    var _a;
    const squares = new Map();
    if (s.lastMove && s.highlight.lastMove)
        for (const k of s.lastMove) {
            addSquare(squares, k, 'last-move');
        }
    if (s.check && s.highlight.check)
        addSquare(squares, s.check, 'check');
    if (s.selected) {
        addSquare(squares, s.selected, 'selected');
        if (s.movable.showDests) {
            const dests = (_a = s.movable.dests) === null || _a === void 0 ? void 0 : _a.get(s.selected);
            if (dests)
                for (const k of dests) {
                    addSquare(squares, k, 'move-dest' + (s.pieces.has(k) ? ' oc' : ''));
                }
            const pDests = s.premovable.dests;
            if (pDests)
                for (const k of pDests) {
                    addSquare(squares, k, 'premove-dest' + (s.pieces.has(k) ? ' oc' : ''));
                }
        }
    }
    const premove = s.premovable.current;
    if (premove)
        for (const k of premove)
            addSquare(squares, k, 'current-premove');
    else if (s.predroppable.current)
        addSquare(squares, s.predroppable.current.key, 'current-premove');
    const o = s.exploding;
    if (o)
        for (const k of o.keys)
            addSquare(squares, k, 'exploding' + o.stage);
    return squares;
}
function addSquare(squares, key, klass) {
    const classes = squares.get(key);
    if (classes)
        squares.set(key, `${classes} ${klass}`);
    else
        squares.set(key, klass);
}
function appendValue(map, key, value) {
    const arr = map.get(key);
    if (arr)
        arr.push(value);
    else
        map.set(key, [value]);
}

});

var chessground = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chessground = void 0;








function Chessground(element, config$1) {
    const maybeState = state.defaults();
    config.configure(maybeState, config$1 || {});
    function redrawAll() {
        const prevUnbind = 'dom' in maybeState ? maybeState.dom.unbind : undefined;
        const relative = maybeState.viewOnly && !maybeState.drawable.visible, elements = wrap.renderWrap(element, maybeState, relative), bounds = util.memo(() => elements.board.getBoundingClientRect()), redrawNow = (skipSvg) => {
            render_1.render(state);
            if (!skipSvg && elements.svg)
                svg.renderSvg(state, elements.svg, elements.customSvg);
        }, boundsUpdated = () => {
            bounds.clear();
            render_1.updateBounds(state);
            if (elements.svg)
                svg.renderSvg(state, elements.svg, elements.customSvg);
        };
        const state = maybeState;
        state.dom = {
            elements,
            bounds,
            redraw: debounceRedraw(redrawNow),
            redrawNow,
            unbind: prevUnbind,
            relative,
        };
        state.drawable.prevSvgHash = '';
        redrawNow(false);
        events.bindBoard(state, boundsUpdated);
        if (!prevUnbind)
            state.dom.unbind = events.bindDocument(state, boundsUpdated);
        state.events.insert && state.events.insert(elements);
        return state;
    }
    return api.start(redrawAll(), redrawAll);
}
exports.Chessground = Chessground;
function debounceRedraw(redrawNow) {
    let redrawing = false;
    return () => {
        if (redrawing)
            return;
        redrawing = true;
        requestAnimationFrame(() => {
            redrawNow();
            redrawing = false;
        });
    };
}

});

function draw_chessboard(settings) {
    return (source, el, ctx) => {
        let user_config = parse_user_config(settings, source);
        new Chesser(el, user_config);
    };
}
class Chesser {
    constructor(el, user_config) {
        let div = this.set_style(el, user_config.pieceStyle, user_config.boardStyle);
        if (user_config.fen === "") {
            this.chess = new chess.Chess();
        }
        else {
            this.chess = new chess.Chess(user_config.fen);
        }
        const cg_config = {
            fen: user_config.fen,
            orientation: user_config.orientation,
            viewOnly: user_config.viewOnly,
            drawable: {
                enabled: user_config.drawable,
            },
        };
        try {
            this.cg = chessground.Chessground(div, cg_config);
        }
        catch (e) {
            new obsidian.Notice("Chesser error: Invalid config");
            return;
        }
        // Activates the chess logic
        if (!user_config.free) {
            this.cg.set({
                movable: {
                    free: false,
                    dests: this.dests(),
                    events: {
                        after: this.refresh_moves(),
                    }
                }
            });
        }
    }
    set_style(el, pieceStyle, boardStyle) {
        let div = document.createElement("div");
        el.addClass(pieceStyle);
        el.addClass(`${boardStyle}-board`);
        el.appendChild(div);
        return div;
    }
    color_turn() {
        return (this.chess.turn() === 'w') ? 'white' : 'black';
    }
    dests() {
        const dests = new Map();
        this.chess.SQUARES.forEach(s => {
            const ms = this.chess.moves({ square: s, verbose: true });
            if (ms.length)
                dests.set(s, ms.map(m => m.to));
        });
        return dests;
    }
    check() {
        return this.chess.in_check();
    }
    refresh_moves() {
        return (orig, dest) => {
            this.chess.move({ from: orig, to: dest });
            this.cg.set({
                check: this.check(),
                turnColor: this.color_turn(),
                movable: {
                    color: this.color_turn(),
                    dests: this.dests(),
                }
            });
        };
    }
}

const DEFAULT_SETTINGS = {
    orientation: "white",
    viewOnly: false,
    drawable: true,
    free: false,
    pieceStyle: "cburnett",
    boardStyle: "brown",
};
class ChesserSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Obsidian Chess Settings' });
        new obsidian.Setting(containerEl)
            .setName("Piece Style")
            .setDesc("Sets the piece style.")
            .addDropdown(dropdown => {
            let styles = {};
            PIECE_STYLES.map(style => styles[style] = style);
            dropdown.addOptions(styles);
            dropdown
                .setValue(this.plugin.settings.pieceStyle)
                .onChange(pieceStyle => {
                this.plugin.settings.pieceStyle = pieceStyle;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Board Style")
            .setDesc("Sets the board style.")
            .addDropdown(dropdown => {
            let styles = {};
            BOARD_STYLES.map(style => styles[style] = style);
            dropdown.addOptions(styles);
            dropdown
                .setValue(this.plugin.settings.boardStyle)
                .onChange(boardStyle => {
                this.plugin.settings.boardStyle = boardStyle;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Orientation")
            .setDesc("Sets the default board orientation.")
            .addDropdown(dropdown => {
            dropdown.addOption("white", "White");
            dropdown.addOption("black", "Black");
            dropdown
                .setValue(this.plugin.settings.orientation)
                .onChange(orientation => {
                this.plugin.settings.orientation = orientation;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Drawable")
            .setDesc("Controls the ability to draw annotations (arrows, circles) on the board.")
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.drawable)
                .onChange(drawable => {
                this.plugin.settings.drawable = drawable;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("View Only")
            .setDesc("If enabled, displays a static chess board (no moves, annotations, ...).")
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.viewOnly)
                .onChange(viewOnly => {
                this.plugin.settings.viewOnly = viewOnly;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Free")
            .setDesc("If enabled, disables the chess logic, all moves are valid.")
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.free)
                .onChange(free => {
                this.plugin.settings.free = free;
                this.plugin.saveSettings();
            });
        });
    }
}

class ChesserPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.addSettingTab(new ChesserSettingTab(this.app, this));
            this.registerMarkdownCodeBlockProcessor("chesser", draw_chessboard(this.settings));
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}

module.exports = ChesserPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9DaGVzc2VyQ29uZmlnLnRzIiwibm9kZV9tb2R1bGVzL2NoZXNzLmpzL2NoZXNzLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3R5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3V0aWwuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvcHJlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9ib2FyZC5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9mZW4uanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvY29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL2FuaW0uanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvZHJhdy5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9kcmFnLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL2V4cGxvc2lvbi5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9hcGkuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3RhdGUuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3ZnLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3dyYXAuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvZHJvcC5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvcmVuZGVyLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL2NoZXNzZ3JvdW5kLmpzIiwic3JjL0NoZXNzZXIudHMiLCJzcmMvQ2hlc3NlclNldHRpbmdzLnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxyXG4gICAgICAgIHRvW2pdID0gZnJvbVtpXTtcclxuICAgIHJldHVybiB0bztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgQ2hlc3NlclNldHRpbmdzIH0gZnJvbSBcIi4vQ2hlc3NlclNldHRpbmdzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hlc3NlckNvbmZpZyBleHRlbmRzIENoZXNzZXJTZXR0aW5ncyB7XG4gICAgZmVuOiBzdHJpbmc7XG59XG5cbmNvbnN0IE9SSUVOVEFUSU9OUyA9IFtcIndoaXRlXCIsIFwiYmxhY2tcIl07XG5leHBvcnQgY29uc3QgUElFQ0VfU1RZTEVTID0gW1wiYWxwaGFcIiwgXCJjYWxpZm9ybmlhXCIsIFwiY2FyZGluYWxcIiwgXCJjYnVybmV0dFwiLCBcImNoZXNzN1wiLCBcImNoZXNzbnV0XCIsIFwiY29tcGFuaW9uXCIsIFwiZHVicm92bnlcIiwgXCJmYW50YXN5XCIsIFwiZnJlc2NhXCIsIFwiZ2lvY29cIiwgXCJnb3Zlcm5vclwiLCBcImhvcnNleVwiLCBcImljcGllY2VzXCIsIFwia29zYWxcIiwgXCJsZWlwemlnXCIsIFwibGV0dGVyXCIsIFwibGlicmFcIiwgXCJtYWVzdHJvXCIsIFwibWVyaWRhXCIsIFwicGlyb3VldHRpXCIsIFwicGl4ZWxcIiwgXCJyZWlsbHljcmFpZ1wiLCBcInJpb2hhY2hhXCIsIFwic2hhcGVzXCIsIFwic3BhdGlhbFwiLCBcInN0YXVudHlcIiwgXCJ0YXRpYW5hXCJdO1xuZXhwb3J0IGNvbnN0IEJPQVJEX1NUWUxFUyA9IFtcImJsdWVcIiwgXCJicm93blwiLCBcImdyZWVuXCIsIFwiaWNcIiwgXCJwdXJwbGVcIl07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZV91c2VyX2NvbmZpZyhzZXR0aW5nczogQ2hlc3NlclNldHRpbmdzLCBjb250ZW50OiBzdHJpbmcpIHtcbiAgICBsZXQgZGVmYXVsdF9jaGVzc2VyX2NvbmZpZzogQ2hlc3NlckNvbmZpZyA9IHtcbiAgICAgICAgLi4uc2V0dGluZ3MsXG4gICAgICAgIGZlbjogXCJcIixcbiAgICB9O1xuXG4gICAgLy8gS2luZGEgdWdseSB3YXkgb2YgcGFyc2luZyB0aGUgdXNlciBjb25maWcsIGJ1dCBJIGNvdWxkbid0IGZpbmQgc29tZXRoaW5nIGJldHRlclxuICAgIGNvbnN0IHVzZXJfY29uZmlnOiBDaGVzc2VyQ29uZmlnID0ge1xuICAgICAgICBmZW46IHBhcnNlX2ZpZWxkKGNvbnRlbnQsIFwiZmVuXCIpID8/IGRlZmF1bHRfY2hlc3Nlcl9jb25maWcuZmVuLFxuICAgICAgICBvcmllbnRhdGlvbjogY2hlY2tfdmFsaWRfdmFsdWUocGFyc2VfZmllbGQoY29udGVudCwgXCJvcmllbnRhdGlvblwiKSwgT1JJRU5UQVRJT05TKSA/PyBkZWZhdWx0X2NoZXNzZXJfY29uZmlnLm9yaWVudGF0aW9uLFxuICAgICAgICB2aWV3T25seTogY29udmVydF9ib29sZWFuKHBhcnNlX2ZpZWxkKGNvbnRlbnQsIFwidmlld09ubHlcIikpID8/IGRlZmF1bHRfY2hlc3Nlcl9jb25maWcudmlld09ubHksXG4gICAgICAgIGRyYXdhYmxlOiBjb252ZXJ0X2Jvb2xlYW4ocGFyc2VfZmllbGQoY29udGVudCwgXCJkcmF3YWJsZVwiKSkgPz8gZGVmYXVsdF9jaGVzc2VyX2NvbmZpZy5kcmF3YWJsZSxcbiAgICAgICAgZnJlZTogY29udmVydF9ib29sZWFuKHBhcnNlX2ZpZWxkKGNvbnRlbnQsIFwiZnJlZVwiKSkgPz8gZGVmYXVsdF9jaGVzc2VyX2NvbmZpZy5mcmVlLFxuICAgICAgICBwaWVjZVN0eWxlOiBjaGVja192YWxpZF92YWx1ZShwYXJzZV9maWVsZChjb250ZW50LCBcInBpZWNlU3R5bGVcIiksIFBJRUNFX1NUWUxFUykgPz8gZGVmYXVsdF9jaGVzc2VyX2NvbmZpZy5waWVjZVN0eWxlLFxuICAgICAgICBib2FyZFN0eWxlOiBjaGVja192YWxpZF92YWx1ZShwYXJzZV9maWVsZChjb250ZW50LCBcImJvYXJkU3R5bGVcIiksIEJPQVJEX1NUWUxFUykgPz8gZGVmYXVsdF9jaGVzc2VyX2NvbmZpZy5ib2FyZFN0eWxlLFxuICAgIH07XG5cbiAgICByZXR1cm4gdXNlcl9jb25maWc7XG59XG5cbmZ1bmN0aW9uIHBhcnNlX2ZpZWxkKGNvbnRlbnQ6IHN0cmluZywgZmllbGRfbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBsZXQgcmVnZXggPSBuZXcgUmVnRXhwKGAke2ZpZWxkX25hbWV9OiguKilgKTtcbiAgICBsZXQgbWF0Y2hlcyA9IHJlZ2V4LmV4ZWMoY29udGVudCk7XG4gICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbWF0Y2hlc1sxXS50cmltKCk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrX3ZhbGlkX3ZhbHVlKHY6IHN0cmluZywgdmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIGlmICh2YWx1ZXMuY29udGFpbnModikpIHtcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydF9ib29sZWFuKHY6IHN0cmluZykge1xuICAgIGlmICghdikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3dpdGNoICh2LnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgY2FzZSBcInRydWVcIjpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBjYXNlIFwiZmFsc2VcIjpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn0iLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDIwLCBKZWZmIEhseXdhIChqaGx5d2FAZ21haWwuY29tKVxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAqIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuICpcbiAqIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqICAgIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKiAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiAgICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXG4gKiAgICBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIlxuICogQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuICogSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbiAqIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRVxuICogTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUlxuICogQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0ZcbiAqIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTU1xuICogSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU5cbiAqIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpXG4gKiBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRVxuICogUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKlxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxudmFyIENoZXNzID0gZnVuY3Rpb24oZmVuKSB7XG4gIHZhciBCTEFDSyA9ICdiJ1xuICB2YXIgV0hJVEUgPSAndydcblxuICB2YXIgRU1QVFkgPSAtMVxuXG4gIHZhciBQQVdOID0gJ3AnXG4gIHZhciBLTklHSFQgPSAnbidcbiAgdmFyIEJJU0hPUCA9ICdiJ1xuICB2YXIgUk9PSyA9ICdyJ1xuICB2YXIgUVVFRU4gPSAncSdcbiAgdmFyIEtJTkcgPSAnaydcblxuICB2YXIgU1lNQk9MUyA9ICdwbmJycWtQTkJSUUsnXG5cbiAgdmFyIERFRkFVTFRfUE9TSVRJT04gPVxuICAgICdybmJxa2Juci9wcHBwcHBwcC84LzgvOC84L1BQUFBQUFBQL1JOQlFLQk5SIHcgS1FrcSAtIDAgMSdcblxuICB2YXIgUE9TU0lCTEVfUkVTVUxUUyA9IFsnMS0wJywgJzAtMScsICcxLzItMS8yJywgJyonXVxuXG4gIHZhciBQQVdOX09GRlNFVFMgPSB7XG4gICAgYjogWzE2LCAzMiwgMTcsIDE1XSxcbiAgICB3OiBbLTE2LCAtMzIsIC0xNywgLTE1XVxuICB9XG5cbiAgdmFyIFBJRUNFX09GRlNFVFMgPSB7XG4gICAgbjogWy0xOCwgLTMzLCAtMzEsIC0xNCwgMTgsIDMzLCAzMSwgMTRdLFxuICAgIGI6IFstMTcsIC0xNSwgMTcsIDE1XSxcbiAgICByOiBbLTE2LCAxLCAxNiwgLTFdLFxuICAgIHE6IFstMTcsIC0xNiwgLTE1LCAxLCAxNywgMTYsIDE1LCAtMV0sXG4gICAgazogWy0xNywgLTE2LCAtMTUsIDEsIDE3LCAxNiwgMTUsIC0xXVxuICB9XG5cbiAgLy8gcHJldHRpZXItaWdub3JlXG4gIHZhciBBVFRBQ0tTID0gW1xuICAgIDIwLCAwLCAwLCAwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsIDAsIDAsIDAsMjAsIDAsXG4gICAgIDAsMjAsIDAsIDAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwgMCwgMCwyMCwgMCwgMCxcbiAgICAgMCwgMCwyMCwgMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLCAwLDIwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLDIwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsMjAsIDAsIDAsIDAsIDAsXG4gICAgIDAsIDAsIDAsIDAsMjAsIDAsIDAsIDI0LCAgMCwgMCwyMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwgMCwgMCwyMCwgMiwgMjQsICAyLDIwLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLCAwLCAwLCAyLDUzLCA1NiwgNTMsIDIsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMjQsMjQsMjQsMjQsMjQsMjQsNTYsICAwLCA1NiwyNCwyNCwyNCwyNCwyNCwyNCwgMCxcbiAgICAgMCwgMCwgMCwgMCwgMCwgMiw1MywgNTYsIDUzLCAyLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLCAwLCAwLDIwLCAyLCAyNCwgIDIsMjAsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgIDAsIDAsIDAsIDAsMjAsIDAsIDAsIDI0LCAgMCwgMCwyMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwyMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLDIwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLDIwLCAwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsIDAsMjAsIDAsIDAsIDAsXG4gICAgIDAsMjAsIDAsIDAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwgMCwgMCwyMCwgMCwgMCxcbiAgICAyMCwgMCwgMCwgMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLCAwLCAwLCAwLDIwXG4gIF07XG5cbiAgLy8gcHJldHRpZXItaWdub3JlXG4gIHZhciBSQVlTID0gW1xuICAgICAxNywgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwgMTYsICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsIDE1LCAwLFxuICAgICAgMCwgMTcsICAwLCAgMCwgIDAsICAwLCAgMCwgMTYsICAwLCAgMCwgIDAsICAwLCAgMCwgMTUsICAwLCAwLFxuICAgICAgMCwgIDAsIDE3LCAgMCwgIDAsICAwLCAgMCwgMTYsICAwLCAgMCwgIDAsICAwLCAxNSwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLCAxNywgIDAsICAwLCAgMCwgMTYsICAwLCAgMCwgIDAsIDE1LCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLCAgMCwgMTcsICAwLCAgMCwgMTYsICAwLCAgMCwgMTUsICAwLCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLCAgMCwgIDAsIDE3LCAgMCwgMTYsICAwLCAxNSwgIDAsICAwLCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLCAgMCwgIDAsICAwLCAxNywgMTYsIDE1LCAgMCwgIDAsICAwLCAgMCwgIDAsICAwLCAwLFxuICAgICAgMSwgIDEsICAxLCAgMSwgIDEsICAxLCAgMSwgIDAsIC0xLCAtMSwgIC0xLC0xLCAtMSwgLTEsIC0xLCAwLFxuICAgICAgMCwgIDAsICAwLCAgMCwgIDAsICAwLC0xNSwtMTYsLTE3LCAgMCwgIDAsICAwLCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLCAgMCwgIDAsLTE1LCAgMCwtMTYsICAwLC0xNywgIDAsICAwLCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLCAgMCwtMTUsICAwLCAgMCwtMTYsICAwLCAgMCwtMTcsICAwLCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLC0xNSwgIDAsICAwLCAgMCwtMTYsICAwLCAgMCwgIDAsLTE3LCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsLTE1LCAgMCwgIDAsICAwLCAgMCwtMTYsICAwLCAgMCwgIDAsICAwLC0xNywgIDAsICAwLCAwLFxuICAgICAgMCwtMTUsICAwLCAgMCwgIDAsICAwLCAgMCwtMTYsICAwLCAgMCwgIDAsICAwLCAgMCwtMTcsICAwLCAwLFxuICAgIC0xNSwgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwtMTYsICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsLTE3XG4gIF07XG5cbiAgdmFyIFNISUZUUyA9IHsgcDogMCwgbjogMSwgYjogMiwgcjogMywgcTogNCwgazogNSB9XG5cbiAgdmFyIEZMQUdTID0ge1xuICAgIE5PUk1BTDogJ24nLFxuICAgIENBUFRVUkU6ICdjJyxcbiAgICBCSUdfUEFXTjogJ2InLFxuICAgIEVQX0NBUFRVUkU6ICdlJyxcbiAgICBQUk9NT1RJT046ICdwJyxcbiAgICBLU0lERV9DQVNUTEU6ICdrJyxcbiAgICBRU0lERV9DQVNUTEU6ICdxJ1xuICB9XG5cbiAgdmFyIEJJVFMgPSB7XG4gICAgTk9STUFMOiAxLFxuICAgIENBUFRVUkU6IDIsXG4gICAgQklHX1BBV046IDQsXG4gICAgRVBfQ0FQVFVSRTogOCxcbiAgICBQUk9NT1RJT046IDE2LFxuICAgIEtTSURFX0NBU1RMRTogMzIsXG4gICAgUVNJREVfQ0FTVExFOiA2NFxuICB9XG5cbiAgdmFyIFJBTktfMSA9IDdcbiAgdmFyIFJBTktfMiA9IDZcbiAgdmFyIFJBTktfMyA9IDVcbiAgdmFyIFJBTktfNCA9IDRcbiAgdmFyIFJBTktfNSA9IDNcbiAgdmFyIFJBTktfNiA9IDJcbiAgdmFyIFJBTktfNyA9IDFcbiAgdmFyIFJBTktfOCA9IDBcblxuICAvLyBwcmV0dGllci1pZ25vcmVcbiAgdmFyIFNRVUFSRVMgPSB7XG4gICAgYTg6ICAgMCwgYjg6ICAgMSwgYzg6ICAgMiwgZDg6ICAgMywgZTg6ICAgNCwgZjg6ICAgNSwgZzg6ICAgNiwgaDg6ICAgNyxcbiAgICBhNzogIDE2LCBiNzogIDE3LCBjNzogIDE4LCBkNzogIDE5LCBlNzogIDIwLCBmNzogIDIxLCBnNzogIDIyLCBoNzogIDIzLFxuICAgIGE2OiAgMzIsIGI2OiAgMzMsIGM2OiAgMzQsIGQ2OiAgMzUsIGU2OiAgMzYsIGY2OiAgMzcsIGc2OiAgMzgsIGg2OiAgMzksXG4gICAgYTU6ICA0OCwgYjU6ICA0OSwgYzU6ICA1MCwgZDU6ICA1MSwgZTU6ICA1MiwgZjU6ICA1MywgZzU6ICA1NCwgaDU6ICA1NSxcbiAgICBhNDogIDY0LCBiNDogIDY1LCBjNDogIDY2LCBkNDogIDY3LCBlNDogIDY4LCBmNDogIDY5LCBnNDogIDcwLCBoNDogIDcxLFxuICAgIGEzOiAgODAsIGIzOiAgODEsIGMzOiAgODIsIGQzOiAgODMsIGUzOiAgODQsIGYzOiAgODUsIGczOiAgODYsIGgzOiAgODcsXG4gICAgYTI6ICA5NiwgYjI6ICA5NywgYzI6ICA5OCwgZDI6ICA5OSwgZTI6IDEwMCwgZjI6IDEwMSwgZzI6IDEwMiwgaDI6IDEwMyxcbiAgICBhMTogMTEyLCBiMTogMTEzLCBjMTogMTE0LCBkMTogMTE1LCBlMTogMTE2LCBmMTogMTE3LCBnMTogMTE4LCBoMTogMTE5XG4gIH07XG5cbiAgdmFyIFJPT0tTID0ge1xuICAgIHc6IFtcbiAgICAgIHsgc3F1YXJlOiBTUVVBUkVTLmExLCBmbGFnOiBCSVRTLlFTSURFX0NBU1RMRSB9LFxuICAgICAgeyBzcXVhcmU6IFNRVUFSRVMuaDEsIGZsYWc6IEJJVFMuS1NJREVfQ0FTVExFIH1cbiAgICBdLFxuICAgIGI6IFtcbiAgICAgIHsgc3F1YXJlOiBTUVVBUkVTLmE4LCBmbGFnOiBCSVRTLlFTSURFX0NBU1RMRSB9LFxuICAgICAgeyBzcXVhcmU6IFNRVUFSRVMuaDgsIGZsYWc6IEJJVFMuS1NJREVfQ0FTVExFIH1cbiAgICBdXG4gIH1cblxuICB2YXIgYm9hcmQgPSBuZXcgQXJyYXkoMTI4KVxuICB2YXIga2luZ3MgPSB7IHc6IEVNUFRZLCBiOiBFTVBUWSB9XG4gIHZhciB0dXJuID0gV0hJVEVcbiAgdmFyIGNhc3RsaW5nID0geyB3OiAwLCBiOiAwIH1cbiAgdmFyIGVwX3NxdWFyZSA9IEVNUFRZXG4gIHZhciBoYWxmX21vdmVzID0gMFxuICB2YXIgbW92ZV9udW1iZXIgPSAxXG4gIHZhciBoaXN0b3J5ID0gW11cbiAgdmFyIGhlYWRlciA9IHt9XG4gIHZhciBjb21tZW50cyA9IHt9XG5cbiAgLyogaWYgdGhlIHVzZXIgcGFzc2VzIGluIGEgZmVuIHN0cmluZywgbG9hZCBpdCwgZWxzZSBkZWZhdWx0IHRvXG4gICAqIHN0YXJ0aW5nIHBvc2l0aW9uXG4gICAqL1xuICBpZiAodHlwZW9mIGZlbiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBsb2FkKERFRkFVTFRfUE9TSVRJT04pXG4gIH0gZWxzZSB7XG4gICAgbG9hZChmZW4pXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhcihrZWVwX2hlYWRlcnMpIHtcbiAgICBpZiAodHlwZW9mIGtlZXBfaGVhZGVycyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGtlZXBfaGVhZGVycyA9IGZhbHNlXG4gICAgfVxuXG4gICAgYm9hcmQgPSBuZXcgQXJyYXkoMTI4KVxuICAgIGtpbmdzID0geyB3OiBFTVBUWSwgYjogRU1QVFkgfVxuICAgIHR1cm4gPSBXSElURVxuICAgIGNhc3RsaW5nID0geyB3OiAwLCBiOiAwIH1cbiAgICBlcF9zcXVhcmUgPSBFTVBUWVxuICAgIGhhbGZfbW92ZXMgPSAwXG4gICAgbW92ZV9udW1iZXIgPSAxXG4gICAgaGlzdG9yeSA9IFtdXG4gICAgaWYgKCFrZWVwX2hlYWRlcnMpIGhlYWRlciA9IHt9XG4gICAgY29tbWVudHMgPSB7fVxuICAgIHVwZGF0ZV9zZXR1cChnZW5lcmF0ZV9mZW4oKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHBydW5lX2NvbW1lbnRzKCkge1xuICAgIHZhciByZXZlcnNlZF9oaXN0b3J5ID0gW107XG4gICAgdmFyIGN1cnJlbnRfY29tbWVudHMgPSB7fTtcbiAgICB2YXIgY29weV9jb21tZW50ID0gZnVuY3Rpb24oZmVuKSB7XG4gICAgICBpZiAoZmVuIGluIGNvbW1lbnRzKSB7XG4gICAgICAgIGN1cnJlbnRfY29tbWVudHNbZmVuXSA9IGNvbW1lbnRzW2Zlbl07XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZSAoaGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICByZXZlcnNlZF9oaXN0b3J5LnB1c2godW5kb19tb3ZlKCkpO1xuICAgIH1cbiAgICBjb3B5X2NvbW1lbnQoZ2VuZXJhdGVfZmVuKCkpO1xuICAgIHdoaWxlIChyZXZlcnNlZF9oaXN0b3J5Lmxlbmd0aCA+IDApIHtcbiAgICAgIG1ha2VfbW92ZShyZXZlcnNlZF9oaXN0b3J5LnBvcCgpKTtcbiAgICAgIGNvcHlfY29tbWVudChnZW5lcmF0ZV9mZW4oKSk7XG4gICAgfVxuICAgIGNvbW1lbnRzID0gY3VycmVudF9jb21tZW50cztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgIGxvYWQoREVGQVVMVF9QT1NJVElPTilcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvYWQoZmVuLCBrZWVwX2hlYWRlcnMpIHtcbiAgICBpZiAodHlwZW9mIGtlZXBfaGVhZGVycyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGtlZXBfaGVhZGVycyA9IGZhbHNlXG4gICAgfVxuXG4gICAgdmFyIHRva2VucyA9IGZlbi5zcGxpdCgvXFxzKy8pXG4gICAgdmFyIHBvc2l0aW9uID0gdG9rZW5zWzBdXG4gICAgdmFyIHNxdWFyZSA9IDBcblxuICAgIGlmICghdmFsaWRhdGVfZmVuKGZlbikudmFsaWQpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGNsZWFyKGtlZXBfaGVhZGVycylcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9zaXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwaWVjZSA9IHBvc2l0aW9uLmNoYXJBdChpKVxuXG4gICAgICBpZiAocGllY2UgPT09ICcvJykge1xuICAgICAgICBzcXVhcmUgKz0gOFxuICAgICAgfSBlbHNlIGlmIChpc19kaWdpdChwaWVjZSkpIHtcbiAgICAgICAgc3F1YXJlICs9IHBhcnNlSW50KHBpZWNlLCAxMClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjb2xvciA9IHBpZWNlIDwgJ2EnID8gV0hJVEUgOiBCTEFDS1xuICAgICAgICBwdXQoeyB0eXBlOiBwaWVjZS50b0xvd2VyQ2FzZSgpLCBjb2xvcjogY29sb3IgfSwgYWxnZWJyYWljKHNxdWFyZSkpXG4gICAgICAgIHNxdWFyZSsrXG4gICAgICB9XG4gICAgfVxuXG4gICAgdHVybiA9IHRva2Vuc1sxXVxuXG4gICAgaWYgKHRva2Vuc1syXS5pbmRleE9mKCdLJykgPiAtMSkge1xuICAgICAgY2FzdGxpbmcudyB8PSBCSVRTLktTSURFX0NBU1RMRVxuICAgIH1cbiAgICBpZiAodG9rZW5zWzJdLmluZGV4T2YoJ1EnKSA+IC0xKSB7XG4gICAgICBjYXN0bGluZy53IHw9IEJJVFMuUVNJREVfQ0FTVExFXG4gICAgfVxuICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZignaycpID4gLTEpIHtcbiAgICAgIGNhc3RsaW5nLmIgfD0gQklUUy5LU0lERV9DQVNUTEVcbiAgICB9XG4gICAgaWYgKHRva2Vuc1syXS5pbmRleE9mKCdxJykgPiAtMSkge1xuICAgICAgY2FzdGxpbmcuYiB8PSBCSVRTLlFTSURFX0NBU1RMRVxuICAgIH1cblxuICAgIGVwX3NxdWFyZSA9IHRva2Vuc1szXSA9PT0gJy0nID8gRU1QVFkgOiBTUVVBUkVTW3Rva2Vuc1szXV1cbiAgICBoYWxmX21vdmVzID0gcGFyc2VJbnQodG9rZW5zWzRdLCAxMClcbiAgICBtb3ZlX251bWJlciA9IHBhcnNlSW50KHRva2Vuc1s1XSwgMTApXG5cbiAgICB1cGRhdGVfc2V0dXAoZ2VuZXJhdGVfZmVuKCkpXG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLyogVE9ETzogdGhpcyBmdW5jdGlvbiBpcyBwcmV0dHkgbXVjaCBjcmFwIC0gaXQgdmFsaWRhdGVzIHN0cnVjdHVyZSBidXRcbiAgICogY29tcGxldGVseSBpZ25vcmVzIGNvbnRlbnQgKGUuZy4gZG9lc24ndCB2ZXJpZnkgdGhhdCBlYWNoIHNpZGUgaGFzIGEga2luZylcbiAgICogLi4uIHdlIHNob3VsZCByZXdyaXRlIHRoaXMsIGFuZCBkaXRjaCB0aGUgc2lsbHkgZXJyb3JfbnVtYmVyIGZpZWxkIHdoaWxlXG4gICAqIHdlJ3JlIGF0IGl0XG4gICAqL1xuICBmdW5jdGlvbiB2YWxpZGF0ZV9mZW4oZmVuKSB7XG4gICAgdmFyIGVycm9ycyA9IHtcbiAgICAgIDA6ICdObyBlcnJvcnMuJyxcbiAgICAgIDE6ICdGRU4gc3RyaW5nIG11c3QgY29udGFpbiBzaXggc3BhY2UtZGVsaW1pdGVkIGZpZWxkcy4nLFxuICAgICAgMjogJzZ0aCBmaWVsZCAobW92ZSBudW1iZXIpIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLicsXG4gICAgICAzOiAnNXRoIGZpZWxkIChoYWxmIG1vdmUgY291bnRlcikgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyLicsXG4gICAgICA0OiAnNHRoIGZpZWxkIChlbi1wYXNzYW50IHNxdWFyZSkgaXMgaW52YWxpZC4nLFxuICAgICAgNTogJzNyZCBmaWVsZCAoY2FzdGxpbmcgYXZhaWxhYmlsaXR5KSBpcyBpbnZhbGlkLicsXG4gICAgICA2OiAnMm5kIGZpZWxkIChzaWRlIHRvIG1vdmUpIGlzIGludmFsaWQuJyxcbiAgICAgIDc6IFwiMXN0IGZpZWxkIChwaWVjZSBwb3NpdGlvbnMpIGRvZXMgbm90IGNvbnRhaW4gOCAnLyctZGVsaW1pdGVkIHJvd3MuXCIsXG4gICAgICA4OiAnMXN0IGZpZWxkIChwaWVjZSBwb3NpdGlvbnMpIGlzIGludmFsaWQgW2NvbnNlY3V0aXZlIG51bWJlcnNdLicsXG4gICAgICA5OiAnMXN0IGZpZWxkIChwaWVjZSBwb3NpdGlvbnMpIGlzIGludmFsaWQgW2ludmFsaWQgcGllY2VdLicsXG4gICAgICAxMDogJzFzdCBmaWVsZCAocGllY2UgcG9zaXRpb25zKSBpcyBpbnZhbGlkIFtyb3cgdG9vIGxhcmdlXS4nLFxuICAgICAgMTE6ICdJbGxlZ2FsIGVuLXBhc3NhbnQgc3F1YXJlJ1xuICAgIH1cblxuICAgIC8qIDFzdCBjcml0ZXJpb246IDYgc3BhY2Utc2VwZXJhdGVkIGZpZWxkcz8gKi9cbiAgICB2YXIgdG9rZW5zID0gZmVuLnNwbGl0KC9cXHMrLylcbiAgICBpZiAodG9rZW5zLmxlbmd0aCAhPT0gNikge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDEsIGVycm9yOiBlcnJvcnNbMV0gfVxuICAgIH1cblxuICAgIC8qIDJuZCBjcml0ZXJpb246IG1vdmUgbnVtYmVyIGZpZWxkIGlzIGEgaW50ZWdlciB2YWx1ZSA+IDA/ICovXG4gICAgaWYgKGlzTmFOKHRva2Vuc1s1XSkgfHwgcGFyc2VJbnQodG9rZW5zWzVdLCAxMCkgPD0gMCkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDIsIGVycm9yOiBlcnJvcnNbMl0gfVxuICAgIH1cblxuICAgIC8qIDNyZCBjcml0ZXJpb246IGhhbGYgbW92ZSBjb3VudGVyIGlzIGFuIGludGVnZXIgPj0gMD8gKi9cbiAgICBpZiAoaXNOYU4odG9rZW5zWzRdKSB8fCBwYXJzZUludCh0b2tlbnNbNF0sIDEwKSA8IDApIHtcbiAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiAzLCBlcnJvcjogZXJyb3JzWzNdIH1cbiAgICB9XG5cbiAgICAvKiA0dGggY3JpdGVyaW9uOiA0dGggZmllbGQgaXMgYSB2YWxpZCBlLnAuLXN0cmluZz8gKi9cbiAgICBpZiAoIS9eKC18W2FiY2RlZmdoXVszNl0pJC8udGVzdCh0b2tlbnNbM10pKSB7XG4gICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogNCwgZXJyb3I6IGVycm9yc1s0XSB9XG4gICAgfVxuXG4gICAgLyogNXRoIGNyaXRlcmlvbjogM3RoIGZpZWxkIGlzIGEgdmFsaWQgY2FzdGxlLXN0cmluZz8gKi9cbiAgICBpZiAoIS9eKEtRP2s/cT98UWs/cT98a3E/fHF8LSkkLy50ZXN0KHRva2Vuc1syXSkpIHtcbiAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiA1LCBlcnJvcjogZXJyb3JzWzVdIH1cbiAgICB9XG5cbiAgICAvKiA2dGggY3JpdGVyaW9uOiAybmQgZmllbGQgaXMgXCJ3XCIgKHdoaXRlKSBvciBcImJcIiAoYmxhY2spPyAqL1xuICAgIGlmICghL14od3xiKSQvLnRlc3QodG9rZW5zWzFdKSkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDYsIGVycm9yOiBlcnJvcnNbNl0gfVxuICAgIH1cblxuICAgIC8qIDd0aCBjcml0ZXJpb246IDFzdCBmaWVsZCBjb250YWlucyA4IHJvd3M/ICovXG4gICAgdmFyIHJvd3MgPSB0b2tlbnNbMF0uc3BsaXQoJy8nKVxuICAgIGlmIChyb3dzLmxlbmd0aCAhPT0gOCkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDcsIGVycm9yOiBlcnJvcnNbN10gfVxuICAgIH1cblxuICAgIC8qIDh0aCBjcml0ZXJpb246IGV2ZXJ5IHJvdyBpcyB2YWxpZD8gKi9cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8qIGNoZWNrIGZvciByaWdodCBzdW0gb2YgZmllbGRzIEFORCBub3QgdHdvIG51bWJlcnMgaW4gc3VjY2Vzc2lvbiAqL1xuICAgICAgdmFyIHN1bV9maWVsZHMgPSAwXG4gICAgICB2YXIgcHJldmlvdXNfd2FzX251bWJlciA9IGZhbHNlXG5cbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgcm93c1tpXS5sZW5ndGg7IGsrKykge1xuICAgICAgICBpZiAoIWlzTmFOKHJvd3NbaV1ba10pKSB7XG4gICAgICAgICAgaWYgKHByZXZpb3VzX3dhc19udW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiA4LCBlcnJvcjogZXJyb3JzWzhdIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc3VtX2ZpZWxkcyArPSBwYXJzZUludChyb3dzW2ldW2tdLCAxMClcbiAgICAgICAgICBwcmV2aW91c193YXNfbnVtYmVyID0gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghL15bcHJuYnFrUFJOQlFLXSQvLnRlc3Qocm93c1tpXVtrXSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiA5LCBlcnJvcjogZXJyb3JzWzldIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc3VtX2ZpZWxkcyArPSAxXG4gICAgICAgICAgcHJldmlvdXNfd2FzX251bWJlciA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdW1fZmllbGRzICE9PSA4KSB7XG4gICAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiAxMCwgZXJyb3I6IGVycm9yc1sxMF0gfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgICh0b2tlbnNbM11bMV0gPT0gJzMnICYmIHRva2Vuc1sxXSA9PSAndycpIHx8XG4gICAgICAodG9rZW5zWzNdWzFdID09ICc2JyAmJiB0b2tlbnNbMV0gPT0gJ2InKVxuICAgICkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDExLCBlcnJvcjogZXJyb3JzWzExXSB9XG4gICAgfVxuXG4gICAgLyogZXZlcnl0aGluZydzIG9rYXkhICovXG4gICAgcmV0dXJuIHsgdmFsaWQ6IHRydWUsIGVycm9yX251bWJlcjogMCwgZXJyb3I6IGVycm9yc1swXSB9XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZV9mZW4oKSB7XG4gICAgdmFyIGVtcHR5ID0gMFxuICAgIHZhciBmZW4gPSAnJ1xuXG4gICAgZm9yICh2YXIgaSA9IFNRVUFSRVMuYTg7IGkgPD0gU1FVQVJFUy5oMTsgaSsrKSB7XG4gICAgICBpZiAoYm9hcmRbaV0gPT0gbnVsbCkge1xuICAgICAgICBlbXB0eSsrXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZW1wdHkgPiAwKSB7XG4gICAgICAgICAgZmVuICs9IGVtcHR5XG4gICAgICAgICAgZW1wdHkgPSAwXG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbG9yID0gYm9hcmRbaV0uY29sb3JcbiAgICAgICAgdmFyIHBpZWNlID0gYm9hcmRbaV0udHlwZVxuXG4gICAgICAgIGZlbiArPSBjb2xvciA9PT0gV0hJVEUgPyBwaWVjZS50b1VwcGVyQ2FzZSgpIDogcGllY2UudG9Mb3dlckNhc2UoKVxuICAgICAgfVxuXG4gICAgICBpZiAoKGkgKyAxKSAmIDB4ODgpIHtcbiAgICAgICAgaWYgKGVtcHR5ID4gMCkge1xuICAgICAgICAgIGZlbiArPSBlbXB0eVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGkgIT09IFNRVUFSRVMuaDEpIHtcbiAgICAgICAgICBmZW4gKz0gJy8nXG4gICAgICAgIH1cblxuICAgICAgICBlbXB0eSA9IDBcbiAgICAgICAgaSArPSA4XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNmbGFncyA9ICcnXG4gICAgaWYgKGNhc3RsaW5nW1dISVRFXSAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICBjZmxhZ3MgKz0gJ0snXG4gICAgfVxuICAgIGlmIChjYXN0bGluZ1tXSElURV0gJiBCSVRTLlFTSURFX0NBU1RMRSkge1xuICAgICAgY2ZsYWdzICs9ICdRJ1xuICAgIH1cbiAgICBpZiAoY2FzdGxpbmdbQkxBQ0tdICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgIGNmbGFncyArPSAnaydcbiAgICB9XG4gICAgaWYgKGNhc3RsaW5nW0JMQUNLXSAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICBjZmxhZ3MgKz0gJ3EnXG4gICAgfVxuXG4gICAgLyogZG8gd2UgaGF2ZSBhbiBlbXB0eSBjYXN0bGluZyBmbGFnPyAqL1xuICAgIGNmbGFncyA9IGNmbGFncyB8fCAnLSdcbiAgICB2YXIgZXBmbGFncyA9IGVwX3NxdWFyZSA9PT0gRU1QVFkgPyAnLScgOiBhbGdlYnJhaWMoZXBfc3F1YXJlKVxuXG4gICAgcmV0dXJuIFtmZW4sIHR1cm4sIGNmbGFncywgZXBmbGFncywgaGFsZl9tb3ZlcywgbW92ZV9udW1iZXJdLmpvaW4oJyAnKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0X2hlYWRlcihhcmdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICBpZiAodHlwZW9mIGFyZ3NbaV0gPT09ICdzdHJpbmcnICYmIHR5cGVvZiBhcmdzW2kgKyAxXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaGVhZGVyW2FyZ3NbaV1dID0gYXJnc1tpICsgMV1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhlYWRlclxuICB9XG5cbiAgLyogY2FsbGVkIHdoZW4gdGhlIGluaXRpYWwgYm9hcmQgc2V0dXAgaXMgY2hhbmdlZCB3aXRoIHB1dCgpIG9yIHJlbW92ZSgpLlxuICAgKiBtb2RpZmllcyB0aGUgU2V0VXAgYW5kIEZFTiBwcm9wZXJ0aWVzIG9mIHRoZSBoZWFkZXIgb2JqZWN0LiAgaWYgdGhlIEZFTiBpc1xuICAgKiBlcXVhbCB0byB0aGUgZGVmYXVsdCBwb3NpdGlvbiwgdGhlIFNldFVwIGFuZCBGRU4gYXJlIGRlbGV0ZWRcbiAgICogdGhlIHNldHVwIGlzIG9ubHkgdXBkYXRlZCBpZiBoaXN0b3J5Lmxlbmd0aCBpcyB6ZXJvLCBpZSBtb3ZlcyBoYXZlbid0IGJlZW5cbiAgICogbWFkZS5cbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZV9zZXR1cChmZW4pIHtcbiAgICBpZiAoaGlzdG9yeS5sZW5ndGggPiAwKSByZXR1cm5cblxuICAgIGlmIChmZW4gIT09IERFRkFVTFRfUE9TSVRJT04pIHtcbiAgICAgIGhlYWRlclsnU2V0VXAnXSA9ICcxJ1xuICAgICAgaGVhZGVyWydGRU4nXSA9IGZlblxuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgaGVhZGVyWydTZXRVcCddXG4gICAgICBkZWxldGUgaGVhZGVyWydGRU4nXVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldChzcXVhcmUpIHtcbiAgICB2YXIgcGllY2UgPSBib2FyZFtTUVVBUkVTW3NxdWFyZV1dXG4gICAgcmV0dXJuIHBpZWNlID8geyB0eXBlOiBwaWVjZS50eXBlLCBjb2xvcjogcGllY2UuY29sb3IgfSA6IG51bGxcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1dChwaWVjZSwgc3F1YXJlKSB7XG4gICAgLyogY2hlY2sgZm9yIHZhbGlkIHBpZWNlIG9iamVjdCAqL1xuICAgIGlmICghKCd0eXBlJyBpbiBwaWVjZSAmJiAnY29sb3InIGluIHBpZWNlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgLyogY2hlY2sgZm9yIHBpZWNlICovXG4gICAgaWYgKFNZTUJPTFMuaW5kZXhPZihwaWVjZS50eXBlLnRvTG93ZXJDYXNlKCkpID09PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgLyogY2hlY2sgZm9yIHZhbGlkIHNxdWFyZSAqL1xuICAgIGlmICghKHNxdWFyZSBpbiBTUVVBUkVTKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgdmFyIHNxID0gU1FVQVJFU1tzcXVhcmVdXG5cbiAgICAvKiBkb24ndCBsZXQgdGhlIHVzZXIgcGxhY2UgbW9yZSB0aGFuIG9uZSBraW5nICovXG4gICAgaWYgKFxuICAgICAgcGllY2UudHlwZSA9PSBLSU5HICYmXG4gICAgICAhKGtpbmdzW3BpZWNlLmNvbG9yXSA9PSBFTVBUWSB8fCBraW5nc1twaWVjZS5jb2xvcl0gPT0gc3EpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBib2FyZFtzcV0gPSB7IHR5cGU6IHBpZWNlLnR5cGUsIGNvbG9yOiBwaWVjZS5jb2xvciB9XG4gICAgaWYgKHBpZWNlLnR5cGUgPT09IEtJTkcpIHtcbiAgICAgIGtpbmdzW3BpZWNlLmNvbG9yXSA9IHNxXG4gICAgfVxuXG4gICAgdXBkYXRlX3NldHVwKGdlbmVyYXRlX2ZlbigpKVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZShzcXVhcmUpIHtcbiAgICB2YXIgcGllY2UgPSBnZXQoc3F1YXJlKVxuICAgIGJvYXJkW1NRVUFSRVNbc3F1YXJlXV0gPSBudWxsXG4gICAgaWYgKHBpZWNlICYmIHBpZWNlLnR5cGUgPT09IEtJTkcpIHtcbiAgICAgIGtpbmdzW3BpZWNlLmNvbG9yXSA9IEVNUFRZXG4gICAgfVxuXG4gICAgdXBkYXRlX3NldHVwKGdlbmVyYXRlX2ZlbigpKVxuXG4gICAgcmV0dXJuIHBpZWNlXG4gIH1cblxuICBmdW5jdGlvbiBidWlsZF9tb3ZlKGJvYXJkLCBmcm9tLCB0bywgZmxhZ3MsIHByb21vdGlvbikge1xuICAgIHZhciBtb3ZlID0ge1xuICAgICAgY29sb3I6IHR1cm4sXG4gICAgICBmcm9tOiBmcm9tLFxuICAgICAgdG86IHRvLFxuICAgICAgZmxhZ3M6IGZsYWdzLFxuICAgICAgcGllY2U6IGJvYXJkW2Zyb21dLnR5cGVcbiAgICB9XG5cbiAgICBpZiAocHJvbW90aW9uKSB7XG4gICAgICBtb3ZlLmZsYWdzIHw9IEJJVFMuUFJPTU9USU9OXG4gICAgICBtb3ZlLnByb21vdGlvbiA9IHByb21vdGlvblxuICAgIH1cblxuICAgIGlmIChib2FyZFt0b10pIHtcbiAgICAgIG1vdmUuY2FwdHVyZWQgPSBib2FyZFt0b10udHlwZVxuICAgIH0gZWxzZSBpZiAoZmxhZ3MgJiBCSVRTLkVQX0NBUFRVUkUpIHtcbiAgICAgIG1vdmUuY2FwdHVyZWQgPSBQQVdOXG4gICAgfVxuICAgIHJldHVybiBtb3ZlXG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZV9tb3ZlcyhvcHRpb25zKSB7XG4gICAgZnVuY3Rpb24gYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBmcm9tLCB0bywgZmxhZ3MpIHtcbiAgICAgIC8qIGlmIHBhd24gcHJvbW90aW9uICovXG4gICAgICBpZiAoXG4gICAgICAgIGJvYXJkW2Zyb21dLnR5cGUgPT09IFBBV04gJiZcbiAgICAgICAgKHJhbmsodG8pID09PSBSQU5LXzggfHwgcmFuayh0bykgPT09IFJBTktfMSlcbiAgICAgICkge1xuICAgICAgICB2YXIgcGllY2VzID0gW1FVRUVOLCBST09LLCBCSVNIT1AsIEtOSUdIVF1cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBpZWNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIG1vdmVzLnB1c2goYnVpbGRfbW92ZShib2FyZCwgZnJvbSwgdG8sIGZsYWdzLCBwaWVjZXNbaV0pKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtb3Zlcy5wdXNoKGJ1aWxkX21vdmUoYm9hcmQsIGZyb20sIHRvLCBmbGFncykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG1vdmVzID0gW11cbiAgICB2YXIgdXMgPSB0dXJuXG4gICAgdmFyIHRoZW0gPSBzd2FwX2NvbG9yKHVzKVxuICAgIHZhciBzZWNvbmRfcmFuayA9IHsgYjogUkFOS183LCB3OiBSQU5LXzIgfVxuXG4gICAgdmFyIGZpcnN0X3NxID0gU1FVQVJFUy5hOFxuICAgIHZhciBsYXN0X3NxID0gU1FVQVJFUy5oMVxuICAgIHZhciBzaW5nbGVfc3F1YXJlID0gZmFsc2VcblxuICAgIC8qIGRvIHdlIHdhbnQgbGVnYWwgbW92ZXM/ICovXG4gICAgdmFyIGxlZ2FsID1cbiAgICAgIHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAnbGVnYWwnIGluIG9wdGlvbnNcbiAgICAgICAgPyBvcHRpb25zLmxlZ2FsXG4gICAgICAgIDogdHJ1ZVxuXG4gICAgLyogYXJlIHdlIGdlbmVyYXRpbmcgbW92ZXMgZm9yIGEgc2luZ2xlIHNxdWFyZT8gKi9cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmICdzcXVhcmUnIGluIG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zLnNxdWFyZSBpbiBTUVVBUkVTKSB7XG4gICAgICAgIGZpcnN0X3NxID0gbGFzdF9zcSA9IFNRVUFSRVNbb3B0aW9ucy5zcXVhcmVdXG4gICAgICAgIHNpbmdsZV9zcXVhcmUgPSB0cnVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKiBpbnZhbGlkIHNxdWFyZSAqL1xuICAgICAgICByZXR1cm4gW11cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gZmlyc3Rfc3E7IGkgPD0gbGFzdF9zcTsgaSsrKSB7XG4gICAgICAvKiBkaWQgd2UgcnVuIG9mZiB0aGUgZW5kIG9mIHRoZSBib2FyZCAqL1xuICAgICAgaWYgKGkgJiAweDg4KSB7XG4gICAgICAgIGkgKz0gN1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICB2YXIgcGllY2UgPSBib2FyZFtpXVxuICAgICAgaWYgKHBpZWNlID09IG51bGwgfHwgcGllY2UuY29sb3IgIT09IHVzKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGlmIChwaWVjZS50eXBlID09PSBQQVdOKSB7XG4gICAgICAgIC8qIHNpbmdsZSBzcXVhcmUsIG5vbi1jYXB0dXJpbmcgKi9cbiAgICAgICAgdmFyIHNxdWFyZSA9IGkgKyBQQVdOX09GRlNFVFNbdXNdWzBdXG4gICAgICAgIGlmIChib2FyZFtzcXVhcmVdID09IG51bGwpIHtcbiAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIHNxdWFyZSwgQklUUy5OT1JNQUwpXG5cbiAgICAgICAgICAvKiBkb3VibGUgc3F1YXJlICovXG4gICAgICAgICAgdmFyIHNxdWFyZSA9IGkgKyBQQVdOX09GRlNFVFNbdXNdWzFdXG4gICAgICAgICAgaWYgKHNlY29uZF9yYW5rW3VzXSA9PT0gcmFuayhpKSAmJiBib2FyZFtzcXVhcmVdID09IG51bGwpIHtcbiAgICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3ZlcywgaSwgc3F1YXJlLCBCSVRTLkJJR19QQVdOKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHBhd24gY2FwdHVyZXMgKi9cbiAgICAgICAgZm9yIChqID0gMjsgaiA8IDQ7IGorKykge1xuICAgICAgICAgIHZhciBzcXVhcmUgPSBpICsgUEFXTl9PRkZTRVRTW3VzXVtqXVxuICAgICAgICAgIGlmIChzcXVhcmUgJiAweDg4KSBjb250aW51ZVxuXG4gICAgICAgICAgaWYgKGJvYXJkW3NxdWFyZV0gIT0gbnVsbCAmJiBib2FyZFtzcXVhcmVdLmNvbG9yID09PSB0aGVtKSB7XG4gICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIHNxdWFyZSwgQklUUy5DQVBUVVJFKVxuICAgICAgICAgIH0gZWxzZSBpZiAoc3F1YXJlID09PSBlcF9zcXVhcmUpIHtcbiAgICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3ZlcywgaSwgZXBfc3F1YXJlLCBCSVRTLkVQX0NBUFRVUkUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gUElFQ0VfT0ZGU0VUU1twaWVjZS50eXBlXS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIHZhciBvZmZzZXQgPSBQSUVDRV9PRkZTRVRTW3BpZWNlLnR5cGVdW2pdXG4gICAgICAgICAgdmFyIHNxdWFyZSA9IGlcblxuICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBzcXVhcmUgKz0gb2Zmc2V0XG4gICAgICAgICAgICBpZiAoc3F1YXJlICYgMHg4OCkgYnJlYWtcblxuICAgICAgICAgICAgaWYgKGJvYXJkW3NxdWFyZV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIHNxdWFyZSwgQklUUy5OT1JNQUwpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoYm9hcmRbc3F1YXJlXS5jb2xvciA9PT0gdXMpIGJyZWFrXG4gICAgICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3ZlcywgaSwgc3F1YXJlLCBCSVRTLkNBUFRVUkUpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIGJyZWFrLCBpZiBrbmlnaHQgb3Iga2luZyAqL1xuICAgICAgICAgICAgaWYgKHBpZWNlLnR5cGUgPT09ICduJyB8fCBwaWVjZS50eXBlID09PSAnaycpIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogY2hlY2sgZm9yIGNhc3RsaW5nIGlmOiBhKSB3ZSdyZSBnZW5lcmF0aW5nIGFsbCBtb3Zlcywgb3IgYikgd2UncmUgZG9pbmdcbiAgICAgKiBzaW5nbGUgc3F1YXJlIG1vdmUgZ2VuZXJhdGlvbiBvbiB0aGUga2luZydzIHNxdWFyZVxuICAgICAqL1xuICAgIGlmICghc2luZ2xlX3NxdWFyZSB8fCBsYXN0X3NxID09PSBraW5nc1t1c10pIHtcbiAgICAgIC8qIGtpbmctc2lkZSBjYXN0bGluZyAqL1xuICAgICAgaWYgKGNhc3RsaW5nW3VzXSAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICAgIHZhciBjYXN0bGluZ19mcm9tID0ga2luZ3NbdXNdXG4gICAgICAgIHZhciBjYXN0bGluZ190byA9IGNhc3RsaW5nX2Zyb20gKyAyXG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGJvYXJkW2Nhc3RsaW5nX2Zyb20gKyAxXSA9PSBudWxsICYmXG4gICAgICAgICAgYm9hcmRbY2FzdGxpbmdfdG9dID09IG51bGwgJiZcbiAgICAgICAgICAhYXR0YWNrZWQodGhlbSwga2luZ3NbdXNdKSAmJlxuICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBjYXN0bGluZ19mcm9tICsgMSkgJiZcbiAgICAgICAgICAhYXR0YWNrZWQodGhlbSwgY2FzdGxpbmdfdG8pXG4gICAgICAgICkge1xuICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3Zlcywga2luZ3NbdXNdLCBjYXN0bGluZ190bywgQklUUy5LU0lERV9DQVNUTEUpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogcXVlZW4tc2lkZSBjYXN0bGluZyAqL1xuICAgICAgaWYgKGNhc3RsaW5nW3VzXSAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICAgIHZhciBjYXN0bGluZ19mcm9tID0ga2luZ3NbdXNdXG4gICAgICAgIHZhciBjYXN0bGluZ190byA9IGNhc3RsaW5nX2Zyb20gLSAyXG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGJvYXJkW2Nhc3RsaW5nX2Zyb20gLSAxXSA9PSBudWxsICYmXG4gICAgICAgICAgYm9hcmRbY2FzdGxpbmdfZnJvbSAtIDJdID09IG51bGwgJiZcbiAgICAgICAgICBib2FyZFtjYXN0bGluZ19mcm9tIC0gM10gPT0gbnVsbCAmJlxuICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBraW5nc1t1c10pICYmXG4gICAgICAgICAgIWF0dGFja2VkKHRoZW0sIGNhc3RsaW5nX2Zyb20gLSAxKSAmJlxuICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBjYXN0bGluZ190bylcbiAgICAgICAgKSB7XG4gICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBraW5nc1t1c10sIGNhc3RsaW5nX3RvLCBCSVRTLlFTSURFX0NBU1RMRSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIHJldHVybiBhbGwgcHNldWRvLWxlZ2FsIG1vdmVzICh0aGlzIGluY2x1ZGVzIG1vdmVzIHRoYXQgYWxsb3cgdGhlIGtpbmdcbiAgICAgKiB0byBiZSBjYXB0dXJlZClcbiAgICAgKi9cbiAgICBpZiAoIWxlZ2FsKSB7XG4gICAgICByZXR1cm4gbW92ZXNcbiAgICB9XG5cbiAgICAvKiBmaWx0ZXIgb3V0IGlsbGVnYWwgbW92ZXMgKi9cbiAgICB2YXIgbGVnYWxfbW92ZXMgPSBbXVxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbWFrZV9tb3ZlKG1vdmVzW2ldKVxuICAgICAgaWYgKCFraW5nX2F0dGFja2VkKHVzKSkge1xuICAgICAgICBsZWdhbF9tb3Zlcy5wdXNoKG1vdmVzW2ldKVxuICAgICAgfVxuICAgICAgdW5kb19tb3ZlKClcbiAgICB9XG5cbiAgICByZXR1cm4gbGVnYWxfbW92ZXNcbiAgfVxuXG4gIC8qIGNvbnZlcnQgYSBtb3ZlIGZyb20gMHg4OCBjb29yZGluYXRlcyB0byBTdGFuZGFyZCBBbGdlYnJhaWMgTm90YXRpb25cbiAgICogKFNBTilcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBzbG9wcHkgVXNlIHRoZSBzbG9wcHkgU0FOIGdlbmVyYXRvciB0byB3b3JrIGFyb3VuZCBvdmVyXG4gICAqIGRpc2FtYmlndWF0aW9uIGJ1Z3MgaW4gRnJpdHogYW5kIENoZXNzYmFzZS4gIFNlZSBiZWxvdzpcbiAgICpcbiAgICogcjFicWtibnIvcHBwMnBwcC8ybjUvMUIxcFAzLzRQMy84L1BQUFAyUFAvUk5CUUsxTlIgYiBLUWtxIC0gMiA0XG4gICAqIDQuIC4uLiBOZ2U3IGlzIG92ZXJseSBkaXNhbWJpZ3VhdGVkIGJlY2F1c2UgdGhlIGtuaWdodCBvbiBjNiBpcyBwaW5uZWRcbiAgICogNC4gLi4uIE5lNyBpcyB0ZWNobmljYWxseSB0aGUgdmFsaWQgU0FOXG4gICAqL1xuICBmdW5jdGlvbiBtb3ZlX3RvX3Nhbihtb3ZlLCBzbG9wcHkpIHtcbiAgICB2YXIgb3V0cHV0ID0gJydcblxuICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgIG91dHB1dCA9ICdPLU8nXG4gICAgfSBlbHNlIGlmIChtb3ZlLmZsYWdzICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgIG91dHB1dCA9ICdPLU8tTydcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGRpc2FtYmlndWF0b3IgPSBnZXRfZGlzYW1iaWd1YXRvcihtb3ZlLCBzbG9wcHkpXG5cbiAgICAgIGlmIChtb3ZlLnBpZWNlICE9PSBQQVdOKSB7XG4gICAgICAgIG91dHB1dCArPSBtb3ZlLnBpZWNlLnRvVXBwZXJDYXNlKCkgKyBkaXNhbWJpZ3VhdG9yXG4gICAgICB9XG5cbiAgICAgIGlmIChtb3ZlLmZsYWdzICYgKEJJVFMuQ0FQVFVSRSB8IEJJVFMuRVBfQ0FQVFVSRSkpIHtcbiAgICAgICAgaWYgKG1vdmUucGllY2UgPT09IFBBV04pIHtcbiAgICAgICAgICBvdXRwdXQgKz0gYWxnZWJyYWljKG1vdmUuZnJvbSlbMF1cbiAgICAgICAgfVxuICAgICAgICBvdXRwdXQgKz0gJ3gnXG4gICAgICB9XG5cbiAgICAgIG91dHB1dCArPSBhbGdlYnJhaWMobW92ZS50bylcblxuICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLlBST01PVElPTikge1xuICAgICAgICBvdXRwdXQgKz0gJz0nICsgbW92ZS5wcm9tb3Rpb24udG9VcHBlckNhc2UoKVxuICAgICAgfVxuICAgIH1cblxuICAgIG1ha2VfbW92ZShtb3ZlKVxuICAgIGlmIChpbl9jaGVjaygpKSB7XG4gICAgICBpZiAoaW5fY2hlY2ttYXRlKCkpIHtcbiAgICAgICAgb3V0cHV0ICs9ICcjJ1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0ICs9ICcrJ1xuICAgICAgfVxuICAgIH1cbiAgICB1bmRvX21vdmUoKVxuXG4gICAgcmV0dXJuIG91dHB1dFxuICB9XG5cbiAgLy8gcGFyc2VzIGFsbCBvZiB0aGUgZGVjb3JhdG9ycyBvdXQgb2YgYSBTQU4gc3RyaW5nXG4gIGZ1bmN0aW9uIHN0cmlwcGVkX3Nhbihtb3ZlKSB7XG4gICAgcmV0dXJuIG1vdmUucmVwbGFjZSgvPS8sICcnKS5yZXBsYWNlKC9bKyNdP1s/IV0qJC8sICcnKVxuICB9XG5cbiAgZnVuY3Rpb24gYXR0YWNrZWQoY29sb3IsIHNxdWFyZSkge1xuICAgIGZvciAodmFyIGkgPSBTUVVBUkVTLmE4OyBpIDw9IFNRVUFSRVMuaDE7IGkrKykge1xuICAgICAgLyogZGlkIHdlIHJ1biBvZmYgdGhlIGVuZCBvZiB0aGUgYm9hcmQgKi9cbiAgICAgIGlmIChpICYgMHg4OCkge1xuICAgICAgICBpICs9IDdcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLyogaWYgZW1wdHkgc3F1YXJlIG9yIHdyb25nIGNvbG9yICovXG4gICAgICBpZiAoYm9hcmRbaV0gPT0gbnVsbCB8fCBib2FyZFtpXS5jb2xvciAhPT0gY29sb3IpIGNvbnRpbnVlXG5cbiAgICAgIHZhciBwaWVjZSA9IGJvYXJkW2ldXG4gICAgICB2YXIgZGlmZmVyZW5jZSA9IGkgLSBzcXVhcmVcbiAgICAgIHZhciBpbmRleCA9IGRpZmZlcmVuY2UgKyAxMTlcblxuICAgICAgaWYgKEFUVEFDS1NbaW5kZXhdICYgKDEgPDwgU0hJRlRTW3BpZWNlLnR5cGVdKSkge1xuICAgICAgICBpZiAocGllY2UudHlwZSA9PT0gUEFXTikge1xuICAgICAgICAgIGlmIChkaWZmZXJlbmNlID4gMCkge1xuICAgICAgICAgICAgaWYgKHBpZWNlLmNvbG9yID09PSBXSElURSkgcmV0dXJuIHRydWVcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHBpZWNlLmNvbG9yID09PSBCTEFDSykgcmV0dXJuIHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIGlmIHRoZSBwaWVjZSBpcyBhIGtuaWdodCBvciBhIGtpbmcgKi9cbiAgICAgICAgaWYgKHBpZWNlLnR5cGUgPT09ICduJyB8fCBwaWVjZS50eXBlID09PSAnaycpIHJldHVybiB0cnVlXG5cbiAgICAgICAgdmFyIG9mZnNldCA9IFJBWVNbaW5kZXhdXG4gICAgICAgIHZhciBqID0gaSArIG9mZnNldFxuXG4gICAgICAgIHZhciBibG9ja2VkID0gZmFsc2VcbiAgICAgICAgd2hpbGUgKGogIT09IHNxdWFyZSkge1xuICAgICAgICAgIGlmIChib2FyZFtqXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBibG9ja2VkID0gdHJ1ZVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgICAgaiArPSBvZmZzZXRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYmxvY2tlZCkgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIGtpbmdfYXR0YWNrZWQoY29sb3IpIHtcbiAgICByZXR1cm4gYXR0YWNrZWQoc3dhcF9jb2xvcihjb2xvciksIGtpbmdzW2NvbG9yXSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGluX2NoZWNrKCkge1xuICAgIHJldHVybiBraW5nX2F0dGFja2VkKHR1cm4pXG4gIH1cblxuICBmdW5jdGlvbiBpbl9jaGVja21hdGUoKSB7XG4gICAgcmV0dXJuIGluX2NoZWNrKCkgJiYgZ2VuZXJhdGVfbW92ZXMoKS5sZW5ndGggPT09IDBcbiAgfVxuXG4gIGZ1bmN0aW9uIGluX3N0YWxlbWF0ZSgpIHtcbiAgICByZXR1cm4gIWluX2NoZWNrKCkgJiYgZ2VuZXJhdGVfbW92ZXMoKS5sZW5ndGggPT09IDBcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc3VmZmljaWVudF9tYXRlcmlhbCgpIHtcbiAgICB2YXIgcGllY2VzID0ge31cbiAgICB2YXIgYmlzaG9wcyA9IFtdXG4gICAgdmFyIG51bV9waWVjZXMgPSAwXG4gICAgdmFyIHNxX2NvbG9yID0gMFxuXG4gICAgZm9yICh2YXIgaSA9IFNRVUFSRVMuYTg7IGkgPD0gU1FVQVJFUy5oMTsgaSsrKSB7XG4gICAgICBzcV9jb2xvciA9IChzcV9jb2xvciArIDEpICUgMlxuICAgICAgaWYgKGkgJiAweDg4KSB7XG4gICAgICAgIGkgKz0gN1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICB2YXIgcGllY2UgPSBib2FyZFtpXVxuICAgICAgaWYgKHBpZWNlKSB7XG4gICAgICAgIHBpZWNlc1twaWVjZS50eXBlXSA9IHBpZWNlLnR5cGUgaW4gcGllY2VzID8gcGllY2VzW3BpZWNlLnR5cGVdICsgMSA6IDFcbiAgICAgICAgaWYgKHBpZWNlLnR5cGUgPT09IEJJU0hPUCkge1xuICAgICAgICAgIGJpc2hvcHMucHVzaChzcV9jb2xvcilcbiAgICAgICAgfVxuICAgICAgICBudW1fcGllY2VzKytcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBrIHZzLiBrICovXG4gICAgaWYgKG51bV9waWVjZXMgPT09IDIpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIC8qIGsgdnMuIGtuIC4uLi4gb3IgLi4uLiBrIHZzLiBrYiAqL1xuICAgICAgbnVtX3BpZWNlcyA9PT0gMyAmJlxuICAgICAgKHBpZWNlc1tCSVNIT1BdID09PSAxIHx8IHBpZWNlc1tLTklHSFRdID09PSAxKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2UgaWYgKG51bV9waWVjZXMgPT09IHBpZWNlc1tCSVNIT1BdICsgMikge1xuICAgICAgLyoga2IgdnMuIGtiIHdoZXJlIGFueSBudW1iZXIgb2YgYmlzaG9wcyBhcmUgYWxsIG9uIHRoZSBzYW1lIGNvbG9yICovXG4gICAgICB2YXIgc3VtID0gMFxuICAgICAgdmFyIGxlbiA9IGJpc2hvcHMubGVuZ3RoXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHN1bSArPSBiaXNob3BzW2ldXG4gICAgICB9XG4gICAgICBpZiAoc3VtID09PSAwIHx8IHN1bSA9PT0gbGVuKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBmdW5jdGlvbiBpbl90aHJlZWZvbGRfcmVwZXRpdGlvbigpIHtcbiAgICAvKiBUT0RPOiB3aGlsZSB0aGlzIGZ1bmN0aW9uIGlzIGZpbmUgZm9yIGNhc3VhbCB1c2UsIGEgYmV0dGVyXG4gICAgICogaW1wbGVtZW50YXRpb24gd291bGQgdXNlIGEgWm9icmlzdCBrZXkgKGluc3RlYWQgb2YgRkVOKS4gdGhlXG4gICAgICogWm9icmlzdCBrZXkgd291bGQgYmUgbWFpbnRhaW5lZCBpbiB0aGUgbWFrZV9tb3ZlL3VuZG9fbW92ZSBmdW5jdGlvbnMsXG4gICAgICogYXZvaWRpbmcgdGhlIGNvc3RseSB0aGF0IHdlIGRvIGJlbG93LlxuICAgICAqL1xuICAgIHZhciBtb3ZlcyA9IFtdXG4gICAgdmFyIHBvc2l0aW9ucyA9IHt9XG4gICAgdmFyIHJlcGV0aXRpb24gPSBmYWxzZVxuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHZhciBtb3ZlID0gdW5kb19tb3ZlKClcbiAgICAgIGlmICghbW92ZSkgYnJlYWtcbiAgICAgIG1vdmVzLnB1c2gobW92ZSlcbiAgICB9XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgLyogcmVtb3ZlIHRoZSBsYXN0IHR3byBmaWVsZHMgaW4gdGhlIEZFTiBzdHJpbmcsIHRoZXkncmUgbm90IG5lZWRlZFxuICAgICAgICogd2hlbiBjaGVja2luZyBmb3IgZHJhdyBieSByZXAgKi9cbiAgICAgIHZhciBmZW4gPSBnZW5lcmF0ZV9mZW4oKVxuICAgICAgICAuc3BsaXQoJyAnKVxuICAgICAgICAuc2xpY2UoMCwgNClcbiAgICAgICAgLmpvaW4oJyAnKVxuXG4gICAgICAvKiBoYXMgdGhlIHBvc2l0aW9uIG9jY3VycmVkIHRocmVlIG9yIG1vdmUgdGltZXMgKi9cbiAgICAgIHBvc2l0aW9uc1tmZW5dID0gZmVuIGluIHBvc2l0aW9ucyA/IHBvc2l0aW9uc1tmZW5dICsgMSA6IDFcbiAgICAgIGlmIChwb3NpdGlvbnNbZmVuXSA+PSAzKSB7XG4gICAgICAgIHJlcGV0aXRpb24gPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmICghbW92ZXMubGVuZ3RoKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBtYWtlX21vdmUobW92ZXMucG9wKCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcGV0aXRpb25cbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2gobW92ZSkge1xuICAgIGhpc3RvcnkucHVzaCh7XG4gICAgICBtb3ZlOiBtb3ZlLFxuICAgICAga2luZ3M6IHsgYjoga2luZ3MuYiwgdzoga2luZ3MudyB9LFxuICAgICAgdHVybjogdHVybixcbiAgICAgIGNhc3RsaW5nOiB7IGI6IGNhc3RsaW5nLmIsIHc6IGNhc3RsaW5nLncgfSxcbiAgICAgIGVwX3NxdWFyZTogZXBfc3F1YXJlLFxuICAgICAgaGFsZl9tb3ZlczogaGFsZl9tb3ZlcyxcbiAgICAgIG1vdmVfbnVtYmVyOiBtb3ZlX251bWJlclxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBtYWtlX21vdmUobW92ZSkge1xuICAgIHZhciB1cyA9IHR1cm5cbiAgICB2YXIgdGhlbSA9IHN3YXBfY29sb3IodXMpXG4gICAgcHVzaChtb3ZlKVxuXG4gICAgYm9hcmRbbW92ZS50b10gPSBib2FyZFttb3ZlLmZyb21dXG4gICAgYm9hcmRbbW92ZS5mcm9tXSA9IG51bGxcblxuICAgIC8qIGlmIGVwIGNhcHR1cmUsIHJlbW92ZSB0aGUgY2FwdHVyZWQgcGF3biAqL1xuICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5FUF9DQVBUVVJFKSB7XG4gICAgICBpZiAodHVybiA9PT0gQkxBQ0spIHtcbiAgICAgICAgYm9hcmRbbW92ZS50byAtIDE2XSA9IG51bGxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvYXJkW21vdmUudG8gKyAxNl0gPSBudWxsXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogaWYgcGF3biBwcm9tb3Rpb24sIHJlcGxhY2Ugd2l0aCBuZXcgcGllY2UgKi9cbiAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuUFJPTU9USU9OKSB7XG4gICAgICBib2FyZFttb3ZlLnRvXSA9IHsgdHlwZTogbW92ZS5wcm9tb3Rpb24sIGNvbG9yOiB1cyB9XG4gICAgfVxuXG4gICAgLyogaWYgd2UgbW92ZWQgdGhlIGtpbmcgKi9cbiAgICBpZiAoYm9hcmRbbW92ZS50b10udHlwZSA9PT0gS0lORykge1xuICAgICAga2luZ3NbYm9hcmRbbW92ZS50b10uY29sb3JdID0gbW92ZS50b1xuXG4gICAgICAvKiBpZiB3ZSBjYXN0bGVkLCBtb3ZlIHRoZSByb29rIG5leHQgdG8gdGhlIGtpbmcgKi9cbiAgICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgICAgdmFyIGNhc3RsaW5nX3RvID0gbW92ZS50byAtIDFcbiAgICAgICAgdmFyIGNhc3RsaW5nX2Zyb20gPSBtb3ZlLnRvICsgMVxuICAgICAgICBib2FyZFtjYXN0bGluZ190b10gPSBib2FyZFtjYXN0bGluZ19mcm9tXVxuICAgICAgICBib2FyZFtjYXN0bGluZ19mcm9tXSA9IG51bGxcbiAgICAgIH0gZWxzZSBpZiAobW92ZS5mbGFncyAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICAgIHZhciBjYXN0bGluZ190byA9IG1vdmUudG8gKyAxXG4gICAgICAgIHZhciBjYXN0bGluZ19mcm9tID0gbW92ZS50byAtIDJcbiAgICAgICAgYm9hcmRbY2FzdGxpbmdfdG9dID0gYm9hcmRbY2FzdGxpbmdfZnJvbV1cbiAgICAgICAgYm9hcmRbY2FzdGxpbmdfZnJvbV0gPSBudWxsXG4gICAgICB9XG5cbiAgICAgIC8qIHR1cm4gb2ZmIGNhc3RsaW5nICovXG4gICAgICBjYXN0bGluZ1t1c10gPSAnJ1xuICAgIH1cblxuICAgIC8qIHR1cm4gb2ZmIGNhc3RsaW5nIGlmIHdlIG1vdmUgYSByb29rICovXG4gICAgaWYgKGNhc3RsaW5nW3VzXSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IFJPT0tTW3VzXS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgbW92ZS5mcm9tID09PSBST09LU1t1c11baV0uc3F1YXJlICYmXG4gICAgICAgICAgY2FzdGxpbmdbdXNdICYgUk9PS1NbdXNdW2ldLmZsYWdcbiAgICAgICAgKSB7XG4gICAgICAgICAgY2FzdGxpbmdbdXNdIF49IFJPT0tTW3VzXVtpXS5mbGFnXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIHR1cm4gb2ZmIGNhc3RsaW5nIGlmIHdlIGNhcHR1cmUgYSByb29rICovXG4gICAgaWYgKGNhc3RsaW5nW3RoZW1dKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gUk9PS1NbdGhlbV0ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIG1vdmUudG8gPT09IFJPT0tTW3RoZW1dW2ldLnNxdWFyZSAmJlxuICAgICAgICAgIGNhc3RsaW5nW3RoZW1dICYgUk9PS1NbdGhlbV1baV0uZmxhZ1xuICAgICAgICApIHtcbiAgICAgICAgICBjYXN0bGluZ1t0aGVtXSBePSBST09LU1t0aGVtXVtpXS5mbGFnXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIGlmIGJpZyBwYXduIG1vdmUsIHVwZGF0ZSB0aGUgZW4gcGFzc2FudCBzcXVhcmUgKi9cbiAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuQklHX1BBV04pIHtcbiAgICAgIGlmICh0dXJuID09PSAnYicpIHtcbiAgICAgICAgZXBfc3F1YXJlID0gbW92ZS50byAtIDE2XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcF9zcXVhcmUgPSBtb3ZlLnRvICsgMTZcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXBfc3F1YXJlID0gRU1QVFlcbiAgICB9XG5cbiAgICAvKiByZXNldCB0aGUgNTAgbW92ZSBjb3VudGVyIGlmIGEgcGF3biBpcyBtb3ZlZCBvciBhIHBpZWNlIGlzIGNhcHR1cmVkICovXG4gICAgaWYgKG1vdmUucGllY2UgPT09IFBBV04pIHtcbiAgICAgIGhhbGZfbW92ZXMgPSAwXG4gICAgfSBlbHNlIGlmIChtb3ZlLmZsYWdzICYgKEJJVFMuQ0FQVFVSRSB8IEJJVFMuRVBfQ0FQVFVSRSkpIHtcbiAgICAgIGhhbGZfbW92ZXMgPSAwXG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbGZfbW92ZXMrK1xuICAgIH1cblxuICAgIGlmICh0dXJuID09PSBCTEFDSykge1xuICAgICAgbW92ZV9udW1iZXIrK1xuICAgIH1cbiAgICB0dXJuID0gc3dhcF9jb2xvcih0dXJuKVxuICB9XG5cbiAgZnVuY3Rpb24gdW5kb19tb3ZlKCkge1xuICAgIHZhciBvbGQgPSBoaXN0b3J5LnBvcCgpXG4gICAgaWYgKG9sZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIHZhciBtb3ZlID0gb2xkLm1vdmVcbiAgICBraW5ncyA9IG9sZC5raW5nc1xuICAgIHR1cm4gPSBvbGQudHVyblxuICAgIGNhc3RsaW5nID0gb2xkLmNhc3RsaW5nXG4gICAgZXBfc3F1YXJlID0gb2xkLmVwX3NxdWFyZVxuICAgIGhhbGZfbW92ZXMgPSBvbGQuaGFsZl9tb3Zlc1xuICAgIG1vdmVfbnVtYmVyID0gb2xkLm1vdmVfbnVtYmVyXG5cbiAgICB2YXIgdXMgPSB0dXJuXG4gICAgdmFyIHRoZW0gPSBzd2FwX2NvbG9yKHR1cm4pXG5cbiAgICBib2FyZFttb3ZlLmZyb21dID0gYm9hcmRbbW92ZS50b11cbiAgICBib2FyZFttb3ZlLmZyb21dLnR5cGUgPSBtb3ZlLnBpZWNlIC8vIHRvIHVuZG8gYW55IHByb21vdGlvbnNcbiAgICBib2FyZFttb3ZlLnRvXSA9IG51bGxcblxuICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5DQVBUVVJFKSB7XG4gICAgICBib2FyZFttb3ZlLnRvXSA9IHsgdHlwZTogbW92ZS5jYXB0dXJlZCwgY29sb3I6IHRoZW0gfVxuICAgIH0gZWxzZSBpZiAobW92ZS5mbGFncyAmIEJJVFMuRVBfQ0FQVFVSRSkge1xuICAgICAgdmFyIGluZGV4XG4gICAgICBpZiAodXMgPT09IEJMQUNLKSB7XG4gICAgICAgIGluZGV4ID0gbW92ZS50byAtIDE2XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleCA9IG1vdmUudG8gKyAxNlxuICAgICAgfVxuICAgICAgYm9hcmRbaW5kZXhdID0geyB0eXBlOiBQQVdOLCBjb2xvcjogdGhlbSB9XG4gICAgfVxuXG4gICAgaWYgKG1vdmUuZmxhZ3MgJiAoQklUUy5LU0lERV9DQVNUTEUgfCBCSVRTLlFTSURFX0NBU1RMRSkpIHtcbiAgICAgIHZhciBjYXN0bGluZ190bywgY2FzdGxpbmdfZnJvbVxuICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgICBjYXN0bGluZ190byA9IG1vdmUudG8gKyAxXG4gICAgICAgIGNhc3RsaW5nX2Zyb20gPSBtb3ZlLnRvIC0gMVxuICAgICAgfSBlbHNlIGlmIChtb3ZlLmZsYWdzICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgICAgY2FzdGxpbmdfdG8gPSBtb3ZlLnRvIC0gMlxuICAgICAgICBjYXN0bGluZ19mcm9tID0gbW92ZS50byArIDFcbiAgICAgIH1cblxuICAgICAgYm9hcmRbY2FzdGxpbmdfdG9dID0gYm9hcmRbY2FzdGxpbmdfZnJvbV1cbiAgICAgIGJvYXJkW2Nhc3RsaW5nX2Zyb21dID0gbnVsbFxuICAgIH1cblxuICAgIHJldHVybiBtb3ZlXG4gIH1cblxuICAvKiB0aGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gdW5pcXVlbHkgaWRlbnRpZnkgYW1iaWd1b3VzIG1vdmVzICovXG4gIGZ1bmN0aW9uIGdldF9kaXNhbWJpZ3VhdG9yKG1vdmUsIHNsb3BweSkge1xuICAgIHZhciBtb3ZlcyA9IGdlbmVyYXRlX21vdmVzKHsgbGVnYWw6ICFzbG9wcHkgfSlcblxuICAgIHZhciBmcm9tID0gbW92ZS5mcm9tXG4gICAgdmFyIHRvID0gbW92ZS50b1xuICAgIHZhciBwaWVjZSA9IG1vdmUucGllY2VcblxuICAgIHZhciBhbWJpZ3VpdGllcyA9IDBcbiAgICB2YXIgc2FtZV9yYW5rID0gMFxuICAgIHZhciBzYW1lX2ZpbGUgPSAwXG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciBhbWJpZ19mcm9tID0gbW92ZXNbaV0uZnJvbVxuICAgICAgdmFyIGFtYmlnX3RvID0gbW92ZXNbaV0udG9cbiAgICAgIHZhciBhbWJpZ19waWVjZSA9IG1vdmVzW2ldLnBpZWNlXG5cbiAgICAgIC8qIGlmIGEgbW92ZSBvZiB0aGUgc2FtZSBwaWVjZSB0eXBlIGVuZHMgb24gdGhlIHNhbWUgdG8gc3F1YXJlLCB3ZSdsbFxuICAgICAgICogbmVlZCB0byBhZGQgYSBkaXNhbWJpZ3VhdG9yIHRvIHRoZSBhbGdlYnJhaWMgbm90YXRpb25cbiAgICAgICAqL1xuICAgICAgaWYgKHBpZWNlID09PSBhbWJpZ19waWVjZSAmJiBmcm9tICE9PSBhbWJpZ19mcm9tICYmIHRvID09PSBhbWJpZ190bykge1xuICAgICAgICBhbWJpZ3VpdGllcysrXG5cbiAgICAgICAgaWYgKHJhbmsoZnJvbSkgPT09IHJhbmsoYW1iaWdfZnJvbSkpIHtcbiAgICAgICAgICBzYW1lX3JhbmsrK1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpbGUoZnJvbSkgPT09IGZpbGUoYW1iaWdfZnJvbSkpIHtcbiAgICAgICAgICBzYW1lX2ZpbGUrK1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFtYmlndWl0aWVzID4gMCkge1xuICAgICAgLyogaWYgdGhlcmUgZXhpc3RzIGEgc2ltaWxhciBtb3ZpbmcgcGllY2Ugb24gdGhlIHNhbWUgcmFuayBhbmQgZmlsZSBhc1xuICAgICAgICogdGhlIG1vdmUgaW4gcXVlc3Rpb24sIHVzZSB0aGUgc3F1YXJlIGFzIHRoZSBkaXNhbWJpZ3VhdG9yXG4gICAgICAgKi9cbiAgICAgIGlmIChzYW1lX3JhbmsgPiAwICYmIHNhbWVfZmlsZSA+IDApIHtcbiAgICAgICAgcmV0dXJuIGFsZ2VicmFpYyhmcm9tKVxuICAgICAgfSBlbHNlIGlmIChzYW1lX2ZpbGUgPiAwKSB7XG4gICAgICAgIC8qIGlmIHRoZSBtb3ZpbmcgcGllY2UgcmVzdHMgb24gdGhlIHNhbWUgZmlsZSwgdXNlIHRoZSByYW5rIHN5bWJvbCBhcyB0aGVcbiAgICAgICAgICogZGlzYW1iaWd1YXRvclxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGFsZ2VicmFpYyhmcm9tKS5jaGFyQXQoMSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIGVsc2UgdXNlIHRoZSBmaWxlIHN5bWJvbCAqL1xuICAgICAgICByZXR1cm4gYWxnZWJyYWljKGZyb20pLmNoYXJBdCgwKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgZnVuY3Rpb24gYXNjaWkoKSB7XG4gICAgdmFyIHMgPSAnICAgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcXG4nXG4gICAgZm9yICh2YXIgaSA9IFNRVUFSRVMuYTg7IGkgPD0gU1FVQVJFUy5oMTsgaSsrKSB7XG4gICAgICAvKiBkaXNwbGF5IHRoZSByYW5rICovXG4gICAgICBpZiAoZmlsZShpKSA9PT0gMCkge1xuICAgICAgICBzICs9ICcgJyArICc4NzY1NDMyMSdbcmFuayhpKV0gKyAnIHwnXG4gICAgICB9XG5cbiAgICAgIC8qIGVtcHR5IHBpZWNlICovXG4gICAgICBpZiAoYm9hcmRbaV0gPT0gbnVsbCkge1xuICAgICAgICBzICs9ICcgLiAnXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcGllY2UgPSBib2FyZFtpXS50eXBlXG4gICAgICAgIHZhciBjb2xvciA9IGJvYXJkW2ldLmNvbG9yXG4gICAgICAgIHZhciBzeW1ib2wgPSBjb2xvciA9PT0gV0hJVEUgPyBwaWVjZS50b1VwcGVyQ2FzZSgpIDogcGllY2UudG9Mb3dlckNhc2UoKVxuICAgICAgICBzICs9ICcgJyArIHN5bWJvbCArICcgJ1xuICAgICAgfVxuXG4gICAgICBpZiAoKGkgKyAxKSAmIDB4ODgpIHtcbiAgICAgICAgcyArPSAnfFxcbidcbiAgICAgICAgaSArPSA4XG4gICAgICB9XG4gICAgfVxuICAgIHMgKz0gJyAgICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXFxuJ1xuICAgIHMgKz0gJyAgICAgYSAgYiAgYyAgZCAgZSAgZiAgZyAgaFxcbidcblxuICAgIHJldHVybiBzXG4gIH1cblxuICAvLyBjb252ZXJ0IGEgbW92ZSBmcm9tIFN0YW5kYXJkIEFsZ2VicmFpYyBOb3RhdGlvbiAoU0FOKSB0byAweDg4IGNvb3JkaW5hdGVzXG4gIGZ1bmN0aW9uIG1vdmVfZnJvbV9zYW4obW92ZSwgc2xvcHB5KSB7XG4gICAgLy8gc3RyaXAgb2ZmIGFueSBtb3ZlIGRlY29yYXRpb25zOiBlLmcgTmYzKz8hXG4gICAgdmFyIGNsZWFuX21vdmUgPSBzdHJpcHBlZF9zYW4obW92ZSlcblxuICAgIC8vIGlmIHdlJ3JlIHVzaW5nIHRoZSBzbG9wcHkgcGFyc2VyIHJ1biBhIHJlZ2V4IHRvIGdyYWIgcGllY2UsIHRvLCBhbmQgZnJvbVxuICAgIC8vIHRoaXMgc2hvdWxkIHBhcnNlIGludmFsaWQgU0FOIGxpa2U6IFBlMi1lNCwgUmMxYzQsIFFmM3hmN1xuICAgIGlmIChzbG9wcHkpIHtcbiAgICAgIHZhciBtYXRjaGVzID0gY2xlYW5fbW92ZS5tYXRjaChcbiAgICAgICAgLyhbcG5icnFrUE5CUlFLXSk/KFthLWhdWzEtOF0peD8tPyhbYS1oXVsxLThdKShbcXJiblFSQk5dKT8vXG4gICAgICApXG4gICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICB2YXIgcGllY2UgPSBtYXRjaGVzWzFdXG4gICAgICAgIHZhciBmcm9tID0gbWF0Y2hlc1syXVxuICAgICAgICB2YXIgdG8gPSBtYXRjaGVzWzNdXG4gICAgICAgIHZhciBwcm9tb3Rpb24gPSBtYXRjaGVzWzRdXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG1vdmVzID0gZ2VuZXJhdGVfbW92ZXMoKVxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgLy8gdHJ5IHRoZSBzdHJpY3QgcGFyc2VyIGZpcnN0LCB0aGVuIHRoZSBzbG9wcHkgcGFyc2VyIGlmIHJlcXVlc3RlZFxuICAgICAgLy8gYnkgdGhlIHVzZXJcbiAgICAgIGlmIChcbiAgICAgICAgY2xlYW5fbW92ZSA9PT0gc3RyaXBwZWRfc2FuKG1vdmVfdG9fc2FuKG1vdmVzW2ldKSkgfHxcbiAgICAgICAgKHNsb3BweSAmJiBjbGVhbl9tb3ZlID09PSBzdHJpcHBlZF9zYW4obW92ZV90b19zYW4obW92ZXNbaV0sIHRydWUpKSlcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gbW92ZXNbaV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBtYXRjaGVzICYmXG4gICAgICAgICAgKCFwaWVjZSB8fCBwaWVjZS50b0xvd2VyQ2FzZSgpID09IG1vdmVzW2ldLnBpZWNlKSAmJlxuICAgICAgICAgIFNRVUFSRVNbZnJvbV0gPT0gbW92ZXNbaV0uZnJvbSAmJlxuICAgICAgICAgIFNRVUFSRVNbdG9dID09IG1vdmVzW2ldLnRvICYmXG4gICAgICAgICAgKCFwcm9tb3Rpb24gfHwgcHJvbW90aW9uLnRvTG93ZXJDYXNlKCkgPT0gbW92ZXNbaV0ucHJvbW90aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gbW92ZXNbaV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICogVVRJTElUWSBGVU5DVElPTlNcbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gIGZ1bmN0aW9uIHJhbmsoaSkge1xuICAgIHJldHVybiBpID4+IDRcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbGUoaSkge1xuICAgIHJldHVybiBpICYgMTVcbiAgfVxuXG4gIGZ1bmN0aW9uIGFsZ2VicmFpYyhpKSB7XG4gICAgdmFyIGYgPSBmaWxlKGkpLFxuICAgICAgciA9IHJhbmsoaSlcbiAgICByZXR1cm4gJ2FiY2RlZmdoJy5zdWJzdHJpbmcoZiwgZiArIDEpICsgJzg3NjU0MzIxJy5zdWJzdHJpbmcociwgciArIDEpXG4gIH1cblxuICBmdW5jdGlvbiBzd2FwX2NvbG9yKGMpIHtcbiAgICByZXR1cm4gYyA9PT0gV0hJVEUgPyBCTEFDSyA6IFdISVRFXG4gIH1cblxuICBmdW5jdGlvbiBpc19kaWdpdChjKSB7XG4gICAgcmV0dXJuICcwMTIzNDU2Nzg5Jy5pbmRleE9mKGMpICE9PSAtMVxuICB9XG5cbiAgLyogcHJldHR5ID0gZXh0ZXJuYWwgbW92ZSBvYmplY3QgKi9cbiAgZnVuY3Rpb24gbWFrZV9wcmV0dHkodWdseV9tb3ZlKSB7XG4gICAgdmFyIG1vdmUgPSBjbG9uZSh1Z2x5X21vdmUpXG4gICAgbW92ZS5zYW4gPSBtb3ZlX3RvX3Nhbihtb3ZlLCBmYWxzZSlcbiAgICBtb3ZlLnRvID0gYWxnZWJyYWljKG1vdmUudG8pXG4gICAgbW92ZS5mcm9tID0gYWxnZWJyYWljKG1vdmUuZnJvbSlcblxuICAgIHZhciBmbGFncyA9ICcnXG5cbiAgICBmb3IgKHZhciBmbGFnIGluIEJJVFMpIHtcbiAgICAgIGlmIChCSVRTW2ZsYWddICYgbW92ZS5mbGFncykge1xuICAgICAgICBmbGFncyArPSBGTEFHU1tmbGFnXVxuICAgICAgfVxuICAgIH1cbiAgICBtb3ZlLmZsYWdzID0gZmxhZ3NcblxuICAgIHJldHVybiBtb3ZlXG4gIH1cblxuICBmdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgICB2YXIgZHVwZSA9IG9iaiBpbnN0YW5jZW9mIEFycmF5ID8gW10gOiB7fVxuXG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gb2JqKSB7XG4gICAgICBpZiAodHlwZW9mIHByb3BlcnR5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICBkdXBlW3Byb3BlcnR5XSA9IGNsb25lKG9ialtwcm9wZXJ0eV0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkdXBlW3Byb3BlcnR5XSA9IG9ialtwcm9wZXJ0eV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZHVwZVxuICB9XG5cbiAgZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxuICB9XG5cbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqIERFQlVHR0lORyBVVElMSVRJRVNcbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gIGZ1bmN0aW9uIHBlcmZ0KGRlcHRoKSB7XG4gICAgdmFyIG1vdmVzID0gZ2VuZXJhdGVfbW92ZXMoeyBsZWdhbDogZmFsc2UgfSlcbiAgICB2YXIgbm9kZXMgPSAwXG4gICAgdmFyIGNvbG9yID0gdHVyblxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBtYWtlX21vdmUobW92ZXNbaV0pXG4gICAgICBpZiAoIWtpbmdfYXR0YWNrZWQoY29sb3IpKSB7XG4gICAgICAgIGlmIChkZXB0aCAtIDEgPiAwKSB7XG4gICAgICAgICAgdmFyIGNoaWxkX25vZGVzID0gcGVyZnQoZGVwdGggLSAxKVxuICAgICAgICAgIG5vZGVzICs9IGNoaWxkX25vZGVzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZXMrK1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB1bmRvX21vdmUoKVxuICAgIH1cblxuICAgIHJldHVybiBub2Rlc1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogUFVCTElDIENPTlNUQU5UUyAoaXMgdGhlcmUgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXM/KVxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICBXSElURTogV0hJVEUsXG4gICAgQkxBQ0s6IEJMQUNLLFxuICAgIFBBV046IFBBV04sXG4gICAgS05JR0hUOiBLTklHSFQsXG4gICAgQklTSE9QOiBCSVNIT1AsXG4gICAgUk9PSzogUk9PSyxcbiAgICBRVUVFTjogUVVFRU4sXG4gICAgS0lORzogS0lORyxcbiAgICBTUVVBUkVTOiAoZnVuY3Rpb24oKSB7XG4gICAgICAvKiBmcm9tIHRoZSBFQ01BLTI2MiBzcGVjIChzZWN0aW9uIDEyLjYuNCk6XG4gICAgICAgKiBcIlRoZSBtZWNoYW5pY3Mgb2YgZW51bWVyYXRpbmcgdGhlIHByb3BlcnRpZXMgLi4uIGlzXG4gICAgICAgKiBpbXBsZW1lbnRhdGlvbiBkZXBlbmRlbnRcIlxuICAgICAgICogc286IGZvciAodmFyIHNxIGluIFNRVUFSRVMpIHsga2V5cy5wdXNoKHNxKTsgfSBtaWdodCBub3QgYmVcbiAgICAgICAqIG9yZGVyZWQgY29ycmVjdGx5XG4gICAgICAgKi9cbiAgICAgIHZhciBrZXlzID0gW11cbiAgICAgIGZvciAodmFyIGkgPSBTUVVBUkVTLmE4OyBpIDw9IFNRVUFSRVMuaDE7IGkrKykge1xuICAgICAgICBpZiAoaSAmIDB4ODgpIHtcbiAgICAgICAgICBpICs9IDdcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICAgIGtleXMucHVzaChhbGdlYnJhaWMoaSkpXG4gICAgICB9XG4gICAgICByZXR1cm4ga2V5c1xuICAgIH0pKCksXG4gICAgRkxBR1M6IEZMQUdTLFxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIFBVQkxJQyBBUElcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgbG9hZDogZnVuY3Rpb24oZmVuKSB7XG4gICAgICByZXR1cm4gbG9hZChmZW4pXG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXNldCgpXG4gICAgfSxcblxuICAgIG1vdmVzOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAvKiBUaGUgaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgYSBjaGVzcyBtb3ZlIGlzIGluIDB4ODggZm9ybWF0LCBhbmRcbiAgICAgICAqIG5vdCBtZWFudCB0byBiZSBodW1hbi1yZWFkYWJsZS4gIFRoZSBjb2RlIGJlbG93IGNvbnZlcnRzIHRoZSAweDg4XG4gICAgICAgKiBzcXVhcmUgY29vcmRpbmF0ZXMgdG8gYWxnZWJyYWljIGNvb3JkaW5hdGVzLiAgSXQgYWxzbyBwcnVuZXMgYW5cbiAgICAgICAqIHVubmVjZXNzYXJ5IG1vdmUga2V5cyByZXN1bHRpbmcgZnJvbSBhIHZlcmJvc2UgY2FsbC5cbiAgICAgICAqL1xuXG4gICAgICB2YXIgdWdseV9tb3ZlcyA9IGdlbmVyYXRlX21vdmVzKG9wdGlvbnMpXG4gICAgICB2YXIgbW92ZXMgPSBbXVxuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdWdseV9tb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAvKiBkb2VzIHRoZSB1c2VyIHdhbnQgYSBmdWxsIG1vdmUgb2JqZWN0IChtb3N0IGxpa2VseSBub3QpLCBvciBqdXN0XG4gICAgICAgICAqIFNBTlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKFxuICAgICAgICAgIHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICd2ZXJib3NlJyBpbiBvcHRpb25zICYmXG4gICAgICAgICAgb3B0aW9ucy52ZXJib3NlXG4gICAgICAgICkge1xuICAgICAgICAgIG1vdmVzLnB1c2gobWFrZV9wcmV0dHkodWdseV9tb3Zlc1tpXSkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW92ZXMucHVzaChtb3ZlX3RvX3Nhbih1Z2x5X21vdmVzW2ldLCBmYWxzZSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1vdmVzXG4gICAgfSxcblxuICAgIGluX2NoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpbl9jaGVjaygpXG4gICAgfSxcblxuICAgIGluX2NoZWNrbWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaW5fY2hlY2ttYXRlKClcbiAgICB9LFxuXG4gICAgaW5fc3RhbGVtYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpbl9zdGFsZW1hdGUoKVxuICAgIH0sXG5cbiAgICBpbl9kcmF3OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIGhhbGZfbW92ZXMgPj0gMTAwIHx8XG4gICAgICAgIGluX3N0YWxlbWF0ZSgpIHx8XG4gICAgICAgIGluc3VmZmljaWVudF9tYXRlcmlhbCgpIHx8XG4gICAgICAgIGluX3RocmVlZm9sZF9yZXBldGl0aW9uKClcbiAgICAgIClcbiAgICB9LFxuXG4gICAgaW5zdWZmaWNpZW50X21hdGVyaWFsOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpbnN1ZmZpY2llbnRfbWF0ZXJpYWwoKVxuICAgIH0sXG5cbiAgICBpbl90aHJlZWZvbGRfcmVwZXRpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaW5fdGhyZWVmb2xkX3JlcGV0aXRpb24oKVxuICAgIH0sXG5cbiAgICBnYW1lX292ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgaGFsZl9tb3ZlcyA+PSAxMDAgfHxcbiAgICAgICAgaW5fY2hlY2ttYXRlKCkgfHxcbiAgICAgICAgaW5fc3RhbGVtYXRlKCkgfHxcbiAgICAgICAgaW5zdWZmaWNpZW50X21hdGVyaWFsKCkgfHxcbiAgICAgICAgaW5fdGhyZWVmb2xkX3JlcGV0aXRpb24oKVxuICAgICAgKVxuICAgIH0sXG5cbiAgICB2YWxpZGF0ZV9mZW46IGZ1bmN0aW9uKGZlbikge1xuICAgICAgcmV0dXJuIHZhbGlkYXRlX2ZlbihmZW4pXG4gICAgfSxcblxuICAgIGZlbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZ2VuZXJhdGVfZmVuKClcbiAgICB9LFxuXG4gICAgYm9hcmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IFtdLFxuICAgICAgICByb3cgPSBbXVxuXG4gICAgICBmb3IgKHZhciBpID0gU1FVQVJFUy5hODsgaSA8PSBTUVVBUkVTLmgxOyBpKyspIHtcbiAgICAgICAgaWYgKGJvYXJkW2ldID09IG51bGwpIHtcbiAgICAgICAgICByb3cucHVzaChudWxsKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJvdy5wdXNoKHsgdHlwZTogYm9hcmRbaV0udHlwZSwgY29sb3I6IGJvYXJkW2ldLmNvbG9yIH0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKChpICsgMSkgJiAweDg4KSB7XG4gICAgICAgICAgb3V0cHV0LnB1c2gocm93KVxuICAgICAgICAgIHJvdyA9IFtdXG4gICAgICAgICAgaSArPSA4XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dFxuICAgIH0sXG5cbiAgICBwZ246IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIC8qIHVzaW5nIHRoZSBzcGVjaWZpY2F0aW9uIGZyb20gaHR0cDovL3d3dy5jaGVzc2NsdWIuY29tL2hlbHAvUEdOLXNwZWNcbiAgICAgICAqIGV4YW1wbGUgZm9yIGh0bWwgdXNhZ2U6IC5wZ24oeyBtYXhfd2lkdGg6IDcyLCBuZXdsaW5lX2NoYXI6IFwiPGJyIC8+XCIgfSlcbiAgICAgICAqL1xuICAgICAgdmFyIG5ld2xpbmUgPVxuICAgICAgICB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG9wdGlvbnMubmV3bGluZV9jaGFyID09PSAnc3RyaW5nJ1xuICAgICAgICAgID8gb3B0aW9ucy5uZXdsaW5lX2NoYXJcbiAgICAgICAgICA6ICdcXG4nXG4gICAgICB2YXIgbWF4X3dpZHRoID1cbiAgICAgICAgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBvcHRpb25zLm1heF93aWR0aCA9PT0gJ251bWJlcidcbiAgICAgICAgICA/IG9wdGlvbnMubWF4X3dpZHRoXG4gICAgICAgICAgOiAwXG4gICAgICB2YXIgcmVzdWx0ID0gW11cbiAgICAgIHZhciBoZWFkZXJfZXhpc3RzID0gZmFsc2VcblxuICAgICAgLyogYWRkIHRoZSBQR04gaGVhZGVyIGhlYWRlcnJtYXRpb24gKi9cbiAgICAgIGZvciAodmFyIGkgaW4gaGVhZGVyKSB7XG4gICAgICAgIC8qIFRPRE86IG9yZGVyIG9mIGVudW1lcmF0ZWQgcHJvcGVydGllcyBpbiBoZWFkZXIgb2JqZWN0IGlzIG5vdFxuICAgICAgICAgKiBndWFyYW50ZWVkLCBzZWUgRUNNQS0yNjIgc3BlYyAoc2VjdGlvbiAxMi42LjQpXG4gICAgICAgICAqL1xuICAgICAgICByZXN1bHQucHVzaCgnWycgKyBpICsgJyBcIicgKyBoZWFkZXJbaV0gKyAnXCJdJyArIG5ld2xpbmUpXG4gICAgICAgIGhlYWRlcl9leGlzdHMgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmIChoZWFkZXJfZXhpc3RzICYmIGhpc3RvcnkubGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKG5ld2xpbmUpXG4gICAgICB9XG5cbiAgICAgIHZhciBhcHBlbmRfY29tbWVudCA9IGZ1bmN0aW9uKG1vdmVfc3RyaW5nKSB7XG4gICAgICAgIHZhciBjb21tZW50ID0gY29tbWVudHNbZ2VuZXJhdGVfZmVuKCldXG4gICAgICAgIGlmICh0eXBlb2YgY29tbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB2YXIgZGVsaW1pdGVyID0gbW92ZV9zdHJpbmcubGVuZ3RoID4gMCA/ICcgJyA6ICcnO1xuICAgICAgICAgIG1vdmVfc3RyaW5nID0gYCR7bW92ZV9zdHJpbmd9JHtkZWxpbWl0ZXJ9eyR7Y29tbWVudH19YFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb3ZlX3N0cmluZ1xuICAgICAgfVxuXG4gICAgICAvKiBwb3AgYWxsIG9mIGhpc3Rvcnkgb250byByZXZlcnNlZF9oaXN0b3J5ICovXG4gICAgICB2YXIgcmV2ZXJzZWRfaGlzdG9yeSA9IFtdXG4gICAgICB3aGlsZSAoaGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldmVyc2VkX2hpc3RvcnkucHVzaCh1bmRvX21vdmUoKSlcbiAgICAgIH1cblxuICAgICAgdmFyIG1vdmVzID0gW11cbiAgICAgIHZhciBtb3ZlX3N0cmluZyA9ICcnXG5cbiAgICAgIC8qIHNwZWNpYWwgY2FzZSBvZiBhIGNvbW1lbnRlZCBzdGFydGluZyBwb3NpdGlvbiB3aXRoIG5vIG1vdmVzICovXG4gICAgICBpZiAocmV2ZXJzZWRfaGlzdG9yeS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbW92ZXMucHVzaChhcHBlbmRfY29tbWVudCgnJykpXG4gICAgICB9XG5cbiAgICAgIC8qIGJ1aWxkIHRoZSBsaXN0IG9mIG1vdmVzLiAgYSBtb3ZlX3N0cmluZyBsb29rcyBsaWtlOiBcIjMuIGUzIGU2XCIgKi9cbiAgICAgIHdoaWxlIChyZXZlcnNlZF9oaXN0b3J5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgbW92ZV9zdHJpbmcgPSBhcHBlbmRfY29tbWVudChtb3ZlX3N0cmluZylcbiAgICAgICAgdmFyIG1vdmUgPSByZXZlcnNlZF9oaXN0b3J5LnBvcCgpXG5cbiAgICAgICAgLyogaWYgdGhlIHBvc2l0aW9uIHN0YXJ0ZWQgd2l0aCBibGFjayB0byBtb3ZlLCBzdGFydCBQR04gd2l0aCAxLiAuLi4gKi9cbiAgICAgICAgaWYgKCFoaXN0b3J5Lmxlbmd0aCAmJiBtb3ZlLmNvbG9yID09PSAnYicpIHtcbiAgICAgICAgICBtb3ZlX3N0cmluZyA9IG1vdmVfbnVtYmVyICsgJy4gLi4uJ1xuICAgICAgICB9IGVsc2UgaWYgKG1vdmUuY29sb3IgPT09ICd3Jykge1xuICAgICAgICAgIC8qIHN0b3JlIHRoZSBwcmV2aW91cyBnZW5lcmF0ZWQgbW92ZV9zdHJpbmcgaWYgd2UgaGF2ZSBvbmUgKi9cbiAgICAgICAgICBpZiAobW92ZV9zdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICBtb3Zlcy5wdXNoKG1vdmVfc3RyaW5nKVxuICAgICAgICAgIH1cbiAgICAgICAgICBtb3ZlX3N0cmluZyA9IG1vdmVfbnVtYmVyICsgJy4nXG4gICAgICAgIH1cblxuICAgICAgICBtb3ZlX3N0cmluZyA9IG1vdmVfc3RyaW5nICsgJyAnICsgbW92ZV90b19zYW4obW92ZSwgZmFsc2UpXG4gICAgICAgIG1ha2VfbW92ZShtb3ZlKVxuICAgICAgfVxuXG4gICAgICAvKiBhcmUgdGhlcmUgYW55IG90aGVyIGxlZnRvdmVyIG1vdmVzPyAqL1xuICAgICAgaWYgKG1vdmVfc3RyaW5nLmxlbmd0aCkge1xuICAgICAgICBtb3Zlcy5wdXNoKGFwcGVuZF9jb21tZW50KG1vdmVfc3RyaW5nKSlcbiAgICAgIH1cblxuICAgICAgLyogaXMgdGhlcmUgYSByZXN1bHQ/ICovXG4gICAgICBpZiAodHlwZW9mIGhlYWRlci5SZXN1bHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vdmVzLnB1c2goaGVhZGVyLlJlc3VsdClcbiAgICAgIH1cblxuICAgICAgLyogaGlzdG9yeSBzaG91bGQgYmUgYmFjayB0byB3aGF0IGl0IHdhcyBiZWZvcmUgd2Ugc3RhcnRlZCBnZW5lcmF0aW5nIFBHTixcbiAgICAgICAqIHNvIGpvaW4gdG9nZXRoZXIgbW92ZXNcbiAgICAgICAqL1xuICAgICAgaWYgKG1heF93aWR0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpICsgbW92ZXMuam9pbignICcpXG4gICAgICB9XG5cbiAgICAgIHZhciBzdHJpcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSA9PT0gJyAnKSB7XG4gICAgICAgICAgcmVzdWx0LnBvcCgpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG5cbiAgICAgIC8qIE5COiB0aGlzIGRvZXMgbm90IHByZXNlcnZlIGNvbW1lbnQgd2hpdGVzcGFjZS4gKi9cbiAgICAgIHZhciB3cmFwX2NvbW1lbnQgPSBmdW5jdGlvbih3aWR0aCwgbW92ZSkge1xuICAgICAgICBmb3IgKHZhciB0b2tlbiBvZiBtb3ZlLnNwbGl0KCcgJykpIHtcbiAgICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHdpZHRoICsgdG9rZW4ubGVuZ3RoID4gbWF4X3dpZHRoKSB7XG4gICAgICAgICAgICB3aGlsZSAoc3RyaXAoKSkge1xuICAgICAgICAgICAgICB3aWR0aC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3bGluZSk7XG4gICAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKHRva2VuKTtcbiAgICAgICAgICB3aWR0aCArPSB0b2tlbi5sZW5ndGg7XG4gICAgICAgICAgcmVzdWx0LnB1c2goJyAnKTtcbiAgICAgICAgICB3aWR0aCsrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdHJpcCgpKSB7XG4gICAgICAgICAgd2lkdGgtLTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd2lkdGg7XG4gICAgICB9O1xuXG4gICAgICAvKiB3cmFwIHRoZSBQR04gb3V0cHV0IGF0IG1heF93aWR0aCAqL1xuICAgICAgdmFyIGN1cnJlbnRfd2lkdGggPSAwXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjdXJyZW50X3dpZHRoICsgbW92ZXNbaV0ubGVuZ3RoID4gbWF4X3dpZHRoKSB7XG4gICAgICAgICAgaWYgKG1vdmVzW2ldLmluY2x1ZGVzKCd7JykpIHtcbiAgICAgICAgICAgIGN1cnJlbnRfd2lkdGggPSB3cmFwX2NvbW1lbnQoY3VycmVudF93aWR0aCwgbW92ZXNbaV0pO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qIGlmIHRoZSBjdXJyZW50IG1vdmUgd2lsbCBwdXNoIHBhc3QgbWF4X3dpZHRoICovXG4gICAgICAgIGlmIChjdXJyZW50X3dpZHRoICsgbW92ZXNbaV0ubGVuZ3RoID4gbWF4X3dpZHRoICYmIGkgIT09IDApIHtcbiAgICAgICAgICAvKiBkb24ndCBlbmQgdGhlIGxpbmUgd2l0aCB3aGl0ZXNwYWNlICovXG4gICAgICAgICAgaWYgKHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0gPT09ICcgJykge1xuICAgICAgICAgICAgcmVzdWx0LnBvcCgpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzdWx0LnB1c2gobmV3bGluZSlcbiAgICAgICAgICBjdXJyZW50X3dpZHRoID0gMFxuICAgICAgICB9IGVsc2UgaWYgKGkgIT09IDApIHtcbiAgICAgICAgICByZXN1bHQucHVzaCgnICcpXG4gICAgICAgICAgY3VycmVudF93aWR0aCsrXG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnB1c2gobW92ZXNbaV0pXG4gICAgICAgIGN1cnJlbnRfd2lkdGggKz0gbW92ZXNbaV0ubGVuZ3RoXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQuam9pbignJylcbiAgICB9LFxuXG4gICAgbG9hZF9wZ246IGZ1bmN0aW9uKHBnbiwgb3B0aW9ucykge1xuICAgICAgLy8gYWxsb3cgdGhlIHVzZXIgdG8gc3BlY2lmeSB0aGUgc2xvcHB5IG1vdmUgcGFyc2VyIHRvIHdvcmsgYXJvdW5kIG92ZXJcbiAgICAgIC8vIGRpc2FtYmlndWF0aW9uIGJ1Z3MgaW4gRnJpdHogYW5kIENoZXNzYmFzZVxuICAgICAgdmFyIHNsb3BweSA9XG4gICAgICAgIHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAnc2xvcHB5JyBpbiBvcHRpb25zXG4gICAgICAgICAgPyBvcHRpb25zLnNsb3BweVxuICAgICAgICAgIDogZmFsc2VcblxuICAgICAgZnVuY3Rpb24gbWFzayhzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXFxcL2csICdcXFxcJylcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFzX2tleXMob2JqZWN0KSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwYXJzZV9wZ25faGVhZGVyKGhlYWRlciwgb3B0aW9ucykge1xuICAgICAgICB2YXIgbmV3bGluZV9jaGFyID1cbiAgICAgICAgICB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICB0eXBlb2Ygb3B0aW9ucy5uZXdsaW5lX2NoYXIgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICA/IG9wdGlvbnMubmV3bGluZV9jaGFyXG4gICAgICAgICAgICA6ICdcXHI/XFxuJ1xuICAgICAgICB2YXIgaGVhZGVyX29iaiA9IHt9XG4gICAgICAgIHZhciBoZWFkZXJzID0gaGVhZGVyLnNwbGl0KG5ldyBSZWdFeHAobWFzayhuZXdsaW5lX2NoYXIpKSlcbiAgICAgICAgdmFyIGtleSA9ICcnXG4gICAgICAgIHZhciB2YWx1ZSA9ICcnXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWFkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAga2V5ID0gaGVhZGVyc1tpXS5yZXBsYWNlKC9eXFxbKFtBLVpdW0EtWmEtel0qKVxccy4qXFxdJC8sICckMScpXG4gICAgICAgICAgdmFsdWUgPSBoZWFkZXJzW2ldLnJlcGxhY2UoL15cXFtbQS1aYS16XStcXHNcIiguKilcIlxcICpcXF0kLywgJyQxJylcbiAgICAgICAgICBpZiAodHJpbShrZXkpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGhlYWRlcl9vYmpba2V5XSA9IHZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlcl9vYmpcbiAgICAgIH1cblxuICAgICAgdmFyIG5ld2xpbmVfY2hhciA9XG4gICAgICAgIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3B0aW9ucy5uZXdsaW5lX2NoYXIgPT09ICdzdHJpbmcnXG4gICAgICAgICAgPyBvcHRpb25zLm5ld2xpbmVfY2hhclxuICAgICAgICAgIDogJ1xccj9cXG4nXG5cbiAgICAgIC8vIFJlZ0V4cCB0byBzcGxpdCBoZWFkZXIuIFRha2VzIGFkdmFudGFnZSBvZiB0aGUgZmFjdCB0aGF0IGhlYWRlciBhbmQgbW92ZXRleHRcbiAgICAgIC8vIHdpbGwgYWx3YXlzIGhhdmUgYSBibGFuayBsaW5lIGJldHdlZW4gdGhlbSAoaWUsIHR3byBuZXdsaW5lX2NoYXIncykuXG4gICAgICAvLyBXaXRoIGRlZmF1bHQgbmV3bGluZV9jaGFyLCB3aWxsIGVxdWFsOiAvXihcXFsoKD86XFxyP1xcbil8LikqXFxdKSg/Olxccj9cXG4pezJ9L1xuICAgICAgdmFyIGhlYWRlcl9yZWdleCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICdeKFxcXFxbKCg/OicgK1xuICAgICAgICAgIG1hc2sobmV3bGluZV9jaGFyKSArXG4gICAgICAgICAgJyl8LikqXFxcXF0pJyArXG4gICAgICAgICAgJyg/OicgK1xuICAgICAgICAgIG1hc2sobmV3bGluZV9jaGFyKSArXG4gICAgICAgICAgJyl7Mn0nXG4gICAgICApXG5cbiAgICAgIC8vIElmIG5vIGhlYWRlciBnaXZlbiwgYmVnaW4gd2l0aCBtb3Zlcy5cbiAgICAgIHZhciBoZWFkZXJfc3RyaW5nID0gaGVhZGVyX3JlZ2V4LnRlc3QocGduKVxuICAgICAgICA/IGhlYWRlcl9yZWdleC5leGVjKHBnbilbMV1cbiAgICAgICAgOiAnJ1xuXG4gICAgICAvLyBQdXQgdGhlIGJvYXJkIGluIHRoZSBzdGFydGluZyBwb3NpdGlvblxuICAgICAgcmVzZXQoKVxuXG4gICAgICAvKiBwYXJzZSBQR04gaGVhZGVyICovXG4gICAgICB2YXIgaGVhZGVycyA9IHBhcnNlX3Bnbl9oZWFkZXIoaGVhZGVyX3N0cmluZywgb3B0aW9ucylcbiAgICAgIGZvciAodmFyIGtleSBpbiBoZWFkZXJzKSB7XG4gICAgICAgIHNldF9oZWFkZXIoW2tleSwgaGVhZGVyc1trZXldXSlcbiAgICAgIH1cblxuICAgICAgLyogbG9hZCB0aGUgc3RhcnRpbmcgcG9zaXRpb24gaW5kaWNhdGVkIGJ5IFtTZXR1cCAnMSddIGFuZFxuICAgICAgICogW0ZFTiBwb3NpdGlvbl0gKi9cbiAgICAgIGlmIChoZWFkZXJzWydTZXRVcCddID09PSAnMScpIHtcbiAgICAgICAgaWYgKCEoJ0ZFTicgaW4gaGVhZGVycyAmJiBsb2FkKGhlYWRlcnNbJ0ZFTiddLCB0cnVlKSkpIHtcbiAgICAgICAgICAvLyBzZWNvbmQgYXJndW1lbnQgdG8gbG9hZDogZG9uJ3QgY2xlYXIgdGhlIGhlYWRlcnNcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKiBOQjogdGhlIHJlZ2V4ZXMgYmVsb3cgdGhhdCBkZWxldGUgbW92ZSBudW1iZXJzLCByZWN1cnNpdmVcbiAgICAgICAqIGFubm90YXRpb25zLCBhbmQgbnVtZXJpYyBhbm5vdGF0aW9uIGdseXBocyBtYXkgYWxzbyBtYXRjaFxuICAgICAgICogdGV4dCBpbiBjb21tZW50cy4gVG8gcHJldmVudCB0aGlzLCB3ZSB0cmFuc2Zvcm0gY29tbWVudHNcbiAgICAgICAqIGJ5IGhleC1lbmNvZGluZyB0aGVtIGluIHBsYWNlIGFuZCBkZWNvZGluZyB0aGVtIGFnYWluIGFmdGVyXG4gICAgICAgKiB0aGUgb3RoZXIgdG9rZW5zIGhhdmUgYmVlbiBkZWxldGVkLlxuICAgICAgICpcbiAgICAgICAqIFdoaWxlIHRoZSBzcGVjIHN0YXRlcyB0aGF0IFBHTiBmaWxlcyBzaG91bGQgYmUgQVNDSUkgZW5jb2RlZCxcbiAgICAgICAqIHdlIHVzZSB7ZW4sZGV9Y29kZVVSSUNvbXBvbmVudCBoZXJlIHRvIHN1cHBvcnQgYXJiaXRyYXJ5IFVURjhcbiAgICAgICAqIGFzIGEgY29udmVuaWVuY2UgZm9yIG1vZGVybiB1c2VycyAqL1xuXG4gICAgICB2YXIgdG9faGV4ID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBBcnJheVxuICAgICAgICAgIC5mcm9tKHN0cmluZylcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICAgIC8qIGVuY29kZVVSSSBkb2Vzbid0IHRyYW5zZm9ybSBtb3N0IEFTQ0lJIGNoYXJhY3RlcnMsXG4gICAgICAgICAgICAgKiBzbyB3ZSBoYW5kbGUgdGhlc2Ugb3Vyc2VsdmVzICovXG4gICAgICAgICAgICByZXR1cm4gYy5jaGFyQ29kZUF0KDApIDwgMTI4XG4gICAgICAgICAgICAgID8gYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KVxuICAgICAgICAgICAgICA6IGVuY29kZVVSSUNvbXBvbmVudChjKS5yZXBsYWNlKC9cXCUvZywgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5qb2luKCcnKVxuICAgICAgfVxuXG4gICAgICB2YXIgZnJvbV9oZXggPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5sZW5ndGggPT0gMFxuICAgICAgICAgID8gJydcbiAgICAgICAgICA6IGRlY29kZVVSSUNvbXBvbmVudCgnJScgKyBzdHJpbmcubWF0Y2goLy57MSwyfS9nKS5qb2luKCclJykpXG4gICAgICB9XG5cbiAgICAgIHZhciBlbmNvZGVfY29tbWVudCA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShuZXcgUmVnRXhwKG1hc2sobmV3bGluZV9jaGFyKSwgJ2cnKSwgJyAnKVxuICAgICAgICByZXR1cm4gYHske3RvX2hleChzdHJpbmcuc2xpY2UoMSwgc3RyaW5nLmxlbmd0aCAtIDEpKX19YFxuICAgICAgfVxuXG4gICAgICB2YXIgZGVjb2RlX2NvbW1lbnQgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgICAgaWYgKHN0cmluZy5zdGFydHNXaXRoKCd7JykgJiYgc3RyaW5nLmVuZHNXaXRoKCd9JykpIHtcbiAgICAgICAgICByZXR1cm4gZnJvbV9oZXgoc3RyaW5nLnNsaWNlKDEsIHN0cmluZy5sZW5ndGggLSAxKSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKiBkZWxldGUgaGVhZGVyIHRvIGdldCB0aGUgbW92ZXMgKi9cbiAgICAgIHZhciBtcyA9IHBnblxuICAgICAgICAucmVwbGFjZShoZWFkZXJfc3RyaW5nLCAnJylcbiAgICAgICAgLnJlcGxhY2UoXG4gICAgICAgICAgLyogZW5jb2RlIGNvbW1lbnRzIHNvIHRoZXkgZG9uJ3QgZ2V0IGRlbGV0ZWQgYmVsb3cgKi9cbiAgICAgICAgICBuZXcgUmVnRXhwKGAoXFx7W159XSpcXH0pKz98OyhbXiR7bWFzayhuZXdsaW5lX2NoYXIpfV0qKWAsICdnJyksXG4gICAgICAgICAgZnVuY3Rpb24obWF0Y2gsIGJyYWNrZXQsIHNlbWljb2xvbikge1xuICAgICAgICAgICAgcmV0dXJuIGJyYWNrZXQgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICA/IGVuY29kZV9jb21tZW50KGJyYWNrZXQpXG4gICAgICAgICAgICAgIDogJyAnICsgZW5jb2RlX2NvbW1lbnQoYHske3NlbWljb2xvbi5zbGljZSgxKX19YClcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChtYXNrKG5ld2xpbmVfY2hhciksICdnJyksICcgJylcblxuICAgICAgLyogZGVsZXRlIHJlY3Vyc2l2ZSBhbm5vdGF0aW9uIHZhcmlhdGlvbnMgKi9cbiAgICAgIHZhciByYXZfcmVnZXggPSAvKFxcKFteXFwoXFwpXStcXCkpKz8vZ1xuICAgICAgd2hpbGUgKHJhdl9yZWdleC50ZXN0KG1zKSkge1xuICAgICAgICBtcyA9IG1zLnJlcGxhY2UocmF2X3JlZ2V4LCAnJylcbiAgICAgIH1cblxuICAgICAgLyogZGVsZXRlIG1vdmUgbnVtYmVycyAqL1xuICAgICAgbXMgPSBtcy5yZXBsYWNlKC9cXGQrXFwuKFxcLlxcLik/L2csICcnKVxuXG4gICAgICAvKiBkZWxldGUgLi4uIGluZGljYXRpbmcgYmxhY2sgdG8gbW92ZSAqL1xuICAgICAgbXMgPSBtcy5yZXBsYWNlKC9cXC5cXC5cXC4vZywgJycpXG5cbiAgICAgIC8qIGRlbGV0ZSBudW1lcmljIGFubm90YXRpb24gZ2x5cGhzICovXG4gICAgICBtcyA9IG1zLnJlcGxhY2UoL1xcJFxcZCsvZywgJycpXG5cbiAgICAgIC8qIHRyaW0gYW5kIGdldCBhcnJheSBvZiBtb3ZlcyAqL1xuICAgICAgdmFyIG1vdmVzID0gdHJpbShtcykuc3BsaXQobmV3IFJlZ0V4cCgvXFxzKy8pKVxuXG4gICAgICAvKiBkZWxldGUgZW1wdHkgZW50cmllcyAqL1xuICAgICAgbW92ZXMgPSBtb3Zlc1xuICAgICAgICAuam9pbignLCcpXG4gICAgICAgIC5yZXBsYWNlKC8sLCsvZywgJywnKVxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgdmFyIG1vdmUgPSAnJ1xuXG4gICAgICBmb3IgKHZhciBoYWxmX21vdmUgPSAwOyBoYWxmX21vdmUgPCBtb3Zlcy5sZW5ndGggLSAxOyBoYWxmX21vdmUrKykge1xuICAgICAgICB2YXIgY29tbWVudCA9IGRlY29kZV9jb21tZW50KG1vdmVzW2hhbGZfbW92ZV0pXG4gICAgICAgIGlmIChjb21tZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb21tZW50c1tnZW5lcmF0ZV9mZW4oKV0gPSBjb21tZW50XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICBtb3ZlID0gbW92ZV9mcm9tX3Nhbihtb3Zlc1toYWxmX21vdmVdLCBzbG9wcHkpXG5cbiAgICAgICAgLyogbW92ZSBub3QgcG9zc2libGUhIChkb24ndCBjbGVhciB0aGUgYm9hcmQgdG8gZXhhbWluZSB0byBzaG93IHRoZVxuICAgICAgICAgKiBsYXRlc3QgdmFsaWQgcG9zaXRpb24pXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobW92ZSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFrZV9tb3ZlKG1vdmUpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29tbWVudCA9IGRlY29kZV9jb21tZW50KG1vdmVzW21vdmVzLmxlbmd0aCAtIDFdKVxuICAgICAgaWYgKGNvbW1lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb21tZW50c1tnZW5lcmF0ZV9mZW4oKV0gPSBjb21tZW50XG4gICAgICAgIG1vdmVzLnBvcCgpXG4gICAgICB9XG5cbiAgICAgIC8qIGV4YW1pbmUgbGFzdCBtb3ZlICovXG4gICAgICBtb3ZlID0gbW92ZXNbbW92ZXMubGVuZ3RoIC0gMV1cbiAgICAgIGlmIChQT1NTSUJMRV9SRVNVTFRTLmluZGV4T2YobW92ZSkgPiAtMSkge1xuICAgICAgICBpZiAoaGFzX2tleXMoaGVhZGVyKSAmJiB0eXBlb2YgaGVhZGVyLlJlc3VsdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBzZXRfaGVhZGVyKFsnUmVzdWx0JywgbW92ZV0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vdmUgPSBtb3ZlX2Zyb21fc2FuKG1vdmUsIHNsb3BweSlcbiAgICAgICAgaWYgKG1vdmUgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1ha2VfbW92ZShtb3ZlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG5cbiAgICBoZWFkZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHNldF9oZWFkZXIoYXJndW1lbnRzKVxuICAgIH0sXG5cbiAgICBhc2NpaTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYXNjaWkoKVxuICAgIH0sXG5cbiAgICB0dXJuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0dXJuXG4gICAgfSxcblxuICAgIG1vdmU6IGZ1bmN0aW9uKG1vdmUsIG9wdGlvbnMpIHtcbiAgICAgIC8qIFRoZSBtb3ZlIGZ1bmN0aW9uIGNhbiBiZSBjYWxsZWQgd2l0aCBpbiB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAgICAgKlxuICAgICAgICogLm1vdmUoJ054YjcnKSAgICAgIDwtIHdoZXJlICdtb3ZlJyBpcyBhIGNhc2Utc2Vuc2l0aXZlIFNBTiBzdHJpbmdcbiAgICAgICAqXG4gICAgICAgKiAubW92ZSh7IGZyb206ICdoNycsIDwtIHdoZXJlIHRoZSAnbW92ZScgaXMgYSBtb3ZlIG9iamVjdCAoYWRkaXRpb25hbFxuICAgICAgICogICAgICAgICB0byA6J2g4JywgICAgICBmaWVsZHMgYXJlIGlnbm9yZWQpXG4gICAgICAgKiAgICAgICAgIHByb21vdGlvbjogJ3EnLFxuICAgICAgICogICAgICB9KVxuICAgICAgICovXG5cbiAgICAgIC8vIGFsbG93IHRoZSB1c2VyIHRvIHNwZWNpZnkgdGhlIHNsb3BweSBtb3ZlIHBhcnNlciB0byB3b3JrIGFyb3VuZCBvdmVyXG4gICAgICAvLyBkaXNhbWJpZ3VhdGlvbiBidWdzIGluIEZyaXR6IGFuZCBDaGVzc2Jhc2VcbiAgICAgIHZhciBzbG9wcHkgPVxuICAgICAgICB0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ3Nsb3BweScgaW4gb3B0aW9uc1xuICAgICAgICAgID8gb3B0aW9ucy5zbG9wcHlcbiAgICAgICAgICA6IGZhbHNlXG5cbiAgICAgIHZhciBtb3ZlX29iaiA9IG51bGxcblxuICAgICAgaWYgKHR5cGVvZiBtb3ZlID09PSAnc3RyaW5nJykge1xuICAgICAgICBtb3ZlX29iaiA9IG1vdmVfZnJvbV9zYW4obW92ZSwgc2xvcHB5KVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbW92ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdmFyIG1vdmVzID0gZ2VuZXJhdGVfbW92ZXMoKVxuXG4gICAgICAgIC8qIGNvbnZlcnQgdGhlIHByZXR0eSBtb3ZlIG9iamVjdCB0byBhbiB1Z2x5IG1vdmUgb2JqZWN0ICovXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIG1vdmUuZnJvbSA9PT0gYWxnZWJyYWljKG1vdmVzW2ldLmZyb20pICYmXG4gICAgICAgICAgICBtb3ZlLnRvID09PSBhbGdlYnJhaWMobW92ZXNbaV0udG8pICYmXG4gICAgICAgICAgICAoISgncHJvbW90aW9uJyBpbiBtb3Zlc1tpXSkgfHxcbiAgICAgICAgICAgICAgbW92ZS5wcm9tb3Rpb24gPT09IG1vdmVzW2ldLnByb21vdGlvbilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIG1vdmVfb2JqID0gbW92ZXNbaV1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qIGZhaWxlZCB0byBmaW5kIG1vdmUgKi9cbiAgICAgIGlmICghbW92ZV9vYmopIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cblxuICAgICAgLyogbmVlZCB0byBtYWtlIGEgY29weSBvZiBtb3ZlIGJlY2F1c2Ugd2UgY2FuJ3QgZ2VuZXJhdGUgU0FOIGFmdGVyIHRoZVxuICAgICAgICogbW92ZSBpcyBtYWRlXG4gICAgICAgKi9cbiAgICAgIHZhciBwcmV0dHlfbW92ZSA9IG1ha2VfcHJldHR5KG1vdmVfb2JqKVxuXG4gICAgICBtYWtlX21vdmUobW92ZV9vYmopXG5cbiAgICAgIHJldHVybiBwcmV0dHlfbW92ZVxuICAgIH0sXG5cbiAgICB1bmRvOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtb3ZlID0gdW5kb19tb3ZlKClcbiAgICAgIHJldHVybiBtb3ZlID8gbWFrZV9wcmV0dHkobW92ZSkgOiBudWxsXG4gICAgfSxcblxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjbGVhcigpXG4gICAgfSxcblxuICAgIHB1dDogZnVuY3Rpb24ocGllY2UsIHNxdWFyZSkge1xuICAgICAgcmV0dXJuIHB1dChwaWVjZSwgc3F1YXJlKVxuICAgIH0sXG5cbiAgICBnZXQ6IGZ1bmN0aW9uKHNxdWFyZSkge1xuICAgICAgcmV0dXJuIGdldChzcXVhcmUpXG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24oc3F1YXJlKSB7XG4gICAgICByZXR1cm4gcmVtb3ZlKHNxdWFyZSlcbiAgICB9LFxuXG4gICAgcGVyZnQ6IGZ1bmN0aW9uKGRlcHRoKSB7XG4gICAgICByZXR1cm4gcGVyZnQoZGVwdGgpXG4gICAgfSxcblxuICAgIHNxdWFyZV9jb2xvcjogZnVuY3Rpb24oc3F1YXJlKSB7XG4gICAgICBpZiAoc3F1YXJlIGluIFNRVUFSRVMpIHtcbiAgICAgICAgdmFyIHNxXzB4ODggPSBTUVVBUkVTW3NxdWFyZV1cbiAgICAgICAgcmV0dXJuIChyYW5rKHNxXzB4ODgpICsgZmlsZShzcV8weDg4KSkgJSAyID09PSAwID8gJ2xpZ2h0JyA6ICdkYXJrJ1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH0sXG5cbiAgICBoaXN0b3J5OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgcmV2ZXJzZWRfaGlzdG9yeSA9IFtdXG4gICAgICB2YXIgbW92ZV9oaXN0b3J5ID0gW11cbiAgICAgIHZhciB2ZXJib3NlID1cbiAgICAgICAgdHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICd2ZXJib3NlJyBpbiBvcHRpb25zICYmXG4gICAgICAgIG9wdGlvbnMudmVyYm9zZVxuXG4gICAgICB3aGlsZSAoaGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldmVyc2VkX2hpc3RvcnkucHVzaCh1bmRvX21vdmUoKSlcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHJldmVyc2VkX2hpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgbW92ZSA9IHJldmVyc2VkX2hpc3RvcnkucG9wKClcbiAgICAgICAgaWYgKHZlcmJvc2UpIHtcbiAgICAgICAgICBtb3ZlX2hpc3RvcnkucHVzaChtYWtlX3ByZXR0eShtb3ZlKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb3ZlX2hpc3RvcnkucHVzaChtb3ZlX3RvX3Nhbihtb3ZlKSlcbiAgICAgICAgfVxuICAgICAgICBtYWtlX21vdmUobW92ZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1vdmVfaGlzdG9yeVxuICAgIH0sXG5cbiAgICBnZXRfY29tbWVudDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29tbWVudHNbZ2VuZXJhdGVfZmVuKCldO1xuICAgIH0sXG5cbiAgICBzZXRfY29tbWVudDogZnVuY3Rpb24oY29tbWVudCkge1xuICAgICAgY29tbWVudHNbZ2VuZXJhdGVfZmVuKCldID0gY29tbWVudC5yZXBsYWNlKCd7JywgJ1snKS5yZXBsYWNlKCd9JywgJ10nKTtcbiAgICB9LFxuXG4gICAgZGVsZXRlX2NvbW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbW1lbnQgPSBjb21tZW50c1tnZW5lcmF0ZV9mZW4oKV07XG4gICAgICBkZWxldGUgY29tbWVudHNbZ2VuZXJhdGVfZmVuKCldO1xuICAgICAgcmV0dXJuIGNvbW1lbnQ7XG4gICAgfSxcblxuICAgIGdldF9jb21tZW50czogZnVuY3Rpb24oKSB7XG4gICAgICBwcnVuZV9jb21tZW50cygpO1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGNvbW1lbnRzKS5tYXAoZnVuY3Rpb24oZmVuKSB7XG4gICAgICAgIHJldHVybiB7ZmVuOiBmZW4sIGNvbW1lbnQ6IGNvbW1lbnRzW2Zlbl19O1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGRlbGV0ZV9jb21tZW50czogZnVuY3Rpb24oKSB7XG4gICAgICBwcnVuZV9jb21tZW50cygpO1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGNvbW1lbnRzKVxuICAgICAgICAubWFwKGZ1bmN0aW9uKGZlbikge1xuICAgICAgICAgIHZhciBjb21tZW50ID0gY29tbWVudHNbZmVuXTtcbiAgICAgICAgICBkZWxldGUgY29tbWVudHNbZmVuXTtcbiAgICAgICAgICByZXR1cm4ge2ZlbjogZmVuLCBjb21tZW50OiBjb21tZW50fTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qIGV4cG9ydCBDaGVzcyBvYmplY3QgaWYgdXNpbmcgbm9kZSBvciBhbnkgb3RoZXIgQ29tbW9uSlMgY29tcGF0aWJsZVxuICogZW52aXJvbm1lbnQgKi9cbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIGV4cG9ydHMuQ2hlc3MgPSBDaGVzc1xuLyogZXhwb3J0IENoZXNzIG9iamVjdCBmb3IgYW55IFJlcXVpcmVKUyBjb21wYXRpYmxlIGVudmlyb25tZW50ICovXG5pZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpXG4gIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQ2hlc3NcbiAgfSlcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5yYW5rcyA9IGV4cG9ydHMuZmlsZXMgPSBleHBvcnRzLmNvbG9ycyA9IHZvaWQgMDtcbmV4cG9ydHMuY29sb3JzID0gWyd3aGl0ZScsICdibGFjayddO1xuZXhwb3J0cy5maWxlcyA9IFsnYScsICdiJywgJ2MnLCAnZCcsICdlJywgJ2YnLCAnZycsICdoJ107XG5leHBvcnRzLnJhbmtzID0gWycxJywgJzInLCAnMycsICc0JywgJzUnLCAnNicsICc3JywgJzgnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXR5cGVzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jb21wdXRlU3F1YXJlQ2VudGVyID0gZXhwb3J0cy5jcmVhdGVFbCA9IGV4cG9ydHMuaXNSaWdodEJ1dHRvbiA9IGV4cG9ydHMuZXZlbnRQb3NpdGlvbiA9IGV4cG9ydHMuc2V0VmlzaWJsZSA9IGV4cG9ydHMudHJhbnNsYXRlUmVsID0gZXhwb3J0cy50cmFuc2xhdGVBYnMgPSBleHBvcnRzLnBvc1RvVHJhbnNsYXRlUmVsID0gZXhwb3J0cy5wb3NUb1RyYW5zbGF0ZUFicyA9IGV4cG9ydHMuc2FtZVBpZWNlID0gZXhwb3J0cy5kaXN0YW5jZVNxID0gZXhwb3J0cy5vcHBvc2l0ZSA9IGV4cG9ydHMudGltZXIgPSBleHBvcnRzLm1lbW8gPSBleHBvcnRzLmFsbFBvcyA9IGV4cG9ydHMua2V5MnBvcyA9IGV4cG9ydHMucG9zMmtleSA9IGV4cG9ydHMuYWxsS2V5cyA9IGV4cG9ydHMuaW52UmFua3MgPSB2b2lkIDA7XG5jb25zdCBjZyA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xuZXhwb3J0cy5pbnZSYW5rcyA9IFsuLi5jZy5yYW5rc10ucmV2ZXJzZSgpO1xuZXhwb3J0cy5hbGxLZXlzID0gQXJyYXkucHJvdG90eXBlLmNvbmNhdCguLi5jZy5maWxlcy5tYXAoYyA9PiBjZy5yYW5rcy5tYXAociA9PiBjICsgcikpKTtcbmNvbnN0IHBvczJrZXkgPSAocG9zKSA9PiBleHBvcnRzLmFsbEtleXNbOCAqIHBvc1swXSArIHBvc1sxXV07XG5leHBvcnRzLnBvczJrZXkgPSBwb3Mya2V5O1xuY29uc3Qga2V5MnBvcyA9IChrKSA9PiBbay5jaGFyQ29kZUF0KDApIC0gOTcsIGsuY2hhckNvZGVBdCgxKSAtIDQ5XTtcbmV4cG9ydHMua2V5MnBvcyA9IGtleTJwb3M7XG5leHBvcnRzLmFsbFBvcyA9IGV4cG9ydHMuYWxsS2V5cy5tYXAoZXhwb3J0cy5rZXkycG9zKTtcbmZ1bmN0aW9uIG1lbW8oZikge1xuICAgIGxldCB2O1xuICAgIGNvbnN0IHJldCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHYgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHYgPSBmKCk7XG4gICAgICAgIHJldHVybiB2O1xuICAgIH07XG4gICAgcmV0LmNsZWFyID0gKCkgPT4ge1xuICAgICAgICB2ID0gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgcmV0dXJuIHJldDtcbn1cbmV4cG9ydHMubWVtbyA9IG1lbW87XG5jb25zdCB0aW1lciA9ICgpID0+IHtcbiAgICBsZXQgc3RhcnRBdDtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydCgpIHtcbiAgICAgICAgICAgIHN0YXJ0QXQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FuY2VsKCkge1xuICAgICAgICAgICAgc3RhcnRBdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSxcbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGlmICghc3RhcnRBdClcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0QXQ7XG4gICAgICAgICAgICBzdGFydEF0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmV0dXJuIHRpbWU7XG4gICAgICAgIH0sXG4gICAgfTtcbn07XG5leHBvcnRzLnRpbWVyID0gdGltZXI7XG5jb25zdCBvcHBvc2l0ZSA9IChjKSA9PiAoYyA9PT0gJ3doaXRlJyA/ICdibGFjaycgOiAnd2hpdGUnKTtcbmV4cG9ydHMub3Bwb3NpdGUgPSBvcHBvc2l0ZTtcbmNvbnN0IGRpc3RhbmNlU3EgPSAocG9zMSwgcG9zMikgPT4ge1xuICAgIGNvbnN0IGR4ID0gcG9zMVswXSAtIHBvczJbMF0sIGR5ID0gcG9zMVsxXSAtIHBvczJbMV07XG4gICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5O1xufTtcbmV4cG9ydHMuZGlzdGFuY2VTcSA9IGRpc3RhbmNlU3E7XG5jb25zdCBzYW1lUGllY2UgPSAocDEsIHAyKSA9PiBwMS5yb2xlID09PSBwMi5yb2xlICYmIHAxLmNvbG9yID09PSBwMi5jb2xvcjtcbmV4cG9ydHMuc2FtZVBpZWNlID0gc2FtZVBpZWNlO1xuY29uc3QgcG9zVG9UcmFuc2xhdGVCYXNlID0gKHBvcywgYXNXaGl0ZSwgeEZhY3RvciwgeUZhY3RvcikgPT4gW1xuICAgIChhc1doaXRlID8gcG9zWzBdIDogNyAtIHBvc1swXSkgKiB4RmFjdG9yLFxuICAgIChhc1doaXRlID8gNyAtIHBvc1sxXSA6IHBvc1sxXSkgKiB5RmFjdG9yLFxuXTtcbmNvbnN0IHBvc1RvVHJhbnNsYXRlQWJzID0gKGJvdW5kcykgPT4ge1xuICAgIGNvbnN0IHhGYWN0b3IgPSBib3VuZHMud2lkdGggLyA4LCB5RmFjdG9yID0gYm91bmRzLmhlaWdodCAvIDg7XG4gICAgcmV0dXJuIChwb3MsIGFzV2hpdGUpID0+IHBvc1RvVHJhbnNsYXRlQmFzZShwb3MsIGFzV2hpdGUsIHhGYWN0b3IsIHlGYWN0b3IpO1xufTtcbmV4cG9ydHMucG9zVG9UcmFuc2xhdGVBYnMgPSBwb3NUb1RyYW5zbGF0ZUFicztcbmNvbnN0IHBvc1RvVHJhbnNsYXRlUmVsID0gKHBvcywgYXNXaGl0ZSkgPT4gcG9zVG9UcmFuc2xhdGVCYXNlKHBvcywgYXNXaGl0ZSwgMTAwLCAxMDApO1xuZXhwb3J0cy5wb3NUb1RyYW5zbGF0ZVJlbCA9IHBvc1RvVHJhbnNsYXRlUmVsO1xuY29uc3QgdHJhbnNsYXRlQWJzID0gKGVsLCBwb3MpID0+IHtcbiAgICBlbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7cG9zWzBdfXB4LCR7cG9zWzFdfXB4KWA7XG59O1xuZXhwb3J0cy50cmFuc2xhdGVBYnMgPSB0cmFuc2xhdGVBYnM7XG5jb25zdCB0cmFuc2xhdGVSZWwgPSAoZWwsIHBlcmNlbnRzKSA9PiB7XG4gICAgZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3BlcmNlbnRzWzBdfSUsJHtwZXJjZW50c1sxXX0lKWA7XG59O1xuZXhwb3J0cy50cmFuc2xhdGVSZWwgPSB0cmFuc2xhdGVSZWw7XG5jb25zdCBzZXRWaXNpYmxlID0gKGVsLCB2KSA9PiB7XG4gICAgZWwuc3R5bGUudmlzaWJpbGl0eSA9IHYgPyAndmlzaWJsZScgOiAnaGlkZGVuJztcbn07XG5leHBvcnRzLnNldFZpc2libGUgPSBzZXRWaXNpYmxlO1xuY29uc3QgZXZlbnRQb3NpdGlvbiA9IChlKSA9PiB7XG4gICAgdmFyIF9hO1xuICAgIGlmIChlLmNsaWVudFggfHwgZS5jbGllbnRYID09PSAwKVxuICAgICAgICByZXR1cm4gW2UuY2xpZW50WCwgZS5jbGllbnRZXTtcbiAgICBpZiAoKF9hID0gZS50YXJnZXRUb3VjaGVzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbMF0pXG4gICAgICAgIHJldHVybiBbZS50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFgsIGUudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRZXTtcbiAgICByZXR1cm47XG59O1xuZXhwb3J0cy5ldmVudFBvc2l0aW9uID0gZXZlbnRQb3NpdGlvbjtcbmNvbnN0IGlzUmlnaHRCdXR0b24gPSAoZSkgPT4gZS5idXR0b25zID09PSAyIHx8IGUuYnV0dG9uID09PSAyO1xuZXhwb3J0cy5pc1JpZ2h0QnV0dG9uID0gaXNSaWdodEJ1dHRvbjtcbmNvbnN0IGNyZWF0ZUVsID0gKHRhZ05hbWUsIGNsYXNzTmFtZSkgPT4ge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbiAgICBpZiAoY2xhc3NOYW1lKVxuICAgICAgICBlbC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgcmV0dXJuIGVsO1xufTtcbmV4cG9ydHMuY3JlYXRlRWwgPSBjcmVhdGVFbDtcbmZ1bmN0aW9uIGNvbXB1dGVTcXVhcmVDZW50ZXIoa2V5LCBhc1doaXRlLCBib3VuZHMpIHtcbiAgICBjb25zdCBwb3MgPSBleHBvcnRzLmtleTJwb3Moa2V5KTtcbiAgICBpZiAoIWFzV2hpdGUpIHtcbiAgICAgICAgcG9zWzBdID0gNyAtIHBvc1swXTtcbiAgICAgICAgcG9zWzFdID0gNyAtIHBvc1sxXTtcbiAgICB9XG4gICAgcmV0dXJuIFtcbiAgICAgICAgYm91bmRzLmxlZnQgKyAoYm91bmRzLndpZHRoICogcG9zWzBdKSAvIDggKyBib3VuZHMud2lkdGggLyAxNixcbiAgICAgICAgYm91bmRzLnRvcCArIChib3VuZHMuaGVpZ2h0ICogKDcgLSBwb3NbMV0pKSAvIDggKyBib3VuZHMuaGVpZ2h0IC8gMTYsXG4gICAgXTtcbn1cbmV4cG9ydHMuY29tcHV0ZVNxdWFyZUNlbnRlciA9IGNvbXB1dGVTcXVhcmVDZW50ZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wcmVtb3ZlID0gZXhwb3J0cy5xdWVlbiA9IGV4cG9ydHMua25pZ2h0ID0gdm9pZCAwO1xuY29uc3QgdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5mdW5jdGlvbiBkaWZmKGEsIGIpIHtcbiAgICByZXR1cm4gTWF0aC5hYnMoYSAtIGIpO1xufVxuZnVuY3Rpb24gcGF3bihjb2xvcikge1xuICAgIHJldHVybiAoeDEsIHkxLCB4MiwgeTIpID0+IGRpZmYoeDEsIHgyKSA8IDIgJiZcbiAgICAgICAgKGNvbG9yID09PSAnd2hpdGUnXG4gICAgICAgICAgICA/XG4gICAgICAgICAgICAgICAgeTIgPT09IHkxICsgMSB8fCAoeTEgPD0gMSAmJiB5MiA9PT0geTEgKyAyICYmIHgxID09PSB4MilcbiAgICAgICAgICAgIDogeTIgPT09IHkxIC0gMSB8fCAoeTEgPj0gNiAmJiB5MiA9PT0geTEgLSAyICYmIHgxID09PSB4MikpO1xufVxuY29uc3Qga25pZ2h0ID0gKHgxLCB5MSwgeDIsIHkyKSA9PiB7XG4gICAgY29uc3QgeGQgPSBkaWZmKHgxLCB4Mik7XG4gICAgY29uc3QgeWQgPSBkaWZmKHkxLCB5Mik7XG4gICAgcmV0dXJuICh4ZCA9PT0gMSAmJiB5ZCA9PT0gMikgfHwgKHhkID09PSAyICYmIHlkID09PSAxKTtcbn07XG5leHBvcnRzLmtuaWdodCA9IGtuaWdodDtcbmNvbnN0IGJpc2hvcCA9ICh4MSwgeTEsIHgyLCB5MikgPT4ge1xuICAgIHJldHVybiBkaWZmKHgxLCB4MikgPT09IGRpZmYoeTEsIHkyKTtcbn07XG5jb25zdCByb29rID0gKHgxLCB5MSwgeDIsIHkyKSA9PiB7XG4gICAgcmV0dXJuIHgxID09PSB4MiB8fCB5MSA9PT0geTI7XG59O1xuY29uc3QgcXVlZW4gPSAoeDEsIHkxLCB4MiwgeTIpID0+IHtcbiAgICByZXR1cm4gYmlzaG9wKHgxLCB5MSwgeDIsIHkyKSB8fCByb29rKHgxLCB5MSwgeDIsIHkyKTtcbn07XG5leHBvcnRzLnF1ZWVuID0gcXVlZW47XG5mdW5jdGlvbiBraW5nKGNvbG9yLCByb29rRmlsZXMsIGNhbkNhc3RsZSkge1xuICAgIHJldHVybiAoeDEsIHkxLCB4MiwgeTIpID0+IChkaWZmKHgxLCB4MikgPCAyICYmIGRpZmYoeTEsIHkyKSA8IDIpIHx8XG4gICAgICAgIChjYW5DYXN0bGUgJiZcbiAgICAgICAgICAgIHkxID09PSB5MiAmJlxuICAgICAgICAgICAgeTEgPT09IChjb2xvciA9PT0gJ3doaXRlJyA/IDAgOiA3KSAmJlxuICAgICAgICAgICAgKCh4MSA9PT0gNCAmJiAoKHgyID09PSAyICYmIHJvb2tGaWxlcy5pbmNsdWRlcygwKSkgfHwgKHgyID09PSA2ICYmIHJvb2tGaWxlcy5pbmNsdWRlcyg3KSkpKSB8fFxuICAgICAgICAgICAgICAgIHJvb2tGaWxlcy5pbmNsdWRlcyh4MikpKTtcbn1cbmZ1bmN0aW9uIHJvb2tGaWxlc09mKHBpZWNlcywgY29sb3IpIHtcbiAgICBjb25zdCBiYWNrcmFuayA9IGNvbG9yID09PSAnd2hpdGUnID8gJzEnIDogJzgnO1xuICAgIGNvbnN0IGZpbGVzID0gW107XG4gICAgZm9yIChjb25zdCBba2V5LCBwaWVjZV0gb2YgcGllY2VzKSB7XG4gICAgICAgIGlmIChrZXlbMV0gPT09IGJhY2tyYW5rICYmIHBpZWNlLmNvbG9yID09PSBjb2xvciAmJiBwaWVjZS5yb2xlID09PSAncm9vaycpIHtcbiAgICAgICAgICAgIGZpbGVzLnB1c2godXRpbC5rZXkycG9zKGtleSlbMF0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaWxlcztcbn1cbmZ1bmN0aW9uIHByZW1vdmUocGllY2VzLCBrZXksIGNhbkNhc3RsZSkge1xuICAgIGNvbnN0IHBpZWNlID0gcGllY2VzLmdldChrZXkpO1xuICAgIGlmICghcGllY2UpXG4gICAgICAgIHJldHVybiBbXTtcbiAgICBjb25zdCBwb3MgPSB1dGlsLmtleTJwb3Moa2V5KSwgciA9IHBpZWNlLnJvbGUsIG1vYmlsaXR5ID0gciA9PT0gJ3Bhd24nXG4gICAgICAgID8gcGF3bihwaWVjZS5jb2xvcilcbiAgICAgICAgOiByID09PSAna25pZ2h0J1xuICAgICAgICAgICAgPyBleHBvcnRzLmtuaWdodFxuICAgICAgICAgICAgOiByID09PSAnYmlzaG9wJ1xuICAgICAgICAgICAgICAgID8gYmlzaG9wXG4gICAgICAgICAgICAgICAgOiByID09PSAncm9vaydcbiAgICAgICAgICAgICAgICAgICAgPyByb29rXG4gICAgICAgICAgICAgICAgICAgIDogciA9PT0gJ3F1ZWVuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgPyBleHBvcnRzLnF1ZWVuXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGtpbmcocGllY2UuY29sb3IsIHJvb2tGaWxlc09mKHBpZWNlcywgcGllY2UuY29sb3IpLCBjYW5DYXN0bGUpO1xuICAgIHJldHVybiB1dGlsLmFsbFBvc1xuICAgICAgICAuZmlsdGVyKHBvczIgPT4gKHBvc1swXSAhPT0gcG9zMlswXSB8fCBwb3NbMV0gIT09IHBvczJbMV0pICYmIG1vYmlsaXR5KHBvc1swXSwgcG9zWzFdLCBwb3MyWzBdLCBwb3MyWzFdKSlcbiAgICAgICAgLm1hcCh1dGlsLnBvczJrZXkpO1xufVxuZXhwb3J0cy5wcmVtb3ZlID0gcHJlbW92ZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZW1vdmUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLndoaXRlUG92ID0gZXhwb3J0cy5nZXRTbmFwcGVkS2V5QXREb21Qb3MgPSBleHBvcnRzLmdldEtleUF0RG9tUG9zID0gZXhwb3J0cy5zdG9wID0gZXhwb3J0cy5jYW5jZWxNb3ZlID0gZXhwb3J0cy5wbGF5UHJlZHJvcCA9IGV4cG9ydHMucGxheVByZW1vdmUgPSBleHBvcnRzLmlzRHJhZ2dhYmxlID0gZXhwb3J0cy5jYW5Nb3ZlID0gZXhwb3J0cy51bnNlbGVjdCA9IGV4cG9ydHMuc2V0U2VsZWN0ZWQgPSBleHBvcnRzLnNlbGVjdFNxdWFyZSA9IGV4cG9ydHMuZHJvcE5ld1BpZWNlID0gZXhwb3J0cy51c2VyTW92ZSA9IGV4cG9ydHMuYmFzZU5ld1BpZWNlID0gZXhwb3J0cy5iYXNlTW92ZSA9IGV4cG9ydHMudW5zZXRQcmVkcm9wID0gZXhwb3J0cy51bnNldFByZW1vdmUgPSBleHBvcnRzLnNldENoZWNrID0gZXhwb3J0cy5zZXRQaWVjZXMgPSBleHBvcnRzLnJlc2V0ID0gZXhwb3J0cy50b2dnbGVPcmllbnRhdGlvbiA9IGV4cG9ydHMuY2FsbFVzZXJGdW5jdGlvbiA9IHZvaWQgMDtcbmNvbnN0IHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5jb25zdCBwcmVtb3ZlXzEgPSByZXF1aXJlKFwiLi9wcmVtb3ZlXCIpO1xuZnVuY3Rpb24gY2FsbFVzZXJGdW5jdGlvbihmLCAuLi5hcmdzKSB7XG4gICAgaWYgKGYpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZiguLi5hcmdzKSwgMSk7XG59XG5leHBvcnRzLmNhbGxVc2VyRnVuY3Rpb24gPSBjYWxsVXNlckZ1bmN0aW9uO1xuZnVuY3Rpb24gdG9nZ2xlT3JpZW50YXRpb24oc3RhdGUpIHtcbiAgICBzdGF0ZS5vcmllbnRhdGlvbiA9IHV0aWxfMS5vcHBvc2l0ZShzdGF0ZS5vcmllbnRhdGlvbik7XG4gICAgc3RhdGUuYW5pbWF0aW9uLmN1cnJlbnQgPSBzdGF0ZS5kcmFnZ2FibGUuY3VycmVudCA9IHN0YXRlLnNlbGVjdGVkID0gdW5kZWZpbmVkO1xufVxuZXhwb3J0cy50b2dnbGVPcmllbnRhdGlvbiA9IHRvZ2dsZU9yaWVudGF0aW9uO1xuZnVuY3Rpb24gcmVzZXQoc3RhdGUpIHtcbiAgICBzdGF0ZS5sYXN0TW92ZSA9IHVuZGVmaW5lZDtcbiAgICB1bnNlbGVjdChzdGF0ZSk7XG4gICAgdW5zZXRQcmVtb3ZlKHN0YXRlKTtcbiAgICB1bnNldFByZWRyb3Aoc3RhdGUpO1xufVxuZXhwb3J0cy5yZXNldCA9IHJlc2V0O1xuZnVuY3Rpb24gc2V0UGllY2VzKHN0YXRlLCBwaWVjZXMpIHtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHBpZWNlXSBvZiBwaWVjZXMpIHtcbiAgICAgICAgaWYgKHBpZWNlKVxuICAgICAgICAgICAgc3RhdGUucGllY2VzLnNldChrZXksIHBpZWNlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdGUucGllY2VzLmRlbGV0ZShrZXkpO1xuICAgIH1cbn1cbmV4cG9ydHMuc2V0UGllY2VzID0gc2V0UGllY2VzO1xuZnVuY3Rpb24gc2V0Q2hlY2soc3RhdGUsIGNvbG9yKSB7XG4gICAgc3RhdGUuY2hlY2sgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGNvbG9yID09PSB0cnVlKVxuICAgICAgICBjb2xvciA9IHN0YXRlLnR1cm5Db2xvcjtcbiAgICBpZiAoY29sb3IpXG4gICAgICAgIGZvciAoY29uc3QgW2ssIHBdIG9mIHN0YXRlLnBpZWNlcykge1xuICAgICAgICAgICAgaWYgKHAucm9sZSA9PT0gJ2tpbmcnICYmIHAuY29sb3IgPT09IGNvbG9yKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuY2hlY2sgPSBrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG59XG5leHBvcnRzLnNldENoZWNrID0gc2V0Q2hlY2s7XG5mdW5jdGlvbiBzZXRQcmVtb3ZlKHN0YXRlLCBvcmlnLCBkZXN0LCBtZXRhKSB7XG4gICAgdW5zZXRQcmVkcm9wKHN0YXRlKTtcbiAgICBzdGF0ZS5wcmVtb3ZhYmxlLmN1cnJlbnQgPSBbb3JpZywgZGVzdF07XG4gICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5wcmVtb3ZhYmxlLmV2ZW50cy5zZXQsIG9yaWcsIGRlc3QsIG1ldGEpO1xufVxuZnVuY3Rpb24gdW5zZXRQcmVtb3ZlKHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlLnByZW1vdmFibGUuY3VycmVudCkge1xuICAgICAgICBzdGF0ZS5wcmVtb3ZhYmxlLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGNhbGxVc2VyRnVuY3Rpb24oc3RhdGUucHJlbW92YWJsZS5ldmVudHMudW5zZXQpO1xuICAgIH1cbn1cbmV4cG9ydHMudW5zZXRQcmVtb3ZlID0gdW5zZXRQcmVtb3ZlO1xuZnVuY3Rpb24gc2V0UHJlZHJvcChzdGF0ZSwgcm9sZSwga2V5KSB7XG4gICAgdW5zZXRQcmVtb3ZlKHN0YXRlKTtcbiAgICBzdGF0ZS5wcmVkcm9wcGFibGUuY3VycmVudCA9IHsgcm9sZSwga2V5IH07XG4gICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5wcmVkcm9wcGFibGUuZXZlbnRzLnNldCwgcm9sZSwga2V5KTtcbn1cbmZ1bmN0aW9uIHVuc2V0UHJlZHJvcChzdGF0ZSkge1xuICAgIGNvbnN0IHBkID0gc3RhdGUucHJlZHJvcHBhYmxlO1xuICAgIGlmIChwZC5jdXJyZW50KSB7XG4gICAgICAgIHBkLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGNhbGxVc2VyRnVuY3Rpb24ocGQuZXZlbnRzLnVuc2V0KTtcbiAgICB9XG59XG5leHBvcnRzLnVuc2V0UHJlZHJvcCA9IHVuc2V0UHJlZHJvcDtcbmZ1bmN0aW9uIHRyeUF1dG9DYXN0bGUoc3RhdGUsIG9yaWcsIGRlc3QpIHtcbiAgICBpZiAoIXN0YXRlLmF1dG9DYXN0bGUpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBraW5nID0gc3RhdGUucGllY2VzLmdldChvcmlnKTtcbiAgICBpZiAoIWtpbmcgfHwga2luZy5yb2xlICE9PSAna2luZycpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBvcmlnUG9zID0gdXRpbF8xLmtleTJwb3Mob3JpZyk7XG4gICAgY29uc3QgZGVzdFBvcyA9IHV0aWxfMS5rZXkycG9zKGRlc3QpO1xuICAgIGlmICgob3JpZ1Bvc1sxXSAhPT0gMCAmJiBvcmlnUG9zWzFdICE9PSA3KSB8fCBvcmlnUG9zWzFdICE9PSBkZXN0UG9zWzFdKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKG9yaWdQb3NbMF0gPT09IDQgJiYgIXN0YXRlLnBpZWNlcy5oYXMoZGVzdCkpIHtcbiAgICAgICAgaWYgKGRlc3RQb3NbMF0gPT09IDYpXG4gICAgICAgICAgICBkZXN0ID0gdXRpbF8xLnBvczJrZXkoWzcsIGRlc3RQb3NbMV1dKTtcbiAgICAgICAgZWxzZSBpZiAoZGVzdFBvc1swXSA9PT0gMilcbiAgICAgICAgICAgIGRlc3QgPSB1dGlsXzEucG9zMmtleShbMCwgZGVzdFBvc1sxXV0pO1xuICAgIH1cbiAgICBjb25zdCByb29rID0gc3RhdGUucGllY2VzLmdldChkZXN0KTtcbiAgICBpZiAoIXJvb2sgfHwgcm9vay5jb2xvciAhPT0ga2luZy5jb2xvciB8fCByb29rLnJvbGUgIT09ICdyb29rJylcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIHN0YXRlLnBpZWNlcy5kZWxldGUob3JpZyk7XG4gICAgc3RhdGUucGllY2VzLmRlbGV0ZShkZXN0KTtcbiAgICBpZiAob3JpZ1Bvc1swXSA8IGRlc3RQb3NbMF0pIHtcbiAgICAgICAgc3RhdGUucGllY2VzLnNldCh1dGlsXzEucG9zMmtleShbNiwgZGVzdFBvc1sxXV0pLCBraW5nKTtcbiAgICAgICAgc3RhdGUucGllY2VzLnNldCh1dGlsXzEucG9zMmtleShbNSwgZGVzdFBvc1sxXV0pLCByb29rKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN0YXRlLnBpZWNlcy5zZXQodXRpbF8xLnBvczJrZXkoWzIsIGRlc3RQb3NbMV1dKSwga2luZyk7XG4gICAgICAgIHN0YXRlLnBpZWNlcy5zZXQodXRpbF8xLnBvczJrZXkoWzMsIGRlc3RQb3NbMV1dKSwgcm9vayk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gYmFzZU1vdmUoc3RhdGUsIG9yaWcsIGRlc3QpIHtcbiAgICBjb25zdCBvcmlnUGllY2UgPSBzdGF0ZS5waWVjZXMuZ2V0KG9yaWcpLCBkZXN0UGllY2UgPSBzdGF0ZS5waWVjZXMuZ2V0KGRlc3QpO1xuICAgIGlmIChvcmlnID09PSBkZXN0IHx8ICFvcmlnUGllY2UpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBjYXB0dXJlZCA9IGRlc3RQaWVjZSAmJiBkZXN0UGllY2UuY29sb3IgIT09IG9yaWdQaWVjZS5jb2xvciA/IGRlc3RQaWVjZSA6IHVuZGVmaW5lZDtcbiAgICBpZiAoZGVzdCA9PT0gc3RhdGUuc2VsZWN0ZWQpXG4gICAgICAgIHVuc2VsZWN0KHN0YXRlKTtcbiAgICBjYWxsVXNlckZ1bmN0aW9uKHN0YXRlLmV2ZW50cy5tb3ZlLCBvcmlnLCBkZXN0LCBjYXB0dXJlZCk7XG4gICAgaWYgKCF0cnlBdXRvQ2FzdGxlKHN0YXRlLCBvcmlnLCBkZXN0KSkge1xuICAgICAgICBzdGF0ZS5waWVjZXMuc2V0KGRlc3QsIG9yaWdQaWVjZSk7XG4gICAgICAgIHN0YXRlLnBpZWNlcy5kZWxldGUob3JpZyk7XG4gICAgfVxuICAgIHN0YXRlLmxhc3RNb3ZlID0gW29yaWcsIGRlc3RdO1xuICAgIHN0YXRlLmNoZWNrID0gdW5kZWZpbmVkO1xuICAgIGNhbGxVc2VyRnVuY3Rpb24oc3RhdGUuZXZlbnRzLmNoYW5nZSk7XG4gICAgcmV0dXJuIGNhcHR1cmVkIHx8IHRydWU7XG59XG5leHBvcnRzLmJhc2VNb3ZlID0gYmFzZU1vdmU7XG5mdW5jdGlvbiBiYXNlTmV3UGllY2Uoc3RhdGUsIHBpZWNlLCBrZXksIGZvcmNlKSB7XG4gICAgaWYgKHN0YXRlLnBpZWNlcy5oYXMoa2V5KSkge1xuICAgICAgICBpZiAoZm9yY2UpXG4gICAgICAgICAgICBzdGF0ZS5waWVjZXMuZGVsZXRlKGtleSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5ldmVudHMuZHJvcE5ld1BpZWNlLCBwaWVjZSwga2V5KTtcbiAgICBzdGF0ZS5waWVjZXMuc2V0KGtleSwgcGllY2UpO1xuICAgIHN0YXRlLmxhc3RNb3ZlID0gW2tleV07XG4gICAgc3RhdGUuY2hlY2sgPSB1bmRlZmluZWQ7XG4gICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5ldmVudHMuY2hhbmdlKTtcbiAgICBzdGF0ZS5tb3ZhYmxlLmRlc3RzID0gdW5kZWZpbmVkO1xuICAgIHN0YXRlLnR1cm5Db2xvciA9IHV0aWxfMS5vcHBvc2l0ZShzdGF0ZS50dXJuQ29sb3IpO1xuICAgIHJldHVybiB0cnVlO1xufVxuZXhwb3J0cy5iYXNlTmV3UGllY2UgPSBiYXNlTmV3UGllY2U7XG5mdW5jdGlvbiBiYXNlVXNlck1vdmUoc3RhdGUsIG9yaWcsIGRlc3QpIHtcbiAgICBjb25zdCByZXN1bHQgPSBiYXNlTW92ZShzdGF0ZSwgb3JpZywgZGVzdCk7XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBzdGF0ZS5tb3ZhYmxlLmRlc3RzID0gdW5kZWZpbmVkO1xuICAgICAgICBzdGF0ZS50dXJuQ29sb3IgPSB1dGlsXzEub3Bwb3NpdGUoc3RhdGUudHVybkNvbG9yKTtcbiAgICAgICAgc3RhdGUuYW5pbWF0aW9uLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiB1c2VyTW92ZShzdGF0ZSwgb3JpZywgZGVzdCkge1xuICAgIGlmIChjYW5Nb3ZlKHN0YXRlLCBvcmlnLCBkZXN0KSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBiYXNlVXNlck1vdmUoc3RhdGUsIG9yaWcsIGRlc3QpO1xuICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICBjb25zdCBob2xkVGltZSA9IHN0YXRlLmhvbGQuc3RvcCgpO1xuICAgICAgICAgICAgdW5zZWxlY3Qoc3RhdGUpO1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcHJlbW92ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgY3RybEtleTogc3RhdGUuc3RhdHMuY3RybEtleSxcbiAgICAgICAgICAgICAgICBob2xkVGltZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKVxuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmNhcHR1cmVkID0gcmVzdWx0O1xuICAgICAgICAgICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5tb3ZhYmxlLmV2ZW50cy5hZnRlciwgb3JpZywgZGVzdCwgbWV0YWRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoY2FuUHJlbW92ZShzdGF0ZSwgb3JpZywgZGVzdCkpIHtcbiAgICAgICAgc2V0UHJlbW92ZShzdGF0ZSwgb3JpZywgZGVzdCwge1xuICAgICAgICAgICAgY3RybEtleTogc3RhdGUuc3RhdHMuY3RybEtleSxcbiAgICAgICAgfSk7XG4gICAgICAgIHVuc2VsZWN0KHN0YXRlKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHVuc2VsZWN0KHN0YXRlKTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnRzLnVzZXJNb3ZlID0gdXNlck1vdmU7XG5mdW5jdGlvbiBkcm9wTmV3UGllY2Uoc3RhdGUsIG9yaWcsIGRlc3QsIGZvcmNlKSB7XG4gICAgY29uc3QgcGllY2UgPSBzdGF0ZS5waWVjZXMuZ2V0KG9yaWcpO1xuICAgIGlmIChwaWVjZSAmJiAoY2FuRHJvcChzdGF0ZSwgb3JpZywgZGVzdCkgfHwgZm9yY2UpKSB7XG4gICAgICAgIHN0YXRlLnBpZWNlcy5kZWxldGUob3JpZyk7XG4gICAgICAgIGJhc2VOZXdQaWVjZShzdGF0ZSwgcGllY2UsIGRlc3QsIGZvcmNlKTtcbiAgICAgICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5tb3ZhYmxlLmV2ZW50cy5hZnRlck5ld1BpZWNlLCBwaWVjZS5yb2xlLCBkZXN0LCB7XG4gICAgICAgICAgICBwcmVtb3ZlOiBmYWxzZSxcbiAgICAgICAgICAgIHByZWRyb3A6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAocGllY2UgJiYgY2FuUHJlZHJvcChzdGF0ZSwgb3JpZywgZGVzdCkpIHtcbiAgICAgICAgc2V0UHJlZHJvcChzdGF0ZSwgcGllY2Uucm9sZSwgZGVzdCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB1bnNldFByZW1vdmUoc3RhdGUpO1xuICAgICAgICB1bnNldFByZWRyb3Aoc3RhdGUpO1xuICAgIH1cbiAgICBzdGF0ZS5waWVjZXMuZGVsZXRlKG9yaWcpO1xuICAgIHVuc2VsZWN0KHN0YXRlKTtcbn1cbmV4cG9ydHMuZHJvcE5ld1BpZWNlID0gZHJvcE5ld1BpZWNlO1xuZnVuY3Rpb24gc2VsZWN0U3F1YXJlKHN0YXRlLCBrZXksIGZvcmNlKSB7XG4gICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5ldmVudHMuc2VsZWN0LCBrZXkpO1xuICAgIGlmIChzdGF0ZS5zZWxlY3RlZCkge1xuICAgICAgICBpZiAoc3RhdGUuc2VsZWN0ZWQgPT09IGtleSAmJiAhc3RhdGUuZHJhZ2dhYmxlLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIHVuc2VsZWN0KHN0YXRlKTtcbiAgICAgICAgICAgIHN0YXRlLmhvbGQuY2FuY2VsKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKHN0YXRlLnNlbGVjdGFibGUuZW5hYmxlZCB8fCBmb3JjZSkgJiYgc3RhdGUuc2VsZWN0ZWQgIT09IGtleSkge1xuICAgICAgICAgICAgaWYgKHVzZXJNb3ZlKHN0YXRlLCBzdGF0ZS5zZWxlY3RlZCwga2V5KSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLnN0YXRzLmRyYWdnZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzTW92YWJsZShzdGF0ZSwga2V5KSB8fCBpc1ByZW1vdmFibGUoc3RhdGUsIGtleSkpIHtcbiAgICAgICAgc2V0U2VsZWN0ZWQoc3RhdGUsIGtleSk7XG4gICAgICAgIHN0YXRlLmhvbGQuc3RhcnQoKTtcbiAgICB9XG59XG5leHBvcnRzLnNlbGVjdFNxdWFyZSA9IHNlbGVjdFNxdWFyZTtcbmZ1bmN0aW9uIHNldFNlbGVjdGVkKHN0YXRlLCBrZXkpIHtcbiAgICBzdGF0ZS5zZWxlY3RlZCA9IGtleTtcbiAgICBpZiAoaXNQcmVtb3ZhYmxlKHN0YXRlLCBrZXkpKSB7XG4gICAgICAgIHN0YXRlLnByZW1vdmFibGUuZGVzdHMgPSBwcmVtb3ZlXzEucHJlbW92ZShzdGF0ZS5waWVjZXMsIGtleSwgc3RhdGUucHJlbW92YWJsZS5jYXN0bGUpO1xuICAgIH1cbiAgICBlbHNlXG4gICAgICAgIHN0YXRlLnByZW1vdmFibGUuZGVzdHMgPSB1bmRlZmluZWQ7XG59XG5leHBvcnRzLnNldFNlbGVjdGVkID0gc2V0U2VsZWN0ZWQ7XG5mdW5jdGlvbiB1bnNlbGVjdChzdGF0ZSkge1xuICAgIHN0YXRlLnNlbGVjdGVkID0gdW5kZWZpbmVkO1xuICAgIHN0YXRlLnByZW1vdmFibGUuZGVzdHMgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGUuaG9sZC5jYW5jZWwoKTtcbn1cbmV4cG9ydHMudW5zZWxlY3QgPSB1bnNlbGVjdDtcbmZ1bmN0aW9uIGlzTW92YWJsZShzdGF0ZSwgb3JpZykge1xuICAgIGNvbnN0IHBpZWNlID0gc3RhdGUucGllY2VzLmdldChvcmlnKTtcbiAgICByZXR1cm4gKCEhcGllY2UgJiZcbiAgICAgICAgKHN0YXRlLm1vdmFibGUuY29sb3IgPT09ICdib3RoJyB8fCAoc3RhdGUubW92YWJsZS5jb2xvciA9PT0gcGllY2UuY29sb3IgJiYgc3RhdGUudHVybkNvbG9yID09PSBwaWVjZS5jb2xvcikpKTtcbn1cbmZ1bmN0aW9uIGNhbk1vdmUoc3RhdGUsIG9yaWcsIGRlc3QpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIHJldHVybiAob3JpZyAhPT0gZGVzdCAmJiBpc01vdmFibGUoc3RhdGUsIG9yaWcpICYmIChzdGF0ZS5tb3ZhYmxlLmZyZWUgfHwgISEoKF9iID0gKF9hID0gc3RhdGUubW92YWJsZS5kZXN0cykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldChvcmlnKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmluY2x1ZGVzKGRlc3QpKSkpO1xufVxuZXhwb3J0cy5jYW5Nb3ZlID0gY2FuTW92ZTtcbmZ1bmN0aW9uIGNhbkRyb3Aoc3RhdGUsIG9yaWcsIGRlc3QpIHtcbiAgICBjb25zdCBwaWVjZSA9IHN0YXRlLnBpZWNlcy5nZXQob3JpZyk7XG4gICAgcmV0dXJuICghIXBpZWNlICYmXG4gICAgICAgIChvcmlnID09PSBkZXN0IHx8ICFzdGF0ZS5waWVjZXMuaGFzKGRlc3QpKSAmJlxuICAgICAgICAoc3RhdGUubW92YWJsZS5jb2xvciA9PT0gJ2JvdGgnIHx8IChzdGF0ZS5tb3ZhYmxlLmNvbG9yID09PSBwaWVjZS5jb2xvciAmJiBzdGF0ZS50dXJuQ29sb3IgPT09IHBpZWNlLmNvbG9yKSkpO1xufVxuZnVuY3Rpb24gaXNQcmVtb3ZhYmxlKHN0YXRlLCBvcmlnKSB7XG4gICAgY29uc3QgcGllY2UgPSBzdGF0ZS5waWVjZXMuZ2V0KG9yaWcpO1xuICAgIHJldHVybiAhIXBpZWNlICYmIHN0YXRlLnByZW1vdmFibGUuZW5hYmxlZCAmJiBzdGF0ZS5tb3ZhYmxlLmNvbG9yID09PSBwaWVjZS5jb2xvciAmJiBzdGF0ZS50dXJuQ29sb3IgIT09IHBpZWNlLmNvbG9yO1xufVxuZnVuY3Rpb24gY2FuUHJlbW92ZShzdGF0ZSwgb3JpZywgZGVzdCkge1xuICAgIHJldHVybiAob3JpZyAhPT0gZGVzdCAmJiBpc1ByZW1vdmFibGUoc3RhdGUsIG9yaWcpICYmIHByZW1vdmVfMS5wcmVtb3ZlKHN0YXRlLnBpZWNlcywgb3JpZywgc3RhdGUucHJlbW92YWJsZS5jYXN0bGUpLmluY2x1ZGVzKGRlc3QpKTtcbn1cbmZ1bmN0aW9uIGNhblByZWRyb3Aoc3RhdGUsIG9yaWcsIGRlc3QpIHtcbiAgICBjb25zdCBwaWVjZSA9IHN0YXRlLnBpZWNlcy5nZXQob3JpZyk7XG4gICAgY29uc3QgZGVzdFBpZWNlID0gc3RhdGUucGllY2VzLmdldChkZXN0KTtcbiAgICByZXR1cm4gKCEhcGllY2UgJiZcbiAgICAgICAgKCFkZXN0UGllY2UgfHwgZGVzdFBpZWNlLmNvbG9yICE9PSBzdGF0ZS5tb3ZhYmxlLmNvbG9yKSAmJlxuICAgICAgICBzdGF0ZS5wcmVkcm9wcGFibGUuZW5hYmxlZCAmJlxuICAgICAgICAocGllY2Uucm9sZSAhPT0gJ3Bhd24nIHx8IChkZXN0WzFdICE9PSAnMScgJiYgZGVzdFsxXSAhPT0gJzgnKSkgJiZcbiAgICAgICAgc3RhdGUubW92YWJsZS5jb2xvciA9PT0gcGllY2UuY29sb3IgJiZcbiAgICAgICAgc3RhdGUudHVybkNvbG9yICE9PSBwaWVjZS5jb2xvcik7XG59XG5mdW5jdGlvbiBpc0RyYWdnYWJsZShzdGF0ZSwgb3JpZykge1xuICAgIGNvbnN0IHBpZWNlID0gc3RhdGUucGllY2VzLmdldChvcmlnKTtcbiAgICByZXR1cm4gKCEhcGllY2UgJiZcbiAgICAgICAgc3RhdGUuZHJhZ2dhYmxlLmVuYWJsZWQgJiZcbiAgICAgICAgKHN0YXRlLm1vdmFibGUuY29sb3IgPT09ICdib3RoJyB8fFxuICAgICAgICAgICAgKHN0YXRlLm1vdmFibGUuY29sb3IgPT09IHBpZWNlLmNvbG9yICYmIChzdGF0ZS50dXJuQ29sb3IgPT09IHBpZWNlLmNvbG9yIHx8IHN0YXRlLnByZW1vdmFibGUuZW5hYmxlZCkpKSk7XG59XG5leHBvcnRzLmlzRHJhZ2dhYmxlID0gaXNEcmFnZ2FibGU7XG5mdW5jdGlvbiBwbGF5UHJlbW92ZShzdGF0ZSkge1xuICAgIGNvbnN0IG1vdmUgPSBzdGF0ZS5wcmVtb3ZhYmxlLmN1cnJlbnQ7XG4gICAgaWYgKCFtb3ZlKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgY29uc3Qgb3JpZyA9IG1vdmVbMF0sIGRlc3QgPSBtb3ZlWzFdO1xuICAgIGxldCBzdWNjZXNzID0gZmFsc2U7XG4gICAgaWYgKGNhbk1vdmUoc3RhdGUsIG9yaWcsIGRlc3QpKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGJhc2VVc2VyTW92ZShzdGF0ZSwgb3JpZywgZGVzdCk7XG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0geyBwcmVtb3ZlOiB0cnVlIH07XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKVxuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmNhcHR1cmVkID0gcmVzdWx0O1xuICAgICAgICAgICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5tb3ZhYmxlLmV2ZW50cy5hZnRlciwgb3JpZywgZGVzdCwgbWV0YWRhdGEpO1xuICAgICAgICAgICAgc3VjY2VzcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdW5zZXRQcmVtb3ZlKHN0YXRlKTtcbiAgICByZXR1cm4gc3VjY2Vzcztcbn1cbmV4cG9ydHMucGxheVByZW1vdmUgPSBwbGF5UHJlbW92ZTtcbmZ1bmN0aW9uIHBsYXlQcmVkcm9wKHN0YXRlLCB2YWxpZGF0ZSkge1xuICAgIGNvbnN0IGRyb3AgPSBzdGF0ZS5wcmVkcm9wcGFibGUuY3VycmVudDtcbiAgICBsZXQgc3VjY2VzcyA9IGZhbHNlO1xuICAgIGlmICghZHJvcClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh2YWxpZGF0ZShkcm9wKSkge1xuICAgICAgICBjb25zdCBwaWVjZSA9IHtcbiAgICAgICAgICAgIHJvbGU6IGRyb3Aucm9sZSxcbiAgICAgICAgICAgIGNvbG9yOiBzdGF0ZS5tb3ZhYmxlLmNvbG9yLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoYmFzZU5ld1BpZWNlKHN0YXRlLCBwaWVjZSwgZHJvcC5rZXkpKSB7XG4gICAgICAgICAgICBjYWxsVXNlckZ1bmN0aW9uKHN0YXRlLm1vdmFibGUuZXZlbnRzLmFmdGVyTmV3UGllY2UsIGRyb3Aucm9sZSwgZHJvcC5rZXksIHtcbiAgICAgICAgICAgICAgICBwcmVtb3ZlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwcmVkcm9wOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB1bnNldFByZWRyb3Aoc3RhdGUpO1xuICAgIHJldHVybiBzdWNjZXNzO1xufVxuZXhwb3J0cy5wbGF5UHJlZHJvcCA9IHBsYXlQcmVkcm9wO1xuZnVuY3Rpb24gY2FuY2VsTW92ZShzdGF0ZSkge1xuICAgIHVuc2V0UHJlbW92ZShzdGF0ZSk7XG4gICAgdW5zZXRQcmVkcm9wKHN0YXRlKTtcbiAgICB1bnNlbGVjdChzdGF0ZSk7XG59XG5leHBvcnRzLmNhbmNlbE1vdmUgPSBjYW5jZWxNb3ZlO1xuZnVuY3Rpb24gc3RvcChzdGF0ZSkge1xuICAgIHN0YXRlLm1vdmFibGUuY29sb3IgPSBzdGF0ZS5tb3ZhYmxlLmRlc3RzID0gc3RhdGUuYW5pbWF0aW9uLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG4gICAgY2FuY2VsTW92ZShzdGF0ZSk7XG59XG5leHBvcnRzLnN0b3AgPSBzdG9wO1xuZnVuY3Rpb24gZ2V0S2V5QXREb21Qb3MocG9zLCBhc1doaXRlLCBib3VuZHMpIHtcbiAgICBsZXQgZmlsZSA9IE1hdGguZmxvb3IoKDggKiAocG9zWzBdIC0gYm91bmRzLmxlZnQpKSAvIGJvdW5kcy53aWR0aCk7XG4gICAgaWYgKCFhc1doaXRlKVxuICAgICAgICBmaWxlID0gNyAtIGZpbGU7XG4gICAgbGV0IHJhbmsgPSA3IC0gTWF0aC5mbG9vcigoOCAqIChwb3NbMV0gLSBib3VuZHMudG9wKSkgLyBib3VuZHMuaGVpZ2h0KTtcbiAgICBpZiAoIWFzV2hpdGUpXG4gICAgICAgIHJhbmsgPSA3IC0gcmFuaztcbiAgICByZXR1cm4gZmlsZSA+PSAwICYmIGZpbGUgPCA4ICYmIHJhbmsgPj0gMCAmJiByYW5rIDwgOCA/IHV0aWxfMS5wb3Mya2V5KFtmaWxlLCByYW5rXSkgOiB1bmRlZmluZWQ7XG59XG5leHBvcnRzLmdldEtleUF0RG9tUG9zID0gZ2V0S2V5QXREb21Qb3M7XG5mdW5jdGlvbiBnZXRTbmFwcGVkS2V5QXREb21Qb3Mob3JpZywgcG9zLCBhc1doaXRlLCBib3VuZHMpIHtcbiAgICBjb25zdCBvcmlnUG9zID0gdXRpbF8xLmtleTJwb3Mob3JpZyk7XG4gICAgY29uc3QgdmFsaWRTbmFwUG9zID0gdXRpbF8xLmFsbFBvcy5maWx0ZXIocG9zMiA9PiB7XG4gICAgICAgIHJldHVybiBwcmVtb3ZlXzEucXVlZW4ob3JpZ1Bvc1swXSwgb3JpZ1Bvc1sxXSwgcG9zMlswXSwgcG9zMlsxXSkgfHwgcHJlbW92ZV8xLmtuaWdodChvcmlnUG9zWzBdLCBvcmlnUG9zWzFdLCBwb3MyWzBdLCBwb3MyWzFdKTtcbiAgICB9KTtcbiAgICBjb25zdCB2YWxpZFNuYXBDZW50ZXJzID0gdmFsaWRTbmFwUG9zLm1hcChwb3MyID0+IHV0aWxfMS5jb21wdXRlU3F1YXJlQ2VudGVyKHV0aWxfMS5wb3Mya2V5KHBvczIpLCBhc1doaXRlLCBib3VuZHMpKTtcbiAgICBjb25zdCB2YWxpZFNuYXBEaXN0YW5jZXMgPSB2YWxpZFNuYXBDZW50ZXJzLm1hcChwb3MyID0+IHV0aWxfMS5kaXN0YW5jZVNxKHBvcywgcG9zMikpO1xuICAgIGNvbnN0IFssIGNsb3Nlc3RTbmFwSW5kZXhdID0gdmFsaWRTbmFwRGlzdGFuY2VzLnJlZHVjZSgoYSwgYiwgaW5kZXgpID0+IChhWzBdIDwgYiA/IGEgOiBbYiwgaW5kZXhdKSwgW1xuICAgICAgICB2YWxpZFNuYXBEaXN0YW5jZXNbMF0sXG4gICAgICAgIDAsXG4gICAgXSk7XG4gICAgcmV0dXJuIHV0aWxfMS5wb3Mya2V5KHZhbGlkU25hcFBvc1tjbG9zZXN0U25hcEluZGV4XSk7XG59XG5leHBvcnRzLmdldFNuYXBwZWRLZXlBdERvbVBvcyA9IGdldFNuYXBwZWRLZXlBdERvbVBvcztcbmZ1bmN0aW9uIHdoaXRlUG92KHMpIHtcbiAgICByZXR1cm4gcy5vcmllbnRhdGlvbiA9PT0gJ3doaXRlJztcbn1cbmV4cG9ydHMud2hpdGVQb3YgPSB3aGl0ZVBvdjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJvYXJkLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy53cml0ZSA9IGV4cG9ydHMucmVhZCA9IGV4cG9ydHMuaW5pdGlhbCA9IHZvaWQgMDtcbmNvbnN0IHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5jb25zdCBjZyA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xuZXhwb3J0cy5pbml0aWFsID0gJ3JuYnFrYm5yL3BwcHBwcHBwLzgvOC84LzgvUFBQUFBQUFAvUk5CUUtCTlInO1xuY29uc3Qgcm9sZXMgPSB7XG4gICAgcDogJ3Bhd24nLFxuICAgIHI6ICdyb29rJyxcbiAgICBuOiAna25pZ2h0JyxcbiAgICBiOiAnYmlzaG9wJyxcbiAgICBxOiAncXVlZW4nLFxuICAgIGs6ICdraW5nJyxcbn07XG5jb25zdCBsZXR0ZXJzID0ge1xuICAgIHBhd246ICdwJyxcbiAgICByb29rOiAncicsXG4gICAga25pZ2h0OiAnbicsXG4gICAgYmlzaG9wOiAnYicsXG4gICAgcXVlZW46ICdxJyxcbiAgICBraW5nOiAnaycsXG59O1xuZnVuY3Rpb24gcmVhZChmZW4pIHtcbiAgICBpZiAoZmVuID09PSAnc3RhcnQnKVxuICAgICAgICBmZW4gPSBleHBvcnRzLmluaXRpYWw7XG4gICAgY29uc3QgcGllY2VzID0gbmV3IE1hcCgpO1xuICAgIGxldCByb3cgPSA3LCBjb2wgPSAwO1xuICAgIGZvciAoY29uc3QgYyBvZiBmZW4pIHtcbiAgICAgICAgc3dpdGNoIChjKSB7XG4gICAgICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGllY2VzO1xuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgLS1yb3c7XG4gICAgICAgICAgICAgICAgaWYgKHJvdyA8IDApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwaWVjZXM7XG4gICAgICAgICAgICAgICAgY29sID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ34nOlxuICAgICAgICAgICAgICAgIGNvbnN0IHBpZWNlID0gcGllY2VzLmdldCh1dGlsXzEucG9zMmtleShbY29sLCByb3ddKSk7XG4gICAgICAgICAgICAgICAgaWYgKHBpZWNlKVxuICAgICAgICAgICAgICAgICAgICBwaWVjZS5wcm9tb3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnN0IG5iID0gYy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgICAgIGlmIChuYiA8IDU3KVxuICAgICAgICAgICAgICAgICAgICBjb2wgKz0gbmIgLSA0ODtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm9sZSA9IGMudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgcGllY2VzLnNldCh1dGlsXzEucG9zMmtleShbY29sLCByb3ddKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZTogcm9sZXNbcm9sZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogYyA9PT0gcm9sZSA/ICdibGFjaycgOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgKytjb2w7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwaWVjZXM7XG59XG5leHBvcnRzLnJlYWQgPSByZWFkO1xuZnVuY3Rpb24gd3JpdGUocGllY2VzKSB7XG4gICAgcmV0dXJuIHV0aWxfMS5pbnZSYW5rc1xuICAgICAgICAubWFwKHkgPT4gY2cuZmlsZXNcbiAgICAgICAgLm1hcCh4ID0+IHtcbiAgICAgICAgY29uc3QgcGllY2UgPSBwaWVjZXMuZ2V0KCh4ICsgeSkpO1xuICAgICAgICBpZiAocGllY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IGxldHRlciA9IGxldHRlcnNbcGllY2Uucm9sZV07XG4gICAgICAgICAgICByZXR1cm4gcGllY2UuY29sb3IgPT09ICd3aGl0ZScgPyBsZXR0ZXIudG9VcHBlckNhc2UoKSA6IGxldHRlcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gJzEnO1xuICAgIH0pXG4gICAgICAgIC5qb2luKCcnKSlcbiAgICAgICAgLmpvaW4oJy8nKVxuICAgICAgICAucmVwbGFjZSgvMXsyLH0vZywgcyA9PiBzLmxlbmd0aC50b1N0cmluZygpKTtcbn1cbmV4cG9ydHMud3JpdGUgPSB3cml0ZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZlbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY29uZmlndXJlID0gdm9pZCAwO1xuY29uc3QgYm9hcmRfMSA9IHJlcXVpcmUoXCIuL2JvYXJkXCIpO1xuY29uc3QgZmVuXzEgPSByZXF1aXJlKFwiLi9mZW5cIik7XG5mdW5jdGlvbiBjb25maWd1cmUoc3RhdGUsIGNvbmZpZykge1xuICAgIHZhciBfYTtcbiAgICBpZiAoKF9hID0gY29uZmlnLm1vdmFibGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kZXN0cylcbiAgICAgICAgc3RhdGUubW92YWJsZS5kZXN0cyA9IHVuZGVmaW5lZDtcbiAgICBtZXJnZShzdGF0ZSwgY29uZmlnKTtcbiAgICBpZiAoY29uZmlnLmZlbikge1xuICAgICAgICBzdGF0ZS5waWVjZXMgPSBmZW5fMS5yZWFkKGNvbmZpZy5mZW4pO1xuICAgICAgICBzdGF0ZS5kcmF3YWJsZS5zaGFwZXMgPSBbXTtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy5oYXNPd25Qcm9wZXJ0eSgnY2hlY2snKSlcbiAgICAgICAgYm9hcmRfMS5zZXRDaGVjayhzdGF0ZSwgY29uZmlnLmNoZWNrIHx8IGZhbHNlKTtcbiAgICBpZiAoY29uZmlnLmhhc093blByb3BlcnR5KCdsYXN0TW92ZScpICYmICFjb25maWcubGFzdE1vdmUpXG4gICAgICAgIHN0YXRlLmxhc3RNb3ZlID0gdW5kZWZpbmVkO1xuICAgIGVsc2UgaWYgKGNvbmZpZy5sYXN0TW92ZSlcbiAgICAgICAgc3RhdGUubGFzdE1vdmUgPSBjb25maWcubGFzdE1vdmU7XG4gICAgaWYgKHN0YXRlLnNlbGVjdGVkKVxuICAgICAgICBib2FyZF8xLnNldFNlbGVjdGVkKHN0YXRlLCBzdGF0ZS5zZWxlY3RlZCk7XG4gICAgaWYgKCFzdGF0ZS5hbmltYXRpb24uZHVyYXRpb24gfHwgc3RhdGUuYW5pbWF0aW9uLmR1cmF0aW9uIDwgMTAwKVxuICAgICAgICBzdGF0ZS5hbmltYXRpb24uZW5hYmxlZCA9IGZhbHNlO1xuICAgIGlmICghc3RhdGUubW92YWJsZS5yb29rQ2FzdGxlICYmIHN0YXRlLm1vdmFibGUuZGVzdHMpIHtcbiAgICAgICAgY29uc3QgcmFuayA9IHN0YXRlLm1vdmFibGUuY29sb3IgPT09ICd3aGl0ZScgPyAnMScgOiAnOCcsIGtpbmdTdGFydFBvcyA9ICgnZScgKyByYW5rKSwgZGVzdHMgPSBzdGF0ZS5tb3ZhYmxlLmRlc3RzLmdldChraW5nU3RhcnRQb3MpLCBraW5nID0gc3RhdGUucGllY2VzLmdldChraW5nU3RhcnRQb3MpO1xuICAgICAgICBpZiAoIWRlc3RzIHx8ICFraW5nIHx8IGtpbmcucm9sZSAhPT0gJ2tpbmcnKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBzdGF0ZS5tb3ZhYmxlLmRlc3RzLnNldChraW5nU3RhcnRQb3MsIGRlc3RzLmZpbHRlcihkID0+ICEoZCA9PT0gJ2EnICsgcmFuayAmJiBkZXN0cy5pbmNsdWRlcygoJ2MnICsgcmFuaykpKSAmJlxuICAgICAgICAgICAgIShkID09PSAnaCcgKyByYW5rICYmIGRlc3RzLmluY2x1ZGVzKCgnZycgKyByYW5rKSkpKSk7XG4gICAgfVxufVxuZXhwb3J0cy5jb25maWd1cmUgPSBjb25maWd1cmU7XG5mdW5jdGlvbiBtZXJnZShiYXNlLCBleHRlbmQpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBleHRlbmQpIHtcbiAgICAgICAgaWYgKGlzT2JqZWN0KGJhc2Vba2V5XSkgJiYgaXNPYmplY3QoZXh0ZW5kW2tleV0pKVxuICAgICAgICAgICAgbWVyZ2UoYmFzZVtrZXldLCBleHRlbmRba2V5XSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGJhc2Vba2V5XSA9IGV4dGVuZFtrZXldO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzT2JqZWN0KG8pIHtcbiAgICByZXR1cm4gdHlwZW9mIG8gPT09ICdvYmplY3QnO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uZmlnLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5yZW5kZXIgPSBleHBvcnRzLmFuaW0gPSB2b2lkIDA7XG5jb25zdCB1dGlsID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmZ1bmN0aW9uIGFuaW0obXV0YXRpb24sIHN0YXRlKSB7XG4gICAgcmV0dXJuIHN0YXRlLmFuaW1hdGlvbi5lbmFibGVkID8gYW5pbWF0ZShtdXRhdGlvbiwgc3RhdGUpIDogcmVuZGVyKG11dGF0aW9uLCBzdGF0ZSk7XG59XG5leHBvcnRzLmFuaW0gPSBhbmltO1xuZnVuY3Rpb24gcmVuZGVyKG11dGF0aW9uLCBzdGF0ZSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IG11dGF0aW9uKHN0YXRlKTtcbiAgICBzdGF0ZS5kb20ucmVkcmF3KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMucmVuZGVyID0gcmVuZGVyO1xuZnVuY3Rpb24gbWFrZVBpZWNlKGtleSwgcGllY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgcG9zOiB1dGlsLmtleTJwb3Moa2V5KSxcbiAgICAgICAgcGllY2U6IHBpZWNlLFxuICAgIH07XG59XG5mdW5jdGlvbiBjbG9zZXIocGllY2UsIHBpZWNlcykge1xuICAgIHJldHVybiBwaWVjZXMuc29ydCgocDEsIHAyKSA9PiB7XG4gICAgICAgIHJldHVybiB1dGlsLmRpc3RhbmNlU3EocGllY2UucG9zLCBwMS5wb3MpIC0gdXRpbC5kaXN0YW5jZVNxKHBpZWNlLnBvcywgcDIucG9zKTtcbiAgICB9KVswXTtcbn1cbmZ1bmN0aW9uIGNvbXB1dGVQbGFuKHByZXZQaWVjZXMsIGN1cnJlbnQpIHtcbiAgICBjb25zdCBhbmltcyA9IG5ldyBNYXAoKSwgYW5pbWVkT3JpZ3MgPSBbXSwgZmFkaW5ncyA9IG5ldyBNYXAoKSwgbWlzc2luZ3MgPSBbXSwgbmV3cyA9IFtdLCBwcmVQaWVjZXMgPSBuZXcgTWFwKCk7XG4gICAgbGV0IGN1clAsIHByZVAsIHZlY3RvcjtcbiAgICBmb3IgKGNvbnN0IFtrLCBwXSBvZiBwcmV2UGllY2VzKSB7XG4gICAgICAgIHByZVBpZWNlcy5zZXQoaywgbWFrZVBpZWNlKGssIHApKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgb2YgdXRpbC5hbGxLZXlzKSB7XG4gICAgICAgIGN1clAgPSBjdXJyZW50LnBpZWNlcy5nZXQoa2V5KTtcbiAgICAgICAgcHJlUCA9IHByZVBpZWNlcy5nZXQoa2V5KTtcbiAgICAgICAgaWYgKGN1clApIHtcbiAgICAgICAgICAgIGlmIChwcmVQKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF1dGlsLnNhbWVQaWVjZShjdXJQLCBwcmVQLnBpZWNlKSkge1xuICAgICAgICAgICAgICAgICAgICBtaXNzaW5ncy5wdXNoKHByZVApO1xuICAgICAgICAgICAgICAgICAgICBuZXdzLnB1c2gobWFrZVBpZWNlKGtleSwgY3VyUCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBuZXdzLnB1c2gobWFrZVBpZWNlKGtleSwgY3VyUCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHByZVApXG4gICAgICAgICAgICBtaXNzaW5ncy5wdXNoKHByZVApO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IG5ld1Agb2YgbmV3cykge1xuICAgICAgICBwcmVQID0gY2xvc2VyKG5ld1AsIG1pc3NpbmdzLmZpbHRlcihwID0+IHV0aWwuc2FtZVBpZWNlKG5ld1AucGllY2UsIHAucGllY2UpKSk7XG4gICAgICAgIGlmIChwcmVQKSB7XG4gICAgICAgICAgICB2ZWN0b3IgPSBbcHJlUC5wb3NbMF0gLSBuZXdQLnBvc1swXSwgcHJlUC5wb3NbMV0gLSBuZXdQLnBvc1sxXV07XG4gICAgICAgICAgICBhbmltcy5zZXQobmV3UC5rZXksIHZlY3Rvci5jb25jYXQodmVjdG9yKSk7XG4gICAgICAgICAgICBhbmltZWRPcmlncy5wdXNoKHByZVAua2V5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IHAgb2YgbWlzc2luZ3MpIHtcbiAgICAgICAgaWYgKCFhbmltZWRPcmlncy5pbmNsdWRlcyhwLmtleSkpXG4gICAgICAgICAgICBmYWRpbmdzLnNldChwLmtleSwgcC5waWVjZSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGFuaW1zOiBhbmltcyxcbiAgICAgICAgZmFkaW5nczogZmFkaW5ncyxcbiAgICB9O1xufVxuZnVuY3Rpb24gc3RlcChzdGF0ZSwgbm93KSB7XG4gICAgY29uc3QgY3VyID0gc3RhdGUuYW5pbWF0aW9uLmN1cnJlbnQ7XG4gICAgaWYgKGN1ciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICghc3RhdGUuZG9tLmRlc3Ryb3llZClcbiAgICAgICAgICAgIHN0YXRlLmRvbS5yZWRyYXdOb3coKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCByZXN0ID0gMSAtIChub3cgLSBjdXIuc3RhcnQpICogY3VyLmZyZXF1ZW5jeTtcbiAgICBpZiAocmVzdCA8PSAwKSB7XG4gICAgICAgIHN0YXRlLmFuaW1hdGlvbi5jdXJyZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICBzdGF0ZS5kb20ucmVkcmF3Tm93KCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBlYXNlID0gZWFzaW5nKHJlc3QpO1xuICAgICAgICBmb3IgKGNvbnN0IGNmZyBvZiBjdXIucGxhbi5hbmltcy52YWx1ZXMoKSkge1xuICAgICAgICAgICAgY2ZnWzJdID0gY2ZnWzBdICogZWFzZTtcbiAgICAgICAgICAgIGNmZ1szXSA9IGNmZ1sxXSAqIGVhc2U7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUuZG9tLnJlZHJhd05vdyh0cnVlKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChub3cgPSBwZXJmb3JtYW5jZS5ub3coKSkgPT4gc3RlcChzdGF0ZSwgbm93KSk7XG4gICAgfVxufVxuZnVuY3Rpb24gYW5pbWF0ZShtdXRhdGlvbiwgc3RhdGUpIHtcbiAgICBjb25zdCBwcmV2UGllY2VzID0gbmV3IE1hcChzdGF0ZS5waWVjZXMpO1xuICAgIGNvbnN0IHJlc3VsdCA9IG11dGF0aW9uKHN0YXRlKTtcbiAgICBjb25zdCBwbGFuID0gY29tcHV0ZVBsYW4ocHJldlBpZWNlcywgc3RhdGUpO1xuICAgIGlmIChwbGFuLmFuaW1zLnNpemUgfHwgcGxhbi5mYWRpbmdzLnNpemUpIHtcbiAgICAgICAgY29uc3QgYWxyZWFkeVJ1bm5pbmcgPSBzdGF0ZS5hbmltYXRpb24uY3VycmVudCAmJiBzdGF0ZS5hbmltYXRpb24uY3VycmVudC5zdGFydDtcbiAgICAgICAgc3RhdGUuYW5pbWF0aW9uLmN1cnJlbnQgPSB7XG4gICAgICAgICAgICBzdGFydDogcGVyZm9ybWFuY2Uubm93KCksXG4gICAgICAgICAgICBmcmVxdWVuY3k6IDEgLyBzdGF0ZS5hbmltYXRpb24uZHVyYXRpb24sXG4gICAgICAgICAgICBwbGFuOiBwbGFuLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoIWFscmVhZHlSdW5uaW5nKVxuICAgICAgICAgICAgc3RlcChzdGF0ZSwgcGVyZm9ybWFuY2Uubm93KCkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3RhdGUuZG9tLnJlZHJhdygpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZWFzaW5nKHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNSA/IDQgKiB0ICogdCAqIHQgOiAodCAtIDEpICogKDIgKiB0IC0gMikgKiAoMiAqIHQgLSAyKSArIDE7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbmltLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jbGVhciA9IGV4cG9ydHMuY2FuY2VsID0gZXhwb3J0cy5lbmQgPSBleHBvcnRzLm1vdmUgPSBleHBvcnRzLnByb2Nlc3NEcmF3ID0gZXhwb3J0cy5zdGFydCA9IHZvaWQgMDtcbmNvbnN0IGJvYXJkXzEgPSByZXF1aXJlKFwiLi9ib2FyZFwiKTtcbmNvbnN0IHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5jb25zdCBicnVzaGVzID0gWydncmVlbicsICdyZWQnLCAnYmx1ZScsICd5ZWxsb3cnXTtcbmZ1bmN0aW9uIHN0YXJ0KHN0YXRlLCBlKSB7XG4gICAgaWYgKGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoID4gMSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuY3RybEtleSA/IGJvYXJkXzEudW5zZWxlY3Qoc3RhdGUpIDogYm9hcmRfMS5jYW5jZWxNb3ZlKHN0YXRlKTtcbiAgICBjb25zdCBwb3MgPSB1dGlsXzEuZXZlbnRQb3NpdGlvbihlKSwgb3JpZyA9IGJvYXJkXzEuZ2V0S2V5QXREb21Qb3MocG9zLCBib2FyZF8xLndoaXRlUG92KHN0YXRlKSwgc3RhdGUuZG9tLmJvdW5kcygpKTtcbiAgICBpZiAoIW9yaWcpXG4gICAgICAgIHJldHVybjtcbiAgICBzdGF0ZS5kcmF3YWJsZS5jdXJyZW50ID0ge1xuICAgICAgICBvcmlnLFxuICAgICAgICBwb3MsXG4gICAgICAgIGJydXNoOiBldmVudEJydXNoKGUpLFxuICAgICAgICBzbmFwVG9WYWxpZE1vdmU6IHN0YXRlLmRyYXdhYmxlLmRlZmF1bHRTbmFwVG9WYWxpZE1vdmUsXG4gICAgfTtcbiAgICBwcm9jZXNzRHJhdyhzdGF0ZSk7XG59XG5leHBvcnRzLnN0YXJ0ID0gc3RhcnQ7XG5mdW5jdGlvbiBwcm9jZXNzRHJhdyhzdGF0ZSkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGN1ciA9IHN0YXRlLmRyYXdhYmxlLmN1cnJlbnQ7XG4gICAgICAgIGlmIChjdXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleUF0RG9tUG9zID0gYm9hcmRfMS5nZXRLZXlBdERvbVBvcyhjdXIucG9zLCBib2FyZF8xLndoaXRlUG92KHN0YXRlKSwgc3RhdGUuZG9tLmJvdW5kcygpKTtcbiAgICAgICAgICAgIGlmICgha2V5QXREb21Qb3MpIHtcbiAgICAgICAgICAgICAgICBjdXIuc25hcFRvVmFsaWRNb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtb3VzZVNxID0gY3VyLnNuYXBUb1ZhbGlkTW92ZVxuICAgICAgICAgICAgICAgID8gYm9hcmRfMS5nZXRTbmFwcGVkS2V5QXREb21Qb3MoY3VyLm9yaWcsIGN1ci5wb3MsIGJvYXJkXzEud2hpdGVQb3Yoc3RhdGUpLCBzdGF0ZS5kb20uYm91bmRzKCkpXG4gICAgICAgICAgICAgICAgOiBrZXlBdERvbVBvcztcbiAgICAgICAgICAgIGlmIChtb3VzZVNxICE9PSBjdXIubW91c2VTcSkge1xuICAgICAgICAgICAgICAgIGN1ci5tb3VzZVNxID0gbW91c2VTcTtcbiAgICAgICAgICAgICAgICBjdXIuZGVzdCA9IG1vdXNlU3EgIT09IGN1ci5vcmlnID8gbW91c2VTcSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBzdGF0ZS5kb20ucmVkcmF3Tm93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9jZXNzRHJhdyhzdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMucHJvY2Vzc0RyYXcgPSBwcm9jZXNzRHJhdztcbmZ1bmN0aW9uIG1vdmUoc3RhdGUsIGUpIHtcbiAgICBpZiAoc3RhdGUuZHJhd2FibGUuY3VycmVudClcbiAgICAgICAgc3RhdGUuZHJhd2FibGUuY3VycmVudC5wb3MgPSB1dGlsXzEuZXZlbnRQb3NpdGlvbihlKTtcbn1cbmV4cG9ydHMubW92ZSA9IG1vdmU7XG5mdW5jdGlvbiBlbmQoc3RhdGUpIHtcbiAgICBjb25zdCBjdXIgPSBzdGF0ZS5kcmF3YWJsZS5jdXJyZW50O1xuICAgIGlmIChjdXIpIHtcbiAgICAgICAgaWYgKGN1ci5tb3VzZVNxKVxuICAgICAgICAgICAgYWRkU2hhcGUoc3RhdGUuZHJhd2FibGUsIGN1cik7XG4gICAgICAgIGNhbmNlbChzdGF0ZSk7XG4gICAgfVxufVxuZXhwb3J0cy5lbmQgPSBlbmQ7XG5mdW5jdGlvbiBjYW5jZWwoc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUuZHJhd2FibGUuY3VycmVudCkge1xuICAgICAgICBzdGF0ZS5kcmF3YWJsZS5jdXJyZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICBzdGF0ZS5kb20ucmVkcmF3KCk7XG4gICAgfVxufVxuZXhwb3J0cy5jYW5jZWwgPSBjYW5jZWw7XG5mdW5jdGlvbiBjbGVhcihzdGF0ZSkge1xuICAgIGlmIChzdGF0ZS5kcmF3YWJsZS5zaGFwZXMubGVuZ3RoKSB7XG4gICAgICAgIHN0YXRlLmRyYXdhYmxlLnNoYXBlcyA9IFtdO1xuICAgICAgICBzdGF0ZS5kb20ucmVkcmF3KCk7XG4gICAgICAgIG9uQ2hhbmdlKHN0YXRlLmRyYXdhYmxlKTtcbiAgICB9XG59XG5leHBvcnRzLmNsZWFyID0gY2xlYXI7XG5mdW5jdGlvbiBldmVudEJydXNoKGUpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgbW9kQSA9IChlLnNoaWZ0S2V5IHx8IGUuY3RybEtleSkgJiYgdXRpbF8xLmlzUmlnaHRCdXR0b24oZSk7XG4gICAgY29uc3QgbW9kQiA9IGUuYWx0S2V5IHx8IGUubWV0YUtleSB8fCAoKF9hID0gZS5nZXRNb2RpZmllclN0YXRlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlLCAnQWx0R3JhcGgnKSk7XG4gICAgcmV0dXJuIGJydXNoZXNbKG1vZEEgPyAxIDogMCkgKyAobW9kQiA/IDIgOiAwKV07XG59XG5mdW5jdGlvbiBhZGRTaGFwZShkcmF3YWJsZSwgY3VyKSB7XG4gICAgY29uc3Qgc2FtZVNoYXBlID0gKHMpID0+IHMub3JpZyA9PT0gY3VyLm9yaWcgJiYgcy5kZXN0ID09PSBjdXIuZGVzdDtcbiAgICBjb25zdCBzaW1pbGFyID0gZHJhd2FibGUuc2hhcGVzLmZpbmQoc2FtZVNoYXBlKTtcbiAgICBpZiAoc2ltaWxhcilcbiAgICAgICAgZHJhd2FibGUuc2hhcGVzID0gZHJhd2FibGUuc2hhcGVzLmZpbHRlcihzID0+ICFzYW1lU2hhcGUocykpO1xuICAgIGlmICghc2ltaWxhciB8fCBzaW1pbGFyLmJydXNoICE9PSBjdXIuYnJ1c2gpXG4gICAgICAgIGRyYXdhYmxlLnNoYXBlcy5wdXNoKGN1cik7XG4gICAgb25DaGFuZ2UoZHJhd2FibGUpO1xufVxuZnVuY3Rpb24gb25DaGFuZ2UoZHJhd2FibGUpIHtcbiAgICBpZiAoZHJhd2FibGUub25DaGFuZ2UpXG4gICAgICAgIGRyYXdhYmxlLm9uQ2hhbmdlKGRyYXdhYmxlLnNoYXBlcyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kcmF3LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jYW5jZWwgPSBleHBvcnRzLmVuZCA9IGV4cG9ydHMubW92ZSA9IGV4cG9ydHMuZHJhZ05ld1BpZWNlID0gZXhwb3J0cy5zdGFydCA9IHZvaWQgMDtcbmNvbnN0IGJvYXJkID0gcmVxdWlyZShcIi4vYm9hcmRcIik7XG5jb25zdCB1dGlsID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmNvbnN0IGRyYXdfMSA9IHJlcXVpcmUoXCIuL2RyYXdcIik7XG5jb25zdCBhbmltXzEgPSByZXF1aXJlKFwiLi9hbmltXCIpO1xuZnVuY3Rpb24gc3RhcnQocywgZSkge1xuICAgIGlmICghZS5pc1RydXN0ZWQgfHwgKGUuYnV0dG9uICE9PSB1bmRlZmluZWQgJiYgZS5idXR0b24gIT09IDApKVxuICAgICAgICByZXR1cm47XG4gICAgaWYgKGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoID4gMSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IGJvdW5kcyA9IHMuZG9tLmJvdW5kcygpLCBwb3NpdGlvbiA9IHV0aWwuZXZlbnRQb3NpdGlvbihlKSwgb3JpZyA9IGJvYXJkLmdldEtleUF0RG9tUG9zKHBvc2l0aW9uLCBib2FyZC53aGl0ZVBvdihzKSwgYm91bmRzKTtcbiAgICBpZiAoIW9yaWcpXG4gICAgICAgIHJldHVybjtcbiAgICBjb25zdCBwaWVjZSA9IHMucGllY2VzLmdldChvcmlnKTtcbiAgICBjb25zdCBwcmV2aW91c2x5U2VsZWN0ZWQgPSBzLnNlbGVjdGVkO1xuICAgIGlmICghcHJldmlvdXNseVNlbGVjdGVkICYmIHMuZHJhd2FibGUuZW5hYmxlZCAmJiAocy5kcmF3YWJsZS5lcmFzZU9uQ2xpY2sgfHwgIXBpZWNlIHx8IHBpZWNlLmNvbG9yICE9PSBzLnR1cm5Db2xvcikpXG4gICAgICAgIGRyYXdfMS5jbGVhcihzKTtcbiAgICBpZiAoZS5jYW5jZWxhYmxlICE9PSBmYWxzZSAmJlxuICAgICAgICAoIWUudG91Y2hlcyB8fCAhcy5tb3ZhYmxlLmNvbG9yIHx8IHBpZWNlIHx8IHByZXZpb3VzbHlTZWxlY3RlZCB8fCBwaWVjZUNsb3NlVG8ocywgcG9zaXRpb24pKSlcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGhhZFByZW1vdmUgPSAhIXMucHJlbW92YWJsZS5jdXJyZW50O1xuICAgIGNvbnN0IGhhZFByZWRyb3AgPSAhIXMucHJlZHJvcHBhYmxlLmN1cnJlbnQ7XG4gICAgcy5zdGF0cy5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgIGlmIChzLnNlbGVjdGVkICYmIGJvYXJkLmNhbk1vdmUocywgcy5zZWxlY3RlZCwgb3JpZykpIHtcbiAgICAgICAgYW5pbV8xLmFuaW0oc3RhdGUgPT4gYm9hcmQuc2VsZWN0U3F1YXJlKHN0YXRlLCBvcmlnKSwgcyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBib2FyZC5zZWxlY3RTcXVhcmUocywgb3JpZyk7XG4gICAgfVxuICAgIGNvbnN0IHN0aWxsU2VsZWN0ZWQgPSBzLnNlbGVjdGVkID09PSBvcmlnO1xuICAgIGNvbnN0IGVsZW1lbnQgPSBwaWVjZUVsZW1lbnRCeUtleShzLCBvcmlnKTtcbiAgICBpZiAocGllY2UgJiYgZWxlbWVudCAmJiBzdGlsbFNlbGVjdGVkICYmIGJvYXJkLmlzRHJhZ2dhYmxlKHMsIG9yaWcpKSB7XG4gICAgICAgIHMuZHJhZ2dhYmxlLmN1cnJlbnQgPSB7XG4gICAgICAgICAgICBvcmlnLFxuICAgICAgICAgICAgcGllY2UsXG4gICAgICAgICAgICBvcmlnUG9zOiBwb3NpdGlvbixcbiAgICAgICAgICAgIHBvczogcG9zaXRpb24sXG4gICAgICAgICAgICBzdGFydGVkOiBzLmRyYWdnYWJsZS5hdXRvRGlzdGFuY2UgJiYgcy5zdGF0cy5kcmFnZ2VkLFxuICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgIHByZXZpb3VzbHlTZWxlY3RlZCxcbiAgICAgICAgICAgIG9yaWdpblRhcmdldDogZS50YXJnZXQsXG4gICAgICAgIH07XG4gICAgICAgIGVsZW1lbnQuY2dEcmFnZ2luZyA9IHRydWU7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgICAgY29uc3QgZ2hvc3QgPSBzLmRvbS5lbGVtZW50cy5naG9zdDtcbiAgICAgICAgaWYgKGdob3N0KSB7XG4gICAgICAgICAgICBnaG9zdC5jbGFzc05hbWUgPSBgZ2hvc3QgJHtwaWVjZS5jb2xvcn0gJHtwaWVjZS5yb2xlfWA7XG4gICAgICAgICAgICB1dGlsLnRyYW5zbGF0ZUFicyhnaG9zdCwgdXRpbC5wb3NUb1RyYW5zbGF0ZUFicyhib3VuZHMpKHV0aWwua2V5MnBvcyhvcmlnKSwgYm9hcmQud2hpdGVQb3YocykpKTtcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJsZShnaG9zdCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvY2Vzc0RyYWcocyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoaGFkUHJlbW92ZSlcbiAgICAgICAgICAgIGJvYXJkLnVuc2V0UHJlbW92ZShzKTtcbiAgICAgICAgaWYgKGhhZFByZWRyb3ApXG4gICAgICAgICAgICBib2FyZC51bnNldFByZWRyb3Aocyk7XG4gICAgfVxuICAgIHMuZG9tLnJlZHJhdygpO1xufVxuZXhwb3J0cy5zdGFydCA9IHN0YXJ0O1xuZnVuY3Rpb24gcGllY2VDbG9zZVRvKHMsIHBvcykge1xuICAgIGNvbnN0IGFzV2hpdGUgPSBib2FyZC53aGl0ZVBvdihzKSwgYm91bmRzID0gcy5kb20uYm91bmRzKCksIHJhZGl1c1NxID0gTWF0aC5wb3coYm91bmRzLndpZHRoIC8gOCwgMik7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gcy5waWVjZXMpIHtcbiAgICAgICAgY29uc3QgY2VudGVyID0gdXRpbC5jb21wdXRlU3F1YXJlQ2VudGVyKGtleSwgYXNXaGl0ZSwgYm91bmRzKTtcbiAgICAgICAgaWYgKHV0aWwuZGlzdGFuY2VTcShjZW50ZXIsIHBvcykgPD0gcmFkaXVzU3EpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gZHJhZ05ld1BpZWNlKHMsIHBpZWNlLCBlLCBmb3JjZSkge1xuICAgIGNvbnN0IGtleSA9ICdhMCc7XG4gICAgcy5waWVjZXMuc2V0KGtleSwgcGllY2UpO1xuICAgIHMuZG9tLnJlZHJhdygpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdXRpbC5ldmVudFBvc2l0aW9uKGUpO1xuICAgIHMuZHJhZ2dhYmxlLmN1cnJlbnQgPSB7XG4gICAgICAgIG9yaWc6IGtleSxcbiAgICAgICAgcGllY2UsXG4gICAgICAgIG9yaWdQb3M6IHBvc2l0aW9uLFxuICAgICAgICBwb3M6IHBvc2l0aW9uLFxuICAgICAgICBzdGFydGVkOiB0cnVlLFxuICAgICAgICBlbGVtZW50OiAoKSA9PiBwaWVjZUVsZW1lbnRCeUtleShzLCBrZXkpLFxuICAgICAgICBvcmlnaW5UYXJnZXQ6IGUudGFyZ2V0LFxuICAgICAgICBuZXdQaWVjZTogdHJ1ZSxcbiAgICAgICAgZm9yY2U6ICEhZm9yY2UsXG4gICAgfTtcbiAgICBwcm9jZXNzRHJhZyhzKTtcbn1cbmV4cG9ydHMuZHJhZ05ld1BpZWNlID0gZHJhZ05ld1BpZWNlO1xuZnVuY3Rpb24gcHJvY2Vzc0RyYWcocykge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgY29uc3QgY3VyID0gcy5kcmFnZ2FibGUuY3VycmVudDtcbiAgICAgICAgaWYgKCFjdXIpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICgoX2EgPSBzLmFuaW1hdGlvbi5jdXJyZW50KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGxhbi5hbmltcy5oYXMoY3VyLm9yaWcpKVxuICAgICAgICAgICAgcy5hbmltYXRpb24uY3VycmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3Qgb3JpZ1BpZWNlID0gcy5waWVjZXMuZ2V0KGN1ci5vcmlnKTtcbiAgICAgICAgaWYgKCFvcmlnUGllY2UgfHwgIXV0aWwuc2FtZVBpZWNlKG9yaWdQaWVjZSwgY3VyLnBpZWNlKSlcbiAgICAgICAgICAgIGNhbmNlbChzKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWN1ci5zdGFydGVkICYmIHV0aWwuZGlzdGFuY2VTcShjdXIucG9zLCBjdXIub3JpZ1BvcykgPj0gTWF0aC5wb3cocy5kcmFnZ2FibGUuZGlzdGFuY2UsIDIpKVxuICAgICAgICAgICAgICAgIGN1ci5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChjdXIuc3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY3VyLmVsZW1lbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmQgPSBjdXIuZWxlbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBmb3VuZC5jZ0RyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgY3VyLmVsZW1lbnQgPSBmb3VuZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgYm91bmRzID0gcy5kb20uYm91bmRzKCk7XG4gICAgICAgICAgICAgICAgdXRpbC50cmFuc2xhdGVBYnMoY3VyLmVsZW1lbnQsIFtcbiAgICAgICAgICAgICAgICAgICAgY3VyLnBvc1swXSAtIGJvdW5kcy5sZWZ0IC0gYm91bmRzLndpZHRoIC8gMTYsXG4gICAgICAgICAgICAgICAgICAgIGN1ci5wb3NbMV0gLSBib3VuZHMudG9wIC0gYm91bmRzLmhlaWdodCAvIDE2LFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByb2Nlc3NEcmFnKHMpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gbW92ZShzLCBlKSB7XG4gICAgaWYgKHMuZHJhZ2dhYmxlLmN1cnJlbnQgJiYgKCFlLnRvdWNoZXMgfHwgZS50b3VjaGVzLmxlbmd0aCA8IDIpKSB7XG4gICAgICAgIHMuZHJhZ2dhYmxlLmN1cnJlbnQucG9zID0gdXRpbC5ldmVudFBvc2l0aW9uKGUpO1xuICAgIH1cbn1cbmV4cG9ydHMubW92ZSA9IG1vdmU7XG5mdW5jdGlvbiBlbmQocywgZSkge1xuICAgIGNvbnN0IGN1ciA9IHMuZHJhZ2dhYmxlLmN1cnJlbnQ7XG4gICAgaWYgKCFjdXIpXG4gICAgICAgIHJldHVybjtcbiAgICBpZiAoZS50eXBlID09PSAndG91Y2hlbmQnICYmIGUuY2FuY2VsYWJsZSAhPT0gZmFsc2UpXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoZS50eXBlID09PSAndG91Y2hlbmQnICYmIGN1ci5vcmlnaW5UYXJnZXQgIT09IGUudGFyZ2V0ICYmICFjdXIubmV3UGllY2UpIHtcbiAgICAgICAgcy5kcmFnZ2FibGUuY3VycmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBib2FyZC51bnNldFByZW1vdmUocyk7XG4gICAgYm9hcmQudW5zZXRQcmVkcm9wKHMpO1xuICAgIGNvbnN0IGV2ZW50UG9zID0gdXRpbC5ldmVudFBvc2l0aW9uKGUpIHx8IGN1ci5wb3M7XG4gICAgY29uc3QgZGVzdCA9IGJvYXJkLmdldEtleUF0RG9tUG9zKGV2ZW50UG9zLCBib2FyZC53aGl0ZVBvdihzKSwgcy5kb20uYm91bmRzKCkpO1xuICAgIGlmIChkZXN0ICYmIGN1ci5zdGFydGVkICYmIGN1ci5vcmlnICE9PSBkZXN0KSB7XG4gICAgICAgIGlmIChjdXIubmV3UGllY2UpXG4gICAgICAgICAgICBib2FyZC5kcm9wTmV3UGllY2UocywgY3VyLm9yaWcsIGRlc3QsIGN1ci5mb3JjZSk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcy5zdGF0cy5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgICAgICAgICAgaWYgKGJvYXJkLnVzZXJNb3ZlKHMsIGN1ci5vcmlnLCBkZXN0KSlcbiAgICAgICAgICAgICAgICBzLnN0YXRzLmRyYWdnZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGN1ci5uZXdQaWVjZSkge1xuICAgICAgICBzLnBpZWNlcy5kZWxldGUoY3VyLm9yaWcpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzLmRyYWdnYWJsZS5kZWxldGVPbkRyb3BPZmYgJiYgIWRlc3QpIHtcbiAgICAgICAgcy5waWVjZXMuZGVsZXRlKGN1ci5vcmlnKTtcbiAgICAgICAgYm9hcmQuY2FsbFVzZXJGdW5jdGlvbihzLmV2ZW50cy5jaGFuZ2UpO1xuICAgIH1cbiAgICBpZiAoY3VyLm9yaWcgPT09IGN1ci5wcmV2aW91c2x5U2VsZWN0ZWQgJiYgKGN1ci5vcmlnID09PSBkZXN0IHx8ICFkZXN0KSlcbiAgICAgICAgYm9hcmQudW5zZWxlY3Qocyk7XG4gICAgZWxzZSBpZiAoIXMuc2VsZWN0YWJsZS5lbmFibGVkKVxuICAgICAgICBib2FyZC51bnNlbGVjdChzKTtcbiAgICByZW1vdmVEcmFnRWxlbWVudHMocyk7XG4gICAgcy5kcmFnZ2FibGUuY3VycmVudCA9IHVuZGVmaW5lZDtcbiAgICBzLmRvbS5yZWRyYXcoKTtcbn1cbmV4cG9ydHMuZW5kID0gZW5kO1xuZnVuY3Rpb24gY2FuY2VsKHMpIHtcbiAgICBjb25zdCBjdXIgPSBzLmRyYWdnYWJsZS5jdXJyZW50O1xuICAgIGlmIChjdXIpIHtcbiAgICAgICAgaWYgKGN1ci5uZXdQaWVjZSlcbiAgICAgICAgICAgIHMucGllY2VzLmRlbGV0ZShjdXIub3JpZyk7XG4gICAgICAgIHMuZHJhZ2dhYmxlLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGJvYXJkLnVuc2VsZWN0KHMpO1xuICAgICAgICByZW1vdmVEcmFnRWxlbWVudHMocyk7XG4gICAgICAgIHMuZG9tLnJlZHJhdygpO1xuICAgIH1cbn1cbmV4cG9ydHMuY2FuY2VsID0gY2FuY2VsO1xuZnVuY3Rpb24gcmVtb3ZlRHJhZ0VsZW1lbnRzKHMpIHtcbiAgICBjb25zdCBlID0gcy5kb20uZWxlbWVudHM7XG4gICAgaWYgKGUuZ2hvc3QpXG4gICAgICAgIHV0aWwuc2V0VmlzaWJsZShlLmdob3N0LCBmYWxzZSk7XG59XG5mdW5jdGlvbiBwaWVjZUVsZW1lbnRCeUtleShzLCBrZXkpIHtcbiAgICBsZXQgZWwgPSBzLmRvbS5lbGVtZW50cy5ib2FyZC5maXJzdENoaWxkO1xuICAgIHdoaWxlIChlbCkge1xuICAgICAgICBpZiAoZWwuY2dLZXkgPT09IGtleSAmJiBlbC50YWdOYW1lID09PSAnUElFQ0UnKVxuICAgICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICBlbCA9IGVsLm5leHRTaWJsaW5nO1xuICAgIH1cbiAgICByZXR1cm47XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kcmFnLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5leHBsb3Npb24gPSB2b2lkIDA7XG5mdW5jdGlvbiBleHBsb3Npb24oc3RhdGUsIGtleXMpIHtcbiAgICBzdGF0ZS5leHBsb2RpbmcgPSB7IHN0YWdlOiAxLCBrZXlzIH07XG4gICAgc3RhdGUuZG9tLnJlZHJhdygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzZXRTdGFnZShzdGF0ZSwgMik7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gc2V0U3RhZ2Uoc3RhdGUsIHVuZGVmaW5lZCksIDEyMCk7XG4gICAgfSwgMTIwKTtcbn1cbmV4cG9ydHMuZXhwbG9zaW9uID0gZXhwbG9zaW9uO1xuZnVuY3Rpb24gc2V0U3RhZ2Uoc3RhdGUsIHN0YWdlKSB7XG4gICAgaWYgKHN0YXRlLmV4cGxvZGluZykge1xuICAgICAgICBpZiAoc3RhZ2UpXG4gICAgICAgICAgICBzdGF0ZS5leHBsb2Rpbmcuc3RhZ2UgPSBzdGFnZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdGUuZXhwbG9kaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICBzdGF0ZS5kb20ucmVkcmF3KCk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXhwbG9zaW9uLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zdGFydCA9IHZvaWQgMDtcbmNvbnN0IGJvYXJkID0gcmVxdWlyZShcIi4vYm9hcmRcIik7XG5jb25zdCBmZW5fMSA9IHJlcXVpcmUoXCIuL2ZlblwiKTtcbmNvbnN0IGNvbmZpZ18xID0gcmVxdWlyZShcIi4vY29uZmlnXCIpO1xuY29uc3QgYW5pbV8xID0gcmVxdWlyZShcIi4vYW5pbVwiKTtcbmNvbnN0IGRyYWdfMSA9IHJlcXVpcmUoXCIuL2RyYWdcIik7XG5jb25zdCBleHBsb3Npb25fMSA9IHJlcXVpcmUoXCIuL2V4cGxvc2lvblwiKTtcbmZ1bmN0aW9uIHN0YXJ0KHN0YXRlLCByZWRyYXdBbGwpIHtcbiAgICBmdW5jdGlvbiB0b2dnbGVPcmllbnRhdGlvbigpIHtcbiAgICAgICAgYm9hcmQudG9nZ2xlT3JpZW50YXRpb24oc3RhdGUpO1xuICAgICAgICByZWRyYXdBbGwoKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0KGNvbmZpZykge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5vcmllbnRhdGlvbiAmJiBjb25maWcub3JpZW50YXRpb24gIT09IHN0YXRlLm9yaWVudGF0aW9uKVxuICAgICAgICAgICAgICAgIHRvZ2dsZU9yaWVudGF0aW9uKCk7XG4gICAgICAgICAgICAoY29uZmlnLmZlbiA/IGFuaW1fMS5hbmltIDogYW5pbV8xLnJlbmRlcikoc3RhdGUgPT4gY29uZmlnXzEuY29uZmlndXJlKHN0YXRlLCBjb25maWcpLCBzdGF0ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0YXRlLFxuICAgICAgICBnZXRGZW46ICgpID0+IGZlbl8xLndyaXRlKHN0YXRlLnBpZWNlcyksXG4gICAgICAgIHRvZ2dsZU9yaWVudGF0aW9uLFxuICAgICAgICBzZXRQaWVjZXMocGllY2VzKSB7XG4gICAgICAgICAgICBhbmltXzEuYW5pbShzdGF0ZSA9PiBib2FyZC5zZXRQaWVjZXMoc3RhdGUsIHBpZWNlcyksIHN0YXRlKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2VsZWN0U3F1YXJlKGtleSwgZm9yY2UpIHtcbiAgICAgICAgICAgIGlmIChrZXkpXG4gICAgICAgICAgICAgICAgYW5pbV8xLmFuaW0oc3RhdGUgPT4gYm9hcmQuc2VsZWN0U3F1YXJlKHN0YXRlLCBrZXksIGZvcmNlKSwgc3RhdGUpO1xuICAgICAgICAgICAgZWxzZSBpZiAoc3RhdGUuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBib2FyZC51bnNlbGVjdChzdGF0ZSk7XG4gICAgICAgICAgICAgICAgc3RhdGUuZG9tLnJlZHJhdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtb3ZlKG9yaWcsIGRlc3QpIHtcbiAgICAgICAgICAgIGFuaW1fMS5hbmltKHN0YXRlID0+IGJvYXJkLmJhc2VNb3ZlKHN0YXRlLCBvcmlnLCBkZXN0KSwgc3RhdGUpO1xuICAgICAgICB9LFxuICAgICAgICBuZXdQaWVjZShwaWVjZSwga2V5KSB7XG4gICAgICAgICAgICBhbmltXzEuYW5pbShzdGF0ZSA9PiBib2FyZC5iYXNlTmV3UGllY2Uoc3RhdGUsIHBpZWNlLCBrZXkpLCBzdGF0ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHBsYXlQcmVtb3ZlKCkge1xuICAgICAgICAgICAgaWYgKHN0YXRlLnByZW1vdmFibGUuY3VycmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChhbmltXzEuYW5pbShib2FyZC5wbGF5UHJlbW92ZSwgc3RhdGUpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5kb20ucmVkcmF3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIHBsYXlQcmVkcm9wKHZhbGlkYXRlKSB7XG4gICAgICAgICAgICBpZiAoc3RhdGUucHJlZHJvcHBhYmxlLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBib2FyZC5wbGF5UHJlZHJvcChzdGF0ZSwgdmFsaWRhdGUpO1xuICAgICAgICAgICAgICAgIHN0YXRlLmRvbS5yZWRyYXcoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBjYW5jZWxQcmVtb3ZlKCkge1xuICAgICAgICAgICAgYW5pbV8xLnJlbmRlcihib2FyZC51bnNldFByZW1vdmUsIHN0YXRlKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FuY2VsUHJlZHJvcCgpIHtcbiAgICAgICAgICAgIGFuaW1fMS5yZW5kZXIoYm9hcmQudW5zZXRQcmVkcm9wLCBzdGF0ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNhbmNlbE1vdmUoKSB7XG4gICAgICAgICAgICBhbmltXzEucmVuZGVyKHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICBib2FyZC5jYW5jZWxNb3ZlKHN0YXRlKTtcbiAgICAgICAgICAgICAgICBkcmFnXzEuY2FuY2VsKHN0YXRlKTtcbiAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGFuaW1fMS5yZW5kZXIoc3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgIGJvYXJkLnN0b3Aoc3RhdGUpO1xuICAgICAgICAgICAgICAgIGRyYWdfMS5jYW5jZWwoc3RhdGUpO1xuICAgICAgICAgICAgfSwgc3RhdGUpO1xuICAgICAgICB9LFxuICAgICAgICBleHBsb2RlKGtleXMpIHtcbiAgICAgICAgICAgIGV4cGxvc2lvbl8xLmV4cGxvc2lvbihzdGF0ZSwga2V5cyk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEF1dG9TaGFwZXMoc2hhcGVzKSB7XG4gICAgICAgICAgICBhbmltXzEucmVuZGVyKHN0YXRlID0+IChzdGF0ZS5kcmF3YWJsZS5hdXRvU2hhcGVzID0gc2hhcGVzKSwgc3RhdGUpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRTaGFwZXMoc2hhcGVzKSB7XG4gICAgICAgICAgICBhbmltXzEucmVuZGVyKHN0YXRlID0+IChzdGF0ZS5kcmF3YWJsZS5zaGFwZXMgPSBzaGFwZXMpLCBzdGF0ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEtleUF0RG9tUG9zKHBvcykge1xuICAgICAgICAgICAgcmV0dXJuIGJvYXJkLmdldEtleUF0RG9tUG9zKHBvcywgYm9hcmQud2hpdGVQb3Yoc3RhdGUpLCBzdGF0ZS5kb20uYm91bmRzKCkpO1xuICAgICAgICB9LFxuICAgICAgICByZWRyYXdBbGwsXG4gICAgICAgIGRyYWdOZXdQaWVjZShwaWVjZSwgZXZlbnQsIGZvcmNlKSB7XG4gICAgICAgICAgICBkcmFnXzEuZHJhZ05ld1BpZWNlKHN0YXRlLCBwaWVjZSwgZXZlbnQsIGZvcmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgICAgIGJvYXJkLnN0b3Aoc3RhdGUpO1xuICAgICAgICAgICAgc3RhdGUuZG9tLnVuYmluZCAmJiBzdGF0ZS5kb20udW5iaW5kKCk7XG4gICAgICAgICAgICBzdGF0ZS5kb20uZGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuZXhwb3J0cy5zdGFydCA9IHN0YXJ0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBpLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0cyA9IHZvaWQgMDtcbmNvbnN0IGZlbiA9IHJlcXVpcmUoXCIuL2ZlblwiKTtcbmNvbnN0IHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5mdW5jdGlvbiBkZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwaWVjZXM6IGZlbi5yZWFkKGZlbi5pbml0aWFsKSxcbiAgICAgICAgb3JpZW50YXRpb246ICd3aGl0ZScsXG4gICAgICAgIHR1cm5Db2xvcjogJ3doaXRlJyxcbiAgICAgICAgY29vcmRpbmF0ZXM6IHRydWUsXG4gICAgICAgIGF1dG9DYXN0bGU6IHRydWUsXG4gICAgICAgIHZpZXdPbmx5OiBmYWxzZSxcbiAgICAgICAgZGlzYWJsZUNvbnRleHRNZW51OiBmYWxzZSxcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxuICAgICAgICBhZGRQaWVjZVpJbmRleDogZmFsc2UsXG4gICAgICAgIHBpZWNlS2V5OiBmYWxzZSxcbiAgICAgICAgaGlnaGxpZ2h0OiB7XG4gICAgICAgICAgICBsYXN0TW92ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNoZWNrOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBhbmltYXRpb246IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgICB9LFxuICAgICAgICBtb3ZhYmxlOiB7XG4gICAgICAgICAgICBmcmVlOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICdib3RoJyxcbiAgICAgICAgICAgIHNob3dEZXN0czogdHJ1ZSxcbiAgICAgICAgICAgIGV2ZW50czoge30sXG4gICAgICAgICAgICByb29rQ2FzdGxlOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBwcmVtb3ZhYmxlOiB7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgc2hvd0Rlc3RzOiB0cnVlLFxuICAgICAgICAgICAgY2FzdGxlOiB0cnVlLFxuICAgICAgICAgICAgZXZlbnRzOiB7fSxcbiAgICAgICAgfSxcbiAgICAgICAgcHJlZHJvcHBhYmxlOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGV2ZW50czoge30sXG4gICAgICAgIH0sXG4gICAgICAgIGRyYWdnYWJsZToge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRpc3RhbmNlOiAzLFxuICAgICAgICAgICAgYXV0b0Rpc3RhbmNlOiB0cnVlLFxuICAgICAgICAgICAgc2hvd0dob3N0OiB0cnVlLFxuICAgICAgICAgICAgZGVsZXRlT25Ecm9wT2ZmOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgZHJvcG1vZGU6IHtcbiAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHNlbGVjdGFibGU6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIHN0YXRzOiB7XG4gICAgICAgICAgICBkcmFnZ2VkOiAhKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyksXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czoge30sXG4gICAgICAgIGRyYXdhYmxlOiB7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGRlZmF1bHRTbmFwVG9WYWxpZE1vdmU6IHRydWUsXG4gICAgICAgICAgICBlcmFzZU9uQ2xpY2s6IHRydWUsXG4gICAgICAgICAgICBzaGFwZXM6IFtdLFxuICAgICAgICAgICAgYXV0b1NoYXBlczogW10sXG4gICAgICAgICAgICBicnVzaGVzOiB7XG4gICAgICAgICAgICAgICAgZ3JlZW46IHsga2V5OiAnZycsIGNvbG9yOiAnIzE1NzgxQicsIG9wYWNpdHk6IDEsIGxpbmVXaWR0aDogMTAgfSxcbiAgICAgICAgICAgICAgICByZWQ6IHsga2V5OiAncicsIGNvbG9yOiAnIzg4MjAyMCcsIG9wYWNpdHk6IDEsIGxpbmVXaWR0aDogMTAgfSxcbiAgICAgICAgICAgICAgICBibHVlOiB7IGtleTogJ2InLCBjb2xvcjogJyMwMDMwODgnLCBvcGFjaXR5OiAxLCBsaW5lV2lkdGg6IDEwIH0sXG4gICAgICAgICAgICAgICAgeWVsbG93OiB7IGtleTogJ3knLCBjb2xvcjogJyNlNjhmMDAnLCBvcGFjaXR5OiAxLCBsaW5lV2lkdGg6IDEwIH0sXG4gICAgICAgICAgICAgICAgcGFsZUJsdWU6IHsga2V5OiAncGInLCBjb2xvcjogJyMwMDMwODgnLCBvcGFjaXR5OiAwLjQsIGxpbmVXaWR0aDogMTUgfSxcbiAgICAgICAgICAgICAgICBwYWxlR3JlZW46IHsga2V5OiAncGcnLCBjb2xvcjogJyMxNTc4MUInLCBvcGFjaXR5OiAwLjQsIGxpbmVXaWR0aDogMTUgfSxcbiAgICAgICAgICAgICAgICBwYWxlUmVkOiB7IGtleTogJ3ByJywgY29sb3I6ICcjODgyMDIwJywgb3BhY2l0eTogMC40LCBsaW5lV2lkdGg6IDE1IH0sXG4gICAgICAgICAgICAgICAgcGFsZUdyZXk6IHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGdyJyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNGE0YTRhJyxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC4zNSxcbiAgICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAxNSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBpZWNlczoge1xuICAgICAgICAgICAgICAgIGJhc2VVcmw6ICdodHRwczovL2xpY2hlc3MxLm9yZy9hc3NldHMvcGllY2UvY2J1cm5ldHQvJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcmV2U3ZnSGFzaDogJycsXG4gICAgICAgIH0sXG4gICAgICAgIGhvbGQ6IHV0aWxfMS50aW1lcigpLFxuICAgIH07XG59XG5leHBvcnRzLmRlZmF1bHRzID0gZGVmYXVsdHM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdGF0ZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2V0QXR0cmlidXRlcyA9IGV4cG9ydHMucmVuZGVyU3ZnID0gZXhwb3J0cy5jcmVhdGVFbGVtZW50ID0gdm9pZCAwO1xuY29uc3QgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodGFnTmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgdGFnTmFtZSk7XG59XG5leHBvcnRzLmNyZWF0ZUVsZW1lbnQgPSBjcmVhdGVFbGVtZW50O1xuZnVuY3Rpb24gcmVuZGVyU3ZnKHN0YXRlLCBzdmcsIGN1c3RvbVN2Zykge1xuICAgIGNvbnN0IGQgPSBzdGF0ZS5kcmF3YWJsZSwgY3VyRCA9IGQuY3VycmVudCwgY3VyID0gY3VyRCAmJiBjdXJELm1vdXNlU3EgPyBjdXJEIDogdW5kZWZpbmVkLCBhcnJvd0Rlc3RzID0gbmV3IE1hcCgpLCBib3VuZHMgPSBzdGF0ZS5kb20uYm91bmRzKCk7XG4gICAgZm9yIChjb25zdCBzIG9mIGQuc2hhcGVzLmNvbmNhdChkLmF1dG9TaGFwZXMpLmNvbmNhdChjdXIgPyBbY3VyXSA6IFtdKSkge1xuICAgICAgICBpZiAocy5kZXN0KVxuICAgICAgICAgICAgYXJyb3dEZXN0cy5zZXQocy5kZXN0LCAoYXJyb3dEZXN0cy5nZXQocy5kZXN0KSB8fCAwKSArIDEpO1xuICAgIH1cbiAgICBjb25zdCBzaGFwZXMgPSBkLnNoYXBlcy5jb25jYXQoZC5hdXRvU2hhcGVzKS5tYXAoKHMpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNoYXBlOiBzLFxuICAgICAgICAgICAgY3VycmVudDogZmFsc2UsXG4gICAgICAgICAgICBoYXNoOiBzaGFwZUhhc2gocywgYXJyb3dEZXN0cywgZmFsc2UsIGJvdW5kcyksXG4gICAgICAgIH07XG4gICAgfSk7XG4gICAgaWYgKGN1cilcbiAgICAgICAgc2hhcGVzLnB1c2goe1xuICAgICAgICAgICAgc2hhcGU6IGN1cixcbiAgICAgICAgICAgIGN1cnJlbnQ6IHRydWUsXG4gICAgICAgICAgICBoYXNoOiBzaGFwZUhhc2goY3VyLCBhcnJvd0Rlc3RzLCB0cnVlLCBib3VuZHMpLFxuICAgICAgICB9KTtcbiAgICBjb25zdCBmdWxsSGFzaCA9IHNoYXBlcy5tYXAoc2MgPT4gc2MuaGFzaCkuam9pbignOycpO1xuICAgIGlmIChmdWxsSGFzaCA9PT0gc3RhdGUuZHJhd2FibGUucHJldlN2Z0hhc2gpXG4gICAgICAgIHJldHVybjtcbiAgICBzdGF0ZS5kcmF3YWJsZS5wcmV2U3ZnSGFzaCA9IGZ1bGxIYXNoO1xuICAgIGNvbnN0IGRlZnNFbCA9IHN2Zy5xdWVyeVNlbGVjdG9yKCdkZWZzJyk7XG4gICAgY29uc3Qgc2hhcGVzRWwgPSBzdmcucXVlcnlTZWxlY3RvcignZycpO1xuICAgIGNvbnN0IGN1c3RvbVN2Z3NFbCA9IGN1c3RvbVN2Zy5xdWVyeVNlbGVjdG9yKCdnJyk7XG4gICAgc3luY0RlZnMoZCwgc2hhcGVzLCBkZWZzRWwpO1xuICAgIHN5bmNTaGFwZXMoc3RhdGUsIHNoYXBlcy5maWx0ZXIocyA9PiAhcy5zaGFwZS5jdXN0b21TdmcpLCBkLmJydXNoZXMsIGFycm93RGVzdHMsIHNoYXBlc0VsKTtcbiAgICBzeW5jU2hhcGVzKHN0YXRlLCBzaGFwZXMuZmlsdGVyKHMgPT4gcy5zaGFwZS5jdXN0b21TdmcpLCBkLmJydXNoZXMsIGFycm93RGVzdHMsIGN1c3RvbVN2Z3NFbCk7XG59XG5leHBvcnRzLnJlbmRlclN2ZyA9IHJlbmRlclN2ZztcbmZ1bmN0aW9uIHN5bmNEZWZzKGQsIHNoYXBlcywgZGVmc0VsKSB7XG4gICAgY29uc3QgYnJ1c2hlcyA9IG5ldyBNYXAoKTtcbiAgICBsZXQgYnJ1c2g7XG4gICAgZm9yIChjb25zdCBzIG9mIHNoYXBlcykge1xuICAgICAgICBpZiAocy5zaGFwZS5kZXN0KSB7XG4gICAgICAgICAgICBicnVzaCA9IGQuYnJ1c2hlc1tzLnNoYXBlLmJydXNoXTtcbiAgICAgICAgICAgIGlmIChzLnNoYXBlLm1vZGlmaWVycylcbiAgICAgICAgICAgICAgICBicnVzaCA9IG1ha2VDdXN0b21CcnVzaChicnVzaCwgcy5zaGFwZS5tb2RpZmllcnMpO1xuICAgICAgICAgICAgYnJ1c2hlcy5zZXQoYnJ1c2gua2V5LCBicnVzaCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qga2V5c0luRG9tID0gbmV3IFNldCgpO1xuICAgIGxldCBlbCA9IGRlZnNFbC5maXJzdENoaWxkO1xuICAgIHdoaWxlIChlbCkge1xuICAgICAgICBrZXlzSW5Eb20uYWRkKGVsLmdldEF0dHJpYnV0ZSgnY2dLZXknKSk7XG4gICAgICAgIGVsID0gZWwubmV4dFNpYmxpbmc7XG4gICAgfVxuICAgIGZvciAoY29uc3QgW2tleSwgYnJ1c2hdIG9mIGJydXNoZXMuZW50cmllcygpKSB7XG4gICAgICAgIGlmICgha2V5c0luRG9tLmhhcyhrZXkpKVxuICAgICAgICAgICAgZGVmc0VsLmFwcGVuZENoaWxkKHJlbmRlck1hcmtlcihicnVzaCkpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHN5bmNTaGFwZXMoc3RhdGUsIHNoYXBlcywgYnJ1c2hlcywgYXJyb3dEZXN0cywgcm9vdCkge1xuICAgIGNvbnN0IGJvdW5kcyA9IHN0YXRlLmRvbS5ib3VuZHMoKSwgaGFzaGVzSW5Eb20gPSBuZXcgTWFwKCksIHRvUmVtb3ZlID0gW107XG4gICAgZm9yIChjb25zdCBzYyBvZiBzaGFwZXMpXG4gICAgICAgIGhhc2hlc0luRG9tLnNldChzYy5oYXNoLCBmYWxzZSk7XG4gICAgbGV0IGVsID0gcm9vdC5maXJzdENoaWxkLCBlbEhhc2g7XG4gICAgd2hpbGUgKGVsKSB7XG4gICAgICAgIGVsSGFzaCA9IGVsLmdldEF0dHJpYnV0ZSgnY2dIYXNoJyk7XG4gICAgICAgIGlmIChoYXNoZXNJbkRvbS5oYXMoZWxIYXNoKSlcbiAgICAgICAgICAgIGhhc2hlc0luRG9tLnNldChlbEhhc2gsIHRydWUpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0b1JlbW92ZS5wdXNoKGVsKTtcbiAgICAgICAgZWwgPSBlbC5uZXh0U2libGluZztcbiAgICB9XG4gICAgZm9yIChjb25zdCBlbCBvZiB0b1JlbW92ZSlcbiAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChlbCk7XG4gICAgZm9yIChjb25zdCBzYyBvZiBzaGFwZXMpIHtcbiAgICAgICAgaWYgKCFoYXNoZXNJbkRvbS5nZXQoc2MuaGFzaCkpXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKHJlbmRlclNoYXBlKHN0YXRlLCBzYywgYnJ1c2hlcywgYXJyb3dEZXN0cywgYm91bmRzKSk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2hhcGVIYXNoKHsgb3JpZywgZGVzdCwgYnJ1c2gsIHBpZWNlLCBtb2RpZmllcnMsIGN1c3RvbVN2ZyB9LCBhcnJvd0Rlc3RzLCBjdXJyZW50LCBib3VuZHMpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICBib3VuZHMud2lkdGgsXG4gICAgICAgIGJvdW5kcy5oZWlnaHQsXG4gICAgICAgIGN1cnJlbnQsXG4gICAgICAgIG9yaWcsXG4gICAgICAgIGRlc3QsXG4gICAgICAgIGJydXNoLFxuICAgICAgICBkZXN0ICYmIChhcnJvd0Rlc3RzLmdldChkZXN0KSB8fCAwKSA+IDEsXG4gICAgICAgIHBpZWNlICYmIHBpZWNlSGFzaChwaWVjZSksXG4gICAgICAgIG1vZGlmaWVycyAmJiBtb2RpZmllcnNIYXNoKG1vZGlmaWVycyksXG4gICAgICAgIGN1c3RvbVN2ZyAmJiBjdXN0b21TdmdIYXNoKGN1c3RvbVN2ZyksXG4gICAgXVxuICAgICAgICAuZmlsdGVyKHggPT4geClcbiAgICAgICAgLmpvaW4oJywnKTtcbn1cbmZ1bmN0aW9uIHBpZWNlSGFzaChwaWVjZSkge1xuICAgIHJldHVybiBbcGllY2UuY29sb3IsIHBpZWNlLnJvbGUsIHBpZWNlLnNjYWxlXS5maWx0ZXIoeCA9PiB4KS5qb2luKCcsJyk7XG59XG5mdW5jdGlvbiBtb2RpZmllcnNIYXNoKG0pIHtcbiAgICByZXR1cm4gJycgKyAobS5saW5lV2lkdGggfHwgJycpO1xufVxuZnVuY3Rpb24gY3VzdG9tU3ZnSGFzaChzKSB7XG4gICAgbGV0IGggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBoID0gKCgoaCA8PCA1KSAtIGgpICsgcy5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgICB9XG4gICAgcmV0dXJuICdjdXN0b20tJyArIGgudG9TdHJpbmcoKTtcbn1cbmZ1bmN0aW9uIHJlbmRlclNoYXBlKHN0YXRlLCB7IHNoYXBlLCBjdXJyZW50LCBoYXNoIH0sIGJydXNoZXMsIGFycm93RGVzdHMsIGJvdW5kcykge1xuICAgIGxldCBlbDtcbiAgICBpZiAoc2hhcGUuY3VzdG9tU3ZnKSB7XG4gICAgICAgIGNvbnN0IG9yaWcgPSBvcmllbnQodXRpbF8xLmtleTJwb3Moc2hhcGUub3JpZyksIHN0YXRlLm9yaWVudGF0aW9uKTtcbiAgICAgICAgZWwgPSByZW5kZXJDdXN0b21Tdmcoc2hhcGUuY3VzdG9tU3ZnLCBvcmlnLCBib3VuZHMpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzaGFwZS5waWVjZSlcbiAgICAgICAgZWwgPSByZW5kZXJQaWVjZShzdGF0ZS5kcmF3YWJsZS5waWVjZXMuYmFzZVVybCwgb3JpZW50KHV0aWxfMS5rZXkycG9zKHNoYXBlLm9yaWcpLCBzdGF0ZS5vcmllbnRhdGlvbiksIHNoYXBlLnBpZWNlLCBib3VuZHMpO1xuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBvcmlnID0gb3JpZW50KHV0aWxfMS5rZXkycG9zKHNoYXBlLm9yaWcpLCBzdGF0ZS5vcmllbnRhdGlvbik7XG4gICAgICAgIGlmIChzaGFwZS5kZXN0KSB7XG4gICAgICAgICAgICBsZXQgYnJ1c2ggPSBicnVzaGVzW3NoYXBlLmJydXNoXTtcbiAgICAgICAgICAgIGlmIChzaGFwZS5tb2RpZmllcnMpXG4gICAgICAgICAgICAgICAgYnJ1c2ggPSBtYWtlQ3VzdG9tQnJ1c2goYnJ1c2gsIHNoYXBlLm1vZGlmaWVycyk7XG4gICAgICAgICAgICBlbCA9IHJlbmRlckFycm93KGJydXNoLCBvcmlnLCBvcmllbnQodXRpbF8xLmtleTJwb3Moc2hhcGUuZGVzdCksIHN0YXRlLm9yaWVudGF0aW9uKSwgY3VycmVudCwgKGFycm93RGVzdHMuZ2V0KHNoYXBlLmRlc3QpIHx8IDApID4gMSwgYm91bmRzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBlbCA9IHJlbmRlckNpcmNsZShicnVzaGVzW3NoYXBlLmJydXNoXSwgb3JpZywgY3VycmVudCwgYm91bmRzKTtcbiAgICB9XG4gICAgZWwuc2V0QXR0cmlidXRlKCdjZ0hhc2gnLCBoYXNoKTtcbiAgICByZXR1cm4gZWw7XG59XG5mdW5jdGlvbiByZW5kZXJDdXN0b21TdmcoY3VzdG9tU3ZnLCBwb3MsIGJvdW5kcykge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gYm91bmRzO1xuICAgIGNvbnN0IHcgPSB3aWR0aCAvIDg7XG4gICAgY29uc3QgaCA9IGhlaWdodCAvIDg7XG4gICAgY29uc3QgeCA9IHBvc1swXSAqIHc7XG4gICAgY29uc3QgeSA9ICg3IC0gcG9zWzFdKSAqIGg7XG4gICAgY29uc3QgZyA9IHNldEF0dHJpYnV0ZXMoY3JlYXRlRWxlbWVudCgnZycpLCB7IHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke3h9LCR7eX0pYCB9KTtcbiAgICBjb25zdCBzdmcgPSBzZXRBdHRyaWJ1dGVzKGNyZWF0ZUVsZW1lbnQoJ3N2ZycpLCB7IHdpZHRoOiB3LCBoZWlnaHQ6IGgsIHZpZXdCb3g6ICcwIDAgMTAwIDEwMCcgfSk7XG4gICAgZy5hcHBlbmRDaGlsZChzdmcpO1xuICAgIHN2Zy5pbm5lckhUTUwgPSBjdXN0b21Tdmc7XG4gICAgcmV0dXJuIGc7XG59XG5mdW5jdGlvbiByZW5kZXJDaXJjbGUoYnJ1c2gsIHBvcywgY3VycmVudCwgYm91bmRzKSB7XG4gICAgY29uc3QgbyA9IHBvczJweChwb3MsIGJvdW5kcyksIHdpZHRocyA9IGNpcmNsZVdpZHRoKGJvdW5kcyksIHJhZGl1cyA9IChib3VuZHMud2lkdGggKyBib3VuZHMuaGVpZ2h0KSAvIDMyO1xuICAgIHJldHVybiBzZXRBdHRyaWJ1dGVzKGNyZWF0ZUVsZW1lbnQoJ2NpcmNsZScpLCB7XG4gICAgICAgIHN0cm9rZTogYnJ1c2guY29sb3IsXG4gICAgICAgICdzdHJva2Utd2lkdGgnOiB3aWR0aHNbY3VycmVudCA/IDAgOiAxXSxcbiAgICAgICAgZmlsbDogJ25vbmUnLFxuICAgICAgICBvcGFjaXR5OiBvcGFjaXR5KGJydXNoLCBjdXJyZW50KSxcbiAgICAgICAgY3g6IG9bMF0sXG4gICAgICAgIGN5OiBvWzFdLFxuICAgICAgICByOiByYWRpdXMgLSB3aWR0aHNbMV0gLyAyLFxuICAgIH0pO1xufVxuZnVuY3Rpb24gcmVuZGVyQXJyb3coYnJ1c2gsIG9yaWcsIGRlc3QsIGN1cnJlbnQsIHNob3J0ZW4sIGJvdW5kcykge1xuICAgIGNvbnN0IG0gPSBhcnJvd01hcmdpbihib3VuZHMsIHNob3J0ZW4gJiYgIWN1cnJlbnQpLCBhID0gcG9zMnB4KG9yaWcsIGJvdW5kcyksIGIgPSBwb3MycHgoZGVzdCwgYm91bmRzKSwgZHggPSBiWzBdIC0gYVswXSwgZHkgPSBiWzFdIC0gYVsxXSwgYW5nbGUgPSBNYXRoLmF0YW4yKGR5LCBkeCksIHhvID0gTWF0aC5jb3MoYW5nbGUpICogbSwgeW8gPSBNYXRoLnNpbihhbmdsZSkgKiBtO1xuICAgIHJldHVybiBzZXRBdHRyaWJ1dGVzKGNyZWF0ZUVsZW1lbnQoJ2xpbmUnKSwge1xuICAgICAgICBzdHJva2U6IGJydXNoLmNvbG9yLFxuICAgICAgICAnc3Ryb2tlLXdpZHRoJzogbGluZVdpZHRoKGJydXNoLCBjdXJyZW50LCBib3VuZHMpLFxuICAgICAgICAnc3Ryb2tlLWxpbmVjYXAnOiAncm91bmQnLFxuICAgICAgICAnbWFya2VyLWVuZCc6ICd1cmwoI2Fycm93aGVhZC0nICsgYnJ1c2gua2V5ICsgJyknLFxuICAgICAgICBvcGFjaXR5OiBvcGFjaXR5KGJydXNoLCBjdXJyZW50KSxcbiAgICAgICAgeDE6IGFbMF0sXG4gICAgICAgIHkxOiBhWzFdLFxuICAgICAgICB4MjogYlswXSAtIHhvLFxuICAgICAgICB5MjogYlsxXSAtIHlvLFxuICAgIH0pO1xufVxuZnVuY3Rpb24gcmVuZGVyUGllY2UoYmFzZVVybCwgcG9zLCBwaWVjZSwgYm91bmRzKSB7XG4gICAgY29uc3QgbyA9IHBvczJweChwb3MsIGJvdW5kcyksIHNpemUgPSAoYm91bmRzLndpZHRoIC8gOCkgKiAocGllY2Uuc2NhbGUgfHwgMSksIG5hbWUgPSBwaWVjZS5jb2xvclswXSArIChwaWVjZS5yb2xlID09PSAna25pZ2h0JyA/ICduJyA6IHBpZWNlLnJvbGVbMF0pLnRvVXBwZXJDYXNlKCk7XG4gICAgcmV0dXJuIHNldEF0dHJpYnV0ZXMoY3JlYXRlRWxlbWVudCgnaW1hZ2UnKSwge1xuICAgICAgICBjbGFzc05hbWU6IGAke3BpZWNlLnJvbGV9ICR7cGllY2UuY29sb3J9YCxcbiAgICAgICAgeDogb1swXSAtIHNpemUgLyAyLFxuICAgICAgICB5OiBvWzFdIC0gc2l6ZSAvIDIsXG4gICAgICAgIHdpZHRoOiBzaXplLFxuICAgICAgICBoZWlnaHQ6IHNpemUsXG4gICAgICAgIGhyZWY6IGJhc2VVcmwgKyBuYW1lICsgJy5zdmcnLFxuICAgIH0pO1xufVxuZnVuY3Rpb24gcmVuZGVyTWFya2VyKGJydXNoKSB7XG4gICAgY29uc3QgbWFya2VyID0gc2V0QXR0cmlidXRlcyhjcmVhdGVFbGVtZW50KCdtYXJrZXInKSwge1xuICAgICAgICBpZDogJ2Fycm93aGVhZC0nICsgYnJ1c2gua2V5LFxuICAgICAgICBvcmllbnQ6ICdhdXRvJyxcbiAgICAgICAgbWFya2VyV2lkdGg6IDQsXG4gICAgICAgIG1hcmtlckhlaWdodDogOCxcbiAgICAgICAgcmVmWDogMi4wNSxcbiAgICAgICAgcmVmWTogMi4wMSxcbiAgICB9KTtcbiAgICBtYXJrZXIuYXBwZW5kQ2hpbGQoc2V0QXR0cmlidXRlcyhjcmVhdGVFbGVtZW50KCdwYXRoJyksIHtcbiAgICAgICAgZDogJ00wLDAgVjQgTDMsMiBaJyxcbiAgICAgICAgZmlsbDogYnJ1c2guY29sb3IsXG4gICAgfSkpO1xuICAgIG1hcmtlci5zZXRBdHRyaWJ1dGUoJ2NnS2V5JywgYnJ1c2gua2V5KTtcbiAgICByZXR1cm4gbWFya2VyO1xufVxuZnVuY3Rpb24gc2V0QXR0cmlidXRlcyhlbCwgYXR0cnMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhdHRycylcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG4gICAgcmV0dXJuIGVsO1xufVxuZXhwb3J0cy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcbmZ1bmN0aW9uIG9yaWVudChwb3MsIGNvbG9yKSB7XG4gICAgcmV0dXJuIGNvbG9yID09PSAnd2hpdGUnID8gcG9zIDogWzcgLSBwb3NbMF0sIDcgLSBwb3NbMV1dO1xufVxuZnVuY3Rpb24gbWFrZUN1c3RvbUJydXNoKGJhc2UsIG1vZGlmaWVycykge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbG9yOiBiYXNlLmNvbG9yLFxuICAgICAgICBvcGFjaXR5OiBNYXRoLnJvdW5kKGJhc2Uub3BhY2l0eSAqIDEwKSAvIDEwLFxuICAgICAgICBsaW5lV2lkdGg6IE1hdGgucm91bmQobW9kaWZpZXJzLmxpbmVXaWR0aCB8fCBiYXNlLmxpbmVXaWR0aCksXG4gICAgICAgIGtleTogW2Jhc2Uua2V5LCBtb2RpZmllcnMubGluZVdpZHRoXS5maWx0ZXIoeCA9PiB4KS5qb2luKCcnKSxcbiAgICB9O1xufVxuZnVuY3Rpb24gY2lyY2xlV2lkdGgoYm91bmRzKSB7XG4gICAgY29uc3QgYmFzZSA9IGJvdW5kcy53aWR0aCAvIDUxMjtcbiAgICByZXR1cm4gWzMgKiBiYXNlLCA0ICogYmFzZV07XG59XG5mdW5jdGlvbiBsaW5lV2lkdGgoYnJ1c2gsIGN1cnJlbnQsIGJvdW5kcykge1xuICAgIHJldHVybiAoKChicnVzaC5saW5lV2lkdGggfHwgMTApICogKGN1cnJlbnQgPyAwLjg1IDogMSkpIC8gNTEyKSAqIGJvdW5kcy53aWR0aDtcbn1cbmZ1bmN0aW9uIG9wYWNpdHkoYnJ1c2gsIGN1cnJlbnQpIHtcbiAgICByZXR1cm4gKGJydXNoLm9wYWNpdHkgfHwgMSkgKiAoY3VycmVudCA/IDAuOSA6IDEpO1xufVxuZnVuY3Rpb24gYXJyb3dNYXJnaW4oYm91bmRzLCBzaG9ydGVuKSB7XG4gICAgcmV0dXJuICgoc2hvcnRlbiA/IDIwIDogMTApIC8gNTEyKSAqIGJvdW5kcy53aWR0aDtcbn1cbmZ1bmN0aW9uIHBvczJweChwb3MsIGJvdW5kcykge1xuICAgIHJldHVybiBbKChwb3NbMF0gKyAwLjUpICogYm91bmRzLndpZHRoKSAvIDgsICgoNy41IC0gcG9zWzFdKSAqIGJvdW5kcy5oZWlnaHQpIC8gOF07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdmcuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlbmRlcldyYXAgPSB2b2lkIDA7XG5jb25zdCB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xuY29uc3Qgc3ZnXzEgPSByZXF1aXJlKFwiLi9zdmdcIik7XG5mdW5jdGlvbiByZW5kZXJXcmFwKGVsZW1lbnQsIHMsIHJlbGF0aXZlKSB7XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NnLXdyYXAnKTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgdHlwZXNfMS5jb2xvcnMpXG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnb3JpZW50YXRpb24tJyArIGMsIHMub3JpZW50YXRpb24gPT09IGMpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnbWFuaXB1bGFibGUnLCAhcy52aWV3T25seSk7XG4gICAgY29uc3QgaGVscGVyID0gdXRpbF8xLmNyZWF0ZUVsKCdjZy1oZWxwZXInKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGhlbHBlcik7XG4gICAgY29uc3QgY29udGFpbmVyID0gdXRpbF8xLmNyZWF0ZUVsKCdjZy1jb250YWluZXInKTtcbiAgICBoZWxwZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICBjb25zdCBib2FyZCA9IHV0aWxfMS5jcmVhdGVFbCgnY2ctYm9hcmQnKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYm9hcmQpO1xuICAgIGxldCBzdmc7XG4gICAgbGV0IGN1c3RvbVN2ZztcbiAgICBpZiAocy5kcmF3YWJsZS52aXNpYmxlICYmICFyZWxhdGl2ZSkge1xuICAgICAgICBzdmcgPSBzdmdfMS5zZXRBdHRyaWJ1dGVzKHN2Z18xLmNyZWF0ZUVsZW1lbnQoJ3N2ZycpLCB7ICdjbGFzcyc6ICdjZy1zaGFwZXMnIH0pO1xuICAgICAgICBzdmcuYXBwZW5kQ2hpbGQoc3ZnXzEuY3JlYXRlRWxlbWVudCgnZGVmcycpKTtcbiAgICAgICAgc3ZnLmFwcGVuZENoaWxkKHN2Z18xLmNyZWF0ZUVsZW1lbnQoJ2cnKSk7XG4gICAgICAgIGN1c3RvbVN2ZyA9IHN2Z18xLnNldEF0dHJpYnV0ZXMoc3ZnXzEuY3JlYXRlRWxlbWVudCgnc3ZnJyksIHsgJ2NsYXNzJzogJ2NnLWN1c3RvbS1zdmdzJyB9KTtcbiAgICAgICAgY3VzdG9tU3ZnLmFwcGVuZENoaWxkKHN2Z18xLmNyZWF0ZUVsZW1lbnQoJ2cnKSk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzdmcpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY3VzdG9tU3ZnKTtcbiAgICB9XG4gICAgaWYgKHMuY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgY29uc3Qgb3JpZW50Q2xhc3MgPSBzLm9yaWVudGF0aW9uID09PSAnYmxhY2snID8gJyBibGFjaycgOiAnJztcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHJlbmRlckNvb3Jkcyh0eXBlc18xLnJhbmtzLCAncmFua3MnICsgb3JpZW50Q2xhc3MpKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHJlbmRlckNvb3Jkcyh0eXBlc18xLmZpbGVzLCAnZmlsZXMnICsgb3JpZW50Q2xhc3MpKTtcbiAgICB9XG4gICAgbGV0IGdob3N0O1xuICAgIGlmIChzLmRyYWdnYWJsZS5zaG93R2hvc3QgJiYgIXJlbGF0aXZlKSB7XG4gICAgICAgIGdob3N0ID0gdXRpbF8xLmNyZWF0ZUVsKCdwaWVjZScsICdnaG9zdCcpO1xuICAgICAgICB1dGlsXzEuc2V0VmlzaWJsZShnaG9zdCwgZmFsc2UpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZ2hvc3QpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBib2FyZCxcbiAgICAgICAgY29udGFpbmVyLFxuICAgICAgICBnaG9zdCxcbiAgICAgICAgc3ZnLFxuICAgICAgICBjdXN0b21TdmcsXG4gICAgfTtcbn1cbmV4cG9ydHMucmVuZGVyV3JhcCA9IHJlbmRlcldyYXA7XG5mdW5jdGlvbiByZW5kZXJDb29yZHMoZWxlbXMsIGNsYXNzTmFtZSkge1xuICAgIGNvbnN0IGVsID0gdXRpbF8xLmNyZWF0ZUVsKCdjb29yZHMnLCBjbGFzc05hbWUpO1xuICAgIGxldCBmO1xuICAgIGZvciAoY29uc3QgZWxlbSBvZiBlbGVtcykge1xuICAgICAgICBmID0gdXRpbF8xLmNyZWF0ZUVsKCdjb29yZCcpO1xuICAgICAgICBmLnRleHRDb250ZW50ID0gZWxlbTtcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoZik7XG4gICAgfVxuICAgIHJldHVybiBlbDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdyYXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRyb3AgPSBleHBvcnRzLmNhbmNlbERyb3BNb2RlID0gZXhwb3J0cy5zZXREcm9wTW9kZSA9IHZvaWQgMDtcbmNvbnN0IGJvYXJkID0gcmVxdWlyZShcIi4vYm9hcmRcIik7XG5jb25zdCB1dGlsID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmNvbnN0IGRyYWdfMSA9IHJlcXVpcmUoXCIuL2RyYWdcIik7XG5mdW5jdGlvbiBzZXREcm9wTW9kZShzLCBwaWVjZSkge1xuICAgIHMuZHJvcG1vZGUgPSB7XG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICAgICAgcGllY2UsXG4gICAgfTtcbiAgICBkcmFnXzEuY2FuY2VsKHMpO1xufVxuZXhwb3J0cy5zZXREcm9wTW9kZSA9IHNldERyb3BNb2RlO1xuZnVuY3Rpb24gY2FuY2VsRHJvcE1vZGUocykge1xuICAgIHMuZHJvcG1vZGUgPSB7XG4gICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgfTtcbn1cbmV4cG9ydHMuY2FuY2VsRHJvcE1vZGUgPSBjYW5jZWxEcm9wTW9kZTtcbmZ1bmN0aW9uIGRyb3AocywgZSkge1xuICAgIGlmICghcy5kcm9wbW9kZS5hY3RpdmUpXG4gICAgICAgIHJldHVybjtcbiAgICBib2FyZC51bnNldFByZW1vdmUocyk7XG4gICAgYm9hcmQudW5zZXRQcmVkcm9wKHMpO1xuICAgIGNvbnN0IHBpZWNlID0gcy5kcm9wbW9kZS5waWVjZTtcbiAgICBpZiAocGllY2UpIHtcbiAgICAgICAgcy5waWVjZXMuc2V0KCdhMCcsIHBpZWNlKTtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB1dGlsLmV2ZW50UG9zaXRpb24oZSk7XG4gICAgICAgIGNvbnN0IGRlc3QgPSBwb3NpdGlvbiAmJiBib2FyZC5nZXRLZXlBdERvbVBvcyhwb3NpdGlvbiwgYm9hcmQud2hpdGVQb3YocyksIHMuZG9tLmJvdW5kcygpKTtcbiAgICAgICAgaWYgKGRlc3QpXG4gICAgICAgICAgICBib2FyZC5kcm9wTmV3UGllY2UocywgJ2EwJywgZGVzdCk7XG4gICAgfVxuICAgIHMuZG9tLnJlZHJhdygpO1xufVxuZXhwb3J0cy5kcm9wID0gZHJvcDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRyb3AuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJpbmREb2N1bWVudCA9IGV4cG9ydHMuYmluZEJvYXJkID0gdm9pZCAwO1xuY29uc3QgZHJhZyA9IHJlcXVpcmUoXCIuL2RyYWdcIik7XG5jb25zdCBkcmF3ID0gcmVxdWlyZShcIi4vZHJhd1wiKTtcbmNvbnN0IGRyb3BfMSA9IHJlcXVpcmUoXCIuL2Ryb3BcIik7XG5jb25zdCB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZnVuY3Rpb24gYmluZEJvYXJkKHMsIGJvdW5kc1VwZGF0ZWQpIHtcbiAgICBjb25zdCBib2FyZEVsID0gcy5kb20uZWxlbWVudHMuYm9hcmQ7XG4gICAgaWYgKCFzLmRvbS5yZWxhdGl2ZSAmJiBzLnJlc2l6YWJsZSAmJiAnUmVzaXplT2JzZXJ2ZXInIGluIHdpbmRvdykge1xuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyB3aW5kb3dbJ1Jlc2l6ZU9ic2VydmVyJ10oYm91bmRzVXBkYXRlZCk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoYm9hcmRFbCk7XG4gICAgfVxuICAgIGlmIChzLnZpZXdPbmx5KVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3Qgb25TdGFydCA9IHN0YXJ0RHJhZ09yRHJhdyhzKTtcbiAgICBib2FyZEVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvblN0YXJ0LCB7XG4gICAgICAgIHBhc3NpdmU6IGZhbHNlLFxuICAgIH0pO1xuICAgIGJvYXJkRWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25TdGFydCwge1xuICAgICAgICBwYXNzaXZlOiBmYWxzZSxcbiAgICB9KTtcbiAgICBpZiAocy5kaXNhYmxlQ29udGV4dE1lbnUgfHwgcy5kcmF3YWJsZS5lbmFibGVkKSB7XG4gICAgICAgIGJvYXJkRWwuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBlID0+IGUucHJldmVudERlZmF1bHQoKSk7XG4gICAgfVxufVxuZXhwb3J0cy5iaW5kQm9hcmQgPSBiaW5kQm9hcmQ7XG5mdW5jdGlvbiBiaW5kRG9jdW1lbnQocywgYm91bmRzVXBkYXRlZCkge1xuICAgIGNvbnN0IHVuYmluZHMgPSBbXTtcbiAgICBpZiAoIXMuZG9tLnJlbGF0aXZlICYmIHMucmVzaXphYmxlICYmICEoJ1Jlc2l6ZU9ic2VydmVyJyBpbiB3aW5kb3cpKSB7XG4gICAgICAgIHVuYmluZHMucHVzaCh1bmJpbmRhYmxlKGRvY3VtZW50LmJvZHksICdjaGVzc2dyb3VuZC5yZXNpemUnLCBib3VuZHNVcGRhdGVkKSk7XG4gICAgfVxuICAgIGlmICghcy52aWV3T25seSkge1xuICAgICAgICBjb25zdCBvbm1vdmUgPSBkcmFnT3JEcmF3KHMsIGRyYWcubW92ZSwgZHJhdy5tb3ZlKTtcbiAgICAgICAgY29uc3Qgb25lbmQgPSBkcmFnT3JEcmF3KHMsIGRyYWcuZW5kLCBkcmF3LmVuZCk7XG4gICAgICAgIGZvciAoY29uc3QgZXYgb2YgWyd0b3VjaG1vdmUnLCAnbW91c2Vtb3ZlJ10pXG4gICAgICAgICAgICB1bmJpbmRzLnB1c2godW5iaW5kYWJsZShkb2N1bWVudCwgZXYsIG9ubW92ZSkpO1xuICAgICAgICBmb3IgKGNvbnN0IGV2IG9mIFsndG91Y2hlbmQnLCAnbW91c2V1cCddKVxuICAgICAgICAgICAgdW5iaW5kcy5wdXNoKHVuYmluZGFibGUoZG9jdW1lbnQsIGV2LCBvbmVuZCkpO1xuICAgICAgICBjb25zdCBvblNjcm9sbCA9ICgpID0+IHMuZG9tLmJvdW5kcy5jbGVhcigpO1xuICAgICAgICB1bmJpbmRzLnB1c2godW5iaW5kYWJsZShkb2N1bWVudCwgJ3Njcm9sbCcsIG9uU2Nyb2xsLCB7IGNhcHR1cmU6IHRydWUsIHBhc3NpdmU6IHRydWUgfSkpO1xuICAgICAgICB1bmJpbmRzLnB1c2godW5iaW5kYWJsZSh3aW5kb3csICdyZXNpemUnLCBvblNjcm9sbCwgeyBwYXNzaXZlOiB0cnVlIH0pKTtcbiAgICB9XG4gICAgcmV0dXJuICgpID0+IHVuYmluZHMuZm9yRWFjaChmID0+IGYoKSk7XG59XG5leHBvcnRzLmJpbmREb2N1bWVudCA9IGJpbmREb2N1bWVudDtcbmZ1bmN0aW9uIHVuYmluZGFibGUoZWwsIGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgIHJldHVybiAoKSA9PiBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xufVxuZnVuY3Rpb24gc3RhcnREcmFnT3JEcmF3KHMpIHtcbiAgICByZXR1cm4gZSA9PiB7XG4gICAgICAgIGlmIChzLmRyYWdnYWJsZS5jdXJyZW50KVxuICAgICAgICAgICAgZHJhZy5jYW5jZWwocyk7XG4gICAgICAgIGVsc2UgaWYgKHMuZHJhd2FibGUuY3VycmVudClcbiAgICAgICAgICAgIGRyYXcuY2FuY2VsKHMpO1xuICAgICAgICBlbHNlIGlmIChlLnNoaWZ0S2V5IHx8IHV0aWxfMS5pc1JpZ2h0QnV0dG9uKGUpKSB7XG4gICAgICAgICAgICBpZiAocy5kcmF3YWJsZS5lbmFibGVkKVxuICAgICAgICAgICAgICAgIGRyYXcuc3RhcnQocywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXMudmlld09ubHkpIHtcbiAgICAgICAgICAgIGlmIChzLmRyb3Btb2RlLmFjdGl2ZSlcbiAgICAgICAgICAgICAgICBkcm9wXzEuZHJvcChzLCBlKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBkcmFnLnN0YXJ0KHMsIGUpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGRyYWdPckRyYXcocywgd2l0aERyYWcsIHdpdGhEcmF3KSB7XG4gICAgcmV0dXJuIGUgPT4ge1xuICAgICAgICBpZiAocy5kcmF3YWJsZS5jdXJyZW50KSB7XG4gICAgICAgICAgICBpZiAocy5kcmF3YWJsZS5lbmFibGVkKVxuICAgICAgICAgICAgICAgIHdpdGhEcmF3KHMsIGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFzLnZpZXdPbmx5KVxuICAgICAgICAgICAgd2l0aERyYWcocywgZSk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV2ZW50cy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudXBkYXRlQm91bmRzID0gZXhwb3J0cy5yZW5kZXIgPSB2b2lkIDA7XG5jb25zdCB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuY29uc3QgYm9hcmRfMSA9IHJlcXVpcmUoXCIuL2JvYXJkXCIpO1xuY29uc3QgdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5mdW5jdGlvbiByZW5kZXIocykge1xuICAgIGNvbnN0IGFzV2hpdGUgPSBib2FyZF8xLndoaXRlUG92KHMpLCBwb3NUb1RyYW5zbGF0ZSA9IHMuZG9tLnJlbGF0aXZlID8gdXRpbC5wb3NUb1RyYW5zbGF0ZVJlbCA6IHV0aWwucG9zVG9UcmFuc2xhdGVBYnMocy5kb20uYm91bmRzKCkpLCB0cmFuc2xhdGUgPSBzLmRvbS5yZWxhdGl2ZSA/IHV0aWwudHJhbnNsYXRlUmVsIDogdXRpbC50cmFuc2xhdGVBYnMsIGJvYXJkRWwgPSBzLmRvbS5lbGVtZW50cy5ib2FyZCwgcGllY2VzID0gcy5waWVjZXMsIGN1ckFuaW0gPSBzLmFuaW1hdGlvbi5jdXJyZW50LCBhbmltcyA9IGN1ckFuaW0gPyBjdXJBbmltLnBsYW4uYW5pbXMgOiBuZXcgTWFwKCksIGZhZGluZ3MgPSBjdXJBbmltID8gY3VyQW5pbS5wbGFuLmZhZGluZ3MgOiBuZXcgTWFwKCksIGN1ckRyYWcgPSBzLmRyYWdnYWJsZS5jdXJyZW50LCBzcXVhcmVzID0gY29tcHV0ZVNxdWFyZUNsYXNzZXMocyksIHNhbWVQaWVjZXMgPSBuZXcgU2V0KCksIHNhbWVTcXVhcmVzID0gbmV3IFNldCgpLCBtb3ZlZFBpZWNlcyA9IG5ldyBNYXAoKSwgbW92ZWRTcXVhcmVzID0gbmV3IE1hcCgpO1xuICAgIGxldCBrLCBlbCwgcGllY2VBdEtleSwgZWxQaWVjZU5hbWUsIGFuaW0sIGZhZGluZywgcE12ZHNldCwgcE12ZCwgc012ZHNldCwgc012ZDtcbiAgICBlbCA9IGJvYXJkRWwuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAoZWwpIHtcbiAgICAgICAgayA9IGVsLmNnS2V5O1xuICAgICAgICBpZiAoaXNQaWVjZU5vZGUoZWwpKSB7XG4gICAgICAgICAgICBwaWVjZUF0S2V5ID0gcGllY2VzLmdldChrKTtcbiAgICAgICAgICAgIGFuaW0gPSBhbmltcy5nZXQoayk7XG4gICAgICAgICAgICBmYWRpbmcgPSBmYWRpbmdzLmdldChrKTtcbiAgICAgICAgICAgIGVsUGllY2VOYW1lID0gZWwuY2dQaWVjZTtcbiAgICAgICAgICAgIGlmIChlbC5jZ0RyYWdnaW5nICYmICghY3VyRHJhZyB8fCBjdXJEcmFnLm9yaWcgIT09IGspKSB7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoZWwsIHBvc1RvVHJhbnNsYXRlKHV0aWxfMS5rZXkycG9zKGspLCBhc1doaXRlKSk7XG4gICAgICAgICAgICAgICAgZWwuY2dEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFmYWRpbmcgJiYgZWwuY2dGYWRpbmcpIHtcbiAgICAgICAgICAgICAgICBlbC5jZ0ZhZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGluZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBpZWNlQXRLZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5pbSAmJiBlbC5jZ0FuaW1hdGluZyAmJiBlbFBpZWNlTmFtZSA9PT0gcGllY2VOYW1lT2YocGllY2VBdEtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zID0gdXRpbF8xLmtleTJwb3Moayk7XG4gICAgICAgICAgICAgICAgICAgIHBvc1swXSArPSBhbmltWzJdO1xuICAgICAgICAgICAgICAgICAgICBwb3NbMV0gKz0gYW5pbVszXTtcbiAgICAgICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnYW5pbScpO1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGUoZWwsIHBvc1RvVHJhbnNsYXRlKHBvcywgYXNXaGl0ZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChlbC5jZ0FuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICBlbC5jZ0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJyk7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZShlbCwgcG9zVG9UcmFuc2xhdGUodXRpbF8xLmtleTJwb3MoayksIGFzV2hpdGUpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMuYWRkUGllY2VaSW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS56SW5kZXggPSBwb3NaSW5kZXgodXRpbF8xLmtleTJwb3MoayksIGFzV2hpdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZWxQaWVjZU5hbWUgPT09IHBpZWNlTmFtZU9mKHBpZWNlQXRLZXkpICYmICghZmFkaW5nIHx8ICFlbC5jZ0ZhZGluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgc2FtZVBpZWNlcy5hZGQoayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmFkaW5nICYmIGVsUGllY2VOYW1lID09PSBwaWVjZU5hbWVPZihmYWRpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdmYWRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLmNnRmFkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGVuZFZhbHVlKG1vdmVkUGllY2VzLCBlbFBpZWNlTmFtZSwgZWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYXBwZW5kVmFsdWUobW92ZWRQaWVjZXMsIGVsUGllY2VOYW1lLCBlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNTcXVhcmVOb2RlKGVsKSkge1xuICAgICAgICAgICAgY29uc3QgY24gPSBlbC5jbGFzc05hbWU7XG4gICAgICAgICAgICBpZiAoc3F1YXJlcy5nZXQoaykgPT09IGNuKVxuICAgICAgICAgICAgICAgIHNhbWVTcXVhcmVzLmFkZChrKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBhcHBlbmRWYWx1ZShtb3ZlZFNxdWFyZXMsIGNuLCBlbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWwgPSBlbC5uZXh0U2libGluZztcbiAgICB9XG4gICAgZm9yIChjb25zdCBbc2ssIGNsYXNzTmFtZV0gb2Ygc3F1YXJlcykge1xuICAgICAgICBpZiAoIXNhbWVTcXVhcmVzLmhhcyhzaykpIHtcbiAgICAgICAgICAgIHNNdmRzZXQgPSBtb3ZlZFNxdWFyZXMuZ2V0KGNsYXNzTmFtZSk7XG4gICAgICAgICAgICBzTXZkID0gc012ZHNldCAmJiBzTXZkc2V0LnBvcCgpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRpb24gPSBwb3NUb1RyYW5zbGF0ZSh1dGlsXzEua2V5MnBvcyhzayksIGFzV2hpdGUpO1xuICAgICAgICAgICAgaWYgKHNNdmQpIHtcbiAgICAgICAgICAgICAgICBzTXZkLmNnS2V5ID0gc2s7XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKHNNdmQsIHRyYW5zbGF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNxdWFyZU5vZGUgPSB1dGlsXzEuY3JlYXRlRWwoJ3NxdWFyZScsIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgc3F1YXJlTm9kZS5jZ0tleSA9IHNrO1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZShzcXVhcmVOb2RlLCB0cmFuc2xhdGlvbik7XG4gICAgICAgICAgICAgICAgYm9hcmRFbC5pbnNlcnRCZWZvcmUoc3F1YXJlTm9kZSwgYm9hcmRFbC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IFtrLCBwXSBvZiBwaWVjZXMpIHtcbiAgICAgICAgYW5pbSA9IGFuaW1zLmdldChrKTtcbiAgICAgICAgaWYgKCFzYW1lUGllY2VzLmhhcyhrKSkge1xuICAgICAgICAgICAgcE12ZHNldCA9IG1vdmVkUGllY2VzLmdldChwaWVjZU5hbWVPZihwKSk7XG4gICAgICAgICAgICBwTXZkID0gcE12ZHNldCAmJiBwTXZkc2V0LnBvcCgpO1xuICAgICAgICAgICAgaWYgKHBNdmQpIHtcbiAgICAgICAgICAgICAgICBwTXZkLmNnS2V5ID0gaztcbiAgICAgICAgICAgICAgICBpZiAocE12ZC5jZ0ZhZGluZykge1xuICAgICAgICAgICAgICAgICAgICBwTXZkLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGluZycpO1xuICAgICAgICAgICAgICAgICAgICBwTXZkLmNnRmFkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHBvcyA9IHV0aWxfMS5rZXkycG9zKGspO1xuICAgICAgICAgICAgICAgIGlmIChzLmFkZFBpZWNlWkluZGV4KVxuICAgICAgICAgICAgICAgICAgICBwTXZkLnN0eWxlLnpJbmRleCA9IHBvc1pJbmRleChwb3MsIGFzV2hpdGUpO1xuICAgICAgICAgICAgICAgIGlmIChhbmltKSB7XG4gICAgICAgICAgICAgICAgICAgIHBNdmQuY2dBbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBwTXZkLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKTtcbiAgICAgICAgICAgICAgICAgICAgcG9zWzBdICs9IGFuaW1bMl07XG4gICAgICAgICAgICAgICAgICAgIHBvc1sxXSArPSBhbmltWzNdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUocE12ZCwgcG9zVG9UcmFuc2xhdGUocG9zLCBhc1doaXRlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwaWVjZU5hbWUgPSBwaWVjZU5hbWVPZihwKSwgcGllY2VOb2RlID0gdXRpbF8xLmNyZWF0ZUVsKCdwaWVjZScsIHBpZWNlTmFtZSksIHBvcyA9IHV0aWxfMS5rZXkycG9zKGspO1xuICAgICAgICAgICAgICAgIHBpZWNlTm9kZS5jZ1BpZWNlID0gcGllY2VOYW1lO1xuICAgICAgICAgICAgICAgIHBpZWNlTm9kZS5jZ0tleSA9IGs7XG4gICAgICAgICAgICAgICAgaWYgKGFuaW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcGllY2VOb2RlLmNnQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcG9zWzBdICs9IGFuaW1bMl07XG4gICAgICAgICAgICAgICAgICAgIHBvc1sxXSArPSBhbmltWzNdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUocGllY2VOb2RlLCBwb3NUb1RyYW5zbGF0ZShwb3MsIGFzV2hpdGUpKTtcbiAgICAgICAgICAgICAgICBpZiAocy5hZGRQaWVjZVpJbmRleClcbiAgICAgICAgICAgICAgICAgICAgcGllY2VOb2RlLnN0eWxlLnpJbmRleCA9IHBvc1pJbmRleChwb3MsIGFzV2hpdGUpO1xuICAgICAgICAgICAgICAgIGJvYXJkRWwuYXBwZW5kQ2hpbGQocGllY2VOb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IG5vZGVzIG9mIG1vdmVkUGllY2VzLnZhbHVlcygpKVxuICAgICAgICByZW1vdmVOb2RlcyhzLCBub2Rlcyk7XG4gICAgZm9yIChjb25zdCBub2RlcyBvZiBtb3ZlZFNxdWFyZXMudmFsdWVzKCkpXG4gICAgICAgIHJlbW92ZU5vZGVzKHMsIG5vZGVzKTtcbn1cbmV4cG9ydHMucmVuZGVyID0gcmVuZGVyO1xuZnVuY3Rpb24gdXBkYXRlQm91bmRzKHMpIHtcbiAgICBpZiAocy5kb20ucmVsYXRpdmUpXG4gICAgICAgIHJldHVybjtcbiAgICBjb25zdCBhc1doaXRlID0gYm9hcmRfMS53aGl0ZVBvdihzKSwgcG9zVG9UcmFuc2xhdGUgPSB1dGlsLnBvc1RvVHJhbnNsYXRlQWJzKHMuZG9tLmJvdW5kcygpKTtcbiAgICBsZXQgZWwgPSBzLmRvbS5lbGVtZW50cy5ib2FyZC5maXJzdENoaWxkO1xuICAgIHdoaWxlIChlbCkge1xuICAgICAgICBpZiAoKGlzUGllY2VOb2RlKGVsKSAmJiAhZWwuY2dBbmltYXRpbmcpIHx8IGlzU3F1YXJlTm9kZShlbCkpIHtcbiAgICAgICAgICAgIHV0aWwudHJhbnNsYXRlQWJzKGVsLCBwb3NUb1RyYW5zbGF0ZSh1dGlsXzEua2V5MnBvcyhlbC5jZ0tleSksIGFzV2hpdGUpKTtcbiAgICAgICAgfVxuICAgICAgICBlbCA9IGVsLm5leHRTaWJsaW5nO1xuICAgIH1cbn1cbmV4cG9ydHMudXBkYXRlQm91bmRzID0gdXBkYXRlQm91bmRzO1xuZnVuY3Rpb24gaXNQaWVjZU5vZGUoZWwpIHtcbiAgICByZXR1cm4gZWwudGFnTmFtZSA9PT0gJ1BJRUNFJztcbn1cbmZ1bmN0aW9uIGlzU3F1YXJlTm9kZShlbCkge1xuICAgIHJldHVybiBlbC50YWdOYW1lID09PSAnU1FVQVJFJztcbn1cbmZ1bmN0aW9uIHJlbW92ZU5vZGVzKHMsIG5vZGVzKSB7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKVxuICAgICAgICBzLmRvbS5lbGVtZW50cy5ib2FyZC5yZW1vdmVDaGlsZChub2RlKTtcbn1cbmZ1bmN0aW9uIHBvc1pJbmRleChwb3MsIGFzV2hpdGUpIHtcbiAgICBsZXQgeiA9IDIgKyBwb3NbMV0gKiA4ICsgKDcgLSBwb3NbMF0pO1xuICAgIGlmIChhc1doaXRlKVxuICAgICAgICB6ID0gNjcgLSB6O1xuICAgIHJldHVybiB6ICsgJyc7XG59XG5mdW5jdGlvbiBwaWVjZU5hbWVPZihwaWVjZSkge1xuICAgIHJldHVybiBgJHtwaWVjZS5jb2xvcn0gJHtwaWVjZS5yb2xlfWA7XG59XG5mdW5jdGlvbiBjb21wdXRlU3F1YXJlQ2xhc3NlcyhzKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IHNxdWFyZXMgPSBuZXcgTWFwKCk7XG4gICAgaWYgKHMubGFzdE1vdmUgJiYgcy5oaWdobGlnaHQubGFzdE1vdmUpXG4gICAgICAgIGZvciAoY29uc3QgayBvZiBzLmxhc3RNb3ZlKSB7XG4gICAgICAgICAgICBhZGRTcXVhcmUoc3F1YXJlcywgaywgJ2xhc3QtbW92ZScpO1xuICAgICAgICB9XG4gICAgaWYgKHMuY2hlY2sgJiYgcy5oaWdobGlnaHQuY2hlY2spXG4gICAgICAgIGFkZFNxdWFyZShzcXVhcmVzLCBzLmNoZWNrLCAnY2hlY2snKTtcbiAgICBpZiAocy5zZWxlY3RlZCkge1xuICAgICAgICBhZGRTcXVhcmUoc3F1YXJlcywgcy5zZWxlY3RlZCwgJ3NlbGVjdGVkJyk7XG4gICAgICAgIGlmIChzLm1vdmFibGUuc2hvd0Rlc3RzKSB7XG4gICAgICAgICAgICBjb25zdCBkZXN0cyA9IChfYSA9IHMubW92YWJsZS5kZXN0cykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldChzLnNlbGVjdGVkKTtcbiAgICAgICAgICAgIGlmIChkZXN0cylcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGsgb2YgZGVzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkU3F1YXJlKHNxdWFyZXMsIGssICdtb3ZlLWRlc3QnICsgKHMucGllY2VzLmhhcyhrKSA/ICcgb2MnIDogJycpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwRGVzdHMgPSBzLnByZW1vdmFibGUuZGVzdHM7XG4gICAgICAgICAgICBpZiAocERlc3RzKVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgayBvZiBwRGVzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkU3F1YXJlKHNxdWFyZXMsIGssICdwcmVtb3ZlLWRlc3QnICsgKHMucGllY2VzLmhhcyhrKSA/ICcgb2MnIDogJycpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcHJlbW92ZSA9IHMucHJlbW92YWJsZS5jdXJyZW50O1xuICAgIGlmIChwcmVtb3ZlKVxuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgcHJlbW92ZSlcbiAgICAgICAgICAgIGFkZFNxdWFyZShzcXVhcmVzLCBrLCAnY3VycmVudC1wcmVtb3ZlJyk7XG4gICAgZWxzZSBpZiAocy5wcmVkcm9wcGFibGUuY3VycmVudClcbiAgICAgICAgYWRkU3F1YXJlKHNxdWFyZXMsIHMucHJlZHJvcHBhYmxlLmN1cnJlbnQua2V5LCAnY3VycmVudC1wcmVtb3ZlJyk7XG4gICAgY29uc3QgbyA9IHMuZXhwbG9kaW5nO1xuICAgIGlmIChvKVxuICAgICAgICBmb3IgKGNvbnN0IGsgb2Ygby5rZXlzKVxuICAgICAgICAgICAgYWRkU3F1YXJlKHNxdWFyZXMsIGssICdleHBsb2RpbmcnICsgby5zdGFnZSk7XG4gICAgcmV0dXJuIHNxdWFyZXM7XG59XG5mdW5jdGlvbiBhZGRTcXVhcmUoc3F1YXJlcywga2V5LCBrbGFzcykge1xuICAgIGNvbnN0IGNsYXNzZXMgPSBzcXVhcmVzLmdldChrZXkpO1xuICAgIGlmIChjbGFzc2VzKVxuICAgICAgICBzcXVhcmVzLnNldChrZXksIGAke2NsYXNzZXN9ICR7a2xhc3N9YCk7XG4gICAgZWxzZVxuICAgICAgICBzcXVhcmVzLnNldChrZXksIGtsYXNzKTtcbn1cbmZ1bmN0aW9uIGFwcGVuZFZhbHVlKG1hcCwga2V5LCB2YWx1ZSkge1xuICAgIGNvbnN0IGFyciA9IG1hcC5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKVxuICAgICAgICBhcnIucHVzaCh2YWx1ZSk7XG4gICAgZWxzZVxuICAgICAgICBtYXAuc2V0KGtleSwgW3ZhbHVlXSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZW5kZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkNoZXNzZ3JvdW5kID0gdm9pZCAwO1xuY29uc3QgYXBpXzEgPSByZXF1aXJlKFwiLi9hcGlcIik7XG5jb25zdCBjb25maWdfMSA9IHJlcXVpcmUoXCIuL2NvbmZpZ1wiKTtcbmNvbnN0IHN0YXRlXzEgPSByZXF1aXJlKFwiLi9zdGF0ZVwiKTtcbmNvbnN0IHdyYXBfMSA9IHJlcXVpcmUoXCIuL3dyYXBcIik7XG5jb25zdCBldmVudHMgPSByZXF1aXJlKFwiLi9ldmVudHNcIik7XG5jb25zdCByZW5kZXJfMSA9IHJlcXVpcmUoXCIuL3JlbmRlclwiKTtcbmNvbnN0IHN2ZyA9IHJlcXVpcmUoXCIuL3N2Z1wiKTtcbmNvbnN0IHV0aWwgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZnVuY3Rpb24gQ2hlc3Nncm91bmQoZWxlbWVudCwgY29uZmlnKSB7XG4gICAgY29uc3QgbWF5YmVTdGF0ZSA9IHN0YXRlXzEuZGVmYXVsdHMoKTtcbiAgICBjb25maWdfMS5jb25maWd1cmUobWF5YmVTdGF0ZSwgY29uZmlnIHx8IHt9KTtcbiAgICBmdW5jdGlvbiByZWRyYXdBbGwoKSB7XG4gICAgICAgIGNvbnN0IHByZXZVbmJpbmQgPSAnZG9tJyBpbiBtYXliZVN0YXRlID8gbWF5YmVTdGF0ZS5kb20udW5iaW5kIDogdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCByZWxhdGl2ZSA9IG1heWJlU3RhdGUudmlld09ubHkgJiYgIW1heWJlU3RhdGUuZHJhd2FibGUudmlzaWJsZSwgZWxlbWVudHMgPSB3cmFwXzEucmVuZGVyV3JhcChlbGVtZW50LCBtYXliZVN0YXRlLCByZWxhdGl2ZSksIGJvdW5kcyA9IHV0aWwubWVtbygoKSA9PiBlbGVtZW50cy5ib2FyZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksIHJlZHJhd05vdyA9IChza2lwU3ZnKSA9PiB7XG4gICAgICAgICAgICByZW5kZXJfMS5yZW5kZXIoc3RhdGUpO1xuICAgICAgICAgICAgaWYgKCFza2lwU3ZnICYmIGVsZW1lbnRzLnN2ZylcbiAgICAgICAgICAgICAgICBzdmcucmVuZGVyU3ZnKHN0YXRlLCBlbGVtZW50cy5zdmcsIGVsZW1lbnRzLmN1c3RvbVN2Zyk7XG4gICAgICAgIH0sIGJvdW5kc1VwZGF0ZWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBib3VuZHMuY2xlYXIoKTtcbiAgICAgICAgICAgIHJlbmRlcl8xLnVwZGF0ZUJvdW5kcyhzdGF0ZSk7XG4gICAgICAgICAgICBpZiAoZWxlbWVudHMuc3ZnKVxuICAgICAgICAgICAgICAgIHN2Zy5yZW5kZXJTdmcoc3RhdGUsIGVsZW1lbnRzLnN2ZywgZWxlbWVudHMuY3VzdG9tU3ZnKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBtYXliZVN0YXRlO1xuICAgICAgICBzdGF0ZS5kb20gPSB7XG4gICAgICAgICAgICBlbGVtZW50cyxcbiAgICAgICAgICAgIGJvdW5kcyxcbiAgICAgICAgICAgIHJlZHJhdzogZGVib3VuY2VSZWRyYXcocmVkcmF3Tm93KSxcbiAgICAgICAgICAgIHJlZHJhd05vdyxcbiAgICAgICAgICAgIHVuYmluZDogcHJldlVuYmluZCxcbiAgICAgICAgICAgIHJlbGF0aXZlLFxuICAgICAgICB9O1xuICAgICAgICBzdGF0ZS5kcmF3YWJsZS5wcmV2U3ZnSGFzaCA9ICcnO1xuICAgICAgICByZWRyYXdOb3coZmFsc2UpO1xuICAgICAgICBldmVudHMuYmluZEJvYXJkKHN0YXRlLCBib3VuZHNVcGRhdGVkKTtcbiAgICAgICAgaWYgKCFwcmV2VW5iaW5kKVxuICAgICAgICAgICAgc3RhdGUuZG9tLnVuYmluZCA9IGV2ZW50cy5iaW5kRG9jdW1lbnQoc3RhdGUsIGJvdW5kc1VwZGF0ZWQpO1xuICAgICAgICBzdGF0ZS5ldmVudHMuaW5zZXJ0ICYmIHN0YXRlLmV2ZW50cy5pbnNlcnQoZWxlbWVudHMpO1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuICAgIHJldHVybiBhcGlfMS5zdGFydChyZWRyYXdBbGwoKSwgcmVkcmF3QWxsKTtcbn1cbmV4cG9ydHMuQ2hlc3Nncm91bmQgPSBDaGVzc2dyb3VuZDtcbmZ1bmN0aW9uIGRlYm91bmNlUmVkcmF3KHJlZHJhd05vdykge1xuICAgIGxldCByZWRyYXdpbmcgPSBmYWxzZTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAocmVkcmF3aW5nKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICByZWRyYXdpbmcgPSB0cnVlO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgcmVkcmF3Tm93KCk7XG4gICAgICAgICAgICByZWRyYXdpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNoZXNzZ3JvdW5kLmpzLm1hcCIsImltcG9ydCB7IENoZXNzZXJDb25maWcsIHBhcnNlX3VzZXJfY29uZmlnIH0gZnJvbSBcIi4vQ2hlc3NlckNvbmZpZ1wiO1xuaW1wb3J0IHsgQ2hlc3NlclNldHRpbmdzIH0gZnJvbSBcIi4vQ2hlc3NlclNldHRpbmdzXCI7XG5cbmltcG9ydCB7IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsIE5vdGljZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgQ2hlc3MsIENoZXNzSW5zdGFuY2UgfSBmcm9tICdjaGVzcy5qcyc7XG5pbXBvcnQgeyBDaGVzc2dyb3VuZCB9ICBmcm9tICdjaGVzc2dyb3VuZCc7XG5pbXBvcnQgeyBBcGkgfSBmcm9tIFwiY2hlc3Nncm91bmQvYXBpXCI7XG5pbXBvcnQgeyBDb2xvciwgS2V5IH0gZnJvbSBcImNoZXNzZ3JvdW5kL3R5cGVzXCI7XG5cbi8vIFRvIGJ1bmRsZSBhbGwgY3NzIGZpbGVzIGluIHN0eWxlcy5jc3Mgd2l0aCByb2xsdXBcbmltcG9ydCBcIi4uL2Fzc2V0cy9jdXN0b20uY3NzXCI7XG5pbXBvcnQgXCJjaGVzc2dyb3VuZC9hc3NldHMvY2hlc3Nncm91bmQuYmFzZS5jc3NcIjtcbmltcG9ydCBcImNoZXNzZ3JvdW5kL2Fzc2V0cy9jaGVzc2dyb3VuZC5icm93bi5jc3NcIjtcbi8vIFBpZWNlIHN0eWxlc1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9hbHBoYS5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvY2FsaWZvcm5pYS5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvY2FyZGluYWwuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL2NidXJuZXR0LmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9jaGVzczcuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL2NoZXNzbnV0LmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9jb21wYW5pb24uY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL2R1YnJvdm55LmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9mYW50YXN5LmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9mcmVzY2EuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL2dpb2NvLmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9nb3Zlcm5vci5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvaG9yc2V5LmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9pY3BpZWNlcy5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3Mva29zYWwuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL2xlaXB6aWcuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL2xldHRlci5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvbGlicmEuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL21hZXN0cm8uY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL21lcmlkYS5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvcGlyb3VldHRpLmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9waXhlbC5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvcmVpbGx5Y3JhaWcuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL3Jpb2hhY2hhLmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9zaGFwZXMuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL3NwYXRpYWwuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL3N0YXVudHkuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL3RhdGlhbmEuY3NzXCI7XG4vLyBCb2FyZCBzdHlsZXNcbmltcG9ydCBcIi4uL2Fzc2V0cy9ib2FyZC1jc3MvYnJvd24uY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvYm9hcmQtY3NzL2JsdWUuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvYm9hcmQtY3NzL2dyZWVuLmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL2JvYXJkLWNzcy9wdXJwbGUuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvYm9hcmQtY3NzL2ljLmNzc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gZHJhd19jaGVzc2JvYXJkKHNldHRpbmdzOiBDaGVzc2VyU2V0dGluZ3MpIHtcbiAgICByZXR1cm4gKHNvdXJjZTogc3RyaW5nLCBlbDogSFRNTEVsZW1lbnQsIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCkgPT4ge1xuICAgICAgICBsZXQgdXNlcl9jb25maWcgPSBwYXJzZV91c2VyX2NvbmZpZyhzZXR0aW5ncywgc291cmNlKTtcbiAgICAgICAgbmV3IENoZXNzZXIoZWwsIHVzZXJfY29uZmlnKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDaGVzc2VyIHtcbiAgICBjZzogQXBpO1xuICAgIGNoZXNzOiBDaGVzc0luc3RhbmNlO1xuXG4gICAgY29uc3RydWN0b3IoZWw6IEhUTUxFbGVtZW50LCB1c2VyX2NvbmZpZzogQ2hlc3NlckNvbmZpZykge1xuICAgICAgICBsZXQgZGl2ID0gdGhpcy5zZXRfc3R5bGUoZWwsIHVzZXJfY29uZmlnLnBpZWNlU3R5bGUsIHVzZXJfY29uZmlnLmJvYXJkU3R5bGUpO1xuXG4gICAgICAgIGlmICh1c2VyX2NvbmZpZy5mZW4gPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlc3MgPSBuZXcgQ2hlc3MoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hlc3MgPSBuZXcgQ2hlc3ModXNlcl9jb25maWcuZmVuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNnX2NvbmZpZyA9IHtcbiAgICAgICAgICAgIGZlbjogdXNlcl9jb25maWcuZmVuLFxuICAgICAgICAgICAgb3JpZW50YXRpb246IHVzZXJfY29uZmlnLm9yaWVudGF0aW9uIGFzIENvbG9yLFxuICAgICAgICAgICAgdmlld09ubHk6IHVzZXJfY29uZmlnLnZpZXdPbmx5LFxuICAgICAgICAgICAgZHJhd2FibGU6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB1c2VyX2NvbmZpZy5kcmF3YWJsZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuY2cgPSBDaGVzc2dyb3VuZChkaXYsIGNnX2NvbmZpZyk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgbmV3IE5vdGljZShcIkNoZXNzZXIgZXJyb3I6IEludmFsaWQgY29uZmlnXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWN0aXZhdGVzIHRoZSBjaGVzcyBsb2dpY1xuICAgICAgICBpZiAoIXVzZXJfY29uZmlnLmZyZWUpIHtcbiAgICAgICAgICAgIHRoaXMuY2cuc2V0KHtcbiAgICAgICAgICAgICAgICBtb3ZhYmxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGZyZWU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBkZXN0czogdGhpcy5kZXN0cygpLFxuICAgICAgICAgICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyOiB0aGlzLnJlZnJlc2hfbW92ZXMoKSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0X3N0eWxlKGVsOiBIVE1MRWxlbWVudCwgcGllY2VTdHlsZTogc3RyaW5nLCBib2FyZFN0eWxlOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGVsLmFkZENsYXNzKHBpZWNlU3R5bGUpO1xuICAgICAgICBlbC5hZGRDbGFzcyhgJHtib2FyZFN0eWxlfS1ib2FyZGApXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgIHJldHVybiBkaXY7XG4gICAgfVxuXG4gICAgY29sb3JfdHVybigpOiBDb2xvciB7XG4gICAgICAgIHJldHVybiAodGhpcy5jaGVzcy50dXJuKCkgPT09ICd3JykgPyAnd2hpdGUnIDogJ2JsYWNrJztcbiAgICB9XG5cbiAgICBkZXN0cygpOiBNYXA8S2V5LCBLZXlbXT4ge1xuICAgICAgICBjb25zdCBkZXN0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5jaGVzcy5TUVVBUkVTLmZvckVhY2gocyA9PiB7XG4gICAgICAgICAgICBjb25zdCBtcyA9IHRoaXMuY2hlc3MubW92ZXMoe3NxdWFyZTogcywgdmVyYm9zZTogdHJ1ZX0pO1xuICAgICAgICAgICAgaWYgKG1zLmxlbmd0aCkgZGVzdHMuc2V0KHMsIG1zLm1hcChtID0+IG0udG8pKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkZXN0cztcbiAgICB9XG5cbiAgICBjaGVjaygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hlc3MuaW5fY2hlY2soKTtcbiAgICB9XG5cbiAgICByZWZyZXNoX21vdmVzKCkge1xuICAgICAgICByZXR1cm4gKG9yaWc6IGFueSwgZGVzdDogYW55KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoZXNzLm1vdmUoe2Zyb206IG9yaWcsIHRvOiBkZXN0fSk7XG4gICAgICAgICAgICB0aGlzLmNnLnNldCh7XG4gICAgICAgICAgICAgICAgY2hlY2s6IHRoaXMuY2hlY2soKSxcbiAgICAgICAgICAgICAgICB0dXJuQ29sb3I6IHRoaXMuY29sb3JfdHVybigpLFxuICAgICAgICAgICAgICAgIG1vdmFibGU6IHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3JfdHVybigpLFxuICAgICAgICAgICAgICAgICAgICBkZXN0czogdGhpcy5kZXN0cygpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IEJPQVJEX1NUWUxFUywgUElFQ0VfU1RZTEVTIH0gZnJvbSBcIi4vQ2hlc3NlckNvbmZpZ1wiO1xuaW1wb3J0IENoZXNzZXJQbHVnaW4gZnJvbSBcIi4vbWFpblwiO1xuXG5pbXBvcnQgeyBBcHAsIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuZXhwb3J0IGludGVyZmFjZSBDaGVzc2VyU2V0dGluZ3Mge1xuXHRvcmllbnRhdGlvbjogc3RyaW5nO1xuXHR2aWV3T25seTogYm9vbGVhbjtcblx0ZHJhd2FibGU6IGJvb2xlYW47XG5cdGZyZWU6IGJvb2xlYW47XG4gICAgcGllY2VTdHlsZTogc3RyaW5nLFxuICAgIGJvYXJkU3R5bGU6IHN0cmluZyxcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IENoZXNzZXJTZXR0aW5ncyA9IHtcbiAgICBvcmllbnRhdGlvbjogXCJ3aGl0ZVwiLFxuICAgIHZpZXdPbmx5OiBmYWxzZSxcbiAgICBkcmF3YWJsZTogdHJ1ZSxcbiAgICBmcmVlOiBmYWxzZSxcbiAgICBwaWVjZVN0eWxlOiBcImNidXJuZXR0XCIsXG4gICAgYm9hcmRTdHlsZTogXCJicm93blwiLFxufVxuXG5leHBvcnQgY2xhc3MgQ2hlc3NlclNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcblx0cGx1Z2luOiBDaGVzc2VyUGx1Z2luO1xuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IENoZXNzZXJQbHVnaW4pIHtcblx0XHRzdXBlcihhcHAsIHBsdWdpbik7XG5cdFx0dGhpcy5wbHVnaW4gPSBwbHVnaW47XG5cdH1cblxuXHRkaXNwbGF5KCk6IHZvaWQge1xuXHRcdGxldCB7Y29udGFpbmVyRWx9ID0gdGhpcztcblxuXHRcdGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cblx0XHRjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7dGV4dDogJ09ic2lkaWFuIENoZXNzIFNldHRpbmdzJ30pO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZShcIlBpZWNlIFN0eWxlXCIpXG5cdFx0XHQuc2V0RGVzYyhcIlNldHMgdGhlIHBpZWNlIHN0eWxlLlwiKVxuXHRcdFx0LmFkZERyb3Bkb3duKGRyb3Bkb3duID0+IHtcblx0XHRcdFx0bGV0IHN0eWxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXHRcdFx0XHRQSUVDRV9TVFlMRVMubWFwKHN0eWxlID0+IHN0eWxlc1tzdHlsZV0gPSBzdHlsZSk7XG5cdFx0XHRcdGRyb3Bkb3duLmFkZE9wdGlvbnMoc3R5bGVzKTtcblxuXHRcdFx0XHRkcm9wZG93blxuXHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5waWVjZVN0eWxlKVxuXHRcdFx0XHRcdC5vbkNoYW5nZShwaWVjZVN0eWxlID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnBpZWNlU3R5bGUgPSBwaWVjZVN0eWxlO1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJCb2FyZCBTdHlsZVwiKVxuXHRcdFx0LnNldERlc2MoXCJTZXRzIHRoZSBib2FyZCBzdHlsZS5cIilcblx0XHRcdC5hZGREcm9wZG93bihkcm9wZG93biA9PiB7XG5cdFx0XHRcdGxldCBzdHlsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcblx0XHRcdFx0Qk9BUkRfU1RZTEVTLm1hcChzdHlsZSA9PiBzdHlsZXNbc3R5bGVdID0gc3R5bGUpO1xuXHRcdFx0XHRkcm9wZG93bi5hZGRPcHRpb25zKHN0eWxlcyk7XG5cblx0XHRcdFx0ZHJvcGRvd25cblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYm9hcmRTdHlsZSlcblx0XHRcdFx0XHQub25DaGFuZ2UoYm9hcmRTdHlsZSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5ib2FyZFN0eWxlID0gYm9hcmRTdHlsZTtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKFwiT3JpZW50YXRpb25cIilcblx0XHRcdC5zZXREZXNjKFwiU2V0cyB0aGUgZGVmYXVsdCBib2FyZCBvcmllbnRhdGlvbi5cIilcblx0XHRcdC5hZGREcm9wZG93bihkcm9wZG93biA9PiB7XG5cdFx0XHRcdGRyb3Bkb3duLmFkZE9wdGlvbihcIndoaXRlXCIsIFwiV2hpdGVcIik7XG5cdFx0XHRcdGRyb3Bkb3duLmFkZE9wdGlvbihcImJsYWNrXCIsIFwiQmxhY2tcIik7XG5cblx0XHRcdFx0ZHJvcGRvd25cblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mub3JpZW50YXRpb24pXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKG9yaWVudGF0aW9uID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb247XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZShcIkRyYXdhYmxlXCIpXG5cdFx0XHQuc2V0RGVzYyhcIkNvbnRyb2xzIHRoZSBhYmlsaXR5IHRvIGRyYXcgYW5ub3RhdGlvbnMgKGFycm93cywgY2lyY2xlcykgb24gdGhlIGJvYXJkLlwiKVxuXHRcdFx0LmFkZFRvZ2dsZSh0b2dnbGUgPT4ge1xuXHRcdFx0XHR0b2dnbGVcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZHJhd2FibGUpXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKGRyYXdhYmxlID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmRyYXdhYmxlID0gZHJhd2FibGU7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZShcIlZpZXcgT25seVwiKVxuXHRcdFx0LnNldERlc2MoXCJJZiBlbmFibGVkLCBkaXNwbGF5cyBhIHN0YXRpYyBjaGVzcyBib2FyZCAobm8gbW92ZXMsIGFubm90YXRpb25zLCAuLi4pLlwiKVxuXHRcdFx0LmFkZFRvZ2dsZSh0b2dnbGUgPT4ge1xuXHRcdFx0XHR0b2dnbGVcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mudmlld09ubHkpXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKHZpZXdPbmx5ID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnZpZXdPbmx5ID0gdmlld09ubHk7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZShcIkZyZWVcIilcblx0XHRcdC5zZXREZXNjKFwiSWYgZW5hYmxlZCwgZGlzYWJsZXMgdGhlIGNoZXNzIGxvZ2ljLCBhbGwgbW92ZXMgYXJlIHZhbGlkLlwiKVxuXHRcdFx0LmFkZFRvZ2dsZSh0b2dnbGUgPT4ge1xuXHRcdFx0XHR0b2dnbGVcdFxuXHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5mcmVlKVxuXHRcdFx0XHRcdC5vbkNoYW5nZShmcmVlID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmZyZWUgPSBmcmVlO1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0fVxufSIsImltcG9ydCB7IFBsdWdpbiB9IGZyb20gJ29ic2lkaWFuJztcclxuaW1wb3J0IHsgZHJhd19jaGVzc2JvYXJkIH0gZnJvbSAnLi9DaGVzc2VyJztcclxuaW1wb3J0IHsgQ2hlc3NlclNldHRpbmdzLCBDaGVzc2VyU2V0dGluZ1RhYiwgREVGQVVMVF9TRVRUSU5HUyB9IGZyb20gJy4vQ2hlc3NlclNldHRpbmdzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoZXNzZXJQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xyXG5cdHNldHRpbmdzOiBDaGVzc2VyU2V0dGluZ3M7XHJcblxyXG5cdGFzeW5jIG9ubG9hZCgpIHtcclxuXHRcdGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XHJcblx0XHR0aGlzLmFkZFNldHRpbmdUYWIobmV3IENoZXNzZXJTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcblx0XHR0aGlzLnJlZ2lzdGVyTWFya2Rvd25Db2RlQmxvY2tQcm9jZXNzb3IoXCJjaGVzc2VyXCIsIGRyYXdfY2hlc3Nib2FyZCh0aGlzLnNldHRpbmdzKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcblx0XHR0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcclxuXHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcblx0fVx0XHJcbn0iXSwibmFtZXMiOlsiY2ciLCJ1dGlsXzEiLCJmZW5fMSIsImJvYXJkXzEiLCJkcmF3XzEiLCJjb25maWciLCJjb25maWdfMSIsImRyYWdfMSIsInR5cGVzXzEiLCJzdmciLCJzdmdfMSIsInV0aWwiLCJzdGF0ZV8xIiwid3JhcF8xIiwiYXBpXzEiLCJDaGVzcyIsIkNoZXNzZ3JvdW5kIiwiTm90aWNlIiwiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQOztBQ3ZFQSxNQUFNLFlBQVksR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNqQyxNQUFNLFlBQVksR0FBRyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzVVLE1BQU0sWUFBWSxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBRXZELGlCQUFpQixDQUFDLFFBQXlCLEVBQUUsT0FBZTs7SUFDeEUsSUFBSSxzQkFBc0IsbUNBQ25CLFFBQVEsS0FDWCxHQUFHLEVBQUUsRUFBRSxHQUNWLENBQUM7O0lBR0YsTUFBTSxXQUFXLEdBQWtCO1FBQy9CLEdBQUcsRUFBRSxNQUFBLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLG1DQUFJLHNCQUFzQixDQUFDLEdBQUc7UUFDOUQsV0FBVyxFQUFFLE1BQUEsaUJBQWlCLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsRUFBRSxZQUFZLENBQUMsbUNBQUksc0JBQXNCLENBQUMsV0FBVztRQUN2SCxRQUFRLEVBQUUsTUFBQSxlQUFlLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxtQ0FBSSxzQkFBc0IsQ0FBQyxRQUFRO1FBQzlGLFFBQVEsRUFBRSxNQUFBLGVBQWUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDLG1DQUFJLHNCQUFzQixDQUFDLFFBQVE7UUFDOUYsSUFBSSxFQUFFLE1BQUEsZUFBZSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsbUNBQUksc0JBQXNCLENBQUMsSUFBSTtRQUNsRixVQUFVLEVBQUUsTUFBQSxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxFQUFFLFlBQVksQ0FBQyxtQ0FBSSxzQkFBc0IsQ0FBQyxVQUFVO1FBQ3BILFVBQVUsRUFBRSxNQUFBLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLEVBQUUsWUFBWSxDQUFDLG1DQUFJLHNCQUFzQixDQUFDLFVBQVU7S0FDdkgsQ0FBQztJQUVGLE9BQU8sV0FBVyxDQUFDO0FBQ3ZCLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxPQUFlLEVBQUUsVUFBa0I7SUFDcEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxVQUFVLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNWLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM3QixDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxDQUFTLEVBQUUsTUFBZ0I7SUFDbEQsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sQ0FBQyxDQUFDO0tBQ1o7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO1NBRWUsZUFBZSxDQUFDLENBQVM7SUFDckMsSUFBSSxDQUFDLENBQUMsRUFBRTtRQUNKLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUU7UUFDbkIsS0FBSyxNQUFNO1lBQ1AsT0FBTyxJQUFJLENBQUM7UUFDaEIsS0FBSyxPQUFPO1lBQ1IsT0FBTyxLQUFLLENBQUM7UUFDakI7WUFDSSxPQUFPLElBQUksQ0FBQztLQUNuQjtBQUNMOzs7Ozs7Ozs7Ozs7Ozs7OztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLEtBQUssR0FBRyxTQUFTLEdBQUcsRUFBRTtBQUMxQixFQUFFLElBQUksS0FBSyxHQUFHLElBQUc7QUFDakIsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFHO0FBQ2pCO0FBQ0EsRUFBRSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUM7QUFDaEI7QUFDQSxFQUFFLElBQUksSUFBSSxHQUFHLElBQUc7QUFDaEIsRUFBRSxJQUFJLE1BQU0sR0FBRyxJQUFHO0FBQ2xCLEVBQUUsSUFBSSxNQUFNLEdBQUcsSUFBRztBQUNsQixFQUFFLElBQUksSUFBSSxHQUFHLElBQUc7QUFDaEIsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFHO0FBQ2pCLEVBQUUsSUFBSSxJQUFJLEdBQUcsSUFBRztBQUNoQjtBQUNBLEVBQUUsSUFBSSxPQUFPLEdBQUcsZUFBYztBQUM5QjtBQUNBLEVBQUUsSUFBSSxnQkFBZ0I7QUFDdEIsSUFBSSwyREFBMEQ7QUFDOUQ7QUFDQSxFQUFFLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUM7QUFDdkQ7QUFDQSxFQUFFLElBQUksWUFBWSxHQUFHO0FBQ3JCLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ3ZCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDM0IsSUFBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLGFBQWEsR0FBRztBQUN0QixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUMzQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDekIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLElBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRSxJQUFJLE9BQU8sR0FBRztBQUNoQixJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDckQsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3JELEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNyRCxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDckQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3JELEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNyRCxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDckQsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ3JELEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNyRCxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDckQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3JELEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNyRCxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDckQsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3JELElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2xELEdBQUcsQ0FBQztBQUNKO0FBQ0E7QUFDQSxFQUFFLElBQUksSUFBSSxHQUFHO0FBQ2IsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ2xFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNsRSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDbEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ2xFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNsRSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDbEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ2xFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ2xFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNsRSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDbEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ2xFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNsRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDbEUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ2xFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQy9ELEdBQUcsQ0FBQztBQUNKO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFFO0FBQ3JEO0FBQ0EsRUFBRSxJQUFJLEtBQUssR0FBRztBQUNkLElBQUksTUFBTSxFQUFFLEdBQUc7QUFDZixJQUFJLE9BQU8sRUFBRSxHQUFHO0FBQ2hCLElBQUksUUFBUSxFQUFFLEdBQUc7QUFDakIsSUFBSSxVQUFVLEVBQUUsR0FBRztBQUNuQixJQUFJLFNBQVMsRUFBRSxHQUFHO0FBQ2xCLElBQUksWUFBWSxFQUFFLEdBQUc7QUFDckIsSUFBSSxZQUFZLEVBQUUsR0FBRztBQUNyQixJQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksSUFBSSxHQUFHO0FBQ2IsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUNiLElBQUksT0FBTyxFQUFFLENBQUM7QUFDZCxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQ2YsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUNqQixJQUFJLFNBQVMsRUFBRSxFQUFFO0FBQ2pCLElBQUksWUFBWSxFQUFFLEVBQUU7QUFDcEIsSUFBSSxZQUFZLEVBQUUsRUFBRTtBQUNwQixJQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksTUFBTSxHQUFHLEVBQUM7QUFDaEIsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFDO0FBS2hCLEVBQUUsSUFBSSxNQUFNLEdBQUcsRUFBQztBQUNoQixFQUFFLElBQUksTUFBTSxHQUFHLEVBQUM7QUFDaEI7QUFDQTtBQUNBLEVBQUUsSUFBSSxPQUFPLEdBQUc7QUFDaEIsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDO0FBQzFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtBQUMxRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7QUFDMUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO0FBQzFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtBQUMxRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7QUFDMUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHO0FBQzFFLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRztBQUMxRSxHQUFHLENBQUM7QUFDSjtBQUNBLEVBQUUsSUFBSSxLQUFLLEdBQUc7QUFDZCxJQUFJLENBQUMsRUFBRTtBQUNQLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNyRCxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDckQsS0FBSztBQUNMLElBQUksQ0FBQyxFQUFFO0FBQ1AsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3JELE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNyRCxLQUFLO0FB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QUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDaEUsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3pELE1BQU0sT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2hFLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2pELE1BQU0sT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2hFLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxJQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3RELE1BQU0sT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2hFLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNwQyxNQUFNLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNoRSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFD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QUksSUFBSTtBQUNwQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDcEMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUM1QyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUM7QUFDdEMsVUFBVTtBQUNWLFVBQVUsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFDO0FBQzNFLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQU0sSUFBSSxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUM1QyxRQUFRLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxFQUFFLEVBQUM7QUFDckMsUUFBUSxJQUFJLFdBQVcsR0FBRyxhQUFhLEdBQUcsRUFBQztBQUMzQztBQUNBLFFBQVE7QUFDUixVQUFVLEtBQUssQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSTtBQUMxQyxVQUFVLEtBQUssQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSTtBQUMxQyxVQUFVLEtBQUssQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSTtBQUMxQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDcEMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUM1QyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUM7QUFDdEMsVUFBVTtBQUNWLFVBQVUsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFDO0FBQzNFLFNB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QUFDZDtBQUNBLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQztBQUNyQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSTtBQUMzQjtBQUNBO0FBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUN0QyxNQUFNLElBQUksSUFBSSxLQUFLLEtBQUssRUFBRTtBQUMxQixRQUFRLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEtBQUk7QUFDbEMsT0FBTyxNQUFNO0FBQ2IsUUFBUSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxLQUFJO0FBQ2xDLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDckMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEVBQUUsR0FBRTtBQUMxRCxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7QUFDdEMsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRTtBQUMzQztBQUNBO0FBQ0EsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUMxQyxRQUFRLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBQztBQUNyQyxRQUFRLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFB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

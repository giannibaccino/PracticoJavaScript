class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.playing = false;
    this.game_over = false;
    this.bars = [];
    this.ball = null;
  }

  getElements() {
    let elements = this.bars;
    elements.push(ball);
    return elements;
  }
}

class BoardView {
  constructor(canvas, board) {
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = board;
    this.ctx = canvas.getContext("2d");
  }
}

window.addEventListener("load", main);

function main() {
  let board = new Board(800, 400);
  let canvas = document.getElementById("canvas");
  let board_view = new BoardView(canvas, board);
}

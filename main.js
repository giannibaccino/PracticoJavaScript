(function(){
    //creo la clase Board

    //self vale algo dependiendo del contexto en el que estes
    self.Board = function(width, height){
        this.width = width;
        this.height = height
        this.playing = false;//si se esta jugando
        this.game_over = false;//si el juego termino
        this.bars = [];
        this.ball = null;
    }
    
    self.Board.prototype= {
        get elements(){
            let elements = this.bars;//barras laterales las que usamos para mover
            elements.push(this.ball);//agrego la pelota
            return elements;
        }
    }
})();

(function(){
   self.BoardView = function(canvas,board) {
    this.canvas = canvas;
    this.canvas.width = board.width;//modifico el ancho del canvas
    this.canvas.height = board.height//modifico el alto del canvas
    this.board = board;
    this.ctx = canvas.getContext("2d");//contexto
   } 
})();

window.addEventListener("load",main);

function main (){
    let board = new Board(800,400);
    let canvas = document.getElementById("canvas");
    let board_view = new BoardView(canvas,board);
}
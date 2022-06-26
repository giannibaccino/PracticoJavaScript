(function () {
  //creo la clase Board que es el modelo
  //self vale algo dependiendo del contexto en el que estes
  self.Board = function (width, height) {
    this.width = width;
    this.height = height;
    this.playing = false; //si se esta jugando
    this.game_over = false; //si el juego termino
    this.bars = [];
    this.ball = null;
  };

  //devuelvo la barra y la pelota
  self.Board.prototype = {
    get elements() {
      let elements = this.bars; //barras laterales las que usamos para mover
      elements.push(this.ball); //agrego la pelota
      return elements;
    },
  };
})();

(function () {
  //clase Barra
  //defino la dimencion de la barra y en donde lo voy a dibjar, osea la pizzarra
  self.Bar = function (x, y, width, height, board) {
    this.x = x; //coordenada
    this.y = y; //coordenada
    this.width = width;
    this.height = height;
    this.board = board;
    this.board.bars.push(this); //accedo al board, a la barra y le agrego la barra lateral la cual usamos para jugar
    this.kind = "rectangle"; //para que el canvas dibuje un rectangulo
    this.speed = 10; //velocidad
  };

  //modificamos el prototype de la funcion
  //defino las funciones para subir y bajar las barras
  self.Bar.prototype = {
    down: function () {
      this.y += this.speed;
    },
    up: function () {
      this.x -= this.speed;
    },
    toString: function(){
        return "x: "+ this.x + " y: "+this.y; 
    }
  };
})();

(function () {
  //La vista
  self.BoardView = function (canvas, board) {
    this.canvas = canvas;
    this.canvas.width = board.width; //modifico el ancho del canvas
    this.canvas.height = board.height; //modifico el alto del canvas
    this.board = board;
    this.ctx = canvas.getContext("2d"); //contexto
  };

  self.BoardView.prototype = {
    draw: function () {
      for (i = this.board.elements.length - 1; i >= 0; i--) {
        let elem = this.board.elements[i];

        draw(this.ctx, elem);
      }
    },
  };

  //defino un metodo dibujar
  function draw(ctx, element) {
    //chequeo que exista un elemento kind
    if (element !== null && element.hasOwnProperty("kind")) {
      //dependiendo del tipo es como lo dibuja ejemplo un rectangulo
      switch (element.kind) {
        case "rectangle":
          ctx.fillRect(element.x, element.y, element.width, element.height);
          break;
      }
    }
  }
})();

//coloco los movimientos de las barras
document.addEventListener("keydown", (ev) => {

  if(ev.keyCode == 87){
    bar.up();
  }else if(ev.keyCode == 40){
    bar.down();
  }
  console.log(bar.toString())
});

window.addEventListener("load", main);

//controlador
function main() {
  let board = new Board(800, 400);
  let canvas = document.getElementById("canvas");
  let bar = new Bar(15, 100, 40, 100, board);
  let bar2 = new Bar(750, 100, 40, 100, board);
  let board_view = new BoardView(canvas, board);

  board_view.draw();
}

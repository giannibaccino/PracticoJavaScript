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
      let elements = this.bars.map(function (bar) {
        return bar;
      });
      elements.push(this.ball); //agrego la pelota
      return elements;
    },
  };
})();

(function () {
  //clase pelota
  self.Ball = function (x, y, radio, board) {
    this.x = x;
    this.y = y;
    this.radio = radio;
    this.speed_y = 0;
    this.speed_x = 3;
    this.board = board;
    this.direction = 1;

    board.ball = this;
    this.kind = "circle";
  };

  self.Ball.prototype = {
    move: function () {
      this.x += this.speed_x * this.direction;
      this.y += this.speed_y;
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
      this.y -= this.speed;
    },
    toString: function () {
      return "x: " + this.x + " y: " + this.y;
    },
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
    clean: function () {
      //hago que se limplie la animacion y no se arrastre, para que solo se vea la barrita de un tamaño
      this.ctx.clearRect(0, 0, this.board.width, this.board.height);
    },
    draw: function () {
      for (i = this.board.elements.length - 1; i >= 0; i--) {
        let elem = this.board.elements[i];

        draw(this.ctx, elem);
      }
    },
    play: function () {
      if (this.board.playing) {
        this.clean();
        this.draw();
        this.board.ball.move();
      }
    },
  };

  //defino un metodo dibujar
  function draw(ctx, element) {
    //dependiendo del tipo es como lo dibuja ejemplo un rectangulo
    switch (element.kind) {
      case "rectangle":
        ctx.fillRect(element.x, element.y, element.width, element.height);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.radio, 0, 7);
        ctx.fill();
        ctx.closePath();
        break;
    }
  }
})();

let board = new Board(800, 400);
let canvas = document.getElementById("canvas");
let bar = new Bar(15, 100, 40, 100, board);
let bar2 = new Bar(750, 100, 40, 100, board);
let board_view = new BoardView(canvas, board);
let ball = new Ball(400, 100, 10, board);

//coloco los movimientos de las barras
document.addEventListener("keydown", (ev) => {
  console.log(ev.keyCode);

  if (ev.keyCode == 87) {
    ev.preventDefault();
    bar.up();
    //KeyUp
  } else if (ev.keyCode == 83) {
    ev.preventDefault();
    bar.down();
    //KeyDown
  }
  if (ev.keyCode == 38) {
    ev.preventDefault();
    bar2.up();
    //W
  } else if (ev.keyCode == 40) {
    ev.preventDefault();
    bar2.down();
    //S
  } else if (ev.keyCode == 32) {
    ev.preventDefault();
    board.playing = !board.playing;
  }

  console.log("" + bar); //convierto el objeto a cadena
});

//muestro por primera vez el board
board_view.draw();
window.requestAnimationFrame(controller);

//controlador
function controller() {
  board_view.play();
  window.requestAnimationFrame(controller);
}

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
    this.score1 = 0;
    this.score2 = 0;
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
    get getWidth() {
      return this.width;
    },
    get getHeight() {
      return this.height;
    },
    resetBall: function () {
      ball.x = 400;
      ball.y = 100;
      ball.speed=8;
      ball.direction=1;
      ball.speed_x = -ball.speed_x;
    },
    detengoElGame: function () {
      //detengo el juego
      setTimeout(() => {
        board.playing = !board.playing;
      }, 10);
    },
  };
})();

(function () {
  //clase pelota
  self.Ball = function (x, y, radius, board) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed_y = 0;
    this.speed_x = 5;
    this.board = board;
    this.direction = 1;
    this.bounce_angle = 0;
    this.max_bounce_angle = Math.PI / 12; //para la colicion un calculo matematico
    this.speed = 8;

    board.ball = this;
    this.kind = "circle";
  };

  function resetScore() {
    board.score1 = 0;
    board.score2 = 0;
    scre1.innerHTML = board.score1;
    scre2.innerHTML = board.score2;
    puntoPara.innerHTML = " ";
  }

  self.Ball.prototype = {
    move: function () {
      this.x += this.speed_x * this.direction;
      this.y += this.speed_y;

      if (
        this.y + this.radius > this.board.getHeight ||
        this.y + this.radius <= 20
      ) {
        this.speed_y = -this.speed_y;
      }
      //me fijo si la pelota + la posicion en x supera lo que mide el board
      if (this.x + this.radius < 0) {
        //-------RESET DE LA BOLA
        board.resetBall();
        //-----------------AUMENTO LA PUNTUACION Y MUESTRO MENSAJES
        board.score2++;
        scre2.innerHTML = board.score2;
        puntoPara.innerHTML = `<p class="animate__animated animate__pulse">Punto para el jugador 2</p>`;
        //------------FINALIZO EL JUEGO CUANDO SE LLEGA A 5 puntos
        if (board.score2 == 5) {
          //-------------RESETEO PUNTOS Y DETENGO EL JUEGO
          resetScore();
          board.detengoElGame();
          swal("EL GANADOR ES EL JUGADOR 2");
        }

        //me fijo si la pelota + la posicion en x supera lo que mide el board
      } else if (this.x + this.radius > this.board.getWidth) {
        //---------------RESETEO LA PELOTA
        board.resetBall();
        //---------------AUMENTO LA PUNTUACION Y MUESTRO MENSAJES
        board.score1++;
        scre1.innerHTML = board.score1;
        puntoPara.innerHTML = `<p class="animate__animated animate__pulse">Punto para el jugador 1</p>`;

        //------------------FINALIZO EL JUEGO CUANDO SE LLEGA A 5 puntos
        if (board.score1 == 5) {
          //-------------RESETEO PUNTOS Y DETENGO EL JUEGO
          resetScore();
          board.detengoElGame();
          puntoPara.innerHTML = " ";
          swal("EL GANADOR ES EL JUGADOR 1");
        }
      }
    },
    get width() {
      return this.radius * 2;
    },
    get height() {
      return this.radius * 2;
    },
    //reacciona a la colision con  una barra que recibe como parametro
    collision: function (bar) {
      let relative_intersect_y = bar.y + bar.height / 2 - this.y;
      let normalized_intersect_y = relative_intersect_y / (bar.height / 2);

      this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

      this.speed_y = this.speed * -Math.sin(this.bounce_angle);
      this.speed_x = this.speed * Math.cos(this.bounce_angle);

      if (this.x > this.board.width / 2) {
        this.direction = -1;
      } else this.direction = 1;
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
    this.speed = 25; //velocidad
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

        draw(this.ctx, elem); //agregar comentario
      }
    },
    //colision entre objetos
    check_collisions: function () {
      for (var i = this.board.bars.length - 1; i >= 0; i--) {
        var bar = this.board.bars[i];
        if (hit(bar, this.board.ball)) {
          this.board.ball.collision(bar);
        }
      }
    },
    play: function () {
      if (this.board.playing) {
        this.clean();
        this.draw();
        this.check_collisions();
        this.board.ball.move();
      }
    },
  };

  //reviso si a coliciona con b
  function hit(a, b) {
    let hit = false;
    //Colsiones horizontales
    if (b.x + b.width >= a.x && b.x < a.x + a.width) {
      //Colisiones verticales
      if (b.y + b.height >= a.y && b.y < a.y + a.height) {
        hit = true;
      }
    }
    //Colisión de a con b
    if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
      if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
        hit = true;
      }
    }
    //Colisión b con a
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
      if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
        hit = true;
      }
    }
    return hit;
  }

  //defino un metodo dibujar
  function draw(ctx, element) {
    //dependiendo del tipo es como lo dibuja ejemplo un rectangulo
    switch (element.kind) {
      case "rectangle":
        ctx.fillRect(element.x, element.y, element.width, element.height);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.radius, 0, 7);
        ctx.fill();
        ctx.closePath();
        break;
    }
  }
})();

let board = new Board(800, 400);
let canvas = document.getElementById("canvas");
let bar = new Bar(10, 120, 20, 120, board);
let bar2 = new Bar(770, 120, 20, 120, board);
let board_view = new BoardView(canvas, board);
let ball = new Ball(400, 100, 10, board);

let pausa = document.getElementById("p");

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
  if (!board.playing) {
    pausa.innerHTML = "pausa";
  } else {
    pausa.innerHTML = "play";
  }

  console.log("" + bar); //convierto el objeto a cadena
});
//SCORE

let puntoPara = document.getElementById("puntoPara");
let scre1 = document.getElementById("score1");
let scre2 = document.getElementById("score2");

//muestro por primera vez el board
board_view.draw();
window.requestAnimationFrame(controller); //me queda saber esto

//controlador
function controller() {
  board_view.play();
  window.requestAnimationFrame(controller);
}

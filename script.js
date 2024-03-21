document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('tetris');
  const context = canvas.getContext('2d');
  const scale = 20;
  const rows = canvas.height / scale;
  const columns = canvas.width / scale;
  let scoring = 0;
  let nivel = 0;

  function drawSquare(x, y, color) {
      context.fillStyle = color;
      context.fillRect(x * scale, y * scale, scale, scale);
      context.strokeStyle = "#000";
      context.strokeRect(x * scale, y * scale, scale, scale);
  }

  let board = [];
  for (let r = 0; r < rows; r++) {
      board[r] = [];
      for (let c = 0; c < columns; c++) {
          board[r][c] = '#fff';
      }
  }

  function drawBoard() {
      for (let r = 0; r < rows; r++) {
          for (let c = 0; c < columns; c++) {
              drawSquare(c, r, board[r][c]);
          }
      }
  }

  drawBoard();

  function collision(x, y, piece) {
      for (let r = 0; r < piece.length; r++) {
          for (let c = 0; c < piece[r].length; c++) {
              if (!piece[r][c]) continue;

              let newX = x + c;
              let newY = y + r;

              if (newX < 0 || newX >= columns || newY >= rows) {
                  return true;
              }
              if (newY < 0) continue;
              if (board[newY][newX] !== '#fff') {
                  return true;
              }
          }
      }
      return false;
  }

  function merge() {
      for (let r = 0; r < piece.shape.length; r++) {
          for (let c = 0; c < piece.shape[r].length; c++) {
              if (piece.shape[r][c]) {
                  board[piece.y + r][piece.x + c] = piece.color;
              }
          }
      }
  }

  function rotate(piece) {
      const rotatedPiece = [];
      for (let c = 0; c < piece[0].length; c++) {
          let newRow = [];
          for (let r = piece.length - 1; r >= 0; r--) {
              newRow.push(piece[r][c]);
          }
          rotatedPiece.push(newRow);
      }
      return rotatedPiece;
  }

  function drawPiece() {
      for (let r = 0; r < piece.shape.length; r++) {
          for (let c = 0; c < piece.shape[r].length; c++) {
              if (piece.shape[r][c]) {
                  drawSquare(piece.x + c, piece.y + r, piece.color);
              }
          }
      }
  }

  function clearBoard() {
    for (let r = 0; r < rows; r++) {
        let rowFilled = true;
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === '#fff') {
                rowFilled = false;
                break;
            }
        }
        if (rowFilled) {
            board.splice(r, 1);
            board.unshift(Array(columns).fill('#fff'));
            scoring += 100; // Incrementar la puntuación por cada fila completa eliminada
            updateScore(); // Llamar a la función para actualizar la puntuación en el HTML
            switch (scoring){
                case 0:
                    nivel=1;
                    break;
                case 100:
                    nivel=2;
                    break;
                case 200:
                    nivel=3;
                    break;
                case 300:
                    nivel=4;
                    break;
                case 400:
                    nivel=5;
                    break;
                case 500:
                    nivel=6;
                    break;
                case 600:
                    nivel=7;
                    break;
                case 700:
                    nivel=8;
                    break;
                case 800:
                    nivel=9;
                case 900:
                    nivel = 10;
                case 1000:
                    nivel = "Experto"
                    experto();
                    break;
                
            }
            level();
        }
    }
}

//coloca el punatje en el scoring
function updateScore() {
  const scoringElement = document.getElementById('scoring');
  scoringElement.textContent = scoring;
}

//coloca el nivel
function level() {
    const levelElement = document.getElementById('nivel');
    levelElement.textContent = nivel;
  }

//coloca Experto
function experto() {
    const scoringElement = document.getElementById('scoring');
    const levelElement = document.getElementById('nivel');
    scoringElement.textContent = 'Felcidades';
    levelElement.textContent = '¡¡Eres el Maestro del Tetris!!'
  }


  function dropPiece() {
    piece.y++;
    if (collision(piece.x, piece.y, piece.shape)) {
        piece.y--;
        merge();
        piece.color = generacolor(); // Actualizar el color de la pieza
        piece = generateRandomPiece(); // Generar una nueva pieza aleatoria
        clearBoard();
    }
}



  document.getElementById('move-left').addEventListener('click', () => {
      piece.x--;
      if (collision(piece.x, piece.y, piece.shape)) {
          piece.x++;
      }
  });

  document.getElementById('move-right').addEventListener('click', () => {
      piece.x++;
      if (collision(piece.x, piece.y, piece.shape)) {
          piece.x--;
      }
  });

  document.getElementById('rotate').addEventListener('click', () => {
      const rotated = rotate(piece.shape);
      if (!collision(piece.x, piece.y, rotated)) {
          piece.shape = rotated;
      }
  });

  function draw() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBoard();
      drawPiece();
  }

  setInterval(() => {
      draw();
      dropPiece();
  }, 1000);

  function generateRandomPiece() {
    const shapes = [
        [[1, 1, 1, 1]],                  // Línea horizontal
        [[1, 1], [1, 1]],                // Cuadrado
        [[1, 1, 1], [0, 1, 0]],          // T
        [[1, 1, 1], [0, 0, 1]],          // L
        [[1, 1, 1], [1, 0, 0]],          // L invertida
        [[0, 1], [1, 1], [1, 0]],        // S
        [[1, 0], [1, 1], [0, 1]]         // S invertida
    ];

    const randomIndex = Math.floor(Math.random() * shapes.length);
    const randomShape = shapes[randomIndex];

    return {
        x: 3,
        y: 0,
        color: generacolor(), // Color
        shape: randomShape
    };
}

function generacolor() {
  const colors = ['red', 'blue', 'green', 'orange', 'cyan', 'pink', 'gray'];
  const randomIndexC = Math.floor(Math.random() * colors.length);
  const randomColor = colors[randomIndexC];
  return randomColor;
}

let color = generacolor();


// Uso de la función para generar una pieza aleatoria
let piece = generateRandomPiece();
});


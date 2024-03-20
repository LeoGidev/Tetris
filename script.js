document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('tetris');
  const context = canvas.getContext('2d');
  const scale = 20;
  const rows = canvas.height / scale;
  const columns = canvas.width / scale;

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
          }
      }
  }

  function dropPiece() {
      piece.y++;
      if (collision(piece.x, piece.y, piece.shape)) {
          piece.y--;
          merge();
          piece.y = 0;
          clearBoard();
      }
  }

  document.addEventListener('keydown', event => {
      if (event.keyCode === 37) { // Left arrow
          piece.x--;
          if (collision(piece.x, piece.y, piece.shape)) {
              piece.x++;
          }
      } else if (event.keyCode === 39) { // Right arrow
          piece.x++;
          if (collision(piece.x, piece.y, piece.shape)) {
              piece.x--;
          }
      } else if (event.keyCode === 40) { // Down arrow
          dropPiece();
      } else if (event.keyCode === 38) { // Up arrow (rotate)
          const rotated = rotate(piece.shape);
          if (!collision(piece.x, piece.y, rotated)) {
              piece.shape = rotated;
          }
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
});

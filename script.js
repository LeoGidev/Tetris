// Define las variables del juego
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var grid = [];
var blockSize = 20;
var rows = canvas.height / blockSize;
var cols = canvas.width / blockSize;
var currentBlock = null;
var score = 0;
var interval;

// Inicializa el juego
function init() {
  for (var row = 0; row < rows; row++) {
    grid[row] = [];
    for (var col = 0; col < cols; col++) {
      grid[row][col] = 0;
    }
  }
  newBlock();
  interval = setInterval(update, 500);
}

// Dibuja un bloque en el canvas
function drawBlock(block) {
  ctx.fillStyle = block.color;
  for (var i = 0; i < block.shape.length; i++) {
    for (var j = 0; j < block.shape[i].length; j++) {
      if (block.shape[i][j] === 1) {
        ctx.fillRect(block.x + j * blockSize, block.y + i * blockSize, blockSize, blockSize);
      }
    }
  }
}

// Dibuja el grid en el canvas
function drawGrid() {
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      if (grid[row][col] !== 0) {
        ctx.fillStyle = grid[row][col];
        ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
      }
    }
  }
}

// Crea un nuevo bloque aleatorio
function newBlock() {
  var shapes = [
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1], [1, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[0, 0, 1], [1, 1, 1]],
    [[1, 1, 0], [0, 1, 1]]
  ];
  var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
  var randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  var randomColor = colors[Math.floor(Math.random() * colors.length)];
  currentBlock = {
    shape: randomShape,
    color: randomColor,
    x: Math.floor(cols / 2) - Math.floor(randomShape[0].length / 2),
    y: 0
  };
}

// Mueve el bloque hacia abajo
function moveDown() {
  if (isValidMove(0, 1)) {
    currentBlock.y++;
  } else {
    placeBlock();
    newBlock();
  }
}

// Mueve el bloque hacia la izquierda
function moveLeft() {
  if (isValidMove(-1, 0)) {
    currentBlock.x--;
  }
}

// Mueve el bloque hacia la derecha
function moveRight() {
  if (isValidMove(1, 0)) {
    currentBlock.x++;
  }
}

// Rota el bloque 90 grados en sentido horario
function rotate() {
    var newShape = [];
    for (var i = 0; i < currentBlock.shape[0].length; i++) {
      newShape[i] = [];
      for (var j = 0; j < currentBlock.shape.length; j++) {
        newShape[i][j] = currentBlock.shape[currentBlock.shape.length - j - 1][i];
      }
    }
    if (isValidRotation(newShape)) {
      currentBlock.shape = newShape;
    }
  }
  
  // Verifica si el movimiento es válido
  function isValidMove(xOffset, yOffset) {
    for (var i = 0; i < currentBlock.shape.length; i++) {
      for (var j = 0; j < currentBlock.shape[i].length; j++) {
        if (currentBlock.shape[i][j] === 1) {
          var newX = currentBlock.x + j + xOffset;
          var newY = currentBlock.y + i + yOffset;
          if (newX < 0 || newX >= cols || newY >= rows || grid[newY][newX] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  }
  
  // Verifica si la rotación es válida
  function isValidRotation(newShape) {
    for (var i = 0; i < newShape.length; i++) {
      for (var j = 0; j < newShape[i].length; j++) {
        if (newShape[i][j] === 1) {
          var newX = currentBlock.x + j;
          var newY = currentBlock.y + i;
          if (newX < 0 || newX >= cols || newY >= rows || grid[newY][newX] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  }
  
  // Coloca el bloque en el grid y revisa si hay líneas completas
  function placeBlock() {
    for (var i = 0; i < currentBlock.shape.length; i++) {
      for (var j = 0; j < currentBlock.shape[i].length; j++) {
        if (currentBlock.shape[i][j] === 1) {
          grid[currentBlock.y + i][currentBlock.x + j] = currentBlock.color;
        }
      }
    }
    checkLines();
  }
  
  // Revisa si hay líneas completas y las elimina
  function checkLines() {
    for (var row = 0; row < rows; row++) {
      if (grid[row].every(block => block !== 0)) {
        grid.splice(row, 1);
        grid.unshift(new Array(cols).fill(0));
        score += 10;
      }
    }
  }
  
  // Actualiza el juego
  function update() {
    moveDown();
    draw();
  }
  
  // Dibuja el juego en el canvas
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawBlock(currentBlock);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
  }
  
  // Escucha las teclas presionadas y mueve o rota el bloque
  document.addEventListener('keydown', function(event) {
    if (event.keyCode === 37) {
      moveLeft();
    } else if (event.keyCode === 39) {
      moveRight();
    } else if (event.keyCode === 38) {
      rotate
    } else if (event.keyCode === 40) {
        moveDown();
      }
    });
    
    // Comienza el juego
    startGame();
      
var Maze = {};

Maze.SVGDrawer = function() {
  var SVGElement;
  var SVGId;
  var SVGHeight;
  var SVGWidth;
  var SVGCells;

  return {
    setupSVG: function(SVGId) {
      this.SVGId = SVGId;
      this.SVGElement = document.getElementById(this.SVGId);
      this.SVGHeight  = this.SVGElement.getAttribute('height');
      this.SVGWidth   = this.SVGElement.getAttribute('width');

      // create a whole black background
      var background = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
      background.setAttribute('x', 0);
      background.setAttribute('y', 0);
      background.setAttribute('height', this.SVGHeight);
      background.setAttribute('width', this.SVGWidth);
      background.setAttribute('fill', 'black');

      this.SVGElement.appendChild(background);
    },

    drawRectangle: function(posX, posY, width, height) {
      var rectangle = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
      rectangle.setAttribute('x', posX);
      rectangle.setAttribute('y', posY);
      rectangle.setAttribute('height', height);
      rectangle.setAttribute('width', width);
      rectangle.setAttribute('fill', 'white');

      this.SVGElement.appendChild(rectangle);
    }
  }; 
};
// -----------------------------------------------------------------------------



Maze.recursiveBacktracker = function() {
  // svg
  var canvas;

  // matrix
  var cells;

  var stack;

  return {
    setupCanvas: function(canvas) {
      this.canvas = canvas;
      this.stack  = new Array();

      this.cells = new Array(this.canvas.SVGHeight);
      for (var i = 0; i < this.canvas.SVGHeight; i++) {
        this.cells[i] = new Array(this.canvas.SVGWidth);
      }

      // initialize all cells as visited
      for (var height = 0; height < this.canvas.SVGHeight; height++) {
        for (var width = 0; width < this.canvas.SVGWidth; width++) {
          // all nodes are 'not visited'
          this.cells[height][width] = false;

          // initialize stack
          this.stack.push({
            'xPos': height,
            'yPos': width,
            'visited': false
          });
        }
      }
    },

    getNeighbors: function(xPos, yPos) {
      var neighbors = new Array();

      try {
        if (this.cells[xPos][yPos + 1] == false) {
          neighbors.push({
            'xPos': xPos,
            'yPos': yPos + 1,
            'visited': this.cells[xPos][yPos + 1]
          });
        }
      }
      catch(e) {}

      try {
        if (this.cells[xPos][yPos - 1] == false) {
          neighbors.push({
            'xPos': xPos,
            'yPos': yPos - 1,
            'visited': this.cells[xPos][yPos - 1]
          });
        }
      }
      catch(e) {}

      try {
        if (this.cells[xPos + 1][yPos] == false) {
          neighbors.push({
            'xPos': xPos + 1,
            'yPos': yPos,
            'visited': this.cells[xPos + 1][yPos]
          });
        }
      }
      catch(e) {}

      try {
        if (this.cells[xPos - 1][yPos] == false) {
          neighbors.push({
            'xPos': xPos - 1,
            'yPos': yPos,
            'visited': this.cells[xPos - 1][yPos]
          });
        }
      }
      catch(e) {}

      return neighbors;
    },

    getRandomNeighbor: function(neighbors) {
      return neighbors[Math.floor(Math.random() * neighbors.length)];
    },

    removeWall: function(cell1, cell2) {
      var xPos;
      var yPos;
      var width;
      var height;

      if (cell1.xPos > cell2.xPos) {
        xPos   = cell2.xPos;
        width  = 2;
        height = 1;
      }
      else {
        xPos   = cell1.xPos
        width  = 2;
        height = 1;
      }

      if (cell1.yPos > cell2.yPos) {
        yPos   = cell2.yPos;
        width  = 1;
        height = 2;
      }
      else {
        yPos   = cell1.yPos;
        width  = 1;
        height = 2;
      }

      console.log('xPos: ' + xPos + ' - ' + 'yPos: ' + yPos + ' - ' + 'width: ' + width + ' - ' + 'height: ' + height);
      //this.canvas.drawRectangle(xPos, yPos, width, height);
      this.canvas.drawRectangle(xPos, yPos, 10, 20);
    },

    drawMaze: function() {
      // Make the initial cell the current cell and mark it as visited
      var current = this.stack.shift();
      this.cells[current.xPos][current.yPos] = true;

      var neighbors = this.getNeighbors(current.xPos, current.yPos);
      var randNeighbors = this.getRandomNeighbor(neighbors);

      this.removeWall(current, randNeighbors);

//      console.log(current);
//      console.log(neighbors);
//      console.log(randNeighbors);

      // While there are unvisited cells
      while (this.stack.length > 0) {
        var neighbors = this.getNeighbors(current.xPos, current.yPos);

        // If the current cell has any neighbours which have not been visited
        if (neighbors.length > 0) {
          console.log('if');
          var randNeighbor = this.getRandomNeighbor(neighbors);

          // Push the current cell to the stack
          this.stack.push(current);

          // Remove the wall between the current cell and the chosen cell
          this.removeWall(current, randNeighbor);

          // Make the chosen cell the current cell and mark it as visited
          current = randNeighbor;
          this.cells[current.xPos][current.yPos] = true;
        }
        else {
          console.log('else');
          // Else if stack is not empty
          if (this.stack.length > 0) {
            // Pop a cell from the stack and Make it the current cell
            current = this.stack.shift();
          }
        }
      }
    }

  };
};
// -----------------------------------------------------------------------------


// Main program ----------------------------------------------------------------
var svg = Maze.SVGDrawer();
svg.setupSVG('canvas');

var backtracker = Maze.recursiveBacktracker();
backtracker.setupCanvas(svg);

backtracker.drawMaze();

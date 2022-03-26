class Spot {
  f: number = 0;
  g: number = 0;
  h: number = 0;

  i: number = 0;
  j: number = 0;

  neighbors: Array<Spot> = [];

  previous: any = null;

  color: string = '';

  wall: boolean = false;

  constructor(i: number, j: number, color: string) {
    this.i = i;
    this.j = j;
    this.color = color;
    if (Math.random() < 0.1) {
      this.wall = true;
    }
  }

  addNeighbors(grid: Array<Array<Spot>>, cols: number, rows: number) {
    let i = this.i;
    let j = this.j;

    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
  }
}
export { Spot };

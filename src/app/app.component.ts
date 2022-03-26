import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Spot } from './classes/Spot';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  cols: number = 10;
  rows: number = 10;

  delay = 100;

  grid: Array<Array<Spot>> = new Array(this.cols);

  openSet: Array<Spot> = [];
  closedSet: Array<Spot> = [];

  start: Spot = new Spot(0, 0, '');
  end: Spot = new Spot(0, 0, '');

  path: Array<Spot> = [];

  ngOnInit(): void {
    //this.initializeGrid();
    //return;
  }

  ngAfterViewInit(): void {}

  async startAStar(): Promise<void> {
    while (true) {
      if (this.openSet.length > 0) {
        //keep going

        let winner = 0;
        for (let i = 0; i < this.openSet.length; i++) {
          if (this.openSet[i].f < this.openSet[winner].f) {
            winner = i;
          }
        }

        let current = this.openSet[winner];

        if (current === this.end) {
          // path complete
          let temp = current;
          this.path.push(temp);

          while (temp.previous) {
            this.path.push(temp.previous);
            temp = temp.previous;
          }

          //unpaint the openset and endset
          for (let i = 0; i < this.closedSet.length; i++) {
            this.grid[this.closedSet[i].i][this.closedSet[i].j].color = 'white';
          }
          for (let i = 0; i < this.openSet.length; i++) {
            this.grid[this.openSet[i].i][this.openSet[i].j].color = 'white';
          }

          //paint the path
          for (let i = 0; i < this.path.length; i++) {
            this.path[i].color = 'purple';
          }
          console.log('DONE!');
          return;
        }

        this.removeFromArray(this.openSet, current);
        this.closedSet.push(current);

        var neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
          let neighbor = neighbors[i];

          if (!this.closedSet.includes(neighbor) && !neighbor.wall) {
            let tempG = current.g;

            if (this.openSet.includes(neighbor)) {
              if (tempG < neighbor.g) {
                neighbor.g = tempG;
              }
            } else {
              neighbor.g = tempG;
              this.openSet.push(neighbor);
            }

            neighbor.h = this.heuristic(neighbor, this.end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }
      } else {
        console.log('nosolution');
        return;
      }

      await new Promise((f) => setTimeout(f, this.delay));

      for (let i = 0; i < this.closedSet.length; i++) {
        this.grid[this.closedSet[i].i][this.closedSet[i].j].color = 'red';
      }
      for (let i = 0; i < this.openSet.length; i++) {
        this.grid[this.openSet[i].i][this.openSet[i].j].color = 'green';
      }
    }
  }

  heuristic(a: Spot, b: Spot): number {
    let d: number = Math.sqrt(Math.pow(b.j - a.j, 2) + Math.pow(b.i - a.i, 2));
    //let d = Math.abs(a.i-b.i) + Math.abs(a.j-b.j);
    return d;
  }

  removeFromArray(arr: Array<Spot>, elt: Spot) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == elt) {
        arr.splice(i, 1);
      }
    }
  }
  initializeGrid(): void {
    //Empty the grid
    this.grid = new Array(this.cols);

    //Empty the Sets
    this.openSet = [];
    this.closedSet = [];

    //making a 2D array
    for (let i = 0; i < this.cols; i++) {
      this.grid[i] = new Array(this.rows);
    }

    //add spots to grid
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = new Spot(i, j, 'white');
      }
    }

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j].addNeighbors(this.grid, this.cols, this.rows);
      }
    }
    this.start = this.grid[0][0];
    this.end = this.grid[this.cols - 1][this.rows - 1];
    this.start.wall = false;
    this.end.wall = false;

    this.openSet.push(this.start);

    // setTimeout(() => {
    //   this.startAStar();
    // }, 1000);
    return;
  }
}

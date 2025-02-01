class From {
    static NOWHERE = 1;
    static NORTH = 2;
    static EAST = 3;
    static SOUTH = 4;
    static WEST = 5;
}

class Hamiltonian {
    constructor(width, height, start = [0, 0]) {
        this.arcs = {
            [From.NORTH]: [0, -1],
            [From.SOUTH]: [0, 1],
            [From.EAST]: [1, 0],
            [From.WEST]: [-1, 0]
        };
        this.width = width;
        this.height = height;
        this.start = start;
        this.grid = {};
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                this.grid[`${i},${j}`] = this.zigZag(i, j);
            }
        }
        this.grid[`${start[0]},${start[1]}`] = From.NOWHERE;
        this.currLoop = [];
    }

    generate(count = 100) {
        for (let i = 0; i < count; i++) {
            let sp = this.splitGrid();
            this.modifyPath(sp);
            let tu = this.mendGrid(sp);
            this.modifyPath(tu);
        }
    }

    modifyPath(spl) {
        let [ptA, ptB] = spl.map(pt => pt.split(',').map(Number));
        let pta = this.grid[`${ptA[0]},${ptA[1]}`], ptb = this.grid[`${ptB[0]},${ptB[1]}`];
        let orientation = pta;
        if (orientation === From.NORTH || orientation === From.SOUTH) {
            if (ptA[0] < ptB[0]) {
                pta = From.EAST; ptb = From.WEST;
            } else {
                pta = From.WEST; ptb = From.EAST;
            }
        } else {
            if (ptA[1] < ptB[1]) {
                pta = From.SOUTH; ptb = From.NORTH;
            } else {
                pta = From.NORTH; ptb = From.SOUTH;
            }
        }
        this.grid[`${ptA[0]},${ptA[1]}`] = pta;
        this.grid[`${ptB[0]},${ptB[1]}`] = ptb;
    }

    move(pt) {
        let [x, y] = pt.split(',').map(Number);
        let [dx, dy] = this.arcs[this.grid[pt]];
        let nextPt = `${x + dx},${y + dy}`;
        if (nextPt in this.grid && this.grid[nextPt] !== From.NOWHERE) {
            return nextPt;
        }
        return null;
    }

    setLoop(start, stop) {
        this.currLoop = [];
        let point = start;
        while (point && this.currLoop.length <= Object.keys(this.grid).length && point !== stop && this.grid[point] !== From.NOWHERE) {
            point = this.move(point);
            this.currLoop.push(point);
        }
        return point === stop;
    }

    splitGrid() {
        let candidates = [];
        Object.entries(this.grid).forEach(([pt, dir]) => {
            let [x, y] = pt.split(',').map(Number);
            let cx;
            if (dir === From.NORTH) {
                cx = `${x+1},${y-1}`;
                this.checkCandidate(cx, pt, candidates, From.SOUTH);
            } else if (dir === From.SOUTH) {
                cx = `${x+1},${y+1}`;
                this.checkCandidate(cx, pt, candidates, From.NORTH);
            } else if (dir === From.EAST) {
                cx = `${x+1},${y+1}`;
                this.checkCandidate(cx, pt, candidates, From.WEST);
            } else if (dir === From.WEST) {
                cx = `${x-1},${y+1}`;
                this.checkCandidate(cx, pt, candidates, From.EAST);
            }
        });
        if (candidates.length > 0) {
            let [start, end] = candidates[Math.floor(Math.random() * candidates.length)];
            if (this.setLoop(start, end)) {
                return [start, end];
            } else if (!this.setLoop(end, start)) {
                throw new Error('Cannot split. Loop failed.');
            }
            return [end, start];
        }
    }

    mendGrid(sp) {
        let candidates = [];
        Object.entries(this.grid).forEach(([pt, dir]) => {
            let [x, y] = pt.split(',').map(Number);
            let cx;
            if (dir === From.NORTH) {
                cx = `${x+1},${y-1}`;
                this.checkCandidateForMending(cx, pt, candidates, From.SOUTH, sp);
            } else if (dir === From.SOUTH) {
                cx = `${x+1},${y+1}`;
                this.checkCandidateForMending(cx, pt, candidates, From.NORTH, sp);
            } else if (dir === From.EAST) {
                cx = `${x+1},${y+1}`;
                this.checkCandidateForMending(cx, pt, candidates, From.WEST, sp);
            } else if (dir === From.WEST) {
                cx = `${x-1},${y+1}`;
                this.checkCandidateForMending(cx, pt, candidates, From.EAST, sp);
            }
        });
        if (candidates.length > 0) {
            return candidates[Math.floor(Math.random() * candidates.length)];
        } else {
            return sp;
        }
    }

    zigZag(x, y) {
        let even = y % 2 === 0;
        if ((x === 0 && even) || (x === this.width - 1 && !even)) {
            return From.NORTH;
        }
        return even ? From.WEST : From.EAST;
    }

    checkCandidate(cx, pt, candidates, oppositeDir) {
        if (cx in this.grid && this.grid[cx] === oppositeDir) {
            candidates.push([pt, cx]);
        }
    }

    checkCandidateForMending(cx, pt, candidates, oppositeDir, sp) {
        let [a, b] = sp;
        let [x, y] = pt.split(',').map(Number);
        let lx = this.currLoop.includes(pt);
        if (cx in this.grid && this.grid[cx] === oppositeDir) {
            let rx = this.currLoop.includes(cx);
            if (rx !== lx && (pt !== a || cx !== b) && (pt !== b || cx !== a)) {
                candidates.push([pt, cx]);
            }
        }
    }

    printPath() {
        let resultStr = '';
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[`${x},${y}`] === From.NORTH || (y > 0 && this.grid[`${x},${y-1}`] === From.SOUTH)) {
                    resultStr += ' |';
                } else {
                    resultStr += '  ';
                }
            }
            resultStr += ' \n';
            for (let x = 0; x < this.width; x++) {
                if (this.grid[`${x},${y}`] === From.WEST || (x > 0 && this.grid[`${x-1},${y}`] === From.EAST)) {
                    resultStr += '-O';
                } else {
                    resultStr += ' O';
                }
            }
            resultStr += ' \n';
        }
        console.log(resultStr);
    }
}
let c
let s

function getPathFromGrid(hamiltonian, startX, startY) {
    let path = [];
    w = hamiltonian.width
    if (w%2==0){
      end = [0, w-1]
    }
    else {
      end = [w-1, w-1]
    }
    console.log(hamiltonian.grid[`${end[0]},${end[1]}`])
    path.push([end[0], end[1]])
    console.log(path)
    console.log(hamiltonian.grid[`${path[path.length-1][0]},${path[path.length-1][1]}`])
    
  
  
  
  //      false){//
    while(path.length <= (w**2)-1){
      switch (hamiltonian.grid[`${path[path.length-1][0]},${path[path.length-1][1]}`]) {
        case 1:
          console.log('done')
          break
        case 2:
          path.push([path[path.length-1][0], path[path.length-1][1]-1])
          break
        case 3:
          path.push([path[path.length-1][0]+1, path[path.length-1][1]])
          break
        case 4:
          path.push([path[path.length-1][0], path[path.length-1][1]+1])
          break
        case 5:
          path.push([path[path.length-1][0]-1, path[path.length-1][1]])
          break
      }
    }
      return path
    
    }

  
  let path
function setup() {
  createCanvas(400,400)
  background(0)
  
  s = 30
  c = new Hamiltonian(s,s)
  c.generate(500)
  
  path = getPathFromGrid(c,0,0)
  console.log(path)
  
  createCanvas(400,400)
  background(0)
}

function draw() {
  for(let i of Array(s).keys()){
    for(let j of Array(s).keys()){
      push()
      fill('#000')
      stroke('#333')
      square(i*width/s, j*height/s, width/s)
      pop()
    }
  }
  //console.log(c.grid)
  
    // static NOWHERE = 1;
    // static NORTH = 2;
    // static EAST = 3;
    // static SOUTH = 4;
    // static WEST = 5;
  co = color('red')
  let limit = frameCount
  if (frameCount > path.length-1) {limit = path.length-1}
    for(let i = 0; i < limit; i++) {
      if (blue(co) < 254){co.setBlue(blue(co) + 255/path.length*2)}
      else{co.setRed(red(co) - 255/path.length*2)}
      
      push()
      translate(width/s/2, height/s/2)
      strokeWeight(10 * (20/s))
      stroke(co)
      line(path[i][0]*width/s, path[i][1]*height/s, (path[i+1][0])*width/s, (path[i+1][1])*height/s)
      pop()
  }
  push()
  translate(width/s/2, height/s/2)
  noStroke()
  fill(co)
  circle(path[path.length-1][0], path[path.length-1][1], 10 * 20/s)
  pop()
  
  
  //   push()
  //   translate(width/s/2, height/s/2)
  //   strokeWeight(20/s)
  //   noFill()
  //   stroke('#eee')
  // beginShape()
  // for(let point of path){
  //   vertex(point[0]*width/s, point[1]*height/s)
  // }
  // endShape()
  //   pop()
}
  
function mousePressed(){
  setup()
  frameCount = 0
}
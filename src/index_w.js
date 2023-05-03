let count = 0;

setInterval(function() {
  count++;
  clear()
  draw()
  if (count == 530) {
    count = -535  
  }
}, 1);

var canvas = document.getElementById("canvas")
canvas.width = 800;
canvas.height = 600;
var ctx = canvas.getContext("2d");

const slider = document.getElementById('slider')

const cdisLabel = document.getElementById("cdis")

var vc = 0
slider.addEventListener('input', (event) => {
  vc = event.target.value / 100
  cdisLabel.textContent = `${vc}c`
  beta = [vc, 0, 0]
  clear()
  draw()

}) 

function radians(degrees) {
  return degrees * Math.PI / 180 
}

function dot(u, v) {
  var result = 0 
  for (let i = 0; i < u.length; i++) {
    result += u[i] * v[i] 
  }

  return result 
}

function dotA(u, v) {
  const result = new Array(u.length) 
  
  for (let i = 0; i < u.length; i++) {
    result[i] = new Array(v[0].length).fill(0) 
    
    for (let j = 0; j < v[0].length; j++) {
      let sum = 0 
      for (let k = 0; k < u[0].length; k++) {
        sum += u[i][k] * v[k][j] 
      }
      result[i][j] = sum 
    }
  }

  return result 
}


function cross(u, v) {
  const result = [ u[1] * v[2] - u[2] * v[1],
                   u[2] * v[0] - u[0] * v[2],
                   u[0] * v[1] - u[1] * v[0]
  ] 
  return result 
}

function identity(n) {
  const M = Array.from({ length: n }, (v, i) =>
    Array.from({ length: n }, (w, j) => i === j ? 1 : 0)
  ) 
  return M 
}

function getTranslateMatrix(t) {
  const lt = [...t] 

  const M = identity(4) 
  M.forEach((row, i) => {
    if (lt[i] !== undefined) {
      row[3] = lt[i] 
    }
  }) 

  return M 
}

function getPerspMatrix(fovY, aspect, n, f) {
  const fo = 1 / Math.tan(0.5 * radians(fovY)) 

  const mat = new Array(4).fill().map(() => new Array(4).fill(0)) 

  mat[0][0] = fo / aspect 
  mat[1][1] = fo 
  mat[2][2] = (n + f) / (n - f) 
  mat[2][3] = -2 * f * n / (f - n) 
  mat[3][2] = -1 

  return mat 
}

function getViewMatrix(eye, center, upV) {
  const leye = eye
  const lcenter = center
  const lupV = upV

  var ez = [ //
    Math.abs(lcenter[0] - leye[0]),
    Math.abs(lcenter[1] - leye[1]),
    Math.abs(lcenter[2] - leye[2])
  ]

  ez = ez.map(x => x / Math.sqrt(dot(ez, ez)))

  const U = lupV.map(x => x / Math.sqrt(dot(lupV, lupV)))

  var ex = cross(U, ez)

  ex = ex.map(x => x / Math.sqrt(dot(ex, ex)))

  const ey = cross(ez, ex)

  var mat = identity(4)

  mat[0].splice(0, 3, ...ex) 
  mat[1].splice(0, 3, ...ey) 
  mat[2].splice(0, 3, ...ez) 

  mat = dotA(mat, getTranslateMatrix(leye.map( x => -x)))

  return mat
}

function calcGamma(beta) {
  return 1 / Math.sqrt(1 - dot(beta, beta))
}

function calcRho(gam, xS, beta, tObs) {
  return gam * dot(xS, beta) - tObs
}

function appLinePos(aOff, xObs, beta, xS, sigmaS, s, tObs) {
  var laOff = aOff
  const lxObs = xObs
  const lbeta = beta
  const lxS = xS
  const lsigmaS = sigmaS

  gam = calcGamma(beta)
  const g2 = gam**2 / (gam + 1.0)
  const rho = calcRho(gam, xS, beta, tObs)  
  const leta = xS.map((val, i) => val + g2 * dot(lxS, beta) * beta[i] + laOff[i] - lxObs[i]);
  const ber = dot(lbeta, leta) - rho
  const omega02 = gam**2 * ber**2 - rho**2 + dot(leta, leta)
  const upsilon = dot(leta, lsigmaS) + dot(lbeta, lsigmaS) * (-gam*rho+g2*dot(lbeta,leta))
  const omegal = Math.sqrt(omega02 + 2 * s * upsilon + s**2)
  const xs0 = gam * ber - omegal
  const t1 = lbeta.map(x => x * gam * xs0)
  const t4 = lsigmaS.map(x => x * s)
  const t5 = lbeta.map(x => x * g2 * s * dot(lbeta, lsigmaS))
  const result = [];
  for(let i = 0; i < t1.length; i++) {
    result.push(t1[i] + leta[i] + lxObs[i] + t4[i] + t5[i]);
  }
  return result
}

function map(MVP, pIn) {
  const lp = [pIn[0], pIn[1], pIn[2], 1];
  const lq = [
    dot(MVP[0], lp),
    dot(MVP[1], lp),
    dot(MVP[2], lp),
    dot(MVP[3], lp)
  ];
  return [lq[0], lq[1]].map(val => val / lq[3]);
}

function linspace(start, stop, num) {
  const step = (stop - start) / (num - 1);
  return Array.from({ length: num }, (v, i) => start + i * step);
}

function plotLine(a, vel, xS, sigma, smin, smax, t, col) {
  x = []
  y = []
  for (let s of linspace(smin, smax, 30)) {
    let pos = appLinePos(a, xObs, vel, xS, sigma, s, t);
    let npos = map(MVP, pos);
    x.push(npos[0]);
    y.push(npos[1]);
  }
  X.push(x)
  Y.push(y)
  C.push(col)
}

function plotBox(a, vel, t) {
  for (let i = 0; i < numBoxEdges; i++) {
    b = boxVerts[boxEdges[i][0]]
    b = b.map(x => x - 0.5)
    xS = b.map(x => x * 0.5)
    const sigma = []
    for (let j = 0; j < boxVerts[boxEdges[i][1]].length; j++) {
      sigma.push(boxVerts[boxEdges[i][1]][j] - boxVerts[boxEdges[i][0]][j]);
    }
    plotLine(a, vel, xS, sigma, 0, 0.5, t, 'b')
  }

  for (let i = 0; i < numBoxFrontEdges; i++) {
    b = boxFrontVerts[boxFrontEdges[i][0]]
    b = b.map(x => x - 0.5)
    xS = b.map(x => x * 0.5)
    const sigma = []
    for (let j = 0; j < boxFrontVerts[boxFrontEdges[i][1]].length; j++) {
      sigma.push(boxFrontVerts[boxFrontEdges[i][1]][j] - boxFrontVerts[boxFrontEdges[i][0]][j]);
    }
    plotLine(a, vel, xS, sigma, 0, 0.5, t, 'r')
  }
}

function clear() {
  X = []
  Y = []
  C = []
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  console.log(beta)
  plotBox(aOff, beta, tObs)

  ctx.fillStyle = "blue";
  
  for (let i = 0; i < X.length; i++) {
    for (let j = 0; j < X[i].length; j++) {
      if(C[i] == 'r') {
        ctx.fillStyle = "red";
      } else {
        ctx.fillStyle = "blue";
      }
      // console.log((X[i][j]*250 + 400), (Y[i][j]*250 + 300))
      ctx.fillRect((X[i][j]*250 + 400 + count ), (Y[i][j]*250 + 300), 9, 9);
    }
  }
}

const aOff =  [0, 0, 0]
const xObs = [0.5, 2, 0]
const center = [0, 0, 0]
const tObs = Math.sqrt(xObs[0]**2 + xObs[1]**2 + xObs[2]**2)
let beta = [0.0, 0.0, 0.0]
const fovY = 32.0
const upV = [0, 0, 1]
const projMatrix = getPerspMatrix(fovY, 1.0, 0.1, 100.0)
const viewMatrix = getViewMatrix(xObs, center, upV)
const MVP = dotA(projMatrix, viewMatrix)
const boxVerts = [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]]
const boxEdges = [[0,1],[1,2],[3,0],[4,5],[5,6],[7,4],[0,4],[1,5]]
const numBoxEdges = 8
const boxFrontVerts = [[0,1,0],[1,1,0],[1,1,1],[0,1,1]]
const boxFrontEdges = [[0,1],[1,2],[2,3],[3,0]]
const numBoxFrontEdges = 4

let X = [];
let Y = [];
let C = [];

draw()

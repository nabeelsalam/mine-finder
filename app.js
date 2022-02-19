const minesFoundContainer = document.getElementById('MinesFound');
const directionsContainer = document.getElementById('Directions');

let minesFoundCount = 0;
let useWorker = true;

let mineFieldSize = 20000

let base_image, context;


const startWorker = () => {
  if (typeof(Worker) !== "undefined") {
    if (typeof(w) == "undefined") {
      var cWorker = document
        .getElementById("canvas worker")
        .transferControlToOffscreen();
      w = new Worker("mine_worker.js");
    }
    w.onmessage = function({data}) {
      if(data.event === 'directions') {
      } else if(data.event === 'mineFound') {
        showMine(data.x, data.y);
      }
    };
    w.postMessage({ event: 'setup', size: mineFieldSize, width: window.innerWidth, height: window.innerHeight});
    w.postMessage({ event: 'canvas', canvas: cWorker }, [cWorker]);
  } else {
    console.log("Sorry! No Web Worker support.");
  }
}

const showMine = (x,y) => { 
  context.drawImage(base_image, x-24, y-24, 48, 48);
}

const generateMineField = (size) => {
  let mines = [];
  for(let i = 0; i < size; i++){
    const mine = {
      x: Math.floor(Math.random() * window.innerWidth),
      y: Math.floor(Math.random() * window.innerHeight) + 128,
      found: false
    };
    mines.push(mine);
  }
  return mines;
}

const startProgressAnimation = () => {
  var element = document.getElementById('box');
  var left = 0;
  let rAF_ID;
  
  var rAFCallback = function(){
    if( left == 1000 ) {
      left = 0;
    } else {
      left+= 5;
    }
    element.style.marginLeft = left + 'px';
    rAF_ID = requestAnimationFrame( rAFCallback );
  }
  
  rAF_ID = requestAnimationFrame( rAFCallback );
}

/**
 * Functionality after the page loads
 */
window.addEventListener('load', async e => {
  startProgressAnimation();
  if(useWorker) {
    startWorker();
    window.addEventListener('mousemove', e => { 
      w.postMessage({event: 'mousemove', x:e.offsetX, y: e.offsetY});
    });
  } else {
    const mines = generateMineField(mineFieldSize);
    const canvas = document
        .getElementById("canvas worker");
        context = canvas.getContext('2d');
        base_image = new Image();
        base_image.src = 'mine.png';
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = "gray";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-over';
    window.addEventListener('mousemove', e => { 
      x = e.offsetX;
      y = e.offsetY;
      let gapX = x - mines[0].x;
      let gapY = y - mines[0].y;
      let absGapX = Math.abs(gapX);
      let absGapY = Math.abs(gapY);

      for(let i = 0; i < mines.length; i++) {
        if(mines[i].found === false) {
          if(x < (mines[i].x + 20) && x > (mines[i].x - 20) && y > (mines[i].y - 20) && y < (mines[i].y + 20)) {
            showMine(mines[i].x, mines[i].y);
            mines[i].found = true;

          } else {
              if(Math.abs(x - mines[i].x) < absGapX || Math.abs(y - mines[i].y) < absGapY){
              absGapX = Math.abs(x - mines[i].x);
              gapX = x - mines[i].x;
              absGapY = Math.abs(y - mines[i].y);
              gapY = y - mines[i].y;
            }
          }
  
        }
/*           if(absGapX > absGapY && gapX > 0) {
          directionsContainer.innerHTML = 'Move Left';
        } else if(absGapX > absGapY && gapX < 0) {
          directionsContainer.innerHTML = 'Move Right';
        } else if(absGapX < absGapY && gapY > 0) {
          directionsContainer.innerHTML = 'Move Up';
        } else if(absGapX < absGapY && gapY < 0) {
          directionsContainer.innerHTML = 'Move Down';
        } */
        }
  
    }
    );
    }
});

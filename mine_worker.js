let mines = [];

let minesFoundCount = 0;
let ctxWorker;
let img;

const setupMineField = (size, width, height) => {
    for(let i = 0; i < size; i++){
        const mine = {
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height) + 128,
          found: false
        };
        mines.push(mine);
    }
}

onmessage = async function({data:e}) {
    if(e.event === 'setup') {
        setupMineField(e.size, e.width, e.height);
    } else if(e.event === 'canvas') {
        canvas = e.canvas;
        ctxWorker = canvas.getContext("2d");
        ctxWorker.globalCompositeOperation = 'destination-over';
        ctxWorker.fillStyle = "gray";
        ctxWorker.fillRect(0, 0, canvas.width, canvas.height);
        ctxWorker.globalCompositeOperation = 'source-over';
        const response = await fetch('mine.png')
        const blob = await response.blob()
        img = await createImageBitmap(blob);
    } else if(e.event === 'mousemove') {
        x = e.x;
        y = e.y;
        let gapX = x - mines[0].x;
        let gapY = y - mines[0].y;
        let absGapX = Math.abs(gapX);
        let absGapY = Math.abs(gapY);
  
        for(let i = 0; i < mines.length; i++) {
          if(mines[i].found === false) {
            if(x < (mines[i].x + 20) && x > (mines[i].x - 20) && y > (mines[i].y - 20) && y < (mines[i].y + 20)) {
              mines[i].found = true;
              // postMessage({ event: 'mineFound', x: mines[i].x, y: mines[i].y });
              ctxWorker && ctxWorker.drawImage(img,mines[i].x - 24, mines[i].y - 24, 48, 48);
  
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
            postMessage({event: 'directions', msg: 'Move Left'});
          } else if(absGapX > absGapY && gapX < 0) {
            postMessage({event: 'directions', msg: 'Move Right'});
          } else if(absGapX < absGapY && gapY > 0) {
            postMessage({event: 'directions', msg: 'Move Up'});
          } else if(absGapX < absGapY && gapY < 0) {
            postMessage({event: 'directions', msg: 'Move Down'});
          } */
        }
    }
};
  
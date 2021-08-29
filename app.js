const minesFoundContainer = document.getElementById('MinesFound');
const directionsContainer = document.getElementById('Directions');

let minesFoundCount = 0;

const showMine = (x,y) => { 
	var img = document.createElement('img'); 
    img.src = 'mine.png'; 
    img.style.cssText = `width:48px;height:48px;position:absolute;top:${y-24}px;left:${x-24}px`;
	  document.body.appendChild(img);
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

/**
 * Functionality after the page loads
 */
window.addEventListener('load', async e => {
  const mines = generateMineField(1000);
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
            minesFoundCount++;
            minesFoundContainer.innerHTML = `Mines Found: ${minesFoundCount}`;

          } else {
            if(Math.abs(x - mines[i].x) < absGapX || Math.abs(y - mines[i].y) < absGapY){
              absGapX = Math.abs(x - mines[i].x);
              gapX = x - mines[i].x;
              absGapY = Math.abs(y - mines[i].y);
              gapY = y - mines[i].y;
            }
          }
  
        }
        if(absGapX > absGapY && gapX > 0) {
          directionsContainer.innerHTML = 'Move Left';
        } else if(absGapX > absGapY && gapX < 0) {
          directionsContainer.innerHTML = 'Move Right';
        } else if(absGapX < absGapY && gapY > 0) {
          directionsContainer.innerHTML = 'Move Up';
        } else if(absGapX < absGapY && gapY < 0) {
          directionsContainer.innerHTML = 'Move Down';
        }
        }

  });
})

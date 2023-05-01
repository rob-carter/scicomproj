function changeImage(imageName) {
  document.getElementById("img").src = imageName;
}

const slider = document.getElementById('slider');

const cdisLabel = document.getElementById('cdis');

const calcs = document.getElementById('calcs');

calcs.textContent = '800.00 = 800.00 * sqrt(1 - (0.0^2 / 299792458^2))'

var vc = 0;

const c = 299792458

function lengthContraction(L, v) {
  const gamma = 1 / Math.sqrt(1 - Math.pow(v/c, 2));
  return L / gamma;
}

slider.addEventListener('input', (event) => {
  vc = event.target.value / 100
  cdisLabel.textContent = `${vc}c`
  var newl = lengthContraction(800, vc*c).toFixed(2)
  img.style.width = newl + 'px'
  // console.log(newl)
  calcs.textContent = newl + ` = 800.00 * sqrt(1 - (${vc*c}^2 / ${c}^2))`
});


function changeImage(imageName) {
  document.getElementById("img").src = imageName;
}

const slider = document.getElementById('slider');

const cdisLabel = document.getElementById("cdis");

var vc = 0;

const c = 299792458

function lengthContraction(L, v) {
  const gamma = 1 / Math.sqrt(1 - Math.pow(v/c, 2));
  return L / gamma;
}

slider.addEventListener('input', (event) => {
  vc = event.target.value / 100;
  cdisLabel.textContent = `${vc}c`;
  var newl = lengthContraction(800, vc*c) + 'px'
  img.style.width = newl;
  console.log(newl)
});


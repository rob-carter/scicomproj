var canvas = document.getElementById("canvas"), width = 640 * 0.5, height = 300 * 0.5;

const slider = document.getElementById('slider');

const cdisLabel = document.getElementById("cdis");

var vc = 0;

const c = 299792458

slider.addEventListener('input', (event) => {
  vc = event.target.value / 100;
  cdisLabel.textContent = `${vc}c`;
});
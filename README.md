# visualizing objects at near light speed

## info 

The goal of this project was to visualize what an object might look like when going at near light speed. 

To reach this goal, I created a site with two different simulations. The first is a ray traced sphere being transformed (index.html), and the other is a simpler length contraction simulation on 2d images (index_alt.html). Both are interactive with the slider, the furthest right position represents 0.99c.

To calculate length contraction the following formula is used:

<p>
  <img src="./assets/lc.png" width="150" height="50" title="Length Contraction">
</p>

Where L' is the obvserved length of the object. $L_0$ is the measured length when stationary. v is a fraction of the speed of light that the object is moving at. c is the speed of light constant.

## how to use
1. clone repo
2. (optional) serve on port 5500
3. just open the html files or goto http://localhost:5500 if running server

_navbar expects localhost server to work_

## only possible with great help from
* https://iopscience.iop.org/article/10.1088/0143-0807/35/6/065025
* https://www.youtube.com/watch?v=oFaSLIsJELY
* https://github.com/thoszhang/relativistic-ray-tracer
* https://github.com/tmcw/literate-raytracer

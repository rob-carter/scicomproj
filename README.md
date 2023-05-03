# visualizing objects at near light speed

## info 

The goal of this project was to visualize what an object would look like when going at near light speed and compare it to it's measured length. 

To reach this goal, I created a site with two different simulations.
The first is a cube wireframe that transforms depending on the speed it is going in the x axis (index.html), and the other is a simpler length contraction simulation on 2d images (index_alt.html). Both are interactive with the slider, the furthest right position represents 0.99c.


The wireframe cube appears to rotate as the speed increases, this isn't due to any form of traditional rotation. It occurs due to something called the Terrel rotation. 
When an object moves at siginficant fraction of the speed of light, the light from the side or backside of an object is no longer blocked by the object itself. This because the object moved out of the way of the ray before they intersected. This means that a light ray that would never been seen is now visible. This gives the appearance of rotation. If you were to measure the object it would still be what it was before, but contracted. This is seen in the 2nd simulation.

To calculate length contraction the following formula is used:

<p>
  <img src="./assets/lc.png" width="150" height="50" title="Length Contraction">
</p>

Where L' is the obvserved length of the object. $L_0$ is the measured length when stationary. v is a fraction of the speed of light that the object is moving at. c is the speed of light constant.

## how to use
1. clone repo
2. (optional) serve on port 5500
3. just open the html files or goto http://localhost:5500 if running server

_navbar expects local server to work_

The other directory contains unfished/potential future work.

## only possible with great help from
* https://iopscience.iop.org/article/10.1088/0143-0807/35/6/065025
* https://www.youtube.com/watch?v=oFaSLIsJELY
* https://github.com/thoszhang/relativistic-ray-tracer (not used in final project, check other dir for wip)
* https://github.com/tmcw/literate-raytracer
* https://en.wikipedia.org/wiki/Terrell_rotation

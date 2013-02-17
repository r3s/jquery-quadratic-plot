jQuery-Quadratic-Plot
=====================

A jQuery plugin that can plot quadratic equation on an HTML5 canvas element

Usage:
------
1. Define a canvas element in the HTML file. '<canvas id="myCanvas" width="500" height="500"></canvas'
2. Include the jquery-quadratic-plot.js '<script  type="text/javascript" src="js/jquery-quadratic-plot.js">'
3. Call the plugin on your canvas element. '$("#myCanvas").quadraticPlot({a:-2,b:-3,c:1});'

Note: a,b,c corresponds to a,b,c in the equation ax^2+bx+c


Options:
--------

'
{
        a : 0,                //the value of a in the equation ax^2+bx+c
        b : 0,                //the value of b in the equation ax^2+bx+c
        c : 0,                //the value of c in the equation ax^2+bx+c
        curveColour : "#0f0", //The colour to draw the parabola
        curveWidth:2,         //The width of the line for the parabola
        drawAxis : true,      //Draw x and y axis
        axisColour:"#000",    // Colour for the x and y axis
        step:0.5,             //Value to increment the x value. smaller means smoother lines
        unitPixels:10,        //1unit = X pixels. Default is 1unit=10px
        drawGrid : true,      //draw grids of defined unitPixels
        gridColour:"#eee",    //The colour of the grid
        drawSubGrid: false,   //Divide the grid in to subgrids
        subGridColour:"#ccc", //Colour of the subgrid lines
        writeEquation:true    //Write equation on canvas
    };

'

Note: The options drawSubGrid, subGridColour and writeEquation are not supported yet.
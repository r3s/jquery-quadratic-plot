/*
 *  Project: Jquery Quadratic Equation Plot Plugin
 *  Description: Plots aquadratic euation on an HTML5 canvas
 *  Author: Rahul ES
 *  License: MIT 
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ($, window, document, undefined) {

    
    // Create the defaults once
    var pluginName = "quadraticPlot";
    //Default options
    var defaults = {
        a : 0, //the value of a in the equation ax^2+bx+c
        b : 0, //the value of b in the equation ax^2+bx+c
        c : 0, //the value of c in the equation ax^2+bx+c
        curveColour : "#0f0", //The colour to draw the parabola
        curveWidth:2, //The width of the line for the parabola
        drawAxis : true, //Draw x and y axis
        axisColour:"#000", // Colour for the x and y axis
        step:0.5, //Value to increment the x value. smaller means smoother lines
        unitPixels:10, //1unit = X pixels. Default is 1unit=10px
        drawGrid : true, //draw grids of defined unitPixels
        gridColour:"#eee", //The colour of the grid
        drawSubGrid: false, //Divide the grid in to subgrids
        subGridColour:"#ccc", //Colour of the subgrid lines
        writeEquation:true //Write equation on canvas
    };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        //Extend the options passed
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            
            //Get the parameters of the canvas
            var height = this.element.height;
            var width = this.element.width;
            
            //m_x is the maximum limit for x of the curve. 
            var m_x = width/2;
            var m_y = height/2;
            //use an object params to store the above values required for plotting
            var params = {width:width,height:height,max_x:m_x,max_y:m_y};
            //call the function qPlot which plots
            this.qPlot(params);
        },
        setOptions: function(params,ctx){
            if(this.options.drawGrid==true){
                //Draw the grids if the option  is set
                this.drawGrids(this.options.unitPixels,this.options.drawSubGrid,params,ctx,
                                this.options.gridColour,this.options.subGridColour);
            }
             //Draw axis if the option is set
            if(this.options.drawAxis==true){
                //Set axis color and draw the x and y axis
                ctx.strokeStyle=this.options.axisColour;
                this.drawLine((-1*params.max_x),0,params.max_x,0,ctx);
                this.drawLine(0,(-1*params.max_y),0,params.max_y,ctx);
            }
            if(this.options.writeEquation==true){
                /*TODO: Write Equation*/
            }
            
        },
        /* The following fuction uses a canvas context to draw a line
            from (start_x,start_y) to (end_x,end_y)
        */
        drawLine: function(start_x,start_y,end_x,end_y,ctx){
            ctx.beginPath();
            ctx.moveTo(start_x,start_y);
            ctx.lineTo(end_x,end_y);
            ctx.stroke();
            ctx.closePath();
        },
         /* The following fuction uses a canvas context to draw grids
            starting from the left most point (0,0). It first draws 
            vertical stripes and then horizontal stripes. The argument
            unit is used as the increment. Argument subunit should be 
            used for dividing the main unit in to smaller parts. The
            colours are also passed in as argument.
        */
        drawGrids: function(unit,subgrid,params,ctx,main_grid_colour,sub_grid_colour){
            ctx.strokeStyle=main_grid_colour;
            ctx.moveTo(0,0);
            var main_unit=0;
            // Draw vertical lines
            while(main_unit<params.width){
                main_unit+=unit;
                //Vertical lines right of y-axis
                this.drawLine(main_unit,(-1*params.height),main_unit,params.height,ctx);
                //Vertical lines left of y-axis
                this.drawLine((-1*main_unit),(-1*params.height),(-1*main_unit),params.height,ctx);
            }
            //Draw horizontal lines
            ctx.moveTo(0,0);
            main_unit=0;
            while(main_unit<params.height){
                main_unit+=unit;
                //Horizontal lines above x-axis
                this.drawLine((-1*params.max_x),main_unit,params.max_x,main_unit,ctx);
                //Horizontal lines below y-axis
                this.drawLine((-1*params.max_x),(-1*main_unit),params.max_x,(-1*main_unit),ctx);
            }


        },
        qPlot: function (params) {
            //Get 2d context from the canvas element. This will be used for drawing
            var ctx = this.element.getContext("2d");
            ctx.translate(params.max_x,params.max_y);
            //Store the values of options in to local variables
            var a=this.options.a;
            var b=this.options.b;
            var c=this.options.c;

            this.setOptions(params,ctx);

          
            
            //Calculate h and k. h and k decides the focus/origin of the curve!
            var h = ((-1*b)/(2*a));
            var k = (-1)*((a*(h*h))+(b*h)+c);
        

            //set colour n width defined in options
            ctx.strokeStyle=this.options.curveColour;
            ctx.lineWidth=this.options.curveWidth;
            //start with x=h, that is the focus of the curve
            var x=h;
            var y=0;
            
            var temp_h=h*this.options.unitPixels;
            var temp_k=k*this.options.unitPixels;
            var prev_x1=temp_h,prev_y1=temp_k,prev_x2=temp_h;
            var new_x=0,new_y=0;
            var negx=0;
            while(Math.abs(prev_y1)<params.max_y){

                //Calculate value of the function for value of x
                y = (-1)*((a*(x*x))+(b*x)+c);
                //Convert the values in to pixels and multiply with unit for scaling
                new_x=x*this.options.unitPixels;
                new_y=y*this.options.unitPixels;
                //Calculate the symmetric value for x for the current point
                negx =new_x+2*(temp_h-new_x);
                //Draw the 2 lines
                this.drawLine(prev_x1,prev_y1,new_x,new_y,ctx);
                this.drawLine(prev_x2,prev_y1,negx,new_y,ctx);
                //Store current values for use in next iteration
                prev_x1=new_x;
                prev_y1=new_y;
                prev_x2=negx;
                 //increment x with the defined step value in options. 
                 //the smaller the value, the finer the curve.
                x+=this.options.step;

            }



                
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
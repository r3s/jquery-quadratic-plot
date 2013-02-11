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
    var defaults = {
        a : 0,
        b : 0,
        c : 0,
        colour : "#000",
        drawAxis : true,
        drawGrid : true
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
            
            //Set the origin as center of the canvas
            var o_x = width/2;
            var o_y = height/2;
            //m_s is max_side, which is the maximum limit for the curve.
            var m_s = width/2;
            //use an object params to store the above values required for plotting
            var params = {origin_x:o_x,origin_y:o_y,max_side:m_s};
            //call the function qPlot which plots
            this.qPlot(this.element,this.options,params);
        },
        qPlot: function (element, options, params) {
            //Get 2d context from the canvas element. This will be used for drawing
            var ctx = element.getContext("2d");
            //Store the values of options in to local variables
            var a=this.options.a;
            var b=this.options.b;
            var c=this.options.c;

            //Draw axis if the option is set
            if(this.options.drawAxis==true){
                //Begin path for the axis
                ctx.beginPath();
                //Draw x axis
                ctx.moveTo(0,params.origin_y);
                ctx.lineTo((params.origin_x*2),params.origin_y);
                ctx.stroke();
                //Draw y axis
                ctx.moveTo(params.origin_x,0);
                ctx.lineTo(params.origin_x,(params.origin_y*2));
                ctx.stroke();
                ctx.closePath();
            }
            //Begin path for the quadratic curve
            
            //set colour to colour defined in options
            ctx.strokeStyle=this.options.colour;
            //Calculate h and k. h and k decides the origin of the curve! Mathematics baby
            var h = ((-1*b)/(2*a));
            var k = ((a*(h*h))+(b*h)+c);
            //Store these values in to temporary variables. The original values will be reused
            var temp_h = params.origin_x+h;
            var temp_k = params.origin_y+k;
                
            ctx.beginPath();
            //start with x=0
            var x=0;
            while(true){
                //Calculate value of the function for value of x
                var y = ((a*(x*x))+(b*x)+c);
                y=(-1*y);
                //Get the vertex corresponding to the canvas
                var vertex_x=params.origin_x+(x*10);
                var vertex_y=params.origin_y+(y*10);
                // //move to the position from which we'll draw
                ctx.moveTo(temp_h,temp_k);
                //draw the line to new (x,y) 
                ctx.lineTo(vertex_x,vertex_y);
                //ctx.arc(vertex_x,vertex_y,3,0,2*Math.PI);
                ctx.stroke();
                //change the next starting point to current (x,y)
                console.log(vertex_x,vertex_y);
                temp_h=vertex_x;
                temp_k=vertex_y;
                //increment 0.1. For smoother curves
                x+=0.1;
                //if our max limit is reached, break
                if(x>params.max_side || x>1000 )
                    break;
            }
            ctx.closePath();
            ctx.beginPath();
                
            //Reset temp variables to come back to the origin. We will be drawing the second side
            temp_h=params.origin_x+h;
            temp_k=params.origin_y+k;
            x=0;
            while(true){
                var y = ((a*(x*x))+(b*x)+c);
                y=(-1*y);
                var vertex_x=params.origin_x+(x*10);
                var vertex_y=params.origin_y+(y*10);
                
                ctx.moveTo(temp_h,temp_k);
                ctx.lineTo(vertex_x,vertex_y);
                ctx.stroke();
                
                temp_h=vertex_x;
                temp_k=vertex_y;
               
                //only change is here. Instead on incrementing x, we decrease it
                x-=0.1;
                if((-1*x)>params.max_side || (-1*x)>1000)
                   { console.log('breaking with x= '+x);break;}
            }

            ctx.closePath();
                
            
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
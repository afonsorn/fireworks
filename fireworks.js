/*
Authors:
    52281 Diogo Gomes
    53193 Afonso Nascimento
*/
const g = -0.1;
var gl;
var time = 0;
var timeL;
var isDrawing = false;
var startPos, endPos;
var autoStartPos, autoEndPos;
var cx, cy;
var programPoints, programLines;
var nPoints = 0; //number of vertexes drawned

var vPosition_lines;
var vPosition_points;
var vSpeed;
var vSpeedL;
var initTime;
var vColorPoints;
var vColorLines;
var newSpeedL
var explosionTime;
var newNewSpeedL;

var bufferLines;
var bufferPoints;
var bufferTimes;
var bufferSpeed;
var bufferColorsLines;
var bufferColorsPoints;
var bufferExplosionTime;
var bufferNewSpeed;
var bufferNewNewSpeed;

var running = false;
var autoInterval;
var doSecondExplosion = true;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }
    
    canvas.addEventListener("mousedown", doMouseDown, false);
    canvas.addEventListener("mousemove", doMouseMovement, false);
    canvas.addEventListener("mouseup", doMouseUp, false);
    canvas.addEventListener("mouseout", doMouseOut, false);
        
    document.addEventListener("keyup", function(e){
        if(e.keyCode == 32){
			running = !running;
			if(running) {
				autoInterval = setInterval(spaceClick, 300);
			} else clearInterval(autoInterval);
		}
    });
    document.addEventListener("keyup", function(e){
        if(e.keyCode == 13){
			doSecondExplosion = !doSecondExplosion;
		}
    });
    
	
	function spaceClick()	{
        var h = canvas.height;
            
        cx = Math.floor(Math.random() * canvas.width);
        cy = Math.floor(Math.random() * (h*0.8 - h*0.69)+h*0.69);
        autoEndPos = getVertex(cx,cy);
        autoStartPos = getVertex(cx,h);	
        vSpeed = vec2(autoEndPos[0]-autoStartPos[0],autoEndPos[1]-autoStartPos[1]);
           
        var randomColor = vec3(Math.random(),Math.random(),Math.random());
            
            
        for(var i=0; i<(Math.random() * (250 - 10) + 10); i++){
            var magnitude = Math.random()/8;
            var angle = Math.PI*(Math.random()*2);
            var newSpeed = vec2(magnitude*Math.sin(angle),magnitude*Math.cos(angle));
            var explTime = -vSpeed[1]/g;
            
            for(var j=0; j<5; j++){
                var newNewSpeed=0;
                if(doSecondExplosion){
                    var secondMagnitude = Math.random()/8;
                    var secondAngle = Math.PI*(Math.random()*2);
                    newNewSpeed = vec2(secondMagnitude*Math.sin(secondAngle),secondMagnitude*Math.cos(secondAngle));
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoints);
                gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*8, flatten([autoStartPos]));

                gl.bindBuffer(gl.ARRAY_BUFFER, bufferSpeed);
                gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*8, flatten([vSpeed]));

                gl.bindBuffer(gl.ARRAY_BUFFER, bufferTimes);
                gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*4, flatten([time]));

                gl.bindBuffer(gl.ARRAY_BUFFER, bufferColorsPoints);
                gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*12, flatten([randomColor]));

                gl.bindBuffer(gl.ARRAY_BUFFER, bufferSpeed);
                gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*8, flatten([vSpeed]));

                gl.bindBuffer(gl.ARRAY_BUFFER, bufferNewSpeed);
                gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*8, flatten([newSpeed]));

                gl.bindBuffer(gl.ARRAY_BUFFER, bufferExplosionTime);
                gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*4, flatten([explTime]));

                gl.bindBuffer(gl.ARRAY_BUFFER, bufferNewNewSpeed);
                gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*8, flatten([newNewSpeed]));

                nPoints++;
            }
        }
        
	}
	
	
    function doMouseDown(){
        if(event.button==0){
            cx = event.offsetX;
            cy = event.offsetY;
            startPos = getVertex(cx,cy);
            endPos = startPos;
            var randomColor = vec3(Math.random(),Math.random(),Math.random());
            isDrawing = true;
            
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferLines);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten([startPos,endPos]));
            
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferColorsLines);
            gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*12, flatten([randomColor]));
            
        }
    }
    
    function doMouseMovement(){
        if(isDrawing){
            cx = event.offsetX;
            cy = event.offsetY;
            endPos = getVertex(cx,cy);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferLines);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten([startPos,endPos]));
            
        }
        
    }
    
    function doMouseUp(){
        if(event.button==0 && isDrawing){
            cx = event.offsetX;
            cy = event.offsetY;
            endPos = getVertex(cx,cy);
            vSpeed = vec2(endPos[0]-startPos[0],endPos[1]-startPos[1]);
           
            var randomColor = vec3(Math.random(),Math.random(),Math.random());
            isDrawing = false;
            
            
            for(var i=0; i<(Math.random() * (250 - 10) + 10); i++){
                var magnitude = Math.random()/10;
                var angle = Math.PI*(Math.random()*2);
                var newSpeed = vec2(magnitude*Math.sin(angle),magnitude*Math.cos(angle));
                var explTime = -vSpeed[1]/g;
                
                for(var j=0; j<5; j++){
                    var newNewSpeed=0;
                    if(doSecondExplosion){
                        var secondMagnitude = Math.random()/8;
                        var secondAngle = Math.PI*(Math.random()*2);
                        newNewSpeed = vec2(secondMagnitude*Math.sin(secondAngle),secondMagnitude*Math.cos(secondAngle));
                    }
                    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoints);
                    gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*8, flatten([startPos]));

                    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSpeed);
                    gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*8, flatten([vSpeed]));

                    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTimes);
                    gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*4, flatten([time]));

                    gl.bindBuffer(gl.ARRAY_BUFFER, bufferColorsPoints);
                    gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*12, flatten([randomColor]));

                    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSpeed);
                    gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*8, flatten([vSpeed]));

                    gl.bindBuffer(gl.ARRAY_BUFFER, bufferNewSpeed);
                    gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*8, flatten([newSpeed]));

                    gl.bindBuffer(gl.ARRAY_BUFFER, bufferExplosionTime);
                    gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*4, flatten([explTime]));

                    gl.bindBuffer(gl.ARRAY_BUFFER, bufferNewNewSpeed);
                    gl.bufferSubData(gl.ARRAY_BUFFER, nPoints*8, flatten([newNewSpeed]));

                    nPoints++;
                }
            }
           
            
        }
    }
    
    function doMouseOut(){
        if(event.button==0){
            isDrawing = false;
        }
    }
    
    function getVertex(x,y){
        var cx = gl.canvas.width;
        var cy = gl.canvas.height;
        
        var wx = x/cx;
        var wy = y/cy;
        
        wx *= 2;
        wy *= 2;
        
        wx -= 1;
        wy -= 1;
        
        wy *= -1;
        
        return vec2(wx,wy);
    }
    
    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    // Load shaders and initialize attribute buffers
    programPoints = initShaders(gl, "vertex-shader-vertices", "fragment-shader");
    programLines = initShaders(gl, "vertex-shader-lines", "fragment-shader");
    
    /**************************BUFFERS*******************************/
    
    // Load the data into the GPU
    
    //points
    bufferPoints = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoints);
    gl.bufferData(gl.ARRAY_BUFFER, 65000*8, gl.STATIC_DRAW);
    
    vPosition_points = gl.getAttribLocation(programPoints, "vPosition");
    gl.vertexAttribPointer(vPosition_points, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition_points);
    
    //speed
    bufferSpeed = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSpeed);
    gl.bufferData(gl.ARRAY_BUFFER, 65000*8, gl.STATIC_DRAW);
    
    vSpeedL = gl.getAttribLocation(programPoints, "vSpeed");
    gl.vertexAttribPointer(vSpeedL, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vSpeedL);
    
    //lines
    bufferLines = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferLines);
    gl.bufferData(gl.ARRAY_BUFFER, 16, gl.STATIC_DRAW);
    
    vPosition_lines = gl.getAttribLocation(programLines, "vPosition");
    gl.vertexAttribPointer(vPosition_lines, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition_lines);
    
    //times
    bufferTimes = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTimes);
    gl.bufferData(gl.ARRAY_BUFFER, 65000*4, gl.STATIC_DRAW);
    
    initTime = gl.getAttribLocation(programPoints, "initTime");
    gl.vertexAttribPointer(initTime, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(initTime);
    
    //colors for the points
    bufferColorsPoints = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferColorsPoints);
    gl.bufferData(gl.ARRAY_BUFFER, 65000*12, gl.STATIC_DRAW);
    
    vColorPoints = gl.getAttribLocation(programPoints, "vColor");
    gl.vertexAttribPointer(vColorPoints, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColorPoints);
    
    //colors for the lines
    bufferColorsLines = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferColorsLines);
    gl.bufferData(gl.ARRAY_BUFFER, 65000*12, gl.STATIC_DRAW);
    
    vColorLines = gl.getAttribLocation(programLines, "vColor");
    gl.vertexAttribPointer(vColorLines, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColorLines);
    
    //new speed for explosion
    bufferNewSpeed = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferNewSpeed);
    gl.bufferData(gl.ARRAY_BUFFER, 65000*8, gl.STATIC_DRAW);
    
    newSpeedL = gl.getAttribLocation(programPoints, "newSpeed");
    gl.vertexAttribPointer(newSpeedL, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(newSpeedL);
    
    //times of explosion
    bufferExplosionTime = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferExplosionTime);
    gl.bufferData(gl.ARRAY_BUFFER, 65000*4, gl.STATIC_DRAW);
    
    explosionTime = gl.getAttribLocation(programPoints, "explosionTime");
    gl.vertexAttribPointer(explosionTime, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(explosionTime);
    
    //new new speed for explosion
    bufferNewNewSpeed = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferNewNewSpeed);
    gl.bufferData(gl.ARRAY_BUFFER, 65000*8, gl.STATIC_DRAW);
    
    newNewSpeedL = gl.getAttribLocation(programPoints, "newNewSpeed");
    gl.vertexAttribPointer(newNewSpeedL, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(newNewSpeedL);
    /****************************************************************/
    
    timeL = gl.getUniformLocation(programPoints,"time");
    
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.DST_ALPHA, gl.ONE, gl.ONE);
    gl.enable(gl.BLEND);
    
    render();

    
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    time += 0.05;
    if(isDrawing){
        gl.useProgram(programLines);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferLines);
        gl.vertexAttribPointer(vPosition_lines, 2, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferColorsLines);
        gl.vertexAttribPointer(vColorLines, 3, gl.FLOAT, false, 0, 0);
        
        gl.drawArrays(gl.LINES, 0, 2);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
    gl.useProgram(programPoints);
        
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoints);
    gl.vertexAttribPointer(vPosition_points, 2, gl.FLOAT, false, 0, 0);
        
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSpeed);
    gl.vertexAttribPointer(vSpeedL, 2, gl.FLOAT, false, 0, 0);
        
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTimes);
    gl.vertexAttribPointer(initTime, 1, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferColorsPoints);
    gl.vertexAttribPointer(vColorPoints, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferNewSpeed);
    gl.vertexAttribPointer(newSpeedL, 2, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferExplosionTime);
    gl.vertexAttribPointer(explosionTime, 1, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferNewNewSpeed);
    gl.vertexAttribPointer(newNewSpeedL, 2, gl.FLOAT, false, 0, 0);
        
    gl.uniform1f(timeL, time);
    gl.drawArrays(gl.POINTS, 0, nPoints);
        
    requestAnimationFrame(render);
}


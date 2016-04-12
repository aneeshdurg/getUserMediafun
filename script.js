var video, canvas, context, width, height;
var color = 0;
var counter = 0;
var discospeed = 100;
var initialf = null;
var lastframe = null;
var dobsub = false;
var doincreaseRed = false;
var dobinsub = false;
var dobsub2 = false;
var dobgr2gray = false;
var dogaussblur = false;
var subThresh = 10;
var action = "none";


navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
function updateAction(){
	action = "";
	if(dobsub){
		action+="Background subtractor|"
	}
	else if(dobsub2){
		action+="Background subtractor2|";
	}
	else if(dobinsub){
		action+="Binary background subtractor|";
	}
	else if(doincreaseRed){
		action+="Disco mode!|";
	}
	else{
		action = "none";
	}
	document.getElementById("action").innerHTML = action;
}

function stUp(){
	subThresh+=1;
	document.getElementById("subThresh").innerHTML = "subtractor threshold = "+subThresh;
	
}
function stdn(){
	subThresh-=1;
	document.getElementById("subThresh").innerHTML = "subtractor threshold = "+subThresh;
}


function setbinsub(){
	if(dobinsub){
		dobinsub = false;
	}
	else{
		dobinsub = true;
		dobsub = false;
		dobsub2 = false;
	}	
	updateAction();
}
function setbsub(){
	if(dobsub2){
		dobsub2 = false;
		dobsub = false;
	}
	if(dobsub){
		dobsub = false;
		dobsub2 = true;	
	}
	else{
		dobsub = true;
		dobsub2 = false;
		dobinsub = false;
	}
	updateAction();
}

function reset(){
	dobsub = false;
	dobsub2 = false;
	dobinsub = false;
	doincreaseRed = false;
	color = 0;
	counter = 0;
	discospeed = 100;
	initialf = null;
	document.getElementById("discospeed").innerHTML = "Disco speed = 100";
	subThreshElem.innerHTML = "subtractor threshold = 10";
	updateAction();
}
function setdisco(){
	if(doincreaseRed){
		if(discospeed>10){
			discospeed-=10;
		}
		discospeed-=1;
		if(discospeed<=0){
			doincreaseRed = false;
			discospeed = 100;
		}
	}
	else{
		doincreaseRed = true;
	}
	document.getElementById("discospeed").innerHTML = "Disco speed = "+discospeed;
	updateAction();
}
function setbgr2gray(){
	dobgr2gray = !dobgr2gray;
}

function setgaussblur(){
	dogaussblur = !dogaussblur;
}

function initialize(){
	video = document.getElementById("vid");
	canvas = document.getElementById("c");
	context = canvas.getContext("2d");

	width = 640;
	height = 480; 
	canvas.width = width;
	canvas.height = height;

	navigator.getUserMedia({video:true}, startStream, function(){});
}

function startStream(stream){
	video.src = URL.createObjectURL(stream);
	video.play();

	requestAnimationFrame(draw);
}

function draw(){
	var frame = readFrame();
	if(frame){
		if(counter>=100){
			if(!initialf){
				initialf = frame.data;
			}
			else{
				if(dobsub){
					bsub(frame.data);
				}
				if(dobsub2){
					bsub2(frame.data, subThresh);
				}
				if(doincreaseRed){
					increaseRed(frame.data, color);
				}
				if(dobinsub){
					binsub(frame.data, subThresh);
				}
				if(dobgr2gray){
					bgr2gray(frame.data);
				}
				//motionDetect(frame.data);
				if(dogaussblur){
					GaussBlur(frame.data, 1.5);
				}
			}
		}
		context.putImageData(frame, 0, 0);
	}
	counter+=1;
	if(counter%discospeed==0){
		color+=1;
		color%=3;
	}
	requestAnimationFrame(draw);
}

function readFrame(){
	try{
		context.drawImage(video, 0, 0, width, height);
	} catch(e){
		console.log(e);
		return null;
	}
	return context.getImageData(0, 0, width, height);
}

function increaseRed(data, color){
	var len = data.length;
	for(var i = 0, j = 0; j<len; i++, j+=4){
		data[j+color]+=70;
		if(data[j]>255){
			data[j] = 255;
		}
	}
}
function bsub(data){
	var len = data.length;
	for(var i = 0, j = 0; j<len; i++, j+=4){
		for(var k=0; k<3; k++){
			data[j+k]-=initialf[j+k];
			if(data[j+k]<0){
				data[j+k] = 0;
			}
			if(data[j+k]>255){
				data[j+k]=255;
			}
		}
	}
}

function bsub2(data, thresh){
	var len = data.length;
	for(var i=0, j=0; j<len; i++, j+=4){
		var replace = true;
		if(Math.abs(data[j]-initialf[j])>thresh){
			if(Math.abs(data[j+1]-initialf[j+1])>thresh)
				if(Math.abs(data[j+2]-initialf[j+2])>thresh){
					replace = false;
				}
		}
		if(replace){
			data[j] = 0;
			data[j+1] = 0;
			data[j+2] = 0;
		}
	}
}

function binsub(data, thresh){
	var len = data.length;
	for(var i = 0, j = 0; j<len; i++, j+=4){
		var replace = true;
		if(Math.abs(data[j]-initialf[j])>thresh){
			if(Math.abs(data[j+1]-initialf[j+1])>thresh)
				if(Math.abs(data[j+2]-initialf[j+2])>thresh){
					replace = false;
				}
		}
		if(replace){
			data[j] = 0;
			data[j+1] = 0;
			data[j+2] = 0;
		}
		else{
			data[j] = 255;
			data[j+1] = 255;
			data[j+2] = 255;
	
		}
	
	}
}

function GaussBlur(data, sigma){
	bgr2gray(data);
	var len = data.length;
	for(var i=0, j=0; j<len; i++, j+=4){
		try{
			var current = 0;
			var num = 9;
			current += data[j]*0.147;//*weight(j, sigma);
			current += data[j+4]*0.118;//*weight(j+4, sigma);
			if(j>=4){
				current += data[j-4]*0.118;//*weight(j-4, sigma);	
			}
			else{
				num--;
			}

			current += data[j+4*width]*0.118;//*weight(j+4*width, sigma);
			current += data[j+4*width+4]*0.095;//*weight(j+4*width+4, sigma);	
			current += data[j+4*width-4]*0.095;//*weight(j+4*width-4, sigma);

			if(j>=4*width){
				current += data[j-(4*width)]*0.118;//*weight(j-(4*width), sigma);
				current += data[j-(4*width)+4]*0.095;//*weight(j-(4*width)+4, sigma);
				if(j-(4*width)>=4)
					current += data[j-(4*width)-4]*0.095;//*weight(j-(4*width)-4, sigma);
				else
						num--;
			}
			else{
				num-=3;
			}

			//current/=num;
			data[j] = current;
			data[j+1] = current;
			data[j+2] = current;

		} catch(e){
			console.log(e);
		}

	}
}
function bgr2gray(data){
	var len = data.length;
	for(var i = 0, j = 0; j<len; i++, j+=4){
		var lumin = 0.21*data[j]+0.72*data[j+1]+0.07*data[j+2];
		data[j] = lumin;
		data[j+1] = lumin;
		data[j+2] = lumin;
	}
}
function weight(pos, sigma){
	var y = pos/(4*width);
	var x = pos - 4*width*y; 
	var e = 2.718;
	var pi = 3.14;
	var exp = -1*(Math.pow(x, 2)+Math.pow(y, 2))/(2*Math.pow(sigma, 2));
	var numerator = Math.pow(e, exp);
	var denominator = 2*pi*Math.pow(sigma, 2);
	return numerator/denominator;
}

function motionDetect(data){
	var len = data.length;
	if(!lastframe){
		lastframe = data;
		return;
	}
	var temp = data;
	for(var i = 0, j = 0; j<len; i++, j+=4){
		for(var k=0; k<3; k++){
			data[j+k]-=lastframe[j+k];
			if(data[j+k]<0){
				data[j+k] = 0;
			}
			if(data[j+k]>255){
				data[j+k]=255;
			}
		}			
	}
	lastframe = temp;
}


addEventListener("DOMContentLoaded", initialize);

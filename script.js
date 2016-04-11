var video, canvas, context, width, height;
var color = 0;
var counter = 0;
var discospeed = 100;
var initialf = null;
var dobsub = false;
var doincreaseRed = false;
var dobinsub = false;
var dobsub2 = false;
var subThresh = 10;
navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
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
}
function setbsub(){
	if(dobsub2){
		dobsub2 = false;
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
	document.getElementById("subThresh").innerHTML = "subtractor threshold = 10";
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
			}
		}
		//increaseRed(frame.data, color);
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

addEventListener("DOMContentLoaded", initialize);

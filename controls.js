var video, canvas, context, width, height;
var color = 0;
var counter = 0;
var discospeed = 100;
var xs = 0;
var xe = 0;
var ys = 0;
var ye = 0;
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
var docrop = false;
var dothresh = false;
var t = 0;
var noiseThresh = 0;

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
	else if(dobgr2gray){
		action+="BGR2GRAY|";
	}
	else if(dogaussblur){
		action+="Gaussian Blur|";
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
	dobgr2gray = false;
	dogaussblur = false;
	docrop = false;
	xs = 0;
	xe = width;
	ys = 0;
	ye = height;
	color = 0;
	counter = 0;
	discospeed = 100;
	initialf = null;
	document.getElementById("discospeed").innerHTML = "Disco speed = 100";
	document.getElementById("subThresh").innerHTML = "subtractor threshold = 10";
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

function xsdelta(incr){
	if(incr){
		xs+=5;
	}
	else{
		xs-=5;
	}
}
function xedelta(incr){
	if(incr){
		xe-=5;
	}
	else{
		xe+=5;
	}
}
function ysdelta(incr){
	if(incr){
		ys+=5;
	}
	else{
		ys-=5;
	}
}
function yedelta(incr){
	if(incr){
		ye-=5;
	}
	else{
		ye+=5;
	}
}
function setcrop(){
	docrop = !docrop;
}

function threshup(incr){
	if(incr){
		t++;
	}
	else{
		t--;
	}
}
function setthresh(){
	dothresh = !dothresh;
}

function nthreshdelta(incr){
	if(incr){
		noiseThresh++;
	}
	else{
		noiseThresh--;
	}
}

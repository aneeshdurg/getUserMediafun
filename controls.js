var video, canvas, context, width, height;
var color = 0;
var counter = 0;
var discospeed = 100;
var xs = 0;
var xe = width;
var ys = 0;
var ye = height;
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
		xs++;
	}
	else{
		xs--;
	}
}
function xedelta(incr){
	if(incr){
		xe++;
	}
	else{
		xe--;
	}
}
function ysdelta(incr){
	if(incr){
		ys++;
	}
	else{
		ys--;
	}
}
function yedelta(incr){
	if(incr){
		ye++;
	}
	else{
		ye--;
	}
}
function setcrop(){
	docrop = !docrop;
}

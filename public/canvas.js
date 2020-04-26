//CSCE 315-900, Lightfoot
var intervalArray = [];
var interval = 1000;
var polyArray = [];
var amps = [];
var ampsArray = [];



var mouse = {
	x: undefined,
	y: undefined
}

var colorArray = [ '#b4d6e0', '#7fc0d4','#328da87','#1486a8','#0c6782'];




class Polygon {

	constructor(sx, lx, listIndex)
	{
		this.sx = sx;
		this.lx = lx;
		this.listIndex = listIndex;
		this.colorIndex = listIndex;
		this.col = colorArray[this.colorIndex%5];

		//set restrictions
		this.maxHeight = window.canvas.height;
		this.minHeight = window.canvas.height * .1;
	}

	draw(amps)
	{
		//compute the start height of the bar
		this.sy = window.canvas.height*amps;
		if(this.sy< this.minHeight) this.sy = this.minHeight;
		else if (this.sy > this.maxHeight) this.sy = this.maxHeight * Math.floor(Math.random() * (90 - 75 + 1) + 75)/100;
		
		//get the color, draw it, change the color for next time
		window.c.fillStyle = colorArray[this.colorIndex%5];
		window.c.fillRect(this.sx, this.sy, this.lx, window.canvas.height-this.sy);
		this.colorIndex+=4;
		if(this.colorIndex > 10000) this.colorIndex -= 10000;
	}

}

var songSet = false;
var current_timestep = 0;

function reset(x,y)
{
	//alert("setting the song .... ");
	current_timestep = 0;
	intervalArray = x;
	ampsArray = y;
	songSet = true;
}

function getJunkData() 
{
	current_timestep = 0;
	intervalArray = [3,3,3];
	ampsArray = [];
	for(let i = 0; i < 12; i++)
	{
		ampsArray.push([]);
	}
	for(let i = 0; i < intervalArray.length; i++)
	{
		for(let j = 0; j < 12; j++)
		{
			ampsArray[i][j] = 0;
		}
	}
	songSet = true;

}

function main() { //this repeats forever

	//clear the screen
	window.c.clearRect(0,0,window.innerWidth,window.innerHeight);

	//if there hasn't bene a song selected, just get junk data
	if(!songSet)
	{
		getJunkData();
	}


	//get the pitch, interval length
	interval = (intervalArray[current_timestep] * 1000) + (intervalArray[current_timestep+1]* 1000);
	amps = ampsArray[current_timestep].concat(ampsArray[current_timestep+1]);
	
	
	//increase timestep, loop to start if necessary
	current_timestep +=2; // 2;
	//if(current_timestep >= intervalArray.length && intervalArray.length > 20)
	if(current_timestep >= intervalArray.length)
	{
		//window.c.clearRect(0,0,window.innerWidth,window.innerHeight);
		
		current_timestep = 0;

	}
		//fill the background
		window.c.beginPath();
		window.c.fillStyle = "#282c34";
		window.c.fillRect(0,0,window.canvas.width,window.canvas.height);
		window.c.fill();


		for(var i = 0; i < polyArray.length; i++)
		{
			polyArray[i].draw(amps[i]);	
			//console.log(i);
		}
		
		setTimeout(function(){requestAnimationFrame(main)},interval);
}

function run(){
		window.canvas = document.querySelector('canvas');
		window.canvas.width = (window.innerWidth*.9)/2;
		window.canvas.height = (window.innerHeight*.7)/2;
		window.c = window.canvas.getContext('2d');
		let nRects = 24;

		//make the rectangles
		var bar_width = window.canvas.width/nRects;
		for (let i = 0; i < nRects; i++)
		{
			polyArray.push(new Polygon(i*(3+bar_width), bar_width, i));
		}
		main();
	}
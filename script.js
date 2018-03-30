let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let width = window.innerWidth;
let heigth = window.innerHeight;
canvas.setAttribute('width', width);
canvas.setAttribute('height', heigth);

context.font = '14px Arial';
context.lineWidth = 2;

let vertices = [];

let result = document.getElementById('result');

canvas.addEventListener('click', e => {
	vertices.push(new Point(e.clientX, heigth - e.clientY));
	draw(vertices);
});

document.getElementById('clear').addEventListener('click', e => {
	vertices.splice(0);
	draw(vertices);
});

document.getElementById('stringify').addEventListener('click', e => {
	result.value = JSON.stringify(vertices);
});

document.getElementById('drawFromInput').addEventListener('click', e => {
	let ps = JSON.parse(result.value);
	draw(ps);
});

class Point{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	equals(p){
		return this.x == p.x && this.y == p.y;
	}

	copy(){
		return new Point(this.x, this.y);
	}

	distance(p){
		let x = this.x - p.x;
		let y = this.y - p.y;
		return Math.sqrt(x*x + y*y);
	}
}

class MovingPoint extends Point{
	constructor(x, y, direction){
		super(x, y);
		this.direction = direction;
	}

	copy(){
		return new MovingPoint(this.x, this.y, this.direction);
	}

	headTo(p){
		let dir = [p.x - this.x, p.y - this.y];
		normalizeVector(dir);
		this.direction = dir;
	}
}

function copyPoints(points){
	return points.map(p => p.copy());
}

function normalizeVector(vector){
	let vectLen = Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1]);
	vector[0] /= vectLen;
	vector[1] /= vectLen;
}

function getRandomlyMovingPoints(amount){
	let points = [];
	for (let i = 0; i < amount; i++) {
		let direction = [Math.random(), Math.random()];
		normalizeVector(direction);
		for(let i in direction){
			if (!Math.round(Math.random())) {
				direction[i] = -direction[i];
			}
		}
		points.push(new MovingPoint(getRandomInt(0, width), getRandomInt(0, heigth), direction));
	}
	return points;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getPointsFromJSON(data){
	data = JSON.parse(data);
	let points = [];
	for(let o of data){
		points.push(new Point(o.x, o.y));
	}
	return points;
}

function draw(points){
	context.fillStyle = 'white';
	context.fillRect(0, 0, width, heigth);
	if (!points.length) {
		return;
	}
	context.fillStyle = 'black';
	points.forEach((p, i) => {
		context.beginPath();
		context.arc(p.x, heigth - p.y, 1, Math.PI * 2, 0);
		context.stroke();
	});
	points.forEach((p, i) => {
		context.fillText('P' + (i+1), p.x+10, heigth - p.y-10);
	});
	context.moveTo(points[0].x, heigth - points[0].y);
	context.beginPath();
	points.forEach((p, i) => {
		context.lineTo(p.x, heigth - p.y, 1);
	});
	context.closePath();
	context.stroke();
}
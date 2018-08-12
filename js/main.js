jQuery(window).keydown(function(e) {
	if (e.keyCode == "186") debugger;
});
var bgSound = new Audio("ldJam42Song.wav");
bgSound.onended = function() {
	bgSound.currentTime = 0;
	bgSound.play();
}
var muted=false;
var bgCanvas, fgCanvas, mdCanvas,stCanvas = null;
var ctx, fxtc, mctx,stCtx = null;
var menuCtx = null;
var menuCnv = null;
var width = 0;
var height = 0;
var fWidth=0;
var fHeight=0;
var hlfSize = 0;
var qrtSize = 0;
var ctxBG = null;
var lastTick=0;
var ticker=0;
var spawnSpeed=150;
var tickSpeed=50;
var earthHeight =20;
var atmHeight0=100;
var atmHeight1=150;
var atmHeight2=200;
var tilt0=0.01;
var tilt1=0.03;
var tilt2=0.08;
var spd0=0;
var spd1=0;
var spd2=0;
var fuel0=100;
var fuel1=100;
var fuel2=100;
var thrustInterval=100;
var thrustDuration=20;
var thrustForce=0.02;
var cameraX=0;
var cameraY=0;
const satW =  32
const satH =  24
const rocW2 = 14
const rocH2 = 25
const rocW1 = 22
const rocH1 = 30
const rocW0 = 30
const rocH0 = 20
var weight0=50;
var weight1=25;
var weight2=10;
var rocketPart1=[]
var fallingSats=[]
var spawnTicker=0;
var earthRot=0;
var launchingSats=[];
var startingAng = Math.random()*Math.PI - Math.random()*Math.PI;
var startingSpeed = Math.random()* 20 + 24;
var sats = [];
var rocketParts1=[];
var rocketParts0=[];
var rotations=0;
var rotationGains=[];

var totalLaunches=0;
var totalLaunchesSuccess=0;
var totalLaunchesFailure=0;


var totalSatellites=0
var totalSatellitesCrashed=0

var totalRotations=0;
var quickestRotation=0;

var mostSatsAtOnce=0;
var highestRotation=0;

var lostInSpace=0;
var crashedIntoEarth=0;
var crashedIntoEachOther=0;

var images={

}
var imagesToLoad=3;
function zoomIn() {
	zoom*=2;
}
function zoomOut() {
	zoom*=0.5;
}
function loadImages() {
	let imgs = ["earthOverlay.png","launchPad.png","rocketFold0.png","rocketFold1.png","rocketFold2.png","rocketFold3.png","rocketFold4.png","rocketFold5.png","rocketFold6.png","rocketFold7.png","rocketFold8.png","rocketFold9.png","rocketFold10.png","rocketFold11.png","rocket.png","rocketPart0.png","rocketPart1.png","rocketPart2.png","earth.png","sat.png","rocketFire0.png","rocketFire1.png","rocketFire2.png"]
	imagesToLoad = imgs.length;
	
	for (let key in imgs) {
		images[imgs[key]] = new Image();
		images[imgs[key]].src = "img/"+imgs[key];
		images[imgs[key]].onload= function() {
			checkImagesReady();
		}
	}
}
function checkImagesReady() {
	imagesToLoad--;
	/*console.log(imagesToLoad);*/
	if(imagesToLoad<=0) {
		drawIntro()
	}
}
function startGame() {
	$("#mainMenu").fadeOut();
	if(!muted) {
		bgSound.play();
	}
	tick();
}
function startMuted() {
	$("#mainMenu").fadeOut();
	muted=true;
	tick();
}
function start() {
	fWidth = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth
	fHeight = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
	width = fWidth*0.75;  //window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth
	height = fHeight*0.75; //window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
	width = Math.floor(width);
	height = Math.floor(height);
	hlfSize = Math.floor(Math.min(width, height) / 2) + 0.5;
	qrtSize = Math.floor(hlfSize / 2) + 0.5;
	cameraX=width/2;
	cameraY=height/2;
	loadImages();

	bgCanvas = createCanvas(width, height, (fWidth-width-5), (fHeight-height)/2, "cnvBG", "cnvBG", 0, 0, true);
	bctx = bgCanvas.getContext("2d");

	mdCanvas = createCanvas(width, height, (fWidth-width-5), (fHeight-height)/2, "cnvMD", "cnvMD", 0, 0, true);
	ctx = mdCanvas.getContext("2d");

	fgCanvas = createCanvas(width, height, (fWidth-width-5), (fHeight-height)/2, "cnvFG", "cnvFG", 0, 0, true);
	fctx = fgCanvas.getContext("2d");

	menuCnv = document.getElementById("menuCanvas");
	menuCtx = menuCnv.getContext("2d");
	menuCnv.width = fWidth;
	menuCnv.height = fHeight;

	stCanvas = createCanvas(width/3-10,height)
	stCanvas.style.position="absolute";
	stCanvas.style.top=(fHeight-height)/2+"px";
	stCanvas.style.left="5px";//(fWidth -width)*1.5+"px";;
	stCtx = stCanvas.getContext("2d");

	bctx.lineJoin = "round"
	bctx.lineCap = "round"

	ctx.lineJoin = "round"
	ctx.lineCap = "round"

	fctx.lineJoin = "round"
	fctx.lineCap = "round"
	document.body.appendChild(bgCanvas);
	document.body.appendChild(mdCanvas);
	document.body.appendChild(fgCanvas);
	document.body.appendChild(stCanvas);


	 document.addEventListener("click", handleClick);
	// document.addEventListener("mouseup", handleMouseUp);
	// document.addEventListener("mousedown", handleMouseDown);
	document.addEventListener("keypress", handleKeydown);
	// document.addEventListener("keyup", handleKeyrelease);
	 document.addEventListener("mousemove", handleMouseMove);
	
	createStars()
	drawOnce();
	
	//document.body.appendChild(createSlider("startingAng", 0, Math.PI*2, 0.05, Math.PI, "Starting Angle", "startingAng").div);
	//document.body.appendChild(createSlider("startingSpeed", 15, 201, 2, 35, "Tilt", "startingSpeed"));
	
	let contentContainer = document.getElementById("contentDivs");

	let generalDiv = createContentDiv("General","rocketPart0.png")
		generalDiv.appendChild(createSlider("spawnSpeed", 0.1, 100, 1, 5, "Launch Frequency", "spawnSpeed").div);
		generalDiv.appendChild(createSlider("tickSpeed", 1, 500, 1, 50, "Update Delay", "tickSpeed").div);
		//generalDiv.appendChild(createSlider("fuel0", 0, 100, 1, 100, "Base Fuel", "fuel0").div);
	contentContainer.appendChild(generalDiv)


	let topDiv = createContentDiv("Rocket Top","rocketPart2.png","Weight <span id='weight2'>"+(weight2+fuel2)+"</span>t")
	topDiv.appendChild(createSlider("tilt2", 0, 0.5, 0.01, 0.1, "Tilt", "tilt2").div);
	topDiv.appendChild(createSlider("force2", 0.1, 15, 0.1, 1.5, "Force", "force2").div);
	topDiv.appendChild(createSlider("fuel2", 0, 100, 1, 100, "Fuel (%)", "fuel2",updateWeights).div);
	contentContainer.appendChild(topDiv)

	let middleDiv = createContentDiv("Rocket Middle","rocketPart1.png","Weight <span id='weight1'>"+(weight1+fuel1)+"</span>t")
	middleDiv.appendChild(createSlider("tilt1", 0, 0.5, 0.01, 0.4, "Tilt", "tilt1").div);
	middleDiv.appendChild(createSlider("force1", 0.1, 15, 0.1, 2.5, "Force", "force1").div);
	middleDiv.appendChild(createSlider("fuel1", 0, 100, 1, 100, "Fuel (%)", "fuel1",updateWeights).div);
	contentContainer.appendChild(middleDiv)

	let baseDiv = createContentDiv("Rocket Base","rocketPart0.png","Weight <span id='weight0'>"+(weight0+fuel0)+"</span>t")
	baseDiv.appendChild(createSlider("tilt0", 0, 0.5, 0.01, 0.2, "Tilt", "tilt0").div);
	baseDiv.appendChild(createSlider("force0", 0.1, 15, 0.1, 5, "Force", "force0").div);
	baseDiv.appendChild(createSlider("fuel0", 0, 100, 1, 100, "Fuel (%)", "fuel0",updateWeights).div);
	contentContainer.appendChild(baseDiv)
	

	let satDiv = createContentDiv("Satellite","sat.png")
	satDiv.appendChild(createSlider("thrustInterval", 0, 1000, 1, 75, "Thrust Interval", "thrustInterval").div);
	satDiv.appendChild(createSlider("thrustDuration", 0, 1000, 1, 25, "Thrust Duration", "thrustDuration").div);
	satDiv.appendChild(createSlider("thrustForce", 0, 1, 0.01, 0.2, "Thrust Force", "thrustForce").div);
	contentContainer.appendChild(satDiv)

	
	let zI = document.getElementById("zoomIn")
	zI.style.right = 56+width*0.05+"px";
	zI.style.top = (fHeight-height)/2+height-53-height*0.05+"px";

	let zO = document.getElementById("zoomOut")
	zO.style.right = 3+width*0.05+"px";
	zO.style.top = (fHeight-height)/2+height -53-height*0.05+"px";

	

	
	

}
function updateWeights() {
	document.getElementById("weight2").innerHTML = weight2 + fuel2;
	document.getElementById("weight1").innerHTML = weight1 + fuel1;
	document.getElementById("weight0").innerHTML = weight0 + fuel0;
	
}
function tick() {
	//ctx.clearRect(0,0,width,height);
	var now = window.performance.now(); // current time in ms
	var deltaTime = now - lastTick; // amount of time elapsed since last tick

	lastTick = now;
	ticker += deltaTime;
	doneTicks = 0;

	if (ticker > tickSpeed && doneTicks < 100000) {
		draw();
		ticker = 0;
		doneTicks++;
		step();



	}
	
	window.requestAnimationFrame(tick);
	

}
function step() {
	if (selectedSat === null) {
		updateSats()
		if (!pauseSpawn) {

			spawnSats()
		}
	} else {
		let mDis = Distance(mouseX,mouseY,width/2,height/2);	
		if (mDis-15 > selectedSat[4]) {
			selectedSat[4]+=15;
		} else if (mDis+5 < selectedSat[4]) {
			selectedSat[4]-=15;
		}
		selectedSat[0] = width/2    - Math.cos(selectedSat[2]) * selectedSat[4];
		selectedSat[1] = height / 2 - Math.sin(selectedSat[2]) * selectedSat[4];
	}
	updateMouse();
}

function updateSats() {
	moveLaunchingSats();
	moveSats(); 
	moveFallingSats()
	
}

function moveFallingSats() {
	for (let i = fallingSats.length-1;i>=0;i--) {
		let s = fallingSats[i];
		let dis = Distance(s[0],s[1],width/2,height/2);
		if(!s.fallVel) {
			s.fallVel=0.1;
		}
		s.dis-=s.fallVel
		if (s.dis <= earthHeight) {
			fallingSats.splice(i,1);
			continue;
		}
		s.fallVel*=1.05;
		s.ang+=0.01;
		s.x=width /2-Math.cos(s.ang)*s.dis
		s.y=height/2-Math.sin(s.ang)*s.dis
	}
}
function moveSats() {
	let toDel = [];
	if (sats.length> mostSatsAtOnce) {
		mostSatsAtOnce = sats.length;
	}
	loop1:
	for (let key = sats.length-1;key>=0;key--) {
		
		if (contains(key,toDel)) {
			continue
		}
		let s = sats[key];
		let ang = angle(s.x,s.y,width/2,height/2);
		let dis = Distance(s.x,s.y,width/2,height/2);
		
		if (dis > Math.max(width,height)*2) {
			toDel.push(parseInt(key));
			lostInSpace++;
			continue;
		}
		if (dis<earthHeight) {
			crashedIntoEarth++;
			totalSatellitesCrashed++;
			toDel.push(parseInt(key));
			continue;
		}/* else if (s.dis<atmHeight0) {
			s.dis-=0.5;
		} else if (s.dis<atmHeight1) {
			s.dis-=0.1;
		} else if (s.dis<atmHeight2) {
			s.dis-=0.05;
		} else {
			s.dis-=0.01
		}*/

		s.rotation+=compareAngles(ang,s.startAng);
		s.startAng=ang;
		if (s.rotation>Math.PI*2) {
			s.rotation=0;
			s.totalRotation++;
			increaseRotations(1,s.x,s.y);
		}
		if (Math.floor(100 * (s.rotation/(Math.PI*2) + s.totalRotation)) / 100 > highestRotation) {
			highestRotation = Math.floor(100 * (s.rotation/(Math.PI*2) + s.totalRotation)) / 100
		}


		if (compareAngles(s.ang,ang)<0) {
			s.ang+=0.01
		} else {
			s.ang-=0.01
		}
		/*s.ang = ang+Math.PI*0.5;*/
		
		let circ = s.dis * Math.PI * 2;
		let turnSpd =  Math.PI*2 / (circ/(s.velX+s.velY+1));
		let newPointX = width/2 - Math.cos(ang+turnSpd) * dis;
		let newPointY = height/2 - Math.sin(ang+turnSpd) * dis;
		let ang2 = angle(s.x,s.y,newPointX,newPointY);
		
		//s.ang = 0.1* turnTowards2(s.startAng,ang,turnSpd)
		
		s.velX *= 0.98;
		s.velY *= 0.98;	
	
		s.thrustTicker++;
		if (s.thrustTicker >= s.thrustInterval) {
			s.thrustTicker=0;
			s.thrust = s.thrustDuration;
		}


		if (s.thrust) {
			s.velX -= Math.cos(ang+Math.PI*0.5)*s.thrustForce;
			s.velY -= Math.sin(ang+Math.PI*0.5)*s.thrustForce;
		}			
		// if (dis < s.dis) {
		// 	s.thrust=5;
		// 	s.velX -= Math.cos(ang+Math.PI*0.5)*(s.dis - dis)/10;
		// 	s.velY -= Math.sin(ang+Math.PI*0.5)*(s.dis - dis)/10;
		// } else {
		// 	s.thrust=0;
		// }
		
		s.velX += Math.cos(ang)*15/(50+dis);
		s.velY += Math.sin(ang)*15/(50+dis);
		
		// if (compareAngles(s.ang,ang+Math.PI*2)>0.2) {
		// 	s.ang-=Math.PI*2;
		// //	increaseRotations(1,s[0],s[1]);
		// }
		
		/*s.ang = angle(0,0,s.velX,s.velY);*/
		s.x += s.velX;//width/2  - s[4] * Math.cos(s[2]);
		s.y += s.velY;//height/2 - s[4] * Math.sin(s[2]);
				

		loop2:
		for (let kei in sats) {
			if (contains(kei,toDel)) {
				continue loop2
			}
			if (key != kei) {
				if (Distance(s.x,s.y,sats[kei].x,sats[kei].y)<satH) {
					crashedIntoEachOther+=2;
					totalSatellitesCrashed+=2;
					toDel.push(parseInt(key));
					toDel.push(parseInt(kei));
					/*if (key > kei) {
						continue loop1;
					} else {
						toDel.push(key);
						toDel.push(kei);
						continue loop1;
					}*/
				}
			}
		}
				


	}
	toDel = quickSort2(toDel)
	toDel = uniqEs6(toDel);
	/*if (toDel.length) {
		console.log(toDel)
	}*/
	for (let i = 0;i<toDel.length;i++) {
		let s = sats[toDel[i]];
		
		fallingSats.push(new fallingSat(s.x,s.y,s.velX,s.velY,angle(s.x,s.y,width/2,height/2),Distance(s.x,s.y,width/2,height/2)))
		sats.splice(toDel[i],1);

	}
}
function moveLaunchingSats() {

	for (let key = launchingSats.length-1;key>=0;key--) {
		let s = launchingSats[key];
		
		let dis = Distance(s.x,s.y,width/2,height/2);
		let ang = angle(s.x,s.y,width/2,height/2);
		let siz = Math.min(Math.max(0.6,dis/atmHeight2),1);
		let weight = s.getMass();

		if (dis < earthHeight) {
			launchingSats.splice(key,1);
			totalLaunchesFailure++;

			continue;
		}
		let force = s.forces[2];
		if (s.stage>=3) {
			force = s.forces[0];
		} else if (s.stage>=2) {
			force = s.forces[1]
		}

		s["fuel"+(3 - s.stage)]-=force;
		force*=0.5;
		if (s.stage>=3) {
			force *=4;
		} else if (s.stage>=2) {
			force *= 2
		}
		if (s["fuel"+(3-s.stage)]<=0) {
			if (s.stage==3) {
				s.stage--;
				s.pauseThrust=5;
				spawnRocketPart0(s.x,s.y,s.ang,siz);
				
			} else if (s.stage==2) {
			
				s.stage--;
				s.pauseThrust=5;
				spawnRocketPart1(s.x,s.y,s.ang,siz);
			
			} else {
				if (s.open==0) {
					s.open=8;
				}
			}
			
		}
		force*=50;

		let spd = /*Math.max(0.1,(dis/1000)*s[4])**/force  / weight;
		s.velX*=0.95;//Math.min(1,1/spd);
		s.velY*=0.95;//Math.min(1,1/spd);
		s.velX+= Math.cos(ang)*15/(50+dis)/weight
		s.velY+= Math.sin(ang)*15/(50+dis)/weight
		//if (!s[7]) {
			s.velX+= spd*Math.cos(s.ang)/10;
			s.velY+= spd*Math.sin(s.ang)/10;
		//}
		

		let incr = 0;

		if (s.stage>=3) {
			incr = s.tilts[0]
		} else if (s.stage>=2) {
			incr = s.tilts[1]
		} else if (s.stage>=1) {
			incr = s.tilts[2];//1/spd;//0.15 - Math.min(0.05,s[4]/500)
		} 
		

		s.ang+=incr*0.1;
		if (s.open>0) {
			s.open--;
			if (s.open<=0) {
				totalSatellites++;
				totalLaunchesSuccess++;
				sats.push(new sat(s.x,s.y,s.velX,s.velY,s.ang,dis,spd,s.forces.slice(),s.tilts.slice()));//,[s[0],s[1],ang,ang,dis,spd,false,25,s[11],s[12]])
				launchingSats.splice(key,1);
				continue;
			}
		}
		/*if ((Math.abs(compareAngles(s.ang,ang) - Math.PI*0.5)  < incr*1.2 || s.ang-s.startAng > 0.8*Math.PI) && dis > atmHeight2) {
			
			s.open = 11;
		} */
		s.x+=s.velX;//Math.cos(s[2])*spd ;
		s.y+=s.velY;//Math.sin(s[2])*spd ;
	}
}
var sat = function(x,y,velX,velY,ang,dis,spd,forces,tilts) {
	this.x = x;
	this.y = y;
	this.velX=velX;
	this.velY=velY;
	this.ang = ang;
	this.startAng = angle(x,y,width/2,height/2);
	this.spd = spd;
	this.forces = forces;
	this.tilts = tilts;
	this.stage = 3;
	this.pauseThrust = 0;
	this.dis = dis;
	this.thrust=0;
	this.thrustInterval=thrustInterval;
	this.thrustForce=thrustForce;
	this.thrustTicker=0;
	this.thrustDuration=thrustDuration;
	this.rotation=0;

	this.totalRotation=0;
	
}
var launchingSat = function(x,y,ang,spd,forces,tilts) {
	this.x = x;
	this.y = y;
	this.velX=0;
	this.velY=0;
	this.fireAnim=0;
	this.ang = ang;
	this.startAng = ang;
	this.spd = spd;
	this.forces = forces;
	this.tilts = tilts;
	this.stage = 3;
	this.open=0;
	this.pauseThrust = 0;
	this.dis = 0;
	this.fuel0=fuel0;
	this.fuel1=fuel1;
	this.fuel2=fuel2;
}
launchingSat.prototype.getMass = function() {
	return Math.floor(this.stage/3)*(this.fuel0 + weight0) + Math.floor(this.stage/2)*(this.fuel1 + weight1) + Math.floor(this.stage/1)*(this.fuel2 + weight2)
}
var fallingSat = function(x,y,velX,velY,ang,dis) {
	this.x = x;
	this.y = y;
	this.velX = velX;
	this.velY = velY;
	this.ang = ang;
	this.fallVel = 0.5;
	this.dis = dis;
}
function spawnSats() {
	spawnTicker+=spawnSpeed/10;
	if (spawnTicker >= 100) {
		spawnTicker=0;
		let rndAng = startingAng;  //Math.random()*Math.PI - Math.random()*Math.PI;
		let rndSpd = startingSpeed;//Math.random()* 20 + 24;
		let x = width/ 2 + Math.cos(rndAng) * (earthHeight*2+1*(rocH0+rocH1+rocH2)/2);
		let y = height/2 + Math.sin(rndAng) * (earthHeight*2+1*(rocH0+rocH1+rocH2)/2);
		totalLaunches++;
		launchingSats.push(new launchingSat(x,y,rndAng,rndSpd,[force0,force1,force2],[tilt0,tilt1,tilt2]))
		// launchingSats.push([x,y,0,0,
		// 	rndAng,rndAng,rndSpd,
		// 	0,3,0,0,
		// 	[force0,force1,force2],[tilt0,tilt1,tilt2],
		// 	])
	}
}

function spawnRocketPart0(x,y,rad,siz) {
	rocketParts0.push([
		x-Math.cos(rad)*siz*(rocH2+rocH1-satH/2),
		y-Math.sin(rad)*siz*(rocH2+rocH1-satH/2),
		rad,(Math.random()-Math.random())*0.1,100,siz])
	
}
function spawnRocketPart1(x,y,rad,siz) {
	rocketParts1.push([
		x-Math.cos(rad)*siz*(rocH2-satH/2),
		y-Math.sin(rad)*siz*(rocH2-satH/2),
		rad,(Math.random()-Math.random())*0.1,100,siz])
}


function increaseRotations(am,x,y) {
	totalRotations+=am;
	rotationGains.push([x,y,Distance(x,y,width/2,height/2),am,100])
	
}




function updateStartingAng() {

}












var mouseDown = false;
var mouseX = 0;
var mouseY = 0;
var lastMouseX = 0;
var lastMouseY = 0;
var selectedTree = null;
var leftPressed, rightPressed, upPressed, clickPressed = false;
var selectedSat=null;
function handleClick(e) {
	if (selectedSat === null) {
		for (let key in sats) {
			let p = sats[key];
			let dis = Distance(p[0],p[1],mouseX,mouseY);
			if (dis < 20) {
				selectedSat = p;
			}
		}
	} else {
		selectedSat = null;
		
	}

}

function handleMouseUp(e) {
	curPlayer.clickPressed = false;
}

function handleMouseDown(e) {
	curPlayer.clickPressed = true;
}

var pauseSpawn=false;
function handleKeydown(ev) {
	console.log(ev.code)
	if (ev.code=="Space") {
		if (pauseSpawn) {
			pauseSpawn = false;
		} else {

			pauseSpawn=true;
		}
	}
	if (ev.code == "KeyA") {
		curPlayer.rightPressed = true;
	} else if (ev.code == "KeyD") {
		curPlayer.leftPressed = true;
	} else if (ev.code == "KeyW") {
		curPlayer.upPressed = true
	} else if (ev.code == "KeyI") {
		openInstructions();
	} else if(ev.code == "Enter") {
		 $(":focus").blur();
	    $(".hovered").each(function(that) {
	      $(that).removeClass("hovered");
	    })
	} else if(ev.code == "KeyM") {
		if (muted) {
			muted=false
			bgSound.play();
		} else {
		 muted=true
			bgSound.pause();
			bgSound.currentTime=0;
		}
	}
}

function handleKeyrelease(ev) {

	if (ev.code == "KeyA") {
		curPlayer.rightPressed = false;
	} else if (ev.code == "KeyD") {
		curPlayer.leftPressed = false;
	} else if (ev.code == "KeyW") {
		curPlayer.upPressed = false
	}
}
var moveCamX=0;
var moveCamY=0;
function updateMouse() {
	let inCanvas = false;
	if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
		inCanvas=true;
	}
	if (mouseX < width*0.05 && inCanvas) {
		moveCamX=-2;
	} else 
	if (mouseX > width*0.95 && inCanvas) {
		moveCamX=2;
	} else {
		moveCamX =  -(cameraX - width/2)*0.05;
		if(Math.abs(cameraX - width/2)<0.5) {
			cameraX = width/2;
			moveCamX=0;
		}
	}

	if (mouseY < height*0.05 && inCanvas) {
		moveCamY=-2;
	} else 
	if (mouseY > height*0.95 && inCanvas) {
		moveCamY=2;
	} else {
		moveCamY =  -(cameraY - height/2)*0.05;
		if(Math.abs(cameraY - height/2)<0.5) {
			cameraY = height/2;
			moveCamY=0;
		}
	}

}
function openInstructions() {
	$("#instructions").fadeIn();
}
function closeInstructions() {
	$("#instructions").fadeOut();
}
function handleMouseMove(e) {
	let rect = bgCanvas.getBoundingClientRect();
	
	lastMouseX = mouseX;
	lastMouseY = mouseY;


	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;
	

	

	// for (let key in sats) {
	// 	let s = sats[key];
	// 	let dis = Distance(s.x,s.y,mouseX,mouseY);
	// 	if (dis < satW) {
	// 		s.hover=true;
	// 	} else {
	// 		s.hover=false;
	// 	}
	// }

}




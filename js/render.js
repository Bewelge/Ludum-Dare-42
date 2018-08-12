var zoom = 1;
function drawOnce() {
	let rgr = fctx.createRadialGradient(width/2,height/2,0,width/2,height/2,width);
	rgr.addColorStop(0,"rgba(255,255,255,0)");
	rgr.addColorStop(0.8,"rgba(255,255,255,0.2)");
	rgr.addColorStop(1,"rgba(255,255,255,1)");
	fctx.beginPath();
	fctx.fillStyle=rgr;//"rgba(255,255,255,0.5)";
	fctx.rect(0,0,width,height*0.05);
	fctx.rect(0,height*0.95,width,height*0.05);
	fctx.rect(width*0.95,0,width*0.05,height);
	fctx.rect(0,0,width*0.05,height);
	fctx.fill();
	fctx.closePath();
};
function draw() {
	ctx.clearRect(0,0,width,height)


	if (moveCamX != 0) {
		cameraX = Math.min(width/2+width*2,Math.max(width/2-width*2,cameraX+moveCamX));
	}
	if (moveCamY != 0) {
		cameraY = Math.min(height/2+height*2,Math.max(height/2-height*2,cameraY+moveCamY));
	}
	ctx.save();
	ctx.translate(width/2,height/2);
	ctx.scale(zoom,zoom);
	ctx.translate(-cameraX,-cameraY)
	drawAtmosphere()
	drawFallingsSats();
	drawRocketParts0();
	drawRocketParts1();

	drawEarth();
	drawRotationGains()
	drawLaunchingSats()
	drawSats();
	

	ctx.strokeStyle="rgba(255,0,0,0.5)";
	ctx.lineWidth=5;
	ctx.beginPath();
	ctx.arc(width/2,height/2,Math.max(width,height)*2,0,Math.PI*2,0);
	ctx.stroke();
	ctx.closePath();
	drawStats()
	ctx.restore();
}
function drawRocketParts0() {
	//ctx.globalAlpha=0.7;
	for ( let i = rocketParts0.length-1;i>=0;i--) {
		let r = rocketParts0[i];
		r[4]--
		if(r[4]<=0) {
			rocketParts0.splice(i,1);
		} else {
			ctx.globalAlpha=r[4]/100;
			let siz = r[5] * (r[4]/100);//Math.min(Math.max(0.4,r[5]/atmHeight2),1);
			r[2]+=r[3];
			r[4]-=0.1;
			let ang = angle(width/2,height/2,r[0],r[1]);
			r[0]-=Math.cos(ang)*1;
			r[1]-=Math.sin(ang)*1;

			ctx.save();
			ctx.translate(r[0],r[1]);
			ctx.rotate(r[2]+Math.PI*0.5);
			let im = images["rocketPart0.png"];
			ctx.drawImage(im,-siz*im.width/2,0,siz*im.width,siz*im.height)
			ctx.restore();
		}
	}
	ctx.globalAlpha=1;
}
function drawRocketParts1() {
	//ctx.globalAlpha=0.7;
	for ( let i = rocketParts1.length-1;i>=0;i--) {
		let r = rocketParts1[i];
		r[4]--
		if(r[4]<=0) {
			rocketParts1.splice(i,1);
		} else {
			ctx.globalAlpha=r[4]/100;
			let dis = Distance(r[0],r[1],width/2,height/2);
			let siz = r[5] * (r[4]/100);//Math.min(Math.max(0.4,r[5]/atmHeight2),1);
			r[2]+=r[3];
			r[4]-=0.1;
			let ang = angle(width/2,height/2,r[0],r[1]);
			r[0]-=Math.cos(ang)*1;
			r[1]-=Math.sin(ang)*1; 

			ctx.save();
			ctx.translate(r[0],r[1]);
			ctx.rotate(r[2]+Math.PI*0.5);
			let im = images["rocketPart1.png"];
			ctx.drawImage(im,-siz*im.width/2,0,siz*im.width,siz*im.height)
			ctx.restore();
		}
	}
	ctx.globalAlpha=1;
}


function drawAtmosphere() {
	ctx.fillStyle="rgba(255,255,255,0.1)";
	ctx.beginPath();
	ctx.arc(width/2,height/2,atmHeight2,0,Math.PI*2,0);
	ctx.fill();
	ctx.closePath()

	ctx.fillStyle="rgba(255,255,255,0.1)";
	ctx.beginPath();
	ctx.arc(width/2,height/2,atmHeight1,0,Math.PI*2,0);
	ctx.fill();
	ctx.closePath()

	ctx.fillStyle="rgba(255,255,255,0.1)";
	ctx.beginPath();
	ctx.arc(width/2,height/2,atmHeight0,0,Math.PI*2,0);
	ctx.fill();
	ctx.closePath()
}
var introTicker=0;
var introTexts=[];
var introTexts2=[];
var introTexts3=[];
var introTexts4=[];
function drawIntro() {
	introTicker+=5;
	let c = menuCtx;
	c.clearRect(0,0,fWidth,fHeight)
	c.globalCompositeOperation="source-under"
	
	if (introTicker<250) {
		c.clearRect(0,0,fWidth,fHeight)
		c.font=introTicker/5+"px Roboto Mono, monospace"
		let wd = c.measureText("Satellites").width;
		introTexts.push(["rgba(0,0,255,"+introTicker/500+")",introTicker/5+"px Roboto Mono, monospace",fWidth/2-wd/2,fHeight-fHeight*0.8*introTicker/250])

		for (let i in introTexts) {
			let it = introTexts[i];
			c.fillStyle=it[0];
			c.font=it[1]

			c.fillText("Satellites",it[2],it[3])
		}
	} else if (introTicker<500) {
		c.clearRect(0,0,fWidth,fHeight)
		if(introTexts.length>1) {
			introTexts.splice(0,1);
		} else {
			console.log(introTexts[0][1]);
		}
		for (let i in introTexts) {
			let it = introTexts[i];
			c.fillStyle=it[0];
			c.font=it[1]

			c.fillText("Satellites",it[2],it[3])
		}
	} else if (introTicker<750) {
		c.clearRect(0,0,fWidth,fHeight)

		
			let it = introTexts[0];
			c.fillStyle=it[0];
			c.font=it[1]

			c.fillText("Satellites",it[2],it[3])
		
		c.strokeStyle="rgba(255,255,255,0.5)"
		let incr = introTicker - 500;
		c.font=(240-incr)+"px Roboto Mono, monospace"
		let wd = c.measureText("Satellites").width;
		introTexts2.push(["rgba(255,255,255,"+incr/250+")",c.font+"px Roboto Mono, monospace",fWidth/2-wd/2,introTexts[0][3]])

		for (let i in introTexts2) {
			let it = introTexts2[i];
			c.strokeStyle=it[0];
			c.font=it[1]

			c.strokeText("Satellites",it[2],it[3])
		}
		/*c.font = incr+"px Roboto Mono, monospace";
		let wd = c.measureText("Satellites").width;
		c.fillText("Satellites",fWidth/2-wd/2,introTexts[0][3]);*/
	} else if (introTicker<1000) {
		c.clearRect(0,0,fWidth,fHeight)

		
		
		if(introTexts2.length>1) {
			introTexts2.splice(0,1);
		} else {
			console.log(introTexts[0][1]);
		}
		
	} else if (introTicker<1100) {
		c.clearRect(0,0,fWidth,fHeight)
		c.font=(introTicker-1000)/6+"px Roboto Mono, monospace"
		let wd = c.measureText("Ludum Dare #42 Entry by Bewelge").width;
		introTexts3.push(["rgba(155,155,155,"+(introTicker-1000)/100+")",(introTicker-1000)/6+"px Roboto Mono, monospace",fWidth/2-wd/2,fHeight-fHeight*0.6*(introTicker-1000)/100])

		
	} else if (introTicker<1200) {
		c.clearRect(0,0,fWidth,fHeight)
		if(introTexts3.length>1) {
			introTexts3.splice(0,1);
		} else {
			console.log(introTexts[0][1]);
		}
		for (let i in introTexts3) {
			let it = introTexts3[i];
			c.fillStyle=it[0];
			c.font=it[1]

			c.fillText("Ludum Dare #42 Entry by Bewelge",it[2],it[3])
		}
	} else if (introTicker<1300) {
		c.clearRect(0,0,fWidth,fHeight)
		
		c.strokeStyle="rgba(255,255,0,0.5)"
		let incr = introTicker - 1200;
		c.font=introTexts3[0][1]
		let wd = c.measureText("Ludum Dare #42 Entry by Bewelge").width;
		introTexts4.push(["rgba(255,255,0,"+incr/250+")",c.font,fWidth/2-wd/2,introTexts3[0][3]])

		
		/*c.font = incr+"px Roboto Mono, monospace";
		let wd = c.measureText("Ludum Dare #42 Entry by Bewelge").width;
		c.fillText("Ludum Dare #42 Entry by Bewelge",fWidth/2-wd/2,introTexts[0][3]);*/
	} else if (introTicker<1400) {
		c.clearRect(0,0,fWidth,fHeight)

		
			

		if(introTexts4.length>1) {
			introTexts4.splice(0,1);
		} else {
			console.log(introTexts[0][1]);
		}
		
	}
	for (let i in introTexts) {
			let it = introTexts[i];
			c.fillStyle=it[0];
			c.font=it[1]

			c.fillText("Satellites",it[2],it[3])
		}
		for (let i in introTexts2) {
			let it = introTexts2[i];
			c.strokeStyle=it[0];
			c.font=it[1]

			c.strokeText("Satellites",it[2],it[3])
		}
		
		for (let i in introTexts3) {
			let it = introTexts3[i];
			c.fillStyle=it[0];
			c.font=it[1]

			c.fillText("Ludum Dare #42 Entry by Bewelge",it[2],it[3])
		}

	if (introTicker < 1500) {

		window.requestAnimationFrame(drawIntro);
	} else {

		$("#menuButs").fadeIn();
	}
}
function drawEarth() {
	
	earthRot+=0.01;
	startingAng+=0.01
	updateStartingAng();
	ctx.save();
	ctx.translate(width/2,height/2);
	ctx.rotate(earthRot)
	ctx.drawImage(images["earth.png"],-earthHeight*2,-earthHeight*2,earthHeight*4,earthHeight*4);
	ctx.restore();

	ctx.save();
	ctx.translate(width/2,height/2);
	ctx.drawImage(images["earthOverlay.png"],-earthHeight*2,-earthHeight*2,earthHeight*4,earthHeight*4);
	ctx.restore();

	let siz = 1;

	
	let im = images["launchPad.png"];
	
	
	ctx.globalAlpha=spawnTicker/100
	drawLaunchingSat(
		width/2 + Math.cos(startingAng) * (2*earthHeight+siz*75*0.5),
		height/2 + Math.sin(startingAng) *(2*earthHeight+siz*75*0.5),
		startingAng)

	ctx.save();
	ctx.translate(
		width/2 + Math.cos(startingAng) * (2*earthHeight+siz*im.height*0.25),
		height/2 + Math.sin(startingAng) *(2*earthHeight+siz*im.height*0.25))
	ctx.rotate(startingAng+Math.PI*0.5);
	ctx.drawImage(im,-siz*im.width/2,-siz*im.height/2,siz*im.width,siz*im.height)
	ctx.restore();
	ctx.globalAlpha=1;

	// ctx.fillStyle="rgba(0,150,0,1)";
	// ctx.beginPath();
	// ctx.arc(width/2,height/2,earthHeight,0,Math.PI*1.2,0);
	// ctx.fill();
	// ctx.closePath()

	// ctx.fillStyle="rgba(0,0,250,1)";
	// ctx.beginPath();
	// ctx.arc(width/2,height/2,earthHeight,Math.PI*1.2,Math.PI*2,0);
	// ctx.fill();
	// ctx.closePath()

	// ctx.fillStyle="rgba(0,0,250,1)";
	// ctx.beginPath();
	// ctx.arc(width/2,height/2,earthHeight,Math.PI*1.8,Math.PI*2.4,0);
	// ctx.fill();
	// ctx.closePath()
}

function drawLaunchingSat(x,y,ang,countdown) {
	let s = {x:x,y:y,ang:ang,stage:3,pauseThrust:100,open:0};
		let dis = Distance(s.x,s.y,width/2,height/2);
		let siz = Math.min(Math.max(0.6,dis/atmHeight2),1);
		
		// ctx.strokeStyle="white";
		// ctx.lineWidth=2;
		// ctx.beginPath();
		// ctx.moveTo(s.x,s.y);
		// ctx.lineTo(s.x+Math.cos(s.ang)*10,s.y+Math.sin(s.ang )*10)
		// ctx.stroke();
		// ctx.closePath();

		ctx.save();
		ctx.fillStyle="white";
		ctx.translate(s.x,s.y);
		ctx.rotate(s.ang+0.5*Math.PI);
		
		

		//let imF = images["rocketFire"+s.fireAnim+".png"]
		let im = images["rocketPart2.png"]
		let fireY = siz * (Math.floor(s.stage/3) * rocH0 + Math.floor(s.stage/2) * rocH1 + rocH2);
		let rocketW = 0.8* Math.max((Math.floor(s.stage/3) * rocW0 , Math.floor(s.stage/2) * rocW1 , rocW2))
		if (s.pauseThrust<=0 ) {
			if (s.open<=0) {
				for (let i = 0;i<4;i++) {
					s.fireAnim=(s.fireAnim+1) % 3
					let imF = images["rocketFire"+s.fireAnim+".png"]
					
					ctx.globalAlpha=Math.random();
					ctx.drawImage(imF,
					-siz*rocketW/2,-satH*siz/2+fireY,
					siz*rocketW,siz*(imF.width/rocketW) * imF.height*Math.random())
				}
				ctx.globalAlpha=1
				/*ctx.drawImage(imF,
					-siz*rocketW/2,-satH*siz/2+fireY,
					siz*rocketW,siz*(imF.width/rocketW) * imF.height*Math.random())*/
				
			}

		} else {
			s.pauseThrust--;
		}
		
		if ( s.stage>=3) {
			// if (dis > atmHeight0) {
			// 	s.stage--;
			// 	s.pauseThrust=5;
			// 	spawnRocketPart0(s.x,s.y,s.ang,siz);
			// }
			let imP = images["rocketPart0.png"]
			ctx.drawImage(imP,-siz*rocW0/2,-siz*satH/2+siz*(rocH2+rocH1),siz*rocW0,siz*rocH0)
		}

		if ( s.stage>=2) {
			// if (dis > atmHeight1) {
			// 	s.stage--;
			// 	s.pauseThrust=5;
			// 	spawnRocketPart1(s.x,s.y,s.ang,siz);
			// }	
			let imP = images["rocketPart1.png"]
			ctx.drawImage(imP,-siz*rocW1/2,-siz*satH/2+siz*rocH2,siz*rocW1,siz*rocH1)
		}


		if(s.open<=0) {
			ctx.drawImage(im,-siz*rocW2/2,-siz*satH/2,siz*rocW2,siz*rocH2)
			
		} else {
			
			let img = images["rocketFold"+(9-s.open-1)+".png"]
			ctx.drawImage(img,-siz*img.width/4,-siz*satH/2,siz*img.width/2,siz*satH)
		}
		//ctx.fillRect(0-15,0-5,30,10);
		ctx.restore();

		
	
}

function drawLaunchingSats() {
	for (let key in launchingSats) {
		let s = launchingSats[key];
		let dis = Distance(s.x,s.y,width/2,height/2);
		let siz = Math.min(Math.max(0.6,dis/atmHeight2),1);
		
		// ctx.strokeStyle="white";
		// ctx.lineWidth=2;
		// ctx.beginPath();
		// ctx.moveTo(s.x,s.y);
		// ctx.lineTo(s.x+Math.cos(s.ang)*10,s.y+Math.sin(s.ang )*10)
		// ctx.stroke();
		// ctx.closePath();

		ctx.save();
		ctx.fillStyle="white";
		ctx.translate(s.x,s.y);
		ctx.rotate(s.ang+0.5*Math.PI);
		
		

		//let imF = images["rocketFire"+s.fireAnim+".png"]
		let im = images["rocketPart2.png"]
		let fireY = siz * (Math.floor(s.stage/3) * rocH0 + Math.floor(s.stage/2) * rocH1 + rocH2);
		let rocketW = 0.8* Math.max((Math.floor(s.stage/3) * rocW0 , Math.floor(s.stage/2) * rocW1 , rocW2))
		if (s.pauseThrust<=0 ) {
			if (s.open<=0) {
				for (let i = 0;i<4;i++) {
					s.fireAnim=(s.fireAnim+1) % 3
					let imF = images["rocketFire"+s.fireAnim+".png"]
					
					ctx.globalAlpha=Math.random();
					ctx.drawImage(imF,
					-siz*rocketW/2,-satH*siz/2+fireY,
					siz*rocketW,siz*(imF.width/rocketW) * imF.height*Math.random())
				}
				ctx.globalAlpha=1
				/*ctx.drawImage(imF,
					-siz*rocketW/2,-satH*siz/2+fireY,
					siz*rocketW,siz*(imF.width/rocketW) * imF.height*Math.random())*/
				
			}

		} else {
			s.pauseThrust--;
		}
		
		if ( s.stage>=3) {
			// if (dis > atmHeight0) {
			// 	s.stage--;
			// 	s.pauseThrust=5;
			// 	spawnRocketPart0(s.x,s.y,s.ang,siz);
			// }
			let imP = images["rocketPart0.png"]
			ctx.drawImage(imP,-siz*rocW0/2,-siz*satH/2+siz*(rocH2+rocH1),siz*rocW0,siz*rocH0)
		}

		if ( s.stage>=2) {
			// if (dis > atmHeight1) {
			// 	s.stage--;
			// 	s.pauseThrust=5;
			// 	spawnRocketPart1(s.x,s.y,s.ang,siz);
			// }	
			let imP = images["rocketPart1.png"]
			ctx.drawImage(imP,-siz*rocW1/2,-siz*satH/2+siz*rocH2,siz*rocW1,siz*rocH1)
		}


		if(s.open<=0) {
			ctx.drawImage(im,-siz*rocW2/2,-siz*satH/2,siz*rocW2,siz*rocH2)
			
		} else {
			
			let img = images["rocketFold"+(9-s.open-1)+".png"]
			ctx.drawImage(img,-siz*img.width/4,-siz*satH/2,siz*img.width/2,siz*satH)
		}
		//ctx.fillRect(0-15,0-5,30,10);
		ctx.restore();

		
		
		
	}
}
function drawSats() {
	ctx.fillStyle="white"
	for (let key in sats) {
		let p = sats[key];
		let dis = Distance(p.x,p.y,width/2,height/2)
		let ang = angle(p.x,p.y,width/2,height/2)
		let siz = Math.min(Math.max(0.6,dis/atmHeight2),1);




		if(p.hover || selectedSat === p) {
			ctx.fillStyle="rgba(255,255,255,0.5)";
			ctx.beginPath();
			ctx.arc(p.x,p.y,siz*25,0,Math.PI*2,0);
			ctx.fill();
			ctx.closePath();

			ctx.strokeStyle = "rgba(255,255,255,0.5)";
			ctx.beginPath();
			ctx.arc(width/2,height/2,siz*p.dis,0,Math.PI*2,0);
			ctx.stroke();
			ctx.closePath();
		}
		// ctx.strokeStyle="white";
		// ctx.lineWidth=2;
		// ctx.beginPath();
		// ctx.moveTo(p.x,p.y);
		// ctx.lineTo(p.x+Math.cos(p.ang)*10,p.y+Math.sin(p.ang )*10)
		// ctx.stroke();
		// ctx.closePath();
		/*ctx.save(),
		ctx.translate(p[0],p[1]);
		ctx.rotate(p[2]);

		ctx.fillRect(-5,-15,10,30);
		ctx.restore();*/
		ctx.save(),
		ctx.translate(p.x,p.y);
		ctx.rotate(ang);
		if (p.thrust>0) {
			p.thrust--;
			ctx.drawImage(images["rocketFire2.png"],0-siz*satW/10,+siz*satH*0.125+satH*0.5,siz*satW/5,siz*satH*0.5)
		}
		//ctx.rotate(-(ang));
		//ctx.rotate(p.ang+Math.PI*0.5);
		let im = images["sat.png"]
		ctx.drawImage(images["sat.png"],0-siz*satW/2,-5,siz*satW,siz*satH)
		ctx.restore();
		/*ctx.beginPath();
		ctx.arc(p[0],p[1],10,0,Math.PI*2,0);
		ctx.fill();
		ctx.closePath();*/

	}
}

function drawFallingsSats() {
	ctx.fillStyle="white"
	ctx.globalAlpha=0.8;
	for (let key in fallingSats) {
		let p = fallingSats[key];
		
		let siz = Math.min((p.dis-earthHeight)/atmHeight2,1);
		ctx.fillStyle="rgba(255,"+(Math.random()*255)+",0,"+(0+Math.random()*0.8)+")";
		ctx.beginPath();
		ctx.arc(p.x,p.y,siz * (1+Math.random()*satW),0,Math.PI*2,0);
		ctx.fill();
		ctx.closePath(); 
		
		ctx.save(),
		ctx.translate(p.x,p.y);
		ctx.rotate(p.ang);
		let im = images["sat.png"]

		ctx.drawImage(images["sat.png"],0-siz*satW/2,0-siz*satH/2,siz*satW,siz*satH)
		ctx.restore();


		ctx.beginPath();
		ctx.arc(p.x,p.y,siz*(1+Math.random()*4),0,Math.PI*2,0);
		ctx.fill();
		ctx.closePath(); 


	}
	ctx.globalAlpha=1;
}

function drawStats() {
	stCtx.clearRect(0,0,width/2,height)
	stCtx.fillStyle="rgba(240,240,240,1)";
	stCtx.font = "0.8em Roboto Mono, monospace";

	stCtx.fillText("Rockets Launched - "+totalLaunches,5,20);
		stCtx.fillText("Success - " + Math.floor(Math.max(0.001,(totalLaunchesSuccess/totalLaunches)*100)) + "% ("+totalLaunchesSuccess+"/"+totalLaunchesFailure+")",25,40);

	stCtx.fillText("Satellites Launched - "+totalSatellites,5,70);
		stCtx.fillText("Current - " + sats.length,25,90);
		stCtx.fillText("Crashed - " + totalSatellitesCrashed,25,110);
			stCtx.fillText("Into another Satellite - " + crashedIntoEachOther,45,130);
			stCtx.fillText("Into Earth - " + crashedIntoEarth,45,150);
		stCtx.fillText("Lost in Space - " + lostInSpace,25,170);



	stCtx.font = "1em Roboto Mono, bold";
	stCtx.fillText("Total Orbits:",5,250)
	stCtx.fillText(totalRotations,5,270)
	stCtx.fillText("Most Satellites at one Time:" ,5,290)
	stCtx.fillText(mostSatsAtOnce,5,310)
	stCtx.fillText("Most Orbits of single Satellite",5,330)
	stCtx.fillText(highestRotation,5,350)
	
}
function drawRotationGains() {
	for (var i = rotationGains.length - 1; i >= 0; i--) {
		let r = rotationGains[i];
		r[4]--;
		if(r[4]<=0) {
			rotationGains.splice(i,1);
			continue;
		} else {
			r[1]--;
			ctx.strokeStyle="rgba(255,255,255,"+(r[4]/100)+")";
			ctx.lineWidth = 10 * (1 - r[4]/100);
			ctx.beginPath();
			ctx.arc(width/2,height/2,r[2],0,Math.PI*2,0);
			ctx.stroke();
			ctx.closePath();


			ctx.fillStyle="rgba(240,240,240,0.8)";
			ctx.font = r[4]/5+"px Roboto Mono bold";
			ctx.fillText("+"+r[3],r[0],r[1])
		}

	};
}

const starAmount = 10000;
const MathPI180 = Math.PI/180
var stars = [];
var tmpCnv
function createStars() {
	

	for (var i = 0; i < starAmount; i++) {
		let ang = Math.random()*Math.PI*2;
		let dis = Math.pow(Math.random(),1.5) * Math.max(width,height)*1.2;
		var randomX = width/2 - Math.cos(ang)*dis///(Math.pow(Math.random(),5)) * width*1.2  + (Math.pow(Math.random(),5)) * width*1.2;
		var randomY = height/2- Math.sin(ang)*dis///(Math.pow(Math.random(),5)) * height*1.2 + (Math.pow(Math.random(),5)) * height*1.2;

		var randomSize = Math.random() * 1+0.1;
		var randomOpacityOne = Math.floor((Math.random() * 5) + 1);
		var randomOpacityTwo = Math.floor((Math.random() * 5) + 1);
		var randomHue = Math.floor((Math.random() * 180 + 180) + 1);
		var m = Math.floor(Math.random() * 100);

		stars.push([randomX, randomY, randomSize, m, true, randomOpacityOne, randomOpacityTwo, randomHue]);
	}



	
	tmpCnv = createCanvas(width,height)
	var tmpCtx = tmpCnv.getContext("2d");
	
	tmpCtx.clearRect(0, 0, width, height);
	tmpCtx.fillStyle = "rgba(0,0,0,1)";
	tmpCtx.fillRect(0, 0, width, height);

	for (let kei in stars) {
		let s = stars[kei];
		tmpCtx.fillStyle = "hsla(" + s[7] + ", 30%, 80%, ." + s[5] + ")";
		tmpCtx.strokeStyle = "hsla(" + s[7] + ", 30%, 80%, ." + s[6] + ")";
		tmpCtx.beginPath();
		tmpCtx.lineWidth = s[2] * Math.ceil(s[3] / 100);
		tmpCtx.rect(s[0], s[1], s[2], s[2]);
		tmpCtx.stroke();
		tmpCtx.fill();
		tmpCtx.closePath();
		tmpCtx.closePath();		

	}
	
	stars = []


	drawStars();

}
var diagLng;
function drawStars(rad) {

	

	
	bctx.clearRect(0, 0, diagLng, diagLng);
	
	bctx.drawImage(tmpCnv, 0, 0);

}
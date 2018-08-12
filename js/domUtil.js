function createCanvas(w, h, mL, mT, id, className, L, T, abs) {

	let tmpCnv = document.createElement("canvas");
	tmpCnv.id = id;
	tmpCnv.className = className;
	tmpCnv.width = w;
	tmpCnv.height = h;
	tmpCnv.style.marginTop = mT + "px";
	tmpCnv.style.marginLeft = mL + "px";
	tmpCnv.style.left = L + "px";
	tmpCnv.style.top = T + "px";
	if (abs) {
		tmpCnv.style.position = "absolute";
	}
	return tmpCnv;
}

function createDiv(id, className, styles, attributes) {
	let but = document.createElement("div");
	but.id = id;
	but.className = className;

	for (let key in styles) {
		but.style[key] = styles[key];
	}

	for (let key in attributes) {
		but[key] = attributes[key]
		but.setAttribute(key, styles[key]);
	}


	return but;
}
function createContentDiv(title,img,subTitle) {
	let cont = createDiv(title,"contentDiv");
	cont.style.maxHeight="40px";
	let contentTop = createDiv(title+"contentTop","contentTop");
	
	let titleDiv  = createDiv(title+"title","contentDivTitle");
	titleDiv.innerHTML = title;
	contentTop.appendChild(titleDiv);

	if (subTitle) {
		let subTitleDiv  = createDiv(title+"subTitle","contentDivSubTitle");
		subTitleDiv.innerHTML = subTitle;
		contentTop.appendChild(subTitleDiv);
	}

	let imgDiv = document.createElement("img");
	imgDiv.src = "img/"+img;
	contentTop.appendChild(imgDiv);
	
	contentTop.addEventListener("click",function() {
		if (cont.style.maxHeight=="40px") {

			cont.style.maxHeight="500px";
		} else {
			cont.style.maxHeight="40px";
		}
	})

	cont.appendChild(contentTop)
	return cont;
};
function createSlider(id, min, max, step, defaultValue, lab, varName, callback) {
  let cont = document.createElement("div");
  cont.className = "sliderDiv";
  let el = document.createElement("input");
  window[varName] = defaultValue;
  el.id = id;
  el.name = id;
  el.type = "range";
  el.min = min;
  el.max = max;
  el.step = step
  el.defaultValue = defaultValue || (min + max) / 2;
  el.setAttribute("list", id + "ticks");
  let label = document.createElement("div");
  label.className = "label"
  //label.setAttribute("for",id)
  label.innerHTML = lab;

  let dl = document.createElement("datalist");
  dl.id = id + "ticks";

  let opt1 = document.createElement("option");
  opt1.value = min;
  opt1.label = min;
  let opt2 = document.createElement("option");
  opt2.value = (min + max) / 2;
  opt2.label = (min + max) / 2;
  let opt3 = document.createElement("option");
  opt3.value = max;
  opt3.label = max;
  let thumbBubble = document.createElement("div");
  thumbBubble.className = "thumbBubble";
  //thumbBubble.innerHTML = defaultValue;
  thumbBubble.style.width = "100%";
  thumbBubble.style.textAlign = "center";
  let bubSpan = document.createElement("span");
  bubSpan.innerHTML = defaultValue;
  let bubInp = document.createElement("input");
  bubInp.type = "number";
  bubInp.value = defaultValue;
  bubInp.min = min;
  bubInp.max = max;
  bubInp.step = step;
  bubInp.defaultValue = defaultValue;
  thumbBubble.appendChild(bubSpan)
  thumbBubble.appendChild(bubInp)
  thumbBubble.addEventListener("mouseenter", function() {
    $(thumbBubble).addClass("hovered");
  })
  thumbBubble.addEventListener("mouseleave", function() {
    $(thumbBubble).removeClass("hovered");
  })
  dl.appendChild(opt1);
  dl.appendChild(opt2);
  dl.appendChild(opt3);
  el.onchange = function() {
    bubSpan.innerHTML = parseFloat(el.value)
    window[varName] = parseFloat(el.value);
    bubInp.value = el.value;
    try {
    	callback();
    } catch(e) {console.log(e)}
  }
  el.oninput = function() {
    bubSpan.innerHTML = parseFloat(el.value)
    window[varName] = parseFloat(el.value);
    bubInp.value = el.value;
    try {
    	callback();
    } catch(e) {console.log(e)}
  }
  bubInp.onchange = function() {
    bubSpan.innerHTML = parseFloat(bubInp.value)
    window[varName] = parseFloat(bubInp.value);
    el.value = bubInp.value
    try {
    	callback();
    } catch(e) {console.log(e)}
  }
  bubInp.oninput = function() {
    bubSpan.innerHTML = parseFloat(bubInp.value)
    window[varName] = parseFloat(bubInp.value);
    el.value = bubInp.value
    try {
    	callback();
    } catch(e) {console.log(e)}
  }
  let resetBut = document.createElement("div");
  resetBut.innerHTML = "Reset";
  resetBut.className = "resetBut";
  resetBut.onclick = function() {
    el.value = defaultValue;
    window[varName] = defaultValue;
    bubInp.value = defaultValue
  }
  cont.appendChild(label)
  cont.appendChild(el)
  cont.appendChild(thumbBubble);
  cont.appendChild(dl)
  cont.appendChild(resetBut)
  return {div:cont,func:function() {
  	bubSpan.innerHTML = parseFloat(window[varName])
  	el.value = parseFloat(window[varName])}
  };
}
function createButton(w, h, t, l, mT, mL, pos, bR, bgCol, bgColHov, id, className, clickEv, innerHTML) {
	let but = document.createElement("div");
	but.style.width = w;
	but.style.height = h;
	but.style.top = t;
	but.style.left = l;
	but.style.marginTop = mT;
	but.style.marginLeft = mL;
	but.style.position = pos;
	but.style.borderRadius = bR;
	but.style.backgroundColor = bgCol;
	but.id = id;
	but.className = className;
	but.innerHTML = innerHTML;

	but.addEventListener("mouseenter", function() {
		but.style.backgroundColor = bgColHov;
	})
	but.addEventListener("mouseleave", function() {
		but.style.backgroundColor = bgCol;
	})
	but.addEventListener("click", function() {
		console.log(id + " clicked");

		clickEv();
	})
	return but;
}

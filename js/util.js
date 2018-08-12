function getColor(lvl, a) {
	a = a ||  1;
	if (lvl == "1") {
		return "rgba(0,255,0," + a + ")";
	} else if (lvl == "2") {
		return "rgba(0,0,255," + a + ")";
	} else if (lvl == "3") {
		return "rgba(255,0,0," + a + ")";
	}

}
var uniqEs6 = (arrArg) => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) == pos;
  });
}
function compareAngles(a, b) {

	return Math.abs((a + Math.PI * 2) % (Math.PI * 2) - (b + Math.PI * 2) % (Math.PI * 2))


}
function quickSort2(arr) {

	if (arr.length==0) {
		return [];
	}
	if (arr.length == 1) {
		return arr;
	}
	if ( arr.length  > 0 ) {

		var H = [];
		var L = [];
		var pivot = arr[arr.length-1];
		for (var i = 0; i< arr.length;i++) {
			if (arr[i]<pivot) {
				H.push(arr[i]);
			} else if (arr[i] != pivot) {
				L.push(arr[i]);
			}
		}
		if (H.length>0) {
			if (H.length==1) {
				// H = H;
			} else {
			//	console.log(H);
				H = quickSort2(H);
			}
		}
		if (L.length>0) {
			if (L.length==1) {
				// H = H;
			} else {
			//	console.log(L);
				L = quickSort2(L);
			}
		}
		
		L.push(pivot);
		for (var j = 0;j<H.length;j++) {
			
			L.push(H[j]);
		}
		return L;

	}
}
function turnTowards2(ang1, angl, turnSpeed) {

    angl -= Math.PI;
    if (angl < Math.PI * (-1)) {
        angl += Math.PI * 2;
    }
    if (ang1 > Math.PI) {
        ang1 -= Math.PI * 2;
    }
    if (ang1 < -1 * Math.PI) {
        ang1 += Math.PI * 2;
    }



    ang1 = ((ang1 + turnSpeed));



    return ang1;
}
function contains(el,arr) {
	for (let key in arr) {
		if (el == arr[key]) {
			return true;
		}
	}
	return false;
}
function angle(p1x, p1y, p2x, p2y) {

	return Math.atan2(p2y - p1y, p2x - p1x);

}


function Distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}
function getScrollbarWidth() {
	var outer = document.createElement("div");
	outer.style.visibility = "hidden";
	outer.style.width = "100px";
	outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

	document.body.appendChild(outer);

	var widthNoScroll = outer.offsetWidth;
	// force scrollbars
	outer.style.overflow = "scroll";

	// add innerdiv
	var inner = document.createElement("div");
	inner.style.width = "100%";
	outer.appendChild(inner);

	var widthWithScroll = inner.offsetWidth;

	// remove divs
	outer.parentNode.removeChild(outer);

	return widthNoScroll - widthWithScroll;
}
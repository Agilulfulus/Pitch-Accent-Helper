var current_token = "";
var current_text = [];
var pressed = {};

var dpi = window.devicePixelRatio;

var c = document.createElement("canvas");
document.body.appendChild(c);

var ctx = c.getContext("2d", { alpha: false });

function fix_dpi() {
	//get CSS height
	//the + prefix casts it to an integer
	//the slice method gets rid of "px"

	var style_height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);

	//get CSS width
	var style_width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);

	//scale the canvas

	c.setAttribute('height', style_height * dpi);
	c.setAttribute('width', style_width * dpi);
}

function getResult(token, map) {
	if (token == "")
		return map.RES;
	else if (map[token[0]] === undefined)
		return undefined;
	else
		return getResult(token.substr(1), map[token[0]]);
}

function isValid(token, map) {
	if (token == "")
		return true;
	else if (map[token[0]] === undefined)
		return false;
	else
		return isValid(token.substr(1), map[token[0]]);
}

function findEntry(kana, accent) {
	var ret = [];
	for (var i = 0; i < vocab.length; i++) {
		var entry = vocab[i];
		if (entry.kana == kana && entry.accent == accent)
			ret.push(entry);
	}
	return ret;
}

var accent = 0;

document.addEventListener("keydown", (e) => {
	if (pressed[e.key] === undefined || pressed[e.key] === false) {
		pressed[e.key] = true;
		if (!isNaN(e.key)) {
			accent = e.key;
		}
		if (e.key == "Enter") {
			var temp = getResult(current_token, initials);
			if (temp !== undefined) {
				current_text.push(temp);
				current_token = "";
			} else {
				current_token = "";
			}
		}
		else if (e.key == "Backspace") {
			if (current_token == "" && current_text.length > 0) {
				current_text.pop();
			} else if (current_token.length > 0) {
				current_token = current_token.substr(0, current_token.length - 1);
			}
		} else {
			var temp_token = current_token + e.key;
			if (isValid(temp_token, initials))
				current_token = temp_token;
			else if (isValid(e.key, initials) && getResult(current_token, initials) !== undefined) {
				current_text.push(getResult(current_token, initials));
				current_token = e.key;
			}
		}

		accent = Math.min(accent, current_text.length);
	}
});

document.addEventListener("keyup", (e) => {
	pressed[e.key] = false;
});


(function render() {
	window.requestAnimationFrame(render);
	fix_dpi();

	var font_height = Math.min(c.height, c.width) / 8;
	var font_height_main = Math.min(c.height, c.width) / Math.max(current_text.length + 1, 8);
	ctx.lineWidth = font_height_main / 32;

	ctx.fillStyle = "#161621";
	ctx.strokeStyle = "#ffffff";
	ctx.fillRect(0, 0, c.width, c.height);

	var entries = findEntry(current_text.join(""), accent);

	ctx.textAlign = "left";
	ctx.font = font_height_main + "px Sans-Serif";
	var cursor = c.width / 2 - ctx.measureText(current_text.join("")).width / 2;
	var high = false;
	if (accent == 1)
		high = true;
	var i;
	for (i = 0; i < current_text.length; i++) {
		if (i + 1 == accent) {
			if (entries.length > 0)
				ctx.fillStyle = "#99ff99";
			else
				ctx.fillStyle = "#ff9999";
		} else
			ctx.fillStyle = "#ffffff";

		ctx.fillText(current_text[i], cursor, c.height / 2);
		if (entries.length > 0)
			ctx.strokeStyle = "#00FF00";
		else
			ctx.strokeStyle = "#FF0000";

		var prev = high;

		if (i != 0) {
			if (i == accent || i == 1) {
				high = !high;
			}
		}

		if (prev != high) {
			ctx.beginPath();
			ctx.moveTo(cursor, c.height / 2 - font_height_main);
			ctx.lineTo(cursor, c.height / 2 + font_height_main / 4);
			ctx.stroke();
		}

		if (high) {
			ctx.beginPath();
			ctx.moveTo(cursor, c.height / 2 - font_height_main);
			ctx.lineTo(cursor + ctx.measureText(current_text[i]).width, c.height / 2 - font_height_main);
			ctx.stroke();
		} else {
			ctx.beginPath();
			ctx.moveTo(cursor, c.height / 2 + font_height_main / 4);
			ctx.lineTo(cursor + ctx.measureText(current_text[i]).width, c.height / 2 + font_height_main / 4);
			ctx.stroke();
		}

		cursor += ctx.measureText(current_text[i]).width;
	}

	if (i == accent) {
		ctx.beginPath();
		ctx.moveTo(cursor, c.height / 2 - font_height_main);
		ctx.lineTo(cursor, c.height / 2 + font_height_main / 4);
		ctx.stroke();
	}

	ctx.fillStyle = "#ffffff";
	ctx.font = (font_height / 4) + "px Sans-Serif";
	ctx.textAlign = "center";
	ctx.fillText(current_text.join("") + " " + current_token, c.width / 2, c.height / 2 + font_height_main * .75);
	if (entries.length > 0) {
		ctx.font = (font_height / 3) + "px Sans-Serif";
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			ctx.fillText(entry.kanji + " ・ " + entry.en, c.width / 2, c.height / 2 - font_height_main * 1.5 - (i * (font_height / 3 * 1.5)));
		}
	}
})();
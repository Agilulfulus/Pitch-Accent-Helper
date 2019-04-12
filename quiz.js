var current_token = "";
var current_text = [];
var pressed = {};

var shuffled = shuffle(vocab);
var index = -1;
var first_play = false;

var accent = -1;
var flag = false;

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

document.addEventListener("keydown", (e) => {
	if (pressed[e.key] === undefined || pressed[e.key] === false) {
		pressed[e.key] = true;
		if (index >= 0) {
			if (!flag) {
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
				} else if (e.key == "q") {
					if (shuffled[index].audio !== undefined) {
						var audio = new Audio('audio/' + shuffle(shuffled[index].audio)[0]);
						audio.play();
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
			} else if (e.key == "Enter") {
				current_text = [];
				current_token = "";
				accent = -1;
				flag = false;
				index++;
				if (index >= shuffled.length) {
					shuffled = shuffle(vocab);
					index = 0;
				}
				first_play = false;
			}
		} else if (e.key == "Enter") {
			index = 0;
		}
	}
});

document.addEventListener("keyup", (e) => {
	pressed[e.key] = false;
});

function render() {
	window.requestAnimationFrame(render);
	fix_dpi();

	ctx.fillStyle = "#161621";
	ctx.strokeStyle = "#ffffff";
	ctx.fillRect(0, 0, c.width, c.height);
	var font_height = Math.min(c.height, c.width) / 8;

	if (index == -1) {
		ctx.lineWidth = font_height / 32;
		ctx.fillStyle = "#ffffff";
		ctx.font = (font_height / 2) + "px Sans-Serif";
		ctx.textAlign = "center";
		ctx.fillText("Press Enter to Start", c.width / 2, c.height / 2);

		ctx.strokeStyle = "#ffffff";
		ctx.beginPath();
		ctx.moveTo(c.width / 2 - ctx.measureText("Press Any Key to Start").width / 1.75, c.height / 2 - font_height * 0.75);
		ctx.lineTo(c.width / 2 + ctx.measureText("Press Any Key to Start").width / 1.75, c.height / 2 - font_height * 0.75);
		ctx.lineTo(c.width / 2 + ctx.measureText("Press Any Key to Start").width / 1.75, c.height / 2 + font_height * 0.5);
		ctx.lineTo(c.width / 2 - ctx.measureText("Press Any Key to Start").width / 1.75, c.height / 2 + font_height * 0.5);
		ctx.lineTo(c.width / 2 - ctx.measureText("Press Any Key to Start").width / 1.75, c.height / 2 - font_height * 0.75);
		ctx.stroke();
	} else {
		var testing_entry = shuffled[index];

		if (!first_play) {
			first_play = true;
			if (testing_entry.audio !== undefined) {
				var audio = new Audio('audio/' + shuffle(testing_entry.audio)[0]);
				audio.play();
			}
		}

		var font_height_main = Math.min(c.height, c.width) / Math.max(current_text.length + 1, 8);
		ctx.lineWidth = font_height_main / 32;

		var entries = findEntry(current_text.join(""), accent);
		for (var i = 0; i < entries.length; i++) {
			if (entries[i] == testing_entry) {
				flag = true;
				current_token = "";
			}
		}

		ctx.textAlign = "left";
		ctx.font = font_height_main + "px Sans-Serif";
		var cursor = c.width / 2 - ctx.measureText(current_text.join("")).width / 2;
		var high = false;
		if (accent == 1)
			high = true;
		var i;
		for (i = 0; i < current_text.length; i++) {
			if (i + 1 == accent) {
				if (flag)
					ctx.fillStyle = "#99ff99";
				else
					ctx.fillStyle = "#ff9999";
			} else
				ctx.fillStyle = "#ffffff";

			ctx.fillText(current_text[i], cursor, c.height / 2);
			if (flag)
				ctx.strokeStyle = "#00FF00";
			else
				ctx.strokeStyle = "#FF0000";

			if (accent >= 0) {
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
			}

			cursor += ctx.measureText(current_text[i]).width;
		}

		if (i == accent || (accent == -1)) {
			if (accent == -1)
				ctx.strokeStyle = "#999999";

			ctx.beginPath();
			ctx.moveTo(cursor, c.height / 2 - font_height_main);
			ctx.lineTo(cursor, c.height / 2 + font_height_main / 4);
			ctx.stroke();
		}

		ctx.fillStyle = "#999999";
		ctx.font = (font_height / 4) + "px Sans-Serif";
		ctx.textAlign = "center";
		ctx.fillText(current_text.join("") + " " + current_token, c.width / 2, c.height / 2 + font_height_main * .75);
		ctx.fillStyle = "#ffffff";
		ctx.font = (font_height / 3) + "px Sans-Serif";
		if (shuffled[index].audio === undefined || flag) {
			ctx.fillText("(" + (index + 1) + "/" + shuffled.length + ") ・ " + testing_entry.kanji + " ・ " + testing_entry.en, c.width / 2, c.height / 2 - font_height_main * 1.5);
		} else {
			ctx.fillText("(" + (index + 1) + "/" + shuffled.length + ") ・ Press Q For Audio", c.width / 2, c.height / 2 - font_height_main * 1.5);
		}
		if (flag) {
			ctx.fillStyle = "#ffffff";
			ctx.font = (font_height / 4) + "px Sans-Serif";
			ctx.textAlign = "center";
			ctx.fillText("Press Enter", c.width / 2, c.height / 2 + font_height_main * 1.5);

			ctx.strokeStyle = "#ffffff";
			ctx.beginPath();
			ctx.moveTo(c.width / 2 - ctx.measureText("Press Enter").width / 1.75, c.height / 2 + font_height_main * 1.15);
			ctx.lineTo(c.width / 2 + ctx.measureText("Press Enter").width / 1.75, c.height / 2 + font_height_main * 1.15);
			ctx.lineTo(c.width / 2 + ctx.measureText("Press Enter").width / 1.75, c.height / 2 + font_height_main * 1.65);
			ctx.lineTo(c.width / 2 - ctx.measureText("Press Enter").width / 1.75, c.height / 2 + font_height_main * 1.65);
			ctx.lineTo(c.width / 2 - ctx.measureText("Press Enter").width / 1.75, c.height / 2 + font_height_main * 1.15);
			ctx.stroke();
		}
	}
}

render();

const vocab = [
	{
		kana: "かみ",
		kanji: "神",
		accent: 1,
		en: "God",
		audio: [
			"kami1.wav"
		]
	},
	{
		kana: "かみ",
		kanji: "髪",
		accent: 2,
		en: "Hair",
		audio: [
			"kami2.wav"
		]
	},
	{
		kana: "かみ",
		kanji: "紙",
		accent: 0,
		en: "Paper",
		audio: [
			"kami0.wav"
		]
	},
	{
		kana: "はな",
		kanji: "花",
		accent: 2,
		en: "Flower",
		audio: [
			"hana2.wav"
		]
	},
	{
		kana: "はな",
		kanji: "鼻",
		accent: 0,
		en: "Nose",
		audio: [
			"hana0.wav"
		]
	}
]

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};

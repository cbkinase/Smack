const smileysList = [
	"🥰", "😛", "🤭", "😑", "😇", "🙄", "😴", "💖", "💔", "💯", "😨", "😧", "😦", "😱", "😡",
	"😫", "😩", "😓", "😮", "😯", "😲", "😺", "😸", "🐱", "😳", "😞", "😖", "😈", "😬", "🤨",
	"😉", "😜", "😣", "🤒", "😷", "🤢", "😎", "😪", "🙂", "😊", "😁", "😔", "🤣", "😀", "🥴",
	"🎅", "✍", "🧠", "🤓", "🤪", "🤡", "💀", "🥶", "🤗", "💕", "🤩"
].sort().reverse();

const workList = [
	"✅", "👀", "👏", "👍", "👋", "🎯", "🎉", "📢"
];

const animalsList = [
	"🦀", "🐵", "🐶", "🐺", "🦁", "🐯", "🦊", "🦝", "🐮", "🐷", "🐗", "🐭", "🐹", "🐰", "🐻",
	"🐨", "🐼", "🐸", "🦓", "🐴", "🦄", "🐔", "🐲", "🐒", "🦍", "🐽", "🐘", "🐍", "🕷", "🐢",
	"🐬", "🦐"
];

const foodList = [
	"🍆", "🍕", "🍔", "🍟", "🌭", "🍿", "🧂", "🥓", "🥚", "🍳", "🧇", "🥞", "🧈", "🍞", "🥐",
	"🥨", "🥯", "🧀", "🍓", "🌶", "🍄", "🥕", "🥗", "🥙", "🥪", "🌮", "🌯", "🍠", "🥡", "🥂",
	"🥫", "🍖"
];

export const emojis = {
	// "Recently Used": ["😔"],  // TODO: implement
	"Getting Work Done": workList,
	"Smileys & People": smileysList,
	"Animals & Nature": animalsList,
	"Food & Drink": foodList
};

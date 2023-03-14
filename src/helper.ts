export const pause = (duration: number) =>
	new Promise((r) => setTimeout(r, duration));

export const splitIntoLines = (text: string, charLimit = 37) => {
	const lines: string[] = [];
	let line = "";
	const words = text.split(" ");
	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		if (line.length + word.length <= charLimit) {
			line += word + " ";
		} else {
			lines.push(line.trim());
			line = word + " ";
		}
	}
	if (line.trim().length > 0) {
		lines.push(line.trim());
	}
	return lines;
};

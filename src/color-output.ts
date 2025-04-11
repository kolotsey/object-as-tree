let supported;
try {
	supported = process.stdout.hasColors();
} catch (e) {
	supported = false;
}

const wrap = (start: number, end: number) => 
	supported ? (s: string) => `\u001B[${start}m${s}\u001B[${end}m` : (s: string) => s;

export const reset = wrap(0, 0);
export const bold = wrap(1, 22);
export const dim = wrap(2, 22);
export const italic = wrap(3, 23);
export const underline = wrap(4, 24);
export const overline = wrap(53, 55);
export const inverse = wrap(7, 27);
export const hidden = wrap(8, 28);
export const strikethrough = wrap(9, 29);

export const black = wrap(30, 39);
export const red = wrap(31, 39);
export const green = wrap(32, 39);
export const yellow = wrap(33, 39);
export const blue = wrap(34, 39);
export const magenta = wrap(35, 39);
export const cyan = wrap(36, 39);
export const white = wrap(37, 39);
export const grey = wrap(90, 39);

const { parseInt } = Number;

export default function hex2rgb(hex = '#000000') {
  if (!hex) {
    return {};
  }

  const shorthandHex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const newHex = hex.replace(shorthandHex, (m, r, g, b) => (r + r + g + g + b + b));

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newHex).splice(1, 4);

  const rgb = result.map(val => parseInt(val, 16));
  const palette = ['r', 'g', 'b'];
  const rgbHash = rgb.reduce((acc, val, i) => {
    acc[palette[i]] = val;
    return acc;
  }, {});

  return result
    ? {
      ...rgbHash,
      toString: () => rgb.toString(),
    }
    : {};
}

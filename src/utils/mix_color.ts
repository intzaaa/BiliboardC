/*
MIT License

Copyright (c) 2019 Andy, 2020 GirkovArpa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function mix_hexes_naive(...hexes: string[]): string {
  const rgbs = hexes.map((hex) => hex2dec(hex));
  const rgb = rgbs
    .reduce((acc, cur) => {
      cur.forEach((e, i) => (acc[i] = acc[i] ? acc[i] + e : e));
      return acc;
    }, [] as number[])
    .map((e) => e / rgbs.length);
  const mixture = rgb2hex(rgb[0], rgb[1], rgb[2]);
  return mixture;
}

function hex2dec(hex: string): number[] {
  return hex
    .replace("#", "")
    .match(/.{2}/g)!
    .map((n) => parseInt(n, 16));
}

function rgb2hex(r: number, g: number, b: number): string {
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  r = Math.min(r, 255);
  g = Math.min(g, 255);
  b = Math.min(b, 255);
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

function rgb2cmyk(r: number, g: number, b: number): number[] {
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  let k = Math.min(c, m, y);
  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);
  return [c, m, y, k];
}

function cmyk2rgb(c: number, m: number, y: number, k: number): number[] {
  let r = c * (1 - k) + k;
  let g = m * (1 - k) + k;
  let b = y * (1 - k) + k;
  r = (1 - r) * 255 + 0.5;
  g = (1 - g) * 255 + 0.5;
  b = (1 - b) * 255 + 0.5;
  return [r, g, b];
}

function mix_cmyks(...cmyks: number[][]): number[] {
  let c = cmyks.map((cmyk) => cmyk[0]).reduce((a, b) => a + b, 0) / cmyks.length;
  let m = cmyks.map((cmyk) => cmyk[1]).reduce((a, b) => a + b, 0) / cmyks.length;
  let y = cmyks.map((cmyk) => cmyk[2]).reduce((a, b) => a + b, 0) / cmyks.length;
  let k = cmyks.map((cmyk) => cmyk[3]).reduce((a, b) => a + b, 0) / cmyks.length;
  return [c, m, y, k];
}

function mix_hexes(...hexes: string[]): string {
  let rgbs = hexes.map((hex) => hex2dec(hex));
  let cmyks = rgbs.map((rgb) => rgb2cmyk(rgb[0], rgb[1], rgb[2]));
  let mixture_cmyk = mix_cmyks(...cmyks);
  let mixture_rgb = cmyk2rgb(mixture_cmyk[0], mixture_cmyk[1], mixture_cmyk[2], mixture_cmyk[3]);
  let mixture_hex = rgb2hex(mixture_rgb[0], mixture_rgb[1], mixture_rgb[2]);
  return mixture_hex;
}

export { mix_hexes as mix_color };

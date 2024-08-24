import { FastAverageColor } from "fast-average-color";
import { Accessor, createSignal } from "solid-js";

const fac = new FastAverageColor();

const colors_map: { hash: string; color: Accessor<string> }[] = [];

export const get_image_average_color = (url: string) => {
  if (colors_map.findIndex((item) => item.hash === url) !== -1) {
    return colors_map.find((item) => item.hash === url)!.color;
  } else {
    const [signal, set_signal] = createSignal<string>("#ffffff");
    (async () => {
      set_signal(await fac.getColorAsync(url).then((color) => color.hex));
    })();
    colors_map.push({ hash: url, color: signal });
    return signal;
  }
  // if (colors_map.has(url)) {
  //   return colors_map.get(url)!;
  // } else {
  //   const color = createResource<string>(async () => {
  //   colors_map.set(url, color.hex);
  //   return color.hex;
  // }
};

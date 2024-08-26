import { FastAverageColor } from "fast-average-color";
import { Accessor, createSignal } from "solid-js";
import { main_theme } from "./main_theme";
import { RGBA } from "color-blend/dist/types";

const fac = new FastAverageColor();

const colors_map: {
  hash: string;
  color: Accessor<RGBA>;
}[] = [];

export const get_image_average_color = (url: string) => {
  if (colors_map.findIndex((item) => item.hash === url) !== -1) {
    return colors_map.find((item) => item.hash === url)!.color;
  } else {
    const [signal, set_signal] = createSignal<RGBA>(main_theme());
    (async () => {
      set_signal(
        await fac.getColorAsync(url).then((color) => ({
          r: color.value[0],
          g: color.value[1],
          b: color.value[2],
          a: color.value[3],
        }))
      );
    })();
    colors_map.push({ hash: url, color: signal });
    return signal;
  }
};

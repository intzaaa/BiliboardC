import { RGBA } from "color-blend/dist/types";
import { createMemo, createSignal } from "solid-js";
import { rgb2hex } from "./mix_color";
import { darken } from "color-blend";

export const [main_theme, set_main_theme] = createSignal<RGBA>({
  r: 200,
  g: 60,
  b: 60,
  a: 0.5,
});

export const main_theme_hex = createMemo(() => rgb2hex(main_theme()));

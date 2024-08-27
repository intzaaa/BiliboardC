import * as echarts from "echarts";
import { createEffect, lazy, onMount } from "solid-js";
import { store } from "../store";
import { darken, hardLight, softLight } from "color-blend";
import uniqolor from "uniqolor";
import { hex2dec, hex2rgb, rgb2hex } from "../utils/mix_color";
import { main_theme } from "../utils/main_theme";

export default () => {
  return (
    <div
      class="w-full h-full"
      ref={(element) => {
        onMount(() => {
          const chart = echarts.init(element, "dark", {
            renderer: "svg",
            width: "auto",
            height: "auto",
          });

          createEffect(() => {
            chart.setOption(
              {
                backgroundColor: "transparent",

                roam: false,
                nodeClick: false,

                series: [
                  {
                    type: "treemap",
                    roam: false,
                    tooltip: {
                      show: false,
                    },
                    silent: true,

                    squareRatio: 1,
                    itemStyle: {
                      color: "transparent",
                      borderColor: "red",
                    },

                    visibleMin: 20000,

                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,

                    select: {
                      label: {
                        show: false,
                      },
                    },

                    breadcrumb: {
                      show: false,
                    },

                    data: store.data.words
                      .filter((word) => word.heat > 2)
                      .filter((word) => word.name.length > 1)
                      .filter((word) => !word.name.split("").every((v, i, a) => v === a[0]))
                      .map((word) => {
                        const hex = uniqolor(word.name).color;
                        return {
                          name: word.name,
                          value: word.heat,
                          itemStyle: {
                            color: "black",
                            borderWidth: 8,
                            gapWidth: 8,
                            borderColor: rgb2hex(darken({ ...hex2rgb(hex), a: 0.5 }, main_theme())),
                          },
                          label: {
                            show: true,
                            color: rgb2hex(hardLight({ ...hex2rgb(hex), a: 0.5 }, main_theme())),
                            fontFamily: "'Noto Sans SC', sans-serif",
                            fontSize: 36,
                            fontWeight: "bold",
                          },
                        };
                      }),
                  },
                ],
              },
              {
                lazyUpdate: true,
              }
            );
          });
        });
      }}></div>
  );
};

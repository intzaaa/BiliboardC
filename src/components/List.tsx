import { Key } from "@solid-primitives/keyed";
import { createEffect, createMemo, onMount } from "solid-js";
import { store } from "../store";
import { rgb2hex } from "../utils/mix_color";
import pinyin from "pinyin";
import { add_sign } from "../utils/add_sign";
import * as echarts from "echarts";
import { get_image_average_color } from "../utils/get_image_average_color";
import { colorBurn, darken, hardLight, softLight } from "color-blend";
import { main_theme, main_theme_hex } from "../utils/main_theme";

export default () => {
  return (
    <Key
      each={store.data.videos
        .slice(0, 20)
        .filter((item) => item.owner.relations.length !== 0)
        .map(({ owner }) => owner)}
      by={(user) => user.mid}>
      {(user) => {
        const mixed_color = createMemo(() => hardLight(get_image_average_color(user().avatar)(), main_theme()));

        const price_color = createMemo(() =>
          (user().relations.at(-1)?.value.follower ?? 0) - (user().relations.at(-2)?.value.follower ?? 0) >= 0
            ? rgb2hex(
                hardLight(mixed_color(), {
                  r: 255,
                  g: 0,
                  b: 0,
                  a: 0.5,
                })
              )
            : rgb2hex(
                hardLight(mixed_color(), {
                  r: 255,
                  g: 0,
                  b: 0,
                  a: 0.5,
                })
              )
        );

        return (
          <div
            class="item w-full h-0 grow flex flex-row p-1 items-center justify-between"
            style={{
              color: rgb2hex(mixed_color()),
            }}>
            <div class="left gap-4 h-full w-fit max-w-full basis-1/3 flex flex-row justify-start items-center">
              <img
                class="aspect-square h-full"
                src={user().avatar}></img>
              <div class="name flex flex-col ">
                <div
                  class="text-xl font-black tracking-wider leading-none"
                  style={{
                    "font-family": "'Red Hat Mono Variable', monospace",
                  }}>
                  {pinyin(user().name.split("").join(" "), {})
                    .map((word) => word[0][0])
                    .filter((word) => /[a-zA-Z]/.test(word))
                    .join("")
                    .slice(0, 4)
                    .toUpperCase()}
                </div>
                <div
                  class="text-sm text-ellipsis leading-none"
                  style={{
                    "font-family": "'Noto Sans SC', sans-serif",
                  }}>
                  {user().name}
                </div>
              </div>
            </div>

            <div class="right gap-4 basis-2/3 h-full grow flex flex-row justify-end items-center">
              <div
                class="font-bold text-xl"
                style={{
                  "font-family": "'Red Hat Mono Variable', monospace",
                  color: price_color(),
                }}>
                {user().relations.at(-1)?.value.follower}
              </div>
              <div
                class="chart w-auto h-full aspect-[3/1] overflow-hidden "
                ref={(element) => {
                  onMount(() => {
                    onMount(() => {
                      const chart = echarts.init(element, "dark", {
                        renderer: "svg",
                      });

                      window.onresize = chart.resize;

                      createEffect(() => {
                        chart.setOption(
                          {
                            backgroundColor: "transparent",
                            xAxis: {
                              type: "value",
                              show: false,
                              min: "dataMin",
                              max: "dataMax",
                            },
                            yAxis: {
                              type: "value",
                              show: false,

                              min: "dataMin",
                              max: "dataMax",
                            },
                            series: {
                              type: "line",
                              smooth: true,
                              data: user().relations.map((record) => [record.timestamp, record.value.follower]),
                              showSymbol: false,
                              areaStyle: {
                                color: get_image_average_color(user().avatar)(),
                              },
                              lineStyle: {
                                color: rgb2hex(mixed_color()),
                              },
                            },
                            grid: {
                              left: "5%",
                              top: "5%",
                              right: "5%",
                              bottom: "5%",
                            },

                            animation: false,
                          },
                          {
                            lazyUpdate: true,
                          }
                        );
                      });
                    });
                  });
                }}></div>
              <div
                class="font-semibold text-sm w-12 overflow-hidden text-center outline outline-2 -outline-offset-1"
                style={{
                  "outline-color": price_color(),
                  "font-family": "'Red Hat Mono Variable', monospace",
                }}>
                {add_sign((user().relations.at(-1)?.value.follower ?? 0) - (user().relations.at(-2)?.value.follower ?? 0))}
              </div>
            </div>
          </div>
        );
      }}
    </Key>
  );
};

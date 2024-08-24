import { Key } from "@solid-primitives/keyed";
import { createEffect, createSignal, onMount } from "solid-js";
import { data } from "../handlers/data";
import { mix_color } from "../utils/mix_color";
import pinyin from "pinyin";
import { add_sign } from "../utils/add_sign";
import * as echarts from "echarts";
import { get_image_average_color } from "../utils/get_image_average_color";

export default () => {
  return (
    <div class="list w-full h-0 grow bg-green-400 flex flex-col">
      <Key
        each={data.data}
        by={(item) => item.mid}>
        {(item) => {
          let chart!: echarts.ECharts;

          createEffect(() => {
            chart.setOption({
              xAxis: {
                type: "value",
                show: false,
                min: "dataMin",
                max: "dataMax",
              },
              yAxis: {
                type: "value",
                show: false,
                minInterval: 10,
                maxInterval: 10_000,
                min: "dataMin",
                max: "dataMax",
              },
              series: {
                type: "line",
                smooth: true,
                data: item().records.map((record) => [record.timestamp, record.value.follower]),
                showSymbol: false,
                areaStyle: {},
              },
              grid: {
                left: "5%",
                top: "5%",
                right: "5%",
                bottom: "5%",
              },

              animation: true,
            });
          });

          createEffect(() => {
            const mixed_color = mix_color(get_image_average_color(item().avatar)(), ...new Array(4).fill("#ffffff"));

            set_theme(mixed_color);

            chart.setOption({
              series: {
                areaStyle: {
                  color: get_image_average_color(item().avatar)(),
                },
              },
            });
          });

          const [theme, set_theme] = createSignal("");

          return (
            <div
              class="item w-full h-0 grow bg-yellow-400 flex flex-row pl-2 pr-2 pt-2 pb-2 items-center justify-between"
              style={{
                "background-color": theme(),
              }}>
              <div class="left gap-2 h-full w-fit flex flex-row justify-start items-center">
                <img
                  class="aspect-square rounded-full h-full"
                  src={item().avatar}></img>
                <div class="name flex flex-col">
                  <div
                    class="text-xl font-black tracking-wider"
                    style={{
                      "font-family": "'Red Hat Mono Variable', monospace",
                    }}>
                    {pinyin(item().name, {})
                      .map((word) => word[0][0])
                      .filter((word) => /[a-zA-Z]/.test(word))
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div
                    class="text-xs text-ellipsis"
                    style={{
                      "font-family": "'Noto Sans SC', sans-serif",
                    }}>
                    {item().name}
                  </div>
                </div>
              </div>

              <div class="right gap-2 h-full grow flex flex-row justify-end items-center">
                <div
                  class="font-bold text-2xl"
                  style={{
                    "font-family": "'Red Hat Mono Variable', monospace",
                    color: (item().records.at(-1)?.value.follower ?? 0) - (item().records.at(-2)?.value.follower ?? 0) >= 0 ? "red" : "green",
                  }}>
                  {item().records.at(-1)?.value.follower}
                  <sup class="font-semibold p-[0.5]">
                    {add_sign((item().records.at(-1)?.value.follower ?? 0) - (item().records.at(-2)?.value.follower ?? 0))}
                  </sup>
                </div>
                <div
                  class="chart w-auto h-full aspect-[2/1] overflow-hidden "
                  ref={(element) => {
                    chart = echarts.init(element, null, {
                      // renderer: "svg",
                    });

                    onMount(() => {
                      const { width, height } = element.getBoundingClientRect();

                      chart.resize({
                        width,
                        height,
                      });
                    });
                  }}></div>
              </div>
            </div>
          );
        }}
      </Key>
    </div>
  );
};

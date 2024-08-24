import { createEffect, createSignal } from "solid-js";
import { Key } from "@solid-primitives/keyed";
import * as echarts from "echarts";
import { FastAverageColor } from "fast-average-color";

const fac = new FastAverageColor();

import { data } from "./handlers/data";

export default () => {
  return (
    <main class="w-full h-full bg-red-400 flex flex-col">
      <div class="chart w-full h-auto aspect-[4/3] bg-blue-400"></div>
      <div class="list w-full h-0 grow bg-green-400">
        <Key
          each={data.data}
          by={(item) => item.mid}>
          {(item) => {
            const chart = echarts.init(null, null, {
              ssr: true,
              renderer: "svg",
              width: "1600",
              height: "900",
            });

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
                series: [
                  {
                    type: "line",
                    smooth: true,
                    data: item().records.map((record) => [record.timestamp, record.value.follower]),
                    showSymbol: false,
                    areaStyle: {},
                  },
                ],
                animation: true,
              });
            });

            const [theme, set_theme] = createSignal("");

            return (
              <div
                class="item w-full h-12 bg-yellow-400 flex flex-row p-2 gap-4 items-center"
                style={{
                  "background-color": theme(),
                }}>
                <img
                  class="aspect-square rounded-full h-full"
                  src={item().avatar}
                  onLoad={async (event) => {
                    const color = await fac.getColorAsync(item().avatar);

                    set_theme(color.hex);
                  }}></img>
                <div>{item().name}</div>
                <div>{item().records.at(-1)?.value.follower}</div>
                <img
                  class="chart w-auto h-full aspect-video overflow-visible"
                  src={chart.getSvgDataURL()}></img>
              </div>
            );
          }}
        </Key>
      </div>
    </main>
  );
};

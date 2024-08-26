import { onMount } from "solid-js";
import { createEffect } from "solid-js";
import * as echarts from "echarts";
import { store } from "../store";
import dayjs from "dayjs";
import { get_image_average_color } from "../utils/get_image_average_color";
import { main_theme } from "../utils/main_theme";
import { rgb2hex } from "../utils/mix_color";

export default () => {
  return (
    <div
      class="chart w-full h-full "
      ref={(element) => {
        onMount(async () => {
          const chart = echarts.init(element, "dark", {
            renderer: "svg",
          });

          createEffect(() => {
            chart.setOption(
              {
                backgroundColor: "transparent",
                xAxis: {
                  type: "value",
                  show: true,
                  min: "dataMin",
                  max: "dataMax",
                  axisLine: {
                    lineStyle: {
                      color: rgb2hex(main_theme()),
                    },
                  },
                  axisLabel: {
                    fontFamily: "'Red Hat Mono Variable', monospace",
                    fontWeight: "bold",
                    fontSize: 14,
                    formatter: (value: number) => dayjs(value).format("HH:mm"),
                  },
                  axisTick: {
                    show: true,
                    alignWithLabel: true,
                  },
                },
                yAxis: {
                  type: "value",
                  show: true,
                  // minInterval: 1_0,
                  // maxInterval: 1_000,
                  // min: "dataMin",
                  // max: "dataMax",
                  axisLine: {
                    lineStyle: {
                      color: rgb2hex(main_theme()),
                    },
                  },
                  axisLabel: {
                    fontFamily: "'Red Hat Mono Variable', monospace",
                    fontWeight: "bold",
                    fontSize: 14,
                  },
                  axisTick: {
                    show: true,
                    alignWithLabel: true,
                  },
                },

                series: store.data.videos.map(({ owner }) => ({
                  type: "line",
                  // smooth: true,
                  data: owner.relations
                    .filter((relation) => relation.timestamp > Date.now() - 60 * 60 * 1_000)
                    .map((record, index, array) => ({
                      timestamp: record.timestamp,
                      value: record.value.follower - (array[index - 1]?.value.follower ?? record.value.follower),
                    }))
                    .slice(1)
                    .map((record) => [record.timestamp, record.value]),
                  areaStyle: {
                    color: get_image_average_color(owner.avatar)(),
                  },
                  showSymbol: false,
                })),

                grid: {
                  left: "2%",
                  top: "2%",
                  right: "2%",
                  bottom: "10%",
                },

                animation: false,
                animationDurationUpdate: store.interval,
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

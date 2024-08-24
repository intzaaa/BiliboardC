import { createMemo, onMount } from "solid-js";
import { createEffect } from "solid-js";
import * as echarts from "echarts";
import { data } from "../handlers/data";
import dayjs from "dayjs";
import { get_image_average_color } from "../utils/get_image_average_color";
import { mix_color } from "../utils/mix_color";

export default () => {
  const colors = data.data.map(({ avatar }) => avatar).map(get_image_average_color);

  const background = createMemo(() => mix_color(...new Array(50).fill("#ffffff"), ...colors.map((color) => color())));

  return (
    <div
      class="chart w-full h-auto aspect-[3/2]"
      style={{ "background-color": background() }}
      ref={(element) => {
        const chart = echarts.init(element, null, {
          renderer: "svg",
        });

        onMount(async () => {
          const { width, height } = element.getBoundingClientRect();

          chart.resize({
            width,
            height,
          });

          createEffect(() => {
            const series = data.data.map((item) => ({
              type: "line",
              smooth: true,
              data: item.records
                .filter((relation) => relation.timestamp > Date.now() - 60 * 60 * 1000)
                .filter((_, i) => i % 8 === 0)
                .map((record, index, array) => ({
                  timestamp: record.timestamp,
                  value: record.value.follower - (array[index - 1]?.value.follower ?? record.value.follower),
                }))
                .slice(1)
                .map((record) => [record.timestamp, record.value]),
              areaStyle: {
                color: get_image_average_color(item.avatar)(),
              },
              showSymbol: false,
            }));

            chart.setOption({
              xAxis: {
                type: "value",
                show: true,
                min: "dataMin",
                max: "dataMax",
                axisLabel: {
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
                axisLabel: {
                  fontWeight: "bold",
                  fontSize: 14,
                },
                axisTick: {
                  show: true,
                  alignWithLabel: true,
                },
              },
              series,
              grid: {
                left: "10%",
                top: "15%",
                right: "10%",
                bottom: "15%",
              },

              animation: true,
            });
          });

          createEffect(() => {
            chart.setOption({
              series: {
                areaStyle: new Array(data.data.length).fill(0).map((_, index) => ({
                  color: get_image_average_color(data.data[index].avatar)(),
                })),
              },
            });
          });
        });
      }}></div>
  );
};

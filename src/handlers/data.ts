// "use server";

import axios from "axios";
import { createStore } from "solid-js/store";
import { Responses } from "../types";
import { FastAverageColor } from "fast-average-color";

const endpoint = import.meta.env.BILIBOARD_ENDPOINT as string;

console.log(endpoint);

const [data, set_data] = createStore<Responses["/"]>({
  info: {
    interval: NaN,
    limit: NaN,
  },
  data: [],
});

const corn = async () => {
  const json: Responses["/"] = await axios.get(endpoint).then((res) => res.data);

  set_data("info", json.info);

  set_data("data", json.data);
};

await corn();

export { data };

setInterval(corn, data.info.interval);

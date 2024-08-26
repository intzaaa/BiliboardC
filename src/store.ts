// "use server";

import axios from "axios";
import { createStore } from "solid-js/store";
import { Responses } from "./types";
import { FastAverageColor } from "fast-average-color";

const endpoint = import.meta.env.BILIBOARD_ENDPOINT as string;

console.log(endpoint);

const [store, set_store] = createStore<Responses["/"]>({
  interval: NaN,
  data: {
    words: [],
    videos: [],
  },
});

const corn = async () => {
  const json: Responses["/"] = await axios.get(endpoint).then((res) => res.data);

  set_store(json);
};

await corn();

export { store };

setInterval(corn, store.interval);

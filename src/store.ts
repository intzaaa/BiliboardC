// "use server";

import axios from "axios";
import { createStore } from "solid-js/store";
import { Responses } from "./types";
import { FastAverageColor } from "fast-average-color";

const endpoint = import.meta.env.BILIBOARD_ENDPOINT as string;

console.log(endpoint);

const [store, set_store] = createStore<Responses["/"]>({
  interval: 30000,
  data: {
    words: [],
    videos: [],
  },
});

const corn = async () => {
  try {
    const json: Responses["/"] = await axios.get(endpoint).then((res) => res.data);

    set_store(json);
  } catch (error) {}
};

await corn();

export { store };

setInterval(corn, store.interval);

import { onMount } from "solid-js";
import Overview from "./components/Overview";
import List from "./components/List";
import WordMap from "./components/WordMap";

export default () => {
  let main!: HTMLElement;

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      main.style.transform = "scale(" + Math.min(document.body.clientWidth / main.clientWidth, document.body.clientHeight / main.clientHeight) + ")";
      main.style.transformOrigin = "top left";
    });

    resizeObserver.observe(window.document.body);
  });
  return (
    <main
      id="main"
      class="bg-black flex flex-col pl-8 pr-8 pt-4 pb-4"
      style={{
        width: "2000px",
        height: "1000px",
      }}
      ref={main}>
      <div class="flex flex-row w-full h-full pl-4 pr-4 pt-2 pb-2 gap-8">
        <div class="basis-3/4 flex flex-col h-full gap-4">
          <div class="w-full h-auto aspect-[5/1] ">
            <Overview />
          </div>
          <div class="w-full h-0 grow pl-2 pr-2 pt-1 pb-1">
            <WordMap></WordMap>
          </div>
        </div>
        <div class="w-o h-full outline outline-red-900"></div>
        <div class="list basis-1/4 w-full h-full grow flex flex-col ">
          <List />
        </div>
      </div>
    </main>
  );
};

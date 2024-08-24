import { onMount } from "solid-js";
import BigChart from "./components/BigChart";
import PopularList from "./components/PopularList";

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
      class=" bg-red-400 flex flex-col"
      style={{
        width: "390px",
        height: "844px",
      }}
      ref={main}>
      <BigChart />
      <PopularList />
    </main>
  );
};

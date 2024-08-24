import BigChart from "./components/BigChart";
import PopularList from "./components/PopularList";

export default () => {
  return (
    <main class="w-full h-full bg-red-400 flex flex-col">
      <BigChart />
      <PopularList />
    </main>
  );
};

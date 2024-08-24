/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import "./index.css";
// Supports weights 300-700
import "@fontsource-variable/red-hat-mono";
// Supports weights 100-900
import "@fontsource-variable/noto-sans-sc";

import Home from "./Home";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error("Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?");
}

render(() => <Home />, root!);

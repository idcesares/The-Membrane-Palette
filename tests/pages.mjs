// Keep every shipped example inside the same browser quality gates.
import { readdirSync } from "node:fs";

export const PAGES = [
  "/",
  ...readdirSync(new URL("../examples/", import.meta.url))
    .filter((file) => file.endsWith(".html"))
    .sort()
    .map((file) => `/examples/${file}`),
  "/404.html",
];

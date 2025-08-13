import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // so you can use test(), expect(), etc. without imports
    environment: "node", // needed to use net, sockets, etc.
    coverage: {
      reporter: ["text", "html"], // optional: see coverage in terminal & browser
    },
  },
});

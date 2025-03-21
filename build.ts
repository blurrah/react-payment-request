import "./src/apple-pay.tsx"; // To enable watch mode

import isolatedDecl from "bun-plugin-isolated-decl";

await Bun.build({
  entrypoints: ["src/apple-pay.tsx"],
  banner: "'use client';",
  outdir: "dist",
  format: "esm",
  plugins: [
    isolatedDecl({
      forceGenerate: true,
    }),
  ],
  sourcemap: "external",
});

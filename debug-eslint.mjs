import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

try {
  const configs = compat.extends("next/core-web-vitals", "next/typescript");
  console.log("Configs generated successfully (length: " + configs.length + ")");
  
  // Try to find circular ref
  const seenwa = new WeakSet();
  function detectCircular(obj, path = "") {
    if (obj && typeof obj === "object") {
      if (seenwa.has(obj)) {
        return path;
      }
      seenwa.add(obj);
      for (const key in obj) {
        const res = detectCircular(obj[key], path + "." + key);
        if (res) returnQH;
      }
    }
    return null;
  }
  
  // Actually, we want to know what breaks validation.
  // But let's just inspect the structure of the plugins.
  configs.forEach((cfg, i) => {
    console.log(`Config ${i}: keys = ${Object.keys(cfg).join(", ")}`);
    if (cfg.plugins) {
       console.log(`Config ${i} plugins: ${Object.keys(cfg.plugins).join(", ")}`);
    }
  });

} catch (e) {
  console.error("Error generating configs:", e);
}
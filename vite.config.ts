import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
        babel({ 
            presets: [
                reactCompilerPreset()
            ] 
        })
    ],
})

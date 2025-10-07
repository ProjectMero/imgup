# imgup-ts Project Documentation

## Overview
This project is an Electron application that allows users to upload images and upscale them. It consists of a main process, a preload script for secure communication, and a renderer process that handles the user interface and file uploads.

## Project Structure
```
imgup-ts
├── src
│   ├── main.ts          # Entry point for the application, sets up the Electron main process and creates the window.
│   ├── preload.ts       # Preload script providing secure communication between the renderer and main processes.
│   ├── renderer.ts      # Contains logic for the renderer process, including UI manipulation and file upload functionality.
│   └── data
│       └── setting
│           └── index.html # HTML for the settings interface where users can change settings.
├── package.json         # npm configuration file listing dependencies and scripts.
├── tsconfig.json        # TypeScript configuration file specifying compiler options and files to compile.
└── README.md            # Documentation for the project.
```

## TypeScript Conversion Steps
1. Convert each JavaScript file to TypeScript by changing the file extension from `.js` to `.ts`.
2. Add TypeScript types where necessary. Install type definition files as needed.

## Compilation Instructions
1. Create a `tsconfig.json` file with the following content:
   {
     "compilerOptions": {
       "target": "es6",
       "module": "commonjs",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "outDir": "./dist"
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules"]
   }

2. Add the following script to `package.json`:
   "scripts": {
     "build": "tsc"
   }

3. Run the following command in the command line to compile TypeScript:
   npm run build

This will compile the TypeScript files in the `src` folder and generate JavaScript files in the `dist` folder.
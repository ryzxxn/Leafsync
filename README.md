# LeafSync

LeafSync is a project that provides a synchronization solution. This README file will guide you through the project structure and provide instructions on how to install and run the project.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Build .exe](#build)

## Installation

To install the project's dependencies, run the following command in the project's root directory:

```bash
npm install
```

## Usage

Start the api server:

```bash
node server.js
```

Start React server:

```bash
npm run dev
```
![image](https://i.ibb.co/R43nvCH/blob.png)

## Build

Place Build folder in root directory

example:
-dist
 -|index.html
 -|assets

Go to main.js:
```bash
mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
```
Change name to build folder("dist" in this example)

Build Command:
```bash
electron-packager . --out=build --exec=my-app --overwrite
```
main.js contains config to build the app
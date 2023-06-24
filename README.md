[![TypeScript](https://img.shields.io/badge/TypeScript-4.3.5-blue.svg)](https://www.typescriptlang.org/)[![Windows](https://img.shields.io/badge/OS-Windows-informational.svg)](https://www.microsoft.com/windows)[![Visual Studio Code](https://img.shields.io/badge/IDE-Visual%20Studio%20Code-blueviolet.svg)](https://code.visualstudio.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
```
██╗  ██╗████████╗███╗   ███╗██╗         ██╗           ██╗███████╗ ██████╗ ███╗   ██╗
██║  ██║╚══██╔══╝████╗ ████║██║         ╚██╗          ██║██╔════╝██╔═══██╗████╗  ██║
███████║   ██║   ██╔████╔██║██║          ╚██╗         ██║███████╗██║   ██║██╔██╗ ██║
██╔══██║   ██║   ██║╚██╔╝██║██║          ██╔╝    ██   ██║╚════██║██║   ██║██║╚██╗██║
██║  ██║   ██║   ██║ ╚═╝ ██║███████╗    ██╔╝     ╚█████╔╝███████║╚██████╔╝██║ ╚████║
╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚═╝╚══════╝    ╚═╝       ╚════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝
                                                                                    
```
[![JSDOM](https://img.shields.io/badge/JSDOM-16.7.0-blue.svg)](https://github.com/jsdom/jsdom)
[![Visual Studio Code Extension](https://img.shields.io/badge/VSCode%20Extension-1.0.0-blue.svg)](https://code.visualstudio.com/api)


# HTML Text to JSON Transmutation Extension for Visual Studio Code

This Visual Studio Code extension extracts all text nodes from an HTML file open in the editor and replaces each of them with a span element that contains a unique id. The texts are stored in a JSON file and can be replaced back into the HTML file using a JavaScript function.

## Usage

1. Install the extension in Visual Studio Code.

2. Open an HTML file in the editor.

3. Run the `toffeeshade.transmutation` command from the command palette (press `F1` and type `toffeeshade.transmutation`).

The extension will perform the following actions:

- It will parse the HTML file using JSDOM.
- It will go through all the text nodes in the file and replace each one with a span element that contains a unique id. The text is saved in a JSON file.
- It will create a JavaScript file with a function that can replace the texts back into the HTML file.

The JSON file and the JavaScript file are saved in the root of your workspace.

## Explanation

- The extension starts by parsing the HTML file using JSDOM.
- It then goes through all the text nodes in the file. For each text node, it creates a new span element and gives it a unique id. It then replaces the text node with the new span element.
- The original text from the text node is stored in a JSON file, using the id as the key.
- After all text nodes have been processed, the extension writes the JSON file to the root of your workspace. The JSON file is named `textes.json`.
- The extension also creates a JavaScript file with a function that can replace the texts back into the HTML file. This function is written to a file named `filltext.js`.
- The modified HTML content is then written back into the original file.

Note: Make sure to install the required dependencies and adjust the port number according to your needs.

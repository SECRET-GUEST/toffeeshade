/* eslint-disable */
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const node_html_parser_1 = require("node-html-parser");
function activate(context) {
    let disposable = vscode.commands.registerCommand('toffeeshade.transmutation', () => {
        var _a;
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No file open in the editor');
            return;
        }
        try {
            const doc = editor.document;
            const html = doc.getText();
            const root = (0, node_html_parser_1.parse)(html);
            const texts = {};
            const textTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'li', 'button', 'span', 'div'];
            let idCounter = 1;
            textTags.forEach(tag => {
                root.querySelectorAll(tag).forEach(element => {
                    const id = `text${idCounter++}`;
                    element.setAttribute('id', id);
                    element.setAttribute('class', 'translatext');
                    texts[id] = element.text;
                });
            });
            const workspaceFolderPath = (_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0].uri.fsPath;
            if (!workspaceFolderPath) {
                vscode.window.showErrorMessage('No folder open in workspace');
                return;
            }
            fs.writeFile(path.join(workspaceFolderPath, 'textes.json'), JSON.stringify(texts, null, 4), (err) => {
                if (err) {
                    vscode.window.showErrorMessage(`Error writing the textes.json file: ${err.message}`);
                    return;
                }
                const newHtml = root.toString();
                const edit = new vscode.WorkspaceEdit();
                edit.replace(doc.uri, new vscode.Range(doc.positionAt(0), doc.positionAt(html.length)), newHtml);
                vscode.workspace.applyEdit(edit).then(success => {
                    if (!success) {
                        vscode.window.showErrorMessage('Error modifying the HTML file');
                    }
                    else {
                        vscode.window.showInformationMessage('Extraction and modification completed');
                    }
                });
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Unexpected error: ${error ? error.message : 'No additional information available'}`);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
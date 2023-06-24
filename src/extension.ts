import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('toffeeshade.transmutation', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No file open in the editor');
            return;
        }

        try {
            const doc = editor.document;
            const html = doc.getText();
            const dom = new JSDOM(html);
            const { window: { document } } = dom;
            const { window: { Node } } = dom;

            const texts: { [id: string]: string } = {};
            const textTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'li', 'button', 'span', 'div'];
            let idCounter = 1;

            function processNode(node: Node) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== '') {
                    const id = `text${idCounter++}`;
                    texts[id] = node.textContent!.replace(/^\s+|\s+$/g, '').replace(/\s*\n\s*/g, ' ');
                    const span = document.createElement('span');
                    span.setAttribute('id', id);
                    span.setAttribute('class', 'textPlace');
                    node.parentNode?.replaceChild(span, node);
                } else {
                    const children = node.childNodes;
                    children.forEach(processNode);
                }
            }
            
            textTags.forEach(tag => {
                const elements = document.querySelectorAll(tag);
                elements.forEach(processNode);
            });

            const workspaceFolderPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

            if (!workspaceFolderPath) {
                vscode.window.showErrorMessage('No folder open in workspace');
                return;
            }

            fs.writeFile(path.join(workspaceFolderPath, 'textes.json'), JSON.stringify(texts, null, 4), (err) => {
                if (err) {
                    vscode.window.showErrorMessage(`Error writing the textes.json file: ${err.message}`);
                    return;
                }

                // Écriture du script JS dans un fichier
                const scriptContent = `
/*
use this function to replace the text where it should be (translatedTexts is your json file in this example)
fillTexts(translatedTexts);
*/
function fillTexts(texts) {
    Object.keys(texts).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = texts[id];
        }
    });
}
`;

                fs.writeFile(path.join(workspaceFolderPath, 'filltext.js'), scriptContent, (err) => {
                    if (err) {
                        vscode.window.showErrorMessage(`Error writing the filltext.js file: ${err.message}`);
                        return;
                    }
                });

                const newHtml = dom.serialize();
                const edit = new vscode.WorkspaceEdit();
                edit.replace(doc.uri, new vscode.Range(doc.positionAt(0), doc.positionAt(html.length)), newHtml);

                vscode.workspace.applyEdit(edit).then(success => {
                    if (!success) {
                        vscode.window.showErrorMessage('Error modifying the HTML file');
                    } else {
                        vscode.window.showInformationMessage('Extraction and modification completed');
                    }
                });
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Unexpected error: ${error ? (error as Error).message : 'No additional information available'}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { parse, HTMLElement } from 'node-html-parser';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('toffeeshade.replace', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No file open in the editor');
            return;
        }
        
        try {
            const doc = editor.document;
            const html = doc.getText();
            const root = parse(html);
            const texts: { [id: string]: string } = {};
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
                
                const newHtml = root.toString();
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

'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import DiagramDocumentContentProvider from './diagram-provider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // let previewUri = vscode.Uri.parse('fsm://fsm/diagram-preview');
    let previewUri = vscode.window.activeTextEditor.document.uri;

    let provider = new DiagramDocumentContentProvider(context);
    let registration = vscode.workspace.registerTextDocumentContentProvider('fsm', provider);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('fsm.view', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        // vscode.window.showInformationMessage('Hello World!');
        return vscode.commands.executeCommand('vscode.previewHtml', getFsmDiagramUri(previewUri), getViewColumn(), 'Preview Diagram');
    });

    context.subscriptions.push(disposable, registration);

    vscode.workspace.onDidChangeTextDocument(event => {
        const uri = getFsmDiagramUri(event.document.uri);

        provider.update(uri);
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function getViewColumn(): vscode.ViewColumn {
    const active = vscode.window.activeTextEditor;

    switch (active.viewColumn) {
        case vscode.ViewColumn.One:
            return vscode.ViewColumn.Two;
        case vscode.ViewColumn.Two:
            return vscode.ViewColumn.Three;
    }

    return active.viewColumn;
}

function getFsmDiagramUri(uri: vscode.Uri) {
    return uri.with({ scheme: 'fsm', path: uri.path + '.rendered', query: uri.toString() });
}

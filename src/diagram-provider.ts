import * as vscode from 'vscode';
const graph = require('fsm2dot');

export default class DiagramDocumentContentProvider implements vscode.TextDocumentContentProvider {
  private _context: vscode.ExtensionContext;
  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
  }

  public provideTextDocumentContent(uri: vscode.Uri): Thenable<string> {
    return vscode.workspace.openTextDocument(vscode.Uri.parse(uri.query)).then(document => {
      try {
        graph(document.getText(), 'fancy');
      } catch (error) {
        console.log('no fsm found in file');
      }
      return document.getText();
    });
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this._onDidChange.event;
  }

  public update(uri: vscode.Uri) {
    this._onDidChange.fire(uri);
  }
}

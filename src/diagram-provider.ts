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
      const source = document.getText();
      try {
        const diagram = graph(source, 'mermaid');

        return this.generateHtml(diagram);
      } catch (error) {
        return 'no fsm found in file';
      }
    });
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this._onDidChange.event;
  }

  public update(uri: vscode.Uri) {
    this._onDidChange.fire(uri);
  }

  private generateHtml(diagram: string): string {
    const config = JSON.stringify(vscode.workspace.getConfiguration('mermaid'));

    return `<!DOCTYPE html>
    <html>
    <head>
        <base href="">
        <script src="${this._context.extensionPath}/node_modules/mermaid/dist/mermaid.min.js"></script>
        <style>
        th {
          border-bottom: 2px solid black;
        }

        tr:only-child th {
          border-bottom: 0;
        }
        </style>
    </head>
    <body>
        <script type="text/javascript">
            css = document.createElement('link');
            style = document.body.classList.contains('vscode-dark') ? 'dark' : 'forest';
            
            css.setAttribute('rel', 'stylesheet');
            // css.setAttribute('type', 'text/css');
            css.setAttribute('href', '${this._context.extensionPath}/node_modules/mermaid/dist/mermaid.' + style + '.css');

            document.body.appendChild(css);
        </script>

        <div class="mermaid">
        ${diagram}
        </div>

        <script type="text/javascript">
            mermaidAPI.initialize(JSON.parse('${config}'));
        </script>
    </body>`;
  }
}

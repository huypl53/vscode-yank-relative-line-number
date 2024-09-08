// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let copyPathLines = function (withLineNumber = false) {
    let alertMessage = "File path not found!";
    if (!vscode.workspace.workspaceFolders) {
      vscode.window.showWarningMessage(alertMessage);
      return false;
    }

    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage(alertMessage);
      return false;
    }

    let doc = editor.document;
    if (doc.isUntitled) {
      vscode.window.showWarningMessage(alertMessage);
      return false;
    }

    let path = vscode.workspace.asRelativePath(doc.fileName);
    let lineNumbers: string[] = [];

    if (withLineNumber) {
      editor.selections.forEach((selection) => {
        let lineNumber = "";
        if (selection.isSingleLine) {
          lineNumber = (selection.active.line + 1).toString();
        } else {
          lineNumber =
            selection.start.line + 1 + "~" + (selection.end.line + 1);
        }
        lineNumbers.push(lineNumber);
      });

      return path + "#L" + lineNumbers.join("L");
    } else {
      return path;
    }
  };

  let toast = function (message: string) {
    vscode.window.setStatusBarMessage(
      "`" + message + "` is copied to clipboard",
      3000
    );
  };

  const copyPathWithLineNumber = () => {
    let message = copyPathLines(true);
    if (message !== false) {
      vscode.env.clipboard.writeText(message).then(() => {
        toast(message);
      });
    }
  };
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let cmdBoth = vscode.commands.registerCommand(
    "yank-relative-path-and-line-numbers.both",
    copyPathWithLineNumber
  );

  const copyPathOnly = () => {
    let message = copyPathLines();
    if (message !== false) {
      vscode.env.clipboard.writeText(message).then(() => {
        toast(message);
      });
    }
  };

  let cmdPathOnly = vscode.commands.registerCommand(
    "yank-relative-path-and-line-numbers.path-only",
    copyPathOnly
  );

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "yank-relative-line-number" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "yank-relative-line-number.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from yank-relative-line-number!"
      );
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

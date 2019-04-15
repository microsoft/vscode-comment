import * as vscode from "vscode";
import { generateCommentsFromText } from "@nodefactory/solidity-comments-core";

export function activate(ctx: vscode.ExtensionContext) {
  vscode.commands.registerCommand("extension.addSolidityComments", () => {
    var lang = vscode.window.activeTextEditor.document.languageId;
    if (lang == "solidity") {
      const document = vscode.window.activeTextEditor.document;
      var selection = vscode.window.activeTextEditor.selection;
      selection = selection.isEmpty
        ? new vscode.Selection(
            document.positionAt(0),
            document.positionAt(document.getText().length)
          )
        : selection;
      var selectedText = vscode.window.activeTextEditor.document.getText(
        selection
      );
      var outputMessage: string = "Empty text";

      if (selectedText.length === 0) {
        vscode.window.showInformationMessage(outputMessage);
        return;
      }

      const withComments = generateCommentsFromText(selectedText);

      if (withComments.length > 0) {
        vscode.window.activeTextEditor
          .edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.replace(selection, withComments);
          })
          .then(() => {});
      }
    }
  });
}

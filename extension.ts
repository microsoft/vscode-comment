import * as vscode from 'vscode';

import * as functionParser from './functionParser';

export function activate(ctx:vscode.ExtensionContext) {


	console.log('Congratulations, your extension "addDocComments" is now active!');



	vscode.commands.registerCommand('extension.addDocComments', () => {

		var lang = vscode.window.activeTextEditor.document.languageId;
		if ((lang == "typescript") || (lang == 'javascript')) {
			var selection = vscode.window.activeTextEditor.selection;
			var startLine = selection.start.line - 1;
			var selectedText = vscode.window.activeTextEditor.document.getText(selection);
			var firstBraceIndex = selectedText.indexOf('(');
			selectedText = selectedText.slice(firstBraceIndex);

			selectedText = functionParser.stripComments(selectedText);

			var returnText = functionParser.getReturns(selectedText);

			var params: functionParser.paramDeclaration[] = functionParser.getParameters(selectedText);

			if (params.length > 0) {
				var textToInsert = functionParser.getParameterText(params, returnText);
				vscode.window.activeTextEditor.edit((editBuilder: vscode.TextEditorEdit) => {
					if (startLine < 0) {
						//If the function declaration is on the first line in the editor we need to set startLine to first line
						//and then add an extra newline at the end of the text to insert
						startLine = 0;
						textToInsert = textToInsert + '\n';
					}
					//Check if there is any text on startLine. If there is, add a new line at the end
					var lastCharIndex = vscode.window.activeTextEditor.document.lineAt(startLine).text.length;
					var pos:vscode.Position;
					if ((lastCharIndex > 0) && (startLine !=0)) {
						pos = new vscode.Position(startLine, lastCharIndex);
						textToInsert = '\n' + textToInsert; 	
					}
					else {
						pos = new vscode.Position(startLine, 0);
					}

					editBuilder.insert(pos, textToInsert);
				}).then(() => {
					//vscode.window.activeTextEditor.s.selection = new vscode.Position(startLine, 1);
				});
			}
		}
	});
}



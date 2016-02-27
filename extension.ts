import * as vscode from 'vscode';

var indentString = require('indent-string');

import * as functionParser from './functionParser';

export function activate(ctx:vscode.ExtensionContext) {

	vscode.commands.registerCommand('extension.addDocComments', () => {

		var lang = vscode.window.activeTextEditor.document.languageId;
		if ((lang == "typescript") || (lang == 'javascript')) {
			var selection = vscode.window.activeTextEditor.selection;
			var startLine = selection.start.line - 1;
			var selectedText = vscode.window.activeTextEditor.document.getText(selection);
			var outputMessage: string = 'Please select a TypeScript or JavaScript function signature'
			
			if (selectedText.length === 0) {
				vscode.window.showInformationMessage(outputMessage);
				return;
			}
			
			if (functionParser.stripComments(selectedText).length === 0) {
				vscode.window.showInformationMessage(outputMessage);
				return;
			}
			
			//some random text
			
			// var containsFunctionSig:boolean = /\s*function\s*\w*\s*\(/.test(functionParser.stripComments(selectedText));
			// if (!containsFunctionSig) {
			// 	vscode.window.showInformationMessage(outputMessage);
			// 	return;
			// }
			
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
					var line:string = vscode.window.activeTextEditor.document.lineAt(selection.start.line).text;
					var firstNonWhiteSpace :number = vscode.window.activeTextEditor.document.lineAt(selection.start.line).firstNonWhitespaceCharacterIndex;
					var numIndent : number = 0;
					var tabSize : number = vscode.window.activeTextEditor.options.tabSize;
					var stringToIndent: string = '';
					for (var i = 0; i < firstNonWhiteSpace; i++) {
						if (line.charAt(i) == '\t') {
							stringToIndent = stringToIndent + '\t';
						}
						else if (line.charAt(i) == ' ') {
							stringToIndent = stringToIndent + ' ';
						}
					}					
					textToInsert = indentString(textToInsert, stringToIndent, 1);
					editBuilder.insert(pos, textToInsert);
				}).then(() => {
					
				});
			}
		}
	});
}



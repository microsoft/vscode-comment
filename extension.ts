import * as vscode from 'vscode';

import * as functionParser from './functionParser';

export function activate() {


	console.log('Congratulations, your extension "addDocComments" is now active!');
	
	

	vscode.commands.registerCommand('extension.addDocComments', () => {
<<<<<<< HEAD

		var selection = vscode.window.getActiveTextEditor().getSelection();
		var selectedText = vscode.window.getActiveTextEditor().getTextDocument().getTextInRange(selection);
		var firstBraceIndex = selectedText.indexOf('(');
		selectedText = selectedText.slice(firstBraceIndex);

		selectedText = functionParser.stripComments(selectedText);
		
		var returnText = functionParser.getReturns(selectedText);
		
		var params: functionParser.paramDeclaration[] = functionParser.getParameters(selectedText);

		if (params.length > 0) {
			var textToInsert = functionParser.getParameterText(params, returnText);
			vscode.window.getActiveTextEditor().edit((editBuilder: vscode.TextEditorEdit) => {
				var startLine = selection.start.line - 1;
				var pos = new vscode.Position(startLine, 0);
				editBuilder.insert(pos, textToInsert);
			}).then(()=>{
				vscode.window.getActiveTextEditor().setSelection(selection.start);				
			});


=======
		var lang = vscode.window.getActiveTextEditor().getTextDocument().getLanguageId();
		if ((lang == "typescript") || (lang == 'javascript')) {
			var selection = vscode.window.getActiveTextEditor().getSelection();
			var selectedText = vscode.window.getActiveTextEditor().getTextDocument().getTextInRange(selection);
			var firstBraceIndex = selectedText.indexOf('(');
			selectedText = selectedText.slice(firstBraceIndex);

			selectedText = functionParser.stripComments(selectedText);

			var returnText = functionParser.getReturns(selectedText);

			var params: functionParser.paramDeclaration[] = functionParser.getParameters(selectedText);

			if (params.length > 0) {
				var textToInsert = functionParser.getParameterText(params, returnText);
				vscode.window.getActiveTextEditor().edit((editBuilder: vscode.TextEditorEdit) => {
					var startLine = selection.start.line - 1;
					var pos = new vscode.Position(startLine, 0);
					editBuilder.insert(pos, textToInsert);
				});
				vscode.window.getActiveTextEditor().setSelection(selection.start);
			}
>>>>>>> 9071baf2b9c04e177d3d7a187e2a3e54fd2950a0
		}
	});
}



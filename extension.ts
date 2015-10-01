
import * as vscode from 'vscode'; 

export function activate() { 


	console.log('Congratulations, your extension "addDocComments" is now active!'); 

	vscode.commands.registerCommand('extension.addDocComments', () => {

		var selection = vscode.window.getActiveTextEditor().getSelection();
		var selectedText = vscode.window.getActiveTextEditor().getTextDocument().getTextInRange(selection);
		
		//This regex gives us the string containing the parameters. If there is more than one they will be
		//separated by a comma
		var selectedText = selectedText.match(/function[^(]*\(([^)]*)\)/)[1];
		var paramList = selectedText.split(',');
		if (paramList.length > 0) {		
			var textToInsert = getParameters(selection, paramList);
			
			vscode.window.getActiveTextEditor().edit((editBuilder: vscode.TextEditorEdit) => {
				var startLine = selection.start.line - 1;
				var pos = new vscode.Position(startLine, 0);
				editBuilder.insert(pos, textToInsert);
			});
		}

	});
	
	
	function getParameters(selection: vscode.Selection, paramList: string[]): string {
		var textToInsert: string = "";
		textToInsert = textToInsert + '/**\n    *';
				
		paramList.forEach(element => {
			if (element != '') {
				var s = element.trim();
				var paramName = (s.split(':').shift());
				var paramType = (s.split(':').pop());
				textToInsert = textToInsert + '@param  ' + paramName + '\n' + '    *';
			}
		});
		textToInsert = textToInsert + '/';
		return textToInsert;
	}
}

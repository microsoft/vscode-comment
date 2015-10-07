import * as vscode from 'vscode';

export function activate() {


	console.log('Congratulations, your extension "addDocComments" is now active!');

	vscode.commands.registerCommand('extension.addDocComments', () => {

		var selection = vscode.window.getActiveTextEditor().getSelection();
		var selectedText = vscode.window.getActiveTextEditor().getTextDocument().getTextInRange(selection);
		var firstBraceIndex = selectedText.indexOf('(');
		selectedText = selectedText.slice(firstBraceIndex); 
		var params: paramDeclaration[] = parseParameters2(selectedText);
		
		if (params.length > 0) {
			var textToInsert = getParameterText(params);

			vscode.window.getActiveTextEditor().edit((editBuilder: vscode.TextEditorEdit) => {
				var startLine = selection.start.line - 1;
				var pos = new vscode.Position(startLine, 0);
				editBuilder.insert(pos, textToInsert);
			});
		}
	});

	function getParameterText(paramList: paramDeclaration[]): string {
		var textToInsert: string = "";
		textToInsert = textToInsert + '/**\n *';
		paramList.forEach(element => {
			if (element.paramName != '') {
				textToInsert = textToInsert + ' @param  ';
				if (element.paramType != '') {
					textToInsert = textToInsert + '{' + element.paramType.trim() + '}' + ' ';
				}
				textToInsert = textToInsert + element.paramName + '\n' + ' *';
			}
		});
		textToInsert = textToInsert + '/';
		return textToInsert;
	}

	
	//Assumes that the string passed in starts with ( and continues to )
	function parseParameters2(text: string): paramDeclaration[] {
		var paramList: paramDeclaration[] = [];
		//Start by looking for the function name declaration
		var index = 0;
		text = text.replace(/\s/g, '');
		//Now we are at the first non whitespace character
		//if it is not a '(' then this is not a valid function declaration
		if (text.charAt(index) == '(') {
			//count the number of matching opening and closing braces. Keep parsing until 0
			var numBraces = 1;
			index++;
			while ((numBraces != 0) && (index != text.length)) {
					
				//Now we are at a non whitespace character. Assume it is the parameter name
				var name: string = '';
				while ((text.charAt(index) != ':') && (text.charAt(index) != ',') && (text.charAt(index) != ')')) {
					name = name + text.charAt(index);
					index++;
				}		
				//Now we are at a : or a ',', skip then read until a , to get the param type
				var type: string = '';
				if (text.charAt(index) == ':') {
					index++;
					//we have a type to process
					if (text.charAt(index) == '(') {
						var startNumBraces = numBraces;
						numBraces++;
						type = type + text.charAt(index);
						index++;
						//we have encountered a function type
						//read all the way through until the numBraces = startNumBraces
						while ((numBraces != startNumBraces) && (index != text.length)) {
							if (text.charAt(index) == ')') {
								numBraces--;
							}
							else if (text.charAt(index) == '(') {
								numBraces++;
							}
							type = type + text.charAt(index);
							index++;
						}
						//Now read up to either a , or a )
						while ((text.charAt(index) != ',') && (text.charAt(index) != ')')) {
							type = type + text.charAt(index);
							index++;
						}
					}
					else {
						while ((text.charAt(index) != ',') && (text.charAt(index) != ')') && (index != text.length)) {
							type = type + text.charAt(index);
							index++;
						}
					}
				}
				else {
					//no type is specified
					type = 'any';
				}
				paramList.push(new paramDeclaration(name, type));
				if (index < text.length) {
					index++;
				}
			}

		}

		return paramList;
	}
}


class paramDeclaration {

	constructor(public paramName, public paramType) {
		this.paramName = paramName;
		this.paramType = paramType;
	}
}

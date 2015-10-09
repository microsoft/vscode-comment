import * as vscode from 'vscode';


function getParameterText(paramList: paramDeclaration[]): string {
	var textToInsert: string = "";
	textToInsert = textToInsert + '/**\n *';
	paramList.forEach(element => {
		if (element.paramName != '') {
			textToInsert = textToInsert + ' @param  ';
			if (element.paramType != '') {
				textToInsert = textToInsert + '{' + element.paramType + '}' + ' ';
			}
			textToInsert = textToInsert + element.paramName + '\n' + ' *';
		}
	});
	textToInsert = textToInsert + '/';
	return textToInsert;
}

function stripComments(text: string): string {
	var uncommentedText: string = '';
	var index = 0;
	while (index != text.length) {
		if ((text.charAt(index) == '/') && (text.charAt(index + 1) == '*')) {
			//parse comment
			index = index + 2;
			while ((text.charAt(index) != '*') && (text.charAt(index + 1) != '/')) {
				index++;
			}
			index = index + 2;
		}
		else if ((text.charAt(index) == '/') && (text.charAt(index + 1) == '/')) {
			//read to end of line
			while (text.charAt(index) != '\n') {
				index++;
			}
		}
		else {
			uncommentedText = uncommentedText + text.charAt(index);
			index++;
		}
	}
	return uncommentedText;
}

	
//Assumes that the string passed in starts with ( and continues to ) and does not contain any comments or white space
function getParameters(text: string): paramDeclaration[] {
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

export function activate() {


	console.log('Congratulations, your extension "addDocComments" is now active!');

	vscode.commands.registerCommand('extension.addDocComments', () => {

		var selection = vscode.window.getActiveTextEditor().getSelection();
		var selectedText = vscode.window.getActiveTextEditor().getTextDocument().getTextInRange(selection);
		var firstBraceIndex = selectedText.indexOf('(');
		selectedText = selectedText.slice(firstBraceIndex);

		selectedText = stripComments(selectedText);

		var params: paramDeclaration[] = getParameters(selectedText);

		if (params.length > 0) {
			var textToInsert = getParameterText(params);

			vscode.window.getActiveTextEditor().edit((editBuilder: vscode.TextEditorEdit) => {
				var startLine = selection.start.line - 1;
				var pos = new vscode.Position(startLine, 0);
				editBuilder.insert(pos, textToInsert);
			});
			vscode.window.getActiveTextEditor().setSelection(selection.start);
		}
	});

	// function getParameterText(paramList: paramDeclaration[]): string {
	// 	var textToInsert: string = "";
	// 	textToInsert = textToInsert + '/**\n *';
	// 	paramList.forEach(element => {
	// 		if (element.paramName != '') {
	// 			textToInsert = textToInsert + ' @param  ';
	// 			if (element.paramType != '') {
	// 				textToInsert = textToInsert + '{' + element.paramType + '}' + ' ';
	// 			}
	// 			textToInsert = textToInsert + element.paramName + '\n' + ' *';
	// 		}
	// 	});
	// 	textToInsert = textToInsert + '/';
	// 	return textToInsert;
	// }
	
	// function stripComments(text: string) : string {
	// 	var uncommentedText: string = '';
	// 	var index = 0;
	// 	while (index != text.length) {
	// 		if ((text.charAt(index) == '/') && (text.charAt(index + 1) == '*')) {
	// 			//parse comment
	// 			index = index + 2;
	// 			while ((text.charAt(index) != '*') && (text.charAt(index + 1) != '/')) {
	// 				index++;
	// 			}
	// 			index = index + 2;
	// 		}
	// 		else if ((text.charAt(index) == '/') && (text.charAt(index + 1) == '/')) {
	// 			//read to end of line
	// 			while (text.charAt(index) != '\n') {
	// 				index++;
	// 			}
	// 		}
	// 		else {
	// 			uncommentedText = uncommentedText + text.charAt(index);
	// 			index++;
	// 		}
	// 	}
	// 	return uncommentedText;
	// }

	
	// //Assumes that the string passed in starts with ( and continues to ) and does not contain any comments or white space
	// function getParameters(text: string): paramDeclaration[] {
	// 	var paramList: paramDeclaration[] = [];
	// 	//Start by looking for the function name declaration
	// 	var index = 0;
	// 	text = text.replace(/\s/g, '');
	// 	//Now we are at the first non whitespace character
	// 	//if it is not a '(' then this is not a valid function declaration
	// 	if (text.charAt(index) == '(') {
	// 		//count the number of matching opening and closing braces. Keep parsing until 0
	// 		var numBraces = 1;
	// 		index++;
	// 		while ((numBraces != 0) && (index != text.length)) {
					
	// 			//Now we are at a non whitespace character. Assume it is the parameter name
	// 			var name: string = '';
	// 			while ((text.charAt(index) != ':') && (text.charAt(index) != ',') && (text.charAt(index) != ')')) {
	// 				name = name + text.charAt(index);
	// 				index++;
	// 			}		
	// 			//Now we are at a : or a ',', skip then read until a , to get the param type
	// 			var type: string = '';
	// 			if (text.charAt(index) == ':') {
	// 				index++;
	// 				//we have a type to process
	// 				if (text.charAt(index) == '(') {
	// 					var startNumBraces = numBraces;
	// 					numBraces++;
	// 					type = type + text.charAt(index);
	// 					index++;
	// 					//we have encountered a function type
	// 					//read all the way through until the numBraces = startNumBraces
	// 					while ((numBraces != startNumBraces) && (index != text.length)) {
	// 						if (text.charAt(index) == ')') {
	// 							numBraces--;
	// 						}
	// 						else if (text.charAt(index) == '(') {
	// 							numBraces++;
	// 						}
	// 						type = type + text.charAt(index);
	// 						index++;
	// 					}
	// 					//Now read up to either a , or a )
	// 					while ((text.charAt(index) != ',') && (text.charAt(index) != ')')) {
	// 						type = type + text.charAt(index);
	// 						index++;
	// 					}
	// 				}
	// 				else {
	// 					while ((text.charAt(index) != ',') && (text.charAt(index) != ')') && (index != text.length)) {
	// 						type = type + text.charAt(index);
	// 						index++;
	// 					}
	// 				}
	// 			}
	// 			else {
	// 				//no type is specified
	// 				type = 'any';
	// 			}
	// 			paramList.push(new paramDeclaration(name, type));
	// 			if (index < text.length) {
	// 				index++;
	// 			}
	// 		}

	// 	}

	// 	return paramList;
	// }
}


class paramDeclaration {

	constructor(public paramName, public paramType) {
		this.paramName = paramName;
		this.paramType = paramType;
	}
}

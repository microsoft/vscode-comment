export class paramDeclaration {

	constructor(public paramName, public paramType) {
		this.paramName = paramName;
		this.paramType = paramType;
	}
}


export function getParameterText(paramList: paramDeclaration[], returnText: string): string {
	var textToInsert: string = "";
	textToInsert = textToInsert + '/**\n *';
	paramList.forEach(element => {
		if (element.paramName != '') {
			textToInsert = textToInsert + ' @param  ';
			//if (element.paramType != '') {
				textToInsert = textToInsert + '{' + element.paramType + '}' + ' ';
			//}
			textToInsert = textToInsert + element.paramName + '\n' + ' *';
		}
	});
	if (returnText != '') {
		textToInsert = textToInsert + ' @returns ' + returnText + '\n' + ' *';
	}
	textToInsert = textToInsert + '/';
	return textToInsert;
}


export function getReturns(text: string): string {
	var returnText: string = '';
	text = text.replace(/\s/g, '');

	var lastIndex = text.lastIndexOf(':');
	var lastBrace = text.lastIndexOf(')');
	if (lastIndex > lastBrace) {
		//we have a return type
		//read to end of string
		var index = lastIndex + 1;
		var splicedText = text.slice(index, text.length);
		returnText = splicedText.match(/[a-zA-Z][a-zA-Z0-9$_]*/).toString();
		// while (index < text.length) && (text..charAt(index).al.m
		// 	returnText = returnText + text.charAt(index);
		// 	index++;
		// }
	}
	return returnText;
}

export function stripComments(text: string): string {
	var uncommentedText: string = '';
	var index = 0;
	while (index != text.length) {
		if ((text.charAt(index) == '/') && (text.charAt(index + 1) == '*')) {
			//parse comment
			if ((index + 2) != text.length) { //Check for the corner case that the selected text contains a /* right at the end
				index = index + 2;
				while ((text.charAt(index) != '*') && (text.charAt(index + 1) != '/')) {
					index++;
				}
			}
			index = index + 2;
		}
		else if ((text.charAt(index) == '/') && (text.charAt(index + 1) == '/')) {
			//read to end of line
			while ((text.charAt(index) != '\n') && (index < text.length)) {
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
export function getParameters(text: string): paramDeclaration[] {
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
			while ((text.charAt(index) != ':') && (text.charAt(index) != ',') && (text.charAt(index) != ')') && (index < text.length)) {
				name = name + text.charAt(index);
				index++;
			}
			if (index < text.length) {		
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
						while ((numBraces != startNumBraces) && (index < text.length)) {
							if (text.charAt(index) == ')') {
								numBraces--;
							}
							else if (text.charAt(index) == '(') {
								numBraces++;
							}
							type = type + text.charAt(index);
							index++;
						}
						if (index < text.length) {
							//Now read up to either a , or a )
							while ((text.charAt(index) != ',') && (text.charAt(index) != ')')) {
								type = type + text.charAt(index);
								index++;
							}
							if (text.charAt(index) == ')') {
								numBraces--;
							}
						}
					}
					else {
						while ((text.charAt(index) != ',') && (text.charAt(index) != ')') && (index != text.length)) {
							type = type + text.charAt(index);
							index++;
						}
						if (text.charAt(index) == ')') {
							numBraces--;
						}
					}
				}
				else {
					//no type is specified
					type = '';
				}
				paramList.push(new paramDeclaration(name, type));
				if (index < text.length) {
					index++;
				}
			}
		}

	}

	return paramList;
}
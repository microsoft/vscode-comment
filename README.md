# vscode-comment
Adds simple jsdoc comments for the parameters of a selected function signature

## Getting the repo

First, you will need to install Visual Studio Code `0.9.1`.  

Next, clone this repo and run `npm install`.

```bash
cd <some folder on disk>
git clone https://monacotools.visualstudio.com/DefaultCollection/Monaco/_git/go-code
cd vscode-comment
npm install
code .
```

## Using

When you have opened the repo in VS Code, press F5 to build and run the extension. VS Code will launch another window in which your extension will be hosted.

Open, or create, a typescript file and find a function signature, ideally one that contains one or more parameters. Select the whole function signature.

The extension adds a command to the command palette. Open the command palette (F1 on Windows) and look for the command 'Add doc comments'. Hit enter.

The extension will parse the selected signature and add @param comments for each parameter in the selected signature, directly above the signature.

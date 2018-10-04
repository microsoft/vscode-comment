# vscode-comment
Adds simple JSDoc comments for the parameters of a selected function signature.

## Using
In a TypeScript or JavaScript file, select a function signature, ideally one that contains one or more parameters. Select the whole function signature then invoke the Add Doc Comments extension (open the command palette (F1 on Windows) and look for the command 'Add doc comments'. Hit enter.)

![install and work](images/addDocComments.gif)


The extension will parse the selected signature and add @param and @return tags for each parameter and any return type in the selected signature, directly above the signature.

## Limitations
The extension does not support any other type of JSDoc tags. It only calculates @param and @return

Parameter types are not inferred based on usage. If a type is not specified, empty braces {} are returned.

## Other extensions
[Document This](https://marketplace.visualstudio.com/items?itemName=joelday.docthis) provides the same functionality but supports many more tags

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

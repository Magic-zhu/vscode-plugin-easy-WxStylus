// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const stylus = require('stylus');
const fs = require('fs');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function compile(filePath){
    return new Promise((resolve,reject)=>{
        fs.readFile(filePath,function(err,data){
            let str = data.toString()
            stylus.render(str,function(err,css){
                if(err){
                    vscode.window.showErrorMessage(err)
                    reject(err)
                }else{
                    resolve(css)
                }
            })
        })
    })
}
   
function createFile(filePath,data){
    let lastIndex = filePath.lastIndexOf('.');
    let newPath = filePath.slice(0,lastIndex) + ".wxss";
    return new Promise((resolve,reject)=>{
        fs.writeFile(newPath,data,function(err){
            if(!err){
                resolve()
            }else{
                vscode.window.showErrorMessage(err)
                reject(err)
            }
        })
    })
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    vscode.window.setStatusBarMessage('Easy StylusWxss active');
    let didSaveEvent = vscode.workspace.onDidSaveTextDocument((doc)=>{
        if(doc.fileName.endsWith('.styl')){
            vscode.window.showWarningMessage('compiling......')
            compile(doc.fileName)
            .then(data=>{
                return createFile(doc.fileName,data)
            })
            .then(()=>{
                vscode.window.showInformationMessage('compile suceess')
            })
        }
    })
    context.subscriptions.push(didSaveEvent);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

/* eslint-disable quotes */
const vscode = require('vscode');

const { constants } = require('./utils');

function updateLines(workspaceEdit, documentText, splitText, type) {
  const lines = documentText.split(splitText);
  const linesWrappedInQuotes = lines.map((line) => `${type}${line.replaceAll('\r', '').trim()}${type}`);
  const withCommasInBetween = linesWrappedInQuotes.filter((line) => typeof line === 'string' && line.length > 0 && line !== `${type}${type}`).join(',');

  vscode.workspace.openTextDocument({ content: withCommasInBetween.toString() });

  vscode.workspace.applyEdit(workspaceEdit).then(() => {
    vscode.window.showInformationMessage(`${lines.length} ${constants.MESSAGE_CONSOLE_REMOVED}`);
  });
}

function getEditorText() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage(constants.MESSAGE_CONSOLE_CANT_REMOVE);

    return null;
  }

  return editor.document.getText();
}

function registerCommand(commandName, splitText, delimiter) {
  return vscode.commands.registerCommand(commandName, () => {
    const text = getEditorText();

    if (text === null) {
      return;
    }

    const workspaceEdit = new vscode.WorkspaceEdit();
    updateLines(workspaceEdit, text, splitText, delimiter);
  });
}

function singleLine() {
  return registerCommand(constants.COMMAND_SINGLE_LINE, '\n', `'`);
}

function doubleLine() {
  return registerCommand(constants.COMMAND_DOUBLE_LINE, '\n', `"`);
}

function singleSpace() {
  return registerCommand(constants.COMMAND_SINGLE_SPACE, ' ', `'`);
}

function doubleSpace() {
  return registerCommand(constants.COMMAND_DOUBLE_SPACE, ' ', `"`);
}

function activate(context) {
  console.log('QMarks is now active!');

  context.subscriptions.push(singleLine());
  context.subscriptions.push(doubleLine());
  context.subscriptions.push(singleSpace());
  context.subscriptions.push(doubleSpace());
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

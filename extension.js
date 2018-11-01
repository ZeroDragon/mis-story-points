const vscode = require('vscode');
const request = require('request');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.sayHello', function () {
        const { window } = vscode
        const { goal, endpoint, collaborator } = vscode.workspace.getConfiguration('storyPoints')
        const url = `${endpoint.replace('######', collaborator)}`
        const plural = (number, string) => {
            if (number === 1) return `${number} ${string}`
            return `${number} ${string}s`
        }
        request.get(url, {json: true}, (err, response, body) => {
            const { rows } = body.data
            const total3m = rows
                .slice(-3)
                .map(item => item[2])
                .reduce(((prev, current) => prev + current), 0)
            const goal3m = goal * 3
            const [, , pts] = rows.pop() || [null, null, 0]
            const per = Math.round(pts * 100 / goal)
            const per3m = Math.round(total3m * 100 / goal3m)
            window.showInformationMessage(
                `Mensual: ${plural(pts, 'pt')} = ${per}% | Trimestral: ${per3m}%`
            )
        })
    });
    context.subscriptions.push(disposable);
}
function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
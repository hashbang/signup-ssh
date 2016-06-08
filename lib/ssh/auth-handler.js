function authHandler (ctx, user) {
    user.name = ctx.username;

    if (ctx.method === 'none') {
        console.log(user.clientInfo.ip + ' => Client connecting using authmethod: none. Rejecting.');
        ctx.reject();
    }

    if (ctx.method === 'password') {
        console.log(user.clientInfo.ip + ' => Client connecting using password');
        ctx.reject();
    }

    if (ctx.method === 'publickey') {
        console.log(user.clientInfo.ip + ' => Client connecting using pubkey');
        user.keys.push(ctx.key.algo + ' ' + ctx.key.data.toString('base64'));
        ctx.reject();
    }

    if (ctx.method === 'keyboard-interactive') {
        console.log(user.clientInfo.ip + ' => All methods exhausted, let them pass through');
        ctx.accept();
    }
}

module.exports = authHandler;

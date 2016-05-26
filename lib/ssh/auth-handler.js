function authHandler (ctx, clientInfo){

  if (ctx.method === 'none') {
    console.log(clientInfo.ip + ' => Client connecting using authmethod: none. Rejecting.');
    ctx.reject();
  }

  if (ctx.method === 'password') {
    console.log(clientInfo.ip + ' => Client connecting using password');
    ctx.reject();
  }

  if (ctx.method === 'publickey') {
    console.log(clientInfo.ip + ' => Client connecting using pubkey');
    user.keys.push(ctx.key.algo + ' ' + ctx.key.data.toString('base64'));
    ctx.reject();
  }

  if (ctx.method === 'keyboard-interactive') {
    console.log(clientInfo.ip + ' => All methods exhausted, let them pass through');
    ctx.accept();
  }
};

module.exports = authHandler;

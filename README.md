# new.hashbang.sh

Over-SSH onboarding for new #! users.

## Rationale

- Using SSH makes it obvious nothing untowards is happening.
- We can grab the pubkeys directly from the SSH client, unless `IdentitiesOnly`
  is set -- in which case, the user knows what they are doing.

## Design

0. Should use the API rather than LDAP directly, so that compromising
   the custom SSHd is not critical.
1. Should lookup the public keys against Github to see if they can be found.
   Use that to prefill the onboarding info (and hopefully make the user take
   note of that privacy issue).
2. Should check for common SSH security issues (X11 forwarding, SSH agent
   forwarding, GPG agent forwarding, `UseRoaming`, weak SSH keys, ...)

Points 1 and 2 are already implemented in [whosthere],
  which might be refactorable into a library.


[whosthere]: https://github.com/FiloSottile/whosthere

## UX thoughts

- Instead of a sequence of questions, this could be an actual curse-style
  form.  Look at [termui] for a potential curses widgets library.


[termui]: https://github.com/gizak/termui

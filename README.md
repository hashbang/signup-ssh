# new.hashbang.sh

Over-SSH onboarding for new #! users.

## Rationale

- Using SSH makes it obvious nothing untowards is happening.
- We can grab the pubkeys directly from the SSH client, unless `IdentitiesOnly`
  is set -- in which case, the user knows what they are doing.

## Design

- [ ] Should use the API rather than LDAP directly, so that compromising
      the custom SSHd is not critical.
- [ ] Should lookup the public keys against Github to see if they can be found.
      Use that to prefill the onboarding info (and hopefully make the user take
      note of that privacy issue).
- [ ] Should check for common SSH security issues:
  - [ ] X11 forwarding
  - [ ] SSH agent forwarding
  - [ ] GPG agent forwarding
  - [ ] `UseRoaming`
  - [ ] weak SSH keys


## UX thoughts

- Instead of a sequence of questions, this could be an actual curse-style
  form. Current version is implemented using [blessed-contrib]


[blessed-contrib]: https://github.com/yaronn/blessed-contrib

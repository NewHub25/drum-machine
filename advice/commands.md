<!-- pre-commit file (without extension) -->

#!/bin/sh

npm run format
git add .
exit 0
<!-- pre-commit file last line -->

create this file, then execute the following command:
```
  chmod +x .git/hooks/pre-commit
```
For see if this file is on mode execution run this (must be x's):
```
  ls -l .git/hooks/pre-commit
```

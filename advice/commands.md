<!-- pre-commit file (without extension) -->

#!/bin/sh

# .git/hooks/pre-commit

npm run format
git add .
exit 0

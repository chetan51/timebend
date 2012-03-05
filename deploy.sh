#/bin/bash

middleman build
mv -f build/* ../checkpointtimer-deploy
cd ../checkpointtimer-deploy
git add -A
git commit -m "Redeploy"
git push github gh-pages
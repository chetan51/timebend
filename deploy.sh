#/bin/bash

middleman build
cp -r build/* ../checkpointtimer-deploy
rm -rf build
cd ../checkpointtimer-deploy
git add -A
git commit -m "Redeploy"
git push github gh-pages
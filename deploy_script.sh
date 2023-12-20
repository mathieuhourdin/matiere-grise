npm run build-prod
cp ./dist/index.html ./dist/404.html 
echo "matieregrise.ppdcoeur.fr" > ./dist/CNAME
git add dist -f
git commit -m "deploy dist"
git subtree push --prefix dist origin gh-pages

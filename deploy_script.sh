npm run build-prod
git add dist -f
git commit -m "deploy dist"
git subtree push --prefix dist origin gh-pages

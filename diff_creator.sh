curl --compressed 'https://web-static.hg-cdn.com/arknights-tw/user/index.1279f3.css' > public/css/index.1279f3.css
npx prettier --write public/css/index.1279f3.css --ignore-path ""
diff -r public/css/index.1279f3.css public/css/your.css > diff.txt
rm public/css/index.1279f3.css
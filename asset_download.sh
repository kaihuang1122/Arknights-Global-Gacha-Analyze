# This downloader is only for downloading assets from the official website.
# Evething downloaded is copyrighted by Hypergryph.

mkdir -p public/css
# get css and patch it
curl --compressed 'https://web-static.hg-cdn.com/arknights-tw/user/index.1279f3.css' > public/css/your.css
npx prettier --write public/css/your.css --ignore-path ""
patch public/css/your.css diff.txt 
mkdir -p public/css/assets/images
mkdir -p public/css/assets/fonts
# get images and fonts (deprecated)
# curl --compressed 'https://web-static.hg-cdn.com/arknights-tw/user/assets/images/pc-bg.0a3825.png' > public/css/assets/images/pc-bg.0a3825.png
# curl --compressed 'https://web-static.hg-cdn.com/arknights-tw/user/assets/images/visit-record.18bb5c.svg' > public/css/assets/images/visit-record.18bb5c.svg
# curl --compressed 'https://web-static.hg-cdn.com/arknights-tw/user/assets/images/reminders.918cc0.svg' > public/css/assets/images/reminders.918cc0.svg
# curl --compressed 'https://web-static.hg-cdn.com/arknights-tw/user/assets/fonts/Oswald-Bold.3c3420.ttf' > public/css/assets/fonts/Oswald-Bold.3c3420.ttf
# curl --compressed 'https://web-static.hg-cdn.com/arknights-tw/user/assets/images/side-bg.57fce4.png' > public/css/assets/images/side-bg.57fce4.png

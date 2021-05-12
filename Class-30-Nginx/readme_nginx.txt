cd Class-30-Nginx
npm i
npm run buildWindows

npm run pm2Cluster
npm run pm2Fork

en nginx.conf http:

upstream coder {
  server 127.0.0.1:8081;
  server 127.0.0.1:8082 weight=4;
}

en nginx.conf server:

location / {
   proxy_pass http://coder/;
}
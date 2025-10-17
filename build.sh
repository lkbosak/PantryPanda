#!/bin/bash
cd "./client/my-app"
npm run build 
scp -r ./build vmuser@10.111.16.231:/var/www/html/client
cd "../../server/my-app"
npm run build 
scp -r ./dist vmuser@10.111.16.231:/var/www/html/server

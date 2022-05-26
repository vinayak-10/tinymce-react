#!/bin/bash

npm run build
cd /home/ruggedcoder/Code/tinymce-react/build/static/js
ln -s ../../../node_modules/tinymce/ tiny
sudo systemctl restart nginx.service
cd /home/ruggedcoder/Code/tinymce-react/

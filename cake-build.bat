set path=%path%;node_modules/.bin
cake templates
coffee --compile --output lib src
lessc src/less/Log.v4.less -compress lib/Log.v4.css
browserify src/client.coffee --exports process,require -o lib/Log.v4.js

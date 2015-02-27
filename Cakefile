{spawn, exec} = require 'child_process'
fs = require 'fs'

ENV = '/usr/bin/env'
BROWSERIFY = "#{ ENV } browserify"
COFFEE = "#{ ENV } coffee"
MOCHA = "#{ ENV } mocha"
LESS = "#{ ENV } lessc"
NODE = "#{ ENV } node"

TEMPLATE_SRC = "#{ __dirname }/templates"
TEMPLATE_OUTPUT = "#{ __dirname }/src/templates.coffee"

task 'build', "Builds Log.v4 package", ->
  invoke 'templates'
  invoke 'compile'
  invoke 'less'
  invoke 'browserify'
  # Ensure browserify has completed
  setTimeout (-> invoke 'func_test'), 2000

task 'compile', "Compiles CoffeeScript src/*.coffee to lib/*.js", ->
  console.log "Compiling src/*.coffee to lib/*.js"
  exec "#{COFFEE} --compile --output #{__dirname}/lib/ #{__dirname}/src/", (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr if stdout + stderr

task 'browserify', "Compiles client.coffee to browser-friendly JS", ->
  console.log "Browserifying src/client.coffee to lib/Log.v4.js"
  exec "#{BROWSERIFY} src/client.coffee --exports process,require -o #{ __dirname }/lib/Log.v4.js", (err, stdout, stderr) ->
    console.log stdout + stderr if err

task 'less', "Compiles less templates to CSS", ->
  console.log "Compiling src/less/* to lib/Log.v4.css"
  exec "#{LESS} #{__dirname}/src/less/Log.v4.less -compress -o #{__dirname}/lib/Log.v4.css", (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr if stdout + stderr

task 'templates', "Compiles templates/*.html to src/templates.coffee", ->
  console.log "Generating src/templates.coffee from templates/*.html"
  buildTemplate()

task 'ensure:configuration', "Ensures that config files exist in ~/.Log.v4/", ->
  console.log "Creating ~/.Log.v4/ for configuration files."
  console.log "If this fails, run npm using a specific user: npm install -g Log.v4 --user 'ubuntu'"
  homedir = process.env[if process.platform is 'win32' then 'USERPROFILE' else 'HOME']
  ldir = homedir + '/.Log.v4/'
  fs.mkdirSync ldir if not fs.existsSync ldir
  for c in ['harvester', 'log_server', 'web_server']
    path = ldir + "#{c}.conf"
    copyFile "./conf/#{c}.conf", path if not fs.existsSync path

task 'func_test', "Compiles & runs functional tests in test/", ->
  console.log "Compiling test/*.coffee to test/lib/*.js..."
  exec "#{COFFEE} --compile --output #{__dirname}/test/lib/ #{__dirname}/test/", (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr if stdout + stderr
    console.log "Running tests..."
    exec "#{MOCHA} --reporter spec test/lib/functional.js", (err, stdout, stderr) ->
      throw err if err
      console.log stdout + stderr if stdout + stderr

copyFile = (from, to) ->
  fs.createReadStream(from).pipe fs.createWriteStream to

exportify = (f) ->
  templateName = f.replace '.html', ''
  templateExportName = templateName.replace '-', '.'
  templateFilePath = "#{ TEMPLATE_SRC }/#{ f }"
  body = fs.readFileSync templateFilePath, 'utf-8'
  content = "exports.#{ templateExportName } = \"\"\"#{ body }\"\"\""

buildTemplate = ->
  files = fs.readdirSync TEMPLATE_SRC
  templateBlocks = (exportify f for f in files)
  content = '# TEMPLATES.COFFEE IS AUTO-GENERATED. CHANGES WILL BE LOST!\n'
  content += templateBlocks.join '\n\n'
  fs.writeFileSync TEMPLATE_OUTPUT, content, 'utf-8'

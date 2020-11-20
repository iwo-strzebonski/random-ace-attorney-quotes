const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const favicon = require('serve-favicon')
const formidable = require('formidable')

const random_between = (min, max) => min + Math.floor(Math.random() * (max - min + 1))

const app = express()
const PORT = process.env.PORT || 3000

var data = fs.readFileSync(path.join(__dirname + '/static/db/database.json'))
json = JSON.parse(data)

function get_random_quote(author) {
    var out = ''

    for (let i = 0; i < json.length; i++) {
        if (get_author(i) == author) {
            try {
                out = json[i][author][random_between(0, json[i][author].length - 1)]["quote"]
            } catch {
                out = ''
            }

            break
        }
    }

    return out
}

function is_quote_in_db(author, quote) {
    var out = false

    for (let i = 0; i < json.length; i++) {
        if (get_author(i) == author) {
            for (let j = 0; j < json[i][author].length; j++) {
                if (json[i][author][j]["quote"].includes(quote)) {
                    out = true
                    break
                }
            }
        }
    }

    return out
}

function get_author(i) {
    return JSON.stringify(json[i]).replace('{"', '').slice(0, JSON.stringify(json[i]).replace('{"', '').search('"'))
}

function read_authors(author) {
    var out = ''

    for (let i = 0; i < json.length; i++) {
        out += `<option ${author == get_author(i) ? 'selected' : ''}>` + get_author(i) + '</option>'
    }

    return out
}

function add_quote(author, quote) {
    for (let i = 0; i < json.length; i++) {
        if (get_author(i) == author) {
            json[i][author][json[i][author].length] = { "quote" : quote }
            break
        }
    }
}

app.use(express.static('static'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(favicon(__dirname + '/static/gfx/favicon.ico'));

app.get('/:site', (req, res) => {
    site = req.params.site

    switch (site) {
        case 'random':
            var data = fs.readFileSync(path.join(__dirname + '/static/pages/random.html'), 'utf-8')
            res.send(data
                .replace('<h2></h2>', '<h2>' + get_random_quote('Apollo Justice') + '</h2>')
                .replace('<option></option>', read_authors())).end()
            break
    
        case 'add':
            var data = fs.readFileSync(path.join(__dirname + '/static/pages/add.html'), 'utf-8')
            res.send(data
                .replace('<option></option>', read_authors()))
            break

        case 'download':
            res.download(
                path.join(__dirname) + '/static/db/database.json',
                'database.json',
                (err) => { if (err) return console.log(err) })
            break

        case 'upload':
            fs.unlinkSync(
                path.join(__dirname) + '/static/db/database.json',
                (err) => { if (err) return console.log(err) })
            res.send("<form enctype='multipart/form-data' method='POST' action='/upload'>\
            <label for='file'>Choose a file: </label>\
            <input type='file' required accept='.json' name='file'>\
            <br />\
            <input type='submit' value='send database'>\
            </form>").end()
            break
        
        default:
            res.sendStatus(404).end()
            break
    }
})

app.post('/random', (req, res) => {
    var data = fs.readFileSync(path.join(__dirname + '/static/pages/random.html'), 'utf-8')
    var author = req.body.author

    res.send(data
        .replace('<h2></h2>', '<h2>' + get_random_quote(author) + '</h2>')
        .replace('<option></option>', read_authors(author)))

    res.end()
})

app.post('/add', (req, res) => {
    var author = req.body.author
    var quote = req.body.quote

    if (is_quote_in_db(author, quote)) {
        res.send('This quote is already in Our database! ' + "<a href='add'>[go back]</a>")
    } else {
        add_quote(author, quote)
        fs.writeFile(
            path.join(__dirname + '/static/db/database.json'), 
            JSON.stringify(json), 
            (err) => { if (err) return console.log(err) })
        res.send('Successfully added a new quote. ' + "<a href='add'>[go back]</a>")
    }

    res.end()
})

app.post('/upload', (req, res) => {
    let form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname + '/static/db/')
    form.keepExtensions = true

    form.parse(req, (err, fields, files) => {  })

    form.on('file', function(field, file) {
        fs.rename(
            file.path,
            form.uploadDir + "/" + file.name, 
            (err) => { if (err) return console.log(err) })
    })

    res.redirect('/')
})

app.listen(PORT, () => {
    console.log('Server started on port: ' + PORT)
})
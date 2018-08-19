const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

app.locals.title = 'Palette Picker';


app.post('/api/v1/palettes', (request, response) => {

});

app.post('/api/v1/project', (request, response) => {

});

app.get('/', (request, response) => {

});

app.get('/api/v1/projects/:id', (request, response) => {

});

app.get('api/v1/palette/:project_id', (request, response) => {

});

app.delete('/api/v1/palette', (request, response) => {

});

app.use(express.static('public'))

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
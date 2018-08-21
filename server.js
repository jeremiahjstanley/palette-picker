const bodyParser = require('body-parser');
// allow our application to parse json
const express = require('express');
// importing express enviroment
const app = express();
// creating an instance of our backend

const environment = process.env.NODE_ENV || 'development';
// configuring our environment, default is dev
const configuration = require('./knexfile')[environment];
// importing knex file to manage SQL db
const database = require('knex')(configuration);
// creating an instace of our db

app.use(bodyParser.json());
// telling app to use bodyParse to parse json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// telling our app to serve static resources from public file

app.set('port', process.env.PORT || 3000);
// telling our app what port it is running on, 3000 is the default
app.locals.title = 'Palette Picker';
// our app name

app.get('/', (request, response) => {
// get request for root directory
	response.send(`${app.locals.title} has been complied successfully`)
});
// feedback from successful get request

app.get('/api/v1/projects', (request, response) => {
	// defining endpoint for get request projects table
	database('projects').select()
	// selecting all project in table, returns promise
		.then((projects) => {
			response.status(200).json(projects)
			// returns json response object, parse with json, send 200 status code to indicate sucessful fetch
		})
		.catch((error) => {
			response.status(500).json({ error })
			// catch for error handling, sends 500 if the serve encounters an error
		})
});

app.get('/api/v1/palettes', (request, response) => {
	// defining endpoint for get request palettes table
	database('palettes').select()
	// selecting all palettes in table, returins promise
		.then((palettes) => {
			response.status(200).json(palettes)
			// returns json response object, parse with json, send 200 status code t0 indicate sucessful fetch
		})
		.catch((error) => {
			response.status(500).json({ error })
			// catch for error handling, sends 500 if the serve encounters an error
		})
});

app.get('/api/v1/projects/:id', (request, response) => {
	// defining endpoint for a specific project resource
	const { id } = request.params;
	// declaring id variable from dynamic key in url ':id'
	database('projects').where('id', id).select()
	// looking for matching record in db, on primary column, 'id'
		.then(project => {
			// receive response object
			if(project.length) {
				// check to see if response has length (exists)
				response.status(200).json(project)
				// if record is found, returns json response object, parse with json, send 200 status code to indicate sucessful fetch
			} else {
				response.status(404).send({error: `Unable to find project with id: "${id}"`})
				// if record is not found, return error message and 404 status code 
			}
		})
	.catch((error) => {
		response.status(500).json({ error })
		// catch for error handling, sends 500 if the serve encounters an error
	})
});

app.get('/api/v1/palettes/:id', (request, response) => {
	// defining endpoint for a specific palette resource
	const { id } = request.params;
	// declaring id variable from dynamic key in url ':id'
	database('palettes').where('id', id).select()
	// looking for matching record in db, on primary column, 'id'
		.then(palette => {
			// recieve response object
			if(palette.length) {
				// check to see if response has length (exists)
				response.status(200).json(palette)
				// if record is found, returns json response object, parse with json, send 200 status code to indicate sucessful fetch
			} else {
				response.status(404).send({error: `Unable to find palette with id: "${id}"`})
				// if record is not found, return error message and 404 status code 
			}
		})
	.catch((error) => {
		response.status(500).json({ error })
		// catch for error handling, sends 500 if the serve encounters an error
	})
});

app.post('/api/v1/projects', (request, response) => {
	// defining post endpoint for projects table
	const project = request.body;
	// accessing body on request object
	for (let requiredParameter of ['project_name']) {
		// defining required params
		if (!project[requiredParameter]) {
			//check for required params
			return response
				.status(422)
				.send({ error: `Expected format: { project_name: <String>}. You're missing a "${requiredParameter}" property.`});
		}
		// if required params are absent, send 422 status code, indicating missing information, and send error, (post was still sucessfull)
	}
	database('projects').insert(project, 'id')
		//insert project in projects table
		.then(project => {
			// receive response object
			response.status(201).json({ id: project[0] })
			// record is created, 201 status code is send to incdiate successful record has been successfully, record id is returned 
		})
		.catch(error => {
			response.status(500).json({ error });
			// catch for error handling, sends 500 if the serve encounters an error

		});
});

app.post('/api/v1/palettes', (request, response) => {
	// defining post endpoint for palettes table
  const palette = request.body;
	// accessing body on request object
  for (let requiredParameter of ['palette_name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'project_id']) {
    // defining required params
    if (!palette[requiredParameter]) {
			//check for required params
      return response.status(422)
      .send({error: `Expected format: {name: <STRING>, color_1: <STRING>, color_2: <STRING>, color_3: <STRING>, color_4: <STRING>, color_5: <STRING>, project_id: <NUMBER>}. You are missing a "${requiredParameter}" property.`});
    }
    // if required params are absent, send 422 status code, indicating missing information, and send error, (post was still sucessfull)
  }
  database('palettes').insert(palette, 'id')
 		//insert palette in palettes table
    .then(palette => {
			// receive response object
      response.status(201).json( { id: palette[0]} )
 			// record is created, 201 status code is send to incdiate successful record has been successfully, record id is returned 
    })
    .catch(error => {
      response.status(500).json( {error} );
 			// catch for error handling, sends 500 if the serve encounters an error
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
	// defining endpoint for a specific palette resource
	const { id } = request.params;
	// declaring id variable from dynamic key in url ':id'
	database('palettes').where('id', id).select()
	// looking for matching record in db, on primary column, 'id'
		.then(palette => {
		// recieve response object
			if (!palette.length) {
				//if response doesn't have length (doesn't exist)
				response.status(404).send({error: `Unable to find palette with id: "${id}"`})
				// return 404 status code indicating resource cannot be found
			} else {
				// if record is found
				database('palettes').where('id', id).del()
				// delete record from db
					.then(palette => {
						// receive response object
						response.status(204).send(`Resource: ${palette}, id: ${id} successfully deleted`)
						// 204 status code is send to user indicating resource has been succesfully deleted
					})
					.catch(error => {
						response.status(500).json({ error })
						// catch for error handling, sends 500 if the serve encounters an error in inner function
					})
			}
		})
		.catch(error => {
			response.status(500).json({ error })
 			// catch for error handling, sends 500 if the serve encounters an error in outer function
		})
});

app.delete('/api/v1/projects/:id', (request, response) => {
	// defining endpoint for a specific palette resource
	const { id } = request.params;
	// declaring id variable from dynamic key in url ':id'
	database('projects').where('id', id).select()
	// looking for matching record in db, on primary column, 'id'
		.then(project => {
		// recieve response object
			if (!project.length) {
			//if response doesn't have length (doesn't exist)
				response.status(404).send({error: `Unable to find project with id: "${id}"`})
				// return 404 status code indicating resource cannot be found
			} else {
				database('projects').where('id', id).del()
				// delete record from db
					.then(project => {
						response.status(204).send(`Resource: ${project}, id: ${id} successfully deleted`)
						// 204 status code is send to user indicating resource has been succesfully deleted
					})
					.catch(error => {
						response.status(500).json({ error })
						// catch for error handling, sends 500 if the serve encounters an error in inner function
					})
			}
		})
		.catch(error => {
			response.status(500).json({ error })
 			// catch for error handling, sends 500 if the serve encounters an error in outer function
		})
});

app.listen(app.get('port'), () => {
	//indicates what port app is running on
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
//export app for testing 

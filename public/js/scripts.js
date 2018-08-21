$(window).on('load', loadApplication);
$('.palette').click(generatePalette);
$('.lock-button').click(toggleLock);
$('.save-palette-form').submit(savePalette);
$('.save-project-form').submit(saveProject);
$('.projects').on('click', '.delete-project', deleteProject);
$('.projects').on('click', '.delete-palette', deletePalette);



let colors = []

function loadApplication() {
	generatePalette();
	getProjects();
};

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function generatePalette() {
	for (let i = 0; i < 5; i++) {
		 let color = getRandomColor();
		 if (!isLocked(i)) {
	 		$(`.color-${[i]}-section`).css('background-color', color);
	 		$(`.color-${[i]}-text`).text(`${color}`);	
		}
	};
};

function toggleLock(event) { 
	event.stopPropagation();
	$(this).closest('section').toggleClass('locked');
};

function isLocked(i) { 
	return $(`.color-${[i]}-section`).hasClass('locked');
};

function featurePalette() {

};

function savePalette(event) {
	event.preventDefault();
	$('h3').each(function() {
		colors.push($(this).text())
	});
	let paletteName = $('.palette-input-field').val();
	let projectId = $('.project-dropdown').val();
	if (paletteName.length && projectId) {
		postPalette(projectId, paletteName, colors);
		appendPalette()
		$('.palette-input-field').val('');
	} else {
		$('.palette-feedback-text').text(`Please select a project!`)
	}
	colors = [];
};

function saveProject(event) {
	event.preventDefault();
	let projectName = $('.project-input-field').val();
	const nameValidation = $('option').filter(function() {
		$(this).text == projectName;
	})
	console.log(nameValidation)
	if (projectName.length && nameValidation) {
		const project = { project_name: projectName };
		postProject(project);
		$('.project-input-field').val('');
	} else {
		$('.project-feedback-text').text(`${projectName} is already in use, please enter a new name!`)
	}
};

async function getProjects() {
	const url = '/api/v1/projects';
	const response = await fetch(url);
	const projects = await response.json()
	getPalettes()
	populateProjects(projects)
};

async function getPalettes() {
	const url = '/api/v1/palettes';
	const response = await fetch(url);
	const palettes = await response.json()
	appendPalette(palettes)
};

function populateProjects(projects) {
	projects.forEach(project => {
		const { id, project_name } = project;
		$('.project-dropdown').append(`<option value='${id}'>${project_name}</option>`);
		appendProjects(id, project_name);
	});
};

async function postProject(newProject) {
	const url = '/api/v1/projects';
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newProject)
	});
	const project = await response.json();
	const id = project.id;
	const name = newProject.project_name;
	$('.project-dropdown').append(`<option value='${id}'>${name}</option>`);
	appendProjects(id, name)
};

async	function postPalette(id, name, colors) {
	const url = '/api/v1/palettes';
	const palette = {
		palette_name: name,
		color_1: colors[0],
		color_2: colors[1],
		color_3: colors[2],
		color_4: colors[3],
		color_5: colors[4],
		project_id: id
	};
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(palette)
	});
	const results = await response.json();
};

async function deleteProject() {
	const id = $(this).closest('.project').attr('id');
	const url = `/api/v1/projects/${id}`;
	const response = await fetch(url, {
		method: 'DELETE'
	});
	$(this).closest('.project').remove();
};

function appendProjects(id, name) {
	$('.projects').append(
		`<div class='project' id='${id}'>
			<h3>${name}</h3>
			<button class='delete-project'>X</button>
		</div>`
	);
};

function appendPalette(palettes) {

}



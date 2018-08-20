$(window).on('load', loadApplication);
$('.palette').on('click', generatePalette);
$('.lock-button').on('click', toggleLock);
$('.save-palette-form').on('submit', savePalette)
$('.save-project-form').on('submit', saveProject)

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
		$('.palette-input-field').val('');
	}
	colors = [];
};

function saveProject(event) {
	event.preventDefault();
	let projectName = $('.project-input-field').val();
	if (projectName.length) {
		const project = { project_name: projectName };
		postProject(project);
		$('.project-input-field').val('');
	}
};

async function getProjects() {
	const url = '/api/v1/projects';
	const response = await fetch(url);
	const projects = await response.json()
	getPalettes()
	populateDropdown(projects)
};

async function getPalettes() {
	const url = '/api/v1/palettes';
	const response = await fetch(url);
	const palettes = await response.json()
	appendPalettes(palettes)
};

function populateDropdown(projects) {
	projects.forEach(project => {
		const { id, project_name } = project;
		$('.project-dropdown').append(`<option value='${id}'>${project_name}</option>`);
	});
};

function appendPalettes(palettes) {
	palettes.forEach(palette => {

	})
}

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
};

async	function postPalette(id, name, colors) {
	console.log(id, name, colors)
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



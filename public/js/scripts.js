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
	return $(`.color-${[i]}-section`).hasClass('locked')
};

function savePalette(event) {
	event.preventDefault();
	$('h3').each(function() {
		colors.push($(this).text())
	});
	let input = $('.palette-input-field').val()
	let project = 
	colors = []
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

function populateDropdown(projects) {
	projects.forEach(project => {
		const { id, project_name } = project;
		$('.project-dropdown').append(`<option value='${id}'>${project_name}</option>`);
	});
};

async function getProjects() {
	const url = '/api/v1/projects';
	const response = await fetch(url);
	const projects = await response.json()
	populateDropdown(projects)
};

async function getPalettes() {
	const url = '/api/v1/palettes';
	const response = await fetch(url);
	const palettes = await response.json()
	
};

async function postProject(newProject) {
	const url = '/api/v1/projects';
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newProject)});
	const project = await response.json();
	const id = project.id;
	const name = newProject.project_name;
	$('.project-dropdown').append(`<option value='${id}'>${name}</option>`);
}

async	function postPalette(pallete) {
	const url = '/api/v1/palettes';
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body:JSON.stringify({

		})
	})
}
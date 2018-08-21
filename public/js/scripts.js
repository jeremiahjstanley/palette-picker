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
		$('.palette-input-field').val('');
	} else {
		$('.palette-feedback-text').text(`Please select a project!`);
	};
	colors = [];
};

function saveProject(event) {
	event.preventDefault();
	let projectName = $('.project-input-field').val();
	const duplicateName = $.find('option').find(project => {
		return project.text === projectName;
	});
	if (projectName.length && !duplicateName) {
		const project = { project_name: projectName };
		postProject(project);
		$('.project-input-field').val('');
		$('.project-feedback-text').text('');
	} else {
		$('.project-feedback-text').text(`${projectName} is already in use, please enter a new name!`);
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
	palettes.forEach(palette => appendPalette(palette))
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
	appendPalette(palette, results)
};

function deleteProject() {
	$(this).siblings('.palette').each(function() {
		deletePalette(this.id)
	});
	const id = $(this).closest('.project').attr('id');
	const url = `/api/v1/projects/${id}`;
	const response = fetch(url, {
		method: 'DELETE'
	});
	$(this).closest('.project').remove();
};

function deletePalette(altId) {
	const id = $(this).closest('.palette').attr('id') || altId;
	const url = `/api/v1/palettes/${id}`;
	const response = fetch(url, {
		method: 'DELETE'
	});
	$(this).closest('.palette').remove();
};

function appendProjects(id, name) {
	$('.project-message').text('')
	$('.projects').append(
		`<article class='project' id='${id}'>
			<h3>${name}</h3>
			<button class='delete-project'>X</button>
			<p class='palette-message'>Add a palette to this project</p>
		</article>`
	);
};

function appendPalette(palette, id) {
	const project = $.find('.project').filter(project => {
		if (project.id === palette.project_id) {
			return project;
		};
	})
	if (project) {
		$('.palette-message').text('');
		$(`<section class='palette' id='${id.id ||palette.id}'>
				<h4>${palette.palette_name}</h4>
				<button class='delete-palette'>X</button>
				<article class='small-swatch' style='background-color:${palette.color_1}'></article>
				<article class='small-swatch' style='background-color:${palette.color_2}'></article>
				<article class='small-swatch' style='background-color:${palette.color_3}'></article>
				<article class='small-swatch' style='background-color:${palette.color_4}'></article>
				<article class='small-swatch' style='background-color:${palette.color_5}'></article>
			</section>`).appendTo(project)
	}
}
 


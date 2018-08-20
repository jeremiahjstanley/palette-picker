$(window).on('load', generatePalette);
$('.palette').on('click', generatePalette);
$('.lock-button').on('click', toggleLock);
$('.save-palette-form').on('submit', savePalette)
$('.save-project-form').on('submit', saveProject)

let colors = []

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
	}
};

function toggleLock(event) { 
	event.stopPropagation();
	$(this).closest('section').toggleClass('locked');
};

function isLocked(i) { 
	return $(`.color-${[i]}-section`).hasClass('locked')
};

function savePalette(event) {
	console.log('hi')
	event.preventDefault();
	$('h3').each(function() {
		colors.push($(this).text())
	})
	let input = $('.palette-input-field').val()
	colors = []
}

function saveProject(event) {
	event.preventDefault();
	let projectName = $('.project-input-field').val();
	$('.project-dropdown').append(`<option>${projectName}</option>`);
	const project = { project_name: projectName };
	postProject(project);

}

function getProject() {

}

function getPalette() {

}

function postProject() {

}
$(window).on('load', generatePalette);
$('.palette').on('click', generatePalette);
$('.lock-button').on('click', toggleLock);

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function generatePalette() {
	for (var i = 0; i < 5; i++) {
		 var color = getRandomColor();
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

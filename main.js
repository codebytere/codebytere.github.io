const items = {
  '#notebook': 'Projects',
  '#headphones': 'About Me',
  '#macbook': 'Skills',
  '#mail': 'Contact',
  '#iphone': 'Links',
  '#flash-drive': 'Resume',
  '#yubikey': 'Keybase',
};

$(() => {
  $('#stage').load('assets/landing.svg', (response) => {
    loadTooltips();
    setEvents();
  });
  $.get('html/modal.html', (modal) => { $('body').append(modal); });
});

function loadTooltips() {
  Object.keys(items).forEach((key) => {
    $(`${key}`)
      .attr('cursor', 'pointer')
      .addClass('button')
      .tooltip({
        title: `${items[key]}`,
        container: 'body',
        content: () => `${items[key]}`,
      });
  });
}

function setEvents() {
  Object.keys(items).forEach((key) => {
    $(`${key}`).on('mouseup', (ev) => {
      $('#myModal').modal('show');

      const source = `html/${items[key].toLowerCase()}.html`;
      $('.modal-header').html(`<h2>${items[key]}</h2>`);
      $.get(source, (contents) => { $('.modal-body').html(contents); });
      ev.preventDefault();
    });
  });
}

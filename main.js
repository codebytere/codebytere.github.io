$(() => {
  $('#stage').load('landing.svg', (response) => {
    $(this).addClass('svgLoaded');
    if (!response) {
      console.log('Error');
    }

    $('#notebook').tooltip({ title: 'GET /projects', container: 'body' });
    $('#about-me').tooltip({ title: 'GET /about', container: 'body' });
    $('#headphones').tooltip({ title: 'GET /about', container: 'body' });
    $('#macbook').tooltip({ title: 'GET /skills', container: 'body' });
    $('#mail').tooltip({ title: 'POST /contact', container: 'body' });
    $('#iphone').tooltip({ title: 'GET /links', container: 'body' });
    $('#yubikey').tooltip({ title: 'GET /keybase', container: 'body' });

    $('#notebook').click((e) => { $('#myModal').modal('show'); });
  });
});

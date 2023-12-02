window.$ = window.hobo;



window.$foo = $( "#foo" );
window.$baz = $( "#baz" );
window.$blot = $( ".blot" );



// Test .one(), One time event handler
$baz.one( "click", function ( e ) {
    console.log( "clicked baz once", e, this );
});



window.$node = $( '<div class="bar"><div class="bar__inner"></div></div>' );
window.$html = $( document.documentElement.outerHTML );
window.$body = $( document.body.outerHTML );



$.ajax({
    url: "http://www.pokemon.com/us/api/pokedex/kalos",
    method: "GET",
    dataType: "json"
})
.then(function ( response ) {
    console.log( "response", response );
})
.catch(function ( error ) {
    console.log( "error", error );
});

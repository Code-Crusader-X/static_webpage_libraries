$(document).ready(function() {
    // MixItUp Initialisierung
    var mixer = mixitup('#movie-grid', {
        animation: {
            duration: 300
        }
    });

    // Hover-Effekt für Filmkarten
    $('.movie-card').hover(
        function() {
            $(this).find('.card-title').css('color', '#007bff');
        },
        function() {
            $(this).find('.card-title').css('color', '');
        }
    );

    // Smooth Scroll für Navigation
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 1000);
        }
    });
}); 
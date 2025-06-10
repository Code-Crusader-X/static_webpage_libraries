/**
 * Hauptskript für die Film-Website
 * 
 * Hinweis zur Selektoren-Syntax:
 * - $('.class') entspricht document.querySelectorAll('.class')
 * - $('#id') entspricht document.querySelector('#id')
 * - $('element') entspricht document.querySelectorAll('element')
 * 
 * Beispiel:
 * jQuery: $('#movie-grid')
 * Native: document.querySelector('#movie-grid')
 */

$(document).ready(function() {
    // MixItUp Initialisierung
    var mixer = mixitup('#movie-grid', {
        animation: {
            duration: 300
        }
    });

    // Zufällige Filmauswahl
    $('#randomMovieBtn').on('click', function() {
        // Alle Filmkarten sammeln
        const movieCards = $('.movie-card');
        // Zufällige Karte auswählen
        const randomIndex = Math.floor(Math.random() * movieCards.length);
        const selectedCard = movieCards.eq(randomIndex);
        
        // Animation für die ausgewählte Karte
        anime({
            targets: selectedCard[0],
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
            duration: 1000,
            easing: 'easeInOutQuad'
        });

        // Scroll zur ausgewählten Karte
        $('html, body').animate({
            scrollTop: selectedCard.offset().top - 100
        }, 1000);

        // Titel des ausgewählten Films anzeigen
        const movieTitle = selectedCard.find('.card-title').text();
        const movieYear = selectedCard.find('.card-text').text();
        
        // Toast-Benachrichtigung erstellen (rechts oben, 10 Sekunden)
        const toast = `
            <div class="position-fixed top-0 end-0 p-3" style="z-index: 1100;">
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-danger text-white">
                        <strong class="me-auto">Ihr Film für heute Abend:</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        <h5>${movieTitle}</h5>
                        <p>${movieYear}</p>
                    </div>
                </div>
            </div>
        `;
        $('.toast').remove();
        $('body').append(toast);
        setTimeout(() => {
            $('.toast').fadeOut(500, function() {
                $(this).remove();
            });
        }, 10000);
    });

    // Anime.js Animationen
    // Einleitungstext Animation
    anime({
        targets: '.intro h1, .lotr-quote',
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 1500,
        easing: 'easeOutExpo',
        delay: anime.stagger(200)
    });

    // Filmkarten Animation beim Laden
    anime({
        targets: '.movie-card',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: anime.stagger(100)
    });

    // Verbesserte Hover-Animation für Filmkarten
    $('.movie-card').hover(
        function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutQuad'
            });
            $(this).find('.card-title').css('color', '#007bff');
        },
        function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
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

    // Daten für Zitat des Tages und Character of the day
    const quotes = [
        "Nicht alle, die wandern, sind verloren. – Gandalf",
        "Ein Ring, sie zu knechten, sie alle zu finden... – Tolkien",
        "Selbst die kleinste Person kann den Lauf der Zukunft ändern. – Galadriel",
        "Es gibt immer Hoffnung. – Aragorn",
        "Manchmal sind die kleinsten Dinge die schwersten zu ertragen. – Samweis Gamdschie"
    ];
    const characters = [
        { name: "Gandalf", info: "Ein mächtiger Zauberer und Mitglied des Istari-Ordens." },
        { name: "Aragorn", info: "Der rechtmäßige Erbe des Throns von Gondor und Arnor." },
        { name: "Frodo Beutlin", info: "Der Ringträger und Held aus dem Auenland." },
        { name: "Galadriel", info: "Die Elbenkönigin von Lothlórien, weise und mächtig." },
        { name: "Samweis Gamdschie", info: "Frodos treuer Freund und Begleiter." }
    ];

    // Funktion für Zitat des Tages (rechts oben, 10 Sekunden)
    $('#quoteOfDayBtn').on('click', function() {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const toast = `
            <div class="position-fixed top-0 end-0 p-3" style="z-index: 1100;">
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-danger text-white">
                        <strong class="me-auto">Zitat des Tages</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        <span>${randomQuote}</span>
                    </div>
                </div>
            </div>
        `;
        $('.toast').remove();
        $('body').append(toast);
        setTimeout(() => {
            $('.toast').fadeOut(500, function() { $(this).remove(); });
        }, 10000);
    });

    // Funktion für Character of the day (rechts oben, 10 Sekunden)
    $('#characterOfDayBtn').on('click', function() {
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        const toast = `
            <div class="position-fixed top-0 end-0 p-3" style="z-index: 1100;">
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-danger text-white">
                        <strong class="me-auto">Character of the day</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        <b>${randomChar.name}</b><br>${randomChar.info}
                    </div>
                </div>
            </div>
        `;
        $('.toast').remove();
        $('body').append(toast);
        setTimeout(() => {
            $('.toast').fadeOut(500, function() { $(this).remove(); });
        }, 10000);
    });
}); 
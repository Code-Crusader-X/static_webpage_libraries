$(document).ready(function() {
    // LOTR Charaktere und Zitate
    const characters = [
        {
            name: "Gandalf der Graue",
            image: "images/gandalf.jpg",
            description: "Ein mächtiger Zauberer und Mitglied des Istari-Ordens. Als einer der Weisesten in Mittelerde spielt er eine zentrale Rolle im Kampf gegen Sauron.",
            quote: "Alle, die wandern, sind nicht verloren."
        },
        {
            name: "Aragorn",
            image: "images/aragorn.jpg",
            description: "Der rechtmäßige Erbe des Throns von Gondor und Arnor. Als Anführer der Dúnedain und später als König Elessar vereint er die Menschen von Mittelerde.",
            quote: "Ich schwöre bei meinem Leben und meiner Liebe zu dir, dass ich dich nicht im Stich lassen werde."
        },
        {
            name: "Galadriel",
            image: "images/galadriel.jpg",
            description: "Die mächtige Elbenkönigin von Lothlórien. Als eine der ältesten und weisesten Elben in Mittelerde besitzt sie große magische Kräfte.",
            quote: "Selbst die kleinste Person kann den Lauf der Zukunft ändern."
        }
    ];

    const quotes = [
        {
            text: "Es gibt immer Hoffnung.",
            author: "- Aragorn"
        },
        {
            text: "Nicht alle, die wandern, sind verloren.",
            author: "- Gandalf"
        },
        {
            text: "Ich wünschte, der Ring wäre nie zu mir gekommen. Ich wünschte, nichts davon wäre geschehen.",
            author: "- Frodo Beutlin"
        },
        {
            text: "Ein Hobbit? Bilbo Beutlin? Nun, das ist eine Überraschung!",
            author: "- Gandalf"
        },
        {
            text: "Manchmal sind die kleinsten Dinge die schwersten zu ertragen.",
            author: "- Samweis Gamdschie"
        }
    ];

    // Zufälliges Zitat anzeigen
    $('#randomQuoteBtn').on('click', function() {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        $('#quoteText').text(randomQuote.text);
        $('#quoteAuthor').text(randomQuote.author);
        
        // Animation für das Modal
        anime({
            targets: '#quoteModal .modal-content',
            translateY: [-50, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutExpo'
        });
        
        new bootstrap.Modal('#quoteModal').show();
    });

    // Charakter des Tages anzeigen
    $('#characterBtn').on('click', function() {
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
        const $charTitle = $('#characterName');
        $charTitle.text(randomCharacter.name);
        $charTitle.addClass('lotr-cinzel');
        $('#characterImage').attr('src', randomCharacter.image);
        $('#characterDescription').text(randomCharacter.description);
        $('#characterQuote').text(randomCharacter.quote);
        
        // Animation für das Modal
        anime({
            targets: '#characterModal .modal-content',
            translateY: [-50, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutExpo'
        });
        
        new bootstrap.Modal('#characterModal').show();
    });

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
        
        // Toast-Benachrichtigung erstellen
        const toast = `
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
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
        
        // Bestehende Toasts entfernen und neuen Toast hinzufügen
        $('.toast').remove();
        $('body').append(toast);
        
        // Toast nach 5 Sekunden ausblenden
        setTimeout(() => {
            $('.toast').fadeOut(500, function() {
                $(this).remove();
            });
        }, 5000);
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

    // Sicherstellen, dass der Zitat-Titel immer die Klasse hat
    $('#quoteModal .modal-title').addClass('lotr-cinzel');
}); 
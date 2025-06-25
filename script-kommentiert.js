$(function () { // jQuery Document Ready - Code wird ausgeführt sobald DOM geladen ist

  $.ajaxSetup({ headers: { "X-Auth-Token": "a534e63a0d68ad8ec00d" } }); // Setzt globalen AJAX-Header für Authentifizierung bei allen Requests

  var sort = localStorage.getItem("lotr_sort") || "popular"; // Lädt Sortierung aus localStorage oder setzt Default auf "popular"
  $("#sort-dropdown").val(sort); // Setzt den Wert des Sortier-Dropdowns auf die gespeicherte Sortierung
  loadTweets(); // Ruft Funktion zum Laden der Tweets auf

  var tweetID = 1; // Definiert Tweet-ID für Testzwecke (hardcoded)
  var voteType = "upvote"; // Definiert Vote-Typ für Testzwecke (hardcoded)
  $.get( // Führt GET-Request für Voting aus (Testcode)
    "https://www.nafra.at/adad_st2025/project/" + tweetID + "?type=" + voteType, // API-Endpoint für Voting mit Tweet-ID und Vote-Typ
    function (data) { // Callback-Funktion für erfolgreichen Request (leer)
    }
  );

  var tweetID = 1; // Erneute Definition der Tweet-ID (redundant)
  var formData = $(".create-comment-form").serialize(); // Serialisiert Formulardaten des Kommentar-Formulars
  $.post( // Führt POST-Request für Kommentar-Erstellung aus (Testcode)
    "https://www.nafra.at/adad_st2025/project/" + tweetID, // API-Endpoint für Kommentar-Erstellung
    formData, // Sendet serialisierte Formulardaten
    function (response) { // Callback-Funktion für erfolgreichen Request (leer)
    }
  );

  $("#sort-dropdown").on("change", function() { // Event-Handler für Änderung des Sortier-Dropdowns
    sort = $(this).val(); // Speichert den neuen Sortierungswert
    localStorage.setItem("lotr_sort", sort); // Speichert Sortierung persistent im localStorage
    loadTweets(); // Lädt Tweets mit neuer Sortierung neu
  });

  $("#create-note-form").on("submit", function(e) { // Event-Handler für Absenden des Tweet-Erstellungsformulars
    e.preventDefault(); // Verhindert Standard-Formular-Submit (Seitenreload)
    $("#create-note-form button[type=\"submit\"]").blur(); // Entfernt Fokus vom Submit-Button
    $.post( // Sendet POST-Request zur Tweet-Erstellung
      "https://www.nafra.at/adad_st2025/project/", // API-Endpoint für neue Tweets
      $(this).serialize(), // Serialisiert und sendet Formulardaten
      function () { // Callback-Funktion bei erfolgreichem Request
        loadTweets(); // Lädt Tweet-Liste neu
        $("#create-note-form")[0].reset(); // Setzt das Formular zurück (leert Felder)
      }
    );
  });

  function loadTweets() { // Funktion zum Laden und Anzeigen aller Tweets
    $.getJSON( // Führt GET-Request für JSON-Daten aus
      "https://www.nafra.at/adad_st2025/project/?sort=" + sort, // API-Endpoint mit Sortierungsparameter
      function (data) { // Callback-Funktion mit empfangenen Tweet-Daten
        $("#posts-container").empty(); // Leert den Container für Tweet-Anzeige
        data.forEach((tweet) => $("#posts-container").append(renderTweet(tweet))); // Iteriert über Tweets und fügt gerenderte HTML-Elemente hinzu
      }
    );
  }

  function renderTweet(tweet) { // Funktion zur HTML-Generierung für einzelne Tweets
    const timeAgo = moment(tweet.timestamp).fromNow(); // Berechnet relative Zeitangabe mit moment.js
    const commentsHtml = (tweet.comments || []).map(comment => ` // Generiert HTML für Kommentare oder leeres Array als Fallback
      <div class="comment"> // Container-Div für einzelnen Kommentar
        <span class="comment-user">${escapeHtml(comment.user)}:</span> // Zeigt escapten Benutzernamen des Kommentars
        <span class="comment-text">${escapeHtml(comment.text)}</span> // Zeigt escapten Kommentartext
        <span class="comment-time">(${moment(comment.timestamp).fromNow()})</span> // Zeigt relative Zeit des Kommentars
      </div>
    `).join("") + ` // Verbindet alle Kommentar-HTMLs zu einem String
      <form class="create-comment-form mt-2" data-tweetid="${tweet.id}"> // Formular für neue Kommentare mit Tweet-ID als Data-Attribut
        <input type="text" name="user" placeholder="Name" required /> // Eingabefeld für Benutzername (Pflichtfeld)
        <input type="text" name="text" placeholder="Dein Kommentar" required /> // Eingabefeld für Kommentartext (Pflichtfeld)
        <button type="submit">Kommentieren</button> // Submit-Button für Kommentar
      </form>
    `;
    return ` // Returniert vollständiges Tweet-HTML
      <div class="tweet-card" data-tweetid="${tweet.id}"> // Haupt-Container für Tweet mit ID als Data-Attribut
        <div class="d-flex justify-content-between align-items-center"> // Flex-Container für Benutzer und Zeit
          <span class="tweet-user">${escapeHtml(tweet.user)}</span> // Zeigt escapten Tweet-Autor
          <span class="tweet-time">${timeAgo}</span> // Zeigt relative Zeitangabe
        </div>
        <div class="tweet-text">${escapeHtml(tweet.text)}</div> // Zeigt escapten Tweet-Inhalt
        <button class="btn btn-secondary btn-translate-ork mt-1" data-text="${escapeHtml(tweet.text)}">Auf Orkisch übersetzen</button> // Button für Orkisch-Übersetzung mit Original-Text als Data-Attribut
        <div class="tweet-text orcish mt-1 d-none"></div> // Container für Orkisch-Übersetzung (initial versteckt)
        <div class="tweet-reactions my-2"> // Container für Reaktions-Buttons
          <button class="btn-praise" data-vote="upvote"> // Upvote-Button mit Vote-Typ als Data-Attribut
            Aufheizen 🔥 (${tweet.reactions}) // Button-Text mit Reaktions-Anzahl
          </button>
          <button class="btn-curse" data-vote="downvote"> // Downvote-Button mit Vote-Typ als Data-Attribut
            Verfluchen 💀 // Button-Text
          </button>
        </div>
        <div class="comment-section"> // Container für Kommentar-Bereich
          <div class="mb-1"><b>Kommentare:</b></div> // Überschrift für Kommentare
          ${commentsHtml} // Eingefügtes HTML für alle Kommentare und Kommentar-Formular
        </div>
      </div>
    `;
  }

  $("#posts-container").on("click", ".btn-praise, .btn-curse", function() { // Event-Delegation für Upvote/Downvote-Buttons
    const tweetID = $(this).closest(".tweet-card").data("tweetid"); // Ermittelt Tweet-ID vom nächsten übergeordneten Tweet-Container
    const voteType = $(this).data("vote"); // Ermittelt Vote-Typ vom geklickten Button
    $.get( // Sendet GET-Request für Voting
      "https://www.nafra.at/adad_st2025/project/" + tweetID + "?type=" + voteType, // API-Endpoint mit Tweet-ID und Vote-Typ
      loadTweets // Callback-Funktion lädt Tweets nach Vote neu
    );
  });

  $("#posts-container").on("submit", ".create-comment-form", function(e) { // Event-Delegation für Kommentar-Formulare
    e.preventDefault(); // Verhindert Standard-Formular-Submit
    const tweetID = $(this).data("tweetid"); // Ermittelt Tweet-ID vom Formular-Data-Attribut
    $.post( // Sendet POST-Request für neuen Kommentar
      "https://www.nafra.at/adad_st2025/project/" + tweetID, // API-Endpoint für Kommentare mit Tweet-ID
      $(this).serialize(), // Serialisiert und sendet Formulardaten
      loadTweets // Callback-Funktion lädt Tweets nach Kommentar neu
    );
  });

  function escapeHtml(text) { // Funktion zur HTML-Escaping für XSS-Schutz
    return text.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","\'":"&#039;"}[c])); // Ersetzt gefährliche HTML-Zeichen durch HTML-Entities
  }

  if (typeof moment !== "undefined") moment.locale("de"); // Setzt moment.js auf deutsche Lokalisierung falls verfügbar
});

$("#posts-container").on("click", ".btn-translate-ork", function() { // Event-Handler für Orkisch-Übersetzungs-Button (außerhalb Document Ready)
  const button = $(this); // Speichert Referenz auf geklickten Button
  const tweetCard = button.closest(".tweet-card"); // Findet übergeordneten Tweet-Container
  const orcishDiv = tweetCard.find(".orcish"); // Findet Orkisch-Text-Container
  const originalText = button.data("text"); // Holt Original-Text aus Data-Attribut
  
  if (orcishDiv.hasClass("d-none")) { // Prüft ob Orkisch-Text aktuell versteckt ist
    const orcishTranslation = translateToOrcish(originalText); // Übersetzt Text ins Orkische
    orcishDiv.text(orcishTranslation).removeClass("d-none"); // Setzt übersetzten Text und macht ihn sichtbar
    button.text("Original anzeigen"); // Ändert Button-Text
  } else { // Falls Orkisch-Text bereits sichtbar ist
    orcishDiv.addClass("d-none"); // Versteckt Orkisch-Text wieder
    button.text("Auf Orkisch übersetzen"); // Setzt ursprünglichen Button-Text zurück
  }
});

function translateToOrcish(text) { // Funktion zur Übersetzung von Deutsch ins "Orkische"
  return text.toLowerCase() // Konvertiert Text zu Kleinbuchstaben
    .replace(/hallo/gi, "lok tar") // Ersetzt "hallo" mit "lok tar" (case-insensitive)
    .replace(/tschüss/gi, "zug zug") // Ersetzt "tschüss" mit "zug zug"
    .replace(/danke/gi, "me not that kind of orc") // Ersetzt "danke" mit Orc-Phrase
    
    .replace(/freund/gi, "uruk") // Ersetzt "freund" mit "uruk"
    .replace(/feind/gi, "skai") // Ersetzt "feind" mit "skai"
    .replace(/mensch/gi, "umie") // Ersetzt "mensch" mit "umie"
    
    .replace(/gut/gi, "goth") // Ersetzt "gut" mit "goth"
    .replace(/schlecht/gi, "ghash") // Ersetzt "schlecht" mit "ghash"
    .replace(/schön/gi, "purty") // Ersetzt "schön" mit "purty"
    .replace(/hässlich/gi, "ugsome") // Ersetzt "hässlich" mit "ugsome"
    
    .replace(/ja/gi, "aye") // Ersetzt "ja" mit "aye"
    .replace(/nein/gi, "nul") // Ersetzt "nein" mit "nul"
    .replace(/vielleicht/gi, "mebbe") // Ersetzt "vielleicht" mit "mebbe"
    
    .replace(/der|die|das/gi, "agh") // Ersetzt deutsche Artikel mit "agh"
    .replace(/ein|eine/gi, "sum") // Ersetzt unbestimmte Artikel mit "sum"
    
    .replace(/und/gi, "ok") // Ersetzt "und" mit "ok"
    .replace(/oder/gi, "or mebbe") // Ersetzt "oder" mit "or mebbe"
    .replace(/aber/gi, "but") // Ersetzt "aber" mit "but"
    
    .replace(/ich/gi, "me") // Ersetzt "ich" mit "me"
    .replace(/du/gi, "you") // Ersetzt "du" mit "you"
    .replace(/wir/gi, "us") // Ersetzt "wir" mit "us"
    .replace(/ihr/gi, "yous") // Ersetzt "ihr" mit "yous"
    
    .replace(/eins/gi, "one") // Ersetzt "eins" mit "one"
    .replace(/zwei/gi, "two") // Ersetzt "zwei" mit "two"
    .replace(/drei/gi, "few") // Ersetzt "drei" mit "few"
    .replace(/vier|fünf|sechs|sieben|acht|neun|zehn/gi, "lots") // Ersetzt höhere Zahlen mit "lots"
    
    .replace(/heute/gi, "dis day") // Ersetzt "heute" mit "dis day"
    .replace(/gestern/gi, "yesterday") // Ersetzt "gestern" mit "yesterday"
    .replace(/morgen/gi, "tomorrow") // Ersetzt "morgen" mit "tomorrow"
    .replace(/jetzt/gi, "now") // Ersetzt "jetzt" mit "now"
    
    .replace(/gehen/gi, "go") // Ersetzt "gehen" mit "go"
    .replace(/kommen/gi, "come") // Ersetzt "kommen" mit "come"
    .replace(/kämpfen/gi, "fight") // Ersetzt "kämpfen" mit "fight"
    .replace(/essen/gi, "eat") // Ersetzt "essen" mit "eat"
    .replace(/trinken/gi, "drink") // Ersetzt "trinken" mit "drink"
    
    .replace(/computer/gi, "magic box") // Ersetzt "computer" mit "magic box"
    .replace(/internet/gi, "big magic") // Ersetzt "internet" mit "big magic"
    .replace(/handy|smartphone/gi, "tiny magic") // Ersetzt mobile Geräte mit "tiny magic"
    
    .replace(/ring/gi, "shiny") // Ersetzt "ring" mit "shiny" (LOTR-Referenz)
    .replace(/gandalf/gi, "pointy hat") // Ersetzt "gandalf" mit "pointy hat" (LOTR-Referenz)
    .replace(/frodo/gi, "tiny man") // Ersetzt "frodo" mit "tiny man" (LOTR-Referenz)
    .replace(/mordor/gi, "home") // Ersetzt "mordor" mit "home" (LOTR-Referenz)
    
    .replace(/nafra/gi, "da boss") // Ersetzt "nafra" mit "da boss" (projektspezifisch)
    .replace(/tweet/gi, "growl") // Ersetzt "tweet" mit "growl"
    .replace(/like/gi, "gud") // Ersetzt "like" mit "gud"
    .replace(/kommentar/gi, "words") // Ersetzt "kommentar" mit "words"
    
    + " *grummelt auf orkisch*"; // Fügt Orc-typischen Zusatz am Ende hinzu
};
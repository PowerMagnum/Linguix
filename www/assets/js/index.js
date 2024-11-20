// Funzioni di supporto per la divisione in sillabe
function isVowel(c) {
    return "AEIOUÁÉÍÓÚÀÈÌÒÙ".indexOf(c.toUpperCase()) !== -1;
}

function divide(word) {
    var a = word.toUpperCase();
    var result = "";
    var s = 0;
    while (s < a.length) {
        if (!isVowel(a.charAt(s))) {
            result += word.charAt(s); 
            s++;
        } else if (!isVowel(a.charAt(s + 1))) {
            if (s + 2 >= a.length) {
                result += word.substring(s, s + 2) + "-"; 
                s += 2;
            } else if (isVowel(a.charAt(s + 2))) {
                result += word.charAt(s) + "-"; 
                s++;
            } else if (a.charAt(s + 1) === a.charAt(s + 2)) {
                result += word.substring(s, s + 2) + "-"; 
                s += 2;
            } else if ("SG".indexOf(a.charAt(s + 1)) !== -1) {
                result += word.charAt(s) + "-"; 
                s++;
            } else if ("RLH".indexOf(a.charAt(s + 2)) !== -1) {
                result += word.charAt(s) + "-"; 
                s++;
            } else {
                result += word.substring(s, s + 2) + "-"; 
                s += 2;
            }
        } else if ("IÍÌ".indexOf(a.charAt(s + 1)) !== -1) {
            if (s > 1 && a.substring(s - 1, s + 1) === "QU" && isVowel(a.charAt(s + 2))) {
                result += word.substring(s, s + 2); 
                s += 2;
            } else if (isVowel(a.charAt(s + 2))) {
                result += word.charAt(s) + "-"; 
                s++;
            } else {
                result += word.charAt(s); 
                s++;
            }
        } else if ("IÍÌUÚÙ".indexOf(a.charAt(s)) !== -1) {
            result += word.charAt(s); 
            s++;
        } else {
            result += word.charAt(s) + "-"; 
            s++;
        }
    }

    if (result.charAt(result.length - 1) === "-")
        result = result.substring(0, result.length - 1);
    return result;
}

function divide_sentence(s) {
    if (!s) return "";

    var result = "";
    while (s.length > 0) {
        let wordMatch = s.match(/^[a-záéíóúàèìòù]+/i);
        if (wordMatch) {
            result += divide(wordMatch[0]);
            s = s.substring(wordMatch[0].length);
        }

        let separatorMatch = s.match(/^[^a-záéíóúàèìòù]+/i);
        if (separatorMatch) {
            result += separatorMatch[0];
            s = s.substring(separatorMatch[0].length);
        }
    }
    return result;
}

function evidenziaSillabe(frase) {
    const parole = frase.replace(/\n/g, "<br/>\n").split(' ');
    const container = document.getElementById('parolaContainer');
    container.innerHTML = '';
    parole.forEach(parola => {
        const sillabe = divide_sentence(parola).split('-');
        sillabe.forEach(sillaba => {
            const span = document.createElement('span');
            span.classList.add('sillaba');
            span.textContent = sillaba.toUpperCase();
            container.appendChild(span);
        });
        const spanSpazio = document.createElement('span');
        spanSpazio.classList.add('spazio');
        container.appendChild(spanSpazio);
    });
}

// Gestione della parola generata
let parolaGenerata = "";
let id_img = 0;

$(document).ready(function () {
    // Genera parola
    $('#fetchButton').on('click', function () {
        const fs2Value = $('#fs2').val();
        const url = `http://localhost:3000/proxy?fs2=${fs2Value}`;
        $.get(url, function (data) {
            const $html = $(data);
            const testo = $html.find('div[style*="color:#6200C5"]').text().trim();
            parolaGenerata = testo;
            id_img = 0;
            $('#traduzioni').html("");
            $('#containerImmagine').html("");
            evidenziaSillabe(testo);
        });
    });

    // Traduci parola
    $('#translate').on('click', function () {
        const url = `http://localhost:3000/translate?word=${parolaGenerata}&lang=arabic`;
        $.get(url, function (data) {
            let reductor = parolaGenerata.split(' ').length > 2 ? 1 : 5;
            const limitedData = data.slice(0, reductor);
            const traduzioniHTML = limitedData.map(item => `[${item}]`).join(" - ");
            $('#traduzioni').html(traduzioniHTML);
        });
    });

    // Visualizza immagine
    $('#visualizza').on('click', function () {
        const url = `http://localhost:3000/translate?word=${parolaGenerata}&lang=english`;
        $.get(url, function (data) {
            console.log(data[0]);
            visual(data[0]);
        });
    });

    function visual(parola) {
        const pixabayURL = `http://localhost:3000/pixabay?q=${encodeURIComponent(parola)}`;
        $.get(pixabayURL, function (response) {
            if (response.hits.length > 0) {
                const imageUrl = response.hits[id_img].webformatURL;
                id_img = (id_img + 1) % 10;
                $('#containerImmagine').html(`<img src="${imageUrl}" alt="${parola}" id='immagine'>`);
            } else {
                $('#containerImmagine').html("Nessuna immagine trovata.");
            }
        }).fail(() => {
            $('#containerImmagine').html("Errore durante il caricamento dell'immagine.");
        });
    }

    $('#visualizza').contextmenu(function (event) {
        event.preventDefault();
        $('#containerImmagine').html("");
    });

    // Ricerca immagine Google
    $('#googleImg').on('click', function () {
        const googleSearchURL = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(parolaGenerata)}`;
        window.open(googleSearchURL, '_blank');
    });

    // Gestione barra di testo
    $('#toggle-bar').on('change', function () {
        const textBar = document.getElementById('text-bar');
        if (this.checked) {
            textBar.classList.remove('hidden');
            $(".generator").hide();
            $("#testoLibero").val(parolaGenerata);
        } else {
            textBar.classList.add('hidden');
            $(".generator").show();
        }
    });

    $("#testoLibero").on('keyup', function () {
        $('#traduzioni').html("");
        $('#containerImmagine').html("");
        parolaGenerata = $("#testoLibero").val();
        evidenziaSillabe(parolaGenerata);
    });
});

// ##DORIAN##
// Constantes et variables
const socket = io()
// ##BENJAMIN##
const FiltreLien = /(http|ftp|https):\/\/(\S{3,})/;
const Filtreimage = /(http|ftp|https):\/\/(\S{3,})\.(jpg|jpeg|gif|svg|png)/; // Chaine de caractère permettant de détecter les images
const FiltreVidéo = /https:\/\/youtu\.be\/\S{11,}/; // Chaine de caractère permettant de détecter les vidéos YouTube

// ##DORIAN##
socket.on("chat", addChat)

$(() => {
    getChats() // Récupère les messages déjâ dans la base et les affiches.
    // ##LÉO##
    dialogPseudo()
    desactiveForm()
    
    // ##DORIAN##
    $("#send").submit(() => {
        const texte = $("#txtMessage").val();
        var chatMessage = { // $ = getElementById, la variable "texte" prend comme valeur le contenu de la textarea avec comme ID texte
            chat: FormateurDeLien(texte),
            // ##LEO##
            pseudo: $("#txtPseudo").val(),
            // ##BENJAMIN##
            heure: CompilateurHeure()
        }
        // ##DORIAN##
        event.preventDefault(); // Empêche le refresh de la page à chaque envoi d'un message (<3)
        postChat(chatMessage)
        // ##BENJAMIN##
        $("#txtMessage").val("") // Vide la textearea après l'envoi du message
    })
})

// ##DORIAN##
function postChat(chat) {
    $.post("http://localhost:3020/chats", chat) // Envoie le message dans la base de donnée.
}

function getChats() {
    $.get("/chats", (chats) => { // Récupère les messages de la base de donnée.
        chats.forEach(addChat) // et les assemblent.
    })
}

// ##LEO##
function addChat(chatObj) { // Modèle pour l'envoi des messsages
    $("#messages").append(`<li class="mdl-list__item mdl-list__item--three-line">
    <span class="mdl-list__item-primary-content">
    <img class="mrsh-avatar" src="https://api.adorable.io/avatars/50/${chatObj.pseudo}@adorable.io.png">
    <span>${chatObj.pseudo}</span> _ <span class="mrsh-heure">${chatObj.heure}</span>
    <span class="mdl-list__item-text-body">${chatObj.chat}</span>
    </span>
    </li>`); // Syntaxe du message
}

// Fonction pour la boite de dialogue du pseudo
function dialogPseudo() {
    var dialog = document.querySelector("dialog");
    window.addEventListener("load", function() { // Ouvre la boite de dialogue au chargement de la page
        dialog.showModal();
    });
    dialog.querySelector(".close").addEventListener("click", function() { // Ferme la boite de dialogue lorsque l'on clique sur le bouton "Confirmer"
        dialog.close();
    });
}

// Fonction pour l'input de la boite de dialogue
function desactiveForm() { // Désactive le refresh de la page de l'input
    $("#desactive").on("keyup keypress", function(event) {
        var touche = event.touche || event.which; // event.which permet de savoir quelle touche à été utilisée
        if (touche === 13) { // Si cette touche est le numéro 13 (touche entrée)...
            event.preventDefault(); // Désactive le rechargement de la page
        }
    });
}

// ##BENJAMIN##
// Fonction pour mettre en forme les liens
function FormateurDeLien(TexteaTraiter) {
    if (FiltreVidéo.test(TexteaTraiter)) { // Vérifie la présence d'un lien
        var TexteTraité = TexteaTraiter.replace(FiltreVidéo, function(nouveaulien) { // remplace l'élément correspondant à l'expression régulière par la syntaxe ci-dessous
            return '<br><iframe width="560" height="315" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen scr="' + nouveaulien + '"></iframe><br>'
        })
        return TexteTraité;
    } else if (Filtreimage.test(TexteaTraiter)) { // Vérifie la présence d'une image
        var TexteTraité = TexteaTraiter.replace(Filtreimage, function(nouveaulien) { // remplace l'élément correspondant à l'expression régulière par la syntaxe ci-dessous
            return '<br><img class="ContenuChat" scr="' + nouveaulien + '">' + '</img><br>'
        })
        return TexteTraité;
    } else if (FiltreLien.test(TexteaTraiter)) { // // Vérifie la présence d'une vidéo YouTube
        var TexteTraité = TexteaTraiter.replace(FiltreLien, function(nouveaulien) { // remplace l'élément correspondant à l'expression régulière par la syntaxe ci-dessous
            return '<a href="' + nouveaulien + '">' + nouveaulien + '</a>'
        })
        return TexteTraité;
    } else {
        return TexteaTraiter;
    }
}

// Fonction pour l'heure
function CompilateurHeure() {
    var j = new Date();
    var j1 = j.getDay();
    switch (j1) {
        case 1:
            var jour = "lundi";
            break;
        case 2:
            var jour = "mardi";
            break;
        case 3:
            var jour = "mercredi";
            break;
        case 4:
            var jour = "jeudi";
            break;
        case 5:
            var jour = "vendredi";
            break;
        case 6:
            var jour = "samedi";
            break;
        case 0:
            var jour = "dimanche";
            break;

    }
    var m = new Date();
    var m1 = m.getMonth();
    switch (m1) {
        case 0:
            var mois = "janvier"
            break;
        case 1:
            var mois = "février"
            break;
        case 2:
            var mois = "mars"
            break;
        case 3:
            var mois = "avril"
            break;
        case 4:
            var mois = "mai"
            break;
        case 5:
            var mois = "juin"
            break;
        case 6:
            var mois = "juillet"
            break;
        case 7:
            var mois = "août"
            break;
        case 8:
            var mois = "septembre"
            break;
        case 9:
            var mois = "octobre"
            break;
        case 10:
            var mois = "novembre"
            break;
        case 11:
            var mois = "décembre"
            break;

    }
    var d = new Date();
    var date = String(d.getDate());
    var h = new Date();
    var heures = String(h.getHours());
    var min = new Date();
    var minutes = min.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var temps = jour + '&nbsp;' + date + '&nbsp;' + mois + '&nbsp;(' + heures + ':' + minutes + ')';
    return String(temps);
}

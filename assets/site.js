/* ===========================================================================
   T.N.G SERVICE INTERNATIONAL · comportements de la maquette
   =========================================================================== */
(function () {
  'use strict';

  /* --- année dynamique (le site affiche « ©2022 » depuis quatre ans) ------ */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* --- avertisseur -------------------------------------------------------- */
  var toast = document.getElementById('toast');
  var timer = null;
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.setAttribute('data-show', '1');
    window.clearTimeout(timer);
    timer = window.setTimeout(function () { toast.removeAttribute('data-show'); }, 5200);
  }

  /* --- langues FR / EN / 中文 --------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('.lang button'), function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('aria-current') === 'true') return;
      var l = b.dataset.lang;
      say('Version ' + (l === 'zh' ? '中文' : l.toUpperCase()) + ' : arborescence /' + l +
          '/, hreflang et police couvrant le chinois simplifié déjà en place. Reste la traduction.');
    });
  });

  /* --- bandeau de maquette ------------------------------------------------ */
  var mb = document.getElementById('mockbar');
  if (mb) {
    var x = mb.querySelector('button');
    if (x) x.addEventListener('click', function () { mb.hidden = true; });
  }

  /* --- formulaire de contact : il n'en existe aucun sur le site actuel ---- */
  var cf = document.getElementById('contact-form');
  if (cf) {
    cf.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var msg = cf.querySelector('.form-msg');
      var nom = cf.querySelector('#cf-nom');
      var mail = cf.querySelector('#cf-mail');
      msg.hidden = false;
      msg.setAttribute('role', 'status');
      if (!nom.value.trim() || !mail.value.trim()) {
        msg.textContent = 'Merci de renseigner au minimum votre nom et votre adresse e-mail.';
        (nom.value.trim() ? mail : nom).focus();
        return;
      }
      msg.textContent = 'Maquette : le message n’est pas envoyé. En production, il arrive sur ' +
        'contact@tng-international.com, avec accusé de réception automatique et réponse sous 24 h ouvrées.';
    });
  }

  /* =======================================================================
     « Suis-je concerné ? » · sélection de produits → filières applicables
     ======================================================================= */

  var FIL = {
    eee: {
      code: 'EEE', nom: 'Équipements électriques et électroniques',
      quoi: 'Tout appareil fonctionnant grâce à un courant électrique ou un champ électromagnétique, y compris les accessoires connectés.',
      org: 'ecosystem ou Ecologic'
    },
    pa: {
      code: 'PA', nom: 'Piles et accumulateurs',
      quoi: 'Piles vendues seules, mais aussi piles et batteries intégrées à un appareil ou fournies avec lui.',
      org: 'Corepile ou Screlec'
    },
    emb: {
      code: 'EMB', nom: 'Emballages',
      quoi: 'Tout ce qui contient, protège ou présente le produit, jusqu’au carton d’expédition d’une commande en ligne.',
      org: 'Citeo ou Adelphe'
    },
    tlc: {
      code: 'TLC', nom: 'Textiles, linge de maison, chaussures',
      quoi: 'Vêtements, linge, chaussures neufs destinés aux ménages.',
      org: 'Refashion'
    },
    dea: {
      code: 'DEA', nom: 'Éléments d’ameublement',
      quoi: 'Meubles et éléments de décoration meublante, y compris en kit.',
      org: 'Ecomaison ou Valdelia'
    },
    pap: {
      code: 'PAP', nom: 'Papiers graphiques',
      quoi: 'Papiers à usage graphique, imprimés publicitaires, catalogues.',
      org: 'Citeo'
    },
    pnu: {
      code: 'PNU', nom: 'Pneumatiques',
      quoi: 'Pneus neufs ou rechapés, vendus seuls ou montés.',
      org: 'Aliapur ou GIE France Recyclage Pneumatiques'
    }
  };

  var picker = document.getElementById('picker');
  if (!picker) return;

  var btn = document.getElementById('pk-go');
  var reset = document.getElementById('pk-reset');
  var out = document.getElementById('pk-out');

  function selected() {
    return Array.prototype.map.call(
      picker.querySelectorAll('input[name="prod"]:checked'),
      function (i) { return i.value; }
    );
  }

  picker.addEventListener('submit', function (e) { e.preventDefault(); btn.click(); });

  btn.addEventListener('click', function () {
    var s = selected();
    if (!s.length) {
      say('Cochez au moins une catégorie de produit pour afficher les filières qui vous concernent.');
      var f = picker.querySelector('input[name="prod"]');
      if (f) f.focus();
      return;
    }

    var rows = s.map(function (k) {
      var f = FIL[k];
      return '<li><svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">' +
        '<path d="M2 8.5 6 12.3 14 3.7" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>' +
        '<div><b>' + f.nom + ' <span class="uin">' + f.code + '</span></b>' +
        '<p>' + f.quoi + '</p>' +
        '<p class="uin" style="color:var(--ink-3);font-size:var(--step--2);margin-top:0.3rem">' +
        'Éco-organisme : ' + f.org + '</p></div></li>';
    }).join('');

    out.innerHTML =
      '<div class="outcome__hd">' +
      '<h3>' + s.length + ' filière' + (s.length > 1 ? 's' : '') + ' vous concerne' + (s.length > 1 ? 'nt' : '') + '</h3>' +
      '<p>Soit ' + s.length + ' identifiant' + (s.length > 1 ? 's' : '') + ' unique' + (s.length > 1 ? 's' : '') +
      ' à obtenir, ' + (s.length > 1 ? 'autant de contrats d’adhésion' : 'un contrat d’adhésion') +
      ' et une déclaration annuelle par filière.</p></div>' +
      '<div class="outcome__body">' +
      '<h4>Détail</h4><ul class="olist">' + rows + '</ul>' +
      '<h4>Ce que nous prenons en charge</h4>' +
      '<p style="font-size:var(--step--1);color:var(--ink-2);margin:0">' +
      'L’immatriculation et l’obtention des ' + s.length + ' numéro' + (s.length > 1 ? 's' : '') +
      ', la déclaration de vos ventes aux éco-organismes, puis le calcul et le versement des éco-contributions. ' +
      'Vous n’avez qu’un interlocuteur, en français, en anglais ou en chinois.</p>' +
      '</div>' +
      '<div class="outcome__ft">' +
      '<a class="btn" href="tel:+33608544998">Appeler&nbsp;: 06 08 54 49 98</a>' +
      '<a class="btn btn--line" href="#contact">Écrire</a>' +
      '<p>Le premier échange sert à qualifier vos produits, pas à vendre.</p></div>';

    out.hidden = false;
    out.setAttribute('tabindex', '-1');
    out.focus();
  });

  reset.addEventListener('click', function () {
    Array.prototype.forEach.call(picker.querySelectorAll('input[name="prod"]'), function (i) { i.checked = false; });
    out.hidden = true;
  });
})();

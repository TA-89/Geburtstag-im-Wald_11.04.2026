/* ================================================================
   script.js — Geburtstagseinladung 11. April 2026
   ================================================================

   WHATSAPP-NUMMER ÄNDERN:
   Variable WHATSAPP_NUMBER direkt unten (Zeile ~20) anpassen.
   Format: Ländervorwahl ohne + oder 00, direkt gefolgt von der
   Nummer ohne Leerzeichen, Punkte oder Bindestriche.

   Beispiel Schweiz +41 79 242 20 34  →  41792422034
   Beispiel Deutschland +49 170 1234567  →  491701234567

   ================================================================ */

'use strict';


/* ----------------------------------------------------------------
   KONFIGURATION
   ---------------------------------------------------------------- */

/**
 * !! WHATSAPP-NUMMER HIER ÄNDERN !!
 * Schweizer Nummer: +41 79 242 20 34  →  41792422034
 */
const WHATSAPP_NUMBER = '41792422034';


/* ----------------------------------------------------------------
   DOM-Referenzen (werden nach DOMContentLoaded gesetzt)
   ---------------------------------------------------------------- */
let form;
let fieldName;
let fieldPersonen;
let fieldWuerste;
let fieldSonstiges;
let errorName;
let heroCta;
let confirmModal;
let modalCloseBtn;
let modalOkBtn;


/* ================================================================
   1. SCROLL-ANIMATION (Reveal on Scroll)
   Elemente mit der CSS-Klasse .reveal werden beim Einrollen
   in den sichtbaren Bereich mit einer Fade-up-Animation sichtbar.
   ================================================================ */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Fallback für sehr alte Browser ohne IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Jedes Element nur einmal animieren, dann Beobachtung stoppen
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.10,           // Trigger bei 10% Sichtbarkeit
      rootMargin: '0px 0px -40px 0px'  // Etwas früher starten
    }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}


/* ================================================================
   2. SMOOTH SCROLL – Hero-Button zur Anmeldung
   Der CTA-Button im Hero scrollt sanft zur Formular-Sektion
   und setzt dann den Fokus auf das erste Eingabefeld.
   ================================================================ */
function initHeroCta() {
  if (!heroCta) return;

  heroCta.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.getElementById('anmeldung');
    if (!target) return;

    // Sanfter Scroll zum Formular
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Fokus auf Namens-Input nach Scroll-Ende (leichte Verzögerung)
    setTimeout(function () {
      if (fieldName) {
        fieldName.focus({ preventScroll: true });
      }
    }, 650);
  });
}


/* ================================================================
   3. FORMULAR-VALIDIERUNG
   Nur das Namensfeld ist Pflichtfeld.
   Fehlermeldungen werden barrierefrei angezeigt.
   ================================================================ */
function validateForm() {
  const nameValue = fieldName ? fieldName.value.trim() : '';
  let isValid = true;

  if (!nameValue) {
    showFieldError(
      fieldName,
      errorName,
      'Bitte gib deinen Namen ein.'
    );
    isValid = false;
  } else {
    clearFieldError(fieldName, errorName);
  }

  return isValid;
}

/** Zeigt eine Fehlermeldung für ein Eingabefeld an */
function showFieldError(inputEl, errorEl, message) {
  if (!inputEl || !errorEl) return;
  inputEl.classList.add('is-invalid');
  errorEl.textContent = message;
}

/** Entfernt die Fehlermeldung eines Eingabefelds */
function clearFieldError(inputEl, errorEl) {
  if (!inputEl || !errorEl) return;
  inputEl.classList.remove('is-invalid');
  errorEl.textContent = '';
}

/** Live-Validierung: Fehler verschwindet sobald der User tippt */
function initLiveValidation() {
  if (!fieldName) return;

  fieldName.addEventListener('input', function () {
    if (fieldName.value.trim()) {
      clearFieldError(fieldName, errorName);
    }
  });
}


/* ================================================================
   4. WHATSAPP-NACHRICHT AUFBAUEN
   Erstellt den Nachrichtentext aus den Formularwerten.
   !! Nachrichtenformat unten im Template-Literal anpassen !!
   ================================================================ */
function buildWhatsAppMessage() {
  const name      = fieldName      ? fieldName.value.trim()      : '—';
  const personen  = fieldPersonen  ? fieldPersonen.value         : '1';
  const wuerste   = fieldWuerste   ? fieldWuerste.value          : '1';

  // Sonstiges: Fallback-Text wenn leer
  const sonstigesRaw = fieldSonstiges ? fieldSonstiges.value.trim() : '';
  const sonstiges    = sonstigesRaw || 'Keine Angaben';

  // !! Nachrichtentext hier anpassen !!
  const message =
    'Ich/Wir kommen gerne \uD83C\uDF89\n\n' +
    'Namen: '            + name     + '\n' +
    'Anzahl Personen: '  + personen + '\n' +
    'Anzahl W\u00FCrste: '+ wuerste + '\n' +
    'Sonstiges: '        + sonstiges + '\n\n' +
    'Danke, wir freuen uns!';

  return message;
}


/* ================================================================
   5. WHATSAPP-LINK ÖFFNEN
   Öffnet WhatsApp Web oder die App mit vorausgefüllter Nachricht.
   ================================================================ */
function openWhatsApp(message) {
  // URL-kodierte Nachricht erstellen
  const encoded = encodeURIComponent(message);

  /**
   * !! WHATSAPP-NUMMER: wird oben in WHATSAPP_NUMBER definiert !!
   * wa.me-Format: https://wa.me/[NUMMER]?text=[KODIERTER TEXT]
   */
  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encoded;

  // In neuem Tab öffnen, ohne Referrer-Information weiterzugeben
  window.open(url, '_blank', 'noopener,noreferrer');
}


/* ================================================================
   6. BESTÄTIGUNGS-MODAL
   Öffnet und schliesst das Overlay nach der Anmeldung.
   ================================================================ */
function openConfirmModal() {
  if (!confirmModal) return;
  confirmModal.hidden = false;
  document.body.style.overflow = 'hidden'; // Hintergrund fixieren
  // Fokus auf OK-Button setzen (Accessibility)
  setTimeout(function () {
    if (modalOkBtn) modalOkBtn.focus();
  }, 100);
}

function closeConfirmModal() {
  if (!confirmModal) return;
  confirmModal.hidden = true;
  document.body.style.overflow = '';
}

function initModal() {
  if (!confirmModal) return;

  // Schliessen per X-Button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeConfirmModal);
  }

  // Schliessen per OK-Button
  if (modalOkBtn) {
    modalOkBtn.addEventListener('click', closeConfirmModal);
  }

  // Schliessen per Klick auf den Hintergrund
  confirmModal.addEventListener('click', function (e) {
    if (e.target === confirmModal) {
      closeConfirmModal();
    }
  });

  // Schliessen per Escape-Taste
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !confirmModal.hidden) {
      closeConfirmModal();
    }
  });
}


/* ================================================================
   7. FORMULAR SUBMIT
   Validiert das Formular, öffnet WhatsApp und zeigt das Modal.
   ================================================================ */
function initFormSubmit() {
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validierung prüfen
    const isValid = validateForm();
    if (!isValid) {
      // Fokus auf fehlerhaftes Feld setzen (Accessibility)
      if (fieldName && fieldName.classList.contains('is-invalid')) {
        fieldName.focus();
      }
      return;
    }

    // WhatsApp-Nachricht erzeugen und öffnen
    const message = buildWhatsAppMessage();
    openWhatsApp(message);

    // Bestätigungs-Modal anzeigen
    openConfirmModal();
  });
}


/* ================================================================
   8. INITIALISIERUNG
   Alle Funktionen nach vollständigem DOM-Load starten.
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  // DOM-Referenzen setzen
  form           = document.getElementById('rsvp-form');
  fieldName      = document.getElementById('field-name');
  fieldPersonen  = document.getElementById('field-personen');
  fieldWuerste   = document.getElementById('field-wuerste');
  fieldSonstiges = document.getElementById('field-sonstiges');
  errorName      = document.getElementById('error-name');
  heroCta        = document.getElementById('hero-cta-btn');
  confirmModal   = document.getElementById('confirm-modal');
  modalCloseBtn  = document.getElementById('modal-close-btn');
  modalOkBtn     = document.getElementById('modal-ok-btn');

  // Module initialisieren
  initReveal();
  initHeroCta();
  initLiveValidation();
  initFormSubmit();
  initModal();

});

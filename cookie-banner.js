/**
 * GDS Cookie Banner
 * Gestione consenso cookie conforme GDPR / Linee Guida Garante 2021
 */
(function () {
  'use strict';

  var COOKIE_KEY = 'gds_cookie_consent';
  var COOKIE_DAYS = 365;

  // ── Helpers cookie ──────────────────────────────────────────────
  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  // ── Carica GA4 (solo dopo consenso) ─────────────────────────────
  function loadAnalytics() {
    if (document.getElementById('gds-ga-script')) return;
    var s = document.createElement('script');
    s.id = 'gds-ga-script';
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX'; // sostituire con ID reale
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true }); // sostituire con ID reale
  }

  // ── Applica preferenze salvate ───────────────────────────────────
  function applyConsent(value) {
    if (value === 'all') loadAnalytics();
  }

  // ── Crea il banner ───────────────────────────────────────────────
  function createBanner() {
    var el = document.createElement('div');
    el.id = 'gds-cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Consenso cookie');
    el.innerHTML = [
      '<div class="gcb-inner">',
      '  <div class="gcb-text">',
      '    <strong>Questo sito utilizza i cookie</strong>',
      '    <p>Utilizziamo cookie tecnici necessari al funzionamento del sito e, con il tuo consenso, cookie analitici (Google Analytics) per migliorare l\'esperienza. Nessun dato è venduto a terzi.</p>',
      '    <p style="margin-top:6px;"><a href="/cookie.html">Cookie Policy</a> · <a href="/privacy.html">Privacy Policy</a></p>',
      '  </div>',
      '  <div class="gcb-actions">',
      '    <button id="gcb-reject" class="gcb-btn gcb-btn-secondary">Solo necessari</button>',
      '    <button id="gcb-accept" class="gcb-btn gcb-btn-primary">Accetta tutti</button>',
      '  </div>',
      '</div>'
    ].join('');

    var style = document.createElement('style');
    style.textContent = [
      '#gds-cookie-banner{',
      '  position:fixed;bottom:0;left:0;right:0;z-index:99999;',
      '  background:#111114;border-top:1px solid rgba(255,255,255,0.08);',
      '  padding:0;animation:gcb-slide .3s ease;',
      '}',
      '@keyframes gcb-slide{from{transform:translateY(100%)}to{transform:translateY(0)}}',
      '.gcb-inner{',
      '  max-width:1100px;margin:0 auto;padding:20px 48px;',
      '  display:flex;align-items:center;gap:32px;flex-wrap:wrap;',
      '}',
      '.gcb-text{flex:1;min-width:240px;}',
      '.gcb-text strong{font-size:14px;font-weight:600;color:#f0f0f0;font-family:Poppins,sans-serif;}',
      '.gcb-text p{font-size:12px;color:#888;font-weight:300;line-height:1.6;margin:4px 0 0;font-family:Poppins,sans-serif;}',
      '.gcb-text a{color:#4285f4;text-decoration:none;}',
      '.gcb-text a:hover{text-decoration:underline;}',
      '.gcb-actions{display:flex;gap:10px;flex-shrink:0;flex-wrap:wrap;}',
      '.gcb-btn{',
      '  padding:10px 22px;border-radius:8px;',
      '  font-size:13px;font-weight:600;cursor:pointer;',
      '  border:none;font-family:Poppins,sans-serif;white-space:nowrap;',
      '  transition:opacity .2s;',
      '}',
      '.gcb-btn:hover{opacity:.85;}',
      '.gcb-btn-primary{background:#4285f4;color:#fff;}',
      '.gcb-btn-secondary{background:rgba(255,255,255,0.08);color:#ccc;}',
      '@media(max-width:600px){',
      '  .gcb-inner{padding:16px 20px;gap:16px;}',
      '  .gcb-actions{width:100%;}',
      '  .gcb-btn{flex:1;}',
      '}',
    ].join('');

    document.head.appendChild(style);
    document.body.appendChild(el);

    document.getElementById('gcb-accept').addEventListener('click', function () {
      setCookie(COOKIE_KEY, 'all', COOKIE_DAYS);
      loadAnalytics();
      removeBanner();
    });

    document.getElementById('gcb-reject').addEventListener('click', function () {
      setCookie(COOKIE_KEY, 'necessary', COOKIE_DAYS);
      removeBanner();
    });
  }

  function removeBanner() {
    var el = document.getElementById('gds-cookie-banner');
    if (el) el.remove();
  }

  // ── API pubblica (per pulsante "Gestisci" nella cookie policy) ───
  window.GDS_Cookie = {
    reopen: function () {
      setCookie(COOKIE_KEY, '', -1); // cancella
      createBanner();
    }
  };

  // ── Init ─────────────────────────────────────────────────────────
  var saved = getCookie(COOKIE_KEY);
  if (saved) {
    applyConsent(saved);
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }
})();

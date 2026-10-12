(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- CONFIG (same endpoint + field names as the original UAE page) ---------- */
  var ENDPOINT = 'contact-process'; // same PHP handler as the original UAE page (replies "OK" on success)
  var THANK_YOU = 'thankyou.html';

  document.body.classList.remove('js-off');

  /* ---------- FORM FIELDS (rendered into both forms) ---------- */
  var sel = function (name, label, opts) {
    return '<div class="fld"><label for="{id}-' + name + '">' + label + '</label><select id="{id}-' + name + '" name="' + name + '" required><option value="" disabled selected>' + label + '</option>' +
      opts.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('') + '</select></div>';
  };
  var same = function (a) { return a.map(function (x) { return [x, x]; }); };
  var FIELDS =
    '<div class="fld"><label for="{id}-name">Name</label><input id="{id}-name" type="text" name="name" placeholder="Your name" autocomplete="name" required></div>' +
    '<div class="fld"><label for="{id}-phone">Phone</label><input id="{id}-phone" type="tel" name="phone" placeholder="Phone number" autocomplete="tel" inputmode="tel" required></div>' +
    '<div class="fld"><label for="{id}-email">Email</label><input id="{id}-email" type="email" name="email" placeholder="Email address" autocomplete="email" required></div>' +
    sel('states', 'Emirates', same(['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'])) +
    sel('budget', 'Select your budget', [['10-15', '10-15 Lacs'], ['15-20', '15-20 Lacs'], ['20-25', '20-25 Lacs']]) +
    sel('buying_plan', 'Select your plan', [['1-month', 'Within 1 Month'], ['3-months', 'Within 3 Months'], ['6-months', 'Within 6 Months']]) +
    '<div class="fld full"><label for="{id}-message">Message</label><textarea id="{id}-message" name="message" rows="3" maxlength="200" placeholder="Leave a comment here (max 200 characters)" required></textarea></div>' +
    '<label class="agree"><input type="checkbox" name="marketingAgreement" required><span>I agree to receive marketing emails and calls from Teknix Prime Lifts Trading Co. LLC.</span></label>' +
    '<div class="fsub"><button type="submit" class="btn wht"><span class="l">Submit</span><span class="ar l">→</span></button><span class="note" role="status"></span></div>';

  var FORM_HEAD = '<div class="fhead"><h3>Enquire Now</h3></div>';

  $$('form.form').forEach(function (f) {
    var head = (f.id === 'footer-form') ? FORM_HEAD : '';
    f.innerHTML = head + FIELDS.replace(/\{id\}/g, f.id);
    f.addEventListener('submit', function (e) { e.preventDefault(); submit(f); });
  });
  function submit(f) {
    var btn = $('button[type=submit]', f), label = $('.l', btn), note = $('.note', f);
    note.className = 'note';
    if (!f.checkValidity()) { f.reportValidity(); return; }

    btn.disabled = true; label.textContent = 'Please Wait'; note.textContent = '';
    var body = new URLSearchParams();
    new FormData(f).forEach(function (val, key) { body.append(key, val); });

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: body.toString()
    })
      .then(function (r) { return r.text(); })
      .then(function (t) {
        if (t.trim() === 'OK') {
          note.className = 'note ok'; note.textContent = 'Email Sent Successfully!';
          f.reset();
          setTimeout(function () { window.location.href = THANK_YOU; }, 300);
        } else {
          // server returns a small HTML snippet with the validation message
          var tmp = document.createElement('div'); tmp.innerHTML = t;
          var msg = (tmp.textContent || '').trim();
          throw new Error(msg && msg.length < 120 ? msg : 'Error sending email!');
        }
      })
      .catch(function (err) {
        btn.disabled = false; label.textContent = 'Submit';
        note.className = 'note er';
        note.textContent = (err && err.message && !/failed to fetch|networkerror/i.test(err.message)) ? err.message : 'Error sending email!';
      });
  }

  /* ---------- NAV: transparent on top, hides on scroll-down, solid on scroll-up ---------- */
  var nav = $('#nav'), lastY = window.scrollY, tick = false;
  function evalNav() {
    var y = window.scrollY, d = y - lastY;
    if (y <= 40) nav.dataset.s = 'top';
    else if (y < 120) nav.dataset.s = 'hidden';
    else if (d > 6) nav.dataset.s = 'hidden';
    else if (d < -6) nav.dataset.s = 'revealed';
    lastY = y; tick = false;
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(evalNav); } }, { passive: true });
  evalNav();

  /* ---------- DRAWER ---------- */
  var drawer = $('#drawer');
  function drawerOpen(o) { drawer.classList.toggle('open', o); document.body.classList.toggle('lock', o); }
  $('#burger').addEventListener('click', function () { drawerOpen(true); });
  $$('[data-close]', drawer).forEach(function (el) { el.addEventListener('click', function () { drawerOpen(false); }); });

  /* ---------- MODAL ---------- */
  var modal = $('#modal');
  function modalOpen(o) {
    modal.classList.toggle('on', o); modal.setAttribute('aria-hidden', !o);
    document.body.classList.toggle('lock', o);
    if (o) setTimeout(function () { var i = $('input[name=fname]', modal); i && i.focus({ preventScroll: true }); }, 400);
  }
  $$('.open-form').forEach(function (b) {
    b.addEventListener('click', function (e) {
      if (b.tagName === 'A' && window.matchMedia('(min-width:1025px)').matches) { return; } // desktop CONTACT scrolls to form
      e.preventDefault(); modalOpen(true);
    });
  });
  $('#mx').addEventListener('click', function () { modalOpen(false); });
  modal.addEventListener('click', function (e) { if (e.target === modal) modalOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { modalOpen(false); drawerOpen(false); } });
  try { // auto-open once per session (original page opened it after 5s)
    if (!sessionStorage.getItem('teknixUaeModalShown')) {
      setTimeout(function () { if (!drawer.classList.contains('open')) { modalOpen(true); sessionStorage.setItem('teknixUaeModalShown', '1'); } }, 5000);
    }
  } catch (e) { }

  /* ---------- PRODUCT VIEWERS (elevators + escalators) ---------- */
  $$('[data-viewer]').forEach(function (sec) {
    var tabs = $$('.tabs li', sec), descs = $$('.pd', sec), img = $('.vimg', sec), tag = $('.tag', sec), idx = 0, busy = null;
    function show(i) {
      idx = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, k) { t.classList.toggle('on', k === idx); t.setAttribute('aria-selected', k === idx); });
      descs.forEach(function (d, k) { d.classList.toggle('on', k === idx); });
      img.style.opacity = 0; tag.style.opacity = 0;
      clearTimeout(busy);
      busy = setTimeout(function () {
        img.src = tabs[idx].getAttribute('data-img'); img.alt = tabs[idx].textContent;
        tag.innerHTML = tabs[idx].innerHTML;
        img.style.opacity = 1; tag.style.opacity = 1;
      }, 280);
    }
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { show(k); });
      t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(k); } });
    });
    $('.vprev', sec).addEventListener('click', function () { show(idx - 1); });
    $('.vnext', sec).addEventListener('click', function () { show(idx + 1); });
  });

  /* ---------- FILL BUTTON (circle grows from cursor) ---------- */
  $$('.btn').forEach(function (b) {
    var fill = document.createElement('span'); fill.className = 'fill'; b.insertBefore(fill, b.firstChild);
    var pos = function (e) { var r = b.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    b.addEventListener('mouseenter', function (e) {
      var p = pos(e); fill.style.transition = 'none'; fill.style.left = p[0] + 'px'; fill.style.top = p[1] + 'px';
      fill.style.transform = 'translate(-50%,-50%) scale(0)'; void fill.offsetWidth;
      fill.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)'; fill.style.transform = 'translate(-50%,-50%) scale(1)';
    });
    b.addEventListener('mouseleave', function (e) {
      var p = pos(e); fill.style.left = p[0] + 'px'; fill.style.top = p[1] + 'px'; fill.style.transform = 'translate(-50%,-50%) scale(0)';
    });
  });

  /* ---------- SCROLL REVEALS ---------- */
  var targets = $$('.rv,.ln,.ri');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        x.target.classList.add('in');
        $$('.ri', x.target).forEach(function (r) { r.classList.add('in'); });
        io.unobserve(x.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) {
      if (t.classList.contains('ri')) { t.__ob = t.parentNode; io.observe(t.parentNode); } else { io.observe(t); }
    });
  } else { targets.forEach(function (t) { t.classList.add('in'); }); }

  /* ---------- PARALLAX on section images ---------- */
  var par = $$('.corp .im img');
  if (par.length && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    window.addEventListener('scroll', function () {
      par.forEach(function (im) {
        var r = im.parentNode.getBoundingClientRect(), p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        im.style.transform = 'translateY(' + (p * -40) + 'px) scale(1.12)';
      });
    }, { passive: true });
  }
})();

(function () {
  var OPEN_DELAY = 1100; // 다람쥐를 먼저 보여주고 편지를 올리는 시간(ms)

  var deck = document.getElementById('deck');
  var dots = document.getElementById('dots');
  var cards = Array.prototype.slice.call(deck.querySelectorAll('.card'));
  var openTimer = null;

  function goTo(i) {
    cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  function setOpen(card, open) {
    card.classList.toggle('is-open', open);
    if (open) card.classList.add('was-opened');
  }

  var buttons = cards.map(function (card, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', (i + 1) + '번째 카드');
    b.addEventListener('click', function () { goTo(i); });
    dots.appendChild(b);
    return b;
  });

  function setActive(i) {
    if (cards[i].classList.contains('is-active')) return;
    clearTimeout(openTimer);
    cards.forEach(function (c, j) {
      c.classList.toggle('is-active', i === j);
      if (i !== j) c.classList.remove('is-open', 'was-opened');
    });
    buttons.forEach(function (b, j) { b.setAttribute('aria-current', String(i === j)); });
    openTimer = setTimeout(function () { setOpen(cards[i], true); }, OPEN_DELAY);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(cards.indexOf(entry.target));
    });
  }, { root: deck, threshold: 0.6 });
  cards.forEach(function (c) { observer.observe(c); });

  // 카드를 탭하면 편지를 내리고/올린다 (링크 탭은 제외)
  deck.addEventListener('click', function (e) {
    if (e.target.closest('a')) return;
    var card = e.target.closest('.card');
    if (!card || !card.classList.contains('is-active')) return;
    clearTimeout(openTimer);
    setOpen(card, !card.classList.contains('is-open'));
  });

  // PC 에서 확인할 때를 위한 키보드 이동
  document.addEventListener('keydown', function (e) {
    var current = cards.findIndex(function (c) { return c.classList.contains('is-active'); });
    if (e.key === 'ArrowRight' && current < cards.length - 1) goTo(current + 1);
    if (e.key === 'ArrowLeft' && current > 0) goTo(current - 1);
  });

  setActive(0);
})();

'use strict';

(() => {
  const scene = document.querySelector('.hero-scene');
  if (!scene || !Element.prototype.animate) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const replay = scene.querySelector('.scene-replay');
  const ease = 'cubic-bezier(.16,1,.3,1)';
  const heroAnimations = new Set();
  const pausedHeroAnimations = new Set();
  const interfaceAnimations = new Set();
  let played = false;
  let playing = false;
  let translating = false;
  let transfer = null;
  let previousJourney = {role: 'teacher', published: false, active: false, complete: false};
  let previousLearning = {format: 'video', answer: null};

  function animate(element, frames, options, collection = heroAnimations) {
    const animation = element.animate(frames, {easing: ease, ...options});
    collection.add(animation);
    animation.finished.then(() => {
      if (collection === interfaceAnimations) {
        collection.delete(animation);
        animation.cancel();
      }
    }).catch(() => collection.delete(animation));
    return animation;
  }

  function setReplayLabel() {
    const label = document.documentElement.dir === 'rtl'
      ? 'عاود شوف كيفاش الدرس كيوصل للتلميذ'
      : 'Rejouer le passage du cours au téléphone';
    replay.setAttribute('aria-label', label);
    replay.title = label;
  }

  // Canceling removes every temporary style: the complete scene is the default.
  function finishHero() {
    for (const animation of heroAnimations) animation.cancel();
    heroAnimations.clear();
    pausedHeroAnimations.clear();
    transfer?.remove();
    transfer = null;
    playing = false;
    scene.dataset.motion = 'complete';
    replay.disabled = false;
    replay.hidden = reduce.matches || !played;
  }

  function draw(path, delay, duration) {
    const length = path.getTotalLength();
    return animate(path, [
      {strokeDasharray: `${length} ${length}`, strokeDashoffset: length},
      {strokeDasharray: `${length} ${length}`, strokeDashoffset: 0}
    ], {delay, duration, fill: 'both'});
  }

  function carryLesson(destination) {
    const bounds = scene.getBoundingClientRect();
    const target = destination.getBoundingClientRect();
    const graph = scene.querySelector('.class-graph');
    const point = new DOMPoint(215, 261).matrixTransform(graph.getScreenCTM());
    const from = {x: point.x - bounds.left, y: point.y - bounds.top};
    const to = {x: target.left + target.width / 2 - bounds.left, y: target.top + target.height / 2 - bounds.top};
    const control = {x: from.x + (to.x - from.x) * .35, y: Math.min(from.y, to.y) - 105};
    const matrix = new DOMMatrix(getComputedStyle(scene.querySelector('.scene-phone')).transform);
    const angle = Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    const width = destination.offsetWidth;
    const height = destination.offsetHeight;

    transfer = destination.cloneNode(true);
    transfer.classList.add('lesson-transfer');
    transfer.setAttribute('aria-hidden', 'true');
    transfer.style.width = `${width}px`;
    transfer.style.height = `${height}px`;
    scene.append(transfer);

    const frames = Array.from({length: 25}, (_, i) => {
      const p = i / 24;
      const x = (1 - p) ** 2 * from.x + 2 * (1 - p) * p * control.x + p ** 2 * to.x;
      const y = (1 - p) ** 2 * from.y + 2 * (1 - p) * p * control.y + p ** 2 * to.y;
      const scale = .08 + .92 * Math.min(p / .35, 1);
      return {
        offset: p,
        transform: `translate(${x - width / 2}px,${y - height / 2}px) rotate(${-5 + (angle + 5) * p}deg) scale(${scale})`,
        opacity: Math.min(p * 12, 1)
      };
    });
    return animate(transfer, frames, {delay: 1600, duration: 1150, fill: 'both'});
  }

  function playHero() {
    if (playing || reduce.matches || document.hidden) return;
    played = true;
    playing = true;
    scene.dataset.motion = 'playing';
    replay.disabled = true;
    const lesson = scene.querySelector('.scene-phone-lesson');

    try {
      draw(scene.querySelector('.board-curve'), 140, 1120);
      draw(scene.querySelector('.board-callout'), 1010, 420);
      animate(scene.querySelector('.board-question'), [{opacity: 0}, {opacity: 1}], {delay: 760, duration: 200, fill: 'both'});
      animate(scene.querySelector('.board-guide'), [{opacity: 0}, {opacity: 1}], {delay: 1170, duration: 200, fill: 'both'});
      animate(scene.querySelector('.minimum'), [{opacity: 0, transform: 'scale(.2)'}, {opacity: 1, transform: 'scale(1)'}], {delay: 1300, duration: 280, fill: 'both'});

      animate(lesson, [
        {opacity: 0, offset: 0}, {opacity: 0, offset: .97}, {opacity: 1, offset: 1}
      ], {duration: 2750, fill: 'both'});
      const carried = carryLesson(lesson);
      carried.finished.then(() => {
        transfer?.remove();
        transfer = null;
      }).catch(() => {});

      for (const [selector, delay] of [['.scene-realization>span', 2890], ['.scene-realization>strong', 3140]]) {
        animate(scene.querySelector(selector), [
          {clipPath: 'inset(0 0 100% 0)', opacity: 0, translate: '0 5px'},
          {clipPath: 'inset(0 0 0% 0)', opacity: 1, translate: '0 0'}
        ], {delay, duration: 360, fill: 'both'});
      }
      const ending = draw(scene.querySelector('.realization-check path'), 3490, 320);
      ending.finished.then(finishHero).catch(() => {});
    } catch {
      finishHero();
    }
  }

  function cancelInterfaceMotion() {
    for (const animation of interfaceAnimations) animation.cancel();
    interfaceAnimations.clear();
  }

  document.addEventListener('oustadi:journey', event => {
    const next = event.detail;
    const previous = previousJourney;
    previousJourney = {...next};
    if (reduce.matches || translating) return;
    cancelInterfaceMotion();
    const panel = document.querySelector('#journey-panel');
    if (next.role !== previous.role) {
      const roles = ['teacher', 'center', 'student'];
      const direction = (roles.indexOf(next.role) > roles.indexOf(previous.role) ? 1 : -1)
        * (document.documentElement.dir === 'rtl' ? -1 : 1);
      animate(panel.querySelector('.panel-workspace'), [
        {opacity: .4, translate: `${direction * 18}px 0`, clipPath: 'inset(0 0 3% 0)'},
        {opacity: 1, translate: '0 0', clipPath: 'inset(0 0 0% 0)'}
      ], {duration: 300}, interfaceAnimations);
      animate(panel.querySelector('.panel-narrative'), [{opacity: .6}, {opacity: 1}], {duration: 220}, interfaceAnimations);
    } else if (next.complete && !previous.complete) {
      const progress = panel.querySelector('.mini-progress i');
      if (progress) animate(progress, [{transform: 'scaleX(.38)'}, {transform: 'scaleX(1)'}], {duration: 440}, interfaceAnimations);
    }
  });

  document.addEventListener('oustadi:learning', event => {
    const previous = previousLearning;
    previousLearning = {...event.detail};
    if (reduce.matches || translating) return;
    cancelInterfaceMotion();
    const panel = document.querySelector('#learning-panel');
    if (previous.format !== event.detail.format) {
      animate(panel, [{opacity: .5, clipPath: 'inset(0 0 2% 0)'}, {opacity: 1, clipPath: 'inset(0 0 0% 0)'}], {duration: 220}, interfaceAnimations);
    } else if (event.detail.answer !== previous.answer) {
      const result = panel.querySelector('.quiz-result');
      if (result) animate(result, [{opacity: .45}, {opacity: 1}], {duration: 180}, interfaceAnimations);
    }
  });

  document.addEventListener('oustadi:language-start', () => {
    translating = true;
    if (playing) finishHero();
    cancelInterfaceMotion();
  });
  document.addEventListener('oustadi:language', () => {
    translating = false;
    setReplayLabel();
  });
  replay.addEventListener('click', playHero);
  reduce.addEventListener('change', () => {
    finishHero();
    cancelInterfaceMotion();
  });
  addEventListener('resize', () => {if (playing) finishHero()});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      for (const animation of heroAnimations) {
        if (animation.playState === 'running') {
          animation.pause();
          pausedHeroAnimations.add(animation);
        }
      }
    } else {
      for (const animation of pausedHeroAnimations) {
        if (heroAnimations.has(animation)) {
          if (animation.currentTime >= animation.effect.getComputedTiming().endTime) animation.finish();
          else animation.play();
        }
      }
      pausedHeroAnimations.clear();
    }
    if (!document.hidden && !played) {
      const rect = scene.getBoundingClientRect();
      if (rect.top < innerHeight * .7 && rect.bottom > 0) playHero();
    }
  });

  setReplayLabel();
  document.fonts.ready.then(() => {
    if (reduce.matches) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (!played) playHero();
      } else if (playing) finishHero();
    }, {threshold: .3});
    observer.observe(scene);
  });
})();

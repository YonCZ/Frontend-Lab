/* Small, dependency-free motion helpers shared by the prototype pages.
   Springs use Apple's designer-facing parameters: response (seconds) and damping ratio.
   http://developer.apple.com/design/human-interface-guidelines/motion */
(function () {
  const TAU = Math.PI * 2;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function project(velocity, deceleration = 0.998) {
    return ((velocity / 1000) * deceleration) / (1 - deceleration);
  }

  function rubberband(overshoot, dimension, constant = 0.55) {
    return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
  }

  function spring(options) {
    const {
      from = 0,
      to = 0,
      velocity = 0,
      response = 0.4,
      damping = 1,
      precision = 0.1,
      onUpdate,
      onComplete,
    } = options || {};

    let target = to;
    let value = from;
    let speed = velocity;
    let frame = 0;
    let stopped = false;

    if (reduced.matches) {
      onUpdate && onUpdate(to);
      onComplete && onComplete();
      return {
        stop() {},
        retarget(next) {
          target = next;
          value = next;
          onUpdate && onUpdate(next);
        },
      };
    }

    const omega = TAU / Math.max(0.08, response);
    const stiffness = omega * omega;
    const drag = 2 * damping * omega;
    const step = 1 / 240;
    let last = 0;

    function tick(now) {
      if (stopped) return;
      if (!last) last = now;
      let elapsed = Math.min((now - last) / 1000, 1 / 20);
      last = now;

      while (elapsed > 0) {
        const dt = Math.min(step, elapsed);
        const force = -stiffness * (value - target) - drag * speed;
        speed += force * dt;
        value += speed * dt;
        elapsed -= dt;
      }

      onUpdate && onUpdate(value);

      if (Math.abs(speed) < 0.02 && Math.abs(value - target) < precision) {
        onUpdate && onUpdate(target);
        onComplete && onComplete();
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);

    return {
      stop() {
        stopped = true;
        cancelAnimationFrame(frame);
      },
      retarget(next, nextVelocity) {
        target = next;
        if (typeof nextVelocity === "number") speed = nextVelocity;
      },
      get value() {
        return value;
      },
      get velocity() {
        return speed;
      },
    };
  }

  window.NoemaMotion = { project, rubberband, spring, reduce: () => reduced.matches };
})();

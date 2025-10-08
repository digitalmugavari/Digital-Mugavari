const toggle = document.getElementById("toggleWidget");
const box = document.getElementById("widgetBox");
const steps = document.querySelectorAll(".widget-step");
const wrapper = document.querySelector(".widget-wrapper");

let selectedMain = null;
let selectedMainLabel = null;
let selectedServiceBtn = null;

toggle.addEventListener("click", () => {
  if (box.classList.contains("show")) {
    closeWidget();
  } else {
    openWidget();
  }
});

function openWidget() {
  box.classList.remove("hide");
  box.classList.add("show");
  wrapper.classList.add("expand");
  resetWidget();
  goToStep("step2");
  document.addEventListener("click", outsideClickListener);
}

function closeWidget() {
  box.classList.remove("show");
  setTimeout(() => {
    box.classList.add("hide");
    wrapper.classList.remove("expand");
  }, 300);
  resetWidget();
  document.removeEventListener("click", outsideClickListener);
}

function resetWidget() {
  goToStep("step2");
  selectedMain = null;
  selectedMainLabel = null;
  document.getElementById("toService").disabled = true;
  document
    .querySelectorAll("#mainOptions .option-btn")
    .forEach((btn) => btn.classList.remove("active"));
  selectedServiceBtn = null;
  document.getElementById("toForm").disabled = true;
  document.getElementById("serviceOptions").innerHTML = "";
  document.getElementById("serviceHeader").textContent = "Select a service";
  // ensure submit button(s) are visible again if they were hidden
  try {
    const $ = window.jQuery;
    if ($) {
      $("#gform button[type='submit'], #gform .continue-btn").show();
      $("#submit-alert").text('').hide();
      // clear hidden inputs if present
      try { document.getElementById('selected_main').value = ''; } catch(e){}
      try { document.getElementById('selected_service').value = ''; } catch(e){}
    }
  } catch (e) {}
  // also ensure via plain DOM in case jQuery wasn't available when reset ran
  try {
    const els = document.querySelectorAll("#gform button[type='submit'], #gform .continue-btn");
    els.forEach((el) => {
      // only change display if it was hidden
      try { el.style.display = ''; el.disabled = false; } catch (e) {}
    });
    const alertEl = document.getElementById('submit-alert');
    if (alertEl) { alertEl.textContent = ''; alertEl.style.display = 'none'; }
    try { const sm = document.getElementById('selected_main'); if (sm) sm.value = ''; } catch(e){}
    try { const ss = document.getElementById('selected_service'); if (ss) ss.value = ''; } catch(e){}
  } catch (e) {}
}

function outsideClickListener(event) {
  if (!box.contains(event.target) && !toggle.contains(event.target)) {
    closeWidget();
  }
}

function goToStep(stepId) {
  steps.forEach((step) => step.classList.add("hide"));
  const stepEl = document.getElementById(stepId);
  if (stepEl) stepEl.classList.remove("hide");

  // If navigating to the final form (step4), show a summary of the selected main + service
  if (stepId === "step4") {
    const step4 = document.getElementById("step4");
    if (step4) {
      // remove previous summary if any
      const prev = document.getElementById("selectionSummary");
      if (prev) prev.remove();

      const summary = document.createElement("div");
      summary.id = "selectionSummary";
      summary.className = "selection-summary";
      const mainText = selectedMainLabel
        ? selectedMainLabel
        : selectedMain
        ? selectedMain.toUpperCase()
        : "—";
      const serviceText = selectedServiceBtn ? selectedServiceBtn : "—";
      summary.innerHTML = `<strong>Selected:</strong> <span class="sel-main">${mainText}</span> <span class="sel-sep">/</span> <span class="sel-service">${serviceText}</span>`;

      const form = step4.querySelector("form");
      if (form) step4.insertBefore(summary, form);
      else step4.prepend(summary);
    }
  }
}

const mainOptions = document.querySelectorAll("#mainOptions .option-btn");
mainOptions.forEach((btn) => {
  btn.addEventListener("click", () => {
    mainOptions.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMain = btn.getAttribute("data-value");
    selectedMainLabel =
      btn.textContent && btn.textContent.trim()
        ? btn.textContent.trim()
        : selectedMain;
    // expose to window for other scripts (form submit) to read reliably
    try {
      window.selectedMain = selectedMain;
      window.selectedMainLabel = selectedMainLabel;
    } catch (e) {}
    // directly populate services and navigate to step3 when a main option is selected
    populateServiceOptions(selectedMain);
    goToStep("step3");
  });
});

function populateServiceOptions(key) {
  const services = {
    seo: ["On-page SEO", "Technical SEO", "Local SEO", "SEO Audit"],
    web: ["Landing Page", "Corporate Site", "eCommerce Site", "Maintenance"],
    smm: [
      "Instagram Strategy",
      "Post Design",
      "Hashtag Research",
      "Profile Optimization",
    ],
    pm: ["Google Ads", "Meta Ads", "Retargeting", "Conversion Optimization"],
    graphic: [
      "Logo Design",
      "Brochure Design",
      "Social Media Banners",
      "Presentation Decks",
    ],
    influencer: [
      "Instagram Collab",
      "Micro Influencer Campaign",
      "YouTube Review",
      "Event Shoutouts",
    ],
    branding: [
      "Visual Identity",
      "Brand Guidelines",
      "Tone of Voice",
      "Positioning Strategy",
    ],
    dm: [
      "Full Digital Strategy",
      "Email Marketing",
      "Funnel Setup",
      "Analytics & Insights",
    ],
  };

  const serviceDiv = document.getElementById("serviceOptions");
  const header = document.getElementById("serviceHeader");

  header.textContent = "Select a service in " + key.toUpperCase();
  serviceDiv.innerHTML = "";

  services[key].forEach((s, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = `${index + 1}. ${s}`;
    btn.setAttribute("type", "button");

    btn.addEventListener("click", () => {
      Array.from(serviceDiv.children).forEach((b) =>
        b.classList.remove("active")
      );
      btn.classList.add("active");
      document.getElementById("toForm").disabled = false;
      selectedServiceBtn = s;
      // expose selected service for the form submit
      try {
        window.selectedServiceBtn = selectedServiceBtn;
      } catch (e) {}
    });

    serviceDiv.appendChild(btn);
  });
}

let lastScrollTop = window.scrollY;
let openTimeout;

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const scrollPosition = window.innerHeight + scrollTop;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollTop > lastScrollTop) {
    if (scrollPosition >= documentHeight - 5) {
      clearTimeout(openTimeout);
      // wait 2 seconds after reaching the bottom before opening the widget
      openTimeout = setTimeout(() => {
        if (!box.classList.contains("show")) openWidget();
      }, 1000);
    }
  }

  if (scrollTop < lastScrollTop) {
    clearTimeout(openTimeout);
    if (box.classList.contains("show")) closeWidget();
  }

  lastScrollTop = scrollTop;
});

// Use IntersectionObserver on the hero section to toggle the glow
(function () {
  const toggleEl = document.getElementById("toggleWidget");
  if (!toggleEl) return;

  const hero = document.querySelector(".hero-section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // when hero is sufficiently visible, remove glow; otherwise show glow
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          toggleEl.classList.remove("glow");
        } else {
          toggleEl.classList.add("glow");
        }
      });
    },
    { threshold: [0, 0.25, 0.5, 1] }
  );

  if (hero) {
    observer.observe(hero);
  } else {
    // if there's no hero section, show glow by default
    toggleEl.classList.add("glow");
  }

  // One-time "first scroll" glow: show glow briefly when the user first scrolls.
  // Adds glow immediately on first scroll, keeps it for a short duration, then
  // re-evaluates hero visibility so the observer can decide the final state.
  let firstScrolled = false;

  function getHeroVisibleRatio() {
    if (!hero) return 0;
    const rect = hero.getBoundingClientRect();
    if (!rect || rect.height <= 0) return 0;
    const visibleHeight = Math.max(
      0,
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
    );
    return visibleHeight / rect.height;
  }

  function onFirstScroll() {
    if (firstScrolled) return;
    firstScrolled = true;
    // force glow on first scroll
    toggleEl.classList.add("glow");
    // after a short delay, let the Observer/visibility determine the final state
    setTimeout(() => {
      if (getHeroVisibleRatio() > 0.5) {
        toggleEl.classList.remove("glow");
      }
      // otherwise keep the glow; the IntersectionObserver will update later as needed
    }, 1500);
  }

  try {
    window.addEventListener("scroll", onFirstScroll, { passive: true, once: true });
  } catch (e) {
    // fallback for older browsers that don't support the options object
    const wrapper = function () {
      onFirstScroll();
      window.removeEventListener("scroll", wrapper);
    };
    window.addEventListener("scroll", wrapper);
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  const target = document.querySelector("#image-left");

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
        target.classList.add("expand");
      } else {
        target.classList.remove("expand");
      }
    },
    {
      threshold: [0, 0.25, 0.5, 1],
    }
  );

  observer.observe(target);
});


// wheeel scroll
 // Animation and scroll sync
        gsap.registerPlugin(ScrollTrigger);

        const wheel = document.getElementById('wheel');
        const badges = [...document.querySelectorAll('.badge')].filter(b => b.id !== 'badgeFixed');
        const fixed = document.getElementById('badgeFixed');
        const cards = [...document.querySelectorAll('.card')];
        const centerTitle = document.getElementById('centerTitle');
        const centerDesc = document.getElementById('centerDesc');
        const centerIcon = document.getElementById('centerIcon');

        const state = { index: 0 };
        // drive rotation purely via CSS var for simpler transform math

        function setActive(i) {
            state.index = i;
            // update fixed overlay badge label and sequential order around the circle
            const N = badges.length;
            const getAngle = (el) => parseFloat(el.style.getPropertyValue('--angle') || getComputedStyle(el).getPropertyValue('--angle')) || 0;
            const baseAngle = getAngle(badges[i]);
            const normalize = (deg) => ((deg % 360) + 360) % 360;

            const currentNumber = i + 1;
            const fixedContent = fixed.querySelector('.badge__content');
            if (fixedContent) fixedContent.textContent = String(currentNumber).padStart(2, '0');
            badges.forEach((b) => {
                const rel = normalize(getAngle(b) - baseAngle);
                const step = Math.round(rel / 60) % N; // 0 at right, 1 below, 5 above
                const label = ((i + step) % N) + 1;
                const content = b.querySelector('.badge__content');
                if (content) content.textContent = String(label).padStart(2, '0');
                b.classList.toggle('is-hidden', step === 0);
            });
            // rotate so the selected badge sits at the right side (0deg)
            const angleStr2 = badges[i].style.getPropertyValue('--angle') || getComputedStyle(badges[i]).getPropertyValue('--angle');
            const baseAngle2 = parseFloat(angleStr2) || 0;
            const rotationDeg = -baseAngle2;
            gsap.to(wheel, { '--wheelRot': `${rotationDeg}deg`, duration: 1.4, ease: 'power2.out' });
            // update center content from the associated card
            const card = cards[i];
            centerTitle.textContent = card.dataset.title;
            centerDesc.textContent = card.dataset.desc;
            // swap icon minimalistically
            const icons = {
                web: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><rect x="8" y="12" width="48" height="36" rx="6"/><path d="M12 28c9-10 31-10 40 0"/><path d="M32 48v6"/></svg>',
                chart: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><rect x="8" y="34" width="10" height="14" rx="2"/><rect x="24" y="28" width="10" height="20" rx="2"/><rect x="40" y="20" width="10" height="28" rx="2"/><path d="M10 50h44"/></svg>',
                phone: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><rect x="18" y="6" width="28" height="52" rx="6"/><circle cx="32" cy="52" r="2"/><path d="M24 18h16"/><path d="M24 26h16"/><path d="M24 34h12"/></svg>',
                brand: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><circle cx="22" cy="26" r="10"/><path d="M10 50c4-8 12-12 22-12s18 4 22 12"/><path d="M44 14l10 10l-18 18"/></svg>',
                seo: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><circle cx="28" cy="28" r="12"/><path d="M36 36l14 14"/><path d="M20 28h16"/></svg>',
                ads: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><path d="M8 16h36v22H8z"/><path d="M44 27l12 6-12 6z"/><path d="M16 48h20"/></svg>'
            };
            centerIcon.innerHTML = icons[card.dataset.icon] || icons.web;
        }

        // animate cards in and bind triggers
        cards.forEach((card, i) => {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: '+=200',
                    toggleActions: 'play none none reverse'
                },
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power2.out'
            });

            ScrollTrigger.create({
                trigger: card,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => setActive(i),
                onEnterBack: () => setActive(i)
            });
        });
        // initial
        setActive(0);
    
        // Character-by-character reveal for the service work title
        (function () {
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

            const el = document.querySelector('.work-title.char-reveal');
            if (!el) return;

            // preserve original text and split into characters, keeping whitespace
            const text = el.textContent.trim();
            el.textContent = '';

            const chars = Array.from(text);
            chars.forEach(ch => {
                const span = document.createElement('span');
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                el.appendChild(span);
            });

            // animate: fade up the characters as the section scrolls into view
            gsap.registerPlugin(ScrollTrigger);
            // smoother character reveal: animate from a small y-offset + faded opacity to final state
            gsap.fromTo('.work-title.char-reveal span',
                { opacity: 0.18, y: 12 },
                {
                    opacity: 1,
                    y: 0,
                    color: '#dcdcdc',
                    stagger: { each: 0.03, from: 'start' },
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.work-section',
                        start: 'top 55%',
                        end: 'bottom 80%',
                        // use a numeric scrub for smoothing (0.5-0.8 gives a soft catch-up feel)
                        scrub: 0.6,
                        // Do NOT pin — keeps layout and other scripts the same
                    }
                }
            );
        })();




        function moveToSelected(element) {
      var $items = $('#image-carousel').children();
      var total = $items.length;
      var selectedIdx = $items.index($('.selected'));
      var newIdx;

      if (element === "next") {
        newIdx = (selectedIdx + 1) % total;
      } else if (element === "prev") {
        newIdx = (selectedIdx - 1 + total) % total;
      } else if (typeof element === 'number') {
        newIdx = element % total;
      } else if (element instanceof jQuery) {
        newIdx = $items.index(element);
      } else {
        newIdx = $items.index(element);
      }

      // Calculate indices for prev, next, prevLeftSecond, nextRightSecond
      var prevIdx = (newIdx - 1 + total) % total;
      var nextIdx = (newIdx + 1) % total;
      var prevLeftSecondIdx = (newIdx - 2 + total) % total;
      var nextRightSecondIdx = (newIdx + 2) % total;

      // Reset all to hideRight
      $items.removeClass().addClass('hideRight');

      // Always show 5 images: prevLeftSecond, prev, selected, next, nextRightSecond
      $items.eq(prevLeftSecondIdx).removeClass().addClass('prevLeftSecond');
      $items.eq(prevIdx).removeClass().addClass('prev');
      $items.eq(newIdx).removeClass().addClass('selected');
      $items.eq(nextIdx).removeClass().addClass('next');
      $items.eq(nextRightSecondIdx).removeClass().addClass('nextRightSecond');

      // All others are hidden (hideLeft for those before prevLeftSecond, hideRight for those after nextRightSecond)
      for (var i = 0; i < total; i++) {
        // Calculate relative position to newIdx, wrapping around
        var rel = (i - newIdx + total) % total;
        if (rel > 2 && rel < total - 2) {
          // If more than 2 ahead or behind, hide
          if (rel < total / 2) {
            $items.eq(i).removeClass().addClass('hideRight');
          } else {
            $items.eq(i).removeClass().addClass('hideLeft');
          }
        }
      }

      // update dots to reflect currently selected index
      updateActiveDot(newIdx);
    }

// --- autoplay (endless) with pause-on-hover ---
var autoInterval = null;
var autoPlayDelay = 1200; // milliseconds

function startAuto() {
  stopAuto();
  autoInterval = setInterval(function() { moveToSelected('next'); }, autoPlayDelay);
}

function stopAuto() {
  if (autoInterval) {
    clearInterval(autoInterval);
    autoInterval = null;
  }
}

$(function() {
  // start autoplay and ensure correct classes on load
  startAuto();
  // re-run moveToSelected with current selected to normalize classes
  moveToSelected($('.selected'));
});

// pause on hover, resume on leave
$('#image-carousel').hover(function() {
  stopAuto();
}, function() {
  startAuto();
});

// --- dot indicators (replace Prev/Next) ---
function createDots() {
  var $dots = $('#dots');
  $dots.empty();
  $('#image-carousel').children().each(function(i) {
    var $btn = $('<button/>').attr('data-index', i);
    if ($(this).hasClass('selected')) $btn.addClass('active');
    $btn.on('click', function() {
      var index = parseInt($(this).attr('data-index'));
      var target = $('#image-carousel').children().eq(index);
      moveToSelected(target);
      // reset autoplay so user sees full delay after manual change
      startAuto();
      updateActiveDot(index);
    });
    $dots.append($btn);
  });
}

function updateActiveDot(activeIndex) {
  $('#dots').children().removeClass('active');
  $('#dots').children().eq(activeIndex).addClass('active');
}

// create dots on load and whenever we normalize classes
$(function() {
  createDots();
});

// keyboard events
$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        moveToSelected('prev');
        break;

        case 39: // right
        moveToSelected('next');
        break;

        default: return;
    }
    e.preventDefault();
});

$('#image-carousel div').click(function() {
  moveToSelected($(this));
});

// Prev/Next buttons removed — navigation available via dots, keyboard and clicking slides
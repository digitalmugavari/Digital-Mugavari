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

// STICKY SECTION WITH GSAP AND INTERSECTION OBSERVER
gsap.registerPlugin(ScrollTrigger);

const fillEl = document.querySelector(".js-fill");

gsap.to(fillEl, {
  height: "100vh",
  width: "100vw",
  borderRadius: "10",
  scrollTrigger: {
    trigger: fillEl,
    start: "top 85%",
    end: "bottom top",
    scrub: 2.2,
    invalidateOnRefresh: true,
  },
});

document.addEventListener("DOMContentLoaded", function () {
  const stickySection = document.querySelector(".sticky");
  let isLocked = false;
  let hasPaused = false;

  function lockScroll() {
    if (!isLocked) {
      isLocked = true;
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        document.body.style.overflow = "";
        isLocked = false;
      }, 1000); // Lock for 1.2 seconds
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasPaused) {
          hasPaused = true;
          stickySection.scrollIntoView({ behavior: "smooth", block: "start" });
          lockScroll();
          setTimeout(() => {
            hasPaused = false;
          }, 1300); // Prevent retriggering during/after lock
        }
      });
    },
    {
      threshold: [0.7], // Trigger when 70% of the section is visible
    }
  );

  observer.observe(stickySection);
});

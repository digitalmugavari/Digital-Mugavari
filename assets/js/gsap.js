
 const services = document.querySelectorAll(".service-item");
   const finalContainer = document.getElementById("finalMessage");
   const overlayEl = document.querySelector(".preloader-overlay");
   const mainSite = document.querySelector(".main-site");
   const lines = finalContainer ? finalContainer.querySelectorAll(".final-line") : [];

    const directions = [
      { x: -200 },
      { x: 200 },
      { y: -200 },
      { y: 200 },
      { x: -200, y: -200 },
      { x: 200, y: 200 },
    ];

    if (finalContainer && overlayEl) {
      let tl = gsap.timeline();

      // Animate service items one-by-one when they exist
      services.forEach((el, i) => {
        const dir = directions[i % directions.length];
        tl.fromTo(el,
          { opacity: 0, scale: 0.5, ...dir },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "back.out(1.7)"
          })
          .to(el, {
            opacity: 0,
            duration: 0.3,
            delay: 0.2,
            ease: "power1.inOut"
          });
      });

      // Show the final message container
      tl.to(finalContainer, {
        opacity: 1,
        duration: 0.5
      });

      // Animate lines one by one
      lines.forEach((line) => {
        tl.to(line, {
          opacity: 1,
          y: -10,
          duration: 0.7,
          ease: "power2.out"
        }, "+=0.2");
      });

      // Exit preloader and show main site if present
      tl.to(overlayEl, {
        opacity: 0,
        duration: 2,
        delay: 2,
        onComplete: () => {
          overlayEl.style.display = "none";
          if (mainSite) {
            mainSite.style.display = "block";
          }
          document.body.style.overflow = "auto";
        }
      });
    } else if (overlayEl) {
      // Fail-safe: hide overlay immediately if expected markup is missing
      overlayEl.style.display = "none";
      document.body.style.overflow = "auto";
    }

// gsap
  window.addEventListener("DOMContentLoaded", () => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });

    tl.from(".hero-section", { opacity: 0, y: 50, duration: 0.8 })
      .from(".tagline", { opacity: 0, y: 30 }, "-=0.5")
      .from(".headline", { opacity: 0, y: 30 }, "-=0.4")
  });


 window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    if (!document.querySelector(".work-section")) {
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });

    tl.from(".work-title", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }).from(".marquee-wrapper", {
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: "power3.out"
    }, "-=0.5");
  });

   window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    if (!document.querySelector(".digital-section")) {
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".digital-section",
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });

    tl.from(".digital-section h2", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    tl.from(".digital-item", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.2
    }, "-=0.5");
  });


   window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    if (!document.querySelector("#brand-parallax")) {
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#brand-parallax",
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });

    tl.from(".icon-1", {
      x: -200, y: -100, opacity: 0, duration: 1, ease: "power3.out"
    })
    .from(".icon-2", {
      x: 200, y: -100, opacity: 0, duration: 1, ease: "power3.out"
    }, "-=0.8")
    .from(".icon-3", {
      x: -200, y: 100, opacity: 0, duration: 1, ease: "power3.out"
    }, "-=0.8")
    .from(".icon-4", {
      x: 200, y: 100, opacity: 0, duration: 1, ease: "power3.out"
    }, "-=0.8")
    .from(".brand-parallax-content span", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    })
    .from(".parallax-title", {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.6")
    .from(".parallax-subtitle", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6")
    .from(".parallax-desc", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5");
  });


  

//   last section
gsap.registerPlugin(ScrollTrigger);

gsap.timeline({
  scrollTrigger: {
    trigger: ".magic-section",
    start: "top 85%", // when top of section reaches 85% of viewport height
    toggleActions: "play none none none", // only play once
  },
  defaults: { ease: "power2.out" }
})
  .from(".pre-text", { y: -30, opacity: 0, duration: 1 })
  .from(".magic-word", { scale: 0.6, opacity: 0, duration: 1 }, "-=0.3")
  .from(".post-text", { y: 30, opacity: 0, duration: 1 }, "-=0.4");


   window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    if (!document.querySelector(".next-section")) {
      return;
    }

    gsap.from(".next-section h3", {
      scrollTrigger: {
        trigger: ".next-section",
        start: "top 85%",
        toggleActions: "play none none none",
        once: true
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power2.out"
    });
  });
function init() {
  gsap.set(".subContainer", { autoAlpha: 1 });
  gsap.set(".cardContainer", { y: "-150%" });
  gsap.set(".left", { x: "-100%" });
  gsap.set(".right", { x: "100%" });
  gsap.set(".dots", { x: "-50" });

  let currentStep = 0;
  const totalSlides = document.querySelectorAll(".cardContainer").length;
  const wrapper = gsap.utils.wrap(0, totalSlides);

  createTimelineIn("next", currentStep);
  createNavigation();

  function createTimelineIn(direction, index) {
    const goPrev = direction === "prev";

    const cardContainer = document.querySelector(".cardContainer0" + index);
    const left = cardContainer.querySelector(".left");
    const right = cardContainer.querySelector(".right");
    const card = cardContainer.querySelector(".card");
    const facts = cardContainer.querySelectorAll("p");
    const paragraphs = cardContainer.querySelectorAll("h3");
    const morphId = `#title-path-` + (index + 1);

    const tlIn = gsap.timeline();
    tlIn
      .fromTo(
        cardContainer,
        {
          autoAlpha: 0,
          y: "-150%"
        },
        {
          duration: 0.3,
          y: 0,
          autoAlpha: 1
        },
        "+=2"
      )
      .fromTo(
        card,
        {
          autoAlpha: 0,
          y: "-100%"
        },
        {
          y: 0,
          duration: 0.5,
          autoAlpha: 1,
          modifiers: {
            y: gsap.utils.unitize(function (y) {
              return goPrev ? Math.abs(y) : y;
            })
          }
        },
        "-=0.1"
      )
      .fromTo(
        right,
        {
          autoAlpha: 0,
          x: "100%"
        },
        {
          duration: 0.5,
          x: 0,
          autoAlpha: 1
        }
      )
      .fromTo(
        left,
        {
          autoAlpha: 0,
          x: "-100%"
        },
        {
          duration: 0.5,
          x: 0,
          autoAlpha: 1
        },
        "-=0.2"
      )
      .from(facts, {
        x: -20,
        y: 30,
        autoAlpha: 0,
        scale: 0.1,
        rotation: "-60deg",
        transformOrigin: "0 100% 0",
        stagger: 0.02,
        duration: 0.25,
        ease: Power1.out
      })
      .to("#logo-path", {
        morphSVG: { shape: morphId, scale: 1.2, shapeIndex: 65 },
        duration: 0.8,
        y: 80,
        x: 80
      })

      .fromTo(
        paragraphs,
        {
          autoAlpha: 0,
          y: "100%"
        },
        {
          duration: 0.5,
          y: 0,
          autoAlpha: 1,
          stagger: 0.2
        },
        "-=0.25"
      )
      .fromTo(
        ".bottomButton",
        {
          y: 50,
          autoAlpha: 0
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.2
        }
      )
      .fromTo(
        ".topButton",
        {
          y: -50,
          autoAlpha: 0
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.2
        },
        "-=0.2"
      )
      .fromTo(
        ".dots",
        {
          x: -50,
          autoAlpha: 0
        },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.2
        },
        "-=0.2"
      );
  }

  function createTimelineOut(direction, index) {
    const goPrev = direction === "prev";

    const cardContainer = document.querySelector(".cardContainer0" + index);
    const paragraphs = cardContainer.querySelectorAll("h3");

    const tlOut = gsap.timeline();
    tlOut
      .fromTo(
        paragraphs,
        {
          autoAlpha: 1
        },
        {
          duration: 0.4,
          autoAlpha: 0,
          stagger: 0.2
        }
      )
      .to(cardContainer, {
        duration: 0.5,
        y: 250,
        autoAlpha: 0,
        ease: "back.in(2)",
        modifiers: {
          y: gsap.utils.unitize(function (y) {
            return goPrev ? -y : y;
          })
        }
      })
      .to(cardContainer, {
        duration: 0.1,
        y: "-150%"
      })
      .to(".dots", {
        x: -50,
        autoAlpha: 0,
        duration: 0.2
      })
      .to(
        ".bottomButton",
        {
          y: 100,
          autoAlpha: 0,
          duration: 0.2
        },
        "-=0.2"
      )
      .to(
        ".topButton",
        {
          y: -100,
          autoAlpha: 0,
          duration: 0.2
        },
        "-=0.2"
      )
      .to(
        "#logo-path",
        {
          morphSVG: "#logo-path",
          scale: 1,
          duration: 0.5,
          y: 0,
          x: 0
        },
        "-=0.4"
      );
    return tlOut;
  }

  function updateCurrentStep(goToIndex) {
    currentStep = goToIndex;

    document
      .querySelectorAll(".jordan-logo-small-holder")
      .forEach((holder, i) => {
        holder.setAttribute("class", "jordan-logo-small-holder");

        if (i === currentStep) {
          holder.classList.add("active");
        }
      });
  }

  function transition(direction, toIndex) {
    const tlTransition = gsap.timeline({
      onStart: function () {
        updateCurrentStep(toIndex);
      }
    });

    const tlOut = createTimelineOut(direction, currentStep);
    const tlIn = createTimelineIn(direction, toIndex);

    tlTransition.add(tlOut).add(tlIn);

    return tlTransition;
  }

  function isTweening(index) {
    return (
      gsap.isTweening(".cardContainer0" + index) ||
      gsap.isTweening("#logo-path") ||
      gsap.isTweening("#jordan-logo") ||
      gsap.isTweening(".card") ||
      gsap.isTweening(".right") ||
      gsap.isTweening(".left") ||
      gsap.isTweening("p") ||
      gsap.isTweening("h3") ||
      gsap.isTweening("#title-path")
    );
  }

  document
    .querySelector(".bottomButton")
    .addEventListener("click", function (e) {
      e.preventDefault();

      const nextStep = wrapper(currentStep + 1);

      !isTweening(currentStep) && transition("next", nextStep);
    });

  document.querySelector(".topButton").addEventListener("click", function (e) {
    e.preventDefault();

    const prevStep = wrapper(currentStep - 1);

    !isTweening(currentStep) && transition("prev", prevStep);
  });

  function createNavigation() {
    const newDiv = document.querySelector(".dots");

    for (let index = 0; index < totalSlides; index++) {
      const holder = document.createElement("button");
      const img = document.createElement("object");
      const cover = document.createElement("span");

      holder.setAttribute("class", "jordan-logo-small-holder");
      cover.setAttribute("class", `cover`);
      img.setAttribute("class", `jordan-logo-small`);
      img.setAttribute("type", "image/svg+xml");
      img.setAttribute(
        "data",
        ""
      );

      holder.appendChild(img);
      holder.appendChild(cover);

      if (currentStep === index) {
        holder.classList.add("active");
      }

      cover.addEventListener("click", function () {
        if (!isTweening() && currentStep !== index) {
          const direction = index > currentStep ? "next" : "prev";
          transition(direction, index);
        }
      });

      newDiv.appendChild(holder);
    }
    document.querySelector(".container").appendChild(newDiv);
  }
}
window.addEventListener("load", function () {
  init();
});
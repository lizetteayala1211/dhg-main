
////// Pop-out Sub Navigation ///////

// jQuery element variables
var $hamburgerMenuBtn,
  $slideNav,
  $closeBtn,
  $main;

// focus management variables
var $focusableInNav,
  $firstFocusableElement,
  $lastFocusableElement;

$(document).ready(function () {
  $hamburgerMenuBtn = $("#hamburger-menu__mid, #hamburger-menu__dark"),
    $slideNav = $("#slide-nav"),
    $closeBtn = $("#close"),
    $main = $("main"),
    $focusableInNav = $('#slide-nav button, #slide-nav [href], #slide-nav input, #slide-nav select, #slide-nav textarea, #slide-nav [tabindex]:not([tabindex="-1"])');
  if ($focusableInNav.length) {
    $firstFocusableElement = $focusableInNav.first();
    $lastFocusableElement = $focusableInNav.last();
  }
  addEventListeners();


  ////// Introduction Arrow Scroll to Top on Click ///////
  $("#intro-arrow").click(function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  ////// Zoom in on Object Images when Clicked ///////
  $('img[data-enlargeable]').addClass('img-enlargeable').click(function () {
    var src = $(this).attr('src');
    var modal;

    function removeModal() {
      modal.remove();
      $('body').off('keyup.modal-close');
    }
    modal = $('<div>').css({
      background: 'RGBA(0,0,0,.6) url(' + src + ') no-repeat center',
      backgroundSize: 'contain',
      width: '100%',
      height: '100%',
      position: 'fixed',
      zIndex: '10000',
      top: '0',
      left: '0',
      cursor: 'zoom-out'
    }).click(function () {
      removeModal();
    }).appendTo('body');
    //handling ESC
    $('body').on('keyup.modal-close', function (e) {
      if (e.key === 'Escape') {
        removeModal();
      }
    });
  });

  ////// Object Image Carousel(s) ///////

  // DOM utility functions:

  const el = (sel, par) => (par || document).querySelector(sel);
  const els = (sel, par) => (par || document).querySelectorAll(sel);
  const elNew = (tag, prop) => Object.assign(document.createElement(tag), prop);

  // Helper functions:

  const mod = (n, m) => (n % m + m) % m;

  // Task: Carousel:

  const carousel = (elCarousel) => {

    const animation = 500;
    const pause = 5000;
    // Or use something like: const animation = Math.abs(elCarousel.dataset.carouselAnimation ?? 500);

    const elCarouselSlider = el(".carousel-slider", elCarousel);
    const elsSlides = els(".carousel-slide", elCarouselSlider);
    const elsBtns = [];

    let itv; // Autoslide interval
    let tot = elsSlides.length; // Total slides
    let c = 0;

    if (tot < 2) return; // Not enough slides. Do nothing.

    // Methods:
    const anim = (ms = animation) => {
      const cMod = mod(c, tot);
      // Move slider
      elCarouselSlider.style.transitionDuration = `${ms}ms`;
      elCarouselSlider.style.transform = `translateX(${(-c - 1) * 100}%)`;
      // Handle active classes (slide and bullet)
      elsSlides.forEach((elSlide, i) => elSlide.classList.toggle("is-active", cMod === i));
      elsBtns.forEach((elBtn, i) => elBtn.classList.toggle("is-active", cMod === i));
    };

    const prev = () => {
      if (c <= -1) return; // prevent blanks on fast prev-click
      c -= 1;
      anim();
    };

    const next = () => {
      if (c >= tot) return; // prevent blanks on fast next-click
      c += 1;
      anim();
    };

    const goto = (index) => {
      c = index;
      anim();
    };

    const play = () => {
      itv = setInterval(next, pause + animation);
    };

    const stop = () => {
      clearInterval(itv);
    };

    // Buttons:

    const elPrev = elNew("button", {
      type: "button",
      className: "carousel-prev",
      innerHTML: "<span>&larr;</span>",
      onclick: () => prev(),
    });

    const elNext = elNew("button", {
      type: "button",
      className: "carousel-next",
      innerHTML: "<span>&rarr;</span>",
      onclick: () => next(),
    });

    // Navigation:

    const elNavigation = elNew("div", {
      className: "carousel-navigation",
    });

    // Navigation bullets:

    for (let i = 0; i < tot; i++) {
      const elBtn = elNew("button", {
        type: "button",
        className: "carousel-bullet",
        onclick: () => goto(i)
      });
      elsBtns.push(elBtn);
    }


    // Events:

    // Infinite slide effect:
    elCarouselSlider.addEventListener("transitionend", () => {
      if (c <= -1) c = tot - 1;
      if (c >= tot) c = 0;
      anim(0); // quickly switch to "c" slide (with animation duration 0)
    });

    // Pause on pointer enter:
    elCarousel.addEventListener("pointerenter", () => stop());
    elCarousel.addEventListener("pointerleave", () => play());

    // Init:

    // Insert UI elements:
    elNavigation.append(...elsBtns);
    elCarousel.append(elPrev, elNext, elNavigation);

    // Clone first and last slides (for "infinite" slider effect)
    elCarouselSlider.prepend(elsSlides[tot - 1].cloneNode(true));
    elCarouselSlider.append(elsSlides[0].cloneNode(true));

    // Initial slide
    anim(0);

    // Start autoplay
    play();
  };

  // Allows to use multiple carousels on the same page:
  els(".carousel").forEach(carousel);


////// Language Toggle EN/SP Global //////

  // Switching to English
  $(".language-en-button").on("click", function () {

    $('[lang="sp"]').hide();
    $('#landing [lang="en"]').css('display', 'block');
    $('#global [lang="en"]').css('display', 'block');
  });

  // Switching to Spanish
  $(".language-sp-button").on("click", function () {

      $('[lang="sp"]').show();
      $('#landing [lang="en"]').css('display', 'none');
      $('#global [lang="en"]').css('display', 'none');

  });


////// Show/Hide (Object Inner Pages) Button Toggle ///////
  $('#open-bottom-row-two').click(function () {
    var toggleIcon = $(this).find('.toggle_icon');
    toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
    $(".artist-bio.accordion-content").slideToggle();
  })

// Object Inner Pages (About) Drawer Toggle Open //
  let buttons = document.querySelectorAll('button.objects');
  let bios = document.querySelectorAll('.about');

  buttons.forEach(button => {
    button.addEventListener('click', e => {
      bios.forEach(about => {
        about.style.display = about.id === e.target.dataset.about ? 'block' : 'none';
      });
      // $(".artist-bio.accordion-content").slideUp("slow");
    });
  });

////// Show/Hide (Credits 01) Button Toggle ///////
  $('.credits-title-one').click(function () {
    var toggleIcon = $(this).find('.toggle_icon');
    toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
    $(".accordion-content.first").slideToggle("slow");
  })

  // Credits Page (Curator) Drawer Toggle Open //
  let curator = document.querySelectorAll('button.curators');
  let cucopy = document.querySelectorAll('.curators');

  curator.forEach(button => {
    button.addEventListener('click', e => {
      cuopy.forEach(curators => {
        curators.style.display = curators.id === e.target.dataset.curators ? 'block' : 'none';
      });
      $(".accordion-content.first").slideToggle("slow");
    });
  });

  ////// Show/Hide (Credits 02) Button Toggle ///////
  $('.credits-title-two').click(function () {
    var toggleIcon = $(this).find('.toggle_icon');
    toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
    $(".credit-bios.accordion-content.second").slideToggle("slow");
  })

  // Credits Page (Contributor) Drawer Toggle Open //
  // let contributor = document.querySelectorAll('button.contributors-top');
  // let cocopy = document.querySelectorAll('.cp');

  // contributor.forEach(button => {
  //   button.addEventListener('click', e => {
  //     cocopy.forEach(cp => {
  //       cp.style.display = cp.id === e.target.dataset.cp ? 'block' : 'none';
  //     });
  //     $(".credit-bios.accordion-content.second").slideToggle("slow");
  //   });
  // });

  ////// Show/Hide (Resources 01) Button Toggle ///////
  $('.resources-title.first').click(function () {
    var toggleIcon = $(this).find('.toggle_icon');
    toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
    $(".digital-archives.accordion-content").slideToggle("slow");
  })

  // Resources Page (Digital Archives) Drawer Toggle Open //

  // let digitals = document.querySelectorAll('button.digital-top');
  // let dcopy = document.querySelectorAll('.digital');

  // digitals.forEach(button => {
  //   button.addEventListener('click', e => {
  //     dcopy.forEach(digital => {
  //       digital.style.display = digital.id === e.target.dataset.digital ? 'block' : 'none';
  //     });
  //     $(".digital-archives.accordion-content").slideToggle("slow");
  //   });
  // });

  ////// Show/Hide (Resources 02) Button Toggle ///////
  $('.resources-title.second').click(function () {
    var toggleIcon = $(this).find('.toggle_icon');
    toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
    $(".books-articles.accordion-content").slideToggle("slow");
  })

  // Resources Page (Books & Articles) Drawer Toggle Open //

  // let bookandsnarticles = document.querySelectorAll('button.books-articles-top');
  // let bcopy = document.querySelectorAll('.ba');

  // bookandsnarticles.forEach(button => {
  //   button.addEventListener('click', e => {
  //     bcopy.forEach(ba => {
  //       ba.style.display = ba.id === e.target.dataset.ba ? 'block' : 'none';
  //     });
  //     $(".books-articles.accordion-content").slideToggle("slow");
  //   });
  // });

  ////// Show/Hide (Resources 03) Button Toggle ///////

  $('.resources-title.third').click(function () {
    var toggleIcon = $(this).find('.toggle_icon');
    toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
    $(".interviews-profiles.accordion-content").slideToggle("slow");
  })

  // Resources Page (Artist Interviews & Profiles) Drawer Toggle Open //
  // let interviewsnprofiles = document.querySelectorAll('button.interviews-profiles-top');
  // let icopy = document.querySelectorAll('.ip');

  // interviewsnprofiles.forEach(button => {
  //   button.addEventListener('click', e => {
  //     icopy.forEach(ip => {
  //       ip.style.display = ip.id === e.target.dataset.ip ? 'block' : 'none';
  //     });
  //     $(".interviews-profiles.accordion-content").slideToggle("slow");
  //   });
  // });

  ////// Show/Hide (Teaching Guide 01) Button Toggle ///////
  $('#guides-title-one').click(function () {
    var toggleIcon = $(this).find('.toggle_icon');
    toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
    $(".guides-copy.accordion-content.first").slideToggle("slow");
  })

  // Teaching Guides Page (Lesson 01) Drawer Toggle Open //
  // let mujeresinmurals = document.querySelectorAll('button.la-harlem-top');
  // let lcopy = document.querySelectorAll('.la');

  // mujeresinmurals.forEach(button => {
  //   button.addEventListener('click', e => {
  //     lcopy.forEach(la => {
  //       la.style.display = la.id === e.target.dataset.la ? 'block' : 'none';
  //     });
  //     $(".guides-copy.accordion-content.first").slideToggle("slow");
  //   });
  // });

////// Show/Hide (Teaching Guide 02) Button Toggle ///////
$('#guides-title-two').click(function () {
  var toggleIcon = $(this).find('.toggle_icon');
  toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
  $(".guides-copy.accordion-content.second").slideToggle("slow");
})

// Teaching Guides Page (Lesson 01) Drawer Toggle Open //
// let neighborhoodnmurals = document.querySelectorAll('button.neighborhood-murals-top');
// let ncopy = document.querySelectorAll('.nm');

// neighborhoodnmurals.forEach(button => {
//   button.addEventListener('click', e => {
//     ncopy.forEach(nm => {
//       nm.style.display = nm.id === e.target.dataset.nm ? 'block' : 'none';
//     });
//     $(".guides-copy.accordion-content.second").slideToggle("slow");
//   });
// });
  
  ////// Show/Hide (Dialogues 01) Button Toggle ///////
  $('.dialogues-title.first').click(function () {
    let toggleIcon = $(this).find('.toggle_icon');
    toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+');
    $(".dialogues-copy-container.accordion-content.first").slideToggle("slow");
  });
  
  // Dialogues Page (01, Patssi & Mario) Drawer Toggle Open //
  // let patssinmario = document.querySelectorAll('button.patssi-mario-top');
  // let pmcopy = document.querySelectorAll('.pm');
  
  // patssinmario.forEach(button => {
  //   button.addEventListener('click', e => {
  //     pmcopy.forEach(pm => {
  //       pm.style.display = pm.id === e.target.dataset.pm ? 'block' : 'none';
  //     });
  //     $(".dialogues-copy-container.accordion-content.first.pm").slideToggle("slow");
  //   });
  // });

  ////// Show/Hide (Dialogues 02) Button Toggle ///////
  $('.dialogues-title.second').click(function () {
    let toggleIcon = $(this).find('.toggle_icon');
    toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+');
    $(".dialogues-copy-container.accordion-content.second").slideToggle("slow");
  });

  // Dialogues Page (02, Timoi & Lady Pink) Drawer Toggle Open //
  // let timoinladypink = document.querySelectorAll('button.timoi-ladypink-top');
  // let tlpcopy = document.querySelectorAll('.tlp');
  
  // timoinladypink.forEach(button => {
  //   button.addEventListener('click', e => {
  //     tlpcopy.forEach(tlp => {
  //       tlp.style.display = tlp.id === e.target.dataset.tlp ? 'block' : 'none';
  //     });
  //     $(".dialogues-copy-container.accordion-content.second").slideToggle("slow");
  //   });
  // });

  ////// Show/Hide (Dialogues 03) Button Toggle ///////
  $('.dialogues-title.third').click(function () {
    let toggleIcon = $(this).find('.toggle_icon');
    toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+');
    $(".dialogues-copy-container.accordion-content.third").slideToggle("slow");
  });

  // Dialogues Page (03, Yreina & Judithe) Drawer Toggle Open //
  // let yreinanjudithe = document.querySelectorAll('button.yreina-judithe-top');
  // let yjpcopy = document.querySelectorAll('.yj');
  
  // yreinanjudithe.forEach(button => {
  //   button.addEventListener('click', e => {
  //     yjpcopy.forEach(tlp => {
  //       yj.style.display = yj.id === e.target.dataset.yj ? 'block' : 'none';
  //     });
  //     $(".dialogues-copy-container.accordion-content.third").slideToggle("slow");
  //   });
  // });


  // <!-- Archive Page Shuffle Effect -->

  // $(function () {
  //   var parent = $("#shuffle");
  //   var divs = parent.children();
  //   while (divs.length) {
  //     parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
  //   }
  // });


  // document.querySelectorAll('.toggle-label.index').forEach(button => {
  //   button.addEventListener('click', function () {
  //     document.querySelectorAll('.toggle-label.index').forEach(btn => {
  //       btn.classList.remove('active')
  //     })

  //     //Add active to the clicked button
  //     this.classList.add('active');
  //   })

  // })


});

function addEventListeners() {
  $hamburgerMenuBtn.click(openNav);
  $closeBtn.click(closeNav);
  $slideNav.on("keyup", closeNav);
  $firstFocusableElement.on("keydown", moveFocusToBottom);
  $lastFocusableElement.on("keydown", moveFocusToTop);
}

function openNav() {
  $slideNav.addClass("visible active");
  setTimeout(function () {
    $firstFocusableElement.focus()
  }, 1);
  $main.attr("aria-hidden", "true");
  $hamburgerMenuBtn.attr("aria-hidden", "true");
}

function closeNav(e) {
  if (e.type === "keyup" && e.key !== "Escape") {
    return;
  }

  $slideNav.removeClass("active");
  $main.removeAttr("aria-hidden");
  $hamburgerMenuBtn.removeAttr("aria-hidden");
  setTimeout(function () {
    $hamburgerMenuBtn.focus()
  }, 1);
  setTimeout(function () {
    $slideNav.removeClass("visible")
  }, 501);
}

function moveFocusToTop(e) {
  if (e.key === "Tab" && !e.shiftKey) {
    e.preventDefault();
    $firstFocusableElement.focus();
  }
}

function moveFocusToBottom(e) {
  if (e.key === "Tab" && e.shiftKey) {
    e.preventDefault();
    $lastFocusableElement.focus()
  }
}

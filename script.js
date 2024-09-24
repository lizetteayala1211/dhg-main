
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


  // Language Toggle EN/SP Global //

  // // Introduction Page
  // $(".introduction.sp.toggleable-spanish-text").removeClass('active');
  // $(".introduction.sp.toggleable-spanish-text").addClass('reactive');
  // $('.introduction.sp.toggleable-spanish-text').attr('style', 'display: none !important');

  // // Teaching Guide(s) Page
  // $(".guides.02.hidden.sp.toggleable-spanish-text").removeClass('active');
  // $(".guides.02.hidden.sp.toggleable-spanish-text").addClass('reactive');
  // $(".guides.01.hidden.sp.toggleable-spanish-text").removeClass('active');
  // $(".guides.01.hidden.sp.toggleable-spanish-text").addClass('reactive');
  // $(".guides.01.hidden.sp.toggleable-spanish-text").attr('style', 'display: none !important');

  // // Credits Page
  // $(".accordion-content.01").slideToggle("slow");
  // $('.curators.01.hidden.en.toggleable-english-text').addClass('active');
  // $('.curators.01.hidden.sp.toggleable-spanish-text').attr('style', 'display: none !important');
  // $(".accordion-content.02").slideToggle("slow");
  // $('.credits.02.hidden.en.toggleable-english-text').addClass('active');
  // $('.credits.02.hidden.sp.toggleable-spanish-text').attr('style', 'display: none !important');

  // $(".about.hidden.sp.toggleable-spanish-text").addClass('reactive');



  // Switching to English
  $(".language-en-button").on("click", function () {

  // Introduction Page
  $(".introduction.sp.toggleable-spanish-text").removeClass('active');
  $('.introduction.sp.toggleable-spanish-text').attr('style', 'display: none !important');

  // Credits Page
  // $('.credits.02.hidden.en.toggleable-english-text').removeClass('reactive');
  // $('.credits.02.hidden.en.toggleable-english-text').attr('style', 'display: block !important');
  // $('.credits.02.hidden.sp.toggleable-spanish-text').attr('style', 'display: none !important');
  // $('.credits.02.hidden.sp.toggleable-spanish-text').addClass('reactive');
  // $('.credits.02.hidden.en.toggleable-english-text').addClass('active');
  // $('.curators.01.hidden.en.toggleable-english-text').removeClass('reactive');
  // $('.curators.01.hidden.en.toggleable-english-text').addClass('active');
  // $('.credits.01.hidden.sp.toggleable-spanish-text').addClass('reactive');
  // $('.curators.01.hidden.en.toggleable-english-text').attr('style', 'display: block !important');
  // $('.curators.01.hidden.sp.toggleable-spanish-text').attr('style', 'display: none !important');
  

    // $(".about.hidden.en.toggleable-english-text").css('display', 'block');
    // $(".toggleable-english-text").css('display', 'block');
    // $(".toggleable-spanish-text").css('display', 'none');
    // $(".accordion-content").css('display', 'none');
    // $(".toggleable-spanish-text").hide();
    // $(".toggleable-english-text").show();

    if ($(".toggleable-english-text").css("display") == 'block') {
      $(".toggleable-spanish-text").hide();
    } else {
      $(".toggleable-english-text").css('display', 'block');
    }
  });

  // Switching to Spanish
  $(".language-sp-button").on("click", function () {

    // Introduction Page
    $(".introduction.sp.toggleable-spanish-text").removeClass('reactive');
    $(".introduction.sp.toggleable-spanish-text").addClass('active');

     // Teaching Guide Page
    // $(".guides.02.hidden.en.toggleable-english-text").toggleClass('reactive');
    // $(".guides.01.hidden.en.toggleable-english-text").toggleClass('reactive');

    // $(".guides.02.hidden.sp.toggleable-spanish-text").removeClass('reactive');

    // $(".guides.01.hidden.sp.toggleable-spanish-text").removeClass('reactive');

    // Object Inner Pages
    // $(".about.hidden.sp.toggleable-spanish-text").css('display', 'block');
    // $(".about.hidden.sp.toggleable-spanish-text").removeClass('reactive');

    // // Credits Page
    // $('.credits.02.hidden.en.toggleable-english-text').addClass('reactive');
    // $('.curators.01.hidden.en.toggleable-english-text').addClass('reactive');

    // $(".toggleable-spanish-text").css('display', 'block');
    // $(".toggleable-english-text").css('display', 'none');
    // $(".accordion-content").css('display', 'none');
    // $(".toggleable-spanish-text").show();
    // $(".toggleable-english-text").hide();

    if ($(".toggleable-spanish-text").css("display") == 'block') {
      $(".toggleable-english-text").hide();
    } else {
      $(".toggleable-spanish-text").css('display', 'none');
    }
  });

  // ////// Show/Hide (Object Inner Pages) Button Toggle ///////
  // $('#open-bottom-row-two').click(function () {
  //   var toggleIcon = $(this).find('.toggle_icon');
  //   toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
  //   $(".accordion-content").css('display', 'block');
  // })

  // // Object Inner Pages (About) Drawer Toggle Open //
  // let buttons = document.querySelectorAll('button.objects');
  // let bios = document.querySelectorAll('.about');

  // buttons.forEach(button => {
  //   button.addEventListener('click', e => {
  //     bios.forEach(about => {
  //       about.style.display = about.id === e.target.dataset.about ? 'block' : 'none';
  //     });
  //     $(".accordion-content").slideToggle("slow");
  //   });
  // });

  //   // Object Inner Pages
  //   $(".about.hidden.sp.toggleable-spanish-text").css('display', 'block');




  // ////// Show/Hide (Credits 01) Button Toggle ///////
  // $('.credits-title-one').click(function () {
  //   var toggleIcon = $(this).find('.toggle_icon');
  //   toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
  //   $(".curators.01.hidden").css('display', 'block');
  //   $(".accordion-content.01").slideToggle("slow");
  //   $('.curators.01.hidden.sp.toggleable-spanish-text').slideToggle("fast");
  //   $('.curators.01.hidden').slideToggle("slow");
  //   $('.label-hr.d-a.hidden').slideToggle("fast");
  // })

  // // Credits Page (Curator) Drawer Toggle Open //
  // $('.credits-title-one').on('click', function () {
  //   $('.label-hr.curators-line.hidden').slideToggle("fast");
  // }
  // );

  // ////// Show/Hide (Credits 02) Button Toggle ///////
  // $('.credits-title-two').click(function () {
  //   var toggleIcon = $(this).find('.toggle_icon');
  //   toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
  //   $(".credits.02.hidden").css('display', 'block');
  //   $(".accordion-content.02").slideToggle("slow");
  //   $('.credits.02.hidden.en.toggleable-english-text').slideToggle("fast");
  //   $('.credits.02.hidden.sp.toggleable-spanish-text').slideToggle("fast");
  //   $('.credits.02.hidden').slideToggle("slow");
  // })

  // // Credits Page (Contributor) Drawer Toggle Open //
  // $('.credits-title-two').on('click', function () {
  //   $('.label-hr.contributors.hidden').slideToggle("slow");
  // }
  // );

  // let creditsbuttons = document.querySelectorAll('button.credits');
  // let creditbios = document.querySelectorAll('.credits');

  // creditsbuttons.forEach(button => {
  //   button.addEventListener('click', e => {
  //     creditbios.forEach(about => {
  //       credits.style.display = credits.id === e.target.dataset.credits ? 'block' : 'none';
  //     });
  //     $(".accordion-content").slideToggle("slow");
  //   });
  // });




  // ////// Show/Hide (Resources) Button Toggle ///////
  // $('.resources-title.first').click(function () {
  //   var toggleIcon = $(this).find('.toggle_icon');
  //   toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
  //   $(".accordion-content").css('display', 'block');
  //   $('.label-hr.d-a.hidden').slideToggle("fast");
  // })

  // // Resources Page (Digital Archives) Drawer Toggle Open //
  // $('.resources-title.first').on('click', function () {
  //   var toggleIcon = $(this).find('.toggle_icon');
  //   toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
  //   $('.resources.archives.hidden').slideToggle("slow");
  //   $('.label-hr.d-a.hidden').slideToggle("fast");
  // }
  // );

  // // Resources Page (Books & Articles) Drawer Toggle Open //
  // $('.resources-title.second').on('click', function () {
  //   $('.resources.books-articles.hidden').slideToggle("slow");
  //   $('.label-hr.b-a.hidden').slideToggle("fast");
  // }
  // );

  // // Resources Page (Artist Interviews & Profiles) Drawer Toggle Open //
  // $('.resources-title.third').on('click', function () {
  //   $('.resources.interviews-profiles.hidden').slideToggle("slow");
  //   $('.label-hr.r-i-p.hidden').slideToggle("fast");
  // }
  // );




  // ////// Show/Hide (Dialogues) Button Toggle ///////
  // $('.dialogues-title').click(function () {
  //   let toggleIcon = $(this).find('.toggle_icon');
  //   toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+');
  // });

  // // Dialogues Page (Dialogue 01) Drawer Toggle Open //
  // $('.dialogues-title.first').on('click', function () {

  //   // close all other dialogues
  //   $('#timoi-ladypink.hidden').slideUp("fast");
  //   $('#yreina-judithe.hidden').slideUp("fast");
  //   $('.dialogues.02.moderator.hidden').slideUp("fast");
  //   $('.dialogues.02.first-person.hidden').slideUp("fast");
  //   $('.dialogues.02.second-person.hidden').slideUp("fast");
  //   $('.dialogues.02.end.hidden').slideUp("fast");
  //   $('.dialogues.03.moderator.hidden').slideUp("fast");
  //   $('.dialogues.03.first-person.hidden').slideUp("fast");
  //   $('.dialogues.03.second-person.hidden').slideUp("fast");
  //   $('.dialogues.03.end.hidden').slideUp("fast");


  //   // set up '+' for all other dialogues
  //   $('.dialogues-title.second .toggle_icon').text('+');
  //   $('.dialogues-title.third .toggle_icon').text('+');

  //   // open dialogue 01
  //   $('.dialogues.01.first-person.hidden').slideToggle("fast");
  //   $('.dialogues.01.second-person.hidden').slideToggle("fast");
  //   $('.dialogues.01.end.hidden').slideToggle("fast");
  //   $('#patssi-mario.hidden').slideToggle("slow");
  // });

  // // Dialogues Page (Dialogue 02) Drawer Toggle Open //
  // $('.dialogues-title.second').on('click', function () {
  //   // close all other dialogues
  //   $('.dialogues.01.first-person.hidden').slideUp("fast");
  //   $('.dialogues.01.second-person.hidden').slideUp("fast");
  //   $('.dialogues.01.end.hidden').slideUp("fast");
  //   $('#patssi-mario.hidden').slideUp("slow");
  //   $('.dialogues.03.moderator.hidden').slideUp("fast");
  //   $('.dialogues.03.first-person.hidden').slideUp("fast");
  //   $('.dialogues.03.second-person.hidden').slideUp("fast");
  //   $('.dialogues.03.end.hidden').slideUp("fast");
  //   $('#yreina-judithe.hidden').slideUp("fast");

  //   // set up '+' for all other dialogues
  //   $('.dialogues-title.first .toggle_icon').text('+');
  //   $('.dialogues-title.third .toggle_icon').text('+');

  //   // open dialogue 02
  //   $('.dialogues.02.moderator.hidden').slideToggle("slow");
  //   $('.dialogues.02.first-person.hidden').slideToggle("slow");
  //   $('.dialogues.02.second-person.hidden').slideToggle("slow");
  //   $('.dialogues.02.end.hidden').slideToggle("slow");
  //   $('#timoi-ladypink.hidden').slideToggle("slow");
  // });

  // // Dialogues Page (Dialogue 03) Drawer Toggle Open //
  // $('.dialogues-title.third').on('click', function () {
  //   // close all other dialogues
  //   $('.dialogues.01.first-person.hidden').slideUp("slow");
  //   $('.dialogues.01.second-person.hidden').slideUp("slow");
  //   $('.dialogues.01.end.hidden').slideUp("slow");
  //   $('#patssi-mario.hidden').slideUp("slow");
  //   $('.dialogues.02.moderator.hidden').slideUp("slow");
  //   $('.dialogues.02.first-person.hidden').slideUp("slow");
  //   $('.dialogues.02.second-person.hidden').slideUp("slow");
  //   $('.dialogues.02.end.hidden').slideUp("slow");
  //   $('#timoi-ladypink.hidden').slideUp("slow");

  //   // set up '+' for all other dialogues
  //   $('.dialogues-title.first .toggle_icon').text('+');
  //   $('.dialogues-title.second .toggle_icon').text('+');

  //   // open dialogue 03
  //   $('.dialogues.03.moderator.hidden').slideToggle("slow");
  //   $('.dialogues.03.first-person.hidden').slideToggle("slow");
  //   $('.dialogues.03.second-person.hidden').slideToggle("slow");
  //   $('.dialogues.03.end.hidden').slideToggle("slow");
  //   $('#yreina-judithe.hidden').slideToggle("slow");
  // });




  // ////// Show/Hide (Teaching Guide 01) Button Toggle ///////
  // $('#guides-title-two').click(function () {
  //   var toggleIcon = $(this).find('.toggle_icon');
  //   toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
  //   $(".accordion-content.02").css('display', 'block');
  // })

  // // Teaching Guides Page (Lesson 01) Drawer Toggle Open //
  // $('#guides-title-two').on('click', function () {
  //   // $('.label-hr.guides-02.hidden').addClass('active');
  //   $('.label-hr.guides-02.hidden').slideToggle("fast");
  //   $('.guides.02.hidden').slideToggle("slow");
  //   // $(".guides.02.hidden.sp.toggleable-spanish-text").addClass('active');
  // }
  // );

  // ////// Show/Hide (Teaching Guide 02) Button Toggle ///////
  // $('#guides-title-one').click(function () {
  //   var toggleIcon = $(this).find('.toggle_icon');
  //   toggleIcon.text(toggleIcon.text() === '+' ? '-' : '+')
  //   $('.label-hr.guides-01.hidden').slideToggle("fast");
  //   $(".accordion-content.01").css('display', 'block');
  // })

  // ////// Teaching Guides Page (Lesson 02) Drawer Toggle Open ///////
  // $('#guides-title-one').on('click', function () {
  //   $('.guides.01.hidden').slideToggle("slow");
  //   // $(".guides.01.hidden.sp.toggleable-spanish-text").removeClass('reactive');
  //   // $(".guides.01.hidden.sp.toggleable-spanish-text").addClass('active');
  // }
  // );

  

  // 
  
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
  

// $('[lang]').hide(); // hide all lang attributes on start.
// $('[lang="en"]').show(); // show just Korean text (you can change it)
// $('.language').change(function () { // put onchange event when user select option from select
//     var lang = $(this).val(); // decide which language to display using switch case. The rest is obvious (i think)
//     switch (lang) {
//         case 'sp':
//             $('[lang]').hide();
//             $('[lang="sp"]').show();
//         break;
//         case 'en':
//             $('[lang]').hide();
//             $('[lang="en"]').show();
//         break;
//         default:
//             $('[lang]').hide();
//             $('[lang="en"]').show();
//         }
// });









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

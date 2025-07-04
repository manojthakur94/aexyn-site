


  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(src);
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  (async () => {
    try {
      // Load libraries in order
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/jquery.waypoints.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/jquery.counterup@2.1.0/jquery.counterup.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.4.1/js/swiper.min.js");
      await loadScript("https://unpkg.com/gsap@3/dist/gsap.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js");

      wow = new WOW({
        boxClass: 'wow', // default
        animateClass: 'animated', // default
        offset: 100 // default
      });
      wow.init();


      $(".count").counterUp({
        delay: 5, /* The delay in milliseconds per number count up */
        time: 1000, /*The total duration of the count up animation */
        offset: 100
      });
      
      if ($(".client-slider").length > 0) {
        var client = new Swiper(".client-slider", {
          slidesPerView: "auto",
          spaceBetween: 0,
          freemode: true,
          centeredSlides: true,
          loop: true,
          speed: 5000,
          allowTouchMove: false,
          autoplay: {
            delay: 1,
            disableOnInteraction: true,
          },
        });
      }

      $('.navigation').after('<span class="menuOverlay"></span>')

      $('.has-children > a').click(function(e){
        e.preventDefault();
        $(this).next('.megaMenu').slideToggle();
        $(this).parent().siblings().children('.megaMenu').slideUp();
      });

      $('.menuTrigger').click(function(){
        $('body').toggleClass('mobile-open');
      })

      $('.menuClose, .menuOverlay').click(function(){
        $('body').removeClass('mobile-open');
      });

      $('.cm-header').hover(
        function() {
          $('body').addClass('prevent_scroll');
        },
        function() {
          $('body').removeClass('prevent_scroll');
        }
      );



      // Sticky Header
      $(window).scroll(function () {
          if ($(this).scrollTop() > 10) {
              $('body').addClass('fixheader');
          } else {
              $('body').removeClass('fixheader');
          }
      });

      


      let sections = gsap.utils.toArray(".case-slide");
      let mcs = gsap.matchMedia();
      mcs.add("(min-width: 768px)", () => {
          gsap.to(sections, {
              xPercent: -100 * (sections.length - 1),
              ease: "none",
              scrollTrigger: {
                  trigger: ".caseStudySection",
                  pin: true,
                  scrub: 1,
                  start: "top top",
                  snap: 1 / (sections.length - 1),
                  end: () => "+=" + document.querySelector(".case-slides").offsetWidth
              }
          });
      });

      
      let techSlider = document.querySelector('.tech-stack-slider');
      if(techSlider){
        new Swiper('.tech-stack-slider', {
            loop: true,
            slidesPerView: "auto",
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            slidesPerView: 6,
            spaceBetween: 30,
            pagination: {
              el: ".swiper-pagination",
            },
            breakpoints: {
                1920: {
                    slidesPerView: 6,
                    spaceBetween: 30
                },
                1028: {
                    slidesPerView: 4,
                    spaceBetween: 30
                },
                480: {
                    slidesPerView: 2,
                    spaceBetween: 30
                }
            }
        });
      }

      let serviceSlider = document.querySelector('.services-slider');
      if(serviceSlider){
        new Swiper('.services-slider', {
            loop: true,
            slidesPerView: "auto",
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            slidesPerView: 5,
            paginationClickable: true,
            centeredSlides: true,
            spaceBetween: 1,
            breakpoints: {
                1920: {
                    slidesPerView: 5,
                    spaceBetween: 1
                },
                1500: {
                    slidesPerView: 3,
                    spaceBetween: 1
                },
                767: {
                    slidesPerView: 2,
                    spaceBetween: 1,
                    centeredSlides: false
                },
                480: {
                    slidesPerView: 1,
                    spaceBetween: 1,
                    centeredSlides: false
                }
            }
        });
      }
      
      $('.faq_heading').click(function(e){
          e.preventDefault();
          $(this).parent().toggleClass('accordon_open');
          $(this).next().slideToggle();
          $(this).parent().parent().siblings().find('.faq_body').slideUp();
          $(this).parent().parent().siblings().find('.faq_card').removeClass('accordon_open')
      })


  
      

      


      console.log("All libraries loaded and initialized.");

    } catch (err) {
      console.error("Script loading failed:", err);
    }
  })();

  


  

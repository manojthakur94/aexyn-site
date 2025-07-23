
(function() {
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
        $('.megaMenu').slideUp();
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

      
      let caseElm = document.querySelector('.case-slide');
      if(caseElm) {
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
      }

      function tabberSliderInit() {
        const baseOptions = {
          loop: false,
          slidesPerView: 6,
          spaceBetween: 30,
          breakpoints: {
            1920: { slidesPerView: 6, spaceBetween: 30 },
            1028: { slidesPerView: 4, spaceBetween: 30 },
            480:  { slidesPerView: 2, spaceBetween: 30 }
          }
        };

        document.querySelectorAll('.tech-stack-slider').forEach(sliderEl => {
          const nextBtn = sliderEl.querySelector('.swiper-button-next');
          const prevBtn = sliderEl.querySelector('.swiper-button-prev');
          const options = {
            ...baseOptions
          };
          if (nextBtn && prevBtn) {
            options.nextButton = nextBtn;
            options.prevButton = prevBtn;
          }
          new Swiper(sliderEl, options);
        });
      }

      tabberSliderInit();
      $('.tabber_nav button').click(function (e) {
        e.preventDefault();
        const tabTarget = $(this).attr('data-target');
        $(this).addClass('active').siblings().removeClass('active');
        $(tabTarget).addClass('active_tab').siblings().removeClass('active_tab');
        setTimeout(() => {
           tabberSliderInit();
        }, 200); 
      });


      

      let serviceSlider = document.querySelector('.services-slider');
      if(serviceSlider){
        var swiper = new Swiper('.services-slider', {
            loop: true,
            slidesPerView: "auto",
            nextButton: '.services-slider .swiper-button-next',
            prevButton: '.services-slider .swiper-button-prev',
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


      function GetHeaderHeight() {
        $("header.header").css("min-height", $(".defaultHeader").outerHeight())
      }
      GetHeaderHeight();
      $(window).resize(GetHeaderHeight); 
  
    var JSON_PATH  = 'js/blogs.json'; 

    // BLog Recent Posts
    let recentPosts = document.querySelector("#recent-posts");
    if(recentPosts) {
      const JSON_PATH = 'js/blogs.json';
      const MAX_POSTS = 3;   

      fetch(JSON_PATH)
        .then(r => r.json())
        .then(posts => {
          // newest → oldest
          posts.sort((a, b) => new Date(b.date) - new Date(a.date));

          const latest = posts.slice(0, MAX_POSTS);
          console.log(latest)
          const html = latest.map(post => {
            const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            });

            // clickable tag links
            const tagsHTML = post.tags
              .map(tag => `
                <a class="tag-link"
                  href="/blog/?tag=${encodeURIComponent(tag)}">
                  ${tag}
                </a> <span class="divider_byline">, </span>`)
              .join(' ');

            return `
              <article class="custom-col-4 blogItem">
                <div class="blog-card">
                  <div class="blog-thumb">
                    <a href="${post.url}">
                      <img src="${post.featured_image}" alt="${post.title}">
                    </a>
                  </div>

                  <div class="blog-content">
                    <div class="blog-byline">
                      <div class="tags_holder">
                        ${tagsHTML}
                      </div>
                    </div>

                    <h4 class="title">
                      <a href="${post.url}">${post.title}</a>
                    </h4>

                    <div class="summary">${post.summary}</div>

                    <div class="byline">
                      <span class="authorName">${post.author}</span>
                      <span class="postDate">${formattedDate}</span>
                    </div>
                  </div>
                  <div class="readMoreHolder">
                    <a href="${post.url}" class="cm-btn read-more-btn">
                      <span class="btn-text">Read&nbsp;More</span>
                      <span class="btn-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                          <path style="fill:currentColor;" d="m17.5 5.999-.707.707 5.293 5.293H1v1h21.086l-5.294 5.295.707.707L24 12.499l-6.5-6.5z"/>
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
              </article>`;
          }).join('');

          document.getElementById('recent-posts').innerHTML = html;
        })
        .catch(console.error);
    }
    // Recent Posts end

    // Posts by tag
    var MAX_POSTS_PER_TAG   = 3; 
    function postCardHTML (post) {
      var formatted = new Date(post.date).toLocaleDateString('en-US',
                      {year:'numeric', month:'long', day:'numeric'});

      var tagsHTML  = post.tags.map(function (tag) {
        return '<a class="tag-link" href="/blog/?tag=' +
              encodeURIComponent(tag) + '">' + tag + '</a> <span class="divider_byline">, </span>';
      }).join(' ');

      return (
        '<div class="custom-col-4 blogItem">' +
          '<div class="blog-card">' +
            '<div class="blog-thumb">' +
              '<a href="' + post.url + '">' +
                '<img src="' + post.featured_image + '" alt="' + post.title + '">' +
              '</a>' +
            '</div>' +
            '<div class="blog-content">' +
              '<div class="blog-byline"><div class="tags_holder">' + tagsHTML + '</div></div>' +
              '<h4 class="title"><a href="' + post.url + '">' + post.title + '</a></h4>' +
              '<div class="summary">' + post.summary + '</div>' +
              '<div class="byline">' +
                '<span class="authorName">' + post.author + '</span>' +
                '<span class="postDate">' + formatted + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="readMoreHolder">'+
              '<a href="' + post.url + '" class="cm-btn read-more-btn">' +
                '<span class="btn-text">Read&nbsp;More</span>' +
                '<span class="btn-icon">' +
                  /* svg arrow */ '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">' +
                  '<path style="fill:currentColor" d="m17.5 5.999-.707.707 5.293 5.293H1v1h21.086l-5.294 5.295.707.707L24 12.499l-6.5-6.5z"/>' +
                  '</svg>' +
                '</span>' +
              '</a>' +
              '</div>'+
          '</div>' +
        '</div>'
      );
    }


// For Api hit of contact us form
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();



  const form = e.target;
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    company: form.company.value.trim(),
    message: form.message.value.trim(),

    // Hardcoded values
    subject: "Website Contact Form Submission",
    queryType: "General Inquiry"

  };
  const submitBtn = form.querySelector('.submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerText = 'Submitting...';
  try {
    const response = await fetch('https://aexyncontactus.web.app/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });



    if (response.ok) {
      alert('Thank you! Your message has been sent.');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerText = 'Submit';

    } else {
      alert('Something went wrong: ' + result.message);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('There was an error submitting the form. Please try again later.');
  }
});





    fetch(JSON_PATH)
      .then(function (r) { return r.json(); })
      .then(function (posts) {
        posts.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

        document.querySelectorAll('[data-tag]').forEach(function (container) {
          var tag      = container.dataset.tag;
          var filtered = posts.filter(function (p) { return p.tags.includes(tag); })
                              .slice(0, MAX_POSTS_PER_TAG);

          container.innerHTML = filtered.length
            ? filtered.map(postCardHTML).join('')
            : '<p class="no-posts">No recent posts tagged “' + tag + '”.</p>';
        });
      })
      .catch(function (err) {
        console.error('Blog tag grid error:', err);
      });
    // Posts by tag end
      


      console.log("All libraries loaded and initialized.");
})();


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

  function footerHeight() {
    $("body").css("padding-bottom", $(".cm-footer").outerHeight())
  }
  footerHeight();
  $(window).resize(footerHeight); 

  $('.navigation').after('<span class="menuOverlay"></span>')

  $('.has-children > a').click(function(e){
    e.preventDefault();
    $(this).parent().toggleClass('menu_clicked');
    $(this).parent().siblings().removeClass('menu_clicked');
    $(this).next('.megaMenu').slideToggle();
    $(this).parent().siblings().children('.megaMenu').slideUp();
      
  });

  $('.menuTrigger').click(function(){
    $('body').toggleClass('mobile-open');
  })

  $('.menuClose, .menuOverlay').click(function(){
    $('body').removeClass('mobile-open');
  });

  
  


})();

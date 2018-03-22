$(function(){
	$('.slider-pilot').slick({
		dots: true,
		infinite: true,
		speed: 600,
		slidesToShow: 1,
		adaptiveHeight: false,
		autoplay: true,
			autoplaySpeed: 5000,
			fade: true,
			cssEase: 'linear',
			arrows: false,
			responsive: [
	    {
	      breakpoint: 768,
	      settings: {
	        adaptiveHeight: true,
	        autoplay: false
	      }
	    }
	  ]
	});
});
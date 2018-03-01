$(function(){
	$("#countdown").countdown("2018/03/21", function(event) {
		$(".days").text(event.strftime("%D"));
	    $(".hours").text(event.strftime("%H"));
	    $(".minutes").text(event.strftime("%M"));
	    $(".seconds").text(event.strftime("%S"));
	});

	$('.slider-pilot').slick({
		dots: true,
		infinite: true,
		speed: 600,
		slidesToShow: 1,
		adaptiveHeight: false,
		autoplay: true,
			autoplaySpeed: 2000,
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
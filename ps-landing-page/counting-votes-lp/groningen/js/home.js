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

	function countingVotes(){
		$('.counter').each(function(index, el) {
			var votes = $(el).data('votes');
			var speed = $(el).data('speed');

			$(el).text(votes);

			var interval = setInterval(function() {
				votes = votes + 1;

				$(el).text(votes);
				
			}, speed);
		});
	}

	function progressBar(){
		$('.progress-bar').each(function(index, el) {
			var amount = 1;
			var speed = $(el).data('speed');

			$(el).css('width', amount + '%');
			
			var interval = setInterval(function() {
				amount = amount + 1;

				$(el).css('width', amount + '%');
			}, speed);
		});
	}

	function countingVotes(){
		$('.counter').each(function(index, el) {
			var votes = $(el).data('votes');
			var speed = $(el).data('speed');

			$(el).text(votes);

			var interval = setInterval(function() {
				votes = votes + 1;

				$(el).text(votes);
				
			}, speed);
		});
	}

	function progressBar(){
		$('.progress-bar').each(function(index, el) {
			var amount = 1;
			var speed = $(el).data('speed');

			$(el).css('width', amount + '%');
			
			var interval = setInterval(function() {
				amount = amount + 1;

				$(el).css('width', amount + '%');
			}, speed);
		});
	}

	countingVotes();
	progressBar();

	Circles.create({
		id:           'avg-rate',
		radius:       70,
		value:        43,
		maxValue:     100,
		width:        2,
		text:         function(value){return value + '%';},
		wrpClass:     'circles-wrp',
		textClass:    'circles-text'
	})
});
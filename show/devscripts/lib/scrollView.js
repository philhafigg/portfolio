$.fn.scrollView = function () {
	return this.each(function () {
	    $('#content').animate({
	
	        scrollTop: $(this).offset().top-40
	    }, 1000);
	});
};
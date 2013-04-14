(function() {
	$.fn.tumblerSlideViewer = function(config) {
		var $this = this,
			num = 10,
			now = 0,
			url = "",
			photos = [],
			links = [],
			slideTimer,
			slideTime,
			size = 1280,
			flag = true,
			bodyBg = false
			shuffleFlag=false
			options = $.extend({
				url: '',
				slidetime: 3000,
				length: 10,
				shuffle: false
			}, config);
			
		if (options.url == '') return false;
		if ($this.get()[0].tagName == 'BODY') bodyBg = true;
		
		num = options.length;
		slideTime = options.slidetime;
		url = options.url + "/api/read/json?num=" + num + "&type=photo";
		shuffleFlag = options.shuffle;
		
		if (bodyBg) {
			size = 1280
			$this.css({'overflow': 'hidden'}).prepend('<div class="fitBg" id="frontBg"></div><div class="fitBg" id="backBg"></div>');
			var $winWidth, $winHeight;
			$(window).resize(onResizeHandler);
			onResizeHandler();
		} else {
			if ($this.width() < 75) size = 75;
			if ($this.width() >= 75) size = 100;
			if ($this.width() >= 100) size = 250;
			if ($this.width() >= 250) size = 400;
			if ($this.width() >= 400) size = 500;
			if ($this.width() >= 500) size = 1280;
		};
		
		$this.each(function(){
			jsonLoader();
			addTimer();
			return false;
		});

		function jsonLoader() {
			$.ajax({
				type: "GET",
				url: url,
				dataType: "jsonp",
				success: function(data) {
					if (shuffleFlag == true) {
						var data;
						data.posts = shuffle(data.posts);
					};
					
					if (bodyBg) {
						for (var i = 0; i < num; i++) {
							photos.push(data.posts[i]["photo-url-1280"]);
						};
						$('#frontBg').css({'background': 'url(' + photos[0] + ') no-repeat center center fixed'});
						$('#backBg').css({'background': 'url(' + photos[1] + ') no-repeat center center fixed'}).hide();
						$('.fitBg').css({
							'position': 'fixed',
							'top': '0',
							'left': '0',
							'-webkit-background-size': 'cover',
							'-moz-background-size': 'cover',
							'-o-background-size': 'cover',
							'background-size': 'cover'
						});
					} else {
						for (var i = 0; i < num; i++) {
							photos.push(data.posts[i]["photo-url-" + size]);
							links.push(data.posts[i]["url-with-slug"]);
							$this.prepend(
								'<div class="tumblerImage">'+
									'<a href="' + links[i] + '" target="_blank">'+
										'<img class="tumblerImg" src="' + photos[i] + '" width="' + $this.width() + '" />'+
									'</a>'+
								'</div>'
							);
						};
						$('.tumblerImage').css({
							'position': 'absolute',
							'top': '0',
							'display': 'block',
							'vertical-align': 'middle',
							'background-color': '#000',
							'width': $this.width() + 'px',
							'height': $this.height() + 'px',
							'overflow': 'hidden',
							'display': 'none'
						}).find('a').css({
							'height': $this.height() + 'px',
							'display': 'table-cell',
							'vertical-align': 'middle',
							'border': 'none'
						});
						$this.find('div').eq(0).stop().fadeIn(1000);
					};
				}
			});
		};

		function onResizeHandler() {
			$winWidth = $(window).width();
			$winHeight = $(window).height();
			$('.fitBg').css({
				'width': $winWidth + 'px',
				'height': $winHeight + 'px'
			});
		};

		function addTimer() {
			slideTimer = setInterval(slide, slideTime);
		};

		function removeTimer() {
			clearInterval(slideTimer)
		};

		function slide() {
			now += 1;
			if (now == num) now = 0;
			if (bodyBg) {
				flag = !flag;
				changeImage();
			} else {
				$('.tumblerImage').stop().fadeOut(1000);
				$this.find('div').eq(now).stop().fadeIn(1000);
			};
		};

		function changeImage() {
			if (flag) {
				$('#frontBg').fadeIn(0);
				$('#backBg').fadeOut(0, bgChange);
			} else if (!flag) {
				$('#frontBg').fadeOut(0);
				$('#backBg').fadeIn(0, bgChange);
			};
		};

		function bgChange() {
			var n = now + 1;
			if (n == num) n = 0;
			if (now % 2) {
				$('#frontBg').css({'background': 'url(' + photos[n] + ') no-repeat center center fixed'})
			} else {
				$('#backBg').css({'background': 'url(' + photos[n] + ') no-repeat center center fixed'})
			};
		};

		function shuffle(array) {
			var i = array.length;
			while (i) {
				var j = Math.floor(Math.random() * i),
					t = array[--i];
				array[i] = array[j];
				array[j] = t;
			};
			return array;
		};
		return this;
	};
})(jQuery);
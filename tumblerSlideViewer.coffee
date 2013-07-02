$.fn.tumblerSlideViewer = (config) ->
	$this = this
	num = 10
	now = 0
	url = ''
	photos = []
	link = []
	slideTimer = null
	slideTime = 0
	size = 1200
	flag = true
	bodyBg = false
	shuffleFlag = false
	options = $.extend
		url: ''
		slidetime: 3000
		length: 10
		shuffle: false
	, config
	if options.url is '' then return false
	if $this.get()[0].tagName is 'BODY' then bodyBg = true
	num = options.length
	slideTime =options.slidetime
	url = options.url + '/api/read/json?num=' + num + '&type=photo'
	shuffleFlag = options.shuffle
	
	onResizeHandler = ->
		$winWidth = $(window).width()
		$winHeight = $(window).height()
		$('.fitBg').css
			'width': $winWidth + 'px'
			'height': $winHeight + 'px'
		
	addTimer = ->
		slideTimer = setInterval slide, slideTime
		
	removeTimer = ->
		clearInterval slideTimer
	
	shuffle = (array) ->
		i = array.length
		while i
			j = Math.floor(Math.random() * i)
			t = array[--i]
			array[i] = array[j]
			array[j] = t
		return array
	
	bgChange = ->
		n = now + 1
		if n is num then n = 0
		if now % 2
			$('#frontBg').css({'background': 'url(' + photos[n] + ') no-repeat center center fixed'})
		else
			$('#backBg').css({'background': 'url(' + photos[n] + ') no-repeat center center fixed'})
	
	changeImage = ->
		if flag
			$('#frontBg').fadeIn(0)
			$('#backBg').fadeOut(0, bgChange)
		else
			$('#frontBg').fadeOut(0)
			$('#backBg').fadeIn(0, bgChange)
	
	slide = ->
		now++
		if now is num then now = 0
		if bodyBg
			flag = !flag
			changeImage()
		else
			$('.tumblerImage').stop().fadeOut 1000
			$this.find('div').eq(now).stop().fadeIn 1000
	
	if bodyBg
		size = 1200
		$this.css({'overflow': 'hidden'})
			.prepend('<div class="fitBg" id="frontBg"></div><div class="fitBg" id="backBg"></div>')
		$winWifth = 0
		$winHeight = 0
		$(window).resize onResizeHandler
		onResizeHandler()
	else
		if $this.width() < 75 then size = 75
		if $this.width() >= 75 then size = 100
		if $this.width() >= 100 then size = 250
		if $this.width() >= 250 then size = 400
		if $this.width() >= 400 then size = 500
		if $this.width() >= 500 then size = 1200
	
	jsonLoader = ->
		$.ajax
			type: 'GET'
			url: url
			dataType: 'jsonp'
			success: (data) ->
				if shuffleFlag is true
					data = {}
					data.posts = shuffle data.posts
					
				if bodyBg
					for i in [0..num]
						if data.posts[i] isnt undefined
							photos.push(data.posts[i]["photo-url-1280"])
					
					$('#frontBg').css
						'background': 'url(' + photos[0] + ') no-repeat center center fixed'
					$('#backBg').hide().css
						'background': 'url(' + photos[1] + ') no-repeat center center fixed'
					$('.fitBg').css
						'position': 'fixed'
						'top': '0'
						'left': '0'
						'-webkit-background-size': 'cover'
						'-moz-background-size': 'cover'
						'-o-background-size': 'cover'
						'background-size': 'cover'
				else
					for i in [0..num]
						photos.push data.posts[i]["photo-url-" + size]
						links.push data.posts[i]["url-with-slug"]
						$this.prepend(
								'<div class="tumblerImage">'+
									'<a href="' + links[i] + '" target="_blank">'+
										'<img class="tumblerImg" src="' + photos[i] + '" width="' + $this.width() + '" />'+
									'</a>'+
								'</div>'
							)
					$('.tumblerImage').css
						'position': 'absolute'
						'top': '0'
						'display': 'block'
						'vertical-align': 'middle'
						'background-color': '#000'
						'width': $this.width() + 'px'
						'height': $this.height() + 'px'
						'overflow': 'hidden'
						'display': 'none'
					$('.tumblerImage').find('a').css
						'height': $this.height() + 'px'
						'display': 'table-cell'
						'vertical-align': 'middle'
						'border': 'none'
					$this.find('div').eq(0).stop().fadeIn 1000
	$this.each ->
		jsonLoader()
		addTimer()
		return false
	

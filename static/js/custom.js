// Form

$( function () {

	$('input, .file-upload').on('focus click', function(){
		$(this).removeClass('error');
	});

	$('.js-form').on('reset', function(e){
		var $form = $(this);

		$form.removeClass('_validated');

		$form.find('.file-upload').find('.file-upload__path').html('');
	});

	$( document.body ).on('form.success', '.js-form', function(e){
		console.log('form.success');

		window.location.href = '/spasibo/';
	});

	$( document.body ).on('submit', '.js-form', function(e){
		e.preventDefault();

		var $form=$(this); 
		var action = $form.attr('action') || 'callback'; console.log('action %s', action);		
		var hasFiles = $form.find('input[type=file]').length;
		var url = ajax_object.url,
			 action_str = '&action=vc_action_' + action;

		var formdata = new FormData(this);

		formdata.append("action", 'vc_action_' + action);

		if( ! validator($form) ) return false;

		if( formdata && hasFiles ){
			
			$.ajax({
				type:"POST",
				url: url,
				data: formdata,
				processData: false,
				contentType: false,
				beforeSend: function(jqXHR ){
					$form.find('.form__button').addClass('loading');					
				},
				success:function(msg){
					$form[0].reset();

					$form.trigger('form.success', [$form]);
				},
				statusCode: {
				    404: function() {				    	
				    	$form[0].reset();
				    }
				}
			});

		}
		else{
			var fdata=$form.serialize();		
			fdata=fdata+action_str;

			$.ajax({
				type:"POST",
				url: url,
				data: fdata,
				success:function(msg){
					$form[0].reset();

					$form.trigger('form.success', [$form]);
				},
				statusCode: {
				    404: function() {				    	
				    	$form[0].reset();
				    }
				}
			});
		}
		
		return false;
	});

	function validator(form, only_bool = false) {
		var r=true;

		form.find('input[type="email"].required,input[type="email"][required],input[name="email"].required,input[name="email"][required]').each(function(index, element) {
			if($(element).val().length<1 || !isEmailValid($(element).val())) {

				if( !only_bool ){
					$(element).closest('.field').addClass('error');
				}

				r=false;
			}
		});

		form.find('input[type="file"].required').each(function(index, element) {
			if($(element).val().length<1) {

				if( !only_bool ){
					$(element).closest('.file-upload').addClass('error');
				}

				r=false;
			}
		});		

		form.find('input.required,input[required]').each(function(index, element) {
			if($(element).val().length<1) {

				if( !only_bool ){
					$(element).closest('.field').addClass('error');
				}
				
				r=false;
			}
		});


		return r;	
	}

	function isEmailValid(emailAdress) {
	    var EMAIL_REGEXP = new RegExp('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$', 'i');
	    return EMAIL_REGEXP.test(emailAdress)
	}

	//$("input[name=phone]").mask("+7 (999) 999-9999");
});


// files upload

$( function () {

	function fileCustomBuild(){
		var wrappers = $( ".file-upload" );
		
		wrappers.each(function(index, element) {
			
			var wrapper = $(element),
	        inp = wrapper.find( "input" ),
	        btn = wrapper.find( ".file-upload__button" ),
	        lbl = wrapper.find( ".file-upload__path" );
	   		var file_api = ( window.File && window.FileReader && window.FileList && window.Blob ) ? true : false;

			inp.change(function(){
				console.log('change');
				var file_name;
				if( file_api && inp[ 0 ].files[ 0 ] )
					file_name = inp[ 0 ].files[ 0 ].name;
				else
					file_name = inp.val().replace( "C:\\fakepath\\", '' );

				if( ! file_name.length ){
					lbl.text( '' );

					return;
				}
		
				lbl.text( file_name );

			}).change();		
		
		});
	}

	fileCustomBuild();
	
});


// Vacancy filter
$( function () {

	$('.js-vacancy-search-form').on('submit', function(e){
		e.preventDefault();

		var formdata = new FormData(this);

		var q_vname = formdata.get("vname");
		var q_vgeo = formdata.get("vgeo");

		var $vacancies = $('.vc-body').find('tr[data-vid]');

		if( !q_vname && !q_vgeo ){
			$vacancies.show();
		}
		else{
			$vacancies.hide();

			$vacancies.each( function( idx, el ){
				var f1 = true, f2 = true;

				var vname = $(el).data('vname');
				var vgeo = $(el).data('vgeo');

				if( q_vname ){
					f1 = vname.toLowerCase().includes(q_vname);
				}

				if( q_vgeo ){
					f2 = vgeo.toLowerCase().includes(q_vgeo);
				}	

				if( f1 && f2 ){
					$(el).show();
				}
			});
		}		
	});

});

$( function () {

	$('.js-menu-toggle').on('click', function(e){
		e.preventDefault();

		$('.site').toggleClass('_menu_opened');
	});

	var $header = $('.js-header');

	$(window).on('scroll', function(e){

		if( $(window).scrollTop() > 0 ){
			$header.addClass('scrolled');
		}
		else{
			$header.removeClass('scrolled');
		}

	});	

});


$( function () {

	$('.js-social-widget__toggle').on('click', function(e){
		$(this).closest('.js-social-widget').toggleClass('_checked');
	});
});


Fancybox.bind("[data-fancybox]", {
  // Your custom options
});


document.addEventListener('DOMContentLoaded', () => {

	// CountUp

	const counters = document.querySelectorAll('[data-num]');

	counters.forEach(elem => {

		const counterStartNum = elem.dataset.num;

		var numAnim = new countUp.CountUp(elem, counterStartNum, {
	        startVal: 0,
	        decimalPlaces: 0,
	        duration: 3,
	        useGrouping: false,
	        useEasing: false,
	        smartEasingThreshold: 0,
	        smartEasingAmount: 0,
	        enableScrollSpy: true,
	        scrollSpyDelay: 100,
	        scrollSpyOnce: true,
	   });

		numAnim.handleScroll();
		numAnim.start()
	});


  // Accordion

  const acc = document.querySelectorAll('[data-acc]');

  if (acc) {
    acc.forEach(el => {
      new Accordion(el, {
        duration: 300,
        showMultiple: true,
        onlyChildNodes: false,
        openOnInit: [0]
      });
    });
  }

	// Nav tabs slider

	const navTabs = document.querySelectorAll('.sml-nav');

	if (navTabs.length) {
	 for (let i = 0; i < navTabs.length; i++) {

	   navTabs[i].classList.add(`sml-nav-${i}`);

	   let navTabsSl = new Swiper(`.sml-nav-${i}`, {
	     slidesPerView: 'auto',
	     spaceBetween: 5,
	     loop: false,
	     enabled: true,
	     slideToClickedSlide: true,
	     speed: 800,
	     observer: true,
	     observeParents: true,
	     watchSlidesProgress: true,
	     watchOverflow: true,
	     on: {
	       resize: function (swiper) {
	         swiper.update();
	       },
	     },
	     breakpoints: {
	       991: {
	         enabled: false,
	         spaceBetween: 0
	       },
	     }
	   });
	 }
	}


	// Feedback slider

	const fbSl = document.querySelectorAll('.fb-sl');

	if (fbSl.length) {
	 for (let i = 0; i < fbSl.length; i++) {

	   fbSl[i].classList.add(`fb-sl-${i}`);

	   let fbSlider = new Swiper(`.fb-sl-${i}`, {
	     slidesPerView: 1,
	     spaceBetween: 10,
	     loop: true,
	     speed: 800,
	     observer: true,
	     observeParents: true,
	     watchSlidesProgress: true,
	     watchOverflow: true,
	     on: {
	       resize: function (swiper) {
	         swiper.update();
	       },
	     },
	     pagination: {
	       el: '.swiper-pagination',
	       type: "bullets",
	       clickable: true
	     },
	     breakpoints: {
	       768: {
	         slidesPerView: 2,
	         spaceBetween: 15,
	       },
	       1200: {
	         slidesPerView: 3,
	         spaceBetween: 15,
	       }
	     }
	   });
	 }
	}

  	// Letter slider

  	const ltrSl = document.querySelectorAll('.ltr-sl');

  	if (ltrSl.length) {
    for (let i = 0; i < ltrSl.length; i++) {

      ltrSl[i].classList.add(`ltr-sl-${i}`);

      let ltrSlider = new Swiper(`.ltr-sl-${i}`, {
        slidesPerView: 'auto',
        spaceBetween: 8,
        centeredSlides: true,
        loopAdditionalSlides: 2,
        loop: true,
        speed: 800,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        watchOverflow: true,
        on: {
          resize: function (swiper) {
            swiper.update();
          },
        },
        pagination: {
          el: '.swiper-pagination',
          type: "bullets",
          clickable: true
        },
        breakpoints: {
          // 768: {
          //   slidesPerView: 2,
          //   spaceBetween: 15,
          // },
          1200: {
            slidesPerView: 'auto',
            spaceBetween: 15,
          }
        }
      });
    }
  	}


	// Tabs

	class Tabs {
	 constructor(selector) {
	   const tabs = document.querySelectorAll(`[data-tabs="${selector}"]`);

	   if (tabs.length) {
	     tabs.forEach(element => {
	       const tabsNav = element.querySelector('[data-tabs-nav]');
	       const tabsNavItem = tabsNav.querySelectorAll('[data-tabs-target]');

	       tabsNavItem.forEach(el => {
	         el.addEventListener('click', (e) => {
	           e.preventDefault();

	           const tabsNavItemData = e.currentTarget.getAttribute('data-tabs-target');
	           const tabsContentAll = element.querySelectorAll('[data-tabs-content]');
	           const tabsContentItem = element.querySelector(`[data-tabs-content='${tabsNavItemData}']`);

	           tabsNavItem.forEach(elem => {
	             elem.classList.remove('active');
	           });

	           tabsContentAll.forEach(elem => {
	             elem.classList.remove('open');
	             elem.style.display = 'none';
	           });

	           tabsContentItem.classList.add('open');
	           fadeIn(tabsContentItem, 600, 'block');
	           e.currentTarget.classList.add('active');
	         });
	       });
	     });
	   }
	 }
	}

	const tabsSml = new Tabs('sml');

	// Feedbackk modal

	const fb = document.querySelectorAll('[data-fb]');

	if (fb.length) {
	 fb.forEach(el => {
	   el.addEventListener('click', (e) => {
	     e.preventDefault();
	     const fbData = e.target.getAttribute('href');
	     const fbModal = document.querySelector(`${fbData}`);
	     const fbModalClose = fbModal.querySelector('[data-fb-modal-close]');

	     fadeIn(fbModal, 600, 'block');
	     fbModalClose.addEventListener('click', (e) => {
	       const fbModal = e.currentTarget.closest('[data-fb-modal]');

	       fadeOut(fbModal, 600);

	     });
	   });
	 });
	}


	// FadeIn / FadeOut

	function fadeIn(el, timeout, display) {
	 el.style.opacity = 0;
	 el.style.display = display || 'block';
	 el.style.transition = `opacity ${timeout}ms`;
	 setTimeout(() => {
	   el.style.opacity = 1;
	 }, 10);
	}

	function fadeOut(el, timeout) {
	 el.style.opacity = 1;
	 el.style.transition = `opacity ${timeout}ms`;
	 el.style.opacity = 0;

	 setTimeout(() => {
	   el.style.display = 'none';
	 }, timeout);
	}

});
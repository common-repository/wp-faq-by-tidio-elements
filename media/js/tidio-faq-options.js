var tidioFaqOptions = {
		
	public_key: null,
	
	private_key: null,
	
	//
	
	plugin_url: 'http://visual-editor.tidioelements.com/',
	
	api_url: '//www.tidioelements.com/',
	
	extension_url: null,
	
	ajax_url: null,
	
	//
	
	$iframe: null,
	
	create: function(data){
		
		// this.plugin_url = 'http://localhost/tidio_elements_app/public/';
		
		//
						
		var default_data = {
			extension_url: null,
			public_key: null,
			private_key: null,
			settings: null,
			ajax_url: null
		};
		
		data = $.extend(default_data, data);
		
		//
		
		this.extension_url = data.extension_url;

		this.public_key = data.public_key;

		this.private_key = data.private_key;

		this.settings = data.settings;

		this.ajax_url = data.ajax_url;
		
		//
		
		this.registerProject(function(){
		
			tidioFaqOptions.faqLoading();
		
		});
		
		this.initEvents();
		
		this.replayDialogSettings();
				
	},
	
	// Events
	
	initEvents: function(){
		
		$("#faq-settings-link").on('click', function(){
			
			tidioFaqOptions.dialogShow('#dialog-settings');
			
			return false;
			
		});
		
		$("#dialog-settings-form-submit").on('click', function(){
			
			$("#dialog-settings-form-submit").text('loading...');
			
			tidioFaqOptions.apiUpdateSettings(function(){
				
				$("#dialog-settings-form-submit").text( $("#dialog-settings-form-submit").attr('data-text') );
				
			});
			
		});
		
		//
		
		$("#settings-form-base-color-input").minicolors();
		
	},
	
	// Settings
	
	dialogInit: function(){
		
		if(this.dialog_init)
			
			return false;
			
		//
		
		this.dialog_init = true;
		
		$("body").on('click', function(e){
			
			if(!tidioFaqOptions.dialog_current){
				
				return false;
				
			}
			
			if(!$(e.target).closest('.frame-dialog').length){
				
				tidioFaqOptions.dialogHide(tidioFaqOptions.dialog_current);
				
			}
						
			return false;
			
		});
		
		
		$('.frame-dialog .btn-close').on('click', function(){
			
			if(!tidioFaqOptions.dialog_current){
				
				return false;
				
			}
			
			tidioFaqOptions.dialogHide(tidioFaqOptions.dialog_current);
			
			return false;
			
		});
		
	},
	
	dialogShow: function(selector){
		
		if(!this.dialog_init){
			
			this.dialogInit();
			
		}

		if(typeof selector=='string')
			
			selector = $(selector);
			
		//

		selector.fadeIn('fast').addClass('dialog-active');
		
		$("#dialog-overlay").fadeIn('fast');
		
		//
		
		this.dialog_current = selector;
		
	},
	
	dialogHide: function(selector){
		
		if(typeof selector=='string')
			
			selector = $(selector);
			
		//
		
		selector.fadeOut('fast').removeClass('dialog-active');
		
		$("#dialog-overlay").fadeOut('fast');
		
	},
	
	// Settings Update
	
	apiUpdateSettings: function(_func){
		
		var xhr_url = 'http://www.tidioelements.com/apiExternalPlugin/updateData?privateKey=' + this.private_key;
				
		//
		
		var plugin_data = tidioFaqOptions.apiDataSerialize('#dialog-settings-form');
				
		$.ajax({
			url: xhr_url,
			type: 'POST',
			data: {
				pluginData: plugin_data
			}
		}).done(function(){
			
			_func();
			
		});
		
		//
		
		$.ajax({
			url: this.ajax_url + 'admin-ajax.php?action=tidio_faq_settings_update',
			type: 'POST',
			data: {
				settingsData: encodeURI(plugin_data)
			}
		});
		
	},
	
	apiDataSerialize: function(selector){
		
		var api_data = {};
		
		$(selector).find('[name]').each(function(){
			
			var this_name = this.getAttribute('name'),
				this_value = this.value;
				
			api_data[this_name] = this_value;
			
		});
		
		return JSON.stringify(api_data);
	
	},
	
	// Dialog Settings
	
	replayDialogSettings: function(){
		
		if(!this.settings)
			
			return false;
			
		//
					
		$("#settings-form-email-input").val(this.settings['email']);

		$("#settings-form-base-color-input").val(this.settings['base_color']);

		$("#settings-form-online-message-input").val(this.settings['online_message']);

		$("#settings-form-offline-message-input").val(this.settings['offline_message']);

		$("#settings-form-language-input").val(this.settings['language']);
		
	},
		
	// Register Project
	
	registerProject: function(_func){
		
		_func();
		
	},
	
	//
	
	faqLoading: function(){
		
		var iframe_height = $('body').height() - ($("#wpadminbar").height() + $(".wrap h2").height() + 10);
		
		
		
		$("#faq-content").html(
			'<iframe src="' + this.plugin_url + 'en/panel/plugins/faq/external?externalAccessKey=' + this.private_key + '&visualEditorSimulate=1" id="faq-iframe" style="height: ' + iframe_height + 'px;"></iframe>'
		);		
		
		$("#faq-iframe").load(function(){
			
			$("#faq-loading").fadeOut('fast', function(){
				
				$("#faq-content").fadeIn('fast');
				
				tidioFaqOptions.faqIsReady();
				
			});
			
		});
						
	},
	
	faqIsReady: function(){
		
	}
	
	
};
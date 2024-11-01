<?php

/**
 * Plugin Name: WP FAQ by Tidio Elements
 * Plugin URI: http://www.tidioelements.com
 * Description: Frequently asked question in a completely new form - an advanced widget placed in the lower right corner of the screen displaying the list of answers right at the moment of writing the question! 
 * Version: 1.0
 * Author: Tidio Ltd.
 * Author URI: http://www.tidiomobile.com
 * License: GPL2
 */
 
if(!class_exists('TidioPluginsScheme')){
	 
	 require "classes/TidioPluginsScheme.php";
	 
} 
 
class TidioLiveFaq {
	
	private $scriptUrl = '//tidioelements.com/uploads/redirect-plugin/';
	
	private $pageId = '';
		
	public function __construct() {
						
		add_action('admin_menu', array($this, 'addAdminMenuLink'));
		
		add_action('wp_enqueue_scripts', array($this, 'enqueueScript'));
			 
		add_action("wp_ajax_tidio_faq_settings_update", array($this, "ajaxPageSettingsUpdate"));	 
			 
	}
	
	// Menu Positions
	
	public function addAdminMenuLink(){
		
        $optionPage = add_menu_page(
                'FAQ', 'FAQ', 'manage_options', 'tidio-faq', array($this, 'addAdminPage'), plugins_url(basename(__DIR__) . '/media/img/icon.png')
        );
        $this->pageId = $optionPage;
		
	}
	
    public function addAdminPage() {
        // Set class property
        $dir = plugin_dir_path(__FILE__);
        include $dir . 'options.php';
    }

	
	// Enqueue Script
	
	public function enqueueScript(){

		$iCanUseThisPlugin = TidioPluginsScheme::usePlugin('faq');
		
		if(!$iCanUseThisPlugin){
						
			return false;
			
		}
		
		$tidioPublicKey = get_option('tidio-faq-public-key');
				
        if(!empty($tidioPublicKey)){
			
            wp_enqueue_script('tidio-faq',  $this->scriptUrl.$tidioPublicKey.'.js', array(), '1.0', false);
			
		}

	}
	
	// Ajax Pages
	
	public function ajaxPageSettingsUpdate(){

		if(empty($_POST['settingsData'])){
			
			$this->ajaxResponse(false, 'ERR_PASSED_DATA');
			
		}
		
		$faqSettings = $_POST['settingsData'];
		
		$faqSettings = urldecode($faqSettings);
				
		//
				
		update_option('tidio-faq-settings', $faqSettings);
				
		$this->ajaxResponse(true, true);

	}

	public function ajaxResponse($status = true, $value = null){
		
		echo json_encode(array(
			'status' => $status,
			'value' => $value
		));	
		
		exit;
			
	}
}

$tidioLiveFaq = new TidioLiveFaq();


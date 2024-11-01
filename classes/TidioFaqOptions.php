<?php

class TidioFaqOptions {
	
	private $apiHost = 'http://www.tidioelements.com/';
	
	private $siteUrl;
	
	public function __construct(){
				
		$this->siteUrl = get_option('siteurl');
		
	}
	
	public function getFaqSettings(){

		$faqSettings = get_option('tidio-faq-settings');
		
		if($faqSettings)
			
			return json_decode($faqSettings, true);
			
		//	
					 
		$faqSettings = array();
		
		update_option('tidio-faq-settings', json_encode($faqSettings));
		
		return $faqSettings;
		

	}
	
	public function getPrivateKey(){
				
		$tidioPrivateKey = get_option('tidio-faq-private-key');

		if(empty($tidioPrivateKey)){
		
			$tidioPrivateKey = md5(SECURE_AUTH_KEY.'.tidioFaq');
			
			update_option('tidio-faq-private-key', $tidioPrivateKey);
		
		}
		
		return $tidioPrivateKey;

	}
	
	public function getPublicKey(){

		$tidioPublicKey = get_option('tidio-faq-public-key');
				
		if(!empty($tidioPublicKey))
			
			return $tidioPublicKey;
			
		//
		
		$apiData = $this->getContentData($this->apiHost.'apiExternalPlugin/accessPlugin?pluginId=faq&privateKey='.$this->getPrivateKey().'&url='.urlencode($this->siteUrl));

		$apiData = json_decode($apiData, true);
		
		if(!empty($apiData) || $apiData['status']){
			
			$tidioPublicKey = $apiData['value']['public_key'];
			
			update_option('tidio-faq-public-key', $tidioPublicKey);
			
		}
		
		return $tidioPublicKey;

	}
	
	private function getContentData($url){
		
		$ch = curl_init();
	
		curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)');
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);       
	
		$data = curl_exec($ch);
		curl_close($ch);
		
		return $data;
		
	}
	
}
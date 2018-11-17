<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        if (env('APP_ENV') === 'production') {
            $this->app['request']->server->set('HTTPS', true);
        }
	    Schema::defaultStringLength(191);


	    $codes = [
		    'af' => 'afrikaans',
		    'sq' => 'albanian',
		    'am' => 'amharic',
		    'ar' => 'arabic',
		    'hy' => 'armenian',
		    'az' => 'azerbaijani',
		    'eu' => 'basque',
		    'be' => 'belarusian',
		    'bn' => 'bengali',
		    'bs' => 'bosnian',
		    'bg' => 'bulgarian',
		    'ca' => 'catalan',
		    'ny' => 'chichewa',
		    'zh' => 'chinese',
		    'co' => 'corsican',
		    'hr' => 'croatian',
		    'cs' => 'czech',
		    'da' => 'danish',
		    'nl' => 'dutch',
		    'en' => 'english',
		    'eo' => 'esperanto',
		    'et' => 'estonian',
		    'il' => 'filipino',
		    'fi' => 'finnish',
		    'fr' => 'french',
		    'fy' => 'frisian',
		    'gl' => 'galician',
		    'ka' => 'georgian',
		    'de' => 'german',
		    'el' => 'greek',
		    'gu' => 'gujarati',
		    'ht' => 'haitian',
		    'ha' => 'hausa',
		    'iw' => 'hebrew',
		    'hi' => 'hindi',
		    'hu' => 'hungarian',
		    'is' => 'icelandic',
		    'ig' => 'igbo',
		    'id' => 'indonesian',
		    'ir' => 'irish',
		    'it' => 'italian',
		    'ja' => 'japanese',
		    'jv' => 'javanese',
		    'kn' => 'kannada',
		    'kk' => 'kazakh',
		    'km' => 'khmer',
		    'ko' => 'korean',
		    'ku' => 'kurdish',
		    'ky' => 'kyrgyz',
		    'lo' => 'lao',
		    'la' => 'latin',
		    'lv' => 'latvian',
		    'lt' => 'lithuanian',
		    'lb' => 'luxembourgish',
		    'mk' => 'macedonian',
		    'mg' => 'malagasy',
		    'ms' => 'malay',
		    'ml' => 'malayalam',
		    'mt' => 'maltese',
		    'mi' => 'maori',
		    'mr' => 'marathi',
		    'mn' => 'mongolian',
		    'ne' => 'nepali',
		    'no' => 'norwegian',
		    'ps' => 'pashto',
		    'fa' => 'persian',
		    'pl' => 'polish',
		    'pt' => 'portuguese',
		    'pa' => 'punjabi',
		    'ro' => 'romanian',
		    'ru' => 'russian',
		    'sm' => 'samoan',
		    'gd' => 'scottish',
		    'sr' => 'serbian',
		    'sn' => 'shona',
		    'sd' => 'sindhi',
		    'si' => 'sinhala',
		    'sk' => 'slovak',
		    'sl' => 'slovenian',
		    'so' => 'somali',
		    'es' => 'spanish',
		    'sw' => 'swahili',
		    'sv' => 'swedish',
		    'tg' => 'tajik',
		    'ta' => 'tamil',
		    'te' => 'telugu',
		    'th' => 'thai',
		    'tr' => 'turkish',
		    'ur' => 'urdu',
		    'uz' => 'uzbek',
		    'uk' => 'ukrainian',
		    'vi' => 'vietnamese',
		    'cy' => 'welsh',
		    'xh' => 'xhosa',
		    'yi' => 'yiddish',
		    'yo' => 'yoruba',
		    'zu' => 'zulu'
	    ];
	    View::share('codes', $codes);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}

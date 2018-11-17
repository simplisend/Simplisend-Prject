<?php

/**
 * Laravel - A PHP Framework For Web Artisans
 *
 * @package  Laravel
 * @author   Taylor Otwell <taylor@laravel.com>
 */

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);

// This file allows us to emulate Apache's "mod_rewrite" functionality from the
// built-in PHP web server. This provides a convenient way to test a Laravel
// application without having installed a "real" web server software here.
if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
    return false;
}

require_once __DIR__.'/public/index.php';


/*
category1_groups
category2_states
category3_group_sections
category4_sections
category5_branches
category6_forms
users_joins
users_images
images_types
settings_types
settings_contents
forms_fields
forms_comparison
contracts_categories
contracts_companies
user_contracts
user_fields_filled_values


4A0	1682 x 2378 mm	66.2 x 93.6 in
2A0	1189 x 1682 mm	46.8 x 66.2 in
A0	841 x 1189 mm	33.1 x 46.8 in
A1	594 x 841 mm	23.4 x 33.1 in
A2	420 x 594 mm	16.5 x 23.4 in
A3	297 x 420 mm	11.7 x 16.5 in
A4	210 x 297 mm	8.3 x 11.7 in
A5	148 x 210 mm	5.8 x 8.3 in
A6	105 x 148 mm	4.1 x 5.8 in
A7	74 x 105 mm	2.9 x 4.1 in
A8	52 x 74 mm	2.0 x 2.9 in
A9	37 x 52 mm	1.5 x 2.0 in
A10	26 x 37 mm	1.0 x 1.5 in

*/



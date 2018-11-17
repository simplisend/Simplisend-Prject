<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['https'], function(){

});

Route::get('/', function () {
	return view('admin.welcome');
})->name("route");
Route::get('/home', 'HomeController@index');

Route::get('/icons', function () {
	return view('forms.icons');
});

Auth::routes();
Route::get('/admin', 'AdminController@index')->name('home');;

Route::get('/builder/{build_id?}', 'HomeController@index')->name('builder','{build_id?}');
Route::get('/getForms/{category_id}', 'HomeController@getFormList')->name('getCats','{category_id}');
Route::get('/getFieldsList', 'HomeController@getFieldsList')->name('getFieldsList');
Route::get('/addFieldsList/{list}', 'HomeController@addFieldsList')->name('addFieldsList','{list}');
Route::get('/getWordsList/{language}', 'HomeController@getWordsList')->name('getWordsList','{language}');
Route::get('/specificWords/{id}/{main_language}', 'HomeController@specificWords')->name('specificWords','{id}','{main_language}');
Route::post('/addWordGroup/', 'HomeController@addWordGroup')->name('addWordGroup');
Route::post('/cache', 'HomeController@cache')->name('cache');
Route::get('/clearcache', 'HomeController@clearCache')->name('clearCache');
Route::get('/preview_test', 'HomeController@preview_test')->name('preview_test');
Route::post('/save', 'HomeController@saveForm')->name('saveform');


Route::get('/admin/translator/', 'AdminController@translator')->name('translator');
Route::get('/admin/translator_update/{id}/{lang}/{value}', 'AdminController@translator_update')->name('translator_update','{id}','{lang}','{value}');


Route::get('/test', 'HomeController@test')->name('test');

/*Route::get('/categories/{id?}', 'AdminController@categories_manager')->name('category','{id?}');
Route::post('/categories/edit', 'AdminController@update')->name('edit_category');
Route::post('/categories/store', 'AdminController@store')->name('store_category');
Route::get('/Categories/delete/{id}', 'AdminController@deleteCategories')->name('delete_category','{id}');*/

Route::get('/categories/api', 'AdminController@get_categories');
Route::get('/categories/{id?}', 'AdminController@categories_manager')->name('category','{id?}');
Route::post('/categories/api/edit', 'AdminController@update')->name('edit_category');
Route::post('/categories/api/store', 'AdminController@store')->name('store_category');
Route::post('/categories/api/delete', 'AdminController@deleteCategories')->name('delete_category');
Route::post('/categories/api/form/edit', 'AdminController@update_form')->name('edit_form');
Route::post('/categories/api/form/delete', 'AdminController@delete_form')->name('delete_form');
Route::post('/categories/api/form/store', 'AdminController@add_form')->name('add_form');


//forms

Route::get('/elementsCategory/{category_name}/{fn}', 'HomeController@manageCategory')->name('manageCategory','{category_name}','{fn}');
Route::post('/addElements/store', 'HomeController@saveElement')->name('addElement');
Route::get('/getElements/{cat_id}', 'HomeController@getElements')->name('getElements','{cat_id}');
Route::get('/deleteElements/{id}', 'HomeController@deleteElements')->name('deleteElements','{id}');
Route::post('/preview', 'HomeController@previewPost')->name('preview_iframe');
Route::get('/preview/{id}', 'HomeController@previewGet')->name('preview','{id}');


//users
Route::get('/Users/{key}', 'UserController@index')->name('users','{key}');





//JSON
Route::get('/getCategories/{table}/{column}/{id}', 'JsonController@getCategories')->name('getCategories','{table}','{column}','{id}');
Route::get('/getFormList/{target}/{id}', 'JsonController@getFormList')->name('getFormList','{target}','{id}');



<?php

namespace App\Http\Controllers;

use App\elements_categories;
use App\elements_library;
use App\forms_builds;
use App\forms_fields;
use App\translations;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

class HomeController extends Controller {
	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct() {
		$this->middleware( 'auth' );
	}

	/**
	 * Show the application dashboard.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index( $build_id = 0 ) {

		if ( $build_id == 0 ) {
			$builds = DB::table( 'forms_builds' )->where( [ 'user_id' => Auth::id(), "cache" => "1" ] );
			if ( $builds->count() != 0 ) {
				$get_build = $builds->get()[0];
			} else {

				$username = Auth::user()['username'];

				$path = storage_path() . "/users/" . $username . '/cache/';
				File::isDirectory( $path ) or File::makeDirectory( $path, 0777, true, true );

				$html_filename = "html_" . str_replace( ".", "", hexdec( uniqid() ) );
				$html_content  = " ";
				$html_fp       = fopen( $path . $html_filename . ".html", "wb" );
				fwrite( $html_fp, $html_content );
				fclose( $html_fp );


				$popup_filename = "popup_" . str_replace( ".", "", hexdec( uniqid() ) );
				$popup_content  = " ";
				$popup_fp       = fopen( $path . $popup_filename . ".html", "wb" );
				fwrite( $popup_fp, $popup_content );
				fclose( $popup_fp );


				$table             = new forms_builds();
				$table->html       = $html_filename;
				$table->cache      = true;
				$table->style      = "";
				$table->form_name  = null;
				$table->target_id  = null;
				$table->properties = null;
				$table->scripts    = "";
				$table->settings   = "";
				$table->popup_html = $popup_filename;
				$table->publish    = "no";
				$table->user_id    = Auth::id();
				$table->save();

				$get_build = $builds->get()[0];

			}
		} elseif ( $build_id == "n" ) {
			$builds = DB::table( 'forms_builds' )->where( [ 'user_id' => Auth::id(), "cache" => "1" ] );
			if ( $builds->count() != 0 ) {
				$username = Auth::user()['username'];
				$path     = storage_path() . "/users/" . $username . '/cache/';
				File::isDirectory( $path ) or File::makeDirectory( $path, 0777, true, true );

				$html_filename = $builds->html;
				$html_content  = " ";
				$html_fp       = fopen( $path . $html_filename . ".html", "wb" );
				fwrite( $html_fp, $html_content );
				fclose( $html_fp );


				$popup_filename = $builds->popup_html;
				$popup_content  = " ";
				$popup_fp       = fopen( $path . $popup_filename . ".html", "wb" );
				fwrite( $popup_fp, $popup_content );
				fclose( $popup_fp );

				$get_build = $builds->get()[0];
			} else {

				$username = Auth::user()['username'];

				$path = storage_path() . "/users/" . $username . '/cache/';
				File::isDirectory( $path ) or File::makeDirectory( $path, 0777, true, true );

				$html_filename = "html_" . str_replace( ".", "", hexdec( uniqid() ) );
				$html_content  = " ";
				$html_fp       = fopen( $path . $html_filename . ".html", "wb" );
				fwrite( $html_fp, $html_content );
				fclose( $html_fp );


				$popup_filename = "popup_" . str_replace( ".", "", hexdec( uniqid() ) );
				$popup_content  = " ";
				$popup_fp       = fopen( $path . $popup_filename . ".html", "wb" );
				fwrite( $popup_fp, $popup_content );
				fclose( $popup_fp );


				$table             = new forms_builds();
				$table->html       = $html_filename;
				$table->cache      = true;
				$table->style      = "";
				$table->form_name  = null;
				$table->target_id  = null;
				$table->properties = null;
				$table->scripts    = "";
				$table->settings   = "";
				$table->popup_html = $popup_filename;
				$table->publish    = "no";
				$table->user_id    = Auth::id();
				$table->save();

				$get_build = $builds->get()[0];

			}
		} else {
			$builds = DB::table( 'forms_builds' )->where( [ 'user_id' => Auth::id(), 'id' => $build_id ] );
			if ( $builds->count() != 0 ) {
				$get_build = $builds->get()[0];
			} else {
				$get_build = "";
			}
		}


		$categories = DB::table( 'categories' )->get();


		$elements_categories = DB::table( 'elements_categories' )->where( "user_id", Auth::id() )->get();

		$cats_array = array();
		foreach ( $elements_categories as $tags_categorie ) {
			array_push( $cats_array, "", $tags_categorie->category_name );
		}


		return view( 'admin.builder.formbuilder', compact( 'cats_array', 'elements_categories', 'get_build', 'elements_categories', 'categories', 'build_id' ) );
	}

	public function test() {
		$array = Array(
			"9933 x 14043",
			"7016 x 9933",
			"4961 x 7016",
			"3508 x 4961",
			"2480 x 3508",
			"1748 x 2480",
			"1240 x 1748",
			"874 x 1240",
			"614 x 874",
			"437 x 614",
			"307 x 437"
		);

		foreach ( $array as $one ) {
			$arg     = explode( "x", $one );
			$number1 = (int) trim( $arg[0] );
			$number2 = (int) trim( $arg[1] );

			$real_width = 650;

			$c                  = $real_width / $number1;
			$get_height_percent = $c * 100; //50


			$a = $get_height_percent / 100; //
			$b = $a * $number2; //500


			echo $real_width . "x" . $b . "     " . $one . "<br>";


		}


		/*		$percentage = 50;
				$totalWidth = 350;

				$HowPercentage = ($percentage * 100) / $totalWidth; // How many 50 from 350 precentage
				$new_width = ($percentage / 100) * $totalWidth;

				echo $new_width;*/
	}

	public function getFormList( $category_id ) {

		$builds = DB::table( 'forms_builds' )->where( [ 'user_id' => Auth::id(), "cat_id" => $category_id ] )->get();

		return $builds;


	}

	public function cache( Request $request ) {
		$builds  = DB::table( 'forms_builds' )->where( [ 'user_id' => Auth::id(), "cache" => "1" ] );
		$countIt = $builds->count();


		if ( $countIt != 0 ) {

			$username = Auth::user()['username'];
			$path     = storage_path() . "/users/" . $username . '/cache/';

			$html_filename = $builds->get()[0]->html;
			$html_content  = html_entity_decode( $request->html );
			$html_fp       = fopen( $path . $html_filename . ".html", "wb" );
			fwrite( $html_fp, $html_content );
			fclose( $html_fp );


			$popup_filename = $builds->get()[0]->popup_html;
			$popup_content  = html_entity_decode( $request->popup );
			$popup_fp       = fopen( $path . $popup_filename . ".html", "wb" );
			fwrite( $popup_fp, $popup_content );
			fclose( $popup_fp );


			DB::table( "forms_builds" )
			  ->where( [ 'user_id' => Auth::id(), "cache" => "1" ] )
			  ->update( [
				  'properties'    => $request->properties,
				  'languages'     => $request->langua,
				  'main_language' => $request->main_language,
				  'settings'      => $request->settings,
				  'form_name'     => $request->form_name,
				  'related_forms' => $request->related_forms,
				  'target_id'     => $request->target_id,
				  'style'         => $request->style,
				  'scripts'       => $request->scripts
			  ] );

		} else {

			$username = Auth::user()['username'];

			$path = storage_path() . "/users/" . $username . '/cache/';
			File::isDirectory( $path ) or File::makeDirectory( $path, 0777, true, true );

			$html_filename = "html_" . str_replace( ".", "", hexdec( uniqid() ) );
			$html_content  = html_entity_decode( $request->html );
			$html_fp       = fopen( $path . $html_filename . ".html", "wb" );
			fwrite( $html_fp, $html_content );
			fclose( $html_fp );


			$popup_filename = "popup_" . str_replace( ".", "", hexdec( uniqid() ) );
			$popup_content  = html_entity_decode( $request->popup );
			$popup_fp       = fopen( $path . $popup_filename . ".html", "wb" );
			fwrite( $popup_fp, $popup_content );
			fclose( $popup_fp );


			$table                = new forms_builds();
			$table->html          = $html_filename;
			$table->cache         = true;
			$table->main_language = $request->main_language;
			$table->style         = $request->style;
			$table->form_name     = $request->form_name;
			$table->target_id     = $request->target_id;
			$table->related_forms = $request->related_forms;
			$table->properties    = $request->properties;
			$table->settings      = $request->settings;
			$table->languages     = $request->langua;
			$table->scripts       = $request->scripts;
			$table->popup_html    = $popup_filename;
			$table->publish       = "no";
			$table->user_id       = Auth::id();
			$table->save();
		}

		echo "true";

	}

	public function clearCache() {

		$builds = DB::table( 'forms_builds' )->where( [ 'user_id' => Auth::id(), "cache" => "1" ] );
		if ( $builds->count() > 0 ) {
			$builds->delete();
		}
		$html_path = storage_path() . "/users/" . Auth::user()['username'] . '/cache/';

		if ( File::isDirectory( $html_path ) ) {
			File::deleteDirectory( $html_path );
		}

	}

	public function saveForm( Request $request ) {

		$key = $request->key;
		$id  = "";

		if ( $key == "new" && $request->replace == "false" ) {
			$exist = DB::table( 'forms_builds' )->where( [
				"form_name" => $request->form_name,
				"cat_id"    => $request->category
			] );

			if ( $exist->count() == 0 ) {
				$table                = new forms_builds();
				$table->html          = "null";
				$table->cache         = false;
				$table->form_name     = $request->form_name;
				$table->main_language = $request->main_language;
				$table->related_forms = $request->related_forms;
				$table->style         = $request->style;
				$table->scripts       = $request->scripts;
				$table->settings       = $request->settings;
				$table->properties    = "{}";
				$table->popup_html    = "null";
				$table->publish       = "no";
				$table->languages     = $request->langua;
				$table->cat_id        = $request->category;
				$table->user_id       = Auth::id();
				$table->save();


				$username = Auth::user()['username'];
				$path     = storage_path() . "/users/" . $username . '/forms/html/' . $table->id . "/";
				File::isDirectory( $path ) or File::makeDirectory( $path, 0777, true, true );

				$html_filename = "html_" . $username . str_replace( ".", "", hexdec( uniqid() ) );
				$html_content  = html_entity_decode( $request->html );
				$html_fp       = fopen( $path . $html_filename . ".html", "wb" );
				fwrite( $html_fp, $html_content );
				fclose( $html_fp );

				$popup_filename = "popup_" . $username . str_replace( ".", "", hexdec( uniqid() ) );
				$popup_content  = html_entity_decode( $request->popup );
				$popup_fp       = fopen( $path . $popup_filename . ".html", "wb" );
				fwrite( $popup_fp, $popup_content );
				fclose( $popup_fp );

				$build = DB::table( 'forms_builds' )->where( [ 'user_id' => Auth::id(), "id" => $table->id ] );

				$build->update( [
					'html'       => $html_filename,
					'popup_html' => $popup_filename
				] );

				$id = $table->id;

			} else {
				$id = "exist-" . $exist->get()[0]->id;
			}


		} elseif ( $key == "save" ) {
			$build = DB::table( 'forms_builds' )->where( [
				'user_id' => Auth::id(),
				"id"      => $request->current_form_id
			] );

			$build->update( [
				'cat_id'        => $request->category,
				'form_name'     => $request->form_name,
				'properties'    => $request->properties,
				'main_language' => $request->main_language,
				'settings' => $request->settings,
				'related_forms' => $request->related_forms,
				'languages'     => $request->langua,
				'style'         => $request->style,
				'scripts'       => $request->scripts
			] );


			$username = Auth::user()['username'];
			$path     = storage_path() . "/users/" . $username . '/forms/html/' . $build->get()[0]->id . "/";
			File::isDirectory( $path ) or File::makeDirectory( $path, 0777, true, true );

			$html_filename = $build->get()[0]->html;
			$html_content  = html_entity_decode( $request->html );
			$html_fp       = fopen( $path . $html_filename . ".html", "wb" );
			fwrite( $html_fp, $html_content );
			fclose( $html_fp );

			$popup_filename = $build->get()[0]->popup_html;
			$popup_content  = html_entity_decode( $request->popup );
			$popup_fp       = fopen( $path . $popup_filename . ".html", "wb" );
			fwrite( $popup_fp, $popup_content );
			fclose( $popup_fp );

			$id = $request->current_form_id;

		}
		$this->clearCache();

		return $id;
	}

	public function manageCategory( $category_name, $fn ) {
		$get_categories = DB::table( 'elements_categories' )->where( "category_name", 'like', $category_name );

		if ( $fn == "d" ) {
			$get_categories->delete();

			return "true";
		} else {
			if ( $get_categories->count() == 0 ) {

				$table                = new elements_categories();
				$table->category_name = $category_name;
				$table->user_id       = Auth::id();
				$table->save();

				return $table->id;
			}
		}


	}

	public function saveElement( Request $request ) {
		$table               = new elements_library();
		$table->element_name = $request->element_name;
		$table->screenshot   = $request->screenshot;
		$table->category_id  = $request->category_id;
		$table->user_id      = Auth::id();
		$table->style        = $request->style;
		$table->element_html = html_entity_decode( $request->element_html );
		$table->save();

		return "true";
	}

	public function getElements( $cat_id, $id = "" ) {
		if ( $id !== "" ) {
			$elements_libraries = DB::table( 'elements_libraries' )->where( "id", $id )->get();
		} else {
			$elements_libraries = DB::table( 'elements_libraries' )->where( [
				[ 'category_id', '=', $cat_id ],
				[ 'user_id', '=', Auth::id() ],

			] )->get();
		}


		return $elements_libraries;
	}

	public function deleteElements( $id ) {
		$elements_libraries = DB::table( 'elements_libraries' )->where( "id", $id );

		$elements_libraries->delete();

		/*		foreach ( $table->get() as $item ) {
					$filename = $item->file_name;

					@unlink( public_path( "uploads/forms/$filename" ) );
				}*/

		return "true";
	}

	public function previewPost( Request $request ) {
		header( 'X-XSS-Protection:0' );

		return view( 'admin.builder.form-preview', compact( 'request' ) );

	}

	public function previewGet( $id ) {
		$request = DB::table( 'forms_builds' )->where( "id", $id )->get()[0];

		return view( 'admin.builder.form-preview', compact( 'request' ) );
	}

	public function preview_test() {
		$request = Array( [ "form_name" => "test", "html" => "test", "popup" => "test" ] );

		$request = json_encode( $request, JSON_FORCE_OBJECT );

		return view( 'admin.builder.form-preview', compact( 'request' ) );

	}

	public function getWordsList( $language ) {
		$list = array();
		$ids  = array();

		foreach ( DB::table( 'translations' )->select( $language, "id" )->get() as $lang ) {
			array_push( $list, $lang->$language );
			array_push( $ids, $lang->id );

		};

		return implode( ',', $list ) . "=" . implode( ',', $ids );

	}

	public function specificWords( $id, $main_language ) {

		return DB::table( 'translations' )->select( 'id', $main_language )->where( "id", $id )->get();

	}

	public function ToJson( $json ) {
		$reformat = implode( ':"', explode( ":'", $json ) );
		$reformat = implode( '":', explode( "':", $reformat ) );
		$reformat = implode( ',"', explode( ",'", $reformat ) );
		$reformat = implode( '",', explode( "',", $reformat ) );
		$reformat = implode( '{"', explode( "{'", $reformat ) );
		$reformat = implode( '"}', explode( "'}", $reformat ) );
		$reformat = implode( "'", explode( "{cotechn}", $reformat ) );

		return $reformat;
	}

	public function FromJson( $json ) {
		$reformat = implode( ":'", explode( ':"', $json ) );
		$reformat = implode( "':", explode( '":', $reformat ) );
		$reformat = implode( ",'", explode( ',"', $reformat ) );
		$reformat = implode( "',", explode( '",', $reformat ) );
		$reformat = implode( "{'", explode( '{"', $reformat ) );
		$reformat = implode( "'}", explode( '"}', $reformat ) );

		return $reformat;
	}

	public function searchEmptyValues( $array ) {
		$count_empty_values = 0;
		foreach ( $array as $key => $value ) {

			if ( $value == null ) {
				$count_empty_values ++;
			}
		}

		return $count_empty_values;
	}

	public function removeNulls( $jsons ) {
		$newObject = Array();

		foreach ( $jsons as $key => $value ) {
			if ( $value !== null ) {
				$newObject[ $key ] = $value;
			}
		}

		return $newObject;
	}

	public function addWordGroup( Request $request ) {


		$defaultValues = [
			"Header",
			"Short Text",
			"Textarea",
			"Paragraph",
			"Button",
			"Option",
			"Date",
			"Phone",
			"Image",
			"File",
			"Upload File",
			"Select",
			"Clear",
			"Sign Here",
			"",
			"",
			""
		];
		$return        = [];
//		$reformat = implode('<br>"', explode('"', $reformat));

		$mainlanguage = $request->main_language;
		$tojson       = json_decode( $this->ToJson( $request->json ), true );
		$form_id      = $request->form_id;

		for ( $js = 0; $js < count( $tojson ); $js ++ ) {
			$id      = $tojson[ $js ]["id"]; //ID of the html element not for database table
			$subJson = json_decode( $this->ToJson( $tojson[ $js ]["lang"] ), true ); //Get the attr called "lang"


			if ( is_array( $subJson ) ) { //check if it is array may it has an errors

				$count = translations::where( strtolower( $mainlanguage ), '=', $subJson[ $mainlanguage ] )->count();

				if ( ! array_key_exists( 'id', $subJson ) || translations::where( 'id', '=', $subJson['id'] )->count() == 0 ) {
//					echo strtolower($mainlanguage).":".$subJson[ $mainlanguage ]."////".DB::table( 'translations' )->where( strtolower($mainlanguage),"LIKE" , $subJson[ $mainlanguage ]."%" )->count()."<br>";

					if ( trim( $subJson[ $mainlanguage ] ) != null && trim( $subJson[ $mainlanguage ] ) != "" && $count == 0 ) {
						unset( $subJson["id"] ); // delete id paramater if exist
						$table = new translations();

						$table->type               = "builder";
						$table->$mainlanguage      = $subJson[ $mainlanguage ];
						$table->forms_ids_relation = $form_id;
						$table->save();

						$newId = $table->id;


						$return[ $js ]["statues"] = "add";
						$return[ $js ]["id"]      = $id;
						$return[ $js ]["lang"]    = $this->FromJson( json_encode( DB::table( 'translations' )->select( 'id', $mainlanguage )->where( 'id', $newId )->get(), JSON_UNESCAPED_UNICODE ) );
					}

				} else {


					if ( DB::table( 'translations' )->where( 'id', $subJson['id'] )->count() == 1 ) {

						$get_query = DB::table( 'translations' )->where( 'id', $subJson['id'] );

						foreach ( $subJson as $key => $value ) {
							if ( $key != "id" ) {

								$cleanforms_ids_relation = rtrim( str_replace( ",,", ",", $get_query->get()[0]->forms_ids_relation ), "," );
								$intoArray               = explode( ",", $cleanforms_ids_relation );

								if ( ! in_array( $form_id, $intoArray ) ) {
									if ( $get_query->count() == 1 ) {
										$get_query->update( [
											"forms_ids_relation" => $cleanforms_ids_relation . "," . $request->form_id
										] );
									}
								}
							}
						}
						$return[ $js ]["statues"] = "update";
						$return[ $js ]["id"]      = $id;
						$return[ $js ]["lang"]    = $this->FromJson( json_encode( DB::table( 'translations' )->select( 'id', $mainlanguage )->where( 'id', $subJson['id'] )->get(), JSON_UNESCAPED_UNICODE ) );

					} elseif ( DB::table( 'translations' )->where( $mainlanguage, $subJson[ $mainlanguage ] )->count() == 1 ) {
						$get_query = DB::table( 'translations' )->where( $mainlanguage, $subJson[ $mainlanguage ] );
						unset( $subJson["id"] );
						foreach ( $subJson as $key => $value ) {
							$cleanforms_ids_relation = rtrim( str_replace( ",,", ",", $get_query->get()[0]->forms_ids_relation ), "," );
							$intoArray               = explode( ",", $cleanforms_ids_relation );

							$update = true;
							for ( $t = 0; $t < count( $intoArray ); $t ++ ) {
								if ( $intoArray[ $t ] == $request->form_id ) {
									$update = false;

									return;
								}
							}

							if ( $update ) {
								if ( $get_query->count() == 1 ) {
									$get_query->update( [
										"forms_ids_relation" => $cleanforms_ids_relation . "," . $request->form_id
									] );
								}
							}
						}
						$return[ $js ]["statues"] = "update";
						$return[ $js ]["id"]      = $id;
						$return[ $js ]["lang"]    = $this->FromJson( json_encode( DB::table( 'translations' )->select( 'id', $mainlanguage )->where( 'id', $subJson['id'] )->get(), JSON_UNESCAPED_UNICODE ) );

					} else {
						$return[ $js ]["statues"] = "update";
						unset( $subJson["id"] );
						$return[ $js ]["id"]   = $id;
						$return[ $js ]["lang"] = json_encode( $subJson );
					}
				}


			} else {
				$return[ $js ]["statues"] = "error";
				$return[ $js ]["id"]      = null;
				$return[ $js ]["lang"]    = json_encode( $subJson );

			}


		}

		return Response::json( $return );

	}

	public function getFieldsList() {
		return DB::table( 'forms_fields' )->select( "field_name", "id" )->get();

	}

	public function addFieldsList( $list ) {
		$array = explode( ",", $list );
		for ( $r = 0; $r < count( $array ); $r ++ ) {

			$getRows = DB::table( 'forms_fields' )->where( "field_name", $array[ $r ] )->count();

			if ( $getRows == 0 ) {
				$table             = new forms_fields();
				$table->field_name = $array[ $r ];
				$table->save();
			}

		}

	}

	public function createFolderAndFile() {
		$username = Auth::user()['username'];


		$filename = hexdec( uniqid() );
		$path     = storage_path() . "/users/" . $username . '/forms/html/';
		File::isDirectory( $path ) or File::makeDirectory( $path, 0777, true, true );

		$content = "some text hergfhfghfghe";
		$fp      = fopen( $path . $filename . ".html", "wb" );
		fwrite( $fp, $content );
		fclose( $fp );

	}
}

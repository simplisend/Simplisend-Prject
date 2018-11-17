<?php

namespace App\Http\Controllers;

use App\categories;
use App\forms_builds;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Intervention\Image\Facades\Image;

class AdminController extends Controller {


	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct() {
		$this->middleware( 'auth' );
	}


	public function index() {
		$users = DB::table( 'users_joins' )->count();
		$free = disk_free_space("/");
		$total = disk_total_space("/");
		$percent = array(($free/$total) * 100,(($free/1024)/1024)/1024);
		$forms = DB::table( 'categories' )->count();



		$elements_categories= DB::table( 'elements_categories' )->where("user_id",Auth::id())->get();

		$cats_array = array();
		foreach ($elements_categories as $tags_categorie){
			array_push($cats_array,"",$tags_categorie->category_name);
		}


		$builds = DB::table( 'forms_builds' )->where( 'user_id', Auth::id() );
		if($builds->count() != 0){
			$backup = $builds->get()[0];
		}else{
			$backup = "";
		}
		return view('admin.home',compact('cats_array','elements_categories','backup' ,'users','percent','forms','elements_categories'));

	}


	public function translator() {
		$get_query = DB::table( 'translations' );
		$translations = $get_query->get();

		$columns = DB::getSchemaBuilder()->getColumnListing('translations');

		$numbers = [];
		foreach ($columns as $column){

			$get_specific = DB::table( 'translations' )->where( strtolower($column),"!=","" )->count();
			$numbers["$column"] = "(".$get_specific."/".$get_query->count().")";
		};


		return view( 'admin.pages.translator',compact('translations','numbers'));
	}
	public function translator_update($id,$lang,$value) {
		$get_query = DB::table( 'translations' )->where( 'id', $id );
		$get_query->update( [
			$lang      => $value
		] );

		return json_encode($get_query->get());
	}

	public function categories_manager( $id = 0 ) {
		$categories = DB::table( 'categories' )->get();
		$category   = DB::table( 'categories' )->where( "id", $id )->get()[0];
//		return view( 'layouts.categories_manage', compact( 'category','categories','id' ) );
		return view( 'admin.pages.categories_manage', compact( 'category', 'categories', 'id' ) );
//    	$groups = DB:table
	}
	public function add_form(Request $request){
		$_request = json_decode($request->data);
		$filename="";
		if ( $request->file ) {
			$filename=str_random(30).'.'.$request->file->getClientOriginalExtension();
			$request->file->move(public_path() . '/uploads/forms/', $filename);
		}

		$table = new forms_builds();

		$table->cat_id          = $_request->cat_id;
		$table->html          = $filename;
		$table->form_name      = $_request->form_name;
		$table->type      = 1;
		$table->publish = "on";
		$table->user_id = 1;

		$table->save();

		return $this->get_categories();
	}
	public function update_form(Request $request){
		$_request = json_decode($request->data);

		$selected = forms_builds::find($_request->id);

		$selected->form_name = $_request->form_name;
		if(isset($_request->properties))
			$selected->properties = json_encode($_request->properties);
		$selected->save();

		return $this->get_categories();
	}
	public function delete_form(Request $request){
		$_request = json_decode($request->data);

		$selected = forms_builds::find($_request->id);
		if($selected->type==1){
			if ( file_exists( public_path( "uploads/forms/".$selected->html ) ) ) {
				@unlink( public_path( "uploads/forms/".$selected->html ) );
			}
		}
		$selected->delete();

		return $this->get_categories();
	}

	private function get_forms($id){
		$forms = DB::table( 'forms_builds' )->where('cat_id',$id)->get(['id','form_name','properties','type']);
		return  $forms;
	}
	public function get_categories(){
		$categories = DB::table( 'categories' )->get();
		$cats = [];
		foreach ($categories as $cat){

			$cat->forms = $this->get_forms($cat->id);
			if(!isset($cat->categorires)){
				$cat->categorires = [];
				if($cat->properties==null){
					$cat->properties=[];
				}
			}
			if($cat->parent_category_id==0){
				if(!($cat->parent_category_id === null )) {
					array_push($cats, $cat);
				}
			}else{
				foreach ($categories as $c){
					if($cat->parent_category_id == $c->id){
						if(isset($c->categorires)){
							array_push($c->categorires,$cat);
						}else{
							$c->categorires = [];
							array_push($c->categorires,$cat);
						}
					}
				}
			}
		}
		return  $cats;
	}
	public function create_new( $prent_id ) {
		$table                     = new categories();
		$table->properties         = "item";
		$table->category_name      = "item";
		$table->parent_category_id = $prent_id;
		$table->save();
	}
	public function store( Request $request ) {
		//return ($request->file ) ? "yes" : "no";
		//return json_decode($request->data)->category_name;
		$_request = json_decode($request->data);
		$filename="";
		if ( $request->file ) {
			$filename=str_random(30).'.'.$request->file->getClientOriginalExtension();
			$request->file->move(public_path() . '/uploads/thumbnails', $filename);

			/*$image = Image::make($request->file);
			$path  = public_path( 'uploads/thumbnails' );

			$filename = substr( encrypt( $_request->category_name ), 0, 25 ) . '.' . $image->getClientOriginalExtension();
			if ( file_exists( $path . "/" . $filename ) ) {
				$filename = substr( encrypt( $_request->category_name ), 0, random_int( 10, 24 ) ) . '.' . $image->getClientOriginalExtension();
			}
			$path_larg = public_path( "uploads/$filename" );

			Image::make( $image->getRealPath() )->resize( 500, null, function ( $constraint ) {
				$constraint->aspectRatio();
			} )->save( $path_larg );*/

		}
		//$filename = substr( encrypt( $_request->category_name ), 0, 25 ) . '.jpg';

		$table = new categories();

		$table->thumbnail          = $filename;
		$table->category_name      = $_request->category_name;
		$table->properties         = "[]";
		$table->color              = $_request->category_color;
		$table->parent_category_id = $_request->cat_id;

		$table->save();

		return $this->get_categories();
	}

	public function update( Request $request ) {

		//$categories_query = DB::table( 'categories' )->where( 'id', $request->current_id );
		$_request = json_decode($request->data);

		$get_selected = categories::find($_request->id);
		if ( $request->file ) {
			if ( file_exists( public_path( "uploads/thumbnails/$get_selected->thumbnail" ) ) ) {
				@unlink( public_path( "uploads/thumbnails/$get_selected->thumbnail" ) );
			}
			$filename = str_random(30) . '.' . $request->file->getClientOriginalExtension();
			$request->file->move(public_path() . '/uploads/thumbnails', $filename);
			$get_selected->thumbnail = $filename;
		}
		if(isset($_request->category_name))
			$get_selected->category_name = $_request->category_name;
		if(isset($_request->color))
			$get_selected->color = $_request->color;
		if(isset($_request->properties))
			$get_selected->properties = json_encode($_request->properties);

		$get_selected->save();


		/*$categories_query->update( [
			'category_name'      => $_request->category_name,
			'properties'         => $_request->properties,
			'thumbnail'          => $filename,
			'color'              => $request->color,
			'parent_category_id' => $request->parent_category_id,
		] );*/

		return $this->get_categories();
	}


	public function getProperties( $id ) {
		$category   = DB::table( 'categories' )->where( "id", $id )->get()[0];

		return $category->properties;
	}

	public function LoopDeleteForms( $id ) {
		$table = DB::table( "categories" )->where( "parent_category_id", $id );


		foreach ( $table->get() as $item ) {
			$filename = $item->thumbnail;

			if ( file_exists( public_path( "uploads/thumbnails/$filename" ) ) ) {
				@unlink( public_path( "uploads/thumbnails/$filename" ) );
			}
			$this->LoopDeleteForms( $item->id );
			$table->delete();
		}
	}

	public function deleteCategories( Request $request ) {

		//return $request->data;
		$_request = json_decode($request->data);
		$gettable = categories::find($_request->id);

		//$gettable = DB::table( "categories" )->where( 'id', $id )->get();

		$this->LoopDeleteForms( $_request->id );
		$filename = $gettable->thumbnail;

		if ( file_exists( public_path( "uploads/thumbnails/$filename" ) ) ) {
			@unlink( public_path( "uploads/thumbnails/$filename" ) );
		}

		$gettable->delete();

		return $this->get_categories();

		//DB::table( "categories" )->where( "id", $id )->delete();

		//$msg = array( [ "msg" => "success" ] );

		//return json_encode( $msg );

		//return back();
	}


	public function test() {

		$Categories = DB::table( "categories" )->where( "parent_category_id", "0" )->get();


		$refs = array();
		$list = array();

		$sql = "SELECT item_id, parent_id, name FROM items ORDER BY name";

		/** @var $pdo \PDO */
		$result = $pdo->query( $sql );

		foreach ( $result as $row ) {
			$ref = &$refs[ $row['item_id'] ];

			$ref['parent_id'] = $row['parent_id'];
			$ref['name']      = $row['name'];

			if ( $row['parent_id'] == 0 ) {
				$list[ $row['item_id'] ] = &$ref;
			} else {
				$refs[ $row['parent_id'] ]['children'][ $row['item_id'] ] = &$ref;
			}
		}
	}
}

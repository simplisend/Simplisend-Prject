<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JsonController extends Controller {
	public function getCategories( $table, $column, $id ) {
		if ( strpos( $id, "#" ) ) {
			$id = explode( "#", $id )[0];
		}
		$selectedCat = DB::table( $table )->where( $column, $id )->get();

		return json_encode( $selectedCat );
	}

	public function getFormList( $target, $id ) {
		$selectedCat = DB::table( "category6_forms" )
		                 ->where( [
			                 [ 'target', '=', $target ],
			                 [ $target, '=', $id ]
		                 ] )
		                 ->orderBy( 'created_at', 'desc' )
		                 ->get();

		return json_encode( $selectedCat );
	}


}

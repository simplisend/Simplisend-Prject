<?php

namespace App\Http\Controllers;

use App\Models\forms_fields;
use App\Models\users_joins;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller {
	public function index( $key ) {
		if ( $key == 'add' ) {
			return view( 'Users.add' );
		} elseif ( $key == "all" ) {
			$getAll = DB::table('users_joins')->get();
			return view( 'Users.users',compact('getAll') );
		}


	}


	public function store( Request $request ) {
		$table             = new users_joins();
		$table->firstname  = $request->firstname;
		$table->middlename = $request->middlename;
		$table->lastname   = $request->lastname;
		$table->username   = encrypt( $request->username );
		$table->password   = encrypt( $request->password );
		$table->birth      = $request->birth;
		$table->email      = $request->email;

		$table->save();
	}

	public function fill_form_fields() {
		$table             = new forms_fields();
		$table->de_field_name  = $request->firstname;
		$table->middlename = $request->middlename;
		$table->lastname   = $request->lastname;
		$table->username   = encrypt( $request->username );
		$table->password   = encrypt( $request->password );
		$table->birth      = $request->birth;
		$table->email      = $request->email;

		$table->save();
	}
	public function fill_form_user_values() {

	}

	public function block( Request $request ) {

	}

	public function update( Request $request ) {

	}
}


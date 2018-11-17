<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class categories extends Model
{
	public function subCategories()
	{
		return $this->hasMany('App\Category', 'parent_category_id', 'id');
	}

}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class categories extends Model
{
	protected $table = "categories";
	protected $primaryKey = 'id';

	protected $fillable = [
		'category_name','color', 'properties', 'thumbnail', 'parent_category_id'
	];

	public function subCategories()
	{
		return $this->hasMany('App\Category', 'parent_category_id', 'id');
	}

}

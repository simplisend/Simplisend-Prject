@extends('master')


@section('head')

@endsection



@section('content')

    <!-- page content -->
    <div class="right_col" role="main">
        <div class="">
            <div class="page-title">
                <div class="title_left">
                    <h3>Manage {{ $title }}</h3>
                </div>
            </div>
            <div class="clearfix"></div>
            <div class="row">

                @if($key == '1')
                    <div class="col-md-8 col-xs-12">
                        <div class="x_panel">
                            <div class="x_title">
                                <h2><i class="glyphicon glyphicon-list-alt title-padding"></i>Add <strong></strong></h2>
                                <div class="clearfix"></div>
                            </div>
                            <div class="x_content">
                                <br/>
                                <form class="form-horizontal form-label-left category_form" action="{{ route('store_contract') }}"
                                      method="POST">
                                    {{ csrf_field() }}

                                    <input type="hidden" name="table" value="contracts_categories">
                                    <div class="item form-group">
                                        <label class="control-label col-md-3 col-sm-3 col-xs-12">Name</label>
                                        <div class="col-md-9 col-sm-9 col-xs-12">
                                            <input type="text" name="de_category_name" class="form-control"
                                                   placeholder="اسم المجموعة" required="required" >
                                        </div>
                                    </div>
                                    <div class="ln_solid"></div>
                                    <div class="form-group">
                                        <div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                                            <button type="submit" class="btn btn-success">Add</button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 col-xs-12">
                        <div class="x_panel">
                            <div class="x_title">
                                <h2><i class="glyphicon glyphicon-list title-padding"></i>{{ $title }} Added List</h2>
                                <div class="clearfix"></div>
                            </div>
                            <div class="x_content">

                                <!-- start accordion -->
                                <div class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                                    <div class="panel-body">
                                        <table class="table table-bordered">
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>{{ $title }} Name</th>
                                                <th>Actions</th>

                                            </tr>
                                            </thead>
                                            <tbody>

											<?php $count = 1 ?>

                                            @foreach($Categories as $category)
                                                <tr>
                                                    <th scope="row"><?php echo $count; ?></th>
                                                    <td>{{ $category->de_category_name }}</td>
                                                    <td>
                                                        <a onclick="deleteCat(this)" name="edit#category1_groups#{{ $category->id }}"><i class="glyphicon glyphicon-edit"></i></a>
                                                        <a onclick="deleteCat(this)" name="delete#category1_groups#{{ $category->id }}"><i class="glyphicon glyphicon-trash"></i></a>
                                                    </td>

                                                </tr>
												<?php $count+=1 ?>
                                            @endforeach
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <!-- end of accordion -->
                            </div>
                        </div>
                    </div>
                @elseif($key == '2')
                    <script type="application/javascript">
                        var SelectID = '{{ session('id') }}';
                    </script>

                    <div class="col-md-8 col-xs-12">
                        <div class="x_panel">
                            <div class="x_title">
                                <h2><i class="glyphicon glyphicon-list-alt title-padding"></i>Add {{ $title }} </h2>
                                <div class="clearfix"></div>
                            </div>
                            <div class="x_content">
                                <br/>
                                <form class="form-horizontal form-label-left category_form" action="{{ route('store_contract') }}"
                                      method="POST">
                                    {{ csrf_field() }}

                                    <input type="hidden" name="table" value="contracts_companies">
                                    <input type="hidden" name="column" value="category_id">

                                    <div class="form-group">
                                        <label class="control-label col-md-3 col-sm-3 col-xs-12">Select Category</label>
                                        <div class="col-md-9 col-sm-9 col-xs-12">
                                            {{--<select name="category_id" class="form-control" id="contracts_companies" aria-describedby="company_name" about="Company/true/false" title="category_id" datasrc="{{ route("getCategories",["contracts_companies","category_id",'']) }}">--}}
                                                <select title="contracts_companies" name="category_id" class="form-control"
                                                        onchange="getCategories(this,'','company_name',false,true)">

                                                <option>Choose option</option>
                                                @foreach($Categories as $Category)
                                                    <option value="{{ $Category->id }}">{{ $Category->de_category_name }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="control-label col-md-3 col-sm-3 col-xs-12">Company Name</label>
                                        <div class="col-md-9 col-sm-9 col-xs-12">
                                            <input type="text" class="form-control" name="company_name"
                                                   placeholder="Type Here ....">
                                        </div>
                                    </div>

                                    <div class="ln_solid"></div>
                                    <div class="form-group">
                                        <div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                                            <button type="submit" class="btn btn-success">Submit</button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>


                    <div class="col-md-4 col-xs-12">
                        <div class="x_panel">
                            <div class="x_title">
                                <h2><i class="glyphicon glyphicon-list title-padding"></i>{{ $title }} Added List</h2>
                                <div class="clearfix"></div>
                            </div>
                            <div class="x_content">

                                <!-- start accordion -->
                                <div class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                                    <div class="panel-body">
                                        <table class="table table-bordered">
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>{{ $title }} Name</th>
                                                <th>Actions</th>

                                            </tr>
                                            </thead>
                                            <tbody id="list_table">

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <!-- end of accordion -->


                            </div>
                        </div>
                    </div>

                @endif
            </div>
        </div>
    </div>
    <!-- /page content -->

@endsection

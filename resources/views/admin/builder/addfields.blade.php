@extends('master')

@section('content')

    <!-- page content -->
    <div class="right_col" role="main">
        <div class="">
            <div class="page-title">
                <div class="title_left">
                    <h3>Add New Field</h3>
                </div>
            </div>

            <div  class="clearfix"></div>
            <div class="row">
                <div class="col-md-4 col-sm-4 col-xs-12">
                    <div class="x_content">
                        <br/>
                        <form action="{{ route('properties') }}" method="post" class="form-horizontal form-label-left">
                            {{ csrf_field() }}
                            <input type="hidden" name="key" value="field">
                            <div class="form-group">
                                <label class="control-label col-md-12 col-sm-12 col-xs-12" for="first-name">Field Name
                                    <span class="required">*</span>
                                </label>
                                <div class="col-md-12 col-sm-12 col-xs-12">
                                    <input type="text" id="field-name" name="de_field_name" required="required"
                                           class="form-control col-md-7 col-xs-12" title="de_field_name">
                                </div>
                            </div>
                            <div class="ln_solid"></div>
                            <div class="form-group">
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <button type="submit" class="btn btn-success">Submit</button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
                <div class="col-md-8 col-sm-8 col-xs-12">
                    <div class="x_panel">
                        <div class="x_title">
                            <h2><i class="glyphicon glyphicon-list title-padding"></i>Fields Added List</h2>
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
                                            <th>Field Name</th>
                                            <th>Actions</th>

                                        </tr>
                                        </thead>
                                        <tbody id="list_table">
                                        <?php $count = 1 ?>

                                        @foreach($allfields as $field)
                                            <tr>
                                                <th><?php echo $count; ?></th>
                                                <td>{{ $field->de_field_name }}</td>
                                                <td>
                                                    <a onclick="deleteCat(this)" href="#"
                                                       about="{{ route('delete',['category1_groups','group_id',$Group->id]) }}">
                                                        <i class="glyphicon glyphicon-trash"></i></a>
                                                </td>

                                            </tr>
	                                        <?php $count += 1 ?>
                                        @endforeach

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <!-- end of accordion -->
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <!-- /page content -->


@endsection
@extends('admin.master')


@section('head')
    <link href="{{ asset("css/admin/categories.css") }}" rel="stylesheet">

    <!--<link rel="stylesheet" type="text/css" href="{{ asset("css/panel-edit.css") }}">-->
    <link rel="stylesheet" type="text/css" href="{{ asset("css/ng-tags-input.css") }}">
    <link rel="stylesheet" type="text/css" href="{{ asset("css/ng-colorpicker.min.css") }}">
    <link rel="stylesheet" type="text/css" href="{{ asset("css/ng-datepicker.css") }}">
@endsection



@section('content')

    <div class="right_col" role="main" ng-app="categories_manager">
        <div class="" ng-controller="categoriesController as catCtrl">
            <!--<div class="page-title">
                <div class="title_left">
                    <h3>Manage Categories</h3>
                </div>
            </div>-->
            <div class="clearfix"></div>
            <div class="row">
                <div class="col-sm-12 col-xs-12 col-lg-12">
                    <div id="cat-list-div" class="col-sm-4  col-xs-4 col-lg-4 no-padding">
                        <div class="main-div">
                            <div ng-show="bussy" class="loading">
                                <!--<span>Loading...</span>-->
                            </div>
                            <div class="cat-title ">
                                <p>CATEGORY LIST</p>
                            </div>
                            <div class="relative-box">
                                <div id="cat-panel1" class="panel0" ><!--ng-class="{'panel0':!catCtrl.rv, 'panel1':catCtrl.rv }"-->
                                    <div class="conatainer-panel ">
                                        <div class="tools-bar ">
                                            <ul class="btn-cat ">
                                                <!--<li class="tool-item " ng-click="catCtrl.unselectCategory()"><i class="admin-icons icons-main-category"></i>
                                                </li>-->
                                                <li ng-click="catCtrl.addCategory();" class="tool-item " title="add category" data-toggle="tooltip" data-placement="top"><i
                                                            class="admin-icons icons-form-list"></i></li>
                                                <!--new-->
                                                <li ng-click="catCtrl.deleteCategory();" class="tool-item " title="delete category" data-toggle="tooltip" data-placement="top"><i
                                                            class="admin-icons icons-trash"></i></li>
                                                <!--remove-->
                                                <li ng-click="catCtrl.renameCategory();" title="rename category" data-toggle="tooltip" data-placement="top"
                                                    class="tool-item "><i class="admin-icons icons-rename"></i></li>
                                                <!--rename-->
                                            </ul>
                                            <!--<ul class="btn-cat right-float">
                                                <li class="tool-item "><i class="admin-icons icons-background"></i></li>
                                                <li class="tool-item ">
                                                    <div class="color-sign"></div>
                                                </li>
                                            </ul>-->
                                        </div>
                                        <category-list cats="catCtrl.cats" edit="catCtrl.editImage"  current="catCtrl.currentCat"></category-list>
                                    </div>
                                </div>
                                <div ng-click="catCtrl.shrv()" id="panel1" class="panel3" ><!--ng-class="{'panel3':!catCtrl.rv, 'panel2':catCtrl.rv }"-->
                                    <div class="relative-box">
                                        <p class="rotated">RELEVANT VALUE</p>
                                    </div>
                                </div>
                                <div ng-click="catCtrl.shvm()" id="panel2" class="panel2" ng-if="!catCtrl.rv">
                                    <div class="relative-box">
                                        <p class="rotated">VALUE MANAGER</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="rel-val-div" class="col-sm-4 col-xs-4 col-lg-4 no-padding" ng-show="catCtrl.rv">
                        <div class="main-div">
                            <div ng-show="bussy" class="loading">
                                <!--<span>Loading...</span>-->
                            </div>
                            <div class="cat-title" style="visibility: hidden">
                                <i class="admin-icons icons-main-category"></i>
                                <p>RELEVANT VALUE</p>
                            </div>
                            <div class="relative-box">
                                <div id="cat-panel2" class="cat-panel22">
                                    <div class="conatainer-panel ">
                                        <div class="cat-caption">
                                            <p>RELEVANT VALUE</p>
                                        </div>
                                        <div class="tools-bar ">
                                            <ul class="btn-cat ">
                                                <!--<li class="tool-item " ng-click="catCtrl.unselectProperty()"><i class="admin-icons icons-main-category"></i>
                                                </li>-->
                                                <li ng-click="catCtrl.addProperty()" class="tool-item " title="add value" data-toggle="tooltip" data-placement="top"><i
                                                            class="admin-icons icons-form-list"></i></li>
                                                <!--new-->
                                                <li ng-click="catCtrl.removeProperty()" class="tool-item " title="delete value" data-toggle="tooltip" data-placement="top"><i
                                                            class="admin-icons icons-trash"></i></li>
                                                <!--remove-->
                                                <li ng-click="catCtrl.renameProperty()" title="rename value" data-toggle="tooltip" data-placement="top"
                                                    class="tool-item "><i class="admin-icons icons-rename"></i></li>
                                                <!--rename-->
                                            </ul>
                                            <!--ul class="btn-cat right-float">
                                                <li class="tool-item "><i class="admin-icons icons-main-category"></i></li><li class="tool-item "><i class="admin-icons icons-main-category"></i></li>
                                            </ul-->
                                        </div>
                                        <property-list properties="currentCat.properties" parent="null"></property-list>
                                    </div>
                                </div>
                                <div ng-click="catCtrl.shvm()" id="panel2" class="panel2">
                                    <div class="relative-box">
                                        <p class="rotated">VALUE MANAGER</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="val-manager-div" class="col-sm-4 col-xs-4 col-lg-4 no-padding"  ng-show="catCtrl.vm">
                        <div class="main-div">
                            <div ng-show="bussy" class="loading">
                                <!--<span>Loading...</span>-->
                            </div>
                            <div class="cat-title" style="visibility: hidden;">
                                <i class="admin-icons icons-main-category"></i>
                                <p>VALUE MANAGER</p>
                            </div>
                            <div class="relative-box">
                                <div id="cat-panel3" class="cat-panel2">
                                    <div class="conatainer-panel " >
                                        <div ng-if="selectedProperty.id">
                                        <div class="cat-caption">
                                            <p>VALUE MANAGER</p>
                                        </div>

                                        <div class="info-container ">
                                            <div class="info-box ">
                                                <!--<form name="valueManager">-->
                                                <input type="text" name="detail" class="add-new-info " placeholder="add detail.." ng-model="selectedProperty.value.address" ng-blur="catCtrl.updateCurrentCat()">
                                                <!--</form>
                                                <div ng-show="!valueManager.detail.$pristine">used</div>-->
                                                <!--<div class="info ">
                                                    <label>AL Mazzah Street 15888 Damascus Syria</label>
                                                </div>-->
                                            </div>
                                        </div>

                                        <div class="tools-bar centerd-text no-background ">
                                            <p class="black-font ">FILTER VALUE</p>
                                        </div>

                                        <div class="tools-bar ">
                                            <ul class="btn-cat ">
                                                <!--<li class="tool-item "><i class="admin-icons icons-main-category"></i>
                                                </li>-->
                                                <li ng-click="catCtrl.addSubProp()" class="tool-item " title="add filter value" data-toggle="tooltip" data-placement="top"><i
                                                            class="admin-icons icons-form-list"></i></li>
                                                <!--new-->
                                                <li ng-click="catCtrl.removeSubProp()" class="tool-item " title="delete filter value" data-toggle="tooltip" data-placement="top"><i
                                                            class="admin-icons icons-trash"></i></li>
                                                <!--remove-->
                                                <li ng-click="catCtrl.renameSubProp()" title="rename filter value" data-toggle="tooltip" data-placement="top"
                                                    class="tool-item "><i class="admin-icons icons-rename"></i></li>
                                                <!--rename-->
                                            </ul>
                                        </div>
                                        <ul class="list-group">

                                            <ul ng-repeat="(key, subProp) in selectedProperty.value.sub track by $index" ng-class="{'custom-item':true, 'active':selectedSubProp.id==subProp.id }">
                                                <ul class="street-info" ng-click="catCtrl.selectSubProp(subProp.id)" ng-dblclick="catCtrl.renameSubProp()">
                                                    <li><i class="admin-icons icons-main-category"></i></li>
                                                    <li class="item-label-container">
                                                        <label ng-if="catCtrl.renameSubPropId!=subProp.id" class="caption-label"><%subProp.title%></label>
                                                        <input ng-if="catCtrl.renameSubPropId==subProp.id" type="text" ng-model="subProp.title" ng-blur="catCtrl.updateCurrentCat()" style="color: #000;">
                                                    </li>
                                                </ul>
                                                <ul class="tags-ul">
                                                    <li>
                                                        <div class="tags-div">
                                                            <tags-input ng-model="subProp.codes" ng-blur="catCtrl.updateCurrentCat()" style="color:#000;" ng-blur="catCtrl.updateCurrentCat()"></tags-input>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <ul class="list-group"></ul>
                                            </ul>

                                        </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="forms-list-div" class="col-sm-4 col-xs-4 col-md-4 col-lg-4" ng-hide="catCtrl.rv">
                        <div class="main-div">
                            <div ng-show="bussy" class="loading">
                                <!--<span>Loading...</span>-->
                            </div>
                            <div class="cat-title">
                                <p> FORM LIST</p>
                            </div>
                            <div class="relative-box">
                                <div id="forms-list" class="cat-panel2">
                                    <div class="conatainer-panel ">
                                        <div class="tools-bar " >
                                            <ul class="btn-cat ">

                                                <li ng-click="catCtrl.addForm()" class="tool-item " title="Add New" data-toggle="tooltip" data-placement="top"><i
                                                            class="admin-icons icons-form-list"></i></li>
                                                <li ng-click="catCtrl.removeForm()" class="tool-item " title="Delete" data-toggle="tooltip" data-placement="top"><i
                                                            class="admin-icons icons-trash"></i></li>
                                                <li ng-click="catCtrl.renameForm()" title="Rename" data-toggle="tooltip" data-placement="top"
                                                    class="tool-item "><i class="admin-icons icons-rename"></i></li>
                                                <li ng-click="catCtrl.openForm()" title="Open" data-toggle="tooltip" data-placement="top"
                                                    class="tool-item "><i class="icons icons-open"></i></li>
                                                <!--<li ng-click="catCtrl.copyForm()" title="copy form" data-toggle="tooltip" data-placement="top"
                                                    class="tool-item "><i class="admin-icons icons-form-list"></i></li>-->
                                            </ul>
                                        </div>
                                        <ul class="list-group" ng-if="currentCat.forms.length>0">
                                            <li ng-repeat="(key, form) in currentCat.forms track by $index" class="list-group-item" id="form-item-<%form.id%>">
                                                <ul ng-class="{'custom-item':true, 'active':(currentForm.id == form.id) }" ng-click="catCtrl.selectForm(form)" ng-dblclick="catCtrl.renameForm()">
                                                    <li><i ng-class="{'admin-icons':true, 'icons-form-b': (form.type==0), 'icons-form-list':(form.type==1)}"></i></li>
                                                    <li class="item-label-container">
                                                        <label ng-if="catCtrl.renameFormId!=form.id"><% form.form_name %></label>
                                                        <input ng-if="catCtrl.renameFormId==form.id" type="text" ng-model="form.form_name" ng-blur="catCtrl.updateFormDone()" style="color: #000;">
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="form-prop-div" class="col-sm-4 col-xs-4 col-md-4 col-lg-4" ng-hide="catCtrl.vm">
                        <div class="main-div">
                            <div ng-show="bussy" class="loading">
                                <!--<span>Loading...</span>-->
                            </div>
                            <div class="cat-title">
                                <p> PROPERTIES</p>
                            </div>
                            <div class="relative-box">
                                <div id="form-prop" class="cat-panel2">
                                    <div class="conatainer-panel" style="overflow: initial;">
                                        <ul class="list-group" style="padding: 0px 0px" ng-if="currentForm.id">
                                            <h4 style="padding:0px 10px;">Status</h4>
                                            <div style="height: 31px;">
                                                <div class="form-builder col-sm-6 col-xs-6 col-md-6 col-lg-6 element-left" style="padding: 4px 0;">
                                                    <h5 style="padding: 0px 10px; margin: 0;">Activated</h5>
                                                </div>
                                                <div class="form-builder col-sm-5 col-xs-5 col-md-5 col-lg-5 element-right" style="padding-right: 0;padding-left: 0;">
                                                    <div class="onoffswitch">
                                                        <input type="checkbox" ng-model="currentForm.properties.Activated" name="Activated" value="1" onchange=" setTimeout(function(){updateTooltip()},100); if(this.value === '0'){ $(this).val('1'); $('#form_border_size').find('input[name!=\'Activated\']').val(1).change();}else{ $(this).val('0') }" class="onoffswitch-checkbox" id="Activated" ng-change="catCtrl.updateFormDone()">
                                                        <label class="onoffswitch-label" for="Activated">
                                                            <span class="onoffswitch-inner"></span>
                                                            <span class="onoffswitch-switch"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr>
                                            <div style="height: 31px;">
                                                <div class="form-builder col-sm-6 col-xs-6 col-md-6 col-lg-6 element-left" style="padding: 4px 0;">
                                                    <h5 style="padding: 0px 10px; margin: 0;">Submission limit</h5>
                                                </div>
                                                <div class="form-builder col-sm-5 col-xs-5 col-md-5 col-lg-5 element-right" style="padding-right: 0;padding-left: 0;">
                                                    <div class="onoffswitch">
                                                        <input type="checkbox" name="border_all" ng-model="currentForm.properties.Submission_limit" value="1" onchange=" setTimeout(function(){updateTooltip()},100); if(this.value === '0'){ $(this).val('1'); $('#form_border_size').find('input[name!=\'Submission_limit\']').val(1).change();}else{ $(this).val('0') }" class="onoffswitch-checkbox" id="Submission_limit" ng-change="catCtrl.updateFormDone()">
                                                        <label class="onoffswitch-label" for="Submission_limit">
                                                            <span class="onoffswitch-inner"></span>
                                                            <span class="onoffswitch-switch"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tools-bar " ng-if="currentForm.properties.Submission_limit">
                                                <ul class="btn-cat ">
                                                    <li ng-click="catCtrl.addFormTime()" class="tool-item " title="add submission limit" data-toggle="tooltip" data-placement="top">
                                                        <i class="admin-icons icons-form-list"></i></li>
                                                    <li ng-click="catCtrl.removeFormTime()" class="tool-item " title="delete submission limit" data-toggle="tooltip" data-placement="top">
                                                        <i class="admin-icons icons-trash"></i></li>
                                                </ul>
                                            </div>
                                            <ul class="list-group submittion-div" ng-if="currentForm.properties.Submission_limit" >
                                                <li ng-repeat="(key, time) in currentForm.properties.times track by $index" ng-class="{'custom-item':true, 'active':(catCtrl.time_id == $index)}" ng-click="catCtrl.selectFormTime($index)">

                                                    <div class="row" style="height: 25px">
                                                        <div class="form-builder col-sm-4 col-xs-4 col-md-4 col-lg-4 element-left">
                                                            <h5 style="padding: 5px 8px;margin: 0;">Every</h5>
                                                        </div>
                                                        <div class="form-builder col-sm-8 col-xs-8 col-md-8 col-lg-8 element-left" >
                                                            <select style="border: 0px; background-color: transparent;" ng-model="time.every" ng-change="catCtrl.updateFormDone()">
                                                                <option value="year" style="color:#000;">year</option>
                                                                <option value="month" style="color:#000;">month</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="row" style="height: 25px">
                                                        <div class="form-builder col-sm-4 col-xs-4 col-md-4 col-lg-4 element-left">
                                                            <h5 style="padding: 5px 8px;margin: 0;">From</h5>
                                                        </div>
                                                        <div class="form-builder col-sm-7 col-xs-7 col-md-7 col-lg-7 element-left" >
                                                            <datepicker date-format="dd-MM-yyyy" style="position: unset;">
                                                                <input ng-model="time.from"  type="text"  style="border: 1px solid #436682; color:#000;" ng-change="catCtrl.updateFormDone()"/>
                                                            </datepicker>
                                                        </div>
                                                    </div>
                                                    <div class="row" style="height: 25px">
                                                        <div ng-if="time.from">
                                                            <div class="form-builder col-sm-4 col-xs-4 col-md-4 col-lg-4 element-left" >
                                                                <h5 style="padding: 5px 8px;margin: 0;">End</h5>
                                                            </div>
                                                            <div class="form-builder col-sm-7 col-xs-7 col-md-7 col-lg-7 element-left" >
                                                                <datepicker date-format="dd-MM-yyyy" style="position: unset;">
                                                                    <input ng-model="time.end" type="text"  style="border: 1px solid #436682; color:#000;" ng-change="catCtrl.updateFormDone()"/>
                                                                </datepicker>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            <!-- LISTS HERE -->

                                            <!-- LISTS ENDED -->

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>



@endsection


@section("script")
    <!-- NProgress -->
    <script src="{{ asset("js/aio/ng/angular.min.js") }}"></script>
    <script src="{{ asset("js/aio/ng/bootstrap-colorpicker-module.min.js") }}"></script>
    <script src="{{ asset("js/aio/ng/angular-datepicker.min.js") }}"></script>
    <script src="{{ asset("js/aio/ng/ng-tags-input.min.js") }}"></script>
    <script src="{{ asset("js/aio/ng/ui-bootstrap-tpls-0.14.3.min.js") }}"></script>
    <script src="{{ asset("js/aio/ng/categories_manager.js") }}"></script>
    <!--<script src="{{ asset("js/categories-functions.js") }}"></script>-->

    <script>
        var api = '{{ action('AdminController@get_categories') }}';
        var add_form_from_builder = '{{ action('HomeController@index',[]) }}';
        var updateTooltip=function(){
            $('[data-toggle=tooltip]').hover(function(){
                // on mouseenter
                $(this).tooltip('show');
            }, function(){
                // on mouseleave
                $(this).tooltip('hide');
            });
        }
        $(function(){
            updateTooltip();
        });
    </script>
@stop

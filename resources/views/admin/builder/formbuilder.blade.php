<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="_token" content="{!! csrf_token() !!}"/>
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">

    <title>{{ config('app.name') }}</title>

    <meta name="url" content="{{ route('route') }}">


    <style>
        .ui-pnotify-sticker {
            display: none !important;
        }
    </style>
    <link href="{{ asset("css/main.css?version=0.1") }}" rel="stylesheet"/>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.css">
    <style>
        .grad_ex {
            width: 100%;
            height: 20px;
            margin-bottom: 32px;
        }
    </style>
    {{--<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>--}}

    <!--[if IE]>
    <script type="text/javascript" src="js/excanvas.js"></script>
    <![endif]-->
    <script src="{{ asset("js/html2canvas.js") }}" type="text/javascript"></script>

    <style>
        .custom-combobox {
            position: relative;
            display: inline-block;
        }

        .custom-combobox-toggle {
            position: absolute;
            top: 0;
            bottom: 0;
            margin-left: -1px;
            padding: 0;
        }

        .custom-combobox-input {
            margin: 0;
            padding: 5px 10px;
        }
    </style>


</head>
<body class="nav-sm" onkeydown="preventZoom(event)">
<div id="wait-loading"
     style="display: none;width: 100%;height: 100vh;cursor: wait;position: absolute;z-index: 9999;"></div>
<div id="norification-alert" class="ui-pnotify"
     style="display: none;width: 300px;right: 36px;top: 36px;position: absolute;z-index: 9998;">
    <div class="alert ui-pnotify-container alert-info ui-pnotify-shadow" role="alert" style="min-height: 16px;">
        <div class="ui-pnotify-closer" aria-role="button" tabindex="0" title="Close" style="cursor: pointer;"
             onclick="$(this).parent().parent().fadeOut()">
            <span class="glyphicon glyphicon-remove"></span>
        </div>
        <div class="ui-pnotify-icon"><span class="glyphicon glyphicon-info-sign"></span></div>
        <h4 class="ui-pnotify-title"></h4>
        <div class="ui-pnotify-text">An item has the same ID please choose another</div>
    </div>
</div>
<div class="container body" style="overflow: hidden">
    <style>
        div#test {
            /*display: none;*/
            width: auto;
            position: fixed;
            right: 0;
            z-index: 9999;
            background-color: white;
            color: black;
            padding: 15px;
            top: 0;
        }

        .kbw-signature {
            width: 100%;
            height: 100px;
        }

    </style>

    <div id="test">
    </div>
    <!-- Button trigger modal -->
    <div class="logo-loader">
        <img class="center"
             src="{{ asset('images\logo.png') }}">
    </div>


    <div class="container" id="form-builder">
        <div class="row">

            <div class="col-lg-3 form-builder left_col menu_fixed animated fadeInLeft"
                 style="display: none;position: absolute;z-index: 9999;width: 100px;top: 42px;">
                <div class="left_col scroll-view">
                    <div class="navbar nav_title" style="border: 0;">
                        <a href="{{ route('home') }}" class="site_title"><img class="center"
                                                                              src="{{ asset('images\logo.png') }}"
                                                                              style="height: 100%;margin-left: 17px;"></a>
                    </div>

                    <div class="clearfix"></div>

                    <!-- menu profile quick info -->
                    <div class="profile clearfix">
                        <div class="profile_info">
                            <span>Welcome,</span>
                            <h2>{{ Auth::user()->firstname }} {{ Auth::user()->lastname }}</h2>
                        </div>
                    </div>
                    <!-- /menu profile quick info -->

                    <br/>

                    <!-- sidebar menu -->
                    <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
                        <div class="menu_section">
                            <h3>General</h3>
                            <ul class="nav side-menu">
                                <li><a><i class="fa fa-edit"></i>Users <span class="fa fa-chevron-down"></span></a>
                                    <ul class="nav child_menu">
                                        <li><a href="{{ route('users',['all']) }}">Users</a></li>
                                        <li><a href="{{ route('users',['add']) }}">Add User</a></li>
                                    </ul>
                                </li>

                                <li><a><i class="fa fa-home"></i>Category manager</a>
                                </li>
                                <li><a href="{{ route('category',['9']) }}"><i class="fa fa-home"></i>Form Builder</a>
                                </li>
                            </ul>
                        </div>

                        <div style="margin: 32px;">
                            <a href="#" onclick="$('.left_col').hide()"><i class="glyphicon glyphicon-remove"></i></a>
                        </div>

                    </div>
                    <!-- /sidebar menu -->
                </div>
            </div>

            <!-- top navigation -->
            <div class="top_nav">
                <div class="nav_menu">
                    <nav>
                        <ul class="nav navbar-nav navbar-left" style="background-color: #394e61;">
                            <li class="">
                                <a href="javascript:;" style="background-color: #394e61 !important;">
                                    <img src="{{asset('images/logo4.png')}}" style="height: 29px;margin: 0 0 0 3px;">
                                </a>
                            </li>
                            <li class="">
                                <a href="javascript:;" onclick="$('.left_col').show()">
                                    <span style="font-weight: 600;font-size: 17px;    margin-right: 6px;">Form Builder</span>
                                    <i class=" fa fa-angle-down"></i>
                                </a>
                            </li>
                        </ul>
                        <div style="display: inline-block;width: 70%;">
                            <h3 id="saved-hint" style="color: green;text-align: center;
    margin: 0;
    font-size: 10px;
    padding: 16px 0;">Changes has been saved</h3>
                        </div>
                        <ul class="nav navbar-nav navbar-right">
                            <li style="width: 200px;text-align: center;">
                                <a href="#" class="user-profile dropdown-toggle" data-toggle="dropdown"
                                   aria-expanded="false" onmouseover="$(this).next('ul').show()">
                                    {{ Auth::user()->firstname }} {{ Auth::user()->lastname }}
                                    <i class=" fa fa-angle-down"></i>
                                </a>
                                <ul class="dropdown-menu dropdown-usermenu pull-right animated fadeInRight"
                                    onmouseout="$(this).hide()">
                                    <li style="width: 199px;text-align: center;"><a href="{{ route('logout') }}"
                                                                                    onclick="event.preventDefault(); document.getElementById('logout-form').submit();"><i
                                                    class="fa fa-sign-out pull-right"></i> Log Out</a></li>
                                    <form id="logout-form" action="{{ route('logout') }}" method="POST"
                                          style="display: none;">{{ csrf_field() }}</form>

                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <!-- /top navigation -->

            <div id="app">
                <div id="links" style="display: none;">
                    <code id="openForm" content="{{ route('builder',[""]) }}"></code>
                    <code id="getWordsList" content="{{ route('getWordsList',[""]) }}"></code>
                    <code id="specificWord" content="{{ route('specificWords',["",""]) }}"></code>
                    <code id="addWordGroup" content="{{ route('addWordGroup') }}"></code>
                    <code id="getFieldsList" content="{{ route('getFieldsList') }}"></code>
                    <code id="addFieldsList" content="{{ route('addFieldsList',[""]) }}"></code>
                </div>
                <div class="space"></div>
                {{--<div class="grad_ex" id="ex1"></div>--}}
                {{--<div class="grad_ex" id="ex2"></div>--}}
                {{--<div class="grad_ex" id="ex3"></div>--}}

                <div id="baisc">
                    <div class="col-lg-3 form-builder left-panel" id="left-panel">
                        @include('admin.builder.parts.buttons')
                        <div class="col-lg-7 form-builder" style="padding:0;">
                            <div class="panels col-lg-12 form-builder" id="left-panel" style="padding: 0;">
                                @include('admin.builder.parts.left.rows')
                                @include('admin.builder.parts.left.elements')
                                @include('admin.builder.parts.left.design')
                                @include('admin.builder.parts.left.conditions')
                                @include('admin.builder.parts.left.library')
                            </div>
                        </div>
                    </div>


                    @include('admin.builder.parts.formpage')

                    <div class="col-lg-2 form-builder right-panel" id="right-panel">

                        @include('admin.builder.parts.right')

                    </div>
                </div>
            </div>

        </div>
    </div>


    <form id="form-settings">
        <input type="hidden" name="form-name" value="form-name">
        <input type="hidden" name="activated" value="false">
    </form>

    <div id="copy_to_store" style="display: none">
    </div>

    <form id="html_cache" action="{{ route('cache') }}">
        <input type="hidden" name="html">
        @if($get_build->cache == "1")
            <input type="hidden" name="target_id" value="{{$get_build->target_id}}">
        @else
            <input type="hidden" name="target_id">

        @endif
        <input type="hidden" name="form_name" value="{{ $get_build->form_name }}">
        <input type="hidden" name="popup_html">
        <input type="hidden" name="related_forms" value="{{ $get_build->related_forms }}">
        <input type="hidden" name="style">
        <input type="hidden" name="properties">
        <input type="hidden" name="settings">
        <input type="hidden" name="languages">
        <input type="hidden" name="main_language" value="{{ $get_build->main_language }}">
        <input type="hidden" name="scripts" value=" ">
    </form>

    <form id="html_save" action="{{ route('saveform') }}">
        @if($get_build->cache == "0")
            <input type="hidden" name="current_form_id" value="{{$get_build->id}}">
        @else
            <input type="hidden" name="current_form_id" value="{{$get_build->target_id}}">

        @endif
        <input type="hidden" name="key">
        <input type="hidden" name="form_name" value="{{ $get_build->form_name }}">
        <input type="hidden" name="form_icon" value="{{ $get_build->form_icon }}">
        <input type="hidden" name="category" value="{{ $get_build->cat_id }}">
        <input type="hidden" name="html">
        <input type="hidden" name="replace" value="false">
        <input type="hidden" name="related_forms" value="{{ $get_build->related_forms }}">
        <input type="hidden" name="popup_html">
        <input type="hidden" name="style">
        <input type="hidden" name="properties">
        <input type="hidden" name="settings">
        <input type="hidden" name="languages">
        <input type="hidden" name="main_language" value="{{ $get_build->main_language }}">
        <input type="hidden" name="scripts" value=" ">
    </form>

    <form id="html_preview" method="post" action="{{ route('preview_iframe') }}">

        <input type="hidden" name="form_name" value="{{ $get_build->form_name }}">
        <input type="hidden" name="category" value="{{ $get_build->cat_id }}">
        <input type="hidden" name="html">
        <input type="hidden" name="related_forms" value="{{ $get_build->related_forms }}">
        <input type="hidden" name="popup_html">
        <input type="hidden" name="style">
        <input type="hidden" name="properties">
        <input type="hidden" name="settings">
        <input type="hidden" name="languages">
        <input type="hidden" name="main_language" value="{{ $get_build->main_language }}">

        <input type="hidden" name="scripts" value=" ">
    </form>

    <!-- Small modal -->
    <div class="modal fade popup-msg" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-body">

                </div>
            </div>
        </div>
    </div>
    <!-- /modals -->

    <!-- Small modal -->
    <div class="modal fade dropdown-options" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header" style="padding: 15px 11px;">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title" id="myModalLabel2">
                        Manage Option
                        <small style="font-size: 14px;background-color: #436682;color: white;padding: 4px 11px;cursor: pointer">
                            Add
                        </small>
                    </h4>
                </div>
                <div class="modal-body">
                    <div class="languages-table">
                        <ul class="languages-labels">
                            <li>German</li>
                            <li>Afrikaans</li>
                            <li>Albanian</li>
                            <li>عربي</li>
                            <li>Armenian</li>
                        </ul>
                        <ul id="sortable" class="options-table">
                            <li class="ui-state-default">
                                <div class="languages-inputs-list">
                                    <ul class="languages-inputs">
                                        <li>
                                            <input type="text" lang="german" placeholder="DE">
                                        </li>
                                        <li>
                                            <input type="text" lang="afrikaans" placeholder="AF">
                                        </li>
                                        <li>
                                            <input type="text" lang="albanian" placeholder="SQ">
                                        </li>
                                        <li>
                                            <input type="text" lang="عربي" placeholder="AR">
                                        </li>
                                        <li>
                                            <input type="text" lang="armenian" placeholder="HY">
                                        </li>
                                    </ul>
                                </div>
                                <ul class="if-tools-btns add-remove-btns">
                                    <li class="remove_one_statment icons"><i class="icons icons-minis"></i></li>
                                </ul>
                            </li>
                            <li class="ui-state-default">
                                <div class="languages-inputs-list">
                                    <ul class="languages-inputs">
                                        <li>
                                            <input type="text" lang="german" placeholder="DE">
                                        </li>
                                        <li>
                                            <input type="text" lang="afrikaans" placeholder="AF">
                                        </li>
                                        <li>
                                            <input type="text" lang="albanian" placeholder="SQ">
                                        </li>
                                        <li>
                                            <input type="text" lang="عربي" placeholder="AR">
                                        </li>
                                        <li>
                                            <input type="text" lang="armenian" placeholder="HY">
                                        </li>
                                    </ul>
                                </div>
                                <ul class="if-tools-btns add-remove-btns">
                                    <li class="remove_one_statment icons"><i class="icons icons-minis"></i></li>
                                </ul>
                            </li>
                            <li class="ui-state-default">
                                <div class="languages-inputs-list">
                                    <ul class="languages-inputs">
                                        <li>
                                            <input type="text" lang="german" placeholder="DE">
                                        </li>
                                        <li>
                                            <input type="text" lang="afrikaans" placeholder="AF">
                                        </li>
                                        <li>
                                            <input type="text" lang="albanian" placeholder="SQ">
                                        </li>
                                        <li>
                                            <input type="text" lang="عربي" placeholder="AR">
                                        </li>
                                        <li>
                                            <input type="text" lang="armenian" placeholder="HY">
                                        </li>
                                    </ul>
                                </div>
                                <ul class="if-tools-btns add-remove-btns">
                                    <li class="remove_one_statment icons"><i class="icons icons-minis"></i></li>
                                </ul>
                            </li>
                            <li class="ui-state-default">
                                <div class="languages-inputs-list">
                                    <ul class="languages-inputs">
                                        <li>
                                            <input type="text" lang="german" placeholder="DE">
                                        </li>
                                        <li>
                                            <input type="text" lang="afrikaans" placeholder="AF">
                                        </li>
                                        <li>
                                            <input type="text" lang="albanian" placeholder="SQ">
                                        </li>
                                        <li>
                                            <input type="text" lang="عربي" placeholder="AR">
                                        </li>
                                        <li>
                                            <input type="text" lang="armenian" placeholder="HY">
                                        </li>
                                    </ul>
                                </div>
                                <ul class="if-tools-btns add-remove-btns">
                                    <li class="remove_one_statment icons"><i class="icons icons-minis"></i></li>
                                </ul>
                            </li>
                            <li class="ui-state-default">
                                <div class="languages-inputs-list">
                                    <ul class="languages-inputs">
                                        <li>
                                            <input type="text" lang="german" placeholder="DE">
                                        </li>
                                        <li>
                                            <input type="text" lang="afrikaans" placeholder="AF">
                                        </li>
                                        <li>
                                            <input type="text" lang="albanian" placeholder="SQ">
                                        </li>
                                        <li>
                                            <input type="text" lang="عربي" placeholder="AR">
                                        </li>
                                        <li>
                                            <input type="text" lang="armenian" placeholder="HY">
                                        </li>
                                    </ul>
                                </div>
                                <ul class="if-tools-btns add-remove-btns">
                                    <li class="remove_one_statment icons"><i class="icons icons-minis"></i></li>
                                </ul>
                            </li>
                            <li class="ui-state-default">
                                <div class="languages-inputs-list">
                                    <ul class="languages-inputs">
                                        <li>
                                            <input type="text" lang="german" placeholder="DE">
                                        </li>
                                        <li>
                                            <input type="text" lang="afrikaans" placeholder="AF">
                                        </li>
                                        <li>
                                            <input type="text" lang="albanian" placeholder="SQ">
                                        </li>
                                        <li>
                                            <input type="text" lang="عربي" placeholder="AR">
                                        </li>
                                        <li>
                                            <input type="text" lang="armenian" placeholder="HY">
                                        </li>
                                    </ul>
                                </div>
                                <ul class="if-tools-btns add-remove-btns">
                                    <li class="remove_one_statment icons"><i class="icons icons-minis"></i></li>
                                </ul>
                            </li>
                            <li class="ui-state-default" style="position: sticky;">
                                <div class="languages-inputs-list">
                                    <ul class="languages-inputs">
                                        <li>
                                            <input type="text" lang="german" placeholder="DE">
                                        </li>
                                        <li>
                                            <input type="text" lang="afrikaans" placeholder="AF">
                                        </li>
                                        <li>
                                            <input type="text" lang="albanian" placeholder="SQ">
                                        </li>
                                        <li>
                                            <input type="text" lang="عربي" placeholder="AR">
                                        </li>
                                        <li>
                                            <input type="text" lang="armenian" placeholder="HY">
                                        </li>
                                    </ul>
                                </div>
                                <ul class="if-tools-btns add-remove-btns">
                                    <li class="remove_one_statment icons"><i class="icons icons-minis"></i></li>
                                </ul>
                            </li>
                            <li class="ui-state-default">
                                <div class="languages-inputs-list">
                                    <ul class="languages-inputs">
                                        <li>
                                            <input type="text" lang="german" placeholder="DE">
                                        </li>
                                        <li>
                                            <input type="text" lang="afrikaans" placeholder="AF">
                                        </li>
                                        <li>
                                            <input type="text" lang="albanian" placeholder="SQ">
                                        </li>
                                        <li>
                                            <input type="text" lang="عربي" placeholder="AR">
                                        </li>
                                        <li>
                                            <input type="text" lang="armenian" placeholder="HY">
                                        </li>
                                    </ul>
                                </div>
                                <ul class="if-tools-btns add-remove-btns">
                                    <li class="remove_one_statment icons"><i class="icons icons-minis"></i></li>
                                </ul>
                            </li>
                            <li class="ui-state-default">
                                <div class="languages-inputs-list">
                                    <ul class="languages-inputs">
                                        <li>
                                            <input type="text" lang="german" placeholder="DE">
                                        </li>
                                        <li>
                                            <input type="text" lang="afrikaans" placeholder="AF">
                                        </li>
                                        <li>
                                            <input type="text" lang="albanian" placeholder="SQ">
                                        </li>
                                        <li>
                                            <input type="text" lang="عربي" placeholder="AR">
                                        </li>
                                        <li>
                                            <input type="text" lang="armenian" placeholder="HY">
                                        </li>
                                    </ul>
                                </div>
                                <ul class="if-tools-btns add-remove-btns">
                                    <li class="remove_one_statment icons"><i class="icons icons-minis"></i></li>
                                </ul>
                            </li>
                            <li class="ui-state-default">
                                <div class="languages-inputs-list">
                                    <ul class="languages-inputs">
                                        <li>
                                            <input type="text" lang="german" placeholder="DE">
                                        </li>
                                        <li>
                                            <input type="text" lang="afrikaans" placeholder="AF">
                                        </li>
                                        <li>
                                            <input type="text" lang="albanian" placeholder="SQ">
                                        </li>
                                        <li>
                                            <input type="text" lang="عربي" placeholder="AR">
                                        </li>
                                        <li>
                                            <input type="text" lang="armenian" placeholder="HY">
                                        </li>
                                    </ul>
                                </div>
                                <ul class="if-tools-btns add-remove-btns">
                                    <li class="remove_one_statment icons"><i class="icons icons-minis"></i></li>
                                </ul>
                            </li>
                            <li class="ui-state-default">
                                <div class="languages-inputs-list">
                                    <ul class="languages-inputs">
                                        <li>
                                            <input type="text" lang="german" placeholder="DE">
                                        </li>
                                        <li>
                                            <input type="text" lang="afrikaans" placeholder="AF">
                                        </li>
                                        <li>
                                            <input type="text" lang="albanian" placeholder="SQ">
                                        </li>
                                        <li>
                                            <input type="text" lang="عربي" placeholder="AR">
                                        </li>
                                        <li>
                                            <input type="text" lang="armenian" placeholder="HY">
                                        </li>
                                    </ul>
                                </div>
                                <ul class="if-tools-btns add-remove-btns">
                                    <li class="remove_one_statment icons"><i class="icons icons-minis"></i></li>
                                </ul>
                            </li>
                            <li class="ui-state-default">
                                <div class="languages-inputs-list">
                                    <ul class="languages-inputs">
                                        <li>
                                            <input type="text" lang="german" placeholder="DE">
                                        </li>
                                        <li>
                                            <input type="text" lang="afrikaans" placeholder="AF">
                                        </li>
                                        <li>
                                            <input type="text" lang="albanian" placeholder="SQ">
                                        </li>
                                        <li>
                                            <input type="text" lang="عربي" placeholder="AR">
                                        </li>
                                        <li>
                                            <input type="text" lang="armenian" placeholder="HY">
                                        </li>
                                    </ul>
                                </div>
                                <ul class="if-tools-btns add-remove-btns">
                                    <li class="remove_one_statment icons"><i class="icons icons-minis"></i></li>
                                </ul>
                            </li>

                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="">Save</button>
                </div>

            </div>
        </div>
    </div>
    <!-- /modals -->

    <!-- Small modal -->
    <div class="modal fade save-element" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title" id="myModalLabel2">Save Element</h4>
                </div>
                <div class="modal-body">

                    <form id="addElements" method="post" action="{{ route('addElement') }}">
                        <input type="hidden" name="style" title="style">
                        <input type="hidden" name="screenshot" title="screenshot">
                        <input type="hidden" name="element_html" title="element_html">
                        <h5>Element Name</h5>
                        <input type="text" name="element_name" title="element_name" required>
                        <h5>Category</h5>
                        <select class="selection" title="elements_categories" id="elements_categories"
                                name="category_id">
                            @foreach($elements_categories as $cat)
                                <option rel="{{$cat->category_name}}"
                                        value="{{$cat->id}}">{{$cat->category_name}}</option>
                            @endforeach
                            <option rel="popup"
                                    value="0">PopUp
                            </option>


                        </select>

                    </form>
                    <h4>Manage Categories</h4>
                    <div class="manage_categories_tags_1">
                        <input type="text" id="manage_categories_tags_1" value="{{ implode(",",$cats_array) }}">
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" id="save-element-btn" class="btn btn-primary"
                            onclick="saveEement($('#addElements'))" data-dismiss="modal" aria-label="Close">Save
                    </button>
                </div>

            </div>
        </div>
    </div>
    <!-- /modals -->

    <!-- Small modal -->
    <div class="modal fade manage_categories" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title" id="myModalLabel2">Manage Categories</h4>
                </div>
                <div class="modal-body">
                    <div class="manage_categories_tags_2">
                        <input type="text" id="manage_categories_tags_2" value="{{ implode(",",$cats_array) }}">
                    </div>

                </div>
                <div class="modal-footer">
                </div>

            </div>
        </div>
    </div>
    <!-- /modals -->

    <!-- Small modal -->
    <div class="modal fade copy_get" id="copy_get" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" style="width: 50%">
            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title" id="myModalLabel2">GER/COPY</h4>
                </div>
                <div class="modal-body">
                    <div>

                        <!-- Nav tabs -->
                        <ul class="nav nav-tabs" role="tablist">
                            <li role="presentation" class="active"><a href="#get_data" aria-controls="get_data"
                                                                      role="tab" data-toggle="tab">GET</a></li>
                            <li role="presentation"><a href="#copy_value" aria-controls="copy_value" role="tab"
                                                       data-toggle="tab">COPY</a></li>
                        </ul>

                        <!-- Tab panes -->
                        <div class="tab-content">
                            <div role="tabpanel" class="tab-pane active" id="get_data">
                                <div class="group-item">
                                    <div class="inline-divs" id="form_categories">
                                        <label for="font_family" style="width: 100%">Choose Category</label>
                                        <div class="categories-list">
                                            <ul style="display: none">
                                                @foreach($categories as $category)
                                                    <li primary-id="{{ $category->id }}"
                                                        parent-category="{{ $category->parent_category_id }}">
                                                        <ul class="categories-tools">
                                                            <li class="checkbox-btn">
                                                                <input type="checkbox" value="{{ $category->id }}"
                                                                       data-html="{{ $category->properties }}"
                                                                       name="categories-checkbox[]"><span
                                                                        class="checkmark"></span>
                                                            </li>
                                                        </ul>
                                                        <span>
                                    {{ $category->category_name }}
                                </span>
                                                        <ul></ul>
                                                    </li>
                                                @endforeach
                                            </ul>
                                        </div>
                                    </div>{{-- Font Family--}}
                                    <div class="inline-divs" id="form_category_parts">
                                        <label for="font_family" style="width: 100%">Relevant Value</label>
                                        <div class="categories-list relevent-values">

                                        </div>
                                    </div>{{-- Font Family--}}
                                    <div class="inline-divs" id="form_category_values">
                                        <label for="font_family" style="width: 100%">Value</label>
                                        <div class="categories-list">

                                        </div>
                                    </div>{{-- Font Family--}}
                                    <div class="inline-divs" id="form_field_target">
                                        <label for="font_family" style="width: 100%">User Target Field</label>
                                        <div class="dropdown" style="width: 100%">
                                            <select>
                                                <optgroup label="Builder Fields">

                                                </optgroup>
                                                <optgroup label="PopUp Fields">

                                                </optgroup>
                                            </select>
                                        </div>

                                    </div>{{-- Font Family--}}

                                </div>

                                <input type="hidden" name="final-json">
                            </div>
                            <div role="tabpanel" class="tab-pane" id="copy_value">
                                <div id="copy_value" class="group-item">
                                    <div class="text-toolkit">
                                        <label for="select_fields" style="width:100%;">Copy Value to:</label>
                                        <select id="select_fields" multiple>
                                            <option value="none">Clear</option>
                                            <optgroup label="Builder Fields">
                                            </optgroup>
                                            <optgroup label="PopUp Fields">
                                            </optgroup>
                                        </select>

                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="save-json-state" data-dismiss="modal"
                            aria-label="Close">Save
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- /modals -->

    <!-- Small modal -->
    <div class="modal fade calculator" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title" id="myModalLabel2">Calculator</h4>
                </div>
                <div class="modal-body">
                    <form id="calculated-op" class="form-light">
                        <div readonly id="display1" class="form-control-lg text-right form-input-light"></div>
                        {{--<input readonly id="display1" type="text" class="form-control-lg text-right form-input-light">--}}
                        {{--<input readonly id="display2" type="text" class="form-control-lg text-right form-input-light">--}}
                    </form>

                    <div class="d-flex justify-content-between button-row">
                        <button id="left-parenthesis" type="button" class="operator-group operator-group-light">&#40;
                        </button>
                        <button id="right-parenthesis" type="button" class="operator-group operator-group-light">&#41;
                        </button>
                        <button id="clear" class="clear-light" type="button">&#67;</button>
                        <button id="backspace" class="backspace-light" type="button">&#9003;</button>

                    </div>

                    <div class="d-flex justify-content-between button-row">
                        <button id="seven" type="button" class="operand-group operand-group-light">&#55;</button>
                        <button id="eight" type="button" class="operand-group operand-group-light">&#56;</button>
                        <button id="nine" type="button" class="operand-group operand-group-light">&#57;</button>
                        <button id="multiply" type="button" class="operator-group operator-group-light">&#215;</button>
                    </div>

                    <div class="d-flex justify-content-between button-row">
                        <button id="four" type="button" class="operand-group operand-group-light">&#52;</button>
                        <button id="five" type="button" class="operand-group operand-group-light">&#53;</button>
                        <button id="six" type="button" class="operand-group operand-group-light">&#54;</button>
                        <button id="subtract" type="button" class="operator-group operator-group-light">&#8722;</button>
                    </div>

                    <div class="d-flex justify-content-between button-row">
                        <button id="one" type="button" class="operand-group operand-group-light">&#49;</button>
                        <button id="two" type="button" class="operand-group operand-group-light">&#50;</button>
                        <button id="three" type="button" class="operand-group operand-group-light">&#51;</button>
                        <button id="add" type="button" class="operator-group operator-group-light">&#43;</button>
                    </div>

                    <div class="d-flex justify-content-between button-row">
                        <button id="percentage" type="button" class="operand-group operand-group-light">&#37;</button>
                        <button id="zero" type="button" class="operand-group operand-group-light">&#48;</button>
                        <button id="decimal" type="button" class="operand-group operand-group-light">&#46;</button>
                        <button id="divide" type="button" class="operator-group operator-group-light">&#247;</button>
                    </div>

                    <div class="d-flex justify-content-between button-row">
                        <select id="calcolator-fields">
                            <option value="none" selected>Field Value</option>
                            <optgroup label="Builder Fields">

                            </optgroup>
                            <optgroup label="PopUp Fields">

                            </optgroup>
                        </select>
                        <button type="button" id="save-calculation-btn" class="equal-light" data-dismiss="modal"
                                aria-label="Close">Save
                        </button>
                        {{--<button type="button" id="save-calculation-btn" class="equal-light" data-dismiss="modal" aria-label="Close">Save</button>--}}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /modals -->

    <!-- Small modal -->
    <div class="modal fade categories" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title">Save As</h4>
                </div>
                <div class="modal-body">
                    <div class="categories-list save-form-to-db">
                        <div class="form-group" id="form-icon" style="width: 97%;">
                            <label for="form_icon">Form Icon</label>
                            <input type="file" name="form_icon"
                                   onchange="$(this).nextAll().hide();getBase64(document.querySelector('#'+this.id).files[0])"
                                   class="form-control"
                                   id="form_icon">
                            <small class="text-danger" style="display: none">Choose a form icon</small>
                        </div>
                        <div class="form-group" id="form-name" style="width: 97%;">
                            <label for="real-name">Choose Name</label>
                            <input type="text" name="form_name" oninput="$(this).nextAll().hide()" class="form-control"
                                   id="form_name">
                            <small class="text-danger" style="display: none">This Name is already exist</small>
                            <small class="text-danger" style="display: none">Choose a form name</small>
                        </div>
                        <label style="margin-top: 6px;">Choose Category</label>
                        <ul style="display: none; width: 97%;">
                            @foreach($categories as $category)
                                <li primary-id="{{ $category->id }}"
                                    parent-category="{{ $category->parent_category_id }}">
                                    <ul class="categories-tools">
                                        <li class="radio-btn" onclick="$('.save-form-to-db').next('small').hide()">
                                            <input type="radio" value="{{ $category->id }}"
                                                   name="categories-radio"><span
                                                    class="checkmark"
                                            ></span>
                                        </li>
                                    </ul>
                                    <span>
                                    {{ $category->category_name }}
                                </span>
                                    <ul class="list-inside"></ul>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                    <small class="text-danger" style="display: none">Choose Category</small>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="save-form-to-db" onclick="saveFormAs()">Save
                    </button>
                </div>

            </div>
        </div>
    </div>
    <!-- /modals -->

    <!-- Small modal -->
    <div class="modal fade open-form" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title" id="myModalLabel2">Choose Category</h4>
                </div>
                <div class="modal-body" style="padding: 0 15px 0px 15px;">
                    <div class="categories-list open-form-from-db">
                        <ul style="display: none">
                            @foreach($categories as $category)
                                <li primary-id="{{ $category->id }}"
                                    parent-category="{{ $category->parent_category_id }}">
                                    <span><i class="glyphicon icons-open-close"></i></span>


                                    <span data-html="{{ route('getCats',[$category->id]) }}">
                                            {{ $category->category_name }}
                                        </span>
                                    <ul class="list-inside"></ul>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                    <div class="categories-list open-form-from-db forms-panel">
                        <ul>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="save-forms-linking" data-dismiss="modal"
                            aria-label="Close">Save
                    </button>
                </div>

            </div>
        </div>
    </div>
    <!-- /modals -->

    <!-- footer content -->
    <footer style="width: 100%;z-index: 9999;margin: 0;bottom: 0;position: fixed;">
        <div class="pull-left">
            Developed By <a href="#">Aio</a>
        </div>
        <div class="clearfix"></div>
    </footer>
    <!-- /footer content -->
</div>


<!-- jQuery -->
{{--<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>--}}
{{--<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>--}}
{{--<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>--}}
<script src="{{ asset("js/plugins/jquery/dist/jquery.min.js")}}"></script>
<script src="{{ asset("js/plugins/jquery-ui/jquery-ui.min.js")}}"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js"></script>
<script src="{{ asset("js/plugins/bootstrap/dist/js/bootstrap.min.js")}}"></script>

<script>
    var $settings = {
        form_id: '{{ $get_build->id }}',
        main_language: '{{ $get_build->main_language }}',
        settings: function () {
            var $SON = {};
            @if($get_build->settings != null && $get_build->settings != "")
                $SON = JSON.parse('<?php echo $get_build->settings ?>');
            @endif


            if (!$SON.hasOwnProperty("mainLanguage")) {
                return {
                    mainLanguage: "",
                    mainSize: "",
                };
            } else {
                return $SON;
            }


        }(),
        additional_languages: "{{ rtrim(str_replace(",,",",",$get_build->languages),",") }}",
        form_name: '{{ $get_build->form_name }}',
        cache: '{{ $get_build->cache }}',
        scripts: '{{ $get_build->scripts }}',
        file_name: '{{ $get_build->html }}',
        relates_forms: '{{ $get_build->related_forms }}',
    };


    $(document).ready(function () {

        $("input[name='settings']").val(FromJson($settings.settings));

        var getConfirm = function () {
            var $loopOptions = function () {
                var e = "";
                $.each($languages_codes, function (key, value) {

                    if ($settings.main_language.toLowerCase() == key.toLowerCase()) {
                        e += '<option value="' + value + '" selected>' + key.capitalize() + '</option>';
                    } else {
                        e += '<option value="' + value + '">' + key.capitalize() + '</option>';

                    }
                });

                return e;
            };
            $.confirm({
                title: 'Welcome!',
                content: '' +
                    '<div class="form-group">' +
                    '<label style="width: 220px;">Select the main language of your form</label>' +
                    '<select class="main-language" style="width: 94px;height: 31px;margin-left: 8px;background-color: #e8edf1;border-radius: 3px;color: #435f75;">' +
                    '<option required selected disabled>Select Here</option>' +
                    $loopOptions() +
                    '</select>' +
                    '</div>' +
                    '<div class="form-group" style="margin-top: 10px">' +
                    '<label style="width: 220px;">Select Default Paper Size</label>' +
                    '<select class="main-size" style="width: 94px;height: 31px;margin-left: 8px;background-color: #e8edf1;border-radius: 3px;color: #435f75;">' +
                    '<option value="A0">A0 (84.1 x 118.9) cm</option>\n' +
                    '<option value="A1">A1 (59.4 x 84.1) cm </option>\n' +
                    '<option value="A2">A2 (42.0 x 59.4) cm </option>\n' +
                    '<option value="A3">A3 (29.7 x 42.0) cm </option>\n' +
                    '<option value="A4" selected>A4 (21.0 x 29.7) cm </option>\n' +
                    '<option value="A5">A5 (14.8 x 21.0) cm </option>\n' +
                    '<option value="A6">A6 (10.5 x 14.8) cm </option>\n' +
                    '<option value="A7">A7 (7.4 x 10.5) cm  </option>\n' +
                    '<option value="A8">A8 (5.2 x 7.4) cm   </option>\n' +
                    '<option value="A9">A9 (3.7 x 5.2) cm   </option>\n' +
                    '<option value="A10">A10 (2.6 x 3.7) cm </option>\n' +
                    '</select>' +
                    '</div>',
                buttons: {
                    formSubmit: {
                        text: 'Submit',
                        btnClass: 'btn-blue',
                        action: function () {
                            var main_language = this.$content.find('.main-language :selected').text();
                            var main_size = this.$content.find('.main-size :selected').val();
                            var $msg = "";

                            if (main_language !== "Select Here" && main_size !== "") {
                                $msg = 'The default language of your form is ' + main_language + '' +
                                    ' and the default size is ' + main_size +
                                    '<br>' +
                                    'You can choose multi language from the form builder and translate all its strings from the translator';

                            } else {
                                $msg = 'Please! Select your default language and default size from the lists above';
                            }

                            $settings.main_language = main_language;
                            $settings.settings = {
                                mainLanguage: main_language,
                                mainSize: main_size,
                            };
                            $.alert($msg);

                            if ($msg.substr(0, 1) === "P") {
                                return;
                            }
                            $("input[name='settings']").val(FromJson($settings.settings));
                            onLoad();
                            saveCache();

                        }
                    },
                    cancel: function () {
                        $.alert("You can't build a form without set a German language has been set as a main language you can change it from advance controller tab", "Pay an attention Please!");
                    },

                }
            });


        };

        if (
            ($.trim($("#builder-mode .builder-paper").html()) == ""
                && $.trim($("#popups-page").html()) == "")
            || $settings.settings.mainLanguage === "" || $settings.settings.mainSize === "") {
            $settings.settings = {
                mainLanguage: "",
                mainSize: "",
            };

            getConfirm();
        }

        $("#left-panel").find("a").on("click", function (event) {
            event.preventDefault();
        });


    })

</script>
{{--<script src="{{ asset("vendors/jquery-ui/jquery-sortable.js") }}"></script>--}}

<script src="{{ asset("js/plugins/color-picker/plugin/jquery.gradientPicker.js")}}"></script>


<!-- signture -->
<script src="{{ asset("js/plugins/signature_pad/js/signature_pad.umd.js")}}"></script>
<script src="{{ asset("js/plugins/signature_pad/js/app.js")}}"></script>


<script src="{{ asset("js/aio/drag-and-drop.js") }}"></script>
<script src="{{ asset("js/aio/jquery.widgets.js") }}"></script>
<script src="{{ asset("js/aio/form-settings.js") }}"></script>
<script src="{{ asset("js/aio/edit-design.js") }}"></script>
<script src="{{ asset("js/aio/jquery.library.js") }}"></script>
<script src="{{ asset("js/aio/advance-controller.js") }}"></script>
<script src="{{ asset("js/aio/scripts.js") }}"></script>


<!-- JavaScript -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/3.17.0/math.min.js"></script>

<script src="{{ asset("js/aio/calculator.js") }}"></script>

<script src="{{ asset("js/plugins/jquery.ui.touch-punch.min.js") }}"></script>


<script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js"></script>
<script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/additional-methods.min.js"></script>

<script src="{{ asset("js/plugins/icheck/demo/js/custom.min.js?v=1.0.2")}}"></script>
<!-- Colorpicker -->
<script src="{{ asset("js/plugins/color-picker/vendor/jqPlugins/colorpicker/js/colorpicker.js") }}"></script>


<!-- bootstrap-daterangepicker -->
<script src="{{ asset("vendors/moment/min/moment.min.js") }}"></script>
<!-- jQuery Tags Input -->
<script src="{{ asset("js/plugins/jquery-tagsinput/src/jquery.tagsinput-revisited.js") }}"></script>

<script>
    var $parse = '{{ $get_build->languages }}';
</script>
<!-- PNotify -->
<script src="{{ asset("js/plugins/autosize-master/dist/autosize.js") }}"></script>

<script src="{{ asset("js/aio/ng/angular.min.js") }}"></script>
<script src="{{ asset("js/aio/ng/conditions.js") }}"></script>


<?php
if ( $get_build->scripts != "[]" && $get_build->scripts != "" ) {
	echo '<script> _conditions = ' . $get_build->scripts . ' </script>';
}
?>

</body>
</html>



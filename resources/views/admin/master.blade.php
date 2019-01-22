<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}"/>


    <title>{{ config('app.name') }}</title>

    <!-- Bootstrap -->
    <link href="{{ asset("js/plugins/bootstrap/dist/css/bootstrap.min.css") }}" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="{{ asset("vendors/font-awesome/css/font-awesome.min.css") }}" rel="stylesheet">

    <!-- Animation -->
    <link href="{{ asset("vendors/animate.css/animate.css") }}" rel="stylesheet">
    <!-- Custom Theme Style -->
    <link href="{{ asset("build/css/custom.min.css") }}" rel="stylesheet">

@section("head")
    <!-- NProgress -->
        <link href="{{ asset("vendors/nprogress/nprogress.css") }}" rel="stylesheet">
        <!-- jQuery custom content scroller -->
        <link href="{{ asset("vendors/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css") }}"
              rel="stylesheet"/>
        <!-- Bootstrap Colorpicker -->
        <link rel="stylesheet"
              href="{{ asset("js/plugins/mjolnic-bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css") }}"
              type="text/css"/>

        <!-- Ion.RangeSlider -->
        <link href="{{ asset("vendors/normalize-css/normalize.css") }}" rel="stylesheet">
        <link href="{{ asset("vendors/ion.rangeSlider/css/ion.rangeSlider.css") }}" rel="stylesheet">
        <link href="{{ asset("vendors/ion.rangeSlider/css/ion.rangeSlider.skinFlat.css") }}" rel="stylesheet">

        <!-- jQuery custom content scroller -->
        <link href="{{ asset("vendors/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css") }}"
              rel="stylesheet"/>

        <!-- PNotify -->
        <link href="{{ asset("js/plugins/pnotify/dist/pnotify.css") }}" rel="stylesheet">



        <script>
            var delete_link = '{{ route('delete_category',['']) }}';
            var getCatsLink = '{{ route('getCategories',['','','']) }}';
            var getFormsLink = '{{ route('getFormList',['','']) }}';
                    @if($_SERVER['HTTP_HOST'] == "antragsofort.de")
            var FormPath = '{{ asset('application/uploads/forms') }}';
                    @else
            var FormPath = '{{ asset('uploads/forms') }}';
            @endif

        </script>

    @stop

    @yield('head')
    <link href="{{ asset("css/admin/admin-style.css") }}" rel="stylesheet">

</head>


@if (Auth::check())
    <body class="nav-sm">
    <div class="container body">
        <div class="main_container">

            <div class="col-md-3 left_col menu_fixed">
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
                                <li><a><i class="admin-icons icons-users"></i><br>Users <span class="fa fa-chevron-down"></span></a>
                                    <ul class="nav child_menu">
                                        <li><a href="{{ route('users',['all']) }}">Users</a></li>
                                        <li><a href="{{ route('users',['add']) }}">Add User</a></li>
                                    </ul>
                                </li>

                                <li><a href="{{ route('category') }}"><i class="admin-icons icons-manage-categories"></i><br>Category Manager</a>

                                </li>
                                @if( Auth::user()->role != "1")
                                    <li><a href="{{ route('builder') }}"><i class="admin-icons icons-form-b"></i><br>Form Builder</a></li>
                                    <li><a href="{{ route('translator') }}"><i class="admin-icons icons-translator"></i><br>Translator</a></li>
                                @endif
                            </ul>
                        </div>

                    </div>
                    <!-- /sidebar menu -->
                </div>
            </div>

            <!-- top navigation -->
            <div class="top_nav">
                <div class="nav_menu">
                    <nav>
                        <div class="nav toggle">
                            <a id="menu_toggle" style="color:#f9971a;"><i class="fa fa-bars"></i></a>
                        </div>

                        <ul class="nav navbar-nav navbar-right">
                            <li class="">
                                <a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown"
                                   aria-expanded="false">
                                    {{ Auth::user()->firstname }} {{ Auth::user()->lastname }}
                                    <span class=" fa fa-angle-down"></span>
                                </a>
                                <ul class="dropdown-menu dropdown-usermenu pull-right">
                                    <li><a href="{{ route('logout') }}"
                                           onclick="event.preventDefault(); document.getElementById('logout-form').submit();"><i
                                                    class="fa fa-sign-out pull-right"></i> Log Out</a></li>
                                    <form id="logout-form" action="{{ route('logout') }}" method="POST"
                                          style="display: none;">{{ csrf_field() }}</form>


                                </ul>
                            </li>

                            {{--
                                                        <li role="presentation" class="dropdown">
                                                            <a href="javascript:;" class="dropdown-toggle info-number" data-toggle="dropdown"
                                                               aria-expanded="false">
                                                                <i class="fa fa-envelope-o"></i>
                                                                <span class="badge bg-green">6</span>
                                                            </a>
                                                            <ul id="menu1" class="dropdown-menu list-unstyled msg_list" role="menu">
                                                                <li>
                                                                    <a>
                                                                        <span class="image"><img src="images/img.jpg" alt="Profile Image"/></span>
                                                                        <span>
                                                      <span>John Smith</span>
                                                      <span class="time">3 mins ago</span>
                                                    </span>
                                                                        <span class="message">
                                                      Film festivals used to be do-or-die moments for movie makers. They were where...
                                                    </span>
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a>
                                                                        <span class="image"><img src="images/img.jpg" alt="Profile Image"/></span>
                                                                        <span>
                                                      <span>John Smith</span>
                                                      <span class="time">3 mins ago</span>
                                                    </span>
                                                                        <span class="message">
                                                      Film festivals used to be do-or-die moments for movie makers. They were where...
                                                    </span>
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a>
                                                                        <span class="image"><img src="images/img.jpg" alt="Profile Image"/></span>
                                                                        <span>
                                                      <span>John Smith</span>
                                                      <span class="time">3 mins ago</span>
                                                    </span>
                                                                        <span class="message">
                                                      Film festivals used to be do-or-die moments for movie makers. They were where...
                                                    </span>
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a>
                                                                        <span class="image"><img src="images/img.jpg" alt="Profile Image"/></span>
                                                                        <span>
                                                      <span>John Smith</span>
                                                      <span class="time">3 mins ago</span>
                                                    </span>
                                                                        <span class="message">
                                                      Film festivals used to be do-or-die moments for movie makers. They were where...
                                                    </span>
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <div class="text-center">
                                                                        <a>
                                                                            <strong>See All Alerts</strong>
                                                                            <i class="fa fa-angle-right"></i>
                                                                        </a>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </li>
                            --}}
                        </ul>
                    </nav>
                </div>
            </div>
            <!-- /top navigation -->

            @yield('content')

        </div>
        <!-- footer content -->
        <footer>
            <div class="pull-right">
                Developed By <a href="#">Aio</a>
            </div>
            <div class="clearfix"></div>
        </footer>
        <!-- /footer content -->
    </div>

    @else
        @yield('content')
    @endif

    @section("jquery")
        <!-- jQuery -->
        <script src="{{ asset("js/plugins/jquery/dist/jquery.min.js") }}"></script>

    @stop
    @yield('jquery')
    <!-- Bootstrap -->
    <script src="{{ asset("js/plugins/bootstrap/dist/js/bootstrap.min.js") }}"></script>
    <!-- FastClick -->
    <script src="{{ asset("vendors/fastclick/lib/fastclick.js") }}"></script>
    <!-- Custom Theme Scripts -->
    <script src="{{ asset("build/js/custom.min.js") }}"></script>

    <script src="{{ asset("js/aio/jquery.widgets.js") }}"></script>

    <!-- jQuery Tags Input -->
    <script src="{{ asset("js/plugins/jquery-tagsinput/src/jquery.tagsinput-revisited.js") }}"></script>

    <script src="{{ asset("js/admin-functions.js") }}"></script>

    @section("script")
        <!-- NProgress -->
        <script src="{{ asset("vendors/nprogress/nprogress.js") }}"></script>
        <!-- jQuery custom content scroller -->
        <script src="{{ asset("vendors/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js") }}"></script>
        <!-- PNotify -->
        <script src="{{ asset("vendors/pnotify/dist/pnotify.js") }}"></script>
        <!-- jQuery Knob -->
        <script src="{{ asset("vendors/jquery-knob/dist/jquery.knob.min.js") }}"></script>
        <!-- Bootstrap Colorpicker -->
        <script src="{{ asset("js/plugins/mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js") }}"></script>
    @stop

    @yield('script')


    </body>
</html>
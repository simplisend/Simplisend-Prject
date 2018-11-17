@extends('admin.master')
@section('content')

    {{--
            <div class="panel-body">
                @if (session('status'))
                    <div class="alert alert-success">
                        {{ session('status') }}
                    </div>
                @endif

                You are logged in!
            </div>

    --}}
    <body class="login">
    <div>
        <a class="hiddenanchor" id="signup"></a>
        <a class="hiddenanchor" id="signin"></a>

        <div class="login_wrapper">
            <div id="register">
                <section class="login_content">
                    <form method="POST" action="{{ route('register') }}">
                        {{ csrf_field() }}
                        <h1>Create Account</h1>

                            <div>
                                <input id="name" type="text" class="form-control" name="firstname" placeholder="First Name" value="{{ old('firstname') }}" required autofocus>

                                @if ($errors->has('firstname'))
                                    <div class="alert alert-danger alert-dismissible fade in" role="alert">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <span>{{ $errors->first('firstname') }}</span>
                                    </div>
                                @endif
                            </div>
                            <div>
                                <input id="name" type="text" class="form-control" name="lastname" placeholder="Last Name" value="{{ old('lastname') }}" required autofocus>

                                @if ($errors->has('lastname'))
                                    <div class="alert alert-danger alert-dismissible fade in" role="alert">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <span>{{ $errors->first('lastname') }}</span>
                                    </div>
                                @endif
                            </div>
                            <div>
                                <input id="name" type="text" class="form-control" name="username" placeholder="Username" value="{{ old('username') }}" required autofocus>

                                @if ($errors->has('username'))
                                    <div class="alert alert-danger alert-dismissible fade in" role="alert">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <span>{{ $errors->first('username') }}</span>
                                    </div>
                                @endif
                            </div>
                            <div>
                                <input id="email" type="email" class="form-control" name="email" placeholder="Email" value="{{ old('email') }}" required>

                                @if ($errors->has('email'))
                                    <div class="alert alert-danger alert-dismissible fade in" role="alert">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <span>{{ $errors->first('email') }}</span>
                                    </div>
                                @endif
                            </div>
                            <div>
                                <input id="password" type="password" class="form-control" name="password" placeholder="Password" required>

                            </div>
                            <div>
                                <input id="password-confirm" type="password" class="form-control" name="password_confirmation" placeholder="Password Confirm" required>
                                @if ($errors->has('password'))
                                    <div class="alert alert-danger alert-dismissible fade in" role="alert">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                        </button>
                                        <span>{{ $errors->first('password') }}</span>
                                    </div>
                                @endif

                            </div>

                        <div class="form-group">
                            <div class="col-md-12">
                                <button type="submit" class="btn btn-primary" style="float: right">
                                    Register
                                </button>
                            </div>
                        </div>


                        <div class="separator">
                            <p class="change_link">Already a member ?
                                <a href="#signin" class="to_register"> Log in </a>
                            </p>

                            <div class="clearfix"></div>
                            <br />

                            <div>
                                <img src="{{ asset('images\logo.png') }}">
                                <p>Developed By Aio</p>
                            </div>
                        </div>

                    </form>
                </section>
            </div>
        </div>
    </div>
    </body>

@endsection


@extends('admin.master')
@section('content')
    <body class="login" style="color: #ffffff;">
    <div>
        <a class="hiddenanchor" id="signup"></a>
        <a class="hiddenanchor" id="signin"></a>

        <div class="login_wrapper">
            <div class="animate form login_form">
                <section class="login_content">
                    <form action="{{ route('login') }}" method="post">
                        {{ csrf_field() }}

                        <h1>Login Form</h1>
                        <div>
                            <input type="text" class="form-control" name="username" placeholder="Username" value="{{ old('username') }}" required="" />
                        </div>
                        @if ($errors->has('username'))
                            <div class="alert alert-danger alert-dismissible fade in" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>{{ $errors->first('username') }}</strong>
                            </div>
                        @endif

                        <div>
                            <input type="password" name="password" class="form-control" placeholder="Password" required="" />
                        </div>
                        @if ($errors->has('password'))
                            <div class="alert alert-danger alert-dismissible fade in" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <strong>{{ $errors->first('password') }}</strong>
                            </div>
                        @endif
                        <label class="remember" for="remember"><input type="checkbox"
                                                                      id="remember" {{ old('remember') ? 'checked' : '' }}/>Remember
                            me</label>


                        <div>
                            <button type="submit" class="btn btn-primary">Login</button>
                            <a class="reset_pass" href="#">Lost your password?</a>
                        </div>

                        <div class="clearfix"></div>

                        <div class="separator">
                            <p class="change_link">New to site?
                                <a href="{{ route('register') }}" class="to_register"> Create Account </a>
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

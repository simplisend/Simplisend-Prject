@extends('admin.master')


@section('head')
    <link href="{{ asset("css/admin/translation.css") }}" rel="stylesheet">

@endsection



@section('content')
    <div class="right_col" role="main">
        <div class="">
            <div class="page-title">
                <div class="title_left" style="margin-bottom: 10px;">
                    <h3>Language Tools</h3>
                    <div class="word-filter">
                        <select id="first-filter">
                            <option>All</option>
                            <option>Translated Words</option>
                            <option>Untranslated Words</option>
                        </select>
                        <select id="second-filter">
                            <option value="builder">Builder</option>
                            <option value="web">Website</option>
                        </select>
                    </div>
                    <ul class="btns-list">
                        <li id="first-switcher">
                            <div class="onoffswitch">
                                <input type="checkbox" name="border_all" value="0"
                                       onchange="if(this.value === '0'){ $(this).val('1'); }else{ $(this).val('0') }"
                                       class="onoffswitch-checkbox" id="border-all">
                                <label class="onoffswitch-label" for="border-all">
                                    <span class="onoffswitch-inner"></span>
                                    <span class="onoffswitch-switch"></span>
                                </label>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>
            <div class="clearfix"></div>
            <div class="row">
                <div class="col-sm-12 col-xs-12 col-lg-12">
                    <div class="col-sm-6 col-xs-6">
                        <div class="language-switcher">
                            <h3>From</h3>
                            <select id="from-dropdown" data-html="{{ route('translator_update',["","",""]) }}">
                                @foreach($codes as $key => $value)
                                    <option title="{{$key}}" value="{{strtolower($value)}}">{{ ucfirst($value) }} {{ $numbers[strtolower($value)] }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="words-list" id="from-list">
                            <ul>
                                @foreach($translations as $translation)
                                    <li title="{{ $translation->type }}" primary-id="translate-{{ $translation->id }}" data-html="{{ json_encode($translation) }}"><span>{{ $translation->english }}</span></li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xs-6">
                        <div class="language-switcher">
                            <h3>To</h3>
                            <select id="to-dropdown" data-html="{{ route('translator_update',["","",""]) }}">
                                @foreach($codes as $key => $value)
                                    <option title="{{$key}}" value="{{strtolower($value)}}">{{ ucfirst($value) }} {{ $numbers[strtolower($value)] }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="words-list" id="to-list" data-html="{{ route('translator_update',["","",""]) }}">
                            <ul>
                                @foreach($translations as $translation)
                                    <li title="{{ $translation->type }}" primary-id="translate-{{ $translation->id }}" data-html="{{ json_encode($translation) }}"><span>{{ $translation->english }}</span></li>
                                @endforeach
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>


@endsection
@section('script')

    <script src="{{ asset("js/translator.functions.js") }}"></script>
    <script src="{{ asset("js/plugins/autosize-master/dist/autosize.js") }}"></script>


@endsection

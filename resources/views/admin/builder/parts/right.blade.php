<div id="advance_setting" class="tools_panel animated form-builder col-lg-12">
    {{--<h3>Rows</h3>--}}
    <div class="panel-title">
        Advance Control
    </div>

    <div class="panel-item row-item form-layers" style="margin-top: 9px; display: none">
        <div class="item-title">
            <h3 id="form-name-selected">
                Form1
            </h3>
            <div class="item-tools">
                <select class="selection" title="selected-languages-a">
                    <option title="de" value="german">German</option>
                </select>
            </div>
        </div>
        <div class="tools-group">


            <div id="choose-languages" class="group-item">
                <script>
                    var $languages_codes = {};
                </script>
                @foreach ($codes as $key=>$value)
                <script>

                        $languages_codes['{{strtolower($value)}}'] = '{{ strtolower($key) }}';

                </script>
                @endforeach
                <script>
                    var shortcodes = [<?php echo '"' . implode( '","', $codes ) . '"' ?>];
                    var fullnames = [<?php echo '"' . implode( '","', array_keys( $codes ) ) . '"' ?>];
                </script>

                <label for="font_family" style="">Languages</label>

                <div class="if-tools-btns" style="">
                    <div id="add-language-function" class="add_one_statment icons">
                        <i class="glyphicon glyphicon-plus"></i>
                    </div>
                </div>
                <select class="selection" title="list-languages">
                    @foreach($codes as $key => $value)
                        <option title="{{$key}}" value="{{$value}}">{{ strtoupper($key) }}</option>
                    @endforeach
                </select>

                <div class="display-languages-inputtags">
                    <input id="options-lang" type="text" class="tags form-control" value=""/>
                    {{--<input id="options-lang" type="text" class="tags form-control" value="German (DE),عربي (AR),Abkhazian (AB),Afrikaans (AF),Armenian (HY),Croatian (HR),Greek (EL)"/>--}}
                    <input type="text" class="original" disabled="disabled"/>
                </div>

            </div>

        </div>
    </div>

    <div class="panel-item row-item elements-layers" style="margin-top: 9px;">
        <div class="item-title">
            <h3 id="element-name">
                Item Name
            </h3>

            <div class="item-tools selected-languages-b" style="display: none">
                <select class="selection" title="selected-languages-b" style="display: none">
                    <option title="de" value="german" selected>German</option>
                </select>
            </div>
        </div>
        <div class="tools-group">
            <div id="element-text-contain" class="group-item element-contains" style="display: none;">
                <label for="element-text-contain" style="">Text</label>
                <div class="display-languages">
                    <textarea title="element-text-contain" placeholder="Text Here"></textarea>
                </div>
            </div>
            <div id="sub-text-contain" class="group-item element-contains" style="display: none;">
                <label for="sub-text-contain" style="">Sub Text</label>
                <div class="display-languages">
                    <textarea title="sub-text-contain"
                              placeholder="Add a small description below the input field"></textarea>
                </div>
            </div>
            <div id="placeholder-contain" class="group-item element-contains" style="display: none;">
                <label for="placeholder-contain" style="">Placeholder</label>
                <div class="display-languages">
                    <textarea title="placeholder-contain" placeholder="Text Here"></textarea>
                </div>
            </div>
            <div id="element-options" class="group-item element-contains" style="display: none;">
                <label for="element_options" style="width:100%;margin-bottom: 6px;">Add Options</label>
                <div style="width: 177px;" class="options-input-tags">
                    <input type="text" class="tags form-control" value=""/>
                </div>
            </div> {{-- Input Type--}}
            <div id="element-options-languages" class="group-item element-contains" style="display: none;">
                <button data-toggle="modal" data-target=".dropdown-options" type="button">Manage Options Languages
                </button>
            </div> {{-- Input Type--}}

        </div>
    </div>


    <div class="panel-title"
         style="background: #436682;margin-bottom: 9px;margin-top:  10px;border-bottom-right-radius: 0;border-bottom-left-radius: 0;">
        Navigation
    </div>

    <div id="navigation">

        <div class="list">
            <div title="elements-layers" class="list-item active-tab" style="float: left;">
                Element
            </div>
            <div title="form-layers" class="list-item" style="float: right;">
                Forms
            </div>
        </div>
    </div>
    <div class="tools-group" id="panel_contents"
         style="margin: 44px 9px 4px 9px;border-top: 11px solid white;height: 277px;overflow-y: auto;">


        <div id="form-layers" class="group-item layers" style="display: none;">
            <ul class="main-list" style="padding: 0;">
                <li>
                    <div class="subitem" style="padding-left: 5px;"
                         onclick="$('#form-name-selected').html($(this).find('span').html())"><a href="#"><i
                                    class="icons icons-page"></i></a>
                        <span onchange="$('#form-name-selected').html($(this).html())">Form Name</span>
                    </div>
                    <ul class="sub-list">

                    </ul>
                </li>
            </ul>

        </div>
        <div id="elements-layers" class="group-item layers">
            <ul class="row-list" style="padding: 0;">


            </ul>

        </div>

    </div>
    <div class="bottom-links" id="nav-links">
        <ul>
            <li><a href="#"><i class="icons icons-copy"></i></a></li>
            <li><a href="#"><i class="icons icons-delete"></i></a></li>
            <li id="link-form" data-toggle="modal" data-target=".open-form"><a href="#"><i class="icons icons-link"></i></a>
            </li>

        </ul>
    </div>

</div>

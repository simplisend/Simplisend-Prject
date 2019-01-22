<div id="design_setting" class="tools_panel animated form-builder col-lg-12" style="display: none">
    {{--<h3>Rows</h3>--}}
    <div id="empty-msg">Select any item to edit</div>
    <div class="panel-title">
        Edit Panel
    </div>
    <div class="panel-item row-item" id="accordion_columns_setting"
         style="margin-top: 9px;margin-bottom: 9px;overflow-x: hidden;">
        <input type="hidden" id="test-style">
        <div class="item-title" section="text_format">
            <h3>
                Text Format
            </h3>

            <div class="item-tools" data-target="text">
                <a href="#" process="copy"><i class="icons icons-copy"></i></a>
                <a href="#" process="paste"><i class="icons icons-paste"></i></a>
            </div>
        </div>
        <div class="tools-group" id="text_format" style="display: none;">
            <div id="form_font_family" class="group-item">
                <label for="font_family">Fonts</label>
                <select class="selection" onchange="$('input[name=\'font-family\']').val(this.value).change()"
                        title="font_family">
                    <option value='"Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif'>Arial</option>
                    <option value="'Roboto', sans-serif">Roboto</option>
                    <option value="'Roboto Condensed', sans-serif">Roboto Condensed</option>
                    <option value="'Oswald', sans-serif">Oswald</option>
                    <option value="'Lato', sans-serif">Lato</option>
                    <option value="'Slabo 27px', serif">Slabo</option>
                    <option value="'Roboto Slab', serif">Roboto</option>
                    <option value="'Indie Flower', cursive">Indie Flo</option>
                    <option value="'Dosis', sans-serif">Dosis</option>
                    <option value="'Anton', sans-serif">Anton</option>
                    <option value="'Arvo', serif">Arvo</option>
                    <option value="'Lobster', cursive">Lobs</option>
                    <option value="'Josefin Sans', sans-serif">Josefin Sans</option>
                    <option value="'Pacifico', cursive">Pacif</option>
                    <option value="'Bree Serif', serif">Bree</option>
                    <option value="'Dancing Script', cursive">Dancing Scr</option>
                    <option value="'Passion One', cursive">Passion</option>
                    <option value="'Courgette', cursive">Courge</option>
                    <option value="'Kalam', cursive">Ka</option>
                    <option value="'Aldrich', sans-serif">Aldrich</option>
                    <option value="'Merienda', cursive">Merie</option>
                    <option value="'GFS Didot', serif">GFS</option>
                    <option value="'Crafty Girls', cursive">Crafty Gi</option>
                    <option value="'Libre Barcode 39 Extended Text', cursive">Libre</option>
                    <option value="'Libre Barcode 39 Extended', cursive">Libre</option>
                    <option value="'Amiri', serif"></option>
                    <option value="'Lateef', cursive">Lat</option>
                    <option value="'Scheherazade', serif">Scheher</option>
                    <option value="'Aref Ruqaa', serif">Aref</option>
                    <option value="'calibri'">Calibri</option>
                    <option value="'Mukta Mahee', sans-serif">Mukta Mahee</option>
                    <option value="'Kavivanar', cursive">Kavivanar</option>
                    <option value="'Open Sans', sans-serif">Open Sans</option>
                    <option value="'Montserrat', sans-serif">Montserrat</option>
                    <option value="'Raleway', sans-serif">Raleway</option>
                    <option value="'BioRhyme Expanded', serif">BioRhyme Expanded</option>
                    <option value="'Source Sans Pro', sans-serif">Source Sans Pro</option>
                    <option value="'PT Sans', sans-serif">PT Sans</option>
                    <option value="'Merriweather', serif">Merriweather</option>
                    <option value="'Ubuntu', sans-serif">Ubuntu</option>
                    <option value="'Lora', serif">Lora</option>
                    <option value="'Open Sans Condensed', sans-serif">Open Sans Condensed</option>
                    <option value="'Playfair Display', serif">Playfair Display</option>
                    <option value="'Noto Sans', sans-serif">Noto Sans</option>
                    <option value="'PT Serif', serif">PT Serif</option>
                    <option value="'Poppins', sans-serif">Poppins</option>
                    <option value="'Arimo', sans-serif">Arimo</option>
                    <option value="'Titillium Web', sans-serif">Titillium Web</option>
                    <option value="'Muli', sans-serif">Muli</option>
                    <option value="'PT Sans Narrow', sans-serif">PT Sans Narrow</option>
                    <option value="'Fira Sans', sans-serif">Fira Sans</option>
                    <option value="'Oxygen', sans-serif">Oxygen</option>
                    <option value="'Nanum Gothic', sans-serif">Nanum Gothic</option>
                    <option value="'Fjalla One', sans-serif">Fjalla One</option>
                    <option value="'Cabin', sans-serif">Cabin</option>
                    <option value="'Barlow Condensed', sans-serif">Barlow Condensed</option>
                    <option value="'Yanone Kaffeesatz', sans-serif">Yanone Kaffeesatz</option>
                    <option value="'Abel', sans-serif">Abel</option>
                    <option value="'Ubuntu Condensed', sans-serif">Ubuntu Condensed</option>
                    <option value="'Archivo Narrow', sans-serif">Archivo Narrow</option>
                    <option value="'Play', sans-serif">Play</option>
                    <option value="'Rajdhani', sans-serif">Rajdhani</option>

                </select>
                <input type="hidden" name="font-family">

            </div>{{-- Font Family--}}
            <div id="edit_font_size" class="group-item">
                <label for="font_size" style="width:100%;">Font Size (pt)</label>
                <div class="slider-count">
                    <input type="range" oninput="$(this).next('input').val(this.value).change()" name="font-size"
                           data-name="css" class="change" value="11" style="width: 74%">
                    <input type="number" max="100" min="0" name="font-size"
                           oninput="$(this).prev('input').val(this.value).change()" value="11"
                           style="width: 26%;margin-top: -1px;">
                </div>

            </div>{{-- Font Size--}}
            <div id="edit_text_style" class="group-item">
                <div class="text-toolkit">
                    <ul style="padding-left: 4px;">
                        <li data-name="font-weight" data-target="700" style="float: left;">
                            <i class="icons icons-bold"></i>
                        </li>
                        <li data-name="font-style" data-target="italic" style="float: left;">
                            <i class="icons icons-italic"></i>
                        </li>
                        <li data-name="text-decoration" data-target="underline solid rgb(0, 0, 0)" class="multichoice"
                            style="float: left;">
                            <i class="icons icons-underline"></i>
                        </li>
                        <li data-name="text-decoration" data-target="line-through solid rgb(0, 0, 0)"
                            class="multichoice" style="float: left;">
                            <i class="icons icons-line-through"></i>
                        </li>

                        <li data-name="hyberlink-write" style="display: none">
                            <i class="icons icons-link"></i>
                            <div id="hyberlink-write">
                                <input type="text" placeholder="Paste Your Link Here" style="display: inline">
                                <button type="button" style="display: inline"><i class="fa fa-arrow-left"></i></button>
                            </div>
                        </li>
                        <li id="text_color" data-name="color" style="float: left;">

                        </li>
                        <input type="hidden" name="color" value="#000000" placeholder="#000000">
                        <input type="hidden" name="font-weight" value="normal" placeholder="normal">
                        <input type="hidden" name="font-style" value="normal" placeholder="normal">
                        <input type="hidden" name="text-decoration" value="none" placeholder="none">
                    </ul>
                </div>
            </div>{{-- Text Style--}}
            <div id="edit_text_transform" class="group-item">
                <div class="text-toolkit" style="width: 57%;float: left;padding-top: 3px;">
                    <ul>
                        <li style="width: 24px;padding: 0;" data-name="text-transform" data-target="capitalize"
                            class="multichoice" title="capitlize">
                            <i class="icons icons-capitlize"></i>
                        </li>

                        <li style="width: 24px;padding: 0;" data-name="text-transform" data-target="lowercase"
                            class="multichoice" title="lowercase">
                            <i class="icons icons-lowercase"></i>
                        </li>
                        <li style="width: 24px;padding: 0;" data-name="text-transform" data-target="uppercase"
                            class="multichoice" title="uppercase">
                            <i class="icons icons-uppercase"></i>
                        </li>

                        <input type="hidden" name="text-transform" value="none" placeholder="none">
                    </ul>

                </div>
                <div style="width: 40%;float: right;padding-left: 6px;border-left: 2px solid #e5ecf3;">
                    <div class="dropdown" style="width: auto;" onclick="$(this).next().find('.select-styled').click()">
                        <div class="select">
                            <i class="icons icons-line-height"></i>
                        </div>
                    </div>

                    <select class="selection" title="line-height"
                            onchange="$('input[name=\'line-height\']').val(this.value).change()"
                            style="width: auto;-webkit-appearance: none;">
                        <option title="auto" value="normal">Auto</option>
                        <option title="1.0" value="16px">1.0</option>
                        <option title="1.15" value="18.4px">1.15</option>
                        <option title="1.5" value="23.536px" selected="selected">1.5</option>
                        <option title="2.0" value="32px">2.0</option>
                        <option title="2.5" value="40px">2.5</option>
                        <option title="3.0" value="48px">3.0</option>
                    </select>{{--form_line_height--}}
                    <input type="hidden" name="line-height">

                </div>
            </div>{{-- Text Align--}}
            <div id="edit_text_align" class="group-item">
                <div class="text-toolkit">
                    <ul>
                        <li data-name="text-align" data-target="start" class="multichoice">
                            <i class="icons icons-text-left"></i>
                        </li>
                        <li data-name="text-align" data-target="center" class="multichoice">
                            <i class="icons icons-text-center"></i>
                        </li>
                        <li data-name="text-align" data-target="right" class="multichoice">
                            <i class="icons icons-text-right"></i>
                        </li>
                        <li data-name="text-align" data-target="justify" class="multichoice">
                            <i class="icons icons-text-justify"></i>
                        </li>
                        <li data-name="text-indent" data-target="+30">
                            <i class="icons icons-indent-right"></i>
                        </li>
                        <li data-name="text-indent" data-target="-30">
                            <i class="icons icons-indent-left"></i>
                        </li>
                        <input type="hidden" name="text-align" value="inherit" placeholder="inherit">
                        <input type="hidden" name="text-indent" value="0" placeholder="0">
                    </ul>
                </div>
            </div>{{-- Text Alignment--}}
            <div id="edit_text_alignment" class="group-item">
                <label for="options" style="width:100%;">Text Position</label>
                <div class="text-toolkit">
                    <ul style="text-align: left;">
                        <li title="top">
                            <i class="icons icons-checkbox-top"></i>
                        </li>
                        <li title="bottom">
                            <i class="icons icons-checkbox-bottom"></i>
                        </li>
                        <li title="left">
                            <i class="icons icons-checkbox-left"></i>
                        </li>
                        <li title="right">
                            <i class="icons icons-checkbox-right"></i>
                        </li>
                        <input type="hidden" name="form-option-text-alignment">
                    </ul>
                </div>
            </div>{{--Options Text Alignment--}}

        </div>
        <div class="item-title" section="styling">
            <h3>
                Styling
            </h3>

            <div class="item-tools" data-target="styling">
                <a href="#" process="copy"><i class="icons icons-copy"></i></a>
                <a href="#" process="paste"><i class="icons icons-paste"></i></a>
            </div>
        </div>
        <div class="tools-group" id="styling" style="display: none;">
            <div id="form_background_color" class="group-item" style="display: table;">

                <div class="item-tools" style="margin-bottom: 10px;" data-target="background">
                    <h2>Background</h2>
                    <a href="#" process="copy"><i class="icons icons-copy"></i></a>

                    <a href="#" process="paste"><i class="icons icons-paste"></i></a>

                </div>

                <div style="display: table;width: 100%;">
                    <label for="background_color_style" style="padding: 0px 0 8px 0;">Style</label>
                    <select class="selection" id="background_color_style" title="background_color_style">
                        <option title="style5" value="style5">No Color</option>
                        <option title="style1" data-html="background-color" value="style1">Single Color</option>
                        <option title="style2" data-html="background-image" value="style2">Circle</option>
                        <option title="style3" data-html="background-image" value="style3">Gradient Horizontal</option>
                        <option title="style4" data-html="background-image" value="style4">Gradient Vertical</option>
                    </select>

                </div>

                <div class="color-rang">
                    <div class="grad_ex" id="style1" style="border: 1px black solid;margin-bottom: 17px;"></div>
                    <div class="grad_ex" id="style2" style="display: none"></div>
                    <div class="grad_ex" id="style3" style="display: none"></div>
                    <div class="grad_ex" id="style4" style="display: none"></div>

                    <input type="hidden" name="background" value="transparent">
                </div>

            </div>
            <div id="form_border" class="group-item">
                <div class="item-tools" data-target="border">
                    <h2>Border</h2>

                    <a href="#" process="copy"><i class="icons icons-copy"></i></a>
                    <a href="#" process="paste"><i class="icons icons-paste"></i></a>

                </div>

                <div class="sub-group-item" style="display: table;margin-bottom: 5px;padding-right: 11px;">
                    <div id="form_border_style" class="border-part" style="width: 71%;">
                        <label for="background_color">Style</label>
                        <select class="selection" onchange="$('input#border-style').val(this.value).change()"
                                title="border_color_style">
                            <option title="style1" value="none">None</option>
                            <option title="style1" value="solid">Solid</option>
                            <option title="style4" value="dotted">Dotted</option>
                            <option title="style2" value="dashed">Dashed</option>
                            <option title="style3" value="double">Double</option>
                        </select>
                    </div>
                    <div id="form_border_color" class="border-part"
                         style="padding-left: 20px;float: right;width: 28%;margin-right: 0;">
                        <label for="border_color">Color</label>
                        <div class="form-group color_picker_event" style="margin-left: 8px;">
                            <div id="border_color" class="color-display"><i></i></div>
                        </div> {{-- Background color--}}
                    </div>

                </div> {{-- Border color--}}

                <div id="form_border_size" class="sub-group-item">
                    <label for="border_size" style="width: 100%;">
                        Positions
                    </label>
                    <div style="height: 31px;">
                        <div class="form-builder col-lg-6 element-left" style="padding: 4px 0;">
                            <h5 style="padding: 0;margin: 0;">All Border</h5>
                        </div>
                        <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                            <div class="onoffswitch">
                                <input type="checkbox" name="border_all" value="0"
                                       onchange="if(this.value === '0'){ $(this).val('1'); $('#form_border_size').find('input[name!=\'border_all\']').val(1).change();}else{ $(this).val('0') }"
                                       class="onoffswitch-checkbox" id="border-all">
                                <label class="onoffswitch-label" for="border-all">
                                    <span class="onoffswitch-inner"></span>
                                    <span class="onoffswitch-switch"></span>
                                </label>
                            </div>
                        </div>
                    </div> {{-- Hide--}}

                    <div class="slider-count">
                        <label for="border_size" style="width: 14%;float: left;margin: -5px 0;padding: 0;">
                            <i class="icons icons-border-position-top"></i>
                        </label>
                        <input type="range" max="100" min="0" name="top-width" rule="top-width" class="change width"
                               value="1"
                               style="width: 62%">
                        <input type="number" max="100" min="0" name="top-width" rule="top-width" class="width" value="1"
                               style="width: 24%;margin-top: -1px;">
                    </div>
                    <div class="slider-count">
                        <label for="border_size" style="width: 14%;float: left;margin: -5px 0;padding: 0;">
                            <i class="icons icons-border-position-bottom"></i>
                        </label>
                        <input type="range" max="100" min="0" name="bottom-width" rule="bottom-width"
                               class="change width"
                               value="1" style="width: 62%">
                        <input type="number" max="100" min="0" name="bottom-width" rule="bottom-width" class="width"
                               value="1"
                               style="width: 24%;margin-top: -1px;">
                    </div>
                    <div class="slider-count">
                        <label for="border_size" style="width: 14%;float: left;margin: -5px 0;padding: 0;">
                            <i class="icons icons-border-position-left"></i>
                        </label>
                        <input type="range" max="100" min="0" name="left-width" rule="left-width" class="change width"
                               value="1" style="width: 62%">
                        <input type="number" max="100" min="0" name="left-width" rule="left-width" class="width"
                               value="1"
                               style="width: 24%;margin-top: -1px;">
                    </div>
                    <div class="slider-count">
                        <label for="border_size" style="width: 14%;float: left;margin: -5px 0;padding: 0;">
                            <i class="icons icons-border-position-right"></i>
                        </label>
                        <input type="range" max="100" min="0" name="right-width" rule="right-width" class="change width"
                               value="1" style="width: 62%">
                        <input type="number" max="100" min="0" name="right-width" rule="right-width" class="width"
                               value="1"
                               style="width: 24%;margin-top: -1px;">
                    </div>
                </div>{{-- Border Size--}}

                <div id="form_border_radius" class="sub-group-item">
                    <label for="border_radius" style="width:100%;">Radius (px)</label>
                    <div class="slider-count">
                        <input type="range" max="100" min="0" name="border-radius" rule="border-radius" class="change"
                               value="0" style="width: 74%">
                        <input type="number" max="100" min="0" oninput="console.log(this.value)" name="border-radius"
                               rule="border-radius" value="0"
                               style="width: 26%;margin-top: -1px;">
                    </div>
                </div>{{-- Border Radius--}}

                <input type="hidden" name="border-color" id="border-color" rule="border-color" value="#000000">
                <input type="hidden" name="border-style" id="border-style" rule="border-style" value="solid">

            </div>
        </div>
        <div class="item-title" section="dimensions">
            <h3>
                Dimensions
            </h3>

            <div class="item-tools" data-target="dimensions">
                <a href="#" process="copy"><i class="icons icons-copy"></i></a>
                <a href="#" process="paste"><i class="icons icons-paste"></i></a>
            </div>
        </div>
        <div class="tools-group" id="dimensions" style="display: none;">
            <div id="dimensions_margin" class="dimensions group-item">
                <div class="dimensions-title">
                    <label for="element_class" style="width: 50%;padding: 9px 0px 0 0;">Margin</label>
                    <span><img src="{{ asset("images/icons/margin.png") }}"></span>
                </div>
                <div>T<input type="number" name="margin-top" value="0"></div>
                <div style="text-align: right;margin-left: -4px;">B<input type="number" name="margin-bottom" value="0">
                </div>
                <div>R<input type="number" name="margin-right" value="0"></div>
                <div style="text-align: right;margin-left: -4px;">L<input type="number"
                                                                          oninput="console.log(this.value)"
                                                                          name="margin-left" value="0">
                </div>
            </div>
            <div id="dimensions_padding" class="dimensions group-item">
                <div class="dimensions-title">
                    <label for="element_class" style="width: 50%;padding: 9px 0px 0 0;">Padding</label>
                    <span><img src="{{ asset("images/icons/padding.png") }}"></span>

                </div>
                <div>T<input type="number" name="padding-top" value="0"></div>
                <div style="text-align: right;margin-left: -4px;">B<input type="number" name="padding-bottom" value="0">
                </div>
                <div>R<input type="number" name="padding-right" value="0"></div>
                <div style="text-align: right;margin-left: -4px;">L<input type="number" name="padding-left" value="0">
                </div>
            </div>

        </div>
        <div class="item-title" section="properties">
            <h3>
                Properties
            </h3>

        </div>
        <div class="tools-group" id="properties" style="display: none;">

            <div id="page_size" class="group-item">
                <label for="page_size">Page Size</label>
                <select class="selection" name="page-size" title="page_size">
                    <option value="A0">A0 (84.1 x 118.9) cm</option>
                    <option value="A1">A1 (59.4 x 84.1) cm </option>
                    <option value="A2">A2 (42.0 x 59.4) cm </option>
                    <option value="A3">A3 (29.7 x 42.0) cm </option>
                    <option value="A4">A4 (21.0 x 29.7) cm </option>
                    <option value="A5">A5 (14.8 x 21.0) cm </option>
                    <option value="A6">A6 (10.5 x 14.8) cm </option>
                    <option value="A7">A7 (7.4 x 10.5) cm  </option>
                    <option value="A8">A8 (5.2 x 7.4) cm   </option>
                    <option value="A9">A9 (3.7 x 5.2) cm   </option>
                    <option value="A10">A10 (2.6 x 3.7) cm </option>
                </select>
            </div>{{-- Page Size--}}
            <div id="page_orientation" class="group-item">
                <label for="page_orientation">Page Orientation</label>
                <select class="selection" name="page-orientation" title="page-orientation">
                    <option value="h">Horizontal</option>
                    <option value="v">Vertical</option>
                </select>
            </div>{{-- Page Orientation--}}
            <div id="page_background" class="group-item">
                <label for="page_orientation">Page Background</label>
                <img style="width: 100%; margin-top: 6px;" src="{{asset('images/choose.png')}}" onclick="$(this).next().click()">
                <input style="display: none;" type="file" accept="image/jpeg" onchange="
                var img_el = $(this).prev('img');
                var reader = new FileReader();
                reader.onload = function (e) {
                img_el.attr('src', e.target.result);
                };
                reader.readAsDataURL(this.files[0]); ">
            </div>{{-- Font Family--}}

            <div id="form_name" class="group-item" style="border: none;margin-bottom: 0;padding-bottom: 10px;">
                <label for="element_class" style="width: 100%;">Name</label>
                {{--<select id="combobox"><option value="">Select one...</option></select>--}}

                <input type="text" style="width: 100%;padding-left: 4px;">
            </div> {{-- Name--}}
            <div id="form_class" class="group-item" style="padding-top: 0;">
                <label for="element_class">Class</label>
                <div style="width: 100%;" class="element-left-inputtags">
                    <input id="element_class" type="text" class="tags form-control" value=""/>
                </div>
            </div> {{-- Class--}}
            <div id="form_label" class="switcher group-item">
                <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                    <h5 style="padding: 0;margin: 0;">Label</h5>
                </div>
                <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                    <div class="onoffswitch">
                        <input type="checkbox" name="form-label" class="onoffswitch-checkbox" title="element-label"
                               id="form-label">
                        <label class="onoffswitch-label" for="form-label">
                            <span class="onoffswitch-inner"></span>
                            <span class="onoffswitch-switch"></span>
                        </label>
                    </div>
                </div>
            </div> {{-- Hide--}}
            <div id="form_hidden" class="switcher group-item">
                <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                    <h5 style="padding: 0;margin: 0;">Hide</h5>
                </div>
                <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                    <div class="onoffswitch">
                        <input type="checkbox" name="form-hidden" class="onoffswitch-checkbox" title="element-hidden"
                               id="form-hidden">
                        <label class="onoffswitch-label" for="form-hidden">
                            <span class="onoffswitch-inner"></span>
                            <span class="onoffswitch-switch"></span>
                        </label>
                    </div>
                </div>
            </div> {{-- Hide--}}
            <div id="form_read" class="switcher group-item">
                <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                    <h5 style="padding: 0;margin: 0;">Read Only</h5>
                </div>
                <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                    <div class="onoffswitch">
                        <input type="checkbox" name="form-read" class="onoffswitch-checkbox" title="element-read-only"
                               id="form-read">
                        <label class="onoffswitch-label" for="form-read">
                            <span class="onoffswitch-inner"></span>
                            <span class="onoffswitch-switch"></span>
                        </label>
                    </div>
                </div>
            </div> {{-- Read Only--}}
            <div id="form_required" class="switcher group-item">
                <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                    <h5 style="padding: 0;margin: 0;">Required</h5>
                </div>
                <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                    <div class="onoffswitch">
                        <input type="checkbox" name="form-required" class="onoffswitch-checkbox"
                               title="element-requried" id="form-required">
                        <label class="onoffswitch-label" for="form-required">
                            <span class="onoffswitch-inner"></span>
                            <span class="onoffswitch-switch"></span>
                        </label>
                    </div>
                </div>
            </div> {{-- Required--}}
            <div id="form_unprintable" class="switcher group-item">
                <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                    <h5 style="padding: 0;margin: 0;">Unprintable</h5>
                </div>
                <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                    <div class="onoffswitch">
                        <input type="checkbox" name="form-unprintable" class="onoffswitch-checkbox"
                               title="element-unprintable" id="form-unprintable">
                        <label class="onoffswitch-label" for="form-unprintable">
                            <span class="onoffswitch-inner"></span>
                            <span class="onoffswitch-switch"></span>
                        </label>
                    </div>
                </div>
            </div> {{-- Unprintable--}}
            <div id="form_row_settings">

                <div id="form_header" class="switcher group-item">
                    <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                        <h5 style="padding: 0;margin: 0;">Header</h5>
                    </div>
                    <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                        <div class="onoffswitch">
                            <input type="checkbox" name="form-header" class="onoffswitch-checkbox"
                                   title="element-header"
                                   id="form-header">
                            <label class="onoffswitch-label" for="form-header">
                                <span class="onoffswitch-inner"></span>
                                <span class="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                </div> {{-- header--}}
                <div id="form_footer" class="switcher group-item">
                    <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                        <h5 style="padding: 0;margin: 0;">Footer</h5>
                    </div>
                    <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                        <div class="onoffswitch">
                            <input type="checkbox" name="form-footer" class="onoffswitch-checkbox"
                                   title="element-footer"
                                   id="form-footer">
                            <label class="onoffswitch-label" for="form-footer">
                                <span class="onoffswitch-inner"></span>
                                <span class="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                </div> {{-- footer--}}


                <div id="form_first_page" class="switcher group-item" style="display: none;">
                    <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                        <h5 style="padding: 0;margin: 0;">First Page</h5>
                    </div>
                    <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                        <div class="onoffswitch">
                            <input type="checkbox" name="apply-pages"
                                   class="onoffswitch-checkbox" title="apply_to_first_page" id="form-first-page">
                            <label class="onoffswitch-label" for="form-first-page">
                                <span class="onoffswitch-inner"></span>
                                <span class="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                </div> {{-- footer--}}
                <div id="form_last_page" class="switcher group-item" style="display: none;">
                    <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                        <h5 style="padding: 0;margin: 0;">Last Page</h5>
                    </div>
                    <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                        <div class="onoffswitch">
                            <input type="checkbox" name="apply-pages"
                                   class="onoffswitch-checkbox" title="apply_to_last_page" id="form-last-page">
                            <label class="onoffswitch-label" for="form-last-page">
                                <span class="onoffswitch-inner"></span>
                                <span class="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                </div> {{-- footer--}}
                <div id="form_specific_pages" class="switcher group-item" style="display: none;">
                    <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                        <h5 style="padding: 0;margin: 0;">Specific</h5>
                    </div>
                    <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                        <div class="onoffswitch">
                            <input type="checkbox" name="apply-pages"
                                   class="onoffswitch-checkbox" title="apply_to_specific_pages"
                                   id="form-specific-pages">
                            <label class="onoffswitch-label" for="form-specific-pages">
                                <span class="onoffswitch-inner"></span>
                                <span class="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                    <div id="form_apply_from" class="switcher group-item" style="display: none;">
                        <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                            <h5 style="padding: 0;margin: 0;">From</h5>
                        </div>
                        <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                            <div class="onoffswitch">
                                <input type="number"
                                       onkeyup="if(parseInt(this.value) > parseInt($('#specific-pages-to').val())){ $(this).val($('#specific-pages-to').val()) }"
                                       onclick="$(this).attr('max',$('#specific-pages-to').val())"
                                       name="specific-pages-from" id="specific-pages-from"
                                       style="width: 77%;float: right;margin-bottom: 0">
                            </div>
                        </div>
                    </div>
                    <div id="form_apply_to" class="switcher group-item" style="display: none;">
                        <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                            <h5 style="padding: 0;margin: 0;">To</h5>
                        </div>
                        <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                            <div class="onoffswitch">
                                <input type="number"
                                       onkeyup="if(parseInt(this.value) < parseInt($('#specific-pages-from').val())){ $(this).val($('#specific-pages-from').val()) }"
                                       onclick="$(this).attr('min',$('#specific-pages-from').val())"
                                       name="specific-pages-to" id="specific-pages-to"
                                       style="width: 77%;float: right;margin-bottom: 0">
                            </div>
                        </div>
                    </div> {{-- footer--}}

                </div> {{-- footer--}}
            </div>
            <div id="form_input_type" class="group-item">
                <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                    <h5 style="padding: 0;margin: 0;">Type</h5>
                </div>
                <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                    <select>
                        <option class="text" value="text">Text</option>
                        <option class="password" value="password">Password</option>
                        <option class="date" value="date">Date</option>
                        {{--<option class="country" value="country">C List</option>--}}
                        {{--<option class="homenumber" value="number">HP Number</option>--}}
                        {{--<option class="worknumber" value="number">WP Number</option>--}}
                        {{--<option class="mobilenumber" value="number">MP Number</option>--}}
                        {{--<option class="phonenumber" value="number">Phone</option>--}}
                        <option class="number" value="number">Number</option>
                        <option class="email" value="email">Email</option>
                        <option class="url" value="url">URL</option>
                        {{--<option class="iban" value="iban">IBAN</option>--}}
                        {{--<option class="bic" value="bic">BIC</option>--}}
                    </select>
                </div>
            </div> {{-- Limit Entry--}}
            <div id="limit-entry" class="group-item">
                <div class="form-builder col-lg-6 element-left" style="padding: 0;">
                    <h5 style="padding: 0;margin: 0;">Limit Entry</h5>
                </div>
                <div class="form-builder col-lg-6 element-right" style="padding-right: 0;padding-left: 0;">
                    <div class="onoffswitch">
                        <input type="checkbox" name="form-limit-entry"
                               class="onoffswitch-checkbox" title="form-limit-entry" id="form-limit-entry">
                        <label class="onoffswitch-label" for="form-limit-entry">
                            <span class="onoffswitch-inner"></span>
                            <span class="onoffswitch-switch"></span>
                        </label>
                    </div>
                </div>
            </div>
            <div id="form_limitaion" class="group-item" style="display: none;">
                <div class="form-builder col-lg-12" id="limit-switchers" style="padding:0;">
                    <div id="dates" style="display: none">
                        <span style="float: left;width: 100%;color: #607e98;font-style:italic;">Dates</span>
                        <div class="col-md-6 xdisplay_inputx form-group has-feedback"
                             style="padding: 0;margin-bottom: 0;">
                            <input type="text" title="date-limitaion"
                                   class="form-control has-feedback-left change element-left"
                                   placeholder="Max" aria-describedby="inputSuccess2Status2" process="max"
                                   name="max-date"
                                   style="font-size: 10px;padding: 0;text-align: center;width: 85%;">
                        </div>

                        <div class="col-md-6 xdisplay_inputx form-group has-feedback"
                             style="padding: 0;margin-bottom: 0;">
                            <input type="text" title="date-limitaion"
                                   class="form-control has-feedback-left change element-right"
                                   placeholder="Min" aria-describedby="inputSuccess2Status2" process="min"
                                   name="min-date"
                                   style="font-size: 10px;padding: 0;text-align: center;width: 85%;">
                        </div>
                    </div>
                    <div id="number" style="display: none">
                        <span style="float: left;width: 100%;color: #607e98;font-style:italic;">Number</span>
                        <div class="form-builder col-lg-6" style="padding:0;">
                            <input type="number" name="max-numbers" process="max" title="number-limitaion"
                                   class="change form-control element-left" placeholder="Max"
                                   style="width: 85%;text-align: center;">
                        </div>
                        <div class="form-number col-lg-6 " style="padding:0;">
                            <input type="number" name="min-numbers" process="min" title="number-limitaion"
                                   class="change form-control element-right" placeholder="Min"
                                   style="width: 85%;text-align: center;">
                        </div>
                    </div>
                    <div id="character" style="display: none">
                        <span style="float: left;width: 100%;color: #607e98;font-style:italic;">Character</span>
                        <div class="form-builder col-lg-6 " style="padding:0;">
                            <input type="number" title="character-limitaion" process="minlength" name="min-characters"
                                   class="change form-control element-left" placeholder="Min"
                                   style="width: 85%;text-align: center;">
                        </div>
                        <div class="form-builder col-lg-6" style="padding:0;">
                            <input type="number" title="character-limitaion" process="maxlength" name="max-characters"
                                   class="change form-control element-right" placeholder="Max"
                                   style="width: 85%;text-align: center;">
                        </div>

                    </div>
                    <div id="rows_number" style="display: none">
                        <span style="float: left;width: 100%;color: #607e98;font-style:italic;">Rows Limitation</span>
                        <div class="form-builder col-lg-6" style="padding:0;">
                            <input type="number" title="rows-limitaion" process="min-height" name="rows-limitaion"
                                   class="change form-control element-left" placeholder="Min"
                                   style="width: 85%;text-align: center;">
                        </div>

                        <div class="form-builder col-lg-6" style="padding:0;">
                            <input type="number" title="rows-limitaion" process="max-height" name="rows-max-limitaion"
                                   class="change form-control element-right" placeholder="Max"
                                   style="width: 85%;text-align: center;">
                        </div>
                    </div>
                </div>
            </div> {{-- Limit Entry--}}
            <div id="width_alignment" class="group-item">
                <label for="width" style="width:100%;margin-bottom: 6px;">Alignment</label>
                <div class="slider-count">
                    <input type="range" oninput="$(this).next('input').val(this.value)" name="width-alignment"
                           data-name="css" class="change" value="1" max="12" min="0" style="width: 80%">
                    <input type="number" max="12" min="0" name="width-alignment"
                           oninput="$(this).prev('input').val(this.value)" value="1"
                           style="width: 20%;margin-top: -1px;">
                </div>
            </div>{{-- Width--}}
            <div id="floating" class="image-align group-item">
                <button type="button" value="left">Left</button>
                <button type="button" value="center">Center</button>
                <button type="button" value="right">Right</button>
                <input type="hidden" name="form-floating">
            </div> {{--Floating--}}
            <div id="copy_get_switcher" class="group-item">
                <button type="button" value="get_value" data-toggle="modal" data-target="#copy_get">Get/Copy</button>
            </div>{{--Options Text Alignment--}}
            <div id="calculate_value" class="group-item">
                <button data-toggle="modal" data-target=".calculator" type="button">Calculate</button>


            </div>{{--Options Text Alignment--}}

        </div>
    </div>

</div>

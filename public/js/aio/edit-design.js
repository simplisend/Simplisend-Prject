(function ($) {

    String.prototype.fullColorHex = function () {
        var rgbToHex = function (rgb) {
            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                hex = "0" + hex;
            }
            return hex;
        };

        var $this = this;

        if ($this.indexOf("rgb") !== -1) {
            $this = $this.replace("rgb(", "");
            $this = $this.replace(")", "");
            $this = $this.split(",");
            var red = rgbToHex($this[0]);
            var green = rgbToHex($this[1]);
            var blue = rgbToHex($this[2]);
            return red + green + blue;
        } else {
            return $this;
        }

    };
    String.prototype.extractRGB = function () {

        //-webkit-linear-gradient(90deg, white 0%, rgb(219, 0, 219) 37%, rgb(0, 0, 250) 99%)
        var $this = this,
            $splitPrecent = $this.split("rgb");

        // var result = $splitPrecent[2].match(/\((.*)\)/);

        $.each($splitPrecent, function (index) {
            if ($splitPrecent[index].indexOf(")") !== -1) {
                var $clean = "rgb" + $splitPrecent[index].substr(0, $splitPrecent[index].indexOf(")") + 1);

                $this = $this.replace($clean, $clean.fullColorHex());
            }
        })

        console.log($this);

        return $this;

    };
    $.fn.filterPanel = function () {


        var $this = $(this),
            tag = $this.tagName(),
            styling = true;

        var sections = {
            main: {
                text_format: $("#text_format"),
                styling: $("#styling"),
                dimensions: $("#dimensions"),
                properties: $("#properties"),
                dimensions_margin: $("#dimensions_margin"),
                dimensions_padding: $("#dimensions_padding"),
            },
            sub: {
                form_label: $("#form_label"),
                form_name: $("#form_name"),
                form_class: $("#form_class"),
                form_hidden: $("#form_hidden"),
                form_read: $("#form_read"),
                form_required: $("#form_required"),
                form_unprintable: $("#form_unprintable"),
                form_header: $("#form_row_settings"),
                form_input_type: $("#form_input_type"),
                limit_entry: $("#limit-entry"),
                date_limitaion: $("#form_limitaion #dates"),
                number_limitaion: $("#form_limitaion #number"),
                character_limitaion: $("#form_limitaion #character"),
                rows_number: $("#form_limitaion #rows_number"),
                page_sizes: $("#page_size"),
                page_orientation: $("#page_orientation"),
                page_background: $("#page_background"),
                width_alignment: $("#width_alignment"),
                floating: $("#floating"),
                copy_get_switcher: $("#copy_get_switcher"),
                copy_get: $("#copy_get"),
                calculate_value: $("#calculate_value"),
                edit_text_alignment: $("#edit_text_alignment")
            }
        };

        var text_tags = [
            "BUTTON",
            "FONT",
            "LABEL",
            "P",
            "SPAN",
            "H1",
            "H2",
            "H3",
            "H4",
            "SELECT"
        ];

        var ids;

        if ($this.hasClass("element-editable") && !$this.hasClass("page-break")) {

            if ($this.hasClass("row")) {
                ids = ['form_name', 'form_hidden', 'form_read', 'form_unprintable', 'form_row_settings'];
            }
            else if (tag === "FIELDSET") {


                ids = ['form_label', 'form_name', 'form_hidden', 'form_read', 'form_required', 'form_unprintable'];

                if ($this.find("input").length > 0) {
                    var $type = $this.find("input").attr("type");

                    if ($type === "number") {
                        ids.push("calculate_value");
                        ids.push("number_limitaion");
                        ids.push("limit-entry");
                    }
                    else if ($type === "tel") {
                        ids.push("limit-entry");
                        ids.push("number_limitaion");
                    }
                    else if ($type === "text" || $type === "password") {
                        ids.push("limit-entry");
                        ids.push("character");
                    }
                    else if ($type === "date") {
                        ids.push("limit-entry");
                        ids.push("date");
                    }
                    else if ($type === "radio" || $type === "checkbox") {
                        ids.push("width_alignment");
                    }
                    if ($type !== "radio" && $type !== "checkbox" && $type !== "file") {
                        ids.push("form_input_type");
                        ids.push("copy_get_switcher");
                    }
                }
                else if ($this.find("textarea").length > 0) {
                    ids.push("limit-entry");
                    ids.push("rows_number");
                    ids.push("character");
                    ids.push("copy_get_switcher");
                }
            }
            else if ($this.hasClass("popup-content")) {
                ids = ['form_name'];
            }
            else {
                ids = [''];
            }
        }
        else if ($this.hasClass("page-break")) {

            ids = ['page_size', 'page_orientation', 'page_background'];
        }


        if ($.inArray(tag, text_tags) !== -1 || $this.hasClass("text-editable")) {
            $.each(sections.main, function () {
                if (this.prev(".item-title").attr("section") === "properties") {
                    if (this.is(':visible')) this.slideUp();
                    this.prev(".item-title").hide();
                } else {
                    this.prev(".item-title").slideDown();
                    this.prev(".item-title").css('display', "");

                }
            });
            if ($this.parent().hasClass("radio_input") || $this.parent().hasClass("checkbox_input")) {
                // sections.sub.edit_text_alignment.fadeIn()
                ids.push("edit_text_alignment");

            }

        }
        else {

            if ($this.hasClass("row") || $this.hasClass("form-group")) {

                if (!$this.hasClass("page-break")) {
                    $.each(sections.main, function () {
                        if (this.prev(".item-title").attr("section") === "text_format") {
                            if (this.is(':visible')) this.slideUp();
                            this.prev(".item-title").hide();
                        } else {
                            this.prev(".item-title").slideDown();
                            this.prev(".item-title").css('display', "");

                        }
                    });
                } else {
                    $.each(sections.main, function () {

                        if ($(this).attr("id") == "properties") {
                            if (!this.is(':visible')) $(this).slideDown();
                            $(this).show();
                            $(this).prev(".item-title").show();
                        } else {
                            $(this).slideUp();
                            $(this).hide();
                            $(this).prev(".item-title").hide();
                        }
                    });
                    styling = false;
                }

            }

            else if ($this.hasClass("popup-content")) {

                $.each(sections.main, function () {
                    if (this.prev(".item-title").attr("section") === "text_format" ||
                        this.prev(".item-title").attr("section") === "dimensions") {
                        if (this.is(':visible')) this.slideUp();
                        this.prev(".item-title").hide();
                    } else {
                        this.prev(".item-title").slideDown();
                        this.prev(".item-title").css('display', "");
                    }

                });
            }

            else if ($this.hasClass("columns")) {

                $.each(sections.main, function () {

                    if (this.prev(".item-title").attr("section") === "text_format" ||
                        this.prev(".item-title").attr("section") === "properties") {
                        if (this.is(':visible')) this.slideUp();
                        this.prev(".item-title").hide();
                    } else {

                        this.prev(".item-title").slideDown();
                        this.prev(".item-title").css('display', "");

                    }

                });
            }

            else if (tag === "INPUT" || tag === "TEXTAREA") {

                $.each(sections.main, function () {
                    if (this.prev(".item-title").attr("section") === "properties") {
                        if (this.is(':visible')) this.slideUp();
                        this.prev(".item-title").hide();
                    } else {
                        this.prev(".item-title").slideDown();
                        this.prev(".item-title").css('display', "");

                    }
                });
            }

            else if ($this.attr("rel") === "checkbox" || $this.attr("rel") === "radio") {

                $.each(sections.main, function () {
                    if (this.prev(".item-title").attr("section") === "text_format" || this.prev(".item-title").attr("section") === "properties") {
                        if (this.is(':visible')) this.hide();
                        this.prev(".item-title").hide();
                    } else {
                        this.prev(".item-title").slideDown();
                        this.prev(".item-title").css('display', "");
                    }
                });

            }

            else if ($this.attr("rel") !== "checkbox" && $this.attr("rel") !== "radio" && $this.attr("rel") !== "image") {
                $.each(sections.main, function () {
                    if (this.prev(".item-title").attr("section") === "properties") {
                        this.prev(".item-title").show();

                    } else {
                        this.prev(".item-title").slideDown();
                        this.prev(".item-title").css('display', "");
                    }
                });
            }
            else {

                $.each(sections.main, function () {
                    if (this.prev(".item-title").attr("section") === "styling") {
                        if (!this.is(':visible')) this.slideDown();
                        this.prev(".item-title").click();
                    } else {
                        if (this.is(':visible')) this.fadeOut();
                        this.prev(".item-title").fadeOut();
                    }
                });
                $("#form_border").slideUp();
            }

        }

        $.each(sections.sub, function () {
            if ($.inArray($(this).attr("id"), ids) === -1) {
                this.fadeOut();
            } else {
                this.slideDown();

            }
        });


        openVisible(styling);
    };
    $.fn.restoreValues = function () {

        var $this = $(this),
            $rel = $this.attr("rel"),
            getBackGround = function () {
                var $return = null;
                if (clicked.getCssStyle("background-image") !== "") {
                    $return = clicked.getCssStyle("background-image");
                } else if (clicked.getCssStyle("background-color") !== "") {
                    $return = clicked.getCssStyle("background-color").fullColorHex();
                } else {
                    $return = "";
                }
                return $return;
            },
            options = {
                font_family: $this.css("font-family"),
                font_size: $this.css("font-size"),
                font_color: $this.getCss("color"),
                font_style: $this.css("font-style"),
                font_weight: $this.css("font-weight"),
                font_decoration: $this.css("text-decoration"),
                text_transform: $this.css("text-transform"),
                line_height: $this.css("line-height"),
                text_align: $this.css("text-align"),
                text_indent: $this.css("text-indent"),
                background: getBackGround(),
                border_style: $this.getCss("border-style"),
                border_width_bottom: $this.getCss("border-bottom-width"),
                border_width_top: $this.getCss("border-top-width"),
                border_width_left: $this.getCss("border-left-width"),
                border_width_right: $this.getCss("border-right-width"),
                border_color: $this.getCss("border-color"),
                border_radius: $this.getCss("border-radius"),
                padding_top: $this.css("padding-top"),
                padding_right: $this.css("padding-right"),
                padding_bottom: $this.css("padding-bottom"),
                padding_left: $this.css("padding-left"),
                margin_top: $this.css("margin-top"),
                margin_right: $this.css("margin-right"),
                margin_bottom: $this.css("margin-bottom"),
                margin_left: $this.css("margin-left"),
                float: $this.css("float")
            },
            properties = {
                title: $this.attr("primary-id"),
                classes: $this.attr("class"),
                tag: $this.find(".prop-target").tagName(),
                type: $this.find(".prop-target").eq(0).attr("type"),
                data_validation: ($this.find(".prop-target").eq(0).hasAttr("data-validation")) ? $this.find(".prop-target").eq(0).attr("data-validation") : "",
                optional_if_answered: ($this.find(".prop-target").eq(0).hasAttr("data-validation-optional-if-answered")) ? $this.find(".prop-target").eq(0).attr("data-validation-optional-if-answered") : "number",
                label: $this.find("label[rel='" + $rel + "']").length,
                hidden: $this.hasClass("element-hidden"),
                read_only: $this.find(".prop-target").prop('readonly'),
                required: $this.hasClass("element-requried"),
                unprintable: $this.hasClass("element-unprintable"),
                header: $this.hasClass("element-header"),
                footer: $this.hasClass("element-footer"),
                apply_to_last_page: $this.hasClass("apply_to_last_page"),
                apply_to_first_page: $this.hasClass("apply_to_first_page"),
                apply_to_specific_page: $this.hasClass("apply_to_specific_pages"),
                specific_pages_from: $this.attr("from"),
                specific_pages_to: $this.attr("to"),
                max_chr: $this.find(".prop-target").attr("max"),
                min_chr: $this.find(".prop-target").attr("min"),
                max_num: $this.find(".prop-target").attr("maxlength"),
                min_num: $this.find(".prop-target").attr("minlength"),
                max_height: function () {
                    var $return = null;
                    if ($this.find(".prop-target").tagName() === "TEXTAREA") {
                        $return = parseInt($this.find(".prop-target").css("max-height").replace("px")) / 34
                    }
                    return $return;
                },
                min_height: function () {
                    var $return = null;
                    if ($this.find(".prop-target").tagName() === "TEXTAREA") {
                        $return = parseInt($this.find(".prop-target").css("min-height").replace("px")) / 34
                    }
                    return $return;
                },
                page_size: function () {
                    var $return = "A4";
                    if ($this.hasClass("page-break")) {
                        if ($this.hasAttr("page-size") && $this.attr("page-size") != "") {
                            $return = $this.attr("page-size");
                        }
                    }
                    return $return;
                },
                page_orientation: function () {
                    var $return = "v";
                    if ($this.hasClass("page-break")) {
                        if ($this.hasAttr("page-orientation") && $this.attr("page-orientation") != "") {
                            $return = $this.attr("page-orientation");
                        }
                    }
                    return $return;
                },
                page_background: function () {
                    var $return = "";
                    if ($this.hasClass("page-break")) {
                        if ($this.hasAttr("page-background") && $this.attr("page-background") != "") {
                            $return = $this.attr("page-background");
                        }
                    }
                    return $return;
                },
                alignment: "alignment",
                float: "float"

            };

        $("#form_font_family select").find("option").each(function (index) {
            if ($(this).css("font-family") === options.font_family) {
                $("#form_font_family select").val(this.value);
            }
        });
        // $(".select.font_family").find("li[title='" + options.font_family + "']").click();

        var font_size_calculate = parseInt(options.font_size.replace("px", "")) * 0.75;
        $("input[name='font-size']").val(font_size_calculate);

        if ("text_format" === "text_format") {
            if (options.font_color !== "") {
                SetColorPickers("text", options.font_color.fullColorHex());
            } else {
                SetColorPickers("text", "#000000");
            }

            var edit_text_style = $("#edit_text_style"),
                edit_text_transform = $("#edit_text_transform"),
                edit_text_align = $("#edit_text_align"),
                style = {'color': '#ffffff', 'background-color': '#436682', 'border-radius': '5px'},
                emptystyle = {'color': '#436682', 'background-color': '#ffffff', 'border-radius': '5px'};

            var $weight_input = edit_text_style.find("input[name='font-weight']"),
                $weight_li = edit_text_style.find("li[data-name='font-weight']");
            if (parseInt(options.font_weight) === 700) {
                $weight_li.css(style)
            } else {
                $weight_li.css(emptystyle)
            }

            var $style_input = edit_text_style.find("input[name='font-style']"),
                $style_li = edit_text_style.find("li[data-name='font-style']");

            if (options.font_style === "italic") {
                $style_li.css(style)
            } else {
                $style_li.css(emptystyle)
            }


            var $decoration_input = edit_text_style.find("input[name='text-decoration']"),
                $decoration_li = edit_text_style.find("li[data-name='text-decoration']");

            if (options.font_decoration.substring(0, 4) === "unde") {
                $decoration_li.eq(0).css(style);
                $decoration_li.eq(1).css(emptystyle)
            } else if (options.font_decoration.substring(0, 4) === "line") {
                $decoration_li.eq(0).css(emptystyle);
                $decoration_li.eq(1).css(style)
            } else {
                $decoration_li.eq(0).css(emptystyle);
                $decoration_li.eq(1).css(emptystyle);
            }


            var $transform_input = edit_text_style.find("input[name='text-transform']"),
                $transform_li = edit_text_transform.find("li[data-name='text-transform']");
            $transform_li.css(emptystyle);

            if (options.text_transform !== "none") {
                edit_text_transform.find("li[data-target='" + options.text_transform + "']").css(style)
            } else {
                $transform_li.css(emptystyle)
            }

            var $align_input = edit_text_align.find("input[name='text-align']"),
                $align_li = edit_text_align.find("li[data-name='text-align']");
            $align_li.css(emptystyle);

            if (options.text_align !== "none") {
                edit_text_align.find("li[data-target='" + options.text_align + "']").css(style)
            } else {
                $align_li.css(emptystyle)
            }

            $align_input.val(options.text_align);
            $weight_input.val(options.font_weight);

            $style_input.val(options.font_style);
            $decoration_input.val(options.font_decoration);
            $transform_input.val(options.text_transform);


            // alert(options.line_height+"/"+$("select[title='line-height'] option[value='"+options.line_height+"']").length);
            if ($("select[title='line-height'] option[value='" + options.line_height + "']").length === 0) {
                $("select[title='line-height']").val("normal").change();
            } else {
                $("select[title='line-height']").val(options.line_height).change();

            }


        }

        if ("styling" === "styling") {


            function isHexaColor(sNum) {
                return (typeof sNum === "string") && sNum.length === 6
                    && !isNaN(parseInt(sNum, 16));
            }

            var form_background_color = $("#form_background_color"),
                background_styles = {
                    no_color: function () {
                        form_background_color.find(".background_color_style").find("li[title='style5']").click();
                    },
                    single_color: function () {
                        form_background_color.find(".background_color_style").find("li[title='style1']").click();
                    },
                    circle: function () {
                        form_background_color.find(".background_color_style").find("li[title='style2']").click();

                    },
                    horizontal: function () {
                        form_background_color.find(".background_color_style").find("li[title='style3']").click();
                    },
                    vertical: function () {
                        form_background_color.find(".background_color_style").find("li[title='style4']").click();
                    }
                };

            if (options.background.indexOf("(") !== -1) { //-webkit-linear-gradient(white 0%, black 100%) !important
                var styl = options.background.extractRGB();


                if (styl.includes("left")) {
                    styl = styl.replace("left,", "");
                }
                else if (styl.includes("90deg")) {
                    styl = styl.replace("90deg,", "");
                }
                else if (styl.includes("center")) {
                    styl = styl.replace("center,", "");
                    styl = styl.replace("center ,", "");
                    styl = styl.replace("center ", "");
                }

                var color_str = $.trim(styl.substring(styl.lastIndexOf("(") + 1, styl.length - 1)).split(",");


                for (var i = 0, l = color_str.length; i < l; ++i) {

                    var splitPercetnagePart = $.trim(color_str[i]).split(" ")[0];

                    if (isHexaColor(splitPercetnagePart)) {
                        color_str[i] = "#" + $.trim(color_str[i]);
                    } else {
                        color_str[i] = $.trim(color_str[i]);

                    }
                }

                console.log("styl: " + styl);
                console.log("color_str: " + color_str.join("-"));


                if (options.background.indexOf("radial") !== -1) {
                    console.log("color_str: " + JSON.stringify(color_str));

                    runBackgroundOptions({
                        controlPoints: color_str,
                        key: "radial"
                    });


                    background_styles.circle();


                }

                else if (options.background.indexOf("linear") !== -1) {
                    if (options.background.indexOf("90deg") !== -1) {
                        // alert(options.background.extractRGB());

                        runBackgroundOptions({
                            controlPoints: color_str,
                            key: "ver"
                        });

                        background_styles.vertical();

                    }
                    else {


                        runBackgroundOptions({
                            controlPoints: color_str,
                            key: "hor"
                        });

                        background_styles.horizontal();


                    }
                }


            }
            else {
                if (options.background !== "") {
                    form_background_color.find(".background_color_style").find("li[title='style1']").click();
                    SetColorPickers("background", options.background);

                } else {
                    form_background_color.find(".background_color_style").find("li[title='style5']").click();
                }
            }


        }

        if ("border" === "border") {

            var form_border = $("#form_border");


            if (options.border_width_bottom !== "") {

                var switcher = form_border.find("input[name='border_all']");

                var $sum = 0;
                if (options.border_width_bottom === options.border_width_top &&
                    options.border_width_top === options.border_width_right &&
                    options.border_width_right === options.border_width_left &&
                    options.border_width_left === options.border_width_bottom) {
                    switcher.prop("checked", true);
                }
                else {
                    switcher.prop("checked", false);
                }
                $sum = parseInt(options.border_width_bottom.replace("px", "")) + parseInt(options.border_width_top.replace("px", "")) + parseInt(options.border_width_left.replace("px", "")) + parseInt(options.border_width_right.replace("px", ""));
                if (options.border_color !== "") {
                    SetColorPickers("border", options.border_color.fullColorHex());
                } else {
                    SetColorPickers("border", "#000000");
                }


                form_border.find("input[name='top-width']").val(parseInt(options.border_width_top.replace("px", ""))).change();
                form_border.find("input[name='bottom-width']").val(parseInt(options.border_width_bottom.replace("px", ""))).change();
                form_border.find("input[name='left-width']").val(parseInt(options.border_width_left.replace("px", ""))).change();
                form_border.find("input[name='right-width']").val(parseInt(options.border_width_right.replace("px", ""))).change();

                form_border.find("input[name='border-radius']").val(parseInt(options.border_radius.replace("px", "")));

                if ($sum > 0) {
                    $("#select-option-border_color_style").next().html($.trim(options.border_style).capitalize());
                } else {
                    $("#select-option-border_color_style").next().html("None");
                }


            }
            else {

                // alert("None");
                SetColorPickers("border", "#000000");

                $("#select-option-border_color_style").next().html($.trim("None"));


                var switcher = form_border.find("input[name='border_all']");
                if (switcher.val() !== "0") {
                    form_border.find(".onoffswitch-label").click();
                }
                form_border.find("input[name='top-width']").val("1");
                form_border.find("input[name='bottom-width']").val("1");
                form_border.find("input[name='left-width']").val("1");
                form_border.find("input[name='right-width']").val("1");

                form_border.find("input[name='border-radius']").val("0");

            }


        }

        if ("dimensions" === "dimensions") {
            var dimensions = $(".dimensions");

            dimensions.find("input").each(function (index) {
                $(this).val(options[$(this).attr("name").replace("-", "_")].replace("px", ""))
            })
        }

        if ("properties" === "properties") {

            if (typeof properties.title !== typeof undefined && properties.title !== false) {
                $("#form_name").find("input").val(properties.title);
            } else {
                $("#form_name").find("input").val("");
            }


            $("#properties input.onoffswitch-checkbox").each(function () {
                var $this = $(this),
                    id = $this.attr("id");

                if (id === "form-label") {

                    $this.prop('checked', (properties.label === 1));
                    list_icons("form-label", (properties.label === 1));

                }
                if (id === "form-password") {
                    $this.prop('checked', properties.password);
                }
                if (id === "form-hidden") {
                    $this.prop('checked', properties.hidden);
                    list_icons("form-hidden", properties.hidden);
                }
                if (id === "form-unprintable") {
                    $this.prop('checked', properties.unprintable);
                    list_icons("form-unprintable", properties.unprintable);
                }
                if (id === "form-read") {
                    $this.prop('checked', properties.read_only);
                    list_icons("form-read", properties.read_only);
                }
                if (id === "form-required") {
                    $this.prop('checked', properties.required);
                    list_icons("form-required", properties.required);
                }
                if (id === "form-header") {
                    $this.prop('checked', properties.header);
                }
                if (id === "form-footer") {
                    $this.prop('checked', properties.footer);
                }
                if (id === "form_last_page") {
                    $this.prop('checked', properties.apply_to_last_page);
                }
                if (id === "form-first-page") {
                    $this.prop('checked', properties.apply_to_first_page);
                }
                if (id === "form-specific-pages") {
                    $this.prop('checked', properties.apply_to_specific_page);

                    if (properties.apply_to_specific_page) {
                        $("#form_apply_from,#form_apply_to").slideDown();
                    } else {
                        $("#form_apply_from,#form_apply_to").slideUp();
                    }
                    if (typeof properties.specific_pages_from !== typeof undefined && properties.specific_pages_from !== false) {
                        $("#specific-pages-from").val(properties.specific_pages_from);
                    } else {
                        $("#specific-pages-from").val("");
                    }

                    if (typeof properties.specific_pages_to !== typeof undefined && properties.specific_pages_to !== false) {
                        $("#specific-pages-to").val(properties.specific_pages_to);

                    } else {
                        $("#specific-pages-to").val("");
                    }

                }

            });

            if (properties.header || properties.footer) {
                if (builder_mode === "web") {
                    $("#form_first_page,#form_last_page,#form_specific_pages").slideDown();
                }
            } else {
                $("#form_first_page,#form_last_page,#form_specific_pages").slideUp();
            }

            var limit_entry = $("#limit-switchers");
            limit_entry.find("#rows_number").hide();
            limit_entry.find("#dates").hide();
            limit_entry.find("#number").hide();
            limit_entry.find("#character").hide();

            /*
            *
            * url
            email
            domain — domain.com
            number — float/negative/positive/range/step
            date — yyyy-mm-dd (format can be customized, more information below)
            alphanumeric — with support for defining additional characters
            length — min/max/range
            required — no validation except that a value has to be given
            custom — Validate value against regexp


            text
            password
            date
            country
            homenumber
            worknumber
            mobilenumber
            phonenumber
            number
            email
            url
            iban"
            bic*/
            var $swi = $("#form_input_type select");
            var trim_data_validation = properties.data_validation.replace("required ", "");

            if (trim_data_validation.indexOf("number") === -1) {
                $swi.val(trim_data_validation).change();
            } else {
                if (properties.optional_if_answered === "cellphone, workphone, homephone") {
                    $swi.val($swi.find(".phonenumber").val()).change();
                } else {
                    $swi.val($swi.find("." + trim_data_validation).val()).change();
                }
            }
            // alert(properties.tag);
            if (properties.tag === "INggggPUT") {
                if (properties.type === "text" || properties.type === "email") {

                    limit_entry.find("#character").show();
                    if (properties.max_num !== "") {
                        limit_entry.find("#character").find("input[name='max-characters']").val(properties.max_num);
                        limit_entry.find("#character").find("input[name='min-characters']").val(properties.min_num);
                        $("#form-limit-entry").prop("checked", true).change();
                    } else {
                        $("#form-limit-entry").prop("checked", false).change();

                    }
                }
                else if (properties.type === "number") {
                    if (properties.data_validation.indexOf(","))
                        if (properties.max_chr !== "") {
                            limit_entry.find("#number").show();
                            limit_entry.find("#number").find("input[name='max-numbers']").val(properties.max_chr);
                            limit_entry.find("#number").find("input[name='min-numbers']").val(properties.min_chr);
                            $("#form-limit-entry").prop("checked", true).change();
                        } else {
                            $("#form-limit-entry").prop("checked", false).change();

                        }
                }
                else if (properties.type === "date") {
                    if (properties.max_chr !== "") {
                        limit_entry.find("#dates").show();
                        limit_entry.find("#dates").find("input[name='max-date']").val(properties.max_chr);
                        limit_entry.find("#dates").find("input[name='min-date']").val(properties.min_chr);
                        $("#form-limit-entry").prop("checked", true).change();
                    } else {
                        $("#form-limit-entry").prop("checked", false).change();

                    }
                }
                $("#form_input_type select").val(properties.type).change();
            }

            if (properties.tag === "FIELDSET" && $this.attr("rel") === "radio" || $this.attr("rel") === "checkbox") {
                /*
                                var getFirstOption = $this.find("."+$this.attr("rel")+"_input:first"),
                                    getWidth = getFirstOption.css("width");
                                var width = ( 100 * parseFloat(getFirstOption.css('width')) / parseFloat(getFirstOption.parent().css('width')) ) + '%';
                */

                $("#width_alignment input").val($this.attr("number-per-row")).change();


            }


            if ($this.tagName() === "FIELDSET" && $this.find("textarea").length > 0) {

                if (properties.max_height > 0 || properties.min_height > 0) {
                    limit_entry.find("#rows_number").show();
                    limit_entry.find("#rows_number").find("input[name='rows-limitaion']").val(properties.min_height);
                    limit_entry.find("#rows_number").find("input[name='rows-max-limitaion']").val(properties.max_height);
                    $("#form-limit-entry").prop("checked", true).change();
                } else {
                    $("#form-limit-entry").prop("checked", false).change();

                }
            }

            if ($this.hasClass("page-break")) {
                $("#page_size select").val(properties.page_size());
                $("#page_orientation select").val(properties.page_orientation());
                if (properties.page_background() !== "")
                    $("#page_background img").attr("src", properties.page_background());
            }

        }


    };

})(jQuery);

function isInteger(x) {
    return typeof x === "number" && isFinite(x) && Math.floor(x) === x;
}

function isFloat(x) {
    return !!(x % 1);
}

var systemClasses = [
        "v-print",
        "v-web",
        "v-popup",
        "text-editable",
        "element-editable",
        "selected-element",
        "columns",
        "",
        "ui-droppable",
        "ui-sortable",
        "row",
        "standard-row",
        "element-header",
        "element-footer",
        "form-control",
        "animated",
        "fadeIn",
        "resizable",
        "form-group",
        "ui-resizable",
        "ui-draggable",
        "element-hidden",
        "element-read-only",
        "element-requried",
        "element-unprintable",
        "apply_to_first_page",
        "apply_to_last_page",
        "apply_to_specific_pages"

    ],

    openVisible = function (styling) {

        var open = true;
        $("#accordion_columns_setting .item-title:visible").each(function () {
            // alert($(this).next().attr("id")+"/"+$(this).next().css("display"));

            if ($(this).next().css("display") === "block") {
                open = false;
                // $("#design_setting .item-title[section='properties']").click();

            }
        });
        if (open && styling) {
            $("#design_setting .item-title[section='styling']").click();
        }
    },

    manageHeadersFooters = function (builder_paper) {

        var JSON_MAP = {
            header_index: [],
            footer_index: [],
        };
        var getHeader = builder_paper.find(".element-header").not(".error_row"),
            getFooter = builder_paper.find(".element-footer").not(".error_row");

        if (getHeader.length > 0) {
            var header_height = getHeader.innerHeight(),
                apply_header_to_first = getHeader.hasClass("apply_to_first_page"),
                apply_header_to_last = getHeader.hasClass("apply_to_last_page"),
                apply_header_to_specific = getHeader.hasClass("apply_to_specific_pages");

            if (apply_header_to_first) {
                JSON_MAP.header_index.push("first");
            }

            if (apply_header_to_last) {
                JSON_MAP.header_index.push("last");
            }

            if (apply_header_to_specific) {
                var getFrom = parseInt(getHeader.attr("from")),
                    getTo = parseInt(getHeader.attr("to"));


                if (getTo >= getFrom) {
                    for (var ee = getFrom; ee <= getTo; ee++) {
                        JSON_MAP.header_index.push(ee);

                    }

                }
            }

        }
        if (getHeader.length > 0) {
            var footer_height = getFooter.innerHeight(),
                apply_footer_to_first = getFooter.hasClass("apply_to_first_page"),
                apply_footer_to_last = getFooter.hasClass("apply_to_last_page"),
                apply_footer_to_specific = getFooter.hasClass("apply_to_specific_pages");

            if (apply_footer_to_first) {
                JSON_MAP.footer_index.push("first");
            }

            if (apply_footer_to_last) {
                JSON_MAP.footer_index.push("last");
            }

            if (apply_footer_to_specific) {
                var getFrom = parseInt(getFooter.attr("from")),
                    getTo = parseInt(getFooter.attr("to"));


                if (getTo >= getFrom) {
                    for (var ee = getFrom; ee <= getTo; ee++) {
                        JSON_MAP.footer_index.push(ee);

                    }

                }
            }


        }


        return JSON_MAP;

    },

    printMode = function () {
    $(".replacable-panel .tools-list *[data-html='select-mode']").click();
        var builder_paper = $("#builder-mode > .builder-paper"), //from
            print_element = $("#print-mode"),
            default_size = $settings.settings().mainSize,
            getConversion = $("<div page-size='" + default_size + "' />").resize_page_constrain("page-size", 650);

        var default_width = getConversion.vertical_OnPage_width,
            default_height = getConversion.vertical_OnPage_height,
            default_orientation = "v",
            padding = 20,
            height_counter = "",
            background = "";

        print_element.find(".a4-page").remove(); //remove all pages from print mode

        var getHeight = 0;
        //get header and footer

        var first_page_break = builder_paper.find(".row").eq(0);
        var current_page = null;


        if (!first_page_break.hasClass("page-break")) {
            current_page = $("<div class='a4-page target-paper' />").css({
                "width": default_width + "px",
                "height": default_height + "px",
                "padding-top": padding + "px",
                "padding-bottom": padding + "px"
            });
            height_counter = default_height - (padding * 2);
            print_element.append(current_page);
        }
        var getHeader = builder_paper.find(".element-header").not(".error_row").eq(0),
            getFooter = builder_paper.find(".element-footer").not(".error_row").eq(0);

        // alert(getHeader.outerHeight());
        var current_page_content_height = 0;
        var HeadersFooters = manageHeadersFooters(builder_paper);
        builder_paper
            .find(".row")
            .not(".element-header")
            .not(".element-footer")
            .not(".error_row")
            .each(function (index) {

                padding = 20;
                if ($(this).hasClass("page-break")) {
                    padding = 20;
                    if ($(this).hasAttr("page-size")) {
                        var get_conversion = $(this).resize_page_constrain("page-size", 650);
                        if ($(this).hasAttr("page-orientation") && ($(this).attr("page-orientation") === "h" || $(this).attr("page-orientation") === "v")) {
                            default_orientation = $(this).attr("page-orientation");
                        }
                        if (default_orientation === "h") {
                            default_width = get_conversion.horizontal_OnPage_width;
                            default_height = get_conversion.horizontal_OnPage_height;
                        } else {
                            default_width = get_conversion.vertical_OnPage_width;
                            default_height = get_conversion.vertical_OnPage_height;
                        }


                    }
                    current_page = $("<div class='a4-page target-paper' />").css({
                        "width": default_width + "px",
                        "height": default_height + "px",
                        "padding-top": padding + "px",
                        "padding-bottom": padding + "px"
                    });
                    if ($(this).hasAttr("page-background") && $(this).attr("page-background") != "") {
                        background = $(this).attr("page-background");
                        current_page.css({
                            "background-image": "url("+background+")",
                            "background-size": "100% 100%"
                        })
                    }
                    height_counter = default_height - (padding * 2);
                    print_element.append(current_page);
                    current_page_content_height = 0;
                }

                if (current_page.index() === 1 && HeadersFooters.header_index.indexOf("first") !== -1) {
                    if (current_page.find(".element-header").length === 0) {
                        padding += getHeader.outerHeight();
                        current_page.css("padding-top", padding + "px");
                        current_page_content_height += padding;
                        height_counter -= current_page_content_height;

                        current_page.prepend(getHeader);
                        padding = 20;
                    }
                }


                if (current_page.index() === 1 && HeadersFooters.footer_index.indexOf("first") !== -1) {
                    if (current_page.find(".element-footer").length === 0) {
                        padding += getFooter.outerHeight();
                        current_page.css("padding-top", padding + "px");
                        current_page_content_height += padding;
                        height_counter -= current_page_content_height;

                        current_page.prepend(getFooter);
                        padding = 20;
                    }
                }


                if (HeadersFooters.header_index.indexOf(current_page.index()) !== -1) {
                    if (current_page.find(".element-header").length === 0) {
                        padding += getHeader.outerHeight();
                        current_page.css("padding-top", padding + "px");
                        current_page_content_height += padding;
                        height_counter -= current_page_content_height;

                        current_page.prepend(getHeader);
                        padding = 20;
                    }
                }


                if (HeadersFooters.footer_index.indexOf(current_page.index()) !== -1) {
                    if (current_page.find(".element-footer").length === 0) {
                        padding += getFooter.outerHeight();
                        current_page.css("padding-top", padding + "px");
                        current_page_content_height += padding;
                        height_counter -= current_page_content_height;

                        current_page.prepend(getFooter);
                        padding = 20;
                    }
                }


                if (!$(this).hasClass("element-unprintable")) {
                    var getClone = $(this);
                    getClone.find("fieldset[rel='button']").hide();
                    getClone.find("fieldset[rel='file']").hide();
                    getHeight = getClone.height();

                    if (getHeight >= height_counter) {
                        padding = 20;
                        current_page = $("<div class='a4-page target-paper' />").css({
                            "width": default_width + "px",
                            "height": default_height + "px",
                            "padding-top": padding + "px",
                            "padding-bottom": padding + "px"
                        });
                        height_counter = default_height - (padding * 2);

                        print_element.append(current_page);
                        current_page_content_height = 0;
                    }

                    height_counter -= getHeight;


                    current_page_content_height += getHeight;
                    current_page.append(getClone.clone());
                    current_page.find(".v-web").removeClass("v-web").addClass("v-print");

                    getClone.find("fieldset[rel='button']").show();
                    getClone.find("fieldset[rel='file']").show();
                }

            });

        print_element.find("*").each(function () {
            if($(this).hasAttr("print-style")){
                var printStyle = $(this).attr("print-style");
                $(this).attr("style",printStyle);
            }
        })

    },

    modeChange = function ($this) {
        var propertiesTab = $("div.item-title[section='properties'],div.tools-group[id='properties']");
        // $("div.item-title[section='properties']").hide();

        var id = $($this).attr("title"); //print-mode

        var lists = $(".replacable-panel"); //tools panel -> move delete select ....etc

        // $("#popup-btn").addClass("disabled-btn").removeClass("popup-btn");
        if (!$($this).hasClass("print-mode")) {
            $("#left-buttons button").removeClass("clicked-btn");
            $(".form-builder.modes").hide();
            $($this).addClass("clicked-btn");

        }
        $("#rows .row-item.popup-paper").hide();
        $("#rows .horizontal-divider.popup-paper").css("visibility", "hidden");

        var left = $('#left-panel').offset().left;  // Get the calculated left position
        var right = $('#right-panel').offset().right;  // Get the calculated left position
        var $to = 0, $fromC = "50%", $toC = "col-lg-6", $left_p_btns = "-69px", $left_btns = "0 0 0 41px";
        propertiesTab.hide();

        if ($($this).hasClass("print-mode")) {

            lists.find("> ul.tools-list").hide();
            lists.find("> ul.pages-list").show();

            builder_mode = "print";
            printMode();


            $("#left-buttons button").removeClass("clicked-btn");
            $(".form-builder.modes").hide();
            $($this).addClass("clicked-btn");
            $(".form-builder#" + id).show();


        }
        else if ($($this).hasClass("preview-modes")) {

            lists.find("> ul.tools-list").hide();
            lists.find("> ul.pages-list").hide();

            $to = "-30%";
            $fromC = "90%";
            $toC = "col-lg-11";
            $left_p_btns = "-67px";
            $left_btns = "0 -24px 0 41px";

            $(".form-builder#" + id).show();
        }
        else if ($($this).hasClass("popup-btn")) {
            builder_mode = "popup";
            // $("#popup-btn").removeClass("disabled-btn").addClass("popup-btn");
            $("#rows .row-item.popup-paper").show();
            $("#rows .horizontal-divider.popup-paper").css("visibility", "visible");

            lists.find("> ul.tools-list").show();
            lists.find("> ul.pages-list").hide();

            $(".form-builder#" + id).show();
            required_function();

        }
        else {
            builder_mode = "web";

            lists.find("> ul.tools-list").show();
            lists.find("> ul.pages-list").hide();


            $("#builder-mode").find(".v-print").removeClass("v-print").addClass("v-web");
            $("div.item-title[section='properties']").show();
            $(".form-builder#" + id).show();
            required_function();


        }

        var getWidth = $("#form-side");
        var width = (100 * parseFloat(getWidth.css('width')) / parseFloat(getWidth.parent().css('width'))) + '%';


        if (width !== $fromC) {

            $("#form-side").animate({"width": $fromC}, 100);

            $("#left-panel").animate({"left": $to}, 800);
            $("#right-panel").animate({"right": $to}, 800);
            $("#right-btns").animate({"margin-left": $left_p_btns}, 700);
        }


        // $("#form-side").replaceClass($fromC,$toC);

    },// to close and open modes buttons

    panelsButtons = function () {
        $("#left_buttons .open-button").on("click", function () {
            var id = $(this).attr("title");
            var array_all = $("#left_buttons .open-button").map(function () {
                if ($(this).attr("title") !== id) {
                    return $(this).attr("title");
                }
            })
                .get()
                .join(", ");

            if (id === "#design_setting" && $(".element-editable.selected-element").length === 0) {
                $(id).find(" > div").hide();

                $(id).find("#empty-msg").show();

                $(this).closePopenP(id, array_all);


            } else {
                $(this).closePopenP(id, array_all);
            }

        });
    },// to close and open left side buttons

    setFunctionsToHiddenInputs = function () {
        $("#accordion_columns_setting").makeAccordion();//To make tabs as accordion
        $("#accordion_columns_conditions").makeAccordion();//To make tabs as accordion


        $("#text_color").ColorPicker({
            color: "#ffffff",
            addClass: "ColorPickerFont",
            onShow: function (colpkr) {
                $(colpkr).fadeIn(200);
                return false;
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(200);
                return false;
            },
            onChange: function (hsb, hex, rgb) {

                $("input[type='hidden'][name='color']").val("#" + hex).change();
                $("#text_color").css("background-color", '#' + hex)
            }
        });
        $("#border_color").ColorPicker({
            color: "#ffffff",
            addClass: "ColorPickerBorder",

            onShow: function (colpkr) {
                $(colpkr).fadeIn(200);
                return false;
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(200);
                return false;
            },
            onChange: function (hsb, hex, rgb) {
                $("input[type='hidden'][name='border-color']").val("#" + hex).change();
                $("#border_color").css("background-color", '#' + hex)
            }
        });


        $("#edit_text_alignment").find("li").on("click", function () {
            var style = {'color': '#ffffff', 'background-color': '#436682', 'border-radius': '5px'};
            var emptystyle = {'color': '#436682', 'background-color': '#ffffff', 'border-radius': '5px'};

            $("#edit_text_alignment").find("li").css(emptystyle);
            $(this).css(style);
            $(this).parent().find("input").val($(this).attr("title")).change();
        });

        $("#floating").find("button").click(function () {

            $(this).parent().find("button").attr("style", "");


            $(this).attr("style", "background-color:#cfdae6 !important; color:#436682 !important;");

            $(this).parent().find("input").val($(this).val()).change();

        });

        $("#text_format").find("li").on("click", function () {

            var $this = $(this),
                $data_name = $this.attr('data-name'),
                get_value = $this.attr("data-target"),
                get_input = $this.parent().find("input[name='" + $data_name + "']"),
                $default = get_input.attr("placeholder"),
                style,
                emptystyle;

            if ($this.attr("id") === "text_color" || $this.parents("#form_font_family").length > 0) {
                style = {};
                emptystyle = {};
            } else if ($data_name === "hyberlink-write") {
                if ($this.find("input").val() !== "") {
                    style = {'color': '#ffffff', 'background-color': '#436682', 'border-radius': '5px'};
                    emptystyle = {'color': '#436682', 'background-color': '#ffffff', 'border-radius': '5px'};
                } else {
                    style = {};
                    emptystyle = {};
                }
            } else {
                style = {'color': '#ffffff', 'background-color': '#436682', 'border-radius': '5px'};
                emptystyle = {'color': '#436682', 'background-color': '#ffffff', 'border-radius': '5px'};

            }

            if ($data_name !== "text-indent") {
                if ($this.hasClass("multichoice")) {

                    $('li[data-name="' + $data_name + '"]').css(emptystyle)
                }

                if (get_input.val() === $default) {
                    get_input.val(get_value).change();
                    $this.css(style);
                } else {
                    if (get_value === get_input.val()) {
                        get_input.val($default).change();
                        $this.css(emptystyle);
                    } else {
                        get_input.val(get_value).change();
                        $this.css(style);
                    }
                }
            } else {
                get_input.val(get_value).change();
            }

        });

        $("#select-option-background_color_style").change(function () {
            var $live = {
                'style1': {key: "single", attrbute: "background-color", value: "#ffffff"},
                'style2': {
                    key: "radial",
                    attrbute: "background-image",
                    value: "-webkit-radial-gradient(white 0%, black 50%)"
                },
                'style3': {
                    key: "linear",
                    attrbute: "background-image",
                    value: "-webkit-linear-gradient(left, white 0%, black 50%)"
                },
                'style4': {
                    key: "linear",
                    attrbute: "background-image",
                    value: "-webkit-linear-gradient(90deg, white 0%, black 50%)"
                },
                'style5': {key: "transparent", attrbute: "background-color", value: "transparent"}
            };
            $('.color-rang').find('>div').hide();


            var getBackGround = function () {
                var $return = null;
                if (clicked.getCssStyle("background-image") !== "") {
                    $return = clicked.getCssStyle("background-image");
                } else if (clicked.getCssStyle("background-color") !== "") {
                    $return = clicked.getCssStyle("background-color").fullColorHex();
                } else {
                    $return = "";
                }
                return $return
            }
            var background = getBackGround(), css = "";


            var color_str;

            // alert(background.includes($live[this.value].key)+"\r\n"+$live[this.value].key+"/"+background);

            if ($live[this.value].attrbute === "background-image") {
                if (!background.includes($live[this.value].key)) {
                    clicked.addCss($live[this.value].attrbute, $live[this.value].value, builder_mode);

                    clicked.restoreValues();
                }
            } else {
                console.log(background);
                if (background != "" && this.value == "style5") {
                    clicked.removeCss("background-image");
                    clicked.removeCss("background-color");
                    clicked.removeCss("background");
                } else if (background.length !== 6 && this.value == "style1") {
                    clicked.addCss("background-color", "#ffffff");
                }
            }


            if (this.value !== "style5") {
                $('#' + this.value).show();
            }


            // $("#design_setting").find("input[name='background']").val(css).change();


        });

        $("#form_border").find("input").on("input", function () {


            var border_all = $("#form_border").find("input[name='border_all']").prop("checked");


            if (border_all && $(this).hasClass("width")) {
                $("#form_border_size").find("input[name!='border_all']").val(this.value).change();
            }


            if ($(this).attr("type") === "number" && $(this).prev('input').attr("type") === "range") {
                $(this).prev('input').val(this.value).change()
            } else if ($(this).attr("type") === "range" && $(this).next('input').attr("type") === "number") {
                $(this).next('input').val(this.value).change()
            }
        });

        var $url = $("#links").find("#getFieldsList").attr("content");


        $.get($url, function (data, status) {

            if (status.toString() === "success") {
                var availableWords = $.map(data, function (r) {
                    return r["field_name"];
                });

                $("#form_name").find("input").autocomplete({
                    appendTo: $("#form_name"),
                    source: availableWords,
                    select: function () {
                        $("#form_name").find("input").change();
                    },
                    change: function () {
                        $("#form_name").find("input").change();
                        saveCache();
                    }

                });
            }


        });


        $("#limit-switchers").find("input").change(function () {

            var $target = clicked.find(".prop-target").eq(0);
            if ($(this).attr("title") === "date-limitaion") {
                if ($target.attr("type") === "date") {
                    $target.attr($(this).attr("process"), this.value);

                }
            }
            else if ($(this).attr("title") === "number-limitaion") {
                if ($target.attr("type") === "number") {
                    $target.attr($(this).attr("process"), this.value);
                }
            }
            else if ($(this).attr("title") === "character-limitaion") {
                if ($target.attr("type") === "text" || $target.tagName() === "TEXTAREA") {
                    $target.attr($(this).attr("process"), this.value);
                }
            }
            else if ($(this).attr("title") === "rows-limitaion") {
                if ($target.tagName() === "TEXTAREA") {

                    // $target.attr($(this).attr("process"), this.value);


                    var toInt = parseInt(this.value),
                        calculate = toInt * 34;
                    clicked.find("textarea").addCss($(this).attr("process"), calculate + "px", "web");
                    clicked.find("textarea").addCss($(this).attr("process"), calculate + "px", "print");

                }
            }
        });


    },

    SetColorPickers = function (key, color) {
        if (key === "border") {
            $("#border_color").css("background-color", color.replace("#", ""));
            $(".ColorPickerBorder").find(".colorpicker_hex").find("input").val(color.replace("#", "")).change();


        }
        else if (key === "text") {

            $(".ColorPickerFont").find(".colorpicker_hex").find("input").val(color.replace("#", "")).change();
            $("#text_color").css("background-color", color);
        }
        else if (key === "background") {

            $(".background-single-color").find(".colorpicker_hex").find("input").val(color.replace("#", "")).change();
            $("#style1").css("background-color", color);
        }

    },

    runBackgroundOptions = function (options) {

        var color_array = [
            "white 0%", "#0000e8 100%"

        ];


        options = jQuery.extend({
            singleColor: "#ffffff",
            controlPoints: color_array,
            key: "all"
        }, options);

        console.log("controlPoints: " + options.controlPoints);

        var $background_el = $("#design_setting").find("input[name='background']");

        if (options.key === "all") {
            $("#style1").css("background-color", options.singleColor);

            $("#style1").ColorPicker({
                addClass: "background-single-color",
                color: options.singleColor,
                onShow: function (colpkr) {
                    $(colpkr).fadeIn(200);
                    return false;
                },
                onHide: function (colpkr) {
                    $(colpkr).fadeOut(200);
                    return false;
                },
                onChange: function (hsb, hex, rgb) {
                    $background_el.attr("data-html", "background-color");
                    $background_el.val("#" + hex).change();
                    $("#style1").css("background-color", '#' + hex)
                }
            });

            $("#style2").gradientPicker({
                type: "radial",
                change: function (points, styles) {
                    $background_el.attr("data-html", "background-image");
                    for (i = 0; i < styles.length; ++i) {
                        $background_el.val(styles[i]).change();

                    }
                },
                addClass: "style_radial_background_color_edit_panel",
                controlPoints: options.controlPoints
            });

            $("#style3").gradientPicker({
                change: function (points, styles) {
                    $background_el.attr("data-html", "background-image");
                    for (i = 0; i < styles.length; ++i) {
                        $background_el.val(styles[i]).change();
                    }
                },
                addClass: "style_hor_background_color_edit_panel",
                controlPoints: options.controlPoints
            });

            $("#style4").gradientPicker({
                change: function (points, styles) {
                    $background_el.attr("data-html", "background-image");
                    for (i = 0; i < styles.length; ++i) {
                        $background_el.val(styles[i]).change();
                    }
                },
                addClass: "style_ver_background_color_edit_panel",
                fillDirection: "90deg",
                controlPoints: options.controlPoints
            });
        }
        else if (options.key === "single") {
            $("#style1").html("").css("background-color", options.singleColor).ColorPicker({
                color: options.singleColor,
                onShow: function (colpkr) {
                    $(colpkr).fadeIn(200);
                    return false;
                },
                onHide: function (colpkr) {
                    $(colpkr).fadeOut(200);
                    return false;
                },
                onChange: function (hsb, hex, rgb) {
                    $background_el.attr("data-html", "background-color");

                    $background_el.val("#" + hex).change();
                    $("#style1").css("background-color", '#' + hex)
                }
            });
        }
        else if (options.key === "radial") {
            $(".style_radial_background_color_edit_panel").remove();
            $(".grad_ex#style2").remove();

            var newInstance = $("<div />").attr({
                class: "grad_ex",
                id: "style2"
            });

            $(".color-rang").append(newInstance);

            $("#style2").gradientPicker({
                type: "radial",
                change: function (points, styles) {
                    $background_el.attr("data-html", "background-image");

                    for (i = 0; i < styles.length; ++i) {
                        $background_el.val(styles[i]).change();
                    }
                },
                addClass: "style_radial_background_color_edit_panel",
                controlPoints: options.controlPoints
            });
        }
        else if (options.key === "hor") {
            $(".style_hor_background_color_edit_panel").remove();

            $(".grad_ex#style3").remove();


            var newInstance = $("<div />").attr({
                class: "grad_ex",
                id: "style3"
            });

            $(".color-rang").append(newInstance);

            $("#style3").gradientPicker({
                change: function (points, styles) {
                    $background_el.attr("data-html", "background-image");

                    for (i = 0; i < styles.length; ++i) {
                        $background_el.val(styles[i]).change();
                    }
                },
                addClass: "style_hor_background_color_edit_panel",
                controlPoints: options.controlPoints
            });

        }
        else if (options.key === "ver") {
            $(".style_ver_background_color_edit_panel").remove();
            $(".grad_ex#style4").remove();


            var newInstance = $("<div />").attr({
                class: "grad_ex",
                id: "style4"
            });

            $(".color-rang").append(newInstance);


            $("#style4").gradientPicker({
                change: function (points, styles) {
                    $background_el.attr("data-html", "background-image");

                    for (i = 0; i < styles.length; ++i) {
                        $background_el.val(styles[i]).change();
                    }
                },
                addClass: "style_hor_background_color_edit_panel",
                fillDirection: "90deg",
                controlPoints: options.controlPoints
            });


        }

    },

    onNameChange = function ($this) {
        var $this_value = this.value,
            clicked_id = clicked.attr("id"),
            tags = [
                "BUTTON",
                "FIELDSET",
                "FORM",
                "IFRAME",
                "INPUT",
                "MAP",
                "META",
                "OBJECT",
                "OUTPUT",
                "PARAM",
                "SELECT",
                "TEXTAREA"
            ];

        $(".element-editable").each(function () {
            if ($(this).attr("id") !== clicked_id) {
                if ($this_value === $(this).attr("title")) {
                    notification("", $(this).attr("id"));
                }
            }
        });
        if ($.inArray(clicked.tagName(), tags) !== -1) {
            clicked.attr({"title": $this.value, "name": $this.value});
            $("#elements-layers .row-list").find("#" + clicked.attr("id")).html($this.value);
        } else {
            clicked.attr({"title": $this.value});
            $("#elements-layers .row-list").find("*[title='" + clicked.attr("id") + "'] span").html($this.value)
        }


    },// function runs in combobox plugin file

    setDropdownFields = function () {
        $("#form_field_target select optgroup[label='Builder Fields'] option").remove();
        $("#form_field_target select optgroup[label='PopUp Fields'] option").remove();

        $("#select_fields optgroup[label='Builder Fields'] option").remove();
        $("#select_fields optgroup[label='PopUp Fields'] option").remove();

        $("#form_field_target option").remove();

        $("#builder-mode").find("fieldset").each(function () {
            var $attr = $(this).attr("primary-id");
            if (typeof $attr !== typeof undefined && $attr !== false) {

                var $name = $(this).attr("primary-id"),
                    $this = $(this).find('.prop-target'),
                    $type = "";
                if ($this.tagName() === "INPUT") {
                    $type = $this.attr('type');
                } else {
                    $type = "textarea";
                }

                $("#select_fields optgroup[label='Builder Fields'],#form_field_target select optgroup[label='Builder Fields']").append(
                    $("<option />").val($attr).text($attr + " (" + $type + ")")
                );
            }
        });

        $("#popups-page").find("fieldset").each(function () {
            var $attr = $(this).attr("primary-id");
            if (typeof $attr !== typeof undefined && $attr !== false) {

                var $name = $(this).attr("primary-id"),
                    $this = $(this).find('.prop-target'),
                    $type = "";
                if ($this.tagName() === "INPUT") {
                    $type = $this.attr('type');
                } else {
                    $type = "textarea";
                }

                $("#select_fields optgroup[label='PopUp Fields'],#form_field_target select optgroup[label='PopUp Fields']").append(
                    $("<option />").val($attr).text($attr + " (" + $type + ")")
                );
            }
        })

    },

    checker = function (target) {
        var element = $(target);
        var value = element.val();

        var forbiddenlist = ["-", "_", " ", "/", "\\", "|", "=", "*", "+", "@", "!", "#", "$", "%", "^", "&", "(", ")", ".", "{", "}", "[", "]", "<", ">", ",", "?", ";", ":"];


        $.each(forbiddenlist, function (index) {
            if (value.indexOf(forbiddenlist[index]) > 0) {
                element.val(value.replace(forbiddenlist[index], ""));
            }
        })
    },

    runEditPanel = function () {

        $("#design_setting").find("input,select").on("change", function () {
            saveCache();
        });
        $("body").on("click", ".replacable-panel > ul.pages-list li", function () {
            var MyContainerDiv = "#print-mode";
            $(MyContainerDiv).animate({scrollTop: $(MyContainerDiv).scrollTop() + ($(".a4-page:nth-child(" + ($(this).index() + 1) + ")").offset().top - 105)});
        });

        $('ul[role="tablist"] a').click(function (e) {
            e.preventDefault();
            $(this).tab('show')
        });

        $("#form_name").find("input")
            .on("keydown", function (e) {

                var forbiddenlist = [
                    32,
                    96,
                    97,
                    98,
                    99,
                    100,
                    101,
                    102,
                    103,
                    104,
                    105,
                    111,
                    106,
                    109,
                    107,
                    110,
                    57,
                    56,
                    55,
                    54,
                    53,
                    52,
                    51,
                    50,
                    49,
                    48,
                    186,
                    187,
                    188,
                    189,
                    190,
                    191,
                    219,
                    221,
                    220,
                    222
                ];

                if ($.inArray(e.which, forbiddenlist) !== -1) {
                    e.preventDefault();
                }


            })
            .on("change", function () {
                SOMTHING_CHANGED = true;

                var $this_value = this.value;
                var allow = false;

                $(".element-editable").each(function (index) {
                    if ($(this).attr("primary-id") === $this_value && $(this).attr('id') !== clicked.attr('id')) {
                        $(this).addClass(form - name - error);
                        notification("", "An item has the same ID please choose another");
                        setTimeout(function () {
                            $(this).removeClass("form-name-error");
                        }, 1000);
                        return false;
                    }

                    if ((index + 1) === $(".element-editable").length) {
                        allow = true;
                    }

                });

                if (allow) {

                    clicked.find("BUTTON:visible,INPUT:visible,SELECT:visible,TEXTAREA:visible").attr({"name": $this_value});

                    clicked.attr({"primary-id": $this_value});
                    setDropdownFields();

                }
                saveCache();
                renderConditions();
            });

        $(".dimensions").find("input").on('input', function () {
            if ($(".element-editable.selected-element").length > 0) {
                var prop = $(this).attr('name'), $value = $(this).val() + "px";
                clicked.addCss(prop, $value, builder_mode);
            }
        });

        $("#text_format").find("input").on('change', function () {
            if ($(".element-editable.selected-element").length > 0) {


                var prop = $(this).attr('name'), $value = $(this).val();
                if (prop === "font-size") {
                    $value = $value + "pt";
                } else if (prop === "text-indent") {
                    var $indent = parseInt(clicked.css('text-indent').replace("px", ""));
                    if ($value === "+30") {
                        $indent += 30;

                    } else {
                        if ($indent !== 0) {
                            $indent -= 30;
                        }
                    }
                    $value = $indent + "px";
                }

                clicked.addCss(prop, $value, builder_mode);


            }
        });

        $("#form_background_color").find("input").on('change', function () {


            if ($(".element-editable.selected-element").length > 0) {
                var prop = $(this).attr('data-html'), $value = $(this).val();
                // alert(clicked.tagName());


                if ($value === "transparent") {
                    clicked.removeCss(prop, builder_mode);

                } else {
                    if (prop === "background-color") {
                        clicked.removeCss("background-image", builder_mode);
                    } else {
                        clicked.removeCss("background-color", builder_mode);
                    }
                    if ($value.indexOf("-webkit") !== -1 || $value.indexOf(" ") === -1) {
                        clicked.addCss(prop, $("#form_background_color input[name='background']").val(), builder_mode);
                    }
                }
            }
        });

        $("#form_border").find("input").on('change', function () {


            var getAttr = $(this).attr("name");

            var border_radius = "",
                border_style = "",
                border_color = "",
                border_top = "",
                border_right = "",
                border_bottom = "",
                border_left = "",
                form_border = $("#form_border");


            border_radius = form_border.find("input[rule='border-radius']").val();
            border_style = form_border.find("input[rule='border-style']").val();
            border_color = form_border.find("input[rule='border-color']").val();
            // border_all = form_border.find("input[rule='all-width']").val();
            border_top = form_border.find("input[rule='top-width']").val();
            border_right = form_border.find("input[rule='right-width']").val();
            border_bottom = form_border.find("input[rule='bottom-width']").val();
            border_left = form_border.find("input[rule='left-width']").val();


            switch (getAttr) {
                case "border-style":
                    border_style = this.value;
                    break;
                case "border-color":
                    border_color = this.value;
                    break;
                case "border_radius":
                    border_radius = this.value;
                    break;
                case "top-width":
                    border_top = this.value;
                    break;
                case "bottom-width":
                    border_bottom = this.value;
                    break;
                case "right-width":
                    border_right = this.value;
                    break;
                case "left-width":
                    border_left = this.value;
                    break;


            }

            var border_array = {
                border_top: border_top + 'px ' + border_color + ' ' + border_style,
                border_right: border_right + 'px ' + border_color + ' ' + border_style,
                border_bottom: border_bottom + 'px ' + border_color + ' ' + border_style,
                border_left: border_left + 'px ' + border_color + ' ' + border_style,
                border_radius: border_radius + 'px'
            };


            if ($(".element-editable.selected-element").length > 0) {
                $.each(border_array, function (key, value) {
                    if (border_style !== "none") {
                        clicked.addCss(key.replace("_", "-"), value, builder_mode);
                    } else {
                        if (!clicked.hasClass("row") && !clicked.hasClass("columns")) {
                            clicked.addCss(key.replace("_", "-"), value, builder_mode);
                        } else {
                            clicked.removeCss(key.replace("_", "-"), builder_mode)
                        }
                    }

                })
            }
        });

        $("#properties .onoffswitch-checkbox").on('change', function () {
            if (clicked === 0) return;
            if (clicked.hasClass("page-break")) {
                notification("", "Page Break");
                return;
            }
            var $this = $(this),
                title = $this.attr("title"),
                id = $this.attr("id"),
                $rel = clicked.attr("rel"),
                divHeight = clicked.innerHeight();

            switch (id) {
                case "form-label":
                    if ($(this).is(':checked')) {
                        if (clicked.find("label[rel='" + $rel + "']").length === 0) {
                            clicked.prepend($("<label rel='" + $rel + "'/>").text("Title"));
                            $(".tools-list li[rel='" + id + "']").addClass("tools-list-active");

                        }
                    } else {
                        if (clicked.find("label[rel='" + $rel + "']").length === 1) {
                            clicked.find("label[rel='" + $rel + "']").eq(0).remove();
                            $(".tools-list li[rel='" + id + "']").removeClass("tools-list-active");

                        }

                    }
                    layers();
                    break;
                case "form-header":
                    if (clicked.hasClass("element-unprintable")) {
                        notification("", "Header and footer only allow for printable elements");
                        $(this).prop("checked", false);
                    } else {
                        var a4_padding_top, builder_paper = clicked.parent();
                        if ($(this).is(':checked')) {
                            if (builder_mode === "web") {
                                $("#form_first_page,#form_last_page,#form_specific_pages").slideDown();
                            }

                            if (divHeight > 200) {
                                notification("", "Header And Footer Must be equal or less than 200 Pixel to display in Print mode", "error");
                                clicked.addClass("error_row");
                            }

                            builder_paper.find("." + title).removeClass("error_row");
                            builder_paper.find("*").removeClass(title);

                            clicked.addClass(title);
                            clicked.removeClass("element-footer");
                            a4_padding_top = clicked.height() + "px";
                            $("#properties .onoffswitch-checkbox[id='form-footer']").prop('checked', false);


                        }
                        else {

                            $("#form_first_page,#form_last_page,#form_specific_pages").slideUp();
                            clicked.removeClass(title);
                            a4_padding_top = "0";
                        }
                        if (builder_mode === "popup") {
                            builder_paper.css("padding-top", a4_padding_top);
                        }
                    }


                    break;
                case "form-footer":
                    if (clicked.hasClass("element-unprintable")) {
                        notification("", "Header and footer only allow for printable elements");
                    } else {
                        var a4_padding_bottom, builder_paper = clicked.parent();
                        if ($(this).is(':checked')) {
                            if (builder_mode === "web") {
                                $("#form_first_page,#form_last_page,#form_specific_pages").slideDown();
                            }
                            if (divHeight > 200) {
                                notification("", "Header And Footer Must be equal or less than 200 Pixel to display in Print mode", "error");
                                clicked.addClass("error_row");
                            }


                            builder_paper.find("." + title).removeClass("error_row");
                            builder_paper.find("*").removeClass(title);
                            clicked.addClass(title);
                            clicked.removeClass("element-header");
                            a4_padding_bottom = clicked.height() + "px";
                            $("#properties .onoffswitch-checkbox[id='form-header']").prop('checked', false);
                        } else {
                            a4_padding_bottom = 0;
                            $("#form_first_page,#form_last_page,#form_specific_pages").slideUp();

                            clicked.removeClass(title);
                        }

                        if (builder_mode === "popup") {
                            builder_paper.css("padding-bottom", a4_padding_bottom);
                        }
                    }
                    break;
                case "form-first-page":
                    if ($(this).is(':checked')) {
                        $("#form-specific-pages").prop("checked", false);
                        $("#form_apply_from,#form_apply_to").slideUp();
                        clicked.addClass(title);
                        // clicked.removeClass("apply_to_last_page apply_to_specific_page");
                    } else {
                        clicked.removeClass(title);
                    }


                    break;
                case "form-last-page":
                    if ($(this).is(':checked')) {

                        $("#form-specific-pages").prop("checked", false);
                        $("#form_apply_from,#form_apply_to").slideUp();


                        clicked.addClass(title);
                        // clicked.removeClass("apply_to_first_page apply_to_specific_page");

                    } else {
                        clicked.removeClass(title);
                    }


                    break;
                case "form-specific-pages":
                    if ($(this).is(':checked')) {
                        $("#form-last-page,#form-first-page").prop("checked", false);
                        $("#form_apply_from,#form_apply_to").slideDown();

                        clicked.addClass(title);
                        // clicked.removeClass("apply_to_last_page apply_to_first_page");


                    } else {
                        $("#form_apply_from,#form_apply_to").slideUp();
                        clicked.removeClass(title);

                    }


                    break;
                case "form-read":
                    if ($(this).is(':checked')) {
                        clicked.find(".prop-target").prop('readonly', true);
                        $(".tools-list li[rel='" + id + "']").addClass("tools-list-active");
                    } else {
                        clicked.find(".prop-target").prop('readonly', false);
                        $(".tools-list li[rel='" + id + "']").removeClass("tools-list-active");

                    }


                    break;
                case "form-limit-entry":
                    if ($(this).is(':checked')) {
                        $("#form_limitaion").show();

                    } else {
                        $("#form_limitaion").hide();
                    }
                    break;
                case "form-required":
                    if ($(this).is(':checked')) {
                        if (clicked.find("input").hasAttr("data-validation")) {
                            var $get = clicked.find("input").attr("data-validation");
                            if ($get.indexOf("required") === -1) {
                                clicked.find("input").attr("data-validation", "required " + $get);
                            }
                        }
                        clicked.addClass(title);
                        $(".tools-list li[rel='" + id + "']").addClass("tools-list-active");
                    } else {
                        if (clicked.find("input").hasAttr("data-validation")) {
                            var $get = clicked.find("input").attr("data-validation").replace("required ", "");
                            clicked.find("input").attr("data-validation", $get);
                        }

                        clicked.removeClass(title);
                        $(".tools-list li[rel='" + id + "']").removeClass("tools-list-active");
                    }
                    break;
                default:
                    if ($(this).is(':checked')) {
                        clicked.addClass(title);
                        $(".tools-list li[rel='" + id + "']").addClass("tools-list-active");
                    } else {
                        clicked.removeClass(title);
                        $(".tools-list li[rel='" + id + "']").removeClass("tools-list-active");
                    }

            }
        });

        $("#specific-pages-from,#specific-pages-to").change(function () {
            var attr_name = "to";
            if (this.id.indexOf("from") !== -1) {
                attr_name = "from";
            }

            clicked.attr(attr_name, this.value);

        });

        $("#width_alignment input").on("input", function () {
            //div col-lg-6 checkbox_input
            var inputValue = this.value,
                $this = clicked,
                $width = 2,
                $key = $this.attr("rel"),
                $get_element = $this.find("div." + $key + "_input"),
                $this_class = "",
                all_class = $this.find("div." + $key + "_input").attr("class").split(" ");
            $.each(all_class, function () {
                if (this.startsWith("col-")) {
                    $this_class = this;
                }
            });
            // clicked.find("div." + $key + "_input").replaceClass($.trim($this_class), "col-lg-" + inputValue);
            if (inputValue == 0) {
                $width = "auto";
            } else {
                $width = (100 / inputValue) + "%";
            }
            clicked.find("div." + $key + "_input").css("width", $width);
            clicked.attr("number-per-row", inputValue);
        });


        $("#page_size select").on("change", function () {
            if (clicked == 0) return;

            clicked.attr("page-size", this.options[this.selectedIndex].text);
        });
        $("#page_orientation select").on("change", function () {
            if (clicked == 0) return;
            clicked.attr("page-orientation", this.value);
        });
        $("#page_background input").on("change", function () {
            if (clicked == 0) return;

            var file = this.files[0];
            // prints the base64 string
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                clicked.attr("page-background", reader.result);

            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };

        });

        $("#form_input_type select").on("change", function () {

            var $getInput = clicked.find("input");
            var $getCurrentValue = "";
            if ($getInput.hasAttr("data-validation")) {
                $getCurrentValue = $getInput.attr("data-validation");
            }
            var $getClass = $(this).attr("class");

            if ($getCurrentValue.indexOf("required") === -1) {
                $getInput.attr("data-validation", this.value);
            } else {
                $getInput.attr("data-validation", "required " + this.value);
            }


            var $oninput = clicked.find(".prop-target").eq(0).attr("oninput"),
                $onchange = clicked.find(".prop-target").eq(0).attr("onchange");

            if (this.value === "number") {

                if ($getClass === "number") {

                } else if ($getClass === "homenumber") {
                    $getInput.attr("data-validation-optional-if-answered", "homephone");
                } else if ($getClass === "worknumber") {
                    $getInput.attr("data-validation-optional-if-answered", "workphone");
                } else if ($getClass === "mobilenumber") {
                    $getInput.attr("data-validation-optional-if-answered", "cellphone");
                } else if ($getClass === "phonenumber") {
                    $getInput.attr("data-validation-optional-if-answered", "cellphone, workphone, homephone");
                } else {
                    $getInput.removeAttr("data-validation-optional-if-answered");

                    if (clicked.find(".prop-target").eq(0).hasAttr("oninput")) {
                        if ($oninput.indexOf("calculate") === -1) {
                            if ($oninput === "") {
                                clicked.find(".prop-target").eq(0).attr("oninput", "calculate();");
                            } else {
                                clicked.find(".prop-target").eq(0).attr("oninput", "calculate();" + $oninput);
                            }
                        }
                    } else {
                        clicked.find(".prop-target").eq(0).attr("oninput", "calculate();");
                    }
                }


            }

            else {
                $getInput.removeAttr("data-validation-optional-if-answered");
                clicked.find(".prop-target").eq(0).removeAttr("calculation");


                if (clicked.find(".prop-target").eq(0).hasAttr("oninput")) {

                    clicked.find(".prop-target").eq(0).attr("oninput", $oninput.replace("calculate();", ""));
                    clicked.find(".prop-target").eq(0).attr("onchange", $oninput.replace("calculate();", ""));
                }
            }
            clicked.filterPanel();
        });

        $("#copy_value select").on("change", function () {


            if (this.value === "none") {
                $("#copy_value select").find(":selected:not(option[value='none'])").prop("selected", false);
                clicked.find(".prop-target").eq(0).attr("oninput", "");
                clicked.find(".prop-target").eq(0).attr("onchange", "");
                clicked.find(".prop-target").eq(0).attr("data-html", "");
            } else {
                var getElements = [];
                var options = [];
                $("#copy_value select").find(":selected").each(function () {
                    options.push(this.value);
                    //oninput="$('fieldset[primary-id=\'first_name\'] input').val(this.value)"
                    getElements.push("fieldset[primary-id=\\'" + this.value + "\\'] .prop-target:first")

                });


                var onInput = "$('" + getElements.join(",") + "').val(this.value)";
                //var onInput = "alert(this.value)";

                // var $input = clicked.find(".prop-target").eq(0).attr("oninput"),$change = clicked.find(".prop-target").eq(0).attr("onchange");


                clicked.find(".prop-target").eq(0).attr("oninput", "calculate();" + onInput);
                clicked.find(".prop-target").eq(0).attr("onchange", "calculate();" + onInput);
                clicked.find(".prop-target").eq(0).attr("data-html", options.join(","));
            }


        });

        $("body").on('DOMSubtreeModified change', ".element-header,.element-footer", function (eve) {
            var $this = $(this);
            var builder_paper = $this.parent();
            var divHeight = $(this).innerHeight();

            if (divHeight <= 200) {

                $this.removeClass("error_row");
                if (builder_mode === "popup" && !$this.hasClass("ui-dragging")) {
                    if ($this.hasClass("element-header")) {
                        builder_paper.css("padding-top", divHeight);
                    } else {
                        builder_paper.css("padding-bottom", divHeight);
                    }

                }

            } else {
                $this.addClass("error_row");
            }

        });
        $("body").on('DOMSubtreeModified change', ".standard-row:not(.element-header):not(.element-footer)", function (eve) {
            var $this = $(this);

            if (!$this.hasClass("element-header") || !$this.hasClass("element-footer")) {
                var divHeight = $(this).innerHeight();

                if (divHeight <= 800) {

                    $this.removeClass("error_row");
                } else {
                    $this.addClass("error_row");
                }
            }

        });


    };

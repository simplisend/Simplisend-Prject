(function ($) {
    $.fn.resize_page_constrain = function (attr_name, new_width) {

        /*
                var $sizes = {
                    "A0": "9933 x 14043",
                    "A1": "7016 x 9933",
                    "A2": "4961 x 7016",
                    "A3": "3508 x 4961",
                    "A4": "2480 x 3508",
                    "A5": "1748 x 2480",
                    "A6": "1240 x 1748",
                    "A7": "874 x 1240",
                    "A8": "614 x 874",
                    "A9": "437 x 614",
                    "A10": "307 x 437"
                };
        */
        var $sizes = {
            "A0": "3178 x 4493",
            "A1": "2245 x 3178",
            "A2": "1587 x 2245",
            "A3": "1122 x 1587",
            "A4": "793 x 1122",
            "A5": "559 x 793",
            "A6": "396 x 559",
            "A7": "279 x 396",
            "A8": "196 x 279",
            "A9": "139 x 196",
            "A10": "98 x 139"
        };


        var getValue = $(this).attr(attr_name);
        if ($sizes[getValue] !== undefined && $sizes[getValue] !== "") {
            var $arg = $sizes[getValue].split("x"),
                $real_width = parseInt($arg[0].trim()),
                $real_height = parseInt($arg[1].trim()),
                $page_width = new_width,


                $get_height_percent_v = ($page_width / $real_width) * 100, //26.209677419354836%
                $get_fake_height_v = ($get_height_percent_v / 100) * $real_height; //919px


            var $get_height_percent_h = ($page_width / $get_fake_height_v) * 100, //70%
                $get_fake_height_h = ($get_height_percent_h / 100) * $page_width; //460px

            var vertical_real_size = $real_width + "x" + $real_height,
                horizontal_real_size = $real_height + "x" + $real_width;

            var vertical_fake_size = $page_width + "x" + $get_fake_height_v,
                horizontal_fake_size = $page_width + "x" + $get_fake_height_h;

            return {
                name: getValue,
                vertical_real_width: $real_width,
                vertical_real_height: $real_height,
                horizontal_real_width: $real_height,
                horizontal_real_height: $real_width,
                vertical_OnPage_width: $page_width,
                vertical_OnPage_height: $get_fake_height_v,
                horizontal_OnPage_width: $page_width,
                horizontal_OnPage_height: $get_fake_height_h,
            };
        } else {
            return "error";
        }

    }
    $.fn.hasAttr = function (attribute) {
        var $this = $(this);
        return typeof $this.attr(attribute) !== typeof undefined && $this.attr(attribute) !== false;
    };

})(jQuery);

jQuery(document).ready(function () {
    var $sizes = {
        "A0": "3178 x 4493",
        "A1": "2245 x 3178",
        "A2": "1587 x 2245",
        "A3": "1122 x 1587",
        "A4": "793 x 1122",
        "A5": "559 x 793",
        "A6": "396 x 559",
        "A7": "279 x 396",
        "A8": "196 x 279",
        "A9": "139 x 196",
        "A10": "98 x 139"
    };
    /*
        var $sizes = {
            "A0": "9933 x 14043",
            "A1": "7016 x 9933",
            "A2": "4961 x 7016",
            "A3": "1000 x 707",
            "A4": "1000 x 1414",
            "A5": "1748 x 2480",
            "A6": "1240 x 1748",
            "A7": "874 x 1240",
            "A8": "614 x 874",
            "A9": "437 x 614",
            "A10": "307 x 437"
        };
    */
    var FromJson = function (obj) {
            return JSON.stringify(obj).split('"').join("'").split("'[{").join("{").split("}]'").join("}");
        },

        ToJson = function (obj) {
            if (obj === "[]") {
                obj = "{}";
            }
            var $tojson = obj;
            $tojson = $tojson.split(":'").join(':"');
            $tojson = $tojson.split("':").join('":');
            $tojson = $tojson.split(",'").join(',"');
            $tojson = $tojson.split("',").join('",');
            $tojson = $tojson.split("{'").join('{"');
            $tojson = $tojson.split("'}").join('"}');


            try {
                return JSON.parse($tojson);
            } catch (e) {
                return JSON.parse("[]");
            }


        };


    //500 * 100 / 1000 = 50
    //50 / 100 * 1000 = 500

    var html = $("body");
//.col-	.col-sm-	.col-md-	.col-lg-	.col-xl-
    html.find(".columns").each(function () {
        var this_class = ($(this).attr("class").match(/(^|\s)col-\S+/g) || []).join(' ');
        var $getNumber = !isNaN(parseInt(this_class.replace("col-sm-", ""))) ? parseInt(this_class.replace("col-sm-", "")) : parseInt(this_class.replace("col-lg-", ""));
        var $replaceValue = "col-xl-" + $getNumber + " col-lg-" + $getNumber + " col-md-" + $getNumber;
        $(this).removeClass(this_class);
        switch ($getNumber) {
            case 1:
                $replaceValue = $replaceValue + " col-sm-2 col-3";
                break;
            case 2:
                $replaceValue = $replaceValue + " col-sm-3 col-4";
                break;
            case 3:
                $replaceValue = $replaceValue + " col-sm-4 col-6";
                break;
            case 4:
                $replaceValue = $replaceValue + " col-sm-4 col-12";
                break;
            case 5:
                $replaceValue = $replaceValue + " col-sm-5 col-12";
                break;
            case 6:
                $replaceValue = $replaceValue + " col-sm-6 col-12";
                break;
            case 7:
                $replaceValue = $replaceValue + " col-sm-7 col-12";
                break;
            case 8:
                $replaceValue = $replaceValue + " col-sm-8 col-12";
                break;
            case 9:
                $replaceValue = $replaceValue + " col-sm-9 col-12";
                break;
            case 10:
                $replaceValue = $replaceValue + " col-sm-10 col-12";
                break;
            case 11:
                $replaceValue = $replaceValue + " col-sm-11 col-12";
                break;
            case 12:
                $replaceValue = $replaceValue + " col-sm-12 col-12";
                break;
        }
        $(this).addClass($replaceValue);

    });
    html.find("fieldset").each(function () {
        var this_class = ($(this).attr("class").match(/(^|\s)col-\S+/g) || []).join(' ');
        $(this).removeClass(this_class);
        $(this).addClass(this_class.replace("sm", "lg") + " col-md-12 col-xs-12");

        if ($(this).hasClass("elemen55t-requried")) {
            $(this).find("input").each(function () {
                var $getVali = $(this).attr("data-validation");
                if ($getVali.indexOf("requried") === -1) {
                    $(this).attr("data-validation", $getVali + " requried");
                }
            })
        }
    });


    html.find("input").each(function () {
        if ($(this).hasAttr("json-get-data")) {
            var extractAttr = $(this).attr("json-get-data");
            var first_json = ToJson(extractAttr);
            $("input[name='" + first_json.level4 + "']").on("change", function () {
                var spliteToArray = first_json.level5.split(",");
                if (!spliteToArray.includes(this.value)) {
                    $(this).parent().addClass("has-error")
                }

            }).on("input", function () {
                $(this).parent().removeClass("has-error")

            })
            //{'level1':'12','level2':'1543917808594','level3':'1544089385363','level4':'texttwo','level5':'777,888,555,224'}
            // alert(first_json['level4'])
        }
    })
    html.find("fieldset[rel='signature']").each(function (index) {
        var mainElement = $(this);
        var $this_el = mainElement.find(".sign-start");
        var $getLabel = mainElement.find("label");
        var $sign_hint = mainElement.find(".sign-hint");
        var $button = mainElement.find("button[type='button']");
        var $title = $this_el.attr("title");


        var len = $(".sign-start").length;
        $(this).html("");

        var signatrue_el_a, signatrue_el_b, signatrue_el_c;

        signatrue_el_a = $("<div></div>").addClass("sign-start").attr("title", "signature-pad-" + len)
            .append($sign_hint,
                $("<div></div>").addClass("written-signatrue").append($("<h2></h2>")).hide(),
                $("<img>").addClass("image-drew-signatrue").attr("src", "").hide());

        signatrue_el_b = $("<div></div>").addClass("signature-line").attr("style", "padding: 0 30px 0 0;margin: 0 auto 42px auto")
            .append($("<span class='text-uneditable'></span>"));

        signatrue_el_c = $button;


        mainElement.append($getLabel, signatrue_el_a, signatrue_el_b, signatrue_el_c).clone();


        var signatureELMS = $(this);

        signatureELMS.find("button").on("click", function () {
            signatureELMS.find(".sign-hint").show();
            signatureELMS.find("h2").text("").hide();
            signatureELMS.find(".image-drew-signatrue").attr("src", "").hide();
        });


        var signatrue_pad = function () {
            return $("<div></div>")
                .addClass("signature-pad-popup")
                .attr("id", "signature-pad-" + len).hide()
                .append(
                    $("<div class='signature-pad-main' id='signature-embed-" + len + "'></div>")
                        .append(
                            $("<div class='signature-pad'></div>")
                                .append(
                                    $("<div class='signature-pad--body'></div>")
                                        .append(
                                            $("<canvas></canvas>").mousedown(function () {
                                                $(this).next('.signature-hint').hide()
                                            }),
                                            $("<div class='signature-hint'><div>Drew Your Signature Here</div></div>"),
                                            $("<div class='signature-text'><input type='text' maxlength='40' placeholder='Write Your Name Here' id='signature-name-" + len + "'></div>"),
                                            $("<div class='signature-image' style='display: none'><img src='/images/choose.png' id='image-" + len + "'></div>"),
                                            $("<div class='signature-line'><span></span></div>")
                                        ),
                                    $("<div class='signature-pad--footer'></div>")
                                        .append(
                                            $("<div class='signature-pad--actions'></div>")
                                                .append($("<button data-html='clear' class='button clear'>Clear</button>").click(function () {
                                                    $('.signature-hint').show();
                                                }))
                                        )
                                ),
                            $("<div class='signature-pad-btns'></div>")
                                .append(
                                    $("<ul class='signature-pad-btns-left' id='btns-list-" + len + "' style='display: inline;'></ul>")
                                        .append(
                                            $("<li title='drewit' class='clicked'><i class='icons icons-signature'></i></li>"),
                                            $("<li title='writeit'><i class='icons icons-text'></i></li>"),
                                            $("<li title='image'><i class='icons icons-image'></i></li>"),
                                            $("<input type='file' title='image-" + len + "' accept='image/*'>").change(function (e) {
                                                var img_el = $("#" + $(this).attr("title"));
                                                var reader = new FileReader();
                                                reader.onload = function (e) {
                                                    img_el.attr('src', e.target.result);
                                                };
                                                reader.readAsDataURL(this.files[0]);
                                            }).hide()
                                        ),
                                    $("<ul class='signature-pad-btns-right' style='display: inline;'></ul>")
                                        .append(
                                            $("<li></li>").append($("<button class='button save' data-action='save-sign'>Ok</button>")),
                                            $("<li></li>").append($("<button class='button cancel' data-action='save-png'>Cancel</button>").click(function () {
                                                $('.signature-pad-popup').fadeOut();
                                            }))
                                        ),
                                )
                        )
                );

        };


        $("#btns-list-" + len).find('li').on("click", function () {
            $(this).parent().find('.clicked').removeClass('clicked');
            $(this).addClass('clicked');
            $(this).parents(2).find(".signature-text").find("input").val("");
            $(this).parents(2).find(".signature-image").find("input").val("");
            $(this).parents(2).find("button[data-action='clear']").click();


            if ($(this).attr("title") === "drewit") {

                $(this).parents(2).find("canvas").css("pointer-events", "");
                $(this).parents(2).find(".signature-hint").fadeIn();
                $(this).parents(2).find(".signature-line").fadeIn();
                $(this).parents(2).find(".signature-text").fadeOut();
                $(this).parents(2).find(".signature-image").fadeOut();
                $(this).parents(2).find(".signature-pad--footer").fadeIn();


            } else if ($(this).attr("title") === "writeit") {
                $(this).parents(2).find("canvas").css("pointer-events", "none");
                $(this).parents(2).find(".signature-hint").fadeOut();
                $(this).parents(2).find(".signature-pad--footer").fadeOut();
                $(this).parents(2).find(".signature-image").fadeOut();
                $(this).parents(2).find(".signature-text").fadeIn();
                $(this).parents(2).find(".signature-line").fadeIn();

            } else {
                //alert($(this).attr("title"));
                $(this).parents(2).find("canvas").css("pointer-events", "none");
                $(this).next("input").click();
                $(this).parents(2).find(".signature-pad--footer").fadeOut();
                $(this).parents(2).find(".signature-line").fadeOut();
                $(this).parents(2).find(".signature-hint").fadeOut();
                $(this).parents(2).find(".signature-text").fadeOut();
                $(this).parents(2).find(".signature-image").fadeIn();

            }

        });

        var input_name_element = $("#signature-name-" + len);
        input_name_element.on("keydown", function (e) {
            const key = event.key; // const {key} = event; ES6+
            var keyCode = (e.keyCode ? e.keyCode : e.which);

            if (keyCode > 47 && keyCode < 58 || keyCode > 95 && keyCode < 107) {
                e.preventDefault();
            } else {
                var text = $(this).val();
                var fontsize = parseInt($(this).css("font-size").replace("px", ""));
                if (key === "Backspace" || key === "Delete") {
                    if (text.length > 25) {
                        if (text.length < 40) {
                            fontsize += 1;
                        }
                    } else {
                        fontsize = 30;
                    }
                } else {
                    if (text.length > 25) {
                        if (text.length < 40) {
                            fontsize -= 1;
                        }
                    } else {
                        fontsize = 30;
                    }
                }

                $(this).css("font-size", fontsize);
            }
        });
        input_name_element.on("keypress", function (e) {
            var englishAlphabetAndWhiteSpace = /^[-@./#&+\w\s]*$/;
            var key = String.fromCharCode(event.which);


            if (event.keyCode == 8 || event.keyCode == 37 || event.keyCode == 39 || englishAlphabetAndWhiteSpace.test(key)) {
                return true;
            }
            return false;
        });
        input_name_element.on("input", function (e) {
            var text = $(this).val();


        });
        input_name_element.on("paste", function (e) {
            e.preventDefault();
        });

        mainElement.on("click", function () {
            $('#' + $(this).find(".sign-start").attr('title')).fadeIn();
            SignatureOn("signature-embed-" + len, $(this));

        });

        html.append(signatrue_pad());


    }); //render signatures elements


    $("input[type='checkbox'],input[type='radio']").on("change", function () {
        onFormUpdate();
    });
    $("input[type!='checkbox'],input[type!='radio'],textarea").on("input", function () {
        onFormUpdate();
    });


    $("#preview").click(function () {
        changeMode(false);
    })


    $("#save-pdf").click(function () {
        $("#loading").show();

        changeToImages();
    })


    var setPageSetting = function (wrap_page, current_page, default_width, default_height, default_orientation) {
        if (default_orientation == "h") {

            wrap_page.css({
                "width": default_height + "px",
                "height": default_width + "px",
            });
            current_page.css({
                "width": wrap_page.outerHeight() + "px",
                "height": wrap_page.outerWidth() + "px",
                "transform": "rotate(90deg)",
                "-webkit-transform": "rotate(90deg)",
                "-moz-transform": "rotate(90deg)",
                "filter:progid": "DXImageTransform.Microsoft.BasicImage(rotation=3)",
                "transform-origin": "center center",
                "transform-style": "preserve-3d",
                "position": "absolute",
                "top": "14.6%",
                "left": "-20.7%",
            });
        }


    }


    var manageHeadersFooters = function (builder_paper) {

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
        changeMode = function (d) {

            if (d) {
                $("#application-form").fadeOut();
                $("#print").hide();
                $("#preview").show();
                $("#save-pdf").show();
                $("#print-here").show();
            } else {
                $("#print").show();
                $("#preview").hide();
                $("#print-here").hide();
                $("#save-pdf").hide();

                $("#application-form").fadeIn();

            }
        },
        printMode = function () {
            // var $style = "@media print {";
            var $style = "";

            var builder_paper = $("#application-form"), //from
                print_element = $("#print-here"),
                default_size = $settings.settings.mainSize !== "" ? $settings.settings.mainSize : "A4",
                getSizes = $sizes[default_size].split(" x "),
                getConversion = $("<div page-size='" + default_size + "' />").resize_page_constrain("page-size", parseInt(getSizes[0]));

            $("input[name='pageSize']").val(default_size);

            var default_width = getConversion.vertical_real_width,
                default_height = getConversion.vertical_real_height,
                default_orientation = "v",
                padding = 20,
                height_counter = "",
                background = "";

            print_element.find(".a4-page").remove(); //remove all pages from print mode

            var getHeight = 0;
            //get header and footer

            var first_page_break = builder_paper.find(".row").eq(0);
            var current_page = null;
            var wrap_page = null;


            if (!first_page_break.hasClass("page-break")) {
                wrap_page = $("<div class='a4-page target-paper' />").css({
                    "width": default_width + "px",
                    "height": default_height + "px",
                    "padding-top": 0,
                    "padding-bottom": 0,
                    "position": "relative",
                    "overflow": "hidden"
                });

                wrap_page.attr({
                    "page-size": default_size,
                    "page-orientation": default_orientation,
                    "id": "pages_" + $(".a4-page").length
                });
                current_page = $("<div class='inside-page'/>").css({
                    "width": default_width + "px",
                    "height": default_height + "px",
                    "padding-top": padding + "px",
                    "padding-bottom": padding + "px",
                    "overflow": "hidden",
                    "position": "relative"
                });

                wrap_page.append(current_page);
                height_counter = default_height - (padding * 2);
                print_element.append(wrap_page);
                setPageSetting(wrap_page, current_page, default_width, default_height, default_orientation);

                // $style =
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
                        // default_size = ($(this).hasAttr("page-size") && $(this).attr("page-size") !== "") ? $(this).attr("page-size") : "A4";
                        default_orientation = ($(this).hasAttr("page-orientation") && $(this).attr("page-orientation") !== "") ? $(this).attr("page-orientation") : "v";

                        // var getSizes = $sizes[default_size].split(" x ");
                        // var getConversion = $(this).resize_page_constrain("page-size", parseInt(getSizes[0]));


                        if (default_orientation === "h") {
                            // alert("h")
                            default_width = getConversion.horizontal_real_width;
                            default_height = getConversion.horizontal_real_height;
                        } else {
                            // alert("v")
                            default_width = getConversion.vertical_real_width;
                            default_height = getConversion.vertical_real_height;
                        }


                        wrap_page = $("<div class='a4-page target-paper' />").css({
                            "width": default_width + "px",
                            "height": default_height + "px",
                            "padding-top": 0,
                            "padding-bottom": 0,
                            "position": "relative",
                            "overflow": "hidden"
                        });

                        wrap_page.attr({
                            "page-size": default_size,
                            "page-orientation": default_orientation,
                            "id": "pages_" + $(".a4-page").length
                        });
                        current_page = $("<div class='inside-page'/>").css({
                            "width": "100%",
                            "height": "100%",
                            "padding-top": padding + "px",
                            "padding-bottom": padding + "px",
                            "overflow": "hidden",
                            "position": "relative"
                        });

                        height_counter = default_height - (padding * 2);

                        if ($(this).hasAttr("page-background") && $(this).attr("page-background") != "") {
                            background = $(this).attr("page-background");
                            current_page.css({
                                "background-image": "url(" + background + ")",
                                "background-size": "100% 100%"
                            })
                        }
                        wrap_page.append(current_page);

                        print_element.append(wrap_page);


                        current_page_content_height = 0;
                        setPageSetting(wrap_page, current_page, default_width, default_height, default_orientation);

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


                    if (!$(this).hasClass("element-unprintable") && !$(this).hasClass("page-break")) {
                        var getClone = $(this);
                        getClone.find("fieldset[rel='button']").hide();
                        getClone.find("fieldset[rel='file']").hide();
                        getHeight = getClone.height();


                        if (getHeight >= height_counter) {


                            padding = 20;
                            wrap_page = $("<div class='a4-page target-paper' />").css({
                                "width": default_width + "px",
                                "height": default_height + "px",
                                "padding-top": 0,
                                "padding-bottom": 0,
                                "position": "relative",
                                "overflow": "hidden"

                            });

                            wrap_page.attr({
                                "page-size": default_size,
                                "page-orientation": default_orientation,
                                "id": "pages_" + $(".a4-page").length
                            });
                            current_page = $("<div class='inside-page'/>").css({
                                "width": "100%",
                                "height": "100%",
                                "padding-top": padding + "px",
                                "padding-bottom": padding + "px",
                                "overflow": "hidden",
                                "position": "relative"
                            });

                            height_counter = default_height - (padding * 2);
                            wrap_page.append(current_page);

                            print_element.append(wrap_page);
                            current_page_content_height = 0;
                            setPageSetting(wrap_page, current_page, default_width, default_height, default_orientation);

                        }

                        height_counter -= getHeight;


                        current_page_content_height += getHeight;
                        current_page.append(getClone.clone());
                        current_page.find(".v-web").removeClass("v-web").addClass("v-print");
                        // alert(this.id+"/"+current_page_content_height)
                        getClone.find("fieldset[rel='button']").show();
                        getClone.find("fieldset[rel='file']").show();
                    }

                });


            print_element.find("dpre").each(function (index) {
                if ($(this).hasClass("a4-page")) {

                    $style += ".a4-page[page-size='" + $(this).attr('page-size') + "'] {\n";

                    /*
                                        $style += "}\r\n";

                                        $style += "#" + this.id + "{\n";
                    */
                    /*
                                        if ($(this).attr("page-size") !== "") {
                                            default_size = $(this).attr("page-size");
                                        }
                    */

                    var $size = $sizes[default_size].split(" x ");
                    var $width = $size[0] + "px";
                    var $height = $size[1] + "px";

                    $style += "size:" + $(this).attr('page-size') + ";\n";
                    if ($(this).attr('page-orientation') === "v") {
                        $style += "width:" + $width + " !important;\n";
                        $style += "height:" + $height + " !important;\n";
                    } else {
                        $style += "width:" + $height + " !important;\n";
                        $style += "height:" + $width + " !important;\n";
                    }
                    if ($(this).css("background-image") === "none") {
                        $style += "background-image:" + $(this).css("background-image") + ";\n";
                        $style += "background-size:100% 100%;\n";
                    }
                    $style += "}\r\n";
                }
                if ($(this).hasAttr("print-style")) {
                    var printStyle = $(this).attr("print-style");
                    $(this).attr("style", printStyle);
                }
            });
            $style += "";


            print_element.find("*").each(function () {
                if ($(this).hasAttr("print-style")) {
                    var printStyle = $(this).attr("print-style");
                    $(this).attr("style", printStyle);
                }
            })
            changeMode(true);
            $("#loading").hide();


        },
        images = [],
        changeToImages = function () {
        var count_array = $("#print-here .a4-page").length;
            if ($("#print-here > img").length === 0) {
                $("#print-here .a4-page").each(function (index) {
                    $(".image-drew-signatrue").map(function () {
                        if ($(this).attr("src") === "") $(this).remove();
                    })
                        // alert($(this).css("background-color").substr(0,12))
                    var background = $(this).find(".inside-page").css("background");
                    // console.log(background)
                    if ($(this).find(".inside-page").css("background-color").substr(0, 12) == "rgba(0, 0, 0" && $(this).find(".inside-page").css("background-image") == "none") {
                        background = "#ffffff"
                    }

                    if (background.substr(0, 1) !== "#" && background.substr(0, 1) !== "r") {
                        background = $(this).find(".inside-page").css("background-image");
                        background = background.substr(5, background.length - 7);
                    }

                    // alert(background.substr(0,1));

                    var clone = document.getElementsByClassName("inside-page")[index];

                    var $this = $(this);


                    domtoimage.toPng(clone).then(function (blob) {

                        var img = new Image();

                        img.src = blob;
                        images.push(blob);
                        $this.html(img);
                        $this.find("img").unwrap();

                        if (images.length === count_array) {
                            savePdf();
                        }

                    }).catch(function (error) {
                        console.error('oops, something went wrong!', error);
                    });


                })

            } else {
                savePdf();
            }

        },
        savePdf = function () {
            var _images = [],
                default_size = $settings.settings.mainSize !== "" ? $settings.settings.mainSize : "A4",
                getSizes = $sizes[default_size].split(" x ");

            // var doc = new jsPDF();

            var i;
            for (i = images.length-1; i >= 0; i--) {


                // doc.addImage(images[i], "JPEG", 0, 0, parseFloat(getSizes[0]), parseFloat(getSizes[1]), "", "SLOW", 0);


                _images.push({
                    data: images[i],
                });
            }

            // doc.save("dsdsdsds");


            $("form input[name='data']").val(JSON.stringify(_images));

            $("#savepdf").submit();
            $("#loading").hide();

        };


    $("#print").on("click", function () {
        // $("#print-style").html("");
        // $("button[data-target='.print-screen']").click();

        $("#loading").show();
        printMode();

        //popitup();
    });


});


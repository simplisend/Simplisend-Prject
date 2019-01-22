var formTarget = $(".a4-page"),
    formRows = $(".row"),
    $norification_alert = $("#norification-alert"),
    $loader = $("#wait-loading"),
    lastClick = 0,
    clicked = 0,
    tag,
    builder_mode = "web",
    allow_select = true,
    body_event = null,
    allow_edit = false,
    SOMTHING_CHANGED = false,
    $dir = "ltr",
    open_categories_mode = "link-form",//to select if open form to edit or insert one for linking
    eventProccessing,
    selectedLanguage_a = $(".selection[title='selected-languages-a']").val(),
    selectedLanguage_b = $(".selection[title='selected-languages-b']").val(),
    rows_class_accept = ".builder_paper";


var readContent = function (event) {
        allow_edit = false;
        clicked = $(event.target);
        saveCache();
        if (clicked.hasAttr("class")) {
            if (!clicked.hasClass("element-editable") && !clicked.attr("class").includes("select")) {
                if(clicked.hasClass("page-break") && !clicked.hasClass("row")){
                    clicked.closest(".row.page-break").click();
                    //unused condition
                }else{
                    clicked = 0;
                    clearEvents();
                    lastClick = 0;
                }
                return;
            }
        } else {
            clicked = 0;
            clearEvents();
            lastClick = 0;


            return;
        }



        tag = event.target.nodeName;
        $("#element-name").text(typeof clicked.attr("title") !== typeof undefined && clicked.attr("title") !== false ? clicked.attr("title") : tag);


        if (event.ctrlKey) {
            var first_select = $(".selected-element:first-child");

            if (first_select.hasClass("text-editable") && clicked.hasClass("text-editable")) {
                clicked.addClass("selected-element");
            } else {
                notification("", "You can select multiple only text elements");
            }
        } else if (lastClick !== clicked.attr("id")) {
            $(".text-editable").attr('contentEditable', 'false');


            clearEvents();
            clicked.addClass("selected-element");


            $("#left_buttons .open-button").eq(2).click();

            clicked.restoreValues_advanceController();
            clicked.restoreValues();
            clicked.filterPanel();

            var $target = clicked.hasClass("popup-content") ? $(".layers div[title='" + clicked.parent().attr('id') + "']") : $(".layers div[title='" + clicked.attr('id') + "']");

            if ($target.length === 0) {
                $target = $(".layers div[title='" + clicked.parents("fieldset").attr('id') + "']");
            }

            $(".layers .selected-element").removeClass("selected-element");
            $(".layers .list-target").hide();
            $target.addClass("selected-element").parents("ul").show();

            // alert($("#elements-layers").find("ul:first-child").innerHeight());

            if ($("#elements-layers").find("ul:first-child").innerHeight() > 277 && $target.length !== 0) {
                var MyContainerDiv = "#panel_contents";

                $(MyContainerDiv).animate({scrollTop: $(MyContainerDiv).scrollTop() + ($target.offset().top - $(MyContainerDiv).offset().top - 100)});

                // $("#panel_contents").scrollTo(".layers div[title='" + clicked.attr('id') + "']", 700);
            }

            var mainlang = $("select.selection[title='selected-languages-a']");
            var lang = $("select.selection[title='selected-languages-b']");

            lang.val(mainlang.val()).change();


        }


        lastClick = typeof clicked.attr("id") !== typeof undefined && clicked.attr("id") !== false ? clicked.attr("id") : clicked.parent().attr("id");

        $("#design_setting").find(" > div").show();

        $("#design_setting").find("#empty-msg").hide();


        allow_edit = true;
    },

    clearEvents = function () {
        $("#form-side .selected-element").removeClass("selected-element");

        var lastClicked = $("#" + lastClick);
        // $("#builder-mode").find(".text-editable").attr("contenteditable", "false");
        if (lastClicked.hasClass("text-editable")) {
            if (lastClicked.text() === "") {
                lastClicked.text("Null");
            }
        }
        $("#elements-layers .row-list ul").hide();
        $("#elements-layers .selected-element").removeClass("selected-element");
        $("#design_setting").find(" > div").hide();

        $("#design_setting").find("#empty-msg").show();

    },

    notification = function (_title, _text, _type = "info", aclass = "") {
        //success,info,error

        var $type = $norification_alert.find(".ui-pnotify-shadow");
        $type.removeClass($type.attr("class").match(/(^|\s)alert\S+/g).toString().replace(" ", ""));
        $type.addClass("alert-" + _type);
        $type.addClass(aclass);
        $norification_alert.find(".ui-pnotify-text").text(_text);
        $norification_alert.find(".ui-pnotify-title").text(_title);

        $norification_alert.fadeIn();

        setTimeout(function () {
            $norification_alert.fadeOut();
        }, 5000);
    },

    remoteDevices = function () {
        $("#preview_sizes").on('input', function () {
            let device_frame = $("#device-frame");

            switch (this.value) {
                case "0":
                    device_frame.css("width", "40%");
                    break;
                case "1":
                    device_frame.css("width", "50%");
                    break;
                case "2":
                    device_frame.css("width", "60%");
                    break;
                case "3":
                    device_frame.css("width", "70%");
                    break;
                case "4":
                    device_frame.css("width", "80%");
                    break;
                case "5":
                    device_frame.css("width", "90%");
                    break;
                default:
                    device_frame.css("width", "100%");

            }
        });

        $("#preview").click(function () {
            var frame = $("#device-frame").contents();
            var html_backup = $("#html_preview");
            var draftElement = $("#copy_to_store");

            fillSavingForm("#html_preview");

            frame.find("html").html("");

            var html = $("#builder-mode").clone();

            html = removeHelpers(html, "print");
            html.find(".columns").each(function () {
                var this_class = ($(this).attr("class").match(/(^|\s)col-\S+/g) || []).join(' ');
                $(this).removeClass(this_class);
                if (this_class === "col-sm-12") {
                    $(this).addClass(this_class.replace("sm", "lg") + " col-md-12 col-xs-12");
                } else {
                    $(this).addClass(this_class.replace("sm", "lg") + " col-md-6 col-xs-12");

                }
            });
            html.find("fieldset").each(function () {
                var this_class = ($(this).attr("class").match(/(^|\s)col-\S+/g) || []).join(' ');
                $(this).removeClass(this_class);
                $(this).addClass(this_class.replace("sm", "lg") + " col-md-12 col-xs-12");
            });


            frame.find("body").append($('<div>').append($('#html_preview').clone()).html());
            frame.find("body").find("#html_preview").submit();


        })


    },//to preview form in devices sizes screens

    makeDrop = function () {

        $('.selection').each(function (index) {
            var $this = $('.selection').eq(index),
                numberOfOptions = $('.selection').eq(index).children('option').length,
                key = $('.selection').eq(index).attr("title");

            if ($this.parent().hasClass("select")) {

                var getClone = $this.clone().removeClass("select-hidden").insertAfter($this.parent());
                $this.parent().remove();
                makeDrop();
            } else {

                $this.addClass('select-hidden');
                $this.wrap('<div class="select ' + key + '"></div>');
                $this.after('<div class="select-styled"></div>');

                var $styledSelect = $this.next('div.select-styled');
                $styledSelect.text($this.children('option').eq(0).text());

                var $list = $('<ul />', {
                    'class': 'select-options'
                }).insertAfter($styledSelect);

                var $input = $('<input />', {
                    'type': 'hidden',
                    'id': 'select_option_' + key
                }).insertBefore($styledSelect);

                for (var i = 0; i < numberOfOptions; i++) {
                    $('<li />', {
                        text: $this.children('option').eq(i).text(),
                        rel: $this.children('option').eq(i).attr("lang"),
                        title: $this.children('option').eq(i).val()
                    }).appendTo($list);
                }

                var $listItems = $list.children('li');

                $styledSelect.click(function (e) {
                    e.stopPropagation();
                    $('div.select-styled.active').not(this).each(function () {
                        $(this).removeClass('active').next('ul.select-options').hide();
                    });
                    $(this).toggleClass('active').next('ul.select-options').toggle();
                });

                $listItems.click(function (e) {
                    e.stopPropagation();
                    $styledSelect.text($(this).text()).removeClass('active');
                    $("#select_option_" + key).attr({
                        "value": $(this).attr('title'),
                        "title": $(this).attr('rel')
                    }).change();
                    $this.val($(this).attr('rel')).change();
                    $list.hide();
                });

                $(document).click(function () {
                    $styledSelect.removeClass('active');
                    $list.hide();
                });

            }


        });

    },

    signature = function () {

        $("fieldset.element-editable[rel='signature']").each(function (index) {
            $(this).find("img").remove();

            var len = index, signatrue_pad = $("<div></div>")
                .addClass("signature-pad-popup")
                .attr("id", "signature-pad-" + len).hide()
                .append
                ($("<div></div>").addClass("signature-pad-main").attr("id", "signature-embed-" + len)
                    .append($("<div></div>").addClass("signature-pad")
                            .append($("<div></div>").addClass("signature-pad--body")
                                    .append($("<canvas></canvas>").mousedown(function () {
                                            $(this).next('.signature-hint').hide()
                                        }),
                                        $("<div></div>").addClass("signature-hint")
                                            .append($("<div></div>").html("Drew Your Signature Here")),
                                        $("<div></div>").addClass("signature-text")
                                            .append($("<input>").attr({
                                                "type": "text",
                                                "maxlength": "40",
                                                "placeholder": "Write Your Name Here",
                                                "id": "signature-name-" + len
                                            })).hide(),
                                        $("<div></div>").addClass("signature-image")
                                            .append($("<img>").attr({
                                                "id": "image-" + len,
                                                "src": "/images/choose.png"
                                            })).hide(),
                                        $("<div></div>").addClass("signature-line")
                                            .append($("<span></span>"))
                                    ),
                                $("<div></div>").addClass("signature-pad--footer")
                                    .append($("<div></div>").addClass("signature-pad--actions")
                                        .append($("<button>Clear</button>").addClass("button clear").attr({"data-action": "clear"}).click(function () {
                                                $('.signature-hint').show();
                                            })
                                        )
                                    )
                            ),
                        $("<div></div>").addClass("signature-pad-btns")
                            .append(
                                $("<ul></ul>").addClass("signature-pad-btns-left").attr("id", "btns-list-" + len)
                                    .append
                                    (
                                        $("<li></li>").attr({"title": "drewit", "class": "clicked"}).append(
                                            $("<i></i>").addClass("icons icons-signature")
                                        ),
                                        $("<li></li>").attr({"title": "writeit"}).append(
                                            $("<i></i>").addClass("icons icons-text")
                                        ),
                                        $("<li></li>").attr({"title": "image"}).append(
                                            $("<i></i>").addClass("icons icons-image")
                                        ),
                                        $("<input>").attr({
                                            "type": "file",
                                            "title": "image-" + len,
                                            "accept": "image/*"
                                        }).change(function (e) {
                                            var img_el = $("#" + $(this).attr("title"));
                                            var reader = new FileReader();
                                            reader.onload = function (e) {
                                                img_el.attr('src', e.target.result);
                                            };
                                            reader.readAsDataURL(this.files[0]);

                                        }).hide()
                                    ).css("display", "inline"),
                                $("<ul></ul>").addClass("signature-pad-btns-right")
                                    .append(
                                        $("<li></li>").append(
                                            $("<button>Ok</button>").addClass("button save").attr({"data-action": "save-sign"})
                                        ),
                                        $("<li></li>").append(
                                            $("<button>Cancel</button>").addClass("button cancel").attr({"data-action": "save-png"}).click(function () {
                                                $('.signature-pad-popup').fadeOut();
                                            })
                                        )
                                    ).css("display", "inline"),
                            )
                    )
                );


            $("body").append(signatrue_pad);

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


            var signatureELMS = $(this);

            signatureELMS.find(".sign-start").on("click", function () {
                $('#' + $(this).attr('title')).fadeIn();
                SignatureOn('signature-pad');
            });
            signatureELMS.find("button").on("click", function () {
                signatureELMS.find(".sign-hint").show();
                signatureELMS.find("h2").text("").hide();
                signatureELMS.find(".image-drew-signatrue").attr("src", "").hide();
            });


            $('button[data-action="save-sign"]').click(function () {
                var parentEls = $(this).parents()
                    .map(function () {
                        return $(this);
                    })
                    .get();
                var mainElement = parentEls[3];
                /*

                        //grab the context from your destination canvas
                        var destCtx = mainElement.find("canvas").getContext('2d');

                //call its drawImage() function passing it the source canvas directly
                        alert(destCtx);
                */
            });
            $("ul.signature-pad-btns-left").find('input').change(function (e) {
                var img_el = $("#" + $(this).attr("title"));
                var reader = new FileReader();
                reader.onload = function (e) {
                    img_el.attr('src', e.target.result);
                };
                reader.readAsDataURL(this.files[0]);

            });
            $("ul.signature-pad-btns-left").find('li').on("click", function () {
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


            $('.signature-text input').on("keydown", function (e) {
                const key = event.key; // const {key} = event; ES6+

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


            });
            $('.signature-text input').on("keypress", function (e) {
                var englishAlphabetAndWhiteSpace = /^[-@./#&+\w\s]*$/;
                var key = String.fromCharCode(event.which);


                if (event.keyCode == 8 || event.keyCode == 37 || event.keyCode == 39 || englishAlphabetAndWhiteSpace.test(key)) {
                    return true;
                }
                return false;
            });
            $('.signature-text input').on("input", function (e) {
                var text = $(this).val();


            });
            $(".signature-text input").on("paste", function (e) {
                e.preventDefault();
            });


        })

    },

    test = function (string) {
        $("#test").html(string)
    },

    list_icons = function (name, bool) {
        if (bool) {
            $(".tools-list li[rel='" + name + "']").addClass("tools-list-active");
        } else {
            $(".tools-list li[rel='" + name + "']").removeClass("tools-list-active");
        }
    },

    z_index = function () {
        $("#builder-mode").find(".row").each(function (index) {
            $(this).css("z-index", $("#builder-mode").find(".row").length - index);
        })

    };

$(document).ready(function () {




    $("#builder-mode").find("*").each(function () {
        if ($(this).hasAttr(builder_mode + "-style")) {
            var $selected_style = $(this).attr(builder_mode + "-style");
            $(this).attr("style", $selected_style)
        }
    });
    $(document).ajaxStart(function (event) {
        var $pathname = event.target.location.pathname;
        if ($pathname !== "/cache") {
            // $loader.show();
            test("ajaxStart");
        }
    });
    $(document).ajaxComplete(function (event, xhr, settings) {
        $loader.hide();
        test("ajaxComplete");
    });

    $('[data-toggle="tooltip"]').tooltip();
    setdragdrop();
    required_function();
    remoteDevices();
    signature();
    panelsButtons();
    runEditPanel();
    addPlugins();
    setEvents();
    editFormSettings();
    restoreFormSettings();
    manage_options();
    runBackgroundOptions();
    z_index();
    appendForms();
    onLoad();
    refreshWordGroups();
    $(".categories-list:not(.relevent-values)").each(function (index) {

        var categories_list = $(".categories-list:not(.relevent-values)").eq(index);
        categories_list.find("li").eq(0).remove();

        $(categories_list.find("li").get().reverse()).each(function () {
            var $this = $(this),
                primary_id = $this.attr("primary-id"),
                parent_category = $this.attr("parent-category");

            if (primary_id !== parent_category) {
                categories_list.find("li[parent-category='" + primary_id + "']").appendTo($this.find("ul:not(.categories-tools)"))
            }
        });
        categories_list.find("> ul").fadeIn();
    });


    $(".tools-list li").on("click", function () {
        var getRel = $(this).attr("rel"),
            getElement = $(".tools-ul");

        switch (getRel) {
            case "form-hidden":
                $("input#form-hidden[title='element-hidden']").click();
                break;
            case "form-unprintable":
                $("input#form-unprintable[title='element-unprintable']").click();
                break;
            case "form-required":
                $("input#form-required[title='element-requried']").click();
                break;
            case "form-read":
                $("input#form-read[title='element-read-only']").click();
                break;
            case "form-label":
                $("input#form-label[title='element-label']").click();
                break;
            default:

                $("#form-side").attr("data-html", $(this).attr("data-html"));
                if (getRel === "select") {
                    $(".block-dragging").hide();

                    allow_select = true;
                } else {
                    $(".block-dragging").show();

                    $("#builder-mode .target-paper").click();
                    allow_select = false;

                }
                $(this).parent().find(".tools-list-active:first").removeClass("tools-list-active");
                $(this).addClass("tools-list-active");


                getElement.find(".li-show").removeClass("li-show");
                getElement.find("li[data-target='" + getRel + "']").addClass("li-show");


        }

        //alert(getRel);
    });

//Color Gradient Scaler

    $("#left-buttons button").on("click", function () {
        clicked = 0;
        clearEvents();
        lastClick = 0;
        modeChange(this);
    });

    $("#popups-page").on("click", ".preview-btn button", function () {
        var target_paper = $(this).parent().prev(),
            html_content = $(target_paper).clone(),
            cleanVersion = removeHelpers(html_content),
            popup_element = $(".popup-msg").find(".modal-body");

        // alert(target_paper.html());
        popup_element.html(cleanVersion);
    });


    $("#builder-mode,#print-mode,#popups-page").click(function (event) {
        body_event = event;
        if ((builder_mode === "web" && allow_select && window.getSelection().toString() === "") || builder_mode === "print" || builder_mode === "popup") {


            readContent(event);
        }
        //event.stopPropagation();

    });
    $("#builder-mode,#print-mode,#popups-page").dblclick(function (event) {
        if (!allow_select) return;
        var tarElement = $(event.target);
        if (tarElement.hasClass("text-editable")) {
            tarElement.on("input", function () {
                $("#element-text-contain textarea").val($(this).text());
            });

            var $url = $("#links").find("#getWordsList").attr("content") + "/" + selectedLanguage_b;
            tarElement.attr('contentEditable', 'true');
            tarElement.focus().focusin().select();

            $.get($url, function (data, status) {
                var TwoArrays = data.toString().split("=");
                var availableWords = TwoArrays[0].toString().split(",");
                var wordsIds = TwoArrays[1].toString().split(",");

                tarElement.autocomplete({
                    appendTo: tarElement.parent(),
                    source: availableWords,
                    select: function () {
                        var $this = $(this);
                        var $getindex = TwoArrays[0].toString().split(",").indexOf($this.text());
                        var $url = $("#links").find("#specificWord").attr("content") + "/" + wordsIds[$getindex] + "/" + $settings.main_language;

                        $.get($url, function (data, status) {
                            if(status !== "success") return;
                                tarElement.attr("lang", FromJson(data[0]));

                        })
                    },
                    change: function () {

                        saveCache();
                    }
                });


            });

            // tarElement.html().select();

            readContent(event);
        }
    });


    $("select[title='list-languages']").makeSimpleDropdown();

    $("select[title='selected-languages-a']").makeSimpleDropdown({
        onSelectChange: function (value) {
            var lang = value;
            selectedLanguage_a = value;

            $settings.main_language = selectedLanguage_a;



            $(".modes").find(".row").find("fieldset").each(function (index) {

                $(this).find(".text-editable").each(function (_index) {

                    var $this = $(this);
                    var $this_text = $this.text();

                    var ElementLangToJson = {};
                    ElementLangToJson[value] = $this_text;

                    $this.attr("lang", FromJson(ElementLangToJson));
                })

            });



            if (lang === "arabic" || lang === "yiddish") {
                $("#builder-mode").addClass("arabic-languages");
                $("#print-mode").addClass("arabic-languages");
                $dir = "rtl";
                $(".target-paper").attr("dir", "rtl");
                $(".tools-hover").attr("dir", "ltr");
            }
            else {
                $("#builder-mode").removeClass("arabic-languages");
                $("#print-mode").removeClass("arabic-languages");
                $dir = "ltr";
                $(".target-paper").attr("dir", "ltr");
                $(".tools-hover").attr("dir", "rtl");
            }

            saveCache();

            // event.stopPropagation();
        }
    });

    $("select[title='selected-languages-b']").makeSimpleDropdown({
        onSelectChange: function (value) {
            if (clicked === 0 && typeof clicked !== 'undefined') return;
            selectedLanguage_b = value;


            var filter = {
                text_tags: [
                    "LABEL",
                    "P",
                    "SMALL",
                    "SPAN",
                    "H1",
                    "H2"
                ],
                input_tags: [
                    "SELECT",
                    "INPUT",
                    "TEXTAREA"
                ]
            };

            if ($.inArray(clicked.tagName(), filter.text_tags) !== -1) {
                var getClass = clicked.attr("id"),
                    tag = clicked.tagName(),
                    element_change = $(tag + "#" + getClass),
                    $text = ToJson(element_change.attr("lang"))[value];

                // element_change.text($text);

                element_change.restoreValues_advanceController();
            } else if ($.inArray(clicked.tagName(), filter.input_tags) !== -1) {

                clicked.restoreValues_advanceController();
            }

            // var elementChange = tag+""
        }
    });

    $("select[title='background_color_style']").makeDropdown();

    $("select[title='border_color_style']").makeDropdown();


    $("select[title='font_family']").find("option").each(function (DFG) {
        $(this).css("font-family", $(this).attr("value"));
    });


    $("#design_setting").find(".selection").each(function (ti) {
        $(this).val($(this).find("option").val()).change();
    });
    $("select[title='selected-languages-a']").change();
// $("select[title='list-languages']").makeDrop();


    $(".list-item").on("click", function (e) {
        var targetTab = $(this).attr("title");
        if (!$(this).hasClass("active-tab")) {
            $(".list-item").removeClass("active-tab");
            $(this).addClass("active-tab");
            $("#advance_setting .layers").hide();
            $("#advance_setting .row-item").hide();
            $("#advance_setting ." + targetTab).show();
            $("#" + targetTab).show();
        }
    });

//Combobox for Name Field in edit section

    $("#toggle").on("click", function () {
        $("#combobox").toggle();
    });


    $(window).bind('mousewheel DOMMouseScroll', function (event) {
        if (event.ctrlKey === true) {
            // alert('disabling zooming');
            event.preventDefault();
        }
    });

// $(".logo-loader").fadeOut();

    setFunctionsToHiddenInputs();


    $("#builder-mode > .builder-paper").bind("DOMNodeInserted DOMNodeRemoved", function () {

        // alert("inserted");
    });


});


function preventZoom(event) {

    if (event.ctrlKey == true && (event.which == '61' || event.which == '107' || event.which == '173' || event.which == '109' || event.which == '187' || event.which == '189')) {
        // alert('disabling zooming');
        //event.preventDefault();
        // 107 Num Key  +
        //109 Num Key  -
        //173 Min Key  hyphen/underscor Hey
        // 61 Plus key  +/=
    }

}

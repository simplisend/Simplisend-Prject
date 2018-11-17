(function ($) {

    $.fn.Settings = function (key) {
        if (key === "form") {

            $(this).droppable({
                accept: ".v-web.row,.v-popup.row",
                drop: function (event, ui) {
                    SOMTHING_CHANGED = true;
                    return false;
                }
            });

            $(this).sortable({
                placeholder: "SortPlaceholder",
                handle: ".row-move",
                connectWith: ".v-web.row,.v-popup.row",
                axis: "Y",
                distance: 10,
                zIndex: 9999,
                forceHelperSize: true,
                containment: "parent",
                cancel: "fieldset",
                dropOnEmpty: false,
                revert: true,
                forcePlaceholderSize: true,
                cursor: "move",
                start: function (event, ui) {
                    ui.placeholder.height(ui.helper[0].scrollHeight);
                },
                receive: function (event, ui) {
                    $(ui.helper).css({"position": "", "opacity": "1", "width": "100%", "height": "auto"});
                },
                stop: function (event, ui) {
                    required_function();
                }
            })

        }
        else if (key === "column") {


            $(this).droppable({
                accept: "fieldset",

            });

            $(this).sortable({
                placeholder: "SortPlaceholder",
                handle: ".element-move",
                distance: 10,
                zIndex: 9999,
                forceHelperSize: true,
                forcePlaceholderSize: true,
                cursor: "move",
                sort: function (event, ui) {
                    $(ui.helper).parent().find(".delete-column").hide();
                },
                out: function (event, ui) {

                },
                receive: function (event, ui) {
                    $(ui.helper).css({"position": "", "opacity": "1", "width": "100%", "height": "auto"});

                    $(".columns").each(function (index) {
                        var el = $(".columns").eq(index);
                        if (el.find("fieldset").length === 0) {
                            el.find(".delete-column").show();
                        }
                    })

                },
                stop: function (event, ui) {
                    refreshIDs();

                }
            })

        }
        else if (key === "element") {
            $(this).draggable({
                connectToSortable: ".v-web.columns,.v-popup.columns",
                placeholder: "SortPlaceholder",
                handle: ".element-move",
                revert: 'invalid',
                revertDuration: 100,
                iframeFix: true,
                stop: function (event, ui) {
                    refreshIDs();
                }
            });
        }
        else if (key === "popup") {
            $(this).droppable({
                accept: ".popup-paper",
                drop: function (event, ui) {
                    SOMTHING_CHANGED = true;
                    return false;


                }
            });

            $(this).sortable({
                placeholder: "SortPlaceholder",
                handle: ".popup-move",
                connectWith: ".popup-paper",
                axis: "Y",
                distance: 10,
                zIndex: 9999,
                forceHelperSize: true,
                containment: "parent",
                cancel: "fieldset.form-group",
                dropOnEmpty: false,
                revert: true,
                forcePlaceholderSize: true,
                cursor: "move",
                receive: function (event, ui) {
                    SOMTHING_CHANGED = true;
                    $(ui.helper).css({"position": "", "opacity": "1", "width": "100%", "height": "auto"});
                },
                stop: function (event, ui) {
                    refreshIDs();
                    layers();
                }
            })


        }
    };
    $.fn.addToolsHelper = function (type) {
        var params = {
            Move: $("<li data-target='move'></li>").addClass(type + '-move').append($("<i></i>").addClass("icons icons-move")),
            Duplicate: $("<li data-target='dublicate'></li>").on("click", function () {
                var getEl = $(this).parent().parent().parent();

                if (getEl.hasClass("popup-content")) {
                    getEl = getEl.parent();
                }

                var duplicate = getEl.clone();
                duplicate.find(".tools-hover").remove();
                duplicate.find(".delete-column").remove();
                duplicate.find(".ui-resizable-handle").remove();
                duplicate.find(".ui-resizable").removeClass("ui-resizable");
                duplicate.find(".ui-draggable").removeClass("ui-draggable");


                var appenElement = $("<div/>").append(duplicate);

                var _helper = appenElement.html();


                appenElement.find(".v-" + builder_mode).each(function () {
                    $(this).removeAttr("id");
                });


                $(_helper).insertAfter(getEl);
                required_function();


            }).addClass("dublicate").append($("<i></i>").addClass("icons icons-dublicate")),
            plus: $("<li data-target='plus'></li>").addClass("plus").on("click", function () {
                var getEl = $(this).parent().parent().parent();


                var classIndex;
                var elementToMinis;
                var sum = 0;
                var tClass;
                var newElement;

                getEl.find(".columns").each(function () {

                    sum += parseInt(($(this).attr("class").match(/(^|\s)col-\S+/g) || []).join(' ').split("-")[2]);

                });


                if (sum === 12) {
                    $(getEl.find(".columns").get().reverse()).each(function (index) {

                        tClass = ($(this).attr("class").match(/(^|\s)col-\S+/g) || []).join(' ');


                        if (parseInt(tClass.split("-")[2]) > 1) {

                            var newClass = "col-sm-" + (parseInt(tClass.split("-")[2]) - 1);
                            $(this).replaceClass(tClass, newClass);


                            newElement = $("<div></div>").addClass("col-sm-1 element-editable columns");

                            return false;
                        }

                    })

                } else {

                    var width = 12 - sum;


                    newElement = $("<div></div>").addClass("columns element-editable col-sm-" + width);

                }

                getEl.append(newElement);
                // alert(getEl.find(".columns:last-child").attr("class"));
                getEl.find(".columns").last().addToolsHelper("columns");
                getEl.find(".columns").last().prev().column_resizable();
                getEl.find(".columns").last().Settings("column");


                getEl.find(".columns").last().applyClasses();
                required_function();
                // required_function();
            }).append($("<i></i>").addClass("icons icons-plus")),
            Delete: $("<li data-target='trash'></li>").addClass("deleteElement").on("click", function () {


                var getTel = $(this).parents(".tools-hover").parent();
                if (getTel.hasClass("popup-content")) {
                    getTel = getTel.parent();
                } else if (getTel.parent().hasClass("popup-clone")) {

                    if (getTel.hasClass("element-footer")) {
                        getTel.click();
                        $("#form-footer").next().click();
                    } else if (getTel.hasClass("element-header")) {
                        getTel.click();

                        $("#form-header").next().click();
                    }
                }
                if (!getTel.hasClass("page-break")) {
                    $(".columns").each(function (index) {
                        var el = $(".columns").eq(index);
                        if (el.find("fieldset").length === 0) {
                            el.find(".delete-column").show();
                        }
                    });

                }


                getTel.remove();
                required_function();
            }).append($("<i></i>").addClass("icons icons-delete")),
            save: $("<li data-target='save'></li>").append($("<a></a>").attr({
                "href": "#",
                "data-toggle": "modal",
                "data-target": ".save-element"
            }).addClass('save').on('click', function () {

                getClean(this);

            }).append($("<i></i>").addClass("icons icons-save")))
        };

        var main = $("<div></div>").addClass("tools-hover").attr("dir", "rtl");

        var ul_1 = $("<ul></ul>").addClass("tools-ul");
        var ul_2 = $("<ul></ul>").addClass("tools-ul");
        var ul_3 = $("<ul></ul>").addClass("tools-ul");
        if (type === "row") {
            ul_1 = ul_1.append(params.Move);
            ul_1 = ul_1.append(params.plus);
            ul_1 = ul_1.append(params.save);
            ul_1 = ul_1.append(params.Duplicate);
            ul_1 = ul_1.append(params.Delete);


        }
        else if (type === "popup") {
            ul_1 = ul_1.append(params.Delete);
            ul_1 = ul_1.append(params.save);
            ul_1 = ul_1.append(params.Duplicate);

        }
        else {
            ul_1 = ul_1.append(params.Move);
            ul_1 = ul_1.append(params.Duplicate);
            ul_1 = ul_1.append(params.Delete);
        }
        var final = main.append(ul_1);

        $("fieldset .tools-hover").hover(function () {
            $(this).find("ul").eq(1).fadeIn().css("display", "inline-block;");
            //alert($(this).attr("class"));
        }, function () {
            $(this).find("ul").eq(1).fadeOut();
        }); //Open tools when hover the first tool

        if (this.find(".tools-hover").length === 0) {
            if (type === "columns") {
                // alert($(this).html());
                if ($(this).find(".delete-column").length === 0) {
                    var display;
                    if ($(this).find("fieldset").length === 0) {
                        display = "block";
                    } else {
                        display = "none";
                    }
                    this.prepend(
                        $("<div></div>")
                            .addClass("delete-column")
                            .css("display", display)
                            .append($("<i></i>")
                                .addClass("icons icons-delete")
                                .css("font-size", "33px"))
                            .on("click", function () {
                                if ($(this).parent().parent().find('.columns').length > 1) {

                                    var currentEl = $(this).parent();

                                    var currentClass = currentEl.attr("class");
                                    var getClass = currentClass.substr(currentClass.indexOf("col-sm"), 9);
                                    var firstWidth = parseInt(getClass.split("-")[2]);

                                    var closestEl;
                                    if ($(this).parent().next(".columns").length !== 0) {
                                        closestEl = $(this).parent().next(".columns");
                                    } else {
                                        closestEl = $(this).parent().prev(".columns");
                                    }

                                    //currentEl.clearUnusedClasses();

                                    currentEl.remove();

                                    var secondClass = closestEl.attr("class");
                                    var getsClass = secondClass.substr(secondClass.indexOf("col-sm"), 9);
                                    var secondWidth = parseInt(getsClass.split("-")[2]);

                                    var sum = secondWidth + firstWidth;

                                    closestEl.replaceClass("col-sm-" + secondWidth, "col-sm-" + sum);


                                    required_function();


                                } else {
                                    notification('Opps!', "You can't leave row empty", 'error');
                                }
                            })
                    )

                }


            }
            else {
                this.prepend(final);
            }
        }

        $(".tools-list .tools-list-active:first").click();//to show selected tool


    };
    $.fn.applyClasses = function () {
        required_function();
        var $this = $(this), $this_tag = $this.tagName().toLowerCase(), $additionalClasses = "", $style1 = {},
            $style2 = {}, printStyle = false,
            modes = ["v-web", "v-print"];

        if (builder_mode === "popup") {
            modes = ["v-popup"]
        }
        // alert($this.attr("class"));


        if ($this.hasClass("element-editable")) {
            if ($this_tag === "fieldset") {
                $additionalClasses = "form-group col-sm-12 animated";
            } else if ($this_tag === "div") {
                if ($this.hasClass("row")) {
                    $additionalClasses = "standard-row animated";
                } else if ($this.hasClass("columns")) {
                    $additionalClasses = "resizable";

                }

            }
            else if ($this_tag === "label") {
                if ($this.parent().hasClass("checkbox_input") || $this.parent().hasClass("radio_input")) {
                    $additionalClasses = "";
                    $style1 = {
                        margin_top: "5px",
                        margin_bottom: "0px",
                        border_radius: "0px",
                        border_left: "1px #000000 none",
                        border_bottom: "1px #000000 none",
                        border_right: "1px #000000 none",
                        border_top: "1px #000000 none",
                        font_size: "12pt",
                        font_family: "arial",
                        color: "#000000",
                        font_style: "normal",
                        font_weight: "700",
                        text_decoration: "none",
                        text_transform: "none",
                        line_height: "auto",
                        text_align: "start"
                    }
                }
            }

            if (!$this.is('[class*="v-"]')) {
                $this.generateClass($additionalClasses, $style1, modes);
            }

        }

        $this.find(".element-editable").each(function () {

            $style1 = {};
            $style2 = {};
            printStyle = false;
            var $this_el = $(this), $this_element_tag = $this_el.tagName().toLowerCase();

            // alert($this_element_tag);
            $additionalClasses = "";
            $style1 = {};
            if ($this_element_tag === "h1" || $this_element_tag === "h2") {
                $style1 = {
                    font_weight: "700",
                    font_size: "18pt",
                    font_family: "Arial",
                    color: "#000000",
                    font_style: "normal",
                    text_decoration: "none",
                    text_transform: "none",
                    line_height: "auto",
                    text_align: "start"
                };
            }
            else if ($this_element_tag === "h4") {
                $style1 = {
                    font_weight: "700",
                    font_size: "18pt",
                    font_family: "Arial",
                    color: "#000000",
                    font_style: "normal",
                    text_decoration: "none",
                    text_transform: "none",
                    line_height: "auto",
                    text_align: "start"
                };
            }
            else if ($this_element_tag === "input") {
                $additionalClasses = "form-control";//border: 1px solid #ccc;
                $style1 = {
                    border_radius: "0px",
                    border_left: "1px #ccc solid",
                    border_bottom: "1px #ccc solid",
                    border_right: "1px #ccc solid",
                    border_top: "1px #ccc solid",
                    font_size: "12px",
                    font_family: "arial",
                    color: "#000000",
                    font_style: "normal",
                    text_decoration: "none",
                    text_transform: "none",
                    font_weight: "normal",
                    min_height: "0px",
                    height: "auto"
                };

                printStyle = true;
                $style2 = {
                    border_radius: "0px",
                    border_left: "0px #ccc solid",
                    border_bottom: "0px #ccc solid",
                    border_right: "0px #ccc solid",
                    border_top: "0px #ccc solid",
                    font_size: "12pt",
                    font_family: "arial",
                    color: "#000000",
                    font_style: "normal",
                    text_decoration: "none",
                    text_transform: "none",
                    font_weight: "normal",
                    min_height: "0px",
                    height: "auto"

                };

            }
            else if ($this_element_tag === "small") {
                $additionalClasses = "form-text text-muted";
                $style1 = {
                    border_radius: "0px",
                    border_left: "0px #ccc solid",
                    border_bottom: "0px #ccc solid",
                    border_right: "0px #ccc solid",
                    border_top: "0px #ccc solid",
                    font_size: "10pt",
                    font_family: "arial",
                    color: "#000000",
                    font_style: "normal",
                    text_decoration: "none",
                    text_transform: "none",
                    font_weight: "normal",
                };

                printStyle = true;
                $style2 = {
                    border_radius: "0px",
                    border_left: "0px #ccc solid",
                    border_bottom: "0px #ccc solid",
                    border_right: "0px #ccc solid",
                    border_top: "0px #ccc solid",
                    font_size: "12pt",
                    font_family: "arial",
                    color: "#000000",
                    font_style: "normal",
                    text_decoration: "none",
                    text_transform: "none",
                    font_weight: "normal",
                };

            }
            else if ($this_element_tag === "label") {
                if ($this_el.parent().hasClass("checkbox_input") || $this_el.parent().hasClass("radio_input")) {
                    $additionalClasses = "";
                    $style1 = {
                        margin_top: "5px",
                        margin_bottom: "0px",
                        border_radius: "0px",
                        border_left: "1px #000000 none",
                        border_bottom: "1px #000000 none",
                        border_right: "1px #000000 none",
                        border_top: "1px #000000 none",
                        font_size: "12pt",
                        font_family: "arial",
                        color: "#000000",
                        font_style: "normal",
                        text_decoration: "none",
                        text_transform: "none",
                        font_weight: "700",
                        line_height: "auto",
                        text_align: "start"
                    }
                }
            }
            else if ($this_element_tag === "p") {
                $additionalClasses = "";
            }
            else if ($this_element_tag === "textarea") {
                $additionalClasses = "form-control";
                $style1 = {
                    border_radius: "0px!important",
                    border_left: "1px #ccc solid",
                    border_bottom: "1px #ccc solid",
                    border_right: "1px #ccc solid",
                    border_top: "1px #ccc solid",
                    font_size: "12pt!important",
                    font_family: "arial!important",
                    color: "#000000!important",
                    font_style: "normal!important",
                    text_decoration: "none!important",
                    text_transform: "none!important",
                    font_weight: "normal!important",
                };

                printStyle = true;
                $style2 = {
                    border_radius: "0px!important",
                    border_left: "0px #ccc solid",
                    border_bottom: "0px #ccc solid",
                    border_right: "0px #ccc solid",
                    border_top: "0px #ccc solid",
                    font_size: "12pt!important",
                    font_family: "arial!important",
                    color: "#000000!important",
                    font_style: "normal!important",
                    text_decoration: "none!important",
                    text_transform: "none!important",
                    font_weight: "normal!important",
                };

            }
            else if ($this_element_tag === "button") {
                $additionalClasses = "element-unprintable";
                $style1 = {
                    font_size: "16pt",
                    font_family: "arial!important",
                    color: "#000000",
                    font_style: "normal!important",
                    text_decoration: "none!important",
                    text_transform: "none!important",
                    line_height: "auto",
                    text_align: "center!important",
                    border_bottom: "1px #000000 solid",
                    border_top: "1px #000000 solid",
                    border_left: "1px #000000 solid",
                    border_right: "1px #000000 solid",
                    border_radius: "5px",
                    padding_top: "5px",
                    padding_right: "10px",
                    padding_bottom: "5px",
                    padding_left: "10px",
                    margin_top: "0px",
                    margin_right: "0px!important",
                    margin_bottom: "0px",
                    margin_left: "0px"
                };
                if ($this_el.parent().attr("rel") === "signature") {
                    $additionalClasses = "button clear element-unprintable";

                    $style1 = {
                        font_size: "15pt",
                        font_family: "arial!important",
                        color: "#000000",
                        font_style: "normal!important",
                        text_decoration: "none!important",
                        text_transform: "none!important",
                        line_height: "auto",
                        text_align: "center!important",
                        border_bottom: "1px #000000 solid",
                        border_top: "1px #000000 solid",
                        border_left: "1px #000000 solid",
                        border_right: "1px #000000 solid",
                        border_radius: "5px",
                        padding_top: "0",
                        padding_right: "0",
                        padding_bottom: "0",
                        padding_left: "0",
                        margin_top: "0",
                        margin_right: "0",
                        margin_bottom: "0",
                        margin_left: "0"
                    };
                }


            }
            else if ($this_element_tag === "span") {
                $additionalClasses = "";
                $style1 = {
                    font_weight: "normal!important",
                    font_size: "13pt!important",
                    font_family: "Arial!important",
                    color: "#000000!important",
                    font_style: "normal!important",
                    text_decoration: "none!important",
                    text_transform: "none!important",
                    line_height: "auto!important",
                    text_align: "center!important",

                }
            }
            else if ($this_element_tag === "img") {
                $additionalClasses = "";
            }
            else if ($this_element_tag === "select") {
                $additionalClasses = "";
            }
            else if ($this_element_tag === "fieldset") {
                $additionalClasses = "form-group col-sm-12 animated";

            }
            else if ($this_element_tag === "div") {
                if ($this_el.find("img").length !== 0) {
                    $additionalClasses = "img-button";
                }
                else if ($this_el.hasClass("columns")) {
                    $additionalClasses = "resizable";
                    $style1 = {
                        padding_right: "10px",
                        padding_left: "10px",
                        margin_top: "0px",
                        margin_right: "0px",
                        margin_bottom: "0px",
                        margin_left: "0px"
                    }

                }
                else if ($this_el.hasClass("row")) {
                    $additionalClasses = "standard-row animated fadeIn";
                    $style1 = {
                        padding_top: "0px",
                        padding_right: "0px",
                        padding_bottom: "0px",
                        padding_left: "0px",
                        margin_right: "0px",
                        margin_left: "0px"
                    }

                }
                else if ($this_el.hasClass("popup-content")) {
                    $additionalClasses = "";
                    $style1 = {
                        border_bottom: "3px #436682 solid",
                        border_top: "3px #436682 solid",
                        border_left: "3px #436682 solid",
                        border_right: "3px #436682 solid",
                        border_radius: "15px",
                        padding_top: "0px",
                        padding_right: "0px!important",
                        padding_bottom: "0px",
                        padding_left: "0px"
                    };

                }
                else if ($this_el.hasClass("checkmark0")) {
                    $additionalClasses = "";
                    var border_radius = "15px";
                    if ($this_el.prev("input").attr("type") === "checkbox") {
                        border_radius = "0px";
                    }
                    $style1 = {
                        border_bottom: "2px #436682 solid",
                        border_top: "2px #436682 solid",
                        border_left: "2px #436682 solid",
                        border_right: "2px #436682 solid",
                        border_radius: border_radius + "",
                        padding_top: "0px",
                        padding_right: "0px!important",
                        padding_bottom: "0px",
                        padding_left: "0px!important",
                        margin_right: "4px!important",
                        background_color: "#eee"
                    };

                }
            }

            // alert($this_element_tag+"/"+$style.border_top);
            if (!$this_el.is('[class*="v-"]')) {
                $this_el.generateClass($additionalClasses, $style1, modes, printStyle, $style2);
            }

        });
        SOMTHING_CHANGED = true;
    }

})(jQuery);

var getDefaultvalue = function (type, languages, key) {
        var defaultValues = {
            header: {
                afrikaan: "header",
                albanian: "header",
                amharic: "header",
                arabic: "header",
                armenian: "header",
                azerbaij: "header",
                basque: "header",
                belarusi: "header",
                bengali: "header",
                bosnian: "header",
                bulgaria: "header",
                catalan: "header",
                chichewa: "header",
                chinese: "header",
                corsican: "header",
                croatian: "header",
                czech: "header",
                danish: "header",
                dutch: "header",
                english: "header",
                esperant: "header",
                estonian: "header",
                filipino: "header",
                finnish: "header",
                french: "header",
                frisian: "header",
                galician: "header",
                georgian: "header",
                german: "header",
                greek: "header",
                gujarati: "header",
                haitian: "header",
                hausa: "header",
                hebrew: "header",
                hindi: "header",
                hungaria: "header",
                icelandi: "header",
                igbo: "header",
                indonesi: "header",
                irish: "header",
                italian: "header",
                japanese: "header",
                javanese: "header",
                kannada: "header",
                kazakh: "header",
                khmer: "header",
                korean: "header",
                kurdish: "header",
                kyrgyz: "header",
                lao: "header",
                latin: "header",
                latvian: "header",
                lithuani: "header",
                luxembou: "header",
                macedoni: "header",
                malagasy: "header",
                malay: "header",
                malayala: "header",
                maltese: "header",
                maori: "header",
                marathi: "header",
                mongolia: "header",
                nepali: "header",
                norwegia: "header",
                pashto: "header",
                persian: "header",
                polish: "header",
                portugue: "header",
                punjabi: "header",
                romanian: "header",
                russian: "header",
                samoan: "header",
                scottish: "header",
                serbian: "header",
                shona: "header",
                sindhi: "header",
                sinhala: "header",
                slovak: "header",
                slovenia: "header",
                somali: "header",
                spanish: "header",
                sundanes: "header",
                swahili: "header",
                swedish: "header",
                tajik: "header",
                tamil: "header",
                telugu: "header",
                thai: "header",
                turkish: "header",
                ukrainia: "header",
                urdu: "header",
                uzbek: "header",
                vietname: "header",
                welsh: "header",
                xhosa: "header",
                yiddish: "header",
                yoruba: "header",
                zulu: "header"
            },
            short_text: {
                afrikaan: "short-text",
                albanian: "short-text",
                amharic: "short-text",
                arabic: "short-text",
                armenian: "short-text",
                azerbaij: "short-text",
                basque: "short-text",
                belarusi: "short-text",
                bengali: "short-text",
                bosnian: "short-text",
                bulgaria: "short-text",
                catalan: "short-text",
                chichewa: "short-text",
                chinese: "short-text",
                corsican: "short-text",
                croatian: "short-text",
                czech: "short-text",
                danish: "short-text",
                dutch: "short-text",
                english: "short-text",
                esperant: "short-text",
                estonian: "short-text",
                filipino: "short-text",
                finnish: "short-text",
                french: "short-text",
                frisian: "short-text",
                galician: "short-text",
                georgian: "short-text",
                german: "short-text",
                greek: "short-text",
                gujarati: "short-text",
                haitian: "short-text",
                hausa: "short-text",
                hebrew: "short-text",
                hindi: "short-text",
                hungaria: "short-text",
                icelandi: "short-text",
                igbo: "short-text",
                indonesi: "short-text",
                irish: "short-text",
                italian: "short-text",
                japanese: "short-text",
                javanese: "short-text",
                kannada: "short-text",
                kazakh: "short-text",
                khmer: "short-text",
                korean: "short-text",
                kurdish: "short-text",
                kyrgyz: "short-text",
                lao: "short-text",
                latin: "short-text",
                latvian: "short-text",
                lithuani: "short-text",
                luxembou: "short-text",
                macedoni: "short-text",
                malagasy: "short-text",
                malay: "short-text",
                malayala: "short-text",
                maltese: "short-text",
                maori: "short-text",
                marathi: "short-text",
                mongolia: "short-text",
                nepali: "short-text",
                norwegia: "short-text",
                pashto: "short-text",
                persian: "short-text",
                polish: "short-text",
                portugue: "short-text",
                punjabi: "short-text",
                romanian: "short-text",
                russian: "short-text",
                samoan: "short-text",
                scottish: "short-text",
                serbian: "short-text",
                shona: "short-text",
                sindhi: "short-text",
                sinhala: "short-text",
                slovak: "short-text",
                slovenia: "short-text",
                somali: "short-text",
                spanish: "short-text",
                sundanes: "short-text",
                swahili: "short-text",
                swedish: "short-text",
                tajik: "short-text",
                tamil: "short-text",
                telugu: "short-text",
                thai: "short-text",
                turkish: "short-text",
                ukrainia: "short-text",
                urdu: "short-text",
                uzbek: "short-text",
                vietname: "short-text",
                welsh: "short-text",
                xhosa: "short-text",
                yiddish: "short-text",
                yoruba: "short-text",
                zulu: "short-text"
            },
            textarea: {
                afrikaan: "textarea",
                albanian: "textarea",
                amharic: "textarea",
                arabic: "textarea",
                armenian: "textarea",
                azerbaij: "textarea",
                basque: "textarea",
                belarusi: "textarea",
                bengali: "textarea",
                bosnian: "textarea",
                bulgaria: "textarea",
                catalan: "textarea",
                chichewa: "textarea",
                chinese: "textarea",
                corsican: "textarea",
                croatian: "textarea",
                czech: "textarea",
                danish: "textarea",
                dutch: "textarea",
                english: "textarea",
                esperant: "textarea",
                estonian: "textarea",
                filipino: "textarea",
                finnish: "textarea",
                french: "textarea",
                frisian: "textarea",
                galician: "textarea",
                georgian: "textarea",
                german: "textarea",
                greek: "textarea",
                gujarati: "textarea",
                haitian: "textarea",
                hausa: "textarea",
                hebrew: "textarea",
                hindi: "textarea",
                hungaria: "textarea",
                icelandi: "textarea",
                igbo: "textarea",
                indonesi: "textarea",
                irish: "textarea",
                italian: "textarea",
                japanese: "textarea",
                javanese: "textarea",
                kannada: "textarea",
                kazakh: "textarea",
                khmer: "textarea",
                korean: "textarea",
                kurdish: "textarea",
                kyrgyz: "textarea",
                lao: "textarea",
                latin: "textarea",
                latvian: "textarea",
                lithuani: "textarea",
                luxembou: "textarea",
                macedoni: "textarea",
                malagasy: "textarea",
                malay: "textarea",
                malayala: "textarea",
                maltese: "textarea",
                maori: "textarea",
                marathi: "textarea",
                mongolia: "textarea",
                nepali: "textarea",
                norwegia: "textarea",
                pashto: "textarea",
                persian: "textarea",
                polish: "textarea",
                portugue: "textarea",
                punjabi: "textarea",
                romanian: "textarea",
                russian: "textarea",
                samoan: "textarea",
                scottish: "textarea",
                serbian: "textarea",
                shona: "textarea",
                sindhi: "textarea",
                sinhala: "textarea",
                slovak: "textarea",
                slovenia: "textarea",
                somali: "textarea",
                spanish: "textarea",
                sundanes: "textarea",
                swahili: "textarea",
                swedish: "textarea",
                tajik: "textarea",
                tamil: "textarea",
                telugu: "textarea",
                thai: "textarea",
                turkish: "textarea",
                ukrainia: "textarea",
                urdu: "textarea",
                uzbek: "textarea",
                vietname: "textarea",
                welsh: "textarea",
                xhosa: "textarea",
                yiddish: "textarea",
                yoruba: "textarea",
                zulu: "textarea"
            },
            text: {
                afrikaan: "text",
                albanian: "text",
                amharic: "text",
                arabic: "text",
                armenian: "text",
                azerbaij: "text",
                basque: "text",
                belarusi: "text",
                bengali: "text",
                bosnian: "text",
                bulgaria: "text",
                catalan: "text",
                chichewa: "text",
                chinese: "text",
                corsican: "text",
                croatian: "text",
                czech: "text",
                danish: "text",
                dutch: "text",
                english: "text",
                esperant: "text",
                estonian: "text",
                filipino: "text",
                finnish: "text",
                french: "text",
                frisian: "text",
                galician: "text",
                georgian: "text",
                german: "text",
                greek: "text",
                gujarati: "text",
                haitian: "text",
                hausa: "text",
                hebrew: "text",
                hindi: "text",
                hungaria: "text",
                icelandi: "text",
                igbo: "text",
                indonesi: "text",
                irish: "text",
                italian: "text",
                japanese: "text",
                javanese: "text",
                kannada: "text",
                kazakh: "text",
                khmer: "text",
                korean: "text",
                kurdish: "text",
                kyrgyz: "text",
                lao: "text",
                latin: "text",
                latvian: "text",
                lithuani: "text",
                luxembou: "text",
                macedoni: "text",
                malagasy: "text",
                malay: "text",
                malayala: "text",
                maltese: "text",
                maori: "text",
                marathi: "text",
                mongolia: "text",
                nepali: "text",
                norwegia: "text",
                pashto: "text",
                persian: "text",
                polish: "text",
                portugue: "text",
                punjabi: "text",
                romanian: "text",
                russian: "text",
                samoan: "text",
                scottish: "text",
                serbian: "text",
                shona: "text",
                sindhi: "text",
                sinhala: "text",
                slovak: "text",
                slovenia: "text",
                somali: "text",
                spanish: "text",
                sundanes: "text",
                swahili: "text",
                swedish: "text",
                tajik: "text",
                tamil: "text",
                telugu: "text",
                thai: "text",
                turkish: "text",
                ukrainia: "text",
                urdu: "text",
                uzbek: "text",
                vietname: "text",
                welsh: "text",
                xhosa: "text",
                yiddish: "text",
                yoruba: "text",
                zulu: "text"
            },
            button: {
                afrikaan: "button",
                albanian: "button",
                amharic: "button",
                arabic: "button",
                armenian: "button",
                azerbaij: "button",
                basque: "button",
                belarusi: "button",
                bengali: "button",
                bosnian: "button",
                bulgaria: "button",
                catalan: "button",
                chichewa: "button",
                chinese: "button",
                corsican: "button",
                croatian: "button",
                czech: "button",
                danish: "button",
                dutch: "button",
                english: "button",
                esperant: "button",
                estonian: "button",
                filipino: "button",
                finnish: "button",
                french: "button",
                frisian: "button",
                galician: "button",
                georgian: "button",
                german: "button",
                greek: "button",
                gujarati: "button",
                haitian: "button",
                hausa: "button",
                hebrew: "button",
                hindi: "button",
                hungaria: "button",
                icelandi: "button",
                igbo: "button",
                indonesi: "button",
                irish: "button",
                italian: "button",
                japanese: "button",
                javanese: "button",
                kannada: "button",
                kazakh: "button",
                khmer: "button",
                korean: "button",
                kurdish: "button",
                kyrgyz: "button",
                lao: "button",
                latin: "button",
                latvian: "button",
                lithuani: "button",
                luxembou: "button",
                macedoni: "button",
                malagasy: "button",
                malay: "button",
                malayala: "button",
                maltese: "button",
                maori: "button",
                marathi: "button",
                mongolia: "button",
                nepali: "button",
                norwegia: "button",
                pashto: "button",
                persian: "button",
                polish: "button",
                portugue: "button",
                punjabi: "button",
                romanian: "button",
                russian: "button",
                samoan: "button",
                scottish: "button",
                serbian: "button",
                shona: "button",
                sindhi: "button",
                sinhala: "button",
                slovak: "button",
                slovenia: "button",
                somali: "button",
                spanish: "button",
                sundanes: "button",
                swahili: "button",
                swedish: "button",
                tajik: "button",
                tamil: "button",
                telugu: "button",
                thai: "button",
                turkish: "button",
                ukrainia: "button",
                urdu: "button",
                uzbek: "button",
                vietname: "button",
                welsh: "button",
                xhosa: "button",
                yiddish: "button",
                yoruba: "button",
                zulu: "button"
            },
            checkbox: {
                afrikaan: "checkbox",
                albanian: "checkbox",
                amharic: "checkbox",
                arabic: "checkbox",
                armenian: "checkbox",
                azerbaij: "checkbox",
                basque: "checkbox",
                belarusi: "checkbox",
                bengali: "checkbox",
                bosnian: "checkbox",
                bulgaria: "checkbox",
                catalan: "checkbox",
                chichewa: "checkbox",
                chinese: "checkbox",
                corsican: "checkbox",
                croatian: "checkbox",
                czech: "checkbox",
                danish: "checkbox",
                dutch: "checkbox",
                english: "checkbox",
                esperant: "checkbox",
                estonian: "checkbox",
                filipino: "checkbox",
                finnish: "checkbox",
                french: "checkbox",
                frisian: "checkbox",
                galician: "checkbox",
                georgian: "checkbox",
                german: "checkbox",
                greek: "checkbox",
                gujarati: "checkbox",
                haitian: "checkbox",
                hausa: "checkbox",
                hebrew: "checkbox",
                hindi: "checkbox",
                hungaria: "checkbox",
                icelandi: "checkbox",
                igbo: "checkbox",
                indonesi: "checkbox",
                irish: "checkbox",
                italian: "checkbox",
                japanese: "checkbox",
                javanese: "checkbox",
                kannada: "checkbox",
                kazakh: "checkbox",
                khmer: "checkbox",
                korean: "checkbox",
                kurdish: "checkbox",
                kyrgyz: "checkbox",
                lao: "checkbox",
                latin: "checkbox",
                latvian: "checkbox",
                lithuani: "checkbox",
                luxembou: "checkbox",
                macedoni: "checkbox",
                malagasy: "checkbox",
                malay: "checkbox",
                malayala: "checkbox",
                maltese: "checkbox",
                maori: "checkbox",
                marathi: "checkbox",
                mongolia: "checkbox",
                nepali: "checkbox",
                norwegia: "checkbox",
                pashto: "checkbox",
                persian: "checkbox",
                polish: "checkbox",
                portugue: "checkbox",
                punjabi: "checkbox",
                romanian: "checkbox",
                russian: "checkbox",
                samoan: "checkbox",
                scottish: "checkbox",
                serbian: "checkbox",
                shona: "checkbox",
                sindhi: "checkbox",
                sinhala: "checkbox",
                slovak: "checkbox",
                slovenia: "checkbox",
                somali: "checkbox",
                spanish: "checkbox",
                sundanes: "checkbox",
                swahili: "checkbox",
                swedish: "checkbox",
                tajik: "checkbox",
                tamil: "checkbox",
                telugu: "checkbox",
                thai: "checkbox",
                turkish: "checkbox",
                ukrainia: "checkbox",
                urdu: "checkbox",
                uzbek: "checkbox",
                vietname: "checkbox",
                welsh: "checkbox",
                xhosa: "checkbox",
                yiddish: "checkbox",
                yoruba: "checkbox",
                zulu: "checkbox"
            },
            option: {
                afrikaan: "Option",
                albanian: "Option",
                amharic: "Option",
                arabic: "Option",
                armenian: "Option",
                azerbaij: "Option",
                basque: "Option",
                belarusi: "Option",
                bengali: "Option",
                bosnian: "Option",
                bulgaria: "Option",
                catalan: "Option",
                chichewa: "Option",
                chinese: "Option",
                corsican: "Option",
                croatian: "Option",
                czech: "Option",
                danish: "Option",
                dutch: "Option",
                english: "Option",
                esperant: "Option",
                estonian: "Option",
                filipino: "Option",
                finnish: "Option",
                french: "Option",
                frisian: "Option",
                galician: "Option",
                georgian: "Option",
                german: "Option",
                greek: "Option",
                gujarati: "Option",
                haitian: "Option",
                hausa: "Option",
                hebrew: "Option",
                hindi: "Option",
                hungaria: "Option",
                icelandi: "Option",
                igbo: "Option",
                indonesi: "Option",
                irish: "Option",
                italian: "Option",
                japanese: "Option",
                javanese: "Option",
                kannada: "Option",
                kazakh: "Option",
                khmer: "Option",
                korean: "Option",
                kurdish: "Option",
                kyrgyz: "Option",
                lao: "Option",
                latin: "Option",
                latvian: "Option",
                lithuani: "Option",
                luxembou: "Option",
                macedoni: "Option",
                malagasy: "Option",
                malay: "Option",
                malayala: "Option",
                maltese: "Option",
                maori: "Option",
                marathi: "Option",
                mongolia: "Option",
                nepali: "Option",
                norwegia: "Option",
                pashto: "Option",
                persian: "Option",
                polish: "Option",
                portugue: "Option",
                punjabi: "Option",
                romanian: "Option",
                russian: "Option",
                samoan: "Option",
                scottish: "Option",
                serbian: "Option",
                shona: "Option",
                sindhi: "Option",
                sinhala: "Option",
                slovak: "Option",
                slovenia: "Option",
                somali: "Option",
                spanish: "Option",
                sundanes: "Option",
                swahili: "Option",
                swedish: "Option",
                tajik: "Option",
                tamil: "Option",
                telugu: "Option",
                thai: "Option",
                turkish: "Option",
                ukrainia: "Option",
                urdu: "Option",
                uzbek: "Option",
                vietname: "Option",
                welsh: "Option",
                xhosa: "Option",
                yiddish: "Option",
                yoruba: "Option",
                zulu: "Option"
            },
            radio: {
                afrikaan: "radio",
                albanian: "radio",
                amharic: "radio",
                arabic: "radio",
                armenian: "radio",
                azerbaij: "radio",
                basque: "radio",
                belarusi: "radio",
                bengali: "radio",
                bosnian: "radio",
                bulgaria: "radio",
                catalan: "radio",
                chichewa: "radio",
                chinese: "radio",
                corsican: "radio",
                croatian: "radio",
                czech: "radio",
                danish: "radio",
                dutch: "radio",
                english: "radio",
                esperant: "radio",
                estonian: "radio",
                filipino: "radio",
                finnish: "radio",
                french: "radio",
                frisian: "radio",
                galician: "radio",
                georgian: "radio",
                german: "radio",
                greek: "radio",
                gujarati: "radio",
                haitian: "radio",
                hausa: "radio",
                hebrew: "radio",
                hindi: "radio",
                hungaria: "radio",
                icelandi: "radio",
                igbo: "radio",
                indonesi: "radio",
                irish: "radio",
                italian: "radio",
                japanese: "radio",
                javanese: "radio",
                kannada: "radio",
                kazakh: "radio",
                khmer: "radio",
                korean: "radio",
                kurdish: "radio",
                kyrgyz: "radio",
                lao: "radio",
                latin: "radio",
                latvian: "radio",
                lithuani: "radio",
                luxembou: "radio",
                macedoni: "radio",
                malagasy: "radio",
                malay: "radio",
                malayala: "radio",
                maltese: "radio",
                maori: "radio",
                marathi: "radio",
                mongolia: "radio",
                nepali: "radio",
                norwegia: "radio",
                pashto: "radio",
                persian: "radio",
                polish: "radio",
                portugue: "radio",
                punjabi: "radio",
                romanian: "radio",
                russian: "radio",
                samoan: "radio",
                scottish: "radio",
                serbian: "radio",
                shona: "radio",
                sindhi: "radio",
                sinhala: "radio",
                slovak: "radio",
                slovenia: "radio",
                somali: "radio",
                spanish: "radio",
                sundanes: "radio",
                swahili: "radio",
                swedish: "radio",
                tajik: "radio",
                tamil: "radio",
                telugu: "radio",
                thai: "radio",
                turkish: "radio",
                ukrainia: "radio",
                urdu: "radio",
                uzbek: "radio",
                vietname: "radio",
                welsh: "radio",
                xhosa: "radio",
                yiddish: "radio",
                yoruba: "radio",
                zulu: "radio"
            },
            date: {
                afrikaan: "date",
                albanian: "date",
                amharic: "date",
                arabic: "date",
                armenian: "date",
                azerbaij: "date",
                basque: "date",
                belarusi: "date",
                bengali: "date",
                bosnian: "date",
                bulgaria: "date",
                catalan: "date",
                chichewa: "date",
                chinese: "date",
                corsican: "date",
                croatian: "date",
                czech: "date",
                danish: "date",
                dutch: "date",
                english: "date",
                esperant: "date",
                estonian: "date",
                filipino: "date",
                finnish: "date",
                french: "date",
                frisian: "date",
                galician: "date",
                georgian: "date",
                german: "date",
                greek: "date",
                gujarati: "date",
                haitian: "date",
                hausa: "date",
                hebrew: "date",
                hindi: "date",
                hungaria: "date",
                icelandi: "date",
                igbo: "date",
                indonesi: "date",
                irish: "date",
                italian: "date",
                japanese: "date",
                javanese: "date",
                kannada: "date",
                kazakh: "date",
                khmer: "date",
                korean: "date",
                kurdish: "date",
                kyrgyz: "date",
                lao: "date",
                latin: "date",
                latvian: "date",
                lithuani: "date",
                luxembou: "date",
                macedoni: "date",
                malagasy: "date",
                malay: "date",
                malayala: "date",
                maltese: "date",
                maori: "date",
                marathi: "date",
                mongolia: "date",
                nepali: "date",
                norwegia: "date",
                pashto: "date",
                persian: "date",
                polish: "date",
                portugue: "date",
                punjabi: "date",
                romanian: "date",
                russian: "date",
                samoan: "date",
                scottish: "date",
                serbian: "date",
                shona: "date",
                sindhi: "date",
                sinhala: "date",
                slovak: "date",
                slovenia: "date",
                somali: "date",
                spanish: "date",
                sundanes: "date",
                swahili: "date",
                swedish: "date",
                tajik: "date",
                tamil: "date",
                telugu: "date",
                thai: "date",
                turkish: "date",
                ukrainia: "date",
                urdu: "date",
                uzbek: "date",
                vietname: "date",
                welsh: "date",
                xhosa: "date",
                yiddish: "date",
                yoruba: "date",
                zulu: "date"
            },
            phone: {
                afrikaan: "phone",
                albanian: "phone",
                amharic: "phone",
                arabic: "phone",
                armenian: "phone",
                azerbaij: "phone",
                basque: "phone",
                belarusi: "phone",
                bengali: "phone",
                bosnian: "phone",
                bulgaria: "phone",
                catalan: "phone",
                chichewa: "phone",
                chinese: "phone",
                corsican: "phone",
                croatian: "phone",
                czech: "phone",
                danish: "phone",
                dutch: "phone",
                english: "phone",
                esperant: "phone",
                estonian: "phone",
                filipino: "phone",
                finnish: "phone",
                french: "phone",
                frisian: "phone",
                galician: "phone",
                georgian: "phone",
                german: "phone",
                greek: "phone",
                gujarati: "phone",
                haitian: "phone",
                hausa: "phone",
                hebrew: "phone",
                hindi: "phone",
                hungaria: "phone",
                icelandi: "phone",
                igbo: "phone",
                indonesi: "phone",
                irish: "phone",
                italian: "phone",
                japanese: "phone",
                javanese: "phone",
                kannada: "phone",
                kazakh: "phone",
                khmer: "phone",
                korean: "phone",
                kurdish: "phone",
                kyrgyz: "phone",
                lao: "phone",
                latin: "phone",
                latvian: "phone",
                lithuani: "phone",
                luxembou: "phone",
                macedoni: "phone",
                malagasy: "phone",
                malay: "phone",
                malayala: "phone",
                maltese: "phone",
                maori: "phone",
                marathi: "phone",
                mongolia: "phone",
                nepali: "phone",
                norwegia: "phone",
                pashto: "phone",
                persian: "phone",
                polish: "phone",
                portugue: "phone",
                punjabi: "phone",
                romanian: "phone",
                russian: "phone",
                samoan: "phone",
                scottish: "phone",
                serbian: "phone",
                shona: "phone",
                sindhi: "phone",
                sinhala: "phone",
                slovak: "phone",
                slovenia: "phone",
                somali: "phone",
                spanish: "phone",
                sundanes: "phone",
                swahili: "phone",
                swedish: "phone",
                tajik: "phone",
                tamil: "phone",
                telugu: "phone",
                thai: "phone",
                turkish: "phone",
                ukrainia: "phone",
                urdu: "phone",
                uzbek: "phone",
                vietname: "phone",
                welsh: "phone",
                xhosa: "phone",
                yiddish: "phone",
                yoruba: "phone",
                zulu: "phone"
            },
            image: {
                afrikaan: "image",
                albanian: "image",
                amharic: "image",
                arabic: "image",
                armenian: "image",
                azerbaij: "image",
                basque: "image",
                belarusi: "image",
                bengali: "image",
                bosnian: "image",
                bulgaria: "image",
                catalan: "image",
                chichewa: "image",
                chinese: "image",
                corsican: "image",
                croatian: "image",
                czech: "image",
                danish: "image",
                dutch: "image",
                english: "image",
                esperant: "image",
                estonian: "image",
                filipino: "image",
                finnish: "image",
                french: "image",
                frisian: "image",
                galician: "image",
                georgian: "image",
                german: "image",
                greek: "image",
                gujarati: "image",
                haitian: "image",
                hausa: "image",
                hebrew: "image",
                hindi: "image",
                hungaria: "image",
                icelandi: "image",
                igbo: "image",
                indonesi: "image",
                irish: "image",
                italian: "image",
                japanese: "image",
                javanese: "image",
                kannada: "image",
                kazakh: "image",
                khmer: "image",
                korean: "image",
                kurdish: "image",
                kyrgyz: "image",
                lao: "image",
                latin: "image",
                latvian: "image",
                lithuani: "image",
                luxembou: "image",
                macedoni: "image",
                malagasy: "image",
                malay: "image",
                malayala: "image",
                maltese: "image",
                maori: "image",
                marathi: "image",
                mongolia: "image",
                nepali: "image",
                norwegia: "image",
                pashto: "image",
                persian: "image",
                polish: "image",
                portugue: "image",
                punjabi: "image",
                romanian: "image",
                russian: "image",
                samoan: "image",
                scottish: "image",
                serbian: "image",
                shona: "image",
                sindhi: "image",
                sinhala: "image",
                slovak: "image",
                slovenia: "image",
                somali: "image",
                spanish: "image",
                sundanes: "image",
                swahili: "image",
                swedish: "image",
                tajik: "image",
                tamil: "image",
                telugu: "image",
                thai: "image",
                turkish: "image",
                ukrainia: "image",
                urdu: "image",
                uzbek: "image",
                vietname: "image",
                welsh: "image",
                xhosa: "image",
                yiddish: "image",
                yoruba: "image",
                zulu: "image"
            },
            file: {
                afrikaan: "file",
                albanian: "file",
                amharic: "file",
                arabic: "file",
                armenian: "file",
                azerbaij: "file",
                basque: "file",
                belarusi: "file",
                bengali: "file",
                bosnian: "file",
                bulgaria: "file",
                catalan: "file",
                chichewa: "file",
                chinese: "file",
                corsican: "file",
                croatian: "file",
                czech: "file",
                danish: "file",
                dutch: "file",
                english: "file",
                esperant: "file",
                estonian: "file",
                filipino: "file",
                finnish: "file",
                french: "file",
                frisian: "file",
                galician: "file",
                georgian: "file",
                german: "file",
                greek: "file",
                gujarati: "file",
                haitian: "file",
                hausa: "file",
                hebrew: "file",
                hindi: "file",
                hungaria: "file",
                icelandi: "file",
                igbo: "file",
                indonesi: "file",
                irish: "file",
                italian: "file",
                japanese: "file",
                javanese: "file",
                kannada: "file",
                kazakh: "file",
                khmer: "file",
                korean: "file",
                kurdish: "file",
                kyrgyz: "file",
                lao: "file",
                latin: "file",
                latvian: "file",
                lithuani: "file",
                luxembou: "file",
                macedoni: "file",
                malagasy: "file",
                malay: "file",
                malayala: "file",
                maltese: "file",
                maori: "file",
                marathi: "file",
                mongolia: "file",
                nepali: "file",
                norwegia: "file",
                pashto: "file",
                persian: "file",
                polish: "file",
                portugue: "file",
                punjabi: "file",
                romanian: "file",
                russian: "file",
                samoan: "file",
                scottish: "file",
                serbian: "file",
                shona: "file",
                sindhi: "file",
                sinhala: "file",
                slovak: "file",
                slovenia: "file",
                somali: "file",
                spanish: "file",
                sundanes: "file",
                swahili: "file",
                swedish: "file",
                tajik: "file",
                tamil: "file",
                telugu: "file",
                thai: "file",
                turkish: "file",
                ukrainia: "file",
                urdu: "file",
                uzbek: "file",
                vietname: "file",
                welsh: "file",
                xhosa: "file",
                yiddish: "file",
                yoruba: "file",
                zulu: "file"
            },
            dropdown: {
                afrikaan: "dropdown",
                albanian: "dropdown",
                amharic: "dropdown",
                arabic: "dropdown",
                armenian: "dropdown",
                azerbaij: "dropdown",
                basque: "dropdown",
                belarusi: "dropdown",
                bengali: "dropdown",
                bosnian: "dropdown",
                bulgaria: "dropdown",
                catalan: "dropdown",
                chichewa: "dropdown",
                chinese: "dropdown",
                corsican: "dropdown",
                croatian: "dropdown",
                czech: "dropdown",
                danish: "dropdown",
                dutch: "dropdown",
                english: "dropdown",
                esperant: "dropdown",
                estonian: "dropdown",
                filipino: "dropdown",
                finnish: "dropdown",
                french: "dropdown",
                frisian: "dropdown",
                galician: "dropdown",
                georgian: "dropdown",
                german: "dropdown",
                greek: "dropdown",
                gujarati: "dropdown",
                haitian: "dropdown",
                hausa: "dropdown",
                hebrew: "dropdown",
                hindi: "dropdown",
                hungaria: "dropdown",
                icelandi: "dropdown",
                igbo: "dropdown",
                indonesi: "dropdown",
                irish: "dropdown",
                italian: "dropdown",
                japanese: "dropdown",
                javanese: "dropdown",
                kannada: "dropdown",
                kazakh: "dropdown",
                khmer: "dropdown",
                korean: "dropdown",
                kurdish: "dropdown",
                kyrgyz: "dropdown",
                lao: "dropdown",
                latin: "dropdown",
                latvian: "dropdown",
                lithuani: "dropdown",
                luxembou: "dropdown",
                macedoni: "dropdown",
                malagasy: "dropdown",
                malay: "dropdown",
                malayala: "dropdown",
                maltese: "dropdown",
                maori: "dropdown",
                marathi: "dropdown",
                mongolia: "dropdown",
                nepali: "dropdown",
                norwegia: "dropdown",
                pashto: "dropdown",
                persian: "dropdown",
                polish: "dropdown",
                portugue: "dropdown",
                punjabi: "dropdown",
                romanian: "dropdown",
                russian: "dropdown",
                samoan: "dropdown",
                scottish: "dropdown",
                serbian: "dropdown",
                shona: "dropdown",
                sindhi: "dropdown",
                sinhala: "dropdown",
                slovak: "dropdown",
                slovenia: "dropdown",
                somali: "dropdown",
                spanish: "dropdown",
                sundanes: "dropdown",
                swahili: "dropdown",
                swedish: "dropdown",
                tajik: "dropdown",
                tamil: "dropdown",
                telugu: "dropdown",
                thai: "dropdown",
                turkish: "dropdown",
                ukrainia: "dropdown",
                urdu: "dropdown",
                uzbek: "dropdown",
                vietname: "dropdown",
                welsh: "dropdown",
                xhosa: "dropdown",
                yiddish: "dropdown",
                yoruba: "dropdown",
                zulu: "dropdown"
            },
            select: {
                afrikaan: "Select",
                albanian: "Select",
                amharic: "Select",
                arabic: "Select",
                armenian: "Select",
                azerbaij: "Select",
                basque: "Select",
                belarusi: "Select",
                bengali: "Select",
                bosnian: "Select",
                bulgaria: "Select",
                catalan: "Select",
                chichewa: "Select",
                chinese: "Select",
                corsican: "Select",
                croatian: "Select",
                czech: "Select",
                danish: "Select",
                dutch: "Select",
                english: "Select",
                esperant: "Select",
                estonian: "Select",
                filipino: "Select",
                finnish: "Select",
                french: "Select",
                frisian: "Select",
                galician: "Select",
                georgian: "Select",
                german: "Select",
                greek: "Select",
                gujarati: "Select",
                haitian: "Select",
                hausa: "Select",
                hebrew: "Select",
                hindi: "Select",
                hungaria: "Select",
                icelandi: "Select",
                igbo: "Select",
                indonesi: "Select",
                irish: "Select",
                italian: "Select",
                japanese: "Select",
                javanese: "Select",
                kannada: "Select",
                kazakh: "Select",
                khmer: "Select",
                korean: "Select",
                kurdish: "Select",
                kyrgyz: "Select",
                lao: "Select",
                latin: "Select",
                latvian: "Select",
                lithuani: "Select",
                luxembou: "Select",
                macedoni: "Select",
                malagasy: "Select",
                malay: "Select",
                malayala: "Select",
                maltese: "Select",
                maori: "Select",
                marathi: "Select",
                mongolia: "Select",
                nepali: "Select",
                norwegia: "Select",
                pashto: "Select",
                persian: "Select",
                polish: "Select",
                portugue: "Select",
                punjabi: "Select",
                romanian: "Select",
                russian: "Select",
                samoan: "Select",
                scottish: "Select",
                serbian: "Select",
                shona: "Select",
                sindhi: "Select",
                sinhala: "Select",
                slovak: "Select",
                slovenia: "Select",
                somali: "Select",
                spanish: "Select",
                sundanes: "Select",
                swahili: "Select",
                swedish: "Select",
                tajik: "Select",
                tamil: "Select",
                telugu: "Select",
                thai: "Select",
                turkish: "Select",
                ukrainia: "Select",
                urdu: "Select",
                uzbek: "Select",
                vietname: "Select",
                welsh: "Select",
                xhosa: "Select",
                yiddish: "Select",
                yoruba: "Select",
                zulu: "Select"
            },
            page_break: {
                afrikaan: "Page Break",
                albanian: "Page Break",
                amharic: "Page Break",
                arabic: "Page Break",
                armenian: "Page Break",
                azerbaij: "Page Break",
                basque: "Page Break",
                belarusi: "Page Break",
                bengali: "Page Break",
                bosnian: "Page Break",
                bulgaria: "Page Break",
                catalan: "Page Break",
                chichewa: "Page Break",
                chinese: "Page Break",
                corsican: "Page Break",
                croatian: "Page Break",
                czech: "Page Break",
                danish: "Page Break",
                dutch: "Page Break",
                english: "Page Break",
                esperant: "Page Break",
                estonian: "Page Break",
                filipino: "Page Break",
                finnish: "Page Break",
                french: "Page Break",
                frisian: "Page Break",
                galician: "Page Break",
                georgian: "Page Break",
                german: "Page Break",
                greek: "Page Break",
                gujarati: "Page Break",
                haitian: "Page Break",
                hausa: "Page Break",
                hebrew: "Page Break",
                hindi: "Page Break",
                hungaria: "Page Break",
                icelandi: "Page Break",
                igbo: "Page Break",
                indonesi: "Page Break",
                irish: "Page Break",
                italian: "Page Break",
                japanese: "Page Break",
                javanese: "Page Break",
                kannada: "Page Break",
                kazakh: "Page Break",
                khmer: "Page Break",
                korean: "Page Break",
                kurdish: "Page Break",
                kyrgyz: "Page Break",
                lao: "Page Break",
                latin: "Page Break",
                latvian: "Page Break",
                lithuani: "Page Break",
                luxembou: "Page Break",
                macedoni: "Page Break",
                malagasy: "Page Break",
                malay: "Page Break",
                malayala: "Page Break",
                maltese: "Page Break",
                maori: "Page Break",
                marathi: "Page Break",
                mongolia: "Page Break",
                nepali: "Page Break",
                norwegia: "Page Break",
                pashto: "Page Break",
                persian: "Page Break",
                polish: "Page Break",
                portugue: "Page Break",
                punjabi: "Page Break",
                romanian: "Page Break",
                russian: "Page Break",
                samoan: "Page Break",
                scottish: "Page Break",
                serbian: "Page Break",
                shona: "Page Break",
                sindhi: "Page Break",
                sinhala: "Page Break",
                slovak: "Page Break",
                slovenia: "Page Break",
                somali: "Page Break",
                spanish: "Page Break",
                sundanes: "Page Break",
                swahili: "Page Break",
                swedish: "Page Break",
                tajik: "Page Break",
                tamil: "Page Break",
                telugu: "Page Break",
                thai: "Page Break",
                turkish: "Page Break",
                ukrainia: "Page Break",
                urdu: "Page Break",
                uzbek: "Page Break",
                vietname: "Page Break",
                welsh: "Page Break",
                xhosa: "Page Break",
                yiddish: "Page Break",
                yoruba: "Page Break",
                zulu: "Page Break"
            },
            signature: {
                afrikaan: "Page Break",
                albanian: "Page Break",
                amharic: "Page Break",
                arabic: "Page Break",
                armenian: "Page Break",
                azerbaij: "Page Break",
                basque: "Page Break",
                belarusi: "Page Break",
                bengali: "Page Break",
                bosnian: "Page Break",
                bulgaria: "Page Break",
                catalan: "Page Break",
                chichewa: "Page Break",
                chinese: "Page Break",
                corsican: "Page Break",
                croatian: "Page Break",
                czech: "Page Break",
                danish: "Page Break",
                dutch: "Page Break",
                english: "Page Break",
                esperant: "Page Break",
                estonian: "Page Break",
                filipino: "Page Break",
                finnish: "Page Break",
                french: "Page Break",
                frisian: "Page Break",
                galician: "Page Break",
                georgian: "Page Break",
                german: "Page Break",
                greek: "Page Break",
                gujarati: "Page Break",
                haitian: "Page Break",
                hausa: "Page Break",
                hebrew: "Page Break",
                hindi: "Page Break",
                hungaria: "Page Break",
                icelandi: "Page Break",
                igbo: "Page Break",
                indonesi: "Page Break",
                irish: "Page Break",
                italian: "Page Break",
                japanese: "Page Break",
                javanese: "Page Break",
                kannada: "Page Break",
                kazakh: "Page Break",
                khmer: "Page Break",
                korean: "Page Break",
                kurdish: "Page Break",
                kyrgyz: "Page Break",
                lao: "Page Break",
                latin: "Page Break",
                latvian: "Page Break",
                lithuani: "Page Break",
                luxembou: "Page Break",
                macedoni: "Page Break",
                malagasy: "Page Break",
                malay: "Page Break",
                malayala: "Page Break",
                maltese: "Page Break",
                maori: "Page Break",
                marathi: "Page Break",
                mongolia: "Page Break",
                nepali: "Page Break",
                norwegia: "Page Break",
                pashto: "Page Break",
                persian: "Page Break",
                polish: "Page Break",
                portugue: "Page Break",
                punjabi: "Page Break",
                romanian: "Page Break",
                russian: "Page Break",
                samoan: "Page Break",
                scottish: "Page Break",
                serbian: "Page Break",
                shona: "Page Break",
                sindhi: "Page Break",
                sinhala: "Page Break",
                slovak: "Page Break",
                slovenia: "Page Break",
                somali: "Page Break",
                spanish: "Page Break",
                sundanes: "Page Break",
                swahili: "Page Break",
                swedish: "Page Break",
                tajik: "Page Break",
                tamil: "Page Break",
                telugu: "Page Break",
                thai: "Page Break",
                turkish: "Page Break",
                ukrainia: "Page Break",
                urdu: "Page Break",
                uzbek: "Page Break",
                vietname: "Page Break",
                welsh: "Page Break",
                xhosa: "Page Break",
                yiddish: "Page Break",
                yoruba: "Page Break",
                zulu: "Page Break"
            },

        }


    },

    refreshIDs = function () {

        var parent;

        if (builder_mode === "web") {
            parent = $("#builder-mode");
        } else if (builder_mode === "popup") {
            parent = $("#popups-page");
        } else if (builder_mode === "print") {
            parent = $("#print-mode");
        }


        var forall = function (parent) {
            parent.find(".row").each(function (row_index) {

                //row-index-a
                //a-column-index-a
                //row-a-column-a-input-a


                var converted_row = row_index.countByAlphabet(),
                    getRowElement = parent.find(".row").eq(row_index),
                    row_id = parent.attr("id") + "-row-index-" + converted_row;

                getRowElement.attr("id", row_id);


                if (getRowElement.attr("id") === parent.attr("id") + "-row-index-" + converted_row) {
                    if (getRowElement.find(".columns").length > 0) {


                        getRowElement.find(".columns").each(function (column_index) {
                            var converted_col = column_index.countByAlphabet(),
                                getColumnElement = getRowElement.find(".columns").eq(column_index),
                                column_id = row_id + "-column-index-" + converted_col;

                            getColumnElement.attr("id", column_id);

                            if (getColumnElement.find("fieldset").length > 0) {

                                getColumnElement.find("fieldset").each(function (form_elements_index) {
                                    var converted_item = form_elements_index.countByAlphabet(),
                                        getFieldsetElement = getColumnElement.find("fieldset").eq(form_elements_index),
                                        type = getFieldsetElement.attr("rel"),
                                        fieldset_id = column_id + "-" + type + "-" + converted_item;
                                    getFieldsetElement.attr("id", fieldset_id);

                                    getFieldsetElement.find(".element-editable").each(function (form_items_index) {

                                        var converted_items = form_items_index.countByAlphabet(),
                                            getItemsFieldsetElement = getFieldsetElement.find(".element-editable").eq(form_items_index),
                                            typeName = getItemsFieldsetElement.tagName(),
                                            element_id = fieldset_id + "-" + typeName + "-" + converted_items;
                                        getItemsFieldsetElement.attr("id", element_id);

                                    });
                                });
                            }
                        });
                    }
                }
            });
        };

        if (parent.attr("id") === "builder-mode") {
            forall(parent);
        } else if (parent.attr("id") === "print-mode") {

            parent.find(".a4-page").each(function (popup_index) {

                //row-index-a
                //a-column-index-a
                //row-a-column-a-input-a


                let converted_row = popup_index.countByAlphabet();
                let getRowElement = parent.find(".a4-page").eq(popup_index);

                getRowElement.attr("id", "a4-page-index-" + converted_row);


                if (getRowElement.attr("id") === "a4-page-index-" + converted_row) {
                    if (getRowElement.find(".row").length > 0) {
                        forall(getRowElement);

                    }
                }
            });
        } else {
            parent.find(".popup-paper").each(function (popup_index) {

                //row-index-a
                //a-column-index-a
                //row-a-column-a-input-a


                let converted_row = popup_index.countByAlphabet();
                let getRowElement = parent.find(".popup-paper").eq(popup_index);

                getRowElement.attr("id", "popup-index-" + converted_row);


                if (getRowElement.attr("id") === "popup-index-" + converted_row) {
                    if (getRowElement.find(".row").length > 0) {
                        forall(getRowElement);

                    }
                }
            });
        }


    },

    elementbuilder = function (elementName) {
        SOMTHING_CHANGED = true;

        var mainElement,
            label_el,
            input_el,
            textarea_el,
            paragraph_el,
            smallte_el,
            checkbox_el,
            radio_el,
            dropdown_el,
            image_el,
            placeholder_el,
            file_el,
            button_el;


        mainElement = $("<fieldset></fieldset>").attr("rel", elementName);
        input_el = $("<input>").attr({"rel": elementName, "autocomplete": "off"});
        label_el = $("<label></label>").attr("rel", elementName);
        placeholder_el = $("<placeholder></placeholder>").attr("rel", elementName);
        textarea_el = $("<textarea rows='3'></textarea>").attr("rel", elementName);
        paragraph_el = $("<p></p>").attr("rel", elementName);
        smallte_el = $("<small></small>").attr("rel", elementName);
        button_el = $("<button type='button'></button>").attr("rel", elementName);

        switch (elementName) {
            case "header":
                mainElement.append($("<h1></h1>").attr("rel", elementName).text("Header")).clone();
                break;
            case "short-text":
                mainElement.append(label_el.text("Short Text"), input_el.attr({
                    "type": "Short Text",
                    "class": "prop-target",
                    "data-target": "text",
                    "data-html": ""
                }), placeholder_el, smallte_el).clone();
                break;
            case "textarea":
                mainElement.append(label_el.text("Textarea"), textarea_el.attr({
                    "class": "prop-target",
                    "data-html": ""
                }), placeholder_el, smallte_el);
                break;
            case "paragraph":
                mainElement.append(label_el.text("Paragraph"), paragraph_el.text("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes").attr({"class": "prop-target"})).clone();
                break;
            case "button":
                mainElement.append(button_el.append($("<span style='width: 100%;display: table;'>Button</span>")).attr({"class": "prop-target"})).clone();
                break;
            case "checkbox":

                checkbox_el = $("<div></div>")
                    .addClass("checkbox_input")
                    .css("width", "50%")
                    .attr("rel", "One")
                    .append(

                        $("<label />").html("Option").on("input", function () {
                            $(this).parent().attr("rel", $(this).text())
                        }),
                        $("<input>").attr({
                            "type": "checkbox",
                            "value": "option1"
                        }),
                        $("<div></div>").addClass("checkmark text-uneditable"),
                    );


                mainElement.attr("number-per-row", "2").addClass("checkbox-btns").append(label_el.text("Checkbox"), checkbox_el).clone();
                break;
            case "radio":
                radio_el = $("<div></div>")
                    .addClass("radio_input")
                    .css("width", "50%")
                    .attr("rel", "One")
                    .append(

                        $("<label />").html("Option").on("input", function () {
                            $(this).parent().attr("rel", $(this).text())
                        }),
                        $("<input>").attr({
                            "type": "radio",
                            "value": "option1",
                            "name": "radio_" + Math.random()
                        }),
                        $("<div></div>").addClass("checkmark text-uneditable"),
                    );

                mainElement.attr("number-per-row", "2").addClass("radio-btns").append(label_el.text("Radio"), radio_el).clone();
                break;
            case "date":
                mainElement.append(label_el.text("Date"), input_el.attr("type", "text").addClass("date-time")).clone();
                break;
            case "phone":
                mainElement.append(label_el.text("Phone"), input_el.attr("type", "tel")).clone();
                break;
            case "image":
                image_el = $("<div></div>").append(
                    $("<img>").attr({
                        "style": "width: 100%; cursor: pointer",
                        "src": "/images/choose.png",
                        "class": "prop-target"
                    }),
                );

                mainElement.append(label_el.text("Image"), image_el.append(
                    input_el.attr({"type": "file", "accept": "image/*"})
                )).clone();
                break;
            case "file":

                file_el = $("<label></label>").append(
                    $("<span></span>").text("File"),
                    $("<br>"),
                    button_el.append($("<span style='width: 100%;display: table;'>Upload File</span>")).attr({"class": "prop-target"}).click(function () {
                        //$(this).next('input').click();
                    }),
                    input_el.attr("type", "file")
                        .change(function () {
                            $(this).next('span').text($(this).val().split('\\').pop());
                            $(this).next('span').next('span').show();
                        }).hide(),
                    $("<span></span>"),
                    $("<span></span>").append("<i class='glyphicon glyphicon-ok'></i></span>").hide()
                );
                mainElement.append(file_el);


                break;
            case "dropdown":


                dropdown_el = $("<select rel='select' class='select-dropdown prop-target' style='width: 100%'>" +
                    "</select>");
                mainElement.append(label_el.text("Select"), dropdown_el, smallte_el);


                break;
            case "page-break":


                mainElement = $("<fieldset></fieldset>").addClass("col-sm-12 page-break animated fadeIn").attr("rel", elementName).append(
                    $("<div></div>").addClass("page-break").append(
                        $("<div></div>").addClass("page-break-inside page-break").append(
                            $("<span class='text-uneditable page-break' style='user-select: none'>Page Break</span>")
                        )
                    ));


                break;
            case "signature":

                var len = $(".sign-start").length;

                var signatrue_el_a, signatrue_el_b, signatrue_el_c;

                signatrue_el_a = $("<div></div>").addClass("sign-start").attr("title", "signature-pad-" + len)
                    .append($("<div></div>").addClass("sign-hint").append($("<span>Sign Here</span>")),
                        $("<div></div>").addClass("written-signatrue").append($("<h2></h2>")).hide(),
                        $("<img>").addClass("image-drew-signatrue").attr("src", "").hide());

                signatrue_el_b = $("<div></div>").addClass("signature-line").attr("style", "padding: 0 30px 0 0;margin: 0 auto 42px auto")
                    .append($("<span class='text-uneditable'></span>"));

                signatrue_el_c = $("<button type='button'></button>")
                    .attr("style", "float: right")
                    .append($("<span style='width: 100%;display: table;'>Clear</span>"));


                mainElement.append(label_el.text("Signature"), signatrue_el_a, signatrue_el_b, signatrue_el_c).clone();


                var signatureELMS = $("fieldset[id*='signature']");

                signatureELMS.find("button").on("click", function () {
                    signatureELMS.find(".sign-hint").show();
                    signatureELMS.find("h2").text("").hide();
                    signatureELMS.find(".image-drew-signatrue").attr("src", "").hide();
                });


                break;
            case "address":

                var $add0 = $("<fieldset></fieldset>").attr("rel", elementName).append(label_el.clone().text("Auto Complate:"), input_el.clone().attr({
                    "type": "text",
                    "class": "prop-target",
                    "data-target": "auto-complate"
                }), placeholder_el.clone(), smallte_el.clone());
                var $add1 = $("<fieldset></fieldset>").attr("rel", elementName).removeClass("col-sm-12").addClass("col-sm-6").append(label_el.clone().text("Street Address:"), input_el.clone().attr({
                    "type": "text",
                    "class": "prop-target",
                    "data-target": "address1"
                }), placeholder_el.clone(), smallte_el.clone());
                var $add2 = $("<fieldset></fieldset>").attr("rel", elementName).removeClass("col-sm-12").addClass("col-sm-6").append(label_el.clone().text("Street Address Line 2:"), input_el.clone().attr({
                    "type": "text",
                    "class": "prop-target",
                    "data-target": "address2"
                }), placeholder_el.clone(), smallte_el.clone());
                var $add3 = $("<fieldset></fieldset>").attr("rel", elementName).removeClass("col-sm-12").addClass("col-sm-6").append(label_el.clone().text("Country:"), input_el.clone().attr({
                    "type": "text",
                    "class": "prop-target",
                    "data-target": "country"
                }), placeholder_el.clone(), smallte_el.clone());
                var $add4 = $("<fieldset></fieldset>").attr("rel", elementName).removeClass("col-sm-12").addClass("col-sm-6").append(label_el.clone().text("City:"), input_el.clone().attr({
                    "type": "text",
                    "class": "prop-target",
                    "data-target": "city"
                }), placeholder_el.clone(), smallte_el.clone());
                var $add5 = $("<fieldset></fieldset>").attr("rel", elementName).removeClass("col-sm-12").addClass("col-sm-6").append(label_el.clone().text("State:"), input_el.clone().attr({
                    "type": "text",
                    "class": "prop-target",
                    "data-target": "state"
                }), placeholder_el.clone(), smallte_el.clone());
                var $add6 = $("<fieldset></fieldset>").attr("rel", elementName).removeClass("col-sm-12").addClass("col-sm-6").append(label_el.clone().text("Postal/Zip Code:"), input_el.clone().attr({
                    "type": "text",
                    "class": "prop-target",
                    "data-target": "zip-code"
                }), placeholder_el.clone(), smallte_el.clone());


                mainElement.addClass("to-unwrapped").append($add0, $add1, $add2, $add3, $add4, $add5, $add6);

                break;

        }


        var languages = $(".selection[title='selected-languages-a']");
        var languagesTOJson = {};


        var text_tags = [
            "LABEL",
            "P",
            "PLACEHOLDER",
            "SMALL",
            "SPAN",
            "H1",
            "H2"
        ];


        mainElement.find("*").each(function () {
            var $this = $(this);
            if ($.inArray($(this).tagName(), text_tags) !== -1) {
                if ($this.hasClass("text-editable")) {
                    $this.on("input", function () {
                        $this.attr("lang", FromJson(delete ToJson($this.attr("lang"))['id']));
                    })
                }

                if (!$this.hasClass("text-uneditable")) {
                    languages.find("option").each(function () {
                        languagesTOJson[$(this).val()] = $this.text();

                    });

                    $this.attr('lang', JSON.stringify(languagesTOJson).replaceAllChars('"', "'"));
                }
            }

        });

        languages.val(languages.find(":selected").val()).change();


        return mainElement; //create it

    },

    rowsbuilder = function (element) {
        SOMTHING_CHANGED = true;
        var data_cells = $(element).attr("data-cells"), rowEl;

        if (data_cells !== "popup") {
            var numberOfDivs = parseInt($(element).attr("data-cells").toString());//Convert numbers of divs to int

            rowEl = $("<div></div>").addClass("row").attr({
                "rel": "row",
                "data-html": element
            }); //creat row element


            for (let n = 1; n <= numberOfDivs; n++) { //loop as number of divs inside the row

                rowEl.append(
                    $("<div></div>").addClass($(element).attr("title") + " columns") //create cols elements
                )
            }
        }
        else {

            rowEl =
                $("<div class='popup-paper' />").append(
                    $("<div class='popup-content' />").append(
                        $("<div />").addClass("popup-clone target-paper").attr("rel", "popup").append(
                            $('<div rel="row" />').addClass("row ui-dragging").append(
                                $('<div class="col-sm-12 columns" />').append(elementbuilder("header"))
                            ),
                            $('<div rel="row" />').addClass("row").append(
                                $('<div class="col-sm-12 columns" />')
                            ),
                            $('<div rel="row" />').addClass("row ui-dragging").append(
                                $('<div class="col-sm-6 columns" />'),
                                $('<div class="col-sm-3 columns" />').append(elementbuilder("button")),
                                $('<div class="col-sm-3 columns" />').append(elementbuilder("button"))
                            ),
                        )
                    ),

                    $("<div class='preview-btn' />").append(
                        $('<button type="button" data-toggle="modal" data-target=".popup-msg" class="text-uneditable" />').text("Preview")
                    )
                );


        }


        return rowEl.clone(); //create it
    },

    setdragdrop = function () {


        $(".form-name h2").hover(function () {
            $(this).attr("contenteditable", "true");
        }, function () {
            $(this).attr("contenteditable", "false");
        });


        $("#rows .panel-item.row-item").not(".popup-paper").find("a.right-side")
            .on("click", function () {
                if (builder_mode === "web") {
                    var el = rowsbuilder(this); //create it

                    $(".target-paper:visible").append(el);

                    el.applyClasses();
                }
            })
            .draggable({
                connectToSortable: ".target-paper",
                placeholder: "SortPlaceholder",
                cursor: "-webkit-grabbing",
                revert: 'invalid',
                revertDuration: 100,
                helper: function (event, ui) {
                    return rowsbuilder(this); //create it
                },
                drag: function (event, ui) {

                },
                stop: function (event, ui) {
                    if (builder_mode !== "print") {
                        $(ui.helper[0]).removeAttr("style").applyClasses();
                        required_function();
                    }
                }
            });

        $("#elements .panel-item.element-item").find("a.right-side[title!='page-break']")
            .on("click", function () {
                if (builder_mode === "web") {

                    var elementName = $(this).attr("title");//Get Element type name to add

                    var el = elementbuilder(elementName);
                    /*
                                        var getSelected = $(".selected-element");

                                        if (getSelected.hasClass("row")) {
                                            create_element = el;
                                            getSelected.find(".columns").eq(0).prepend(create_element);
                                        } else if (getSelected.hasClass("columns")) {
                                            create_element = el;
                                            getSelected.prepend(create_element);
                                        } else {

                                        }
                    */

                    var create_element = $("<div></div>").addClass("row").attr("rel", "row").append(
                        $("<div></div>").addClass("col-sm-12 columns").append(el));

                    $(".builder-paper.target-paper").append(create_element);

                    //alert("ff");


                    create_element.applyClasses();
                }

            })
            .draggable({
                connectToSortable: ".v-web.columns,.v-popup.columns",
                placeholder: "SortPlaceholder",
                cursor: "-webkit-grabbing",
                revert: 'invalid',
                revertDuration: 100,
                start: function (event, ui) {
                    $(".delete-column").hide();
                },
                helper: function (event, ui) {
                    var elementName = $(this).attr("title");//Get Element type name to add

                    return elementbuilder(elementName);
                },
                drag: function (event, ui) {

                },
                stop: function (event, ui) {
                    if (builder_mode !== "print") {
                        $(ui.helper[0]).applyClasses();
                        $(ui.helper[0]).find("> .tools-hover").remove();
                        $(ui.helper[0]).find("fieldset").unwrap();
                        required_function();

                    }
                }
            });

        $("#elements .panel-item.element-item a.right-side[title='page-break']")
            .on("click", function () {
                if (builder_mode === "web") {

                    var elementName = $(this).attr("title");//Get Element type name to add

                    var el = elementbuilder(elementName);

                    var createRow = $("<div></div>").addClass("element-unprintable page-break v-web row standard-row animated fadeIn").attr("rel", "row").append(
                        $("<div></div>").css({"height":"50px"}).addClass("col-sm-12 columns page-break resizable animated fadeIn").append(el));

                    createRow.find("*").css({"pointer-events": "none"});
                    $(".builder-paper.target-paper").append(createRow);

                    //alert("ff");

                    required_function();
                }

            })
            .draggable({
                connectToSortable: ".builder-paper.target-paper",
                placeholder: "SortPlaceholder",
                cursor: "-webkit-grabbing",
                revert: 'invalid',
                revertDuration: 100,
                start: function (event, ui) {
                    $(".delete-column").hide();
                },
                helper: function (event, ui) {
                    var elementName = $(this).attr("title");//Get Element type name to add

                    var el = elementbuilder(elementName);

                    var createRow = $("<div></div>").addClass("element-unprintable page-break v-web row standard-row animated fadeIn").attr("rel", "row").append(
                        $("<div></div>").css({"height":"50px"}).addClass("col-sm-12 columns page-break resizable animated fadeIn").append(el));

                    createRow.find("*").css({"pointer-events": "none"});

                    return createRow;

                },
                drag: function (event, ui) {

                },
                stop: function (event, ui) {
                    if (builder_mode !== "print") {
                        required_function();

                    }
                }
            });

        $("#rows .panel-item.row-item.popup-paper").find("a.right-side")
            .on("click", function () {
                if (builder_mode === "popup") {

                    var el = rowsbuilder(this); //create it


                    $("#popups-page").append(el);

                    el.applyClasses();

                }
            })
            .draggable({
                connectToSortable: "#popups-page",
                placeholder: "SortPlaceholder",
                cursor: "-webkit-grabbing",
                revert: 'invalid',
                revertDuration: 100,
                helper: function (event, ui) {
                    return rowsbuilder(this); //create it
                },
                drag: function (event, ui) {

                },
                stop: function (event, ui) {
                    if (builder_mode === "popup") {

                        $(ui.helper[0]).applyClasses();
                        $(ui.helper[0]).find(".ui-dragging").removeClass("ui-dragging");
                        required_function();

                    }
                }
            });

    },

    addHelpers = function (a4page) {

        var textElements = [
            a4page.find("h1"),
            a4page.find("p"),
            a4page.find("label"),
            a4page.find("small"),
            a4page.find("span"),
            a4page.find("font"),
            a4page.find("placeholder")
        ];


        $.each(textElements, function (index) {
            this.each(function () {
                if (!$(this).hasClass("text-uneditable")) {
                    if ($(this).tagName() !== "FONT" && $(this).tagName() !== "A") {
                        $(this).addClass("text-editable element-editable")
                    } else {
                        $(this).addClass("element-editable");

                    }
                }

            })
        });

        $(".text-editable").textEditiable();

        a4page.find("fieldset").addClass("item");
        a4page.find("" +
            "input:not([type='file']):not([type='radio']):not([type='checkbox'])," +
            "img," +
            "textarea," +
            "button[class!='text-uneditable']," +
            ".row," +
            "fieldset," +
            ".columns:not(.page-break)," +
            ".popup-content," +
            "select").addClass("element-editable");

        // a4page.find("fieldset,.columns").addClass("element-resizable");
    },

    removeHelpers = function (a4page, key) {
        var textElements = [
            a4page.find("h1"),
            a4page.find("p"),
            a4page.find("label"),
            a4page.find("small"),
            a4page.find("span"),
            a4page.find("font"),
            a4page.find("placeholder"),
            a4page.find("button")
        ];


        a4page.find(".tools-hover").remove();
        a4page.find(".delete-column").remove();
        a4page.find(".ui-resizable-handle").remove();
        a4page.find(".ui-resizable").removeClass("ui-resizable");
        a4page.find(".ui-draggable").removeClass("ui-draggable");
        a4page.find(".ui-droppable").removeClass("ui-droppable");
        a4page.find(".ui-sortable").removeClass("ui-sortable");
        a4page.find(".ui-droppable-hover").removeClass("ui-droppable-hover");
        if (key === "save" || key === "web" || key === "print") {
            a4page.find(".selected-element").removeClass("selected-element");
        }

        if (key !== "print") {
            a4page.find(".text-editable").removeClass("text-editable");
            a4page.find(".element-editable").removeClass("element-editable");
            a4page.find(".element-editable").removeAttr("id");

        }


        return a4page;
    },

    setUpElement = function (parent) {
        var target_page = parent.find(".target-paper"),//where rows dropped
            popup_element = parent.find(".popup-content"),//main div of popup
            popups_page = parent.find("#popups-page"),//where popup dropped
            columns = parent.find(".columns:not(.page-break)"),
            fieldset = parent.find("fieldset:not(.page-break)"),
            rows = parent.find(".row"),
            textarea_el = parent.find("textarea"),
            img_el = parent.find(".img-button"),
            date_time_el = parent.find(".date-time");

        removeHelpers(parent, "");
        addHelpers(parent);


        popup_element.each(function (index) {
            popup_element.eq(index).addToolsHelper("popup");
        });//add icons
        rows.each(function (index) {
            rows.eq(index).addToolsHelper("row");
        });//add icons
        columns.each(function (index) {
            if(!columns.eq(index).parent().hasClass("page-break")){
                columns.eq(index).addToolsHelper("columns");
            }
        });//add icons
        fieldset.each(function (index) {
            if(!fieldset.eq(index).parent().parent().hasClass("page-break")){
                fieldset.eq(index).addToolsHelper("element")
            }
        });//add icons


        $("fieldset[rel='image']").each(function () {

            $(this).find("img").off();
            $(this).find("input").off();

            $(this).find("img").click(function () {
                $(this).next('input').click();
                console.log("hi");
            });
            $(this).find("input").change(function () {
                var img_el = $(this).prev("img");
                var reader = new FileReader();
                reader.onload = function (e) {
                    img_el.attr('src', e.target.result);
                };
                reader.readAsDataURL(this.files[0]);

                saveCache();
            }).hide();


        });


        if (img_el.length > 0) {
            img_el.resizable({
                aspectRatio: true,
                resize: function (event, ui) {
                    ui.element.css({"max-width": "100%", "height": "auto"});
                }
            });
        }
        if (date_time_el.length > 0) {
            date_time_el.daterangepicker({singleDatePicker: !0, singleClasses: "picker_2"}, function (a, b, c) {
            });
        }

        columns.column_resizable();
        fieldset.fieldset_resizable();


        popups_page.Settings("popup");
        target_page.Settings("form");
        columns.Settings("column");
        fieldset.Settings("element");

        $("*[rel='undefined']").remove();
        if (builder_mode !== "print") {
            refreshIDs();
        }
        layers();

    },

    recollectColumns = function () {
        $(".builder-paper").find(".row").each(function () { //loop all rows in builder

            var $sum = 0;
            $(this).find(".columns").each(function () { //loop all columns in single row in builder
                var this_class = ($(this).attr("class").match(/(^|\s)col-\S+/g) || []).join(' '); //extract col-sm from all classes
                $sum += parseInt(this_class.split("-")[2]); //extract the number of col-sm and convert it to intger

            });
            if ($sum < 12) { //check if there are a row has less than 12 col
                var this_class = ($(this).find(".columns:last").attr("class").match(/(^|\s)col-\S+/g) || []).join(' ');

                var newWidth = (12 - $sum) + parseInt(this_class.split("-")[2]);
                $(this).find(".columns:last").removeClass(this_class).addClass("col-sm-" + newWidth);


            }
        })
    },
    counter = 0,
    required_function = function () {
        var main_builder = $("#builder-mode"),
            main_popup_builder = $("#popup-builder-mode");

        recollectColumns();
        setUpElement(main_builder);
        setUpElement(main_popup_builder);
        setDropdownFields();

        saveCache();
        counter += 1;
        test(counter);
    },

    onLoad = function () {

        $("select[title='selected-languages-a']").html("");
        if ($settings.additional_languages.length > 0 && $settings.main_language.length > 0) {
            $('#options-lang').addTag($settings.main_language);
            $.each($settings.additional_languages.split(","), function () {
                $('#options-lang').addTag(this);
            });
        } else {

            $('#options-lang').addTag($settings.main_language);
        }

        $("select[title='selected-languages-a']").find("option[value='" + $settings.main_language + "']").prop("selected", true).change();


        $("#left-panel").find("a").on("click", function (event) {
            event.preventDefault();
        })

    };


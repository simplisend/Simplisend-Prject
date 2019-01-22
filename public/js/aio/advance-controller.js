/**
 * @return {string}
 */

(function ($) {


    String.prototype.checkLangValues = function () {
        var match = false;
        var $this = this;

        $.each($languages_codes, function (k, v) {
            //display the key and value pair
            if ($this == v) {

                match = true;
                return false;
            }
        });

        return match;

    };
    String.prototype.checkLangKeys = function () {
        var match = false;
        var $this = this;


        match = ($languages_codes[$this] != undefined);
        return match;

    };
    String.prototype.getLangValues = function () {
        var match = "";
        var $this = this;

        match = $languages_codes[$this];

        return match;

    };
    String.prototype.getLangKeys = function () {
        var match = "";
        var $this = this;
        $.each($languages_codes, function (k, v) {


            if ($this == v) {
                match = k;

            }
        });


        return match;

    };
    String.prototype.checkFormat = function () {
        var match = false;

        var allparts = this.split(" ");
        var langName = allparts[0];

        if (allparts.length === 2) {
            if (allparts[1].length > 2) {
                var shortcode = allparts[1].match(/\(([^)]+)\)/)[1];
                var format = langName + " (" + shortcode + ")";

                var diff = [...this].filter(v => [...format].indexOf(v) == -1);


                if (shortcode.checkLanguageAvaibility() && langName.checkLanguageAvaibility()) {
                    if (this == format) {
                        match = true;
                    }
                }

            }
        }

        return match;

    };
    String.prototype.checkLanguageAvaibility = function () {

        var tag = this;

        var ret = false;

        var tagToLowerCase = tag.toLowerCase(); //ar
        var tagToCapitalize = tag.capitalize(); //Ar


        ret = tagToLowerCase.checkLangValues();


        if (!ret) {
            ret = tagToLowerCase.checkLangKeys();
        }

        return ret;

    };
    String.prototype.makeLangLabel = function () {
        var tag = this;

        var tagToLowerCase = tag.toLowerCase();

        var text_lang, text_code, textAdd;

        if (tagToLowerCase.checkLangValues()) {
            text_lang = tagToLowerCase.getLangKeys();
            text_code = tagToLowerCase;
        } else {
            text_code = tagToLowerCase.getLangValues();
            text_lang = tagToLowerCase;

        }

        textAdd = text_lang.capitalize() + " (" + text_code.toUpperCase() + ")";

        var count = $('select[title="selected-languages-a"] option[value="' + text_lang.toLowerCase() + '"]').length;

        if (count === 0) {
            $("select[title='selected-languages-a']").append($("<option></option>").text(text_lang.capitalize()).attr({
                "title": text_code.toLowerCase(),
                "value": text_lang.toLowerCase()
            }));
            $("select[title='selected-languages-b']").append($("<option></option>").text(text_lang.capitalize()).attr({
                "title": text_code.toLowerCase(),
                "value": text_lang.toLowerCase()
            }));

            // var languagesTOJson = {};

        }

        return textAdd;


    };
    $.fn.restoreValues_advanceController = function () {

        var $this = $(this),
            $this_id = $this.attr("id");
        $(".panel-item.elements-layers").css("visibility", "visible");
        var selected_lang = $("select.selection[title='selected-languages-b']").find(":selected").val();

        var settings = {
            element_tag: $this.tagName(),
            element_name: $this.parents("fieldset").attr("title"),
            element_checkbox: $this.hasClass("checkbox-btns"),
            element_radio: $this.hasClass("radio-btns"),
            element_select: $this.hasClass("select-dropdown"),
            hasclass: $this.hasClass("text-editable")
        };
        var element_text = "";
        if (settings.hasclass) {
            if($(this).hasAttr("lang")) {
                element_text = ToJson($this.attr("lang"))[selected_lang];
            }else{
                element_text = $this.text();
            }
        }


        var language_options = $(".selected-languages-b");
        language_options.show();

        var mainRightElement = $(".elements-layers");
        mainRightElement.find("#element-name").text(settings.element_name);
        var elements = {
            element_content_text: mainRightElement.find("#element-text-contain"),
            sub_text_contain: mainRightElement.find("#sub-text-contain"),
            element_options: mainRightElement.find("#element-options"),
            placeholder_contain: mainRightElement.find("#placeholder-contain"),
            element_options_languages: mainRightElement.find("#element-options-languages")
        };
        $.each(elements, function (index) {
            $(this).hide();
        });

        if (settings.hasclass && !settings.element_select) {
            elements.element_content_text.show();
            elements.element_content_text.find("textarea").val(element_text);
        }
        else {

            if ($(this).nextAll("small").length > 0) {
                var get_small = ToJson($(this).nextAll("small").attr("lang"))[selected_lang];
            }
            if ($(this).nextAll("placeholder").length > 0) {
                var get_placeholder = ToJson($(this).nextAll("placeholder").attr("lang"))[selected_lang];
            }

            if (settings.element_tag === "INPUT") {
                elements.placeholder_contain.show();
                elements.sub_text_contain.show();

                // alert($(this).nextAll("small[lang='" + selected_lang + "']").text());

                elements.sub_text_contain.find("textarea").val(get_small);
                elements.placeholder_contain.find("textarea").val(get_placeholder);
            }
            else if (settings.element_tag === "TEXTAREA") {
                elements.placeholder_contain.show();
                elements.sub_text_contain.show();

                elements.sub_text_contain.find("textarea").val(get_small);
                elements.placeholder_contain.find("textarea").val(get_placeholder);
            }
            else if (settings.element_checkbox || settings.element_radio) {
                elements.sub_text_contain.show();
                elements.element_options.show();

                elements.sub_text_contain.find("textarea").val(get_small);

                var maps = $(this).find("." + $(this).attr('rel') + "_input").map(function () {
                    return $(this).attr("rel");
                }).get().join(",");


                $('#element-options input').eq(0).importTags(maps);

            }
            else if (settings.element_select) {
                elements.sub_text_contain.show();
                // elements.element_options.show();
                elements.element_options_languages.show();

                elements.sub_text_contain.find("textarea").val(get_small);


            }
            else {
                test($(body_event.target).attr("contenteditable"));
                // alert(language_options.attr("class"));
                $(".panel-item.elements-layers").css("visibility", "hidden");

                language_options.hide();
            }
        }
        // alert(settings.element_name);


    };
    /**************************************** Start Language plugin ****************************************/


})(jQuery);

/**
 * @return {string}
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


    },

    layers = function () {


        var element_target;

        if (builder_mode === "web") {
            element_target = $("#builder-mode");
        } else if (builder_mode === "popup") {
            element_target = $("#popups-page");
        } else if (builder_mode === "print") {
            element_target = $("#print-mode");
        }


        $("#elements-layers").html("");


        let icons = {
            header: '<i class="icons icons-header"></i>',
            short_text: '<i class="icons icons-short-text"></i>',
            textarea: '<i class="icons icons-long-text"></i>',
            text: '<i class="icons icons-icons-text"></i>',
            button: '<i class="icons icons-button"></i>',
            image: '<i class="icons icons-image"></i>',
            checkbox: '<i class="icons icons-checks"></i>',
            radio: '<i class="icons icons-radios"></i>',
            date: '<i class="icons icons-date"></i>',
            signature: '<i class="icons icons-signature"></i>',
            phone: '<i class="icons icons-phone"></i>',
            page_break: '<i class="icons icons-page-break"></i>',
            page: '<i class="icons icons-page"></i>',
            file: '<i class="icons icons-upload"></i>',
            dropdown: '<i class="icons icons-dropdown"></i>',
            address: '<i class="icons icons-address"></i>'
        };


        var forall = function (element_target, elements_layers) {
            var visibility = "block";

            if (element_target.parent().attr("id") === "popups-page" || element_target.parent().attr("id") === "print-mode") {
                visibility = "none";
            }

            var appending = $("<ul class='row-list' style='display: " + visibility + "' />");

            element_target.find(".row").each(function (row_index) {


                let converted = row_index.countByAlphabet();
                let getRowElement = element_target.find(".row").eq(row_index);


                if (getRowElement.attr("id") === element_target.attr('id') + "-row-index-" + converted) {
                    let rowCreate_li = $("<li></li>");

                    var title_row = getRowElement.attr('rel');
                    var attr = getRowElement.hasAttr('title');
                    if (attr) {
                        title_row = getRowElement.attr("title");
                    }
                    if (getRowElement.hasClass("page-break")) {
                        title_row = "Page Break";
                    }

                    let in_li = $("<div></div>")
                        .addClass("subitem clickable-item")
                        .attr({"title": getRowElement.attr("id")})
                        .append((row_index + 1) + "- <i class='icons icons-rows-1'></i> <span>" + title_row + "</span>");


                    rowCreate_li.append(in_li);

                    let listInRow_li = $("<ul></ul>").addClass("column-list list-target");
                    let createRowList = rowCreate_li.append(listInRow_li.hide());

                    if (getRowElement.find(".columns:not(.page-break)").length > 0) {
                        getRowElement.find(".columns").each(function (column_index) {
                            converted = column_index.countByAlphabet();
                            let getColumnElement = getRowElement.find(".columns").eq(column_index);
                            let columnCreate_li = $("<li></li>");

                            var title_column = "Column " + (column_index + 1);
                            var attr = getColumnElement.hasAttr('title');
                            if (attr) {
                                title_column = getColumnElement.attr("title");
                            }


                            let in_li = $("<div></div>")
                                .addClass("subitem clickable-item")
                                .attr({"title": getColumnElement.attr("id")})
                                .append("<i class='icons icons icons-link'></i> <span>" + title_column + "</span>");
                            columnCreate_li.append(in_li);

                            let listInColumn_li = $("<ul></ul>").addClass("elements-list list-target");
                            let createColumnList = columnCreate_li.append(listInColumn_li.hide());

                            if (getColumnElement.find("fieldset").length > 0) {
                                getColumnElement.find("fieldset").each(function (form_elements_index) {
                                    converted = form_elements_index.countByAlphabet();

                                    var getFieldsetElement = getColumnElement.find("fieldset").eq(form_elements_index);


                                    let fieldsetList = $("<li></li>");

                                    var title_fieldsetL = getFieldsetElement.attr("rel");
                                    var attr = getFieldsetElement.hasAttr('title');
                                    if (attr) {
                                        title_fieldsetL = getFieldsetElement.attr("title");
                                    }


                                    let in_li = $("<div></div>")
                                        .addClass("subitem clickable-item")
                                        .attr({"title": getFieldsetElement.attr("id")})
                                        .append(icons[getFieldsetElement.attr("rel").replaceAllChars("-", "_")] + " <span>" + title_fieldsetL + "</span>");
                                    fieldsetList.append(in_li);


                                    var listInFieldsetElement = $("<ul></ul>").addClass("items-list list-target");
                                    var listInFieldset = fieldsetList.append(listInFieldsetElement.hide());

                                    if (getFieldsetElement.find(".element-editable").length > 0) {
                                        getColumnElement.find(".element-editable").each(function (_form_elements_index) {
                                            converted = _form_elements_index.countByAlphabet();

                                            var getElement = getColumnElement.find(".element-editable").eq(_form_elements_index);

                                            if (getElement.tagName() === "LABEL") {
                                                let elementList = $("<li></li>");

                                                var title_element = icons[getElement.parent().attr("rel").replaceAllChars("-", "_")] + " <span>" + getElement.tagName() + "</span>";
                                                var attr = getElement.hasAttr('title');
                                                if (attr) {
                                                    title_element = icons[getElement.parent().attr("rel").replaceAllChars("-", "_")] + " <span>" + getElement.attr("title") + "</span>";
                                                }

                                                if(getElement.parents(".checkbox_input").length > 0 || getElement.parents(".radio_input").length > 0){
                                                    title_element = " <span>" + getElement.html() + "</span>";

                                                }


                                                let in_li = $("<div></div>")
                                                    .addClass("subitem clickable-item")
                                                    .attr({"title": getElement.attr("id")})
                                                    .append(title_element);
                                                elementList.append(in_li);

                                                // var listInFieldsetElement = $("<ul></ul>").addClass("items-list list-target");
                                                // var listInFieldset = fieldsetList.append(listInFieldsetElement.hide());

                                                listInFieldsetElement.append(elementList);
                                            }


                                        });
                                    }


                                    listInColumn_li.append(fieldsetList);


                                });
                            }

                            listInRow_li.append(columnCreate_li);
                        });
                    }
                    appending.append(rowCreate_li);

                    elements_layers.append(appending);

                }


            });
        };
        if (element_target.attr("id") === "builder-mode") {
            forall(element_target, $("#elements-layers"));
        }
        else if (element_target.attr("id") === "popups-page") {
            var appending = $("<ul class='popup-list' />");

            element_target.find(".popup-paper").each(function (popup_index) {


                let converted = popup_index.countByAlphabet();
                let getRowElement = element_target.find(".popup-paper").eq(popup_index);

                //"popup-index-" + converted_row

                if (getRowElement.attr("id") === "popup-index-" + converted) {
                    let rowCreate_li = $("<li></li>");

                    var title_row = "PopUp";
                    var attr = getRowElement.hasAttr('title');
                    if (attr) {
                        title_row = getRowElement.attr("title");
                    }

                    let in_li = $("<div></div>")
                        .addClass("subitem clickable-item")
                        .attr({"title": getRowElement.attr("id")})
                        .append((popup_index + 1) + "- <i class='icons icons-rows-1'></i> ", $("<span>" + title_row + "</span>"));


                    rowCreate_li.append(in_li);


                    if (getRowElement.find(".row").length > 0) {

                        forall(getRowElement, rowCreate_li)
                    }
                    appending.append(rowCreate_li);

                    $("#elements-layers").append(appending);
                    // rowCreate_li = $("#elements-layers").find("> ul");


                }


            });
        }
        else if (element_target.attr("id") === "print-mode") {
            var appending = $("<ul class='pages-items-list' />");

            element_target.find(".a4-page").each(function (popup_index) {



                let converted = popup_index.countByAlphabet();

                let getRowElement = element_target.find(".a4-page").eq(popup_index);

                //"popup-index-" + converted_row

                if (getRowElement.attr("id") === "a4-page-index-" + converted) {
                    let rowCreate_li = $("<li></li>");

                    var title_row = "Page";
                    var attr = getRowElement.hasAttr('title');

                    if (attr) {
                        title_row = getRowElement.attr("title");
                    }

                    let in_li = $("<div></div>")
                        .addClass("subitem clickable-item")
                        .attr({"title": getRowElement.attr("id")})
                        .append((popup_index + 1) + "- <i class='icons icons-page'></i> ", $("<span>" + title_row + "</span>"));


                    rowCreate_li.append(in_li);


                    if (getRowElement.find(".row").length > 0) {

                        forall(getRowElement, rowCreate_li)
                    }
                    appending.append(rowCreate_li);

                    $("#elements-layers").append(appending);
                    // rowCreate_li = $("#elements-layers").find("> ul");


                }


            });
        }

        if (builder_mode !== "print") {
            $("#elements-layers").find("span").dblclick(function () {
                $(this).hide();
                $(this).next().attr("type", "text").val($(this).text());
            });
            $("#elements-layers").find("span").after($("<input type='hidden' style='width: 100px'>").on("change", function () {
                $(this).prev().text(this.value);
                $(this).prev().show();
                $("#" + $(this).parent().attr("title")).attr("title", this.value);
                $(this).attr("type", "hidden");
            }));
        }

        $("#elements-layers").find(".subitem").on("click", function () {

            if ($(this).hasClass("clickable-item")) {
                $(".layers .selected-element").removeClass("selected-element");
                $(this).addClass("selected-element");
                if ($(this).parent().parent().hasClass("popup-list")) {

                    element_target.find("#" + $(this).attr("title")).find(".popup-content").click();
                } else {
                    element_target.find("#" + $(this).attr("title")).click();
                }


                var MyContainerDiv, $target;
                if (builder_mode === "web") {
                    $target = $(".builder-paper div[id='" + $(this).attr("title") + "']");
                    if (element_target.find(".builder-paper:first-child").innerHeight() > 630 && $target.length !== 0) {
                        MyContainerDiv = "#builder-mode";
                        $(MyContainerDiv).animate({scrollTop: $(MyContainerDiv).scrollTop() + ($target.offset().top - element_target.offset().top)});

                        // $("#panel_contents").scrollTo(".layers div[title='" + clicked.attr('id') + "']", 700);
                    }
                } else if (builder_mode === "popup") {
                    $target = $("#popups-page div[id='" + $(this).attr("title") + "']");
                    // alert(element_target.attr("id"));
                    if (element_target.innerHeight() > 630 && $target.length !== 0) {
                        MyContainerDiv = "#popup-builder-mode";

                        $(MyContainerDiv).animate({scrollTop: $(MyContainerDiv).scrollTop() + ($target.closest(".popup-paper").offset().top - $(MyContainerDiv).offset().top)});

                        // $("#panel_contents").scrollTo(".layers div[title='" + clicked.attr('id') + "']", 700);
                    }
                } else {
                    $target = $(".a4-page div[id='" + $(this).attr("title") + "']");
                    if (element_target.innerHeight() > 600 && $target.length !== 0) {
                        if ($target.hasClass("element-header")) {
                            MyContainerDiv = "#print-mode";
                            $(MyContainerDiv).animate({scrollTop: 0});
                        } else if ($target.hasClass("element-footer")) {
                            MyContainerDiv = "#print-mode";
                            $(MyContainerDiv).animate({scrollTop: $(MyContainerDiv).height()});
                        } else {
                            MyContainerDiv = "#print-mode";
                            $(MyContainerDiv).animate({scrollTop: $(MyContainerDiv).scrollTop() + ($target.offset().top - element_target.offset().top)});
                        }

                        // $("#panel_contents").scrollTo(".layers div[title='" + clicked.attr('id') + "']", 700);
                    }
                }


            }

            if ($(this).next().find("li").length !== 0) {
                if ($(this).next().hasClass("column-list")) {

                    $("#elements-layers .column-list.list-target").slideUp();
                } else if ($(this).next().hasClass("elements-list")) {

                    $("#elements-layers .elements-list.list-target").slideUp();
                }
                if ($(this).next().css("display") === "none") {
                    $(this).next().slideDown();
                } else {
                    $(this).next().slideUp();
                }
            } else {
                if ($(this).next().hasClass("column-list")) {
                    notification("Sorry!", "This Column is empty", "error")
                }
            }


        })
    },

    forms = function () {
        $("#elements-layers > .row-list").html("");
        let icons = {
            head: '<i class="icons icons-header"></i>',
            input: '<i class="icons icons-short-text"></i>',
            textarea: '<i class="icons icons-long-text"></i>',
            text: '<i class="icons icons-icons-text"></i>',
            button: '<i class="icons icons-button"></i>',
            image: '<i class="icons icons-image"></i>',
            checkbox: '<i class="icons icons-checks"></i>',
            radio: '<i class="icons icons-radios"></i>',
            date: '<i class="icons icons-date"></i>',
            signature: '<i class="icons icons-signature"></i>',
            phone: '<i class="icons icons-phone"></i>',
            page_Break: '<i class="icons icons-page-break"></i>',
            file: '<i class="icons icons-upload"></i>',
            dropdown: '<i class="icons icons-dropdown"></i>',
            address: '<i class="icons icons-address"></i>'
        };
        $("#builder-mode .row").each(function (row_index) {


            let converted = row_index.countByAlphabet();
            let getRowElement = $("#builder-mode .row").eq(row_index);


            if (getRowElement.attr("id") === "row-index-" + converted) {
                let rowCreate_li = $("<li></li>");

                var title_row = getRowElement.attr('rel');
                var attr = getRowElement.hasAttr('title');
                if (attr) {
                    title_row = getRowElement.attr("title");
                }

                let in_li = $("<div></div>")
                    .addClass("subitem clickable-item")
                    .attr({"style": "padding-left: 5px;", "title": getRowElement.attr("id")})
                    .append((row_index + 1) + "- <i class='icons icons-rows-1'></i> <span>" + title_row + "</span>");


                rowCreate_li.append(in_li);

                let listInRow_li = $("<ul></ul>").addClass("column-list list-target");
                let createRowList = rowCreate_li.append(listInRow_li.hide());

                if (getRowElement.find(".columns").length > 0) {
                    getRowElement.find(".columns").each(function (column_index) {
                        converted = column_index.countByAlphabet();
                        let getColumnElement = getRowElement.find(".columns").eq(column_index);
                        let columnCreate_li = $("<li></li>");

                        var title_column = "Column " + (column_index + 1);
                        var attr = getColumnElement.hasAttr('title');
                        if (attr) {
                            title_column = getColumnElement.attr("title");
                        }


                        let in_li = $("<div></div>")
                            .addClass("subitem clickable-item")
                            .attr({"title": getColumnElement.attr("id")})
                            .append("<i class='icons icons icons-link'></i> <span>" + title_column + "</span>");
                        columnCreate_li.append(in_li);

                        let listInColumn_li = $("<ul></ul>").addClass("elements-list list-target");
                        let createColumnList = columnCreate_li.append(listInColumn_li.hide());

                        if (getColumnElement.find(".form-group").length > 0) {
                            getColumnElement.find(".form-group").each(function (form_elements_index) {
                                converted = form_elements_index.countByAlphabet();

                                var getFieldsetElement = getColumnElement.find(".form-group").eq(form_elements_index);


                                let fieldsetList = $("<li></li>");

                                var title_fieldsetL = getFieldsetElement.attr("rel");
                                var attr = getFieldsetElement.hasAttr('title');
                                if (attr) {
                                    title_fieldsetL = getFieldsetElement.attr("title");
                                }


                                let in_li = $("<div></div>")
                                    .addClass("subitem clickable-item")
                                    .attr({"title": getFieldsetElement.attr("id")})
                                    .append(icons[getFieldsetElement.attr("rel")] + " <span>" + title_fieldsetL + "</span>");
                                fieldsetList.append(in_li);


                                var listInFieldsetElement = $("<ul></ul>").addClass("items-list list-target");
                                var listInFieldset = fieldsetList.append(listInFieldsetElement.hide());
                                if (getFieldsetElement.find(".element-editable").length > 0) {
                                    getFieldsetElement.find(".element-editable").each(function (elements_items_index) {
                                        converted = elements_items_index.countByAlphabet();

                                        var getItemsElement = getFieldsetElement.find(".element-editable").eq(elements_items_index);


                                        let itemsList = $("<li></li>");

                                        var title_Items = getItemsElement.tagName();
                                        var attr = getItemsElement.hasAttr('title');
                                        if (attr) {
                                            title_Items = getItemsElement.attr("title");
                                        }

                                        if (getItemsElement.css("display") !== "none") {


                                            let in_li = $("<div></div>")
                                                .addClass("subitem clickable-item")
                                                .attr({"title": getItemsElement.attr("id")})
                                                .append("<i class='icons icons icons-link'></i> <span>" + title_Items + "</span>");
                                            itemsList.append(in_li);


                                            var listFieldsetElements = $("<ul></ul>");
                                            var listInFieldset = itemsList.append(listFieldsetElements);
                                            listInFieldsetElement.append(itemsList);

                                        }
                                    });
                                }
                                listInColumn_li.append(fieldsetList);


                            });
                        }

                        listInRow_li.append(columnCreate_li);
                    });
                }
                $("#elements-layers > .row-list").append(rowCreate_li);


            }


        });
        $("#elements-layers").find(".subitem").on("click", function () {

            if ($(this).hasClass("clickable-item")) {
                $(".layers .selected-element").removeClass("selected-element");
                $(this).addClass("selected-element");
                $("#" + $(this).attr("title")).click();
            }

            if ($(this).next().find("li").length !== 0) {
                if ($(this).next().hasClass("column-list")) {

                    $("#elements-layers .column-list.list-target").slideUp();
                } else if ($(this).next().hasClass("elements-list")) {

                    $("#elements-layers .elements-list.list-target").slideUp();
                }
                if ($(this).next().css("display") === "none") {
                    $(this).next().slideDown();
                } else {
                    $(this).next().slideUp();
                }
            } else {
                if ($(this).next().hasClass("column-list")) {
                    notification("Sorry!", "This Column is empty", "error")
                }
            }


        })
    },

    appendForms = function () {
        $("#form-layers .sub-list").html("");

        if ($("input[name='related_forms']").eq(0).val() !== "") {
            var $related_forms = ToJson($("input[name='related_forms']").eq(0).val());

            $.each($related_forms, function (index) {

                var $url = $("code#openForm").attr("content") + "/" + this.id;
                var $html = '' +
                    ' <li>\n' +
                    '     <div class="subitem">' +
                    '<a href="' + $url + '"><i class="icons icons-link"></i></a>' +
                    '<a href="' + $url + '"><i class="icons icons-page"></i></a>' + this.name + '\n' +
                    '     </div>\n' +
                    ' </li>';

                $("#form-layers .sub-list").append($html);
            })
        }
    },

    setEvents = function () {
        $('#add-language-function').click(function () {
            var fullname = $('.selection[title="list-languages"]').val();


            $('#options-lang').addTag(fullname);
        }); //Plus BTN to add new language by Select.selection[title="list-languages"] value


        var mainelement = $(".elements-layers"),
            text_textarea = mainelement.find("#element-text-contain textarea"),
            subtext_textarea = mainelement.find("#sub-text-contain textarea"),
            placeholder_textarea = mainelement.find("#placeholder-contain textarea");


        var $url = $("#links").find("#getWordsList").attr("content") + "/" + selectedLanguage_b;


        $.get($url, function (data, status) {
            var TwoArrays = data.toString().split("=");
            var availableWords = TwoArrays[0].toString().split(",");
            var wordsIds = TwoArrays[1].toString().split(",");


            $(".elements-layers textarea").each(function () {
                var $this = $(this);
                $this.autocomplete({
                    appendTo: $this.parent(),
                    source: availableWords,
                    select: function () {
                        var $getindex = TwoArrays[0].toString().split(",").indexOf($this.val());
                        var $url = $("#links").find("#specificWord").attr("content") + "/" + wordsIds[$getindex] + "/" + $settings.main_language;

                        $.get($url, function (data, status) {
                            if(status !== "success") return;
                            if ($this.attr("title") === "placeholder-contain") {
                                clicked.nextAll("placeholder").attr("lang", FromJson(data[0]));
                            } else if ($this.attr("title") === "sub-text-contain") {
                                clicked.nextAll("small").attr("lang", FromJson(data[0]));
                            } else {
                                if (clicked.hasClass("text-editable")) {
                                    clicked.attr("lang", FromJson(data[0]));
                                }
                            }
                        })
                    },
                    change: function () {

                        // saveCache();
                    }
                });
            })


        });


        text_textarea.on("change keyup paste", function () {

            var mainlang = $("select.selection[title='selected-languages-a']");
            var lang = $("select.selection[title='selected-languages-b']");
            var mainlangSelected = mainlang.find(":selected").val();
            var langSelected = lang.find(":selected").val();

            var element_change = ToJson(clicked.attr("lang")),
                tag = clicked.tagName(),
                filter = {
                    text_tags: [
                        "LABEL",
                        "P",
                        "SMALL",
                        "SPAN",
                        "H1",
                        "H2",
                        "BUTTON"
                    ]
                };

            if ($.inArray(tag, filter.text_tags) !== -1) {
                element_change[langSelected] = this.value;
                clicked.attr("lang", FromJson(element_change));


                if (langSelected == mainlangSelected && text_textarea.is(":focus")) {

                    clicked.text(this.value);
                }

            }

        });


        $("#builder-mode").on("input", "h1,h2,p,span,small,label", function () {

            text_textarea.text($(this).html()).change();
        });


        placeholder_textarea.on("change keyup paste", function () {
            var mainlang = $("select.selection[title='selected-languages-a']"),
                lang = $("select.selection[title='selected-languages-b']"),
                mainlangSelected = mainlang.find(":selected").val(),
                langSelected = lang.find(":selected").val(),
                element_change,
                tag = clicked.tagName(),
                filter = {
                    input_tags: [
                        "INPUT",
                        "TEXTAREA"
                    ]
                };

            if (tag === "INPUT" || tag === "TEXTAREA") {
                element_change = ToJson(clicked.nextAll("placeholder").attr("lang"));
            }
            if ($.inArray(tag, filter.input_tags) !== -1) {
                element_change[langSelected] = this.value;
                clicked.nextAll("placeholder").attr("lang", FromJson(element_change));
                if (mainlangSelected == langSelected) {
                    clicked.attr("placeholder", this.value);
                }
            }
        });


        subtext_textarea.on("change keyup paste", function () {
            var mainlang = $("select.selection[title='selected-languages-a']"),
                lang = $("select.selection[title='selected-languages-b']"),
                mainlangSelected = mainlang.find(":selected").val(),
                langSelected = lang.find(":selected").val(),
                element_change,
                tag = clicked.tagName(),
                filter = {
                    input_tags: [
                        "INPUT",
                        "TEXTAREA",
                        "SELECT"
                    ]
                };


            if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") {
                element_change = ToJson(clicked.nextAll("small").attr("lang"));
            }


            if ($.inArray(tag, filter.input_tags) !== -1) {
                element_change[langSelected] = this.value;
                clicked.nextAll("small").attr("lang", FromJson(element_change));

                if (langSelected == mainlangSelected && subtext_textarea.is(":focus")) {
                    clicked.nextAll("small").text(this.value);
                }

            }


        });


        $(".dropdown-options .modal-title small").on('click', function () {

            var main_list_item = $("<li />").addClass("ui-state-default"),
                languages_inputs_list = $("<div/>").addClass("languages-inputs-list").appendTo(main_list_item),
                plus_btn = main_list_item.append($("<ul/>").addClass("if-tools-btns add-remove-btns").append(
                    $("<li/>").addClass("remove_one_statment icons").css("curse", "pointer").on("click", function () {
                        $(this).parents("li").remove();
                    }).append($('<i class="icons icons-minis"></i>'))
                ));

            languages_inputs_list.append(function () {
                var languages_inputs = $("<ul/>").addClass("languages-inputs");

                $("select[title='selected-languages-a'] option").each(function () {
                    languages_inputs.append($("<li/>").append($("<input>").attr({
                        type: "text",
                        lang: $(this).val().toLowerCase()
                    })))
                });

                return languages_inputs;

            });

            $("#sortable").append(main_list_item, plus_btn);


        });

        $("#element-options-languages button").on("click", function () {
            var fullnames = ["Abkhazian", "Afrikaans", "Albanian", "Arabic", "Armenian", "Bulgarian", "Chinese", "Croatian", "Czech", "Danish", "English", "French", "German", "Greek", "Hebrew", "Hindi", "Hungarian", "Indonesian", "Italian", "Japanese", "Portuguese", "Quechua", "Russian", "Serbian", "Slovenian", "Spanish", "Swedish", "Turkish", "Ukrainian", "Vietnamese"];
            var shortcodes = ["ab", "af", "sq", "ar", "hy", "bg", "zh", "hr", "cs", "da", "en", "fr", "de", "el", "he", "hi", "hu", "id", "it", "ja", "pt", "qu", "ru", "sr", "sl", "es", "sv", "tr", "uk", "vi"];
            $("#sortable").html("");
            $(".languages-labels").html("");
            var languages_chosen = $("select[title='selected-languages-a']").find("option").map(function () {
                return $(this).val();
            }).get();

            $.each(languages_chosen, function (index) {
                $(".languages-labels").append($("<li/>").html(this.capitalize()));
            });

            if (clicked.find("option").length > 0) {


                var options = [], options_list = [];
                clicked.find("option").each(function () {
                    options_list.push($(this).attr("rel"));
                });
                $.each(options_list, function (index) {
                    var main_list_item = $("<li />").addClass("ui-state-default"),
                        languages_inputs_list = $("<div/>").addClass("languages-inputs-list").appendTo(main_list_item),
                        plus_btn = main_list_item.append($("<ul/>").addClass("if-tools-btns add-remove-btns").append(
                            $("<li/>").addClass("remove_one_statment icons").css("curse", "pointer").on("click", function () {
                                $(this).parents("li").remove();
                            }).append($('<i class="icons icons-minis"></i>'))
                        ));


                    var languages_inputs = $("<ul/>").addClass("languages-inputs").appendTo(languages_inputs_list);

                    $.each(ToJson(clicked.find("option[rel='" + options_list[index] + "']").attr("lang")), function (k, v) {
                        if ($.inArray(k, languages_chosen) !== -1) {
                            var option_item = $("<li/>").appendTo(languages_inputs);


                            $("<input>").attr({
                                type: "text",
                                lang: k.toLowerCase()
                            }).val(v).appendTo(option_item);
                        }

                    });

                    var languages_written = languages_inputs.find("input").map(function () {
                        return $(this).attr("lang");
                    }).get();

                    // alert(languages_written.join(","));


                    $("select[title='selected-languages-a']").find("option").each(function () {
                        var $this = $(this);

                        // alert($.inArray($this.val().toLowerCase(),languages_written));

                        if ($.inArray($this.val().toLowerCase(), languages_written) === -1) {
                            var option_item = $("<li/>").appendTo(languages_inputs);

                            $("<input>").attr({
                                type: "text",
                                lang: $this.val().capitalize()
                            }).appendTo(option_item);
                        }

                    });

                    $("#sortable").append(main_list_item, plus_btn);
                });


            }

            $(".dropdown-options .modal-title small").click();

        });

        $(".dropdown-options").find("button:last").on("click", function () {
            clicked.find("option").remove();

            var get_main_parent = $(this).parents(".modal-content").find("#sortable"),
                selected_language = $("select[title='selected-languages-a']").val();

            var option_group = {};

            get_main_parent.find(">li").each(function (index_li) {

                $(this).find("input").each(function (index) {
                    option_group[$(this).attr("lang")] = this.value;
                });

                var build_option = $("<option/>").attr({
                    rel: "option_" + index_li,
                    lang: FromJson(option_group),
                    value: "option_" + index_li,
                    class: "text-editable"
                }).html(option_group[selected_language]);
                if (index_li === 0) {
                    if (selected_language === $(this).attr("lang")) {
                        build_option.prop("selected", true);
                    }
                }

                build_option.appendTo(clicked);

            });


            $(this).parents(".modal-content").find("button:first").click();
            required_function();
        });


    },

    addPlugins = function () {
        $('#options-lang').tagsInput({
            height: '132',
            width: '100%',
            placeholder: 'add',
            hide: true,
            delimiter: [',', ';'], // or a string with a single delimiter
            unique: true,
            key: "lang",
            removeWithBackspace: true,
            onAddTag: function (input, tag) {

            },
            onRemoveTag: function (input, tag) {
                removed = true;
            },
            onChange: function (input, tag) {

                // saveCache();
                // $("select[title='selected-languages-a']").makeDropdown(null);


            }

        });//add languages

        //Normal input to input tags
        $('#element-options input').tagsInput({
            height: '65px',
            width: '100%',
            hide: true,
            placeholder: 'add',
            delimiter: [',', ';'], // or a string with a single delimiter
            unique: true,
            removeWithBackspace: true,
            onAddTag: function (input, tag) {

                var $this = clicked,
                    $number_per_row = parseInt($this.attr("number-per-row")),
                    $width = 100 / $number_per_row,
                    $key = $this.attr("rel"),
                    $get_element = $this.find("div." + $key + "_input"),
                    all_class,
                    checkAvibilty = $this.find("div." + $key + "_input[rel='" + tag + "']").length;


                if ($key !== "select") {

                    var languages = $(".selection[title='selected-languages-a']");
                    var languagesTOJson = {};

                    languages.find("option").each(function () {
                        languagesTOJson[$(this).val()] = tag;

                    });
                    if (checkAvibilty === 0) {

                        var checkbox_el = $("<div></div>")
                            .addClass($key + "_input")
                            .css("width", $width + "%")
                            .attr("rel", tag)
                            .append(
                                $("<label />").addClass("text-editable element-editable").attr("lang", FromJson(languagesTOJson)).html(tag).on("input", function () {
                                    $(this).parent().attr("rel", $(this).text())
                                }),
                                $("<input>").attr({
                                    "type": $key,
                                    "value": tag,
                                    "name": $this.find("input").eq(0).attr("name")
                                }),
                                $("<div></div>").addClass("checkmark text-uneditable")

                            );
                        clicked.append(checkbox_el);
                        clicked.find("label:last").applyClasses();


                        /*
                                                $get_element.each(function () {
                                                    var $this = $(this).find("label");

                                                    $this.attr("lang", current_lang);

                                                    languages.find("option").each(function () {
                                                        if (this.value !== current_lang) {
                                                            $($this.clone().on("input", function () {
                                                                $(this).parent().attr("rel", $(this).text())
                                                            }).attr("lang", this.value).hide()).insertAfter($this);
                                                        }
                                                    });


                                                });
                        */
                    }
                } else {
                    $this.append($("<option></option>").attr("value", tag.replaceAllChars(" ", "-")).text(tag))
                }


            },
            onRemoveTag: function (input, tag) {
                var $this = clicked,
                    $key = $this.attr("rel"),
                    toRemove = $this.find("div." + $key + "_input[rel='" + tag + "']");
                if ($key !== "select") {
                    if (toRemove.length > 0) {
                        toRemove.remove();
                    }
                } else {
                    $this.find("option").each(function () {
                        if ($(this).html() === tag) {
                            $(this).remove();
                        }
                    })
                }
            },
            onChange: function (ev) {
                //alert($(this).parent().attr("class"));
                $(this).parent().find(".original").val($(this).val());
            }

        });

    },

    manage_options = function () {
        $("#sortable").sortable({
            placeholder: "ui-state-highlight",
            axis: "y",
            forcePlaceholderSize: true
        });
        $("#sortable").disableSelection();
    };




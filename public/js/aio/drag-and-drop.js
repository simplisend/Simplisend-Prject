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
                saveCache();


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
                saveCache();
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
                saveCache();
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

var refreshIDs = function () {

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
                    "type": "text",
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
                    .attr("rel", "Option1")
                    .append(

                        $("<label />").html("Option1").on("input", function () {
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
                    .attr("rel", "Option1")
                    .append(

                        $("<label />").html("Option1").on("input", function () {
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
                    saveCache();
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
                    saveCache();
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
                saveCache();

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
                        saveCache();
                    }
                }
            });

        $("#elements .panel-item.element-item a.right-side[title='page-break']")
            .on("click", function () {
                if (builder_mode === "web") {

                    var elementName = $(this).attr("title");//Get Element type name to add

                    var el = elementbuilder(elementName);

                    var createRow = $("<div></div>").addClass("element-unprintable page-break v-web row standard-row animated fadeIn").attr({"rel":"row","page-size":$settings.settings.mainSize !== ""?$settings.settings.mainSize:"A4","page-orientation":"v"}).append(
                        $("<div></div>").css({"height":"50px"}).addClass("col-sm-12 columns page-break resizable animated fadeIn").append(el));

                    createRow.find("*").css({"pointer-events": "none"});
                    $(".builder-paper.target-paper").append(createRow);

                    //alert("ff");

                    required_function();
                    saveCache();
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

                    var createRow = $("<div></div>").addClass("element-unprintable page-break v-web row standard-row animated fadeIn").attr({"rel":"row","page-size":$settings.settings.mainSize !== ""?$settings.settings.mainSize:"A4","page-orientation":"v"}).append(
                        $("<div></div>").css({"height":"50px"}).addClass("col-sm-12 columns page-break resizable animated fadeIn").append(el));

                    createRow.find("*").css({"pointer-events": "none"});

                    return createRow;

                },
                drag: function (event, ui) {

                },
                stop: function (event, ui) {
                    if (builder_mode !== "print") {
                        required_function();
                        saveCache();
                    }
                }
            });

        $("#rows .panel-item.row-item.popup-paper").find("a.right-side")
            .on("click", function () {
                if (builder_mode === "popup") {

                    var el = rowsbuilder(this); //create it


                    $("#popups-page").append(el);

                    el.applyClasses();
                    saveCache();
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
                        saveCache();
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
        saveCache();
    },
    counter = 0,
    required_function = function () {
        var main_builder = $("#builder-mode"),
            main_popup_builder = $("#popup-builder-mode");

        recollectColumns();
        setUpElement(main_builder);
        setUpElement(main_popup_builder);
        setDropdownFields();


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

        var form_name = $("#form-main-name").find("h2").html();
        if (form_name !== "form-name") {
            $("input[name='form_name']").val(form_name);
        }

    };


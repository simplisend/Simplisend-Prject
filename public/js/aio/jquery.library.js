
var MAIN_URL = $("meta[name='url']").attr("content");

var getClean = function ($this) {
        var GetTargetIdFromParent = $($this).parents(".element-editable").eq(0);
        if (GetTargetIdFromParent.hasClass("popup-content")) {
            GetTargetIdFromParent = GetTargetIdFromParent.parent();
        }
        var draftElement = $("#copy_to_store");
        draftElement.html(GetTargetIdFromParent.clone());
        draftElement.find(".ui-autocomplete").remove();
        removeHelpers(draftElement, "save");

        draftElement.find("*[class*='v-']").each(function () {
            $(this).removeAttr("id");
        });


        var form_element = $("#addElements");
        form_element.find("input[name='element_html']").val(draftElement.html());
        form_element.find("input[name='style']").val("");
        form_element.find("input[name='scripts']").val(JSON.stringify(_conditions));
        getScreenshot(GetTargetIdFromParent);


        if (draftElement.find(".popup-paper").length !== 0) {
            $("select#elements_categories").val("0").change();
            $("select#elements_categories").hide();
            $("#addElements").find("h5:last").hide();
            $("#addElements").nextAll("h4").hide();
            $("#addElements").nextAll(".manage_categories_tags_1").hide();
        } else {

            $("select#elements_categories").show();
            $("#addElements").find("h5:last").show();
            $("#addElements").nextAll("h4").show();
            $("#addElements").nextAll(".manage_categories_tags_1").show();
        }


    },

    saveCache = function () {
        z_index();

        $("#saved-hint").fadeIn();
        var html_backup = $("#html_cache");
        var draftElement = $("#copy_to_store");
        var catch_element = $("#builder-mode > .builder-paper");

        draftElement.html(catch_element.html());

        draftElement.find(".ui-autocomplete").remove();
        draftElement.find(".ui-autocomplete-input").removeClass("ui-autocomplete-input");

        //fill name input
        var form_name = $("#form-main-name").find("h2").text();
        if (form_name !== "form-name") {
            html_backup.find("input[name='form_name']").val(form_name);
        }
        //////////////////////////////
        var $ligua = $("#options-lang_tagsinput span").map(function () {
            return $(this).find("span").text().substring(0, $(this).find("span").text().length - 5);
        }).get().join();
        html_backup.find("input[name='languages']").val($ligua);

        //////////////////////////////
        html_backup.find("input[name='main_language']").val($settings.main_language);

        //////////////////////////////
        html_backup.find("input[name='settings']").val(FromJson($settings.settings));

        removeHelpers(draftElement, "save");
        html_backup.find("input[name='html']").val(draftElement.html());


        draftElement.html($("#popup-builder-mode > #popups-page").html());
        removeHelpers(draftElement, "save");
        html_backup.find("input[name='popup_html']").val(draftElement.html());


        // html_backup.find("input[name='style']").val($("#pabaPvo5Dzzgm18kz4shu80WqLWtswXMrFO29Wbqg").html());
        html_backup.find("input[name='scripts']").val(JSON.stringify(_conditions));


        var url = html_backup.attr("action");
        var data = html_backup.serialize();


        $.ajax({
            type: "post",
            url: url,
            data: data, // serializes the form's elements.
            beforeSend: function (jqXHR, settings) {
            },
            success: function (data) {
                html_backup.find("input").val("");
                draftElement.html("");
                $("#saved-hint").fadeOut();


            },
            error: function (xhr, status, error) {

            },
            dataType: "html"
        });


    },

    clearCache = function () {
        z_index();


        var url = "/clearcache";

        $.get(url, function () {
            window.location.replace("/builder/");
            SOMTHING_CHANGED = false;
        });


    },

    updateForm = function (catid) {
        $loader.show();
        $('#html_save').find("input[name='key']").val('save');
        $(".categories-list.save-form-to-db").find("li[primary-id='" + catid + "']").find("input").prop("checked", true);
        saveFormAs();
    },

    getBase64 = function (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);

        if (file.type.match("image.*")) {
            reader.onload = function () {
                // console.log(reader.result);

                // Resize the image using canvas
                $("input[type='hidden'][name='form_icon']").val(reader.result);

            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
    },
    fillSavingForm = function (id) {
        var html_backup = $(id);
        var form_name;
        if (html_backup.find("input[name='key']").length !== 0 && html_backup.find("input[name='key']").val() !== "save") {
            if ($("input[name='categories-radio']:checked").length === 0) {
                $(".save-form-to-db").next("small").show();


                return;
            } else if ($(".save-form-to-db input[name='form_name']").val() === "") {
                $("#form-name").find("small").eq(1).show();

                return;
            } else {
                $("#form-main-name").find("h2").text($(".save-form-to-db input[name='form_name']").val());
            }
        }


        var draftElement = $("#copy_to_store");
        draftElement.find(".ui-autocomplete").remove();
        //fill name input
        form_name = $(".save-form-to-db #form-name").find("input").val();
        if (form_name !== "form-name") {
            $("input[name='form_name']").val(form_name);
        }
        //////////////////////////////

        //fill key input
        if (html_backup.find("input[type='hidden'][name='current_form_id']").length !== 0) {
            if (html_backup.find("input[type='hidden'][name='current_form_id']").val() === "") {
                html_backup.find("input[type='hidden'][name='key']").val("new");
            }
        }
        //////////////////////////////


        //fill html input
        draftElement.html($("#builder-mode > .builder-paper").html());
        removeHelpers(draftElement, "save");
        html_backup.find("input[name='html']").val(draftElement.html());
        //////////////////////////////

        //fill popup input
        draftElement.html($("#popup-builder-mode > #popups-page").html());
        draftElement.find(".preview-btn").remove();
        removeHelpers(draftElement, "save");
        html_backup.find("input[name='popup_html']").val(draftElement.html());
        //////////////////////////////


        var $ligua = $("#options-lang_tagsinput span").map(function () {
            var $this = $(this).find("span").text().substring(0, $(this).find("span").text().length - 5);
            if ($this !== "") {
                return $(this).find("span").text().substring(0, $(this).find("span").text().length - 5);
            }

        }).get().join();
        html_backup.find("input[name='languages']").val($ligua);

        // console.log(ToJson($settings.main_language));
        //////////////////////////////
        html_backup.find("input[name='main_language']").val($settings.main_language);

        //////////////////////////////
        html_backup.find("input[name='settings']").val(FromJson($settings.settings));


        //fill style input
        html_backup.find("input[name='scripts']").val(JSON.stringify(_conditions));
        html_backup.find("input[name='style']").val($("#pabaPvo5Dzzgm18kz4shu80WqLWtswXMrFO29Wbqg").html());
        var category_choosen = $(".categories-list.save-form-to-db").find("input[name='categories-radio']:checked").val();
        //////////////////////////////

        //fill category input
        html_backup.find("input[name='category']").val(category_choosen);
        //////////////////////////////


    },

    saveFormAs = function () {
        $loader.show();


        var html_backup = $("#html_save");
        var draftElement = $("#copy_to_store");

        if (fillSavingForm("#html_save") !== false) {


            var url = html_backup.attr("action");
            var data = html_backup.serialize();


            $.ajax({
                type: "post",
                url: url,
                data: data, // serializes the form's elements.


                beforeSend: function (jqXHR, settings) {
                },
                success: function (data) {
                    if (data.toString().split("-")[0] === "exist") {
                        if (confirm("This form name is already exist do you want to replace?")) {
                            html_backup.find("input[name='replace']").val("true");
                            html_backup.find("input[name='current_form_id']").val(data.toString().split("-")[1]);
                            saveFormAs();
                        }
                    } else {
                        var $link = "";
                        if (html_backup.find("input[type='hidden'][name='key']").val() === "new" || html_backup.find("input[name='replace']").val() === "true") {
                            if (html_backup.find("input[name='replace']").val() === "true") {
                                $link = "/builder/" + html_backup.find("input[name='current_form_id']").val();
                            } else {
                                $link = "/builder/" + data;
                            }

                            // alert($link)
                            window.location.replace($link);
                        }
                        html_backup.find("input:not([name='form_name'])").val("");
                        html_backup.find("input[type='hidden'][name='current_form_id']").val(data);
                        $("input[type='hidden'][name='target_id']").val(data);
                        draftElement.html("");
                        $("button.close").click();
                        SOMTHING_CHANGED = false;
                    }

                    $loader.hide();
                    addWordGroup();
                },
                error: function (xhr, status, error) {

                },

                dataType: "html"
            });


        }

    },

    addWordGroup = function () {
        // addFieldsNamesGroup();
        var $url = $("#links #addWordGroup").attr("content");

        var $complate = false;

        var jsonObj = {};
        $(".modes .text-editable, .modes option").each(function (index) {

            if ($(this).hasAttr("lang")) {

                var id = $(this).attr("id");
                var lang = $(this).attr("lang");

                var item = {};
                item ["id"] = id;
                item ["lang"] = lang.split("'").join("{cotechn}");

                jsonObj[index] = item;
            }
        });


        var jqxhr = $.post($url, {
            json: FromJson(jsonObj),
            form_id: $settings.form_id,
            main_language: $settings.main_language
        }, function (data, statues) {
            // alert( "success" );
            if (statues.toString() === "success") {
                for (var js = 0; js < data.length; js++) {

                    var $statues = data[js]["statues"];
                    var $id = data[js]["id"];
                    var $lang = data[js]["lang"];

                    if ($lang !== undefined) {
                        $("#" + $id).attr("lang", FromJson($lang));
                    }
                }
            }

        })
            .done(function () {
                // alert( "second success" );
            })
            .fail(function () {
                alert("error");
            })
            .always(function () {
                // alert( "finished" );
            });

// Perform other work here ...

// Set another completion function for the request above
        jqxhr.always(function () {
            // alert( "second finished" );
        });


        return $complate;
    },

    refreshWordGroups = function () {

        var $url = $("#links #specificWord").attr("content");

        $(".modes .text-editable, .modes option").each(function () {
            var $thisEl = $(this);
            if ($thisEl.hasAttr("lang")) {
                var $getLang = $thisEl.attr("lang");
                var $toJson = ToJson($getLang);
                $getLang.split("/").join("{{leftSlash}}");
                $getLang.split("\\").join("{{rightSlash}}");


                if ($toJson.hasOwnProperty('id')) {
                    var $id = $toJson["id"];
                    $.get($url + "/" + $id + "/" + $settings.main_language, function (data) {

                        $thisEl.attr("lang", FromJson(data).replace("[{", "{").replace("}]", "}"));
                    });

                }
            }


        })

    },

    addFieldsNamesGroup = function () {

        var List = $("#builder-mode .prop-target,#popup-builder-mode .prop-target").map(function () {
            var $tag = $(this).tagName();
            if ($.inArray($tag, ["TEXTAREA", "INPUT", "SELECT"])) {
                if ($(this).hasAttr("name")) {
                    if ($(this).attr("name") !== "") {
                        return $(this).attr("name");
                    }
                }
            }
        }).get().join(",");

        var $url = $("#links").find("#addFieldsList").attr("content") + "/" + List;

        $.get($url, function (data, status) {


        });

    },

    saveEement = function (form) {

        if ($(form).find("input[name='element_name']").val() !== "") {

            $("#save-element-btn").attr("disabled", true);
            var AddElementForm = $(form),
                url = MAIN_URL + "/addElements/store",
                data = AddElementForm.serialize();

            // alert();

            $.ajax({
                type: "post",
                url: url,
                data: data, // serializes the form's elements.
                beforeSend: function (jqXHR, settings) {
                },
                success: function (data) {
                    $("#copy_to_store").html("");
                    AddElementForm.find('input').val("");
                    notification("", "Element has been saved in library", "success", "");
                    $(".modal-header").find("button.close").click();
                    required_function();
                    console.clear();
                    $("#save-element-btn").attr("disabled", false);
                },
                error: function (xhr, status, error) {
                    $("#copy_to_store").html("");
                    var err = JSON.parse(xhr.responseText);

                },
                dataType: "html"
            });

        }
        else {
            notification("", "Element name is required");
        }

    },

    getEements = function (cat_id) {

        var url = MAIN_URL + "/getElements/" + cat_id;


        $("#library").find(".category_items").find(".category_item").hide();
        $("#library").find(".category_items").find(".category_item[category=" + cat_id + "]").show();


        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var json_array = JSON.parse(this.responseText);

                $.each(json_array, function (index) {
                        var id = json_array[index]["id"],
                            element_name = json_array[index]["element_name"],
                            element_html = json_array[index]["element_html"],
                            style = json_array[index]["style"],
                            screenshot = json_array[index]["screenshot"];

                        if ($("#library").find(".category_item[title='" + id + "/" + cat_id + "']").length === 0) {

                            var createElement = $("<div/>").attr({
                                class: "category_item",
                                title: id + "/" + cat_id,
                                item: id,
                                category: cat_id

                            }).append(
                                $("<span/>").addClass("delete").attr("title", id).append($("<i/>").addClass("icons icons-delete")),
                                $("<img/>").attr("src", screenshot),
                                $("<h4/>").text(element_name)
                            );


                            dragElement(createElement.find("img"), cat_id, element_html, style);

                            createElement.find(".delete").on("click", function () {
                                var $this = $(this);
                                var url = MAIN_URL + "/deleteElements/" + $(this).attr("title");
                                var result = confirm("Confirm?");
                                if (result) {
                                    var xmlhttp = new XMLHttpRequest();
                                    xmlhttp.onreadystatechange = function () {
                                        if (this.readyState == 4 && this.status == 200) {
                                            $this.parent().css("background-color", "red").fadeOut();
                                            $this.parent().remove();

                                        }
                                    };
                                    xmlhttp.open("GET", url, true);
                                    xmlhttp.send();
                                }

                            });


                            $("#library").find(".category_items").append(
                                createElement
                            );

                        }
                    }
                )


            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();


    },

    prepareHelper = function (helper) {
        var _helper = helper, appenElement;

        if (builder_mode == "web") {
            _helper = _helper.replaceAllChars("v-popup", "v-web");
        } else if (builder_mode == "popup") {
            _helper = _helper.replaceAllChars("v-web", "v-popup");
        }
        return $(_helper); //create it

    },

    dragElement = function (element, number, helper, style) {
        var connectToSortable, appendto;

        if ($(helper).hasClass("popup-paper")) {
            connectToSortable = "#popups-page";
        } else {
            connectToSortable = ".target-paper";
        }


        if ($(helper).hasClass("standard-row") || $(helper).hasClass("popup-paper")) {

            var _helper = helper, _style = style;


            element.draggable({
                connectToSortable: connectToSortable,
                placeholder: "SortPlaceholder",
                cursor: "-webkit-grabbing",
                revert: 'invalid',
                revertDuration: 100,

                helper: function (event, ui) {
                    return prepareHelper(_helper, _style); //create it
                },
                stop: function (event, ui) {
                    if (builder_mode !== "print" && $(ui.helper).parent().hasClass("builder-paper") || $(ui.helper).parents(".popups-page").length > 0) {
                        required_function();
                    }


                    // alert($(ui.helper).html())
                }
            });
            element.on("click", function () {
                if (builder_mode !== "print") {


                    // alert($(helper).attr("class"));

                    var $el = prepareHelper(_helper, _style);


                    if ($el.hasClass("popup-paper")) {
                        $el.appendTo("#popups-page:visible");
                    } else {
                        if ($(".selected-element").length > 0) {

                            var $selected = $(".selected-element");
                            if ($selected.hasClass("row")) {
                                $el.insertAfter($selected);
                            } else if ($selected.hasClass("popup-content")) {
                                $el.appendTo($selected.find(".popup-clone"));
                            } else if ($selected.parents(".row").length > 0) {
                                $el.insertAfter($selected.closest(".row"));
                            }
                        } else {
                            $el.appendTo($(".target-paper:visible").eq(0));
                        }
                    }


                    required_function();
                }
            });

        }


    },

    getScreenshot = function (element) {


        html2canvas(element.get(0)).then(function (canvas) {
            var base64encodedstring = canvas.toDataURL("image/jpeg", 1);
            $("#addElements").find("input[name='screenshot']").val(base64encodedstring);

        });


    },

    addToServer = function (tag, key) {
        var xmlhttp = new XMLHttpRequest();
        var url;

        if (key === "add") {
            url = MAIN_URL + "/elementsCategory/" + tag + "/a";

            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var cat_id = this.responseText;

                    $("select#elements_categories").append($("<option/>").attr({
                        "value": cat_id,
                        "rel": tag.capitalize()
                    }).text(tag.capitalize()));

                    var $new = $("<div/>").addClass("panel-item").attr({
                        "category": cat_id,
                        "title": "element_" + tag.capitalize(),
                        "style": "margin-top: 9px;margin-bottom: 9px;"
                    }).append(
                        $("<div/>").addClass("item-title").append(
                            $("<h3/>").text(tag.capitalize()),
                            $("<div/>").addClass("item-tools").append(
                                $("<span/>").append($("<i/>").addClass("admin-icons icons-next"))
                            )
                        ).on("click", function () {
                            getEements($(this).parent().attr("category"))

                        })
                    );

                    $new.insertBefore($(".categories_list #manage_categories"))
                }
            };
        } else {
            url = MAIN_URL + "/elementsCategory/" + tag + "/d";

            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var json_array = JSON.parse(this.responseText);
                }
            }

        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    },

    HTMLToJSON = function(){
        // Test with an element.
        var initElement = document.getElementById("builder-mode");
        var json = mapDOM(initElement, true);
        console.log(json);


        function mapDOM(element, json) {
            var treeObject = {};

            // If string convert to document Node
            if (typeof element === "string") {
                if (window.DOMParser) {
                    parser = new DOMParser();
                    docNode = parser.parseFromString(element,"text/xml");
                } else { // Microsoft strikes again
                    docNode = new ActiveXObject("Microsoft.XMLDOM");
                    docNode.async = false;
                    docNode.loadXML(element);
                }
                element = docNode.firstChild;
            }

            //Recursively loop through DOM elements and assign properties to object
            function treeHTML(element, object) {
                object["type"] = element.nodeName;
                var nodeList = element.childNodes;
                if (nodeList != null) {
                    if (nodeList.length) {
                        object["content"] = [];
                        for (var i = 0; i < nodeList.length; i++) {
                            if (nodeList[i].nodeType == 3) {
                                object["content"].push(nodeList[i].nodeValue);
                            } else {
                                object["content"].push({});
                                treeHTML(nodeList[i], object["content"][object["content"].length -1]);
                            }
                        }
                    }
                }
                if (element.attributes != null) {
                    if (element.attributes.length) {
                        object["attributes"] = {};
                        for (var i = 0; i < element.attributes.length; i++) {
                            object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                        }
                    }
                }
            }
            treeHTML(element, treeObject);

            return (json) ? JSON.stringify(treeObject) : treeObject;
        }
    };


$(function ($) {

    var added = false;
    var removed = false;

    $("#new-form").on("click", function () {
        if (SOMTHING_CHANGED || $settings.cache !== "0") {
            $.confirm({
                animation: 'scale',
                closeAnimation: 'scale',
                title: 'Attention!',
                columnClass: 'small',
                content: 'Do you want to save changes?',
                buttons: {
                    Yes: function () {
                        $("#save-form").find("a").click();
                    },
                    No: function () {
                        clearCache();

                    },
                    cancel: function () {

                    },
                }
            });
        } else {

        }


    });


    $(".save-element").find("button.close").click(function () {
        $("#copy_to_store").html("");
    });

    $(".manage_categories_tags_1 input").tagsInput({
        interactive: true,
        placeholder: 'Add Category',
        minChars: 0,
        maxChars: 22,
        limit: null,
        validationPattern: null,
        height: '65px',
        width: '100%',
        hide: true,
        key: "categories",
        delimiter: [',', ';'], // or a string with a single delimiter
        unique: true,
        removeWithBackspace: true,
        onAddTag: function (input, tag) {
            addToServer(tag, "add");
            var r1 = $('#manage_categories_tags_1');
            var r2 = $('#manage_categories_tags_2');
            r1.importTags(r2.val());

        },
        onRemoveTag: function (input, tag) {
            var $check = $("#library").find(".categories_list").find("*[title='element_" + tag.capitalize() + "']");


            addToServer(tag, "remove");

            $check.remove();

            $("select#elements_categories").find("option[rel='" + tag.capitalize() + "']").remove();

            removed = true;
            var r1 = $('#manage_categories_tags_1');
            var r2 = $('#manage_categories_tags_2');
            r1.importTags(r2.val());

        },
        onChange: function (ev) {

            $(this).parent().find(".original").val($(this).val());
        }

    });
    $(".manage_categories_tags_2 input").tagsInput({
        interactive: true,
        placeholder: 'Add Category',
        minChars: 0,
        maxChars: 22,
        limit: null,
        validationPattern: null,
        height: '65px',
        width: '100%',
        key: "categories",
        hide: true,
        delimiter: [',', ';'], // or a string with a single delimiter
        unique: true,
        removeWithBackspace: true,
        onAddTag: function (input, tag) {
            addToServer(tag, "add");
            var r1 = $('#manage_categories_tags_1');
            var r2 = $('#manage_categories_tags_2');
            r1.importTags(r2.val());

        },
        onRemoveTag: function (input, tag) {

            var $check = $("#library").find(".categories_list").find("*[title='element_" + tag.capitalize() + "']");


            addToServer(tag, "remove");

            $check.remove();

            $("select#elements_categories").find("option[rel='" + tag.capitalize() + "']").remove();

            removed = true;

            var r1 = $('#manage_categories_tags_1');
            var r2 = $('#manage_categories_tags_2');
            r1.importTags(r2.val());


        },
        onChange: function (ev) {

            $(this).parent().find(".original").val($(this).val());
        }

    });


    var $library = $("#library");

    $library.find(".item-title").on("click", function () {
        getEements($(this).parent().attr("category"))

    });


    $library.find(".item-title").on("click", function () {
        if (!$(this).hasClass("manage_categories_btn")) {
            $library.find(".categories_list").addClass("animated slideOutLeft");
            $library.find(".categories_list").hide();
            $library.find(".category_items").addClass("animated slideInRight");

            setTimeout(function () {
                $library.find(".categories_list").removeClass("animated slideOutLeft");
                $library.find(".category_items").removeClass("animated slideInRight");
            }, 400);


            $library.find(".category_items").show();
            $library.find(".close").css("visibility", "visible");
        }

    });

    $library.find(".close").on("click", function () {
        $library.find(".categories_list").addClass("animated slideInLeft");

        $library.find(".categories_list").show();
        $library.find(".category_items").addClass("animated slideOutRight");

        setTimeout(function () {
            $library.find(".categories_list").removeClass("animated slideInLeft");
            $library.find(".category_items").removeClass("animated slideOutRight");
        }, 400);
        $library.find(".category_items").hide();
        $library.find(".close").css("visibility", "hidden")

    });


    $(window).bind('keydown', function (event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                case 's':
                    event.preventDefault();
                    saveCache();
                    break;
                case 'f':
                    event.preventDefault();

                    var getHeight = 0;
                    $(".a4-page:last-child").find(".row").each(function () {
                        getHeight += $(this).height();
                    })
                    if (getHeight > 800) {
                        var getClone = $(".a4-page:last-child").clone();

                        getClone.html("");
                        getClone.Settings("form");
                        getClone.insertAfter($(".a4-page:last-child"));
                    }

                    break;
                case 'g':
                    event.preventDefault();
                    if (clicked !== 0) {
                        if (clicked.hasAttr("web-style")) {
                            var clickedWebStyle = clicked.attr("web-style");
                            clicked.attr("print-style", clickedWebStyle);


                            clicked.find(".element-editable").each(function () {
                                var $this = $(this);
                                var $thisWebStyle = $this.attr("web-style");
                                $this.attr("print-style", $thisWebStyle);
                            })

                        }
                    }
                    break;
            }
        }
    });

});
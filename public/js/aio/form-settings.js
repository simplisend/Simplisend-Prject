var restoreFormSettings = function () {
    var hidden_input = {
        form_name: $("input[type='hidden'][name='form_name']"),
        form_activated: $("input[type='hidden'][name='activated']")
    };

    if (hidden_input.form_name.val() === ""){
        $("#form-main-name h2").html("Form Name");
    }else{
        $("#form-main-name h2").html(hidden_input.form_name.val());
    }

    if (hidden_input.form_activated.val() === "true") {
        $("#form-activated").prop('checked', true);
    } else {
        $("#form-activated").prop('checked', false);
    }
};

var editFormSettings = function () {


    $("#form-main-name").on("input", function () {
        SOMTHING_CHANGED = true;
        $("#form-layers").find("li").eq(0).find(".subitem span").html($(this).text());
        $("input[name='form_name']").val($.trim($(this).text()));
    });


};

$(document).ready(function () {

    function relevent_value_element(category_id = 0) {

        var form_category_parts = $("#form_category_parts .relevent-values");

        if (form_category_parts.find("#category-" + category_id).length === 0) {
            var $category = $("#form_categories .categories-list").find("li[primary-id='" + category_id + "']");
            var $get_name = $category.find("> span").text();
            form_category_parts.append($("<div id='category-" + category_id + "'><h4>" + $get_name + "</h4><ul></ul></div>"))
        }


        return form_category_parts.find("#category-" + category_id + "> ul");
    }

    function value_manager_element(category_id = 0) {

        var form_category_parts = $("#form_category_values .categories-list");

        if (form_category_parts.find("#category-m-" + category_id).length === 0) {
            var $category = $("#form_category_parts .categories-list").find("li[primary-id='" + category_id + "']");
            var $get_name = $category.find("> span").text();
            form_category_parts.append($("<div id='category-m-" + category_id + "'><h4>" + $get_name + "</h4><ul></ul></div>"))
        }


        return form_category_parts.find("#category-m-" + category_id + "> ul");
    }

    function element(name, id, json) {


        return $('<li primary-id="' + id + '">\n' +
            '      <ul class="categories-tools">\n' +
            '          <li class="checkbox-btn">\n' +
            '              <input type="checkbox" value="' + id + '"\n' +
            '                     name="categories-checkbox[]" data-html="' + json + '"><span\n' +
            '                      class="checkmark"></span>\n' +
            '          </li>\n' +
            '      </ul>\n' +
            '      <span>' + name + '</span>\n' +
            '      <ul class="sub" id="category-' + id + '"></ul>\n' +
            '   </li>');
    }

    function loopSubs(sub_props = "", id) {

        var $ul = $("#category-" + id);


        if (sub_props.length > 5) {
            var $json = ToJson(sub_props);

            for (var tar = 0; tar < $json.length; tar++) {
                element($json[tar].title, $json[tar].id, FromJson($json[tar].value)).appendTo($ul);
            }

        }

    }

    function relevant_value_loop() {
        var values = $("#form_categories").find("input[type='checkbox']");

        $.each(values, function (index1) {
            if (values.eq(index1).prop("checked")) {
                if ($(this).attr("data-html").length <= 4) return;
                var $json = ToJson($(this).attr("data-html"));

                for (var tar = 0; tar < $json.length; tar++) {
                    if ($("#category-" + $json[tar].id).length === 0) {
                        element($json[tar].title, $json[tar].id, FromJson($json[tar].value)).appendTo(relevent_value_element(values.eq(index1).val()));
                        loopSubs(FromJson($json[tar].sub_props), $json[tar].id);
                    }
                }
            } else {
                $("#category-" + values.eq(index1).val()).find("input[type='checkbox']").prop("checked", false).change();
                $("#category-" + values.eq(index1).val()).remove();
            }
        });
    }

    function value_manager_loop() {
        var values = $("#form_category_parts").find("input[type='checkbox']");

        $.each(values, function (index1) {

            if (values.eq(index1).prop("checked")) {
                if ($(this).attr("data-html").length <= 4) return;
                var $json = ToJson($(this).attr("data-html")).sub;

                if ($json.length > 0) {
                    for (var tar = 0; tar < $json.length; tar++) {

                        if ($("#category-m-" + values.eq(index1).val()).length === 0) {
                            var $id = $json[tar].id,
                                $title = $json[tar].title,
                                $codes = $.map($json[tar].codes, function (_this) {
                                    return _this.text;
                                }).join(",");


                            $('<li primary-id="' + $id + '">\n' +
                                '      <ul class="categories-tools">\n' +
                                '          <li class="checkbox-btn">\n' +
                                '              <input type="checkbox" value="' + $id + '"\n' +
                                '                     name="categories-checkbox[]" data-html="' + $codes + '"><span\n' +
                                '                      class="checkmark"></span>\n' +
                                '          </li>\n' +
                                '      </ul>\n' +
                                '      <span>' + $title + ' (' + $codes + ')</span>\n' +
                                '   </li>').appendTo(value_manager_element(values.eq(index1).val()));
                        }
                    }
                }
            } else {
                $("#category-m-" + values.eq(index1).val()).remove();
            }

        });

    }

    function create_json() {
        var $json = {};
        var form_categories = $("#form_categories").find("input[type='checkbox']:checked").map(function () {
            return this.value;
        }).get().join(",");
        var form_category_parts = $("#form_category_parts").find("input[type='checkbox']:checked").map(function () {
            return this.value;
        }).get().join(",");
        var form_category_values = $("#form_category_values").find("input[type='checkbox']:checked").map(function () {
            return this.value;
        }).get().join(",");
        var form_category_values_keywords = $("#form_category_values").find("input[type='checkbox']:checked").map(function () {
            return $(this).attr("data-html");
        }).get().join(",");

        var $target = $("#form_field_target").find("select").val();

        $json['level1'] = form_categories;
        $json['level2'] = form_category_parts;
        $json['level3'] = form_category_values;
        $json['level4'] = $target;
        $json['level5'] = form_category_values_keywords;

        $("input[name='final-json']").val(FromJson($json));

    }

    $("#form_categories").find("input[type='checkbox']").on("change", function (ev) {

        relevant_value_loop();
        value_manager_loop();
        create_json();
    });

    $("#form_category_parts").on("change", "input[type='checkbox']", function (ev) {


        value_manager_loop();
        create_json();
    });

    $("#form_category_values").on("change", "input[type='checkbox']", function (ev) {

        create_json();
    });

    $("button#save-json-state").on("click", function () {

        var $Json = $("input[name='final-json']").val();
        clicked.find(".prop-target").attr("json-get-data", $Json);
        $("#form_categories").find("input[type='checkbox']:checked").prop("checked", false).change();

        saveCache();
    });

    $("#copy_get_switcher button").on("click", function () {
        $("#form_categories").find("input[type='checkbox']:checked").prop("checked", false).change();

        var $getJson = ToJson(clicked.find(".prop-target").attr("json-get-data"));

        var GetLevel1 = $getJson.level1,
            GetLevel2 = $getJson.level2,
            GetLevel3 = $getJson.level3,
            GetLevel4 = $getJson.level4;

        $.each(GetLevel1.split(","), function () {
            $("#form_categories").find("input[type='checkbox'][value='" + this + "']").prop("checked", true).change();
        });
        $.each(GetLevel2.split(","), function () {
            $("#form_category_parts").find("input[type='checkbox'][value='" + this + "']").prop("checked", true).change();
        });
        $.each(GetLevel3.split(","), function () {
            $("#form_category_values").find("input[type='checkbox'][value='" + this + "']").prop("checked", true).change();
        });
        $("#form_field_target").find("select").val(GetLevel4).change();
    });

    $(".categorices-tools").find("input[type='checkbox']").on("change", function () {

        var values = $(".categories-tools").find("input[type='checkbox']:checked");

        var $getAll = $.map(values, function ($this) {
            var $json = $($this).attr("data-html");

            var prop = JSON.parse($json);

            var subMap = $.map(prop.properties, function ($p) {

                return $p.id;
            });

            return subMap;
        });

        var $toArray = $getAll.toString().split(",");


        $.each($toArray, function () {

            if ($("#form_category_parts select").find("option[value='" + this + "']").length === 0) {
                $("#form_category_parts").find("select").append(
                    $("<option />").val(this).text(this)
                )
            }
        });

        $("#form_category_parts select").find("option").each(function (ins) {
            if ($.inArray($(this).val(), $toArray) === -1) {
                this.remove();
            }
        });


    });

    $("li[data-target='.open-form']").on("click",function () {
        open_categories_mode = this.id;
        $(".categories-list.open-form-from-db.forms-panel ul").html("");
        if(open_categories_mode === "open-form") {
            $(".open-form .modal-footer").hide();
        }else{
            $(".open-form .modal-footer").show();
        }
    });

    $("#save-forms-linking").on("click",function () {
        var $JSON = {};
        var $JSON_str = "[";
        $(".categories-list.open-form-from-db.forms-panel ul").find("input[type='checkbox']:checked").each(function (index) {
            $JSON_str += '{' +
                '"id":"' +this.value+'",'+
                '"name":"' +$(this).attr("data-html")+'"'+
                '}';
        });

        $JSON_str += "]";


        $("input[name='related_forms']").val($JSON_str.replaceAllChars("}{","},{"));
        appendForms();

    });

    $(".open-form-from-db").find("li").find("span:nth-child(2)").on("click", function () {
        var $url = $(this).attr("data-html");

        $.ajax({
            type: "get",
            url: $url,
            beforeSend: function (jqXHR, settings) {
            },
            success: function (data) {

                $(".open-form-from-db.forms-panel ul").html("");
                $.each(data, function (index) {
                    var $html = "";
                    var $href = '/builder/'+data[index].id;
                    var $target = "_self";
                    if(open_categories_mode === "open-form"){
                        if(data[index].type.toString() === "1"){
                            $href = "/application/uploads/forms/"+data[index].html;
                            $target = "_blank";
                        }
                        $html = $("<li />").attr("primary-id","").append($("<span style=\"\n" +
                            "    padding: 0 3px;\n" +
                            "\"><i class=\"icons icons-new\"></i></span>"),$("<span><a target='"+$target+"' href='"+$href+"'>"+data[index].form_name+"</a></span>"));
                    }else{
                        $html = $("<li class='checkbox-btn' />").attr("primary-id", "").append(
                            $('<input type="checkbox" data-html="'+data[index].form_name+'" value="'+data[index].id+'" name="categories-checkbox[]">' +
                                '<span class="checkmark" style="top: 5px;"></span>')
                            ,$("<span style='padding: 0 3px;'><i class=\"icons icons-new\"></i></span>"), $("<span></span>").append(
                                $("<a href='/builder/" + data[index].id +"'/>").text(data[index].form_name).on("click",function (e) {
                                    if(open_categories_mode === "link-form"){
                                        e.preventDefault();
                                        $(".close").click();
                                    }
                                })
                            ));
                    }

                    $(".open-form-from-db.forms-panel ul").append($html)

                })

            },
            error: function (xhr, status, error) {
                alert(xhr.responseText);
            },

            dataType: "JSON"
        });
    })


});
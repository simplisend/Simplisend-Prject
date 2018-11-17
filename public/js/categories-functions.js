var Selected = "",
    current_id_value = "0",
    category_id_value = "0",
    cat_properties_value = "",
    category_name_value = "New Category",
    category_color_value = "#000000",
    selectType = "";


function autoHeightAll() {
    $("#cat-panel2").find("div.conatainer-panel").first().height($("#cat-panel1").find("div.conatainer-panel").first().height());
    $("#cat-panel3").find("div.conatainer-panel").first().height($("#cat-panel1").find("div.conatainer-panel").first().height());
    $("#panel1").height($("#cat-panel1").find("div.conatainer-panel").first().height());
    $("#cat-panel2").find("ul.list-group").first().height(
        $("#cat-panel1").find("ul.list-group").first().height() -
        $("#cat-panel2").find("div.cat-caption").first().height()
    );

    $("#cat-panel3").find("ul.list-group").first().height(
        $("#cat-panel1").find("ul.list-group").first().height() -
        $("#cat-panel3").find("div.cat-caption").first().height() -
        $("#cat-panel3").find("div.info-container ").first().height() -
        $("#cat-panel3").find("div.tools-bar").first().height()
    );

    $("#cat-panel3").find("ul.list-group").first().height(20);
    $("#panel2").height($("#cat-panel1").find("div.conatainer-panel").first().height())
}

function openRV($state) {
    if ($state == "off") {
        $("#rvText").attr('state', 'on');
        $("#bro-div").show();
        $("#vmPanel").css("position", "absolute");
        $("#vmPanel").css("left", parseInt($("#bro-div").width()) +
            parseInt($("#bro-div").css('margin-left')) - parseInt($("#vmPanel").width()));
        if ($("#bro-div1").css("display") !== "none") {
            $("#bro-div1").css({
                'margin-left': '29px',
                'margin-top': '0px'
            });
        }
        ;
    } else {
        $("#rvText").attr('state', 'off');
        closeRV();
    }
};

function closeRV($state) {
    $("#bro-div").hide();
    $("#vmPanel").css("position", 'static');
    $("#vmPanel").css("left", parseInt($("#panel1").width()) + parseInt($("#vmPanel").width()) + 17);
    if ($("#bro-div1").css("display") !== "none") {
        $("#bro-div1").css({
            'margin-left': '368px',
            'margin-top': '35px'
        });
    }
};

function openVM($state) {
    if ($state == 'off') {
        $("#vmText").attr('state', 'on');
        $("#bro-div1").show();
        if ($("#bro-div").css("display") == "none") {
            $("#bro-div1").css({
                'margin-left': '368px',
                'margin-top': '35px'
            });
        } else {
            $("#bro-div1").css({
                'margin-left': '29px',
                'margin-top': '0px'
            });
        }
    } else {
        console.log("1" + $state);
        $("#vmText").attr('state', 'off');
        closeVM();
    }
};

function closeVM() {
    $("#bro-div1").hide();
}

function hideReleventValue() {
    $("#rel-val-div").removeClass();
    $("#rel-val-div").find("div.cat-title").first().addClass("display-none");
    $("#rel-val-div").css({
        "display": "inline-block",
        "float": "left"
    });
    $("#cat-panel2").addClass("display-none");
    $("#panel2").css({
        "position": "static",
        "margin-top": parseInt($("#cat-list-div").find("div.cat-title").first().height()) +
        parseInt($("#cat-list-div").find("div.cat-title").first().css("margin-bottom")),
        "height": $("#panel1").height(),
        "width": $("#panel1").width()
    });
    if ($("#val-manager-div").is(":visible") == false) {
        $("#forms-list-div").removeClass("display-none");
    }
    ;
    $("#form-prop-div").removeClass("display-none");
};

function showReleventValue() {
    $("#rel-val-div").addClass("col-sm-4 col-xs-4 col-lg-4 no-padding");
    $("#rel-val-div").find("div.cat-title").first().removeClass("display-none");
    $("#rel-val-div").css({
        "display": "block",
        "float": "left"
    });
    $("#cat-panel2").removeClass("display-none");
    $("#panel2").css({
        "position": "absolute",
        "margin-top": "0",
        "height": $("#panel1").height(),
        "width": "8%"
    });
    $("#forms-list-div").addClass("display-none");
    //if($("#cat-panel2").is(":visible") == true){
    //}
    if ($("#val-manager-div").is(":visible") == true) {
        $("#form-prop-div").addClass("display-none");
    } else {
        $("#form-prop-div").removeClass("display-none");
    }

}

function hideValueManager() {
    $("#val-manager-div").css({
        "display": "none"
    });
    if ($("#cat-panel2").is(":visible") == false) {
        $("#forms-list-div").removeClass("display-none");
    }
    ;
    $("#form-prop-div").removeClass("display-none");
};

function showValueManager() {
    $("#val-manager-div").css({
        "display": "inline-block"
    })
    $("#forms-list-div").addClass("display-none");
    if ($("#cat-panel2").is(":visible") == true) {
        $("#form-prop-div").addClass("display-none");
    } else {
        $("#form-prop-div").removeClass("display-none");
    }
};

function shrv() {
    if ($("#cat-panel2").is(":visible") == true) {
        hideReleventValue();
    } else {
        showReleventValue();
    }
};

function shvm() {
    if ($("#val-manager-div").is(":visible") == true) {
        hideValueManager();
    } else {
        showValueManager();
    }
};


$(document).ready(function () {
    hideValueManager();
    hideReleventValue();
});


function resetValues() {
    current_id_value = "0";
    category_id_value = "0";
    cat_properties_value = "";
    category_name_value = "New Category";
    category_color_value = "#000000";

    setValue({
        current_id_value: current_id_value,
        category_id_value: category_id_value,
        cat_properties_value: cat_properties_value,
        category_name_value: category_name_value,
        category_color_value: category_color_value
    })
}

function setValue(options) {

    var the_options = jQuery.extend({
        current_id_value: "",
        category_id_value: "",
        cat_properties_value: "",
        category_name_value: "",
        category_color_value: ""
    }, options);


    var $form = $("form#category_form");


    if (the_options.current_id_value !== "") {
        current_id_value = the_options.current_id_value;
    }

    if (the_options.category_id_value !== "") {
        category_id_value = the_options.category_id_value;
    }

    if (the_options.cat_properties_value !== "") {
        cat_properties_value = the_options.cat_properties_value;
    }

    if (the_options.category_name_value !== "") {
        category_name_value = the_options.category_name_value;
    }

    if (the_options.category_color_value !== "") {
        category_color_value = the_options.category_color_value;
    }
    var cat_ids = $form.find("input[name='cat_id']"),
        cat_properties = $form.find("input[name='cat_properties']"),
        current_id = $form.find("input[name='current_id']"),
        category_name = $form.find("input[name='category_name']"),
        category_color = $form.find("input[name='category_color']");

    cat_ids.val(category_id_value);
    cat_properties.val(cat_properties_value);
    current_id.val(current_id_value);
    category_name.val(category_name_value);
    category_color.val(category_color_value);

}

function setNewRecord(cat_id) {

    var $form = $("form#category_form");

    var cat_ids = $form.find("input[name='cat_id']"),
        cat_properties = $form.find("input[name='cat_properties']"),
        current_id = $form.find("input[name='current_id']"),
        category_name = $form.find("input[name='category_name']"),
        category_color = $form.find("input[name='category_color']");

    cat_ids.val(category_id_value);
    cat_properties.val(cat_properties_value);
    current_id.val(current_id_value);
    category_name.val(category_name_value);
    category_color.val(category_color_value);


    postData();
}

$("form#category_form").submit(function (e) {
    var data, xhr;
    var $form = this;

    data = new FormData($(this)[0]);

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        url: $form.action, // point to server-side PHP script
        data: data,
        type: 'POST',
        contentType: false, // The content type used when sending data to the server.
        cache: false, // To unable request pages to be cached
        processData: false,
        success: function (data) {

            Selected.attr("primary-id", date);
            console.log(data)
        }
    });

    e.preventDefault();


// Perform other work here ...


});

function postData() {
    $("form#category_form").submit();
}


function submitRename(event) {

    var x = event.keyCode;
    if (x == 13) {
        var category_form = $("#category_form"),
            $parent = $(event.target).parents(".list-group-item").eq(0),
            $check = $parent.hasAttr("primary-id"),
            $value = $("#edit").val();
        category_form.find("input#category_name").val($value);

        $("#editing").text($value);
        $("#editing").removeAttr("temp");
        $("#edit").blur();


        setValue({
            current_id_value: Selected.attr("primary-id"),
            category_id_value: Selected.attr("parent-category"),
            category_name_value: $value,
            category_color_value: Selected.find(".color-sign").attr("data-color")
        });

        postData();

        Selected = "";

    } else if (x == 27) {
        $("#edit").blur();
    }


}


function cnancelRename($me) {
    $("#editing").show();
    $("#editing").removeAttr("id");
    $("#edit").remove();
};

function removeItem($item) {
    $item.find("#selectedItem").closest('.list-group-item').remove();
};


function addFormItem($formName,$id) {
    $("#forms-list").find("ul.list-group").first().append(
        '<li id="thisIsNew" class="list-group-item" primary-id="'+$id+'">'
    );
    $("#thisIsNew").html(
        '<!--element1-->' +
        '<ul class="custom-item ">' +
        '<li><i class="admin-icons icons-main-category"></i></li>' +
        '<li class="item-label-container">' +
        '<label onClick="selectItem($(this));" ondblclick="rename($(this));" class="caption-label">' + $formName + '</label>' +
        '</li>' +
        '<ul class="btn-cat right-float">' +
        '<li onClick="removeFormItem($(this))"><i class="admin-icons icons-main-category"></i>' +
        '</li><li onClick="rename($(this).closest(' + "'li.list-group-item'" + ').find(' + "'label'" + '));"><i class="admin-icons icons-main-category"></i></li>' +
        '</ul>' +
        '</ul>' +
        '</li>'
    );
    $("#thisIsNew").removeAttr("id");
}

function selectItem($item) {
    if ($("#selectedItem").length == 1) {
        if ($("#selectedItem").is($item)) {
            unSelectAll();
            return;
        } else {
            $("#selectedItem").closest('.custom-item').removeClass("active");
            $("#selectedItem").removeAttr("id");
        }
    }

    if ($(event.target).tagName() !== "INPUT") {
        ($item).attr("id", "selectedItem");
        $("#selectedItem").closest('.custom-item').addClass("active");
        Selected = ($item).closest(".list-group-item");
    }


    if ($item.parents("#cat-panel1").length > 0) {
        var $url = $item.parents("ul").attr("data-html");
        $("#forms-panel ul.list-group").find("li").remove();
        $.ajax({
            type: "get",
            url: $url,
            beforeSend: function (jqXHR, settings) {
            },
            success: function (data) {

                $("#forms-list").find("ul.list-group").first().find("li").remove();
                $.each(data, function (index) {

                    addFormItem(data[index].form_name,data[index].id);


                })

            },
            error: function (xhr, status, error) {
                alert(xhr.responseText);
            },

            dataType: "JSON"
        });

        setValue({
            current_id_value: Selected.attr("primary-id"),
            category_id_value: Selected.attr("parent-category"),
            category_name_value: ($item).text(),
            category_color_value: Selected.find(".color-sign").attr("data-color")
        })

    }


}



function renameCreatedItem($item) {
    $me = $item.find("#renameMe");
    unSelectAll();
    $($me).attr("id", "editing");
    //$($me).hide();
    $($me).closest("li").append(
        '<input  style="display:none" type="text" id="edit" onkeydown="(submitRename(event));" onfocusout="cnancelRename();" class="edit-caption" value="' + $($me).text() + '">');
    $("#edit").show();
    $("#edit").select();
    $("#edit").focus();
}

function rename($me) {
    unSelectAll();
    $($me).attr("id", "editing");
    //$($me).hide();
    $($me).closest("li").append(
        '<input style="display:none" type="text" id="edit" onkeydown="(submitRename(event));" onfocusout="cnancelRename();" class="edit-caption" value="' + $($me).text() + '">'
    );
    $("#edit").show();
    $("#edit").select();
    $("#edit").focus();
};

function unSelectAll() {
    if ($("#selectedItem").length == 1) {
        $("#selectedItem").closest('.custom-item').removeClass("active");
        $("#selectedItem").removeAttr("id");
    }
}

function addNewListItem($item) {

    /*
        if($item.attr("id") === "cat-panel1"){
            var $url = $item.parents("ul").attr("data-html");
            $("#forms-panel ul.list-group").find("li").remove();
            $.ajax({
                type: "get",
                url: $url,
                beforeSend: function (jqXHR, settings) {
                },
                success: function (data) {


                    $.each(data,function (index) {

                        var $html = '<li class="list-group-item">\n' +
                            '           <ul class="custom-item " primary-id="'+data[index].id+'">\n' +
                            '               <li>\n' +
                            '                   <i class="admin-icons icons-form-list"></i>\n' +
                            '                   <label onClick="selectItem($(this));" ondblclick="rename($(this));"\n' +
                            '                          class="caption ">'+data[index].form_name+'</label>\n' +
                            '               </li>\n' +
                            '               <li class="float-right ">\n' +
                            '                   <div class="btns">\n' +
                            '                       <i\n' +
                            '                               class="admin-icons icons-trash"></i></div>\n' +
                            '                   <div class="btns" onclick="removeItem($(\'#forms-panel\'));"><i\n' +
                            '                               class="admin-icons icons-form-list"></i></div>\n' +
                            '               </li>\n' +
                            '           </ul>\n' +
                            '         </li>';


                        $("#forms-panel ul.list-group").append($html)

                    })

                },
                error: function (xhr, status, error) {
                    alert(xhr.responseText);
                },

                dataType: "JSON"
            });
        }
    */


    if ($item.find("#selectedItem").length === 1) {
        if ($item.attr("id") === "cat-panel3") {
            $item.find("#selectedItem").closest('.list-group').first().append(
                '<li id="thisIsNew" lType="sub" class="list-group-item">'
                //'<ul id="thisIsNew" class="list-group"></ul>'
            );
        }
        else if ($item.attr("id") === "cat-panel2") {
            if ($("#selectedItem").closest("li.list-group-item").parent().closest("li.list-group-item").length > 0) {
                $("#selectedItem").closest("li.list-group-item").parent().closest("li.list-group-item").find('ul.list-group').first().append(
                    '<li id="thisIsNew" lType="sub" class="list-group-item">'
                    //'<ul id="thisIsNew" class="list-group"></ul>'
                );
            } else {
                console.log("3");

                $item.find("#selectedItem").closest('.list-group-item').find('ul.list-group').first().append(
                    '<li id="thisIsNew" lType="sub" class="list-group-item">'
                    //'<ul id="thisIsNew" class="list-group"></ul>'
                );
            }
        }
        else {
            $("#category_form").find("input").val("");

            var $parent = $item.find("#selectedItem").parents(".list-group-item").eq(0).attr("primary-id");

            category_id_value = $parent;
            category_name_value = "Sub Category";

            setNewRecord($parent);

            $item.find("#selectedItem").closest('.list-group-item').find('ul.list-group').first().append(
                '<li id="thisIsNew" lType="sub" class="list-group-item">'
                //'<ul id="thisIsNew" class="list-group"></ul>'
            );
        }
        compleateAddItem($item);
    }
    else {
        if ($item.find(".list-group").length > 0) {

            $("#category_form").find("input").val("");

            $item.find(".list-group").first().append(
                '<li id="thisIsNew" class="list-group-item" parent-category="0">'
                //'<ul id="thisIsNew" class="list-group"></ul>'
            );
            compleateAddItem($item);
        } else {
            console.log("2");
            $item.find("div.conatainer-panel").first().append(
                '<li id="thisIsNew" class="list-group-item">'
                //'<ul class="list-group"></ul>'
            );
            addNewListItem($item);
        }
    }
    $("#thisIsNew").removeAttr("id");
};


function compleateAddItem($item) {

    if ($item.attr("id") == "cat-panel3") {
        $("#thisIsNew").html(
            '<!--element1-->' +
            '<ul class="custom-item ">' +
            '<ul class="street-info">' +
            '<li><i class="admin-icons icons-main-category"></i></li>' +
            '<li class="item-label-container">' +
            '<label id="renameMe" onClick="selectItem($(this));" ondblclick="rename($(this));" class="caption-label">Education33</label>' +
            '</li>' +
            '</ul>' +
            '<ul class="tags-ul">' +
            '<li>' +
            '<div class="tags-div">' +
            '<input type="text" style="width: 100%"> '+
            '</div>' +
            '</li>' +
            '</ul>' +
            '<ul class="list-group">' +
            '</ul>' +
            '</li>'
        );
        $(".tags-div").each(function () {
            if($(this).find(".tagsinput").length === 0){
                $(this).find("input").tagsInput();
            }

        })
    }
    else if ($item.attr("id") == "cat-panel2") {
        if ($("#thisIsNew").attr("lType") == "sub") {
            console.log("qw");
            $("#thisIsNew").html(
                '<!--element1-->' +
                '<ul class="custom-item ">' +
                '<li class="item-label-container">' +
                '<label id="renameMe" onClick="selectItem($(this));" ondblclick="rename($(this));" class="caption-label">Education33</label>' +
                '</li>' +
                //	'<ul class="btn-cat right-float">'+
                //		'<li><i class="admin-icons icons-main-category"></i></li><li><i class="admin-icons icons-main-category"></i></li>'+
                //	'</ul>'+
                '</ul>' +
                '<ul class="list-group">' +
                '</ul>' +
                '</li>'
            );
        } else {
            $("#thisIsNew").html(
                '<!--element1-->' +
                '<ul class="custom-item ">' +
                '<li><i class="admin-icons icons-main-category"></i></li>' +
                '<li class="item-label-container">' +
                '<label id="renameMe" onClick="selectItem($(this));" ondblclick="rename($(this));" class="caption-label">Education33</label>' +
                '</li>' +
                //	'<ul class="btn-cat right-float">'+
                //		'<li><i class="admin-icons icons-main-category"></i></li><li><i class="admin-icons icons-main-category"></i></li>'+
                //	'</ul>'+
                '</ul>' +
                '<ul class="list-group">' +
                '</ul>' +
                '</li>'
            );
        }
    }
    else {
        if ($("#thisIsNew").attr("lType") == "sub") {
            $("#thisIsNew").html(
                '<!--element1-->' +
                '<ul class="custom-item" onclick="selectItem($(this).find(\'label\'));" ondblclick="rename($(this).find(\'label\'))">' +
                '<li><i class="admin-icons icons-main-category"></i></li>' +
                '<li class="item-label-container">' +
                '<label id="renameMe">Sub Category</label>' +
                '</li>' +
                '<li class="right-float">' +
                '<div class="color-sign" data-color="#000000"></div>' +
                '</li>' +
                '<li class="right-float">' +
                '<i class="admin-icons icons-background"></i></li>' +
                '</ul>' +
                '<ul class="list-group"></ul>' +
                '</li>'
            );
        }
        else {

            $("#thisIsNew").html(
                '<!--element1-->' +
                '<ul class="custom-item" onclick="selectItem($(this).find(\'label\'));" ondblclick="rename($(this).find(\'label\'))">' +
                '<li><i class="admin-icons icons-main-category"></i></li>' +
                '<li class="item-label-container">' +
                '<label id="renameMe">Category</label>' +
                '</li>' +
                '<li class="right-float">' +
                '<div class="color-sign" data-color="#000000"></div>' +
                '</li>' +
                '<li class="right-float">' +
                '<i class="admin-icons icons-background"></i></li>' +
                '</ul>' +
                '</li>'
            );
        }
    }

    renameCreatedItem($item);
}



function removeFormItem($item) {
    $item.closest("li.list-group-item").remove();
}

// <start date="18.7.18"><end date="19.7.18"><finger id="dbr"></finger></end></start>
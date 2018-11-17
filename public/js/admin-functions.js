jQuery(document).ready(function ($) {
    $(".ui-pnotify").remove();
    // $(".color_chooser").colorpicker();

    var route;
    if ($(location).attr('host') === "localhost") {
        route = $(location).attr('protocol') + "//" + $(location).attr('host') + "/deaart.ae";
    } else {
        route = $(location).attr('protocol') + "//" + $(location).attr('host');
    }

    // alert(route);

    var categories_list = $("#categories-lists");
    categories_list.find("li").eq(0).remove();

    // alert(categories_list.find(">li").length);

    $(categories_list.find(">li").get().reverse()).each(function () {
        var $this = $(this), primary_id = $this.attr("primary-id");
        categories_list.find(">li[parent-category='"+primary_id+"']").appendTo($this.find("ul.list-group"));
        categories_list.find(">li[parent-category='"+primary_id+"']").find(".icons-main-category").removeClass("icons-main-category").addClass("icons-sub-category");
    });

    categories_list.fadeIn();

    categories_list.find("h4").on("click",function () {

        var $getList = $(this).parent().find("> ul:not(.categories-tools)");

        $getList.parent().find("ul:not(.categories-tools)").slideUp();

        if($getList.css("display") !== "none"){
            $(this).parent().find("ul:not(.categories-tools)").slideUp();
        }else{
            $getList.slideDown()
        }

    });


    $("#proprties").tagsInput({
        height: '132',
        width: '100%',
        placeholder: 'add',
        hide: true,
        delimiter: [',', ';'], // or a string with a single delimiter
        unique: true,
        removeWithBackspace: true,
        onAddTag: function (input, tag) {

        },
        onRemoveTag: function (input, tag) {

        },
        onChange: function (input, tag) {

            $(".clicked-item").find("input[type='hidden'][name='sub-properties']").val($(input).val());


        }
    });//add languages

    /*
        if(processing !== "add"){
            $(".category_form").attr("action",$(".category_form").attr("action").replace("store","edit"));
            $("input[name='categories-checkbox']").attr("type","radio");
            $("#submitBtn").text("Update");
            $("#manage-locations").html("");
            $(".category_form input[name='cat_id']").val($category_id);
            $(".category_form input[name='category_name']").val($name);
            $(".category_form input[name='categories']#categories").val($parent_id);
            var prop = JSON.parse($properties);

            $.each(prop.properties,function(){

                var cats = $.map(this.sub_proprties, function(v){
                    return v;
                }).join(', ');



                var element = $("<div />").addClass("col-md-6 col-sm-6 col-xs-6 location-item").append(
                    $("<label />").addClass("col-md-12").text("Name").append("<br>",
                        $("<input>").attr({"type":"text","name":"name"}).val(this.name)
                    ),
                    $("<label />").addClass("col-md-12").text("Details").append("<br>",
                        $("<textarea rows='5' />").val(this.details)
                    ),
                    $("<div />").addClass("col-md-12").append(
                        $("<button />").attr({
                            "type":"button",
                            "class":"btn btn-success",
                            "data-toggle":"modal",
                            "data-target":".dropdown-options"
                        }).text("Manage"),
                        $("<button />").attr({
                            "type":"button",
                            "class":"btn btn-success minis-btn"
                        }).text("Delete")

                    ),
                    $("<input>").attr({
                        "type":"hidden",
                        "class":"properties",
                        "name":"sub-properties",
                        "style":"display: none"
                    }).val(cats)
                );

                element.appendTo($("#manage-locations"));



            })

        }
    */

});



/*
$("#add-locations").on("click",function () {
    if($("#sortable").find("li").length === 0){
        $(".dropdown-options .modal-title small").click();
    }
});
$("#save-locations").on('click', function () {

    var $getrows = $("#sortable").find(".ui-state-default");

    var $mainJson = {};
    $getrows.each(function (index) {
        var $getInputs = $getrows.eq(index).find("input");

        var features = {};    // Create empty javascript object

        $getInputs.not(":first").each(function() {           // Iterate over inputs
            features[$(this).attr('id')] = $(this).val();  // Add each to features object
        });



        $mainJson[$getInputs.eq(0).val()] = features;


    });
    var json = JSON.stringify($mainJson);

    $(".category_form input#locations[type='hidden'][name='locations']").val(json);
    // alert(json);

});
*/
$(".dropdown-options button[aria-label='Close']").on('click', function () {


    $(".clicked-item").removeClass("clicked-item");

    $("input#proprties").val("");
    $("#proprties_tagsinput").find(".tag").remove();
});

$("input[name='categories-checkbox']").on('click', function () {


    var searchIDs = $("input[name='categories-checkbox']:checked").map(function(){
        return $(this).val();
    }).get(); // <----


    $(".category_form input#categories[type='hidden'][name='categories']").val(searchIDs);
    // alert(json);

});

$("#manage-locations").on("click",".location-item .minis-btn",function () {
    $(this).closest(".location-item").remove();
});

$("#manage-locations").on("click",".location-item button[data-target='.dropdown-options']",function () {

    $("input#proprties").importTags($(this).closest(".location-item").find("input[type='hidden'][name='sub-properties']").val());
    $(this).parents(".location-item").eq(0).addClass("clicked-item");

});


$("#manage-locations #plus-btn").on("click",function () {
    var element = $("<div />").addClass("col-md-6 col-sm-6 col-xs-6 location-item").append(
        $("<label />").addClass("col-md-12").text("Name").append("<br>",
            $("<input>").attr({"type":"text","name":"name"})
        ),
        $("<label />").addClass("col-md-12").text("Details").append("<br>",
            $("<textarea rows='5' />")
        ),
        $("<div />").addClass("col-md-12").append(
            $("<button />").attr({
                "type":"button",
                "class":"btn btn-success",
                "data-toggle":"modal",
                "data-target":".dropdown-options"
            }).text("Manage"),
            $("<button />").attr({
                "type":"button",
                "class":"btn btn-success minis-btn"
            }).text("Delete")

        ),
        $("<input>").attr({
            "type":"hidden",
            "class":"properties",
            "name":"sub-properties",
            "style":"display: none"
        })
    );

    element.appendTo($("#manage-locations"));
});


$("#submitBtn").on("click",function () {


    var $mainJson = {};
    var props = {};

    $mainJson["color"] = $("input[name='color']").val();
    $mainJson["properties"] = props;

    var $getrows = $("#manage-locations").find(".location-item");


    $getrows.each(function (index) {

        var $getInputValue = $getrows.eq(index).find("input[name='name']").val();

        var features = {};
        props["prop"+index] = features;

        features["name"] = $getInputValue;
        features["details"] = $getrows.eq(index).find("textarea").val();

        var sub_proprties = {};
        features["sub_proprties"] = sub_proprties;

        $.each($getrows.eq(index).find("input[name='sub-properties']").val().split(","),function(index) {           // Iterate over inputs
            sub_proprties[index] = this;  // Add each to features object
        });



    });

    var json = JSON.stringify($mainJson);

    $(".category_form input#cat_properties[type='hidden'][name='cat_properties']").val(json);

    if($(".category_form input[name='category_name']").val() !== ""){
        $(".category_form").submit();
    }else{
        alert("You must choose category name");
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

        $(".languages-labels li").each(function () {
            languages_inputs.append($("<li/>").append($("<input>").attr({
                type: "text",
                id:$(this).text()+$(".ui-state-default").length
            })))
        });

        return languages_inputs;

    });

    $("#sortable").append(main_list_item, plus_btn);


});


//delete category from levels
function deleteCat(element) {
    event.preventDefault();
    var main_element = $(element).closest('li');

    if(main_element.find("ul:not(.categories-tools)").find("li").length === 0){
        var confirmation = confirm("Are You Sure You Want To Delete This Category? \r\n This Will Also Delete All Related Categories And Forms");

        main_element.attr('class', 'deleting');
        if (confirmation === true) {


            function request(data) {

                // alert(data);
                main_element.fadeOut();

            }

            getajax("GET", $(element).attr('about'), "", request, "JSON", false);


        } else {
            main_element.attr('class', '');
        }
    }else{
        var confirmation = confirm("You Can't Delete Category before delete Sub Categories Inside");
    }

}

function CheckImage(element) {
    $(".custom-item.active").attr('class', '').text('').hide();

    var reader = new FileReader();
    //Read the contents of Image File.
    reader.readAsDataURL(element.files[0]);
    reader.onload = function (e) {
        //Initiate the JavaScript Image object.
        var image = new Image();

        // $(element).prev().val(e.target.result);
        //Set the Base64 string return from FileReader as source.
        image.src = e.target.result;

        //Validate the File Height and Width.
        image.onload = function () {
            var height = this.height;
            var width = this.width;


            if (height > 150 || width > 150) {
                alert('Height and Width must not exceed 150px.');
                return false;
            }
            alert('Uploaded image has valid Height and Width.');
            return true;
        };

    }

}

//validate and submit form from levels forms
function formValidate() {


    var form = 'form.category_form';

    var url = $(form).attr('action');

    var formdata = $(form).serialize();

    var table_name = $('form.category_form input[name="table"]').val();


    // alert(form+"\r\n"+url+"\r\n"+formdata+"\r\n"+table_name);


    function request(data) {

        var myJSON = JSON.stringify(data);
        myJSON = $.parseJSON(myJSON);


        var countTR = $("table.table > tbody tr").length + 1;

        $("table.table > tbody").append('' +
            '<tr>' +
            '<td>' + countTR + '</td>' +
            '<td>' + myJSON['name'] + '</td>' +
            '<td>' +
            '<a onclick="deleteCat(this)" href="edit#' + table_name + '#' + myJSON['id'] + '"><i class="glyphicon glyphicon-edit"></i></a>' +
            '<a onclick="deleteCat(this)" href="delete#' + table_name + '#' + myJSON['id'] + '"><i class="glyphicon glyphicon-trash"></i></a>' +
            '</td>' +
            '</tr>');

        $('input').val("");

        $('input[name="_token"]').val(myJSON['newcsrf']);
        $('input[name="table"]').val(myJSON['table']);


    }

    // alert(url);
    getajax("POST", url, formdata, request, "JSON", false);
}


//public function
function getajax(method, url, datapass, somefunction, type, allow) {

    // alert(url);
    // $(".break").html(ajaxroute);

    if (allow) {
        window.open(url, '_blank');
    }

    $.ajax({
        type: method,
        url: url,
        data: datapass, // serializes the form's elements.


        beforeSend: function (jqXHR, settings) {
        },
        success: function (data) {

            somefunction(data);
        },
        error: function (xhr, status, error) {
            var err = JSON.parse(xhr.responseText);
            alert(err.Message);
        },

        dataType: type
    });

}



function showpass(element) {

    var passElememt = $('#password');
    if (passElememt.attr('type') === "text") {
        $(element).find('i').attr('class', 'glyphicon glyphicon-eye-close')
        passElememt.attr('type', 'password')
    } else {
        $(element).find('i').attr('class', 'glyphicon glyphicon-eye-open');

        passElememt.attr('type', 'text')

    }
}


(function () {
    orig = $.fn.css;
    $.fn.css = function () {
        var result = orig.apply(this, arguments);
        $(this).trigger('stylechanged');
        return result;
    }
})();


$(function () {
    var testElement = $("#results");
    var formTarget = $("#visual_form");
    var columnRowType = ""; //to get type of added row or column main or sub
    var targetElement; // target element for color changes
    var ClickedBtn; //Variable to know which color need to change
    var target; //target element to control
    var appendTo; //Get Element To add elements in it


    // Main Form Settings
    formTarget.droppable({
        drop: function (event, ui) {
            $("#results").text(($(ui.helper).attr("style")));
            $(ui.helper).css({"position": "", "opacity": "1"})
        }
    });
    formTarget.sortable({
        placeholder: "highlight",
        handle: ".mainrow-handle",
        axis: "Y"
    });//when drag ROWS DIVS



    function elements_optionsBuilder(type,name) {

        var returned;
        if(name === "maincolumn"){
            returned = '<a href="#" class="move-handle"><i class="glyphicon glyphicon-move '+name+'-handle"></i></a>\n' +
                '<div class="helper-panel col-lg-12" draggable="false">\n' +
                '<div class="col-lg-3 sides">\n' +
                '<a href="#" class="editColumn" data-target="columns_setting" style="float: right;">' +
                '<i class="glyphicon glyphicon-pencil"></i>' +
                '</a>\n' +
                '</div>\n' +
                '<div class="col-lg-6 middle">\n' +
                '<a href="#" class="open-helper-panel-btn" name="subrow" data-target="columns_content">' +
                '<i class="glyphicon glyphicon-plus-sign"></i>' +
                '</a>\n' +
                '</div>\n' +
                '\n' +
                '<div class="col-lg-3 sides">\n' +
                '\n' +
                '<a href="#" class="deleteColumn" style="float: left;">' +
                '<i class="glyphicon glyphicon-trash"></i>' +
                '</a>\n' +
                '</div>\n' +
                '</div>\n';



        }else if(name === "subcolumn"){
            returned = '<a href="#" class="move-handle"><i class="glyphicon glyphicon-move '+name+'-handle"></i></a>\n' +
                '<div class="helper-panel col-lg-12" draggable="false">\n' +
                '<div class="col-lg-3 sides">\n' +
                '<a href="#" class="editColumn" data-target="columns_setting" style="float: right;">' +
                '<i class="glyphicon glyphicon-pencil"></i>' +
                '</a>\n' +
                '</div>\n' +
                '<div class="col-lg-6 middle">\n' +
                '<a href="#" class="open-helper-panel-btn" name="subrow" data-target="columns_content">' +
                '<i class="glyphicon glyphicon-plus-sign"></i>' +
                '</a>\n' +
                '</div>\n' +
                '\n' +
                '<div class="col-lg-3 sides">\n' +
                '\n' +
                '<a href="#" class="deleteColumn" style="float: left;">' +
                '<i class="glyphicon glyphicon-trash"></i>' +
                '</a>\n' +
                '</div>\n' +
                '</div>\n';



        }else if (name === "mainrow"){
            returned = '<div class="col-lg-12"><ul class="row-tools-line">\n' +
                '<li><a href="#"><i class="glyphicon glyphicon-move '+name+'-handle" style="cursor: move"></i></a></li>\n' +
                '<li><a href="#"><i class="glyphicon glyphicon-align-justify"></i></a></li>\n' +
                '<li><a href="#" class="editRow"><i class="glyphicon glyphicon-pencil"></i></a></li>\n' +
                '<li><a href="#" class="deleteRow"><i class="glyphicon glyphicon-trash"></i></a></li>\n' +
                '</ul></div>';
        }else if (name === "subrow"){
            returned = '<div class="col-lg-12"><ul class="row-tools-line">\n' +
                '<li><a href="#"><i class="glyphicon glyphicon-align-justify"></i></a></li>\n' +
                '<li><a href="#" class="editRow"><i class="glyphicon glyphicon-pencil"></i></a></li>\n' +
                '<li><a href="#" class="deleteRow"><i class="glyphicon glyphicon-trash"></i></a></li>\n' +
                '</ul></div>';
        }else{
            returned = ' <ul class="eachElement">\n' +
                '<li><a href="#" class="'+type+'"><i class="glyphicon glyphicon-pencil"></i></a></li>\n' +
                '<li><a href="#" onclick="$(this).closest(\'ui_element\').remove()"><i class="glyphicon glyphicon-trash"></i></a></li>\n' +
                '</ul>';
/*
            returned = ' <ul class="eachElement">\n' +
                '<li><a href="#"><i class="glyphicon glyphicon-move"></i></a></li>\n' +
                '<li><a href="#" class="'+type+'"><i class="glyphicon glyphicon-pencil"></i></a></li>\n' +
                '<li><a href="#"><i class="glyphicon glyphicon-trash"></i></a></li>\n' +
                '</ul>'
*/
        }

        return returned;
    }





    function ControlDraggableElement(key, element) {
        if (key === "sort") {
            return {
                connectWith: ".columnsContainer",
                containment: ".draggable",
                placeholder: "highlight",
                forcePlaceholderSize: true,

                //cancel: ".portlet-toggle",
                items: ".draggable",
                appendTo: ".columnsContainer",
                start: function (event, ui) {
                    $(ui.helper).css({"width": "", "height": "", "background-color": "#f3f3f3"})
                }
            };


        } else {
            return {
                containment: "parent",
                refreshPositions: true,
                scrollSensitivity: 100,
                cursor: 'move',
                opacity: 0.6,
                zIndex: 100,
                connectToSortable: element,
                drag: function (event, ui) {
                    $(ui.helper).css({"width": "", "height": "", "background-color": "#f3f3f3"})
                }
            };
        }
    }


    $(document).on('click', '.open-helper-panel-btn', function (e) {
        $(".closeBrowserPanel").click();

        columnRowType = $(this).attr("name");


        if(columnRowType === "main"){
            appendTo = formTarget;
        }else{
            columnRowType = "sub";
            appendTo = $(this).closest(".draggable");
        }
        var target = $(this).attr("data-target");


        $('#' + target).addClass('bounceIn visible').removeClass('slideOutLeft')

    });

    $(".columns a").click(function (e) {
        e.preventDefault();


        if (!validateColsCalculate(this)) {
            alert("Error");
        } else {
            CreateColumns(this);
        }

    }); //When Click On a Template

    function CreateColumns(element) {
        $(".closeBrowserPanel").click();


        // testElement.text(appendTo.closest(".row").attr("id"));

        var cells = $(element).attr("data-cells");
        var equaltwelve = 0;
        var countROWS;



        if(appendTo.attr("id") !== "visual_form"){
            // var mainId = appendTo.closest(".row").attr("id");
            countROWS = appendTo.closest(".row").find(".sub-row").length;

        }else{
            countROWS = appendTo.find(".main-row").length;

        }

        function prOrap(element) {
            if(columnRowType === "main"){
                appendTo.append(element);
            }else{
                appendTo.prepend(element);
            }
        }

        // html_element.insertBefore(appendToElement.parent(".draggable > .helper"))

        prOrap($("<div></div>")
            .addClass("row "+columnRowType+"-row")
            .attr("id", columnRowType+"-row" + countROWS)
            .append(
                elements_optionsBuilder("",columnRowType+"row"), $("<div></div>")
                    .addClass("col-lg-12 columnsContainer")
                    .sortable({
                        placeholder:"highlight",
                        handle:"."+columnRowType+"column-handle",
                        axis: "x"
                    })
                    .attr("id", columnRowType+"-col-" + countROWS)
            )
        );

        // testElement.text(columnRowType+"column-handle");

        var appendToElement = $("#"+columnRowType+"-row" + countROWS).find("#"+columnRowType+"-col-" + countROWS);


        switch (cells) {
            case "12":
                AddToForm(12, appendToElement);

                break;
            default:

                var percentage = $(element).attr("title").split("+");
                $.each(percentage, function (key, value) {
                    var calcu = value.split("/");
                    var num1 = parseInt(calcu[0]);//1
                    var num2 = parseInt(calcu[1]);//4
                    var sum = 12 * num1 / num2;//3
                    equaltwelve += 12 * num1 / num2;

                    // alert(sum);
                    AddToForm(sum, appendToElement);
                });

                //alert(equaltwelve);

                var rest = 12 - equaltwelve;

                if (rest !== 0) {
                    AddToForm(rest, appendToElement);
                }
        }
    } //Function To create Columns

    function AddToForm(number, appendToElement) {
        var html_element;


        html_element =
            $("<div></div>")
                .addClass("col-lg-" + number + " draggable animated bounceIn")
                .css({"border": "1px solid", "border-color": "#ecebeb"})
                .append(
                    $("<div></div>")
                        .addClass("col-lg-12 helper")
                        .append(elements_optionsBuilder("",columnRowType+"column"))
                );


        //html_element.insertBefore(appendToElement.find(".helper-panel"))
        if(columnRowType === "main"){
            appendToElement.append(html_element);
        }else{
            // testElement.text(appendToElement.attr("class"));
            appendToElement.append(html_element);
        }



    } //Function To Add Columne DIV To Form

    function validateColsCalculate(element) {

        var percentage = $(element).attr("title").split("+");

        var valid = false;
        var equaltwelve = 0;
        $.each(percentage, function (key, value) {
            var calcu = value.split("/");
            var num1 = parseInt(calcu[0]);
            var num2 = parseInt(calcu[1]);
            if (num1 === 0 || num2 === 0) {
                equaltwelve = 0;
                return false;
            }
            equaltwelve += 12 * num1 / num2;

        });
        // alert(equaltwelve);
        if (Number(equaltwelve) === equaltwelve && equaltwelve % 1 === 0 && equaltwelve !== 0 && !isNaN(equaltwelve)) {

            var sign = Math.sign(equaltwelve);

            if (sign !== -1) {
                valid = true;
                if (equaltwelve <= 12) {
                    valid = true;
                }
            }
        }

        return valid;

    } //Function To Validate Dimentions Of Input Columns

    $('.colorpicker-color').on('stylechanged', function () {

        var value = $(this).attr('style').split(":")[1];

        $(targetElement).val(value);

        // alert(ClickedBtn);

        if (ClickedBtn === "border-color") {
            target.css({
                "border-top-color": value,
                "border-bottom-color": value,
                "border-left-color": value,
                "border-right-color": value
            });
        } else {
            target.css(ClickedBtn, value);

        }
    });






    $(".ElementsChoser").click(function (e) {
        $(".closeBrowserPanel").click();

        var clickedId = this.id;

        var formTarget = appendTo;


        var html_element = "";

        switch (clickedId) {
            case "row":
                $('#columns_template').addClass('bounceIn visible').removeClass('slideOutLeft');
                break;

            case "input_text":
                html_element = $("<div></div>").addClass("col-lg-12 ui_element animated bounceIn").append(
                    elements_optionsBuilder('input'),
                    $("<label></label>").attr("for", "inputtext").text("Input Text * :"),
                    $("<input>").attr({"type": "text", "id": "inputtext"}).addClass("form-control")
                );
                break;
            case "headers":
                html_element = $("<div></div>").addClass("col-lg-12 ui_element animated bounceIn").append(
                    elements_optionsBuilder('header'),
                    $("<h1></h1>").attr("id", "head").text("Header")

                );
                break;
            case "dateinput":
                html_element = $("<div></div>").addClass("col-lg-12 ui_element animated bounceIn").append(
                    elements_optionsBuilder('header'),
                    $("<input>").attr(
                {
                    "type": "number",
                    "id": "number",
                    "name": "number",
                    "placeholder":"DD/MM/YYYY",
                    "data-validate-minmax": "10,100",
                    "class": "form-control col-md-7 col-xs-12"
                }
            ));

                break;
            case "textarea":
                html_element = $("<div></div>").addClass("col-lg-12 ui_element animated bounceIn").append(
                    elements_optionsBuilder('header'),
                    // <textarea id="textarea" required="required" name="textarea" class="form-control col-md-7 col-xs-12"></textarea>

                    $("<textarea></textarea>").attr(
                        {
                            "id": "number",
                            "name": "textarea",
                            "placeholder":"Long Text",
                            "class": "form-control col-md-7 col-xs-12"
                        }
                    )

                );
                break;
            case "phonenumber":
                html_element = $("<div></div>").addClass("col-lg-12 ui_element animated bounceIn").append(
                    elements_optionsBuilder('header'),
                    //<input type="number" id="number" name="number" required="required" data-validate-minmax="10,100" class="form-control col-md-7 col-xs-12">
                    $("<input>").attr(
                        {
                            "type": "number",
                            "id": "number",
                            "name": "number",
                            "placeholder":"---/------/---",
                            "data-validate-minmax": "10,100",
                            "class": "form-control col-md-7 col-xs-12"
                        }
                        )

                );
                break;
            case "checkbox":
                html_element = $("<div></div>").addClass("col-lg-12 ui_element animated bounceIn").append(
                    elements_optionsBuilder('header'),
                    $("<div></div>").attr("class", "col-md-9 col-sm-9 col-xs-12").append(
                        '<div class="checkbox">\n' +
                        '<label>\n' +
                        '<input type="checkbox" value=""> Option one. select more than one options\n' +
                        '</label>\n' +
                        '</div>\n' +
                        '<div class="checkbox">\n' +
                        '<label>\n' +
                        '<input type="checkbox" value=""> Option two. select more than one options\n' +
                        '</label>\n' +
                        '</div>'
                    )
                );
                break;
            case "dropdown":
                html_element = $("<div></div>").addClass("col-lg-12 ui_element animated bounceIn").append(
                    elements_optionsBuilder('header'),
                    $("<select></select>").attr("class", "form-control").append(
                        $('<option></option>').val("").html("Choose option"),
                        $('<option></option>').val("").html("Option one"),
                        $('<option></option>').val("").html("Option two"),
                        $('<option></option>').val("").html("Option three"),
                        $('<option></option>').val("").html("Option four")
                    ));
                break;
        }

        html_element.insertBefore(formTarget.find(".helper-panel").eq(0));
        //formTarget.append(html_element);
    }); //When Click On Form Element From Panel




    $(document).on('click', 'a[class^="delete"]', function (e) {
        if ($(this).attr("class") === "deleteColumn") {
            $(this).closest(".draggable").remove();
        } else {
            $(this).closest(".row").remove();
        }

    });
    $(document).on('mouseenter', '.ui_element', function (e) {

        $(this).find(".eachElement").show();
    });
    $(document).on('mouseleave', '.ui_element', function (e) {
        $(this).find(".eachElement").hide();
    });

    $(function () {
        $('#mycp').colorpicker();
    });


    $(document).on('click', 'a[class^="edit"],.eachElement a', function (e) {

        $('#columns_setting').addClass('slideInLeft visible').removeClass('slideOutLeft');

        var type = $(this).attr("class");


        testElement.text(type);





        if (type === "editColumn") {
            target = $(this).closest(".draggable ");
        } else if (type === "editRow") {
            target = $(this).closest(".row ");
        } else {
            target = $(this).closest("ui_element");
        }

        $(".change").on("input", function () {
            target.css($(this).attr("data-name"), this.value + "px");
        });
        $("select").on('change', function () {
            var attrName = $(this).attr("data-name");

            target.css(attrName, this.value);
        });


        var attrbutes = [
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
            'border-top-width',
            'border-right-width',
            'border-bottom-width',
            'border-left-width',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
            'border-radius'
        ];

        attrbutes.forEach(function (item, index) {
            $("input[data-name=" + item + "]").val(parseInt(target.css(item)));
        });

        $("input.border-color").val(target.css("border-top-color"));
        $("input.background-color").val(target.css("background-color"));




        $('#border_style').find('option[value=' + target.css("border-style") + ']').attr('selected', true);
        $('#border_radius').find('option[value=' + target.css("border-radius") + ']').attr('selected', true);


        target.css({
            "border-top-color": target.css("border-top-color"),
            "border-bottom-color": target.css("border-bottom-color"),
            "border-left-color": target.css("border-left-color"),
            "border-right-color": target.css("border-right-color")
        });

    });


    $(".color").on("click", function () {

        ClickedBtn = $(this).attr("id");

        targetElement = $("." + $(this).attr("id"));


    });


    $("#maintools").fadeIn();
});

$(".closeBrowserPanel").click(function () {
    $('#columns_content , #columns_template, #columns_setting').attr("class", "animated slideOutLeft");
}); //To Close Panels




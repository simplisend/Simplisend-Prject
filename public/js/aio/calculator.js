// Standard Priority Calculator

var display1 = {
    operation: "",
    evaluation: "",
    onInputClause: "",
    answer: ""
};

// default flag values
var flag = {
    ansAllowed: false, // Initially do not allow the use of Ans button
    pctAllowed: true,
    /*
    decimalPointAllowed: true,

    ansAllowed: false,
    digitAllowed: true
    */
};

// default display values
$('#display1').html("");
// $('#display2').val("");

// Set default theme (light)

function evaluate() {
    //display1.onInputClause =
    try {
        //math.eval(display1.operation);
        display1.evaluation = display1.operation;
        return true; // no exception occured
    } catch (e) {
        if (e instanceof SyntaxError) { // Syntax error exception
            display1.evaluation = "E";
            return false; // exception occured
        }
        else {// Unspecified exceptions
            display1.evaluation = "UE";
            return false; // exception occured
        }
    }
}

$("#calculate_value button").on("click", function () {
    $("#form_read .onoffswitch-checkbox").click();

    var $getJSONs = [];
    if(clicked.find(".prop-target").eq(0).hasAttr("calculation")){
        if(clicked.find(".prop-target").eq(0).attr("calculation") !== ""){
            $.each(clicked.find(".prop-target").attr("calculation").split(/\s+/),function (index) {

                if(isNaN(this) && this.length > 1 && this.indexOf("/100") == -1){
                    var back = ["red", "green", "maroon", "olive", "lime", "aqua", "blue", "navy", "fuchsia", "purple"];
                    var rand = back[Math.floor(Math.random() * back.length)];

                    $getJSONs[index] = "<font  color='" + rand + "'>"+this+"</font>";
                }else{
                    $getJSONs[index] = "<font>"+this.replace("/100","%")+"</font>";
                }
            });
            $('#display1').html($getJSONs.join(" "));
        }else{
            $('#display1').html("");
        }
    }else{
        $('#display1').html("");
    }

    $("#calcolator-fields optgroup[label='Builder Fields'] option").remove();
    $("#calcolator-fields optgroup[label='PopUp Fields'] option").remove();

    $("#builder-mode").find("fieldset").each(function () {
        var $attr = $(this).attr("primary-id");
        if (typeof $attr !== typeof undefined && $attr !== false) {

            var $name = $(this).attr("primary-id");

            if ($(this).find("input[type='number']").length > 0) {
                $("#calcolator-fields optgroup[label='Builder Fields']").append(
                    $("<option />").val($attr).text($attr)
                );
            }
        }
    });

    $("#popups-page").find("fieldset").each(function () {
        var $attr = $(this).attr("primary-id");
        if (typeof $attr !== typeof undefined && $attr !== false) {

            var $name = $(this).attr("primary-id");

            if ($(this).find("input[type='number']").length > 0) {

                $("#calcolator-fields optgroup[label='PopUp Fields']").append(
                    $("<option />").val($attr).text($attr)
                );
            }
        }
    })


});

$("#save-calculation-btn").on("click", function () {
    var allev = $('#display1').text().replaceAllChars("\u0025","/100").replaceAllChars("&nbsp"," ");
    clicked.find(".prop-target").attr("calculation", allev);
});

$('#calcolator-fields').on('change', function () {

    if (this.value !== "none") {
        var back = ["red", "green", "maroon", "olive", "lime", "aqua", "blue", "navy", "fuchsia", "purple"];
        var rand = back[Math.floor(Math.random() * back.length)];


        var $value = $("fieldset[primary-id='" + this.value + "'] input[type='number']").val();
        display1.operation = display1.operation + $value;
        $('#display1').html($('#display1').html() + "<font color='" + rand + "'>" + this.value + "</font>");
        evaluate();

        $('#calcolator-fields').val("none").change();
        //$('#display2').val(display1.evaluation);
    }
});


// Backspace
$('#backspace').on('click', function () {
    display1.operation = display1.operation.slice(0, display1.operation.length - 1);
    // $('#display1').html($('#display1').html().slice(0, $('#display1').html().length-1));
    $('#display1').find("font:last").remove();
    evaluate();
    //$('#display2').val(display1.evaluation);
});


var buildClause = function ($number_key) {
    var $font = "", $number = "";
    switch ($number_key) {
        case "zero":
            $number = "0";
            $font = "<font>\u0030</font>";
            break;
        case "one":
            $number = "1";
            $font = "<font>\u0031</font>";
            break;
        case "two":
            $number = "2";
            $font = "<font>\u0032</font>";
            break;
        case "three":
            $number = "3";
            $font = "<font>\u0033</font>";
            break;
        case "four":
            $number = "4";
            $font = "<font>\u0034</font>";
            break;
        case "five":
            $number = "5";
            $font = "<font>\u0035</font>";
            break;
        case "six":
            $number = "6";
            $font = "<font>\u0036</font>";
            break;
        case "seven":
            $number = "7";
            $font = "<font>\u0037</font>";
            break;
        case "eight":
            $number = "8";
            $font = "<font>\u0038</font>";
            break;
        case "nine":
            $number = "9";
            $font = "<font>\u0039</font>";
            break;
        case "decimal":
            $number = ".";
            $font = "<font>\u002e</font>";
            break;
        case "left-parenthesis":
            $number = "(";
            $font = "&nbsp;<font>\u0028</font>&nbsp;";
            break;
        case "right-parenthesis":
            $number = ")";
            $font = "&nbsp;<font>\u0029</font>&nbsp;";
            break;
        case "add":
            $number = "+";
            $font = "&nbsp;<font>+</font>&nbsp;";
            break;
        case "subtract":
            $number = "-";
            $font = "&nbsp;<font>-</font>&nbsp;";
            break;
        case "multiply":
            $number = "*";
            $font = "&nbsp;<font>*</font>&nbsp;";
            break;
        case "divide":
            $number = "/";
            $font = "&nbsp;<font>/</font>&nbsp;";
            break;
        case "square":
            $number = "^2";
            $font = "&nbsp;<font>\u00b2</font>&nbsp;";
            break;
        case "percentage":
            $number = "%";
            $font = "<font>%</font>&nbsp;";
            break;
    }

    display1.operation = display1.operation + $number;
    $('#display1').html($('#display1').html() + $font);
    evaluate();
};


// Digits
$('#zero').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#one').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#two').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#three').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#four').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#five').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#six').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#seven').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#eight').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#nine').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#decimal').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});
// Operators
$('#left-parenthesis').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#right-parenthesis').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#add').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#subtract').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#multiply').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#divide').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#square-root').on('click', function () {

    var count = 0;
    var index = -1;
    var radicand = "";
    var result = "";

    // radicand is a complex expression
    if (display1.operation.endsWith(')')) {
        // Find the position of matching parenthesis
        // For example if operation="2+(3-(3+4))", then the index of the
        // matching '(' would be 2 and the radicand would be (3-(3+4))
        for (i = display1.operation.length - 2; i > -1; i--) {
            if (display1.operation.charAt(i) === '(') {
                if (count === 0) {
                    index = i;
                    break;
                }
                else {
                    count -= 1;
                    continue;
                }
            }
            else if (display1.operation.charAt(i) === ')') {
                count += 1;
            }
            else {
                continue;
            }
        }
        if (index === -1) {
            //alert("Malformed expression");
            $('#display2').val("Malformed expression");
            return;
        }
    }
    // radicand is a single number
    else if (display1.operation.endsWith('0') || display1.operation.endsWith('1') ||
        display1.operation.endsWith('2') || display1.operation.endsWith('3') ||
        display1.operation.endsWith('4') || display1.operation.endsWith('5') ||
        display1.operation.endsWith('6') || display1.operation.endsWith('7') ||
        display1.operation.endsWith('8') || display1.operation.endsWith('9') ||
        display1.operation.endsWith('.')) {
        index = display1.operation.length - 1;
        for (i = display1.operation.length - 2; i > -1; i--) {
            if (display1.operation.charAt(i) === '0' || display1.operation.charAt(i) === '1' ||
                display1.operation.charAt(i) === '2' || display1.operation.charAt(i) === '3' ||
                display1.operation.charAt(i) === '4' || display1.operation.charAt(i) === '5' ||
                display1.operation.charAt(i) === '6' || display1.operation.charAt(i) === '7' ||
                display1.operation.charAt(i) === '8' || display1.operation.charAt(i) === '9' ||
                display1.operation.charAt(i) === '.' || display1.operation.charAt(i) === '^') {
                index = i;
            }
            else {
                break;
            }
        }
    }
    else {
        return;
    }

    // Get the radicand
    radicand = display1.operation.substring(index, display1.operation.length);

    // Update operation with sqrt(radicand)
    display1.operation = display1.operation.substring(0, index) + "sqrt(" + radicand + ")";

    // Replace '^2' with superscript two (don't forget to escape '^' with '\')
    radicand = radicand.replace(/\^2/g, "\u00b2");

    // Find the last occurence of radicand
    index = $('#display1').html().lastIndexOf(radicand);

    radicand = $('#display1').html().substring(index, $('#display1').html().length);

    // Update #display1
    $('#display1').html($('#display1').html().substring(0, index) + '\u221a' + radicand);

    // Evaluate
    evaluate();

    // Display current evaluation
    //$('#display2').val(display1.evaluation);
});

$('#square').on('click', function () {
    buildClause(this.id);
    //$('#display2').val(display1.evaluation);
});

$('#percentage').on('click', function () {

buildClause(this.id)
});
$('#percentffage').on('click', function () {

    test("\u0025");
    // Only one % is allowed for the entire operation.
    // The last % indicates the end of the entire operation and triggers the equal button.
    if (display1.numOfPct < 1 && flag.pctAllowed) {
        //Num
        if (display1.numOfOperands === 0) {
            display1.operand = eval(display1.operand + "/" + "100").toString();
            $('#display1').html(display1.operand);
            $('#display2').val(display1.operand);
        }
        else {
            $('#display1').html($('#display1').html() + '<font>\u0025</font>');
            display1.numOfPct ++;
            switch (display1.operator) {
                // a*b%
                case "*":
                    // a*b/100
                    display1.operand = eval(display1.evaluation + "*" + display1.operand + "/" + "100").toString();
                    display1.operation = "1";
                    // result = 1 * (a*b/100)
                    $('#display2').val(eval(display1.operation + display1.operator + display1.operand).toString());
                    if (display1.numOfOperands)
                    break;

                // a/b%
                case "/":
                    // a/b*100
                    display1.operand = eval(display1.evaluation + "/" + display1.operand + "*" + "100").toString();
                    display1.operation = "1";
                    display1.operator = "*";
                    // result = 1 * (a/b*100)
                    $('#display2').val(eval(display1.operation + display1.operator + display1.operand).toString());
                    break;

                // a+b%, a-b%
                default:
                    // a*b/100
                    display1.operand = eval(display1.evaluation + "*" + display1.operand + "/" + "100").toString();
                    // result = a + (a*b/100), result = a - (a*b/100)
                    $('#display2').val(eval(display1.operation + display1.operator + display1.operand).toString());
                    break;
            }
            // Execute the handler attached to the $("#equal") element for the 'click' event type.
            $("#equal").trigger("click");
        }
    }

});
// Clear
$('#clear').on('click', function () {
    display1.operation = "",
        display1.evaluation = "",
        $('#display1').html("");
    $('#display2').val("");
});
// Equal
$('#equal').on('click', function () {
    display1.answer = display1.evaluation; // Store the answer (Ans button)
    $('#display1').html(display1.answer); // Update display1
    $('#display2').val(""); // Update display2
    display1.operation = display1.answer; // Current operation equals the answer
    flag.ansAllowed = true; // Allow the use of Ans button
});

$('#ans').on('click', function () {

    // Allow 'Ans' when its flag is enabled
    if (flag.ansAllowed) {
        if (flag.squareRoot) {
            display1.operation = display1.operation.substring(0, display1.operation.length - 1) + display1.answer + ")";
        }
        else {
            display1.operation = display1.operation + display1.answer;
        }
        $('#display1').html($('#display1').html() + 'Ans</font>');
        //$('#display2').val(display1.evaluation);
    }
});


function calculate() {
    // $json = JSON.stringify();
    var numbers = ["/","*","-","+","(",")"];
    var $getJSONs = [];

    $("input[type='number'].prop-target").each(function (input_index) {
        if($(this).hasAttr("calculation")){
            $.each($(this).attr("calculation").split(/\s+/),function (index) {

                if(isNaN(this) && this.length > 1 && this.indexOf("/100") == -1){
                    var $number = $('fieldset[primary-id="'+this+'"] input[type="number"].prop-target').val();
                    if($number === ""){
                        $number = 0;
                    }
                    $getJSONs[index] = $number;
                }else{
                    $getJSONs[index] = this;
                }
            });


            var $eval = $getJSONs.join(" ");

            test($eval);

            $("input[type='number'].prop-target").eq(input_index).val(eval($eval));
        }
    })
}

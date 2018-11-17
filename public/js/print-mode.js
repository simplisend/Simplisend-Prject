var manageHeadersFooters = function (builder_paper) {

    var JSON_MAP = {
        header_index: [],
        footer_index: [],
    };
    var getHeader = builder_paper.find(".element-header").not(".error_row"),
        getFooter = builder_paper.find(".element-footer").not(".error_row");

    if (getHeader.length > 0) {
        var header_height = getHeader.innerHeight(),
            apply_header_to_first = getHeader.hasClass("apply_to_first_page"),
            apply_header_to_last = getHeader.hasClass("apply_to_last_page"),
            apply_header_to_specific = getHeader.hasClass("apply_to_specific_pages");

        if (apply_header_to_first) {
            JSON_MAP.header_index.push("first");
        }

        if (apply_header_to_last) {
            JSON_MAP.header_index.push("last");
        }

        if (apply_header_to_specific) {
            var getFrom = parseInt(getHeader.attr("from")),
                getTo = parseInt(getHeader.attr("to"));


            if (getTo >= getFrom) {
                for (var ee = getFrom; ee <= getTo; ee++) {
                    JSON_MAP.header_index.push(ee);

                }

            }
        }

    }
    if (getHeader.length > 0) {
        var footer_height = getFooter.innerHeight(),
            apply_footer_to_first = getFooter.hasClass("apply_to_first_page"),
            apply_footer_to_last = getFooter.hasClass("apply_to_last_page"),
            apply_footer_to_specific = getFooter.hasClass("apply_to_specific_pages");

        if (apply_footer_to_first) {
            JSON_MAP.footer_index.push("first");
        }

        if (apply_footer_to_last) {
            JSON_MAP.footer_index.push("last");
        }

        if (apply_footer_to_specific) {
            var getFrom = parseInt(getFooter.attr("from")),
                getTo = parseInt(getFooter.attr("to"));


            if (getTo >= getFrom) {
                for (var ee = getFrom; ee <= getTo; ee++) {
                    JSON_MAP.footer_index.push(ee);

                }

            }
        }


    }


    return JSON_MAP;

},

    printMode = function () {

        $("ul").remove();


        $(".replacable-panel .tools-list *[data-html='select-mode']").click();
        var builder_paper = $("#builder-mode > .builder-paper"), //from
            print_element = $("#print-here"),
            default_size = $settings.settings().mainSize,
            getConversion = $("<div page-size='" + default_size + "' />").resize_page_constrain("page-size", 650);

        var default_width = getConversion.vertical_OnPage_width,
            default_height = getConversion.vertical_OnPage_height,
            default_orientation = "v",
            padding = 20,
            height_counter = "",
            background = "";

        print_element.find(".a4-page").remove(); //remove all pages from print mode

        var getHeight = 0;
        //get header and footer

        var first_page_break = builder_paper.find(".row").eq(0);
        var current_page = null;


        if (!first_page_break.hasClass("page-break")) {
            current_page = $("<div class='a4-page target-paper' />").css({
                "width": default_width + "px",
                "height": default_height + "px",
                "padding-top": padding + "px",
                "padding-bottom": padding + "px"
            });
            height_counter = default_height - (padding * 2);
            print_element.append(current_page);
        }
        var getHeader = builder_paper.find(".element-header").not(".error_row").eq(0),
            getFooter = builder_paper.find(".element-footer").not(".error_row").eq(0);

        // alert(getHeader.outerHeight());
        var current_page_content_height = 0;
        var HeadersFooters = manageHeadersFooters(builder_paper);
        builder_paper
            .find(".row")
            .not(".element-header")
            .not(".element-footer")
            .not(".error_row")
            .each(function (index) {

                padding = 20;
                if ($(this).hasClass("page-break")) {
                    padding = 20;
                    if ($(this).hasAttr("page-size")) {
                        var get_conversion = $(this).resize_page_constrain("page-size", 650);
                        if ($(this).hasAttr("page-orientation") && ($(this).attr("page-orientation") === "h" || $(this).attr("page-orientation") === "v")) {
                            default_orientation = $(this).attr("page-orientation");
                        }
                        if (default_orientation === "h") {
                            default_width = get_conversion.horizontal_OnPage_width;
                            default_height = get_conversion.horizontal_OnPage_height;
                        } else {
                            default_width = get_conversion.vertical_OnPage_width;
                            default_height = get_conversion.vertical_OnPage_height;
                        }


                    }
                    current_page = $("<div class='a4-page target-paper' />").css({
                        "width": default_width + "px",
                        "height": default_height + "px",
                        "padding-top": padding + "px",
                        "padding-bottom": padding + "px"
                    });
                    if ($(this).hasAttr("page-background") && $(this).attr("page-background") != "") {
                        background = $(this).attr("page-background");
                        current_page.css({
                            "background-image": "url("+background+")",
                            "background-size": "100% 100%"
                        })
                    }
                    height_counter = default_height - (padding * 2);
                    print_element.append(current_page);
                    current_page_content_height = 0;
                }

                if (current_page.index() === 1 && HeadersFooters.header_index.indexOf("first") !== -1) {
                    if (current_page.find(".element-header").length === 0) {
                        padding += getHeader.outerHeight();
                        current_page.css("padding-top", padding + "px");
                        current_page_content_height += padding;
                        height_counter -= current_page_content_height;

                        current_page.prepend(getHeader);
                        padding = 20;
                    }
                }


                if (current_page.index() === 1 && HeadersFooters.footer_index.indexOf("first") !== -1) {
                    if (current_page.find(".element-footer").length === 0) {
                        padding += getFooter.outerHeight();
                        current_page.css("padding-top", padding + "px");
                        current_page_content_height += padding;
                        height_counter -= current_page_content_height;

                        current_page.prepend(getFooter);
                        padding = 20;
                    }
                }


                if (HeadersFooters.header_index.indexOf(current_page.index()) !== -1) {
                    if (current_page.find(".element-header").length === 0) {
                        padding += getHeader.outerHeight();
                        current_page.css("padding-top", padding + "px");
                        current_page_content_height += padding;
                        height_counter -= current_page_content_height;

                        current_page.prepend(getHeader);
                        padding = 20;
                    }
                }


                if (HeadersFooters.footer_index.indexOf(current_page.index()) !== -1) {
                    if (current_page.find(".element-footer").length === 0) {
                        padding += getFooter.outerHeight();
                        current_page.css("padding-top", padding + "px");
                        current_page_content_height += padding;
                        height_counter -= current_page_content_height;

                        current_page.prepend(getFooter);
                        padding = 20;
                    }
                }


                if (!$(this).hasClass("element-unprintable")) {
                    var getClone = $(this);
                    getClone.find("fieldset[rel='button']").hide();
                    getClone.find("fieldset[rel='file']").hide();
                    getHeight = getClone.height();

                    if (getHeight >= height_counter) {
                        padding = 20;
                        current_page = $("<div class='a4-page target-paper' />").css({
                            "width": default_width + "px",
                            "height": default_height + "px",
                            "padding-top": padding + "px",
                            "padding-bottom": padding + "px"
                        });
                        height_counter = default_height - (padding * 2);

                        print_element.append(current_page);
                        current_page_content_height = 0;
                    }

                    height_counter -= getHeight;


                    current_page_content_height += getHeight;
                    current_page.append(getClone.clone());
                    current_page.find(".v-web").removeClass("v-web").addClass("v-print");

                    getClone.find("fieldset[rel='button']").show();
                    getClone.find("fieldset[rel='file']").show();
                }

            });


    };

$(function () {



    printMode();

    $("body *").each(function () {
        if(!$(this).hasClass("a4-page")){
            $(this).removeClass("prop-target");
            var $_width = $(this).css("width");

            $(this).css({
                "-webkit-box-shadow": "none",
                "box-shadow": "none",
                "-webkit-transition": "none",
                "-o-transition": "none",
                "transition": "none",
                "width": $_width
            });
        }
    });
    // printDiv("print-mode");
    function printDiv(divName) {
        $(".v-web").removeClass("v-web").addClass("v-popup");
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;

    }
})
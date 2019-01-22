(function ($) {

    orig = $.fn.css;
    $.fn.css = function () {
        var result = orig.apply(this, arguments);
        $(this).trigger('stylechanged');
        return result;
    };

    Array.prototype.last = function () {
        return this[this.length - 1];
    };


    Array.prototype.clear = function () {
        this.splice(0, this.length);
    };

    $.fn.makeAccordion = function () {
        var $this = $(this);
        $(".item-title").click(function () {
            var _$this = $(this);
            // alert($this.attr("section"));

            $this.find(".tools-group").each(function () {
                if ($(this).attr("id") !== _$this.next().attr("id") && $(this).css("display") === "block") {
                    $(this).slideUp();
                    _$this.next().slideDown();
                } else {
                    _$this.next().slideDown();

                }
            })

        })
    };

    $.fn.feditable = function () {

        var testElement = $("#results");

        var elementEdit = "";


        var columns_setting = $("#design_setting");


        columns_setting.find("input").on("input", function (w) {

            var type = $(this).attr("type");
            var place = $(this).attr("title");
            var type_name = $(this).attr("data-name");
            var type_value = this.value;
            elementEdit = $(".selected");

            if (place === "attr") {
                testElement.text(elementEdit.tagName());
                if (elementEdit.tagName() !== "DIV") {
                    elementEdit.attr(type_name, type_value);
                } else {
                    if (elementEdit.find("select").length > 0) {
                        elementEdit.find("select").attr(type_name, type_value);
                    } else if (elementEdit.find("input").length > 0) {
                        elementEdit.find("input").attr(type_name, type_value + "[]");
                    }
                }

            } else if (place === "style") {
                if (type === "number") {
                    elementEdit.css(type_name, type_value + "px");
                } else {
                    elementEdit.css(type_name, type_value);
                }
            } else if (place === "class") {
                var getClass = $(this).attr("name");
                if ($(this).is(':checked')) {
                    elementEdit.addClass(getClass);
                } else {
                    elementEdit.removeClass(getClass);
                }
            }
        });

        columns_setting.find("textarea").on("input", function (w) {
            var place = $(this).attr("title");
            var type_value = this.value;
            elementEdit = $(".selected");

            if (place === "text") {
                elementEdit.text(type_value);
            } else if (place === "options") {

            } else if (place === "hint") {
                elementEdit.parent().find("small").html(type_value);

            }
        });

        columns_setting.find("select").on("change", function (w) {
            var place = $(this).attr("title");
            var type_name = $(this).attr("data-name");
            var type_value = this.value;
            elementEdit = $(".selected");
            if (place === "attr") {
                if (type_value === "text" || type_value === "number" || type_value === "password") {
                    $("#min").attr({"type": "number", "data-name": "minlength"});
                    $("#max").attr({"type": "number", "data-name": "maxlength"});
                } else if (type_value === "date") {
                    $("#min").attr({"type": "date", "data-name": "min"});
                    $("#max").attr({"type": "date", "data-name": "max"});
                } else if (type_value === "email") {
                    $("#form_minimum,#form_maximum").hide();
                }

                elementEdit.attr(type_name, type_value);
            } else if (place === "style") {
                elementEdit.css(type_name, type_value);
            }
        });

        columns_setting.find("#options_addTag").on('keyup', function (event) {

            var thisKey = event.keyCode ? event.keyCode : event.which;
            if (thisKey === 13) { // 13 = Enter Key

                elementEdit = $(".selected");
                var getType;
                var name;
                var getValues = columns_setting.find("#options").val().split(",");
                var getLabels;


                if (!elementEdit.hasClass("dropdownlist")) {
                    if (elementEdit.hasClass("checkboxes")) {
                        getType = "checkbox"
                    } else {
                        getType = "radio";
                    }


                    if (elementEdit.find("input").eq(0).is("[name]")) {
                        name = elementEdit.find("input").eq(0).attr("name");
                    }


                    $.each(getValues, function (index) {
                        var countLabels = elementEdit.find("input[value='" + getValues[index] + "']");
                        if (countLabels.length === 0) {
                            elementEdit.append(
                                $("<div></div>").attr("class", "col-lg-4").append(
                                    $("<label></label>").attr("class", getType).append(
                                        $("<input>").attr({"type": getType, "value": getValues[index]}).css({
                                            "margin": "0",
                                            "padding": "0"
                                        }).addClass("option-input")
                                    ).append(getValues[index])
                                )
                            )

                        }
                    });

                    getLabels = elementEdit.find("input");


                } else {

                    $.each(getValues, function (index) {

                        var countLabels = elementEdit.find("option[value='" + getValues[index] + "']");
                        if (countLabels.length === 0) {

                            elementEdit.append(
                                $("<option></option>").attr({
                                    "value": getValues[index],
                                    "name": name
                                }).css({"margin": "0", "padding": "0"}).text(getValues[index])
                            )

                        }

                    });

                    getLabels = elementEdit.find("option");

                }

                $.each(getLabels, function (index) {
                    var exist = true;
                    var deletedElement;

                    var checkArray = getValues.indexOf(getLabels.eq(index).val());
                    if (checkArray === -1) {
                        getLabels.remove();
                    }
                })

            }
        });

        columns_setting.find("#width").on("input", function () {

            elementEdit = $(".selected");

            //W:1100 H:1556
            //w:2300
            elementEdit.find(">div").attr("class", "col-lg-" + this.value);


        });


    };

    $.fn.hasAttr = function (attribute) {
        var $this = $(this);
        return typeof $this.attr(attribute) !== typeof undefined && $this.attr(attribute) !== false;
    };
    String.prototype.lines = function () {
        return this.split(/\r*\n/);
    };
    String.prototype.lineCount = function () {
        return this.lines().length - navigator.userAgent.indexOf("MSIE") !== -1;
    }
    /*
        $("#design_setting").find(".text-toolkit").find("a").on("click", function (e) {
            var elementEdit = $(".selected");
            var addcss = false;

            var clickStyled = $(this);
            var style_type = clickStyled.attr("data-target");
            var style_value = clickStyled.attr("title");

            var getsametype = $(".text-toolkit").find("a[data-target='" + style_type + "']");

            if (style_type !== "text-indent") {
                if (getsametype.length > 1) {
                    getsametype.each(function (index) {
                        // alert(getsametype.eq(index.attr("title")+"/"+clickStyled.attr("title")));
                        if (getsametype.eq(index).attr("title") !== style_value) {
                            getsametype.eq(index).removeClass("style-clicked");
                        }
                    });
                }
                if (clickStyled.hasClass("style-clicked")) {
                    clickStyled.removeClass("style-clicked");
                    addcss = false;
                } else {
                    clickStyled.addClass("style-clicked");
                    addcss = true;
                }

                if (addcss === true) {
                    elementEdit.css(style_type, style_value);
                } else {
                    elementEdit.css(style_type, "");
                }
            } else {
                var getindentvalue = elementEdit.css(style_type);
                getindentvalue = parseInt(getindentvalue.replace("px", ""));
                if (style_value === "-50") {
                    if (getindentvalue !== 0) {
                        elementEdit.css(style_type, getindentvalue - 50);

                    }
                } else {
                    elementEdit.css(style_type, getindentvalue + 50);
                }

                $("#results").text(getindentvalue);
            }


        });
    */

    /**************************************** Helper plugins ****************************************/
    String.prototype.replaceAllChars = function (find, replace) {


        var arr = this.split(find);
        return arr.join(replace);

        /*
                var afterReplace;
                var beforeReplace = this;
                $.each(this.split(find), function (key) {

                    // alert(beforeReplace.split("_")[key]);
                    if (key === 0) {
                        afterReplace = beforeReplace.replace(find, replace);
                    } else {
                        afterReplace = afterReplace.replace(find, replace);
                    }
                });


                return afterReplace;
        */

    };
    $.fn.replaceClass = function (OldClass, NewClass) {
        $(this).removeClass(OldClass).addClass(NewClass)
    };
    $.fn.tagName = function () {
        return this.prop("tagName");
    };
    String.prototype.whiteSpaces = function () {
        return this.replace(/\s*[\r\n]+\s*/g, '\n')
            .replace(/(<[^\/][^>]*>)\s*/g, '$1')
            .replace(/\s*(<\/[^>]+>)/g, '$1');
    };
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
    Number.prototype.countByAlphabet = function () {


        let $array = this.toString().split("");
        let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split("");
        let charachters = "";

        $.each($array, function (index) {
            charachters = charachters + alphabet[$array[index]];
        });

        return charachters;
    };
    String.prototype.endingWith = function (pattern) {
        var d = this.length - pattern.length;
        return d >= 0 && this.lastIndexOf(pattern) === d;
    };
    /**************************************** Helper plugins ****************************************/



    jQuery.fn.single_double_click = function (single_click_callback, double_click_callback, timeout) {
        return this.each(function () {
            var clicks = 0, self = this;
            jQuery(this).click(function (event) {
                clicks++;
                if (clicks == 1) {
                    setTimeout(function () {
                        if (clicks == 1) {
                            single_click_callback.call(self, event);
                        } else {
                            double_click_callback.call(self, event);
                        }
                        clicks = 0;
                    }, timeout || 200);
                }
            });
        });
    };

    $.fn.scrollToSimple = function ($target) {
        var $container = this.first();      // Only scrolls the first matched container

        var pos = $target.position(), height = $target.outerHeight();
        var containerScrollTop = $container.scrollTop(), containerHeight = $container.height();
        var top = pos.top + containerScrollTop;     // position.top is relative to the scrollTop of the containing element

        var paddingPx = containerHeight * 0.15;      // padding keeps the target from being butted up against the top / bottom of the container after scroll

        if (top < containerScrollTop) {     // scroll up
            $container.scrollTop(top - paddingPx);
        }
        else if (top + height > containerScrollTop + containerHeight) {     // scroll down
            $container.scrollTop(top + height - containerHeight + paddingPx);
        }
    };
    /**************************************** Start Manage Class ****************************************/
    $.fn.generateClass = function (classes, style1 = {}, modes = [], printStyle = false, style2 = {}) {

        var styles = jQuery.extend({
            font_family: "arial",
            font_size: "",
            color: "#000000",
            font_style: "normal",
            font_weight: "",
            text_decoration: "none",
            text_transform: "none",
            line_height: "16px",
            text_align: "start",
            text_indent: "",
            background: "",
            border_bottom: "",
            border_top: "",
            border_left: "",
            border_right: "",
            border_radius: "",
            padding_top: "",
            padding_right: "",
            padding_bottom: "",
            padding_left: "",
            margin_top: "",
            margin_right: "",
            margin_bottom: "",
            margin_left: "",
            height: "auto !important",
            min_height: "34px !important"
        }, style1, style2);


        var $testStyle = $("input#test-style");

        if (printStyle) {
            $.each(style2, function (key, value) {

                $testStyle.css(key.replaceAllChars("_", "-"), value);
            });
            $(this).attr("print-style", $testStyle.attr("style"));
            $testStyle.removeAttr("style");
        }

        $.each(style1, function (key, value) {

            $testStyle.css(key.replaceAllChars("_", "-"), value);
            //$(this).css(key.replaceAllChars("_", "-"), value);
        });
        
        $(this).attr("style", $testStyle.attr("style"));
        $(this).attr("web-style", $testStyle.attr("style"));
        $testStyle.removeAttr("style");

        return $(this).addClass("v-"+builder_mode+" " + classes);

    };
    $.fn.getCss = function (proprety) {
        var $this = $(this);


        return $this.css(proprety);


    };
    $.fn.addCss = function (stylename, stylevalue, key) {
        if (!allow_edit) return;

        SOMTHING_CHANGED = true;
        var $this = $(this),
            key_id = $this.attr("id");
        $this.css(stylename,stylevalue);
        $this.attr(key+"-style",$this.attr("style"));

        $("#"+key_id).attr(key+"-style",$this.attr("style"));

        //a4-page-index-a-row-index-a-column-index-a-header-a-H1-a
        //builder-mode-row-index-a-column-index-a-header-a-H1-a

    };
    $.fn.removeCss = function (stylename, key) {
        if (!allow_edit) return;
        var $this = $(this),
            key_id = $this.attr("id");

        $this.css(stylename,"");
        $this.attr(key+"-style",$this.attr("style"));
        $("#"+key_id).attr(key+"-style",$this.attr("style"));

    };
    $.fn.getCssStyle = function (proprety) {
        var $this = $(this);
        if($this.hasAttr("style")){
            var getStyleTag = $this.attr("style").split(";"),
                getValue = "";

            for (var i = 0; i < getStyleTag.length; i++) {


                var $trim = $.trim(getStyleTag[i]);

                if ($trim.startsWith(proprety)) {
                    var fetchStyle = getStyleTag[i].split(":")[1];
                    getValue = fetchStyle.replace("!important", "");
                }


            }


        }else{
            getValue = "";
        }

        return getValue;
    };
    /**************************************** End Manage Class ****************************************/



    $.fn.textEditiable = function () {


    };
    $.fn.closePopenP = function (open, close) {

        $(close).hide();

        $(".clicked_img").hide();

        $(open).show();
        $(this).find(".clicked_img").show();


    };


    $.fn.resize_page_constrain = function(attr_name, new_width){
        var $sizes = {
            "A0": "9933 x 14043",
            "A1": "7016 x 9933",
            "A2": "4961 x 7016",
            "A3": "3508 x 4961",
            "A4": "2480 x 3508",
            "A5": "1748 x 2480",
            "A6": "1240 x 1748",
            "A7": "874 x 1240",
            "A8": "614 x 874",
            "A9": "437 x 614",
            "A10": "307 x 437"
        };
        var getValue = $(this).attr(attr_name);
        if ($sizes[getValue] !== undefined && $sizes[getValue] !== "") {
            var $arg = $sizes[getValue].split("x"),
                $real_width = parseInt($arg[0].trim()),
                $real_height = parseInt($arg[1].trim()),
                $page_width = new_width,


                $get_height_percent_v = ($page_width / $real_width) * 100, //26.209677419354836%
                $get_fake_height_v = ($get_height_percent_v / 100) * $real_height; //919px


            var $get_height_percent_h = ($page_width / $get_fake_height_v) * 100, //70%
                $get_fake_height_h = ($get_height_percent_h / 100) * $page_width; //460px

            var vertical_real_size = $real_width + "x" + $real_height,
                horizontal_real_size = $real_height + "x" + $real_width;

            var vertical_fake_size = $page_width + "x" + $get_fake_height_v,
                horizontal_fake_size = $page_width + "x" + $get_fake_height_h;

            return {
                name: getValue ,
                vertical_real_width: $real_width,
                vertical_real_height: $real_height,
                horizontal_real_width: $real_height,
                horizontal_real_height: $real_width,
                vertical_OnPage_width: $page_width,
                vertical_OnPage_height: $get_fake_height_v,
                horizontal_OnPage_width: $page_width,
                horizontal_OnPage_height: $get_fake_height_h,
            };
        } else {
            return "error";
        }

    }
    /**************************************** Elements plugins ****************************************/



    $.fn.setCursorPosition = function (pos) {
        if (this.setSelectionRange) {
            this.setSelectionRange(pos, pos);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            if (pos < 0) {
                pos = $(this).val().length + pos;
            }
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };

    $.fn.selText = function () {
        var obj = this[0];
        if ($.browser.msie) {
            var range = obj.offsetParent.createTextRange();
            range.moveToElementText(obj);
            range.select();
        } else if ($.browser.mozilla || $.browser.opera) {
            var selection = obj.ownerDocument.defaultView.getSelection();
            var range = obj.ownerDocument.createRange();
            range.selectNodeContents(obj);
            selection.removeAllRanges();
            selection.addRange(range);
        } else if ($.browser.safari) {
            var selection = obj.ownerDocument.defaultView.getSelection();
            selection.setBaseAndExtent(obj, 0, obj, 1);
        }
        return this;
    };
    $.fn.textWidth = function (text, font) {
        if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
        $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
        return $.fn.textWidth.fakeEl.width();
    };

    $.fn._resizable = function () {
        let resizableEl = $(this).not(':last-child'),
            columns = 12,
            fullWidth = resizableEl.parent().width(),
            columnWidth = fullWidth / columns,
            totalCol, // this is filled by start event handler
            updateClass = function (el, col) {
                el.css('width', ''); // remove width, our class already has it
                el.removeClass(function (index, className) {
                    return (className.match(/(^|\s)col-\S+/g) || []).join(' ');
                }).addClass('col-sm-' + col);
            };
        // jQuery UI Resizable
        resizableEl.resizable({
            handles: 'e',
            grid: 5,
            start: function (event, ui) {
                var
                    target = ui.element,
                    next = target.next(),
                    targetCol = Math.round(target.width() / columnWidth),
                    nextCol = Math.round(next.width() / columnWidth);

                $("#test").html(columnWidth);
                // set totalColumns globally
                totalCol = targetCol + nextCol;
                target.resizable('option', 'minWidth', columnWidth);
                target.resizable('option', 'maxWidth', ((totalCol - 1) * columnWidth));
            },
            resize: function (event, ui) {
                var target = ui.element,
                    next = target.next(),
                    targetColumnCount = Math.round(target.width() / columnWidth),
                    nextColumnCount = Math.round(next.width() / columnWidth),
                    targetSet = totalCol - nextColumnCount,
                    nextSet = totalCol - targetColumnCount;


                updateClass(target, targetSet);
                updateClass(next, nextSet);


            },
        });
    };
    $.fn.column_resizable = function () {
        let resizableEl = $(this).not(':last-child'),
            getRow = $(this).parent(),
            this_class,
            this_class_width,
            next_class,
            next_class_width,
            old_this_Class,
            old_next_Class,
            newClass,
            updateClass = function (el, col) {
                el.css('width', ''); // remove width, our class already has it
                el.removeClass((el.attr("class").match(/(^|\s)col-\S+/g) || []).join(' ')).addClass('col-sm-' + col);
            };


        // jQuery UI Resizable
        resizableEl.resizable({
            handles: 'e',
            grid: 50,
            start: function (event, ui) {
                this_class = ($(this).attr("class").match(/(^|\s)col-\S+/g) || []).join(' ');
                this_class_width = parseInt(this_class.split("-")[2]);
                next_class = ($(this).next().attr("class").match(/(^|\s)col-\S+/g) || []).join(' ');
                next_class_width = parseInt(next_class.split("-")[2]);
                old_this_Class = this_class;
                old_next_Class = next_class_width;
                // alert(resizableEl.index(this));
            },
            resize: function (event, ui) {
                this_class = ($(this).attr("class").match(/(^|\s)col-\S+/g) || []).join(' ');
                this_class_width = parseInt(this_class.split("-")[2]);
                next_class = ($(this).next().attr("class").match(/(^|\s)col-\S+/g) || []).join(' ');
                next_class_width = parseInt(next_class.split("-")[2]);

                var delta_x = ui.size.width - ui.originalSize.width;

                var currentWidth = ui.size.width;
                var direction = (currentWidth > window.resizeWidth) ? 'right' : 'left';
                window.resizeWidth = ui.size.width;


                $("#test").html(direction);

                if (direction === "right") {

                    if (this_class_width < 12 && next_class_width > 1) {

                        newClass = "col-sm-" + (this_class_width + 1);

                        updateClass($(this), (this_class_width + 1));
                        updateClass($(this).next(), (next_class_width - 1));

                        // $(this).replaceClass(this_class, newClass);
                        // $(this).next().replaceClass(next_class, "col-sm-" + (next_class_width - 1));
                    }

                } else {
                    if (this_class_width > 1 && next_class_width < 12) {

                        newClass = "col-sm-" + (this_class_width - 1);

                        updateClass($(this), (this_class_width - 1));
                        updateClass($(this).next(), (next_class_width + 1));

                        // $(this).replaceClass(this_class, newClass);
                        // $(this).next().replaceClass(next_class, "col-sm-" + (next_class_width + 1));

                    }

                }

                resizableEl.css("width", "");


            },
        });
    };

    $.fn.fieldset_resizable = function () {
        // jQuery UI Resizable
        $(this).resizable({
            handles: 'e',
            grid: 50,
            resize: function (event, ui) {
                var target = ui.element, classIndex, oldClass, newClass;
                // set totalColumns globally

                var splitClass = target.attr("class").split(" ");

                $.each(splitClass, function (index) {
                    if (this.match("^col-sm-")) {
                        classIndex = index;
                    }
                });

                var currentWidth = ui.size.width;
                var direction = (currentWidth > window.resizeWidth) ? 'r' : 'l';
                window.resizeWidth = ui.size.width;
                target.css('width', '');
                if (direction === "r") {
                    if (parseInt(splitClass[classIndex].split("-")[2]) < 12) {

                        oldClass = splitClass[classIndex];
                        newClass = "col-sm-" + (parseInt(splitClass[classIndex].split("-")[2]) + 1);
                        $(this).replaceClass(oldClass, newClass);
                    }

                } else {
                    if (parseInt(splitClass[classIndex].split("-")[2]) > 1) {

                        oldClass = splitClass[classIndex];
                        newClass = "col-sm-" + (parseInt(splitClass[classIndex].split("-")[2]) - 1);
                        $(this).replaceClass(oldClass, newClass);
                    }

                }

                target.find(".width-attr").attr("width", target.innerWidth())

            },
            stop: function (event, ui) {
                ui.element.removeClass("border-all");
            }
        });
    };

    /**************************************** Elements plugins ****************************************/


    /**************************************** Dropdown plugin ****************************************/

    var selected = "";
    var callbacks = [];
    var recreate = true;

    $.fn.makeDropdown = function (options) {

        var settings = jQuery.extend({
            callback: true
        }, options);

        var $this = $(this), numberOfOptions = $this.children('option').length, key = $this.attr("title");

        var create = true;
        if ($this.parent().hasClass("select")) {
            selected = $this.val();
            var getClone = $this.clone().removeClass("select-hidden").insertAfter($this.parent());
            $this.parent().remove();
            $("select[title='" + key + "']").makeDropdown();

        }

        $this.addClass('select-hidden');
        $this.wrap('<div class="select ' + key + '"></div>');
        $this.after('<div class="select-styled"></div>');

        var $styledSelect = $this.next('div.select-styled');
        $styledSelect.text($this.children('option').eq(0).text());

        var blocked = $('<div />', {
            'class': 'disable',
            'style': 'display:none;width: 100%;height: 36px;z-index: 9999;position: absolute;'
        }).insertBefore($styledSelect);


        var $list = $('<ul />', {
            'class': 'select-options'
        }).insertAfter($styledSelect);

        var $input = $('<input />', {
            'type': 'hidden',
            'id': 'select-option-' + key
        }).insertBefore($styledSelect);

        for (var i = 0; i < numberOfOptions; i++) {
            $('<li />', {
                text: $this.children('option').eq(i).text(),
                rel: $this.children('option').eq(i).attr("title"),
                title: $this.children('option').eq(i).val()
            }).appendTo($list);
        }

        var $listItems = $list.children('li');

        $styledSelect.click(function (e) {
            e.stopPropagation();
            $('div.select-styled.active').not(this).each(function () {
                $(this).removeClass('active').next('ul.select-options').hide();
            });
            $(this).toggleClass('active').next('ul.select-options').toggle();
        });


        if (settings.onSelectChange || settings.afterCreate) {
            callbacks[key] = [];
            callbacks[key]['onSelectChange'] = settings.onSelectChange;
            callbacks[key]['afterCreate'] = settings.afterCreate;
        }


        $listItems.click(function (e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).attr("rule", $(this).text()).removeClass('active');
            $("#select-option-" + key).attr({
                "value": $(this).attr('title'),
                "title": $(this).attr('rel'),
                'name': key

            }).change();
            $this.val($(this).attr('title')).change();
            $this.on('change', function () {


                if (settings.callback && callbacks[key] && callbacks[key]['onSelectChange']) {
                    var f = callbacks[key]['onSelectChange'];
                    f.call(this, this.value);
                }


            });

            if ($this.attr("title") === "border_color_style") {
                var $border = $(this).css("border-bottom");

                $styledSelect.css("border", $border);
            } else if ($this.attr("title") === "background_color_style") {
                var $background = $(this).css("background");
                $styledSelect.css("background", $background);
            }
            $list.hide();
        });

        $(document).click(function () {
            $styledSelect.removeClass('active');
            $list.hide();
        });

        if (selected !== 'undefined' && selected !== '') {
            $("." + key + " ul").find("li[title='" + selected.toLowerCase() + "']").click();
        } else {
            $("." + key + " ul").find("li").eq(0).click();
        }

        if (settings.callback && callbacks[key] && callbacks[key]['afterCreate']) {
            var f = callbacks[key]['afterCreate'];
            f.call(this, this.value);
        }

        /*
                if ($.isFunction(settings.afterCreate)) {
                    settings.afterCreate();
                }
        */

    };


    $.fn.makeSimpleDropdown = function (options) {

        var settings = jQuery.extend({
            callback: true
        }, options);

        var $this = $(this), numberOfOptions = $this.children('option').length, key = $this.attr("title");

        var create = true;

        if (settings.onSelectChange || settings.afterCreate) {
            callbacks[key] = [];
            callbacks[key]['onSelectChange'] = settings.onSelectChange;
            callbacks[key]['afterCreate'] = settings.afterCreate;
        }

        $this.on('change', function () {
            if (settings.callback && callbacks[key] && callbacks[key]['onSelectChange']) {
                var f = callbacks[key]['onSelectChange'];
                f.call(this, this.value);
            }
        });


    };


    var clipboard = "";
    var Copytarget, pasteTarget;


    $(".item-tools").find("a").on("click", function () {
        var process = $(this).attr("process");
        var options;

        var $this = clicked,
            settings = {
                font_family: $this.css("font-family"),
                font_size: $this.css("font-size"),
                font_color: $this.css("color"),
                font_style: $this.css("font-style"),
                font_weight: $this.css("font-weight"),
                font_decoration: $this.css("text-decoration"),
                text_transform: $this.css("text-transform"),
                line_height: $this.css("line-height"),
                text_align: $this.css("text-align"),
                text_indent: $this.css("text-indent"),
                background: $this.css("background"),
                border_bottom: $this.css("border-bottom"),
                border_top: $this.css("border-top"),
                border_left: $this.css("border-left"),
                border_right: $this.css("border-right"),
                border_radius: $this.css("border-radius"),
                padding_top: $this.css("padding-top"),
                padding_right: $this.css("padding-right"),
                padding_bottom: $this.css("padding-bottom"),
                padding_left: $this.css("padding-left"),
                margin_top: $this.css("margin-top"),
                margin_right: $this.css("margin-right"),
                margin_bottom: $this.css("margin-bottom"),
                margin_left: $this.css("margin-left"),
                float: $this.css("float")
            };
        if (process === "copy") {
            Copytarget = $(this).parents().attr("data-target");

            switch (Copytarget) {
                case "text":
                    clipboard = {
                        "font-family": settings.font_family,
                        "font-size": settings.font_size,
                        "color": settings.font_color,
                        "font-style": settings.font_style,
                        "font-weight": settings.font_weight,
                        "font-decoration": settings.font_decoration,
                        "text-transform": settings.text_transform,
                        "line-height": settings.line_height,
                        "text-align": settings.text_align,
                        "text-indent": settings.text_indent
                    };
                    break;
                case "styling":
                    clipboard = {
                        "background": settings.background,
                        "border-bottom": settings.border_bottom,
                        "border-top": settings.border_top,
                        "border-left": settings.border_left,
                        "border-right": settings.border_right,
                        "border-radius": settings.border_radius
                    };
                    break;
                case "background":
                    clipboard = {
                        "background": settings.background,
                    };
                    break;
                case "border":
                    clipboard = {
                        "border-bottom": settings.border_bottom,
                        "border-top": settings.border_top,
                        "border-left": settings.border_left,
                        "border-right": settings.border_right,
                        "border-radius": settings.border_radius
                    };
                    break;
                case "dimensions":
                    clipboard = {
                        "padding-bottom": settings.padding_bottom,
                        "padding-top": settings.padding_top,
                        "padding-left": settings.padding_left,
                        "border-right": settings.padding_right,
                        "margin-bottom": settings.margin_bottom,
                        "margin-top": settings.margin_top,
                        "margin-left": settings.margin_left,
                        "margin-right": settings.margin_right,
                    };
                    break;
                case "properties":

                    break;
            }
        } else {
            pasteTarget = $(this).parents().attr("data-target");

            if (clipboard !== "") {
                if (pasteTarget === Copytarget) {
                    $.each(clipboard, function (key, value) {
                        clicked.css(key, value);
                    });
                    clicked.attr(builder_mode + "-style", clicked.attr("style"));
                } else {
                    notification("", "Clipboard is in the same section");
                }


            } else {
                notification("", "Clipboard is empty");
            }

            clicked.restoreValues();

        }


    })

})(jQuery);


// Main Form Settings






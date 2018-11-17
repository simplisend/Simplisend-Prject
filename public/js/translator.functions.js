$(function () {
    var isSyncingLeftScroll = false;
    var isSyncingRightScroll = false;
    var leftDiv = document.getElementById('to-list');
    var rightDiv = document.getElementById('from-list');

    leftDiv.onscroll = function () {
        if (!isSyncingLeftScroll) {
            isSyncingRightScroll = true;
            rightDiv.scrollTop = this.scrollTop;
        }
        isSyncingLeftScroll = false;
    };

    rightDiv.onscroll = function () {
        if (!isSyncingRightScroll) {
            isSyncingLeftScroll = true;
            leftDiv.scrollTop = this.scrollTop;
        }
        isSyncingRightScroll = false;
    };


    $(".language-switcher select").val('english').change();
    makeSameSize();
    $(".language-switcher select").on("change", function () {
        var $value = this.value.toLowerCase();
        var $list = $(this).parent().next();

        $list.find("li").each(function () {
            var $getJson = JSON.parse($(this).attr("data-html"))[$value];
            $(this).find("span").html($getJson);
        });
        makeSameSize();

    });
    $("#second-filter").on("change", function () {
        var $value = this.value.toLowerCase();

        $(".words-list").find("li[title='" + $value + "']").show();
        $(".words-list").find("li[title!='" + $value + "']").hide();

        makeSameSize();
    });


    var $allow = false;

    $("body").click(function (e) {



        if ($(e.target).parents("#to-list").length === 0) {
            if($(".appended").length > 0){
                var $getthisOne = $(".appended").eq(0),
                    $getLastElement = $getthisOne.find("textarea"),
                    $getLastText = $getLastElement.val();

                $getthisOne.find("span").html($getLastText).show();
                $getthisOne.removeClass("appended");
                $getLastElement.remove();
                makeSameSize();
            }


        }
    });
    $("#to-list").find("li").on("click", function (e) {
        if ($(e.target).tagName() !== "TEXTAREA") {

            if($(".appended").length > 0){
                var $getthisOne = $(".appended").eq(0),
                    $getLastElement = $getthisOne.find("textarea"),
                    $getLastText = $getLastElement.val();

                $getthisOne.find("span").html($getLastText).show();
                $getthisOne.removeClass("appended");
                $getLastElement.remove();
            }

            var $getThis = $(this),
                $getText = $getThis.text(),
                $getJson = JSON.parse($getThis.attr("data-html")),
                $getId = $getJson["id"],
                $getThisHeight = $getThis.outerHeight(),
                $getrowsnumber = Math.round($getThisHeight / 18);
            $getThis.addClass("appended");

            var makeTextarea = $("<textarea title='" + $getId + "' />")
                .css("height", $getThisHeight+"px").val($getText).on("change", function () {
                    var $getLang = $("#to-dropdown").val();

                    onChange($getThis,$(this).attr("title"),$getLang,this.value);

                }).on('autosize:resized', function () {
                    makeSameSize();
                });
            $getThis.append(makeTextarea);
            $getThis.find("span").hide();
            autosize(document.querySelectorAll('textarea'));
            makeSameSize();
        }else{
            $allow = true;
        }
    })

})

function onChange($element,id, lang, value) {
    console.log(value);
    var $url = $("#to-list").attr("data-html")+"/"+id+"/"+lang.toLowerCase()+"/"+value;

    $.get($url, function(data, status){
        $("li[primary-id='"+$element.attr("primary-id")+"']").attr("data-html",data.substring(1, data.length-1));
    });
}

function makeSameSize() {
    var $fromList = $("#from-list"),
        $toList = $("#to-list");

    $fromList.find("li").css("height","auto");
    $toList.find("li").css("height","auto");
    $fromList.find("li").each(function (index) {

        var $getThis = $("#from-list").find("li").eq(index);
        var $getSecond = $("#to-list").find("li").eq(index);

        $getThis.css("height", "auto");
        $getSecond.css("height", "auto");

        var $getThisHeight = parseInt($getThis.outerHeight());
        var $getSecondHeight = parseInt($getSecond.outerHeight());

        if ($getThisHeight > $getSecondHeight) {
            $getThis.css("height", $getThisHeight + "px");
            $getSecond.css("height", $getThisHeight + "px");
        } else {
            $getThis.css("height", $getSecondHeight + "px");
            $getSecond.css("height", $getSecondHeight + "px");
        }

        console.log($getThisHeight);
    })
}

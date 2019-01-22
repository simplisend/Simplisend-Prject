$("#print-mode").ready(function () {

    $("#print-mode").find(".a4-page").each(function (index) {
        var $this = $(this);
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


        var node = document.getElementById(this.id);

        var getthissize = $this.attr("page-size").split(" x ");
        var options = {
            width:parseInt(getthissize[0]),
            height:parseInt(getthissize[1])
        }

        domtoimage.toPng(node,{ quality: 1,width:options.width,height:options.height })
            .then(function (dataUrl) {
                var img = new Image();
                img.src = dataUrl;
                $this.attr("style","");
                $this.css({
                    padding:0,
                    margin:0,
                });
                $this.html(img);
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });

    })
})
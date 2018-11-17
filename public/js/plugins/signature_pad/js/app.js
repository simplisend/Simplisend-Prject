// var wrapper = document.getElementsByClassName("signature-pad");
// alert(wrapper.length);
// wrapper = wrapper[0];


function SignatureOn(id,main_id) {
//signature-embed-1/builder-mode-row-index-c-column-index-a-signature-b
    var signatureEl = document.getElementById(id);

    var canvas = signatureEl.querySelector("canvas");

    // alert(signatureEl.getAttribute("id"));

    var signaturePad = new SignaturePad(canvas, {
        // It's Necessary to use an opaque color when saving image as JPEG;
        // this option can be omitted if only saving as PNG or SVG
        backgroundColor: 'rgb(255, 255, 255)'
    });

    signatureEl.querySelector("[data-html='clear']").addEventListener("click", function (event) {
        signaturePad.clear();
    });
    signatureEl.querySelector("[title='writeit']").addEventListener("click", function (event) {
        signaturePad.clear();
    });
    signatureEl.querySelector("[title='image']").addEventListener("click", function (event) {
        signaturePad.clear();
    });
    signatureEl.querySelector("[data-action='save-sign']").addEventListener("click", function (event) {

        var main = $("#"+id);
        if (signaturePad.isEmpty() && main.find("input[type='text']").val() === "" && main.find("input[type='file']").val() === "") {
            alert("Please"," provide a signature first.","danger");
        } else {
            if(!signaturePad.isEmpty()){
                var dataURL = signaturePad.toDataURL('image/svg+xml');

                main_id.find(".sign-hint").hide();

                main_id.find(".written-signatrue").hide();
                main_id.find(".sign-start").find("img").attr('src', dataURL).show();

            }else if(main.find("input[type='text']").val() !== ""){
                main_id.find(".sign-hint").hide();
                main_id.find(".written-signatrue").show();
                main_id.find(".written-signatrue h2").text(main.find("input[type='text']").val()).show();
                main_id.find(".sign-start").find("img").hide();

            }else if(main.find("input[type='file']").val() !== ""){
                main_id.find(".sign-hint").hide();
                main_id.find(".written-signatrue").hide();

                var newimg = main.find(".signature-image").find("img");
                var img_el = $(".sign-start").find(".image-drew-signatrue");
                img_el.attr("src",newimg.attr("src")).show();
            }
            main.parent().fadeOut();
        }
    });


    /*
        signatureEl.querySelector("[data-action=change-color]").click(function (event) {
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            var color = "rgb(" + r + "," + g + "," + b + ")";

            signaturePad.penColor = color;
        });
        signatureEl.querySelector("[data-action=undo]").click(function (event) {
            var data = signaturePad.toData();

            if (data) {
                data.pop(); // remove the last dot or line
                signaturePad.fromData(data);
            }
        });
        signatureEl.querySelector("[data-action=save-png]").click(function (event) {
            if (signaturePad.isEmpty()) {
                alert("Please provide a signature first.");
            } else {
                var dataURL = signaturePad.toDataURL();
                download(dataURL, "signature.png");
            }
        });
        signatureEl.querySelector("[data-action=save-jpg]").click(function (event) {
            if (signaturePad.isEmpty()) {
                alert("Please provide a signature first.");
            } else {
                var dataURL = signaturePad.toDataURL("image/jpeg");
                download(dataURL, "signature.jpg");
            }
        });
        signatureEl.querySelector("[data-action=save-svg]").click(function (event) {
            if (signaturePad.isEmpty()) {
                alert("Please provide a signature first.");
            } else {
                var dataURL = signaturePad.toDataURL('image/svg+xml');
                download(dataURL, "signature.svg");
            }
        });
    */

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
    function resizeCanvas() {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        var ratio = Math.max(window.devicePixelRatio || 1, 1);

        // This part causes the canvas to be cleared
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);

        // This library does not listen for canvas changes, so after the canvas is automatically
        // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
        // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
        // that the state of this library is consistent with visual state of the canvas, you
        // have to clear it manually.
        signaturePad.clear();
    }

// On mobile devices it might make more sense to listen to orientation change,
// rather than window resize events.
    window.onresize = resizeCanvas;
    resizeCanvas();

    function download(dataURL, filename) {
        var blob = dataURLToBlob(dataURL);
        var url = window.URL.createObjectURL(blob);

        var a = document.createElement("a");
        a.style = "display: none";
        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
    }

// One could simply use Canvas#toBlob method instead, but it's just to show
// that it can be done using result of SignaturePad#toDataURL.
    function dataURLToBlob(dataURL) {
        // Code taken from https://github.com/ebidel/filer.js
        var parts = dataURL.split(';base64,');
        var contentType = parts[0].split(":")[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
    }





}

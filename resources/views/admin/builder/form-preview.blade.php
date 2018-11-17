<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">

    <title>{{ $request->form_name  }}</title>

    <meta name="url" content="{{ route('route') }}">

    <link href="/js/plugins/jquery-ui/jquery-ui.css/" rel="stylesheet">
    <link href="/css/onform.css" rel="stylesheet">
    <link href="/js/plugins/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/js/plugins/bootstrap_2/dist/css/bootstrap-grid.css" rel="stylesheet">
    <link href="/vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href="/css/fonts.css" rel="stylesheet">
    <link href="/js/plugins/signature_pad/css/signature-pad.css" rel="stylesheet">

    <style>
        .a4-page {
            box-shadow: 0 0px 2px rgb(193, 193, 190);
        }


    </style>

    <style id="print-style" media="print">

/*
        @page[size="A0"][layout="portrait"] {width: 9933px;height: 14043px;}
        @page[size="A0"][layout="landscape"] {width: 14043px;height: 9933px;}
        @page[size="A1"][layout="portrait"] {width: 7016px;height: 9933px;}
        @page[size="A1"][layout="landscape"] {width: 9933px;height: 7016px;}
        @page[size="A2"][layout="portrait"] {width: 4961px;height: 7016px;}
        @page[size="A2"][layout="landscape"] {width: 7016px;height: 4961px;}
        @page[size="A3"][layout="portrait"] {width: 3508px;height: 4961px;}
        @page[size="A3"][layout="landscape"] {width: 4961px;height: 3508px;}
        @page[size="A4"][layout="portrait"] {width: 2480px;height: 3508px;}
        @page[size="A4"][layout="landscape"] {width: 3508px;height: 2480px;}
        @page[size="A5"][layout="portrait"] {width: 1748px;height: 2480px;}
        @page[size="A5"][layout="landscape"] {width: 2480px;height: 1748px;}
        @page[size="A6"][layout="portrait"] {width: 1240px;height: 1748px;}
        @page[size="A6"][layout="landscape"] {width: 1748px;height: 1240px;}
        @page[size="A7"][layout="portrait"] {width: 874px;height: 1240px;}
        @page[size="A7"][layout="landscape"] {width: 1240px;height: 874px;}
        @page[size="A8"][layout="portrait"] {width: 614px;height: 874px;}
        @page[size="A8"][layout="landscape"] {width: 874px;height: 614px;}
        @page[size="A9"][layout="portrait"] {width: 437px;height: 614px;}
        @page[size="A9"][layout="landscape"] {width: 614px;height: 437px;}
        @page[size="A10"][layout="portrait"] {width: 307px;height: 437px;}
        @page[size="A10"][layout="landscape"] {width: 437px;height: 307px;}
*/
    </style>

</head>
<body style="overflow-x: hidden">
<div class="form-title">
    <h1>{{ $request->form_name  }}</h1>
</div>
<div id="btn-preview">
    <div class="toggle-div">
        <ul class="btns-list">
            <li>
                <button type="submit" id="submit" onclick="$('#submit-form').click()">Submit</button>
            </li>
            <li>
                {{--<button type="button" id="print">Print</button>--}}
                <button type="button" id="print">Print</button>
                <button type="button" data-toggle="modal" data-target=".print-screen" style="display: none">Print</button>

            </li>
        </ul>
    </div>
    <div class="visible-div">
        <div class="line-sh"></div>
        <div class="line-sh"></div>
    </div>
</div>

<form method="post" style="    width: 800px;
    box-shadow: 0 0px 0px rgb(193, 193, 190);
    margin: auto;" id="application-form">

    <page size="A4"></page>
    <page size="A4"></page>
    <page size="A4" layout="landscape"></page>
    <page size="A5"></page>
    <page size="A5" layout="landscape"></page>
    <page size="A3"></page>
    <page size="A3" layout="landscape"></page>


    @if(substr($request->html,0,5) == "html_")
        @if($request->cache == "1")
			<?php
			$folder = "cache";
			?>
        @else
			<?php
			$folder = "forms/html/" . $request->id;
			?>
        @endif

		<?php
		if ( file_exists( storage_path() . "/users/" . Auth::user()['username'] . '/' . $folder . '/' . $request->html . ".html" ) ) {
			echo html_entity_decode( File::get( storage_path() . "/users/" . Auth::user()['username'] . '/' . $folder . '/' . $request->html . ".html" ) );
		}
		?>
    @else
		<?php
		echo html_entity_decode( $request->html );
		?>
    @endif
    <input type="submit" id="submit-form" style="display: none">
</form>
<!-- The Modal -->
<div class="modal fade" id="myModal">
    <div class="modal-dialog modal-sm" style="width: 400px">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="display: none"><span
                    aria-hidden="true">×</span>
        </button>
        <div class="modal-content" style="background: transparent">
            @if(substr($request->popup_html,0,6) == "popup_")
                @if($request->cache == "1")
					<?php
					$folder = "cache";
					?>
                @else
					<?php
					$folder = "forms/html/" . $request->id;
					?>
                @endif

				<?php
				if ( file_exists( storage_path() . "/users/" . Auth::user()['username'] . '/' . $folder . '/' . $request->popup_html . ".html" ) ) {
					echo html_entity_decode( File::get( storage_path() . "/users/" . Auth::user()['username'] . '/' . $folder . '/' . $request->popup_html . ".html" ) );
				}
				?>
            @else
				<?php
				echo html_entity_decode( $request->popup_html );
				?>
            @endif


        </div>
    </div>
</div>


<div class="modal fade print-screen" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" style="width: min-content;">
        <div class="modal-content">
           <div id="print-here"></div>
        </div>
    </div>
</div>



<script src="/js/aio/ng/angular.min.js"></script>
<script src="/js/aio/ng/conditions.js"></script>
<script src="/js/plugins/jquery/dist/jquery.min.js"></script>
<script>
    var $settings = {
        form_id: '{{ $request->id }}',
        main_language: '{{ $request->main_language }}',
        settings: function () {
            var $SON = ("<?php echo $request->settings ?>").split("'").join('"');

            try {
                $SON = JSON.parse($SON);
            } catch (e) {
                $SON = JSON.parse("[]");
            }


            if (!$SON.hasOwnProperty("mainLanguage")) {
                return {
                    mainLanguage: "",
                    mainSize: "",
                };
            } else {
                return JSON.stringify($SON);
            }
        }(),
        additional_languages: "{{ rtrim(str_replace(",,",",",$request->languages),",") }}",
        form_name: '{{ $request->form_name }}',
        cache: '{{ $request->cache }}',
        scripts: '{{ $request->scripts }}',
        file_name: '{{ $request->html }}',
        relates_forms: '{{ $request->related_forms }}',
    }

</script>
<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="/js/plugins/signature_pad/js/signature_pad.umd.js"></script>
<script src="/js/plugins/signature_pad/js/app.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/numeral.js/1.4.5/numeral.min.js"></script>

{{--<script src="/js/plugins/validator/form-validator/jquery.form-validator.min.js"></script>--}}
<script src="/js/vendors/pdfmake/build/pdfmake.js"></script>
<script src="/js/html2canvas.js"></script>

<script src="/js/jquery.form.js"></script>
<script>
    _conditions = JSON.parse('<?php echo $request->scripts; ?>');
</script>
</body>
</html>
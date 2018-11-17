<div class="col-lg-6 form-builder" id="form-side" style="z-index: 1039;padding: 0;height: 630px;">
    <div class="page-header">
        <div class="header-links col-lg-2 form-builder">
            <ul style="text-align: left">
                <li data-toggle="tooltip" data-placement="top" data-html="select-mode" title="New" rel="new" id="new-form"><a href="#">
                        <i class="icons icons-new">
                        </i>
                    </a>
                </li>
                <li id="open-form" data-toggle="modal" data-target=".open-form"><a href="#">
                        <i class="icons icons-open" data-toggle="tooltip" data-placement="top" data-html="select-mode" title="Open" rel="open">
                        </i>
                    </a>
                </li>
                @if($build_id != "0")
                    <li id="save-form" onclick="updateForm('{{$get_build->cat_id}}')"><a href="#">
                            <i class="icons icons-save" data-toggle="tooltip" data-placement="top" data-html="select-mode" title="Save" rel="save" >
                            </i>
                        </a>
                    </li>
                @else
                    <li id="save-form" data-toggle="modal" data-target=".categories"
                        onclick="$('#html_save').find('input[name=\'key\']').val('save')"><a href="#">
                            <i class="icons icons-save" data-toggle="tooltip" data-placement="top" data-html="select-mode" title="Save" rel="save">
                            </i>
                        </a>
                    </li>

                @endif
                <li id="saveas-form" data-toggle="modal" data-target=".categories"
                    onclick="$('#html_save').find('input[name=\'key\']').val('new')"><a href="#">
                        <i class="icons icons-saveas" data-toggle="tooltip" data-placement="top" data-html="select-mode" title="Save As" rel="saveas">
                        </i>
                    </a>
                </li>
            </ul>
        </div>
        <div class="col-lg-8 form-builder">
            <div class="form-name" id="form-main-name">
                @if($get_build != "")

					<?php
					if ( $get_build->form_name != null ) {
						echo "<h2>" . $get_build->form_name . "</h2>";
					} else {
						echo "<h2>form-name</h2>";
					}
					?>
                @endif

            </div>
        </div>
        <div class="header-links col-lg-2 form-builder">
            <ul>
                <li><a href="#" onclick="window.history.forward()">
                        <i class="icons icons-redo">
                        </i>
                    </a>
                </li>
                <li><a href="#" onclick="window.history.back()">
                        <i class="icons icons-undo">
                        </i>
                    </a>
                </li>
            </ul>
        </div>
    </div>

    <div id="right-btns" class="col-lg-1 form-builder left-bar-btn toTop">
        <ul id="left-buttons">
            <li>
                <button type="button" title="builder-mode" class="btn btn-primary clicked-btn">Builder</button>
            </li>
            <li>
                <button type="button" title="popup-builder-mode" class="btn btn-primary popup-btn">Pop-Up</button>
            </li>
            <li>
                <button type="button" title="print-mode" class="btn btn-primary print-mode">Print Mode</button>
            </li>
            <li>
                <button type="button" title="preview-modes" id="preview" class="btn btn-primary preview-modes">Preview
                </button>
            </li>
        </ul>
    </div>

    <form id="builder-mode" class="container form-builder modes" style="width: 100% !important">
        <div class='builder-paper target-paper'>


            @if($get_build != "")

				<?php
				if ( $get_build->cache == "1" ) {
					$folder = "cache";
				} else {
					$folder = "forms/html/" . $get_build->id;
				}



				if ( file_exists( storage_path() . "/users/" . Auth::user()['username'] . '/' . $folder . '/' . $get_build->html . ".html" ) ) {
					echo html_entity_decode( File::get( storage_path() . "/users/" . Auth::user()['username'] . '/' . $folder . '/' . $get_build->html . ".html" ) );
				}

				?>
            @endif
        </div>
    </form>
    <form id="print-mode" class="col-lg-12 form-builder modes" style="display: none">
        <div class="a4-page target-paper" style="visibility: hidden;">

        </div>
        <div class="draft-paper target-paper" style="visibility: hidden;">

        </div>

    </form>
    <form id="popup-builder-mode" class="col-lg-12 form-builder modes" style="display: none">
        <div id="popups-page" class="popups-page">


            @if($get_build != "")
				<?php
				if ( $get_build->cache == "1" ) {
					$folder = "cache";
				} else {
					$folder = "forms/html/" . $get_build->id;
				}

				if ( file_exists( storage_path() . "/users/" . Auth::user()['username'] . '/' . $folder . '/' . $get_build->html . ".html" ) ) {
					echo html_entity_decode( File::get( storage_path() . "/users/" . Auth::user()['username'] . '/' . $folder . '/' . $get_build->popup_html . ".html" ) );
				}
				?>

            @endif

        </div>
    </form>
    <div id="preview-modes" class="col-lg-12 form-builder modes" style="display: none;background-color: #436682;height: 100vh">
        <center>
            <ul class="rotate-options">
                <li>
                    <span onclick="$('#preview_sizes').val(0);$('#device-frame').css('width','40%')">
                        <svg xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" id="preview-mobile.9788dae7"
                             width="100%" height="100%">
                            <g transform="translate(9.000000, 5.000000)">
                                <path d="M7.10526316,19.2105263 C7.71568314,19.2105263 8.21052632,18.7156831 8.21052632,18.1052632 C8.21052632,17.4948432 7.71568314,17 7.10526316,17 C6.49484317,17 6,17.4948432 6,18.1052632 C6,18.7156831 6.49484317,19.2105263 7.10526316,19.2105263 Z M2,1.5 C1.72385763,1.5 1.5,1.72385763 1.5,2 L1.5,20 C1.5,20.2761424 1.72385763,20.5 2,20.5 L11.8947368,20.5 C12.1708792,20.5 12.3947368,20.2761424 12.3947368,20 L12.3947368,2 C12.3947368,1.72385763 12.1708792,1.5 11.8947368,1.5 L2,1.5 Z M2,0 L11.8947368,0 C12.9993063,-2.02906125e-16 13.8947368,0.8954305 13.8947368,2 L13.8947368,20 C13.8947368,21.1045695 12.9993063,22 11.8947368,22 L2,22 C0.8954305,22 2.09738034e-15,21.1045695 0,20 L0,2 C-1.3527075e-16,0.8954305 0.8954305,2.02906125e-16 2,0 Z M5.55263158,3 L8.86842105,3 L8.86842105,3 C9.17363105,3 9.42105263,3.24742159 9.42105263,3.55263158 L9.42105263,3.55263158 L9.42105263,3.55263158 C9.42105263,3.85784157 9.17363105,4.10526316 8.86842105,4.10526316 L5.55263158,4.10526316 L5.55263158,4.10526316 C5.24742159,4.10526316 5,3.85784157 5,3.55263158 L5,3.55263158 L5,3.55263158 C5,3.24742159 5.24742159,3 5.55263158,3 Z">
</path>
                            </g>
                        </svg>
                    </span>
                </li>
                <li style="width: 140px;height: 29px;">
                    <div class="slider-count">
                        <input type="range" id="preview_sizes" class="change" value="3" min="0" max="6">
                    </div>

                </li>
                <li>
                    <span onclick="$('#preview_sizes').val(6);$('#device-frame').css('width','100%')">
                       <svg xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" id="preview-desktop.992cfc81"
                            width="100%" height="100%"> <!-- Generator: Sketch 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
                           <g id="preview-desktop.992cfc81_Page-1" stroke="none" stroke-width="1" fill="none"
                              fill-rule="evenodd">
                               <g id="preview-desktop.992cfc81_Desktop" fill="#FFFFFF">
                                   <g transform="translate(2.000000, 6.000000)">
                                       <rect id="preview-desktop.992cfc81_Rectangle-8" x="8" y="19" width="13"
                                             height="1" rx="0.5">
</rect>
                                       <rect id="preview-desktop.992cfc81_Rectangle-7" x="11" y="17" width="7"
                                             height="3">

                                       </rect>
                                       <rect id="preview-desktop.992cfc81_Rectangle-6" x="1" y="14" width="26"
                                             height="2">
</rect>
                                       <path
                                               d="M1.6969697,1.21428571 C1.46266708,1.21428571 1.27272727,1.39550379 1.27272727,1.61904762 L1.27272727,15.3809524 C1.27272727,15.6044962 1.46266708,15.7857143 1.6969697,15.7857143 L26.3030303,15.7857143 C26.5373329,15.7857143 26.7272727,15.6044962 26.7272727,15.3809524 L26.7272727,1.61904762 C26.7272727,1.39550379 26.5373329,1.21428571 26.3030303,1.21428571 L1.6969697,1.21428571 Z M1.6969697,0 L26.3030303,0 C27.2402408,-1.75263177e-15 28,0.72487231 28,1.61904762 L28,15.3809524 C28,16.2751277 27.2402408,17 26.3030303,17 L1.6969697,17 C0.759759212,17 1.14775182e-16,16.2751277 0,15.3809524 L0,1.61904762 C-1.14775182e-16,0.72487231 0.759759212,1.6425734e-16 1.6969697,0 Z">
                                               </path> </g> </g> </g>
                       </svg>
                    </span>
                </li>
            </ul>
            <section id="device">
                <div class="screen">
                    <iframe id="device-frame"
                            style="width: 70%; height: 100%;">
                    </iframe>
                </div>
            </section>
        </center>

    </div>


    <style type="text/css" id="pabaPvo5Dzzgm18kz4shu80WqLWtswXMrFO29Wbqg">
		<?php
		if ( $get_build != "" ) {
			echo $get_build->style;
		}
		?>
    </style>

</div>

<div class="col-lg-1 form-builder replacable-panel">
    <ul class="tools-list">
        <li data-toggle="tooltip" data-placement="right" data-html="select-mode" title="Select" rel="select" class="tools-list-active"><i
                    class="icons icons-select"></i></li>
        <li data-toggle="tooltip" data-placement="right" data-html="move-mode" title="Move" rel="move"><i class="icons icons-move"></i></li>
        <li data-toggle="tooltip" data-placement="right" data-html="add-mode" title="Divide" rel="plus"><i class="icons icons-plus"></i></li>
        <li data-toggle="tooltip" data-placement="right" data-html="save-mode" title="Save To Library" rel="save"><i
                    class="icons icons-save"></i></li>
        <li data-toggle="tooltip" data-placement="right" data-html="dublicate-mode" title="Dublicate" rel="dublicate"><i
                    class="icons icons-dublicate"></i></li>
        <li data-toggle="tooltip" data-placement="right" data-html="delete-mode" title="Delete" rel="trash"><i class="icons icons-delete"></i>
        </li>

        <li style="visibility: hidden"><br></li>

        <li data-toggle="tooltip" data-placement="right" title="Hidden" rel="form-hidden"><i
                    class="admin-icons icons-hidden"></i></li>
        <li data-toggle="tooltip" data-placement="right" title="Read Only" rel="form-read"><i
                    class="admin-icons icons-read-only"></i></li>
        <li data-toggle="tooltip" data-placement="right" title="Required" rel="form-required"><i
                    class="admin-icons icons-required"></i></li>
        <li data-toggle="tooltip" data-placement="right" title="Unprintable" rel="form-unprintable"><i
                    class="admin-icons icons-unprintable"></i></li>
        <li data-toggle="tooltip" data-placement="right" title="Label" rel="form-label"><i
                    class="admin-icons icons-label"></i></li>
    </ul>
    <ul class="pages-list" style="display:none;">
        <li>
            <div class="page">
            </div>
            1
        </li>
    </ul>
</div>
<div class="col-lg-1form-builder"></div>

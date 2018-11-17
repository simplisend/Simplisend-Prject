<div id="library" data-action="{{ route('getElements',"") }}" class="tools_panel animated form-builder col-lg-12"
     style="display: none">
    {{--<h3>Rows</h3>--}}

    <div class="panel-title">
        <div style="float: left;padding-left: 7px;width: 15%;">
            <span class="close" style="visibility: hidden;"><i class="admin-icons icons-previous" style="color: white"></i></span>
        </div>
        <div style="width: 70%;display: inline-block;">
            <font style="text-align: center">Library</font>
        </div>
        <div style="float: right;padding-left: 0;display: inline-block;width: 15%;margin-top: -6px;color: white;cursor: pointer" data-toggle="modal" data-target=".manage_categories">
            <span><i class="admin-icons icons-settings" style="color: white;font-size: 26px;"></i></span>
        </div>
    </div>

    <div id="library_content">
        <div class="category_items" style="display: none;">


        </div>


        <div class="categories_list">
            @foreach($elements_categories as $cat)
                <div class="panel-item" style="margin-top: 9px;margin-bottom: 9px;" category="{{$cat->id}}" title="element_{{ucfirst($cat->category_name)}}">
                    <div class="item-title">
                        <h3>
                            {{ucfirst($cat->category_name)}}
                        </h3>
                        <div class="item-tools">
                            <span><i class="admin-icons icons-next"></i></span>
                        </div>
                    </div>
                </div>
            @endforeach
                <div class="panel-item" style="margin-top: 9px;margin-bottom: 9px;" category="0" title="element_PopUp">
                    <div class="item-title">
                        <h3>
                            PopUp
                        </h3>
                        <div class="item-tools">
                            <span><i class="admin-icons icons-next"></i></span>
                        </div>
                    </div>
                </div>

        </div>
    </div>

</div>










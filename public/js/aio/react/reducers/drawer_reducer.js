const login_initialState = {
    font_family:"",
    font_size:"",
    bold:false,
    italic:false,
    underline:false,
    throughline:false,
    color:"",
    text_transform:"",
    line_height:"",
    text_align:"",
    text_indent:"",

};

export default function drawer_reducer(state = login_initialState, action) {
    var $return;
    switch (action.type) {
        case 'font_family':
            $return = {
                ...state,
                font_family:action.data.value,
            };
            break;
        case 'font_family':
            $return = {
                ...state,
                font_family:action.data.value,
            };
            break;
        default:
            $return = state;
            break;


    }
    return $return
};

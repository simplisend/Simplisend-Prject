const table_initialState = {
    full_name: 0,
    email: [],
    email_sent: [],
};

export default function personal_reducer(state = table_initialState, action) {
    var $return;
    switch (action.type) {
        case 'submit':
            $return = {
                ...state,
                full_name: action.data.full_name,
                email: action.data.email,
            };
            break;
        case 'sent_email':
            $return = {
                ...state,
                email_sent: true,
            };
            break;
        default:
            $return = state;
            break;
    }
    return $return
};

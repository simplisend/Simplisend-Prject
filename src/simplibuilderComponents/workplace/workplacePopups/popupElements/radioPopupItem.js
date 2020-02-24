import React , { Component } from 'react' ;
import titles from '../../../../configs/title' ;
import translator  from '../../../../funcs/translator';
import { ClickOutsideOptionsList } from '../../../../components/utils' ;
import { connect } from 'react-redux' ;
import { updateData } from '../../../../store/actions/rootActions' ;
import { getRequest } from '../../../../funcs/http'  ;

class radioPopupItem extends Component {


  /* close autoCompleteOptions (this will remove previous data) */
  closeAutoCompleteOptions = () => {
    this.props.updateData('SHOW_AUTO_COMPLETE_OPTIONS_POPUP',false) ;
    this.props.updateData("SET_AUTO_COMPLETE_OPTIONS",null)
    this.props.updateData('SET_ACTIVE_ITEM',{key : 'activeFormDetails',item : null })
  }


  /* get all matching data when user is filling question input */
  getWords = (value) => {
    const { selectedForm,activeElement,index } = this.props ;
    const formLanguage  = selectedForm.default_lang.id ;
    getRequest(`text/form_text_contains?lang=${formLanguage}&text=${value}`,).then(resp => {
      this.props.updateData("SET_AUTO_COMPLETE_OPTIONS",resp.data) ;
      this.props.updateData("SET_ACTIVE_ITEM",
      {key : 'activeAutoCompleteItem',item : {id : `${activeElement.id}_shortText_tag_${index}`,index }})
    })
  }

  handleChange = (e,index,type) => {
    const { handleChange } = this.props ;
    handleChange(e,index,type) ;
    if (e.target.value.length >= 3) {
      this.getWords(e.target.value) ;
    }
  }


  /* when user click on one of auto-complete option */
  handleAutoCompleteOptionClick = (item) => {
    const { activeElement,shortText,index } = this.props;
    const updatedShortText = {...shortText[activeElement.id]} ;
    updatedShortText['answers'][index]['tag'] = item.content ;
    this.props.updateData('UPDATE_SHORTTEXT',{key : activeElement.id , shortText : updatedShortText})
    this.closeAutoCompleteOptions() ;
  }


  render = () => {
    const {
      handleChange,
      index,
      tag,
      language,
      showAutoCompleteOptionsPopup,
      autoCompleteOptions ,activeAutoCompleteItem,activeElement
    } = this.props;

    return (
      <div className="input-type">
        <div className="id-Input">
            <input
              value = { value }
              type = 'text'
              onChange = { (e) => handleChange(e,index,'inputId') }
              placeholder = {translator('shortTextPopupPlaceholder',titles[language])}
            />

        { hasTag &&
          <div className="tag-Input">
            <input
              value = { tag }
              type = 'text'
              onChange = {(e) => this.handleChange(e,index,'tag')}
              placeholder = { translator('tag',titles[language]) }
            />
            <div className = 'shorttext-options-conainer'>
              <ClickOutsideOptionsList
                hide = {this.closeAutoCompleteOptions}
                show = {
                  showAutoCompleteOptionsPopup &&
                  activeAutoCompleteItem &&
                  activeElement &&
                  activeAutoCompleteItem.id === `${activeElement.id}_shortText_tag_${index}`
                }
                options = { autoCompleteOptions ? autoCompleteOptions : [] }
                renderKey = 'content'
                handleClick = {this.handleAutoCompleteOptionClick}
              />
            </div>
          </div>
        }
        
            
        </div>
        <div className="checkbox">
        <input type = 'checkbox' checked = { hasTag } onChange = {() => toggleTagAppearance(index) } />
            <button onClick = {() => this.props.updateAnswers('remove',index)}> - </button>
          </div>


      </div>
    );
  };
}


const mapStateToProps = state => {
  return {
    autoCompleteOptions : state.translation.autoCompleteOptions ,
    showAutoCompleteOptionsPopup : state.translation.showAutoCompleteOptions,
    selectedForm : state.activeItems.selectedForm ,
    activeAutoCompleteItem : state.activeItems.activeAutoCompleteItem ,
    /* which popup is now opened */
    activeElement : state.workplacePopups.activeElement ,
    shortText: state.workplaceElements.shortText,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    updateData : (type,data) => dispatch(updateData(type,data)) ,
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(ShortTextPopupItem);

import React , { Component } from 'react' ;
import Select from 'react-select';
import { PopUp,Translator } from '../../../components/utils' ;
import { connect } from 'react-redux' ;
import { updateData } from '../../../store/actions/rootActions'
import translator from '../../../funcs/translator' ;
import titles from '../../../configs/title' ;
import generateRandromString from '../../../funcs/generateRandromString' ;


class GridPopup extends Component {

  state = {
    options : [
      {id : 'a3' ,value : 'a3',label : 'A3 (420 * 297)mm' } ,
      {id : 'a4' ,value : 'a4',label : 'A4 (297 * 210)mm' } ,
      {id : 'a5' ,value : 'a5',label : 'A5 (210 * 148)mm' } ,
      {id : 'a6' ,value : 'a6',label : 'A6 (148 * 105)mm' } ,
      {id : 'a7' ,value : 'a7',label : 'A7 (105 * 74)mm' } ,
      {id : 'a8' ,value : 'a8',label : 'A8 (74 * 52)mm' } ,
      {id : 'a9' ,value : 'a9',label : 'A9 (52 * 37)mm' } ,
      {id : 'a10' ,value : 'a10',label : 'A10 (37 * 26)mm' } ,
    ],
    isCustomized : false ,// if user wants to set width and height to a value other than the standard ones
    gridWidth : 210  , // default width of grid
    gridHeight : 297 , // default height of grid
    rows : 1 , // default rows number
    cols : 1 , // default columns number
    paddingVertical : 1 , // default vertical padding
    paddingHorizontal : 1 , // default horizontal padding
 }

   componentDidUpdate = (prevProps,prevState) => {
     const { activeElement , grids } = this.props ;
     if (activeElement && !grids[activeElement.id] && activeElement.type === 'grid') {
       this.props.updateData('SET_GRID',activeElement.id) ;
       return
     }
   }


   // when submitting validate the entered data
   validate = () => {

      const { gridWidth , gridHeight, rows,cols } = this.state ;
      if (!rows || !cols) { return false }

      const _rows = Number(rows) ;
      const _cols = Number(cols) ;
      const _gridWidth = Number(gridWidth) ;
      const _gridHeight = Number(gridHeight) ;

      if (_gridWidth <= 0 || _gridHeight <= 0) { return false }
      if (rows > 12 || cols > 12) { return false }
      if (_rows <= 0 || _cols <= 0) { return false }

      return true ;
   }

   // create grid cells
   createGrid = (cols,rows) => {

     const length = rows * cols  ;

     let i = 0 ;
     let col = 0 ;
     let row = 0 ;
     const grid = [] ;
     for ( i ; i < length ; i++) {
       // new row
       if (i % cols === 0) {
         col = 0 ;
         row += 1 ;
       }

       grid.push({
         id : generateRandromString() ,
         colSpan : 1 ,
         rowSpan : 1 ,
         index : i ,
         row ,
         col ,
       })
       col++ ;
     }

     return grid ;
   }

   // when user clicks submit button
   submit = () => {
     const { activeElement } = this.props ;
     const { gridWidth , gridHeight }  = this.state ;
     const isValid = this.validate() ;

     if (!isValid) {
       this.props.updateData("SHOW_ERROR", {key: "showFormNamelessError", value: true });
       return
     }

     const grid = this.createGrid(this.state.rows,this.state.cols) ;
     const gridDetails = {

        data : grid ,
        map : {} ,
        height : Math.ceil(gridHeight) ,
        width : Math.ceil(gridWidth) ,
        paddingVertical : this.state.paddingVertical ,
        paddingHorizontal : this.state.paddingVertical
    }
     this.props.updateData("SET_FORM_DETAILS", {
       key: activeElement.id,
       details: gridDetails ,
       type: "activeDetails"
     });


     this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
     this.props.updateData("SHOW_GRID", false) ;
   }

   // when user selects diminssions from the dimensions menu
   onChooseOption = (choice) => {

    const diminssionsTable = {
      'a3' : {height : 420, width :297 } ,
      'a4' : {height : 297, width : 210 } ,
      'a5' : {height :210 , width :148 } ,
      'a6' : {height : 148, width : 105} ,
      'a7' : {height : 105, width :74 } ,
      'a8' : {height :74 , width :52 } ,
      'a9' : {height : 52, width : 37} ,
      'a10' : {height : 37, width : 26} ,
    }
    const diminssions = diminssionsTable[choice.value] ;
    const pHeight = diminssions.height * 3.7795275591 ;
    const pWidth = diminssions.width * 3.7795275591 ;
    this.setState({gridWidth : pWidth , gridHeight : pHeight}) ;

   }

   // when user is typing a value for rows and cols
   handleChange = (e,key) => {
     if (Number(e.target.value) && (Number(e.target.value) > 0 && Number(e.target.value) < 13)) {
       this.setState({ [key] : e.target.value }) ;
     }
   }


  // when user is typing a value for the customized input
   handleCustomizedChange = (e,key) => {
     this.setState({ [key] : e.target.value } ) ;
     // const { activeElement , grids } = this.props ;
     // const updatedGridItem = { ...grids[activeElement.id] , [key] : e.target.value } ;
     // this.props.updateData('SET_GRID',{key : activeElement.id , item : updatedGridItem})
   }

   // if user wants to set width and height to a value other than the standard ones
   toggleCustome = () => this.setState({isCustomized : !this.state.isCustomized}) ;


   // when user clicks cancel button
   cancel = () => {
     this.props.updateData("SHOW_GRID", false);
     this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
     this.props.updateData("SHOW_ERROR", {key: "showFormNamelessError", value: false });
   }


   // when user us typing a value for padding inupts
   handlePaddingChange = (e,key) => {
     const { value } = e.target ;
     if (value > 0 && value <= 10) {
       this.setState({ [key] : Number(value) }) ;
     }
   }

   render = () => {

    const { show,language,showFormNamelessError } = this.props ;

    return (
      <div className="sb-main-popup-wrapper">

        <PopUp show={show}>


          <div className="popup-header">
            <Translator string="grid" />
          </div>

          <div className="popup-body">
            <div>
              {showFormNamelessError && !this.state.isCustomized &&  <span className = 'error'> * </span>}
              {
                !this.state.isCustomized &&
                <Select
                  options = {this.state.options}
                  placeholder = {translator('chooseDiminssions',titles[language])}
                  onChange = { this.onChooseOption }
                  defaultValue={this.state.options[1]}
                />
              }

              {

                this.state.isCustomized &&
                <div>
                  {showFormNamelessError && <span className = 'error'> * </span>}
                  <label className = 'sb-grid-axis-label'>
                    <p><Translator string = 'width' /></p>
                    <input
                      value = { this.state.gridWidth}
                      type = 'number'
                      onChange = {(e) => this.handleCustomizedChange(e,'gridWidth')}
                    />
                  </label>

                  {showFormNamelessError && <span className = 'error'> * </span>}
                  <label className = 'sb-grid-axis-label'>
                    <p><Translator string = 'height' /></p>
                    <input
                      value = { this.state.gridHeight}
                      type = 'text'
                      onChange = {(e) => this.handleCustomizedChange(e,'gridHeight')}
                    />
                  </label>
                </div>
              }
            </div>

            <div className = 'sb-grid-rows-cols-container'>

              {showFormNamelessError && <span className = 'error'> * </span>}
              <label className = 'sb-grid-axis-label'>
                <p><Translator string = 'columns' /></p>
                <input
                  value = {this.state.cols}
                  type = 'number'
                  onChange = {(e) => this.handleChange(e,'cols')}
                  max = '12'
                  min = '1'
                />
              </label>

              {showFormNamelessError && <span className = 'error'> * </span>}
              <label className = 'sb-grid-axis-label'>
                <p><Translator string = 'rows' /></p>
                <input
                  value = {this.state.rows}
                  type = 'number'
                  onChange = {(e) => this.handleChange(e,'rows')}
                  max = '12'
                  min = '1'
                />
              </label>


              {showFormNamelessError && <span className = 'error'> * </span>}
              <label className = 'sb-grid-axis-label'>
                <p>padding Horizontal</p>
                <input
                  value = {this.state.paddingHorizontal}
                  type = 'number'
                  onChange = {(e) => this.handlePaddingChange(e,'paddingHorizontal')}

                />
              </label>


              {showFormNamelessError && <span className = 'error'> * </span>}
              <label className = 'sb-grid-axis-label'>
                <p>paddingVertical</p>
                <input
                  value = {this.state.paddingVertical}
                  type = 'number'
                  onChange = {(e) => this.handlePaddingChange(e,'paddingVertical')}

                />
              </label>


            </div>
          </div>

          <span>
            <Translator string = 'customize_checkbox' />
            <input type = 'checkbox' checked = {this.state.isCustomized} onChange = {this.toggleCustome} />
          </span>

          <div className="pop-up-bottons-wrapper">

            <button className="pop-up-button" onClick={this.submit}>
              <Translator string="ok" />
            </button>
            <button className="pop-up-button" onClick={this.cancel}>
              <Translator string="cancel" />
            </button>

          </div>

        </PopUp>

      </div>
    )
  }
}


const mapStateToProps = state => {
  return {


    /* whether to show this popup or not */
    show: state.workplacePopups.grid,

    /* which popup is now opened */
    activeElement: state.workplacePopups.activeElement,
    grids : state.workplaceElements.grids ,
    activeDetails : state.formDetails.activeDetails ,
    language : state.lang.lang,
    showFormNamelessError : state.messages.showFormNamelessError ,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};



export default connect(mapStateToProps,mapDispatchToProps)(GridPopup) ;

import React , { Component } from 'react' ;
import { connect } from 'react-redux' ;
import { updateData } from '../../../store/actions/rootActions' ;
import generateRandromString from '../../../funcs/generateRandromString' ;
import GridItem from './gridItem' ;


class Grid extends Component {

  state = {
    isCombinedButtonDisabled : false,// whether the combine button is disabled or not
    containerWidth : null, // componentDipMount will set the value of gridContainer
    data : [], // grid items
    gridSelected : [] // selected grid items
  }

  componentDidMount = () => {
    const { activeDetails,id } = this.props ;
    this.setState({containerWidth : this.container.clientWidth,data : [...activeDetails[id]['data']] })
  }

  /*
    pass this method to gridItem in order to updated its content
  */
  updateCell = (index,value) => {
    const { activeDetails , id } = this.props ;
    const updatedGrid = { ...activeDetails[id] }
    updatedGrid['data'][index] = { ...updatedGrid['data'][index] , value }
    this.props.updateData('SET_FORM_DETAILS',{key : id , details : updatedGrid,type : 'activeDetails'})
  }


  /*
    use this method in mergeSort
    (merge sort algorithm )
  */
  merge = (arr1,arr2,key) => {
    let [result,i,j] = [[],0,0] ;
    while(i < arr1.length && j < arr2.length) {
      if (arr1[i][key] < arr2[j][key]) {
        result.push(arr1[i])
        i++ ;
      } else {
        result.push(arr2[j]) ;
        j++
      }
    }
    return [...result , ...arr1.slice(i),...arr2.slice(j)]
  }

  /* sort a given array by the key provided */
  mergeSort = (array,key) => {
    const len = array.length ;
    if (len === 1) {
      return array
    }
    const middle = Math.floor(len / 2) ;
    const left = this.mergeSort(array.slice(0,middle),key) ;
    const right = this.mergeSort(array.slice(middle),key) ;
    return this.merge(left, right,key) ;
  }

  /*
    reset all selected cells
    this method will preserve all values and diminssions for all cells
    it will affect only the is selected property
  */
  emptyGrid = (data) => {
    const updatedData = data.map((item,index) => {
      return {...item ,isSelected : false }
    })
    return updatedData ;
  }

  findElementIndex = (item,sequence) => {
      let i = 0 ;
      while (i < sequence.length) {
        const obj = sequence[i] ;
        if (item.id === obj.id) {
          break
        }
      i++
      }
      return i ;
  }


  /* when user selects a cell */
  selectCell = (item,index) => {

    const { data ,gridSelected } = this.state ;

    const updatedItem = { ...item , isSelected : item.isSelected ? false : true } ;
    let updatedGridSelected = [...gridSelected] ;
    const updatedGridData = [...data]
    const gridIndex = this.findElementIndex(item,data) ;
    const selectedIndex = this.findElementIndex(item,gridSelected) ;

    /* if the item was not selected then add it to the selected ones */
    if (updatedItem.isSelected) {
      updatedGridSelected.push(updatedItem) ;
      updatedGridSelected = this.mergeSort(updatedGridSelected,'index') ;
      updatedGridData[gridIndex] = updatedItem ;
      /* otherwise remove it */
    } else {
      updatedGridSelected.splice(selectedIndex,1) ;
      updatedGridData[gridIndex] = updatedItem ;
    }
    this.setState({data : updatedGridData , gridSelected : updatedGridSelected }) ;

  }


  /* clear selected cells */
  clear = (e) => {
    e.preventDefault() ;
    const { data } = this.state ;
    const updatedData = this.emptyGrid(data) ;
    this.setState({ data : updatedData , gridSelected : [] })
  }


  /*
    when validation if an element consists of multiple elements
    then spread them all in one sequence
  */
  buildSequance = () => {
    const { activeDetails ,id } = this.props ;
    const { gridSelected } = this.state ;
    const grid = activeDetails[id] ;
    let block = [] ;
    let i = 0 ;

    for ( i ; i < gridSelected.length ; i++  ) {
      const item = gridSelected[i] ;
      if (item.colSpan > 1 || item.rowSpan > 1) {
        block = [...block , ...grid['map'][item.id] ]
      } else {
        block.push(item) ;
      }
    }

    return block ;
  }


  componentDidUpdate = (prevProps,prevState) => {
    const { gridSelected } = this.state  ;

    if (gridSelected.length !== prevState.gridSelected.length && gridSelected.length > 0){
      const isValid = this.validate() ;
      this.setState({ isCombinedButtonDisabled : !isValid })
    }


  }

  splitCell = (e) => {
    e.preventDefault() ;

    const { activeDetails,id } = this.props ;
    const { data } = this.state ;
    const grid = activeDetails[id]
    const map = {...grid['map']}

    let updatedGridData = [] ;
    data.map(item => {
      if ((item.rowSpan > 1 || item.colSpan > 1) && item.isSelected) {
        updatedGridData = [...updatedGridData , ...map[item.id]] ;
        delete map[item.id] ;

      } else {
        updatedGridData.push(item);
      }
      return null ;
    })

    updatedGridData = updatedGridData.map(item => { return {...item , isSelected : false }} ) ;
    const updatedGrid = { ...activeDetails[id] , data :updatedGridData , map } ;

    this.props.updateData('SET_FORM_DETAILS',
    {
      key : id ,
      details : updatedGrid ,
      type : 'activeDetails'
    });
  }

  validate = () => {

    let block = this.buildSequance() ;
    block = this.mergeSort(block,'index') ;

    let i = 1 ; /* loop index */
    let isValid = true ;
    const g = [ [block[0]] ] ; /* grid of selected items */
    let index = 0 ; /* row index (grid row ) */

    if (block.length === 1) { return true }

    while (i < block.length) {

      const item = block[i] ;

      /* if 2 cells are not consecutives*/
      if (item.row === block[i-1]['row'] + 1) {
        index += 1 ;
        g.push([item]) ;

      } else {
        /* new row */
        g[index].push(item) ;

        if (item.index > block[i-1]['index'] + 1 ){
          isValid = false ;
          return isValid ;
        }
      }
      i++
    }

    if (g.length === 1) {
      return true

    } else {

      let spans = [] ;
      let  j = 0 ;
      for ( j ; j < g.length ; j++) {
        spans.push({start : g[j][0]['col'], span : g[j].length,end : g[j][g[j].length -1]['col']  }) ;
        if (spans.length > 1 ) {

          if (
            /*
              if rows dont start from the same column or dont end at the same column or
              dont have the same spane
            */
            spans[j-1]['col'] !== spans[j]['col'] ||
            spans[j-1]['span'] !== spans[j]['span'] ||
            spans[j-1]['end'] !== spans[j]['end']
          ) {
            return false ;
          }

        }

      }

    }


    return isValid ;
  }

  /*
    if a cell consists of multiple cells then updated it's content
    upon new submits
  */
  buildItemMap = () => {
    const { activeDetails,id } = this.props ;
    const { gridSelected } = this.state ;
    const _map = activeDetails[id]['map'] ;
    let result = [] ;
    gridSelected.map(item => {
      if (_map[item.id]) {
        result = [...result , ..._map[item.id]] ;
      } else {
        result.push(item) ;
      }

      return null ;
    })
    return result
  }

  /* get new colSpan and rowSpan */
  getNewDiminssions = () => {
    const { gridSelected } = this.state ;
    let i = 1 ;
    let rowSpan = gridSelected[0]['rowSpan'] ;
    let colSpan = gridSelected[0]['colSpan'] ;
    for (i ; i < gridSelected.length ; i++) {
      const item = gridSelected[i] ;
      if (item['row'] === gridSelected[0]['row']) { colSpan += item['colSpan'] }
      if (item['row'] !== gridSelected[i-1]['row'] ) { rowSpan += item['rowSpan'] }
    }
    return { colSpan , rowSpan }
  }



  combineCells = (e) => {

    e.preventDefault() ;
    const { gridSelected , data } = this.state ;
    const { activeDetails ,id } = this.props ;
    const { rowSpan,colSpan } = this.getNewDiminssions() ;
    let updatedGridData = data.filter(item => !item.isSelected) ;

    const newId = generateRandromString() ;
    const newItem = {
      id : newId ,
      index : gridSelected[0]['index'] ,
      col : gridSelected[0]['col'] ,
      row : gridSelected[0]['row'] ,
      colSpan ,
      rowSpan,
      value : '' ,
    }

    updatedGridData.splice(gridSelected[0]['index'],0,newItem) ;


    this.props.updateData('SET_FORM_DETAILS',
    {
      key : id ,
       details : {
         ...activeDetails[id] ,
         data : updatedGridData,
         map : { ...activeDetails[id]['map'] , [newId] : this.buildItemMap() }
       },
       type : 'activeDetails'
     })
     this.setState({gridSelected : [] }) ;
  }

  render = () => {

    const { data,gridSelected } = this.state ;
    const { activeDetails,id } = this.props ;

    const grid = activeDetails[id] ;
    const colsNumber = grid['cols'] ;
    const rowsNumber = grid['rows'] ;
    const ratio = grid['height'] / grid['width'] ;
    const containerWidth = 100 - grid['paddingHorizontal'] ;
    const containerHeight = 100 - grid['paddingVertical'] ;

    return (
      <div className = 'fb-grid-wrapper'>
        <div
          className = 'fb-grid-container'
          style = {{width : `${containerWidth}%`,height : `${containerHeight}%`}}
          ref={ (divElement) => this.container = divElement}
        >

        {
           !!gridSelected.length &&
           <div>

             <button
               style = {{background : this.state.isCombinedButtonDisabled ? '#ddd' : '#4287f5' }}
               className = 'fb-grid-combine-btn'
               onClick = {this.combineCells}
               disabled = { this.state.isCombinedButtonDisabled }
             >

             </button>
             <button className = 'fb-grid-clear-btn' onClick = {this.clear}>

             </button>

             <button className = 'fb-grid-split-btn' onClick = {this.splitCell}>

             </button>
           </div>
         }

        <div
          className = 'fb-grid'
          style = {{
            display : 'grid',
            gridTemplateColumns : `repeat(${colsNumber},1fr)`,
            gridTemplateRows : `repeat(${rowsNumber}),1fr)`,
            height : this.state.containerWidth ? Math.floor(this.state.containerWidth * ratio) : 0  ,
            width : this.state.containerWidth ? this.state.containerWidth : 0  ,
          }}
        >

          {
            data &&
            data.map((item ,i) => {
              return (
                <GridItem
                  item = {item}
                  key = {item.id}
                  index = { i }
                  updateCell = { this.updateCell }
                  selectCell = { this.selectCell }
                />
              )
            })
          }
        </div>


        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    activeDetails : state.formDetails.activeDetails ,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateData : (type,data) => dispatch(updateData(type,data)),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Grid) ;

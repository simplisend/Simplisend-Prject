/*
use this function when user wants to show or hide a tree branch
it will updated only the childes of the selected item and leave the rest as is
*/

const ToggleVisibilty = (seq,level,show,i = 0,result = [] ) => {

  if (i >= seq.length ) {

    return { updated : result ,end : i }
  }
  const item = seq[i] ;


  if (item.level <= level) {
    return { updated : result ,end : i }
  }

  if (show) {
    if (item.level === level + 1) {
      result.push({...item,show})
    } else {
      result.push(item)
    }
  } else {
    result.push({...item,show,isOpened : false})
  }


  return ToggleVisibilty(seq, level,show, i+1, result)

}

const findElement = (seq,id,n) => {
  if (n >= seq.length) { return n - 1}
  const item = seq[n] ;
  if (item.id === id) { return n }
  return findElement(seq,id,n+1) ;
}

/* use this function to find the last child index of an item to remove this item and all it's childs */
/* this function will update subfilters and filters */
const removeNodeAndItsChilds = (seq,parent,n,filters,subFilters) => {

  let updatedFilters = { ...filters } ;
  let updatedSubFilters = {...subFilters }

  if ( n >= seq.length) {
    return { index : n -1 ,filters : updatedFilters,subFilters :updatedSubFilters }
  }

  const item = seq[n]
  /* if the current item is filter then remove it from filters */
  if (item.type === 'filter') {
    delete updatedFilters[item.id]
  }

  /* if the current item is sub-filter then remove it from sub-filters */
  if (item.type === 'sub-filter' ) {
    delete updatedSubFilters[item.id]
  }

  if (item.level <= parent.level && item.id !== parent.id) {
    return { index : n -1 ,filters : updatedFilters,subFilters :updatedSubFilters }
  }
  return removeNodeAndItsChilds(seq,parent,n + 1,updatedFilters,updatedSubFilters)

}


/*
  find the index of the last child for a tree item
  use this function when user cuts a tree item
*/
const findLastChildIndex = (seq,parentItem,n) => {

  if ( n >= seq.length ) { return n - 1 }
  const item = seq[n] ;

  if (item.level <= parentItem.level && item.id !== parentItem.id) {
    return n - 1
  }
  return findLastChildIndex(seq,parentItem , n + 1)


}

const initState = {

  cats :  [],
  tags : [] ,
  tree : [] ,
  activeTreeNode : null ,
  filters :  {},
  subFilters : {} ,
  showOptions : false,
  showDeletionMessage: false ,
  copiedItem : null,
  showProcessing : false ,
  formDeletionMessageKey : 'confirmDeletion' ,
  privatePassword : '' ,
  gottenPrivatePasswords : [] ,  
  gottenPrivateTags : [] 

}


const saCatsReducer = (state = initState,action) => {

  let updatedTree,updatedTags,updatedFilters,updatedSubFilters,elementIndex,updatedPart ;

  switch (action.type) {

    case 'ADD_GOTTEN_PRIVATE_PASSWORD' : 
      if (!action.data) {
        return { ...state,gottenPrivatePasswords : [] }
      }
      return { ...state , gottenPrivatePasswords : [...state.gottenPrivatePasswords , action.data ]}

    case 'ADD_GOTTEN_PRIVATE_TAGS' : 
      return { ...state , gottenPrivateTags : [...state.gottenPrivateTags , ...action.data ]}

    case "SET_PRIVATE_PASSWORD" : 
      return {...state, privatePassword : action.data }

    case "SET_FORM_DELETION_MESSAGE_KEY" :
        return { ...state , formDeletionMessageKey : action.data }

    /* when user gets tree items for the first time */
    case 'SET_CATS' :
      return { ...state,cats : action.data }

    /* when user gets tags for the first time */
    case "SET_TAGS" :
      updatedFilters = {...state.filters }
      action.data.map(tagItem => {
        updatedFilters[tagItem['id']] = [] ;
        return null
      })
      return { ...state,tags : [...action.data],filters : updatedFilters }

    /* when user gets filters for the first time */
    case 'SET_FILTERS' :
      /* when user sets filters that belong to a certain tree item */
      if (action.data.key) {
        updatedSubFilters = { ...state.subFilters }
        updatedFilters = { ...state.filters }
        updatedFilters[action.data.key] = action.data.filters;

        action.data.filters.map(filterItem => {
          updatedSubFilters[filterItem['slug']] = [] ;
          return null
        })
        return { ...state,filters : updatedFilters,subFilters : updatedSubFilters }
      }
      /* when user set all filters at once */
      return { ...state , filters :  action.data }


    /* when user gets sub-filters for the first time */
    case 'SET_SUB-FILTERS' :

      updatedSubFilters = { ...state.subFilters }
      if (state['subFilters'][action.data.key]) {
        updatedSubFilters[action.data.key] = [...state.subFilters[action.data.key],...action.data.subFilters ]
      } else {
        updatedSubFilters[action.data.key] = [...action.data.subFilters ]
      }

      return { ...state,subFilters : updatedSubFilters }


    /* change current active tree item (when user clicks on a tree item )*/
    case 'SET_ACTIVE_TREE_NODE' :
      if (action.data) {
        updatedTree = [...state.tree]
        return {...state,tree : updatedTree ,activeTreeNode : action.data}
      }
      return {...state,activeTreeNode : action.data}

    /* when user want to cut tree item */
    case 'SET_COPIED_ITEM' :
      return {...state,copiedItem : action.data}


    /* every time the user adds new tree item */
    case "CREATE_TREE" :
      return { ...state,tree : action.data }


    /* add new category */
    case 'ADD_CAT' :

      updatedTree = [...state.tree , action.data ]
      return { ...state, tree : updatedTree,activeTreeNode : action.data }


    /* add new filter */
    case 'ADD_FILTER' :

      /* add filter to tree */
      updatedTree = [...state.tree , action.data] ;

      /* which tag should this new filter belong to */
      const parentTag = action.data.parent_tag ;

      /* add filter to filters */
      if (state.filters[parentTag]) {
        updatedFilters = { ...state.filters , [parentTag] : [...state.filters[parentTag],action.data ]}
      } else {

        updatedFilters = { [parentTag] : [ action.data ] }
      }


      return { ...state,tree : updatedTree,filters : updatedFilters, activeTreeNode : action.data }


    /* add new tag */
    case 'ADD_TAG' :

      updatedTree = [...state.tree , action.data] ;
      updatedTags = [...state.tags, action.data] ;

      return { ...state,tree : updatedTree,tags : updatedTags,activeTreeNode : action.data }

    /* add new sub-filter*/
    case 'ADD_SUB-FILTER' :

      /* add to tree */
      updatedTree = [...state.tree , action.data] ;

      /* add to subFilters  */
      if (state.subFilters[action.data.slug]) {
        updatedSubFilters = {
          ...state.subFilters ,[action.data.parent_id] :
          [...state.subFilters[action.data.parent_id], action.data ] }
      } else {
        updatedSubFilters = {[action.data.parent_id] : [action.data ]}
      }


       return {
          ...state,
          tree : updatedTree,
          subFilters : updatedSubFilters,
          activeTreeNode : action.data
        }

     case "RENAME_TAG" :

       /* update item in tree */
       updatedTree = [...state.tree] ;
       updatedTree[action.data.index] = action.data ;


       return {
         ...state,
         activeTreeNode : {...action.data },
         tree : updatedTree ,
       }

     case 'RENAME_SUB-FILTER' :

        /* update item in tree */
       updatedTree = [...state.tree] ;
       updatedTree[action.data.index] = action.data ;


       /* update item in suFilters  */
       updatedSubFilters = {
         ...state.subFilters,
         [action.data.id]  : {
           ...state.subFilters[action.data.id] ,
           title : action.data.title,

         }
       }


       return {
         ...state,
         activeTreeNode : action.data ,
         subFilters : updatedSubFilters ,
         tree : updatedTree ,
       }

      case 'RENAME_FILTER' :

         /* update item in tree */
         updatedTree = [ ...state.tree ]
         updatedTree[action.data.index] = action.data ;


         /* update item in filters */
         updatedFilters = {
           ...state.filters ,
           [action.data.id] : {
            ...state.filters[action.data.id] ,
            title : action.data.title

           }
         }


         return {
             ...state ,
             tree : updatedTree ,
             activeTreeNode : action.data ,
             filters : updatedFilters ,

         }

       case "RENAME_CAT" :

         /* update item in tree */
         updatedTree = [...state.tree] ;
         updatedTree[action.data.index] = action.data ;
         return { ...state, tree : updatedTree,activeTreeNode : {...action.data} }



       case 'REMOVE_ITEM' :

         const {
           index ,
           filters,
           subFilters
         } = removeNodeAndItsChilds(
           state.tree,action.data,action.data.index,state.filters,state.subFilters
         )

         updatedTree = [...state.tree.slice(0,action.data.index),...state.tree.slice(index + 1)]

         /* if item type is filter then remove it from filters in simplisend */
         if (action.data.type === 'filter') {
           elementIndex = findElement(state.filters[action.data.parent_tag],action.id,0) ;
           updatedPart = state.filters[action.data.parent_tag]
           updatedPart.splice(elementIndex,1)
           updatedFilters = {
             ...state.filters ,
             [action.data.parent_tag]  : updatedPart ,
           }
           return {
             ...state,
             filters : updatedFilters ,
             tree : updatedTree,
             activeTreeNode : null ,
             subFilters,
           }
         }

         return {
           ...state,
           filters ,
           tree : updatedTree,
           activeTreeNode : null ,
           subFilters,
         }

       case "REMOVE_TAG" :

        const data = removeNodeAndItsChilds(
          state.tree,action.data,action.data.index,state.filters,state.subFilters
        )
        const i = data['index'] ;
        updatedFilters = data['filters'] ;
        updatedSubFilters = data['subFilters']
        updatedTree = [...state.tree.slice(0,action.data.index),...state.tree.slice(i + 1)]
        updatedTags =  state.tags.filter(item => item.id !== action.data.id  )

        return {
            ...state ,
            tags : updatedTags,
            tree: updatedTree,
            activeTreeNode : null ,
            filters : updatedFilters ,
            subFilters : updatedSubFilters ,

        }


      /* when user clicks on rename button */
      case "UPDATE_ACTIVE_TREE_NODE" :

        updatedTree = [...state.tree ]
        updatedTree[action.data.index] = action.data

        return {
          ...state,
          tree : updatedTree,
          activeTreeNode : action.data

        }


      /* when adding new tree item (this variable controls whether the pop up should appear or not )*/
      case 'SHOW_CAT_OPTIONS_POPUP' :

        return { ...state ,showOptions  : action.data }

      /* when deleting a tree item (this variable controls whether the delete message should appear or not )*/
      case 'SHOW_CAT_DELETION_MESSAGE' :
         return { ...state,showDeletionMessage : action.data}

      /* when user hides/show a tree item child */
      case 'TOGGLE_TREE_ITEMS_VISIBILITY' :

        const { updated,end } = ToggleVisibilty(
          state.tree.slice(action.data.index + 1),
          action.data.level,action.data.show
        ) ;

        updatedTree = [
          ...state.tree.slice(0,action.data.index + 1),
          ...updated ,
          ...state.tree.slice(end + action.data.index + 1)
        ]

        updatedTree[action.data.index]['isOpened'] = action.data.show

       return { ...state,tree : updatedTree }

      /* when user logs out*/
      case 'SA_CATS_RESET' :
        return initState ; 
        // return {
        //   cats :  [],
        //   tags : [] ,
        //   tree : [] ,
        //   activeTreeNode : null ,
        //   filters :  {},
        //   subFilters : {},
        //   showOptions : false,
        //   showDeletionMessage: null ,
        //   formDeletionMessageKey : 'confirmDeletion' ,
        // }

      case "SHOW_PROCESSING" :
        return { ...state, showProcessing : action.data }


      case "CHANGE_TAG_PRIVACY" :

        if (action.data.privacy) {
          updatedTags = state.tags.filter(item => { return item.id !== action.data.item.id}) ;
        } else {
          updatedTags = [...state.tags,action.data.item] ;
        }

      return { ...state, tags : updatedTags }



       default:
        return state

  }
}


export default saCatsReducer ;

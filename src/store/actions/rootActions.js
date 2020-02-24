const updateData = (type,data) => {
  return (dispatch,prevState) => {
    dispatch({type , data })
  }
}




export {
  updateData ,
}

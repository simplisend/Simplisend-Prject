import React from 'react' ;
import { Resizable } from "re-resizable";



const _Resizable = ({width,height,children,onResizeStop,minWidth,maxWidth,minHeight,maxHeight,enable}) => {

  return (
    <div>
      <Resizable



        enable = {enable}
        bound = { 'parent' }
      >

        { children }
      </Resizable>
    </div>
  )
}

//defaultSize = {'auto'}
//style = {{width , height }}
// onResizeStop = {(e,direction,ref,d) => onResizeStop(e,direction,ref,d)}
// minWidth = { minWidth ? minWidth : 10}
// maxWidth = { maxWidth ? maxWidth : 600}
// maxHeight = { maxHeight ? maxHeight : 600}
// minHeight = { minHeight ? minHeight : 20}

export default _Resizable

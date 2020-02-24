import React , { Component } from 'react'  ;


class CroppedImagePreview extends Component {

  render = () => {
    const { src } = this.props ;

    return(
      <div className = 'ss-img-preview-container'>
          <img src = {src} alt = 'cropped'/>
      </div>

    )
  }
}



export default CroppedImagePreview ;

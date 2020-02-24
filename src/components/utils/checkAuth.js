import React, { Component } from 'react' ;
import { connect } from 'react-redux' ;
import { request } from '../../funcs/http' ;
import { updateData } from '../../store/actions/rootActions' ;
import Loading from './loading' ;
import Redirect from './redirect'


class CheckAuth extends Component {

  state = { isAuthorized : this.props.isAuthorized }


  static getDerivedStateFromProps = (nextProps,prevState) => {
      return nextProps ;
  }

  checkAuth = (endpoint,token) => {
    request(endpoint,{ token }).then(resp => {
      const result = resp.status === 200 ? true : false ;
      this.props.updateData('AUTHORIZATION',result) ;
    }).catch(e => this.props.updateData('AUTHORIZATION', false)) ;
  }


  componentDidMount = () => {
    const token = localStorage.getItem('token') ;
    if (token) {
      this.checkAuth('token-verify/',token) ;
      return
    }

    this.props.updateData("AUTHORIZATION",false) ;

  }


  render = () => {

    if (this.state.isAuthorized === true) {
      return React.cloneElement(this.props.children,{history : this.props.history}) ;
    } else if (this.state.isAuthorized === false ){
      return <Redirect url = '/' history = {this.props.history}/>
    } else {
      return <Loading /> ;
    }
  }
}


const mapStoreToProps = (state) => {
  return {
    isAuthorized : state.auth.isAuthorized ,
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
      updateData : (data,type) => dispatch(updateData(data,type)) ,
  }
}

export default connect(mapStoreToProps,mapDispatchToProps)(CheckAuth)

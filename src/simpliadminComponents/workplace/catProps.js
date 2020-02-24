import React, { Component } from "react";
import { connect } from "react-redux";
import { Translator } from "../../components/utils";
import { request, getRequest } from "../../funcs/http";
import { updateData } from "../../store/actions/rootActions";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";
import { server } from "../../configs/constants";

class CatProps extends Component {
  state = {
    password: "",
    disablePasswordButton : false , 
    displayColorPicker: false,
    images: {},
    color: {
      r: "0",
      g: "0",
      b: "0",
      a: "1"
    }
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };
  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { activeTreeNode, formStyle } = this.props;


    if (
      this.props.activeTreeNode && prevProps.activeTreeNode 
      && this.props.activeTreeNode.id !== prevProps.activeTreeNode.id) {
     
      // if (this.props.activeTreeNode.type === 'tag') {
      //   this.setState({password : this.props.activeTreeNode.private_password})
      // }
    }
    // when user select a new treeItem change color in state to the treeItem style
    if (
      prevProps.activeTreeNode &&
      activeTreeNode &&
      activeTreeNode.slug !== "root" &&
      prevProps.activeTreeNode.id !== this.props.activeTreeNode.id
    ) {
      if (formStyle[activeTreeNode.id]) {
        this.setState({
          color: formStyle
            ? formStyle[activeTreeNode.id]["backgroundColor"]
            : "black"
        });
      } else {
      
        getRequest(`tree/${activeTreeNode.id}`).then(resp => {
        
          const backgroundColor = resp.data.style
            ? JSON.parse(resp.data["style"])["backgroundColor"]
            : "black";

          this.props.updateData("SET_FORM_STYLE", {
            id: activeTreeNode.id,
            style: { backgroundColor }
          });

          this.setState({
            color: backgroundColor
          });
        });
      }
    }
  };

  // when user update tag image
  validateImage = name => {
    const parts = name.split(".");
    const ext = parts[parts.length - 1];
    if (["jpg", "jpeg", "png", "svg"].indexOf(ext.toLowerCase()) === -1) {
      return false;
    }
    return true;
  };

  handleChangeColor = color => {
    const { activeTreeNode } = this.props;
    const payload = {
      ...activeTreeNode,
      style: JSON.stringify({ backgroundColor: color.hex })
    };

    request(`tree/${activeTreeNode.id}/`, payload, "put").then(resp => {
      this.props.updateData("SET_FORM_STYLE", {
        id: this.props.activeTreeNode.id,
        style: { backgroundColor: color.hex }
      });
      this.props.updateData("SET_TAGS", []);
    });
    this.setState({ color: color.hex });
  };

  handleChange = (e, key) => {
    const value = e.target.value;
    const updatedBlock = {
      ...this.state,
      [key]: value
    };

    this.setState({ ...updatedBlock });
  };

  setPrivacy = privacy => {
    const { activeTreeNode } = this.props;
    const image = activeTreeNode.image.startsWith("http") ? 
    activeTreeNode.image.slice(server.length) : 
    activeTreeNode.image; 

    const updatedActiveTreeNode = { ...activeTreeNode, is_private: privacy,image };
    const payload = { ...activeTreeNode, privacy };

    this.props.updateData("SHOW_PROCESSING", true);
    request(`tree/${activeTreeNode.id}/`, payload, "PUT")
      .then(resp => {
        this.props.updateData("SHOW_PROCESSING", false);

        this.props.updateData("UPDATE_ACTIVE_TREE_NODE", updatedActiveTreeNode);
        /* update selected buttons in simplisend */
        this.props.updateData("SS_SELECTE_BUTTON", []);
        /* update tags in simplisend */
        this.props.updateData("CHANGE_TAG_PRIVACY", {
          privacy,
          item: activeTreeNode
        });

        this.props.updateData("SS_HEADER_ACTIVE", `1`);
        this.props.updateData("CHANGE_PRIVACY", resp.data);
       
        if (privacy) {
          this.props.updateData('ADD_GOTTEN_PRIVATE_PASSWORD',null) ;
          this.props.updateData("ADD_GOTTEN_PRIVATE_TAGS",[]) ; 
          this.props.updateData("SET_PRIVATE_PASSWORD", '') ; 
        }else {
          this.onTogglePrivacy() ; 
        }
      })
      .catch(e => {
        this.props.updateData("SHOW_PROCESSING", false);
      });
  };

  // if user toggle off the private button and he already got the 
  // private forms by password then only get none existing ones 
  onTogglePrivacy = () => {
    const { tags } = this.props ; 
    const ids = {} ; 
    const result = [] ;

    tags.forEach(item => {

      if (!ids[item.id]) {
        result.push(item) ; 
        ids[item.id] = item ; 
      }
    }) ; 
    this.props.updateData('SET_TAGS',result) ;

  }

  chooseImage = e => {
    const isValid = this.validateImage(e.target.value);
    if (isValid) {
      const file = e.target.files[0];
      const reader = new FileReader();
      const blobUrl = URL.createObjectURL(e.target.files[0]);

      reader.readAsDataURL(file);
      reader.onload = e => {
        this.setState({
          images: {
            ...this.state.images,
            [this.props.activeTreeNode.id]: blobUrl
          }
        });
        const payload = {
          ...this.props.activeTreeNode,
          image: e.target.result
        };

        request(`tree/${this.props.activeTreeNode.id}/`, payload, "put").then(
          resp => {
            this.props.updateData("SET_TAGS", []);
          }
        );
      };
    }
  };


  setPrivatePassword = () => {
    const { activeTreeNode } = this.props ; 
    if (this.state.password && activeTreeNode.type === 'tag' && this.state.password !== activeTreeNode.private_password) {
      this.setState({disablePasswordButton : true }) ; 
      const payload = {
        ...activeTreeNode , 
        private_password : this.state.password 
      }
      request("tree/set_private_password/",payload,'put').then(resp => {
       this.setState({disablePasswordButton : false }) ; 
      }).catch(e => {
        this.setState({disablePasswordButton : false }) ; 
      })
    }
   

  }


  render = () => {
    const { activeTreeNode, formStyle } = this.props;

    const styles = reactCSS({
      default: {
        color: {
          background: this.state.color
        }
      }
    });

    return (
      <div className="list-wrapper">
        <h3 className="tree-title">
          <Translator string="catProps" />
        </h3>
        {activeTreeNode && (
          <h3 className="sa-forms-list-title">
            {activeTreeNode.title} ({activeTreeNode.type})
          </h3>
        )}

        {activeTreeNode &&
          activeTreeNode.type === "tag" &&
          activeTreeNode.slug !== "root" && (
            <div>
              <div className="category-Props">
                <p className="title">
                  <Translator string="private" />
                </p>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={activeTreeNode && activeTreeNode.is_private}
                  onChange={() =>
                    this.setPrivacy(activeTreeNode.is_private ? false : true)
                  }
                />
              </div>

              <div className="category-Props">
                <p htmlFor="paassword" className="title">
                  <Translator string="password" />
                </p>

                <input
                  id="password"
                  className="form-input"
                  type="password"
                  onChange={(e, key) => this.handleChange(e, "password")}
                  name = 'private_password' 
                  value={this.state.password}
                />
                <button 
                  disabled = { this.state.disablePasswordButton }
                  onClick = {this.setPrivatePassword}
                >
                  Set Password
                </button>
              </div>

              <div className="category-Props">
                <p className="title">
                  <Translator string="color" />
                </p>
                <div className="c_picker_btn" onClick={this.handleClick}>
                  <div className="c_picker_feld" style={styles.color} />
                </div>
              </div>
              <div
                className="category-Props"
                onClick={() => this.uploadButton.click()}
              >
                <p className="title">
                  <Translator string="symbol" />
                </p>
                <div className="symbol_btn">
                  {((activeTreeNode && this.state.images[activeTreeNode.id]) ||
                    activeTreeNode.image) && (
                    <img
                      alt="app"
                      src={
                        this.state.images[activeTreeNode.id]
                          ? this.state.images[activeTreeNode.id].startsWith('http') ? 
                          this.state.images[activeTreeNode.id] : 
                          `${server}${this.state.images[activeTreeNode.id]}`

                          : activeTreeNode.image
                          ?activeTreeNode.image.startsWith('http') ? 
                          activeTreeNode.image : 
                          `${server}${activeTreeNode.image}`
                          : this.state.images[activeTreeNode.id].startsWith("http") ? 
                          this.state.images[activeTreeNode.id] : `${server}${this.state.images[activeTreeNode.id]}`
                      }
                      className="ss-tag-image"
                    />
                  )}
                  <div className="symbol_feld" style={styles.color} />
                </div>
              </div>

              <input
                type="file"
                ref={element => (this.uploadButton = element)}
                style={{ display: "none" }}
                onChange={this.chooseImage}
              />
              {activeTreeNode &&
                activeTreeNode.type === "tag" &&
                formStyle &&
                formStyle[activeTreeNode.id] &&
                this.state.displayColorPicker && (
                  <div className="color_picker_holder">
                    <div className="color_picker_holder">
                      <div className="close_div" onClick={this.handleClose} />
                      <SketchPicker
                        color={this.state.color}
                        onChange={this.handleChangeColor}
                      />
                    </div>
                  </div>
                )}
            </div>
          )}
      </div>
    );
  };
}

// <Fragment>
//   <ul className = 'form-props-private-list'>
//     <li
//       className = {!activeTreeNode.is_private ? 'form-props-private-list-item-active' : 'form-props-private-list-item'}
//       onClick = { () => this.setPrivacy(false)}
//     >
//       <Translator string = 'public' />
//     </li>
//     <li
//       className = {activeTreeNode.is_private ? 'form-props-private-list-item-active' : 'form-props-private-list-item'}
//       onClick = { () => this.setPrivacy(true)}
//     >
//       <Translator string = 'private' />
//     </li>
//   </ul>
// </Fragment>

const mapStateToProps = state => {
  return {
    activeTreeNode: state.saCatsReducer.activeTreeNode,
    formStyle: state.formStyle.styles,
    tags: state.saCatsReducer.tags,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CatProps);

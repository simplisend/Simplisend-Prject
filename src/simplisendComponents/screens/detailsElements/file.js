import React, { Component } from "react";
import { connect } from "react-redux";
import ReactCrop from "react-image-crop";
import { updateData } from "../../../store/actions/rootActions";
import "react-image-crop/dist/ReactCrop.css";
import CroppedImagePreview from "./croppedImagePreview";

class File extends Component {
  state = {
    crop: {
      unit: "%",
      width: 30
      //aspect: 16 / 9
    }
  };

  componentDidMount = () => {
    const { formDetails, activeFormDetails, data } = this.props;
    const { id, isRequired, file } = formDetails[activeFormDetails.id][
      data[0]["id"]
    ];

    if (isRequired) {
      this.props.updateData("ADD_REQUIRED_ELEMENT", {
        key: id,
        value: file ? file : ""
      });
    }
  };
  setActiveGeneralDiscription = action => {
    const { formDetails, activeFormDetails, data,words } = this.props;
    if (action === "activate") {
      const string =
        formDetails[activeFormDetails.id][data[0]["id"]]["generalDiscription"];
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "activeGeneralDiscription",
        item: words[string]['content']
      });
      return;
    }
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeGeneralDiscription",
      item: null
    });
  };

  async makeClientCrop(crop, index) {
    const { formDetails, activeFormDetails, data } = this.props;
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );

      const updatedItem = {
        ...formDetails[activeFormDetails.id][data[index]["id"]],
        croppedUrl: croppedImageUrl
      };
      const updatedDetails = {
        ...formDetails[activeFormDetails.id],
        [data[index]["id"]]: updatedItem
      };

      this.props.updateData("SET_FORM_DETAILS", {
        key: activeFormDetails.id,
        type: "details",
        details: updatedDetails
      });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  onCropComplete = (crop, index) => this.makeClientCrop(crop, index);

  onImageLoaded = image => {
    this.imageRef = image;
  };

  onChooseFile = (e, index) => {
    const { formDetails, activeFormDetails, data } = this.props;
    const { id } = formDetails[activeFormDetails.id][data[0]["id"]];
    const title = e.target.value;
    const parts = title.split(".");
    const ext = parts[parts.length - 1];
    const allowed = ["png", "jpg", "jpeg", "pdf"];
    if (allowed.indexOf(ext.toLowerCase()) === -1) {
      return;
    }

    const reader = new FileReader();
    const blobUrl = URL.createObjectURL(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = e => {
      const updatedItem = {
        ...formDetails[activeFormDetails.id][data[index]["id"]],
        title: title,
        isNew: true,
        file: e.target.result,
        isCropped: false
      };

      if (ext.toLowerCase() !== "pdf") {
        updatedItem["url"] = blobUrl;
        updatedItem["isImage"] = true;
      }

      if (ext.toLowerCase() === "pdf") {
        updatedItem["url"] = "";
        updatedItem["isImage"] = false;
      }
      const updatedDetails = {
        ...formDetails[activeFormDetails.id],
        [data[index]["id"]]: updatedItem
      };
      this.props.updateData("SET_FORM_DETAILS", {
        key: activeFormDetails.id,
        type: "details",
        details: updatedDetails
      });

      this.props.updateData("ADD_REQUIRED_ELEMENT", {
        key: id,
        value: "file"
      });
    };
  };

  handleCropChange = crop => {
    this.setState({ crop });
  };

  crop = index => {
    const { formDetails, activeFormDetails, data } = this.props;

    const updatedItem = {
      ...formDetails[activeFormDetails.id][data[index]["id"]],
      isCropped: true,
      url: formDetails[activeFormDetails.id][data[index]["id"]]["croppedUrl"],
      croppedUrl: ""
    };
    const updatedDetails = {
      ...formDetails[activeFormDetails.id],
      [data[0]["id"]]: updatedItem
    };
    this.props.updateData("SET_FORM_DETAILS", {
      key: activeFormDetails.id,
      type: "details",
      details: updatedDetails
    });
  };

  setActiveCroppedImage = item => {
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeCroppedImageUrl",
      item: { id: item.id }
    });
  };

  render = () => {
    const { formDetails, activeFormDetails, data, imgUrl,words } = this.props;
    
    return (
      <div className="block-container">
        {formDetails[activeFormDetails.id] &&
          data.map((item, i) => {
            if (formDetails[activeFormDetails.id][item.id]) {
              return (
                <div
                  key={item.id}
                  onClick={() => this.setActiveCroppedImage(item)}
                >
                  <p id="shorttext-question">
                    {words[formDetails[activeFormDetails.id][item.id]["value"]]['content']}
                  </p>
                  
                  <div
                    id="btn-description"
                    onClick={() => this.setActiveGeneralDiscription("activate")}
                  >
                    !
                  </div>
                  <div className="block-element-row">
                  {formDetails[activeFormDetails.id][item.id]["hasTag"] &&
                  formDetails[activeFormDetails.id][item.id]["isRequired"] ===
                    true ? (
                    <p className="answer-tag required">
                      {words[formDetails[activeFormDetails.id][item.id]["tag"]]['content']}
                    </p>
                  ) : (
                    <p className="answer-tag">
                      {words[formDetails[activeFormDetails.id][item.id]["tag"]]['content']}
                    </p>
                  )}

                    <input
                      type="file"
                      onChange={e => this.onChooseFile(e, i)}
                    />
                    <div>
                      {!formDetails[activeFormDetails.id][item.id][
                        "isCropped"
                      ] &&
                        formDetails[activeFormDetails.id][item.id][
                          "croppedUrl"
                        ] &&
                        imgUrl.id === item.id && (
                          <button onClick={() => this.crop(i)}>Crop</button>
                        )}

                      {formDetails[activeFormDetails.id][item.id]["url"] &&
                        !formDetails[activeFormDetails.id][item.id][
                          "isCropped"
                        ] && (
                          <ReactCrop
                            src={
                              formDetails[activeFormDetails.id][item.id]["url"]
                            }
                            crop={this.state.crop}
                            onChange={this.handleCropChange}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={crop => this.onCropComplete(crop, i)}
                          />
                        )}

                      {imgUrl.id === item.id &&
                        !formDetails[activeFormDetails.id][item.id][
                          "isCropped"
                        ] &&
                        formDetails[activeFormDetails.id][item.id][
                          "croppedUrl"
                        ] && (
                          <div className="ss-cropped-img-preview">
                            <CroppedImagePreview
                              src={
                                formDetails[activeFormDetails.id][item.id][
                                  "croppedUrl"
                                ]
                              }
                            />
                          </div>
                        )}

                      {!formDetails[activeFormDetails.id][item.id][
                        "croppedUrl"
                      ] &&
                        formDetails[activeFormDetails.id][item.id][
                          "isCropped"
                        ] &&
                        formDetails[activeFormDetails.id][item.id]["url"] &&
                        formDetails[activeFormDetails.id][item.id][
                          "isImage"
                        ] && (
                          <img
                            className="img"
                            alt="pic"
                            src={
                              formDetails[activeFormDetails.id][item.id]["url"]
                            }
                          />
                        )}
                      {formDetails[activeFormDetails.id][item.id]["isImage"] ===
                        false && <h2>pdf</h2>}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
      </div>
    );
  };
}

// onMouseOver = {() => this.setActiveGeneralDiscription('activate')}
// onMouseOut = {() => this.setActiveGeneralDiscription('diactivate')}
const mapStateToProps = state => {
  return {
    formDetails: state.formDetails.details,
    activeFormDetails: state.activeItems.activeFormDetails,
    imgUrl: state.activeItems.activeCroppedImageUrl
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(File);

import generateRandromString from "../../funcs/generateRandromString";

const initState = {
  dropDowns: {},
  dropDownItems: {},
  shortText: {},
  radioCheck: {},
  images: {},
  files: {},
  grids: {},
  gridsData: {},
  svg: {},
  textBlock: {}
};

const workplaceElementsReducer = (state = initState, action) => {
  let updatedDropdowns;
  switch (action.type) {
    case "SET_TEXTBLOCK":
      if (!action.data.answers) {
        return {
          ...state,
          textBlock: {
            ...state.textBlock,
            [action.data]: {
              ask: { value: "", generalDiscription: "" },
              answers: [
                {
                  hasTag: false,
                  tag: "",
                  value: "",
                  id: generateRandromString(),
                  inputId: "",
                  isRequired: false
                }
              ]
            }
          }
        };
      }

      return {
        ...state,
        textBlock: {
          ...state.shortText,
          [action.data.key]: {
            ask: action.data.answers[0],
            answers: action.data.answers.slice(1)
          }
        }
      };

    case "SET_GRID":
      return {
        ...state,
        svg: {
          [action.data]: {
            id: generateRandromString(),
            url: action.data.item ? action.data.item.url : ""
          }
        }
      };

    case "SET_SVG":
      if (!action.data.item) {
        return {
          ...state,
          svg: {
            [action.data]: {
              id: generateRandromString(),
              width: null,
              height: null,
              cols: null,
              rows: null
            }
          }
        };
      }
      return {
        ...state,
        svg: {
          ...state.grids,
          [action.data.key]: action.data.item
        }
      };

    case "SET_UPLOADFILE":
      if (!action.data.item) {
        return {
          ...state,
          files: {
            ...state.files,
            [action.data]: {
              id: generateRandromString(),
              value: "",
              inputId: "",
              title: "",
              file: "",
              generalDiscription: "",
              isRequired: false,
              tag: "",
              hasTag: false
            }
          }
        };
      }
      return {
        ...state,
        files: { ...state.files, [action.data.key]: action.data.item }
      };

    case "SET_SHORTTEXT":
      if (!action.data.answers) {
        return {
          ...state,
          shortText: {
            ...state.shortText,
            [action.data]: {
              ask: { value: "", generalDiscription: "" },
              answers: [
                {
                  hasTag: false,
                  tag: "",
                  value: "",
                  id: generateRandromString(),
                  inputId: "",
                  isRequired: false
                }
              ]
            }
          }
        };
      }

      return {
        ...state,
        shortText: {
          ...state.shortText,
          [action.data.key]: {
            ask: action.data.answers[0],
            answers: action.data.answers.slice(1)
          }
        }
      };

    case "SET_FILE":
      if (!action.data.file) {
        return {
          ...state,
          files: {
            ...state.files,
            [action.data]: {
              id: generateRandromString(),
              img: "",
              description: "",
              width: "",
              height: "",
              imgTitle: "",
              generalDiscription: "",
              isRequired: false
            }
          }
        };
      }
      return {
        ...state,
        files: { ...state.files, [action.data.key]: action.data.file }
      };

    case "SET_IMAGE":
      if (!action.data.image) {
        return {
          ...state,
          images: {
            ...state.images,
            [action.data]: {
              id: generateRandromString(),
              img: "",
              description: "",
              user_width: "",
              user_height: "",
              imgTitle: "",
              isRequired: false,
              hasTag: false,
              tag: ""
            }
          }
        };
      }
      return {
        ...state,
        images: { ...state.images, [action.data.key]: action.data.image }
      };

    /* when user adds a new dropdown or open an existing one */
    case "SET_DROPDOWNS":
      /* open new one */
      if (!action.data.dropDowns) {
        return {
          ...state,
          dropDowns: {
            ...state.dropDowns,
            [action.data]: {
              ask: {
                value: "",
                generalDiscription: "",
                isRequired: false,
                id: generateRandromString()
              },
              items: [
                {
                  title: "",
                  inputId: "",
                  placeholder: "",
                  hasTag: false,
                  tag: "",
                  id: generateRandromString(),
                  itemsCount: 0,
                  isOpened: true,
                  selected: false
                }
              ]
            }
          }
        };
      }
      /* open existing one */

      return {
        ...state,
        dropDowns: {
          ...state.dropDowns,
          [action.data.key]: {
            ask: action.data.dropDowns[0],
            items: action.data.dropDowns.slice(1)
          }
        }
      };

    case "SET_RADIOCHECK":
      /* open new one */
      if (!action.data.items) {
        return {
          ...state,
          radioCheck: {
            ...state.radioCheck,
            [action.data]: {
              ask: {
                value: "",
                inputId: "",
                generalDiscription: "",
                isRequired: false,
                hasTag: false,
                tag: ""
              },
              items: [
                {
                  tag: "",
                  id: generateRandromString(),
                  type: "radioCheck",
                  checked: false
                }
              ]
            }
          }
        };
      }
      /* open existing one */

      return {
        ...state,
        radioCheck: {
          ...state.radioCheck,
          [action.data.key]: {
            ask: action.data.items[0],
            items: action.data.items.slice(1)
          }
        }
      };

    /* when user changes the title ,id , tag for a drop down */
    case "UPDATE_DROPDOWNS":
      return {
        ...state,
        dropDowns: {
          ...state.dropDowns,
          [action.data.key]: action.data.dropDowns
        }
      };

    case "UPDATE_RADIOCHECK":
      return {
        ...state,
        radioCheck: {
          ...state.radioCheck,
          [action.data.key]: action.data.radioCheck
        }
      };

    case "UPDATE_SHORTTEXT":
      return {
        ...state,
        shortText: {
          ...state.shortText,
          [action.data.key]: action.data.shortText
        }
      };

    /* when user hits the remove button for a dropdown  */
    case "REMOVE_DROPDOWNS":
      updatedDropdowns = { ...state.dropDowns };
      delete updatedDropdowns[action.data];
      return { ...state, dropDowns: updatedDropdowns };

    case "SET_DROPDOWN_ITEMS":
      if (!action.data.items) {
        return {
          ...state,
          dropDownItems: {
            ...state.dropDownItems,
            [action.data]: [
              {
                id: generateRandromString(),
                title: "",
                parent: action.data,
                type: "dropdown_option"
              }
            ]
          }
        };
      }
      return {
        ...state,
        dropDownItems: {
          ...state.dropDownItems,
          [action.data.key]: action.data.items
        }
      };

    case "UPDATE_DROPDOWNS_ITEMS":
      return {
        ...state,
        dropDownItems: {
          ...state.dropDownItems,
          [action.data.key]: action.data.items
        }
      };

    default:
      return state;
  }
};

export default workplaceElementsReducer;

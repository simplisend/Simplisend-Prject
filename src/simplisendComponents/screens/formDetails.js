import React, { Component } from "react";
import { Translator } from "../../components/utils";
import { getRequest } from "../../funcs/http";
import { connect } from "react-redux";
import icons from "../../configs/icons";
import { updateData } from "../../store/actions/rootActions";
import { FormSubmitButton } from "../screens/detailsElements";
import {
  Text,
  ShortText,
  DropDown,
  RadioCheck,
  Image,
  File,
  Signature,
  TextBlock
} from "./detailsElements";
import { RightSidebarElementsContainer } from "../layout/sidebar";

import Select from "react-select";

const MAP_ELEMENTS_TO_TYPE = {
  textArea: Text,
  shortText: ShortText,
  header: Text,
  dropList: DropDown,
  radioChoice: RadioCheck,
  checkBox: RadioCheck,
  image: Image,
  uploadFile: File,
  signature: Signature,
  textBlock: TextBlock
};

const add = 3;

/* screen to display each form content */
class FormDetails extends Component {
  state = {
    words: null, // translated words for this form
    options: null, // languages for this form
    selectedLang: null, // which language is selected
    index: 3, // for pagination
    disableNext: false, // disabled next button
    disablePrev: true, // disable previous button
    data: null, // pagination will work on this data
    wordsMap: {}, //
    filterData: false, // whether to filter data or not
    filteredItems: {}, // items that does not fulfill filter criterea
    filteredData: null,

    // drop lists have selectedOption in their state so they need to know when to empty its value
    emptyDropLists: false,
    secondData: null, // when user filter data (the filrered data)
    autoFilled: false, // when user click the auto fill button change this value to true (user should not auto fill the same inputs twice)
    shortTextsRequiredIndexes: {}, // required fields for all shortTexts
    shortTextsNoneRequiredIndexes: {}, // none required fields for all shortTexts
    gotRequiredIndexes: false, // when all required fields for all shortTexts are ready
    lastUpdatedShortText: null // to check the emptyness of a shortText while user is typing
  };

  // check if radio buttons / checkbox are empty or not
  checkIfRadioCheckIsEmpty = data => {
    const len = data.length;
    let noSelect = true;
    let i = 1;

    for (i; i < len; i++) {
      if (data[i]["checked"]) {
        noSelect = false;
        break;
      }
    }

    return noSelect;
  };

  // get required indexes for each shortText
  getRequiredIndexes = data => {
    const { formDetails, activeFormDetails } = this.props;

    const details = formDetails[activeFormDetails.id];
    let _required = { ...this.state.shortTextsRequiredIndexes };
    let _noneRequired = { ...this.state.shortTextsNoneRequiredIndexes };

    Object.keys(data).map(k => {
      if (k !== "formWorkplaceElements") {
        const item = data[k][0];

        if (item && item.type === "shortText") {
          const { required, noneRequired } = this.getShortTextRequiredIndexes(
            details[item.id]
          );
          _required = { ..._required, [item.id]: required };
          _noneRequired = { ..._noneRequired, [item.id]: noneRequired };
        }
      }
      return null;
    });

    this.setState({
      shortTextsRequiredIndexes: _required,
      shortTextsNoneRequiredIndexes: _noneRequired,
      gotRequiredIndexes: true
    });
  };

  // get required indexes for a shortText element
  getShortTextRequiredIndexes = shortText => {
    const required = {};
    const noneRequired = {};
    shortText.slice(1).forEach((item, index) => {
      if (item.isRequired) {
        required[index + 1] = "";
      } else {
        noneRequired[index + 1] = "";
      }
    });

    return { required, noneRequired };
  };

  // this method will be used in shortTextItem while user is typing to iupdate required/noneRequired fields
  updateShortTextIndexes = (key, id, index, value) => {
    const {
      shortTextsRequiredIndexes,
      shortTextsNoneRequiredIndexes
    } = this.state;

    // required fields
    if (key === "requiredIndexes") {
      const updatedIndexes = {
        ...shortTextsRequiredIndexes[id],
        [index]: value
      };
      const updatedRequiredIndexes = {
        ...shortTextsRequiredIndexes,
        [id]: updatedIndexes
      };
      const lastUpdatedShortText = `${key}_${id}_${index}_${value}`;

      this.setState({
        shortTextsRequiredIndexes: updatedRequiredIndexes,
        lastUpdatedShortText
      });
      // none required fields
    } else {
      const updatedIndexes = {
        ...shortTextsNoneRequiredIndexes[id],
        [index]: value
      };
      const updatedNoneRequiredIndexes = {
        ...shortTextsNoneRequiredIndexes,
        [id]: updatedIndexes
      };
      const lastUpdatedShortText = `${key}_${id}_${index}_${value}`;

      this.setState({
        shortTextsNoneRequiredIndexes: updatedNoneRequiredIndexes,
        lastUpdatedShortText
      });
    }
  };

  //check if all answers to a certain question are empty
  checkIfShortTextIsEmpty = data => {
    const id = data[0]["id"];
    const required = this.state.shortTextsRequiredIndexes[id];
    const noneRequired = this.state.shortTextsNoneRequiredIndexes[id];

    // if no required indexes and any field is filled then this element is not empty
    if (Object.keys(required).length === 0) {
      const merged = { ...required, ...noneRequired };
      let result = true;
      let i = 0;
      for (i; i < Object.values(merged).length; i++) {
        if (Object.values(merged)[i]) {
          result = false;
          break;
        }
      }
      return result;
    }

    // if there are required fields and all of them are filled then this element is not empty
    if (Object.keys(required).length > 0) {
      const values = Object.values(required);
      let i = 0;
      let result = false;
      for (i; i < values.length; i++) {
        if (!values[i]) {
          result = true;
          break;
        }
      }
      return result;
    }
  };

  // check if a value is selected for a dropdown
  checkIfDropDownIsSelected = data => {
    const len = data.length;
    let selected = false;
    let i = 1;

    for (i; i < len; i++) {
      if (data[i]["selected"]) {
        selected = true;
        break;
      }
    }

    return !selected;
  };

  // build filtered items (elements with values)
  buildFilteredItems = () => {
    const { elements, activeFormDetails, formDetails } = this.props;
    const filteredItems = {};
    const MAP_TYPE_TO_METHOD = {
      shortText: this.checkIfShortTextIsEmpty,
      dropList: this.checkIfDropDownIsSelected,
      radioChoice: this.checkIfRadioCheckIsEmpty,
      checkBox: this.checkIfRadioCheckIsEmpty
    };
    Object.keys(elements[activeFormDetails.id]).map(k => {
      if (
        k !== "formWorkplaceElements" &&
        elements[activeFormDetails.id][k].length > 0
      ) {
        const item = elements[activeFormDetails.id][k][0];
        const action = MAP_TYPE_TO_METHOD[item.type];
        if (action) {
          //const clean = action(elements[activeFormDetails.id][k]);
          const clean = action(formDetails[activeFormDetails.id][item.id]);

          if (!clean) {
            filteredItems[item.id] = formDetails[activeFormDetails.id][item.id];
          }
        }
      }
      return null;
    });

    this.setState({ filteredItems });
  };

  // updated disabled buttons based on current pagination index
  updatePagination = () => {
    const { elements, activeFormDetails } = this.props;
    const { index } = this.state;
    const data = elements[activeFormDetails.id]["formWorkplaceElements"];

    if (index >= data.length) {
      this.setState({ disableNext: true });
      return;
    }

    if (index - add <= 0) {
      this.setState({ disablePrev: true });
      return;
    }

    if (this.state.disablePrev) {
      this.setState({ disablePrev: false });
      return;
    }

    if (this.state.disableNext) {
      this.setState({ disableNext: false });
      return;
    }

    return;
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { elements, activeFormDetails } = this.props;

    if (
      prevProps.elements[activeFormDetails.id] &&
      elements[activeFormDetails.id] &&
      !prevProps.formDetails[activeFormDetails.id] &&
      this.props.formDetails[activeFormDetails.id]
    ) {
      this.getRequiredIndexes(elements[activeFormDetails.id]);
    }

    // when user disabled filtre rebuild the filtered items so if the user
    // was typing while filter is active
    // filtered items should be updated
    if (prevState.filterData && !this.state.filterData) {
      this.buildFilteredItems();
    }

    if (this.state.filterData && !prevState.filterData) {
      this.buildFilteredData();
      return;
    }

    if (
      prevState.filterData &&
      !this.state.filterData &&
      this.state.secondData
    ) {
      this.setState({ data: this.state.secondData });
      return;
    }

    // when filled indexes for one shortText(lastUpdatedShortText) is updated
    // then check if its empty or not
    if (prevState.lastUpdatedShortText !== this.state.lastUpdatedShortText) {
      const id = this.state.lastUpdatedShortText.split("_")[1];
      const shortText = this.props.formDetails[activeFormDetails.id][id];

      const empty = this.checkIfShortTextIsEmpty(shortText);
      if (!empty) {
        this.updateFilteredItems(id, shortText);
      } else {
        this.updateFilteredItems(id, null);
      }
    }

    // when user gets data for the first time
    if (
      !prevProps.elements[prevProps.activeFormDetails.id] &&
      elements[activeFormDetails.id] &&
      this.props.formDetails[this.props.activeFormDetails.id]
    ) {
      this.getRequiredIndexes(elements[activeFormDetails.id]);
      return;
    }

    // when all required indexes for all shortTexts are ready
    if (!prevState.gotRequiredIndexes && this.state.gotRequiredIndexes) {
      this.buildData();
      this.buildFilteredItems();
      return;
    }

    if (
      prevState.selectedLang &&
      prevState.selectedLang !== this.state.selectedLang
    ) {
      // update form language
      const updatedMap = this.createWordsMap(
        this.state.words,
        this.state.selectedLang
      );
      this.setState({ wordsMap: updatedMap });
      return;
    }

    if (
      elements[activeFormDetails.id] &&
      this.state.index !== prevState.index
    ) {
      this.updatePagination();
    }
  };

  // when user clicks next button
  handleNextClick = () => {
    const { index } = this.state;

    if (
      !this.state.disableNext &&
      this.state.data &&
      index < this.state.data.length
    ) {
      this.setState({ index: this.state.index + add, disablePrev: false });
    }
  };

  // when user clicks previous button
  handlePrevClick = () => {
    if (!this.state.disablePrev) {
      this.setState({ index: this.state.index - add, disableNext: false });
    }
  };

  // when user clicks go to first button
  goToStart = () => {
    if (this.state.index > add) {
      this.setState({ index: 3, disablePrev: true, disableNext: false });
    }
  };

  // when user clicks go to end button
  goToEnd = () => {
    const { index, data } = this.state;
    let i = 0;

    if (!this.state.disableNext && data && data.length > index) {
      while (i < data.length) {
        i += 3;
      }
      this.setState({
        index: i,
        disableNext: true,
        disablePrev: false
      });
    }
  };

  // translate form
  createWordsMap = (data, lang) => {
    const updatedMap = {};
    const tempMap = {};
    const { activeFormDetails } = this.props;
    const k = lang.value ? lang.value : lang.symbol;
    data[k].map(item => {
      tempMap[item.translation_id] = item;
      return null;
    });

    data[activeFormDetails.default_lang.symbol].map(item => {
      updatedMap[item.content] = tempMap[item.translation_id];
      return null;
    });

    return updatedMap;
  };

  /* if not data request this form details */
  componentDidMount = () => {
    const { formDetails, activeFormDetails, elements } = this.props;

    getRequest(`forms/get_words/${activeFormDetails.id}?no_auth=1`).then(
      resp => {
        const count = resp.data[activeFormDetails.default_lang.symbol].length;
        let index;
        let i = 0;
        const keys = Object.keys(resp.data);
        const options = [];

        for (i; i < keys.length; i++) {
          if (resp.data[keys[i]].length === count) {
            options.push({
              label: resp.data[keys[i]][0]["language_label"],
              value: keys[i]
            });
          }
        }

        // available form languages (only full translated forms) ;
        options.map((item, i) => {
          if (item.value === activeFormDetails.default_lang.symbol) {
            index = i;
          }
          return null;
        });

        let selectedLang;

        // when user back to main page and reopen the form
        if (
          elements[activeFormDetails.id] &&
          this.props.formDetails[this.props.activeFormDetails.id]
        ) {
          this.getRequiredIndexes(elements[activeFormDetails.id]);
        }

        // set selected lang
        if (resp.data[this.props.language]) {
          // if site language does exist in options then use it
          const arr = options.filter(
            item => item.label === this.props.language
          );
          selectedLang = arr.length === 1 ? arr[0] : options[index];
        } else {
          // otherwise set the form default language
          selectedLang = options[index];
        }

        // create translation map (this will be used to translate the form )
        const updatedMap = this.createWordsMap(resp.data, selectedLang);

        this.setState({
          words: resp.data,
          options,
          wordsMap: updatedMap,
          selectedLang
        });
      }
    );

    /* if user adds new form in simplibuilder and navigates to simplisend */
    if (!formDetails[activeFormDetails.id]) {
      const slug = activeFormDetails.slug;
      getRequest(`forms/${slug}?no_auth=1`).then(resp => {
        this.getData(resp.data.elements);
        //this.getRequiredIndexes(this.props.elements[this.props.activeFormDetails.id])
      });
    }

    if (elements[activeFormDetails.id]) {
      const data = elements[activeFormDetails.id][
        "formWorkplaceElements"
      ].filter(item => {
        const dta = elements[activeFormDetails.id][item.droppable];
        return dta && dta.length;
      });

      this.setState({ data });
    }
  };

  /* get data for this form */
  getData = url => {
    const { activeFormDetails, tempData } = this.props;
    getRequest(url, "").then(resp => {
      const data = JSON.parse(resp.data);

      // if there is a saved version then get it
      //otherwise use response data
      if (tempData["simplisendForms"][activeFormDetails.id]) {
        this.props.updateData("SET_FORM_DETAILS", {
          key: activeFormDetails.id,
          details: tempData["simplisendForms"][activeFormDetails.id],
          type: "details"
        });
      } else {
        this.props.updateData("SET_FORM_DETAILS", {
          key: activeFormDetails.id,
          details: data.details,
          type: "details"
        });
      }

      const _data = JSON.parse(resp.data);
      // console.log(_data) ;
      //this.getRequiredIndexes(_data.elements)
      this.props.updateData("SET_DETAILS_ELEMENTS", {
        key: activeFormDetails.id,
        elements: _data.elements
      });
    });
  };

  // selected language
  handleChange = selectedOption => {
    this.setState({ selectedLang: selectedOption });
  };

  // filtered out items are sotred so when user toggle the filter off
  // i can restor them
  updateFilteredItems = (key, item) => {
    if (item) {
      this.setState({
        filteredItems: { ...this.state.filteredItems, [key]: item }
      });
    } else {
      const updatedFilteredItems = { ...this.state.filteredItems };
      delete updatedFilteredItems[key];
      this.setState({ filteredItems: updatedFilteredItems });
    }
  };

  // when user get data then display only containers with elements
  buildData = () => {
    const { elements, activeFormDetails } = this.props;
    const data = elements[activeFormDetails.id]["formWorkplaceElements"].filter(
      item => {
        const dta = elements[activeFormDetails.id][item.droppable];
        return dta && dta.length;
      }
    );

    this.setState({ data });
  };

  // clear shortext
  clearShortText = data => {
    const updatedData = data.slice(1).map(item => {
      return { ...item, value: "" };
    });
    return [data[0], ...updatedData];
  };

  // clear dropdown
  clearDropList = data => {
    const updatedData = data.slice(2).map(item => {
      return { ...item, selected: false };
    });
    this.setState({ emptyDropLists: !this.state.emptyDropLists });
    return [...data.slice(0, 2), ...updatedData];
  };

  // clear radio buttons and checkboxes
  clearRadioCheck = data => {
    const updatedData = data.slice(1).map(item => {
      return { ...item, checked: false };
    });
    return [data[0], ...updatedData];
  };

  //when user click clear button
  clearData = () => {
    const { elements, activeFormDetails, formDetails } = this.props;
    const MAP_TYPE_TO_CLEAR_METHOD = {
      shortText: this.clearShortText,
      dropList: this.clearDropList,
      radioChoice: this.clearRadioCheck,
      checkBox: this.clearRadioCheck
    };
    const updatedFormDetails = {};

    Object.keys(elements[activeFormDetails.id]).map(k => {
      if (k !== "formWorkplaceElements") {
        const item = elements[activeFormDetails.id][k][0];
        if (item) {
          const action = MAP_TYPE_TO_CLEAR_METHOD[item.type];

          if (action) {
            const updated = action(formDetails[activeFormDetails.id][item.id]);
            updatedFormDetails[item.id] = updated;
          } else {
            if (item.type === "image") {
              updatedFormDetails[item.id] =
                formDetails[activeFormDetails.id][item.id];
            } else {
              updatedFormDetails[item.id] = [item];
            }
          }
        }
      }
      return null;
    });

    this.props.updateData("SET_FORM_DETAILS", {
      key: activeFormDetails.id,
      details: updatedFormDetails,
      type: "details"
    });
    this.setState({ filteredItems: {} });
  };

  // when user filter data
  buildFilteredData = () => {
    const { elements, activeFormDetails } = this.props;
    const { filteredItems, filterData } = this.state;
    if (elements[activeFormDetails.id] && filterData) {
      const filtered = [];

      this.state.data.map(item => {
        const obj = elements[activeFormDetails.id][item.droppable][0];
        if (!filteredItems[obj.id]) {
          filtered.push(item);
        }
        return null;
      });

      this.setState({
        filteredData: filtered,
        secondData: this.state.data,
        data: filtered,
        index: add,
        disableNext: false,
        disablePrev: true
      });
    }
  };

  // when user click fill all inputs button
  getAllIds = () => {
    const { formDetails, activeFormDetails, elements } = this.props;
    const _map = {};
    let result = {};
    getRequest(`forms/get_inputs_ids?form=${activeFormDetails.id}`).then(
      resp => {
        resp.data.map(item => {
          _map[item.element_id] = item.value;
          return null;
        });

        const fillables = [
          "shortText",
          "radioChoice",
          "dropList",
          "checkBox"
          //"uploadFile"
        ];

        const MAP_TYPES_TO_METHODS = {
          shortText: this.autoFillShortText,
          radioChoice: this.autoFillRadioCheck,
          dropList: this.autoFillDropList,
          checkBox: this.autoFillRadioCheck
        };

        // loop through containers
        Object.keys(elements[activeFormDetails.id]).map(k => {
          if (k !== "formWorkplaceElements") {
            const item = elements[activeFormDetails.id][k][0];
            if (item && fillables.indexOf(item.type) !== -1) {
              const action = MAP_TYPES_TO_METHODS[item.type];
              const _id =
                item.type === "uploadFile" ? item["elementId"] : item["id"];

              const updated = _map[_id] ? action(_map, _id) : {};
              result = { ...result, ...updated };
            }
          }
          return null;
        });
        const updatedDetails = { ...formDetails[activeFormDetails.id] };

        Object.keys(result).map(k => {
          updatedDetails[k] = result[k];
          return null;
        });

        this.props.updateData("SET_FORM_DETAILS", {
          key: activeFormDetails.id,
          details: updatedDetails,
          type: "details"
        });
        this.setState(() => {
          return { autoFilled: true };
        }, this.buildFilteredItems());
      }
    );
  };

  // auto fill short texts based on id
  autoFillShortText = (map, key) => {
    const { formDetails, activeFormDetails } = this.props;
    const data = formDetails[activeFormDetails.id][key];

    const source = JSON.parse(map[key]);
    if (source) {
      const updatedData = data.slice(1).map((item, index) => {
        return { ...item, value: source[index]["value"] };
      });

      return { [key]: [data[0], ...updatedData] };
    }
    return { [key]: data };
  };

  // auto fill radio buttons and checkboxes
  autoFillRadioCheck = (map, key) => {
    const { formDetails, activeFormDetails } = this.props;
    const data = formDetails[activeFormDetails.id][key];
    const source = JSON.parse(map[key]);
    if (source) {
      const updatedData = data.slice(1).map((item, index) => {
        return { ...item, checked: source[index]["checked"] };
      });
      return { [key]: [data[0], ...updatedData] };
    }
    return { [key]: data };
  };

  // auto fill dropdowns
  autoFillDropList = (map, key) => {
    const { formDetails, activeFormDetails } = this.props;
    const data = formDetails[activeFormDetails.id][key];
    const source = JSON.parse(map[key]);
    if (source) {
      const updatedData = data.slice(2).map((item, index) => {
        return { ...item, selected: source[index]["selected"] };
      });

      return { [key]: [...data.slice(0, 2), ...updatedData] };
    }
    return { [key]: data };
  };

  render = () => {
    const { elements, activeFormDetails, formDetails, tempData } = this.props;
    const { index, words, gotRequiredIndexes } = this.state;

    let loopThorugh;
    const token = localStorage.getItem("token");

    if (this.state.filterData && this.state.filteredData) {
      loopThorugh = this.state.filteredData;
    } else if (elements && elements[activeFormDetails.id]) {
      loopThorugh = elements[activeFormDetails.id]["formWorkplaceElements"];
    } else {
      loopThorugh = [];
    }

    return (
      <div className="ss_WP-Container">
        <div id="form_header">
          {words && (
            <Select
              className="select_lang"
              options={this.state.options ? this.state.options : []}
              onChange={this.handleChange}
              value={this.state.selectedLang}
            />
          )}

          <div
            className="btn_back"
            onClick={() =>
              this.props.updateData("SHOW_SIMPLISEND_BACK_POPUP", true)
            }
          >
            {icons.home}
            <p className="discription">
              <Translator string="home" />
            </p>
          </div>
        </div>

        <div className="btn-container">
          <button
            className={
              !this.state.filterData
                ? "btn-form-props"
                : "btn-form-props active"
            }
            onClick={() => {
              this.setState({ filterData: !this.state.filterData });
            }}
          >
            {icons.filterNav}
          </button>
          <button className="btn-form-props" onClick={this.clearData}>
            {icons.filterNav}
          </button>
          <button
            className={
              !token
                ? "btn-form-props-disabled"
                : !this.state.autoFilled
                ? "btn-form-props"
                : "btn-form-props-disabled"
            }
            onClick={this.getAllIds}
            disabled={this.state.autoFilled || !token}
          >
            {icons.filterNav}
          </button>
        </div>

        <h1 className="form-title">
          {this.state.wordsMap[activeFormDetails.title] &&
            this.state.wordsMap[activeFormDetails.title]["content"]}
        </h1>
        <div className="element-container">
          {tempData &&
            words &&
            elements &&
            formDetails &&
            gotRequiredIndexes &&
            // when user saves updates to a form in simpliBuilder
            // i remove the form data from form details in order to get the new data
            formDetails[activeFormDetails.id] &&
            elements[activeFormDetails.id] &&
            elements[activeFormDetails.id]["formWorkplaceElements"] &&
            loopThorugh.slice(index - add, index).map((element, i) => {
              const data = elements[activeFormDetails.id][element.droppable];

              if (
                data &&
                data.length &&
                formDetails[activeFormDetails.id][data[0]["id"]]
              ) {
                /* user may select components in simpliBuilder without filling them */

                const Component = MAP_ELEMENTS_TO_TYPE[data[0]["type"]];

                return (
                  <Component
                    exceptions={this.state.exceptions}
                    filteredItems={this.state.filteredItems}
                    updateFilteredItems={this.updateFilteredItems}
                    filterData={this.state.filterData}
                    data={data}
                    key={i}
                    type={data[0]["type"]}
                    words={this.state.wordsMap}
                    selectedLang={this.state.selectedLang}
                    emptyDropLists={this.state.emptyDropLists}
                    autoFilled={this.state.autoFilled}
                    updateShortTextIndexes={this.updateShortTextIndexes}
                    shortTextsRequiredIndexes={
                      this.state.shortTextsRequiredIndexes
                    }
                    shortTextsNoneRequiredIndexes={
                      this.state.shortTextsNoneRequiredIndexes
                    }
                  />
                );
              }
              return null;
            })}
        </div>

        {this.state.data &&
          (this.state.disableNext || index >= this.state.data.length) && (
            <FormSubmitButton />
          )}
        {elements &&
          elements[activeFormDetails.id] &&
          elements[activeFormDetails.id]["formWorkplaceElements"] && (
            <div className="btn-container">
              <button className="btn-page-scroll" onClick={this.goToStart}>
                {icons.scrollBB}
              </button>

              <button
                className="btn-page-scroll"
                onClick={this.handlePrevClick}
              >
                {icons.scrollB}
              </button>

              <button
                className="btn-page-scroll"
                onClick={this.handleNextClick}
              >
                {icons.scrollF}
              </button>
              <button className="btn-page-scroll" onClick={this.goToEnd}>
                {icons.scrollFF}
              </button>
            </div>
          )}

        <RightSidebarElementsContainer />
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    /* get data for this form */
    formDetails: state.formDetails.details,
    elements: state.formDetails.elements,
    langs: state.translation.langs,
    language: state.lang.lang,
    activeFormDetails: state.activeItems.activeFormDetails,
    tempData: state.tempData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /* after gettind data from server set this data in details reducer */
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDetails);

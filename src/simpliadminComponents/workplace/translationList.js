import React, { Component } from "react";
import { connect } from "react-redux";
import { getRequest } from "../../funcs/http";
import { updateData } from "../../store/actions/rootActions";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import Select from "react-select";
import TranslationListItem from "./translationListItem";
import { Translator } from "../../components/utils";
import icons from "../../configs/icons";

class TranslationList extends Component {
  state = {
    options: [],
    wordsAreFiltered: false,
    allWords: null,
    filteredWords: null
  };

  /* get all words that belong to a certain form based on language id */
  getLangWords = langId => {
    const { activeForm, langsTable } = this.props;
    if (!langsTable[activeForm.id]) {
      getRequest(`forms/form_words?form=${activeForm.id}&lang=${langId}`).then(
        resp => {
          if (resp.status === 200) {
            this.props.updateData("SET_LANG_WORDS", {
              key: activeForm.id,
              words: resp.data
            });
          }
        }
      );
      // getRequest(`forms/form_words?form=${activeForm.id}`).then(resp => {
      //   if (resp.status === 200) {
      //     this.props.updateData("SET_LANG_WORDS", {
      //       key: activeForm.id,
      //       words: resp.data
      //     });
      //   }
      // });
    }
  };

  getTranslatedWords = langId => {
    const { activeForm, langsTable } = this.props;
    const key = `${activeForm.id}_${langId}`;
    // getRequest(`text?lang=${langId}&form=${activeForm.id}`).then(resp => {
    //   console.log(resp.data);
    //   const orderedWords = {};
    //   resp.data.map(item => {
    //     orderedWords[item.translation_id] = item;
    //     return null;
    //   });

    //   this.props.updateData("SET_LANG_WORDS", { key, words: resp.data });
    //   this.props.updateData("SET_ORDERED_WORDS", {
    //     key,
    //     words: orderedWords
    //   });
    // });

    //`text?translated_words_ids=${translatedWordsIds}&language=${langId}`

    if (!langsTable[key]) {
      // const translatedWordsIds = JSON.stringify(
      //   langsTable[activeForm.id].map(item => item.translation_id)
      // );
      getRequest(`text?form=${activeForm.id}&lang=${langId}`).then(resp => {
        const orderedWords = {};
        resp.data.map(item => {
          orderedWords[item.translation_id] = item;
          return null;
        });
        this.props.updateData("SET_LANG_WORDS", { key, words: resp.data });
        this.props.updateData("SET_ORDERED_WORDS", {
          key,
          words: orderedWords
        });
      });
    }
  };

  // get all languages in database
  // if they are not requested yet then request them and put then in state
  // if they are requested then set them in state
  componentDidMount = () => {
    const { activeForm, langs } = this.props;
    if (activeForm) {
      this.getLangWords(activeForm.default_lang.id);
    }
    if (!langs.length) {
      getRequest("langs").then(resp => {
        if (resp.status === 200) {
          this.props.updateData("SET_LANGS", resp.data);
          if (activeForm) {
            let i = 0;
            const options = [];
            for (i; i < resp.data.length; i++) {
              const item = resp.data[i];
              item.id !== activeForm.default_lang.id &&
                options.push({
                  label: item.symbol,
                  id: item.id,
                  value: item.id
                });
            }
            this.setState({ options });
          }
        }
      });
    } else {
      let i = 0;
      const options = [];

      if (activeForm) {
        for (i; i < langs.length; i++) {
          const item = langs[i];
          item.id !== activeForm.default_lang.id &&
            options.push({ label: item.symbol, id: item.id, value: item.id });
        }
        this.setState({ options });
      }
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { activeForm, searchedLang, langs, langsTable } = this.props;
    const { wordsAreFiltered } = this.state;

    if (!prevProps.activeForm && activeForm && searchedLang) {
      const data = this.getAllWords();

      this.setState({ allWords: data });
      //this.getTranslatedWords(searchedLang.id);
    }

    /* when user selects a form get it's words */
    if (!prevProps.activeForm && activeForm) {
      this.getLangWords(activeForm.default_lang.id);
      let i = 0;
      const options = [];

      for (i; i < langs.length; i++) {
        const item = langs[i];
        item.id !== activeForm.default_lang.id &&
          options.push({ label: item.symbol, id: item.id, value: item.id });
      }
      this.setState({ options });
    }

    /* when user selects a new form get it's words */
    if (
      prevProps.activeForm &&
      activeForm &&
      prevProps.activeForm.id !== activeForm.id
    ) {
      this.props.updateData("SET_SEARCHED_LANG", null);
      this.setState({ wordsAreFiltered: false });
      if (!langsTable[activeForm.id]) {
        this.getLangWords(activeForm.default_lang.id);
      }

      let i = 0;
      const options = [];

      for (i; i < langs.length; i++) {
        const item = langs[i];
        item.id !== activeForm.default_lang.id &&
          options.push({ label: item.symbol, id: item.id, value: item.id });
      }
      this.setState({ options });
    }

    /* when user selects language */
    if (!prevProps.searchedLang && searchedLang) {
      this.getTranslatedWords(searchedLang.id);
      const key = wordsAreFiltered ? "filteredWords" : "allWords";
      const action =
        key === "filteredWords" ? this.getUnTranslatedWords : this.getAllWords;
      const data = action();
      this.setState({ [key]: data });
    }

    /* when user selects a new language */
    if (
      prevProps.searchedLang &&
      searchedLang &&
      prevProps.searchedLang.id !== searchedLang.id
    ) {
      this.getTranslatedWords(searchedLang.id);
      const key = wordsAreFiltered ? "filteredWords" : "allWords";
      const action =
        key === "filteredWords" ? this.getUnTranslatedWords : this.getAllWords;
      const data = action();
      this.setState({ [key]: data });
    }

    if (
      prevState.wordsAreFiltered !== this.state.wordsAreFiltered &&
      langsTable[activeForm.id]
    ) {
      const key = wordsAreFiltered ? "filteredWords" : "allWords";
      const action =
        key === "filteredWords" ? this.getUnTranslatedWords : this.getAllWords;
      const data = action();
      this.setState({ [key]: data });
    }
    /* when user selects new form but keeps the same language */
    if (
      searchedLang &&
      Object.keys(prevProps.langsTable).length !==
        Object.keys(langsTable).length
    ) {
      activeForm && this.getTranslatedWords(searchedLang.id);
    }
  };

  /* when user selects a language to get translated words */
  handleOptionChange = selectedOption => {
    this.props.updateData("SET_SEARCHED_LANG", selectedOption);
  };

  getUnTranslatedWords = () => {
    const { activeForm, langsTable, orderedWords, searchedLang } = this.props;
    const data = [];
    langsTable[activeForm.id].map(item => {
      if (
        !orderedWords[`${activeForm.id}_${searchedLang.id}`][
          item.translation_id
        ]
      ) {
        data.push(item);
      } else {
        data.push("empty");
      }
      return null;
    });

    this.setState({ wordsAreFiltered: true });
    return data;
  };

  getAllWords = () => {
    const { activeForm, langsTable } = this.props;
    const data = langsTable[activeForm.id].map(item => {
      return item;
    });
    this.setState({ wordsAreFiltered: false });
    return data;
  };

  render = () => {
    const { activeForm, langsTable, searchedLang, orderedWords } = this.props;
    const action = this.state.wordsAreFiltered
      ? this.getAllWords
      : this.getUnTranslatedWords;
    const key = this.state.wordsAreFiltered ? "filteredWords" : "allWords";

    return (
      <ScrollSync>
        <div className="container">
          <h3 className="title_translator">
            Translator Tool
            <div
              className="sa-layoutToggler"
              onClick={() => this.props.updateData("SA-CLASS-TOGGLER")}
            ></div>
          </h3>
          <div className="translator-row">
            <div className="translation-tool">
              <h3 className="lang-title">
                Main language
                {activeForm && searchedLang && langsTable[activeForm.id] && (
                  <div
                    onClick={action}
                    className={
                      this.state.wordsAreFiltered
                        ? "filter-btn active"
                        : "filter-btn"
                    }
                  >
                    {icons.filterNav}
                  </div>
                )}
              </h3>
              <ScrollSyncPane>
                <div className="tree-wrapper">
                  {activeForm &&
                    langsTable &&
                    !this.state.wordsAreFiltered &&
                    langsTable[activeForm.id] &&
                    langsTable[activeForm.id].map((item, index) => {
                      return (
                        <div className="list-item" key={item.id}>
                          {item.content}
                        </div>
                      );
                    })}
                  {activeForm &&
                    langsTable &&
                    this.state.wordsAreFiltered &&
                    this.state[key] &&
                    langsTable[activeForm.id] &&
                    langsTable[activeForm.id].map((item, index) => {
                      if (
                        this.state[key][index] &&
                        this.state[key][index]["translation_id"] ===
                          item.translation_id
                      ) {
                        return (
                          <div className="list-item" key={item.id}>
                            {item.content}
                          </div>
                        );
                      }
                      return null;
                    })}

                  {!activeForm && (
                    <div className="no-active-item">
                      <h3>
                        <Translator string="noActiveItem" />
                      </h3>
                    </div>
                  )}
                </div>
              </ScrollSyncPane>
            </div>

            <div className="translation-tool">
              <h3 className="lang-title">
                Destination language
                <Select
                  className="lang-select"
                  options={this.state.options.length ? this.state.options : []}
                  onChange={this.handleOptionChange}
                  isDisabled={!activeForm}
                  value={searchedLang}
                />
              </h3>
              <ScrollSyncPane>
                <div className="tree-wrapper">
                  {activeForm &&
                    searchedLang &&
                    this.state[key] &&
                    orderedWords[`${activeForm.id}_${searchedLang.id}`] &&
                    this.state[key].map((item, i) => {
                      if (item === "empty") {
                        return null;
                      }
                      if (
                        orderedWords[`${activeForm.id}_${searchedLang.id}`][
                          item.translation_id
                        ]
                      ) {
                        return (
                          <TranslationListItem
                            {...orderedWords[
                              `${activeForm.id}_${searchedLang.id}`
                            ][item.translation_id]}
                            key={item.id}
                          />
                        );
                      }

                      return (
                        <TranslationListItem
                          content=""
                          key={`second_col_${i}`}
                          id={i}
                          translation_id={item.translation_id}
                        />
                      );
                    })}
                </div>
              </ScrollSyncPane>
            </div>
          </div>
        </div>
      </ScrollSync>
    );
  };
}

const mapStateToProps = state => {
  return {
    /* which form is selected now (to get it's words )*/
    activeForm: state.saForms.activeForm,
    /* object that keeps track of which forms have available data so don't ask for it again */
    langsTable: state.translation.langsTable,
    /* all languages in database */
    langs: state.translation.langs,
    searchedLang: state.translation.searchedLang,
    orderedWords: state.translation.orderedWords
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TranslationList);

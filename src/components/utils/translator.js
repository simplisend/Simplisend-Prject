import { connect } from "react-redux";
import translator from '../../funcs/translator' ;
/* takes the word that needs to be translated and translate it based on languages*/
/* languages is provided by langReducer */
const Translator = ({ string, titles }) => {
  const value = translator(string,titles) ;
  return value  ;
};

const mapStoreToProps = state => {
  return {
    titles: state.lang.titles
  };
};

export default connect(mapStoreToProps)(Translator);

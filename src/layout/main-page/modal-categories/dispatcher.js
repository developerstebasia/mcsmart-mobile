import {fetchListQuote} from '../../../store/defaultState/actions';

export default dispatch => ({
  fetchListQuote: (...args) => dispatch(fetchListQuote(...args)),
});

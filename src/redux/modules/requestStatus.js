import Axios from '../../api/axios';
import Redux from '../redux';

const initialState = {
  requestStatus: {
    getRequest: null,
    isStatusLoading: false,
    isStatusError: false,
  },
};

const axios = new Axios(process.env.REACT_APP_SERVER_URL);

export const __requestStatus = Redux.asyncThunk('REQUEST', payload =>
  axios.get(`/api/admin/requests?status=${payload.status}&page=${payload.page}`)
);

const requestStatusSlice = Redux.slice(
  'getRequest',
  initialState,
  {},
  bulider => {
    Redux.extraReducer(
      bulider,
      __requestStatus,
      'requestStatus',
      'isStatusLoading',
      'getRequest',
      'isStatusError'
    );
  }
);

export default requestStatusSlice.reducer;

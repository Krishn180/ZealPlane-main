import { SET_USER_ID, LOGOUT_USER } from "../actions/userActions";

// Initial state with userId and token
const initialState = {
  userId: null,
  token: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload.userId || state.userId, // Ensure userId is updated if provided
        token: action.payload.token || state.token, // Ensure token is updated if provided
      };

    case LOGOUT_USER:
      return initialState; // Reset state to the initial state on logout

    default:
      return state;
  }
};

export default userReducer;

// store.js

import { createStore } from 'redux';
import shoppingListReducer from './Reducers';

const store = createStore(shoppingListReducer);

export default store;

// reducers.js

import {
    ADD_SHOPPING_LIST,
    DELETE_SHOPPING_LIST,
    ADD_ITEM,
    DELETE_ITEM,
    EDIT_ITEM,
    TOGGLE_ITEM_PURCHASED,
    EDIT_SHOPPING_LIST_NAME,
  } from './Actions';
  
  const initialState = {
    shoppingLists: [],
  };
  
  const shoppingListReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_SHOPPING_LIST:
        return {
          ...state,
          shoppingLists: [
            ...state.shoppingLists,
            { id: Date.now(), name: action.payload, items: [] },
          ],
        };
      case DELETE_SHOPPING_LIST:
        return {
          ...state,
          shoppingLists: state.shoppingLists.filter(
            (list) => list.id !== action.payload
          ),
        };
      case ADD_ITEM:
        return {
          ...state,
          shoppingLists: state.shoppingLists.map((list) =>
            list.id === action.payload.listId
              ? {
                  ...list,
                  items: [
                    ...list.items,
                    {
                      id: Date.now(),
                      name: action.payload.item.name,
                      quantity: action.payload.item.quantity,
                      purchased: false,
                    },
                  ],
                }
              : list
          ),
        };
      case DELETE_ITEM:
        return {
          ...state,
          shoppingLists: state.shoppingLists.map((list) =>
            list.id === action.payload.listId
              ? {
                  ...list,
                  items: list.items.filter(
                    (item) => item.id !== action.payload.itemId
                  ),
                }
              : list
          ),
        };
      case EDIT_ITEM:
        return {
          ...state,
          shoppingLists: state.shoppingLists.map((list) =>
            list.id === action.payload.listId
              ? {
                  ...list,
                  items: list.items.map((item) =>
                    item.id === action.payload.itemId
                      ? { ...item, ...action.payload.updatedItem }
                      : item
                  ),
                }
              : list
          ),
        };
      case TOGGLE_ITEM_PURCHASED:
        return {
          ...state,
          shoppingLists: state.shoppingLists.map((list) =>
            list.id === action.payload.listId
              ? {
                  ...list,
                  items: list.items.map((item) =>
                    item.id === action.payload.itemId
                      ? { ...item, purchased: !item.purchased }
                      : item
                  ),
                }
              : list
          ),
        };
      case EDIT_SHOPPING_LIST_NAME:
        return {
          ...state,
          shoppingLists: state.shoppingLists.map((list) =>
            list.id === action.payload.id
              ? { ...list, name: action.payload.newName }
              : list
          ),
        };
      default:
        return state;
    }
  };
  
  export default shoppingListReducer;
  
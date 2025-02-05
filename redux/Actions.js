// actions.js

export const ADD_SHOPPING_LIST = "ADD_SHOPPING_LIST";
export const DELETE_SHOPPING_LIST = "DELETE_SHOPPING_LIST";
export const ADD_ITEM = "ADD_ITEM";
export const DELETE_ITEM = "DELETE_ITEM";
export const EDIT_ITEM = "EDIT_ITEM";
export const TOGGLE_ITEM_PURCHASED = "TOGGLE_ITEM_PURCHASED";
export const EDIT_SHOPPING_LIST_NAME = "EDIT_SHOPPING_LIST_NAME";

// Action creators
export const addShoppingList = (name) => ({
  type: ADD_SHOPPING_LIST,
  payload: name,
});

export const deleteShoppingList = (id) => ({
  type: DELETE_SHOPPING_LIST,
  payload: id,
});

export const addItem = (listId, item) => ({
  type: ADD_ITEM,
  payload: { listId, item },
});

export const deleteItem = (listId, itemId) => ({
  type: DELETE_ITEM,
  payload: { listId, itemId },
});

export const editItem = (listId, itemId, updatedItem) => ({
  type: EDIT_ITEM,
  payload: { listId, itemId, updatedItem },
});

export const toggleItemPurchased = (listId, itemId) => ({
  type: TOGGLE_ITEM_PURCHASED,
  payload: { listId, itemId },
});

export const editShoppingListName = (id, newName) => ({
    type: EDIT_SHOPPING_LIST_NAME,
    payload: { id, newName },
  });

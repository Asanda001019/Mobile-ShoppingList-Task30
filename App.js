import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, TextInput, CheckBox } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addShoppingList, 
  deleteShoppingList, 
  addItem, 
  deleteItem, 
  editItem, 
  toggleItemPurchased 
} from './redux/Actions';
import { Provider } from 'react-redux'; 
import store from './redux/Store'; 

const App = () => {
  const dispatch = useDispatch();
  const shoppingLists = useSelector((state) => state.shoppingLists);

  const [newShoppingListName, setNewShoppingListName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItem, setEditingItem] = useState({ name: '', quantity: '', purchased: false });

  const handleAddShoppingList = () => {
    if (newShoppingListName.trim()) {
      dispatch(addShoppingList(newShoppingListName));
      setNewShoppingListName('');
    }
  };

  const handleAddItem = (listId) => {
    if (newItemName.trim() && newItemQuantity.trim()) {
      const newItem = {
        name: newItemName,
        quantity: newItemQuantity,
        purchased: false, // Default to not purchased
      };
      dispatch(addItem(listId, newItem));
      setNewItemName('');
      setNewItemQuantity('');
    }
  };

  const handleDeleteItem = (listId, itemId) => {
    dispatch(deleteItem(listId, itemId));
  };

  const handleTogglePurchased = (listId, itemId) => {
    dispatch(toggleItemPurchased(listId, itemId));
  };

  const handleEditItem = (listId, itemId) => {
    if (editingItem.name && editingItem.quantity) {
      dispatch(editItem(listId, itemId, editingItem));
      setEditingItemId(null);
      setEditingItem({ name: '', quantity: '', purchased: false });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Shopping Lists</Text>
      <TextInput
        value={newShoppingListName}
        onChangeText={setNewShoppingListName}
        placeholder="New shopping list name"
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Add Shopping List" onPress={handleAddShoppingList} />

      <FlatList
        data={shoppingLists}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <Button title="Delete List" onPress={() => dispatch(deleteShoppingList(item.id))} />
            
            {/* Add Items to Shopping List */}
            <TextInput
              value={newItemName}
              onChangeText={setNewItemName}
              placeholder="Item Name"
              style={{ borderWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              value={newItemQuantity}
              onChangeText={setNewItemQuantity}
              placeholder="Quantity"
              style={{ borderWidth: 1, marginBottom: 10 }}
            />
            <Button title="Add Item" onPress={() => handleAddItem(item.id)} />

            <FlatList
              data={item.items}
              renderItem={({ item: listItem }) => (
                <View style={{ marginBottom: 10 }}>
                  {editingItemId === listItem.id ? (
                    <View>
                      <TextInput
                        value={editingItem.name}
                        onChangeText={(text) => setEditingItem({ ...editingItem, name: text })}
                        placeholder="Edit Item Name"
                        style={{ borderWidth: 1 }}
                      />
                      <TextInput
                        value={editingItem.quantity}
                        onChangeText={(text) => setEditingItem({ ...editingItem, quantity: text })}
                        placeholder="Edit Quantity"
                        style={{ borderWidth: 1 }}
                      />
                      <Button
                        title="Save"
                        onPress={() => handleEditItem(item.id, listItem.id)}
                      />
                    </View>
                  ) : (
                    <View>
                      <Text>{listItem.name} ({listItem.quantity})</Text>
                      <CheckBox
                        value={listItem.purchased}
                        onValueChange={() => handleTogglePurchased(item.id, listItem.id)}
                      />
                      <Button
                        title="Edit Item"
                        onPress={() => {
                          setEditingItemId(listItem.id);
                          setEditingItem(listItem);
                        }}
                      />
                      <Button
                        title="Delete Item"
                        onPress={() => handleDeleteItem(item.id, listItem.id)}
                      />
                    </View>
                  )}
                </View>
              )}
              keyExtractor={(listItem) => listItem.id.toString()}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const AppWithProvider = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppWithProvider;

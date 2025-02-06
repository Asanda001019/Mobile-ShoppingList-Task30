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

  // State to manage inputs per shopping list (for items)
  const [inputs, setInputs] = useState({});
  const [editingItem, setEditingItem] = useState(null);

  // State to manage the name input for the new shopping list
  const [newShoppingListName, setNewShoppingListName] = useState('');

  // Helper function to handle input changes per shopping list
  const handleInputChange = (listId, field, value) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [listId]: {
        ...prevInputs[listId],
        [field]: value,
      },
    }));
  };

  const handleAddShoppingList = () => {
    if (newShoppingListName.trim()) {
      dispatch(addShoppingList(newShoppingListName));
      setNewShoppingListName(''); // Clear input after adding a new shopping list
    }
  };

  const handleAddItem = (listId) => {
    const { name, quantity } = inputs[listId] || {};
    if (name && quantity) {
      const newItem = {
        id: Date.now(),  // Unique id for each item
        name,
        quantity,
        purchased: false, // Default to not purchased
      };
      dispatch(addItem(listId, newItem));
      // Clear the inputs after adding the item
      setInputs((prevInputs) => ({
        ...prevInputs,
        [listId]: { name: '', quantity: '' },
      }));
    }
  };

  const handleDeleteItem = (listId, itemId) => {
    dispatch(deleteItem(listId, itemId));
  };

  const handleTogglePurchased = (listId, itemId) => {
    dispatch(toggleItemPurchased(listId, itemId));
  };

  const handleEditItem = (listId, itemId) => {
    const { name, quantity } = inputs[listId] || {};
    if (name && quantity) {
      dispatch(editItem(listId, itemId, { name, quantity }));
      setEditingItem(null); // Reset editing state
      setInputs((prevInputs) => ({
        ...prevInputs,
        [listId]: { name: '', quantity: '' },
      }));
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Shopping Lists</Text>

      {/* Input for adding new shopping list */}
      <TextInput
        value={newShoppingListName}
        onChangeText={setNewShoppingListName}
        placeholder="Enter shopping list name"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
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
              value={inputs[item.id]?.name || ''}
              onChangeText={(text) => handleInputChange(item.id, 'name', text)}
              placeholder="Item Name"
              style={{ borderWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              value={inputs[item.id]?.quantity || ''}
              onChangeText={(text) => handleInputChange(item.id, 'quantity', text)}
              placeholder="Quantity"
              style={{ borderWidth: 1, marginBottom: 10 }}
            />
            <Button title="Add Item" onPress={() => handleAddItem(item.id)} />

            <FlatList
              data={item.items}
              renderItem={({ item: listItem }) => (
                <View style={{ marginBottom: 10 }}>
                  <Text>{listItem.name} ({listItem.quantity})</Text>
                  <CheckBox
                    value={listItem.purchased}
                    onValueChange={() => handleTogglePurchased(item.id, listItem.id)}
                  />
                  {editingItem?.id === listItem.id && editingItem.listId === item.id ? (
                    <View>
                      <TextInput
                        value={inputs[item.id]?.name || ''}
                        onChangeText={(text) => handleInputChange(item.id, 'name', text)}
                        placeholder="Edit Name"
                        style={{ borderWidth: 1, marginBottom: 10 }}
                      />
                      <TextInput
                        value={inputs[item.id]?.quantity || ''}
                        onChangeText={(text) => handleInputChange(item.id, 'quantity', text)}
                        placeholder="Edit Quantity"
                        style={{ borderWidth: 1, marginBottom: 10 }}
                      />
                      <Button
                        title="Save Changes"
                        onPress={() => handleEditItem(item.id, listItem.id)}
                      />
                      <Button title="Cancel" onPress={() => setEditingItem(null)} />
                    </View>
                  ) : (
                    <Button
                      title="Edit Item"
                      onPress={() => {
                        setEditingItem({ id: listItem.id, listId: item.id });
                        setInputs((prevInputs) => ({
                          ...prevInputs,
                          [item.id]: { name: listItem.name, quantity: listItem.quantity },
                        }));
                      }}
                    />
                  )}
                  <Button
                    title="Delete Item"
                    onPress={() => handleDeleteItem(item.id, listItem.id)}
                  />
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

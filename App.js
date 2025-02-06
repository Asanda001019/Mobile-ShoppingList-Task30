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

  // State to manage the input values for adding new items
  const [inputs, setInputs] = useState({}); // Stores inputs for each shopping list
  const [editingItem, setEditingItem] = useState(null); // Tracks which item is being edited
  const [newShoppingListName, setNewShoppingListName] = useState(''); // For adding new shopping lists

  // Function to handle input changes for each shopping list
  const handleInputChange = (listId, field, value) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [listId]: {
        ...prevInputs[listId],
        [field]: value,
      },
    }));
  };

  // Add a new shopping list
  const handleAddShoppingList = () => {
    if (newShoppingListName.trim()) {
      dispatch(addShoppingList(newShoppingListName));
      setNewShoppingListName(''); // Clear input after adding the shopping list
    }
  };

  // Add a new item to a shopping list
  const handleAddItem = (listId) => {
    const { name, quantity } = inputs[listId] || {};
    if (name && quantity) {
      const newItem = {
        id: Date.now(),
        name,
        quantity,
        purchased: false,
      };
      dispatch(addItem(listId, newItem));
      setInputs((prevInputs) => ({
        ...prevInputs,
        [listId]: { name: '', quantity: '' },
      }));
    }
  };

  // Toggle the purchased status of an item
  const handleTogglePurchased = (listId, itemId) => {
    dispatch(toggleItemPurchased(listId, itemId));
  };

  // Delete an item from the shopping list
  const handleDeleteItem = (listId, itemId) => {
    dispatch(deleteItem(listId, itemId));
  };

  // Save changes made to an item (editing)
  const handleEditItem = (listId, itemId) => {
    const { name, quantity } = inputs[listId] || {};
    if (name && quantity) {
      const updatedItem = {
        name,
        quantity,
      };
      dispatch(editItem(listId, itemId, updatedItem));
      setEditingItem(null); // Close editing form
      setInputs((prevInputs) => ({
        ...prevInputs,
        [listId]: { name: '', quantity: '' }, // Clear input after save
      }));
    }
  };

  // Set inputs for editing an item
  const handleEditButtonPress = (listId, item) => {
    setEditingItem({ listId, itemId: item.id });
    setInputs((prevInputs) => ({
      ...prevInputs,
      [listId]: { name: item.name, quantity: item.quantity },
    }));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Shopping Lists</Text>

      {/* Input for adding a new shopping list */}
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

            {/* Add New Item Form: Only show if not editing */}
            {editingItem?.listId !== item.id && (
              <View>
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
              </View>
            )}

            {/* Display Items in the Shopping List */}
            <FlatList
              data={item.items}
              renderItem={({ item: listItem }) => (
                <View style={{ marginBottom: 10 }}>
                  <Text>{listItem.name} ({listItem.quantity})</Text>
                  <CheckBox
                    value={listItem.purchased}
                    onValueChange={() => handleTogglePurchased(item.id, listItem.id)}
                  />
                  {editingItem?.itemId === listItem.id && editingItem.listId === item.id ? (
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
                      onPress={() => handleEditButtonPress(item.id, listItem)}
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

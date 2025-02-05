// App.js
import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addShoppingList, deleteShoppingList, editShoppingListName } from './redux/Actions';
import { Provider } from 'react-redux'; // Import the Provider
import store from './redux/Store'; // Import the store

const App = () => {
  const dispatch = useDispatch();
  const shoppingLists = useSelector((state) => state.shoppingLists);

  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');

  const handleAddShoppingList = () => {
    dispatch(addShoppingList("New List"));
  };

  const handleDeleteShoppingList = (id) => {
    dispatch(deleteShoppingList(id));
  };

  const handleEditShoppingListName = (id) => {
    if (newName.trim()) {
      dispatch(editShoppingListName(id, newName)); // Dispatch the action to update the name
      setEditingId(null); // Stop editing after update
      setNewName(''); // Clear the input field
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Shopping Lists</Text>
      <Button title="Add Shopping List" onPress={handleAddShoppingList} />
      
      <FlatList
        data={shoppingLists}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            {editingId === item.id ? (
              <View>
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Enter new name"
                  style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    padding: 5,
                    marginBottom: 10,
                    borderRadius: 5,
                  }}
                />
                <Button
                  title="Save"
                  onPress={() => handleEditShoppingListName(item.id)}
                />
                <Button title="Cancel" onPress={() => setEditingId(null)} />
              </View>
            ) : (
              <View>
                <TouchableOpacity>
                  <Text style={{ fontSize: 18 }}>{item.name}</Text>
                </TouchableOpacity>
                <Button
                  title="Edit Name"
                  onPress={() => {
                    setEditingId(item.id);
                    setNewName(item.name);  // Pre-fill the input with the current name
                  }}
                />
                <Button title="Delete" onPress={() => handleDeleteShoppingList(item.id)} />
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

// Wrap your app with the Provider and pass in the store
const AppWithProvider = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppWithProvider;

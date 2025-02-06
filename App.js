import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput, CheckBox, StyleSheet } from 'react-native';
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

  const [inputs, setInputs] = useState({}); 
  const [editingItem, setEditingItem] = useState(null); 
  const [newShoppingListName, setNewShoppingListName] = useState('');

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
      setNewShoppingListName('');
    }
  };

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

  const handleTogglePurchased = (listId, itemId) => {
    dispatch(toggleItemPurchased(listId, itemId));
  };

  const handleDeleteItem = (listId, itemId) => {
    dispatch(deleteItem(listId, itemId));
  };

  const handleEditItem = (listId, itemId) => {
    const { name, quantity } = inputs[listId] || {};
    if (name && quantity) {
      const updatedItem = {
        name,
        quantity,
      };
      dispatch(editItem(listId, itemId, updatedItem));
      setEditingItem(null);
      setInputs((prevInputs) => ({
        ...prevInputs,
        [listId]: { name: '', quantity: '' },
      }));
    }
  };

  const handleEditButtonPress = (listId, item) => {
    setEditingItem({ listId, itemId: item.id });
    setInputs((prevInputs) => ({
      ...prevInputs,
      [listId]: { name: item.name, quantity: item.quantity },
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Lists</Text>

      {/* Input for adding a new shopping list */}
      <TextInput
        value={newShoppingListName}
        onChangeText={setNewShoppingListName}
        placeholder="Enter shopping list name"
        style={styles.input}
      />
      <Button title="Add Shopping List" onPress={handleAddShoppingList} />

      {/* Shopping Lists */}
      <FlatList
        data={shoppingLists}
        renderItem={({ item }) => (
          <View style={styles.shoppingListCard}>
            <Text style={styles.shoppingListName}>{item.name}</Text>
            <Button title="Delete List" onPress={() => dispatch(deleteShoppingList(item.id))} />

            {/* Add New Item Form: Only show if not editing */}
            {editingItem?.listId !== item.id && (
              <View style={styles.itemForm}>
                <TextInput
                  value={inputs[item.id]?.name || ''}
                  onChangeText={(text) => handleInputChange(item.id, 'name', text)}
                  placeholder="Item Name"
                  style={styles.input}
                />
                <TextInput
                  value={inputs[item.id]?.quantity || ''}
                  onChangeText={(text) => handleInputChange(item.id, 'quantity', text)}
                  placeholder="Quantity"
                  style={styles.input}
                />
                <Button title="Add Item" onPress={() => handleAddItem(item.id)} />
              </View>
            )}

            {/* Display Items in the Shopping List (arranged horizontally) */}
            <View style={styles.itemsContainer}>
              <FlatList
                data={item.items}
                horizontal
                renderItem={({ item: listItem }) => (
                  <View style={styles.itemCard}>
                    <Text style={styles.itemText}>{listItem.name} ({listItem.quantity})</Text>
                    
                    {/* Adjust the checkbox size and spacing */}
                    <CheckBox
                      value={listItem.purchased}
                      onValueChange={() => handleTogglePurchased(item.id, listItem.id)}
                      style={styles.checkbox}
                    />
                    
                    {/* Space between checkbox and buttons */}
                    <View style={styles.buttonsContainer}>
                      {editingItem?.itemId === listItem.id && editingItem.listId === item.id ? (
                        <View style={styles.editForm}>
                          <TextInput
                            value={inputs[item.id]?.name || ''}
                            onChangeText={(text) => handleInputChange(item.id, 'name', text)}
                            placeholder="Edit Name"
                            style={styles.input}
                          />
                          <TextInput
                            value={inputs[item.id]?.quantity || ''}
                            onChangeText={(text) => handleInputChange(item.id, 'quantity', text)}
                            placeholder="Edit Quantity"
                            style={styles.input}
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
                      
                      {/* Space between Edit and Delete buttons */}
                      <View style={styles.buttonSpacing} />
                      <Button
                        title="Delete Item"
                        onPress={() => handleDeleteItem(item.id, listItem.id)}
                      />
                    </View>
                  </View>
                )}
                keyExtractor={(listItem) => listItem.id.toString()}
              />
            </View>
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  shoppingListCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  shoppingListName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemForm: {
    marginBottom: 20,
  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  itemCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  checkbox: {
    marginBottom: 10, // Space between checkbox and other buttons
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], // Increase the checkbox size
  },
  buttonsContainer: {
    marginTop: 10, // Add space between the checkbox and buttons
  },
  editForm: {
    marginBottom: 10,
  },
  buttonSpacing: {
    marginBottom: 10, // Adds space between the Edit and Delete buttons
  },
});

export default AppWithProvider;

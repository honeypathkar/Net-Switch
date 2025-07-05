import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const App = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
      }}
    >
      <Text style={{ fontSize: 40 }}>App</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});

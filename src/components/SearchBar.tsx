import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      accessible={true}
      accessibilityRole="search"
      accessibilityLabel="شريط البحث"
    >
      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        placeholder="ابحث عن فيديو..."
        placeholderTextColor={theme.colors.textSecondary}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        accessible={true}
        accessibilityLabel="حقل البحث عن الفيديوهات"
        accessibilityHint="اكتب كلمات البحث هنا"
      />
      <TouchableOpacity
        onPress={handleSearch}
        style={styles.searchButton}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="زر البحث"
        accessibilityHint="انقر للبحث عن الفيديوهات"
      >
        <Ionicons name="search" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 25,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
  },
  searchButton: {
    marginLeft: 8,
  },
});

export default SearchBar;

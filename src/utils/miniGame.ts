import { MiniGameQuestion } from '../types/miniGame';

export const MINIGAME_QUESTION_BANK: ReadonlyArray<MiniGameQuestion> = [
  {
    id: 'rn-import-view',
    prompt: 'import React, { useState } from "___";',
    options: ['react', 'react-native', 'react-dom', 'expo'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-import-comp',
    prompt: 'import { ___ } from "react-native";',
    options: ['Text, View', 'Button, Browser', 'StyleSheet, Navigator', 'ImagePicker, KeyboardAvoidingView'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-component-tag',
    prompt: 'function App() { return (<___><Text>Hello</Text></___>); }',
    options: ['Text', 'View', 'SafeAreaView', 'FlatList'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-state',
    prompt: 'const [score, setScore] = React.___(0);',
    options: ['useContext', 'useRef', 'useMemo', 'useState'],
    correctOptionIndex: 3,
  },
  {
    id: 'rn-style',
    prompt: 'const styles = StyleSheet.create({ container: { margin: ___, padding: 16 } });',
    options: ['10', '"10"', 'none', 'auto'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-touchable',
    prompt: '___ onPress={() => {}} style={styles.button}>',
    options: ['<Button', '<Pressable', '<TouchableOpacity', '<TouchableOpacity>'],
    correctOptionIndex: 2,
  },
  {
    id: 'rn-flatlist',
    prompt: '___\n  data={[1,2,3]}\n  renderItem={({ item }) => <Text>{item}</Text>}\n/>',
    options: ['<FlatList', '<ScrollView', '<SectionList', '<ListView'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-conditional',
    prompt: 'return hunger > 50 ? <Text>Full</Text> : ___;',
    options: ['"Hungry"', '<Text>Hungry</Text>', '{() => <Text>Hungry</Text>}', '<Hungry />'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-props',
    prompt: 'function Greeting(___) { return <Text>Hello {name}</Text>; }',
    options: ['{ name }', '{props}', 'props.name', '[props]'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-useeffect',
    prompt: 'React.___(() => { loadData(); }, [count]);',
    options: ['state', 'useCallback', 'useEffect', 'useReducer'],
    correctOptionIndex: 2,
  },
  {
    id: 'rn-textinput',
    prompt: '<TextInput ___ onChangeText={setName} />',
    options: ['placeholder', 'onPress', 'onLoad', 'href'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-scroll',
    prompt: '___ horizontal={true} showsHorizontalScrollIndicator={false}',
    options: ['<ScrollView', '<FlatList', '<SectionList', '<Image'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-key-prop',
    prompt: '{ items.map(item => <Text key="___">{item}</Text>) }',
    options: ['index', 'item.id', 'item.title', 'item.key'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-image',
    prompt: '<Image source={{ uri: ___ }} />',
    options: ['url', 'path', '"https://example.com/cat.png"', 'img'],
    correctOptionIndex: 2,
  },
  {
    id: 'rn-safe-area',
    prompt: 'import { SafeAreaView } from "react-native";\n\n<___ style={styles.container}>',
    options: ['SafeAreaView', 'View', 'Screen', 'Container'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-activity-indicator',
    prompt: '<ActivityIndicator size="___" color="#000" />',
    options: ['small', 'large', 'x-small', 'bold'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-button-title',
    prompt: '<Button title="Play" ___ onPress={handlePlay} />',
    options: ['onPress', 'source', 'style', 'children'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-modal',
    prompt: '<Modal visible={isOpen} animationType="___">',
    options: ['fade', 'zoom', 'slide', 'none'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-flex-style',
    prompt: '<View style={{ flex: ___ }}>',
    options: ['1', 'true', '100', 'auto'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-touchable-press',
    prompt: '<TouchableOpacity ___={handlePress}>',
    options: ['onPress', 'onClick', 'onTap', 'onPressInOnly'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-refreshcontrol',
    prompt: '<FlatList ___={fetchData} refreshing={isLoading} />',
    options: ['onRefresh', 'onUpdate', 'onChange', 'onStart'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-usememo-obj',
    prompt: 'const value = React.___(() => expensiveCalc(a, b), [a, b]);',
    options: ['memo', 'useEffect', 'useMemo', 'useCallback'],
    correctOptionIndex: 2,
  },
  {
    id: 'rn-usecallback',
    prompt: 'const handlePress = React.___(() => setCount(c => c + 1), [count]);',
    options: ['useEffect', 'useMemo', 'useState', 'useCallback'],
    correctOptionIndex: 3,
  },
  {
    id: 'rn-useref',
    prompt: 'const timerRef = React.___(null);',
    options: ['useState', 'useReducer', 'useRef', 'useMemo'],
    correctOptionIndex: 2,
  },
  {
    id: 'rn-context',
    prompt: 'const MyCtx = React.___();',
    options: ['createContext', 'createState', 'newContext', 'useContext'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-usereducer',
    prompt: 'const [state, dispatch] = React.___(reducer, initialState);',
    options: ['useMemo', 'useReducer', 'useEffect', 'useContext'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-effect-deps-empty',
    prompt: 'useEffect(() => { sync(); }, ___);',
    options: ['null', '[]', '[state]', 'undefined'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-gesture-handler',
    prompt: '<View ___={styles.container}>',
    options: ['className', 'style', 'css', 'theme'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-perf-flatlist',
    prompt: 'keyExtractor={(item) => ___}',
    options: ['item.key', 'item', 'item.id.toString()', 'item["id"] = ""'],
    correctOptionIndex: 2,
  },
  {
    id: 'rn-view-style',
    prompt: '<View style={___}>',
    options: ['{ styles.box }', 'styles.box', 'StyleSheet.box', 'style={styles.box}'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-text-style',
    prompt: '<Text style={___}>Pet</Text>',
    options: ['styles.text', '{styles.text}', 'style={styles.text}', 'className="text"'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-button-onpress',
    prompt: '<Button ___="Save" onPress={save} />',
    options: ['label', 'title', 'value', 'text'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-scroll-refresh',
    prompt: '<ScrollView ___>',
    options: ['refreshControl', 'keyboardDismissMode', 'alwaysBounceVertical', 'showsVerticalScrollIndicator'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-statusbar-style',
    prompt: '<StatusBar barStyle="___" />',
    options: ['dark-content', 'medium-content', 'light', 'black'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-switch',
    prompt: '<Switch value={isOn} onValueChange={setIsOn} ___={isEnabled} />',
    options: ['trackColor', 'thumbTintColor', 'onTintColor', 'disabled'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-switch-value',
    prompt: '<Switch ___={isEnabled} />',
    options: ['onValueChange', 'value', 'onChange', 'status'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-activity',
    prompt: '<ActivityIndicator ___ animating={true} />',
    options: ['size', 'isAnimating', 'playing', 'active'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-pressable',
    prompt: '<Pressable ___={handlePress}>',
    options: ['onClick', 'onPress', 'onTap', 'press'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-safearia',
    prompt: '<SafeAreaView ___={styles.safe}>',
    options: ['style', 'className', 'layout', 'position'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-dimensions',
    prompt: 'const width = Dimensions.get(\'window\').___;',
    options: ['height', 'width', 'screen', 'length'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-dimensions-height',
    prompt: 'const h = Dimensions.get("window").___;',
    options: ['height', 'size', 'length', 'top'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-platform',
    prompt: 'import { Platform } from "react-native";\nconst isIos = Platform.___ === "ios";',
    options: ['OS', 'Name', 'Type', 'Platform'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-platform-os',
    prompt: 'if (Platform.___ === "android") { }',
    options: ['OS', 'Version', 'Style', 'OSName'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-aliases',
    prompt: 'import { useState as ___ } from "react";',
    options: ['createState', 'state', 'useStateAlias', 'useS'],
    correctOptionIndex: 2,
  },
  {
    id: 'rn-alert',
    prompt: 'Alert.___("Title", "Message");',
    options: ['warn', 'alert', 'notify', 'toast'],
    correctOptionIndex: 1,
  },
  {
    id: 'rn-alert-title',
    prompt: 'Alert.alert("Hello", "World", [{ text: "OK" }]);',
    options: ['alert', 'notify', 'show', 'toast'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-flex-wrap',
    prompt: 'style={{ flexDirection: ___ }}',
    options: ['row', 'column', 'both', 'absolute'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-justify',
    prompt: 'style={{ justifyContent: ___ }}',
    options: ['center', 'middle', 'top', 'baseline'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-align',
    prompt: 'style={{ alignItems: ___ }}',
    options: ['center', 'stretch', 'top', 'left'],
    correctOptionIndex: 0,
  },
  {
    id: 'rn-border-radius',
    prompt: 'style={{ borderRadius: ___ }}',
    options: ['12', '12px', '12em', 'twelve'],
    correctOptionIndex: 0,
  },
];

const shuffle = <T,>(items: T[]) => {
  const cloned = [...items];
  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = cloned[index];
    cloned[index] = cloned[randomIndex];
    cloned[randomIndex] = current;
  }

  return cloned;
};

const DEFAULT_QUESTIONS_PER_RUN = 8;

export const getMiniGameQuestionCount = () => MINIGAME_QUESTION_BANK.length;

export const getMiniGameDeck = (alreadySeenQuestionIds: string[] = [], count = DEFAULT_QUESTIONS_PER_RUN) => {
  const seen = new Set(alreadySeenQuestionIds);
  const normalizedCount = Math.max(1, Math.min(count, MINIGAME_QUESTION_BANK.length));
  const unseenQuestions = MINIGAME_QUESTION_BANK.filter(question => !seen.has(question.id));
  const shuffledUnseen = shuffle(unseenQuestions);

  if (shuffledUnseen.length >= normalizedCount) {
    return shuffledUnseen.slice(0, normalizedCount);
  }

  const seenQuestions = MINIGAME_QUESTION_BANK.filter(question => seen.has(question.id));
  const shuffledSeen = shuffle(seenQuestions);
  const combined = [...shuffledUnseen, ...shuffledSeen];

  return combined.slice(0, normalizedCount);
};



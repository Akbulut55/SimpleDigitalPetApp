import { MiniGameQuestion } from '../types/miniGame';

const question = (
  id: string,
  prompt: string,
  options: string[],
  correctOptionIndex: number,
  explanation: string,
): MiniGameQuestion => ({
  id,
  prompt,
  options,
  correctOptionIndex,
  explanation,
});

export const MINIGAME_QUESTION_BANK: ReadonlyArray<MiniGameQuestion> = [
  question('rn-import-react', 'import React, { useState } from "___";', ['react', 'react-native', 'react-dom', 'expo'], 0, 'Hooks like useState come from the React package, not from react-native.'),
  question('rn-import-components', 'import { ___ } from "react-native";', ['Text, View', 'Button, Browser', 'StyleSheet, Navigator', 'ImagePicker, KeyboardAvoidingView'], 0, 'Core UI building blocks such as Text and View are exported from react-native.'),
  question('rn-view-wrapper', 'function App() { return (<___><Text>Hello</Text></___>); }', ['Text', 'View', 'SafeAreaView', 'FlatList'], 1, 'View is the standard container component used to wrap layout and child elements.'),
  question('rn-usestate-basic', 'const [score, setScore] = React.___(0);', ['useContext', 'useRef', 'useMemo', 'useState'], 3, 'useState creates local component state and returns the state value plus its setter.'),
  question('rn-style-number', 'const styles = StyleSheet.create({ container: { margin: ___, padding: 16 } });', ['10', '"10"', 'none', 'auto'], 0, 'React Native numeric style values are usually plain numbers, not CSS strings like "10px".'),
  question('rn-touchable-open', '___ onPress={() => {}} style={styles.button}>', ['<Button', '<Pressable', '<TouchableOpacity', '<TouchableOpacity>'], 2, 'The opening tag needs to be <TouchableOpacity before the rest of the props and closing bracket.'),
  question('rn-flatlist', '___\n  data={[1,2,3]}\n  renderItem={({ item }) => <Text>{item}</Text>}\n/>', ['<FlatList', '<ScrollView', '<SectionList', '<ListView'], 0, 'FlatList is the standard performant component for rendering long repeated data.'),
  question('rn-conditional-text', 'return hunger > 50 ? <Text>Full</Text> : ___;', ['"Hungry"', '<Text>Hungry</Text>', '{() => <Text>Hungry</Text>}', '<Hungry />'], 1, 'When you are already returning JSX, both branches should return valid JSX elements.'),
  question('rn-props-destructure', 'function Greeting(___) { return <Text>Hello {name}</Text>; }', ['{ name }', '{props}', 'props.name', '[props]'], 0, 'Destructuring { name } lets you use the prop directly as name inside the function body.'),
  question('rn-useeffect-call', 'React.___(() => { loadData(); }, [count]);', ['state', 'useCallback', 'useEffect', 'useReducer'], 2, 'useEffect runs side effects such as fetching data or syncing with APIs.'),
  question('rn-textinput-placeholder', '<TextInput ___ onChangeText={setName} />', ['placeholder', 'onPress', 'onLoad', 'href'], 0, 'placeholder displays hint text before the user types anything.'),
  question('rn-scroll-horizontal', '___ horizontal={true} showsHorizontalScrollIndicator={false}', ['<ScrollView', '<FlatList', '<SectionList', '<Image'], 0, 'ScrollView supports horizontal scrolling directly through the horizontal prop.'),
  question('rn-key-prop', '{items.map(item => <Text key={___}>{item.name}</Text>)}', ['index', 'item.id', 'item.title', 'item'], 1, 'A stable unique key such as item.id helps React track items correctly between renders.'),
  question('rn-image-uri', '<Image source={{ uri: ___ }} />', ['url', 'path', '"https://example.com/cat.png"', 'img'], 2, 'The uri field should be a string URL pointing to the remote image.'),
  question('rn-safe-area-component', 'import { SafeAreaView } from "react-native";\n\n<___ style={styles.container}>', ['SafeAreaView', 'View', 'Screen', 'Container'], 0, 'SafeAreaView helps place content inside safe screen boundaries on supported devices.'),
  question('rn-activity-size', '<ActivityIndicator size="___" color="#000" />', ['small', 'large', 'x-small', 'bold'], 1, 'large is a valid built-in string size for ActivityIndicator.'),
  question('rn-button-onpress', '<Button title="Play" ___={handlePlay} />', ['onPress', 'source', 'style', 'children'], 0, 'Button uses onPress to handle taps.'),
  question('rn-modal-fade', '<Modal visible={isOpen} animationType="___">', ['fade', 'zoom', 'slide', 'none'], 0, 'fade is one of the valid Modal animationType values.'),
  question('rn-flex-1', '<View style={{ flex: ___ }}>', ['1', 'true', '100', 'auto'], 0, 'flex: 1 tells the view to expand and fill the available space.'),
  question('rn-touchable-onpress', '<TouchableOpacity ___={handlePress}>', ['onPress', 'onClick', 'onTap', 'onPressInOnly'], 0, 'TouchableOpacity uses onPress, not web-specific event names like onClick.'),
  question('rn-flatlist-refresh', '<FlatList ___={fetchData} refreshing={isLoading} />', ['onRefresh', 'onUpdate', 'onChange', 'onStart'], 0, 'onRefresh is the prop used for pull-to-refresh behavior on FlatList.'),
  question('rn-usememo', 'const value = React.___(() => expensiveCalc(a, b), [a, b]);', ['memo', 'useEffect', 'useMemo', 'useCallback'], 2, 'useMemo memoizes a computed value so it is only recalculated when dependencies change.'),
  question('rn-usecallback', 'const handlePress = React.___(() => setCount(c => c + 1), []);', ['useEffect', 'useMemo', 'useState', 'useCallback'], 3, 'useCallback memoizes a function reference, which helps when passing callbacks to children.'),
  question('rn-useref', 'const timerRef = React.___(null);', ['useState', 'useReducer', 'useRef', 'useMemo'], 2, 'useRef stores a mutable value that persists across renders without causing re-renders.'),
  question('rn-context-create', 'const ThemeContext = React.___();', ['createContext', 'createState', 'newContext', 'useContext'], 0, 'createContext creates a context object that can be provided and consumed in the component tree.'),
  question('rn-usereducer', 'const [state, dispatch] = React.___(reducer, initialState);', ['useMemo', 'useReducer', 'useEffect', 'useContext'], 1, 'useReducer is useful when state transitions are more complex than a few simple setters.'),
  question('rn-effect-empty-deps', 'useEffect(() => { sync(); }, ___);', ['null', '[]', '[state]', 'undefined'], 1, 'An empty dependency array means the effect runs once after the initial render.'),
  question('rn-view-style-prop', '<View ___={styles.container}>', ['className', 'style', 'css', 'theme'], 1, 'React Native uses the style prop rather than CSS class names.'),
  question('rn-keyextractor', 'keyExtractor={(item) => ___}', ['item.key', 'item', 'item.id.toString()', 'item["id"] = ""'], 2, 'FlatList keyExtractor should return a stable string key, so id.toString() is common.'),
  question('rn-style-reference', '<View style={___}>', ['{ styles.box }', 'styles.box', 'StyleSheet.box', 'style={styles.box}'], 1, 'When a style object already exists, pass it directly as styles.box.'),
  question('rn-text-style', '<Text style={___}>Pet</Text>', ['styles.text', '{styles.text}', 'style={styles.text}', 'className="text"'], 0, 'Inside JSX braces, you pass the style object directly as styles.text.'),
  question('rn-button-title', '<Button ___="Save" onPress={save} />', ['label', 'title', 'value', 'text'], 1, 'Button uses title for the displayed label text.'),
  question('rn-scroll-refreshcontrol', '<ScrollView ___={refreshControlElement}>', ['refreshControl', 'keyboardDismissMode', 'alwaysBounceVertical', 'showsVerticalScrollIndicator'], 0, 'ScrollView can receive a RefreshControl instance through the refreshControl prop.'),
  question('rn-statusbar-style', '<StatusBar barStyle="___" />', ['dark-content', 'medium-content', 'light', 'black'], 0, 'dark-content and light-content are the valid common barStyle values.'),
  question('rn-switch-thumb', '<Switch value={isOn} onValueChange={setIsOn} ___="#fff" />', ['trackColor', 'thumbColor', 'onTintColor', 'selectedColor'], 1, 'thumbColor changes the movable thumb color on the Switch component.'),
  question('rn-switch-value', '<Switch ___={isEnabled} />', ['onValueChange', 'value', 'onChange', 'status'], 1, 'The value prop controls whether the Switch is on or off.'),
  question('rn-activity-prop', '<ActivityIndicator ___="small" animating={true} />', ['size', 'isAnimating', 'playing', 'active'], 0, 'size controls the ActivityIndicator size.'),
  question('rn-pressable-onpress', '<Pressable ___={handlePress}>', ['onClick', 'onPress', 'onTap', 'press'], 1, 'Pressable handles taps through onPress.'),
  question('rn-safearea-style', '<SafeAreaView ___={styles.safe}>', ['style', 'className', 'layout', 'position'], 0, 'Like other React Native components, SafeAreaView uses the style prop.'),
  question('rn-dimensions-width', 'const width = Dimensions.get("window").___;', ['height', 'width', 'screen', 'length'], 1, 'Dimensions.get("window") returns an object with width and height.'),
  question('rn-dimensions-height', 'const h = Dimensions.get("window").___;', ['height', 'size', 'length', 'top'], 0, 'height is the correct property for screen height from Dimensions.get("window").'),
  question('rn-platform-os', 'const isIos = Platform.___ === "ios";', ['OS', 'Name', 'Type', 'Platform'], 0, 'Platform.OS returns the current platform string such as ios or android.'),
  question('rn-platform-android', 'if (Platform.___ === "android") { }', ['OS', 'Version', 'Style', 'OSName'], 0, 'Platform.OS is the field used to branch for Android or iOS.'),
  question('rn-import-alias', 'import { useState as ___ } from "react";', ['createState', 'state', 'useStateAlias', 'useS'], 3, 'You can rename imports with as, and the alias can be any valid identifier like useS.'),
  question('rn-alert-alert', 'Alert.___("Title", "Message");', ['warn', 'alert', 'notify', 'toast'], 1, 'Alert.alert is the built-in helper for showing native alert dialogs.'),
  question('rn-flex-direction', 'style={{ flexDirection: ___ }}', ['row', 'column', 'both', 'absolute'], 0, 'row lays children out horizontally from left to right.'),
  question('rn-justify-center', 'style={{ justifyContent: ___ }}', ['center', 'middle', 'top', 'baseline'], 0, 'justifyContent controls alignment on the main axis, and center is a valid value.'),
  question('rn-align-center', 'style={{ alignItems: ___ }}', ['center', 'stretch', 'top', 'left'], 0, 'alignItems controls alignment on the cross axis, and center is valid.'),
  question('rn-border-radius', 'style={{ borderRadius: ___ }}', ['12', '12px', '12em', 'twelve'], 0, 'React Native borderRadius values are numbers, not CSS units.'),
  question('rn-state-setter', 'setCount(prev => prev + ___);', ['"1"', '1', 'true', 'count'], 1, 'Functional updates are useful when the next state depends on the previous state value.'),
  question('rn-children-prop', 'function Card({ ___ }) { return <View>{children}</View>; }', ['items', 'children', 'content', 'nodes'], 1, 'children contains whatever JSX was nested inside the component when it was used.'),
  question('rn-export-default', 'export ___ function App() { return <View />; }', ['const', 'named', 'default', 'primary'], 2, 'default marks the module’s default export so it can be imported without curly braces.'),
  question('rn-import-useeffect', 'import React, { useState, ___ } from "react";', ['useMemo', 'useEffect', 'useValue', 'useSignal'], 1, 'useEffect must be imported from React before it can be used.'),
  question('rn-list-renderitem', 'renderItem={({ item }) => <Text>{___}</Text>}', ['data', 'item', 'index', 'props'], 1, 'FlatList passes each row as item inside the renderItem callback argument.'),
  question('rn-sectionlist', '<___\n  sections={sections}\n  renderItem={renderItem}\n  renderSectionHeader={renderHeader}\n/>', ['FlatList', 'SectionList', 'ScrollView', 'KeyboardAvoidingView'], 1, 'SectionList is built for grouped list data with section headers.'),
  question('rn-sectionlist-sections', '<SectionList ___={groupedData} />', ['items', 'data', 'sections', 'groups'], 2, 'SectionList expects a sections prop rather than the FlatList data prop.'),
  question('rn-keyboardavoiding', '<___ behavior="padding" style={styles.container}>', ['SafeAreaView', 'KeyboardAvoidingView', 'Pressable', 'Modal'], 1, 'KeyboardAvoidingView helps move content when the keyboard appears.'),
  question('rn-keyboard-behavior', '<KeyboardAvoidingView ___="padding">', ['mode', 'behavior', 'keyboardMode', 'avoid'], 1, 'behavior controls how KeyboardAvoidingView adjusts its content.'),
  question('rn-textinput-value', '<TextInput value={name} ___={setName} />', ['onChangeText', 'onPress', 'onFocus', 'onBlur'], 0, 'onChangeText is the simplest way to keep TextInput synced with state.'),
  question('rn-textinput-secure', '<TextInput secureTextEntry={___} />', ['"true"', '1', 'true', 'password'], 2, 'secureTextEntry expects a boolean and is commonly used for passwords.'),
  question('rn-textinput-keyboardtype', '<TextInput keyboardType="___" />', ['email-address', 'mail', 'keyboard-email', 'email'], 0, 'email-address is a valid keyboardType for email input on mobile keyboards.'),
  question('rn-textinput-multiline', '<TextInput ___ numberOfLines={4} />', ['multiline', 'multiple', 'lines', 'wrap'], 0, 'multiline enables multiple lines of text inside the input.'),
  question('rn-image-resizemode', '<Image source={image} resizeMode="___" />', ['cover', 'repeat-x', 'stretch-fit', 'fit'], 0, 'cover is a common resizeMode that scales the image to fill while preserving aspect ratio.'),
  question('rn-imagebackground', '<___ source={backgroundImage} style={styles.hero}>', ['Image', 'ImageBackground', 'BackgroundImage', 'View'], 1, 'ImageBackground lets you render children on top of an image.'),
  question('rn-usewindowdimensions', 'const { width } = ReactNative.___();', ['useLayout', 'useDimensions', 'useWindowDimensions', 'useScreenSize'], 2, 'useWindowDimensions is a hook that gives reactive window width and height values.'),
  question('rn-style-array', 'style={[styles.card, ___ && styles.cardActive]}', ['isActive', 'true', 'styles.active', 'cardActive'], 0, 'Style arrays can conditionally include styles with boolean expressions.'),
  question('rn-absolute-fill', 'StyleSheet.___Object', ['absolute', 'absoluteFill', 'fillAbsolute', 'full'], 1, 'StyleSheet.absoluteFillObject is a built-in helper for full absolute positioning.'),
  question('rn-fetch-call', 'const response = await ___("https://example.com/api");', ['axios', 'fetch', 'request', 'load'], 1, 'fetch is the built-in web-style API commonly used in React Native for HTTP requests.'),
  question('rn-response-json', 'const data = await response.___();', ['body', 'parse', 'json', 'object'], 2, 'response.json() reads the response body and parses it as JSON.'),
  question('rn-async-function', 'const loadData = async () => { const response = await fetch(url); };\nThe keyword before the function body is ___', ['await', 'async', 'promise', 'fetch'], 1, 'A function must be marked async before await can be used inside it.'),
  question('rn-try-catch', 'try { await loadData(); } ___ (error) { console.log(error); }', ['catch', 'finally', 'error', 'throw'], 0, 'catch handles errors thrown in the try block, including rejected promises.'),
  question('rn-json-stringify', 'await AsyncStorage.setItem("pet", JSON.___(petState));', ['parse', 'toString', 'stringify', 'serializeObject'], 2, 'AsyncStorage stores strings, so objects usually need JSON.stringify first.'),
  question('rn-json-parse', 'const parsed = JSON.___(raw);', ['stringify', 'parse', 'decode', 'value'], 1, 'JSON.parse turns a JSON string back into a JavaScript object.'),
  question('rn-asyncstorage-get', 'const raw = await AsyncStorage.___("pet");', ['fetchItem', 'readItem', 'getItem', 'get'], 2, 'getItem reads a stored string value by key from AsyncStorage.'),
  question('rn-asyncstorage-set', 'await AsyncStorage.___("pet", value);', ['saveItem', 'setItem', 'store', 'write'], 1, 'setItem saves a string value for a given key in AsyncStorage.'),
  question('rn-asyncstorage-remove', 'await AsyncStorage.___("pet");', ['delete', 'removeItem', 'clearKey', 'dropItem'], 1, 'removeItem deletes a single stored entry by key.'),
  question('rn-flatlist-horizontal', '<FlatList horizontal={___} />', ['"true"', 'true', '1', 'yes'], 1, 'horizontal expects a boolean value, so true is correct.'),
  question('rn-flatlist-numcolumns', '<FlatList numColumns={___} />', ['"2"', '2', 'two', 'column'], 1, 'numColumns should be a number representing how many columns to render.'),
  question('rn-modal-requestclose', '<Modal visible={open} ___={handleClose}>', ['onClose', 'onRequestClose', 'closeModal', 'onDismissRequest'], 1, 'onRequestClose is important for closing Modal on Android back button presses.'),
  question('rn-statusbar-hidden', '<StatusBar hidden={___} />', ['"true"', '1', 'true', 'hide'], 2, 'hidden is a boolean prop that hides the status bar when set to true.'),
  question('rn-linking-open', 'await Linking.___("https://reactnative.dev");', ['goTo', 'openURL', 'visit', 'link'], 1, 'Linking.openURL opens a URL with the proper app or browser.'),
  question('rn-platform-select', 'const styles = Platform.___({ ios: iosStyles, android: androidStyles });', ['choose', 'select', 'pick', 'match'], 1, 'Platform.select returns the value that matches the current platform.'),
  question('rn-touchable-activeopacity', '<TouchableOpacity activeOpacity={___}>', ['0.7', '"0.7"', 'low', '70%'], 0, 'activeOpacity uses a numeric opacity value between 0 and 1.'),
  question('rn-scroll-indicator', '<ScrollView showsVerticalScrollIndicator={___} />', ['"false"', '0', 'false', 'hide'], 2, 'This prop expects a boolean, so false hides the vertical scroll indicator.'),
  question('rn-map-return', '{items.map(item => ___)}', ['<Text>{item}</Text>', 'return <Text>{item}</Text>', '{<Text>{item}</Text>}', 'Text(item)'], 0, 'Inside a concise arrow function, you can return JSX directly without writing return.'),
  question('rn-pressable-style-fn', '<Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>', ['pressed', 'hovered', 'style', 'active'], 0, 'Pressable can pass a pressed boolean to its style callback for interaction states.'),
  question('rn-effect-cleanup', 'useEffect(() => { const timer = setInterval(run, 1000); return () => clearInterval(timer); }, []);\nThe returned function is called the ___', ['dependency', 'cleanup', 'callback', 'memo'], 1, 'The function returned from useEffect cleans up side effects like timers or subscriptions.'),
  question('rn-ref-current', 'inputRef.___.focus();', ['value', 'ref', 'current', 'node'], 2, 'Refs expose their stored reference through the current property.'),
  question('rn-conditional-and', '{isLoading && <ActivityIndicator />}\nThe operator used for conditional rendering here is ___', ['||', '&&', '??', '=>'], 1, '&& is commonly used to render something only when the left side is truthy.'),
  question('rn-style-create', 'const styles = StyleSheet.___({ container: { flex: 1 } });', ['build', 'make', 'create', 'compose'], 2, 'StyleSheet.create organizes and validates style objects for React Native components.'),
  question('rn-state-object', 'setForm(previous => ({ ...previous, email: text }));\nThe ...previous syntax is the ___ operator.', ['spread', 'rest', 'merge', 'append'], 0, 'The spread operator copies existing object fields into a new object.'),
  question('rn-list-empty', '<FlatList ListEmptyComponent={<Text>No items</Text>} />\nThis prop renders when the list is ___', ['loading', 'selected', 'empty', 'refreshing'], 2, 'ListEmptyComponent is shown when FlatList has no items to display.'),
  question('rn-screen-flex', '<SafeAreaView style={{ flex: 1 }}>\nWhy use flex: 1 here?\nIt makes the screen ___', ['fill available space', 'scroll automatically', 'become clickable', 'hide the status bar'], 0, 'Top-level screens often use flex: 1 so they fill the whole available screen area.'),
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
  const unseenQuestions = MINIGAME_QUESTION_BANK.filter(questionItem => !seen.has(questionItem.id));
  const shuffledUnseen = shuffle(unseenQuestions);

  if (shuffledUnseen.length >= normalizedCount) {
    return shuffledUnseen.slice(0, normalizedCount);
  }

  const seenQuestions = MINIGAME_QUESTION_BANK.filter(questionItem => seen.has(questionItem.id));
  const shuffledSeen = shuffle(seenQuestions);
  const combined = [...shuffledUnseen, ...shuffledSeen];

  return combined.slice(0, normalizedCount);
};


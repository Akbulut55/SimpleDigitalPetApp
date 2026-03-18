import { MiniGameQuestion, MiniGameTrack, MiniGameTrackId } from '../types/miniGame';

const question = (
  id: string,
  prompt: string,
  options: string[],
  correctOptionIndex: number,
  explanation: string,
  trackId: MiniGameTrackId = 'react-native',
): MiniGameQuestion => ({
  id,
  prompt,
  options,
  correctOptionIndex,
  explanation,
  trackId,
});

export const MINIGAME_TRACKS: ReadonlyArray<MiniGameTrack> = [
  {
    id: 'react-native',
    title: 'React Native',
    description: 'Components, hooks, styling, APIs, lists, accessibility, and mobile UI patterns.',
    accentColor: '#06b6d4',
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    description: 'Core language skills you need before building strong mobile app logic.',
    accentColor: '#f59e0b',
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    description: 'Safer props, state, utility types, unions, and typed functions for React Native apps.',
    accentColor: '#8b5cf6',
  },
];
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
  question('js-map-transform', 'const doubled = numbers.___(value => value * 2);', ['map', 'filter', 'find', 'reduce'], 0, 'map creates a new array by transforming each item from the original array.', 'javascript'),
  question('js-filter-keep', 'const activeUsers = users.___(user => user.isActive);', ['find', 'filter', 'some', 'map'], 1, 'filter keeps every item whose callback returns true.', 'javascript'),
  question('js-find-first', 'const pet = pets.___(item => item.id === 2);', ['filter', 'map', 'find', 'every'], 2, 'find returns the first matching item instead of a full array.', 'javascript'),
  question('js-const', 'Use ___ when the variable reference should not be reassigned.', ['let', 'const', 'var', 'static'], 1, 'const prevents reassignment of the variable binding and is the common default choice.', 'javascript'),
  question('js-let', 'Use ___ when a variable will change later.', ['const', 'readonly', 'let', 'fixed'], 2, 'let is used for variables that need reassignment.', 'javascript'),
  question('js-template-literal', 'const label = ${name} is hungry};\nThis string uses a ___ literal.', ['quoted', 'template', 'typed', 'strict'], 1, 'Backticks create template literals so expressions can be inserted with .', 'javascript'),
  question('js-object-destructure', 'const { hunger, happiness } = pet;\nThis syntax is called ___', ['spreading', 'destructuring', 'mapping', 'aliasing'], 1, 'Destructuring pulls properties out of an object into local variables.', 'javascript'),
  question('js-array-spread', 'const next = [...items, newItem];\nThe ...items part is the ___ operator.', ['rest', 'spread', 'clone', 'array'], 1, 'Spread copies existing array items into a new array.', 'javascript'),
  question('js-object-update', 'const nextPet = { ...pet, hunger: 40 };\nThis pattern helps keep updates ___', ['mutable', 'global', 'immutable', 'async'], 2, 'Creating a new object instead of mutating the old one is an immutable update.', 'javascript'),
  question('js-optional-chaining', 'pet.owner?.name uses ___ chaining.', ['optional', 'strict', 'nullish', 'array'], 0, 'Optional chaining safely stops if the value before ?. is null or undefined.', 'javascript'),
  question('js-nullish', 'const title = customTitle ?? "Untitled";\n?? uses the value on the right when the left is ___', ['false', 'empty string', 'null or undefined', '0'], 2, 'Nullish coalescing only falls back for null or undefined.', 'javascript'),
  question('js-async-keyword', 'A function must be marked ___ before using await inside it.', ['promise', 'async', 'yield', 'defer'], 1, 'await only works inside async functions.', 'javascript'),
  question('ts-string-type', 'const petName: ___ = "Milo";', ['StringType', 'string', 'text', 'char'], 1, 'string is the TypeScript primitive type for text values.', 'typescript'),
  question('ts-number-array', 'const scores: ___ = [1, 2, 3];', ['number[]', 'numbers', '[number]', 'ArrayOnly<number>'], 0, 'number[] is a common shorthand for an array of numbers.', 'typescript'),
  question('ts-boolean', 'const isHungry: ___ = true;', ['bool', 'boolean', 'truthy', 'flag'], 1, 'boolean is the TypeScript type for true/false values.', 'typescript'),
  question('ts-prop-optional', 'type Props = { title?: string };\nThe ? means the prop is ___', ['required', 'optional', 'readonly', 'async'], 1, 'A property marked with ? can be omitted.', 'typescript'),
  question('ts-union', 'type Status = "idle" | "loading" | "error";\nThis is a ___ type.', ['mapped', 'union', 'generic', 'tuple'], 1, 'Union types allow a value to be one of several specific types or literals.', 'typescript'),
  question('ts-function-return', 'const handleFeed = (): ___ => { ... };\nUse this return type when the function returns nothing useful.', ['never', 'null', 'void', 'empty'], 2, 'void is the usual return type for functions that do not return a meaningful value.', 'typescript'),
  question('ts-interface-shape', 'Use an ___ to describe the shape of an object like PetState.', ['interface', 'effect', 'screen', 'module'], 0, 'Interfaces are commonly used to describe object shapes in TypeScript.', 'typescript'),
  question('ts-type-alias', 'type Coins = number;\nThis is called a type ___', ['merge', 'alias', 'guard', 'cast'], 1, 'A type alias gives a new reusable name to an existing type.', 'typescript'),
  question('ts-generic-array', 'Array<string> means ___', ['one string only', 'an array of strings', 'a string or array', 'a typed object'], 1, 'Generic syntax like Array<string> describes the element type inside the array.', 'typescript'),
  question('ts-readonly', 'readonly id: string means the property ___ after creation.', ['must be async', 'cannot be reassigned', 'becomes optional', 'must be a number'], 1, 'readonly helps prevent accidental reassignment of that property.', 'typescript'),
  question('ts-record', 'Record<string, number> describes an object with ___', ['number keys and string values', 'string keys and number values', 'only one property', 'array indexes only'], 1, 'Record<K, V> creates an object type where keys use K and values use V.', 'typescript'),
  question('js-object-keys', 'Object.___(pet) returns an array of the object\'s property names.', ['keys', 'values', 'entries', 'names'], 0, 'Object.keys returns an array containing the object\'s own enumerable property names.', 'javascript'),
  question('js-object-values', 'Object.___(pet) returns an array of the object\'s values.', ['keys', 'entries', 'values', 'items'], 2, 'Object.values collects the object\'s values into an array.', 'javascript'),
  question('js-object-entries', 'Object.___(pet) returns [key, value] pairs.', ['keys', 'values', 'assign', 'entries'], 3, 'Object.entries is useful when you need both keys and values together.', 'javascript'),
  question('js-array-foreach', 'items.___(item => console.log(item)); runs the callback for each array item.', ['map', 'forEach', 'find', 'reduce'], 1, 'forEach loops through each item when you want a side effect instead of a returned array.', 'javascript'),
  question('js-array-sort', 'numbers.sort((a, b) => a - b); sorts the array in ___ order.', ['descending', 'random', 'ascending', 'string-only'], 2, 'Subtracting a - b tells sort to place smaller numbers first.', 'javascript'),
  question('js-array-slice', 'items.___(0, 3) returns a shallow copy of part of an array.', ['splice', 'slice', 'split', 'trim'], 1, 'slice returns a portion of an array without mutating the original.', 'javascript'),
  question('js-array-splice', 'items.splice(1, 1) will usually ___ the original array.', ['clone', 'sort', 'mutate', 'freeze'], 2, 'splice changes the original array by removing or inserting items.', 'javascript'),
  question('js-default-parameter', 'function greet(name = "Friend") { ... } uses a ___ parameter value.', ['fallback', 'default', 'spread', 'rest'], 1, 'Default parameters provide a value when the caller does not pass one.', 'javascript'),
  question('js-rest-params', 'function total(...values) { ... }\n...values is a ___ parameter.', ['spread-only', 'rest', 'union', 'strict'], 1, 'Rest parameters collect remaining arguments into an array.', 'javascript'),
  question('js-ternary', 'isHungry ? "Feed now" : "All good" uses the ___ operator.', ['coalescing', 'ternary', 'spread', 'comparison'], 1, 'The ternary operator chooses one of two values based on a condition.', 'javascript'),
  question('js-logical-or', 'const label = custom || "Default";\n|| falls back when the left side is ___', ['truthy', 'falsy', 'an array', 'a number only'], 1, 'Logical OR returns the right side when the left side is falsy.', 'javascript'),
  question('js-truthy-empty-string', 'An empty string "" is considered ___ in JavaScript.', ['truthy', 'falsy', 'numeric', 'nullish-only'], 1, 'Empty strings are falsy values.', 'javascript'),
  question('js-truthy-empty-array', 'An empty array [] is considered ___ in JavaScript.', ['truthy', 'falsy', 'null', 'NaN'], 0, 'Arrays are objects, and objects are truthy even when empty.', 'javascript'),
  question('js-settimeout', 'setTimeout(() => save(), 1000); runs the callback after about ___', ['1 millisecond', '1 second', '10 seconds', '1 minute'], 1, 'setTimeout uses milliseconds, so 1000 means about one second.', 'javascript'),
  question('js-parse-int', 'Which function converts "42" into the number 42?', ['parseInt', 'stringify', 'join', 'includes'], 0, 'parseInt reads a string and converts it to an integer number.', 'javascript'),
  question('js-number-constructor', 'Number("5") returns a ___ value.', ['string', 'number', 'boolean', 'function'], 1, 'Number converts a value into a number when possible.', 'javascript'),
  question('js-nan-check', 'Which helper is safest for checking whether a value is NaN?', ['value === NaN', 'Number.isNaN(value)', 'value == NaN', 'typeof value === NaN'], 1, 'Number.isNaN is the reliable built-in check for NaN values.', 'javascript'),
  question('js-string-split', '"a,b,c".___(",") returns ["a", "b", "c"].', ['join', 'slice', 'split', 'replace'], 2, 'split breaks a string into an array using the given separator.', 'javascript'),
  question('js-array-join', '["React", "Native"].___(" ") returns "React Native".', ['concat', 'join', 'split', 'merge'], 1, 'join combines array items into a string with the separator between them.', 'javascript'),
  question('js-string-trim', 'name.___() removes extra whitespace from the start and end of a string.', ['strip', 'trim', 'slice', 'clean'], 1, 'trim removes leading and trailing whitespace from a string.', 'javascript'),
  question('js-array-indexof', 'items.___("cat") returns the position of "cat" or -1 if not found.', ['find', 'includes', 'indexOf', 'position'], 2, 'indexOf returns the first matching index in an array or string.', 'javascript'),
  question('js-for-of', 'for (const item ___ items) { ... }', ['in', 'of', 'from', 'at'], 1, 'for...of loops over iterable values such as array items.', 'javascript'),
  question('js-for-in', 'for (const key ___ pet) { ... } is commonly used for object keys.', ['of', 'in', 'at', 'from'], 1, 'for...in iterates over object property keys.', 'javascript'),
  question('js-destructure-alias', 'const { name: petName } = pet;\npetName is an example of a destructuring ___', ['spread', 'alias', 'closure', 'guard'], 1, 'You can rename destructured properties with an alias like name: petName.', 'javascript'),
  question('js-short-circuit-and', 'isReady && startGame() means startGame runs only when isReady is ___', ['false', 'undefined only', 'truthy', 'an array'], 2, 'Logical AND short-circuits, so the right side runs only if the left side is truthy.', 'javascript'),
  question('js-shallow-copy', 'Which expression creates a shallow copy of an array?', ['items.copy()', '[...items]', 'items.mutate()', 'Array.items(items)'], 1, 'Spread syntax creates a new array with the same top-level items.', 'javascript'),
  question('js-math-random', 'Math.random() returns a number between ___', ['1 and 10', '0 and 1', '0 and 100', '-1 and 1'], 1, 'Math.random returns a decimal number greater than or equal to 0 and less than 1.', 'javascript'),
  question('js-date-now', 'Date.now() returns the current time as ___', ['a Date object', 'milliseconds since the Unix epoch', 'a formatted string', 'seconds only'], 1, 'Date.now returns the current timestamp in milliseconds.', 'javascript'),
  question('ts-tuple', 'type Point = [number, number];\nThis is called a ___ type.', ['union', 'tuple', 'record', 'enum'], 1, 'Tuples describe arrays with a fixed length and specific types at each position.', 'typescript'),
  question('ts-intersection', 'type PetWithOwner = Pet & OwnerInfo;\nThe & creates an ___ type.', ['intersection', 'optional', 'array', 'indexed'], 0, 'Intersection types combine multiple types into one.', 'typescript'),
  question('ts-keyof', 'keyof PetState produces a union of the type\'s ___', ['values', 'methods only', 'property names', 'generic constraints'], 2, 'keyof creates a union of property names from a type.', 'typescript'),
  question('ts-type-assertion', 'value as string is called a type ___', ['assertion', 'union', 'mapping', 'extension'], 0, 'A type assertion tells TypeScript to treat a value as a more specific type.', 'typescript'),
  question('ts-array-generic', 'const pets: Array<Pet> = [];\nThis is another way to write ___', ['Pet[]', 'readonly Pet', 'Record<Pet>', 'Pet | []'], 0, 'Array<Pet> and Pet[] describe the same array element type.', 'typescript'),
  question('ts-parameter-type', 'function feed(amount: number) { ... }\nnumber is the parameter\'s ___', ['default', 'type annotation', 'namespace', 'union'], 1, 'Type annotations specify what type a variable or parameter should have.', 'typescript'),
  question('ts-return-inference', 'If a function clearly returns a string, TypeScript can often ___ the return type.', ['ignore', 'infer', 'freeze', 'omit at runtime'], 1, 'TypeScript can infer types from the code you write, including return values.', 'typescript'),
  question('ts-string-literal', 'const mode: "dark" = "dark";\n"dark" here is a string ___ type.', ['array', 'literal', 'fallback', 'mapped'], 1, 'Literal types lock a value to one exact string, number, or boolean.', 'typescript'),
  question('ts-indexed-access', 'PetState["name"] gives the type of the ___ property.', ['runtime', 'name', 'style', 'function'], 1, 'Indexed access types let you read one property type from another type.', 'typescript'),
  question('ts-enum-basic', 'An enum is commonly used to represent a small set of ___ values.', ['related named', 'random any', 'JSX-only', 'mutable object'], 0, 'Enums group related named constants into a single type-like structure.', 'typescript'),
  question('ts-never', 'The never type usually represents values that ___', ['can be any type', 'never occur or never return', 'must be strings', 'come from AsyncStorage'], 1, 'never is used for impossible states or functions that do not complete normally.', 'typescript'),
  question('ts-optional-param', 'function rename(name?: string) { ... }\nThis parameter can be ___', ['omitted', 'only null', 'only numbers', 'readonly'], 0, 'A parameter with ? can be left out by the caller.', 'typescript'),
  question('ts-default-param-type', 'function feed(amount = 3) { ... }\nTypeScript usually infers amount as a ___', ['string', 'number', 'boolean', 'tuple'], 1, 'A numeric default value leads TypeScript to infer a number type.', 'typescript'),
  question('ts-discriminated-union', 'A union where each variant has a shared tag like type: "success" or type: "error" is called a ___ union.', ['discriminated', 'readonly', 'generic', 'tuple'], 0, 'Discriminated unions make it easier to narrow between related object variants.', 'typescript'),
  question('ts-type-guard-in', 'if ("message" in result) { ... }\nThis can act as a type ___', ['array', 'guard', 'record', 'alias'], 1, 'Checks like the in operator help narrow a union to a more specific type.', 'typescript'),
  question('ts-non-null', 'value!.length uses the non-null assertion operator to tell TypeScript the value is not ___ or undefined.', ['string', 'null', 'readonly', 'generic'], 1, 'The ! operator removes null and undefined from a type at that point in the code.', 'typescript'),
  question('ts-optional-chaining-type', 'user?.profile?.name is useful when nested properties may be ___', ['constant', 'missing', 'readonly only', 'arrays only'], 1, 'Optional chaining works well when values may be undefined along the path.', 'typescript'),
  question('ts-nullish-coalescing-type', 'const label = title ?? "Untitled";\nThis gives a fallback when title is ___', ['0', 'false', 'null or undefined', 'an empty array'], 2, 'Nullish coalescing keeps valid falsy values like 0 or empty string, but falls back for nullish ones.', 'typescript'),
  question('ts-readonly-object', 'Readonly<PetState> makes object properties ___', ['optional', 'readonly', 'arrays', 'enums'], 1, 'Readonly is a utility type that marks every property as not assignable.', 'typescript'),
  question('ts-required-utility', 'Required<Props> makes all properties ___', ['readonly', 'required', 'numbers', 'nullable'], 1, 'Required is the opposite of Partial and removes optional markers.', 'typescript'),
  question('ts-extract-utility', 'Extract<A, B> keeps the union members from A that are also in ___', ['B', 'A only', 'JSX', 'runtime values'], 0, 'Extract is a utility type for pulling overlapping members out of a union.', 'typescript'),
  question('ts-exclude-utility', 'Exclude<A, B> removes from A the union members assignable to ___', ['A', 'B', 'unknown', 'never'], 1, 'Exclude is the opposite of Extract for union members.', 'typescript'),
  question('ts-generic-constraint', 'function logLength<T extends { length: number }>(value: T) { ... }\nThis generic uses a ___', ['constraint', 'tuple', 'readonly cast', 'module'], 0, 'The extends clause constrains T so only values with length are allowed.', 'typescript'),
  question('ts-interface-vs-type', 'Both interface and type can describe object shapes, but interfaces are especially common for ___', ['component props and object contracts', 'math only', 'Metro config', 'Android manifests'], 0, 'Interfaces are often used to model props, API responses, and shared object contracts.', 'typescript'),
  question('ts-void-callback', 'setTimeout(() => console.log("hi"), 1000);\nThe callback here usually has a return type of ___', ['string', 'void', 'number[]', 'never[]'], 1, 'Callbacks that do not return anything useful are usually typed as void.', 'typescript'),
  question('ts-state-union', 'const [status, setStatus] = useState<"idle" | "loading">("idle");\nThis limits status to ___', ['any string', 'two specific values', 'numbers only', 'null only'], 1, 'Generic state types can restrict state to a small safe set of valid values.', 'typescript'),
  question('ts-generic-pair', 'type Pair<T> = [T, T];\nPair<number> becomes ___', ['[string, string]', '[number, number]', 'number[] only', 'Record<number, number>'], 1, 'A generic tuple type substitutes T with the provided type argument.', 'typescript'),
  question('ts-module-export-type', 'export type PetId = string; allows the type to be ___ in other files.', ['rendered', 'imported', 'mounted', 'memoized'], 1, 'Exported types can be imported and reused across the project.', 'typescript'),
  question('ts-unknown-vs-any', 'unknown differs from any because unknown requires ___ before usage.', ['narrowing', 'stringifying', 'memoization', 'sorting'], 0, 'unknown preserves safety by forcing you to check the value before using it.', 'typescript'),
  question('ts-satisfies', 'The satisfies operator helps confirm that a value matches a type while keeping more specific ___ info.', ['runtime', 'literal', 'Metro', 'navigation'], 1, 'satisfies can validate shape without widening useful literal information too aggressively.', 'typescript'),
  question('ts-object-index-signature', 'type Scores = { [name: string]: number };\nThis is an index ___', ['signature', 'screen', 'effect', 'assertion'], 0, 'Index signatures describe objects whose keys are not known in advance.', 'typescript'),
  question('ts-union-narrow-switch', 'A switch on a union tag like status.type is often used to ___ the union.', ['clone', 'narrow', 'sort', 'flatten'], 1, 'Switch statements work well with discriminated unions because each case narrows the type.', 'typescript'),
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

export const getMiniGameQuestionCount = (trackId?: MiniGameTrackId) => {
  if (!trackId) {
    return MINIGAME_QUESTION_BANK.length;
  }

  return MINIGAME_QUESTION_BANK.filter(questionItem => questionItem.trackId === trackId).length;
};

export const getMiniGameDeck = (
  alreadySeenQuestionIds: string[] = [],
  trackId: MiniGameTrackId = 'react-native',
  count = DEFAULT_QUESTIONS_PER_RUN,
) => {
  const trackQuestions = MINIGAME_QUESTION_BANK.filter(questionItem => questionItem.trackId === trackId);
  const seen = new Set(alreadySeenQuestionIds);
  const normalizedCount = Math.max(1, Math.min(count, trackQuestions.length));
  const unseenQuestions = trackQuestions.filter(questionItem => !seen.has(questionItem.id));
  const shuffledUnseen = shuffle(unseenQuestions);

  if (shuffledUnseen.length >= normalizedCount) {
    return shuffledUnseen.slice(0, normalizedCount);
  }

  const seenQuestions = trackQuestions.filter(questionItem => seen.has(questionItem.id));
  const shuffledSeen = shuffle(seenQuestions);
  const combined = [...shuffledUnseen, ...shuffledSeen];

  return combined.slice(0, normalizedCount);
};








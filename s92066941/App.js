
import React from 'react';

import {
    StyleSheet,
    SafeAreaView,
    View,
    TextInput,
    Text,
    FlatList,
    TouchableOpacity,Image,
    Alert,
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const COLORS = {primary: '#1f145c', white: '#fff'};

const App = () => {
    const [todos, setTodos] = React.useState([]);
    const [textInput, setTextInput] = React.useState('');

    React.useEffect(() => {
        getTodosFromUserDevice();
    }, []);

    React.useEffect(() => {
        saveTodoToUserDevice(todos);
    }, [todos]);

    const addTodo = () => {
        if (textInput == '') {
            Alert.alert('Error', 'Please input todo');
        } else {
            const newTodo = {
                id: Math.random(),
                task: textInput,
                completed: false,
            };
            setTodos([...todos, newTodo]);
            setTextInput('');
        }
    };

    const saveTodoToUserDevice = async todos => {
        try {
            const stringifyTodos = JSON.stringify(todos);
            await AsyncStorage.setItem('todos', stringifyTodos);
        } catch (error) {
            console.log(error);
        }
    };

    const getTodosFromUserDevice = async () => {
        try {
            const todos = await AsyncStorage.getItem('todos');
            if (todos != null) {
                setTodos(JSON.parse(todos));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const markTodoComplete = todoId => {
        const newTodosItem = todos.map(item => {
            if (item.id == todoId) {
                return {...item, completed: true};
            }
            return item;
        });

        setTodos(newTodosItem);
    };

    const deleteTodo = todoId => {
        const newTodosItem = todos.filter(item => item.id != todoId);
        setTodos(newTodosItem);
    };

    const clearAllTodos = () => {
        Alert.alert('Confirm', 'Clear todos?', [
            {
                text: 'Yes',
                onPress: () => setTodos([]),
            },
            {
                text: 'No',
            },
        ]);
    };

    const ListItem = ({ todo }) => {
        return (
            <View style={styles.listItem}>
                {!todo?.completed && (
                    <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
                        <View style={[styles.actionIcon, { backgroundColor: 'green' }]}>
                            <Icon name="done" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                )}
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 15,
                            color: COLORS.primary,
                            textDecorationLine: todo?.completed ? 'line-through' : 'none',
                        }}>
                        {todo?.task}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                    <View style={styles.actionIcons}>
                        <Icon name="delete" size={20} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#c3fad2',
            }}>
            <View style={styles.header}>
                <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: 25,
                        color: COLORS.primary,
                    }}>
                    TO DO LIST
                </Text>
                {/*<Icon name="delete" size={25} color="red" onPress={clearAllTodos} />*/}
            </View><View style={styles.imageContainer}>
            <Image
                source={{
                    uri: 'https://www.workflowmax.com/hubfs/6-things-to-do-list-listing.png',
                }}
                style={{
                    width: '100%',
                    height: '100%',

                }}
            />
        </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{padding: 0, paddingBottom: 100}}
                data={todos}
                renderItem={({item}) => <ListItem todo={item} />}
            />


            <View style={styles.footer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={textInput}
                        placeholder="Add Todo"
                        onChangeText={text => setTextInput(text)}
                    />
                </View>
                <TouchableOpacity onPress={addTodo}>
                    <View style={styles.iconContainer}>
                        <Icon name="add" color="white" size={30} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity >
                    <View style={styles.iconContain}>
                        <Icon name="remove" size={25} color="white" onPress={clearAllTodos} />
                    </View>
                </TouchableOpacity>



            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#c3fad2',
    },
    inputContainer: {
        height: 50,
        paddingHorizontal: 20,paddingVertical:10,
        elevation: 40,
        backgroundColor: COLORS.white,
        flex: 1,
        marginVertical: 20,
        marginRight: 20,
        borderRadius: 30,
    },
    iconContainer: {
        height: 40,
        width: 40,
        backgroundColor: COLORS.primary,
        elevation: 40,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconContain: {
        height: 40,
        width: 40,
        backgroundColor: COLORS.primary,
        elevation: 40,
        borderRadius: 25,
        // paddingHorizontal:10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:10,
    },

    listItem: {
        padding: 20,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        elevation: 12,
        borderRadius: 7,
        marginVertical: 10,
        marginHorizontal:10,

    },
    actionIcon: {
        alignItems: 'center',
        // backgroundColor: COLORS.white,
        backgroundColor: 'red',
        borderRadius: 3,
        height: 25,
        justifyContent: 'center',
        marginLeft: 0,
        marginHorizontal:10,

        width: 25
        ,
    },

    actionIcons: {
        alignItems: 'center',
        // backgroundColor: COLORS.white,
        backgroundColor: 'red',
        borderRadius: 3,
        height: 25,
        justifyContent: 'center',
        marginLeft: 5,
        width: 25
        ,
    },
    header: {
        paddingVertical:50,
        paddingHorizontal:130,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    } ,

    imageContainer: {
        width: 280,
        height: 145,
        alignSelf: 'center', // Center the image container horizontally
        marginVertical: 20,
        elevation: 4,
        borderRadius: 10,
        overflow: 'hidden', // Clip the image if it overflows the
        backgroundColor: COLORS.white,


    },
});
export default App;

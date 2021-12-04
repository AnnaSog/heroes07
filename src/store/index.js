// import { createStore, combineReducers, compose, applyMiddleware} from 'redux';
// import ReduxThunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit';
import filters from '../components/heroesFilters/filtersSlice';
import heroes from '../components/heroesList/heroesSlice';

const stringMiddleware = (store) => (dispatch) => (action) => {     //по умолч. store - принимаем лишь dispatch и getState; dispatch тоже по умолч.; action - арг.
    if(typeof action === 'string'){    //если в dispatch action пришел как строка
        return dispatch({           //то мы превращаем его в стандартный action объект с type     
            type: action
        })
    } else {
        return dispatch(action)  //если пришел объект, то просто его запускаем
    }
}

//создание store с помощью Toolkit: configureStore()
const store = configureStore({
    reducer: {filters, heroes},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production'   //devTools- принимает булиновое значение; true при создание, т.е. не продакшн
});

export default store;

// const enhancer = (createStore) => (...args) => {
//     const store = createStore(...args);

//     const oldDispatch = store.dispatch; //стандартный dispatch, ктр содержится в store
//     store.dispatch = (action) => {
//         if(typeof action === 'string'){    //если в dispatch action пришел как строка
//             return oldDispatch({           //то мы превращаем его в стандартный action объект с type     
//                 type: action
//             })
//         } else {
//             return oldDispatch(action)
//         }
//     }
//     return store;
// }


// const store = createStore(combineReducers({         //1 арг reducers
//                     filters: filters , 
//                     heroes: heroes}),

//                     compose(applyMiddleware(ReduxThunk, stringMiddleware),           //compose - соединяет несколько фун-ий во 2-м арг.
//                              window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

//         // compose(enhancer,           //compose - соединяет несколько фун-ий во 2-м арг.
//         //     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
//     );



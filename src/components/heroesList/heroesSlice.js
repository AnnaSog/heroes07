import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';
import { createSelector } from '@reduxjs/toolkit'

const heroesAdapter = createEntityAdapter();

// const initialState = {
//     heroes: [],
//     heroesLoadingStatus: 'idle'
// }

const initialState = heroesAdapter.getInitialState({            //getInitialState (метод из createEntityAdapter) -он содержит уже ids[], entities{}
    heroesLoadingStatus: 'idle'
});

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',      //1-ый арг type, heroes-name slice, fetchHeroes - тип actions
    () => {                    //2-ой арг - фун-ия payloadCreator
        const {request} = useHttp();
        return request("http://localhost:3001/heroes");
    }
)

const heroesSlice = createSlice({
    name: 'heroes',         //1-ый арг(от этого назв. пойдут название всех ост действий этого Slice)
    initialState,           //2-ой арг
    reducers: {             //3-ий арг
        heroCreated: (state, action) => {
            heroesAdapter.addOne(state, action.payload); //payload - попадают все данные по новому герою
        },
        heroDeleted: (state, action) => {
            heroesAdapter.removeOne(state, action.payload); //в payload сравнивает id
        }
    },
    extraReducers:(builder) => {            //4-ый арг, получает доп.reducers, откуда-то из вне
        builder
            .addCase(fetchHeroes.pending,   //1-ый арг. fetchHeroes-созданный нами action creator из createAsyncThunk, pending приходит из него и означает когда что-то асинх.отравляется
                state =>                            
                {state.heroesLoadingStatus = 'loading'})          //2-ой арг - действие по изм state
            .addCase(fetchHeroes.fulfilled,                 //fulfilled - отправка прошла успешна
                (state, action) => {
                    state.heroesLoadingStatus = 'idle';
                    heroesAdapter.setAll(state, action.payload);
                })
            .addCase(fetchHeroes.rejected,          //rejected - отклонено
                state => {
                    state.heroesLoadingStatus = 'error'
                })
            .addDefaultCase( () => {})
    }
});

const {actions, reducer} = heroesSlice   //вытаскиваем эти объекты из heroesSlice
export default reducer;

const {selectAll} = heroesAdapter.getSelectors(state => state.heroes); //превращаем {} heroes в []

//Создать мемолизированную фун-ию для предотвращение повторного рендеринга без изм. filters
export const filteredHeroesSelector = createSelector(
    (state) => state.filters.activeFilter,        //1-ая фун-ия
    selectAll,                                     //2-ая фун-ия, получаем [] heroes
    (filter, heroes) => {                          //3-ая фун-ия, filter приходит из 1-ой функ, heroes - из 2-ой функ
        if(filter === 'all'){                      //если активна кнопка all
            return heroes;                      //то отражаются все герои
        }else {             
            return heroes.filter(item => item.element === filter)   
        } //все герои фильруются и создается новый массив, куда попадут только те у кого element совпадает с активны фильтром(кнопкой)
    }
)

export const {
    heroesFetching,
    heroesFetched, 
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;
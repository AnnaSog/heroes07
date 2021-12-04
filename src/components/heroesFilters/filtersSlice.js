import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';

// const initialState = {
//     filters: [],
//     filtersLoadingStatus: 'idle',
//     activeFilter: 'all'
// }

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
});

console.log(initialState);

export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',      //1-ый арг type, filters-name slice, fetchFilters - тип actions
    () => {                    //2-ой арг - фун-ия payloadCreator
        const {request} = useHttp();
        return request("http://localhost:3001/filters");
    }
)

const filtersSlice = createSlice({
    name: 'filters',         //1-ый арг(от этого назв. пойдут название всех ост действий этого Slice)
    initialState,           //2-ой арг
    reducers: {             //3-ий арг
        filtersChanged: (state, action) => {
            state.activeFilter = action.payload;
        },
    },
    extraReducers: (builder) => {         //4-ый арг
        builder
            .addCase(fetchFilters.pending, state => {              //filters - name, Fetching - действие, fetchFilters - action
                state.filtersLoadingStatus = 'loading'})
            .addCase(fetchFilters.fulfilled, 
                (state, action) => {
                state.filtersLoadingStatus = 'idle';
                filtersAdapter.setAll(state, action.payload);
            })
            .addCase(fetchFilters.rejected,
                state => {
                    state.filtersLoadingStatus = 'error'
            })
            .addDefaultCase( () => {})
    }
});

const {actions, reducer} = filtersSlice;   //вытаскиваем эти объекты из filtersSlice
export default reducer;

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters);  //filters из {} превращаем в []

export const {
    filtersFetching,
    filtersFetched, 
    filtersFetchingError,
    filtersChanged,
} = actions;
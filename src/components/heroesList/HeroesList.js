import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { heroDeleted, fetchHeroes, filteredHeroesSelector } from './heroesSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';


const HeroesList = () => {
    const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    
    //отправка запроса на сервер
    useEffect(() => {
        dispatch(fetchHeroes());

        // eslint-disable-next-line
    }, []);


    //удаление из базы данных
    // const onDelete = useCallback((id) => {
    //     // Удаление персонажа по его id
    //     request(`http://localhost:3001/heroes/${id}`, "DELETE")
    //         .then(data => console.log(data, 'Deleted'))
    //         .then(dispatch(heroDeleted(id)))
    //         .catch(err => console.log(err));
    //     // eslint-disable-next-line  
    // }, [request]);

    const onDelete = useCallback((id) => {
        dispatch(heroDeleted(id))

        // eslint-disable-next-line 
    }, []);


    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({id, ...props}) => {
            return <HeroesListItem key={id} {...props} onDelete ={() => onDelete(id) } />
        })
    }


    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;
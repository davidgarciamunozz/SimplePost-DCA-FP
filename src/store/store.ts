import { reducer } from './reducers'
import {get, set} from '../utils/storage'
//Estado Global para la renderización de la pantalla

//initial State
const initialState = {
    screen: 'HOME',
    posts : [],
}

// Global State
export let appState= get('STORE', initialState);


const persistStore = (state : any) => {
	set('STORE', state);
}

//Crear el dispatch
export const dispatch = (action: any) => {
    const clone = JSON.parse(JSON.stringify(appState));
	const newState = reducer(action, clone);
	appState = newState;
	//Persist State
	persistStore(newState);
    //Notificar a los observadores
    observers.forEach((observer) => {
        observer.render();
    } )
}

//Agregar observador para el cambio de estado
let observers: any[] = []
export const subscribe = (observer: any) => {
    observers.push(observer)
}

// Global State Documentation 
// https://www.freecodecamp.org/news/what-is-redux-store-actions-reducers-explained/
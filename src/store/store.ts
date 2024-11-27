import { reducer } from './reducers'
import {get, set} from '../utils/storage'
//Global state to manage screens

//initial State
const initialState = {
    screen: 'LANDING',
    posts : [],
}

// Global State
export let appState= get('STORE', initialState);


const persistStore = (state : any) => {
	set('STORE', state);
}


export const dispatch = (action: any) => {
    const clone = JSON.parse(JSON.stringify(appState));
	const newState = reducer(action, clone);
	appState = newState;
	//Persist State
	persistStore(newState);
    //Notify all observers
    observers.forEach((observer) => {
        observer.render();
    } )
}

// Add observer to the store
let observers: any[] = []
export const subscribe = (observer: any) => {
    observers.push(observer)
}

// Global State Documentation 
// https://www.freecodecamp.org/news/what-is-redux-store-actions-reducers-explained/
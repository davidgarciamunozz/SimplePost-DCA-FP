import { reducer } from './reducers'
//Estado Global para la renderización de la pantalla
export let appState = {
    screen: 'home',
}
//Crear el dispatch
export const dispatch = (action: any) => {
    const clone = JSON.parse(JSON.stringify(appState))
    appState = reducer(action, clone)
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
export const reducer = (currentAction: any, currentState: any) => {
    const {action, payload} = currentAction;
    switch (action) {
        case 'NAVIGATE':
            return {
                ...currentState,
                screen: payload
            }
        case 'SET_USER':
            return {
                ...currentState,
                user: payload
            }
        default:
            return currentState
    }
}
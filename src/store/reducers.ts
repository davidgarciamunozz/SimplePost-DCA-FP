export const reducer = (currentAction: any, currentState: any) => {
    const {action, payload} = currentAction;
    switch (action) {
        case 'NAVIGATE':
            return {
                ...currentState,
                screen: payload
            }
        
        default:
            return currentState
    }
}
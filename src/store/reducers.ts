export const reducer = (currentAction: any, currentState: any) => {
    const {action, payload} = currentAction;
    switch (action) {
        case 'NAVIGATE':
            return {
                ...currentState,
                screen: payload
            }
        case 'SET_POSTS':
            return {
                ...currentState,
                posts: payload
            }
        case 'SET_USER_POSTS':
            return {
                ...currentState,
                userPosts: payload
            }
        default:
            return currentState
    }
}
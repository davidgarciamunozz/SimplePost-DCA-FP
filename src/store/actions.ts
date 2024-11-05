export const navigate = (screen: string) => {
    return {
        action: 'NAVIGATE',
        payload: screen
    }
}

export const setUser = (user: any) => {
    return {
        action: 'SET_USER',
        payload: user
    }
}
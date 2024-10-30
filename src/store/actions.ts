export const navigate = (screen: string) => {
    return {
        action: 'NAVIGATE',
        payload: screen
    }
}
export const navigate = (screen: string) => {
    return {
        action: 'NAVIGATE',
        payload: screen
    }
}

export const setAllPosts = (data: any) => {
    return {
        action: 'SET_POSTS',
        payload: data
    }
}
export const userPosts = (data: any) => {
    return {
        action: 'SET_USER_POSTS',
        payload: data
    }
}
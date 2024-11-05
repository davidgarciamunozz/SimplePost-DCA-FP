const get = (key: string , defaultValue : any) => {
    const value = localStorage.getItem(key) || sessionStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
}

const set = (key:any, value:any, session = false) => {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(value));
}


export { get, set }

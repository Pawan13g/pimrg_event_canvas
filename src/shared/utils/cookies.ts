import cookie from 'js-cookie';


export const getAuthKey = () => {

    // GET SESSION KEY
    // let authKey = sessionStorage.getItem('authKey');

    // // IF AUTHKEY EXIST IN SESSION RETURN IT
    // if (authKey) return authKey;

    // IF AUTHKEY DOES NOT EXIST RETURN IT FROM COOKIE
    return cookie.get('authKey');
}

export const setAuthKey = (authKey: string, isRememberMe?: boolean,) => {

    // SET KEY IN SESSION 
    sessionStorage.setItem('authKey', authKey);

    // SET KEY AS COOKIE 
    if (isRememberMe) cookie.set('authKey', authKey);
}

export const removeAuthKey = (preserveCookie: boolean = true) => {

    // REMOVE KEY FROM SESSION 
    sessionStorage.removeItem('authKey');

    // REMOVE KEY FROM COOKIE IF IT NEEDS TO BE REMOVED 
    if (!preserveCookie) cookie.remove('authKey');
}


import Cookies from 'universal-cookie'


class LocalStorageService {
    static getItem (key) {
        return localStorage.getItem(key)
    }

    static setItem (key, value) {
        localStorage.setItem(
            key,
            value
        )
    }

    static removeItem (key) {
        localStorage.removeItem(
            key
        )
    }
}

class CookieService {
    constructor () {
        this.cookieManager = new Cookies()
    }

    getCookie (key) {
        return this.cookieManager.get(key)
    }

    setCookie (key, value, maxAgeSeconds) {
        this.cookieManager.set(
            key,
            value,
            {
                path: '/',
                maxAge: maxAgeSeconds
            }
        )
    }

    removeCookie (key) {
        this.cookieManager.remove(
            key
        )
    }
}

export {LocalStorageService, CookieService}

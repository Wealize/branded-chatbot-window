import Cookies from 'universal-cookie'


class LocalStorageService {
    static getItem (key) {
        let item = localStorage.getItem(key)

        return item ? JSON.parse(item) : item
    }

    static setItem (key, value) {
        localStorage.setItem(
            key,
            JSON.stringify(value)
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
                secure: true,
                sameSite: true,
                ...maxAgeSeconds > 0 && {maxAge: maxAgeSeconds}
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

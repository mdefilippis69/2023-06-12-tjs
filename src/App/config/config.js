/**
 * base d'url du serveur REST
 */
export const REST_ADR="http://localhost:5629"
/**
 * uri des ressources en fonction du nom de ressource
 */
export const ressourcesURI=Object.freeze({
    memes:'/memes',
    images:'/images'
})

export const PATCHS_ADR="http://localhost:8000/patch"

export const patchsURI=Object.freeze({
    all:'/all'
})

export const WS_ADR="ws://localhost:8000/ws/patch/"
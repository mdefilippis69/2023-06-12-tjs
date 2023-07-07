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
    all:'/all',
    run: '/run',
    add: '/add',
    delete: '/delete',
    token: '/token'
})

export const WS_ADR="ws://localhost:8000/ws/patch/"
export const CHAT_ROOM_NAME="chat/"
export const PATCH_ROOM = "patch/"

export const GITLAB_ADR="https://gitlab.sciences-po.fr/api/v4/projects"

export const GITLAB_PROJECT = '491'

export const gitlabURI = Object.freeze({
    pipelines: '/pipelines',
    jobs: '/jobs',
    trace: '/trace'
})
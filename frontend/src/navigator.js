let navigator

export function setNavigator(navigatorFn){
    navigator=navigatorFn
}

export function navigateTo(path,options){
    navigator(path,options)
}
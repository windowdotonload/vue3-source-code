/*
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
 */
/*
 * @Descripttion:
 * @version:
 * @Author: windowdotonload
 */
import { isObject } from '@vue/shared'
import {
    mutableHandlers,
    shallowReactiveHandlers,
    readonlyHandlers,
    shallowReadonlyHandlers
} from './baseHandlers'



export function reactive(target) {
    //拦截对象，判断是否是仅读的
    return createReactieObject(target, false, mutableHandlers)
}

export function shallowReactive(target) {
    return createReactieObject(target, false, shallowReactiveHandlers)
}

export function readonly(target) {
    return createReactieObject(target, true, readonlyHandlers)
}

export function shallowReadonly(target) {
    return createReactieObject(target, true, shallowReadonlyHandlers)
}
// 是不是仅读，是不是深度，柯里化

const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()
export function createReactieObject(target, isReadOnly, baseHandlers) {
    // proxy拦截的是对象，如果不是对象无法代理
    if (!isObject(target)) {
        return target
    }
    // 需要判断一个对象是否已经被代理过，不要再次代理，可能存在第一次不是仅读代理，之后变为readonly，isReadOnly

    const proxyMap = isReadOnly ? readonlyMap : reactiveMap

    const existProxy = proxyMap.get(target)
    if (existProxy) {
        return existProxy
    }

    const proxy = new Proxy(target, baseHandlers)
    proxyMap.set(target, proxy)

    return proxy
}
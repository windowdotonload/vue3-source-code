/*
 * @Descripttion:
 * @version:
 * @Author: windowdotonload
 */
import { isObject } from '@vue/shared'
import { track } from './effect'
import { TrackOpTypes } from './operator'
import { readonly, reactive } from './reactive'
function createGetter(isReadOnly = false, shallow = false) {
    return function get(target, key) {
        const res = Reflect.get(target, key)
        if (!isReadOnly) {
            // 如果不是仅读的那么就需要去收集页面上的依赖，后续触发更新
            track(target, TrackOpTypes.GET, key)
        }
        if (shallow) {
            return res
        }
        if (isObject(res)) {
            // vue2一开始就递归，vue3懒代理，取值时再进行代理
            return isReadOnly ? readonly(res) : reactive(res)
        }
        return res
    }
}

function createSetter(Shallow = false) {
    return function set(target, key, value) {

    }
}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter()
const shallowSet = createSetter()

export const mutableHandlers = {
    get,
    set
}
export const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet
}
export const readonlyHandlers = {
    get: readonlyGet,
    set: (target, key) => {
        console.warn('NO! DA MIE')
    }
}
export const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set: (target, key) => {
        console.warn('NO! DA MIE')
    }
}

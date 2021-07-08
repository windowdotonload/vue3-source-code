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
import { hasOwn, isArray, isIntegerKey, isObject, hasChange } from '@vue/shared'
import { isAccessor } from 'typescript'
import { track, trigger } from './effect'
import { TrackOpTypes, TriggerOrTypes } from './operator'
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

        const oldValue = target[key]
        // 要区分是新增还是修改,数组和对象要区分开
        let haskey = isArray(oldValue) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key)

        const result = Reflect.set(target, key, value)

        if (haskey) {
            // 新增
            trigger(target, TriggerOrTypes.ADD, key, value)
        } else if (hasChange(oldValue, value)) {
            // 修改
            trigger(target, TriggerOrTypes.SET, key, value, oldValue)
        }



        // 数据更新时通知effect修改
        return result
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

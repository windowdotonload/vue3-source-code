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
    // reactivity返回proxy，访问属性触发get，本质上reactivity其实就是做了一件事：track
    // 换言之，调用reactivity包裹对象的目的就是为了部署track
    // 而track就是为了收集依赖
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
            // 如果不递归，那么修改state.age.age就不会触发响应式，只到state.age是响应式的
            return isReadOnly ? readonly(res) : reactive(res)
        }
        return res
    }
}

function createSetter(Shallow = false) {
    return function set(target, key, value) {
        const oldValue = target[key]
        // 要区分是新增还是修改,数组和对象要区分开
        // vue2中无法对新增的属性进行拦截，因为使用defineProperty属性必须要明确指导key是什么，而新增的属性无法预知属性名是什么
        // defintProperty(obj,key,handler)
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
const shallowSet = createSetter(true)

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

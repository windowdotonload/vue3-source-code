
import { hasChange, isArray, isObject } from "@vue/shared"
import { track, trigger } from "./effect"
import { TrackOpTypes, TriggerOrTypes } from './operator'
import { reactive } from "./reactive"


export function ref(value) {
    // value 是一个普通类型
    // 将一个普通类型变成对象
    return createRef(value)
}

export function shallowRef(value) {
    return createRef(value, true)
}

const convert = (val) => isObject(val) ? reactive(val) : val
class RefImpl {
    public _value
    public __v_isRef = true
    constructor(public rawValue, public shallow) {
        this._value = shallow ? rawValue : convert(rawValue)
    }

    get value() {
        track(this, TrackOpTypes.GET, 'value')

        return this._value
    }

    set value(newValue) {
        if (hasChange(newValue, this.rawValue)) {
            this.rawValue = newValue
            this._value = this.shallow ? newValue : convert(newValue)
            trigger(this, TriggerOrTypes.SET, 'value', newValue)
        }
    }
}

class ObjectRefImpl {
    public __v_isRef = true
    public _value
    constructor(public target, public key) {

    }
    get value() {
        return this.target[this.key]
    }
    set value(newValue) {
        this.target[this.key] = newValue
    }
}

function createRef(rawValue, shallow = false) {
    return new RefImpl(rawValue, shallow)
}

export function toRef(target, key) {
    return new ObjectRefImpl(target, key)
}

export function toRefs(object) {
    const res = isArray(object) ? new Array(object.length) : {}
    for (let key in object) {
        res[key] = toRef(object, key)
    }
    return res
}
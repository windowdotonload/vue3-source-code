import { hasChange } from "@vue/shared"
import { track, trigger } from "./effect"
import { TrackOpTypes, TriggerOrTypes } from './operator'

/*
 * @Descripttion:
 * @version:
 * @Author: windowdotonload
 */
export function ref(value) {
    // value 是一个普通类型
    // 将一个普通类型变成对象
    return createRef(value)
}

export function shallowRef(value) {
    return createRef(value, true)
}

class RefImpl {
    public _value
    public __v_isRef = true
    constructor(public rawValue, public shallow) {
        this._value = rawValue
    }

    get value() {
        track(this, TrackOpTypes.GET, 'value')

        return this._value
    }

    set value(newValue) {
        if (hasChange(newValue, this.rawValue)) {
            this.rawValue = newValue
            this._value = newValue
            trigger(this, TriggerOrTypes.SET, 'value', newValue)
        }
    }
}

function createRef(rawValue, shallow = false) {
    return new RefImpl(rawValue, shallow)
}
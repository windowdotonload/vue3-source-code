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

    }
}

function createRef(rawValue, shallow = false) {
    return new RefImpl(rawValue, shallow)
}
/*
 * @Descripttion:
 * @version:
 * @Author: windowdotonload
 */

// effect 相当于vue2中的watcher
export function effect(fn, options: any = {}) {
    const effect = createReactiveEffect(fn, options)

    if (!options.lazy) {
        // 不是懒执行，立即执行一次
        effect()
    }

    return effect
}

let uid = 0
let activeEffect         //存储当前的effect
const effectStack = []
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (effectStack.includes(effect)) { //保证effect没有加入到effectstack中
            try {
                activeEffect = effect
                effectStack.push(effect)
                return fn()   //函数执行时会取值，触发get
            } finally {
                effectStack.pop()
                activeEffect = effectStack[effectStack.length - 1]
            }
        }
    }
    effect.id = uid++
    effect._isEffect = true
    effect.raw = fn
    effect.options = options
    return effect
}

const targetMap = new WeakMap()
// 让某个对象的属性收集当前对应的effect函数
export function track(target, type, key) { //可以拿到当前的effect
    if (activeEffect === undefined) {
        return
    }
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(targetMap, (depsMap = new Map))
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set))
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
    }
}
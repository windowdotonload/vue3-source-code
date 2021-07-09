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

import { isArray, isIntegerKey } from "@vue/shared"
import { TriggerOrTypes } from './operator'

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
        if (!effectStack.includes(effect)) { //保证effect没有加入到effectstack中
            try {
                activeEffect = effect
                effectStack.push(effect)
                return fn()   //函数执行时会取值，触发get --> 调用track
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
export function track(target, type, key) { //可以拿到当前的effect  ---> activeEffect
    if (activeEffect === undefined) {
        return
    }
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map))
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set))
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
    }
    //↓↓↓      target                    map
    // {name:1,age：{a:1}}  ----->   [name,set(effect)]
}

export function trigger(target, type, key?, newValue?, oldValue?) {
    // 如果这个属性没有收集过effect，则不需要做任何操作
    const depsMap = targetMap.get(target)
    if (!depsMap) return
    // 将所有的effect存到一个新的集合中，最终一起执行
    const effects = new Set()
    const add = (effectsToAdd) => {
        if (effectsToAdd) {
            effectsToAdd.forEach(effect => effects.add(effect));
        }
    }
    // 1、看修改的是否是数组的长度
    if (isArray(target) && key === 'length') {
        depsMap.forEach((dep, key) => {
            // 针对于key是length，数组的设置的index大于length的newValue
            // 例如改变state.arr.length = 1,而原本有一个属性state.arr[2],2大于新设置的1，所以需要更新
            if (key === 'length' || key > newValue) {
                add(dep)
            }
        });
    } else {
        // 可能是对象
        if (key !== undefined) {
            add(depsMap.get(key))
        }
        // 可能是修改数组某一项
        switch (type) {
            case TriggerOrTypes.ADD:
                if (isArray(target) && isIntegerKey(key)) {
                    add(depsMap.get('length'))
                }
        }
    }
    effects.forEach((effect: any) => effect())
}
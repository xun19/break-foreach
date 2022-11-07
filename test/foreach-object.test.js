// const bindForEach = require('../break-foreach.js')

const bindForEach = ({target, flag = false, funcName = 'forEach'}) => {
    const breakSymbol = 'BREAK_FOREACH'
    if (target instanceof Array) {
        const arrProto = Object.create(Array.prototype)
        arrProto[funcName] = function(callback, _this) {
            if (typeof callback !== 'function') return
            try {
                Array.prototype.forEach.call(this, (val, index) => {
                    const res = callback.apply(_this,[val, index, this])
                    if (res === flag) throw new Error(breakSymbol)
                })
            } catch(e) {
                const { message } = e
                if (message !== breakSymbol) throw new Error(message)
            }
        }
        target.__proto__ = arrProto
    } else if (target instanceof Set) {
        const setProto = Object.create(Set.prototype)
        setProto[funcName] = function(callback, _this) {
            if (typeof callback !== 'function') return
            try {
                let index = 0
                Set.prototype.forEach.call(this, (val) => {
                    const res = callback.apply(_this,[val, index, this])
                    if (res === flag) throw new Error(breakSymbol)
                    index += 1
                })
            } catch(e) {
                const { message } = e
                if (message !== breakSymbol) throw new Error(message)
            }
        }
        target.__proto__ = setProto
    } else if (target instanceof Map) {
        const mapProto = Object.create(Map.prototype)
        mapProto[funcName] = function(callback, _this) {
            if (typeof callback !== 'function') return
            try {
                Map.prototype.forEach.call(this, (val, index) => {
                    const res = callback.apply(_this, [val, index, this])
                    if (res === flag) throw new Error(breakSymbol)
                })
            } catch(e) {
                const { message } = e
                if (message !== breakSymbol) throw new Error(message)
            }
        }
        target.__proto__ = mapProto
    } else if (target instanceof Object) {
        Object.defineProperty(target, funcName, {
            value: function(callback, _this) {
                if (typeof callback !== 'function') return
                try {
                    Object.keys(target).forEach((key) => {
                        const res = callback.apply(_this, [target[key], key, this])
                        if (res === flag) throw Error(breakSymbol)
                    })
                } catch(e) {
                    const { message } = e
                    if (message !== breakSymbol) throw new Error(message)
                }
            }
        })
    }
}

describe('测试输入为Object类型', () => {
    test('测试输入为Object类型，forEach被重写', () => {
        const target = {a: 1, b: 2, c: -1, d: 4} 
    
        bindForEach({ // 可用于任意可迭代对象
            target
        })
        expect(target.forEach).not.toBe(undefined)
    })
    
    // test('不同target的__proto__不同', () => { // fail
    //     const target1 = {}
    //     const target2 = {}
    //     bindForEach({ target1 })
    //     bindForEach({ target2 })
    //     expect(target1.__proto__).toBe(target2.__proto__) // why? __proto__应该指向了不同的原型对象才对
    //     expect(target1.forEach).toBe(target2.forEach) // forEach也一样
    // })
    
    it(`测试被重写后的forEach是function类型`, () => {
        const target = {a: 1, b: 2, c: -1, d: 4}
        bindForEach({
            target
        })
        expect(typeof target.forEach).toBe('function')
    })
    
    it(`测试更改'forEach'的函数名`, () => {
        const target = {a: 1, b: 2, c: -1, d: 4}
        bindForEach({
            target,
            funcName: '_forEach' 
        })
        expect(target.forEach).toBe(undefined)
        expect(typeof target._forEach).toBe('function')
    })
    
    it(`测试this指向指定对象`, () => {
        const target = {a: 1, b: 2, c: -1, d: 4}
        const otherObject = {}
        const extraObject = {}
        bindForEach({ // 可用于任意可迭代对象
            target 
        })
        expect(typeof target.forEach).toBe('function')
        target.forEach(function() {
            expect(this).not.toBe(target)
            expect(this).not.toBe(extraObject)
            expect(this).toBe(otherObject)
        }, otherObject)
    })
    
    test(`测试forEach被指定的flag给break`, () => {
        const target = {a: 1, b: 2, c: -1, d: 4}
        const BREAK_FLAG = 'break'
        bindForEach({ target, flag: BREAK_FLAG })
        const breakCondition = (val, index, t) => {
            return {
                index,
                result: val < 0
            }
        }
        expect(typeof target.forEach).toBe('function')
        let breakResult = false
        target.forEach((val, index, t) => {
            const { result } = breakCondition(val, index, t)
            if (result) {
                breakResult = true
                return BREAK_FLAG
            }
            expect(breakResult).not.toBe(true) // 若是为breakResult（break条件的结果）为true，则在上边已经被return停止了，不会执行到下面。以此来验证功能的正确性
        })
    })
    
    test(`测试forEach被默认的flag( false )给break`, () => {
        const target = {a: 1, b: 2, c: -1, d: 4}
        bindForEach({ target })
        const breakCondition = (val, index, t) => {
            return {
                index,
                result: val < 0
            }
        }
        expect(typeof target.forEach).toBe('function')
        let breakResult = false
        target.forEach((val, index, t) => {
            const { result } = breakCondition(val, index, t)
            if (result) {
                breakResult = true
                return false
            }
            expect(breakResult).not.toBe(true) // 若是为breakResult（break条件的结果）为true，则在上边已经被return停止了，不会执行到下面。以此来验证功能的正确性
        })
    })
    
    test(`测试forEach return无效flag，此时遍历不会终止`, () => {
        const target = {a: 1, b: 2, c: -1, d: 4}
        const arr = Object.keys(target).map(key => target[key])
        const BREAK_FLAG = 'break'
        const NOT_BREAK_FLAG = 'not break'
        bindForEach({ target, flag: BREAK_FLAG })
        const breakCondition = (val, index, t) => {
            return {
                index,
                result: val < 0
            }
        }
        expect(typeof target.forEach).toBe('function')
        let returnIndex = 0
        const iteractRecord = []
        let count = 0
        target.forEach((val, key, t) => {
            const { result } = breakCondition(val, key, t)
            if (result) {
                returnIndex = count
                return NOT_BREAK_FLAG
            }
            iteractRecord.push(val)
            count += 1
            // 验证：遍历会进行下去
        })
        arr.splice(returnIndex, 1) // 但不包含return的那次遍历的值，因此要比较的话，target里边也要去掉
        expect(iteractRecord).toEqual(arr)
    })
    test('测试回调函数被forEach调用', () => {
        const callback = jest.fn(() => {})
        const target = {a: 1, b: 2, c: -1, d: 4}
        bindForEach({ target })
        expect(typeof target.forEach).toBe('function')
        target.forEach(callback)
        expect(callback).toBeCalled()
    })
    test('测试回调函数被forEach调用制定次数', () => {
        const target = {a: 1, b: 2, c: -1, d: 4}
        const arr = Object.keys(target).map(key => target[key])
        const times = arr.findIndex(item => item < 0) + 1 // 调用次数 = 符合终止条件的元素的索引 + 1
        const breakCondition = (val, index, t) => {
            return {
                index,
                result: val < 0
            }
        }
        const callback = jest.fn((val, index, t) => {
            const { result } = breakCondition(val, index, t)
            if (result) {
                return false
            }
        })

        bindForEach({ target })
        target.forEach(callback)
        expect(callback).toBeCalledTimes(times) // 观察callback是否被调用指定次数
    })
    test('回调函数的index是对象的key', () => { // 若测试语义足够好，根据语义好像就能写出用例代码了
        const target = {a: 1, b: 2, c: -1, d: 4}
        const keys =  Object.keys(target)
        let count = 0
        bindForEach({ target })
        target.forEach((val, key) => {
            expect(key).toBe(keys[count])
            count += 1
        })
    })
    test('回调函数的第一个参数是对象的值', () => {
        const target = {a: 1, b: 2, c: -1, d: 4}
        const arr = Object.keys(target).map(key => target[key])
        let count = 0
        bindForEach({ target })
        target.forEach((val, index) => {
            expect(val).toBe(arr[count])
            count += 1
        })
    })
    test('第三个参数返回的是target本身', () => {
        const target = {a: 1, b: 2, c: -1, d: 4}
        bindForEach({ target })
        target.forEach((val, index, t) => {
            expect(t).toBe(target)
        })
    })

    test('对象在bindForEach后仍可以进行原生操作', () => {
        const target = {a: 1, b: 2, c: -1, d: 4}
        const pushFlag = 'PUSH'
        const unshiftFlag = 'UNSHIFT'
        bindForEach({ target })
        target.push = pushFlag
        target.unshift = unshiftFlag
        target.forEach((val, key, t) => {
            if (key === 'push') {
                expect(t[key]).toBe(pushFlag)
            } else if (key === 'unshift') {
                expect(t[key]).toBe(unshiftFlag)
            }
        })
    })
    test('对象在执行forEach后仍可以进行原生操作', () => {
        const target = {a: 1, b: 2, c: -1, d: 4}
        const pushFlag = 'PUSH'
        const unshiftFlag = 'UNSHIFT'
        const delFlag = 'DEL'
        bindForEach({ target })
        target.forEach(() => {})
        target.push = pushFlag
        target.unshift = unshiftFlag
        target.del = delFlag
        delete target.del

        expect(target.push).toBe(pushFlag)
        expect(target.unshift).toBe(unshiftFlag)
        expect(target.del).not.toBe(delFlag)
        expect(target.del).toBe(undefined)
    })
    // 测试传入forEach的不是函数时，不会进行后续执行
})

// 使用fn() 设置返回值
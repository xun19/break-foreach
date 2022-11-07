const bindForEach = require('../break-foreach.js')

describe('测试输入为Map类型', () => {
    test('测试输入为Map类型，forEach被重写', () => {
        const target = new Map([[1, 'a'], ['a', -1], ['b', 2]]) 
    
        bindForEach({ // 可用于任意可迭代对象
            target
        })
        expect(target.forEach).not.toBe(Map.prototype.forEach)
    })
    
    test('测试输入为Number类型时无效', () => {
        const target = 0
    
        bindForEach({ // 可用于任意可迭代对象
            target
        })
        expect(target.forEach).toBe(undefined)
    })
    
    test('测试输入为String类型时无效', () => {
        const target = 'this is a string'
    
        bindForEach({ // 可用于任意可迭代对象
            target
        })
        expect(target.forEach).toBe(undefined)
    })
    
    test('测试输入为Boolean类型时无效', () => {
        const target = 'this is a string'
    
        bindForEach({ // 可用于任意可迭代对象
            target
        })
        expect(target.forEach).toBe(undefined)
    })
    
    test('测试输入为null类型时无效', () => {
        const target = null
    
        bindForEach({ // 可用于任意可迭代对象
            target
        })
        expect(target).toBe(null)
    })
    
    test('测试输入为undefined类型时无效', () => {
        const target = undefined
    
        bindForEach({ // 可用于任意可迭代对象
            target
        })
        expect(target).toBe(undefined)
    })
    
    // test('different target __proto__ is not be same', () => { // fail
    //     const target1 = []
    //     const target2 = []
    //     bindForEach({ target1 })
    //     bindForEach({ target2 })
    //     expect(target1.__proto__).not.toBe(target2.__proto__) // why? __proto__应该指向了不同的原型对象才对
    //     expect(target1.forEach).not.toBe(target2.forEach)
    // })
    
    it(`测试被重写后的forEach是function类型`, () => {
        const target = new Map([[1, 'a'], ['a', -1], ['b', 2]])
        bindForEach({
            target
        })
        expect(typeof target.forEach).toBe('function')
    })
    
    it(`测试更改'forEach'的函数名`, () => {
        const target = new Map([[1, 'a'], ['a', -1], ['b', 2]])
        bindForEach({
            target,
            funcName: '_forEach' 
        })
        expect(target.forEach).toBe(Map.prototype.forEach)
        expect(typeof target._forEach).toBe('function')
    })
    
    it(`测试this指向指定对象`, () => {
        const target = new Map([[1, 'a'], ['a', -1], ['b', 2]])
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
        const target = new Map([[1, 'a'], ['a', -1], ['b', 2]])
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
        const target = new Map([[1, 'a'], ['a', -1], ['b', 2]])
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
        const target = new Map([[0, 0], [1, -1], [2, 2]]) // 是否应该构造更复杂的Map
        const arr = Array.from(target, (item) => item[1])
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
        target.forEach((val, index, t) => {
            const { result } = breakCondition(val, index, t)
            if (result) {
                returnIndex = index
                return NOT_BREAK_FLAG
            }
            iteractRecord.push(val)
            // 验证：遍历会进行下去
        })

        arr.splice(returnIndex, 1) // 但不包含return的那次遍历的值，因此要比较的话，target里边也要去掉
        expect(iteractRecord).toEqual(arr)
    })
    test('测试回调函数被forEach调用', () => {
        const callback = jest.fn(() => {})
        const target = new Map([[1, 'a'], ['a', -1], ['b', 2]])
        bindForEach({ target })
        expect(typeof target.forEach).toBe('function')
        target.forEach(callback)
        expect(callback).toBeCalled()
    })
    test('测试回调函数被forEach调用制定次数', () => {
        const target = new Map([[1, 'a'], ['a', -1], ['b', 2]])
        const arr = Array.from(target, (item) => item[1])
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
    test('回调函数的index是map的key', () => { // 若测试语义足够好，根据语义好像就能写出用例代码了
        const target = new Map([[1, 'a'], ['a', -1], ['b', 2]])
        const keys = Array.from(target, (item) => item[0])
        let count = 0
        bindForEach({ target })
        target.forEach((val, key) => {
            expect(key).toBe(keys[count])
            count += 1
        })
    })
    test('回调函数的第一个参数是map的值', () => {
        const target = new Map([[1, 'a'], ['a', -1], ['b', 2]])
        bindForEach({ target })
        target.forEach((val, key) => {
            expect(val).toBe(target.get(key))
        })
    })
    test('第三个参数返回的是target本身', () => {
        const target = new Map([[1, 'a'], ['a', -1], ['b', 2]])
        bindForEach({ target })
        target.forEach((val, index, t) => {
            expect(t).toBe(target)
        })
    })
    test('Map在bindForEach后仍可以进行原生操作', () => {
        const target = new Map([[1, 'a'], ['a', -1], ['b', 2]])
        const pushFlag = 'PUSH'
        bindForEach({ target })
        target.set('push', pushFlag)
        target.forEach((val, key) => {
            if (key === 'push') {
                expect(val).toBe(pushFlag)
                expect(target.get(key)).toBe(pushFlag)
            }
        })
    })
    test('Map在执行forEach后仍可以进行原生操作', () => {
        const target = new Map([[1, 'a'], ['a', -1], ['b', 2]])
        const pushFlag = 'PUSH'
        bindForEach({ target })
        target.forEach(() => {})
        target.set('push', pushFlag)
        expect(target.get('push')).toBe(pushFlag)
    })
    // 测试传入forEach的不是函数时，不会进行后续执行
})

// 使用fn() 设置返回值
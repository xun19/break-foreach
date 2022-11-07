const bindForEach = require('../break-foreach.js')

describe('测试输入为Set类型', () => {
    test('测试输入为Set类型，forEach被重写', () => {
        const target = new Set([1,2,-3,3]) 
    
        bindForEach({ // 可用于任意可迭代对象
            target
        })
        expect(target.forEach).not.toBe(Set.prototype.forEach)
    })
    
    it(`测试被重写后的forEach是function类型`, () => {
        const target = new Set([1,2,-3,3])
        bindForEach({
            target
        })
        expect(typeof target.forEach).toBe('function')
    })
    
    it(`测试更改'forEach'的函数名`, () => {
        const target = new Set([1,2,-3,3])
        bindForEach({
            target,
            funcName: '_forEach' 
        })
        expect(target.forEach).toBe(Set.prototype.forEach)
        expect(typeof target._forEach).toBe('function')
    })
    
    it(`测试this指向指定对象`, () => {
        const target = new Set([1,2,-3,3])
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
        const target = new Set([1,2,-3,3])
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
        const target = new Set([1,2,-3,3])
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
        const target = new Set([1,2,-3,3])
        const arr = Array.from(target)
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
        const target = [1, 2]
        bindForEach({ target })
        expect(typeof target.forEach).toBe('function')
        target.forEach(callback)
        expect(callback).toBeCalled()
    })
    test('测试回调函数被forEach调用制定次数', () => {
        const target = new Set([1,2,-3,3])
        const arr = Array.from(target)
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
    test('回调函数的index是索引，而非Set值', () => { // 若测试语义足够好，根据语义好像就能写出用例代码了
        const target = new Set([1,2,-3,3])
        let count = 0
        bindForEach({ target })
        target.forEach((val, index) => {
            expect(index).toBe(count)
            count += 1
        })
    })
    test('回调函数的第一个参数是Set值', () => { // 验证了回调函数的index是索引，而非Set值，因此可以使用index
        const target = new Set([1,2,-3,3])
        const arr = Array.from(target)
        bindForEach({ target })
        target.forEach((val, index) => {
            expect(val).toBe(arr[index])
        })
    })
    test('第三个参数返回的是target本身', () => {
        const target = new Set([1,2,-3,3])
        bindForEach({ target })
        target.forEach((val, index, t) => {
            expect(t).toBe(target)
        })
    })

    test('Set在bindForEach后仍可以进行原生操作', () => {
        const target = new Set([1,2,-3,3])
        const pushFlag = 'PUSH'
        bindForEach({ target })
        target.add(pushFlag)
        target.forEach(() => {})
        expect(target.has(pushFlag)).toBe(true)
    })
    test('Set在执行forEach后仍可以进行原生操作', () => {
        const target = new Set([1,2,-3,3])
        const pushFlag = 'PUSH'
        bindForEach({ target })
        target.forEach(() => {})
        target.add(pushFlag)
        expect(target.has(pushFlag)).toBe(true)
    })
    // 测试传入forEach的不是函数时，不会进行后续执行
})

// 使用fn() 设置返回值
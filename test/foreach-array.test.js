const bindForEach = require('../break-foreach.js')
// TDD: 意思是先写这些测试代码，对照测试代码准确理解了需求，再进行相关的开发？
// 工程化的东西。这还是比较复杂和难以控制的（不是针对我而言，而是针对人类而言）。
// 需要一套精确、有效的方法论来一步步实施（例如确定要测试的单元模块的复杂度、以及编写测试代码的复杂度）。否则就只是停留在美好的理论上而已。
// BDD <-(用BDD写测试用例【如何使用该单元模块（UI和方法库虽然用例编写方法不同，但是思想是一致的）】) TDD (TDD驱动开发)-> develop
// 自动化测试的成本太高，基本上可以跟开发持平了（越复杂的开发，其功能必定越复杂，因此测试也必定越复杂）。因此需要特别谨慎的平衡

describe('测试输入为Array类型', () => {
    test('测试输入为Array类型，forEach被重写', () => {
        const target = [1, 2, -1, 3]
    
        bindForEach({ // 可用于任意可迭代对象
            target 
        })
        expect(target.forEach).not.toBe(Array.prototype.forEach)
    })
    
    test('测试输入为Number类型时无效', () => {
        const target = 0
    
        bindForEach({ // 可用于任意可迭代对象
            target
        })
        expect(target.forEach).toBe(undefined) // ?
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
    
    test('不同target的__proto__不同', () => { // fail
        const target1 = []
        const target2 = []
        bindForEach({ target: target1 })
        bindForEach({ target: target2 })
        expect(target1.__proto__).not.toBe(target2.__proto__)
        expect(target1.__proto__.forEach).not.toBe(target2.__proto__.forEach)

    })
    
    it(`测试被重写后的forEach是function类型`, () => {
        const target = [1, 2]
        bindForEach({
            target
        })
        expect(typeof target.forEach).toBe('function')
    })
    
    it(`测试更改'forEach'的函数名`, () => {
        const target = [1, 2]
        bindForEach({
            target,
            funcName: '_forEach' 
        })
        expect(target.forEach).toBe(Array.prototype.forEach)
        expect(typeof target._forEach).toBe('function')
    })
    
    it(`测试this指向指定对象`, () => {
        const target = [1, 2]
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
        const target = [1, 2, -1, 3, 4, 5]
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
        const target = [1, 2, -1, 3, 4, 5]
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
        const target = [1, 2, -1, 3, 4, 5]
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
        target.splice(returnIndex, 1) // 但不包含return的那次遍历的值，因此要比较的话，target里边也要去掉
        expect(iteractRecord).toEqual(target)
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
        const target = [1, 2, 3, -1, 4, 5]
        const times = target.findIndex(item => item < 0) + 1 // 调用次数 = 符合终止条件的元素的索引 + 1
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
    test('第三个参数返回的是target本身', () => {
        const target = [1, 2, 3, -1, 4, 5]
        bindForEach({ target })
        target.forEach((val, index, t) => {
            expect(t).toBe(target)
        })
    })

    test('数组在bindForEach后仍可以进行原生操作', () => {
        const target = [1, 2, 3, 4, 5]
        const pushFlag = 'PUSH'
        const unshiftFlag = 'UNSHIFT'
        bindForEach({ target })
        target.push(pushFlag)
        target.unshift(unshiftFlag)
        const last = target.length - 1
        target.forEach((val, index, t) => {
            if (index === 0) {
                expect(val).toBe(unshiftFlag)
            } else if (index === last) {
                expect(val).toBe(pushFlag)
            }
        })
    })
    test('数组在执行forEach后仍可以进行原生操作', () => {
        const target = [1, 2, 3, 4, 5]
        const pushFlag = 'PUSH'
        const unshiftFlag = 'UNSHIFT'
        bindForEach({ target })
        target.forEach(() => {})
        target.push(pushFlag)
        target.unshift(unshiftFlag)
        const last = target.length - 1
        expect(target[0]).toBe(unshiftFlag)
        expect(target[last]).toBe(pushFlag)
    })

    // 测试传入forEach的不是函数时，不会进行后续执行
})

// 使用fn() 设置返回值
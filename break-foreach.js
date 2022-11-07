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

module.exports = bindForEach
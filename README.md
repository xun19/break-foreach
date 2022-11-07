<p align="center">
  <img src="https://img.shields.io/badge/break-forEach---" alt="vue ring component">
  <img src="https://img.shields.io/badge/general-Array, Map, Set and normal Object---" alt="easy">
</p>

# Choose Language/选择语言
- [English](#user-content-english)
- [中文](#user-content-chinese)

<a name="english"></a>

# - Document

## 💡Introduction
Let's **Break the forEach Function!** 😎

This is a method that allows you to stop the iteration of forEach function in ES6+. No longer need to stop the forEach with a ugly syntax 'try-catch'.

## ⚙️Feature
- Return a flag (I call it 'Break Flag' and its default-value is 'false') then stop the iteration of forEach function.
- General for different type **includes Array, Map, Set and normal Object**.
- You can customize the iteration function name **(e.g. myForEach)**, if you want to remain the native forEach function.
- You can customize the 'Break Flag' you like.
- Provide a Object the ability to be iterated over.Of course, you can also stop the iteration anytime.

## ⬇️Installation
```javascript
npm i break-foreach
```
Or copy the JavaScript code on https://github.com/xun19/break-foreach
## 🔨Usage
### 1）Basic Usage
```
    const wrapForEach = require('break-foreach')

    const array = [1, 2, -1, 3, 4]
    wrapForEach({ target: array })

    array.forEach((val, index, arr) => {
        if (val < 0) return false // Iteration will stop because you return a Break Flag.
        console.log(val, index, arr)
    })
    // output:
    // 1, 0, [1, 2, -1, 3, 4]
    // 2, 1, [1, 2, -1, 3, 4]
    // Iteration stops on this step.
```

### 2）Usage on different Type
```
    const wrapForEach = require('break-foreach')
    
    /* Array */
    const array = [1, 2, -1, 3, 4]
    wrapForEach({ target: array })

    array.forEach((val, index, arr) => {
        if (val < 0) return false // Iteration will stop because you return a Break Flag.
        console.log(val, index, arr)
    })
    // output:
    // 1, 0, [1, 2, -1, 3, 4]
    // 2, 1, [1, 2, -1, 3, 4]
    // Iteration stops on this step.


    /* Set */
    const set = new Set([1, 2, -1, 3])
    wrapForEach({ target: set })

    set.forEach((val, index, s) => {
        if (val < 0) return false // Iteration will stop because you return a Break Flag.
        console.log(val, index, s)
    })
    // output:
    // 1, 0, Set([1, 2, -1, 3])
    // 2, 1, Set([1, 2, -1, 3])
    // Iteration stops on this step.

    
    /* Map */
    const map = new Map([[0, 0], [{}, 1], ['a', -1], ['b', -2]])
    wrapForEach({ target: map })

    map.forEach((val, key, m) => {
        if (val < 0) return false // Iteration will stop because you return a Break Flag.
        console.log(val, key, m)
    })
    // output:
    // 1, 0, Map([[0, 0], [{}, 1], ['a', -1], ['b', -2]])
    // 2, {}, Map([[0, 0], [{}, 1], ['a', -1], ['b', -2]])
    // Iteration stops on this step.


    /* Object */
    const obj = {a: 1, b: 2, c: -1, d: 3}
    wrapForEach({ target: obj })

    obj.forEach((val, key, o) => {
        if (val < 0) return false // Iteration will stop because you return a Break Flag.
        console.log(val, key, o)
    })
    // output:
    // 1, 'a', {a: 1, b: 2, c: -1, d: 3}
    // 2, 'b', {a: 1, b: 2, c: -1, d: 3}
    // Iteration stops on this step.
```

### 3）Customize your Break Flag
```
    const wrapForEach = require('break-foreach')
    
    const array = [1, 2, -1, 3, 4]
    const BREAK = 'my break flag' // It can be any Type.
    wrapForEach({ 
        target: array,
        flag: BREAK
     })

    array.myForEach((val, index, arr) => {
        if (val < 0) return BREAK // return your Break Flag here.
        console.log(val, index, arr)
    })
    // output:
    // 1, 0, [1, 2, -1, 3, 4]
    // 2, 1, [1, 2, -1, 3, 4]
    // Iteration stops on this step.
```


### 4）Customize your iteration function name
```
    const wrapForEach = require('break-foreach')

    const array = [1, 2, -1, 3, 4]
    wrapForEach({ 
        target: array,
        funcName: 'myForEach'
     })

    array.myForEach((val, index, arr) => {
        if (val < 0) return false // Iteration will stop because you return a Break Flag.
        console.log(val, index, arr)
    })
    // output:
    // 1, 0, [1, 2, -1, 3, 4]
    // 2, 1, [1, 2, -1, 3, 4]
    // Iteration stops on this step.

    array.forEach === Array.prototype.forEach // true. Native forEach function will be remained
```


## 🌟github
https://github.com/xun19/break-foreach

If you think this component has brought you help, welcome to star and provide valuable advice ~ 😊

<a name="chinese"></a>

# - 文档

## 💡介绍
来把forEach函数**break**掉吧! 😎

这个模块能让你停止一个forEach函数的遍历，适用于ES6+。你可以不再用“try-catch”的写法去实现这个功能。

## ⚙️功能
- 返回一个flag值（若没有设置，则默认是false），来让forEach函数停止遍历
- 适用于不同的类型，包括**Array、Map、Set、普通Object**
- 如果你想保留原生的forEach方法，可以自定义遍历函数的名字，比如命名为myForEach
- 可以自定义停止遍历的flag值
- 提供了让普通Object被遍历（当然也能随时停止它）的能力

## ⬇️安装
```javascript
npm i break-foreach
```
Or copy the JavaScript code on https://github.com/xun19/break-foreach
## 🔨使用
### 1）基本使用
```
    const wrapForEach = require('break-foreach')

    const array = [1, 2, -1, 3, 4]
    wrapForEach({ target: array })

    array.forEach((val, index, arr) => {
        if (val < 0) return false // 返回了一个flag，遍历将会停止
        console.log(val, index, arr)
    })
    // output:
    // 1, 0, [1, 2, -1, 3, 4]
    // 2, 1, [1, 2, -1, 3, 4]
    // 遍历会在这一步停止
```

### 2）对不同类型进行使用
```
    const wrapForEach = require('break-foreach')
    
    /* Array */
    const array = [1, 2, -1, 3, 4]
    wrapForEach({ target: array })

    array.forEach((val, index, arr) => {
        if (val < 0) return false // 返回了一个flag，遍历将会停止
        console.log(val, index, arr)
    })
    // output:
    // 1, 0, [1, 2, -1, 3, 4]
    // 2, 1, [1, 2, -1, 3, 4]
    // 遍历会在这一步停止


    /* Set */
    const set = new Set([1, 2, -1, 3])
    wrapForEach({ target: set })

    set.forEach((val, index, s) => {
        if (val < 0) return false // 返回了一个flag，遍历将会停止
        console.log(val, index, s)
    })
    // output:
    // 1, 0, Set([1, 2, -1, 3])
    // 2, 1, Set([1, 2, -1, 3])
    // 遍历会在这一步停止

    
    /* Map */
    const map = new Map([[0, 0], [{}, 1], ['a', -1], ['b', -2]])
    wrapForEach({ target: map })

    map.forEach((val, key, m) => {
        if (val < 0) return false // 返回了一个flag，遍历将会停止
        console.log(val, key, m)
    })
    // output:
    // 1, 0, Map([[0, 0], [{}, 1], ['a', -1], ['b', -2]])
    // 2, {}, Map([[0, 0], [{}, 1], ['a', -1], ['b', -2]])
    // 遍历会在这一步停止


    /* Object */
    const obj = {a: 1, b: 2, c: -1, d: 3}
    wrapForEach({ target: obj })

    obj.forEach((val, key, o) => {
        if (val < 0) return false // 返回了一个flag，遍历将会停止
        console.log(val, key, o)
    })
    // output:
    // 1, 'a', {a: 1, b: 2, c: -1, d: 3}
    // 2, 'b', {a: 1, b: 2, c: -1, d: 3}
    // 遍历会在这一步停止
```

### 3）自定义停止遍历的flag值
```
    const wrapForEach = require('break-foreach')
    
    const array = [1, 2, -1, 3, 4]
    const BREAK = 'my break flag' // flag可以是任意类型
    wrapForEach({ 
        target: array,
        flag: BREAK
     })

    array.myForEach((val, index, arr) => {
        if (val < 0) return BREAK // 在这里返回你的flag
        console.log(val, index, arr)
    })
    // output:
    // 1, 0, [1, 2, -1, 3, 4]
    // 2, 1, [1, 2, -1, 3, 4]
    // 遍历会在这一步停止
```


### 4）自定义遍历函数名
```
    const wrapForEach = require('break-foreach')

    const array = [1, 2, -1, 3, 4]
    wrapForEach({ 
        target: array,
        funcName: 'myForEach'
     })

    array.myForEach((val, index, arr) => {
        if (val < 0) return false // 返回了一个flag，遍历将会停止
        console.log(val, index, arr)
    })
    // output:
    // 1, 0, [1, 2, -1, 3, 4]
    // 2, 1, [1, 2, -1, 3, 4]
    // 遍历会在这一步停止

    array.forEach === Array.prototype.forEach // true. 原生的forEach函数将会继续保留
```


## 🌟github
https://github.com/xun19/break-foreach

If you think this component has brought you help, welcome to star and provide valuable advice ~ 😊

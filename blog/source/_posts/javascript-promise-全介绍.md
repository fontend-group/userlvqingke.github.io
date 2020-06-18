---
title: javascript promise 全介绍
date: 2020-06-16 20:22:48
tags: ['javascript', 'promise', '异步']
---
### promise ajax async/await 关系
1. promise是一个语法，用来处理异常行为，优化异步的语法
2. ajax，是JavaScript中一种技术名称，可以向服务器传送或获取资源，并且不需要重新渲染页面，大大减轻了服务器的压力和提高了用户的体验。
3. async/await， 是可以基于promise来处理异步语法结构，使之更适类似同步语言，易读。

### Promise结构
![Promise结构](../../../../image/promise1.jpg)
Promise 为构造函数，也是一个对象，从上图可以知道，Promise可以直接使用的有：
```
Promise.all()
Promise.allSettled()
Promise.race()
Promise.resolve()
Promise.reject()
```
通过new操作符创建的对象，可以使用Promise原型（prototype）中的方法/属性：
```
let p = new Promise((resolve, reject) => {

});
p.then()
p.catch()
p.finally()
```

### Promise 状态
Promise执行异步操作有着不同的进度状态：
```
pending: Promise事件已在运行中，尚未取得结果
fulfilled/resolved: Promise事件已执行完毕且操作成功，回传resolve结果
rejected: Promise事件已执行完毕且操作失败，回传reject结果
```
判断Promise事件是否执行完毕，看Promise事件中的resolve/reject事件是否触发。如果两个都没有触发，则Promise事件停留在pending状态
![Promise 状态](../../../../image/promise2.png)
```
[[PromiseStatus]]: "pending" // 表示目前的进度状态
[[PromiseValue]]: undefined // 表示resolve和reject的返回值
```
观察下面Promise事件的状态变化及回传值
![Promise 状态](../../../../image/promise3.png)
![Promise 状态](../../../../image/promise4.png)

### 建立自己的promise
要熟悉Promise，最好的方式莫过于自己写一次Promise
Promise创建实例对象时，需要传一个函数作为参数。此函数的参数有两个：resolve,reject,这两个方法表示成功的回传，失败的回传；特别注意，这两个回传只会执行其中之一，且只会执行一次，回传后代表Promise事件结束。
```
function promise() {
  return new Promise((resolve, reject) => {
    let num = Math.random() > 0.5 ? 1 : 0;
    if (num) {
      resolve('success')
    } else {
      reject('fail')
    }
  })
}
```
执行Promise事件，必定经过Pending状态。接下来进入Fulfilled或Rejected其中之一。并且可以使用then()或catch()取得成功或失败的结果。
.then(onFulfilled, onRejected)中可以带两个回调函数，两个可以携带自己的参数
onFulfilled: Promise事件执行成功时，所带入的参数是Promise函数中resolve回传值；
onRejected: Promise事件执行失败是，所带入的参数是Promise函数中reject回传值；
```
promise()
.then((success) => {
  console.log(success)
}, (fail) => {
  console.log(fail)
})
```
大部分情况下，开发者习惯用.then()来接受成功的回传值，用.catch()接受失败的回传值
```
promise()
.then((success) => {
  console.log(success)
})
.catch((fail) => {
  console.log(fail)
})
```
### 链式调用
为了确保异步完成后才执行另一种方法，过去都是通过callback的方式来实现。
Promise的一个特点：then、catch都可以使用链接的方式不断的进行下一个任务
举个列子：
```
function promise(num) {
  return new Promise((resolve, reject) => {
    num ? resolve(`${num} success`) : reject('fail')
  })
}
promise(1)
.then(success => {
  console.log(success);
  return promise(2)
})
.then(success => {
  console.log(success);
  return promise(0) // 这个阶段会进入catch
})
.then(success => {
  // 由于上个阶段处理的结果是reject，所以不会进入这里
  console.log(success);
  return promise(3)
})
.catch(fail => {
  console.log(fail);
  return promise(3)
})
```

### Then VS Catch的失败回传差异
then和catch都可以使用链式调用，都可以处理reject回传值
不适用then接受失败：无论哪个阶段遇到reject，都会直接跳到catch，在其后的then都不会执行。catch也可以返回promise对象，但开发中很少这么用。
```
这种情况见上一段代码
```
使用咱接收失败：then中两个函数式必定接收其中一个（onFulfilled、onRejected）。
```
promise(0)
.then(success => {
  console.log(success);
  return promise(1)
}, fail => {
  console.log(fail);
  return promise(2)
})
.then(success => {
  console.log(success);
  return promise(0)
}, fail => {
  console.log(fail);
  return promise(3)
})
.then(success => {
  console.log(success);
  return promise(4)
}, fail => {
  console.log(fail);
  return promise(5)
})
.then(success => {
  console.log(success);
})
```

### Promise Finally完成
最后放可以接收finally来确认工作结束，finally不带任何参数。无论是成功或失败，都会走。
### Promise 方法介绍
Promise API
Promise.all(): 多个Promise同时并发执行，全部成功完成后统一返回。如有失败，则触发catch返回第一个失败的信息
Promise.allSettled(): 多个Promise同时并发执行，全部完成后统一返回，无论成功/失败，结果都包含在返回的数组里。
Promise.resolve(): 定义了Funfilled的Promise对象
Promise.reject(): 定义了Rejected的Promise对象
Promise.race(): 多个Promise同时并发执行，去第一个完成的结果返回。

### Promise 按顺序执行异步事件
1. 需要搞清楚的是Promise.all是并行执行Promise而不是顺序执行
2. 一个promise在创建的时候就会执行，也就是说只要顺序创建，就是顺序执行
```
方案一 
function promise(index) {
  return new Promise((resolve, reject) => {
    resolve();
    console.log(index);
  })
}
function executePromises(promises) {
  let result = Promise.resolve('success');
  promises.forEach(item => {
    result = result.then(() => {
      return promise(item);
    })
  })
}
executePromises([1, 2, 3, 4])
```
```
方案二 async/await
function promise(index) {
  return new Promise((resolve, reject) => {
    resolve();
    console.log(index);
  })
}
async function executePromises(promises) {
  for (let i = 0, len = promises.length; i < len; i++) {
    await promise(promises[i])
  }
}
executePromises([1,2,3,4])
```
```
方案三 递归方式
function promise(index) {
  return new Promise((resolve, reject) => {
    resolve();
    console.log(index);
  })
}
function executePromises(promises, index) {
  if (index >=0 && index < promises.length) {
    promise(promises[index])
    index++
    executePromises(promises, index)
  }
}
executePromises([1,2,3,4], 0)
```
### 使用Promise 改写XMLHttpRequest
Promise很多时候用来处理ajax请求
传统实现方式中，用XMLHttpRequest构造实例对象，定义请求方法(GET)及状态(onload)，并发送请求，拿到结果后的其他行为在onload中处理
```
let url = 'index.html';
// 创建XMLHttpRequest实例对象
let xhr = new XMLHttpRequest();
// 定义方法
xhr.open('GET', url);
// 请求完成时，触发
xhr.onload(() => {
  if (xhr.status === 200) {
    // 请求成功
    console.log(xhr.response)
  } else {
    // 请求失败
  }
})
// 发送请求
xhr.send()
```
来，我们用promise封装GET请求
```
function get(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload(() => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.status);
      }
    })
    xhr.send()
  })
}
get('index.html')
.then(res => {
  console.log(res);
})
.catch(err => {
  console.log(err);
})
```
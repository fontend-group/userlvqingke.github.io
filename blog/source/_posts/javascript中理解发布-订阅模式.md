---
title: javascript中理解发布-订阅模式
date: 2020-06-16 14:42:04
tags: ['javascript', '设计模式', '观察者模式', '发布-订阅模式']
---
### 案例一
描述：小红、小花在淘宝看上了同一款式的鞋，联系卖家才知道已经没有了。得一周后才有货，卖家让她们关注了卖家的淘宝店，待有货时通知到她们；
```
var shoeObj = {}; // 定义发布者
shoeObj.list = []; // 缓存列表，存放订阅者回调函数

// 增加订阅者
shoeObj.listen = function(key, fn) {
  if (!shoeObj.list[key]) {
    // 之前没有订阅过该消息，则给该消息创建一个缓存列表
    shoeObj.list[key] = [];
  }
  // 订阅消息添加到缓存列表中
  shoeObj.list[key].push(fn)
}

// 发布消息
shoeObj.trigger = function() {
  // 取出消息类型
  let key = Array.prototype.shift.call(arguments);
  // 取出该消息对应的回调函数的集合
  let fns = shoeObj.list[key];
  // 如果没有订阅过该消息的话，直接返回
  if (!fns || fns.length === 0) {
    return;
  }
  for(var i = 0,fn; fn = fns[i++];) {
    fn.apply(this, arguments) // 发送消息时，附送的参数
  }
}

// 取消订阅
shoeObj.remove = function(key, fn) {
  let fns = shoeObj.list[key];
  // 如果key对应的消息没有订阅过的话，则返回
  if (!fns) {
    return false;
  }
  // 如果没有传入具体的回调函数，表示要取消key对应消息的所有信息
  if (!fn) {
    fns.length = 0;
  } else {
    // 删除指定的订阅回调函数
    for(let i = fns.length -1; i >= 0; i--) {
      let _fn = fns[i];
      console.log(_fn === fn, 'boolean')
      if (fn === _fn) {
        fns.splice(i, 1);
      }
    }
  }
}

// 小红订阅消息
shoeObj.listen('red', fn1 = function(size) {
  console.log(`颜色：红色`);
  console.log(`尺码：${size}`);
})
// 小花订阅消息
shoeObj.listen('white', fn2 = function(size) {
  console.log(`再一次颜色 白色`);
  console.log(`再一次尺码 ${size}`);
})
shoeObj.remove('red', fn1)
shoeObj.trigger('red', '39');
shoeObj.trigger('white', '40');
```

### 案例二
描述：案例一得另一种实现方式，使用ES6特性；
```
class ShoeObj {
  constructor() {
    // 缓存列表
    this.list = [];
  }
  // 创建订阅者
  listener(key, fn) {
    // 之前没有订阅过该消息的话，则创建一个缓存列表
    if (!this.list[key]) {
      this.list[key] = [];
    }
    // 将订阅者的回调函数加入到缓存列表中
    this.list[key].push(fn);
  }
  // 发布消息
  trigger() {
    // 取出消息类型
    let key = Array.prototype.shift.call(arguments);
    // 取出该消息对应的回调函数集合
    let fns = this.list[key];
    for(let i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments);
    }
  }
  // 删除某订阅者订阅的消息
  remove(key, fn) {
    let fns = this.list[key];
    // 如果该订阅消息不存在，则返回
    if (!fns) {
      return false;
    }
    // 如果没有传入具体的回调函数，表示要取消key对应消息的所有信息
    if (!fn) {
      fns.length = 0;
    } else {
      // 删除指定的订阅回调函数
      for(let i = fns.length - 1; i >= 0; i--) {
        let _fn = fns[i];
        if (fn === _fn) {
          fns.splice(i, 1);
        }
      }
    }
  }
}
let shoeObj = new ShoeObj();
// 小红订阅消息
shoeObj.listener('red', fn1 = function(size) {
  console.log(`red-${size}-xg`)
})
// 小花订阅消息
shoeObj.listener('white', fn2 = function(size) {
  console.log(`white-${size}-xh`)
})
shoeObj.remove('red', fn1)
shoeObj.trigger('red', '39')
shoeObj.trigger('white', '40')
```

### 案例三
描述：请实现一个 EventEmitter，包括 on、emit、remove 这三个操作。（Vue中组件间通信方式原理）
```
class EventEmitter {
  constructor() {
    this.list = []; // 缓存列表
  }
  // 创建订阅者
  on(key, fn) {
    // 如果当前订阅消息不存在，则创建新的缓存列表
    if (!this.list[key]) {
      this.list[key] = [];
    }
    // 将订阅者的回调函数加入到缓存列表中
    this.list[key].push(fn)
  }
  // 发布消息
  emit() {
    // 取出消息类型
    let key = Array.prototype.shift.call(arguments);
    // 取出消息类型的回调函数集合
    let fns = this.list[key];
    for(let i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments);
    }
  }
  remove(key, fn) {
    let fns = this.list[key];
    // 当前消息不存在，则返回
    if (!fns) {
      return false;
    }
    // 回调函数不存在，则清除整个消息对应的回调函数缓存列表
    if (!fn) {
      fns.length = 0;
    } else {
      for(let i = fns.length - 1; i >= 0; i--) {
        let _fn = fns[i];
        if (_fn === fn) {
          fns.splice(i, 1);
        }
      }
    }
  }
}

let obj = new EventEmitter();
obj.on('click', function(name) {
console.log(`${name}点击的`)
})
obj.emit('click', '小刚')
```
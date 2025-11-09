# 代码风格规范文档（codestyle.txt）

## 1. 规范来源
本项目代码风格基于 Airbnb JavaScript 风格指南（业界主流前端规范，GitHub 星标超 60,000），官方地址：https://github.com/airbnb/javascript


## 2. 核心规范要点

### 2.1 变量与命名
- 用 let/const 声明变量，禁用 var；
- 变量/函数名用驼峰命名法（camelCase），类名用帕斯卡命名法（PascalCase）；
- 常量名全大写，单词间用下划线分隔（如 const MAX_RETRY = 3;）。

示例：
let userName = 'Alice';
const PI = 3.14;
function calculateSum() {}
class UserService {}


### 2.2 代码格式
- 缩进用 2 个空格；
- 语句结尾必须加分号；
- 字符串统一用单引号（模板字符串除外）。

示例：
const message = 'Hello, World!';
if (condition) {
  console.log(message);
}


### 2.3 函数与箭头函数
- 优先用箭头函数简化回调；
- 函数参数过多时，每行一个参数；
- 匿名函数需显式命名提升可读性。

示例：
const sum = (a, b) => a + b;
const fetchData = async () => {
  const res = await axios.get('/api/data');
  return res.data;
};


### 2.4 对象与数组
- 对象字面量最后一个属性后加逗号；
- 用扩展运算符（...）简化合并逻辑；
- 避免使用 Object.prototype 方法（如 hasOwnProperty）。

示例：
const user = {
  name: 'Alice',
  age: 25,
};
const merged = { ...user, role: 'admin' };


### 2.5 Vue 特有规范
- 组件名用多单词帕斯卡命名（如 ContactList.vue）；
- props 显式声明类型和默认值；
- 模板中组件引用用帕斯卡命名（如 <ContactList />）。

示例：
<template>
  <ContactList :contacts="userContacts" />
</template>

<script setup>
const props = defineProps({
  contacts: {
    type: Array,
    default: () => [],
  },
});
</script>


## 3. 工具支持
- ESLint：安装 eslint 和 eslint-config-airbnb-base，配置继承 Airbnb 规则；
- Prettier：启用自动格式化，确保格式一致。
# nodejs
Server side javascript tutorials
This repository is used for my Node.js studying.

# 01_webapplication => Node.js Basic
[[nodejs 강좌] Node.js 를 이용해 웹애플리케이션 만들기](https://www.inflearn.com/course/nodejs-%EA%B0%95%EC%A2%8C-%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9/dashboard)

* express에서 정적 파일 사용하기

  ```javascript
  app.use(express.static('public');
  ```
* express 동적 렌더링 / 정적 렌더링 차이 점
  * 1...
  * 2...

* 코드 줄 바꿈

  ```javascript
  if (app.get('env') === 'development') {
    app.locals.pretty = true;
  }
  ```
  
* 템플릿 엔진(view engine) 사용

  `jade에서 pug로 개명되어 pug를 사용함.`
  ```javascript
  app.set('view engine', 'pug');
  app.set('views','./views');
  ```
  
* 값 전달 방식(GET,QueryString,Semantic,POST)에 따른 값 가져오기

  * GET & QueryString
    ```javascript
    app.get('/topic',(req, res)=>{
      req.query.{queryname};
    });
  * Semantic
    ```javascript
    app.get('/topic/:id',(req, res)=>{
      req.params.id;
    });
    ```
  * POST
    ```javascript
    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    app.post('/form_receiver',(req,res)=>{
      const title = req.body.title;
      const description = req.body.description;
    });
    ```
    
* 다중 Route

  ```javascript
  app.get(['/topic', '/topic/new', '/topic/view/:title'], (req, res) => {
    ...
  });
  ```
  
* fs module 사용

  ```javascript
  const fs = require('fs');
  ....
  ```
  
# 02_DataBase => using DataBase on Node.js
[Node.js 로 Database 다루기 소개와 웹애플리케이션 만들기](https://www.inflearn.com/course/node-js-database/dashboard)

# 03_utilize => Node.js utilize
[Node.Js 활용하기](https://www.inflearn.com/course/node-js-%ED%99%9C%EC%9A%A9/dashboard) 

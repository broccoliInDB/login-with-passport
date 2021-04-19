# Passportjs

## Passport의 동작 흐름

1. 로그인버튼의 의해 로그인진행 라우트로 처음 시작됨.
2. 라우트경로를 `auth/login`이라고 할 때 이 라우트의 미들웨어로 `passport`를 사용하고 이 `passport`의 전략으로 흐름 진행됨
3. `해당 사용자가 정상적으로 있는경우` 로컬전략의 로직 구현부에서 `done(null, user)`로 콜백이 발생한다.
4. 이때 `serializeUser(user, done)`에 user를 콜백하도록 약속되어있음. 이때 이 `user`의 식별자값을 호출 `done(null, user.id)` (여기선 id인데 어떤식별자값이던 상관 없음.) 하도록 하면 이식별자값은 세션데이터의 passport의 user값에 등록이 된다.

**serializeUser**는 즉 `req.login(user, callback)`시 **로그인에 성공한 user의 식별자를 세션에 등록하는 역할**을 하는 것이다.

따라서 로그인이 성공하면 딱 한번호출되는 것이 있다면 이 세션에 등록하는 과정인 `serializeUser`이다.

6. 이후 거의 모든 요청에 이 사용자가 로그인에 성공한 사람인지 체크하는 과정인 `deserializeUser`이 호출된다.

`deserializeUser`는 `app.use(passport.session())` 이 미들웨어가 호출하는 것이므로 이것에 아래 있는 라우팅경로에 호출들은 무조건 다 호출된다.

이렇게 호출된 deserializeUser는 req.user가 가지고 있는 user 정보를 `done(null, user)`의 콜백을 통해 전달해준다.

**따라서 passport를 사용하지 않으면 req.user라는 객체는 없다. (따로 만들어 넣지 않는 이상)**

7. req.session.destroy 함수가 호출되기 전까지는 이 세션을 항상 active한것이다.

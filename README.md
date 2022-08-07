# 리액트 기초다지기

## 🖍 useRef - DOM 조작하기

```jsx
const authorInput = useRef();

const handleSubmit = () => {
    if (state.author.length < 1) {
      authorInput.current.focus();
      return;
    }

    if (state.content.length < 5) {
      contentInput.current.focus();
      return;
    }

    ...
  };
```

## 🖍 map - 리스트 렌더링 하기

```jsx
const DiaryList = () => {
  const diaryList = useContext(DiaryStateContext);
  return (
    <div className="DiaryList">
      ...
      <div>
        {diaryList.map((it) => (
          // 데이터의 삭제나 생성시 발생할 인덱스값 변동으로 인해 일어난 오류를 피하기 위해 가급적 고유의 넘버를 지정해주자.
          <DiaryItem key={it.id} {...it} />
        ))}
      </div>
    </div>
  );
};
```

## 🖍 데이터 추가하기

- 데이터는 단방향으로 흐른다.
- 같은 선상의 컴포넌트에서는 데이터를 주고받을 수 없다.
- 같은 선상의 컴포넌트에서 리스트를 추가할 때에는 사용중인 스테이트를 공통 부모요소로 끌어올려 해결한다.(스테이트끌어올리기)
- **정리 : 트리형태의 구조를 띄고 데이터는 위에서 아래로만 움직이게하는 단방향흐름이란것과 추가수정과 같은 함수들은 props로 전달해 이벤트는 아래에서 위로 올라가는 구조이다.**

<img src="https://user-images.githubusercontent.com/76725512/183295862-38f21547-7164-4777-bfa8-6e931d0cf6a6.png">

## 🖍 데이터 삭제하기

- App.js > DiaryList.js > DiaryItem.js 순으로 props를 내려주며 prop Drilling 현상 확인

## 🖍 useEffect - Lifecycle 제어하기

```jsx
const [data, dispatch] = useReducer(reducer, []);

const dataId = useRef(0);

// 일기 더미데이터 불러오기
const getData = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/comments').then(
    (res) => res.json(),
  );

  const initData = res.slice(0, 20).map((it) => {
    return {
      author: it.email,
      content: it.body,
      emotion: Math.floor(Math.random() * 5) + 1,
      created_date: new Date().getTime(),
      id: dataId.current++,
    };
  });

  dispatch({ type: 'INIT', data: initData });
};

useEffect(() => {
  getData();
}, []);
```

- React 컴포넌트의 생명주기(LifeCycle)
  - 탄생(Mount - 화면에 나타나는것) ex: 초기화작업
  - 변화(Update - 업데이트(리렌더)) ex: 예외처리 작업
  - 죽음(UnMount - 화면에서 사라짐) ex: 메모리 정리 작업
- useEffect
  - callback함수와 dependency(의존성배열)2개의 파라미터가 필요하다.
  - 배열안에 들어있는 값이 변화하면 콜백함수가 수행된다.

## 🖍 최적화하기

### 1. useMemo

```jsx
// 그냥 객체로 생성시 앱컴포넌트가 재생성이될 때 그 객체도 재생성됨 그러므로 useMemo를 활용해 재생성방지
const memoizedDispatches = useMemo(() => {
  return { onCreate, onRemove, onEdit };
}, []);
```

- **Memoization** - 이미 계산해 본 연산 결과를 기억해 두었다가 동일한 계산을 시키면, 다시 연산 하지않고 기억대 두었던 데이터를 반환 시키게 하는 방법
  - 어떠한 함수가 값을 리턴하고 있는데 리턴까지의 연산을 최적화하고 싶다면 useMemo를 사용해 dependencyArray에 어떤 값이 변화할때만 연산을 수행할 것인지 명시하면 함수를 값처럼 사용해 최적화할 수 있다.

### 2. React.memo

```jsx
export default React.memo(DiaryEditor);
```

- 컴포넌트 업데이트에 조건을 걸기
  - 컴포넌트가 동일한 props로 결과를 렌더링 해낸다면 리렌더링 하지않는다. (단 자기 자신의 state가 업데이트 되면 리랜더링 됨)

### 3. useCallback

```jsx
// 새로운 일기 생성하기
const onCreate = useCallback((author, content, emotion) => {
  dispatch({
    type: 'CREATE',
    data: { author, content, emotion, id: dataId.current },
  });
  dataId.current += 1;
}, []);

// 일기 삭제하기
const onRemove = useCallback((targetId) => {
  dispatch({ type: 'REMOVE', targetId });
}, []);

// 일기 수정하기
const onEdit = useCallback((targetId, newContent) => {
  dispatch({ type: 'EDIT', targetId, newContent });
}, []);
```

- 함수 최적화(콜백 함수와 dependencyArray 2개의 매개변수 필요)
  - dependencyArray안의 값이 변화하지 않으면 첫번째 인자로 전달한 콜백함수를 계속 재사용할 수 있다.
  - 함수의 재생성과 함수를 재생성하면서 최신의 state를 참조할 수 있도록 도와주는 함수형업데이트

## 🖍 useReducer - 복잡한 상태 관리 로직 분리하기

- 사용이유 : useState를 대신하여 복잡한 로직을 컴포넌트 밖으로 분리하기 위함

### useReducer 키워드체크

```jsx
const [data, dispatch] = useReducer(reducer, []);
```

- data - state
- dispatch - 액션객체를 실행할 디스패치
- useReducer - 훅스
- reducer - 상태변화를 처리할 함수(직접 제작하여 하는 함수)
- [] - 데이터 초기 값

```jsx
const reducer = (state, action) => {
		switch(action.type) {
			return ...
	}
}
```

- state - 상태변화가 일어나기 직전
- action - 어떤 상태변화를 일으켜야하는지에 대한 정보를 담은 객체
- action.type - 타입프로퍼티를 통해 어떤 액션객체인지를 구분
- 그리고 reducer가 리턴하는 값이 새로운 상태의 값이 된다.
- **총정리** - 액션을 디스패치하면 리듀서가 실행되고, 그 리듀서가 리턴하는 값이 data의 값이 된다.
- **추가** - useReducer을 이용할 때 상태 변화를 발생시키는 함수를 dispatch로 사용할 때 dispatch는 함수형 업데이트 필요없이 호출시 스스로 현재 state를 reducer함수가 참조하므로 useCallback를 사용하며 dependencyArray를 걱정하지 않아도 된다.

## 🖍 Context - 컴포넌트 트리에 데이터 공급

<img src="https://user-images.githubusercontent.com/76725512/183297586-0128e487-5115-4ce5-94ca-e92d9a3bf32b.png">
* 실제 컴포넌트에서 사용하지않고 거쳐만 가는 props들을 해결하고자 적용(prop Drilling 현상 해결)

```jsx
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

return (
  <DiaryStateContext.Provider value={data}>
    <DiaryDispatchContext.Provider value={memoizedDispatches}>
      <div className="App">
        <DiaryEditor />
        <div>전체 일기 : {data.length}</div>
        <div>기분 좋은 일기 개수 : {goodCount}</div>
        <div>기분 나쁜 일기 개수 : {badCount}</div>
        <div>기분 좋은 일기 비율 : {goodRatio}</div>
        <DiaryList />
      </div>
    </DiaryDispatchContext.Provider>
  </DiaryStateContext.Provider>
);
```

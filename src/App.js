import './App.css';

import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

const dummyList = [
  {
    id: 1,
    author: '이름',
    content: '내용내용',
    emotion: 3,
    created_date: new Date().getTime(),
  },
  {
    id: 2,
    author: '루루',
    content: '내용내내용요용',
    emotion: 4,
    created_date: new Date().getTime(),
  },
  {
    id: 3,
    author: '라라',
    content: '내용후후',
    emotion: 1,
    created_date: new Date().getTime(),
  },
  {
    id: 4,
    author: '하하',
    content: '내용헤헤',
    emotion: 5,
    created_date: new Date().getTime(),
  },
];

function App() {
  return (
    <div className="App">
      <DiaryEditor />
      <DiaryList diaryList={dummyList} />
    </div>
  );
}

export default App;

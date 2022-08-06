import DiaryItem from './DiaryItem';

const DiaryList = ({ diaryList, onDelete }) => {
  return (
    <div className="DiaryList">
      <h2>일기리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {diaryList.map((it) => (
          // 데이터의 삭제나 생성시 발생할 인덱스값 변동으로 인해 일어난 오류를 피하기 위해 가급적 고유의 넘버를 지정해주자.
          <DiaryItem key={it.id} {...it} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

// props를 정상적으로 받아오지 못할 때를 대비한 기본값 설정
DiaryList.defaultProps = {
  diaryList: [],
};

export default DiaryList;

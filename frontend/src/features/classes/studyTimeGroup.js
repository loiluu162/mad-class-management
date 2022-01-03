import { useDispatch } from 'react-redux';
import TimePicker from 'react-time-picker';
import DayInWeekPicker from '../../components/dayInWeekPicker';
import { confirm } from '../../utils';
import { deleteStudyTime } from './classSlice';

export const StudyTimeGroup = ({ studyTimes, setStudyTimes }) => {
  const dispatch = useDispatch();
  const handleDaySelectChange = ({ value }, { name }) => {
    updateStudyTime(name, { dayInWeek: value });
  };

  const onStartTimeChange = (value, name) => {
    updateStudyTime(name, { startTime: value });
  };

  const onEndTimeChange = (value, name) => {
    updateStudyTime(name, { endTime: value });
  };

  const handleAddMoreStudyTime = () => {
    const newId = studyTimes.length
      ? studyTimes[studyTimes.length - 1].id + 1
      : 0;
    setStudyTimes([
      ...studyTimes,
      { id: newId, dayInWeek: '', startTime: '', endTime: '' },
    ]);
  };

  const handleDeleteStudyTime = (e) => {
    const id = e.target.name.split('-')[1];
    const deleteIndex = studyTimes.findIndex((s) => s.id == id);
    if (deleteIndex === -1) return;
    if (studyTimes[deleteIndex].existed) {
      confirm({
        handleYes: () =>
          dispatch(
            deleteStudyTime({ id, classId: studyTimes[deleteIndex].classId })
          )
            .unwrap()
            .then(() => {
              studyTimes.splice(deleteIndex, 1);
              setStudyTimes([...studyTimes]);
            }),
      });
    } else {
      studyTimes.splice(deleteIndex, 1);
      setStudyTimes([...studyTimes]);
    }
  };

  const updateStudyTime = (name, data) => {
    const id = name.split('-')[1];
    const updateIndex = studyTimes.findIndex(
      (s) => s.id === Number.parseInt(id)
    );
    if (updateIndex === -1) return;
    const newStudyTime = { ...studyTimes[updateIndex], ...data };
    let copyStudies = [...studyTimes];
    copyStudies[updateIndex] = newStudyTime;
    setStudyTimes([...copyStudies]);
  };

  return (
    <div className='form-group'>
      <label>Study Times </label>
      <button
        className='add-more form-group'
        onClick={handleAddMoreStudyTime}
        type='button'
      >
        +
      </button>
      {studyTimes.map((m) => (
        <div key={m.id} className='study-time-picker'>
          <DayInWeekPicker
            name={`dayInWeek-${m.id}`}
            value={
              m.dayInWeek ? { value: m.dayInWeek, label: m.dayInWeek } : null
            }
            onChange={handleDaySelectChange}
          />
          <div>
            <span>from </span>
            <TimePicker
              onChange={(value) => onStartTimeChange(value, `endTime-${m.id}`)}
              value={m.startTime}
              required
            />
          </div>
          <div>
            <span>to </span>
            <TimePicker
              required
              onChange={(value) => onEndTimeChange(value, `endTime-${m.id}`)}
              value={m.endTime}
            />
          </div>
          <div>
            <button
              type='button'
              name={`del-${m.id}`}
              onClick={handleDeleteStudyTime}
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

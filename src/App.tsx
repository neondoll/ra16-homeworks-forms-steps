import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ChangeEvent, FormEvent } from 'react';
import './App.css';

interface IForm extends Omit<IRecord, 'id' | 'kmTraveled'> {
  kmTraveled: string;
}

interface IRecord {
  id: string;
  date: string;
  kmTraveled: number;
}

const labels = { date: 'Дата (ДД.ММ.ГГ)', kmTraveled: 'Пройдено км' };

function App() {
  const [form, setForm] = useState<IForm>({ date: '', kmTraveled: '' });
  const [records, setRecords] = useState<IRecord[]>([]);

  const formatDate = (date: IRecord['date']): string => {
    const d = new Date(date);

    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleRemove = (id: IRecord['id']) => {
    setRecords((prev) => prev.filter((record) => record.id !== id));
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setRecords((prev) => {
      let next;

      if (prev.findIndex((record) => record.date === form.date) !== -1) {
        next = prev.map((record) => {
          return record.date === form.date
            ? { ...record, kmTraveled: record.kmTraveled + Number(form.kmTraveled) }
            : record;
        });
      } else {
        next = [
          ...prev,
          { id: uuidv4(), date: form.date, kmTraveled: Number(form.kmTraveled) },
        ];
      }

      next.sort((record1, record2) => {
        if (record1.date < record2.date) {
          return 1;
        }

        if (record1.date > record2.date) {
          return -1;
        }

        return 0;
      });

      return next;
    });
    setForm({ date: '', kmTraveled: '' });
  };

  return (
    <div className="training-records">
      <form
        autoComplete="off"
        className="training-records__form training-records-form"
        onSubmit={handleSubmit}
      >
        <div className="training-records-form__field">
          <label
            className="training-records-form__label"
            htmlFor="date"
          >
            {labels.date}
          </label>
          <input
            className="training-records-form__input"
            id="date"
            name="date"
            onChange={handleChange}
            required
            type="date"
            value={form.date}
          />
        </div>
        <div className="training-records-form__field">
          <label
            className="training-records-form__label"
            htmlFor="kmTraveled"
          >
            {labels.kmTraveled}
          </label>
          <input
            className="training-records-form__input"
            id="kmTraveled"
            min="0"
            name="kmTraveled"
            onChange={handleChange}
            required
            step="0.01"
            type="number"
            value={form.kmTraveled}
          />
        </div>
        <button
          className="training-records-form__btn"
          type="submit"
        >
          ОК
        </button>
      </form>
      <table className="training-records__table training-records-table">
        <thead className="training-records-table__head">
        <tr className="training-records-table__row">
          <th className="training-records-table__header">{labels.date}</th>
          <th className="training-records-table__header">{labels.kmTraveled}</th>
          <th className="training-records-table__header">Действия</th>
        </tr>
        </thead>
        <tbody className="training-records-table__body">
        {records.map((record) => (
          <tr
            className="training-records-table__row"
            key={record.id}
          >
            <td className="training-records-table__data">{formatDate(record.date)}</td>
            <td className="training-records-table__data">{record.kmTraveled.toFixed(2)}</td>
            <td className="training-records-table__data">
              <button className="training-records-table__btn" onClick={() => handleRemove(record.id)}>✘</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

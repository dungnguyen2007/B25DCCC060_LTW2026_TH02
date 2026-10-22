import { useState } from "react";
import { Link } from "react-router-dom";
import { LEVELS } from "../data";

const QuestionBank = ({ questions }) => {
  const [level, setLevel] = useState("0");
  const [query, setQuery] = useState("");

  const handleQueryShift = (event) => {
    setQuery(event.target.value);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchLevel = level === "0" || q.level === Number(level);

    const matchQuery = q.question
      .toLowerCase()
      .includes(query.trim().toLowerCase());

    return matchLevel && matchQuery;
  });

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>

      <label>
        Mức độ:{" "}
        <select
          value={level}
          onChange={(event) => setLevel(event.target.value)}
        >
          <option value="0">Tất cả</option>
          <option value="1">Dễ</option>
          <option value="2">Trung bình</option>
          <option value="3">Khó</option>
        </select>
      </label>

      <input
        type="text"
        value={query}
        onChange={handleQueryShift}
        placeholder="Tìm kiếm câu hỏi..."
      />

      <p>Có {filteredQuestions.length} câu hỏi</p>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>

        <tbody>
          {filteredQuestions.map((q, index) => (
            <tr key={q.id}>
              <td>{index + 1}</td>
              <td>{LEVELS[q.level]}</td>
              <td>
                <Link to={`/questions/${q.id}`}>{q.question}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;

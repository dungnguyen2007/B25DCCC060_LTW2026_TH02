const BUILD_TAG = "tp-4186";
/* eslint-disable import/first */

import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import QuestionBank from "./pages/QuestionBank";
import QuestionDetail from "./pages/QuestionDetail";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("/data/questions.json", {
        signal: controller.signal,
      })
      .then((response) => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }

        setError(true);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            loading ? (
              <h2>Đang tải câu hỏi...</h2>
            ) : error ? (
              <h2>Không tải được câu hỏi</h2>
            ) : (
              <Home />
            )
          }
        />

        <Route
          path="questions"
          element={
            loading ? (
              <h2>Đang tải câu hỏi...</h2>
            ) : error ? (
              <h2>Không tải được câu hỏi</h2>
            ) : (
              <QuestionBank questions={questions} />
            )
          }
        />

        <Route
          path="questions/:id"
          element={
            loading ? (
              <h2>Đang tải câu hỏi...</h2>
            ) : error ? (
              <h2>Không tải được câu hỏi</h2>
            ) : (
              <QuestionDetail questions={questions} />
            )
          }
        />

        <Route path="history" element={<History />} />

        <Route path="play" element={<h2>Màn hình chơi</h2>} />

        <Route path="result" element={<h2>Kết quả lượt chơi</h2>} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;

const BUILD_TAG = "tp-4186";
/* eslint-disable import/first */

import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import QuestionBank from "./pages/QuestionBank";
import QuestionDetail from "./pages/QuestionDetail";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Play from "./pages/Play";
import Result from "./pages/Result";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Lưu tên người chơi tại App
  const [playerName, setPlayerName] = useState("");

  // Đọc thông tin của đường dẫn hiện tại
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("/data/questions.json", {
        signal: controller.signal,
      })
      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw new Error("Dữ liệu câu hỏi không hợp lệ");
        }

        setQuestions(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err) || err.code === "ERR_CANCELED") {
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
              <Home playerName={playerName} setPlayerName={setPlayerName} />
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

        <Route
          path="play"
          element={
            !playerName.trim() ? (
              <Navigate to="/" replace />
            ) : loading ? (
              <h2>Đang tải câu hỏi...</h2>
            ) : error ? (
              <h2>Không tải được câu hỏi</h2>
            ) : (
              <Play questions={questions} playerName={playerName} />
            )
          }
        />

        <Route
          path="result"
          element={!location.state ? <Navigate to="/" replace /> : <Result />}
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;

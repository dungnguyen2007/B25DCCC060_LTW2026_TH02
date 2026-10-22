const BUILD_TAG = "tp-4186";
/* eslint-disable import/first */

import { useEffect, useState, useCallback } from "react";
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
import { createHistoryRecord } from "./utils";

const HISTORY_KEY = "ltw_trieuphu_history";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState("");

  // Đọc lịch sử đã lưu khi App khởi tạo
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];

      return Array.isArray(parsedHistory) ? parsedHistory : [];
    } catch {
      return [];
    }
  });

  const location = useLocation();

  // Gọi API khi App được tạo; hủy request khi cleanup
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

    return () => controller.abort();
  }, []);

  // Lưu lịch sử mỗi khi state history thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (err) {
      console.error("Không thể lưu lịch sử:", err);
    }
  }, [history]);

  // Thêm một bản ghi khi lượt chơi kết thúc
  const handleGameEnd = useCallback((result) => {
    const record = createHistoryRecord({
      playerName: result.playerName,
      correctCount: result.correctCount,
      prize: result.prize,
    });

    setHistory((previousHistory) => [...previousHistory, record]);
  }, []);

  const pageContent = (element) => {
    if (loading) {
      return <h2>Đang tải câu hỏi...</h2>;
    }

    if (error) {
      return <h2>Không tải được câu hỏi</h2>;
    }

    return element;
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Home
              playerName={playerName}
              setPlayerName={setPlayerName}
              history={history}
            />
          }
        />

        <Route
          path="questions"
          element={pageContent(<QuestionBank questions={questions} />)}
        />

        <Route
          path="questions/:id"
          element={pageContent(<QuestionDetail questions={questions} />)}
        />

        <Route
          path="history"
          element={<History history={history} setHistory={setHistory} />}
        />

        <Route
          path="play"
          element={
            !playerName.trim() ? (
              <Navigate to="/" replace />
            ) : (
              pageContent(
                <Play
                  questions={questions}
                  playerName={playerName}
                  onGameEnd={handleGameEnd}
                />,
              )
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

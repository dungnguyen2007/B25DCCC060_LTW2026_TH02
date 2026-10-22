import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  const getLinkStyle = ({ isActive }) => ({
    color: isActive ? "red" : "black",
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
    marginRight: "20px",
  });

  return (
    <div className="container">
      <h1>AI LÀ TRIỆU PHÚ - LẬP TRÌNH WEB</h1>

      <nav className="navbar">
        <NavLink to="/" end style={getLinkStyle}>
          Trang chủ
        </NavLink>

        <NavLink to="/questions" style={getLinkStyle}>
          Ngân hàng câu hỏi
        </NavLink>

        <NavLink to="/history" style={getLinkStyle}>
          Lịch sử
        </NavLink>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
};

export default Layout;

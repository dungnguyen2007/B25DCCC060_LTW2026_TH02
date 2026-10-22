import { NavLink } from "react-router-dom";

const NavBar = () => {
  const getLinkStyle = ({ isActive }) => ({
    padding: "10px 16px",
    textDecoration: "none",
    color: isActive ? "#ffffff" : "#333333",
    backgroundColor: isActive ? "#1976d2" : "#eeeeee",
    borderRadius: "6px",
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        padding: "16px 0",
        marginBottom: "20px",
        borderBottom: "1px solid #dddddd",
      }}
    >
      <NavLink to="/" end style={getLinkStyle}>
        Trang chủ
      </NavLink>

      <NavLink to="/questions" end style={getLinkStyle}>
        Ngân hàng câu hỏi
      </NavLink>

      <NavLink to="/history" style={getLinkStyle}>
        Lịch sử chơi
      </NavLink>
    </nav>
  );
};

export default NavBar;

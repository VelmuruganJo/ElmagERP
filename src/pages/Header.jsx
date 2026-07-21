import "./Header.css";

function Header() {

  const fullName = localStorage.getItem("fullName");
  const username = localStorage.getItem("username");

  const displayName =
    fullName || username || "User";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("employeeCode");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");

    sessionStorage.clear();

    window.location.href = "/";
  };

  return (
    <header className="app-header">

      <div className="header-left">
        <h1 className="logo">
          Elmag Devices Private Limited
        </h1>
      </div>

      <div className="header-right">

        <div className="user-info">
          <div className="avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <span>{displayName}</span>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Header;
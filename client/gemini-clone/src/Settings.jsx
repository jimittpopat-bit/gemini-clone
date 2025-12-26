import useDarkMode from "./Custom-Hooks/DarkMode.Js";
import "./settings.css";

function Settings() {
  const [dark, toggleDarkMode] = useDarkMode();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
  <div className="settings-container">
  <h2 className="settings-title">Settings</h2>

  <div className="settings-section">
    <button
      className="settings-btn darkmode-btn"
      onClick={toggleDarkMode}
    >
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  </div>

  <div className="settings-divider" />

  <div className="settings-section danger">
    <button
      className="settings-btn logout-btn"
      onClick={handleLogout}
    >
      Log out
    </button>
  </div>
</div>

  );
}

export default Settings;

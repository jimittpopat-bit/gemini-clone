import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";
import Help from "./Help";
import Activity from "./Activity";
import Settings from "./Settings";
import Login from "./login";
import Signup from "./signup";
import { useContext, useEffect } from "react";
import { Context } from "./context/context";


const App = () => {
  const token = localStorage.getItem("token");
  const { fetchChats } = useContext(Context);

  useEffect(() => {
    if (token) {
      fetchChats();
    }
  }, [token]);

  if (!token) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }
  return (
    <div className="app-layout">
      <Sidebar />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/newchat" element={<Main />} />
        <Route path="/help" element={<Help />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default App;

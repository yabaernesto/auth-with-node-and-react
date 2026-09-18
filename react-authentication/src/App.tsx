import { useEffect, useState, type SubmitEvent } from "react";

import Profile from "./components/profile";
import { api } from "./lib/axios";

type ResponsePayload = {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await api.get("/profile");

        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post<ResponsePayload>("/login", {
        email,
        password,
      });
      const accessToken = response.data.tokens.accessToken;
      const refreshToken = response.data.tokens.refreshToken;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setEmail("");
      setPassword("");

      setIsAuthenticated(true);

      alert("Seja bem-vindo");
    } catch (error) {
      alert("Login Failed!");
      console.error(error);
    }
  };

  if (isInitializing) {
    return null;
  }

  if (isAuthenticated) {
    return <Profile />;
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-800">
      <form onSubmit={handleSubmit} className="flex flex-col w-md space-y-2">
        <input
          className="bg-slate-700 text-white border border-gray-500 p-2 w-full rounded-md"
          type="email"
          placeholder="e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="bg-slate-700 text-white border border-gray-500 p-2 w-full"
          type="password"
          placeholder="Informe sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="
          bg-emerald-700 border-none text-white border border-gray-500 p-2 cursor-pointer rounded-md hover:bg-emerald-600
          "
        >
          Acessar
        </button>
      </form>
    </div>
  );
}

export default App;

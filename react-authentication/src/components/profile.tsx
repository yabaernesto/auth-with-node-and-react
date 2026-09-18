import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface User {
  email: string;
  age: number;
  firstName: string;
  lastName: string;
}

const Profile = () => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get<User>("/profile");
        const data = response.data;
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-800 text-white">
      <h1>Bem-vindo!</h1>
      <p>Primeiro nome: {user?.firstName}</p>
      <p>Sobrenome: {user?.lastName}</p>
      <p>e-mail: {user?.email}</p>
      <p>Idade: {user?.age}</p>

      <button
        onClick={logout}
        className="bg-red-500 text-white font-bold py-2 px-4"
      >
        Sair
      </button>
    </div>
  );
};

export default Profile;

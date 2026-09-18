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

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-800 text-white">
      <h1>Bem-vindo!</h1>
      <p>Primeiro nome: {user?.firstName}</p>
      <p>Sobrenome: {user?.lastName}</p>
      <p>e-mail: {user?.email}</p>
      <p>Idade: {user?.age}</p>
    </div>
  );
};

export default Profile;

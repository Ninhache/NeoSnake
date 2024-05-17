import {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import UISuspense from "../UI/UISuspense";
import {useAuth} from "../contexts/AuthContext";
import LayoutComponent from "../layouts/LayoutComponent";

const WidgetSignup: React.FC = () => {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signup(username, password);

      const lastPath = localStorage.getItem("lastPath") || "/";
      navigate(lastPath);
    } catch (error) {
      console.error("signup error?", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutComponent>
      <div className="flex w-full flex-col gap-4 items-center">
        <h1 className="text-3xl text-center">Signup page</h1>
        <form
          onSubmit={handleSubmit}
          className="flex  gap-4 flex-col w-48 mt-4"
        >
          <input
            className="text-black p-2 rounded-lg"
            type="text"
            id="username"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="text-black p-2 rounded-lg"
            type="password"
            id="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br></br>

          <button
            type="submit"
            className="bg-red-400 p-3 rounded-lg text-xl text-center flex justify-center"
          >
            {loading ? <UISuspense /> : "Signup"}
          </button>
        </form>
        {error && <div className="text-red-400">{error}</div>}
        <div className="flex gap-2 justify-center">
          <h1>Already have an account ?</h1>
          <NavLink to={"/login"} className={"text-blue-400"}>
            Connect here !
          </NavLink>
        </div>
      </div>
    </LayoutComponent>
  );
};

export default WidgetSignup;

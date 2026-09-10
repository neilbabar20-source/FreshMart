import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Auth = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    setShowUserLogin,
    setUser,
    axios,
    navigate,
  } = useContext(AppContext);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();

      setLoading(true);

      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        toast.success(data.message);

        const loginRedirect =
          sessionStorage.getItem("loginRedirect");

        setUser(data.user);
        setShowUserLogin(false);

        if (loginRedirect) {
          sessionStorage.removeItem("loginRedirect");
          navigate(loginRedirect);
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setState((prev) =>
      prev === "login" ? "register" : "login"
    );

    setPassword("");
    setShowPassword(false);
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4"
    >
      <form
        onSubmit={submitHandler}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl px-5 py-7 sm:px-8 sm:py-9"
      >
        {/* Header */}
        <div className="text-center mb-7">

          <div className="w-10 h-10 mx-auto rounded-lg bg-green-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              F
            </span>
          </div>

          <p className="text-sm font-medium text-green-600 mt-4">
            Welcome to FreshMart
          </p>

          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1">
            {state === "login"
              ? "Welcome Back"
              : "Create Account"}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {state === "login"
              ? "Sign in to continue shopping."
              : "Create your account and start shopping."}
          </p>

        </div>

        {/* Name */}
        {state === "register" && (
          <div className="mb-5">

            <label
              htmlFor="user-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>

            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
              className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
            />

          </div>
        )}

        {/* Email */}
        <div className="mb-5">

          <label
            htmlFor="user-email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>

          <input
            id="user-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
            required
          />

        </div>

        {/* Password */}
        <div className="mb-4">

          <label
            htmlFor="user-password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>

          <div className="relative">

            <input
              id="user-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                state === "register"
                  ? "Create a password"
                  : "Enter your password"
              }
              autoComplete={
                state === "register"
                  ? "new-password"
                  : "current-password"
              }
              className="w-full h-12 px-4 pr-16 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

        </div>

        {/* Switch Mode */}
        <div className="text-sm text-center mb-5">

          {state === "register" ? (
            <p className="text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={switchMode}
                className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
              >
                Login
              </button>
            </p>
          ) : (
            <p className="text-gray-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={switchMode}
                className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
              >
                Create Account
              </button>
            </p>
          )}

        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition cursor-pointer disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          {loading
            ? state === "register"
              ? "Creating Account..."
              : "Signing in..."
            : state === "register"
            ? "Create Account"
            : "Login"}
        </button>

        {/* Footer */}
        <p className="text-[11px] text-gray-400 text-center mt-5">
          FreshMart • Fresh groceries delivered to you
        </p>

      </form>
    </div>
  );
};

export default Auth;
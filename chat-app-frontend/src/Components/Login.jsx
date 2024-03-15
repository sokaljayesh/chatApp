import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../service";



const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [err, setErr] = useState("");
  const navigator = useNavigate();

  

  const handleClick= useCallback((e)=> {
    e.preventDefault();
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    if (!emailRegex.test(email)) {
      setErr("Invalid email");
      return;
    }
    const data = { email, password };
    login(data)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("userinfo",JSON.stringify(res.data.token))
        navigator("/");
      })
      .catch((err) => {
        if (err?.response?.data?.status_code === "INCORRECT_PASSWORD") {
          setErr("INCORRECT_PASSWORD");
        } else if (err?.response?.data?.status_code === "USER_DOESN'T_EXIST") {
          setErr("USER_DOESN'T_EXIST");
        } else {
          setErr("Something went Wrong");
        }
      });
  },[email, navigator, password])

  return (
    <div className="auth login">
      <form >
        <label htmlFor="email">Email </label>
        <br />
        <input
          type="text"
          id="email"
          name="email"
          placeholder="email"
          autoComplete="on"
          autoFocus
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <br />
        <label htmlFor="pass">Password </label>
        <br />
        <input
          type="password"
          id="pass"
          name="password"
          placeholder="password"
          required
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <p className="error">{err}</p>
        <br />
        <button onClick={handleClick} disabled={!email || !password}>Login</button>
        <p>
          don't have an account yet?{" "}
          <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

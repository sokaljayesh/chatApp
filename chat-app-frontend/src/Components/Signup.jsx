import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../service";

const Signup = () => {
  const [username, setUsername] = useState();
  const [number, setNumber] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [cPass, setCPass] = useState();
  const [err, setErr] = useState();

  const navigator = useNavigate();

  const submitData = useCallback(async (queryParam) => {
    try {
      const response = await signIn(queryParam);
      localStorage.setItem("userinfo",JSON.stringify(response.data.token))
      navigator("/");
    } catch (err) {
      console.error(err);
      if (err?.response?.data?.status_code === "USER_ALREADY_EXIST") {
        setErr("USER_ALREADY_EXIST");
      } else {
        setErr("Something went Wrong");
      }
    }
  }, [navigator]);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    if (isNaN(number) || number.length !== 10) {
      alert("Phone number is invalid!");
      return;
    } else if (!emailRegex.test(email)) {
      alert("Invalid email");
      return;
    } else if (password.length < 6) {
      alert("Password must be atleast 6 digit long");
      return;
    } else if (password !== cPass) {
      alert("password and confirm password are not same");
      return;
    }

    const queryParam = { username, email, password, number };

    submitData(queryParam);
  }, [cPass, email, number, password, submitData, username]);

  return (
    <div className="auth signup">
      <form>
        <label htmlFor="name">Username </label>
        <br />
        <input
          type="text"
          id="name"
          name="username"
          placeholder="username"
          autoComplete="on"
          autoFocus
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="number">Phone Number </label>
        <br />
        <input
          // type="number"
          maxLength={10}
          id="number"
          pattern="0-9"
          name="number"
          placeholder="number"
          // autoComplete="on"
          required
          onChange={(e) => setNumber(e.target.value)}
        />
        <br />
        <label htmlFor="email">Email </label>
        <br />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          autoComplete="on"
          required
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <label htmlFor="confirmPass">Confirm Password </label>
        <br />
        <input
          type="password"
          id="confirmPass"
          name="cpassword"
          placeholder="confirm password"
          required
          onChange={(e) => setCPass(e.target.value)}
        />
        <br />
        <p className="error">{err}</p>
        <button onClick={handleClick} disabled = {!username || !email || !password || !number || !cPass}>SignUp</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

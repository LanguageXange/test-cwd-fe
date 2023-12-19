// use functional component with useState hook

import React, { useState } from "react";

const Signin2 = ({ onRouteChange, loadUser }) => {
  const [userInfo, setUserInfo] = useState({
    signInEmail: "",
    signInPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://cwd-refactor-backend.onrender.com/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userInfo.signInEmail,
        password: userInfo.signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.hasError) {
          alert(data.message);
        }
        if (data.id) {
          loadUser(data);
          onRouteChange("home");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <article className="center">
      <main>
        <form onSubmit={handleSubmit}>
          <fieldset id="sign_up">
            <legend>Sign In 2 functional component</legend>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="signInEmail"
                id="email"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                required
                name="signInPassword"
                id="password"
                onChange={handleChange}
              />
            </div>
          </fieldset>
          <div>
            <button type="submit">Sign in</button>
          </div>
          <div>
            <button type="button" onClick={() => onRouteChange("register")}>
              Register
            </button>
          </div>
        </form>
      </main>
    </article>
  );
};

export default Signin2;

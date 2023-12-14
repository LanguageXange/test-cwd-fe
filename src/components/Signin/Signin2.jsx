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
    fetch("http://localhost:3001/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userInfo.signInEmail,
        password: userInfo.signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
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
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <form onSubmit={handleSubmit}>
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">
              Sign In 2 functional component
            </legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email">
                Email
              </label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="signInEmail"
                id="email"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">
                Password
              </label>
              <input
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                required
                name="signInPassword"
                id="password"
                onChange={handleChange}
              />
            </div>
          </fieldset>
          <div className="">
            <button type="submit">Sign in</button>
          </div>
          <div className="lh-copy mt3">
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

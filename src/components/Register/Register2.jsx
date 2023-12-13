// functional component
import { useState } from "react";
const Register2 = ({ loadUser, onRouteChange }) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userInfo.email,
        password: userInfo.password,
        name: userInfo.name,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        console.log(user, "user after register");
        if (user.id) {
          loadUser(user);
          onRouteChange("home");
        }
      })
      .catch((err) => console.log(err, "register error"));
  };

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <form className="measure" onSubmit={handleSubmit}>
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Register version 2</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="name">
                Name
              </label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="text"
                name="name"
                id="name"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email">
                Email
              </label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email"
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
                name="password"
                id="password"
                required
                onChange={handleChange}
              />
            </div>
          </fieldset>
          <div className="">
            <button type="submit">Register</button>
          </div>
        </form>
      </main>
    </article>
  );
};

export default Register2;

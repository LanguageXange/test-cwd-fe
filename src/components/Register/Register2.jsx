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
    fetch("https://cwd-refactor-backend.onrender.com/register", {
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
    <article className="center">
      <main>
        <form onSubmit={handleSubmit}>
          <fieldset id="sign_up">
            <legend>Register version 2</legend>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
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

// to do - clear user date on sign out
// to do nav link use li and anchor tag
const Navigation = ({ onRouteChange, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
        <p onClick={() => onRouteChange("signout")}>Sign Out</p>
      </nav>
    );
  } else {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
        <p onClick={() => onRouteChange("signin")}>Sign In</p>
        <p onClick={() => onRouteChange("register")}>Register</p>
      </nav>
    );
  }
};

export default Navigation;

const Rank = ({ name, entries }) => {
  return (
    <div>
      <div>
        Hello! {`${name.toUpperCase()}, your current entry count is...`}
      </div>
      <div>{entries}</div>
    </div>
  );
};

export default Rank;

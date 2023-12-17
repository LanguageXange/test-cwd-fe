import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <h1>Detect Face in your image:</h1>
      <div className="center">
        <input style={{ width: "80%" }} onChange={onInputChange} />
        <button onClick={onButtonSubmit}>Detect Image</button>
      </div>
    </div>
  );
};

export default ImageLinkForm;

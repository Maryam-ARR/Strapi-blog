import ReactDOM from "react-dom";
import App from "./App";
import axios from "axios";
import reportWebVitals from "./reportWebVitals";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_NAME;

ReactDOM.render(<App />, document.getElementById("root"));

reportWebVitals();

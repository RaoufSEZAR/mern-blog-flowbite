import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import ThemeProvider from "./components/ThemeProvider.jsx";
import "./index.css";
import { store, persistor } from "./redux/store.js";

import "./translations/i18n.js";

ReactDOM.createRoot(document.getElementById("root")).render(
	// <React.StrictMode>
	<PersistGate persistor={persistor}>
		<Provider store={store}>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</Provider>
	</PersistGate>
	// </React.StrictMode>
);

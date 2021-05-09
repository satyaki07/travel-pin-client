import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import axios from "axios";
import "./App.css";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: "fit",
    height: "100vh",
    latitude: 22,
    longitude: 88,
    zoom: 4,
  });

  const url = "https://travel-pin-app.herokuapp.com/api";

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get(`${url}/pins`);
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;

    setNewPlace({
      lat,
      long,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create new place from form data
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post(`${url}/pins`, newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle="mapbox://styles/satyaki07/cko9n937s4m1e18loytwy0vv6"
        onDblClick={handleAddClick}
        transitionDuration="200"
        // style={{zIndex:"2"}}
      >
        {pins.map((pin) => {
          return (
            <>
              <Marker
                latitude={pin.lat}
                longitude={pin.long}
                offsetLeft={-viewport.zoom * 3.5}
                offsetTop={-viewport.zoom * 7}
              >
                <Room
                  style={{
                    fontSize: viewport.zoom * 7,
                    color:
                      pin.username === currentUser ? "tomato" : "slateblue",
                    cursor: "pointer",
                    // zIndex:"-1"
                  }}
                  onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
                />
              </Marker>
              {pin._id === currentPlaceId && (
                <Popup
                  latitude={pin.lat}
                  longitude={pin.long}
                  closeButton={true}
                  closeOnClick={false}
                  anchor="left"
                  onClose={() => setCurrentPlaceId(null)}
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{pin.title}</h4>
                    <label>Review</label>
                    <p className="desc">{pin.desc}</p>
                    <label>Rating</label>
                    <div className="stars">
                      {Array(pin.rating).fill(<Star className="star" />)}
                    </div>
                    <label>Information</label>
                    <span className="username">
                      Created by <b>{pin.username}</b>
                    </span>
                    <span className="date">{format(pin.createdAt)}</span>
                  </div>
                </Popup>
              )}
              {newPlace &&
                (currentUser ? (
                  <Popup
                    latitude={newPlace.lat}
                    longitude={newPlace.long}
                    closeButton={true}
                    closeOnClick={false}
                    anchor="left"
                    onClose={() => setNewPlace(null)}
                  >
                    <div>
                      <form onSubmit={handleSubmit}>
                        <label>Title</label>
                        <input
                          placeholder="Enter a title"
                          onChange={(e) => setTitle(e.target.value)}
                        />
                        <label>Review</label>
                        <textarea
                          placeholder="Say us something about this place."
                          onChange={(e) => setDesc(e.target.value)}
                        />
                        <label>Rating</label>
                        <select onChange={(e) => setRating(e.target.value)}>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                        <button className="submitBtn" type="submit">
                          Add Pin
                        </button>
                      </form>
                    </div>
                  </Popup>
                ) : (
                  <Popup
                    latitude={newPlace.lat}
                    longitude={newPlace.long}
                    closeButton={true}
                    closeOnClick={false}
                    anchor="left"
                    onClose={() => setNewPlace(null)}
                  >
                    <div>
                      <h2 style={{ color: "slateblue " }}>
                        Please Register / Login
                      </h2>
                    </div>
                  </Popup>
                ))}
            </>
          );
        })}
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <div className="buttons">
            <button
              className="button login"
              onClick={() => {
                setShowLogin(true);
                setShowRegister(false);
              }}
            >
              Login
            </button>
            <button
              className="button register"
              onClick={() => {
                setShowRegister(true);
                setShowLogin(false);
              }}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;

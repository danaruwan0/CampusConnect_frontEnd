import { useState } from "react";

import {
  FaTriangleExclamation
} from "react-icons/fa6";

import {
  FiMapPin,
  FiSend,
  FiX
} from "react-icons/fi";


import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";


import L from "leaflet";

import "leaflet/dist/leaflet.css";


import "./emergency.css";


import {
  createEmergency
} from "../../api/emergencyApi";



// Fix Leaflet Marker Icon Issue

delete L.Icon.Default.prototype._getIconUrl;


L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"

});




export default function Emergency({ onClose }) {


  const userId =
    localStorage.getItem("userId");



  const [loading, setLoading] =
    useState(false);



  const [image, setImage] =
    useState(null);



  const [video, setVideo] =
    useState(null);



  const [mapPosition, setMapPosition] =
    useState(null);




  const [form, setForm] =
    useState({

      title: "",

      description: "",

      locationName: "",

      latitude: "",

      longitude: ""

    });





  const handleChange = (e) => {


    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });


  };





  const handleImage = (e) => {


    if (e.target.files.length > 0) {

      setImage(
        e.target.files[0]
      );

    }


  };






  const handleVideo = (e) => {


    if (e.target.files.length > 0) {

      setVideo(
        e.target.files[0]
      );

    }


  };









  /*
      GET CURRENT GPS LOCATION
  */


  const getCurrentLocation = () => {


    if (!navigator.geolocation) {


      alert(
        "Geolocation not supported"
      );

      return;

    }





    navigator.geolocation.getCurrentPosition(


      async (position) => {


        const lat =
          position.coords.latitude;


        const lng =
          position.coords.longitude;




        setMapPosition([

          lat,

          lng

        ]);




        try {


          const response =
            await fetch(

              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`

            );



          const data =
            await response.json();





          setForm(prev => ({

            ...prev,


            latitude: lat,


            longitude: lng,


            locationName:
              data.display_name || ""


          }));



        }

        catch (error) {


          console.log(error);


          setForm(prev => ({

            ...prev,


            latitude: lat,


            longitude: lng


          }));


        }



      },



      (error) => {


        console.log(error);


        alert(
          "Unable to get location"
        );


      },



      {

        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 0

      }



    );



  };









  /*
      SUBMIT EMERGENCY
  */


  const handleSubmit = async (e) => {


    e.preventDefault();




    if (

      !form.title ||

      !form.description ||

      !form.locationName

    ) {


      alert(
        "Please fill required fields"
      );


      return;

    }





    try {


      setLoading(true);



      await createEmergency(

        userId,

        form,

        image,

        video

      );




      alert(
        "Emergency alert sent successfully"
      );



      onClose();



    }

    catch (error) {


      console.log(error);


      alert(
        "Failed to send emergency"
      );


    }

    finally {


      setLoading(false);


    }



  };







  return (


    <div className="emergency-overlay">


      <div className="emergency-modal">





        <div className="emergency-header">


          <div className="emergency-title">


            <FaTriangleExclamation
              className="emergency-icon"
            />


            <h2>
              Create Emergency Alert
            </h2>


          </div>




          <button

            className="close-btn"

            onClick={onClose}

          >

            <FiX />

          </button>



        </div>







        <form

          className="emergency-form"

          onSubmit={handleSubmit}

        >






          <label>
            Alert Title
          </label>



          <input

            type="text"

            name="title"

            placeholder="Example : Student Medical Emergency"

            value={form.title}

            onChange={handleChange}

          />







          <label>
            Description
          </label>



          <textarea

            name="description"

            rows="5"

            placeholder="Describe emergency..."

            value={form.description}

            onChange={handleChange}

          />









          <label>
            Current Location
          </label>





          <button

            type="button"

            className="location-btn"

            onClick={getCurrentLocation}

          >


            <FiMapPin />


            Get Current Location



          </button>








          {
            mapPosition && (



              <div className="emergency-map">


                <MapContainer

                  center={mapPosition}

                  zoom={17}

                  scrollWheelZoom={true}


                  style={{

                    height: "300px",

                    width: "100%"

                  }}


                >



                  <TileLayer


                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"



                    attribution="© OpenStreetMap"



                  />





                  <Marker

                    position={mapPosition}

                  >


                    <Popup>


                      Emergency Location


                    </Popup>


                  </Marker>





                </MapContainer>



              </div>


            )
          }









          <label>
            Location Name
          </label>



          <input

            type="text"

            name="locationName"

            value={form.locationName}

            placeholder="Location"

            onChange={handleChange}

          />









          <div className="location-grid">



            <div>

              <label>
                Latitude
              </label>


              <input

                readOnly

                value={form.latitude}

              />

            </div>






            <div>


              <label>
                Longitude
              </label>


              <input

                readOnly

                value={form.longitude}

              />


            </div>



          </div>









          <label>
            Upload Image
          </label>



          <input

            type="file"

            accept="image/*"

            onChange={handleImage}

          />




          {
            image &&

            <img

              src={
                URL.createObjectURL(image)
              }

              className="preview-image"

              alt="preview"

            />

          }









          <label>
            Upload Video
          </label>




          <input

            type="file"

            accept="video/*"

            onChange={handleVideo}

          />





          {
            video &&


            <video

              controls

              className="preview-video"

            >

              <source

                src={
                  URL.createObjectURL(video)
                }

              />


            </video>


          }









          <div className="emergency-actions">



            <button

              type="button"

              className="cancel-btn"

              onClick={onClose}

            >

              Cancel

            </button>







            <button

              type="submit"

              className="emergency-send-btn"

              disabled={loading}

            >


              <FiSend />


              {
                loading
                  ?
                  "Sending..."
                  :
                  "Send Alert"
              }



            </button>



          </div>






        </form>





      </div>



    </div>


  );


}
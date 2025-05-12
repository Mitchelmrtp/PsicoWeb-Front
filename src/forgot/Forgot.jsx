import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

const Forgot = () => {
  return (
    <>
      <div className="home">
        <div className="container">
          <form>
            <img src="./forgot.svg" alt="" srcset="" />
          </form>
          <form className="myform">
            <h3>
              Ingresa tu correo 
            </h3>
            <div>
              <input type="email" placeholder="Correo" required />
              <div className="second-div">
                <button>Enviar</button>
                <p>
                   <Link to="/" color="blue">Entrar</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Forgot;

import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <>
      <div className="home">
        <div className="container">
          <form>
            <img src="./signup.svg" alt="" srcset="" />
          </form>
          <form className="myform">
            <h3>
              ¡Bienvenido!
            </h3>
            <div>
              <input type="email" placeholder="Correo" required />
              <div className="mydiv">
                <input type="password" placeholder="Nueva contraseña" required />
              </div>
              <div className="mydiv">
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  required
                />
              </div>
              <div className="second-div">
                <button>Registrar</button>
                <p>
                  Ya tengo una cuenta <Link to="/">Entrar</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;

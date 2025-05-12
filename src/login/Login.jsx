import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="home">
        <div className="container">
          <form>
            <img src="./login-pana.svg" alt="" srcset="" />
          </form>
          <form className="myform">
            <h3>
              Bienvenido a PsicoWeb
            </h3>
            <div>
              <input type="email" placeholder="Correo" required/>
              <div className="mydiv">
                <input type="password" placeholder="Contraseña" required/>
                <Link to="/reset-password">Olvide mi contraseña</Link>
              </div>
              <div className="second-div">
                <button>Entrar</button>
                <p>No tengo una cuenta <Link to='/signup'>Registrar</Link></p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

import { useState, useEffect } from 'react';
import './styles/styles.css';
import './styles/pricing.css';
import InputSection from './components/inputSection';
import { DefaultModel } from './components/models';
import { googleLogout } from '@react-oauth/google';
import { Routes, Route, useNavigate, Switch } from 'react-router-dom';
import Payment from './components/payment';


function App() {
  const navigate = useNavigate();

  const [toggleMenu, setToggleMenu] = useState(false);

  const [renderPart, setRenderPart] = useState(null);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState(null);
  const [logged, setLogged] = useState(localStorage.getItem('token') ? true : false);



  function menuToggle() {
    setToggleMenu(!toggleMenu)
  }


  const logOut = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('token');
    setLogged(false);
    setToggleMenu(false)
    navigate('/')
    window.location.reload();

  }




  return (
    <div className="App">
      <Routes>

        <Route path="/" element={<>
          <header>
            <div className="bgColor1">
              <nav className="navbar   justify-content-between px-3">
                <a className="navbar-brand">
                  <h3>LOGO</h3>
                </a>
                <div className="d-flex align-items-center">
                  {!logged ?
                    <button
                      onClick={() => { setRenderPart("signIn") }}
                      className="mx-1" data-bs-toggle="modal" data-bs-target="#signInModel">
                      <i className="fa fa-sign-out" aria-hidden="true"></i> Sign in
                    </button>
                    :
                    <div className="action">
                      <button onClick={menuToggle} className="fa fa-user-circle-o accountIcon mx-1"
                        aria-hidden="true"></button>
                      <div className={"menu" + (toggleMenu ? " activedrop" : "")}>
                        <ul>
                          <li><i className="fa-solid fa-gear mx-2"></i><a href="#">Billing</a></li>
                          <li onClick={()=>{navigate('/pricing')}}><i className="fa-solid fa-list  mx-2"></i>Plans</li>
                          <li ><i className="fa-solid fa-question mx-2"></i> &nbsp;Help Center</li>
                          <li onClick={() => { logOut() }}><i className="fa-solid fa-right-from-bracket mx-2"></i>Log-Out</li>
                        </ul>
                      </div>
                    </div>
                  }


                </div>
              </nav>
            </div>

          </header>

          <InputSection setRenderPart={setRenderPart} setProgress={setProgress} />
          <DefaultModel logged={logged} setLogged={setLogged} setRenderPart={setRenderPart} renderPart={renderPart} progress={progress} />
        </>} />
        <Route path="/pricing" element={<>
          <Payment />
         
        </>} />
        <Route path="*" element={<></>} />
      </Routes>


    </div>
  );
}

export default App;

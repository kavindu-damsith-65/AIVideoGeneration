import { motion } from 'framer-motion'
import ProgressBar from "@ramonak/react-progress-bar";
import { useState ,useEffect} from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import React from "react";


export function DefaultModel(props) {
    const [cancel1, setCancel1] = useState(false)
    const navigate = useNavigate();
   

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            // setUser(codeResponse);
            axios.post('http://127.0.0.1:5000/google-login', {
                token: codeResponse.access_token
            })
            .then(response => {
                const authorizationToken = response.data.token;
                localStorage.setItem("token", authorizationToken);
                props.setLogged(true)
                window.location.reload();
                
                navigate('/');
            })
            .catch(error => {
                console.log('Login Failed:');
            });

        },
        onError: (error) => console.log('Login Failed:')
    });

    // useEffect(
    //     () => {
    //         if (user) {
    //             axios
    //                 .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
    //                     headers: {
    //                         Authorization: `Bearer ${user.access_token}`,
    //                         Accept: 'application/json'
    //                     }
    //                 })
    //                 .then((res) => {
    //                     console.log(res.data)
    //                 })
    //                 .catch((err) => console.log(err));
    //         }
    //     },
    //     [ user ]
    // );

    // log out function to log the user out of google and set the profile array to null
    
    
  
  

    return (
        <div data-bs-backdrop='static' className="modal fade" id="signInModel" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content defaultmodel">
                    <div className="d-flex justify-content-end">
                        {props.renderPart != "generateVideo" ?
                            <button type="button" className="mx-3 mt-3 close-button " data-bs-dismiss="modal" aria-label="Close"><i
                                className="fa fa-times" aria-hidden="true"></i></button> :
                            null
                        }

                    </div>
                    <div className="modal-body  mt-5">


                        {(() => {
                            if (props.renderPart == "generateVideo") {
                                return (
                                    <>
                                        {cancel1 ?
                                            <div className="">
                                                <h2>Are you sure?</h2>
                                                <h6 className='text-center mt-1 mb-4'>
                                                    If you cancel, your credits will still be deducted.
                                                </h6>
                                                <div className="container mx-2 mt-4 mb-4 " >
                                                    <div className='d-flex justify-content-center'>
                                                        <motion.button
                                                            onClick={() => { setCancel1(false) }}
                                                            whileHover={{ scale: 1.06 }} style={{ minWidth: '150px' }} type="button" className="mx-2 mt-3  py-1 px-3 default-primary">
                                                            Keep generating
                                                        </motion.button>
                                                        <motion.button whileHover={{ scale: 1.06 }} style={{ minWidth: '150px' }} type="button" className="mx-2 mt-3  py-1 px-3 default-cancel">
                                                            Cancel
                                                        </motion.button>
                                                    </div>

                                                </div>

                                            </div> :
                                            <div className="">
                                                <h2>Generating the video...</h2>

                                                <div className="mx-2 mt-4 mb-4" >
                                                    <ProgressBar completed={props.progress} bgColor="#17E1D6" />
                                                </div>
                                                <div className="d-flex justify-content-end">
                                                    <motion.button
                                                        onClick={() => { setCancel1(true) }}
                                                        whileHover={{ scale: 1.06 }} type="button" className="mx-3 mt-3  py-1 px-4 default-cancel ">
                                                        Cancel
                                                    </motion.button>
                                                </div>
                                            </div>
                                        }
                                    </>
                                )





                            } else if (props.renderPart == "signIn") {
                              
                                return (
                                    <div className="">
                                        <h2>Sign in with Google</h2>
                                        <br />
                                        <div className="d-flex justify-content-center googleloginWrapper">
                                            <div className="google-btn" onClick={() => login()}>
                                                <div className="google-icon-wrapper">
                                                    <img className="google-icon"
                                                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <p className="btn-text"><b>Continue with Google</b></p>
                                                </div>
                                            </div>
                                        
                                        </div>
                                    </div>

                                )
                            }
                        })()}




                    </div>

                </div>
            </div>
        </div>


    )
}
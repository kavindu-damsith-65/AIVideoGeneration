import { motion } from 'framer-motion'
import ProgressBar from "@ramonak/react-progress-bar";
import { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const products = [
    {
        "name": 'Free',
        "selections": null,
        "links": [],
        "perMin": null,
        "includes": [
            "720p videos", "15 seconds videos", "All video styles", "All video sizes", "2 days video storage", "Has watermark", null
        ]

    },

    {
        "name": 'Plus',
        "selections": [
            15, 30, 40
        ],
        "links": [
            "https://buy.stripe.com/test_fZe4jwcq4g2ieSQ6oq",
            "https://buy.stripe.com/test_6oE03gcq4aHY120bIJ",
            "https://buy.stripe.com/test_dR6cQ2fCgaHY7qoeUX"
        ],
        "perMin": 1.93,
        "includes": [
            "All video resolutions", "All video durations", "All video styles", "All video sizes", "Private videos", "15 days video storage", "Without watermark"
        ]

    },

    {
        "name": 'Premium',
        "selections": [
            50, 100, 150, 200
        ],
        "links": [

        ],
        "perMin": 1.72,
        "includes": [
            "All video resolutions", "All video durations", "All video styles", "All video sizes", "Private videos", "720 days video storage", "Without watermark"
        ]

    },
    {
        "name": 'Enterprise',
        "selections": [
            15, 30, 40
        ],
        "links": [

        ],
        "perMin": 1.43,
        "includes": [
            "All video resolutions", "All video durations", "All video styles", "All video sizes", "Private videos", "15 days video storage", "Without watermark"
        ]

    },


]



export default function Payment(props) {
    const navigate = useNavigate()
    const [prices, setPrices] = useState([0, 0, 0, 0])
    // const [plan, setPlan] = useState([0, 0, 0, 0])
    const [subPlan, setSubPlan] = useState([0, 0, 0, 0])



    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }

        const defautPrices = products.map((product) => {
            return product.perMin ? product.perMin * product.selections[0] : 0
        })
        setPrices(defautPrices)

    }, [])


    const pay = (plan) => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
        else {
            axios.post('http://127.0.0.1:5000/verify-token', {
                token: localStorage.getItem('token')
            })
                .then(response => {
                    const verify = response.data.verify;

                    if (verify === "success") {
                        // console.log(products[plan].links[subPlan[plan]])
                        window.location.replace(products[plan].links[[subPlan[plan]]] + "?client_reference_id=" + response.data.public_id)
                    

                    } else {
                        console.log('Something went Wrong');
                    }
                })
                .catch(error => {
                    console.log('Something went Wrong');
                });
        }
    }



    const changePrice = (plan, sub) => {

        const newPrices = [...prices];
        newPrices[plan] = products[plan].perMin * products[plan].selections[sub];
        setPrices(newPrices)

        const newSub = [...subPlan];
        newSub[plan] = sub;
        setSubPlan(newSub)
    }

    return (
        <>
            <header className="bgColor2 py-4 pricing">
                <div className="mx-3 d-flex justify-content-start">
                    <div style={{cursor:'pointer'}} className="d-flex" onClick={()=>{navigate('/')}}>
                        <i className="fa fa-arrow-left" style={{ fontSize: '30px' }} aria-hidden="true"></i>
                        <h5 className="d-flex align-items-center text-center mx-2 my-0">Editor </h5>
                    </div>
                </div>
            </header>

            <div className="d-flex justify-content-center bgColor2 pt-2 billing-type pb-5">
                Billed monthly
                <div className=" mx-3 form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" />
                </div>
                Billed annualy
            </div>




            <div className="containerNew">
                <div className="row bgColor2 px-2 py-5 m-0">

                    {products.map((value, index) => {

                        return (
                            <div key={index} className="col-sm-6  col-md-4 col-lg-3 m-0">
                                <motion.div whileHover={{ scale: 1.05 }} className={" mt-3 pricing-item px-3" + (value.name === "Premium" ? " active-pricing" : "")}>
                                    <div className="d-flex justify-content-start">
                                        {value.name === "Premium" ?
                                            <h6 className="mt-4 mb-2 p-1 popular-tag">Most Popular</h6>
                                            :
                                            <h6 className="mt-4 mb-2 p-1 ">&nbsp;</h6>
                                        }


                                    </div>
                                    <h4 className=" px-1">{value.name}</h4>
                                    <h2 className=" px-1">${prices[index].toFixed(2)}</h2>
                                    <button
                                        onClick={() => { pay(index) }}
                                        className="generateVideo">
                                        Subscribe
                                    </button>

                                    <h6 className="mt-4 mb-2 p-1 ">{value.perMin ? "$" + value.perMin + "/minute" : "30 seconds for free"}</h6>

                                    <select style={{ visibility: (value.perMin ? 'visible' : 'hidden') }} onChange={(e) => { changePrice(index, e.target.value) }} className="pricingSelect mb-4" aria-label=".form-select-lg example">
                                        {value.selections ?
                                            value.selections.map((val2, index2) => {
                                                return (
                                                    <option key={index2} value={index2} >{val2} video minutes/month</option>
                                                )
                                            })
                                            : null
                                        }


                                    </select>



                                    <div className="pb-4">
                                        <h6 className="mt-4 mb-2 p-1 ">This includes</h6>
                                        {value.includes.map((val, index2) => {
                                            return (
                                                <h6 key={index2} className="p-1 ">{val ? <i className="fa-solid fa-circle-check" style={{ fontSize: '17px' }}></i> : ""}&nbsp;&nbsp;{val ? val : ""}
                                                </h6>
                                            )
                                        })}


                                    </div>

                                </motion.div>
                            </div>
                        )
                    })}




                </div>
            </div>


        </>
    )
}
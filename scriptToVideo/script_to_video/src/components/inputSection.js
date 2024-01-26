import { useState, useEffect, useRef } from "react"
import { motion } from 'framer-motion';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import io from 'socket.io-client';







import ProgressBar from "@ramonak/react-progress-bar";

export default function InputSection(props) {
    const buttonRef = useRef();


    const [topic, setTopic] = useState("");
    const [size, setSize] = useState("9:16");
    const [lenguage, setLenguage] = useState("English(US)");
    const [voice, setVoice] = useState("Female");
    const [duration, setDuration] = useState("15s");
    const [style, setStyle] = useState("None");


    const [percentage, setPercentage] = useState(0);
    const [videoUrl, setVideoUrl] = useState(null);

    const [room, setRoom] = useState(null);



    const constSizes = [
        ["res9_16", "9:16"],
        ["res1_1", "1:1"],
        ["res16_9", "16:9"],
        ["res4_5", "4:5"],
        ["res5_4", "5:4"],

    ]

    const lenguages = [
        "English(US)",
        "Spanish",
        "French",
        "Russian",
        "Japanese"
    ]

    const voices = ["Female", "Male"]

    const styles = [
        ["./assets/styles/1.jpeg", "None"],
        ["./assets/styles/2.jpg", "Photo"],
        ["./assets/styles/3.jpeg", "Cinamatic"],
        ["./assets/styles/1.jpeg", "Cartoon"],
        ["./assets/styles/2.jpg", "Style1"],
        ["./assets/styles/3.jpeg", "Style2"],
        ["./assets/styles/1.jpeg", "Style3"],
        ["./assets/styles/2.jpg", "Style1"],
        ["./assets/styles/3.jpeg", "Style2"],
    ]

    const durations = ["15s", "30s", "1m", "2m", "3m"]



    const upgrade=()=>{
        if (!localStorage.getItem('token')) {
            props.setRenderPart("signIn")
            buttonRef.current.click();
        }else{

        }
    }

    const startVideoGeneration = () => {
        if (!localStorage.getItem('token')) {
            props.setRenderPart("signIn")
            buttonRef.current.click();
        } else {
            if (topic.trim() && topic.trim().length > 10) {
                axios.post('http://127.0.0.1:5000/generate-video', {
                })
                    .then((response) => {
                        if (response.status == 200 || response.status == 201) {

                            const socket = io.connect('http://127.0.0.1:5000/generate-video');

                            const inputs = {
                                topic: topic,
                                size: size,
                                lenguage: lenguage,
                                voice: voice,
                                duration: duration,
                                style: style
                            }

                            socket.emit('join', {
                                room: response.data.room,
                                inputs: inputs

                            });
                            socket.on('status', function (data) {
                                console.log(data)
                                if (data.status === 'start') {
                                    props.setRenderPart("generateVideo")
                                    socket.on('progress', function (data) {
                                        props.setProgress(data.percentage)
                                    });
                                } else if (data.status === 'done') {
                                    // socket.disconnect();  
                                }

                            });

                        } else {
                            console.error('Error starting video generation:');
                        }
                    })
                    .catch((error) => {
                        console.error('Error starting video generation:');
                    });

            } else {
                console.log("min chars 10")
            }
        }


    };



    return (
        <div className="container mt-2">
            <div className="row mainInp">
                <div className="col col-md-6 col-lg-8 mt-2">
                    <div className="mt-3">
                        <h6>
                            Video topic
                        </h6>
                        <input onChange={(e) => { setTopic(e.target.value) }} type="text" className="form-control" placeholder="Generate a video about..." aria-label="topic"
                            aria-describedby="basic-addon1" />
                    </div>
                    <div className="mt-5">
                        <h6>
                            Size
                        </h6>
                        <div className="row screenContainer">
                            {
                                constSizes.map((val, index) => {
                                    return (
                                        <div key={index} className="screensize">
                                            <motion.div whileHover={{ scale: 1.06 }} onClick={() => { setSize(val[1]) }} className={val[1] == size ? "active" : ""} >
                                                <div className={val[0]}></div>
                                                <div className={val[1] == size ? "ticmark" : "hideTic"}>
                                                    <i className="fa fa-check" aria-hidden="true"></i>
                                                </div>
                                            </motion.div>
                                            <p>9:16</p>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="row">
                            <div className="col col-md-6">
                                <h6>
                                    Language
                                </h6>
                                <select onChange={(e) => { setLenguage(e.target.value) }} defaultValue={lenguage} className="defaultSelect" aria-label=".form-select-lg example">
                                    {lenguages.map((val, index) => {
                                        return (
                                            <option key={index} value={val}>{val}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col col-md-6">
                                <h6>
                                    Narration Voice
                                </h6>
                                <select onChange={(e) => { setVoice(e.target.value) }} defaultValue="1" className="defaultSelect" aria-label=".form-select-lg example">
                                    {voices.map((val, index) => {
                                        return (
                                            <option key={index} value={val}>{val}</option>
                                        )
                                    })}

                                </select>
                            </div>
                        </div>
                    </div>



                    <div className="mt-5">
                        <h6>
                            Styles
                        </h6>
                        <div className="videostyle">
                            {styles.map((image, index) => {
                                return (
                                    <div onClick={() => { setStyle(image[1]) }} key={index}>
                                        <motion.img whileHover={{ scale: 1.1 }} className={"styleImage " + (image[1] == style ? "active" : "")} src={image[0]} alt="" />
                                        <p>{image[1]}</p>
                                        <div className={image[1] == style ? "ticmark" : "hideTic"}>
                                            <i className="fa fa-check" aria-hidden="true"></i>
                                        </div>
                                    </div>
                                )
                            })}



                        </div>


                    </div>

                    <div className="mt-5">
                        <h6>
                            Approximate duration
                        </h6>

                        <div className="row screenContainer">
                            {durations.map((val, index) => {
                                return (
                                    <div key={index} className="screensize">
                                        <motion.div className={"durationWrapper " + (val == duration ? "active" : "")} whileHover={{ scale: 1.06 }} onClick={() => { setDuration(val) }}>
                                            <p className="m-0">{val}</p>
                                            <div className={val == duration ? "ticmark" : "hideTic"}>
                                                <i className="fa fa-check" aria-hidden="true"></i>
                                            </div>
                                        </motion.div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>

                </div>

                <div className="col-12 col-md-6 col-lg-4 mt-5 mt-4 ">
                    <div className="videoWrapper">
                        <div className="mx-3 px-2">
                            <p>
                                This is just a preview of the size of your video. Click Generate video to start the creation
                                process.
                            </p>
                            <div className="video-container">
                                <video controls>
                                    <source src="./assets/preview.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div className="pakegeWrapper">
                                <p>0m/2m</p>
                                <progress id="file" max="100" value="70">70%</progress>
                                <button 
                                ref={buttonRef}
                                onClick={upgrade}
                                className="upgrade">
                                    Upgrade
                                </button>

                            </div>
                            <button
                                ref={buttonRef}
                                onClick={startVideoGeneration}
                                data-bs-toggle="modal" data-bs-target="#signInModel"
                                className="generateVideo">
                                Generate video
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}



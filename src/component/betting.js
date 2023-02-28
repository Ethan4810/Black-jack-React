import gametable from "../headerimg/gametable.jpg";
import testcard from "../cardimg/1_ace_of_clubs.png";
import testcard2 from "../cardimg/10_king_of_hearts.png";
import nocard from "../cardimg/cardback.jpg";
import chip1 from "../chipimg/1_white_chip.png";
import chip5 from "../chipimg/5_red_chip.png";
import chip10 from "../chipimg/10_blue_chip.png";
import chip25 from "../chipimg/25_green_chip.png";
import chip100 from "../chipimg/100_black_chip.png";
import React, { useEffect, useRef, useState } from 'react';
import Axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

let usermoney = 0;

Axios.post("http://localhost:8000/userinfo", {
    id: sessionStorage.getItem("id"),
}).then((res) => {
    usermoney = Number(res.data.usermoney);
}).catch((e) => {
    console.error(e);
});
  

setInterval(() => {
    Axios.post("http://localhost:8000/userinfo", {
        id: sessionStorage.getItem("id"),
    }).then((res) => {  
        usermoney = Number(res.data.usermoney);
    }).catch((e) => {
        console.error(e);
    });

    //console.log("돈 : " + usermoney);
}, 5000);



const Game = () => {  
    const urlmove = useNavigate();
    const battingmoney = 0;

    return (
        <div>
            <div className="tablediv">
                <img src={gametable} className='gametable' alt='gametable' />

                <div className="delercard1">
                    <img src={nocard} className="testcard"/>
                </div>
                <div className="delercard2">
                    <img src={nocard} className="testcard2"/>
                </div>


                <div className="usercard1">
                    <img src={nocard} className="testcard"/>
                </div>
                <div className="usercard2">
                    <img src={nocard} className="testcard2"/>
                </div>

                <div className="usermoney">bankroll : {usermoney}</div>

                <div className="chips">
                    <a className="bettingtext">Bets : </a>
                    <input type="number" className="bettingmoney" id="bettingmoney" disabled={true} value={battingmoney} ></input><a className="dallor">$</a>
                    <div className="betbtn1">
                        <button className="gbtn betreset" onClick={() => {
                            const resultElement = document.getElementById('bettingmoney');

                            resultElement.value = 0;
                        }}>Reset</button>
                    </div>

                    <div className="betbtn2">
                    <button className="gbtn betallin" onClick={() => {
                            const resultElement = document.getElementById('bettingmoney');
                            
                            resultElement.value = usermoney;
                        }}>All In</button>
                    </div>
                    <img src={chip5} className="chip5"     onClick={() => {
                        const resultElement = document.getElementById('bettingmoney');

                        if(Number(resultElement.value) + 5 <= usermoney){
                            resultElement.value = Number(resultElement.value) + 5;
                        }
                    }}/>
                    <img src={chip10} className="chip10"   onClick={() => {
                        const resultElement = document.getElementById('bettingmoney');

                        if(Number(resultElement.value) + 10 <= usermoney){
                            resultElement.value = Number(resultElement.value) + 10;
                        }
                    }}/>
                    <img src={chip25} className="chip25"   onClick={() => {
                        const resultElement = document.getElementById('bettingmoney');

                        if(Number(resultElement.value) + 25 <= usermoney){
                            resultElement.value = Number(resultElement.value) + 25;
                        }
                    }}/>
                    <img src={chip100} className="chip100" onClick={() => {
                        const resultElement = document.getElementById('bettingmoney');

                        if(Number(resultElement.value) + 100 <= usermoney){
                            resultElement.value = Number(resultElement.value) + 100;
                        }
                    }}/>
                </div>

                <div className="finishbats">
                    <button className="gbtn finbats" onClick={(e) =>  {
                        e.preventDefault();

                        const resultElement = document.getElementById('bettingmoney');

                        Axios.post("http://localhost:8000/betting", {
                            betsmoney : resultElement.value,
                            id : sessionStorage.getItem("id"),
                        }).then((res) => {
                            if(res.data.betting === "finish"){

                                if(usermoney < 9){
                                    const Toast = Swal.mixin({
                                        toast: true,
                                        position: 'center-center',
                                        showConfirmButton: false,
                                        timer: 3000,
                                        timerProgressBar: true,
                                        width: 500,
                                        didOpen: (toast) => {
                                          toast.addEventListener('mouseenter', Swal.stopTimer)
                                          toast.addEventListener('mouseleave', Swal.resumeTimer)
                                        }
                                    })
                    
                                    Toast.fire({
                                        icon: 'error',
                                        title: '가진 돈이 최소 베팅금액보다 적습니다.',
                                    }).then(function(){
                                        urlmove('/');
                                    });
                                }else if(usermoney >= 10 && resultElement.value < 10){
                                    const Toast = Swal.mixin({
                                        width: 800,
                                    })
        
                                    Toast.fire({
                                        icon: 'warning',
                                        title: '베팅한 금액이 최소 베팅금액보다 적습니다.',
                                    });
                                }else {
                                    urlmove('/Game');
                                }
                            } else {
                                const Toast = Swal.mixin({
                                    width: 500,
                                })
    
                                Toast.fire({
                                    icon: 'warning',
                                    title: '베팅에 실패하였습니다.',
                                });
                            }
                        }).catch((e) => {
                            console.error(e);
                        });

                    }}>Deal</button>
                </div>
            </div>
        </div>
    );
}

export default Game;
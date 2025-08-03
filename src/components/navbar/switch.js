import React from "react";
import styled from "styled-components";

const Switch = ({ onClick, children }) => {
  return (
    <StyledWrapper>
      <label className="switch" onClick={onClick}>
        <input type="checkbox" id="toggle" />
        <span className="slider">
          <div className="moons-hole">
            <div className="moon-hole" />
            <div className="moon-hole" />
            <div className="moon-hole" />
          </div>
          <div className="black-clouds">
            <div className="black-cloud" />
            <div className="black-cloud" />
            <div className="black-cloud" />
          </div>
          <div className="clouds">
            <div className="cloud" />
            <div className="cloud" />
            <div className="cloud" />
            <div className="cloud" />
            <div className="cloud" />
            <div className="cloud" />
            <div className="cloud" />
          </div>
          <div className="stars">
            <svg className="star" viewBox="0 0 20 20">
              <path d="M0 10C10 10,10 10,0 10C10 10,10 10,10 20C10 10,10 10,20 10C10 10,10 10,10 0C10 10,10 10,0 10Z" />
            </svg>
            <svg className="star" viewBox="0 0 20 20">
              <path d="M0 10C10 10,10 10,0 10C10 10,10 10,10 20C10 10,10 10,20 10C10 10,10 10,10 0C10 10,10 10,0 10Z" />
            </svg>
            <svg className="star" viewBox="0 0 20 20">
              <path d="M0 10C10 10,10 10,0 10C10 10,10 10,10 20C10 10,10 10,20 10C10 10,10 10,10 0C10 10,10 10,0 10Z" />
            </svg>
            <svg className="star" viewBox="0 0 20 20">
              <path d="M0 10C10 10,10 10,0 10C10 10,10 10,10 20C10 10,10 10,20 10C10 10,10 10,10 0C10 10,10 10,0 10Z" />
            </svg>
            <svg className="star" viewBox="0 0 20 20">
              <path d="M0 10C10 10,10 10,0 10C10 10,10 10,10 20C10 10,10 10,20 10C10 10,10 10,10 0C10 10,10 10,0 10Z" />
            </svg>
          </div>
        </span>
      </label>
      <div className="icon">{children}</div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  .switch {
    position: relative;
    display: inline-block;
    width: 70px;
    height: 30px;
    border: 1px solid rgb(58, 58, 58);
    border-radius: 22px;
    cursor: pointer;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: black;
    border-radius: 20px;
    transition: 0.4s;
    overflow: hidden;
    z-index: 2;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 5px;
    background-color: white;
    transition: 1s;
    border-radius: 50%;
  }

  .moons-hole,
  .moon-hole,
  .black-clouds,
  .clouds,
  .stars {
    position: absolute;
    transition: 1s;
  }

  .moon-hole {
    background-color: rgb(85, 85, 85);
    border-radius: 50%;
  }

  .moon-hole:nth-child(1) { height: 5px; width: 5px; top: 26px; left: 20px; }
  .moon-hole:nth-child(2) { height: 10px; width: 10px; top: 16px; left: 7px; }
  .moon-hole:nth-child(3) { height: 4px; width: 4px; top: 12px; left: 21px; }

  input:checked + .slider {
    background-color: #62cff0;
  }

  input:checked + .slider:before {
    transform: translateX(52px);
    background-color: orange;
  }

  input:checked + .slider .moons-hole {
    transform: translateX(52px);
    opacity: 0;
  }

  .star {
    fill: white;
    animation: star-twinkle 2s infinite;
    opacity: 1;
  }

  .star:nth-child(1) { top: 5px; right: 29px; width: 20px; animation-delay: 0.3s; }
  .star:nth-child(2) { top: 18px; right: 9px; width: 15px; }
  .star:nth-child(3) { top: 5px; right: 15px; width: 10px; animation-delay: 0.6s; }
  .star:nth-child(4) { top: 26px; right: 28px; width: 12px; animation-delay: 0.9s; }
  .star:nth-child(5) { top: 2px; right: 50px; width: 8px; animation-delay: 1.2s; }

  @keyframes star-twinkle {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

export default Switch;

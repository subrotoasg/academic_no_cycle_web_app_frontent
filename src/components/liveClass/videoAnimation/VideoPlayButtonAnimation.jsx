import { Play } from "lucide-react";
import React from "react";
import styled from "styled-components";

const VideoPlayButtonAnimation = () => {
  return (
    <StyledWrapper>
      <div className="button">
        <svg
          viewBox="0 0 448 512"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="play-icon"
        >
          <path
            d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
            fill="currentColor"
          />
        </svg>
        {/* <Play className="w-6 h-6" /> */}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    display: flex;
    justify-content: center;
    color: #fff;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background: linear-gradient(
      30deg,
      rgb(255, 130, 0) 20%,
      rgb(255, 38, 0) 80%
    );
    transition: all 0.3s ease-in-out 0s;
    box-shadow: rgba(193, 244, 246, 0.698) 0px 0px 0px 0px;
    animation: 1.2s cubic-bezier(0.8, 0, 0, 1) 0s infinite normal none running
      pulse;
    align-items: center;
    border: 0;

    @media (min-width: 480px) {
      width: 60px;
      height: 60px;
    }

    @media (min-width: 768px) {
      width: 70px;
      height: 70px;
    }

    @media (min-width: 1024px) {
      width: 80px;
      height: 80px;
    }
  }

  .play-icon {
    width: 16px;
    height: 16px;

    @media (min-width: 480px) {
      width: 20px;
      height: 20px;
    }

    @media (min-width: 768px) {
      width: 22px;
      height: 22px;
    }

    @media (min-width: 1024px) {
      width: 26px;
      height: 26px;
    }
  }

  .button:is(:hover, :focus) {
    transform: scale(1.2);
  }

  @keyframes pulse {
    100% {
      box-shadow: 0 0 0 45px rgba(193, 244, 246, 0);
    }
  }
`;

export default VideoPlayButtonAnimation;

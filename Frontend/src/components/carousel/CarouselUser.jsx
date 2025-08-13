import React, { useRef } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import Img from "../lazyLoadImage/Img";
import PosterFallback from "../../assets/no-poster.png";
import "./style.scss";

const CarouselUser = ({ title, data = [], loading = true }) => {
  const carouselContainer = useRef();
  const navigate = useNavigate();

  const navigation = (dir) => {
    const container = carouselContainer.current;
    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth + 20)
        : container.scrollLeft + (container.offsetWidth + 20);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const skItem = () => (
    <div className="skeletonItem">
      <div className="posterBlock skeleton"></div>
      <div className="textBlock">
        <div className="title skeleton"></div>
        <div className="date skeleton"></div>
      </div>
    </div>
  );

  return (
    <div className="carousel">
      <ContentWrapper>
        {title && <span className="carouselTitle">{title}</span>}

        <BsFillArrowLeftCircleFill
          className="carouselLeftNav arrow"
          onClick={() => navigation("left")}
        />
        <BsFillArrowRightCircleFill
          className="carouselRighttNav arrow"
          onClick={() => navigation("right")}
        />

        {!loading ? (
          <div className="carouselItems" ref={carouselContainer}>
            {data.map((item) => (
              <div key={item.id} className="carouselItem">
                <Link to={`/news/${item.slug}`} className="carouselItem-link">
                  <div className="posterBlock">
                    <Img src={item.coverImage || PosterFallback} />
                    <img
                      src={item.userProfilePic || PosterFallback}
                      alt=""
                      className="avatarImage"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/profile");
                      }}
                    />
                  </div>
                  <div className="textBlock">
                    <span className="title">{item.title}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="loadingSkeleton">
            {Array.from({ length: 5 }).map((_, i) => (
              <React.Fragment key={i}>{skItem()}</React.Fragment>
            ))}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default CarouselUser;

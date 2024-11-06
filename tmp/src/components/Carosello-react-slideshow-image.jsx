// import React from "react";
// import { useTheme } from "@mui/material/styles";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";

import React from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
//import { Carousel } from "react-responsive-carousel";
//import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import config from "../config";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import styles from "./Slider.module.css";

function Carosello({ ...props }) {
  const theme = useTheme();
  const { t } = useTranslation();
  
  return (
    <div className={styles.container}>
      <Slide easing="ease">
        SLIDE
        {props.products.map((product, index) => (
          <div key={index} className={styles.slide} style={{ userSelect: "none" }}>
            <div style={{ backgroundImage: `url(${config.siteUrl}${config.images.publicPathWaterMark}/${product.imageName})` }}>
              <span>Slide {index + 1}</span>
            </div>
          </div>
        ))}
      </Slide>
    </div>
  );
  
  return (
    <Carousel
      axis={"horizontal"}
      autoplay={false}
      autoFocus={true}
      centerMode={true}
      centerSlidePercentage={100}
      dynamicHeight={false}
      emulateTouch={true}
      infiniteLoop={false}
      showThumbs={false}
      statusFormatter={() => { }}
      labels={{ leftArrow: t("previous product"), rightArrow: t("next product"), item: "" }}
      useKeyboardArrows={true}
      transitionTime={300}
      width={"75%"}
      renderIndicator={(onClickHandler, isSelected, index, label) => { }}
      renderArrowPrev={(clickHandler, hasPrev, labelPrev) =>
        /*hasPrev && */(
          <button className="control-prev control-arrow" style={{border: 0, backgroundColor: "gray", userSelect: "none"}} onClick={clickHandler}
            disabled={!hasPrev}>
            {/* <img
              style={{ height: "30px", width: "30px", opacity: hasPrev ? .5 : .1 }}
              src={`/prev.png`}
            /> */}
          </button>
        )
      }
      renderArrowNext={(clickHandler, hasNext, labelNext) =>
        /*hasNext && */(
          <button className="control-next control-arrow" style={{ border: 0, backgroundColor: "gray", userSelect: "none" }} onClick={clickHandler}
            disabled={!hasNext}>
            {/* <img
              style={{ height: "30px", width: "30px", opacity: ".5"}}
              src={`/next.png`}
            /> */}
          </button>
        )
      }

      ariaLabel={t("Products carousel")}
    >
      {props.products.map((product, index) => (
        <div key={index} style={{ userSelect: "none" }}>
          <div class="slider">
            <img src={`${config.siteUrl}${config.images.publicPathWaterMark}/${product.imageName}`}
              alt="Product image"
              style={{ maxWidth: "75%" }}
            />
            <div class="legend">
              Item {index} {product.mdaCode}
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}

export default React.memo(Carosello);

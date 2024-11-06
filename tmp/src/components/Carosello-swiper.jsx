import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import config from "../config";


function Carosello({ products }) {
  return (
    // Make sure this container takes the full width and height
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={10}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
    >
      {products.map((product, index) => (
        <SwiperSlide key={index}>
          <div
            style={{
              backgroundImage: `url(${config.siteUrl}${config.images.publicPathWaterMark}/${product.imageName})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "800px", // adjust the height as necessary
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span>Slide {index + 1}</span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default React.memo(Carosello);

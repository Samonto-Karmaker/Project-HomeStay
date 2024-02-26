import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

/** [] is used a default value for images. As we are getting images from the backend, there can be a delay.
 As a result, for a moment, images will be undefined. To avoid this, we use default value. */
const ImgSwiper = ({images = []}) => {
  console.log(images);
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      loop={true}
      grabCursor={true}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              filter: 'blur(10px)',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: -1,
            }}
          />
          <img src={image} alt={`img-${index}`} 
            style={{
              width: '70%',
              height: 'auto',
              objectFit: 'cover',
              border: '1px solid',
              borderRadius: '10px',
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImgSwiper;
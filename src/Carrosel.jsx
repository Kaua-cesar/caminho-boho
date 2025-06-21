import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./index.css";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

export function Carrosel() {
   return (
      <>
         <Swiper
            centeredSlides={true}
            autoplay={{
               delay: 2500,
               disableOnInteraction: false,
            }}
            pagination={{
               clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
         >
            <SwiperSlide>
               <div className="absolute flex flex-col items-start top-[40%] left-45 text-white">
                  <p className="text-2xl font-semibold">
                     Para ocasioes especiais
                  </p>
                  <h1 className="text-6xl font-bold">Costa nua curto</h1>
                  <h2 className="text-xl">
                     Vestidos de costa falase opasdklaskdlas
                  </h2>
                  <ButtonsCarrosel
                     button1Text="Ver coleção"
                     button2Text="Saiba mais sobre Costa nua"
                  />
               </div>
               <img
                  src="https://png.pngtree.com/background/20250104/original/pngtree-woman-in-flowing-gown-at-sunset-cityscape-background-picture-image_16103168.jpg"
                  alt=""
               />
            </SwiperSlide>
            <SwiperSlide>
               <div className="absolute flex flex-col items-start top-[40%] left-45 text-white">
                  <p className="text-2xl font-semibold">Para o dia a dia</p>
                  <h1 className="text-6xl font-bold">Viscose liso</h1>
                  <h2 className="text-xl">
                     Vestidos de viscoise falase opasdklaskdlas
                  </h2>
                  <ButtonsCarrosel
                     button1Text="Ver coleção"
                     button2Text="Saiba mais sobre Viscose"
                  />
               </div>
               <img
                  src="https://png.pngtree.com/thumb_back/fw800/background/20240731/pngtree-beautiful-bride-in-long-white-dress-wet-hair-lying-on-a-image_15937018.jpg"
                  alt=""
               />
            </SwiperSlide>
         </Swiper>
      </>
   );
}

export function ButtonsCarrosel({ button1Text, button2Text }) {
   return (
      <>
         <div className="flex gap-4 mt-4 font-semibold">
            <button className="bg-yellow-600 cursor-pointer p-3 rounded-md">
               {button1Text}
            </button>
            <button className="bg-transparent border border-yellow-600 cursor-pointer p-3 rounded-md backdrop-blur-xs">
               {button2Text}
            </button>
         </div>
      </>
   );
}

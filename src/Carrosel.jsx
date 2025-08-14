import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./index.css";

import { Autoplay, Pagination, Navigation } from "swiper/modules";

export function Carrosel() {
   return (
      <>
         <Swiper
            centeredSlides={true}
            autoplay={{
               delay: 2500,
               disableOnInteraction: true,
            }}
            pagination={{
               clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
         >
            <SwiperSlide>
               <div className="absolute flex flex-col items-start top-[20%] md:top-[40%] md:left-45 text-white w-screen">
                  <p className="text-2xl font-semibold w-full md:w-auto">
                     Para ocasioes especiais
                  </p>
                  <h1 className="md:text-6xl font-bold w-full text-5xl h-[60px] md:text-start">
                     Costa nua curto
                  </h1>
                  <h2 className="text-xl w-full md:w-auto md:mb-0 px-10 md:px-0">
                     Vestidos de costa falase opasdklaskdlas
                  </h2>
                  <div className="w-full items-center justify-center">
                     <ButtonsCarrosel
                        button1Text="Ver coleção"
                        button2Text="Saiba mais sobre Costa nua"
                     />
                  </div>
               </div>
               <img
                  src="https://png.pngtree.com/background/20250104/original/pngtree-woman-in-flowing-gown-at-sunset-cityscape-background-picture-image_16103168.jpg"
                  alt=""
               />
            </SwiperSlide>
            <SwiperSlide>
               <div className="absolute flex flex-col items-start top-[20%] md:top-[40%] md:left-45 text-white  w-screen">
                  <p className="text-2xl font-semibold w-full md:w-auto">
                     Para ocasioes especiais
                  </p>
                  <h1 className="text-6xl font-bold w-full md:text-start text-center h-[60px]">
                     Viscose liso
                  </h1>
                  <h2 className="text-xl w-full md:w-auto md:mb-0 px-10 md:px-0">
                     Vestidos de viscoise falase opasdklaskdlas
                  </h2>
                  <div className="w-full items-center justify-center">
                     <ButtonsCarrosel
                        button1Text="Ver coleção"
                        button2Text="Saiba mais sobre Viscose"
                     />
                  </div>
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
         <div className="flex gap-4 mt-45 md:mt-4 font-semibold text-sm md:text-[16px] md:justify-start justify-center">
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

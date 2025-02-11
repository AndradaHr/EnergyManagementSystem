import React, { useState } from "react";
import ItemsCarousel from "react-items-carousel";
import { Heading, Text, Box, Image } from "@chakra-ui/react";
import "./CarouselSection.css";
import EMSImage from "./EMS.jpg";

const CarouselSection = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const items = [
    {
      title: "Energy Management System",
      image: EMSImage,
      desc: "Optimize energy usage in your home with advanced energy management systems.",
      color: "#ffffff",
      textColor: "green"
    },
    {
      title: "Smart Home Control",
      image: "https://images.tmcnet.com/tmc/misc/articles/image/2023-sep/2118696467-AdobeStock_555108297_smart%20home_remote_1200x630.jpeg",
      desc: "Control your home appliances seamlessly with smart technology.",
      color: "#ffffff",
      textColor: "green"
    },
    {
      title: "Rooftop Solar Solutions",
      image: "https://www.laserenergy.org.uk/wp-content/uploads/2024/06/Rooftop-Solar-Schools-LASER-Energy-2000x1498.jpg",
      desc: "Harness solar energy and reduce electricity costs with rooftop solar.",
      color: "#ffffff",
      textColor: "green"
    },
    {
      title: "Energy Efficient Hotels",
      image: "http://pre-webunwto.s3.eu-west-1.amazonaws.com/2019-09/hotel-energy.jpg",
      desc: "Explore how hotels can reduce energy consumption and improve sustainability.",
      color: "#ffffff",
      textColor: "green"
    },
    {
      title: "Kinetic Energy Solutions",
      image: "https://www.thoughtco.com/thmb/DEt73TG10D0iccWkHwz1GAds9EA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Running_KineticEnergy-58ac6fa53df78c345b601ef2.jpg",
      desc: "Utilize kinetic energy to power your smart devices efficiently.",
      color: "#ffffff",
      textColor: "green"
    },
  ];

  return (
    <div>
      <Box className="background_image" />
      <Box className="hero_content">
        <Heading as="h1" className="hero_title">Energy Management System</Heading>
        <Text className="hero_description">
          An energy management system (EMS) is a system of computer-aided tools used by operators of electric utility grids to monitor, control, and optimize the performance of the generation or transmission system.
        </Text>
      </Box>

      <Box className="smart_home_container">
        <Image 
          src="https://genless.govt.nz/assets/Everyone-Images/Lifestyle/The-Smart-Home-System__ScaleMaxWidthWzE2MDBd.png"
          alt="Smart Home"
          className="smart_home_image"
        />
        <Box className="smart_home_text">
          <Heading as="h2" size="lg">What is a smart home</Heading>
          <Text className="smart_home_description">
            A smart home isn’t the house itself, but a clever system that links residential appliances together into a network and enables communication with the national electricity grid. The smart home system operates the appliances within the house to use electricity as efficiently as possible, without changing the way you use your technology.
          </Text>
          <Text className="smart_home_description">
            In a smart home, electrical appliances can connect to a home energy management system (HEMS) and a flexibility service supplier to seamlessly optimise your electricity use on your behalf, according to your household needs. For this to work, your appliances would either have ‘smart’ technology built into them, or be plugged in to a ‘smart’ plug.
          </Text>
          <Text className="smart_home_description">
            While the optimisation will work automatically to reduce unnecessary electricity use during peak times, the household still has ultimate control over which appliances can have their energy use dialled down and when. Consumers can also pause the function altogether if they feel the need to.
          </Text>
          <Text className="smart_home_description">
            This approach to home electricity use could reduce costs for households, take pressure off the national electricity grid, and help reduce New Zealand’s carbon footprint.
          </Text>
        </Box>
      </Box>

      <Box className="card_container">
        <ItemsCarousel
          requestToChangeActive={(value) => setActiveItemIndex(value)}
          activeItemIndex={activeItemIndex}
          numberOfCards={2}
          gutter={20}
          leftChevron={<button className="carousel_btn_box_L">{'<'}</button>}
          rightChevron={<button className="carousel_btn_box_R">{'>'}</button>}
          outsideChevron
          chevronWidth={40}
        >
          {items.map((item, index) => (
            <Box key={index} className="card_item" bg={item.color}>
              <Box className="card_item_img_box">
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              </Box>
              <Box className="card_item_txt_box" style={{ backgroundColor: '#006241b7', color: 'white', padding: '20px' }}>
                <Heading as="h4" size="md">{item.title}</Heading>
                <Text fontSize="sm">{item.desc}</Text>
              </Box>
            </Box>
          ))}
        </ItemsCarousel>
      </Box>
    </div>
  );
};

export default CarouselSection;

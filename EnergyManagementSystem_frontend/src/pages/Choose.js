import React from "react";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import "./CarouselSection.css";
import { Link } from "react-router-dom";

const ButtonsSection = () => {
  return (
    <Box display="flex" justifyContent="center" mt={10} mb={10}>
      <Link to="/user">
        <Button className="custom_button" mr={8} size="lg">
          <Image 
            src="https://upload.wikimedia.org/wikipedia/commons/1/12/User_icon_2.svg" 
            alt="User"
            boxSize="40px" 
            mr={3} 
          />
          User
        </Button>
      </Link>
      <Link to="/device">
        <Button className="custom_button" size="lg">
          <Image 
            src="https://gogeticons.com/frontend/web/icons/data/2/1/0/5/9/3/battery_electric_energy_storage_icon_512.png" 
            alt="Device"
            boxSize="40px" 
            mr={3} 
          />
          Device
        </Button>
      </Link>
    </Box>
  );
};

export default ButtonsSection;
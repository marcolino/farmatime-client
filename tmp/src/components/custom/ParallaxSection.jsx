// src/components/ParallaxSection.jsx
import { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";

export default function ParallaxSection({
  image,
  height = 300,
  speed = 0.4, // smaller = slower background movement
  overlayOpacity = 0.3,
}) {
  const ref = useRef(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrollPosition = window.scrollY + window.innerHeight;
      const elementPosition = window.scrollY + rect.top;
      const distance = scrollPosition - elementPosition;
      setOffsetY(distance * speed);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <Box
      ref={ref}
      sx={{
        position: "relative",
        height,
        overflow: "hidden",
        borderRadius: 2,
        mb: 8,
      }}
    >
      <Box
        component="img"
        src={image}
        alt=""
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "120%",
          objectFit: "cover",
          transform: `translateY(-${offsetY}px)`,
          transition: "transform 0.05s linear",
          willChange: "transform",
          filter: "brightness(70%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: `rgba(0, 0, 0, ${overlayOpacity})`,
        }}
      />
    </Box>
  );
}

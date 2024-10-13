import React, { useState, useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme, useMediaQuery } from "@mui/material";
import { useTransition } from "react-spring";

const pageVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    position: "absolute",
  }),
};

const pageTransition = {
  x: { type: "spring", stiffness: 800, damping: 40 },
  opacity: { duration: 0.05 },
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  const navType = useNavigationType();
  const [direction, setDirection] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (navType === "PUSH") {
      setDirection(1);
    } else if (navType === "POP") {
      setDirection(-1);
    }
  }, [location, navType]);

  if (isMobile) {
    return <>{children}</>; // No animation for mobile
  }

  const transitions = useTransition(location.pathname, (key) => key, {
    from: { opacity: 0, transform: `translate3d(${direction > 0 ? "100%" : "-100%"}, 0, 0)` },
    enter: { opacity: 1, transform: "translate3d(0, 0, 0)" },
    leave: { opacity: 0, transform: `translate3d(${direction < 0 ? "100%" : "-100%"}, 0, 0)` },
    config: {
      mass: 1,
      tension: 280,
      friction: 12,
    },
  });

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <AnimatePresence>
        {transitions.map((props) => (
          <motion.div
            key={props.key}
            style={props}
            custom={direction}
            variants={pageVariants}
            transition={pageTransition}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            {children}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;

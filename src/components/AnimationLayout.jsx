import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";


const AnimationLayout = () => {
  const { pathname } = useLocation();
  const pageVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1
    },
    out: {
      opacity: 0
    }
  };
  const pageTransition = {
    type: "spring",
    stiffness: 50,
    duration: 0.7,

  };
  return (
    <>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Outlet />
      </motion.div>
    </>
  );
};

export default React.memo(AnimationLayout);

import React from "react";
import DotLoader from "react-spinners/DotLoader";
import PropTypes from "prop-types";

export const Loader = ({ loading, size, color }) => {
  return (
    <div className="dot-loader-container" style={styles.container}>
      <DotLoader loading={loading} size={size} color={color} />
    </div>
  );
};

Loader.propTypes = {
  loading: PropTypes.bool.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};

Loader.defaultProps = {
  size: 60,
  color: "#800080",
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};

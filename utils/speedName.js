const speedName = (cleaningSpeed) => {
  if (cleaningSpeed < 75) return "Slow";
  if (cleaningSpeed < 125) return "Medium";
  if (cleaningSpeed < 175) return "Fast";
  return "Unknown";
};

export default speedName;

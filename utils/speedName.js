const speedName = (cleaningSpeed) => {
  if (cleaningSpeed == 100) return "Slow";
  if (cleaningSpeed == 200) return "Medium";
  if (cleaningSpeed == 400) return "Fast";
  return "Unknown";
};

export default speedName;

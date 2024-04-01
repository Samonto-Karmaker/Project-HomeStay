const isValidDateRange = (startDate, endDate) => {
  const today = new Date().setHours(0, 0, 0, 0);

  if (!startDate || !endDate) return false;
  if (new Date(startDate) < today) {
    alert("Time Travel is not allowed!");
    return false;
  }

  const diffTime = new Date(endDate).getTime() - new Date(startDate).getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 1) {
    alert("End Date must be after Start Date!");
    return false;
  }
  return true;
};

export default isValidDateRange;
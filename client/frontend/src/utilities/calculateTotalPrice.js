import isValidDateRange from "./isValidDateRange";

const calculateTotalPrice = (checkIn, checkOut, price, isPastData) => {
    if (!checkIn || !checkOut) return price;
    if (!isPastData && !isValidDateRange(checkIn, checkOut)) return price;

    console.log(checkIn, checkOut, price, isPastData);
    const diffTime = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * price;
};

export default calculateTotalPrice;
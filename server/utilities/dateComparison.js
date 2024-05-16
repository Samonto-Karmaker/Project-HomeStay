const areDatesEqual = (date1, date2) => {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return d1.getTime() === d2.getTime();
};

const isBookingClash = (checkIn, checkOut, booking, place) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const bookingCheckIn = new Date(booking.checkIn);
    const bookingCheckOut = new Date(booking.checkOut);
    const isNotAvailableFrom = new Date(place.isNotAvailableFrom);
    const isNotAvailableTo = new Date(place.isNotAvailableTo);

    return (
        (checkInDate >= bookingCheckIn && checkInDate < bookingCheckOut) ||
        (checkOutDate > bookingCheckIn && checkOutDate <= bookingCheckOut) ||
        (checkInDate <= bookingCheckIn && checkOutDate >= bookingCheckOut) || 
        (checkInDate >= isNotAvailableFrom && checkInDate <= isNotAvailableTo) ||
        (checkOutDate >= isNotAvailableFrom && checkOutDate <= isNotAvailableTo)
    );
};

module.exports = {
    areDatesEqual,
    isBookingClash,
};

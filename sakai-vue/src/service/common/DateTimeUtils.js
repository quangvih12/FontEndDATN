export const formatDateAndTime = (datetime) => {
    const dateAndTime = new Date(datetime);
    return dateAndTime.toLocaleString('vi-VN');
}
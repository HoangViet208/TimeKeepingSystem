import { parse, format, getDaysInMonth, startOfMonth, addDays } from 'date-fns'

export const FormatDateToTime = (dateObject) => {
    const currentDate = new Date(dateObject)
    const hours = currentDate.getHours()
    const minutes = currentDate.getMinutes()

    // Định dạng thành chuỗi "HH:mm"
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    return formattedTime
}

export const calculateDuration = (startTime, endTime) => {
    const clockIn = new Date(`1970-01-01T${startTime}`)
    const clockOut = new Date(`1970-01-01T${endTime}`)
    const durationMilliseconds = clockOut - clockIn
    const durationInSeconds = Math.floor(durationMilliseconds / 1000)

    const durationHours = Math.floor(durationInSeconds / 3600)
    const durationMinutes = Math.floor((durationInSeconds % 3600) / 60)
    const durationSeconds = durationInSeconds % 60

    return `${durationHours.toString().padStart(2, '0')}:${durationMinutes
        .toString()
        .padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`
}
export function formatTimeToDate(startTime) {
    if (!startTime) return null

    const timeComponents = startTime.split(':')
    const hours = parseInt(timeComponents[0], 10)
    const minutes = parseInt(timeComponents[1], 10)

    // Tạo một đối tượng Date với giờ và phút tương ứng
    const currentDate = new Date()
    currentDate.setHours(hours, minutes, 0, 0)

    return currentDate
}
export function formatDateToInputValue(startDate) {
    const [year, month, day] = startDate.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const year1 = date.getFullYear()
    const month1 = String(date.getMonth() + 1).padStart(2, '0')
    const day1 = String(date.getDate()).padStart(2, '0')
    return `${year1}/${month1}/${day1}`
}

export const getDateRangeArray = (startDate, endDate) => {
    const dateRangeArray = []
    const currentDate = new Date(startDate)
    const lastDate = new Date(endDate)
    function formatNewDate(date) {
        const day = String(date.getDate()).padStart(2, '0')
        const month = date.toLocaleString('en-US', { month: 'short' })
        const year = date.getFullYear()
        return `${day} ${month}, ${year}`
    }
    while (currentDate <= lastDate) {
        dateRangeArray.push(formatNewDate(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
    }

    return dateRangeArray
}
export const calculateTime = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)

    // Convert times to minutes
    const startTimeInMinutes = startHour * 60 + startMinute
    const endTimeInMinutes = endHour * 60 + endMinute

    // Calculate the time difference in minutes
    const timeDifferenceInMinutes = endTimeInMinutes - startTimeInMinutes

    // Convert the time difference back to hours and minutes
    const timeDifferenceHours = Math.floor(timeDifferenceInMinutes / 60)
    const timeDifferenceMinutes = timeDifferenceInMinutes % 60
    return timeDifferenceHours + ' hours ' + timeDifferenceMinutes + ' minutes'
}
export const calculateDays = (startDate, endDate) => {
    // Chuyển đổi chuỗi ngày thành các đối tượng Date
    const startDateObject = new Date(startDate)
    const endDateObject = new Date(endDate)

    const timeDiff = endDateObject.getTime() - startDateObject.getTime() + 24 * 60 * 60 * 1000 // Thêm 1 ngày


    const daysDiff = timeDiff / (1000 * 60 * 60 * 24)

    // Số ngày trong khoảng thời gian (bao gồm cả ngày bắt đầu và kết thúc)
    return Math.abs(daysDiff) // Sử dụng Math.abs để đảm bảo kết quả luôn dương
}
export const calculateTotalLeaveDays = (leaveDaysDate) => {
    let totalLeaveDays = 0;

    leaveDaysDate.forEach(day => {
        if (day.type === "nonWorkingDay") {
            // Bỏ qua ngày nghỉ
            return;
        } else if (day.type === "Morning" || day.type === "Afternoon") {
            // Nếu type là Morning hoặc Afternoon, thêm 0.5 ngày
            totalLeaveDays += 0.5;
        } else {
            // Ngày là Full Day, thêm 1 ngày
            totalLeaveDays += 1;
        }
    });

    return totalLeaveDays;
};

export const getDayOfWeek = (dateString) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const date = new Date(dateString)
    const dayOfWeek = date.getDay() // Lấy thứ của ngày (0-6, 0 là Chủ Nhật)
    return daysOfWeek[dayOfWeek]
}
export const getDateToMonth = (dateString) => {
    const date = new Date(dateString)
    const dayOfWeek = date.getDate() // Lấy thứ của ngày (0-6, 0 là Chủ Nhật)
    return dayOfWeek
}

export const formatDateToMonth = (date) => {
    const dateObject = new Date(date)
    const month = format(dateObject, 'MMMM')
    const monthStart = startOfMonth(dateObject)
    const daysInMonth = getDaysInMonth(dateObject)

    const arrayOfDates = []
    for (let i = 0; i < daysInMonth; i++) {
        const currentDate = addDays(monthStart, i)
        const dayObject = {
            date: format(currentDate, 'yyyy-MM-dd'), // Format ngày thành "yyyy-MM-dd" (ví dụ: "2023-05-01")
            day: format(currentDate, 'd'), // Format ngày thành số (ví dụ: "1" cho ngày đầu tiên trong tháng)
        }
        arrayOfDates.push(dayObject)
    }
    return arrayOfDates
}

export const formatDate = (date) => {
    const parsedDate = new Date(date)
    const formattedDate = format(parsedDate, 'dd MMM, yyyy')
    return formattedDate
}
export const formatDateExact = (date) => {
    const dateObject = new Date(date)

    const year = dateObject.getFullYear() // Lấy năm
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0') // Lấy tháng và thêm '0' nếu cần
    const day = dateObject.getDate().toString().padStart(2, '0') // Lấy ngày và thêm '0' nếu cần

    const formattedDate = `${year}/${month}/${day}`
    return formattedDate
}

export const formattedDate = (date) => {
    const newDate = date.toLocaleDateString('en-US', {
        // weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
    return newDate
}
export const isNonWorkingDay = (dateString, listDayOff) => {
    const dateParts = dateString.split(' ')

    const day = parseInt(dateParts[0], 10) // Lấy ngày (26)
    const month = dateParts[1] // Lấy tháng (Sep)
    const year = parseInt(dateParts[2], 10) // Lấy năm (2023)

    // Tạo một đối tượng Date từ ngày, tháng, năm
    const date = new Date(`${month} ${day}, ${year}`)

    const dayOfWeek = date.getDay() // 0 = Chủ Nhật, 6 = Thứ 7

    // Kiểm tra nếu ngày là ngày nghỉ dựa trên listDayOff
    const dayName = getDayName(dayOfWeek)
    return listDayOff[dayName.toLowerCase()]
}
// Hàm trợ giúp để lấy tên ngày dựa trên số thứ tự
export function getDayName(dayOfWeek) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayOfWeek]
}

export function getTimeAgo(dateTime) {
    const currentDate = new Date();
    const pastDate = new Date(dateTime);

    const timeDifference = currentDate - pastDate;
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const monthsDifference = Math.floor(daysDifference / 30.4167); // Average number of days in a month
    const yearsDifference = Math.floor(daysDifference / 365);

    if (yearsDifference > 0) {
        return `${yearsDifference} year${yearsDifference > 1 ? 's' : ''} ago`;
    } else if (monthsDifference > 0) {
        return `${monthsDifference} month${monthsDifference > 1 ? 's' : ''} ago`;
    } else if (daysDifference > 0) {
        return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    } else if (hoursDifference > 0) {
        return `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`;
    } else if (minutesDifference > 0) {
        return `${minutesDifference} minute${minutesDifference > 1 ? 's' : ''} ago`;
    } else {
        return `about a minute ago`;
    }
}
